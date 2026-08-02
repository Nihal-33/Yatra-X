// Mock Data Generator for Frontend Fallback & Offline Mode

export function generateMockTripData(destination: string, budget: number, dates: { start: string; end: string }, travelers: number, style: string, interests: string[]) {
  const daysDiff = Math.ceil((new Date(dates.end).getTime() - new Date(dates.start).getTime()) / (1000 * 60 * 60 * 24)) || 5;
  const numDays = Math.max(2, Math.min(daysDiff, 14));

  const attractions = [
    "Historic Old Town", "Panoramic Mountain Viewpoint", "Local Food Market", 
    "Modern Art Gallery", "Scenic Coastal Walk", "Royal Palace Museum", 
    "Botanical Gardens", "Hidden Bamboo Forest", "Seaside Cliff Café"
  ];

  const filteredAttractions = attractions.slice(0, Math.min(interests.length + 3, attractions.length));
  
  // Coordinate centers for maps based on common destinations
  const coordinatesMap: Record<string, { lat: number; lng: number }> = {
    bali: { lat: -8.409518, lng: 115.188916 },
    paris: { lat: 48.856614, lng: 2.352221 },
    tokyo: { lat: 35.6762, lng: 139.6503 },
    london: { lat: 51.5074, lng: -0.1278 },
    rome: { lat: 41.9028, lng: 12.4964 },
    new_york: { lat: 40.7128, lng: -74.0060 },
    switzerland: { lat: 46.8182, lng: 8.2275 },
    jammu: { lat: 32.733, lng: 74.864 },
    jammu_and_kashmir: { lat: 32.733, lng: 74.864 }
  };

  const cleanDest = destination.toLowerCase().trim().replace(/[^a-z]/g, "_");
  const baseCoord = coordinatesMap[cleanDest] || { lat: 25.2048, lng: 55.2708 }; // Default Dubai

  // 100% Real-world catalog data for fallback rendering
  let hotels = [];
  let restaurants = [];
  let activities = [];
  let flights = {
    cheapest: { airline: "Global Budget Airways", cost: Math.round(budget * 0.2), duration: "11h 45m", layovers: 1, airports: ["JFK", "LHR", "DPS"] },
    fastest: { airline: "Star Lux Airlines", cost: Math.round(budget * 0.35), duration: "7h 15m", layovers: 0, airports: ["JFK", "DPS"] },
    multi_city: [{ airline: "EcoTrans Air", cost: Math.round(budget * 0.28), duration: "13h 20m", layovers: 2, airports: ["JFK", "CDG", "SIN", "DPS"] }],
    notes: "Flight options estimated based on seasonal averages. Booking 4 weeks in advance recommended."
  };

  let weather = {
    average_temp: "27°C (81°F)",
    forecast_description: "Sunny intervals with pleasant evening breezes. Occasional light showers expected on Day 3.",
    humidity: "68%",
    wind_speed: "14 km/h",
    precipitation_probability: "20%",
    weather_alerts: [],
    packing_suggestions: ["Breathable cotton clothes", "Sunglasses & UV Sunscreen", "Comfortable walking shoes", "Compact travel umbrella", "Light windbreaker for evenings"]
  };

  if (cleanDest.includes("bali")) {
    hotels = [
      {
        name: "AYANA Resort Bali",
        price_per_night: Math.round(budget * 0.15),
        rating: 4.8,
        amenities: ["Free Wi-Fi", "Oceanfront Infinity Pool", "Rock Bar Access", "Spa & Wellness", "Private Beach"],
        nearby_attractions: ["Uluwatu Temple", "Jimbaran Beach"],
        address: "Jalan Karang Mas Sejahtera, Jimbaran, Bali 80364",
        description: "World-class luxury resort featuring a private beach, oceanfront infinity pools, and the iconic sunset Rock Bar.",
        coordinates: { lat: -8.775, lng: 115.124 }
      },
      {
        name: "The Kayon Jungle Resort Ubud",
        price_per_night: Math.round(budget * 0.08),
        rating: 4.9,
        amenities: ["Free Breakfast", "Three-tier Pool", "Jungle Views", "Yoga Classes", "Bicycle Rental"],
        nearby_attractions: ["Tegallalang Rice Terraces", "Ubud Monkey Forest"],
        address: "Banjar Bresela, Payangan, Ubud, Bali 80572",
        description: "Stunning jungle sanctuary featuring multi-tier swimming pools overlooking scenic valley views and organic food venues.",
        coordinates: { lat: -8.423, lng: 115.267 }
      }
    ];

    flights = {
      cheapest: { airline: "IndiGo / Air India", cost: Math.round(budget * 0.22), duration: "9h 30m", layovers: 1, airports: ["DEL", "SIN", "DPS"] },
      fastest: { airline: "Singapore Airlines", cost: Math.round(budget * 0.38), duration: "8h 10m", layovers: 0, airports: ["BOM", "DPS"] },
      multi_city: [{ airline: "Malaysia Airlines", cost: Math.round(budget * 0.29), duration: "11h 0m", layovers: 1, airports: ["DEL", "KUL", "DPS"] }],
      notes: "Flight routes mapped from Indian hubs (BOM/DEL) to Denpasar Bali (DPS)."
    };

    restaurants = [
      {
        name: "Locavore Ubud",
        meal_type: "Lunch",
        price_level: "$$$",
        rating: 4.7,
        cuisine_type: "Contemporary Indonesian",
        special_dishes: ["Modern Satay Platters", "Slow-cooked Heritage Pork"],
        address: "Jl. Dewisita No.10, Ubud",
        is_veg_friendly: true,
        is_vegan_friendly: false,
        coordinates: { lat: -8.510, lng: 115.262 }
      },
      {
        name: "Potato Head Beach Club",
        meal_type: "Dinner",
        price_level: "$$",
        rating: 4.6,
        cuisine_type: "International Fusion",
        special_dishes: ["Pan-seared Red Snapper", "Woodfired Artisanal Pizzas"],
        address: "Jl. Petitenget No.51B, Seminyak",
        is_veg_friendly: true,
        is_vegan_friendly: true,
        coordinates: { lat: -8.679, lng: 115.154 }
      }
    ];

    activities = [
      {
        name: "Tegallalang Rice Terraces Trekking",
        category: "Nature",
        cost: 5,
        duration: "3 hours",
        best_time_to_visit: "08:00 AM",
        description: "Hike down the green valleys and photograph the famous Bali terrace layers.",
        coordinates: { lat: -8.431, lng: 115.278 }
      },
      {
        name: "Uluwatu Cliff Temple & Kecak Dance",
        category: "Historical",
        cost: 15,
        duration: "3 hours",
        best_time_to_visit: "05:00 PM",
        description: "Perched high on a steep cliff, watch the traditional Kecak Fire Dance during sunset.",
        coordinates: { lat: -8.829, lng: 115.084 }
      },
      {
        name: "Sacred Monkey Forest Sanctuary",
        category: "Nature",
        cost: 10,
        duration: "2 hours",
        best_time_to_visit: "10:00 AM",
        description: "Walk under giant banyan trees and interact with playful monkeys in a historic temple forest.",
        coordinates: { lat: -8.518, lng: 115.262 }
      }
    ];
  } else if (cleanDest.includes("kerala") || cleanDest.includes("kerla")) {
    hotels = [
      {
        name: "Grand Hyatt Kochi Bolgatty",
        price_per_night: Math.round(budget * 0.15),
        rating: 4.8,
        amenities: ["Free Wi-Fi", "Waterfront Pool", "Lakeside Walks", "Luxury Spa", "Premium Lounge"],
        nearby_attractions: ["Fort Kochi Chinese Fishing Nets", "Lulu Mall"],
        address: "Mulavukad, Kochi, Kerala 682504",
        description: "Waterfront luxury resort overlooking Lake Vembanad with modern rooms, landscaping, and a premium wellness spa.",
        coordinates: { lat: 9.998, lng: 76.262 }
      },
      {
        name: "Kumarakom Lake Resort",
        price_per_night: Math.round(budget * 0.08),
        rating: 4.7,
        amenities: ["Free Breakfast", "Houseboat Rental", "Backwater Views", "Ayurvedic Massage"],
        nearby_attractions: ["Bird Sanctuary", "Vembanad Lake"],
        address: "Kottayam - Kumarakom Rd, Kumarakom, Kerala 686563",
        description: "Beautiful heritage resort offering luxury villas, backwater cruises, and traditional Ayurvedic therapies.",
        coordinates: { lat: 9.591, lng: 76.422 }
      }
    ];

    flights = {
      cheapest: { airline: "IndiGo / Air India Express", cost: Math.round(budget * 0.18), duration: "3h 15m", layovers: 0, airports: ["BOM", "COK"] },
      fastest: { airline: "Vistara", cost: Math.round(budget * 0.28), duration: "2h 0m", layovers: 0, airports: ["DEL", "COK"] },
      multi_city: [{ airline: "Emirates", cost: Math.round(budget * 0.35), duration: "6h 40m", layovers: 1, airports: ["DXB", "COK"] }],
      notes: "Direct and single-layover connections operating to Cochin International Airport (COK)."
    };

    restaurants = [
      {
        name: "Paragon Restaurant Kochi",
        meal_type: "Lunch",
        price_level: "$$",
        rating: 4.6,
        cuisine_type: "Traditional Malabar",
        special_dishes: ["Malabar Mutton Biryani", "Spiced Tawa Fish fry"],
        address: "Lulu Mall Food Street, Edappally",
        is_veg_friendly: true,
        is_vegan_friendly: false,
        coordinates: { lat: 10.027, lng: 76.308 }
      },
      {
        name: "Fort House Coastal Diner",
        meal_type: "Dinner",
        price_level: "$$",
        rating: 4.4,
        cuisine_type: "Kerala Coastal Seafood",
        special_dishes: ["Kerala Fish Curry in Claypot", "Coconut Milk Prawns"],
        address: "Calvathy Rd, Fort Kochi",
        is_veg_friendly: true,
        is_vegan_friendly: true,
        coordinates: { lat: 9.968, lng: 76.245 }
      }
    ];

    activities = [
      {
        name: "Alappuzha Houseboat Backwater Cruise",
        category: "Nature",
        cost: 60,
        duration: "5 hours",
        best_time_to_visit: "11:00 AM",
        description: "Rent a private traditional houseboat and sail past coconut groves and local villages in the backwaters.",
        coordinates: { lat: 9.510, lng: 76.348 }
      },
      {
        name: "Athirappilly Waterfalls Excursion",
        category: "Adventure",
        cost: 5,
        duration: "3 hours",
        best_time_to_visit: "10:00 AM",
        description: "Hike down to the base of India's largest majestic waterfalls surrounded by lush rainforests.",
        coordinates: { lat: 10.285, lng: 76.569 }
      },
      {
        name: "Munnar Tea Gardens Valley Hike",
        category: "Nature",
        cost: 10,
        duration: "4 hours",
        best_time_to_visit: "08:00 AM",
        description: "Guided moderate trek through rolling hills of tea plantations and mist-covered peaks.",
        coordinates: { lat: 10.151, lng: 77.060 }
      }
    ];
  } else if (cleanDest.includes("jammu")) {
    hotels = [
      {
        name: "Hari Niwas Palace Jammu",
        price_per_night: Math.round(budget * 0.16),
        rating: 4.7,
        amenities: ["Free Wi-Fi", "Historic Palace Tours", "Revolving Restaurant", "Royal Gardens", "Wellness Spa"],
        nearby_attractions: ["Amar Mahal Palace Museum", "Bahu Fort"],
        address: "Palace Road, Jammu, Jammu and Kashmir 180001",
        description: "An elegant historic palace overlooking the Tawi River valley offering royal luxury hospitality and panoramic mountain landscapes.",
        coordinates: { lat: 32.753, lng: 74.878 }
      },
      {
        name: "Radisson Blu Jammu",
        price_per_night: Math.round(budget * 0.10),
        rating: 4.5,
        amenities: ["Free Breakfast", "Swimming Pool", "High-speed Wi-Fi", "Fitness Center"],
        nearby_attractions: ["Gandhi Nagar Market", "Bahu Fort"],
        address: "Radisson Square, Narwal Bala, Jammu, Jammu and Kashmir 180006",
        description: "A modern upscale hotel featuring premium accommodations, diverse dining choices, and a convenient location.",
        coordinates: { lat: 32.705, lng: 74.887 }
      },
      {
        name: "Hotel Asia Jammu Tawi",
        price_per_night: Math.round(budget * 0.06),
        rating: 4.2,
        amenities: ["Free Breakfast", "Comfortable Rooms", "Local Dining"],
        nearby_attractions: ["Raghunath Temple", "Tawi River"],
        address: "Nehru Market, Jammu, Jammu and Kashmir 180001",
        description: "A classic hospitality choice in Jammu with cozy accommodations and friendly service close to local transport links.",
        coordinates: { lat: 32.715, lng: 74.872 }
      }
    ];

    flights = {
      cheapest: { airline: "IndiGo / SpiceJet", cost: Math.round(budget * 0.15), duration: "1h 30m", layovers: 0, airports: ["DEL", "IXJ"] },
      fastest: { airline: "Air India", cost: Math.round(budget * 0.22), duration: "1h 20m", layovers: 0, airports: ["DEL", "IXJ"] },
      multi_city: [{ airline: "Vistara", cost: Math.round(budget * 0.28), duration: "4h 10m", layovers: 1, airports: ["DEL", "SXR", "IXJ"] }],
      notes: "Direct domestic flights to Jammu Airport (IXJ) operating regularly from major national hubs."
    };

    restaurants = [
      {
        name: "Falaks Revolving Restaurant",
        meal_type: "Dinner",
        price_level: "$$$",
        rating: 4.5,
        cuisine_type: "North Indian & Kashmiri Wazwan",
        special_dishes: ["Kashmiri Rogan Josh", "Mutton Rista", "Dum Aloo"],
        address: "Hari Niwas Palace, Palace Road",
        is_veg_friendly: true,
        is_vegan_friendly: false,
        coordinates: { lat: 32.753, lng: 74.878 }
      },
      {
        name: "Pahalwan Di Hatti",
        meal_type: "Lunch",
        price_level: "$",
        rating: 4.4,
        cuisine_type: "Local Street Food & Sweets",
        special_dishes: ["Signature Kaladi Kulcha", "Rajma Chawal with Desi Ghee", "Chocolate Burfi"],
        address: "Gandhi Nagar, Jammu",
        is_veg_friendly: true,
        is_vegan_friendly: true,
        coordinates: { lat: 32.711, lng: 74.869 }
      },
      {
        name: "The Imperial Grill Restaurant",
        meal_type: "Dinner",
        price_level: "$$",
        rating: 4.3,
        cuisine_type: "Mughlai & Chinese",
        special_dishes: ["Murg Malai Kabab", "Mutton Seekh Kebab", "Tandoori Chicken"],
        address: "Bahubali Market, Jammu",
        is_veg_friendly: true,
        is_vegan_friendly: false,
        coordinates: { lat: 32.718, lng: 74.862 }
      }
    ];

    activities = [
      {
        name: "Raghunath Temple Sightseeing",
        category: "Historical",
        cost: 0,
        duration: "2 hours",
        best_time_to_visit: "09:00 AM",
        description: "Explore the historic 19th-century temple complex dedicated to Lord Rama, decorated with gold spiral domes.",
        coordinates: { lat: 32.729, lng: 74.864 }
      },
      {
        name: "Bahu Fort & Bagh-e-Bahu Gardens Trek",
        category: "Adventure",
        cost: 5,
        duration: "3.5 hours",
        best_time_to_visit: "03:00 PM",
        description: "Tour the historic stone fort overlooking the Tawi river, and walk through its lush terraced lawns.",
        coordinates: { lat: 32.721, lng: 74.887 }
      },
      {
        name: "Amar Mahal Palace Museum Tour",
        category: "Historical",
        cost: 10,
        duration: "3 hours",
        best_time_to_visit: "10:30 AM",
        description: "Visit the spectacular French chalet-style palace museum hosting a 120kg golden throne and rare paintings.",
        coordinates: { lat: 32.754, lng: 74.877 }
      }
    ];
  } else {
    // Standard generic fallback
    hotels = [
      {
        name: `${destination} Grand Plaza Resort`,
        price_per_night: Math.round(budget * 0.15),
        rating: 4.8,
        amenities: ["Free Wi-Fi", "Swimming Pool", "Spa & Wellness", "Fitness Center"],
        nearby_attractions: ["Central District", "Historic Market"],
        address: `102 Harmony Boulevard, ${destination}`,
        description: "A premium luxury resort featuring state-of-the-art amenities, infinity pool, and bespoke hospitality.",
        coordinates: { lat: baseCoord.lat + 0.005, lng: baseCoord.lng - 0.005 }
      },
      {
        name: "Vibrant Vista Boutique Hotel",
        price_per_night: Math.round(budget * 0.08),
        rating: 4.5,
        amenities: ["Free Breakfast", "Rooftop Terrace", "Bicycle Rental"],
        nearby_attractions: ["Art Gallery", "Food Street"],
        address: `45 Artistic Alley, ${destination}`,
        description: "A chic, artsy urban escape popular with solo travelers and couples looking for local character and cozy design aesthetics.",
        coordinates: { lat: baseCoord.lat - 0.004, lng: baseCoord.lng + 0.006 }
      }
    ];

    restaurants = [
      {
        name: "The Golden Spice Bistro",
        meal_type: "Lunch",
        price_level: "$$",
        rating: 4.7,
        cuisine_type: "Traditional Local",
        special_dishes: ["Signature Curry Plate", "Handmade Local Noodles"],
        address: `18 Market Road, ${destination}`,
        is_veg_friendly: true,
        is_vegan_friendly: false,
        coordinates: { lat: baseCoord.lat + 0.003, lng: baseCoord.lng + 0.002 }
      },
      {
        name: "Sunrise Greens Organic Café",
        meal_type: "Breakfast",
        price_level: "$",
        rating: 4.6,
        cuisine_type: "Healthy Cafe & Bowls",
        special_dishes: ["Acai Berry Bowl", "Avocado Sourdough Toast"],
        address: `88 Healing Way, ${destination}`,
        is_veg_friendly: true,
        is_vegan_friendly: true,
        coordinates: { lat: baseCoord.lat - 0.003, lng: baseCoord.lng - 0.002 }
      },
      {
        name: "Summit View Fine Dining",
        meal_type: "Dinner",
        price_level: "$$$",
        rating: 4.9,
        cuisine_type: "Contemporary Fusion",
        special_dishes: ["Pan-seared Truffle Steaks", "Deconstructed Citrus Tart"],
        address: `Cliff Edge Heights, ${destination}`,
        is_veg_friendly: true,
        is_vegan_friendly: false,
        coordinates: { lat: baseCoord.lat + 0.009, lng: baseCoord.lng + 0.009 }
      }
    ];

    activities = [
      {
        name: "Historic Walking Tour",
        category: "Historical",
        cost: 15,
        duration: "3 hours",
        best_time_to_visit: "09:00 AM",
        description: "A walk through history featuring architectural wonders, local guides, and iconic photo hotspots.",
        coordinates: { lat: baseCoord.lat + 0.001, lng: baseCoord.lng + 0.001 }
      },
      {
        name: "Sunset Ridge Hiking",
        category: "Adventure",
        cost: 30,
        duration: "4 hours",
        best_time_to_visit: "03:30 PM",
        description: "Guided moderate trek up the scenic ridges. Captivating panoramas as the sun goes down.",
        coordinates: { lat: baseCoord.lat - 0.008, lng: baseCoord.lng - 0.008 }
      },
      {
        name: "Local Artistry Workshop",
        category: "Nature",
        cost: 20,
        duration: "2 hours",
        best_time_to_visit: "01:00 PM",
        description: "Learn traditional crafts directly from resident families. Keep what you make!",
        coordinates: { lat: baseCoord.lat + 0.005, lng: baseCoord.lng - 0.003 }
      }
    ];
  }

  // Day-wise itinerary
  const itineraryDays = Array.from({ length: numDays }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = new Date(new Date(dates.start).getTime() + i * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
    
    return {
      day_number: dayNum,
      date: dateStr,
      theme: dayNum === 1 ? "Arrival & Settlement" : dayNum === numDays ? "Farewells & Souvenirs" : `Exploring ${interests[i % interests.length] || 'Local Wonders'}`,
      morning: [
        {
          time: "09:00 AM",
          title: dayNum === 1 ? "Check-in at Hotel" : activities[0].name,
          description: dayNum === 1 ? `Arrive in ${destination} and check-in to your selected hotel. Rest and settle.` : activities[0].description,
          cost: dayNum === 1 ? 0 : activities[0].cost,
          duration: "2 hours",
          location_name: dayNum === 1 ? hotels[0].name : "City Center",
          coordinates: dayNum === 1 ? hotels[0].coordinates : activities[0].coordinates
        }
      ],
      afternoon: [
        {
          time: "01:00 PM",
          title: `Lunch at ${restaurants[0].name}`,
          description: `Enjoy standard regional cuisines. Try their ${restaurants[0].special_dishes[0]}.`,
          cost: 25,
          duration: "1.5 hours",
          location_name: restaurants[0].name,
          coordinates: restaurants[0].coordinates
        },
        {
          time: "03:00 PM",
          title: activities[2].name,
          description: activities[2].description,
          cost: activities[2].cost,
          duration: "2 hours",
          location_name: "Cultural Hub",
          coordinates: activities[2].coordinates
        }
      ],
      evening: [
        {
          time: "07:00 PM",
          title: `Dinner at ${restaurants[2].name}`,
          description: `Splendid dinner with panoramic viewpoints. Make sure to try ${restaurants[2].special_dishes[0]}.`,
          cost: 45,
          duration: "2 hours",
          location_name: restaurants[2].name,
          coordinates: restaurants[2].coordinates
        }
      ]
    };
  });

  // Budget calculations
  const totalHotelCost = hotels[0].price_per_night * numDays;
  const flightCost = flights.cheapest.cost;
  const foodCost = 50 * travelers * numDays;
  const transportCost = 15 * travelers * numDays;
  const activitiesCost = 40 * travelers * numDays;
  const emergencyCost = Math.round(budget * 0.05);
  const taxesCost = Math.round((totalHotelCost + flightCost) * 0.08);
  const totalCalculated = flightCost + totalHotelCost + foodCost + transportCost + activitiesCost + emergencyCost + taxesCost;

  const budgetBreakdown = {
    flights: flightCost,
    hotels: totalHotelCost,
    food: foodCost,
    transport: transportCost,
    activities: activitiesCost,
    emergency_fund: emergencyCost,
    taxes_and_fees: taxesCost,
    total: totalCalculated
  };

  return {
    destination,
    budget,
    dates,
    travelers: { count: travelers, details: `${travelers} traveler(s)` },
    preferences: { style, interests, food: "local", hotels: "resorts", transport: "metro" },
    destination_info: {
      description: `${destination} is a spectacular travel hub known for its scenic views, cultural richness, and vibrant dining experiences. Ideal for a ${style.toLowerCase()} trip.`,
      best_visiting_months: ["April", "May", "September", "October"],
      climate: "Temperate maritime climate, sunny spells mixed with slight wind breezes.",
      safety_rating: "High",
      popular_attractions: filteredAttractions,
      hidden_gems: ["Secret Botanical Path", "Old Mill Tavern", "Cliff View Tea Estate"],
      local_culture: "A beautiful fusion of ancient heritage customs with modern urban lifestyles."
    },
    weather,
    flights,
    hotels: { hotels },
    restaurants,
    local_transport: {
      options: [
        { type: "Metro Transit", estimated_cost: "$2.50 per ticket", travel_time_rating: "Fast", pros: "Avoids urban traffic, highly punctual.", cons: "Crowded during peak rush hours." },
        { type: "Local Taxi / Ride-hailing", estimated_cost: "$15 per ride", travel_time_rating: "Moderate", pros: "Comfortable, drop-off directly at doors.", cons: "Prone to main avenue traffic jams." }
      ]
    },
    visa_info: {
      visa_required: true,
      requirements: ["Valid international passport (6+ months validity)", "Completed online travel declaration form", "Proof of return flight ticket"],
      processing_time: "3-5 business days",
      fees: "$50 USD visa processing fee",
      travel_insurance_required: true,
      vaccinations: ["Routine immunizations up-to-date", "Yellow Fever vaccine (if entering from endemic zones)"]
    },
    currency_info: {
      currency_name: "Local Currency",
      currency_code: "LCC",
      approximate_rate_to_usd: 1.0,
      cards_acceptance: "Widely accepted in restaurants and hotels. Keep cash for street markets.",
      atm_availability: "Very common in metropolitan areas.",
      tipping_style: "10% service charge is typically included; optional extra tipping is welcome."
    },
    safety_tips: {
      safety_score: 85,
      common_scams: ["Overpriced taxi rides at terminal exits", "Fake tour guide solicitations outside museums"],
      emergency_numbers: { police: "112", medical: "119", general: "911" },
      safe_neighborhoods: ["Historic District", "Central Park West", "Bayside Promenade"],
      neighborhoods_to_avoid: ["Terminal Backstreets late at night", "Abandoned Industrial District"],
      advisories: ["Drink bottled water instead of tap water.", "Ensure valuables are secured in public transport."]
    },
    activities: { activities },
    packing_list: {
      checklist: [
        { category: "Documents", items: ["Passport & Visa printed", "Flight tickets", "Hotel booking confirmations", "Travel insurance card"] },
        { category: "Electronics", items: ["Phone & Laptop chargers", "Universal socket adapter", "High capacity Power Bank"] },
        { category: "Clothing", items: weather.packing_suggestions },
        { category: "First Aid & Meds", items: ["Pain relievers", "Digestive tablets", "Allergy medication", "Adhesive bandages"] }
      ]
    },
    itinerary: { days: itineraryDays },
    budget_breakdown: {
      breakdown: budgetBreakdown,
      tiers: {
        budget_tier: Math.round(totalCalculated * 0.6),
        mid_tier: totalCalculated,
        luxury_tier: Math.round(totalCalculated * 1.8)
      },
      saving_tips: [
        "Take the local Metro Transit instead of private taxi rides.",
        "Eat breakfast at Sunrise Greens Organic Café instead of hotel dine-ins.",
        "Book museum tickets online in advance to bypass peak pricing slots."
      ]
    }
  };
}

/**
 * Mocks the AI Conversational updating of trip details.
 */
export function mockChatItineraryUpdate(originalTrip: any, _chatHistory: any[], userMessage: string) {
  const lowercaseMsg = userMessage.toLowerCase();
  let explanation = "I updated the itinerary to accommodate your request.";
  const updatedTrip = JSON.parse(JSON.stringify(originalTrip));

  if (lowercaseMsg.includes("remove") && lowercaseMsg.includes("day 1")) {
    updatedTrip.itinerary.days[0].morning = [
      {
        time: "10:00 AM",
        title: "Relax at Cafe",
        description: "Enjoy a quiet morning sipping local tea.",
        cost: 5,
        duration: "2 hours",
        location_name: "Local Cafe"
      }
    ];
    explanation = "I removed the morning check-in/activity on Day 1 and replaced it with a relaxing Cafe visit as requested.";
    updatedTrip.budget_breakdown.breakdown.activities -= 15;
    updatedTrip.budget_breakdown.breakdown.total -= 15;
  } else if (lowercaseMsg.includes("budget") || lowercaseMsg.includes("reduce") || lowercaseMsg.includes("cheaper")) {
    updatedTrip.budget_breakdown.breakdown.hotels = Math.round(updatedTrip.budget_breakdown.breakdown.hotels * 0.7);
    updatedTrip.budget_breakdown.breakdown.total = 
      updatedTrip.budget_breakdown.breakdown.flights + 
      updatedTrip.budget_breakdown.breakdown.hotels + 
      updatedTrip.budget_breakdown.breakdown.food + 
      updatedTrip.budget_breakdown.breakdown.transport + 
      updatedTrip.budget_breakdown.breakdown.activities;
    explanation = "I adjusted the accommodations to use a highly rated budget-tier boutique hotel, reducing the hotel expense category by 30%.";
  } else if (lowercaseMsg.includes("adventure") || lowercaseMsg.includes("hiking") || lowercaseMsg.includes("active")) {
    // Add adventure activity to day 2
    if (updatedTrip.itinerary.days[1]) {
      updatedTrip.itinerary.days[1].afternoon.push({
        time: "04:30 PM",
        title: "Adrenaline Zipline Canopy Tour",
        description: "Fly through the forest trees on a high-speed zipline run.",
        cost: 45,
        duration: "1.5 hours",
        location_name: "Zipline Canopy Park"
      });
      updatedTrip.budget_breakdown.breakdown.activities += 45;
      updatedTrip.budget_breakdown.breakdown.total += 45;
      explanation = "I added a thrilling Adrenaline Zipline Canopy Tour to your Day 2 afternoon schedule and adjusted the activities budget.";
    }
  }

  return {
    updatedTrip,
    explanation
  };
}
