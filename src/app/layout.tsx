// import from the framework
import type { Metadata } from "next";
import { Inter } from "next/font/google";

// import from packages
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

// import from the libraries
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";

// import from the components
const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interview Crew Candidate Preparation Portal",
  description: "Preparing A-players Software Engineers for their dream job",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo-light.svg",
        href: "/logo-light.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo-dark.svg",
        href: "/logo-dark.svg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NuqsAdapter>
      <TRPCReactProvider>
        <html lang="en" suppressHydrationWarning>
          <body className={`${inter.className} antialiased`}>
            {children}
            <SpeedInsights />
            <Analytics />
          </body>
        </html>
      </TRPCReactProvider>
    </NuqsAdapter>
  );
}
