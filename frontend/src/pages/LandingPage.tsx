import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Sparkles, Plane, ShieldCheck, Sun, DollarSign, ArrowRight, Star, HelpCircle } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  // 13 Agents Grid details
  const agents = [
    { name: "Master Coordinator", desc: "Orchestrates prompt inputs & builds custom itinerary workflow chains.", icon: Compass, color: "text-indigo-500 bg-indigo-500/10" },
    { name: "Destination Researcher", desc: "Analyzes cultural background, safety scores, and best visiting seasons.", icon: Sparkles, color: "text-purple-500 bg-purple-500/10" },
    { name: "Flight Route Analyst", desc: "Estimates multi-city flights, airline layovers, and airport choices.", icon: Plane, color: "text-blue-500 bg-blue-500/10" },
    { name: "Hotel Curator", desc: "Identifies standard and premium accommodations matching your budget.", icon: ShieldCheck, color: "text-emerald-500 bg-emerald-500/10" },
    { name: "Itinerary Designer", desc: "Builds hourly schedules and slots for morning, afternoon, and evening.", icon: Sparkles, color: "text-amber-500 bg-amber-500/10" },
    { name: "Budget Auditor", desc: "Compares low, medium, and luxury cost tiers and lists saving tips.", icon: DollarSign, color: "text-rose-500 bg-rose-500/10" },
    { name: "Weather forecaster", desc: "Predicts temperatures, precipitation, and packing necessities.", icon: Sun, color: "text-yellow-500 bg-yellow-500/10" },
    { name: "Culinary Guide", desc: "Finds breakfast, lunch, and dinner joints matching food styles.", icon: Sparkles, color: "text-orange-500 bg-orange-500/10" }
  ];

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-radial from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center flex flex-col items-center flex-1 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow" /> Powered by Collaborative AI Agents
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-tight mb-8"
        >
          Let <span className="text-gradient font-extrabold">13 AI Agents</span> Orchestrate Your Dream Vacation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-gray-500 dark:text-gray-300 text-lg sm:text-xl max-w-3xl leading-relaxed mb-10"
        >
          From hotels and cheap flights to safety alerts, local menus, packing lists, and day-by-day itineraries, our cooperative multi-agent system does the hard work in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mb-20"
        >
          <button
            onClick={() => navigate("/plan")}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all cursor-pointer"
          >
            Start Planning Now
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto glass border border-gray-200/20 text-gray-700 dark:text-gray-200 font-semibold px-8 py-4 rounded-2xl flex items-center justify-center hover:bg-gray-100/30 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
          >
            Explore Dashboard
          </button>
        </motion.div>

        {/* Dynamic Flying Plane Animation */}
        <div className="relative w-full max-w-5xl h-[280px] sm:h-[380px] bg-slate-200/10 dark:bg-slate-800/20 border border-gray-200/10 rounded-3xl overflow-hidden glass shadow-2xl flex items-center justify-center">
          <div className="absolute inset-0 bg-world-map opacity-5 dark:opacity-10 pointer-events-none" />
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 2, 0]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute z-10 flex flex-col items-center gap-4 text-center px-6"
          >
            <Plane className="w-16 h-16 text-indigo-500 rotate-[45deg]" />
            <div className="font-display font-bold text-xl dark:text-white">Active Global Orchestration Sandbox</div>
            <div className="text-xs text-gray-400">Google Maps • Amadeus • DeepSeek • OpenWeather</div>
          </motion.div>
        </div>
      </section>

      {/* Agents Section */}
      <section className="bg-slate-500/5 py-24 border-y border-gray-200/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Meet Your Dedicated Travel Agents</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">13 specialized, autonomous systems interacting cooperatively to design and customize your journeys.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="glass-premium p-6 rounded-2xl border border-gray-200/10 hover:border-indigo-500/20 transition-all hover:translate-y-[-4px]"
              >
                <div className={`p-3 rounded-xl w-fit ${agent.color} mb-4`}>
                  <agent.icon className="w-6 h-6" />
                </div>
                <h3 className="font-sans font-bold text-lg mb-2 text-gray-900 dark:text-white">{agent.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{agent.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Loved by Modern Travelers</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">See how travelers are utilizing multi-agent AI architectures to plan complex trips.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "Orchestrated a 10-day multi-city trip to Japan in seconds. The budget tracking updated when I swapped my hotel in the chat sidebar!", author: "Kirsten W.", role: "Solo Adventurer", rating: 5 },
              { text: "Having weather forecasts integrated with packing guides and visa steps saved hours of manual cross-referencing. Truly premium.", author: "Marcus K.", role: "Family Coordinator", rating: 5 },
              { text: "The interactive Google Map with flight estimations was perfect. Exported the PDF itinerary and synced the calendar ICS in one click.", author: "Sophia R.", role: "Digital Nomad", rating: 5 }
            ].map((t, idx) => (
              <div key={idx} className="glass p-8 rounded-2xl border border-gray-200/10 relative">
                <div className="flex gap-1 text-amber-500 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic text-sm mb-6 leading-relaxed">"{t.text}"</p>
                <div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white">{t.author}</div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-500/5 py-24 border-t border-gray-200/10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-extrabold text-gray-900 dark:text-white flex justify-center items-center gap-2">
              <HelpCircle className="w-8 h-8 text-indigo-500" /> Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              { q: "How do the 13 agents interact?", a: "The Master Agent takes your destination, budget, and styles to generate core instructions. It then calls the Hotel, Flight, Weather, and Recommendation agents in parallel. Finally, Itinerary and Budget agents compile and format the unified plan." },
              { q: "Can I customize the generated trip plan?", a: "Yes! Use the AI Chat Assistant on the itinerary page to make alterations (e.g. 'remove Day 2 afternoon', 'use a cheaper hotel'). The agents will dynamically recalculate and refresh your timelines and budget charts instantly." },
              { q: "Can I use this app offline?", a: "Absolutely. Our app has built-in offline mock models. If backend servers are unreachable, it automatically triggers local heuristics to draft high-quality itineraries, ensuring complete reliability." }
            ].map((faq, i) => (
              <details key={i} className="group glass p-6 rounded-2xl border border-gray-200/10 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                <summary className="flex justify-between items-center font-bold text-gray-900 dark:text-white">
                  <span>{faq.q}</span>
                  <span className="transition duration-300 group-open:-rotate-180">
                    <ArrowRight className="w-4 h-4 rotate-90 text-indigo-500" />
                  </span>
                </summary>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200/10 bg-slate-950 text-gray-400 text-sm mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <Compass className="w-5 h-5 text-indigo-500" /> yatraX
          </div>
          <div>© {new Date().getFullYear()} yatraX Inc. All rights reserved. Built with Antigravity.</div>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
