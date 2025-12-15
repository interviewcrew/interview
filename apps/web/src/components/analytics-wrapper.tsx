"use client";

import { useEffect, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { getCookiePreferences } from "@/lib/cookies";

export function AnalyticsWrapper() {
  const [analyticsConsent, setAnalyticsConsent] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const preferences = getCookiePreferences();
      setAnalyticsConsent(preferences?.consent.analytics ?? false);
    };

    checkConsent();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cookie-consent") {
        checkConsent();
      }
    };

    const handleConsentUpdate = () => {
      checkConsent();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("cookie-consent-updated", handleConsentUpdate);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cookie-consent-updated", handleConsentUpdate);
    };
  }, []);

  if (!analyticsConsent) return null;

  return (
    <>
      <SpeedInsights />
      <Analytics />
    </>
  );
}

