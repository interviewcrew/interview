"use client";

import { useState, useEffect, useCallback } from "react";
import { Cookie, Settings2, Shield, BarChart3, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type CookieConsent as CookieConsentType,
  type CookiePreferences,
  defaultConsent,
  getCookiePreferences,
  setCookiePreferences,
  updateGTMConsent,
} from "@/lib/cookies";
import { cn } from "@/lib/utils";
import Link from "next/link";

type CookieCategory = {
  id: keyof CookieConsentType;
  name: string;
  description: string;
  icon: React.ReactNode;
  required?: boolean;
};

const cookieCategories: CookieCategory[] = [
  {
    id: "necessary",
    name: "Necessary",
    description:
      "Essential cookies that enable core functionality. These cannot be disabled.",
    icon: <Shield className="size-4" />,
    required: true,
  },
  {
    id: "analytics",
    name: "Analytics",
    description:
      "Help us understand how visitors interact with our website to improve user experience.",
    icon: <BarChart3 className="size-4" />,
  },
  {
    id: "marketing",
    name: "Marketing",
    description:
      "Used to deliver personalized ads and measure the effectiveness of ad campaigns.",
    icon: <Megaphone className="size-4" />,
  },
];

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [consent, setConsent] = useState<CookieConsentType>(defaultConsent);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const preferences = getCookiePreferences();
    if (!preferences) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setConsent(preferences.consent);
      updateGTMConsent(preferences.consent);
    }
  }, []);

  const savePreferences = useCallback(
    (newConsent: CookieConsentType, status: CookiePreferences["status"]) => {
      const preferences: CookiePreferences = {
        consent: newConsent,
        status,
        updatedAt: new Date().toISOString(),
      };
      setCookiePreferences(preferences);
      updateGTMConsent(newConsent);
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    },
    []
  );

  const handleAcceptAll = useCallback(() => {
    const allAccepted: CookieConsentType = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setConsent(allAccepted);
    savePreferences(allAccepted, "accepted");
  }, [savePreferences]);

  const handleRejectAll = useCallback(() => {
    const allRejected: CookieConsentType = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setConsent(allRejected);
    savePreferences(allRejected, "rejected");
  }, [savePreferences]);

  const handleSavePreferences = useCallback(() => {
    savePreferences(consent, "customized");
    setShowPreferences(false);
  }, [consent, savePreferences]);

  const handleToggleCategory = useCallback(
    (categoryId: keyof CookieConsentType) => {
      setConsent((prev) => ({
        ...prev,
        [categoryId]: !prev[categoryId],
      }));
    },
    []
  );

  if (!isVisible) return null;

  return (
    <>
      <div
        className={cn(
          "fixed bottom-4 right-4 z-50 max-w-sm transition-all duration-300 ease-out",
          isAnimating
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        )}
      >
        <div className="bg-card border-border rounded-xl border p-4 shadow-lg backdrop-blur-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Cookie className="size-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-foreground text-sm font-semibold">
                Cookie Settings
              </h3>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              We use cookies to enhance your experience.{" "}
              <Link href="/privacy" className="text-cyan-600 hover:underline dark:text-cyan-400">
                Learn more
              </Link>
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={handleAcceptAll}
                size="sm"
                className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Accept All
              </Button>
              <Button onClick={handleRejectAll} variant="outline" size="sm">
                Reject
              </Button>
              <Button
                onClick={() => setShowPreferences(true)}
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                <Settings2 className="mr-1 size-3.5" />
                Customize
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="size-5 text-cyan-600 dark:text-cyan-400" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. You can enable or disable
              different types of cookies below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {cookieCategories.map((category) => (
              <div
                key={category.id}
                className="bg-muted/50 flex items-start justify-between gap-4 rounded-lg p-4"
              >
                <div className="flex gap-3">
                  <div className="text-muted-foreground mt-0.5">
                    {category.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground text-sm font-medium">
                        {category.name}
                      </span>
                      {category.required && (
                        <span className="rounded bg-cyan-100 px-1.5 py-0.5 text-xs text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={consent[category.id]}
                  onCheckedChange={() => handleToggleCategory(category.id)}
                  disabled={category.required}
                  aria-label={`Toggle ${category.name} cookies`}
                />
              </div>
            ))}
          </div>

          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPreferences(false)}
              className="flex-1 sm:flex-none sm:min-w-[120px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePreferences}
              className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 sm:flex-none sm:min-w-[120px]"
            >
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function CookieSettingsButton({
  className,
}: {
  className?: string;
}) {
  const handleOpenSettings = useCallback(() => {
    localStorage.removeItem("cookie-consent");
    window.location.reload();
  }, []);

  return (
    <button
      onClick={handleOpenSettings}
      className={cn(
        "text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors",
        className
      )}
    >
      <Cookie className="size-3.5" />
      Cookie Settings
    </button>
  );
}

