import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";

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
          {process.env.NEXT_PUBLIC_GTM_ID && (
            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
          )}
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
