import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../context/store";
import { exportItineraryToPDF, exportItineraryToICS } from "../utils/exportUtils";
import { formatPrice } from "../utils/currency";
import { 
  Calendar, MapPin, DollarSign, Users, Plane, Hotel, 
  Sun, Shield, Sparkles, Send, FileText, ArrowLeft, ArrowRight, Loader2, Info, Star
} from "lucide-react";
import { 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip
} from "recharts";

export default function ItineraryViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips, currentTrip, setCurrentTrip, sendChatMessage, isLoading, loadingStatus, activeTab, setActiveTab, currency, chatHistory } = useStore();
  
  const [chatMessage, setChatMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trip = trips.find(t => t.id === id);
    if (trip) {
      setCurrentTrip(trip);
    } else {
      // If not found in store, redirect to dashboard
      navigate("/");
    }
  }, [id, trips, setCurrentTrip, navigate]);

  // Scroll to bottom of chat whenever history changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  if (!currentTrip) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Loading your orchestrated plan...</p>
      </div>
    );
  }

  // Defensive resolvers for flights and hotels
  const hotelList = Array.isArray(currentTrip.hotels)
    ? currentTrip.hotels
    : currentTrip.hotels?.hotels || [];

  const cheapestFlight = currentTrip.flights?.cheapest || (Array.isArray(currentTrip.flights) ? currentTrip.flights[0] : null);
  const fastestFlight = currentTrip.flights?.fastest || (Array.isArray(currentTrip.flights) ? currentTrip.flights[1] || currentTrip.flights[0] : null);
  const multiCityFlights = currentTrip.flights?.multi_city || (Array.isArray(currentTrip.flights) ? currentTrip.flights.slice(2) : []);
  const flightNotes = currentTrip.flights?.notes || "";

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const msg = chatMessage;
    setChatMessage("");
    await sendChatMessage(msg);
  };

  // Recharts Data formatting
  const breakdownData = [
    { name: "Flights", value: Number(currentTrip.budget_breakdown?.breakdown?.flights || 0) },
    { name: "Hotels", value: Number(currentTrip.budget_breakdown?.breakdown?.hotels || 0) },
    { name: "Food", value: Number(currentTrip.budget_breakdown?.breakdown?.food || 0) },
    { name: "Transport", value: Number(currentTrip.budget_breakdown?.breakdown?.transport || 0) },
    { name: "Activities", value: Number(currentTrip.budget_breakdown?.breakdown?.activities || 0) },
    { name: "Emergency", value: Number(currentTrip.budget_breakdown?.breakdown?.emergency_fund || 0) }
  ].filter(item => item.value > 0);

  const tierData = [
    { name: "Budget Tier", cost: Number(currentTrip.budget_breakdown?.tiers?.budget_tier || currentTrip.budget * 0.7) },
    { name: "Your Comfort Tier", cost: Number(currentTrip.budget_breakdown?.breakdown?.total || currentTrip.budget) },
    { name: "Luxury Tier", cost: Number(currentTrip.budget_breakdown?.tiers?.luxury_tier || currentTrip.budget * 1.8) }
  ];

  const COLORS = ["#6366f1", "#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];



  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-page-enter">
      
      {/* Back Button & Exports */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors font-medium text-sm w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => exportItineraryToICS(currentTrip)}
            className="glass hover:bg-gray-100/50 dark:hover:bg-gray-800/50 border border-gray-200/20 text-gray-700 dark:text-gray-200 font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-indigo-500" /> Export Calendar (.ics)
          </button>
          <button
            onClick={() => exportItineraryToPDF(currentTrip)}
            className="bg-indigo-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer flex items-center gap-2 shadow-md shadow-indigo-500/10"
          >
            <FileText className="w-4 h-4" /> Download PDF Itinerary
          </button>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="glass p-6 sm:p-8 rounded-3xl border border-gray-200/10 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute right-[-5%] bottom-[-20%] w-[250px] h-[250px] bg-indigo-500/5 rounded-full blur-[80px]" />
        
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-widest bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3.5 py-1.5 rounded-full">
            {currentTrip.preferences?.style || "Standard"} Getaway
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-3.5">
            {currentTrip.destination || "Trip Itinerary"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              {currentTrip.dates?.start ? new Date(currentTrip.dates.start).toLocaleDateString() : "N/A"} - {currentTrip.dates?.end ? new Date(currentTrip.dates.end).toLocaleDateString() : "N/A"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              {currentTrip.travelers?.count || 1} Traveler(s)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-indigo-500" />
              Budget: {formatPrice(currentTrip.budget || 0, currency)}
            </span>
          </p>
        </div>

        {/* Quick weather widget */}
        <div className="glass bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-gray-200/10 flex items-center gap-4.5 max-w-sm shrink-0">
          <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-500">
            <Sun className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">{currentTrip.weather?.average_temp || "25°C"}</div>
            <div className="text-[10px] text-gray-400 font-medium truncate max-w-[200px]">{currentTrip.weather?.forecast_description || "Sunny spells"}</div>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200/10 pb-3 mb-8 scrollbar-none select-none">
        {[
          { id: "itinerary", label: "Day-by-Day", icon: Calendar },
          { id: "hotels", label: "Hotels", icon: Hotel },
          { id: "flights", label: "Flights & Transit", icon: Plane },
          { id: "weather", label: "Weather & Packing", icon: Sun },
          { id: "visa", label: "Visa & Safety", icon: Shield },
          { id: "budget", label: "Budget Analyzer", icon: DollarSign }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans text-xs font-semibold shrink-0 cursor-pointer transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Content Views) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TAB 1: ITINERARY VIEW */}
          {activeTab === "itinerary" && (
            <div className="space-y-6 animate-page-enter">
              {currentTrip.itinerary?.days?.map((day: any) => (
                <div key={day.day_number} className="glass p-6 sm:p-8 rounded-3xl border border-gray-200/10">
                  {/* Day Header */}
                  <div className="flex items-center justify-between border-b border-gray-200/10 pb-4 mb-6">
                    <div>
                      <h3 className="font-display font-extrabold text-indigo-500 dark:text-indigo-400 text-lg">
                        Day {day.day_number}: {day.date}
                      </h3>
                      <p className="text-gray-800 dark:text-gray-200 font-bold text-sm mt-1">{day.theme}</p>
                    </div>
                  </div>

                  {/* Day Time slots */}
                  <div className="space-y-6">
                    {/* Morning */}
                    {day.morning?.map((slot: any, idx: number) => (
                      <div key={idx} className="flex gap-4 group">
                        <div className="w-20 shrink-0 text-xs font-bold text-indigo-500 dark:text-indigo-400 pt-1 select-none">
                          {slot.time}
                        </div>
                        <div className="relative border-l-2 border-indigo-500/25 pl-6 pb-2 group-last:pb-0 flex-1">
                          <div className="absolute top-1.5 left-[-5px] w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">{slot.title}</h4>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{slot.description}</p>
                          <div className="flex gap-4 mt-2 text-[10px] text-gray-400 font-semibold select-none">
                            <span>Cost: {formatPrice(slot.cost, currency)}</span>
                            <span>•</span>
                            <span>Duration: {slot.duration}</span>
                            {slot.location_name && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-indigo-500" /> {slot.location_name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Afternoon */}
                    {day.afternoon?.map((slot: any, idx: number) => (
                      <div key={idx} className="flex gap-4 group">
                        <div className="w-20 shrink-0 text-xs font-bold text-indigo-500 dark:text-indigo-400 pt-1 select-none">
                          {slot.time}
                        </div>
                        <div className="relative border-l-2 border-indigo-500/25 pl-6 pb-2 group-last:pb-0 flex-1">
                          <div className="absolute top-1.5 left-[-5px] w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">{slot.title}</h4>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{slot.description}</p>
                          <div className="flex gap-4 mt-2 text-[10px] text-gray-400 font-semibold select-none">
                            <span>Cost: {formatPrice(slot.cost, currency)}</span>
                            <span>•</span>
                            <span>Duration: {slot.duration}</span>
                            {slot.location_name && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-indigo-500" /> {slot.location_name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Evening */}
                    {day.evening?.map((slot: any, idx: number) => (
                      <div key={idx} className="flex gap-4 group">
                        <div className="w-20 shrink-0 text-xs font-bold text-indigo-500 dark:text-indigo-400 pt-1 select-none">
                          {slot.time}
                        </div>
                        <div className="relative border-l-2 border-indigo-500/25 pl-6 pb-2 group-last:pb-0 flex-1">
                          <div className="absolute top-1.5 left-[-5px] w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">{slot.title}</h4>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{slot.description}</p>
                          <div className="flex gap-4 mt-2 text-[10px] text-gray-400 font-semibold select-none">
                            <span>Cost: {formatPrice(slot.cost, currency)}</span>
                            <span>•</span>
                            <span>Duration: {slot.duration}</span>
                            {slot.location_name && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-indigo-500" /> {slot.location_name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: HOTELS VIEW */}
          {activeTab === "hotels" && (
            <div className="space-y-6 animate-page-enter">
              {hotelList?.map((hotel: any, idx: number) => (
                <div key={idx} className="glass p-6 rounded-2xl border border-gray-200/10 flex flex-col md:flex-row gap-6 hover:border-indigo-500/25 transition-all">
                  <div className="w-full md:w-48 h-36 bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden shrink-0 flex items-center justify-center relative">
                    <Hotel className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                    <div className="absolute bottom-2 left-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                      {formatPrice(hotel.price_per_night, currency)} / night
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-sans font-bold text-gray-900 dark:text-white text-lg">{hotel.name}</h4>
                      <span className="flex items-center gap-0.5 text-xs text-amber-500 font-bold shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-500" /> {hotel.rating}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {hotel.address}
                    </p>
                    <p className="text-xs text-gray-400 mt-3 leading-relaxed">{hotel.description}</p>
                    
                    <div className="flex flex-wrap justify-between items-center gap-4 mt-4 pt-3 border-t border-gray-200/10">
                      <div className="flex flex-wrap gap-1.5">
                        {hotel.amenities?.map((am: string) => (
                          <span key={am} className="text-[9px] bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded font-medium select-none">
                            {am}
                          </span>
                        ))}
                      </div>

                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(hotel.name + " " + currentTrip.destination)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
                      >
                        Search on Google <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {/* Google Hotels CTA */}
              <div className="glass p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
                <div>
                  <h4 className="font-sans font-bold text-gray-900 dark:text-white text-sm">Search Live Real-Time Hotel Availability</h4>
                  <p className="text-xs text-gray-400 mt-1">Open Google Hotels with pre-filled dates to browse real-time pricing and book rooms.</p>
                </div>
                <a
                  href={`https://www.google.com/travel/hotels?q=Hotels+in+${encodeURIComponent(currentTrip.destination)}&checkin=${currentTrip.dates.start}&checkout=${currentTrip.dates.end}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all hover:scale-[1.01] flex items-center gap-2 shrink-0 shadow-sm"
                >
                  Search Google Hotels <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: FLIGHTS VIEW */}
          {activeTab === "flights" && (
            <div className="space-y-6 animate-page-enter">
              {currentTrip.flights && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cheapest */}
                    {cheapestFlight && (
                      <div className="glass p-6 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/35 transition-all">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-md font-bold">Cheapest Route</span>
                          <span className="font-extrabold text-xl text-gray-900 dark:text-white">{formatPrice(cheapestFlight.cost, currency)}</span>
                        </div>
                        <h4 className="font-sans font-bold text-gray-900 dark:text-white text-sm">{cheapestFlight.airline}</h4>
                        <div className="text-xs text-gray-400 mt-2 space-y-1">
                          <p>Duration: {cheapestFlight.duration}</p>
                          <p>Layovers: {cheapestFlight.layovers}</p>
                          <p>Airports: {cheapestFlight.airports?.join(" → ")}</p>
                        </div>
                      </div>
                    )}

                    {/* Fastest */}
                    {fastestFlight && (
                      <div className="glass p-6 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/35 transition-all">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-md font-bold">Fastest Route</span>
                          <span className="font-extrabold text-xl text-gray-900 dark:text-white">{formatPrice(fastestFlight.cost, currency)}</span>
                        </div>
                        <h4 className="font-sans font-bold text-gray-900 dark:text-white text-sm">{fastestFlight.airline}</h4>
                        <div className="text-xs text-gray-400 mt-2 space-y-1">
                          <p>Duration: {fastestFlight.duration}</p>
                          <p>Layovers: {fastestFlight.layovers}</p>
                          <p>Airports: {fastestFlight.airports?.join(" → ")}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Multi-city alternatives */}
                  {multiCityFlights && multiCityFlights.length > 0 && (
                    <div className="glass p-6 rounded-2xl border border-gray-200/10">
                      <h4 className="font-sans font-bold text-gray-900 dark:text-white text-sm mb-4">Alternative Connections</h4>
                      <div className="space-y-4">
                        {multiCityFlights.map((fl: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center border-b border-gray-200/10 pb-3 last:border-0 last:pb-0">
                            <div>
                              <p className="font-bold text-xs text-gray-800 dark:text-gray-200">{fl.airline}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">Duration: {fl.duration} | Layovers: {fl.layovers} | Route: {fl.airports?.join(" → ")}</p>
                            </div>
                            <span className="font-bold text-sm text-gray-700 dark:text-gray-300">{formatPrice(fl.cost, currency)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Flight Notes */}
                  {flightNotes && (
                    <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2.5 mb-4">
                      <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <p>{flightNotes}</p>
                    </div>
                  )}

                  {/* Local & Intercity Transit Section */}
                  {currentTrip.local_transport?.options && currentTrip.local_transport.options.length > 0 && (
                    <div className="glass p-6 rounded-2xl border border-gray-200/10 mb-6">
                      <h4 className="font-sans font-bold text-gray-900 dark:text-white text-sm mb-4">Local & Intercity Transit Options (Bus, Train, Metro)</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentTrip.local_transport.options.map((opt: any, idx: number) => (
                          <div key={idx} className="p-4 bg-slate-500/5 rounded-xl border border-gray-200/5 hover:border-indigo-500/15 transition-all">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-bold text-xs text-gray-900 dark:text-white">{opt.type}</span>
                              <span className="font-extrabold text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                                {opt.estimated_cost}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium">Speed: <span className="text-gray-600 dark:text-gray-300">{opt.travel_time_rating}</span></p>
                            <div className="text-[10px] text-gray-400 mt-2 space-y-1">
                              <p><span className="text-emerald-500 font-bold">✓</span> {opt.pros}</p>
                              <p><span className="text-rose-500 font-bold">✗</span> {opt.cons}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Google Flights CTA */}
                  <div className="glass p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="font-sans font-bold text-gray-900 dark:text-white text-sm">Search Live Real-Time Flight Schedules</h4>
                      <p className="text-xs text-gray-400 mt-1">Open Google Flights with pre-filled routes and dates to book your ticket.</p>
                    </div>
                    <a
                      href={`https://www.google.com/travel/flights?q=Flights+to+${encodeURIComponent(currentTrip.destination)}+from+${encodeURIComponent(currentTrip.preferences?.origin || 'New York')}+on+${currentTrip.dates.start}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all hover:scale-[1.01] flex items-center gap-2 shrink-0 shadow-sm"
                    >
                      Search Google Flights <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 4: WEATHER & PACKING VIEW */}
          {activeTab === "weather" && (
            <div className="space-y-6 animate-page-enter">
              {/* Weather Stats */}
              <div className="glass p-6 rounded-2xl border border-gray-200/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-sans font-bold text-gray-900 dark:text-white text-sm mb-2">Climate Context</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{currentTrip.weather?.forecast_description}</p>
                </div>
                <div className="space-y-2 text-xs text-gray-400">
                  <p><span className="font-semibold text-gray-600 dark:text-gray-300">Average Temp:</span> {currentTrip.weather?.average_temp}</p>
                  <p><span className="font-semibold text-gray-600 dark:text-gray-300">Humidity:</span> {currentTrip.weather?.humidity}</p>
                  <p><span className="font-semibold text-gray-600 dark:text-gray-300">Wind:</span> {currentTrip.weather?.wind_speed}</p>
                  <p><span className="font-semibold text-gray-600 dark:text-gray-300">Precipitation:</span> {currentTrip.weather?.precipitation_probability}</p>
                </div>
              </div>

              {/* Packing Checklist */}
              {currentTrip.packing_list && (
                <div className="glass p-6 rounded-2xl border border-gray-200/10">
                  <h4 className="font-sans font-bold text-gray-900 dark:text-white text-sm mb-6">Orchestrated Packing Checklist</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {currentTrip.packing_list.checklist?.map((cat: any, idx: number) => (
                      <div key={idx} className="space-y-3">
                        <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">{cat.category}</span>
                        <div className="space-y-2">
                          {cat.items?.map((item: string, i: number) => (
                            <label key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 select-none cursor-pointer">
                              <input type="checkbox" className="accent-indigo-500 rounded border-gray-200/20" />
                              <span>{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: VISA & SAFETY */}
          {activeTab === "visa" && (
            <div className="space-y-6 animate-page-enter">
              {/* Visa details */}
              {currentTrip.visa_info && (
                <div className="glass p-6 rounded-2xl border border-gray-200/10">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-200/10 pb-3">
                    <h4 className="font-sans font-bold text-gray-900 dark:text-white text-sm">Visa & Entry Guidelines</h4>
                    <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold ${
                      currentTrip.visa_info.visa_required 
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    }`}>
                      {currentTrip.visa_info.visa_required ? "Visa Required" : "Visa Free / Visa on Arrival"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <div className="space-y-2">
                      <p><span className="font-bold text-gray-700 dark:text-gray-300">Processing Time:</span> {currentTrip.visa_info.processing_time}</p>
                      <p><span className="font-bold text-gray-700 dark:text-gray-300">Estimated Fees:</span> {currentTrip.visa_info.fees}</p>
                      <p><span className="font-bold text-gray-700 dark:text-gray-300">Insurance Required:</span> {currentTrip.visa_info.travel_insurance_required ? "Yes" : "No"}</p>
                    </div>
                    <div>
                      <span className="font-bold text-gray-700 dark:text-gray-300 block mb-2">Required Documents:</span>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        {currentTrip.visa_info.requirements?.map((req: string, i: number) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Safety Details */}
              {currentTrip.safety_tips && (
                <div className="glass p-6 rounded-2xl border border-gray-200/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-sans font-bold text-gray-900 dark:text-white text-sm">Safety Score</h4>
                      <span className="font-extrabold text-lg text-emerald-500">{currentTrip.safety_tips.safety_score} / 100</span>
                    </div>
                    <span className="font-bold text-xs text-gray-600 dark:text-gray-300 block mb-2">Emergency Numbers:</span>
                    <div className="text-xs text-gray-400 space-y-1.5">
                      <p>Police: {currentTrip.safety_tips.emergency_numbers?.police}</p>
                      <p>Medical: {currentTrip.safety_tips.emergency_numbers?.medical}</p>
                      <p>General Helpline: {currentTrip.safety_tips.emergency_numbers?.general}</p>
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-xs text-gray-600 dark:text-gray-300 block mb-2">Common Tourist Scams:</span>
                    <ul className="list-disc list-inside text-xs text-gray-400 space-y-1.5">
                      {currentTrip.safety_tips.common_scams?.slice(0, 3).map((scam: string, i: number) => (
                        <li key={i}>{scam}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: BUDGET ANALYZER */}
          {activeTab === "budget" && (
            <div className="space-y-6 animate-page-enter">
              {/* Cost Allocation Chart */}
              <div className="glass p-6 rounded-2xl border border-gray-200/10">
                <h4 className="font-sans font-bold text-gray-900 dark:text-white text-sm mb-6">Budget Category Allocation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={breakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {breakdownData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip formatter={(value) => formatPrice(Number(value), currency)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-3.5">
                    {breakdownData.map((d, index) => (
                      <div key={d.name} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span className="font-medium text-gray-600 dark:text-gray-300">{d.name}</span>
                        </div>
                        <span className="font-extrabold text-gray-900 dark:text-white">{formatPrice(d.value, currency)}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200/10 pt-3 flex justify-between items-center text-sm font-bold text-gray-900 dark:text-white">
                      <span>Total Estimated Cost</span>
                      <span>{formatPrice(currentTrip.budget_breakdown?.breakdown?.total, currency)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tiers comparison */}
              <div className="glass p-6 rounded-2xl border border-gray-200/10">
                <h4 className="font-sans font-bold text-gray-900 dark:text-white text-sm mb-6">Price Tier Alternatives Comparison</h4>
                <div className="h-60 w-full mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tierData}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => formatPrice(Number(v), currency)} />
                      <ChartTooltip formatter={(value) => formatPrice(Number(value), currency)} />
                      <Bar dataKey="cost" fill="#6366f1" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Saving tips */}
              {currentTrip.budget_breakdown?.saving_tips && (
                <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                  <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 block mb-3 uppercase tracking-wider">Agent Saving Recommendations</span>
                  <ul className="list-disc list-inside text-xs text-gray-500 dark:text-gray-400 space-y-1.5">
                    {currentTrip.budget_breakdown.saving_tips.map((tip: string, i: number) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column (AI Conversational Adjuster) */}
        <div className="space-y-6">
          
          {/* AI Chat Assistant Sidebar */}
          <div className="glass rounded-3xl border border-gray-200/10 h-[650px] flex flex-col overflow-hidden shadow-lg">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-200/10 flex items-center justify-between bg-gradient-to-r from-indigo-500/5 to-purple-500/5 select-none">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-500/10 p-1.5 rounded-lg text-indigo-500">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm text-gray-900 dark:text-white">AI Trip Assistant</h4>
                  <p className="text-[10px] text-gray-400">Updates itinerary & costs dynamically</p>
                </div>
              </div>
            </div>

            {/* Chat message lists */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {chatHistory.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-10 select-none">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Ask the AI Assistant</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-[220px] mx-auto">Try: "make it cheaper", "add a beach day", "suggest luxury hotels"</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {["Make it cheaper", "Add adventure day", "Better hotels", "Vegetarian food only"].map(s => (
                      <button key={s} onClick={() => setChatMessage(s)} className="text-[10px] px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200/50 hover:bg-indigo-100 transition-colors cursor-pointer">{s}</button>
                    ))}
                  </div>
                </div>
              )}
              {chatHistory.map((msg, idx) => {
                const isUser = msg.role === "user";
                // Simple markdown renderer: bold (**text**) and newlines
                const renderContent = (text: string) =>
                  text.split("\n").map((line, li) => {
                    const parts = line.split(/\*\*(.+?)\*\*/g);
                    return (
                      <span key={li} className="block">
                        {parts.map((p, pi) =>
                          pi % 2 === 1 ? <strong key={pi}>{p}</strong> : p
                        )}
                      </span>
                    );
                  });
                return (
                  <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    {!isUser && (
                      <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center mr-2 mt-1 shrink-0">
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                      </div>
                    )}
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      isUser
                        ? "bg-indigo-600 text-white rounded-tr-sm"
                        : "bg-slate-100 text-gray-700 rounded-tl-sm"
                    }`}>
                      {renderContent(msg.content)}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center mr-2 mt-1 shrink-0">
                    <Loader2 className="w-3 h-3 text-indigo-500 animate-spin" />
                  </div>
                  <div className="bg-slate-100 max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3 text-xs flex items-center gap-2.5 text-gray-400 select-none">
                    <span>{loadingStatus || "Updating your itinerary..."}</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Message input footer */}
            <form onSubmit={handleSendChat} className="p-4 border-t border-gray-200/10 flex items-center gap-3">
              <input
                type="text"
                disabled={isLoading}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder='e.g. "make budget cheaper" or "remove day 1 morning"'
                className="flex-1 bg-white dark:bg-slate-900 border border-gray-200/20 rounded-xl p-3 text-xs text-gray-700 dark:text-gray-200 focus:outline-none placeholder:text-gray-500"
              />
              <button
                type="submit"
                disabled={isLoading || !chatMessage.trim()}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>

      </div>

    </div>
  );
}
