// import from the framework
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

interface CallsLayoutProps {
  children: ReactNode;
}

export default function CallsLayout({
  children,
}: Readonly<CallsLayoutProps>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster />
      <div className="h-screen bg-black">{children}</div>
    </ThemeProvider>
  );
}
