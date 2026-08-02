import { Router, Request, Response } from "express";
import { orchestrateTrip, updateTripWithChat } from "../agents/orchestrator";
import { AgentRequest } from "../agents/templates";
import { supabase } from "../utils/supabase";

const router = Router();

// In-memory fallback database for guest sessions or offline states
const mockTripsDb = new Map<string, any>();

/**
 * GET /api/trips
 * Fetch all travel plans from Supabase (ordered by creation date)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { data: trips, error } = await supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // Merge in-memory mock trips for unified display in development
    const localTrips = Array.from(mockTripsDb.values());
    res.status(200).json([...localTrips, ...trips]);
  } catch (error: any) {
    console.warn("[Supabase] Failed to fetch trips. Returning in-memory fallback:", error.message);
    res.status(200).json(Array.from(mockTripsDb.values()));
  }
});

/**
 * POST /api/trips/generate
 * Trigger the multi-agent travel orchestrator and persist to Supabase
 */
router.post("/generate", async (req: Request, res: Response): Promise<void> => {
  try {
    const { destination, budget, dates, travelers, preferences } = req.body;

    if (!destination || !budget || !dates || !dates.start || !dates.end) {
      res.status(400).json({ error: "Missing required fields (destination, budget, dates)" });
      return;
    }

    const agentRequest: AgentRequest = {
      destination,
      budget: Number(budget),
      dates,
      travelers: travelers || { count: 1, details: "Solo traveller" },
      preferences: {
        style: preferences?.style || "Budget",
        interests: preferences?.interests || ["Sightseeing"],
        food: preferences?.food || "Anything",
        hotels: preferences?.hotels || "Standard hotel",
        transport: preferences?.transport || "Public transit",
        origin: preferences?.origin || "New York",
        accessibility: preferences?.accessibility || "None",
        specialRequests: preferences?.specialRequests || ""
      }
    };

    console.log(`Starting orchestration for ${destination}...`);
    const result = await orchestrateTrip(agentRequest);

    // Persist to Supabase Database
    try {
      const { data: dbTrip, error } = await supabase
        .from("trips")
        .insert({
          destination: agentRequest.destination,
          budget: agentRequest.budget,
          start_date: agentRequest.dates.start,
          end_date: agentRequest.dates.end,
          travelers_count: agentRequest.travelers.count,
          preferences: agentRequest.preferences,
          status: "planning",
          destination_info: result.destination_info,
          weather: result.weather,
          flights: result.flights,
          hotels: result.hotels,
          restaurants: result.restaurants,
          local_transport: result.local_transport,
          visa_info: result.visa_info,
          currency_info: result.currency_info,
          safety_tips: result.safety_tips,
          activities: result.activities,
          packing_list: result.packing_list,
          itinerary: result.itinerary,
          budget_breakdown: result.budget_breakdown
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log(`[Supabase] Persisted generated trip for ${destination} with ID: ${dbTrip.id}`);
      res.status(200).json(dbTrip);
    } catch (dbError: any) {
      console.warn("[Supabase] Insert failed. Falling back to local in-memory storage:", dbError.message);
      const tripId = `mock_${Date.now()}`;
      const tripData = { id: tripId, ...result };
      mockTripsDb.set(tripId, tripData);
      res.status(200).json(tripData);
    }
  } catch (error: any) {
    console.error("Orchestration route failed:", error);
    res.status(500).json({ 
      error: "Multi-Agent Orchestrator failed to generate trip.", 
      details: error.message 
    });
  }
});

/**
 * POST /api/trips/chat
 * Recalculate itinerary based on chatbot feedback and update Supabase
 */
router.post("/chat", async (req: Request, res: Response): Promise<void> => {
  try {
    const { tripId, message, chatHistory, originalTrip } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    let tripToUpdate = originalTrip;
    
    // Check in-memory database if not provided
    if (tripId && !tripToUpdate && mockTripsDb.has(tripId)) {
      tripToUpdate = mockTripsDb.get(tripId);
    }

    if (!tripToUpdate) {
      // Fetch from Supabase directly
      try {
        const { data: fetchedTrip, error } = await supabase
          .from("trips")
          .select("*")
          .eq("id", tripId)
          .single();
        if (fetchedTrip) tripToUpdate = fetchedTrip;
      } catch (err) {
        // Fall through
      }
    }

    if (!tripToUpdate) {
      res.status(404).json({ error: "Trip data not found." });
      return;
    }

    console.log(`Updating trip for destination ${tripToUpdate.destination} based on user chat: "${message}"`);
    const updateResult = await updateTripWithChat(tripToUpdate, chatHistory || [], message);

    // Save updated values back to database/in-memory cache
    if (tripId && mockTripsDb.has(tripId)) {
      const dbRecord = mockTripsDb.get(tripId);
      dbRecord.itinerary = updateResult.updated_itinerary;
      dbRecord.budget_breakdown = updateResult.updated_budget_breakdown;
      mockTripsDb.set(tripId, dbRecord);
    } else if (tripId) {
      try {
        const { error } = await supabase
          .from("trips")
          .update({
            itinerary: updateResult.updated_itinerary,
            budget_breakdown: updateResult.updated_budget_breakdown
          })
          .eq("id", tripId);

        if (error) throw error;
        console.log(`[Supabase] Successfully updated trip ${tripId} via Chat Agent.`);
      } catch (dbError: any) {
        console.warn("[Supabase] Failed to persist chat update:", dbError.message);
      }
    }

    res.status(200).json({
      updatedTrip: {
        ...tripToUpdate,
        itinerary: updateResult.updated_itinerary,
        budget_breakdown: updateResult.updated_budget_breakdown
      },
      explanation: updateResult.explanation
    });
  } catch (error: any) {
    console.error("Chat update route failed:", error);
    res.status(500).json({ 
      error: "Failed to update trip with chat instructions.", 
      details: error.message 
    });
  }
});

/**
 * DELETE /api/trips/:id
 * Delete a trip from Supabase
 */
router.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    if (id.startsWith("mock_")) {
      mockTripsDb.delete(id);
    } else {
      const { error } = await supabase
        .from("trips")
        .delete()
        .eq("id", id);
      if (error) throw error;
      console.log(`[Supabase] Deleted trip with ID: ${id}`);
    }
    res.status(200).json({ success: true, message: "Trip deleted successfully." });
  } catch (error: any) {
    console.warn(`[Supabase] Delete failed: ${error.message}`);
    res.status(500).json({ error: "Failed to delete trip from database." });
  }
});

export default router;
