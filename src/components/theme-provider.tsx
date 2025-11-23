"use client";

import { ComponentProps, useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

function ThemeWatcher() {
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile && theme !== "system") {
      setTheme("system");
    }
  }, [isMobile, theme, setTheme]);

  return null;
}

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ThemeWatcher />
      {children}
    </NextThemesProvider>
  );
}
