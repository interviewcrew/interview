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

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
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

---

## ⚡ Getting Started

### Prerequisites

*   Node.js (v20+)
*   npm or pnpm
*   A PostgreSQL database (local or hosted)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/interviewcrew/interview.git
    cd interview
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add your database connection string and other secrets:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/interview_crew"
    BETTER_AUTH_SECRET="your-secret-here"
    BETTER_AUTH_URL="http://localhost:3000"
    # Add your AI Provider Keys here
    OPENAI_API_KEY="sk-..." 
    ```

4.  **Database Setup:**
    Push the schema to your database:
    ```bash
    npm run db:push
    ```

5.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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
