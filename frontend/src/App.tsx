import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import TripPlanner from "./pages/TripPlanner";
import ItineraryViewer from "./pages/ItineraryViewer";
import SavedTrips from "./pages/SavedTrips";

function AppContent() {
  const location = useLocation();
  // Don't show Navbar on Landing/Welcome page to let the Hero graphics breathe
  const showNavbar = location.pathname !== "/welcome";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {showNavbar && <Navbar />}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/welcome" element={<LandingPage />} />
          <Route path="/plan" element={<TripPlanner />} />
          <Route path="/saved" element={<SavedTrips />} />
          <Route path="/trip/:id" element={<ItineraryViewer />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
