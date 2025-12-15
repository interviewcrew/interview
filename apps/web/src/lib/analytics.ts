"use client";

type AuthProvider = "email" | "google" | "github";

type AnalyticsEvents = {
  sign_up_started: { provider: AuthProvider };
  sign_up_completed: { provider: AuthProvider };
  sign_up_failed: { provider: AuthProvider; error: string };
  sign_in_started: { provider: AuthProvider };
  sign_in_completed: { provider: AuthProvider };
  sign_in_failed: { provider: AuthProvider; error: string };

  cta_clicked: { cta: string; location: string };

  interview_created: { interview_id: string; coach_id: string };
  interview_updated: { interview_id: string };
  interview_deleted: { interview_id: string };

  call_lobby_entered: { interview_id: string };
  call_joined: { interview_id: string };
  call_ended: { interview_id: string };

  coach_created: { coach_id: string };
  coach_updated: { coach_id: string };
};

export function track<E extends keyof AnalyticsEvents>(
  event: E,
  properties: AnalyticsEvents[E]
) {
  if (typeof window === "undefined" || !window.posthog) return;
  window.posthog.capture(event, properties);
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.posthog) return;
  window.posthog.identify(userId, traits);
}

export function resetUser() {
  if (typeof window === "undefined" || !window.posthog) return;
  window.posthog.reset();
}
