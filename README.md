# Interview Crew

**The Open Source AI Career Coach for Engineers.**

Interview Crew is a suite of **free, open-source tools** designed to help software engineers master technical interviews, build world-class resumes, and accelerate their careers.

We believe that high-quality career preparation shouldn't be paywalled. Whether you're a new grad or a Staff Engineer, you deserve the best tools to showcase your skills.

---

## 🚀 Features

### 🤖 AI Mock Interviewer
Practice makes perfect. Our AI conducts realistic technical interviews tailored to your level and role.
*   **Screening Rounds:** Practice behavioral and rapid-fire technical questions.
*   **System Design:** whiteboard complex architecture problems with AI feedback.
*   **Live Coding:** Solve real world programming challenges with an AI pair programmer that hints, but doesn't solve.

### 📄 Smart Resume Builder
Stop sending resumes into the void.
*   **AI Analysis:** Get instant feedback on your current resume based on industry standards.
*   **Tailoring:** Automatically customize your resume keywords and summary for specific job descriptions.
*   **Templates:** Clean, ATS-friendly templates designed for engineering roles.

### 🗺️ Career Roadmap
Don't practice randomly.
*   **Skill Gap Analysis:** Find out exactly what you're missing for that Senior or Staff role.
*   **Curated Resources:** Get a personalized learning path with the best articles, videos, and problems to solve.

---

## 💡 The Mission

**Built by Engineers, For Engineers.**

While our tools are free for candidates, our mission goes deeper. We are building an **AI-First Recruitment Agency** that flips the hiring model upside down.

Instead of recruiters spamming you, we use these tools to identify **"A-Players"**—engineers who demonstrate exceptional skill and growth. If you consistently perform well in our mock interviews, you can qualify for our **Exclusive Talent Catalog**.

*   **Get Scouted:** We pitch *you* to top companies.
*   **Skip the Line:** Fast-track past the resume screen directly to final rounds.
*   **Total Privacy:** Your practice data is yours. You only enter the hiring pool if you explicitly opt-in.

---

## 🛠 Tech Stack

This project is built with a modern, type-safe stack focused on performance and developer experience.

*   **Monorepo:** [TurboRepo](https://turbo.build/) + [pnpm](https://pnpm.io/)
*   **Web App:** [Next.js 15](https://nextjs.org/) (App Router) - *UI, Auth, DB, Webhooks*
*   **Agent Service:** Node.js / Express - *Real-time AI Audio/Video processing*
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/) (via Neon)
*   **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
*   **Auth:** [Better Auth](https://www.better-auth.com/)
*   **API:** [tRPC](https://trpc.io/) (Type-safe APIs)
*   **AI:** OpenAI / Anthropic APIs (configurable)

## 📚 Documentation & Architecture

We maintain a log of all major architectural decisions in our **[Architecture Decision Records (ADRs)](docs/architecture/README.md)**.

*   [ADR-001: Voice & Video AI Stack Selection](docs/architecture/001-voice-ai-stack.md)
*   [ADR-002: Monorepo Migration](docs/architecture/002-monorepo-migration.md)

---

## ⚡ Getting Started

### Prerequisites

*   Node.js (v20+)
*   pnpm (v8+)
*   Docker (for local services)
*   Ngrok Account (for webhook tunnels)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/interviewcrew/codebase.git
    cd interview
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Setup:**
    Copy the example environment file and configure your secrets:
    ```bash
    cp .env.example .env
    ```
    You will need keys for:
    *   Database (Postgres connection)
    *   Better Auth
    *   OpenAI API
    *   Stream.io (Video/Chat)
    *   Inngest
    *   Ngrok

### Running Locally

We use a hybrid approach for local development:
*   **Docker:** Runs the isolated Agent Service, Inngest, and Postgres.
*   **Host Machine:** Runs the Web App (Next.js) for fast HMR.

1.  **Start Backend Services:**
    ```bash
    docker compose up -d
    ```
    This starts:
    *   `agent`: The AI Voice Agent (port 8000)
    *   `inngest`: Event orchestrator (port 8288)
    *   `postgres`: Local database (port 5432) - *Optional if using cloud DB*
    *   `ngrok`: Tunnel for public access - *Required for webhooks*

2.  **Setup Database:**
    Run migrations to the local or remote database:
    ```bash
    pnpm --filter @interview/web db:push
    ```

3.  **Start Web App:**
    ```bash
    pnpm --filter @interview/web dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to see the app.

4.  **Start Webhook Tunnel (Alternative):**
    If you are not using the Dockerized Ngrok, run this manually to expose your local Next.js app:
    ```bash
    export NGROK_DOMAIN="your-static-domain.ngrok-free.app"
    pnpm --filter @interview/web dev:webhook
    ```

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's fixing a bug in the mock interview logic or adding a new resume template, your help is appreciated.

1.  Fork the repo.
2.  Create a feature branch.
3.  Commit your changes.
4.  Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

**Interview Crew** — *Code. Practice. Get Hired.*
