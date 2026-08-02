import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useStore } from "../context/store";
import { User, Map, Heart, LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, currency, setCurrency } = useStore();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { label: "Dashboard", path: "/" },
    { label: "Plan a Trip", path: "/plan" },
    { label: "My Trips", path: "/saved" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200/20 backdrop-blur-md px-6 py-4 shadow-sm select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center">
          <svg width="210" height="60" viewBox="0 0 420 120" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="navG1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#16C79A"/>
                <stop offset="100%" stopColor="#2D9CDB"/>
              </linearGradient>
              <linearGradient id="navG2" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6EE7B7"/>
                <stop offset="100%" stopColor="#2563EB"/>
              </linearGradient>
            </defs>

            {/* Left Part of X */}
            <path
              d="M20 20 L55 20 L85 50 L55 80 L20 80 L50 50 Z"
              fill="url(#navG1)"
            />
            {/* Right Part of X */}
            <path
              d="M90 20 L125 20 L95 50 L125 80 L90 80 L60 50 Z"
              fill="url(#navG2)"
            />
            {/* Mountain */}
            <path d="M35 45 L48 30 L60 45 Z" fill="white"/>
            {/* Location Pin */}
            <g transform="translate(88,10)">
              <path
                d="M18 5 C11 5 6 10 6 17 C6 27 18 40 18 40 C18 40 30 27 30 17 C30 10 25 5 18 5Z"
                fill="#16C79A"
              />
              <circle cx="18" cy="17" r="5" fill="white"/>
            </g>

            {/* YatraX Text */}
            <text x="150" y="55" fontSize="46" fontFamily="Poppins, Arial, sans-serif" fontWeight="700" fill="currentColor" className="fill-gray-900 dark:fill-white">
              Yatra
            </text>
            <text x="290" y="55" fontSize="46" fontFamily="Poppins, Arial, sans-serif" fontWeight="700" fill="#16C79A">
              X
            </text>

            {/* Tagline */}
            <text x="150" y="80" fontSize="14" fontFamily="Poppins, Arial" fill="#A1A1AA" letterSpacing="1">
              MULTI-AGENT AI TRAVEL PLANNER
            </text>
          </svg>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative font-sans text-sm font-medium transition-colors duration-200 hover:text-indigo-500 ${
                isActive(link.path)
                  ? "text-indigo-600"
                  : "text-gray-600"
              }`}
            >
              {link.label}
              {isActive(link.path) && (
                <span className="absolute bottom-[-22px] left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Side Options (Theme, User, Mobile menu) */}
        <div className="flex items-center gap-4">
          {/* Currency Toggle Button */}
          <button
            onClick={() => setCurrency(currency === "USD" ? "INR" : "USD")}
            className="p-2.5 rounded-xl border border-gray-200/20 hover:bg-gray-100/50 transition-all font-sans font-extrabold text-sm text-indigo-600 cursor-pointer flex items-center justify-center shrink-0 w-10 h-10 shadow-sm"
            title="Switch Currency (USD / INR)"
          >
            {currency === "USD" ? "$" : "₹"}
          </button>

          {/* Theme Toggle removed */}

          {/* User Profile Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-gray-200/20 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all cursor-pointer"
              >
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-indigo-500/20"
                />
                <span className="hidden sm:inline text-xs font-semibold text-gray-700">
                  {user.name.split(" ")[0]}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute right-0 mt-3 w-56 glass-premium rounded-2xl shadow-xl py-2 z-20 border border-gray-200/10 overflow-hidden animate-page-enter">
                    <div className="px-4 py-3 border-b border-gray-200/10">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-500/10 transition-colors"
                    >
                      <Map className="w-4 h-4 text-indigo-500" />
                      Dashboard
                    </Link>
                    <Link
                      to="/saved"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-500/10 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      My Saved Trips
                    </Link>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        alert("Mock Logout success.");
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer border-t border-gray-200/10"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-full font-sans text-sm font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md shadow-indigo-500/25">
              <User className="w-4 h-4" />
              Sign In
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200/10 flex flex-col gap-3 animate-page-enter">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? "bg-indigo-500/10 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-100/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
