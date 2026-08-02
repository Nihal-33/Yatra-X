import { create } from "zustand";
import axios from "axios";
import { generateMockTripData, mockChatItineraryUpdate } from "../utils/mockData";

// Configure axios base URL dynamically for local dev vs production Render backend
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://yatra-x.onrender.com" : "");
if (API_URL) {
  axios.defaults.baseURL = API_URL;
}

export interface Trip {
  id: string;
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
    origin?: string;
    accessibility?: string;
    specialRequests?: string;
  };
  destination_info: any;
  weather: any;
  flights: any;
  hotels: any;
  restaurants: any;
  local_transport: any;
  visa_info: any;
  currency_info: any;
  safety_tips: any;
  activities: any;
  packing_list: any;
  itinerary: any;
  budget_breakdown: any;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface StoreState {
  user: { id: string; name: string; email: string; avatar_url?: string } | null;
  trips: Trip[];
  currentTrip: Trip | null;
  isLoading: boolean;
  loadingStatus: string;
  chatHistory: ChatMessage[];
  activeTab: string;
  errorMessage: string | null;
  currency: "USD" | "INR";

  // Actions
  setCurrency: (currency: "USD" | "INR") => void;
  setUser: (user: any) => void;
  setCurrentTrip: (trip: Trip | null) => void;
  setActiveTab: (tab: string) => void;
  clearError: () => void;
  generateTrip: (formData: {
    destination: string;
    budget: number;
    dates: { start: string; end: string };
    travelers: number;
    style: string;
    interests: string[];
    food: string;
    hotels: string;
    transport: string;
    origin?: string;
    accessibility?: string;
    specialRequests?: string;
  }) => Promise<Trip | null>;
  sendChatMessage: (messageText: string) => Promise<void>;
  saveTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => Promise<void>;
  duplicateTrip: (id: string) => void;
  fetchTrips: () => Promise<void>;
}

/**
 * Safely maps database column fields to frontend-friendly camelCase fields.
 */
export function transformDbTrip(trip: any): Trip {
  if (!trip) return trip;

  const dates = trip.dates || {
    start: trip.start_date || "",
    end: trip.end_date || ""
  };

  const travelers = trip.travelers || {
    count: trip.travelers_count || 1,
    details: `${trip.travelers_count || 1} traveler(s)`
  };

  return {
    ...trip,
    dates,
    travelers
  };
}

export const useStore = create<StoreState>((set, get) => {
  // Force light mode always
  document.documentElement.classList.remove("dark");

  // Load trips from localStorage safely
  const savedTripsData = localStorage.getItem("trips");
  let initialTrips: any[] = [];
  if (savedTripsData) {
    try {
      const parsed = JSON.parse(savedTripsData);
      if (Array.isArray(parsed)) {
        initialTrips = parsed.map(transformDbTrip);
      }
    } catch (e) {
      console.warn("Failed to parse saved trips, resetting...", e);
      localStorage.removeItem("trips");
    }
  }

  return {
    user: { id: "user_1", name: "Alex Explorer", email: "alex@traveler.com", avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" },
    trips: initialTrips,
    currentTrip: null,
    isLoading: false,
    loadingStatus: "",
    chatHistory: [],
    activeTab: "itinerary",
    errorMessage: null,
    currency: "INR",
    setCurrency: (currency) => set({ currency }),

    setUser: (user) => set({ user }),
    setCurrentTrip: (trip) => set({ 
      currentTrip: trip, 
      chatHistory: trip ? [
        { role: "assistant", content: `👋 Hi! I'm your AI Trip Assistant for **${trip.destination}**. I can update your itinerary in real-time!\n\nTry asking me:\n• "Make the budget cheaper"\n• "Add a beach day"\n• "Suggest luxury hotels"\n• "Remove Day 2 morning activity"\n• "Add vegetarian restaurants only"` }
      ] : []
    }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    clearError: () => set({ errorMessage: null }),

    generateTrip: async (formData) => {
      set({ 
        isLoading: true, 
        errorMessage: null,
        loadingStatus: "Initializing orchestrator..." 
      });

      const statusMessages = [
        "Consulting Flight Agent for best route connections...",
        "Deploying Hotel Agent to secure comfortable lodging...",
        "Restaurant Agent scouring destination for dining favorites...",
        "Weather Agent collecting current microclimates and forecasts...",
        "Safety Agent assessing travel scores and local alerts...",
        "Visa & Currency Agents calculating entry rules and fees...",
        "Itinerary Planner building chronological schedule layouts...",
        "Budget Agent analyzing final cost distributions..."
      ];

      let msgIndex = 0;
      const statusInterval = setInterval(() => {
        set({ loadingStatus: statusMessages[msgIndex] });
        msgIndex = (msgIndex + 1) % statusMessages.length;
      }, 900);

      try {
        const response = await axios.post("/api/trips/generate", {
          destination: formData.destination,
          budget: formData.budget,
          dates: formData.dates,
          travelers: { count: formData.travelers, details: `${formData.travelers} traveler(s)` },
          preferences: {
            style: formData.style,
            interests: formData.interests,
            food: formData.food,
            hotels: formData.hotels,
            transport: formData.transport,
            origin: formData.origin,
            accessibility: formData.accessibility,
            specialRequests: formData.specialRequests
          }
        }, { timeout: 35000 });

        clearInterval(statusInterval);
        const generatedTrip = transformDbTrip(response.data);
        
        const updatedTrips = [generatedTrip, ...get().trips];
        localStorage.setItem("trips", JSON.stringify(updatedTrips));

        set({ 
          trips: updatedTrips,
          currentTrip: generatedTrip,
          isLoading: false, 
          loadingStatus: "",
          chatHistory: [
            { role: "assistant", content: `Hello! I've successfully orchestrated our travel planners to build your custom trip to ${generatedTrip.destination}. You can ask me to change hotels, remove museums, reduce the budget, or add adventure, and I will adjust the plan instantly!` }
          ]
        });

        return generatedTrip;
      } catch (error: any) {
        console.warn("Backend API not running or key error. Falling back to mock multi-agent generation...", error);
        
        await new Promise((resolve) => setTimeout(resolve, 3000));
        clearInterval(statusInterval);

        const mockTrip = generateMockTripData(
          formData.destination,
          formData.budget,
          formData.dates,
          formData.travelers,
          formData.style,
          formData.interests
        );

        // Assign a mock ID and spread mock details safely
        const finalMockTrip = { 
          id: `mock_${Date.now()}`, 
          ...mockTrip 
        } as any;

        const updatedTrips = [finalMockTrip, ...get().trips];
        localStorage.setItem("trips", JSON.stringify(updatedTrips));

        set({ 
          trips: updatedTrips,
          currentTrip: finalMockTrip,
          isLoading: false, 
          loadingStatus: "",
          chatHistory: [
            { role: "assistant", content: `[Offline Mode] Generated an optimized trip to ${finalMockTrip.destination} based on offline guidelines. Try asking me: "Make the budget cheaper" or "Add adventure to Day 2" to see details adjust.` }
          ],
          errorMessage: "Unable to connect to AI server. Generated local plan via offline travel engines."
        });

        return finalMockTrip;
      }
    },

    sendChatMessage: async (messageText) => {
      const { currentTrip, chatHistory } = get();
      if (!currentTrip) return;

      const newUserMessage: ChatMessage = { role: "user", content: messageText };
      const updatedHistory = [...chatHistory, newUserMessage];
      
      set({ 
        chatHistory: updatedHistory,
        isLoading: true,
        loadingStatus: "Itinerary Updater Agent recalculating budget and activities..." 
      });

      try {
        const response = await axios.post("/api/trips/chat", {
          tripId: currentTrip.id.startsWith("mock_") ? undefined : currentTrip.id,
          message: messageText,
          chatHistory: chatHistory,
          originalTrip: currentTrip
        }, { timeout: 20000 });

        const { updatedTrip, explanation } = response.data;
        const transformedTrip = transformDbTrip(updatedTrip);
        
        const updatedTrips = get().trips.map(t => t.id === currentTrip.id ? transformedTrip : t);
        localStorage.setItem("trips", JSON.stringify(updatedTrips));

        set({
          currentTrip: transformedTrip,
          trips: updatedTrips,
          isLoading: false,
          loadingStatus: "",
          chatHistory: [...updatedHistory, { role: "assistant", content: explanation }]
        });
      } catch (error) {
        console.warn("Backend chat failed. Simulating local chat update...", error);
        
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const { updatedTrip, explanation } = mockChatItineraryUpdate(currentTrip, chatHistory, messageText);

        const updatedTrips = get().trips.map(t => t.id === currentTrip.id ? updatedTrip : t);
        localStorage.setItem("trips", JSON.stringify(updatedTrips));

        set({
          currentTrip: updatedTrip,
          trips: updatedTrips,
          isLoading: false,
          loadingStatus: "",
          chatHistory: [...updatedHistory, { role: "assistant", content: `[Offline Update] ${explanation}` }]
        });
      }
    },

    saveTrip: (trip) => {
      const exists = get().trips.find(t => t.id === trip.id);
      let updatedTrips = get().trips;
      if (exists) {
        updatedTrips = get().trips.map(t => t.id === trip.id ? trip : t);
      } else {
        updatedTrips = [trip, ...get().trips];
      }
      localStorage.setItem("trips", JSON.stringify(updatedTrips));
      set({ trips: updatedTrips });
    },

    deleteTrip: async (id) => {
      const updatedTrips = get().trips.filter(t => t.id !== id);
      localStorage.setItem("trips", JSON.stringify(updatedTrips));
      set({ 
        trips: updatedTrips,
        currentTrip: get().currentTrip?.id === id ? null : get().currentTrip
      });

      try {
        await axios.delete(`/api/trips/${id}`);
      } catch (error) {
        console.warn("Failed to delete trip on Supabase server:", error);
      }
    },

    duplicateTrip: (id) => {
      const tripToDup = get().trips.find(t => t.id === id);
      if (!tripToDup) return;

      const duplicatedTrip = {
        ...tripToDup,
        id: `dup_${Date.now()}`,
        destination: `${tripToDup.destination} (Copy)`,
        created_at: new Date().toISOString()
      } as any;

      const updatedTrips = [duplicatedTrip, ...get().trips];
      localStorage.setItem("trips", JSON.stringify(updatedTrips));
      set({ trips: updatedTrips });
    },

    fetchTrips: async () => {
      try {
        const response = await axios.get("/api/trips");
        if (Array.isArray(response.data)) {
          const transformed = response.data.map(transformDbTrip);
          localStorage.setItem("trips", JSON.stringify(transformed));
          set({ trips: transformed });
        }
      } catch (error) {
        console.warn("Failed to fetch trips from Supabase backend. Using local storage cache.", error);
      }
    }
  };
});
