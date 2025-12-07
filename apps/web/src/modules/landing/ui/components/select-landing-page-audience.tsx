import { cn } from "@/lib/utils";

export enum LandingPageAudience {
  CANDIDATES = "candidates",
  COMPANIES = "companies",
}

interface SelectLandingPageAudienceProps {
  landingPageAudience: LandingPageAudience;
  className?: string;
  setLandingPageAudience: (landingPageAudience: LandingPageAudience) => void;
}

export default function SelectLandingPageAudience({
  landingPageAudience,
  className,
  setLandingPageAudience,
}: SelectLandingPageAudienceProps) {
  return (
    <div className={cn("flex items-center justify-center mt-12", className)}>
      <div className="relative inline-flex items-center p-1 rounded-full bg-linear-to-r from-yellow-200 via-cyan-200 to-fuchsia-200 dark:from-gray-700 dark:via-gray-700 dark:to-gray-700 shadow-lg">
        {/* Inner background container */}
        <div className="relative inline-flex items-center rounded-full bg-amber-50 dark:bg-gray-900 p-1">
          {/* Animated slider background */}
          <div
            className={`absolute inset-y-1 w-1/2 bg-linear-to-br from-indigo-950 to-purple-950 dark:from-indigo-900 dark:to-purple-900 rounded-full shadow-lg transition-all duration-500 ease-out ${
              landingPageAudience === LandingPageAudience.CANDIDATES
                ? "left-1"
                : "left-1/2"
            }`}
            style={{
              transform:
                landingPageAudience === LandingPageAudience.CANDIDATES
                  ? "translateX(0)"
                  : "translateX(-2px)",
            }}
          />

          {/* For Candidates Button */}
          <button
            onClick={() =>
              setLandingPageAudience(LandingPageAudience.CANDIDATES)
            }
            className={`relative z-10 px-6 py-2 rounded-full font-medium text-xs transition-all duration-300 ease-out transform ${
              landingPageAudience === LandingPageAudience.CANDIDATES
                ? "text-white scale-105"
                : "text-gray-800 dark:text-gray-300 hover:scale-105"
            }`}
            aria-pressed={
              landingPageAudience === LandingPageAudience.CANDIDATES
            }
          >
            For candidates
          </button>

          {/* For Companies Button */}
          <button
            onClick={() =>
              setLandingPageAudience(LandingPageAudience.COMPANIES)
            }
            className={`relative z-10 px-6 py-2 rounded-full font-medium text-xs transition-all duration-300 ease-out transform ${
              landingPageAudience === LandingPageAudience.COMPANIES
                ? "text-white scale-105"
                : "text-gray-800 dark:text-gray-300 hover:scale-105"
            }`}
            aria-pressed={landingPageAudience === LandingPageAudience.COMPANIES}
          >
            For companies
          </button>
        </div>
      </div>
    </div>
  );
}
