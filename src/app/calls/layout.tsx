// import from the framework
import { ReactNode } from "react";

interface CallsLayoutProps {
  children: ReactNode;
}

export default function CallsLayout({
  children,
}: Readonly<CallsLayoutProps>) {
  return <div className="h-screen bg-black">{children}</div>;
}
