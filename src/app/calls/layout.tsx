interface CallsLayoutProps {
  children: React.ReactNode;
}

export default function CallsLayout({
  children,
}: Readonly<CallsLayoutProps>) {
  return <div className="h-screen bg-black">{children}</div>;
}
