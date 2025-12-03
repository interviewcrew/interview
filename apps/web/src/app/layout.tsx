import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { CookieConsent } from "@/components/cookie-consent";

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
          <Script id="gtm-consent-init" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied'
              });
            `}
          </Script>
          {process.env.NEXT_PUBLIC_GTM_ID && (
            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
          )}
          <body className={`${inter.className} antialiased`}>
            {children}
            <CookieConsent />
            <SpeedInsights />
            <Analytics />
          </body>
        </html>
      </TRPCReactProvider>
    </NuqsAdapter>
  );
}
