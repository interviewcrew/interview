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

function isValidCookiePreferences(parsed: unknown): parsed is CookiePreferences {
  if (typeof parsed !== "object" || parsed === null) return false;

  const p = parsed as Record<string, unknown>;

  if (typeof p.consent !== "object" || p.consent === null) return false;
  const consent = p.consent as Record<string, unknown>;
  if (typeof consent.necessary !== "boolean") return false;
  if (typeof consent.analytics !== "boolean") return false;
  if (typeof consent.marketing !== "boolean") return false;

  if (typeof p.status !== "string") return false;
  if (!["pending", "accepted", "rejected", "customized"].includes(p.status)) return false;

  if (typeof p.updatedAt !== "string") return false;

  return true;
}

export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    if (isValidCookiePreferences(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function setCookiePreferences(preferences: CookiePreferences): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
  window.dispatchEvent(new CustomEvent("cookie-consent-updated"));
}

export function updateGTMConsent(consent: CookieConsent): void {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
  });
}

type ConsentArg = {
  analytics_storage: "granted" | "denied";
  ad_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
};

declare global {
  interface Window {
    gtag: (command: "consent", action: "update" | "default", params: ConsentArg) => void;
  }
}

