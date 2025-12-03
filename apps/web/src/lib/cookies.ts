export type CookieConsent = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentStatus = "pending" | "accepted" | "rejected" | "customized";

export type CookiePreferences = {
  consent: CookieConsent;
  status: ConsentStatus;
  updatedAt: string;
};

const COOKIE_CONSENT_KEY = "cookie-consent";

export const defaultConsent: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as CookiePreferences;
  } catch {
    return null;
  }
}

export function setCookiePreferences(preferences: CookiePreferences): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
}

export function updateGTMConsent(consent: CookieConsent): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "consent_update",
    consent: {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: consent.marketing ? "granted" : "denied",
      ad_user_data: consent.marketing ? "granted" : "denied",
      ad_personalization: consent.marketing ? "granted" : "denied",
    },
  });
}

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

