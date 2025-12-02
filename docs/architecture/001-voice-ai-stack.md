# Architecture Decision Record: Voice & Video AI Stack

## Context
We are building an AI-powered Interview Platform where users engage in a real-time video interview with an AI Coach. The core requirements are:
1.  **Low Latency:** The conversation must feel natural, like a real human-to-human call.
2.  **Video Presence:** The user's camera should be visible (creating an "interview atmosphere"), even if the AI doesn't "see" it yet.
3.  **Recording:** The session must be recorded (Audio + Video) for later review.
4.  **Intelligence:** The AI must be capable of conducting a structured interview.

## Decision
**We have chosen to use the Stream Video SDK + OpenAI Realtime API integration.**

## Alternatives Considered

### 1. ElevenLabs Conversational AI SDK (Audio-Only)
*   **Concept:** Use ElevenLabs' new React SDK which handles WebRTC audio directly.
*   **Pros:**
    *   Simpler frontend implementation for audio.
    *   High-quality voices.
    *   Lower initial complexity (no backend webhook needed).
*   **Cons:**
    *   **No Native Video:** We would have to build a separate parallel video recorder. Syncing a separate video track with the ElevenLabs audio track for the final recording is technically difficult and error-prone.
    *   **Limited Control:** Harder to implement custom "interview phases" or multi-party scenarios (e.g., a human supervisor joining).

### 2. Custom "Chain" Stack (Transcriber -> LLM -> TTS)
*   **Concept:** We manually stitch together Deepgram (Transcribe) + Claude 3.5 (LLM) + ElevenLabs (TTS).
*   **Pros:**
    *   **Model Choice:** We could use Claude 3.5 Sonnet (often better for reasoning) or specialized coding models.
    *   **Voice Choice:** Unlimited voice options.
*   **Cons:**
    *   **Latency:** This "daisy chain" architecture typically results in 1.5s - 3s of latency because of the multiple network hops and processing steps.
    *   **Complexity:** Requires hosting a dedicated WebSocket server to manage the state and media pipeline.
    *   **Awkwardness:** Multi-second delays destroy the flow of a natural interview.

## Justification for Stream + OpenAI Realtime

### 1. Speech-to-Speech (Ultra Low Latency)
The OpenAI Realtime API is a **native Speech-to-Speech model**. It does not transcribe to text, think, and then read text. It processes audio *directly*.
*   **Result:** Latency is <500ms.
*   **Impact:** The user can interrupt the AI ("Wait, sorry, I meant..."), and the AI handles it instantly.

### 2. Unified Video Infrastructure
Stream treats the AI agent as just another "participant" in a standard Video Call.
*   **Result:** We get Video Recording, Screen Sharing, Layouts, and Bandwidth management for free.
*   **Impact:** We don't have to build a video app from scratch; we just use a video platform.

### 3. Echo Cancellation
Because Stream uses WebRTC, it handles **Acoustic Echo Cancellation (AEC)** natively.
*   Without this, if the user speaks while the AI is talking, the AI would hear its own voice looping back.
*   WebRTC solves this at the browser level.

## Future Mitigation Strategy
We acknowledge the risk of being "vendor-locked" to OpenAI's intelligence. To mitigate this:
*   **Stream's "Vision Agents":** Stream is rolling out support for other providers (Gemini, etc.) in the future.
*   **Model Updates:** We can instantly switch to `gpt-5.1` as soon as they are supported by the Realtime API.
*   **Fallback:** If we absolutely need a custom model (e.g., for a specific coding test), we can build a custom "Participant" using Stream's Node SDK that injects custom audio, without rewriting the frontend.

