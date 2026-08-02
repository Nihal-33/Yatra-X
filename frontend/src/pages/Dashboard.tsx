import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/store";
import type { Trip } from "../context/store";
import { formatPrice } from "../utils/currency";
import { 
  Calendar, MapPin, Compass, Briefcase, Plus, TrendingUp, Sparkles, 
  Trash2, Copy, FileText, ArrowRight, UserCheck, AlertTriangle
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { trips, deleteTrip, duplicateTrip, setCurrentTrip, user, errorMessage, clearError, currency, fetchTrips } = useStore();

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleSelectTrip = (trip: Trip) => {
    setCurrentTrip(trip);
    navigate(`/trip/${trip.id}`);
  };

  // Static stats
  const totalPlannedBudget = trips.reduce((sum, t) => sum + Number(t.budget), 0);
  const totalTripsCount = trips.length;
  
  // Custom travel recommendation recommendations
  const aiSuggestions = [
    { destination: "Bali, Indonesia", tag: "Tropical Honeymoon", budget: "₹60,000", desc: "Best months: Apr-Oct. Enjoy beaches and temples." },
    { destination: "Kyoto, Japan", tag: "Cultural Exploration", budget: "$2,200", desc: "Best months: Mar-May. Blossom trees and heritage." },
    { destination: "Swiss Alps", tag: "Luxury Adventure", budget: "$3,500", desc: "Best months: Dec-Mar. Ski resorts and scenery." }
  ];

  const handleCreateNewTrip = () => {
    navigate("/plan");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-page-enter">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 border-b border-gray-200/10 pb-6">
        <div>
          <h1 className="font-display text-3.5xl font-extrabold text-gray-900 dark:text-white leading-none">
            Welcome back, {user?.name.split(" ")[0]}!
          </h1>
          <p className="text-gray-400 text-xs mt-2.5 font-medium">
            Plan new custom journeys, track active itineraries, and manage travel budgets.
          </p>
        </div>
        <button
          onClick={handleCreateNewTrip}
          className="bg-indigo-600 text-white font-semibold text-xs px-5 py-3 rounded-2xl hover:bg-indigo-700 transition-all hover:scale-[1.01] flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" /> Plan a New Trip
        </button>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-amber-800 dark:text-amber-300">Offline Fallback Triggered</h4>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">{errorMessage}</p>
          </div>
          <button onClick={clearError} className="text-xs text-amber-500 hover:text-amber-700 font-semibold cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="glass p-6 rounded-2xl border border-gray-200/10 flex items-center gap-4">
          <div className="p-3.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{totalTripsCount}</div>
            <div className="text-xs text-gray-400 font-medium">Total Planned Trips</div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-gray-200/10 flex items-center gap-4">
          <div className="p-3.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {formatPrice(totalPlannedBudget, currency)}
            </div>
            <div className="text-xs text-gray-400 font-medium">Allocated Travel Budgets</div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-gray-200/10 flex items-center gap-4">
          <div className="p-3.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {trips.map(t => t.destination).filter((v, i, self) => self.indexOf(v) === i).length}
            </div>
            <div className="text-xs text-gray-400 font-medium">Unique Destinations</div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-gray-200/10 flex items-center gap-4">
          <div className="p-3.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">13 Agents</div>
            <div className="text-xs text-gray-400 font-medium">Active Orchestrator Node</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Trips List Panel */}
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" /> Recent Trip Itineraries
          </h2>

          {trips.length === 0 ? (
            <div className="glass p-12 rounded-3xl border border-gray-200/10 text-center flex flex-col items-center justify-center">
              <Compass className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4 animate-spin-slow" />
              <h3 className="font-bold text-gray-700 dark:text-gray-300">No active itineraries</h3>
              <p className="text-sm text-gray-400 max-w-sm mt-2">Get started by planning a custom trip using our multi-agent scheduling engines.</p>
              <button
                onClick={() => navigate("/plan")}
                className="mt-6 bg-indigo-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-indigo-600 transition-all cursor-pointer"
              >
                Plan your first trip
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="glass p-6 rounded-2xl border border-gray-200/10 hover:border-indigo-500/25 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
                >
                  <div 
                    onClick={() => handleSelectTrip(trip)} 
                    className="flex-1 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-lg text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                        {trip.destination || "Unknown Destination"}
                      </span>
                      <span className="text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md font-semibold capitalize">
                        {trip.preferences?.style || "Standard"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-4">
                      <span>
                        {trip.dates?.start ? new Date(trip.dates.start).toLocaleDateString() : "N/A"} - {trip.dates?.end ? new Date(trip.dates.end).toLocaleDateString() : "N/A"}
                      </span>
                      <span>•</span>
                      <span>Budget: {formatPrice(trip.budget || 0, currency)}</span>
                      <span>•</span>
                      <span>{trip.travelers?.count || 1} Traveler(s)</span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                    <button
                      onClick={() => handleSelectTrip(trip)}
                      className="p-2 hover:bg-indigo-500/10 text-indigo-500 rounded-xl transition-all cursor-pointer"
                      title="Open Itinerary"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => duplicateTrip(trip.id)}
                      className="p-2 hover:bg-indigo-500/10 text-indigo-500 rounded-xl transition-all cursor-pointer"
                      title="Duplicate Trip"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteTrip(trip.id)}
                      className="p-2 hover:bg-rose-500/10 text-rose-500 rounded-xl transition-all cursor-pointer"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Travel Suggestions Sidebar */}
        <div>
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" /> AI Travel Recommendations
          </h2>

          <div className="space-y-4">
            {aiSuggestions.map((sug) => (
              <div 
                key={sug.destination}
                onClick={() => {
                  navigate("/plan", { state: { suggestDest: sug.destination } });
                }}
                className="glass-premium p-5 rounded-2xl border border-gray-200/10 hover:border-indigo-500/20 hover:scale-[1.01] transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="font-sans font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                    {sug.destination}
                  </span>
                  <span className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full font-semibold">
                    {sug.tag}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">{sug.desc}</p>
                <div className="flex items-center justify-between text-xs text-indigo-500 dark:text-indigo-400 font-semibold mt-2">
                  <span>Estimated Budget: {sug.budget}</span>
                  <span className="flex items-center gap-1">Plan Journey <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" /></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
