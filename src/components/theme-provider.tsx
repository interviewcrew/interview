"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

function ThemeWatcher() {
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (isMobile && theme !== "system") {
      setTheme("system");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, theme]);

  return null;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ThemeWatcher />
      {children}
    </NextThemesProvider>
  );
}
