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

  // 100% Real-world catalog data for local fallback rendering
  const destinationCatalog: Record<string, any[]> = {
    jammu: [
      {
        theme: "Arrival & Raghunath Temple Visit",
        morning: [{ time: "09:00 AM", title: "Check-in at Palace Hotel", description: "Arrive in Jammu, check-in to your hotel, unpack and settle in.", cost: 0, duration: "2 hours", location_name: hotels[0]?.name || "Hari Niwas Palace Jammu" }],
        afternoon: [
          { time: "01:00 PM", title: "Lunch at Pahalwan Di Hatti", description: "Savor the iconic local Kaladi Kulcha (traditional grilled cheese kulcha) and Rajma Chawal.", cost: 5, duration: "1.5 hours", location_name: "Pahalwan Di Hatti, Gandhi Nagar" },
          { time: "03:00 PM", title: "Raghunath Temple Exploration", description: "Explore the historic 19th-century temple complex dedicated to Lord Rama, featuring gold-plated spiral domes and sacred carvings.", cost: 0, duration: "2 hours", location_name: "Raghunath Temple, Pakki Dhaki" }
        ],
        evening: [{ time: "07:00 PM", title: "Dinner at Falaks Revolving Restaurant", description: "Dine at the revolving restaurant overlooking the Tawi river. Try the Kashmiri Wazwan platter.", cost: 25, duration: "2 hours", location_name: "Falaks, Palace Road" }]
      },
      {
        theme: "Bahu Fort & Amar Mahal Palace Tour",
        morning: [{ time: "09:00 AM", title: "Bahu Fort & Bagh-e-Bahu Gardens", description: "Visit the 3,000-year-old Bahu Fort and walk through the terraced Bagh-e-Bahu gardens overlooking the Tawi river valley.", cost: 2, duration: "3 hours", location_name: "Bahu Fort, Jammu" }],
        afternoon: [
          { time: "01:00 PM", title: "Lunch at Imperial Grill", description: "Savor Mughlai specialties and seekh kebabs at a top local diner.", cost: 15, duration: "1.5 hours", location_name: "Imperial Grill, Jammu" },
          { time: "03:00 PM", title: "Amar Mahal Palace Museum", description: "Tour the French-chateau-style palace. See the 120kg golden throne and rare Pahari paintings.", cost: 5, duration: "2 hours", location_name: "Amar Mahal Palace, Palace Road" }
        ],
        evening: [{ time: "07:00 PM", title: "Mubarak Mandi Palace Walk & Dinner", description: "Take a heritage walk through the historic Mubarak Mandi palace complex showing rich Rajput and Mughal architecture styles.", cost: 10, duration: "2.5 hours", location_name: "Mubarak Mandi Palace" }]
      },
      {
        theme: "Day Trip to Patnitop Hill Station & Adventure",
        morning: [{ time: "08:00 AM", title: "Pine Forest Trek at Patnitop", description: "Take a scenic drive to Patnitop hill station (112 km). Enjoy a guided hike through old pine forests and meadows.", cost: 15, duration: "4 hours", location_name: "Patnitop Meadows" }],
        afternoon: [
          { time: "01:30 PM", title: "Local Lunch at Patnitop", description: "Try local Dogri specialties like Ambal (sour pumpkin curry) and hot parathas.", cost: 8, duration: "1.5 hours", location_name: "Patnitop Town" },
          { time: "03:00 PM", title: "Skyview Patnitop Ropeway & Zipline", description: "Experience India's highest ropeway cabin ride and go ziplining across the scenic pine valleys.", cost: 20, duration: "2.5 hours", location_name: "Skyview Patnitop" }
        ],
        evening: [{ time: "07:30 PM", title: "Return to Jammu & Cozy Dinner", description: "Return to Jammu and unwind with a pleasant dinner featuring local comfort foods.", cost: 15, duration: "2 hours", location_name: "Local Restaurant, Residency Road" }]
      },
      {
        theme: "Mansar Lake Scenic Excursion",
        morning: [{ time: "09:30 AM", title: "Mansar Lake Boat Ride & Shrine Walk", description: "Drive 42 km to the sacred Mansar Lake. Enjoy a boat ride and visit the ancient Sheshnag temple on the eastern bank.", cost: 10, duration: "3.5 hours", location_name: "Mansar Lake" }],
        afternoon: [
          { time: "01:30 PM", title: "Lunch at Mansar Lake Viewpoint", description: "Enjoy fresh local snacks and thali meals overlooking the calm lake water.", cost: 8, duration: "1 hour", location_name: "Lake View Cafe" },
          { time: "03:00 PM", title: "Surinsar Lake Photography & Walks", description: "Visit the nearby Surinsar Lake, popular for its lotus ponds, bird watching, and peaceful pine hill backdrop.", cost: 2, duration: "2.5 hours", location_name: "Surinsar Lake" }
        ],
        evening: [{ time: "07:30 PM", title: "Shopping for Saffron & Dinner", description: "Shop at Raghunath Bazaar for authentic Kashmiri saffron, walnuts, almonds, and dry fruits. Dinner at a local cafe.", cost: 20, duration: "2 hours", location_name: "Raghunath Bazaar, Jammu" }]
      },
      {
        theme: "Manda Zoo Park Hike & Departure",
        morning: [{ time: "09:00 AM", title: "Manda Zoo Trail Walk", description: "Take a scenic nature walk inside Manda Zoo Park, home to deer, leopards, black bears, and local bird species.", cost: 2, duration: "2.5 hours", location_name: "Manda Zoo Park" }],
        afternoon: [
          { time: "12:30 PM", title: "Farewell Lunch & Souvenirs", description: "Enjoy a final lunch at a traditional Dogra restaurant, and pick up local wooden handicrafts.", cost: 12, duration: "1.5 hours", location_name: "Residency Road Market" },
          { time: "03:00 PM", title: "Transit to Airport/Railway Station", description: "Pack bags and checkout from the hotel for your onward journey home.", cost: 5, duration: "1.5 hours", location_name: "Jammu Airport/Station" }
        ],
        evening: [{ time: "06:30 PM", title: "Onward Journey", description: "Board your flight or train, taking home beautiful memories of Jammu and Kashmir.", cost: 0, duration: "1 hour", location_name: "Departure Lounge" }]
      }
    ],
    kerala: [
      {
        theme: "Fort Kochi Heritage & Chinese Nets",
        morning: [{ time: "09:00 AM", title: "Check-in & Fort Kochi Walk", description: "Check in at Bolgatty Island or Fort Kochi hotel. Stroll past colonial-era bungalows and lanes.", cost: 0, duration: "2 hours", location_name: hotels[0]?.name || "Hotel" }],
        afternoon: [
          { time: "01:00 PM", title: "Lunch at Paragon Kochi", description: "Dine at the legendary Paragon restaurant. Savor authentic Malabar Mutton Biryani and spiced Fish Fry.", cost: 15, duration: "1.5 hours", location_name: "Paragon, Lulu Mall" },
          { time: "03:00 PM", title: "Chinese Fishing Nets at Dusk", description: "Watch and try operating the historic Chinese Fishing Nets dating back to the 14th century on the waterfront.", cost: 5, duration: "2 hours", location_name: "Fort Kochi Beach" }
        ],
        evening: [{ time: "07:00 PM", title: "Kathakali Performance & Dinner", description: "Witness the traditional Kathakali makeup and dance drama at the Kathakali Centre. Dinner at Fort House Restaurant.", cost: 20, duration: "3 hours", location_name: "Kerala Kathakali Centre" }]
      },
      {
        theme: "Alappuzha Houseboat Backwater Cruise",
        morning: [{ time: "09:00 AM", title: "Board Traditional Kettuvallam Houseboat", description: "Drive to Alappuzha backwater jetty. Board a private luxury houseboat built of bamboo and coir.", cost: 80, duration: "4 hours", location_name: "Alleppey Houseboat Jetty" }],
        afternoon: [
          { time: "01:00 PM", title: "Banana Leaf Lunch on Board", description: "Enjoy a traditional Kerala Sadya lunch with local Pearl Spot Fish (Karimeen Pollichathu) cooked on board.", cost: 0, duration: "1.5 hours", location_name: "Houseboat, Backwaters" },
          { time: "03:00 PM", title: "Village Walk & Coir Weaving Tour", description: "Stop at a canal village. See how local women spin coconut fiber (coir) into ropes and walk through paddy fields.", cost: 0, duration: "2 hours", location_name: "Backwater Villages" }
        ],
        evening: [{ time: "07:00 PM", title: "Sunset Cruise & Lakeside Dinner", description: "Watch the sunset over Vembanad Lake. Unwind with a fresh seafood dinner on the houseboat deck.", cost: 20, duration: "2 hours", location_name: "Vembanad Lake" }]
      },
      {
        theme: "Munnar Tea Gardens Valley Hike",
        morning: [{ time: "08:30 AM", title: "Cheeyappara & Valara Waterfalls", description: "Drive up to Munnar hill station (1,600m). Stop at the multi-tier Cheeyappara waterfalls cascading down scenic cliffs.", cost: 0, duration: "3 hours", location_name: "Cheeyappara Waterfall" }],
        afternoon: [
          { time: "01:00 PM", title: "Lunch in Munnar Town", description: "Enjoy a Kerala lunch with flaky Malabar parottas and chicken peralan at a popular town diner.", cost: 10, duration: "1.5 hours", location_name: "Munnar Town" },
          { time: "02:30 PM", title: "Tata Tea Estate Trek & Museum", description: "Trek through the rolling green hills of a tea plantation. Tour the Tea Museum to see the processing stages.", cost: 12, duration: "3 hours", location_name: "Tata Tea Estate" }
        ],
        evening: [{ time: "07:00 PM", title: "Top Station Sunset Point", description: "Visit the highest point in Munnar (1,700m) for sweeping views of the mist-covered valleys and Tamil Nadu hills.", cost: 5, duration: "2 hours", location_name: "Top Station, Munnar" }]
      },
      {
        theme: "Periyar Tiger Reserve Safari & Spices",
        morning: [{ time: "07:30 AM", title: "Wildlife Boat Safari on Periyar Lake", description: "Take a boat cruise inside the Periyar Tiger Reserve. Spot wild elephant herds, bisons, and rare birds.", cost: 25, duration: "3 hours", location_name: "Periyar Lake, Thekkady" }],
        afternoon: [
          { time: "01:00 PM", title: "Organic Lunch at Spice Village", description: "Feast on a buffet prepared with fresh organic ingredients and spices harvested directly from the resort garden.", cost: 20, duration: "1.5 hours", location_name: "Spice Village" },
          { time: "02:30 PM", title: "Spice Plantation & Farm Tour", description: "Take a guided walk to see growing cardamom, pepper vines, cinnamon trees, cloves, and vanilla orchids.", cost: 8, duration: "2 hours", location_name: "Kumily Spice Garden" }
        ],
        evening: [{ time: "07:00 PM", title: "Kalaripayattu Martial Arts & Dinner", description: "Watch Kalaripayattu, the oldest martial art style, featuring acrobatic flips and fire weapons. Dinner at local eatery.", cost: 15, duration: "2 hours", location_name: "Kadathanadan Kalari Center" }]
      },
      {
        theme: "Kovalam Lighthouse Beach & Ayurveda",
        morning: [{ time: "09:00 AM", title: "Kovalam Beach Swimming & Surf", description: "Relax at Lighthouse Beach, Kovalam. Swim in the calm bay and visit the red-striped lighthouse at the cliff edge.", cost: 2, duration: "3 hours", location_name: "Lighthouse Beach" }],
        afternoon: [
          { time: "01:00 PM", title: "Seafood Lunch at Beach Promenade", description: "Feast on grilled prawns and fish curry with red rice overlooking the ocean waves.", cost: 22, duration: "1.5 hours", location_name: "Kovalam Beach Road" },
          { time: "02:30 PM", title: "Ayurvedic Shirodhara Massage", description: "Enjoy a traditional Ayurvedic massage with continuous warm herbal oil stream poured on your forehead.", cost: 40, duration: "2 hours", location_name: "Ayurveda Wellness Spa" }
        ],
        evening: [{ time: "07:00 PM", title: "Sree Padmanabhaswamy Temple Walk", description: "Visit the massive, gold-covered temple complex in Trivandrum, famous for its historic architectural wonders.", cost: 0, duration: "2 hours", location_name: "Padmanabhaswamy Temple" }]
      }
    ],
    bali: [
      {
        theme: "Ubud Monkey Forest & Rice Terraces",
        morning: [{ time: "09:00 AM", title: "Ubud Monkey Forest Sanctuary", description: "Walk through the sacred forest home to 700 monkeys and three old Hindu temples covered in jungle vines.", cost: 10, duration: "2 hours", location_name: "Sacred Monkey Forest, Ubud" }],
        afternoon: [
          { time: "01:00 PM", title: "Lunch at Locavore Ubud", description: "Enjoy contemporary Indonesian cuisine using locally sourced ingredients from nearby farms.", cost: 35, duration: "2 hours", location_name: "Locavore, Ubud" },
          { time: "03:30 PM", title: "Tegallalang Rice Terraces Trekking", description: "Hike along the layered green terraces and photograph the famous Bali swings over the deep valleys.", cost: 8, duration: "2.5 hours", location_name: "Tegallalang Rice Terraces" }
        ],
        evening: [{ time: "07:00 PM", title: "Balinese Dance & Warung Dinner", description: "Watch a traditional legong dance at Ubud Palace. Have dinner at Warung Ibu Oka trying the famous Babi Guling.", cost: 15, duration: "2 hours", location_name: "Ubud Royal Palace" }]
      },
      {
        theme: "Mt. Batur Sunrise Trek (Adventure)",
        morning: [{ time: "03:30 AM", title: "Mt. Batur Sunrise Volcano Hike", description: "Early morning adventure: hike up the active volcano (1,717m) to see a stunning sunrise above the clouds and Lake Batur.", cost: 45, duration: "5 hours", location_name: "Mt. Batur, Kintamani" }],
        afternoon: [
          { time: "01:00 PM", title: "Batur Natural Hot Springs & Lunch", description: "Soak your tired muscles in natural warm mineral pools by the lake. Lunch with volcano views.", cost: 20, duration: "2 hours", location_name: "Toya Devasya Hot Springs" },
          { time: "03:30 PM", title: "Balinese Luwak Coffee Plantation", description: "Visit a lush coffee farm. See how traditional coffee is roasted, and taste herbal teas and civet coffee.", cost: 5, duration: "2 hours", location_name: "Satria Coffee Plantation" }
        ],
        evening: [{ time: "07:00 PM", title: "Cozy Dinner at Bebek Bengil", description: "Dine in private bamboo gazebos surrounded by rice fields. Try Balinese crispy duck specialty.", cost: 25, duration: "2 hours", location_name: "Bebek Bengil, Ubud" }]
      },
      {
        theme: "Nusa Penida Coastal Adventure",
        morning: [{ time: "07:30 AM", title: "Speedboat to Nusa Penida Island", description: "Take a fast boat from Sanur to Nusa Penida. Drive to the famous Kelingking Beach (T-Rex Cliff).", cost: 30, duration: "3 hours", location_name: "Kelingking Beach, Nusa Penida" }],
        afternoon: [
          { time: "01:00 PM", title: "Seafood Lunch & Angel's Billabong", description: "Have a fresh grilled fish lunch. Explore the natural infinity pool of Angel's Billabong and Broken Beach.", cost: 15, duration: "2 hours", location_name: "Angel's Billabong" },
          { time: "03:00 PM", title: "Snorkeling with Manta Rays", description: "Take a boat to Manta Point. Snorkel alongside majestic, giant manta rays in crystal clear waters.", cost: 25, duration: "2.5 hours", location_name: "Manta Point, Nusa Penida" }
        ],
        evening: [{ time: "07:00 PM", title: "Return to Main Island & Dinner", description: "Return by boat. Celebrate the day with a sunset dinner at Potato Head Beach Club in Seminyak.", cost: 35, duration: "2 hours", location_name: "Potato Head Beach Club" }]
      },
      {
        theme: "Tanah Lot & Uluwatu Temple Sunset",
        morning: [{ time: "09:30 AM", title: "Tanah Lot Sea Temple", description: "Visit the iconic offshore temple sitting on a large rock stack shaped by ocean waves over centuries.", cost: 5, duration: "2.5 hours", location_name: "Tanah Lot Temple" }],
        afternoon: [
          { time: "01:00 PM", title: "Lunch at Jimbaran Bay", description: "Enjoy a beachside lunch of grilled red snapper, crabs, and squid with Balinese sambal on the sand.", cost: 25, duration: "1.5 hours", location_name: "Jimbaran Seafood Shacks" },
          { time: "03:00 PM", title: "Uluwatu Temple Cliff Walk", description: "Walk along the 70m high cliffs of Uluwatu. Meet the temple monkeys and explore the ancient Hindu shrine.", cost: 5, duration: "2.5 hours", location_name: "Uluwatu Temple" }
        ],
        evening: [{ time: "06:00 PM", title: "Kecak Fire Dance at Sunset", description: "Watch the famous Kecak Fire Dance inside a clifftop amphitheater during sunset. Return for hotel check-out/departure.", cost: 15, duration: "2.5 hours", location_name: "Uluwatu Amphitheater" }]
      }
    ],
    goa: [
      {
        theme: "Old Goa Heritage & Latin Quarter",
        morning: [{ time: "09:00 AM", title: "Basilica of Bom Jesus", description: "Explore the 16th-century UNESCO heritage basilica holding the sacred remains of St. Francis Xavier.", cost: 0, duration: "2 hours", location_name: "Basilica of Bom Jesus, Old Goa" }],
        afternoon: [
          { time: "01:00 PM", title: "Lunch at Mum's Kitchen", description: "Enjoy authentic Goan Portuguese dishes like Fish Curry Rice, Pork Vindaloo, and Vegetable Caldin.", cost: 15, duration: "1.5 hours", location_name: "Mum's Kitchen, Panaji" },
          { time: "03:00 PM", title: "Fontainhas Latin Quarter Walk", description: "Stroll past the bright yellow, blue, and green Portuguese-style villas of Fontainhas. Stop at an old bakery.", cost: 5, duration: "2.5 hours", location_name: "Fontainhas, Panaji" }
        ],
        evening: [{ time: "07:00 PM", title: "Mandovi River Cruise & Dinner", description: "Take a scenic sunset cruise on the Mandovi River with traditional Goan folk dances. Dinner at Fisherman's Wharf.", cost: 25, duration: "3 hours", location_name: "Mandovi River Jetty" }]
      },
      {
        theme: "Dudhsagar Waterfalls & Spice Farm",
        morning: [{ time: "07:30 AM", title: "Dudhsagar Waterfalls Jeep Safari", description: "Take a thrilling jeep ride through Mollem National Park. Hike and swim at the base of the massive 4-tier waterfall.", cost: 30, duration: "4 hours", location_name: "Dudhsagar Waterfalls" }],
        afternoon: [
          { time: "01:00 PM", title: "Traditional Buffet at Spice Farm", description: "Enjoy a traditional Goan buffet lunch served on banana leaves inside a tropical spice plantation.", cost: 10, duration: "1.5 hours", location_name: "Sahakari Spice Farm" },
          { time: "02:30 PM", title: "Spice Plantation Tour & Elephant Wash", description: "Take a guided walk to see growing cardamom, nutmeg, and vanilla. Participate in washing friendly elephants.", cost: 15, duration: "2.5 hours", location_name: "Sahakari Plantation" }
        ],
        evening: [{ time: "07:00 PM", title: "Vagator Beach Sunset & Dinner", description: "Watch the sunset from the cliffs of Chapora Fort. Dinner at Curlies beach shack.", cost: 20, duration: "2.5 hours", location_name: "Vagator Beach" }]
      },
      {
        theme: "Beach Watersports & Flea Market",
        morning: [{ time: "09:00 AM", title: "Calangute Beach Watersports", description: "Thrilling morning: go parasailing, jet-skiing, banana boat riding, and bumper riding on the waves.", cost: 35, duration: "3 hours", location_name: "Calangute Beach" }],
        afternoon: [
          { time: "01:00 PM", title: "Seafood Lunch at Brittos Shack", description: "Dine on the beach sand at Britto's. Savor Goan Butter Garlic Crab and local beer.", cost: 20, duration: "1.5 hours", location_name: "Baga Beach Road" },
          { time: "03:00 PM", title: "Anjuna Flea Market Shopping", description: "Browse the famous weekly beach market for jewelry, bohemian clothes, handicrafts, and souvenirs.", cost: 15, duration: "3 hours", location_name: "Anjuna Beach Market" }
        ],
        evening: [{ time: "07:00 PM", title: "Candolim Beach Sunset Walk", description: "A peaceful walk along the shoreline. Farewell beach dinner with live music and fire dancers.", cost: 25, duration: "2.5 hours", location_name: "Candolim Beach" }]
      }
    ],
    paris: [
      {
        theme: "Eiffel Tower & Seine Cruise",
        morning: [{ time: "09:00 AM", title: "Eiffel Tower Summit Climb", description: "Ascend to the top of the Eiffel Tower for panoramic views of Paris. Spot the Louvre and Arc de Triomphe.", cost: 30, duration: "3 hours", location_name: "Eiffel Tower, Champ de Mars" }],
        afternoon: [
          { time: "01:00 PM", title: "French Bistro Lunch", description: "Enjoy classic French steak-frites and onion soup at a traditional Parisian bistro.", cost: 25, duration: "1.5 hours", location_name: "Le Bistrot de la Tour" },
          { time: "02:30 PM", title: "Seine River Cruise & Champs-Élysées", description: "Take a scenic 1-hour cruise past historical bridges. Walk down the famous Champs-Élysées avenue.", cost: 18, duration: "3 hours", location_name: "Bateaux Parisiens, Seine River" }
        ],
        evening: [{ time: "07:00 PM", title: "Arc de Triomphe Sunset & Dinner", description: "Climb the Arc de Triomphe at sunset. Dinner at a cozy cafe in the lively Latin Quarter.", cost: 25, duration: "2.5 hours", location_name: "Arc de Triomphe" }]
      },
      {
        theme: "Louvre Museum & Montmartre Art",
        morning: [{ time: "09:00 AM", title: "Louvre Museum Masterpieces Tour", description: "Skip the line to see the Mona Lisa, Venus de Milo, Winged Victory, and massive French historical paintings.", cost: 22, duration: "3.5 hours", location_name: "Louvre Museum" }],
        afternoon: [
          { time: "01:00 PM", title: "Lunch at Tuileries Gardens", description: "Enjoy fresh baguettes and macarons on the green lawn of the Royal Tuileries Gardens.", cost: 12, duration: "1.5 hours", location_name: "Tuileries Gardens Cafe" },
          { time: "02:30 PM", title: "Montmartre Painters' Square Walk", description: "Hike up the cobblestone streets of Montmartre. Visit Place du Tertre where local artists paint portraits.", cost: 5, duration: "3 hours", location_name: "Montmartre District" }
        ],
        evening: [{ time: "07:00 PM", title: "Sacre-Coeur Sunset & Dinner", description: "Watch sunset from the white domes of Sacre-Coeur. Traditional French fondue dinner nearby.", cost: 30, duration: "2.5 hours", location_name: "Sacre-Coeur Basilica" }]
      },
      {
        theme: "Palace of Versailles Excursion",
        morning: [{ time: "08:30 AM", title: "Palace of Versailles Royal Tour", description: "Take the train to Versailles (20 km). Tour the Hall of Mirrors, King's State Apartments, and bedrooms.", cost: 28, duration: "4 hours", location_name: "Palace of Versailles" }],
        afternoon: [
          { time: "01:00 PM", title: "Lunch by the Grand Canal", description: "Have a picnic or dine at a canal-side restaurant inside the massive royal estate.", cost: 18, duration: "1.5 hours", location_name: "Grand Canal, Versailles" },
          { time: "02:30 PM", title: "Marie Antoinette's Estate Trek", description: "Explore the Queen's Hamlet, a rustic mock village, and the Grand Trianon marble palace inside the gardens.", cost: 10, duration: "3 hours", location_name: "Marie Antoinette Estate" }
        ],
        evening: [{ time: "07:00 PM", title: "Return to Paris & Dinner", description: "Return by train. Enjoy a fine dining French dinner in Saint-Germain-des-Prés.", cost: 40, duration: "2.5 hours", location_name: "Saint-Germain District" }]
      },
      {
        theme: "Marais District & Notre-Dame Walk",
        morning: [{ time: "09:30 AM", title: "Notre-Dame Cathedral & Sainte-Chapelle", description: "See the Gothic exterior of Notre-Dame. Visit Sainte-Chapelle to see the stunning 13th-century stained glass walls.", cost: 15, duration: "3 hours", location_name: "Sainte-Chapelle, Île de la Cité" }],
        afternoon: [
          { time: "01:00 PM", title: "Lunch in Le Marais", description: "Savor the world-famous falafel sandwich or French crepes in the historic Jewish quarter.", cost: 12, duration: "1.5 hours", location_name: "L'As du Fallafel, Le Marais" },
          { time: "02:30 PM", title: "Centre Pompidou Digital Art Museum", description: "Visit the colorful modern museum holding Europe's largest collection of contemporary and modern art.", cost: 15, duration: "2.5 hours", location_name: "Centre Pompidou" }
        ],
        evening: [{ time: "07:00 PM", title: "Galeries Lafayette Rooftop View", description: "Shop at the historic department store. Enjoy free panoramic views of Paris from the roof. Farewell dinner.", cost: 35, duration: "2.5 hours", location_name: "Galeries Lafayette Haussmann" }]
      }
    ],
    tokyo: [
      {
        theme: "Asakusa Temple & Shibuya Crossing",
        morning: [{ time: "09:00 AM", title: "Senso-ji Temple & Nakamise Street", description: "Explore Tokyo's oldest Buddhist temple (built 628). Browse Nakamise street for traditional snacks and crafts.", cost: 5, duration: "3 hours", location_name: "Senso-ji Temple, Asakusa" }],
        afternoon: [
          { time: "01:00 PM", title: "Sushi Lunch at Tsukiji", description: "Dine on fresh sashimi, nigiri, and tamagoyaki at a historic fish market counter.", cost: 20, duration: "1.5 hours", location_name: "Tsukiji Outer Market" },
          { time: "02:30 PM", title: "Shibuya Crossing & Hachiko Statue", description: "Walk across the world's busiest pedestrian crossing. View Shibuya from the high Shibuya Sky rooftop observatory.", cost: 18, duration: "3 hours", location_name: "Shibuya Sky, Shibuya" }
        ],
        evening: [{ time: "07:00 PM", title: "Shinjuku Izakaya Alley Tour", description: "Walk through Omoide Yokocho (Memory Lane), narrow alleys lit by lanterns. Savor yakitori skewers and local drinks.", cost: 25, duration: "2.5 hours", location_name: "Omoide Yokocho, Shinjuku" }]
      },
      {
        theme: "Mt. Fuji & Hakone Excursion (Adventure)",
        morning: [{ time: "08:00 AM", title: "Mt. Fuji 5th Station Trek", description: "Take the express bus to Mt. Fuji (100 km). Hike up to the 5th Station (2,300m) for close views of the peak.", cost: 25, duration: "4 hours", location_name: "Mt. Fuji 5th Station" }],
        afternoon: [
          { time: "01:00 PM", title: "Lake Ashi Pirate Boat Cruise", description: "Enjoy a hot ramen lunch. Take a cruise on a replica pirate ship across Lake Ashi, viewing Mt. Fuji reflections.", cost: 20, duration: "2 hours", location_name: "Lake Ashi, Hakone" },
          { time: "03:00 PM", title: "Hakone Ropeway & Owakudani Valley", description: "Ride the cable car over the boiling sulfur vents of Owakudani. Try the famous black eggs cooked in hot springs.", cost: 15, duration: "2 hours", location_name: "Owakudani Sulfur Valley" }
        ],
        evening: [{ time: "07:30 PM", title: "Onsen Hot Springs Bath & Return", description: "Soak in a traditional open-air natural hot spring (onsen) in Hakone before returning to Tokyo.", cost: 30, duration: "3 hours", location_name: "Hakone Yuryo Onsen" }]
      },
      {
        theme: "Digital Art & Akihabara Electronics",
        morning: [{ time: "09:30 AM", title: "teamLab Planets Digital Museum", description: "Walk barefoot through massive immersive digital art rooms with floating orchids and water projections.", cost: 28, duration: "3 hours", location_name: "teamLab Planets, Toyosu" }],
        afternoon: [
          { time: "01:00 PM", title: "Ramen Lunch at Tokyo Station", description: "Enjoy a rich bowl of Tonkotsu or Tsukemen ramen at Tokyo Ramen Street under the station.", cost: 12, duration: "1.5 hours", location_name: "Tokyo Ramen Street" },
          { time: "02:30 PM", title: "Akihabara Anime & Electronics Town", description: "Browse multi-story anime shops, retro gaming arcades, and electronics markets in the Otaku capital.", cost: 10, duration: "3.5 hours", location_name: "Akihabara Electric Town" }
        ],
        evening: [{ time: "07:00 PM", title: "Maid Cafe Dinner Experience", description: "Visit a themed maid cafe with cute food art and performances. Walk through Neon-lit streets.", cost: 25, duration: "2 hours", location_name: "Akihabara Theme Cafes" }]
      },
      {
        theme: "Meiji Shrine & Harajuku Culture",
        morning: [{ time: "09:30 AM", title: "Meiji Jingu Shrine Walk", description: "Walk under massive wooden torii gates through a peaceful forest to the sacred Meiji Shrine in Yoyogi Park.", cost: 0, duration: "2.5 hours", location_name: "Meiji Jingu, Harajuku" }],
        afternoon: [
          { time: "01:00 PM", title: "Harajuku Takeshita Street Food", description: "Savor famous sweet Harajuku crepes, rainbow cotton candy, and cheese dogs along Takeshita street.", cost: 10, duration: "1.5 hours", location_name: "Takeshita Street" },
          { time: "02:30 PM", title: "Imperial Palace East Gardens Walk", description: "Explore the ruins of Edo Castle's massive stone walls, Japanese gardens, and tea houses.", cost: 0, duration: "2.5 hours", location_name: "Imperial Palace Gardens" }
        ],
        evening: [{ time: "07:00 PM", title: "Ginza Luxury Rooftop Dinner", description: "Stroll Ginza's neon shopping district. Enjoy a final farewell dinner of Teppanyaki or Shabu-shabu.", cost: 45, duration: "2.5 hours", location_name: "Ginza District" }]
      }
    ]
  };

  // If destination is in our local catalog, use its days. Otherwise, generate 7 unique procedurally varied days.
  let itineraryDays: any[] = [];
  const cleanDestLower = destination.toLowerCase().trim();
  
  let catalogKey = "";
  if (cleanDestLower.includes("jammu")) catalogKey = "jammu";
  else if (cleanDestLower.includes("kerala") || cleanDestLower.includes("kerla")) catalogKey = "kerala";
  else if (cleanDestLower.includes("bali")) catalogKey = "bali";
  else if (cleanDestLower.includes("goa")) catalogKey = "goa";
  else if (cleanDestLower.includes("paris")) catalogKey = "paris";
  else if (cleanDestLower.includes("tokyo")) catalogKey = "tokyo";

  if (catalogKey && destinationCatalog[catalogKey]) {
    const catalogDays = destinationCatalog[catalogKey];
    itineraryDays = Array.from({ length: numDays }, (_, i) => {
      const dayNum = i + 1;
      const dateStr = new Date(new Date(dates.start).getTime() + i * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
      
      const cDay = catalogDays[i % catalogDays.length];
      return {
        day_number: dayNum,
        date: dateStr,
        theme: cDay.theme,
        morning: cDay.morning.map(m => ({ ...m, coordinates: baseCoord })),
        afternoon: cDay.afternoon.map(a => ({ ...a, coordinates: baseCoord })),
        evening: cDay.evening.map(e => ({ ...e, coordinates: baseCoord }))
      };
    });
  } else {
    // Generate up to 7 completely unique days for generic destinations to prevent repetition
    const genericThemes = [
      "Arrival & Old Town Exploration",
      "Famous Historical Landmarks Tour",
      "Nature Trek & Scenic Viewpoints",
      "Art Galleries & Craft Workshops",
      "Local Food Markets & Street Bites",
      "Hidden Gems & Local Secrets Walk",
      "Scenic Boat Cruise & Farewell Walk"
    ];
    const genericMornings = [
      { title: "Hotel Check-in & Neighborhood Orientation Walk", description: `Check into your central hotel in ${destination}. Unpack and take a relaxed stroll through nearby streets.`, cost: 0, duration: "2 hours", location_name: hotels[0]?.name || "Hotel" },
      { title: "Guided Historic Center Architecture Tour", description: `Walk through the oldest streets in ${destination} to view historic cathedrals, temples, and monument squares.`, cost: 5, duration: "3 hours", location_name: "Historic Town Center" },
      { title: "Sunrise Valley Nature Hike & Photography", description: `Wake up early for a guided nature trek up scenic hillsides to capture stunning sunrise valley views.`, cost: 10, duration: "4 hours", location_name: "Valley View Trailhead" },
      { title: "Central Open-Air Food Market Explorer", description: `Browse local stalls selling fresh spices, handcrafts, and traditional morning street food bites.`, cost: 8, duration: "2.5 hours", location_name: "Central Bazaar" },
      { title: "Traditional Coffee Roastery Tour & Tasting", description: `Learn how local beans are selected and roasted. Taste 4 different craft brews and house coffees.`, cost: 6, duration: "2 hours", location_name: "Local Roasters Club" },
      { title: "Ancient Ruins & Archeology Site Tour", description: `Explore excavated ruins and old fort structures with a certified local archeologist.`, cost: 12, duration: "3 hours", location_name: "Historic Ruins Site" },
      { title: "Leisurely Terrace Breakfast & Souvenir Packing", description: "Enjoy a final rooftop terrace breakfast. Pack your bags and checkout of the hotel.", cost: 0, duration: "2 hours", location_name: hotels[0]?.name || "Hotel" }
    ];
    const genericAfternoons = [
      {
        lunch: { title: `Lunch at ${restaurants[0]?.name || "The Golden Spice Bistro"}`, description: `Enjoy traditional regional lunch specialties like house curry and fresh organic soups.`, cost: 15, duration: "1.5 hours", location_name: restaurants[0]?.name || "Traditional Bistro" },
        activity: { title: "Art Museum & Creative Galleries Walk", description: "Visit the city's finest art museum showing classic paintings and modern installations.", cost: 12, duration: "2.5 hours", location_name: "Modern Art Museum" }
      },
      {
        lunch: { title: `Lunch at ${restaurants[1]?.name || "Sunrise Greens Café"}`, description: "Savor a healthy organic lunch thali, avocado toast, and freshly squeezed fruit juices.", cost: 12, duration: "1.5 hours", location_name: restaurants[1]?.name || "Organic Cafe" },
        activity: { title: "Handicrafts & Local Pottery Workshop", description: "Participate in a hands-on pottery class taught by a local artisan family. Keep your piece!", cost: 18, duration: "2 hours", location_name: "Artisan Workshops" }
      },
      {
        lunch: { title: `Lunch at Lake View Bistro`, description: "Enjoy fresh fish and chips or local wraps by the waterfront.", cost: 14, duration: "1 hour", location_name: "Waterfront Cafe" },
        activity: { title: "Lake/River Boat Cruise & Kayak Ride", description: `Paddle along the quiet waterways of ${destination} or enjoy a scenic deck cruise.`, cost: 22, duration: "3 hours", location_name: "Boating Marina" }
      },
      {
        lunch: { title: "Traditional Cooking Masterclass & Feast", description: "Learn to cook three local heritage dishes with a professional chef. Eat what you cook!", cost: 35, duration: "3 hours", location_name: "Culinary Studio" },
        activity: { title: "Botanical Conservatory Garden Walk", description: "Explore massive glasshouses filled with rare tropical flowers, ferns, and giant water lilies.", cost: 5, duration: "2 hours", location_name: "Royal Botanical Gardens" }
      },
      {
        lunch: { title: "Gourmet Street Food Lunch Trail", description: "Taste 6 local snacks, dumplings, and savory pastries on a guided walk through food alleys.", cost: 20, duration: "2 hours", location_name: "Food Street Market" },
        activity: { title: "Scenic Cliff Path Trekking", description: "Hike along dramatic rock cliff paths and enjoy panoramic ocean/valley vistas.", cost: 8, duration: "3 hours", location_name: "Cliff Trail" }
      },
      {
        lunch: { title: "Waterfront Seafood Lunch", description: "Enjoy freshly caught grilled fish and crab masala by the shore.", cost: 25, duration: "1.5 hours", location_name: "Beach Promenade Diner" },
        activity: { title: "Artisan Shopping Spree & Craft Buying", description: "Explore small boutique stores for authentic hand-woven textiles, local wood carvings, and jewelry.", cost: 15, duration: "3 hours", location_name: "Artisan Market Quarter" }
      },
      {
        lunch: { title: "Farewell Garden Café Lunch", description: "Enjoy a final light lunch and sweet dessert before heading out.", cost: 12, duration: "1.5 hours", location_name: "Botanical Garden Cafe" },
        activity: { title: "Transit to Airport / Train Station", description: "Board your private shuttle to the airport or train station for departure.", cost: 8, duration: "1.5 hours", location_name: "Transit Terminal" }
      }
    ];
    const genericEvenings = [
      { title: `Welcome Dinner at ${restaurants[2]?.name || "Summit View Fine Dining"}`, description: `Celebrate your first night with a gourmet dinner overlooking the sparkling city lights.`, cost: 35, duration: "2 hours", location_name: restaurants[2]?.name || "Fine Dining Restaurant" },
      { title: "Sunset Rooftop Lounge & Craft Cocktails", description: "Enjoy panoramic sunset views and craft drinks at the highest rooftop lounge in the city.", cost: 20, duration: "2 hours", location_name: "Horizon Rooftop Bar" },
      { title: "Traditional Folk Music & Dance Performance", description: "Watch a live cultural stage show featuring traditional instruments, costumes, and epic storytelling.", cost: 15, duration: "2.5 hours", location_name: "National Theatre Hall" },
      { title: "Vibrant Night Food Market Tour", description: "Explore the bustling night market. Sample local sweet desserts and hot street snacks.", cost: 12, duration: "2 hours", location_name: "Bustling Night Bazaar" },
      { title: "Riverside Promenade Sunset Stroll & Dinner", description: "Stroll along the illuminated river walk. Have a quiet dinner at a lakeside terrace restaurant.", cost: 28, duration: "2 hours", location_name: "Riverside Walks" },
      { title: "Chef's Table Fine Dining Feast", description: "Indulge in a premium 5-course tasting menu prepared by an award-winning chef.", cost: 45, duration: "2.5 hours", location_name: "Premier Kitchen Restaurant" },
      { title: "Onward Departure Journey", description: "Check in at the airport and board your flight home, taking back great memories.", cost: 0, duration: "1 hour", location_name: "Departure Gate" }
    ];

    itineraryDays = Array.from({ length: numDays }, (_, i) => {
      const dayNum = i + 1;
      const dateStr = new Date(new Date(dates.start).getTime() + i * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
      
      const idx = i % 7;
      const mAct = genericMornings[idx];
      const aLnc = genericAfternoons[idx].lunch;
      const aAct = genericAfternoons[idx].activity;
      const eAct = genericEvenings[idx];

      return {
        day_number: dayNum,
        date: dateStr,
        theme: genericThemes[idx],
        morning: [{
          time: "09:00 AM",
          title: dayNum === 1 ? "Check-in at Hotel" : mAct.title,
          description: dayNum === 1 ? `Arrive in ${destination} and check-in to your selected hotel. Rest and settle.` : mAct.description,
          cost: dayNum === 1 ? 0 : mAct.cost,
          duration: mAct.duration,
          location_name: dayNum === 1 ? (hotels[0]?.name || "Hotel") : mAct.location_name,
          coordinates: baseCoord
        }],
        afternoon: [
          {
            time: "01:00 PM",
            title: aLnc.title,
            description: aLnc.description,
            cost: aLnc.cost,
            duration: aLnc.duration,
            location_name: aLnc.location_name,
            coordinates: baseCoord
          },
          {
            time: "03:00 PM",
            title: aAct.title,
            description: aAct.description,
            cost: aAct.cost,
            duration: aAct.duration,
            location_name: aAct.location_name,
            coordinates: baseCoord
          }
        ],
        evening: [{
          time: "07:00 PM",
          title: eAct.title,
          description: eAct.description,
          cost: eAct.cost,
          duration: eAct.duration,
          location_name: eAct.location_name,
          coordinates: baseCoord
        }]
      };
    });
  }

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
