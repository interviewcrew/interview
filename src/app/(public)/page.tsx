"use client";

import Hero from "@/modules/landing/ui/views/hero";
import CircleBackground from "@/modules/landing/ui/views/circle-background";
import SelectLandingPageAudience, {
  LandingPageAudience,
} from "@/modules/landing/ui/views/select-landing-page-audience";
import { useState } from "react";
import { parseAsStringEnum, useQueryState } from "nuqs";

export default function Home() {
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [landingPageAudience, setLandingPageAudience] = useQueryState(
    "audience",
    parseAsStringEnum<LandingPageAudience>(
      Object.values(LandingPageAudience)
    ).withDefault(LandingPageAudience.CANDIDATES)
  );

  return (
    <div id="root">
      <Hero />
      <CircleBackground />
      <SelectLandingPageAudience
        landingPageAudience={landingPageAudience}
        setLandingPageAudience={setLandingPageAudience}
      />
      {/* <Features /> */}
      <noscript>
        <div style={{ padding: "2rem" }}>
          <h1>Interview Crew Candidate Preparation Portal</h1>
          <p>Enable JavaScript for the full experience.</p>
          <h2>
            We&apos;re preparing A-players Software Engineers to for their dream
            job.
          </h2>

          <h1>About</h1>
          <p>
            Interview Crew is a set of tools that helps you prepare for your
            dream job. The tools consist of an AI-powered mock interview
            platform, an AI-powered resume builder, and a community of
            A-players. The mock interview platform allows you to practice with
            real interview questions, in a realistic environment, and get
            feedback on your performance. The resume builder allows you to
            prepare your resume with AI, get feedback on it, and customize it to
            your dream job. The community of A-players allows you to connect
            with other A-players, get feedback on your resume, and get help with
            your job search.
          </p>
        </div>
      </noscript>
    </div>
  );
}
