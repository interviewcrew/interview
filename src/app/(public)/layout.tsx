import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { monaspaceNeon } from "@/app/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    title: "Interview Crew Candidate Preparation Portal",
    description:
      "Preparing A-players Software Engineers to for their dream job",
    url: "https://interviewcrew.io",
    siteName: "InterviewCrew",
    images: [
      {
        url: "/images/social_card.png", // TODO: create a social_card
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@interviewcrew", // TODO: create the twitter handle
    creator: "@interviewcrew", // TODO: create the twitter handle
    title: "Interview Crew Candidate Preparation Portal",
    description:
      "Preparing A-players Software Engineers to for their dream job",
    images: ["https://interviewcrew.io/social_card.png"],
  },
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster />
      <div className={cn(monaspaceNeon.variable, "background-color font-sans")}>
        {children}
      </div>
    </ThemeProvider>
  );
}
