import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import tripRouter from "./routes/tripRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for frontend connections
app.use(cors({
  origin: "*", // Allow all origins for dev/sandbox environment
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Setup JSON parsing middleware with custom limit to support large payload objects from agents
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Core API endpoints routing
app.use("/api/trips", tripRouter);

// Service Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    service: "Multi-Agent Travel Planner Backend" 
  });
});

// Default root response
app.get("/", (req, res) => {
  res.send("Multi-Agent AI Travel Planner API Service is running.");
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled Global Error:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// Launch server
app.listen(port, () => {
  console.log(`[Server] Multi-Agent API running on http://localhost:${port}`);
});

export default app;
