import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/store";
import type { Trip } from "../context/store";
import { formatPrice } from "../utils/currency";
import { 
  Heart, Calendar, DollarSign, Users, 
  Trash2, Copy, FileText, Compass, Plus 
} from "lucide-react";

export default function SavedTrips() {
  const navigate = useNavigate();
  const { trips, deleteTrip, duplicateTrip, setCurrentTrip, currency, fetchTrips } = useStore();

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleSelectTrip = (trip: Trip) => {
    setCurrentTrip(trip);
    navigate(`/trip/${trip.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-page-enter">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-gray-200/10 pb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2.5">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" /> My Saved Trips
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage and access all your generated travel schedules.</p>
        </div>
        <button
          onClick={() => navigate("/plan")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/15 transition-all hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" /> Plan a New Trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="glass p-16 rounded-3xl border border-gray-200/10 text-center flex flex-col items-center justify-center max-w-xl mx-auto">
          <Compass className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-6 animate-spin-slow" />
          <h3 className="font-bold text-gray-700 dark:text-gray-300 text-lg">No saved trips found</h3>
          <p className="text-sm text-gray-400 mt-2">You don't have any planned trips yet. Launch our Multi-Agent Planner to generate custom budgets and itineraries.</p>
          <button
            onClick={() => navigate("/plan")}
            className="mt-6 bg-indigo-600 text-white font-semibold text-xs px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all cursor-pointer shadow-md shadow-indigo-500/15"
          >
            Create Itinerary
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div 
              key={trip.id}
              className="glass rounded-2xl border border-gray-200/10 hover:border-indigo-500/20 transition-all flex flex-col justify-between overflow-hidden shadow-sm group hover:translate-y-[-2px]"
            >
              {/* Card Header */}
              <div 
                onClick={() => handleSelectTrip(trip)}
                className="p-6 cursor-pointer select-none"
              >
                <div className="flex justify-between items-start gap-2 mb-3">
                  <h3 className="font-display font-extrabold text-gray-900 dark:text-white text-lg group-hover:text-indigo-500 transition-colors">
                    {trip.destination || "Unknown Destination"}
                  </h3>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold capitalize">
                    {trip.preferences?.style || "Standard"}
                  </span>
                </div>
                
                <div className="text-xs text-gray-400 space-y-2 mt-4">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {trip.dates?.start ? new Date(trip.dates.start).toLocaleDateString() : "N/A"} - {trip.dates?.end ? new Date(trip.dates.end).toLocaleDateString() : "N/A"}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    {trip.travelers?.count || 1} Traveler(s)
                  </p>
                  <p className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                    Budget: {formatPrice(trip.budget || 0, currency)}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-6 py-4 border-t border-gray-200/10 bg-slate-500/5 flex items-center justify-between">
                <button
                  onClick={() => handleSelectTrip(trip)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" /> View Details
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => duplicateTrip(trip.id)}
                    className="p-2 hover:bg-indigo-500/10 text-indigo-500 rounded-lg transition-colors cursor-pointer"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTrip(trip.id)}
                    className="p-2 hover:bg-rose-500/10 text-rose-500 rounded-lg transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
