// AI Prompt Templates for the Multi-Agent Travel Planner

export interface AgentRequest {
  destination: string;
  budget: number;
  dates: { start: string; end: string };
  travelers: { count: number; details: string };
  preferences: {
    style: string;
    interests: string[];
    food: string;
    hotels: string;
    transport: string;
    accessibility?: string;
    specialRequests?: string;
    origin?: string;
  };
}

export const SYSTEM_PROMPT_PREFIX = `You are a professional, expert AI agent specializing in travel planning. 
You must output your response in STRICT JSON format only. Do not wrap the JSON in markdown code blocks (\`\`\`json ... \`\`\`), do not include any explanatory text outside the JSON, and do not include any backticks or notes. Output valid, parseable JSON only.`;

export const AGENT_PROMPTS = {
  unifiedPlanner: (req: AgentRequest, realHotels: any[], realRestaurants: any[], realAttractions: any[]) => ({
    system: `${SYSTEM_PROMPT_PREFIX} You are the Master AI Travel Planner.`,
    user: `Create a complete, detailed travel plan for "${req.destination}" from ${req.dates.start} to ${req.dates.end}.
Total trip budget is $${req.budget} for ${req.travelers.count} traveler(s). Origin is "${req.preferences.origin || 'New York'}".
Style: "${req.preferences.style}"
Interests: ${JSON.stringify(req.preferences.interests)}
Food preferences: "${req.preferences.food}"
Transport preference: "${req.preferences.transport}"

Real context data to base your recommendations on:
- Real hotels available: ${JSON.stringify(realHotels)}
- Real restaurants available: ${JSON.stringify(realRestaurants)}
- Real attractions available: ${JSON.stringify(realAttractions)}

IMPORTANT:
1. You MUST base your hotel, restaurant, and activity selections on the real context data provided above. Use their exact names, ratings, addresses, and coordinates.
2. You MUST use real, actual airlines (e.g. Air India, IndiGo, Emirates, Singapore Airlines, Qatar Airways, Delta, United) that serve this route.
3. For the local_transport options, you MUST include Metro/Subway, Train/Rail services, and Bus options.

Return a JSON object matching this TypeScript interface exactly:
interface UnifiedTripResponse {
  destination_info: {
    description: string;
    best_visiting_months: string[];
    climate: string;
    safety_rating: string; // e.g. "High", "Medium", "Low"
    popular_attractions: string[];
    hidden_gems: string[];
    local_culture: string;
  };
  weather: {
    average_temp: string;
    forecast_description: string;
    humidity: string;
    wind_speed: string;
    precipitation_probability: string;
    weather_alerts: string[];
    packing_suggestions: string[];
  };
  flights: {
    cheapest: { airline: string; cost: number; duration: string; layovers: number; airports: string[] };
    fastest: { airline: string; cost: number; duration: string; layovers: number; airports: string[] };
    notes: string;
  };
  hotels: {
    hotels: {
      name: string;
      price_per_night: number;
      rating: number;
      amenities: string[];
      nearby_attractions: string[];
      address: string;
      description: string;
      coordinates: { lat: number; lng: number };
    }[];
  };
  restaurants: {
    restaurants: {
      name: string;
      meal_type: string;
      price_level: string;
      rating: number;
      cuisine_type: string;
      special_dishes: string[];
      address: string;
      is_veg_friendly: boolean;
      is_vegan_friendly: boolean;
      coordinates: { lat: number; lng: number };
    }[];
  };
  local_transport: {
    options: {
      type: string; // e.g. "Metro/Subway", "Train/Rail", "Bus Service", "Taxi/Uber"
      estimated_cost: string;
      travel_time_rating: string;
      pros: string;
      cons: string;
    }[];
  };
  visa_info: {
    visa_required: boolean;
    requirements: string[];
    processing_time: string;
    fees: string;
    travel_insurance_required: boolean;
    vaccinations: string[];
  };
  currency_info: {
    currency_name: string;
    currency_code: string;
    approximate_rate_to_usd: number;
    cards_acceptance: string;
    atm_availability: string;
    tipping_style: string;
  };
  safety_tips: {
    safety_score: number;
    common_scams: string[];
    emergency_numbers: { police: string; medical: string; general: string };
    safe_neighborhoods: string[];
    neighborhoods_to_avoid: string[];
    advisories: string[];
  };
  activities: {
    activities: {
      name: string;
      category: string;
      cost: number;
      duration: string;
      best_time_to_visit: string;
      description: string;
      coordinates: { lat: number; lng: number };
    }[];
  };
  itinerary: {
    days: {
      day_number: number;
      date: string; // e.g. "Aug 15, 2026"
      theme: string;
      morning: { time: string; title: string; description: string; cost: number; duration: string; location_name: string; coordinates?: { lat: number; lng: number } }[];
      afternoon: { time: string; title: string; description: string; cost: number; duration: string; location_name: string; coordinates?: { lat: number; lng: number } }[];
      evening: { time: string; title: string; description: string; cost: number; duration: string; location_name: string; coordinates?: { lat: number; lng: number } }[];
    }[];
  };
}`
  }),

  chat_updater: (originalTrip: any, chatHistory: any[], userMessage: string) => ({
    system: `${SYSTEM_PROMPT_PREFIX} You are the Master Itinerary Updater.`,
    user: `You have an existing trip itinerary and details:
Trip Destination: ${originalTrip.destination}
Budget: $${originalTrip.budget}
Preferences: ${JSON.stringify(originalTrip.preferences)}
Current Itinerary: ${JSON.stringify(originalTrip.itinerary)}
Current Budget Breakdown: ${JSON.stringify(originalTrip.budget_breakdown)}

The user asks: "${userMessage}"
Recent Chat History: ${JSON.stringify(chatHistory)}

Your job is to update the current itinerary and/or budget breakdown according to the user's message.
You must return the COMPLETE updated trip schema in JSON.
Return a JSON object matching this TypeScript interface:
interface UpdateTripResponse {
  updated_itinerary: any;
  updated_budget_breakdown: any;
  explanation: string;
}`
  })
};
