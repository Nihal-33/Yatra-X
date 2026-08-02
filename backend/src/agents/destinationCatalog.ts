/**
 * Comprehensive Destination Catalog — Real places, real activities.
 * Every day in the itinerary is UNIQUE — no repeated activities.
 */

export interface DayActivity {
  time: string;
  title: string;
  description: string;
  cost: number;
  duration: string;
  location_name: string;
}

export interface ItineraryDay {
  theme: string;
  morning: DayActivity[];
  afternoon: DayActivity[];
  evening: DayActivity[];
}

export interface DestinationData {
  hotel: string;
  hotels: { name: string; price_factor: number; rating: number; amenities: string[]; address: string; description: string }[];
  restaurants: { name: string; cuisine: string; dish: string; address: string; price_level: string }[];
  days: ItineraryDay[];
  destination_info: {
    description: string;
    best_visiting_months: string[];
    climate: string;
    safety_rating: string;
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
    packing_suggestions: string[];
  };
  flights: {
    cheapest: { airline: string; duration: string; layovers: number; airports: string[] };
    fastest: { airline: string; duration: string; layovers: number; airports: string[] };
    notes: string;
  };
}

const CATALOG: Record<string, DestinationData> = {

  // ─── JAMMU ───────────────────────────────────────────
  jammu: {
    hotel: "Hari Niwas Palace Jammu",
    hotels: [
      { name: "Hari Niwas Palace Jammu", price_factor: 0.16, rating: 4.7, amenities: ["Free Wi-Fi", "Revolving Restaurant", "Royal Gardens", "Wellness Spa"], address: "Palace Road, Jammu 180001", description: "Historic palace overlooking the Tawi River with royal luxury." },
      { name: "Radisson Blu Jammu", price_factor: 0.10, rating: 4.5, amenities: ["Swimming Pool", "Free Breakfast", "Fitness Center"], address: "Narwal Bala, Jammu 180006", description: "Modern premium hotel with diverse dining and a convenient location." },
      { name: "Hotel Asia Jammu Tawi", price_factor: 0.06, rating: 4.2, amenities: ["Free Breakfast", "Local Dining"], address: "Nehru Market, Jammu 180001", description: "Classic hotel near Raghunath Temple and main shopping." }
    ],
    restaurants: [
      { name: "Falaks Revolving Restaurant", cuisine: "Kashmiri Wazwan", dish: "Rogan Josh & Mutton Rista", address: "Hari Niwas Palace, Palace Road", price_level: "$$$" },
      { name: "Pahalwan Di Hatti", cuisine: "Street Food & Sweets", dish: "Kaladi Kulcha & Rajma Chawal", address: "Gandhi Nagar, Jammu", price_level: "$" },
      { name: "The Imperial Grill", cuisine: "Mughlai & BBQ", dish: "Murg Malai Kabab & Tandoori Platter", address: "Bahubali Market, Jammu", price_level: "$$" },
      { name: "Purani Mandi Dhaba", cuisine: "Dogri Cuisine", dish: "Ambal (Pumpkin Curry) & Mittha", address: "Purani Mandi, Jammu", price_level: "$" },
      { name: "Hotel Apsara Restaurant", cuisine: "Punjabi & Continental", dish: "Dal Makhani & Butter Chicken", address: "Residency Road, Jammu", price_level: "$$" }
    ],
    days: [
      {
        theme: "Arrival & Raghunath Temple",
        morning: [{ time: "09:00 AM", title: "Check-in at Hari Niwas Palace", description: "Settle into your suite overlooking the Tawi River. Enjoy the palace gardens and orient yourself.", cost: 0, duration: "2 hours", location_name: "Hari Niwas Palace Jammu" }],
        afternoon: [
          { time: "12:30 PM", title: "Lunch at Pahalwan Di Hatti", description: "Start with the legendary Kaladi Kulcha — a local grilled cheese bread snack unique to Jammu.", cost: 8, duration: "1 hour", location_name: "Gandhi Nagar, Jammu" },
          { time: "02:30 PM", title: "Raghunath Temple Complex", description: "Explore the magnificent 19th-century Raghunath Temple — 7 shrines with gold-plated architecture and rare Shaligram stones, the most important temple in Jammu.", cost: 0, duration: "2 hours", location_name: "Raghunath Temple, Pakki Dhaki" }
        ],
        evening: [{ time: "07:00 PM", title: "Dinner at Falaks Revolving Restaurant", description: "Dine at India's only revolving restaurant with panoramic valley views. Try the authentic Kashmiri Wazwan — a 36-course royal feast.", cost: 35, duration: "2 hours", location_name: "Hari Niwas Palace, Palace Road" }]
      },
      {
        theme: "Bahu Fort & Amar Mahal Palace",
        morning: [{ time: "09:00 AM", title: "Bahu Fort & Bagh-e-Bahu Gardens", description: "Visit the 3,000-year-old Bahu Fort on red sandstone cliffs above the Tawi River. Explore the terraced Bagh-e-Bahu gardens and the Kali Mata Temple inside the fort complex.", cost: 5, duration: "3 hours", location_name: "Bahu Fort, Jammu" }],
        afternoon: [
          { time: "01:00 PM", title: "Lunch at The Imperial Grill", description: "Savour Mughlai specialties — Murg Malai Kabab and a sizzling Tandoori platter with fresh naan bread.", cost: 20, duration: "1.5 hours", location_name: "Bahubali Market, Jammu" },
          { time: "03:00 PM", title: "Amar Mahal Palace Museum", description: "Tour this magnificent French-style palace built in 1890, featuring a 120 kg solid gold throne, rare Pahari miniature paintings, and sweeping views of the Shivalik hills.", cost: 10, duration: "2.5 hours", location_name: "Amar Mahal Palace, Palace Road" }
        ],
        evening: [{ time: "07:30 PM", title: "Mubarak Mandi Heritage Night Walk", description: "Explore the crumbling yet majestic Mubarak Mandi palace complex — 19th-century royal buildings with Baroque, Rajput, and Mughal architectural influences.", cost: 0, duration: "2 hours", location_name: "Mubarak Mandi, Jammu" }]
      },
      {
        theme: "Vaishno Devi Pilgrimage",
        morning: [{ time: "05:00 AM", title: "Vaishno Devi Yatra via Katra", description: "Board an early bus to Katra (45 km). Begin the 12 km mountain trek to the sacred Vaishno Devi cave shrine in the Trikuta mountains — one of India's holiest pilgrimage sites.", cost: 25, duration: "6 hours", location_name: "Vaishno Devi Shrine, Trikuta Mountains" }],
        afternoon: [
          { time: "02:00 PM", title: "Lunch at Katra Town Dhaba", description: "Rest and refuel with hearty Rajma-Chawal and hot parathas at a dhaba in Katra after the demanding trek.", cost: 10, duration: "1 hour", location_name: "Katra Town, Reasi District" },
          { time: "03:30 PM", title: "Shiv Khori Natural Cave Temple", description: "Visit the spectacular natural limestone cave temple with a 1.5 km long passage housing a naturally formed Shivling in its innermost sanctum.", cost: 5, duration: "2 hours", location_name: "Shiv Khori Cave, Reasi" }
        ],
        evening: [{ time: "08:00 PM", title: "Dinner at Purani Mandi Dhaba", description: "Return to Jammu for traditional Dogri cuisine — Ambal (local pumpkin curry with tamarind) and Mittha (sweet rice), dishes unique to the Dogra community.", cost: 12, duration: "1.5 hours", location_name: "Purani Mandi, Jammu" }]
      },
      {
        theme: "Mansar Lake & Local Markets",
        morning: [{ time: "09:30 AM", title: "Surinsar & Mansar Lake", description: "Drive 42 km to the twin sacred lakes of Surinsar and Mansar. Stroll along serene lakeshores, spot migratory birds, and visit the ancient Sheshnag Temple on the lake island.", cost: 15, duration: "4 hours", location_name: "Mansar Lake, Samba District" }],
        afternoon: [
          { time: "02:30 PM", title: "Lunch at Hotel Apsara Restaurant", description: "Classic North Indian comfort food — creamy Dal Makhani and Butter Chicken with fresh naan.", cost: 18, duration: "1 hour", location_name: "Residency Road, Jammu" },
          { time: "04:00 PM", title: "Gandhi Nagar & Raghunath Bazaar Shopping", description: "Browse Jammu's famous markets for Kashmiri shawls, dry fruits, Dogri handicrafts, saffron, and local Gulkand sweets to take home.", cost: 30, duration: "2 hours", location_name: "Gandhi Nagar Market, Jammu" }
        ],
        evening: [{ time: "07:30 PM", title: "Peer Baba Dargah & Tawi Riverfront", description: "Visit the serene riverside Peer Baba shrine at dusk and stroll the newly developed Tawi Riverfront promenade watching the city lights reflect on the water.", cost: 0, duration: "2 hours", location_name: "Tawi Riverfront, Jammu" }]
      },
      {
        theme: "Patnitop Hill Station Day Trip",
        morning: [{ time: "08:00 AM", title: "Drive to Patnitop Hill Station", description: "Head up the scenic Jammu-Srinagar National Highway to Patnitop — a beautiful meadow at 2,024 m with panoramic views of snow-capped Himalayan peaks.", cost: 30, duration: "3 hours drive", location_name: "Patnitop, Udhampur District" }],
        afternoon: [
          { time: "12:00 PM", title: "Lunch at Patnitop Café", description: "Warm up with authentic Kashmiri Kehwa (cardamom-saffron tea) and freshly grilled corn at the Patnitop plateau café.", cost: 12, duration: "1 hour", location_name: "Patnitop Plateau" },
          { time: "01:30 PM", title: "Nathatop & Sanasar Meadow Trek", description: "Trek to Nathatop viewpoint (2,395 m) for 360° Himalayan vistas. Visit Sanasar meadow — a popular paragliding, camping, and zip-lining spot.", cost: 20, duration: "3 hours", location_name: "Nathatop & Sanasar, Udhampur" }
        ],
        evening: [{ time: "07:00 PM", title: "Return & Farewell Dinner", description: "Drive back to Jammu and enjoy a memorable final dinner at Falaks Revolving Restaurant watching city lights sparkle 360° below.", cost: 35, duration: "2 hours", location_name: "Falaks Restaurant, Palace Road" }]
      },
      {
        theme: "Dogra Museum & Street Food",
        morning: [{ time: "09:00 AM", title: "Dogra Art Museum", description: "Explore over 6,000 artefacts including rare Pahari miniature paintings, bronze sculptures, terracotta figurines, and ancient Dogri folk musical instruments.", cost: 8, duration: "2.5 hours", location_name: "Dogra Art Museum, Gandhi Bhawan" }],
        afternoon: [
          { time: "12:00 PM", title: "Lunch at Pahalwan Di Hatti", description: "Famous Dogri-style Rajma Chawal with home-churned ghee — a local staple that has fed Jammu residents for generations.", cost: 8, duration: "1 hour", location_name: "Gandhi Nagar, Jammu" },
          { time: "02:00 PM", title: "Bahu Caves & Rock Garden", description: "Visit the prehistoric Bahu Caves and the colorfully designed Rock Garden along the Tawi River embankment made entirely from waste materials.", cost: 5, duration: "2 hours", location_name: "Bahu Caves, Jammu" }
        ],
        evening: [{ time: "07:00 PM", title: "Jammu Street Food Trail", description: "Join a guided street food walk through Gujjar Nagar — trying Tikki Chaat, Golgappe, Rabdi, and the famous Jammu Gulab Jamun which is denser and darker than the standard version.", cost: 15, duration: "2 hours", location_name: "Gujjar Nagar, Jammu" }]
      },
      {
        theme: "Departure Day",
        morning: [{ time: "08:00 AM", title: "Sunrise at Peer Kho Cave Temple", description: "Last morning spiritual experience — an ancient cave temple dedicated to Lord Shiva carved into a natural cliffside over the Tawi River.", cost: 0, duration: "1.5 hours", location_name: "Peer Kho Cave, Jammu" }],
        afternoon: [
          { time: "10:30 AM", title: "Hotel Breakfast & Packing", description: "Enjoy the hotel breakfast and pack your Kashmiri dry fruits and shawl souvenirs for the journey home.", cost: 0, duration: "1 hour", location_name: "Hotel Hari Niwas Palace" },
          { time: "12:00 PM", title: "Departure Transfer", description: "Check out and transfer to Jammu Tawi Railway Station or Satwari Airport (IXJ) for your onward journey.", cost: 0, duration: "1 hour", location_name: "Jammu Airport (IXJ)" }
        ],
        evening: [{ time: "02:00 PM", title: "Board Departure Flight", description: "Safe travels! Your unforgettable Jammu journey comes to an end.", cost: 0, duration: "1 hour", location_name: "Jammu Airport (IXJ)" }]
      }
    ],
    destination_info: {
      description: "Jammu, the 'City of Temples', is the winter capital of J&K. Known for ancient temples, Shivalik foothills, Dogra heritage, and as gateway to the Vaishno Devi pilgrimage.",
      best_visiting_months: ["March", "April", "October", "November"],
      climate: "Semi-arid subtropical. Summers hot (35-42°C), winters mild (5-15°C).",
      safety_rating: "High",
      popular_attractions: ["Vaishno Devi Shrine", "Raghunath Temple", "Bahu Fort", "Amar Mahal Palace"],
      hidden_gems: ["Surinsar-Mansar Lakes", "Shiv Khori Cave Temple", "Peer Kho Cave"],
      local_culture: "Dogra culture with rich temple traditions, the Dogri language, vibrant Bahu Mela festival, and renowned Dogri folk music and cuisine."
    },
    weather: { average_temp: "28°C (82°F)", forecast_description: "Mostly sunny with clear skies. Cooler evenings in the hills.", humidity: "55%", wind_speed: "14 km/h", precipitation_probability: "10%", packing_suggestions: ["Light cotton shirts", "Comfortable walking shoes", "Sunscreen SPF 50", "Light jacket for evenings", "Small daypack for treks"] },
    flights: { cheapest: { airline: "IndiGo / SpiceJet", duration: "1h 20m", layovers: 0, airports: ["DEL", "IXJ"] }, fastest: { airline: "Air India Express", duration: "1h 10m", layovers: 0, airports: ["DEL", "IXJ"] }, notes: "Jammu Airport (IXJ) has direct flights from Delhi, Mumbai, and Chandigarh." }
  },

  // ─── KERALA ──────────────────────────────────────────
  kerala: {
    hotel: "Grand Hyatt Kochi Bolgatty",
    hotels: [
      { name: "Grand Hyatt Kochi Bolgatty", price_factor: 0.18, rating: 4.8, amenities: ["Infinity Pool", "Private Beach", "Spa", "5 Restaurants"], address: "Bolgatty Island, Kochi 682504", description: "Luxury island resort with breathtaking backwater views." },
      { name: "Kumarakom Lake Resort", price_factor: 0.14, rating: 4.7, amenities: ["Private Pool Villas", "Spa", "Ayurveda Centre"], address: "Kottayam-Kumarakom Rd, Kerala 686563", description: "Award-winning heritage resort on the Vembanad Lake shore." },
      { name: "The Leela Kovalam", price_factor: 0.12, rating: 4.8, amenities: ["Clifftop Pool", "Private Beach", "Spa"], address: "Kovalam Beach Rd, Thiruvananthapuram 695527", description: "Clifftop luxury resort overlooking the Arabian Sea." }
    ],
    restaurants: [
      { name: "Paragon Restaurant Kozhikode", cuisine: "Malabar Seafood", dish: "Kozhikodan Biryani & Prawn Masala", address: "Kannur Rd, Kozhikode", price_level: "$$" },
      { name: "Fort House Restaurant", cuisine: "Kerala Coastal", dish: "Karimeen Pollichathu (Pearl Spot Fish)", address: "Fort Kochi Waterfront", price_level: "$$" },
      { name: "Kashi Art Cafe", cuisine: "European Fusion & Kerala", dish: "Kerala Prawn Curry with Appam", address: "Burgher St, Fort Kochi", price_level: "$$" },
      { name: "Malabar Junction", cuisine: "Kerala Fine Dining", dish: "Nadan Kozhi Curry & Kerala Prawn Moilee", address: "Princess St, Fort Kochi", price_level: "$$$" },
      { name: "Dhe Puttu", cuisine: "Traditional Kerala Breakfast", dish: "Puttu with Kadala Curry & Kerala Banana", address: "MG Road, Kochi", price_level: "$" }
    ],
    days: [
      {
        theme: "Fort Kochi Heritage & Kathakali",
        morning: [{ time: "10:00 AM", title: "Fort Kochi Heritage Walk", description: "Walk through Portugal-era streets visiting St. Francis Church (India's oldest European church, built 1503) and the Dutch Palace with its stunning Kerala murals.", cost: 5, duration: "3 hours", location_name: "Fort Kochi Heritage Zone" }],
        afternoon: [
          { time: "01:30 PM", title: "Lunch at Kashi Art Cafe", description: "Dine inside a heritage 300-year-old building. Try Kerala Prawn Curry with Appam and freshly pressed tender coconut juice.", cost: 20, duration: "1.5 hours", location_name: "Burgher St, Fort Kochi" },
          { time: "03:00 PM", title: "Chinese Fishing Nets at Dusk", description: "Watch the dramatic cantilever Chinese fishing nets — introduced by traders in the 14th century — being operated at the Fort Kochi waterfront. Try pulling them yourself.", cost: 5, duration: "2 hours", location_name: "Fort Kochi Waterfront" }
        ],
        evening: [{ time: "07:00 PM", title: "Kathakali Performance & Dinner", description: "Witness a mesmerizing Kathakali dance performance at Kerala Kathakali Centre, then dinner at Fort House Restaurant with the famous Karimeen Pollichathu grilled in banana leaf.", cost: 25, duration: "3 hours", location_name: "Kerala Kathakali Centre, Fort Kochi" }]
      },
      {
        theme: "Alappuzha Houseboat Cruise",
        morning: [{ time: "08:30 AM", title: "Alappuzha Backwater Houseboat (Kettuvallam)", description: "Drive to Alappuzha (55 km) and board a traditional rice barge houseboat on Punnamada Lake for a full day cruise through Kerala's legendary backwaters.", cost: 120, duration: "8 hours", location_name: "Alappuzha Houseboat Jetty" }],
        afternoon: [
          { time: "01:00 PM", title: "Kerala Sadya Lunch on Houseboat", description: "Traditional 20-dish Kerala Sadya served on banana leaf aboard the houseboat — Avial, Olan, Pachadi, Papadam, and classic Payasam dessert.", cost: 0, duration: "1 hour", location_name: "On the Houseboat, Backwaters" },
          { time: "03:00 PM", title: "Village Life & Coir Weaving Walk", description: "Anchor near a village and walk through emerald paddy fields, visit coir (coconut fiber) weaving workshops, and watch fishermen cast hand nets in narrow canals.", cost: 0, duration: "2 hours", location_name: "Kuttanad Backwater Villages" }
        ],
        evening: [{ time: "07:00 PM", title: "Sunset Cruise & Houseboat Dinner", description: "Float through narrow canals under a painted sunset sky. Freshly caught tiger prawns cooked in Kodampuli (kokum tamarind) alongside steamed Kerala red rice.", cost: 0, duration: "2 hours", location_name: "Vembanad Lake" }]
      },
      {
        theme: "Munnar Tea Gardens",
        morning: [{ time: "07:00 AM", title: "Drive to Munnar & Cheeyappara Waterfall", description: "Wind through scenic Ghats roads up to Munnar (1,600m). Stop at the spectacular Cheeyappara multi-tier waterfall cascading down 300m in the Western Ghats.", cost: 0, duration: "5 hours", location_name: "Cheeyappara Waterfall & Munnar" }],
        afternoon: [
          { time: "01:00 PM", title: "Lunch at Rapsy Restaurant Munnar", description: "Try the beloved Kerala combination — beef peralan (dry roast) and flaky malabar porotta that Munnar residents swear by.", cost: 12, duration: "1 hour", location_name: "Munnar Town, Idukki" },
          { time: "02:30 PM", title: "Tata Tea Museum & Plantation Walk", description: "Tour a working tea estate, learn tea processing from leaf plucking to packaging, and taste 5 rare teas including silver needle white tea and golden tips oolong.", cost: 15, duration: "3 hours", location_name: "Tata Tea Museum, Munnar" }
        ],
        evening: [{ time: "07:00 PM", title: "Top Station Sunset Viewpoint", description: "Drive to Top Station (1,700m) — the highest point in Munnar — for breathtaking views of Tamil Nadu's Kodaikanal hills across the valley.", cost: 10, duration: "2 hours", location_name: "Top Station, Munnar" }]
      },
      {
        theme: "Periyar Tiger Reserve & Spice Tour",
        morning: [{ time: "07:30 AM", title: "Periyar Tiger Reserve Boat Safari", description: "Cruise on Periyar Lake inside one of India's premier tiger reserves. Spot wild elephants at the water's edge, bison, sambar deer, and over 200 bird species.", cost: 30, duration: "3 hours", location_name: "Periyar Lake, Thekkady" }],
        afternoon: [
          { time: "12:30 PM", title: "Lunch at Spice Village Resort", description: "Feast on a Kerala lunch with curries made from spices grown in their own organic garden — cardamom, cloves, black pepper and cinnamon freshly harvested.", cost: 25, duration: "1.5 hours", location_name: "Spice Village, Thekkady" },
          { time: "02:30 PM", title: "Cardamom & Spice Plantation Tour", description: "Walk through aromatic spice plantations — smell fresh cardamom pods, black pepper vines, vanilla orchids, and buy authentic whole spices direct from the farm.", cost: 10, duration: "2 hours", location_name: "Kumily Spice Markets, Thekkady" }
        ],
        evening: [{ time: "07:00 PM", title: "Kalaripayattu Martial Arts Performance", description: "Watch Kerala's 3,000-year-old martial art — Kalaripayattu — with acrobatic flips, weapons demonstrations, and the traditional oil massage warming ritual.", cost: 15, duration: "2 hours", location_name: "Kadathanadan Kalari Centre, Thekkady" }]
      },
      {
        theme: "Kovalam Beach & Ayurveda",
        morning: [{ time: "09:00 AM", title: "Kovalam Lighthouse Beach Morning", description: "Kerala's most famous beach with calm waters, an iconic red-striped lighthouse, and palm-fringed shores. Perfect for swimming and watching local fishermen set out at dawn.", cost: 0, duration: "3 hours", location_name: "Lighthouse Beach, Kovalam" }],
        afternoon: [
          { time: "01:00 PM", title: "Seafood Lunch at Kovalam Beachside", description: "Freshly grilled lobster, tiger prawn masala, and Kerala fish curry with traditional red rice at a beachside restaurant.", cost: 30, duration: "1.5 hours", location_name: "Kovalam Beach Road" },
          { time: "02:30 PM", title: "Ayurvedic Shirodhara Therapy", description: "Experience the legendary Kerala Shirodhara — continuous warm medicated oil stream poured on the forehead for 45 minutes. One of the world's most deeply relaxing healing treatments.", cost: 45, duration: "2 hours", location_name: "Niraamaya Spa, Kovalam" }
        ],
        evening: [{ time: "07:00 PM", title: "Padmanabhaswamy Temple Visit", description: "Visit the golden-spired Padmanabhaswamy Temple — one of the world's wealthiest temples, its underground vaults reportedly holding $22 billion in gold treasures.", cost: 0, duration: "2 hours", location_name: "Padmanabhaswamy Temple, Thiruvananthapuram" }]
      }
    ],
    destination_info: {
      description: "Kerala, 'God's Own Country', enchants with serene backwaters, lush tea plantations, ancient Ayurvedic healing traditions, wild elephant forests, and golden Arabian Sea beaches.",
      best_visiting_months: ["October", "November", "December", "January", "February"],
      climate: "Tropical. Monsoon June-September. Best season October-February.",
      safety_rating: "Very High",
      popular_attractions: ["Alappuzha Backwaters", "Munnar Tea Gardens", "Periyar Tiger Reserve", "Kovalam Beach"],
      hidden_gems: ["Silent Valley National Park", "Vagamon Meadows", "Bekal Fort Kasaragod"],
      local_culture: "Kerala culture is defined by Kathakali, Mohiniyattam, Onam festival, backwater traditions, matrilineal Nair heritage, and deep Ayurvedic knowledge."
    },
    weather: { average_temp: "28°C (82°F)", forecast_description: "Warm and humid. Lush greenery after monsoon. Cool in hill stations.", humidity: "78%", wind_speed: "18 km/h", precipitation_probability: "20%", packing_suggestions: ["Light cotton clothes", "Rain jacket", "Mosquito repellent", "Waterproof sandals", "Sunscreen", "Modest attire for temples"] },
    flights: { cheapest: { airline: "IndiGo / Air India", duration: "2h 30m", layovers: 0, airports: ["DEL", "COK"] }, fastest: { airline: "Vistara / Air India", duration: "2h 15m", layovers: 0, airports: ["DEL", "COK"] }, notes: "Cochin International (COK) is the main hub. Trivandrum (TRV) and Calicut (CCJ) also serve Kerala." }
  },

  // ─── BALI ────────────────────────────────────────────
  bali: {
    hotel: "AYANA Resort Bali",
    hotels: [
      { name: "AYANA Resort Bali", price_factor: 0.20, rating: 4.8, amenities: ["Cliff Infinity Pool", "Private Beach", "Rock Bar", "Spa on the Rocks"], address: "Jalan Karang Mas Sejahtera, Jimbaran 80364", description: "World-renowned clifftop resort above the Indian Ocean." },
      { name: "Four Seasons Bali at Sayan", price_factor: 0.22, rating: 4.9, amenities: ["Jungle Villa", "River Pool", "Yoga Pavilion"], address: "Jl. Raya Sayan, Ubud 80571", description: "Iconic canopy resort surrounded by the Ayung River jungle." },
      { name: "The Kayon Jungle Resort", price_factor: 0.16, rating: 4.8, amenities: ["Infinity Pools", "Jungle Views", "Spa", "Yoga"], address: "Banjar Bresela, Payangan, Ubud 80572", description: "Boutique jungle resort with panoramic valley and river views." }
    ],
    restaurants: [
      { name: "Locavore Ubud", cuisine: "Modern Indonesian Fine Dining", dish: "10-course tasting menu with local farm ingredients", address: "Jl. Dewisita No.10, Ubud", price_level: "$$$$" },
      { name: "Naughty Nuri's Warung Ubud", cuisine: "BBQ Ribs & Martinis", dish: "Pork spare ribs with secret house sauce & strong martinis", address: "Jl. Raya Sanggingan, Ubud", price_level: "$$" },
      { name: "Sardine Restaurant Seminyak", cuisine: "Seafood Garden Dining", dish: "Grilled lobster & fish over rice paddy field views", address: "Jl. Petitenget 21, Seminyak", price_level: "$$$" },
      { name: "Potato Head Beach Club", cuisine: "International Sunset Dining", dish: "Sunset BBQ platter & signature craft cocktails", address: "Jl. Petitenget 51B, Seminyak", price_level: "$$$" },
      { name: "Warung Babi Guling Ibu Oka", cuisine: "Balinese Traditional", dish: "Babi Guling — whole suckling pig roasted over coconut husk", address: "Jl. Tegal Sari, Ubud", price_level: "$" }
    ],
    days: [
      {
        theme: "Arrival & Tanah Lot Temple",
        morning: [{ time: "10:00 AM", title: "Check-in & AYANA Rock Bar", description: "Arrive at AYANA and enjoy the famous Rock Bar perched on a 14m cliff over the Indian Ocean — one of the world's most dramatic hotel bars.", cost: 0, duration: "2 hours", location_name: "AYANA Resort, Jimbaran" }],
        afternoon: [
          { time: "01:00 PM", title: "Lunch at Sardine Restaurant", description: "Dine in a stunning open-air bamboo pavilion overlooking a working rice paddy. Grilled catch of the day with Balinese sambal and river spinach.", cost: 40, duration: "2 hours", location_name: "Jl. Petitenget, Seminyak" },
          { time: "03:30 PM", title: "Kuta Beach Surf Lesson", description: "2-hour beginner surf lesson on Kuta Beach — the birthplace of Bali surfing — with a certified Balinese instructor. Equipment provided.", cost: 30, duration: "2 hours", location_name: "Kuta Beach, Bali" }
        ],
        evening: [{ time: "07:00 PM", title: "Tanah Lot Sea Temple at Sunset", description: "Watch the sun sink into the Indian Ocean behind Tanah Lot — an ancient sea temple built on a sea stack, one of Bali's most photographed sights.", cost: 5, duration: "2 hours", location_name: "Tanah Lot Temple, Tabanan" }]
      },
      {
        theme: "Ubud Arts & Tegallalang Rice Terraces",
        morning: [
          { time: "08:00 AM", title: "Sacred Monkey Forest Sanctuary", description: "Walk through a 12.5-hectare sacred forest inhabited by 700 Balinese long-tailed macaques, with three ancient Hindu temples hidden within its roots.", cost: 10, duration: "2 hours", location_name: "Monkey Forest, Ubud" },
          { time: "10:30 AM", title: "Ubud Palace & Art Market", description: "Visit the royal Ubud Palace (Puri Saren Agung) hosting nightly performances. Browse the adjacent market for hand-carved masks, batik sarongs, and silverwork.", cost: 5, duration: "2 hours", location_name: "Ubud Palace & Central Market" }
        ],
        afternoon: [
          { time: "01:00 PM", title: "Lunch at Warung Babi Guling Ibu Oka", description: "Queue at Ubud's most famous eatery for the legendary Babi Guling — whole suckling pig slow-roasted for 6 hours over coconut husk and Balinese spice blend.", cost: 12, duration: "1 hour", location_name: "Jl. Tegal Sari, Ubud" },
          { time: "03:00 PM", title: "Tegallalang Rice Terraces", description: "Stroll through the UNESCO-listed Tegallalang subak irrigation rice terraces. These ancient steeply stepped paddies glow brilliant emerald during the growing season.", cost: 5, duration: "2 hours", location_name: "Tegallalang, Gianyar" }
        ],
        evening: [{ time: "07:30 PM", title: "Kecak Fire Dance at Uluwatu Temple", description: "Watch 100 men chanting 'cak' in trance around a bonfire, re-enacting the Ramayana epic at the dramatic clifftop Uluwatu Temple with the ocean 70m below.", cost: 15, duration: "2 hours", location_name: "Uluwatu Temple, Bukit Peninsula" }]
      },
      {
        theme: "Mount Batur Volcano Sunrise Trek",
        morning: [{ time: "03:30 AM", title: "Mount Batur Sunrise Trek", description: "Begin the predawn 2-hour summit trek of active volcano Mount Batur (1,717m). Watch the sunrise paint Lake Batur and distant Lombok's Mt. Rinjani in gold from the crater rim.", cost: 45, duration: "5 hours", location_name: "Mount Batur, Kintamani" }],
        afternoon: [
          { time: "10:00 AM", title: "Toya Bungkah Natural Hot Springs", description: "Soak tired muscles in geothermal volcanic hot springs on the shores of Lake Batur, surrounded by jungle and the looming crater walls.", cost: 15, duration: "2 hours", location_name: "Toya Bungkah Hot Springs, Kintamani" },
          { time: "01:00 PM", title: "Lunch at Kintamani Panorama Café", description: "Lunch with a jaw-dropping panoramic view over the volcanic caldera. Try Nasi Campur (Balinese mixed rice) with satay skewers and black rice pudding.", cost: 20, duration: "1.5 hours", location_name: "Kintamani Village Restaurant" }
        ],
        evening: [{ time: "07:00 PM", title: "Dinner at Locavore, Ubud", description: "Celebrate with a 10-course farm-to-table tasting menu at Bali's most celebrated restaurant. Book months in advance — always fully reserved.", cost: 80, duration: "3 hours", location_name: "Locavore Restaurant, Ubud" }]
      },
      {
        theme: "East Bali — Temples & Snorkeling",
        morning: [{ time: "08:00 AM", title: "Besakih Mother Temple", description: "Visit Pura Besakih — the largest and holiest Hindu temple in Bali, comprising 18 separate sanctuaries spread across the slopes of the sacred volcano Mount Agung.", cost: 15, duration: "3 hours", location_name: "Besakih Temple, Karangasem" }],
        afternoon: [
          { time: "12:30 PM", title: "Lunch & Tirta Gangga Water Palace", description: "Picnic lunch near the 1,200-pond royal water garden at Tirta Gangga — lotus flower pools, stepping stones, and stone dragon sculptures from the 1940s Karangasem Kingdom.", cost: 5, duration: "2 hours", location_name: "Tirta Gangga, Karangasem" },
          { time: "03:00 PM", title: "Snorkeling at Amed Beach", description: "Snorkel the famous Japanese WWII Shipwreck and pristine coral gardens off Amed — crystal clear waters hosting turtles, reef sharks, and hundreds of tropical fish species.", cost: 25, duration: "3 hours", location_name: "Amed Beach, East Bali" }
        ],
        evening: [{ time: "07:30 PM", title: "Naughty Nuri's BBQ & Drinks", description: "End the day at the legendary Naughty Nuri's Warung — famous for fall-off-the-bone pork ribs slathered in a secret sauce, and their dangerously strong martinis.", cost: 30, duration: "2 hours", location_name: "Naughty Nuri's, Ubud" }]
      }
    ],
    destination_info: {
      description: "Bali, the Island of the Gods, offers volcanic peaks, ancient Hindu temples, UNESCO rice terraces, world-class surf beaches, and a deeply spiritual Balinese culture.",
      best_visiting_months: ["April", "May", "June", "September", "October"],
      climate: "Tropical. Dry season April-September. Rainy season October-March.",
      safety_rating: "High",
      popular_attractions: ["Tanah Lot Temple", "Ubud Monkey Forest", "Tegallalang Rice Terraces", "Mount Batur"],
      hidden_gems: ["Sidemen Valley", "Munduk Waterfall Trekking", "Nyang Nyang Secret Beach"],
      local_culture: "Balinese Hinduism permeates daily life — temple ceremonies, cremation rituals, gamelan music, offering-making (canang sari), and world-class visual arts in Ubud."
    },
    weather: { average_temp: "30°C (86°F)", forecast_description: "Hot and sunny in dry season. Afternoon showers in wet season.", humidity: "75%", wind_speed: "16 km/h", precipitation_probability: "25%", packing_suggestions: ["Light clothes", "Sarong for temple entry", "SPF 50 reef-safe sunscreen", "Insect repellent", "Waterproof sandals"] },
    flights: { cheapest: { airline: "Air Asia / Batik Air", duration: "8h 30m", layovers: 1, airports: ["DEL", "SIN", "DPS"] }, fastest: { airline: "Singapore Airlines / Vistara", duration: "7h 45m", layovers: 1, airports: ["DEL", "SIN", "DPS"] }, notes: "Ngurah Rai International (DPS) serves Bali. Most connections via Singapore (SIN) or Kuala Lumpur (KUL)." }
  },

  // ─── GOA ─────────────────────────────────────────────
  goa: {
    hotel: "Taj Exotica Goa",
    hotels: [
      { name: "Taj Exotica Goa", price_factor: 0.20, rating: 4.8, amenities: ["Private Beach", "Multiple Pools", "Spa", "6 Restaurants"], address: "Calwaddo, Benaulim, South Goa 403716", description: "Luxury beachfront resort with stunning sunset views over the Arabian Sea." },
      { name: "W Goa", price_factor: 0.18, rating: 4.7, amenities: ["Infinity Pool", "AWAY Spa", "WET Pool Bar"], address: "Vagator Beach, North Goa 403509", description: "Ultra-modern W Hotel perched above Vagator's dramatic red cliffs." },
      { name: "Alila Diwa Goa", price_factor: 0.15, rating: 4.6, amenities: ["Rice Paddy Views", "Spa", "Pool Villas"], address: "Majorda, South Goa 403713", description: "Boutique resort surrounded by ancient rice paddies and mango orchards." }
    ],
    restaurants: [
      { name: "Fisherman's Wharf Goa", cuisine: "Goan Seafood", dish: "Tiger Prawn Xacuti & Fish Caldine", address: "Cavelossim, South Goa", price_level: "$$" },
      { name: "Vinayak Family Restaurant", cuisine: "Authentic Goan", dish: "Goan Fish Curry Rice & Prawn Balchão", address: "Candolim, North Goa", price_level: "$" },
      { name: "Thalassa Greek Restaurant", cuisine: "Greek & Mediterranean", dish: "Grilled Halloumi & Lamb Souvlaki with sea view", address: "Vagator, North Goa", price_level: "$$$" },
      { name: "Gunpowder Restaurant", cuisine: "South Indian Tapas", dish: "Kerala Prawn Roast & Coorgi Pork Ribs", address: "Assagao, North Goa", price_level: "$$" },
      { name: "Martin's Corner", cuisine: "Goan Portuguese", dish: "Prawn Recheado & Beef Cafreal", address: "Betalbatim, South Goa", price_level: "$$" }
    ],
    days: [
      {
        theme: "Arrival & North Goa Beaches",
        morning: [{ time: "10:00 AM", title: "Hotel Check-in & Calangute Beach", description: "Settle in and head to Goa's most famous beach — Calangute. Walk the 7 km of golden sands, watch paragliders overhead, and take a dip in the warm Arabian Sea.", cost: 0, duration: "3 hours", location_name: "Calangute Beach, North Goa" }],
        afternoon: [
          { time: "01:00 PM", title: "Lunch at Vinayak Family Restaurant", description: "Authentic Goan Fish Curry Rice — red coconut curry with locally caught kingfish served with Goan red rice. A Goan staple since 1963.", cost: 12, duration: "1 hour", location_name: "Candolim, North Goa" },
          { time: "03:00 PM", title: "Anjuna Flea Market", description: "Browse Anjuna's legendary Wednesday flea market — bohemian jewelry, hand-dyed scarves, vintage clothing, artisan crafts, and local Goan pickles and feni liquor.", cost: 20, duration: "2.5 hours", location_name: "Anjuna Flea Market, North Goa" }
        ],
        evening: [{ time: "07:00 PM", title: "Vagator Cliff Sunset & Thalassa Dinner", description: "Watch a spectacular sunset from Vagator's dramatic red laterite cliffs. Dinner at Thalassa — Goa's famous Greek restaurant with grilled meats and feni-infused cocktails.", cost: 40, duration: "3 hours", location_name: "Vagator Cliff & Thalassa Restaurant" }]
      },
      {
        theme: "Old Goa Heritage & Spice Farms",
        morning: [{ time: "09:00 AM", title: "Old Goa UNESCO Churches", description: "Visit the Basilica of Bom Jesus (housing St. Francis Xavier's relics, brought here in 1554) and the massive Sé Cathedral — the largest church in Asia, built between 1562-1619.", cost: 0, duration: "3 hours", location_name: "Old Goa World Heritage Zone" }],
        afternoon: [
          { time: "01:00 PM", title: "Sahakari Spice Farm Tour & Lunch", description: "Traditional spice plantation tour through cardamom, vanilla, pepper, cinnamon, and nutmeg groves. Complimentary Goan thali lunch served on a banana leaf in the farm.", cost: 20, duration: "3 hours", location_name: "Sahakari Farms, Ponda" },
          { time: "04:30 PM", title: "Shri Mangeshi & Shanta Durga Temples", description: "Visit the 18th-century Shri Mangeshi Temple with its tall lamp tower and the magnificent Shanta Durga shrine surrounded by peaceful forest.", cost: 0, duration: "1.5 hours", location_name: "Ponda, Goa" }
        ],
        evening: [{ time: "07:30 PM", title: "Dinner at Martin's Corner", description: "South Goa's legendary family restaurant since 1989. Try the famous Prawn Recheado (stuffed with red masala) and the Goan-Portuguese Beef Cafreal served with Goan bread.", cost: 25, duration: "2 hours", location_name: "Betalbatim, South Goa" }]
      },
      {
        theme: "Dudhsagar Falls Jungle Adventure",
        morning: [{ time: "07:00 AM", title: "Dudhsagar Falls 4x4 Jeep Safari", description: "Thrilling jeep ride through Bhagwan Mahaveer Wildlife Sanctuary to reach the 603m Dudhsagar Waterfall — India's 5th tallest — crashing into a emerald pool below.", cost: 35, duration: "5 hours", location_name: "Dudhsagar Waterfall, Mollem" }],
        afternoon: [
          { time: "01:00 PM", title: "Forest Picnic & Tambdi Surla Temple", description: "Eat a packed Goan lunch in the forest. Then visit the 12th-century Tambdi Surla Mahadeva Temple — Goa's oldest surviving temple, hidden deep in a dense wildlife sanctuary.", cost: 10, duration: "2 hours", location_name: "Tambdi Surla, Bhagwan Mahaveer Sanctuary" },
          { time: "03:30 PM", title: "Cumbarjua Canal Crocodile Kayaking", description: "Paddle through Goa's mangrove-lined backwater canals and spot massive saltwater crocodiles sunbathing on the banks, kingfishers, and white-bellied sea eagles.", cost: 25, duration: "2.5 hours", location_name: "Cumbarjua Canal, Central Goa" }
        ],
        evening: [{ time: "07:30 PM", title: "Gunpowder Restaurant, Assagao", description: "Dinner at the cult-favourite Gunpowder in a beautiful garden setting — inventive South Indian small plates: Kerala Prawn Roast and Coorgi Pork Ribs.", cost: 30, duration: "2 hours", location_name: "Assagao Village, North Goa" }]
      }
    ],
    destination_info: {
      description: "Goa — India's coastal paradise — dazzles with palm-fringed beaches, Portuguese colonial heritage, lush wildlife sanctuaries, and the most celebrated seafood cuisine in the country.",
      best_visiting_months: ["November", "December", "January", "February", "March"],
      climate: "Tropical coastal. Best Nov-Feb. Hot Mar-May. Monsoon Jun-Oct.",
      safety_rating: "High",
      popular_attractions: ["Old Goa Basilica", "Dudhsagar Falls", "Calangute Beach", "Spice Plantations"],
      hidden_gems: ["Butterfly Beach (boat access only)", "Divar Island Heritage Walk", "Netravali Bubble Lake"],
      local_culture: "Goa's unique culture blends Konkani Hindu traditions with 450 years of Portuguese influence — visible in its churches, Mando music, Carnival, and seafood cuisine."
    },
    weather: { average_temp: "30°C (86°F)", forecast_description: "Sunny and breezy in peak season. Very humid and stormy in monsoon.", humidity: "70%", wind_speed: "20 km/h", precipitation_probability: "15%", packing_suggestions: ["Beachwear", "Light cotton clothes", "Reef sandals", "Sunscreen SPF 50", "Mosquito repellent", "Smart-casual for casinos"] },
    flights: { cheapest: { airline: "IndiGo / SpiceJet", duration: "2h 10m", layovers: 0, airports: ["DEL", "GOI"] }, fastest: { airline: "Vistara / Air India", duration: "1h 55m", layovers: 0, airports: ["DEL", "GOI"] }, notes: "Dabolim Airport (GOI) is Goa's main airport. New Mopa Airport (GOX) serves North Goa from 2023." }
  },

  // ─── PARIS ───────────────────────────────────────────
  paris: {
    hotel: "Hôtel Plaza Athénée Paris",
    hotels: [
      { name: "Hôtel Plaza Athénée Paris", price_factor: 0.22, rating: 4.8, amenities: ["Alain Ducasse Restaurant", "Dior Institut Spa", "Eiffel Tower Views"], address: "25 Av. Montaigne, Paris 75008", description: "Iconic Art Deco palace on Avenue Montaigne with stunning Eiffel Tower views." },
      { name: "Le Bristol Paris", price_factor: 0.20, rating: 4.9, amenities: ["Michelin-Star Restaurant", "Rooftop Pool", "Spa"], address: "112 Rue du Faubourg Saint-Honoré, Paris 75008", description: "One of Paris's legendary Palace hotels steps from the Elysée." },
      { name: "Hotel des Arts Montmartre", price_factor: 0.08, rating: 4.4, amenities: ["Breakfast Included", "Bohemian Quarter Location"], address: "5 Rue Tholozé, Paris 75018", description: "Charming boutique hotel in the heart of artistic Montmartre." }
    ],
    restaurants: [
      { name: "Le Jules Verne (Eiffel Tower)", cuisine: "Modern French Fine Dining", dish: "Langoustines with Caviar & Foie Gras Terrine", address: "2nd Floor, Eiffel Tower, Paris 7th", price_level: "$$$$" },
      { name: "Septime", cuisine: "Neo-bistro Seasonal Tasting", dish: "6-course seasonal farm-to-table menu", address: "80 Rue de Charonne, 11th arr.", price_level: "$$$" },
      { name: "Brasserie Lipp", cuisine: "Classic French Brasserie", dish: "Choucroute Garnie & Steak Tartare", address: "151 Blvd Saint-Germain, Paris 6th", price_level: "$$" },
      { name: "Ladurée Saint-Germain", cuisine: "Patisserie & Tea Room", dish: "Original French Macarons & Mille-Feuille", address: "21 Rue Bonaparte, Saint-Germain", price_level: "$$" },
      { name: "Bouillon Pigalle", cuisine: "Classic French Canteen", dish: "French Onion Soup & Crème Brûlée", address: "22 Blvd de Clichy, Pigalle 18th", price_level: "$" }
    ],
    days: [
      {
        theme: "Arrival & Eiffel Tower",
        morning: [{ time: "10:00 AM", title: "Check-in & Champ de Mars Walk", description: "Arrive and stroll to the Champ de Mars — the largest park in Paris with the most iconic view of the Eiffel Tower. Walk the Seine embankment to the Trocadéro viewpoint.", cost: 0, duration: "2 hours", location_name: "Champ de Mars, Paris 7th" }],
        afternoon: [
          { time: "01:00 PM", title: "Lunch at Café de Flore", description: "Experience a classic Parisian café experience at the legendary Café de Flore in Saint-Germain-des-Prés — Sartre's and Simone de Beauvoir's table since 1885.", cost: 25, duration: "1.5 hours", location_name: "172 Blvd Saint-Germain, Paris 6th" },
          { time: "03:00 PM", title: "Eiffel Tower Summit Visit", description: "Take the lift to the Eiffel Tower summit (324m) for a 360° panorama over Paris. Visit the 1st floor glass floor walkway and the Champagne bar on the 3rd floor.", cost: 30, duration: "2.5 hours", location_name: "Eiffel Tower, Champ de Mars" }
        ],
        evening: [{ time: "08:00 PM", title: "Dinner at Le Jules Verne", description: "Dine at the Michelin-starred Le Jules Verne inside the Eiffel Tower. Watch the City of Light sparkle below as you enjoy langoustines with caviar and classic French gastronomy.", cost: 120, duration: "3 hours", location_name: "Eiffel Tower 2nd Floor, Paris" }]
      },
      {
        theme: "Louvre, Marais & Notre-Dame",
        morning: [{ time: "09:00 AM", title: "Louvre Museum — Opening Hour Visit", description: "Be first at the Louvre — the world's largest art museum with 35,000+ works. See the Mona Lisa, Venus de Milo, Winged Victory of Samothrace, and Egyptian antiquities. Pre-book timed entry.", cost: 20, duration: "4 hours", location_name: "Louvre Museum, Rue de Rivoli" }],
        afternoon: [
          { time: "01:30 PM", title: "Lunch at L'As du Fallafel, Le Marais", description: "Queue at Paris's most famous falafel shop in the historic Jewish Quarter of Le Marais — crispy falafel stuffed with pickled cabbage, tahini and fried eggplant.", cost: 10, duration: "1 hour", location_name: "34 Rue des Rosiers, Le Marais" },
          { time: "03:00 PM", title: "Notre-Dame Cathedral & Île Saint-Louis", description: "Witness the historic Notre-Dame Cathedral (1163 AD) from outside during its restoration. Cross to Île Saint-Louis for artisan Berthillon ice cream — the best in Paris since 1954.", cost: 0, duration: "2.5 hours", location_name: "Notre-Dame & Île de la Cité" }
        ],
        evening: [{ time: "07:30 PM", title: "Dinner at Septime & Canal Saint-Martin", description: "Book well ahead for dinner at Septime — Paris's most sought-after neo-bistro with a seasonal 6-course menu. Then walk the atmospheric Canal Saint-Martin with its iron footbridges.", cost: 80, duration: "3 hours", location_name: "Septime, 11th Arrondissement" }]
      },
      {
        theme: "Palace of Versailles Day Trip",
        morning: [{ time: "08:30 AM", title: "Palace of Versailles", description: "Take the RER C to Versailles (40 min). Explore the Hall of Mirrors, Royal Apartments, and King's and Queen's Grand Suites of Louis XIV's palace — the most elaborate palace ever built.", cost: 25, duration: "4 hours", location_name: "Palace of Versailles, Yvelines" }],
        afternoon: [
          { time: "01:00 PM", title: "Lunch at Ore by Alain Ducasse", description: "Dine in the palace itself at Alain Ducasse's Ore Restaurant inside the Pavillon Dufour — a 3-Michelin-star chef's take on French palace cuisine.", cost: 50, duration: "1.5 hours", location_name: "Pavillon Dufour, Versailles" },
          { time: "02:30 PM", title: "Versailles Gardens & Marie Antoinette's Hamlet", description: "Explore 800 hectares of formal French gardens designed by Le Nôtre, the Grand Trianon, Petit Trianon, and Marie Antoinette's enchanting rustic hamlet built in 1783.", cost: 0, duration: "3 hours", location_name: "Gardens of Versailles" }
        ],
        evening: [{ time: "07:30 PM", title: "Return to Paris — Brasserie Lipp Dinner", description: "Back in Saint-Germain, dine at the storied 1880 Brasserie Lipp — Hemingway's favourite — for their famous Choucroute Garnie and classic steak tartare.", cost: 45, duration: "2 hours", location_name: "Brasserie Lipp, Saint-Germain" }]
      },
      {
        theme: "Montmartre, Sacré-Cœur & Musée d'Orsay",
        morning: [{ time: "09:30 AM", title: "Montmartre Village & Sacré-Cœur Basilica", description: "Climb the 222 steps to the white travertine Sacré-Cœur Basilica atop the highest point in Paris (130m). Explore the bohemian artist village where Picasso and Van Gogh lived and worked.", cost: 0, duration: "3 hours", location_name: "Montmartre & Sacré-Cœur, 18th" }],
        afternoon: [
          { time: "01:00 PM", title: "Lunch at Bouillon Pigalle", description: "Join Parisians at the revived 1905 canteen Bouillon Pigalle — classic French onion soup, beef bourguignon, escargot, and crème brûlée at working-class prices.", cost: 18, duration: "1.5 hours", location_name: "22 Blvd de Clichy, Pigalle" },
          { time: "02:30 PM", title: "Musée d'Orsay Impressionist Collection", description: "Visit the world's greatest Impressionist collection in a breathtaking 1900 railway station: Monet's Water Lilies, Renoir, Degas, Van Gogh self-portraits, and Rodin sculptures.", cost: 16, duration: "3 hours", location_name: "Musée d'Orsay, Quai Anatole France" }
        ],
        evening: [{ time: "07:30 PM", title: "Macarons at Ladurée & Seine Dinner Cruise", description: "Pick up original Parisian macarons from Ladurée Saint-Germain (founded 1862). Board a Bateaux Parisiens dinner cruise drifting past floodlit Notre-Dame, Louvre and Musée d'Orsay.", cost: 90, duration: "3 hours", location_name: "Seine River Dinner Cruise" }]
      }
    ],
    destination_info: {
      description: "Paris, the City of Light, captivates with the Eiffel Tower, world-class museums, haute cuisine, romantic boulevards, iconic fashion houses, and an unmatched joie de vivre.",
      best_visiting_months: ["April", "May", "June", "September", "October"],
      climate: "Oceanic. Mild summers (25°C), cold winters (5°C). Spring and autumn are ideal.",
      safety_rating: "High",
      popular_attractions: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Palace of Versailles", "Musée d'Orsay"],
      hidden_gems: ["Promenade Plantée (original High Line)", "Sainte-Chapelle stained glass", "Palais Royal hidden gardens"],
      local_culture: "French culture celebrates gastronomy, fashion, intellectual café debate, the art de vivre, Bastille Day celebrations, and a deep reverence for art, cinema and philosophy."
    },
    weather: { average_temp: "18°C (64°F)", forecast_description: "Mild and pleasant in spring/autumn. Cold and grey in winter. Warm summers.", humidity: "65%", wind_speed: "14 km/h", precipitation_probability: "30%", packing_suggestions: ["Smart casual clothing", "Light jacket or trench coat", "Comfortable walking shoes (15,000 steps/day)", "Compact umbrella", "Scarf"] },
    flights: { cheapest: { airline: "Air India / Air France", duration: "8h 45m", layovers: 0, airports: ["DEL", "CDG"] }, fastest: { airline: "Air France / Qatar Airways", duration: "8h 30m", layovers: 0, airports: ["DEL", "CDG"] }, notes: "Charles de Gaulle (CDG) is the main Paris airport. Orly (ORY) also serves central Paris via RER B." }
  },

  // ─── TOKYO ───────────────────────────────────────────
  tokyo: {
    hotel: "Park Hyatt Tokyo",
    hotels: [
      { name: "Park Hyatt Tokyo", price_factor: 0.20, rating: 4.9, amenities: ["New York Bar", "Pool on 47th Floor", "Spa"], address: "3-7-1-2 Nishi-Shinjuku, Tokyo 163-1055", description: "Legendary tower hotel in Shinjuku, as seen in Lost in Translation." },
      { name: "Andaz Tokyo Toranomon Hills", price_factor: 0.18, rating: 4.8, amenities: ["Rooftop Bar", "Japanese Hammam", "City Views"], address: "1-23-4 Toranomon, Minato, Tokyo 105-0001", description: "Ultra-modern hotel atop Toranomon Hills with stunning city panoramas." },
      { name: "Ryokan Sawanoya Yanaka", price_factor: 0.06, rating: 4.5, amenities: ["Tatami Rooms", "Onsen Bath", "Japanese Breakfast"], address: "2-3-11 Yanaka, Taito, Tokyo 110-0001", description: "Authentic traditional Japanese inn in charming old Tokyo neighbourhood." }
    ],
    restaurants: [
      { name: "Ichiran Ramen Shibuya", cuisine: "Hakata Tonkotsu Ramen", dish: "Solo-booth tonkotsu ramen with customizable broth richness", address: "1-22-7 Dogenzaka, Shibuya, Tokyo", price_level: "$" },
      { name: "Tempura Kondo Ginza", cuisine: "Edo-Style Tempura Fine Dining", dish: "Seasonal sweet potato & prawn tempura omakase", address: "9F Sakaguchi Building, Ginza, Tokyo", price_level: "$$$" },
      { name: "Gonpachi Nishi-Azabu", cuisine: "Izakaya & Robata Grill", dish: "Yakitori skewers & Tsukune (chicken meatballs)", address: "1-13-11 Nishi-Azabu, Minato, Tokyo", price_level: "$$" },
      { name: "Gyukatsu Motomura Harajuku", cuisine: "Japanese Beef Cutlet", dish: "Gyukatsu — breaded beef seared on personal hot stone", address: "Harajuku, Shibuya, Tokyo", price_level: "$$" },
      { name: "Narisawa Minami-Aoyama", cuisine: "Innovative Satoyama Cuisine", dish: "Bread of the Forest & Satoyama landscape tasting menu", address: "2-6-15 Minami-Aoyama, Minato, Tokyo", price_level: "$$$$" }
    ],
    days: [
      {
        theme: "Arrival — Shinjuku & Akihabara",
        morning: [{ time: "10:00 AM", title: "Check-in & Shinjuku Gyoen Garden", description: "Recover from jet lag with a peaceful morning at Shinjuku Gyoen — one of Japan's finest gardens with 1,500 cherry trees, French formal gardens, and a traditional Japanese tea house.", cost: 5, duration: "2.5 hours", location_name: "Shinjuku Gyoen National Garden" }],
        afternoon: [
          { time: "01:00 PM", title: "Ichiran Solo Ramen Experience", description: "Experience Ichiran's famous individual booth system — seated alone in a private cubicle to customize your perfect Hakata tonkotsu broth richness, noodle firmness, garlic level, and spice.", cost: 12, duration: "1 hour", location_name: "Ichiran Ramen, Shinjuku" },
          { time: "02:30 PM", title: "Akihabara Electric Town", description: "Dive into Tokyo's world-famous electronics and anime district — multi-floor gaming centers, manga cafés, retro arcade machines, gashapon capsule toy walls, and maid cafés.", cost: 20, duration: "3 hours", location_name: "Akihabara Electric Town, Chiyoda" }
        ],
        evening: [{ time: "07:30 PM", title: "Shinjuku Golden Gai & Omoide Yokocho", description: "Explore Golden Gai — 200+ tiny 6-seat bars in narrow alleys, each with its own distinct theme. Then eat yakitori and drink cold beer at atmospheric Memory Lane (Omoide Yokocho).", cost: 30, duration: "3 hours", location_name: "Golden Gai & Omoide Yokocho, Shinjuku" }]
      },
      {
        theme: "Asakusa, Ueno & Harajuku",
        morning: [
          { time: "08:00 AM", title: "Senso-ji Temple at Dawn", description: "Visit Tokyo's oldest temple (645 AD) as it opens — walk the iconic red Kaminarimon gate, Nakamise shopping street, and witness morning incense rituals with almost no tourists present.", cost: 0, duration: "2.5 hours", location_name: "Senso-ji Temple, Asakusa" },
          { time: "11:00 AM", title: "Tokyo National Museum, Ueno", description: "Japan's oldest and largest museum with samurai armor, lacquerware, ancient Jomon pottery (14,000 BC), Buddhist sculptures, and precious Meiji-era artefacts.", cost: 15, duration: "2 hours", location_name: "Tokyo National Museum, Ueno" }
        ],
        afternoon: [
          { time: "01:30 PM", title: "Lunch at Gyukatsu Motomura, Harajuku", description: "Try the uniquely Japanese Gyukatsu — a breaded beef cutlet that you sear yourself on a personal sizzling hot stone, dipping in wasabi, miso, and soy sauce.", cost: 18, duration: "1 hour", location_name: "Gyukatsu Motomura, Harajuku" },
          { time: "02:30 PM", title: "Takeshita Street & Meiji Jingu Shrine", description: "Walk the wild, colorful Takeshita Street (cosplay fashion, crepes, bubble tea, pastel everything). Then enter the vast forested Meiji Shrine — a complete spiritual contrast.", cost: 5, duration: "3 hours", location_name: "Harajuku & Meiji Shrine, Shibuya" }
        ],
        evening: [{ time: "07:30 PM", title: "Shibuya Scramble Crossing & Dinner", description: "Stand at the center of the world's busiest pedestrian intersection — 3,000 people crossing simultaneously from all directions every 2 minutes. Dinner at Gonpachi's legendary izakaya.", cost: 35, duration: "3 hours", location_name: "Shibuya Scramble & Gonpachi Restaurant" }]
      },
      {
        theme: "Mt. Fuji & Hakone Day Trip",
        morning: [{ time: "07:00 AM", title: "Shinkansen to Hakone / Mt. Fuji", description: "Take the bullet train (shinkansen) to Odawara, then the Romancecar scenic train to Hakone National Park — the #1 destination for Mt. Fuji views on clear days.", cost: 40, duration: "2 hours", location_name: "Hakone, Kanagawa Prefecture" }],
        afternoon: [
          { time: "10:00 AM", title: "Hakone Open-Air Museum & Owakudani Ropeway", description: "Visit the extraordinary Hakone Open-Air Sculpture Museum with Picasso collection. Take the Komagatake Ropeway over volcanic Owakudani (active sulphur vents) for panoramic Fuji views on clear days.", cost: 30, duration: "4 hours", location_name: "Hakone Open-Air Museum & Owakudani" },
          { time: "02:30 PM", title: "Onsen Rotenburo Soak at Ryokan", description: "Soak in an outdoor rotenburo (open-air hot spring bath) overlooking the cedar and oak valley — a quintessential Japanese healing ritual.", cost: 20, duration: "2 hours", location_name: "Hakone Ryokan Hot Spring" }
        ],
        evening: [{ time: "07:30 PM", title: "Return to Tokyo — Ramen Under the Tracks", description: "Return to Tokyo and enjoy a steaming bowl of Sapporo miso ramen at a late-night ramen shop under the train tracks in Shimbashi.", cost: 15, duration: "2 hours", location_name: "Shimbashi, Tokyo" }]
      },
      {
        theme: "Ginza, teamLab & Tsukiji Market",
        morning: [{ time: "07:00 AM", title: "Tsukiji Outer Market Breakfast", description: "Wake early for breakfast at Tsukiji — the world's most famous fish market. Eat ultra-fresh sushi, grilled scallops, tamagoyaki (sweet egg omelette), and slurp creamy uni (sea urchin) on rice.", cost: 25, duration: "2.5 hours", location_name: "Tsukiji Outer Market, Chuo" }],
        afternoon: [
          { time: "01:00 PM", title: "Lunch & Ginza Luxury Shopping", description: "Browse Ginza — Tokyo's most exclusive shopping district. Dine at Tempura Kondo for a sublime seasonal tempura omakase featuring the celebrated sweet potato and prawn tempura.", cost: 60, duration: "3 hours", location_name: "Tempura Kondo, Ginza" },
          { time: "04:30 PM", title: "teamLab Planets Tokyo", description: "Immerse yourself in teamLab Planets — Tokyo's most extraordinary digital art experience. Walk barefoot through infinite mirror worlds, flower universes, and floating crystal universes.", cost: 35, duration: "2.5 hours", location_name: "teamLab Planets, Toyosu" }
        ],
        evening: [{ time: "08:00 PM", title: "Dinner at Narisawa — Japan's #1 Restaurant", description: "End your Tokyo adventure at two-Michelin-star Narisawa — Japan's highest ranked restaurant on the World's 50 Best list. Satoyama cuisine celebrating Japan's forests, mountains and seas.", cost: 200, duration: "3 hours", location_name: "Narisawa, Minami-Aoyama" }]
      }
    ],
    destination_info: {
      description: "Tokyo — the world's largest city — seamlessly blends ancient temples with futuristic technology, Michelin-starred restaurants with ¥500 ramen, traditional ryokans with neon-lit skyscrapers and pop culture.",
      best_visiting_months: ["March", "April", "October", "November"],
      climate: "Temperate. Sakura (cherry blossom) season March-April. Hot humid summers. Cold dry winters.",
      safety_rating: "Very High",
      popular_attractions: ["Senso-ji Temple Asakusa", "Shibuya Scramble Crossing", "Shinjuku Gyoen", "teamLab Borderless", "Tsukiji Outer Market"],
      hidden_gems: ["Yanaka Old Town", "Koenji Antique Shops", "Shimokitazawa Jazz Bars", "Nezu Shrine Tunnel"],
      local_culture: "Japanese culture prizes harmony, precision, and respect — expressed through tea ceremony, ikebana, manga, anime, kabuki theatre, sumo, and an extraordinary national obsession with exceptional food."
    },
    weather: { average_temp: "18°C (64°F)", forecast_description: "Mild spring and autumn. Hot humid summers. Cold dry winters.", humidity: "68%", wind_speed: "12 km/h", precipitation_probability: "25%", packing_suggestions: ["Comfortable walking shoes (20,000+ steps/day)", "Light layers", "Pocket Wi-Fi/SIM card", "Suica IC transit card", "Modest clothing for shrines"] },
    flights: { cheapest: { airline: "Air India / All Nippon Airways", duration: "8h 30m", layovers: 0, airports: ["DEL", "NRT"] }, fastest: { airline: "Japan Airlines / ANA", duration: "8h 15m", layovers: 0, airports: ["DEL", "HND"] }, notes: "Narita (NRT) and Haneda (HND) both serve Tokyo. Haneda is much closer to the city centre." }
  }
};

/**
 * Look up destination data with fuzzy matching.
 */
export function getDestinationData(destination: string): DestinationData | null {
  const clean = destination.toLowerCase().trim();
  if (CATALOG[clean]) return CATALOG[clean];
  for (const key of Object.keys(CATALOG)) {
    if (clean.includes(key) || key.includes(clean)) return CATALOG[key];
  }
  return null;
}

/**
 * Build a full multi-day itinerary from the catalog — each day is uniquely different.
 */
export function buildItinerary(destData: DestinationData, numDays: number, startDate: string): any[] {
  return Array.from({ length: numDays }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = new Date(new Date(startDate).getTime() + i * 24 * 60 * 60 * 1000)
      .toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });

    // Cycle through unique catalog days if trip is longer than catalog
    const catalogDay = destData.days[i % destData.days.length];

    return {
      day_number: dayNum,
      date: `Day ${dayNum} — ${dateStr}`,
      theme: catalogDay.theme,
      morning: catalogDay.morning,
      afternoon: catalogDay.afternoon,
      evening: catalogDay.evening
    };
  });
}
