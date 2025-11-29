# Architecture Decision Record: Monorepo Migration

## Status
Accepted

## Context
The current Voice AI Interview platform is built as a single Next.js application. As we integrate more complex features, specifically the long-running, stateful AI Agent service needed for real-time voice interaction, we are facing architectural challenges:

1.  **Coupling**: The stateless web application (UI, Auth, DB) is tightly coupled with the AI Agent logic.
2.  **State Management**: The Agent Server needs to be "stateless" regarding business data (no direct DB access) but stateful regarding the WebSocket connection, whereas Next.js Serverless functions are ephemeral.
3.  **Contract Drift**: Sharing TypeScript types (Zod schemas, Interfaces) between the web frontend and a separate Node.js agent service is difficult without a shared workspace.

We need an architecture that enforces strict separation of concerns while maintaining type safety across services.

## Decision
**We have decided to refactor the codebase into a TurboRepo-based monorepo.**

**We have chosen `pnpm` as the package manager** for its efficient disk usage and first-class support for workspaces, which is essential for TurboRepo.

This architecture will separate the project into distinct applications and shared packages:

*   **`apps/web`**: The existing Next.js application (UI, Auth, DB, Webhooks).
*   **`apps/agent`**: A new, dedicated Node.js/Express service for the AI Runtime.
*   **`packages/shared`**: A shared library for TypeScript types, schemas, and constants.

### Directory Structure

```text
.
├── apps/
│   ├── web/                  # (Current Next.js App)
│   │   ├── Framework: Next.js (App Router)
│   │   ├── Responsibility: UI, Auth, Database (Drizzle), Webhooks, Orchestration
│   │   └── Deployment: Vercel (Serverless)
│   │
│   └── agent/                # (New Agent Service)
│       ├── Framework: Node.js / Express
│       ├── Responsibility: OpenAI Realtime Connection, Stream Audio Relay, Interview Conductor Loop
│       ├── Dependencies: @repo/shared, @stream-io/node-sdk, openai
│       └── Deployment: Railway / Render (Long-running Process)
│
├── packages/
│   ├── shared/               # (Shared Logic)
│   │   ├── Tech: TypeScript, Zod
│   │   └── Responsibility: InterviewInstructions Types, Constants (FAQ), Shared Utilities
│   │
│   └── config/               # (Shared Config)
│       └── eslint, typescript, tailwind
│
├── turbo.json                # TurboRepo Configuration
└── pnpm-workspace.yaml       # Workspace Definition
```

### Technical Implementation Plan

#### Phase 1: Workspace Initialization
1.  Initialize root `pnpm-workspace.yaml` and `turbo.json`.
2.  Create `apps/web` and move the existing Next.js project files into it.
3.  Create `apps/agent` as a clean Node.js TypeScript project.

#### Phase 2: Extract Shared Libraries
1.  **`packages/shared`**: Initialize the shared package. This will house the future `InterviewInstructions` types, schemas, and constants to be shared between the Web App and Agent Service.
2.  **Database**: The Database (`src/db`) and Drizzle configuration will remain inside `apps/web` since the Agent is stateless and does not access the DB.

#### Phase 3: Implement Agent Service
1.  Create `apps/agent/src/server.ts` (Entry point).
2.  Create `apps/agent/src/conductor.ts` (Interview logic).
3.  Import types from `@repo/shared`.
4.  **Boundary Check**: Ensure `apps/agent` has **NO** dependency on `@repo/db`. It must receive all data via the `/start-agent` payload.

#### Phase 4: Refactor Web App
1.  Update `apps/web/src/app/api/webhook/route.ts` to construct the payload and POST it to the `AGENT_SERVER_URL` instead of handling the interview logic locally.

### Data Flow (Post-Refactor)
1.  **Trigger**: Stream Video Webhook -> `apps/web` (`/api/webhook`).
2.  **Validation**: `apps/web` checks DB status, Auth, etc.
3.  **Handoff**: `apps/web` sends POST request to `apps/agent`:
    ```json
    {
      "interviewId": "uuid",
      "coachId": "uuid",
      "openaiApiKey": "sk-...", // (Or loaded from Agent env)
      "systemPrompt": "System Prompt...",
      "interviewInstructions": { "phases": [...] }
    }
    ```
4.  **Execution**: `apps/agent` connects to Stream & OpenAI and runs the interview loop.
5.  **Completion**: `apps/agent` disconnects. `apps/web` receives `call.ended` event from Stream to finalize DB state.

### Local Development

To simplify the complexity of running multiple services (Next.js, Agent, Inngest, Webhook tunnels), we will use `docker-compose` for local development.

#### `docker-compose.yml`
The compose file will spin up:
1.  **Postgres (Local DB)**: (Optional) If you want to develop offline, or we continue connecting to Neon Dev branch.
2.  **Agent Service**: Runs `apps/agent` in watch mode.
3.  **Inngest Dev Server**: Runs the local Inngest dashboard and event router.
4.  **Ngrok / Tunnel**: Exposes the local Agent Server or Web App to the internet (required for Stream Webhooks).

*Note: The Next.js App (`apps/web`) is usually better run locally on the host machine (outside Docker) to preserve Fast Refresh (HMR) performance, but it can communicate with the Dockerized services.*

### Deployment Strategy

1.  **Web App (`apps/web`)**:
    *   **Target**: Vercel.
    *   **Trigger**: Push to `main`.
    *   **Method**: Vercel GitHub Integration (Automatic).

2.  **Agent Service (`apps/agent`)**:
    *   **Target**: Railway / Render (Docker).
    *   **Trigger**: Push to `main` (only if `apps/agent` or `packages/` changed).
    *   **Method**: GitHub Action builds Docker image -> Pushes to Registry -> Triggers Redeploy.

3.  **Inngest**:
    *   **Target**: Inngest Cloud.
    *   **Method**: The Web App and Agent will simply point to the Inngest Cloud URL in production. Self-hosted Inngest is only for local dev.

## Consequences

### Benefits
*   **Stability**: Heavy AI processing doesn't affect the Web App's performance.
*   **Scalability**: Agent Server can be scaled independently based on active calls.
*   **Developer Experience**: Clear separation makes the codebase easier to navigate and test.
*   **Type Safety**: Shared packages ensure the API contract remains synced.

### Risks & Drawbacks
*   **Complexity**: Monorepo tooling (Turbo, pnpm workspaces) adds initial setup complexity.
*   **Deployment**: Requires setting up two separate deployment pipelines instead of one.
*   **Local Dev**: Requires running multiple processes (Web, Agent, Inngest, DB) simultaneously.
