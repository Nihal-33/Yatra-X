# AeroPlan AI - Cooperative Multi-Agent Travel Planner

AeroPlan AI is a premium, modern travel planning application powered by cooperative AI agents (orchestrating 13 specialized travel sub-agents) working in unison. It automatically compiles custom day-by-day itineraries, flight routes, hotels, local dining guides, safety advisories, weather-aligned packing checklists, and budgets equipped with interactive maps and PDF/ICS calendar exports.

---

## 🛠️ Tech Stack

### Frontend
- **React.js & TypeScript** (built via Vite)
- **Tailwind CSS v4** (ultra-fast utility styling)
- **Zustand** (global lightweight state management)
- **Framer Motion** (smooth screen transitions & flight animations)
- **Recharts** (clean, responsive vector budget allocation visualizations)
- **jsPDF** (client-side PDF generation)

### Backend
- **Node.js & Express** with **TypeScript**
- **OpenAI Node SDK** (configured to connect to NVIDIA NIM cloud endpoints)
- **Dotenv & CORS**

### Database & Auth
- **Supabase** (PostgreSQL database with Row Level Security and trigger-managed timestamps)

---

## 🏗️ Multi-Agent Orchestrator Architecture

The orchestrator utilizes a 4-phase cooperative workflow model to compile travel requests with high speed and low token overhead:

```
            [ User Form Request ]
                     │
                     ▼
  Phase 1   [ Destination Agent ] (Core Climate, Culture, and Safety Research)
                     │
         ┌───────────┼───────────┬───────────┐
         ▼           ▼           ▼           ▼
Phase 2 [Weather] [Flights]   [Hotels] [Restaurants] ... (Parallel Suggestions)
         └───────────┬───────────┼───────────┘
                     ▼           ▼
  Phase 3   [ Packing Agent ] [ Itinerary Agent ] (Day-by-Day Slot Planners)
                     │           │
                     ▼           ▼
  Phase 4          [ Budget Agent ] (Expense tier audits and cost saving tips)
                     │
                     ▼
             [ Consolidator ] ---> Output JSON
```

---

## 🚀 Setup & Execution Instructions

### Prerequisites
- **Node.js** (v20+ recommended)
- **npm** (v10+)

### 1. Database Setup
1. Create a project in [Supabase](https://supabase.com).
2. Open the SQL Editor in the Supabase console.
3. Copy the contents of [`supabase/schema.sql`](file:///d:/nihal/project/AI%20-%20Traveler-planner/supabase/schema.sql) and execute them to construct the tables, triggers, and Row Level Security (RLS) policies.

### 2. Backend Configuration
1. Open the `/backend` folder.
2. The environment file [`.env`](file:///d:/nihal/project/AI%20-%20Traveler-planner/backend/.env) is pre-configured with the default ports, Google Maps key, and the NVIDIA NIM DeepSeek key.
3. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
4. Start the Express development server:
   ```bash
   npm run dev
   ```
   The backend server runs at `http://localhost:5000`.

### 3. Frontend Configuration
1. Open the `/frontend` folder.
2. Install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   The frontend hot-reloads at `http://localhost:5173`. A proxy maps `/api` requests to the local port `5000`.

---

## 🛡️ Robust Fail-safe Features
- **Offline / LLM Failure Fallback**: If the backend is offline, or if the NVIDIA NIM key encounters rate limits, the store falls back to a mock travel compiler in [`frontend/src/utils/mockData.ts`](file:///d:/nihal/project/AI%20-%20Traveler-planner/frontend/src/utils/mockData.ts). This mock model compiles real day-by-day schedules, flights, and restaurants, keeping the system fully usable under all circumstances.
