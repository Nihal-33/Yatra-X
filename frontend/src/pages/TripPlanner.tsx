import { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStore } from "../context/store";
import { formatPrice } from "../utils/currency";
import { 
  Sparkles, Calendar, MapPin, DollarSign, Users, Plane, Heart, 
  Car, Utensils, Hotel, ArrowRight, ArrowLeft, Loader2, Compass, Navigation 
} from "lucide-react";

export default function TripPlanner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { generateTrip, isLoading, loadingStatus, currency } = useStore();

  const [step, setStep] = useState(1);
  const [naturalLanguage, setNaturalLanguage] = useState("");

  // Form Fields State
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState(1000);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [style, setStyle] = useState("Budget");
  const [interests, setInterests] = useState<string[]>([]);
  const [food, setFood] = useState("Local delicacies");
  const [hotels, setHotels] = useState("Standard hotels");
  const [transport, setTransport] = useState("Public transport");
  const [origin, setOrigin] = useState("New York");
  const [specialRequests, setSpecialRequests] = useState("");
  const [travelMode, setTravelMode] = useState<"flights" | "trains" | "buses">("flights");

  // Check if we navigated here with a suggested destination
  useEffect(() => {
    if (location.state && (location.state as any).suggestDest) {
      setDestination((location.state as any).suggestDest);
      // Pre-fill some default dates (e.g. 1 month from now for 5 days)
      const start = new Date();
      start.setDate(start.getDate() + 30);
      const end = new Date(start);
      end.setDate(end.getDate() + 5);
      
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
    }
  }, [location.state]);

  const interestOptions = [
    "Sightseeing", "Nature", "Historical", "Adventure", 
    "Museums", "Shopping", "Nightlife", "Photography", "Relaxation"
  ];

  const handleInterestToggle = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  // Pre-fill fields using Natural Language Parsing (Simulated parser for instant UI delight)
  const parseNaturalLanguage = () => {
    const text = naturalLanguage.toLowerCase();
    
    // Parse Destination
    const destMatches = [
      { key: "bali", name: "Bali" },
      { key: "paris", name: "Paris" },
      { key: "tokyo", name: "Tokyo" },
      { key: "london", name: "London" },
      { key: "rome", name: "Rome" },
      { key: "swiss", name: "Switzerland" },
      { key: "switzerland", name: "Switzerland" },
      { key: "new york", name: "New York" },
      { key: "goa", name: "Goa" }
    ];
    for (const match of destMatches) {
      if (text.includes(match.key)) {
        setDestination(match.name);
        break;
      }
    }

    // Parse Budget
    if (text.includes("₹") || text.includes("inr") || text.includes("rupees")) {
      const numberMatch = text.match(/\d+[,.\d]*/);
      if (numberMatch) {
        const rawNum = parseInt(numberMatch[0].replace(/,/g, ""));
        // Convert to approximate USD for calculation
        setBudget(Math.round(rawNum / 80));
      }
    } else {
      const numberMatch = text.match(/(?:\$|usd)?\s*(\d+[,.\d]*)/);
      if (numberMatch) {
        const val = parseInt(numberMatch[1].replace(/,/g, ""));
        if (val > 100) setBudget(val);
      }
    }

    // Parse Style
    if (text.includes("honeymoon") || text.includes("romantic") || text.includes("couple")) {
      setStyle("Solo"); // Maps to Solo/Couple recommendations
      setInterests((prev) => [...new Set([...prev, "Relaxation", "Photography"])]);
    } else if (text.includes("family") || text.includes("kids")) {
      setStyle("Family");
      setInterests((prev) => [...new Set([...prev, "Sightseeing"])]);
    } else if (text.includes("luxury") || text.includes("expensive")) {
      setStyle("Luxury");
    } else if (text.includes("budget") || text.includes("cheap")) {
      setStyle("Budget");
    } else if (text.includes("adventure") || text.includes("trek") || text.includes("climb")) {
      setStyle("Adventure");
      setInterests((prev) => [...new Set([...prev, "Adventure", "Nature"])]);
    }

    // Set default dates if not selected
    const start = new Date();
    start.setDate(start.getDate() + 14);
    const end = new Date(start);
    // Find number of days in query
    const daysMatch = text.match(/(\d+)\s*-?\s*day/);
    const days = daysMatch ? parseInt(daysMatch[1]) : 5;
    end.setDate(end.getDate() + days);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);

    // Move to step 2 for verification
    setStep(2);
  };

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !startDate || !endDate) {
      alert("Please fill in destination and travel dates.");
      return;
    }

    const trip = await generateTrip({
      destination,
      budget,
      dates: { start: startDate, end: endDate },
      travelers,
      style,
      interests,
      food,
      hotels,
      transport: travelMode === "flights" ? "Flight" : travelMode === "trains" ? "Train" : "Bus",
      origin,
      accessibility: "",
      specialRequests
    });

    if (trip) {
      navigate(`/trip/${trip.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-6 select-none relative">
        <div className="absolute inset-0 bg-world-map opacity-5 pointer-events-none" />
        
        {/* Animated core spinner */}
        <div className="relative mb-10 flex justify-center items-center">
          <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
          <Compass className="w-8 h-8 text-indigo-400 absolute animate-pulse" />
        </div>

        {/* Dynamic status card */}
        <div className="max-w-md w-full glass-premium border border-gray-700/50 p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-pulse" />
          
          <h2 className="font-display text-xl font-bold text-white mb-2">Orchestrating AI Agents</h2>
          <p className="text-xs text-gray-400 mb-6">Our 13 specialized systems are collaborating to research, evaluate, and structure your itinerary.</p>
          
          {/* Active status bubble */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 p-4 rounded-2xl text-sm font-semibold select-none flex items-center justify-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4 shrink-0" />
            {loadingStatus || "Initializing Master Orchestration..."}
          </div>
          
          {/* Skeleton progress bar */}
          <div className="w-full bg-gray-800 rounded-full h-1.5 mt-6 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full animate-progress" style={{ width: "85%" }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-page-enter">
      
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Orchestrate Your Journey</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Provide parameters for the AI Agents, or describe your trip in plain language.</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-10 select-none">
        {[1, 2, 3].map((num) => (
          <Fragment key={num}>
            <div 
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-sm transition-all ${
                step === num 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-105" 
                  : step > num 
                    ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400"
              }`}
            >
              {num}
            </div>
            {num < 3 && <div className={`w-16 h-[2px] rounded ${step > num ? "bg-indigo-500" : "bg-gray-200 dark:bg-gray-800"}`} />}
          </Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="glass p-8 sm:p-10 rounded-3xl border border-gray-200/10 shadow-xl">
        
        {/* Step 1: Natural Language Box & Destination basics */}
        {step === 1 && (
          <div className="space-y-8 animate-page-enter">
            {/* Natural language helper */}
            <div className="bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 border border-indigo-500/15 p-6 rounded-2xl">
              <label className="font-sans font-bold text-sm text-indigo-700 dark:text-indigo-300 flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4" /> Natural Language Planning (AI Autoparse)
              </label>
              <textarea
                value={naturalLanguage}
                onChange={(e) => setNaturalLanguage(e.target.value)}
                placeholder="Example: I want a 5-day budget trip for 2 people in Paris starting next month with emphasis on museums and romance."
                className="w-full bg-white dark:bg-slate-900 border border-gray-200/20 rounded-xl p-3 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-gray-400 h-20 resize-none"
              />
              <button
                type="button"
                onClick={parseNaturalLanguage}
                className="mt-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ml-auto"
              >
                Autoparse Parameters <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative flex items-center justify-center my-6">
              <span className="absolute bg-white dark:bg-slate-900 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Or enter manually</span>
              <div className="w-full border-t border-gray-200/10"></div>
            </div>

            {/* Destination Name */}
            <div>
              <label className="font-sans font-bold text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-indigo-500" /> Destination
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Bali, Paris, Swiss Alps..."
                className="w-full bg-white dark:bg-slate-900 border border-gray-200/20 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Travel Mode Selector */}
            <div className="space-y-2">
              <label className="font-sans font-bold text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-500" /> Preferred Travel Mode
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "flights", label: "Flights", icon: Plane },
                  { id: "trains", label: "Train", icon: Navigation },
                  { id: "buses", label: "Bus", icon: Compass }
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = travelMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setTravelMode(mode.id as any)}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                        isSelected
                          ? "bg-indigo-600/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-sm"
                          : "bg-white dark:bg-slate-900 border-gray-200/20 hover:border-indigo-500/35 text-gray-500"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-bold">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Origin (Dynamic based on Travel Mode) */}
            <div>
              <label className="font-sans font-bold text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-2">
                {travelMode === "flights" ? (
                  <>
                    <Plane className="w-4 h-4 text-indigo-500" /> Flying From (Origin)
                  </>
                ) : travelMode === "trains" ? (
                  <>
                    <Navigation className="w-4 h-4 text-indigo-500 rotate-[45deg]" /> Departing Train Station (Origin)
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4 text-indigo-500" /> Departing Bus Station (Origin)
                  </>
                )}
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder={
                  travelMode === "flights"
                    ? "e.g. New York (JFK), Mumbai (BOM)..."
                    : travelMode === "trains"
                    ? "e.g. Delhi Cantt, Mumbai Central..."
                    : "e.g. Majestic Bus Terminus, KSRTC Station..."
                }
                className="w-full bg-white dark:bg-slate-900 border border-gray-200/20 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Dates & Travelers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="font-sans font-bold text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-indigo-500" /> Start Date
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200/20 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-sans font-bold text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-indigo-500" /> End Date
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200/20 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-sans font-bold text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-indigo-500" /> Travelers
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200/20 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={!destination || !startDate || !endDate}
              className="w-full bg-indigo-600 disabled:opacity-50 text-white font-semibold p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors mt-8 cursor-pointer"
            >
              Continue to Style & Budget <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Budget & Travel Style */}
        {step === 2 && (
          <div className="space-y-8 animate-page-enter">
            {/* Budget */}
            <div>
              <label className="font-sans font-bold text-sm text-gray-700 dark:text-gray-200 flex items-center justify-between mb-2">
                <span className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-indigo-500" /> Target Budget ({currency})</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-lg">{formatPrice(budget, currency)}</span>
              </label>
              <input
                type="range"
                min="300"
                max="10000"
                step="100"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{formatPrice(300, currency)} (Thrifty)</span>
                <span>{formatPrice(5000, currency)} (Comfort)</span>
                <span>{formatPrice(10000, currency)} (Luxury)</span>
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <label className="font-sans font-bold text-sm text-gray-700 dark:text-gray-200 mb-4 block">
                Select Travel Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {["Budget", "Comfort", "Luxury", "Adventure", "Family"].map((sty) => (
                  <button
                    key={sty}
                    type="button"
                    onClick={() => setStyle(sty)}
                    className={`p-4 rounded-xl border font-sans text-xs font-semibold transition-all cursor-pointer ${
                      style === sty 
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "border-gray-200/20 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {sty}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 border border-gray-200/25 text-gray-600 dark:text-gray-300 font-semibold p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100/30 dark:hover:bg-gray-800/30 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-indigo-600 text-white font-semibold p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Continue to Interests <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Interests & Advanced options */}
        {step === 3 && (
          <div className="space-y-8 animate-page-enter">
            {/* Interests */}
            <div>
              <label className="font-sans font-bold text-sm text-gray-700 dark:text-gray-200 mb-4 block">
                Select Your Interests
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {interestOptions.map((opt) => {
                  const isChecked = interests.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleInterestToggle(opt)}
                      className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        isChecked 
                          ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                          : "border-gray-200/20 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isChecked ? "fill-indigo-500 text-indigo-500" : "text-gray-400"}`} />
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Advanced Preferences accordion/inputs */}
            <div className="space-y-6 pt-4 border-t border-gray-200/15">
              <h4 className="font-display font-bold text-sm text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-4">Advanced Customization Options</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="font-sans font-bold text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-2">
                    <Hotel className="w-3.5 h-3.5" /> Accommodations
                  </label>
                  <select 
                    value={hotels}
                    onChange={(e) => setHotels(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-gray-200/20 rounded-xl p-3 text-xs text-gray-700 dark:text-gray-200 focus:outline-none"
                  >
                    <option value="Standard hotels">Standard Hotels</option>
                    <option value="Luxury resorts">Luxury Resorts</option>
                    <option value="Hostels & Shared Spaces">Hostels & Shared Spaces</option>
                    <option value="Airbnb apartments">Airbnb Apartments</option>
                    <option value="Boutique Villas">Boutique Villas</option>
                  </select>
                </div>

                <div>
                  <label className="font-sans font-bold text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-2">
                    <Utensils className="w-3.5 h-3.5" /> Food Preferences
                  </label>
                  <select 
                    value={food}
                    onChange={(e) => setFood(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-gray-200/20 rounded-xl p-3 text-xs text-gray-700 dark:text-gray-200 focus:outline-none"
                  >
                    <option value="Local delicacies">Local Food</option>
                    <option value="Vegetarian meals only">Vegetarian Only</option>
                    <option value="Vegan preferences">Vegan Preference</option>
                    <option value="Fine dining establishments">Fine Dining</option>
                    <option value="Anything goes">No Preference</option>
                  </select>
                </div>

                <div>
                  <label className="font-sans font-bold text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-2">
                    <Car className="w-3.5 h-3.5" /> Transportation
                  </label>
                  <select 
                    value={transport}
                    onChange={(e) => setTransport(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-gray-200/20 rounded-xl p-3 text-xs text-gray-700 dark:text-gray-200 focus:outline-none"
                  >
                    <option value="Public transit (metro, bus)">Public Transit</option>
                    <option value="Rental Car">Rental Car</option>
                    <option value="Private Taxi / Uber services">Taxi / Ridesharing</option>
                    <option value="Biking & Walking focus">Biking & Walking</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-sans font-bold text-xs text-gray-500 dark:text-gray-400 mb-2 block">
                  Dietary / Accessibility or Special Requests
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Wheelchair access needed, gluten-free, traveling with senior citizens..."
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200/20 rounded-xl p-3.5 text-xs text-gray-700 dark:text-gray-200 focus:outline-none placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 border border-gray-200/25 text-gray-600 dark:text-gray-300 font-semibold p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100/30 dark:hover:bg-gray-800/30 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold p-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-white" /> Orchestrate Trip Plan
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
