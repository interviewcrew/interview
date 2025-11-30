import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { StreamService } from "./lib/stream";
import { InterviewConductor } from "./interview-conductor";
import { InterviewInstructions } from "@interview/shared";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const AGENT_SECRET = process.env.AGENT_SECRET || "secret"; // Fallback for dev, but should be set

// Store active interview conductors
const activeInterviews = new Map<string, InterviewConductor>();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/start-agent", async (req, res) => {
  const authHeader = req.headers["x-agent-secret"];
  if (authHeader !== AGENT_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const {
    interviewId,
    coachId,
    systemPrompt,
    interviewInstructions,
    openaiApiKey,
    voice,
  } = req.body;

  if (!interviewId || !coachId || !openaiApiKey) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log(`Starting agent for interview: ${interviewId}`);
  console.log(systemPrompt);
  console.log(interviewInstructions);
  console.log(voice);

  try {
    const call = StreamService.getCall(interviewId);

    console.log(
      `Interview ${interviewId}: Joining OpenAI Agent to the call...`
    );
    const realtimeClient = await StreamService.connectOpenAi(
      call,
      openaiApiKey,
      coachId
    );

    // Initial Instructions
    console.log(
      `Interview ${interviewId}: Updating session with initial instructions which is ${systemPrompt}\n${interviewInstructions.phases[0]?.instructions || ""}`
    );
    await realtimeClient.updateSession({
      instructions: `${systemPrompt}\n${interviewInstructions.phases[0]?.instructions || ""}`,
      voice: voice || "verse",
      turn_detection: {
        type: "server_vad",
      },
    });

    const conductor = new InterviewConductor(
      interviewId,
      realtimeClient,
      systemPrompt,
      interviewInstructions as InterviewInstructions
    );

    activeInterviews.set(interviewId, conductor);

    conductor.start();

    res.json({ status: "started", interviewId });
  } catch (error) {
    console.error("Error starting agent:", error);
    // Don't expose raw error details in production usually, but helpful for debugging
    res
      .status(500)
      .json({ error: "Failed to start agent", details: String(error) });
  }
});

app.post("/stop-agent", async (req, res) => {
  const authHeader = req.headers["x-agent-secret"];
  if (authHeader !== AGENT_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { interviewId } = req.body;

  if (!interviewId) {
    return res.status(400).json({ error: "Missing interviewId" });
  }

  console.log(`Stopping agent for interview: ${interviewId}`);

  const conductor = activeInterviews.get(interviewId);

  if (conductor) {
    conductor.stop();
    activeInterviews.delete(interviewId);
    console.log(`Agent stopped for interview: ${interviewId}`);
    return res.json({ status: "stopped", interviewId });
  } else {
    console.log(`No active agent found for interview: ${interviewId}`);
    return res.status(404).json({ error: "Agent not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Agent service running on port ${PORT}`);
});
