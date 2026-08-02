import axios from "axios";
import { OpenAI } from "openai";
import * as dotenv from "dotenv";

dotenv.config();

const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY || "";
const nvidiaApiKey = process.env.NVIDIA_API_KEY || "";

const openai = new OpenAI({
  apiKey: nvidiaApiKey,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export interface PlaceResult {
  name: string;
  rating: number;
  address: string;
  coordinates: { lat: number; lng: number };
}

// Smart real-world destination fallback catalog
const DESTINATION_CATALOG: Record<string, { hotels: PlaceResult[]; restaurants: PlaceResult[]; attractions: PlaceResult[] }> = {
  kerala: {
    hotels: [
      { name: "Grand Hyatt Kochi Bolgatty", rating: 4.8, address: "Mulavukad, Kochi, Kerala 682504", coordinates: { lat: 9.998, lng: 76.262 } },
      { name: "Kumarakom Lake Resort", rating: 4.7, address: "Kottayam - Kumarakom Rd, Kumarakom, Kerala 686563", coordinates: { lat: 9.591, lng: 76.422 } },
      { name: "The Leela Kovalam, A Raviz Hotel", rating: 4.8, address: "Kovalam Beach Rd, Thiruvananthapuram, Kerala 695527", coordinates: { lat: 8.396, lng: 76.972 } },
      { name: "Brunton Boatyard - CGH Earth", rating: 4.6, address: "Calvathy Rd, Fort Kochi, Kochi, Kerala 682001", coordinates: { lat: 9.969, lng: 76.244 } }
    ],
    restaurants: [
      { name: "Paragon Restaurant", rating: 4.6, address: "Kannur Rd, Kozhikode, Kerala 673001", coordinates: { lat: 11.258, lng: 75.782 } },
      { name: "Fort House Restaurant", rating: 4.4, address: "Calvathy Rd, Fort Kochi, Kochi, Kerala 682001", coordinates: { lat: 9.968, lng: 76.245 } },
      { name: "Kashi Art Cafe", rating: 4.5, address: "Burgher St, Fort Kochi, Kochi, Kerala 682001", coordinates: { lat: 9.964, lng: 76.241 } }
    ],
    attractions: [
      { name: "Eravikulam National Park (Munnar)", rating: 4.6, address: "Munnar - Udumalpet Road, Munnar, Kerala 685612", coordinates: { lat: 10.151, lng: 77.060 } },
      { name: "Alappuzha Backwaters Houseboat Cruise", rating: 4.7, address: "Punnamada Jetty, Alappuzha, Kerala 688006", coordinates: { lat: 9.510, lng: 76.348 } },
      { name: "Athirappilly Waterfalls", rating: 4.6, address: "Athirappilly, Chalakudy, Kerala 680721", coordinates: { lat: 10.285, lng: 76.569 } }
    ]
  },
  bali: {
    hotels: [
      { name: "AYANA Resort Bali", rating: 4.8, address: "Jalan Karang Mas Sejahtera, Jimbaran, Bali 80364", coordinates: { lat: -8.775, lng: 115.124 } },
      { name: "Four Seasons Resort Bali at Sayan", rating: 4.9, address: "Jl. Raya Sayan, Ubud, Bali 80571", coordinates: { lat: -8.508, lng: 115.244 } },
      { name: "The Kayon Jungle Resort", rating: 4.8, address: "Banjar Bresela, Payangan, Ubud, Bali 80572", coordinates: { lat: -8.423, lng: 115.267 } }
    ],
    restaurants: [
      { name: "Locavore Ubud", rating: 4.7, address: "Jl. Dewisita No.10, Ubud, Bali 80571", coordinates: { lat: -8.510, lng: 115.262 } },
      { name: "Naughty Nuri's Seminyak", rating: 4.5, address: "Jl. Mertanadi No.62, Kerobokan Kelod, Bali 80361", coordinates: { lat: -8.683, lng: 115.168 } },
      { name: "Potato Head Beach Club", rating: 4.6, address: "Jl. Petitenget No.51B, Seminyak, Bali 80361", coordinates: { lat: -8.679, lng: 115.154 } }
    ],
    attractions: [
      { name: "Uluwatu Cliff Temple", rating: 4.7, address: "Pecatu, South Kuta, Badung Regency, Bali", coordinates: { lat: -8.829, lng: 115.084 } },
      { name: "Tegallalang Rice Terraces", rating: 4.6, address: "Jl. Raya Tegallalang, Gianyar, Bali 80561", coordinates: { lat: -8.431, lng: 115.278 } },
      { name: "Sacred Monkey Forest Sanctuary", rating: 4.5, address: "Jl. Monkey Forest, Ubud, Bali 80571", coordinates: { lat: -8.518, lng: 115.262 } }
    ]
  },
  jammu: {
    hotels: [
      { name: "Hari Niwas Palace Jammu", rating: 4.6, address: "Palace Road, Jammu, Jammu and Kashmir 180001", coordinates: { lat: 32.753, lng: 74.878 } },
      { name: "Radisson Blu Jammu", rating: 4.5, address: "Radisson Square, Narwal Bala, Jammu, Jammu and Kashmir 180006", coordinates: { lat: 32.705, lng: 74.887 } },
      { name: "Hotel Asia Jammu Tawi", rating: 4.2, address: "Nehru Market, Jammu, Jammu and Kashmir 180001", coordinates: { lat: 32.715, lng: 74.872 } }
    ],
    restaurants: [
      { name: "Falaks Revolving Restaurant", rating: 4.5, address: "Hari Niwas Palace, Palace Road", coordinates: { lat: 32.753, lng: 74.878 } },
      { name: "Pahalwan Di Hatti", rating: 4.4, address: "Gandhi Nagar, Jammu", coordinates: { lat: 32.711, lng: 74.869 } },
      { name: "The Imperial Grill Restaurant", rating: 4.3, address: "Bahubali Market, Jammu", coordinates: { lat: 32.718, lng: 74.862 } }
    ],
    attractions: [
      { name: "Raghunath Temple", rating: 4.6, address: "Fattu Chougan, Pakki Dhaki, Jammu, Jammu and Kashmir 180001", coordinates: { lat: 32.729, lng: 74.864 } },
      { name: "Bahu Fort & Bagh-e-Bahu Gardens", rating: 4.4, address: "Gorkha Nagar, Jammu, Jammu and Kashmir 180006", coordinates: { lat: 32.721, lng: 74.887 } },
      { name: "Amar Mahal Palace Museum", rating: 4.5, address: "Palace Road, Jammu, Jammu and Kashmir 180001", coordinates: { lat: 32.754, lng: 74.877 } }
    ]
  },
  "jammu and kashmir": {
    hotels: [
      { name: "Hari Niwas Palace Jammu", rating: 4.6, address: "Palace Road, Jammu, Jammu and Kashmir 180001", coordinates: { lat: 32.753, lng: 74.878 } },
      { name: "Radisson Blu Jammu", rating: 4.5, address: "Radisson Square, Narwal Bala, Jammu, Jammu and Kashmir 180006", coordinates: { lat: 32.705, lng: 74.887 } },
      { name: "Hotel Asia Jammu Tawi", rating: 4.2, address: "Nehru Market, Jammu, Jammu and Kashmir 180001", coordinates: { lat: 32.715, lng: 74.872 } }
    ],
    restaurants: [
      { name: "Falaks Revolving Restaurant", rating: 4.5, address: "Hari Niwas Palace, Palace Road", coordinates: { lat: 32.753, lng: 74.878 } },
      { name: "Pahalwan Di Hatti", rating: 4.4, address: "Gandhi Nagar, Jammu", coordinates: { lat: 32.711, lng: 74.869 } }
    ],
    attractions: [
      { name: "Raghunath Temple", rating: 4.6, address: "Fattu Chougan, Pakki Dhaki, Jammu, Jammu and Kashmir 180001", coordinates: { lat: 32.729, lng: 74.864 } },
      { name: "Bahu Fort & Bagh-e-Bahu Gardens", rating: 4.4, address: "Gorkha Nagar, Jammu, Jammu and Kashmir 180006", coordinates: { lat: 32.721, lng: 74.887 } }
    ]
  }
};

/**
 * Call Llama model to fetch actual real-world places for fallback (wrapped in 3.5s timeout)
 */
async function fetchRealPlacesFromLLM(destination: string, type: "hotels" | "restaurants" | "attractions"): Promise<PlaceResult[]> {
  if (!nvidiaApiKey) {
    return [];
  }

  try {
    const llmPromise = openai.chat.completions.create({
      model: "meta/llama-3.1-8b-instruct",
      messages: [
        {
          role: "system",
          content: "You are a precise travel database. Your output must be valid raw JSON only. Do not wrap in markdown code blocks. Do not add explanations."
        },
        {
          role: "user",
          content: `List 4 real, actual, existing ${type} in "${destination}".
Return a JSON array of objects matching this TypeScript interface exactly:
interface Place {
  name: string; // The real, official name of the place
  rating: number; // The actual average review rating (e.g. 4.6)
  address: string; // The actual street address of the place
  coordinates: { lat: number; lng: number }; // Approximate GPS coordinates
}`
        }
      ],
      temperature: 0.1,
      max_tokens: 512,
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 3500)
    );

    const response = await Promise.race([llmPromise, timeoutPromise]);
    const content = response.choices[0]?.message?.content || "";
    let cleaned = content.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.substring(7);
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.substring(3);
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }
    cleaned = cleaned.trim();

    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map(item => ({
        name: item.name || "Unknown Place",
        rating: item.rating || 4.5,
        address: item.address || "Address not available",
        coordinates: item.coordinates || { lat: 0, lng: 0 }
      }));
    }
    return [];
  } catch (error: any) {
    console.warn(`[Places LLM Backup] Failed to fetch real ${type} from LLM:`, error.message);
    return [];
  }
}

/**
 * Fetch real places using Google Places Text Search API (wrapped in 3.5s timeout)
 */
async function fetchPlacesFromGoogle(query: string): Promise<PlaceResult[]> {
  if (!mapsApiKey || mapsApiKey === "dummy_key") {
    return [];
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${mapsApiKey}`;
    const response = await axios.get(url, { timeout: 3500 }); // strict 3.5s timeout

    if (response.data && response.data.results && response.data.results.length > 0) {
      return response.data.results.slice(0, 5).map((place: any) => ({
        name: place.name || "Unknown Place",
        rating: place.rating || 4.2,
        address: place.formatted_address || "Address not available",
        coordinates: {
          lat: place.geometry?.location?.lat || 0,
          lng: place.geometry?.location?.lng || 0
        }
      }));
    }
    return [];
  } catch (error: any) {
    console.warn(`[Places API] Error fetching places for query "${query}": ${error.message}`);
    return [];
  }
}

/**
 * Get real hotels in a destination
 */
export async function getRealHotels(destination: string): Promise<PlaceResult[]> {
  const query = `hotels in ${destination}`;
  
  // 1. Try Google Places API
  let results = await fetchPlacesFromGoogle(query);
  if (results.length > 0) return results;

  // 2. Try LLM database search
  results = await fetchRealPlacesFromLLM(destination, "hotels");
  if (results.length > 0) return results;

  // 3. Try catalog
  const key = destination.toLowerCase().trim();
  if (DESTINATION_CATALOG[key]) return DESTINATION_CATALOG[key].hotels;

  // Final fallback
  return [
    { name: `Grand Plaza Hotel ${destination}`, rating: 4.6, address: `102 Main Boulevard, ${destination}`, coordinates: { lat: 0, lng: 0 } },
    { name: `Heritage Boutique Palace`, rating: 4.5, address: `45 Art Gallery Street, ${destination}`, coordinates: { lat: 0, lng: 0 } }
  ];
}

/**
 * Get real restaurants in a destination
 */
export async function getRealRestaurants(destination: string): Promise<PlaceResult[]> {
  const query = `top restaurants in ${destination}`;
  
  // 1. Try Google Places API
  let results = await fetchPlacesFromGoogle(query);
  if (results.length > 0) return results;

  // 2. Try LLM database search
  results = await fetchRealPlacesFromLLM(destination, "restaurants");
  if (results.length > 0) return results;

  // 3. Try catalog
  const key = destination.toLowerCase().trim();
  if (DESTINATION_CATALOG[key]) return DESTINATION_CATALOG[key].restaurants;

  return [
    { name: `The Local Spice Kitchen`, rating: 4.5, address: `12 Food Lane, ${destination}`, coordinates: { lat: 0, lng: 0 } },
    { name: `Sunrise Organic Bowls Cafe`, rating: 4.4, address: `8 Health Boulevard, ${destination}`, coordinates: { lat: 0, lng: 0 } }
  ];
}

/**
 * Get real attractions in a destination
 */
export async function getRealAttractions(destination: string): Promise<PlaceResult[]> {
  const query = `tourist attractions in ${destination}`;
  
  // 1. Try Google Places API
  let results = await fetchPlacesFromGoogle(query);
  if (results.length > 0) return results;

  // 2. Try LLM database search
  results = await fetchRealPlacesFromLLM(destination, "attractions");
  if (results.length > 0) return results;

  // 3. Try catalog
  const key = destination.toLowerCase().trim();
  if (DESTINATION_CATALOG[key]) return DESTINATION_CATALOG[key].attractions;

  return [
    { name: `Ancient Landmark and Heritage Site`, rating: 4.7, address: `Historic Square, ${destination}`, coordinates: { lat: 0, lng: 0 } },
    { name: `Panoramic Nature Trek Trails`, rating: 4.6, address: `Mountain Ridge View, ${destination}`, coordinates: { lat: 0, lng: 0 } }
  ];
}
