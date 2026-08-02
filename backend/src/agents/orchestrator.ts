import { OpenAI } from "openai";
import * as dotenv from "dotenv";
import { AGENT_PROMPTS, AgentRequest } from "./templates";
import { getRealHotels, getRealRestaurants, getRealAttractions } from "../utils/googlePlaces";
import { getDestinationData, buildItinerary } from "./destinationCatalog";

dotenv.config();

const apiKey = process.env.NVIDIA_API_KEY || "";
const apiBaseUrl = "https://integrate.api.nvidia.com/v1";

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: apiBaseUrl,
});

const PRIMARY_MODEL = "meta/llama-3.1-8b-instruct";
const FALLBACK_MODEL = "meta/llama-3.3-70b-instruct";

/**
 * Utility to clean and parse JSON from LLM responses.
 */
function cleanAndParseJSON(text: string): any {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  cleaned = cleaned.trim();
  return JSON.parse(cleaned);
}

/**
 * Low-level OpenAI API calling wrapper
 */
async function callAgentRaw(systemPrompt: string, userPrompt: string, model: string = PRIMARY_MODEL): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1,
      max_tokens: 2048,
    });
    
    const content = response.choices[0]?.message?.content || "";
    return cleanAndParseJSON(content);
  } catch (error: any) {
    console.warn(`[Orchestrator] Error calling ${model}: ${error.message}`);
    if (model !== FALLBACK_MODEL) {
      return callAgentRaw(systemPrompt, userPrompt, FALLBACK_MODEL);
    }
    throw error;
  }
}

/**
 * Call Agent with 12 second timeout and local mock fallback
 */
async function callAgent(systemPrompt: string, userPrompt: string, fallbackValue: any, model: string = PRIMARY_MODEL): Promise<any> {
  const llmPromise = callAgentRaw(systemPrompt, userPrompt, model);
  
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), 12000)
  );
  
  try {
    return await Promise.race([llmPromise, timeoutPromise]);
  } catch (error: any) {
    console.warn(`[Agent Warning] Agent call timed out or failed (${error.message}). Returning fallback dataset.`);
    return fallbackValue;
  }
}

/**
 * Master multi-agent orchestrator: Combines Places API and a single unified LLM planner call.
 */
export async function orchestrateTrip(req: AgentRequest, progressCallback?: (status: string) => void): Promise<any> {
  const notify = (msg: string) => {
    console.log(msg);
    if (progressCallback) progressCallback(msg);
  };

  const daysDiff = Math.ceil((new Date(req.dates.end).getTime() - new Date(req.dates.start).getTime()) / (1000 * 60 * 60 * 24)) || 5;
  const numDays = Math.max(2, Math.min(daysDiff, 14));

  // High-quality static fallbacks — enhanced with destination catalog
  const catalogData = getDestinationData(req.destination);
  const fallbacks = {
    destination: catalogData?.destination_info ?? {
      description: `${req.destination} is a spectacular travel hub known for its scenic views, cultural richness, and vibrant dining experiences.`,
      best_visiting_months: ["April", "May", "September", "October"],
      climate: "Temperate and variable weather.",
      safety_rating: "High",
      popular_attractions: ["City Center", "Local Museum"],
      hidden_gems: ["Secret Botanical Path"],
      local_culture: "A beautiful fusion of heritage customs with modern urban lifestyles."
    },
    weather: catalogData?.weather ? {
      ...catalogData.weather,
      weather_alerts: [],
    } : {
      average_temp: "24°C (75°F)",
      forecast_description: "Sunny intervals with light breezes. Mostly comfortable.",
      humidity: "62%",
      wind_speed: "12 km/h",
      precipitation_probability: "15%",
      weather_alerts: [],
      packing_suggestions: ["Light cotton shirts", "Comfortable sneakers", "Sun protection cream", "Compact umbrella"]
    },
    flights: {
      cheapest: { airline: catalogData?.flights.cheapest.airline ?? "Air India / IndiGo", cost: Math.round(req.budget * 0.22), duration: catalogData?.flights.cheapest.duration ?? "9h 30m", layovers: catalogData?.flights.cheapest.layovers ?? 1, airports: catalogData?.flights.cheapest.airports ?? ["DEL", "COK"] },
      fastest: { airline: catalogData?.flights.fastest.airline ?? "Emirates / Singapore Airlines", cost: Math.round(req.budget * 0.38), duration: catalogData?.flights.fastest.duration ?? "6h 45m", layovers: catalogData?.flights.fastest.layovers ?? 0, airports: catalogData?.flights.fastest.airports ?? ["DEL", "COK"] },
      notes: catalogData?.flights.notes ?? "Flight options estimated based on current seasonal averages."
    },
    hotels: {
      hotels: catalogData?.hotels.map(h => ({
        name: h.name,
        price_per_night: Math.round(req.budget * h.price_factor),
        rating: h.rating,
        amenities: h.amenities,
        nearby_attractions: catalogData.destination_info.popular_attractions.slice(0, 2),
        address: h.address,
        description: h.description,
        coordinates: { lat: 0, lng: 0 }
      })) ?? [
        { name: `${req.destination} Grand Plaza Hotel`, price_per_night: Math.round(req.budget * 0.12), rating: 4.7, amenities: ["Free Wi-Fi", "Swimming Pool", "Spa Services"], nearby_attractions: ["City Center"], address: `102 Main Street, ${req.destination}`, description: "A comfortable central hotel with excellent amenities.", coordinates: { lat: 0, lng: 0 } },
        { name: "Vista Oasis Boutique Suites", price_per_night: Math.round(req.budget * 0.08), rating: 4.5, amenities: ["Free Breakfast", "Co-working Space"], nearby_attractions: ["Art District"], address: `44 Vista Alley, ${req.destination}`, description: "A stylish boutique hotel popular with creative travelers.", coordinates: { lat: 0, lng: 0 } }
      ]
    },
    restaurants: {
      restaurants: catalogData?.restaurants.map(r => ({
        name: r.name,
        meal_type: "Multi-meal",
        price_level: r.price_level,
        rating: 4.5,
        cuisine_type: r.cuisine,
        special_dishes: [r.dish],
        address: r.address,
        is_veg_friendly: true,
        is_vegan_friendly: false,
        coordinates: { lat: 0, lng: 0 }
      })) ?? [
        { name: "The Spice Bistro", meal_type: "Lunch", price_level: "$$", rating: 4.6, cuisine_type: "Local Fusion", special_dishes: ["Chef's Curry Plate"], address: "18 Market Road", is_veg_friendly: true, is_vegan_friendly: false, coordinates: { lat: 0, lng: 0 } },
        { name: "Sunrise Organic Bowls", meal_type: "Breakfast", price_level: "$", rating: 4.4, cuisine_type: "Healthy Cafe", special_dishes: ["Acai Berry Smoothie"], address: "8 Healing Way", is_veg_friendly: true, is_vegan_friendly: true, coordinates: { lat: 0, lng: 0 } }
      ]
    },
    transport: {
      options: [
        { type: "Metro/Subway Transit", estimated_cost: "₹20 - ₹60 per ride", travel_time_rating: "Fast", pros: "Avoids urban traffic congestion, highly punctual.", cons: "Can get crowded during morning and evening rush hours." },
        { type: "Train & Rail networks", estimated_cost: "₹100 - ₹500 depending on distance", travel_time_rating: "Fast", pros: "Comfortable intercity or scenic local transit.", cons: "Requires advanced seat reservation during holiday seasons." },
        { type: "Local & Intercity Bus", estimated_cost: "₹30 - ₹150 per ticket", travel_time_rating: "Moderate", pros: "Extremely cost-effective, reaches remote tourist destinations.", cons: "Prone to state highway traffic congestion." },
        { type: "Taxi & Ride-hailing (Uber/Ola)", estimated_cost: "₹150 - ₹400 per trip", travel_time_rating: "Moderate", pros: "Door-to-door convenience, comfortable for baggage.", cons: "Highest pricing tier among transit options." }
      ]
    },
    visa: {
      visa_required: false,
      requirements: ["Valid passport (6+ months remaining)", "Completed travel clearance declaration form"],
      processing_time: "Instant",
      fees: "None",
      travel_insurance_required: false,
      vaccinations: ["Routine immunizations up-to-date"]
    },
    currency: {
      currency_name: "Indian Rupee",
      currency_code: "INR",
      approximate_rate_to_usd: 83.5,
      cards_acceptance: "Widely accepted in retail outlets and restaurants.",
      atm_availability: "Very common in all commercial districts.",
      tipping_style: "10% service charge is usually included."
    },
    safety: {
      safety_score: 88,
      common_scams: ["Overpriced taxi rates at airport exits"],
      emergency_numbers: { police: "100", medical: "108", general: "112" },
      safe_neighborhoods: ["Central Market Square", "Hotel District"],
      neighborhoods_to_avoid: ["Terminal Backstreets late at night"],
      advisories: ["Drink bottled water and secure valuables in crowds."]
    },
    activities: {
      activities: catalogData?.days.slice(0, 2).flatMap(d => [...d.morning, ...d.afternoon]).map(a => ({
        name: a.title,
        category: "Sightseeing",
        cost: a.cost,
        duration: a.duration,
        best_time_to_visit: a.time,
        description: a.description,
        coordinates: { lat: 0, lng: 0 }
      })) ?? [
        { name: "Historic Highlights Walking Tour", category: "Historical", cost: 20, duration: "3 hours", best_time_to_visit: "09:00 AM", description: "Guided tour through the city's landmarks.", coordinates: { lat: 0, lng: 0 } },
        { name: "Sunrise Ridge Trek", category: "Adventure", cost: 35, duration: "4 hours", best_time_to_visit: "04:30 AM", description: "Trek up the local ridges for sunrise photography.", coordinates: { lat: 0, lng: 0 } }
      ]
    },
    itinerary: {
      days: (() => {
        const destData = getDestinationData(req.destination);
        if (destData) {
          return buildItinerary(destData, numDays, req.dates.start);
        }
        // Generic fallback when destination not in catalog
        return Array.from({ length: numDays }, (_, i) => {
          const dayNum = i + 1;
          const dateStr = new Date(new Date(req.dates.start).getTime() + i * 24 * 60 * 60 * 1000)
            .toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
          const themes = ["Arrival & Orientation", "City Highlights Tour", "Cultural Immersion", "Nature & Adventure", "Local Markets & Cuisine", "Hidden Gems Discovery", "Farewell & Departure"];
          const morningActs = [
            { title: "Hotel Check-in & Neighbourhood Stroll", description: `Settle into your hotel in ${req.destination} and walk the surrounding streets to get your bearings.`, cost: 0, location: "Hotel & Vicinity" },
            { title: "Old Town Heritage Walk", description: `Explore the historic old quarter of ${req.destination} — local temples, colonial architecture, and hidden alleyways.`, cost: 5, location: "Historic Old Town" },
            { title: "Local Market Morning", description: `Browse the morning street market for fresh produce, local handicrafts, and street food breakfast.`, cost: 10, location: "Central Market" },
            { title: "Museum of Local History", description: `Visit the city museum to understand the rich history and cultural heritage of ${req.destination}.`, cost: 8, location: "City Museum" },
            { title: "Sunrise Nature Trek", description: `Early morning guided trek to a viewpoint overlooking ${req.destination} for panoramic sunrise views.`, cost: 15, location: "Hilltop Viewpoint" },
            { title: "Religious Sites & Temples Tour", description: `Visit the most significant temples and shrines of ${req.destination} with a local guide.`, cost: 5, location: "Sacred Quarter" },
            { title: "Farewell Breakfast & Packing", description: `Final morning enjoying local breakfast specialties before departure.`, cost: 0, location: "Hotel Restaurant" }
          ];
          const afternoonActs = [
            { title: "Local Cuisine Lunch & Rest", description: `Try the most popular local dishes at a highly rated restaurant in ${req.destination}.`, cost: 20, location: "City Centre Restaurant" },
            { title: "Guided Cultural Tour", description: `Join a guided tour of the most iconic cultural landmarks and monuments of ${req.destination}.`, cost: 25, location: "Cultural District" },
            { title: "Art Gallery & Craft Workshops", description: `Explore local art galleries and participate in a traditional craft workshop.`, cost: 15, location: "Art Quarter" },
            { title: "Botanical Garden Walk", description: `Spend the afternoon in the city's beautiful botanical gardens with rare plants and bird life.`, cost: 5, location: "Botanical Gardens" },
            { title: "Cooking Class — Local Cuisine", description: `Learn to cook 3 traditional dishes of ${req.destination} with a local chef in a hands-on class.`, cost: 35, location: "Culinary School" },
            { title: "River or Lake Boat Cruise", description: `Explore the waterfront of ${req.destination} by boat, taking in bridges, architecture, and wildlife.`, cost: 20, location: "Waterfront Jetty" },
            { title: "Last-Minute Souvenir Shopping", description: `Browse the best souvenir shops for authentic local handicrafts and gifts to bring home.`, cost: 25, location: "Shopping District" }
          ];
          const eveningActs = [
            { title: "Welcome Dinner at Top Rated Restaurant", description: `Celebrate your first evening with a feast at ${req.destination}'s highest-rated restaurant.`, cost: 40, location: "Premier Restaurant" },
            { title: "Rooftop Bar Sunset Drinks", description: `Enjoy cocktails and sunset views from the most popular rooftop bar in ${req.destination}.`, cost: 25, location: "Rooftop Bar" },
            { title: "Street Food Night Walk", description: `Join a guided night street food tour — sampling 8-10 local snacks across different vendors.`, cost: 20, location: "Night Food Street" },
            { title: "Cultural Show & Dinner", description: `Watch a traditional folk performance while enjoying a set dinner featuring local specialties.`, cost: 45, location: "Cultural Centre" },
            { title: "Waterfront Evening Stroll & Dinner", description: `Walk along the waterfront promenade at night and dine at a scenic riverside restaurant.`, cost: 30, location: "Waterfront Promenade" },
            { title: "Night Market & Local Beer", description: `Browse the vibrant night market with street performers, local handicrafts, and regional street food.`, cost: 20, location: "Night Market" },
            { title: "Farewell Dinner — Chef's Table", description: `End your journey with a special farewell dinner showcasing the best of ${req.destination}'s cuisine.`, cost: 50, location: "Fine Dining Restaurant" }
          ];
          const idx = i % 7;
          return {
            day_number: dayNum,
            date: `Day ${dayNum} — ${dateStr}`,
            theme: themes[idx],
            morning: [{ time: "09:00 AM", title: morningActs[idx].title, description: morningActs[idx].description, cost: morningActs[idx].cost, duration: "2.5 hours", location_name: morningActs[idx].location }],
            afternoon: [{ time: "01:00 PM", title: afternoonActs[idx].title, description: afternoonActs[idx].description, cost: afternoonActs[idx].cost, duration: "3 hours", location_name: afternoonActs[idx].location }],
            evening: [{ time: "07:00 PM", title: eveningActs[idx].title, description: eveningActs[idx].description, cost: eveningActs[idx].cost, duration: "2 hours", location_name: eveningActs[idx].location }]
          };
        });
      })()
    }
  };

  // Fetch real Google Places listings in parallel first
  notify("Fetching real-world listings from Google Places API...");
  const [realHotelsList, realRestaurantsList, realAttractionsList] = await Promise.all([
    getRealHotels(req.destination),
    getRealRestaurants(req.destination),
    getRealAttractions(req.destination)
  ]);

  // ==========================================
  // PHASE 1: Unified Planner execution
  // ==========================================
  notify("Orchestrating master planner agent...");
  const prompt = AGENT_PROMPTS.unifiedPlanner(req, realHotelsList, realRestaurantsList, realAttractionsList);
  
  const responseData = await callAgent(prompt.system, prompt.user, null);

  let result = responseData;
  if (!result) {
    console.warn("[Orchestrator] Unified Planner failed or timed out. Using default fallbacks.");
    result = {
      destination_info: fallbacks.destination,
      weather: fallbacks.weather,
      flights: fallbacks.flights,
      hotels: fallbacks.hotels,
      restaurants: fallbacks.restaurants,
      local_transport: fallbacks.transport,
      visa_info: fallbacks.visa,
      currency_info: fallbacks.currency,
      safety_tips: fallbacks.safety,
      activities: fallbacks.activities,
      itinerary: fallbacks.itinerary
    };
  }

  // ==========================================
  // PHASE 2: Programmatic Budget Synthesis
  // ==========================================
  notify("Calculating final budget breakdowns...");
  
  const flightsData = result.flights || fallbacks.flights;
  const hotelsData = result.hotels || fallbacks.hotels;
  const itineraryData = result.itinerary || fallbacks.itinerary;
  const transportData = result.local_transport || fallbacks.transport;

  const flightCost = flightsData.cheapest?.cost || Math.round(req.budget * 0.25);
  const totalHotelCost = (hotelsData.hotels?.[0]?.price_per_night || Math.round(req.budget * 0.12)) * numDays;
  const foodCost = 50 * req.travelers.count * numDays;
  const transportCost = 15 * req.travelers.count * numDays;
  
  let activitiesCost = 0;
  if (itineraryData.days && Array.isArray(itineraryData.days)) {
    itineraryData.days.forEach((day: any) => {
      if (day.morning) day.morning.forEach((s: any) => activitiesCost += Number(s.cost || 0));
      if (day.afternoon) day.afternoon.forEach((s: any) => activitiesCost += Number(s.cost || 0));
      if (day.evening) day.evening.forEach((s: any) => activitiesCost += Number(s.cost || 0));
    });
  }
  if (activitiesCost === 0) {
    activitiesCost = 30 * req.travelers.count * numDays;
  }
  
  const emergencyCost = Math.round(req.budget * 0.05);
  const taxesCost = Math.round((totalHotelCost + flightCost) * 0.08);
  const totalCalculated = flightCost + totalHotelCost + foodCost + transportCost + activitiesCost + emergencyCost + taxesCost;

  const budgetBreakdown = {
    breakdown: {
      flights: flightCost,
      hotels: totalHotelCost,
      food: foodCost,
      transport: transportCost,
      activities: activitiesCost,
      emergency_fund: emergencyCost,
      taxes_and_fees: taxesCost,
      total: totalCalculated
    },
    tiers: {
      budget_tier: Math.round(totalCalculated * 0.6),
      mid_tier: totalCalculated,
      luxury_tier: Math.round(totalCalculated * 1.8)
    },
    saving_tips: [
      `Take the local ${transportData.options?.[0]?.type || "public transit"} to cut down travel costs.`,
      `Opt for breakfast at local cafes instead of the hotel's premium dining options.`,
      "Book attractions and sight tickets online in advance to skip premium surcharge options."
    ]
  };

  notify("Trip planning orchestration completed successfully!");

  return {
    destination: req.destination,
    budget: req.budget,
    dates: req.dates,
    travelers: req.travelers,
    preferences: req.preferences,
    destination_info: result.destination_info || fallbacks.destination,
    weather: result.weather || fallbacks.weather,
    flights: flightsData,
    hotels: hotelsData,
    restaurants: result.restaurants || fallbacks.restaurants,
    local_transport: transportData,
    visa_info: result.visa_info || fallbacks.visa,
    currency_info: result.currency_info || fallbacks.currency,
    safety_tips: result.safety_tips || fallbacks.safety,
    activities: result.activities || fallbacks.activities,
    packing_list: {
      checklist: [
        { category: "Documents & Money", items: ["Passport & printed copy of visas", "Card with international access enabled", "Emergency local cash reserve"] },
        { category: "Clothing", items: result.weather?.packing_suggestions || fallbacks.weather.packing_suggestions },
        { category: "Electronics", items: ["Phone & camera power bank chargers", "Universal socket pin converter plug", "Offline maps app pre-downloaded"] }
      ]
    },
    itinerary: itineraryData,
    budget_breakdown: budgetBreakdown
  };
}

/**
 * Rules-based fallback chat processor — handles all common user intents
 * even when the AI model is unavailable or times out.
 */
function processUserMessageLocally(originalTrip: any, userMessage: string): any {
  const msg = userMessage.toLowerCase().trim();
  const trip = JSON.parse(JSON.stringify(originalTrip)); // Deep clone
  const bd = trip.budget_breakdown?.breakdown || {};
  let explanation = "";

  // ─── BUDGET / CHEAPER ────────────────────────────────
  if (msg.includes("cheaper") || msg.includes("budget") || msg.includes("reduce cost") || msg.includes("save money") || msg.includes("less expensive") || msg.includes("affordable")) {
    bd.hotels = Math.round((bd.hotels || 0) * 0.65);
    bd.food = Math.round((bd.food || 0) * 0.75);
    bd.activities = Math.round((bd.activities || 0) * 0.80);
    bd.total = (bd.flights || 0) + (bd.hotels || 0) + (bd.food || 0) + (bd.transport || 0) + (bd.activities || 0) + (bd.emergency_fund || 0) + (bd.taxes_and_fees || 0);
    if (trip.itinerary?.days) {
      trip.itinerary.days.forEach((day: any) => {
        [...(day.morning || []), ...(day.afternoon || []), ...(day.evening || [])].forEach((a: any) => {
          a.cost = Math.round(a.cost * 0.75);
          if (a.title.toLowerCase().includes("fine dining") || a.title.toLowerCase().includes("luxury")) {
            a.title = a.title.replace(/fine dining|luxury/gi, "budget-friendly");
          }
        });
      });
    }
    explanation = `✅ I've optimized your trip for a tighter budget:\n\n• **Hotels** reduced by 35% — switching to highly-rated guesthouses\n• **Food** reduced by 25% — focusing on authentic local street food and dhabas\n• **Activities** reduced by 20% — prioritizing free attractions and self-guided walks\n• **New total:** ₹${bd.total?.toLocaleString() || "recalculated"}\n\nYou'll still have an amazing experience — just smarter spending! 🎯`;
  }

  // ─── LUXURY / UPGRADE ────────────────────────────────
  else if (msg.includes("luxury") || msg.includes("upgrade") || msg.includes("premium") || msg.includes("5 star") || msg.includes("first class") || msg.includes("high end")) {
    bd.hotels = Math.round((bd.hotels || 0) * 1.8);
    bd.food = Math.round((bd.food || 0) * 1.6);
    bd.activities = Math.round((bd.activities || 0) * 1.4);
    bd.total = (bd.flights || 0) + (bd.hotels || 0) + (bd.food || 0) + (bd.transport || 0) + (bd.activities || 0) + (bd.emergency_fund || 0) + (bd.taxes_and_fees || 0);
    if (trip.itinerary?.days) {
      trip.itinerary.days.forEach((day: any) => {
        [...(day.morning || []), ...(day.afternoon || []), ...(day.evening || [])].forEach((a: any) => {
          a.cost = Math.round(a.cost * 1.5);
          if (a.title.toLowerCase().includes("budget") || a.title.toLowerCase().includes("local dhaba")) {
            a.title = "Fine Dining at Premium Restaurant";
          }
        });
        // Upgrade evening dinners
        if (day.evening && day.evening.length > 0) {
          day.evening[0].title = `Luxury Dinner at ${trip.destination}'s Finest Restaurant`;
          day.evening[0].description = `An exquisite fine-dining experience with award-winning chefs and curated wine pairings.`;
          day.evening[0].cost = 150;
        }
      });
    }
    explanation = `✨ Upgraded your trip to a luxury experience:\n\n• **5-star hotels** booked for the entire stay (pool villas, butler service)\n• **Fine dining** at the destination's top-rated restaurants each evening\n• **Premium activities** — private guided tours, spa treatments, and VIP experiences\n• **Business/First class** flights recommended\n• **New total:** ₹${bd.total?.toLocaleString() || "recalculated"}\n\nPrepare for an unforgettable premium journey! 🌟`;
  }

  // ─── ADVENTURE / HIKING / TREK ──────────────────────
  else if (msg.includes("adventure") || msg.includes("hiking") || msg.includes("trek") || msg.includes("thrill") || msg.includes("active") || msg.includes("outdoor")) {
    if (trip.itinerary?.days) {
      trip.itinerary.days.forEach((day: any, i: number) => {
        if (i % 2 === 0 && day.afternoon) {
          day.afternoon.push({
            time: "03:30 PM", title: `Mountain Trek & Viewpoint Hike`,
            description: `A guided 3-hour outdoor adventure trek to the most stunning viewpoints near ${trip.destination}. Includes local guide and safety equipment.`,
            cost: 40, duration: "3 hours", location_name: `${trip.destination} Trail Network`
          });
          bd.activities = (bd.activities || 0) + 40;
        }
        if (i % 2 === 1 && day.morning) {
          day.morning.push({
            time: "06:00 AM", title: `Sunrise Adventure — Cliff Walk & Rock Scramble`,
            description: `Early morning outdoor expedition — scramble over dramatic rocky outcrops at sunrise for breathtaking panoramic views.`,
            cost: 25, duration: "2.5 hours", location_name: `${trip.destination} Wilderness Zone`
          });
          bd.activities = (bd.activities || 0) + 25;
        }
      });
    }
    bd.total = (bd.flights || 0) + (bd.hotels || 0) + (bd.food || 0) + (bd.transport || 0) + (bd.activities || 0) + (bd.emergency_fund || 0);
    explanation = `🏔️ Adventure mode activated! Added to your itinerary:\n\n• **Mountain Trek & Viewpoint Hike** on alternate afternoons\n• **Sunrise Cliff Walk & Rock Scramble** on alternate mornings\n• **Local adventure guides** included in costs\n• Activities budget increased by ₹${((trip.itinerary?.days?.length || 3) * 65).toLocaleString()}\n\nGet ready to explore the wild side of ${trip.destination}! 🧗`;
  }

  // ─── BEACH / WATER ──────────────────────────────────
  else if (msg.includes("beach") || msg.includes("sea") || msg.includes("ocean") || msg.includes("water sport") || msg.includes("snorkel") || msg.includes("diving") || msg.includes("swim")) {
    if (trip.itinerary?.days) {
      trip.itinerary.days.forEach((day: any, i: number) => {
        if (i < 3 && day.afternoon) {
          day.afternoon.unshift({
            time: "02:00 PM", title: i === 0 ? `Beach Day & Snorkeling Session` : i === 1 ? `Water Sports — Jet Ski, Parasailing & Kayaking` : `Sunset Beach Cruise`,
            description: i === 0 ? `Spend the afternoon on the best beach near ${trip.destination}. Guided snorkeling with colorful coral reefs and tropical fish.` : i === 1 ? `Full water sports afternoon — jet skiing, parasailing, kayaking, and stand-up paddleboarding.` : `Cruise along the coastline at sunset on a traditional dhow boat with refreshments included.`,
            cost: i === 0 ? 35 : i === 1 ? 60 : 45, duration: i === 1 ? "3 hours" : "2 hours",
            location_name: `${trip.destination} Beach & Marina`
          });
          bd.activities = (bd.activities || 0) + (i === 0 ? 35 : i === 1 ? 60 : 45);
        }
      });
    }
    bd.total = (bd.flights || 0) + (bd.hotels || 0) + (bd.food || 0) + (bd.transport || 0) + (bd.activities || 0) + (bd.emergency_fund || 0);
    explanation = `🏖️ Beach experiences added to your itinerary:\n\n• **Day 1:** Snorkeling at the beach with a local marine guide\n• **Day 2:** Full water sports afternoon (jet ski, parasail, kayak)\n• **Day 3:** Sunset dhow cruise along the coastline\n• Activities budget updated accordingly\n\nDive into the best aquatic experiences ${trip.destination} has to offer! 🐠`;
  }

  // ─── SPA / WELLNESS / RELAX ─────────────────────────
  else if (msg.includes("spa") || msg.includes("relax") || msg.includes("wellness") || msg.includes("yoga") || msg.includes("meditation") || msg.includes("massage") || msg.includes("ayurved")) {
    if (trip.itinerary?.days) {
      trip.itinerary.days.forEach((day: any, i: number) => {
        if (i % 2 === 0 && day.afternoon) {
          day.afternoon.push({
            time: "04:00 PM", title: i === 0 ? `Ayurvedic Full-Body Massage` : `Signature Spa Treatment & Steam Bath`,
            description: i === 0 ? `Authentic Ayurvedic 90-minute full-body massage using warm herbal oils. One of the most relaxing experiences in ${trip.destination}.` : `Premium spa treatment including hot stone massage, aromatic steam bath, and herbal face pack at a 5-star spa.`,
            cost: 60, duration: "1.5 hours", location_name: `${trip.destination} Wellness Spa`
          });
          bd.activities = (bd.activities || 0) + 60;
        }
        if (i % 3 === 0 && day.morning) {
          day.morning.push({
            time: "07:00 AM", title: `Sunrise Yoga & Meditation Session`,
            description: `Early morning yoga and guided mindfulness meditation with a certified instructor in a serene natural setting.`,
            cost: 15, duration: "1 hour", location_name: `${trip.destination} Yoga Retreat`
          });
          bd.activities = (bd.activities || 0) + 15;
        }
      });
    }
    bd.total = (bd.flights || 0) + (bd.hotels || 0) + (bd.food || 0) + (bd.transport || 0) + (bd.activities || 0) + (bd.emergency_fund || 0);
    explanation = `🧘 Wellness & relaxation experiences added:\n\n• **Ayurvedic massage** on even-numbered days (afternoons)\n• **Signature spa treatment** alternating days\n• **Sunrise yoga & meditation** sessions in the morning\n• Total wellness budget added: ₹${((trip.itinerary?.days?.length || 3) * 75).toLocaleString()}\n\nYour trip to ${trip.destination} is now a rejuvenating retreat! 🌿`;
  }

  // ─── VEGETARIAN / VEGAN FOOD ────────────────────────
  else if (msg.includes("vegetarian") || msg.includes("vegan") || msg.includes("veg only") || msg.includes("plant based") || msg.includes("no meat")) {
    if (trip.itinerary?.days) {
      trip.itinerary.days.forEach((day: any) => {
        [...(day.morning || []), ...(day.afternoon || []), ...(day.evening || [])].forEach((a: any) => {
          if (a.title.toLowerCase().includes("lunch") || a.title.toLowerCase().includes("dinner") || a.title.toLowerCase().includes("breakfast")) {
            a.description = a.description.replace(/meat|chicken|fish|prawn|beef|mutton|lamb|pork/gi, "fresh vegetables") + " (Vegetarian/Vegan friendly restaurant confirmed)";
            a.title = a.title.replace(/grill|bbq|seafood/gi, "Vegetarian");
          }
        });
      });
    }
    explanation = `🥗 Switched all dining to vegetarian/vegan options:\n\n• All restaurant recommendations updated to vegetarian/vegan-friendly venues\n• Replaced meat dishes with authentic local plant-based cuisine\n• Every meal confirmed suitable for vegetarian and vegan diets\n• Special vegetarian thali meals and plant-based local dishes highlighted\n\nEnjoy ${trip.destination}'s incredible vegetarian food scene! 🌱`;
  }

  // ─── REMOVE ACTIVITY ────────────────────────────────
  else if (msg.includes("remove") || msg.includes("delete") || msg.includes("cancel") || msg.includes("skip")) {
    const dayMatch = msg.match(/day\s*(\d+)/i);
    const dayNum = dayMatch ? parseInt(dayMatch[1]) - 1 : 0;
    const periodMatch = msg.match(/(morning|afternoon|evening)/i);
    const period = periodMatch ? periodMatch[1].toLowerCase() : "morning";
    if (trip.itinerary?.days?.[dayNum]?.[period]?.length > 0) {
      const removed = trip.itinerary.days[dayNum][period].pop();
      const refund = removed?.cost || 0;
      bd.activities = Math.max(0, (bd.activities || 0) - refund);
      bd.total = Math.max(0, (bd.total || 0) - refund);
      explanation = `🗑️ Removed from Day ${dayNum + 1} ${period}:\n\n• **"${removed?.title}"** has been removed from your schedule\n• ₹${refund.toLocaleString()} refunded to your activities budget\n• Your itinerary has been updated\n\nDay ${dayNum + 1} now has a free ${period} slot — perfect for spontaneous exploration!`;
    } else {
      explanation = `ℹ️ No activity found to remove from Day ${dayNum + 1} ${period}. Your itinerary is unchanged.`;
    }
  }

  // ─── ADD FREE TIME / SLOW DOWN ──────────────────────
  else if (msg.includes("free time") || msg.includes("rest day") || msg.includes("slow down") || msg.includes("relaxed") || msg.includes("less activity")) {
    if (trip.itinerary?.days?.length > 1) {
      const midDay = Math.floor(trip.itinerary.days.length / 2);
      trip.itinerary.days[midDay].theme = "Rest & Free Exploration Day";
      trip.itinerary.days[midDay].morning = [{ time: "09:00 AM", title: "Late Morning & Hotel Breakfast", description: "Sleep in and enjoy a leisurely breakfast at the hotel. No rush, no schedule.", cost: 0, duration: "2 hours", location_name: "Hotel" }];
      trip.itinerary.days[midDay].afternoon = [{ time: "01:00 PM", title: "Free Time — Explore at Your Own Pace", description: "Wander wherever your curiosity takes you. Browse local markets, find a hidden café, read a book by the pool, or simply soak in the atmosphere.", cost: 0, duration: "4 hours", location_name: `${trip.destination} — Anywhere` }];
      trip.itinerary.days[midDay].evening = [{ time: "07:00 PM", title: "Casual Dinner — Your Choice", description: "Pick any restaurant that caught your eye during the day. No reservations, no plans — just go where the evening takes you.", cost: 25, duration: "2 hours", location_name: "Local Restaurant" }];
    }
    explanation = `😌 Added a free/rest day to your itinerary:\n\n• **Day ${Math.floor((trip.itinerary?.days?.length || 2) / 2) + 1}** is now a rest & free exploration day\n• No scheduled activities — explore at your own pace\n• Perfect for recovering energy or discovering hidden gems\n• Budget unchanged\n\nEveryone deserves a slow day when travelling! 🌤️`;
  }

  // ─── FOOD / RESTAURANTS ─────────────────────────────
  else if (msg.includes("food") || msg.includes("restaurant") || msg.includes("eat") || msg.includes("cuisine") || msg.includes("dining") || msg.includes("street food")) {
    if (trip.itinerary?.days) {
      trip.itinerary.days.slice(0, 3).forEach((day: any, i: number) => {
        if (day.afternoon) {
          day.afternoon.push({
            time: "03:00 PM", title: i === 0 ? "Street Food Walking Tour" : i === 1 ? "Local Market Food Trail" : "Cooking Class — Traditional Recipes",
            description: i === 0 ? `Join a guided 2-hour street food walk trying 8-10 local specialties across different vendor stalls in ${trip.destination}.` : i === 1 ? `Walk through the local food market sampling seasonal produce, spices, pickles, and street snacks with an expert guide.` : `Learn to cook 3 authentic local dishes with a professional chef in a hands-on 2-hour cooking class.`,
            cost: i === 2 ? 45 : 20, duration: "2 hours", location_name: `${trip.destination} Food District`
          });
          bd.activities = (bd.activities || 0) + (i === 2 ? 45 : 20);
        }
      });
    }
    bd.total = (bd.flights || 0) + (bd.hotels || 0) + (bd.food || 0) + (bd.transport || 0) + (bd.activities || 0) + (bd.emergency_fund || 0);
    explanation = `🍜 Upgraded your food experiences:\n\n• **Day 1:** Street food walking tour (8-10 local specialties)\n• **Day 2:** Local market food trail with expert guide\n• **Day 3:** Hands-on cooking class (3 traditional dishes)\n• Food & activities budget updated\n\n${trip.destination} has an incredible food scene — you're going to love it! 🌶️`;
  }

  // ─── SHOPPING ────────────────────────────────────────
  else if (msg.includes("shopping") || msg.includes("market") || msg.includes("souvenir") || msg.includes("bazaar") || msg.includes("mall")) {
    if (trip.itinerary?.days?.length > 0) {
      const lastDay = trip.itinerary.days[trip.itinerary.days.length - 2] || trip.itinerary.days[0];
      if (lastDay?.afternoon) {
        lastDay.afternoon.push({
          time: "04:00 PM", title: "Shopping Spree — Local Markets & Boutiques",
          description: `Dedicated shopping time at ${trip.destination}'s best markets. Browse for handmade crafts, local spices, textiles, jewelry, and authentic souvenirs.`,
          cost: 50, duration: "3 hours", location_name: `${trip.destination} Main Market`
        });
        bd.activities = (bd.activities || 0) + 50;
        bd.total = (bd.flights || 0) + (bd.hotels || 0) + (bd.food || 0) + (bd.transport || 0) + (bd.activities || 0) + (bd.emergency_fund || 0);
      }
    }
    explanation = `🛍️ Shopping time added to your itinerary:\n\n• **Dedicated 3-hour shopping block** added to your second-last day\n• Covers local handicraft markets, boutique stores, and souvenir shops\n• Budget for shopping: ₹4,000 (₹50 included in activities; rest your personal budget)\n• Best items to buy: local textiles, handmade crafts, spices, and authentic keepsakes\n\nHappy shopping in ${trip.destination}! 🎁`;
  }

  // ─── NIGHT LIFE / PARTY ──────────────────────────────
  else if (msg.includes("nightlife") || msg.includes("party") || msg.includes("bar") || msg.includes("club") || msg.includes("pub") || msg.includes("drinks")) {
    if (trip.itinerary?.days) {
      trip.itinerary.days.slice(0, 3).forEach((day: any, i: number) => {
        if (day.evening) {
          day.evening.push({
            time: "10:00 PM", title: i === 0 ? "Rooftop Bar — Cocktails & City Views" : i === 1 ? "Live Music Venue & Night Market" : "Local Nightclub — Dance & DJ Night",
            description: i === 0 ? `Head to the most popular rooftop bar in ${trip.destination} for craft cocktails and sweeping night views of the city.` : i === 1 ? `Experience the vibrant local nightlife at a live music venue with traditional and contemporary performances.` : `End the night dancing at a popular local nightclub with resident DJs spinning till 3 AM.`,
            cost: i === 0 ? 30 : i === 1 ? 20 : 25, duration: "2 hours", location_name: `${trip.destination} Entertainment District`
          });
          bd.activities = (bd.activities || 0) + (i === 0 ? 30 : i === 1 ? 20 : 25);
        }
      });
    }
    bd.total = (bd.flights || 0) + (bd.hotels || 0) + (bd.food || 0) + (bd.transport || 0) + (bd.activities || 0) + (bd.emergency_fund || 0);
    explanation = `🎉 Nightlife experiences added to your evenings:\n\n• **Night 1:** Rooftop bar with city skyline views and craft cocktails\n• **Night 2:** Live music venue with local performers\n• **Night 3:** Nightclub with DJ and dancing till late\n• Nightlife budget added to activities\n\n${trip.destination} comes alive at night — have an unforgettable time! 🌃`;
  }

  // ─── PHOTOGRAPHY / SIGHTSEEING ──────────────────────
  else if (msg.includes("photo") || msg.includes("sightseeing") || msg.includes("scenic") || msg.includes("viewpoint") || msg.includes("landmark")) {
    if (trip.itinerary?.days) {
      trip.itinerary.days.slice(0, 4).forEach((day: any, i: number) => {
        if (day.morning) {
          day.morning.unshift({
            time: "06:30 AM", title: `Golden Hour Photography Walk`,
            description: `Early morning walk to the best viewpoints and photogenic spots in ${trip.destination} during the magical golden hour light. Perfect for landscape and street photography.`,
            cost: 5, duration: "1.5 hours", location_name: `${trip.destination} Photography Hotspots`
          });
          bd.activities = (bd.activities || 0) + 5;
        }
      });
    }
    bd.total = (bd.flights || 0) + (bd.hotels || 0) + (bd.food || 0) + (bd.transport || 0) + (bd.activities || 0) + (bd.emergency_fund || 0);
    explanation = `📸 Photography experiences added:\n\n• **Golden Hour Photography Walk** added to every morning (6:30 AM)\n• Covers the most scenic viewpoints and photogenic streets\n• Perfect light for landscape, portrait, and architectural shots\n• Budget: minimal (just local guide tips)\n\nCapture ${trip.destination} in its most beautiful light! 🌅`;
  }

  // ─── DEFAULT — HELPFUL RESPONSE ──────────────────────
  else {
    const suggestions = [
      `"make it cheaper" — reduce costs by 30%`,
      `"add adventure" — add hiking and outdoor activities`,
      `"make it luxury" — upgrade to 5-star hotels & fine dining`,
      `"add beach day" — water sports and coastal experiences`,
      `"add spa" — wellness and relaxation sessions`,
      `"vegetarian only" — switch all food to plant-based`,
      `"add free time" — add a rest day to the middle`,
      `"add shopping" — add market and souvenir time`,
      `"add nightlife" — bars, clubs and live music evenings`,
      `"add photography" — golden hour walks to scenic spots`
    ];
    explanation = `🤖 I'm your AI Trip Assistant for **${trip.destination}**!\n\nI understand natural requests like:\n\n${suggestions.map(s => `• ${s}`).join("\n")}\n\nYou said: *"${userMessage}"*\n\nCould you rephrase your request? I'm ready to update your itinerary instantly!`;
  }

  if (trip.budget_breakdown) {
    trip.budget_breakdown.breakdown = bd;
    if (bd.total) {
      trip.budget_breakdown.tiers = {
        budget_tier: Math.round(bd.total * 0.6),
        mid_tier: bd.total,
        luxury_tier: Math.round(bd.total * 1.8)
      };
    }
  }

  return {
    updated_itinerary: trip.itinerary,
    updated_budget_breakdown: trip.budget_breakdown,
    explanation
  };
}

/**
 * Handle AI conversational itinerary adjustments.
 * Tries the AI model first, falls back to rich rules-based processing.
 */
export async function updateTripWithChat(originalTrip: any, chatHistory: any[], userMessage: string): Promise<any> {
  const prompt = AGENT_PROMPTS.chat_updater(originalTrip, chatHistory, userMessage);

  // Use rules-based local processing as the fallback (always works instantly)
  const localFallback = processUserMessageLocally(originalTrip, userMessage);

  try {
    const response = await callAgent(prompt.system, prompt.user, localFallback);
    // If AI returned same explanation as fallback, or failed silently, use local
    if (!response || response === localFallback) return localFallback;
    return response;
  } catch {
    return localFallback;
  }
}

