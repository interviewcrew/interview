"use client";

// Imports from the components
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const HomeView = () => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.hello.queryOptions({ text: "Sadjad" }));

  return <div className="flex flex-col p-4 gap-y-4">{data?.greeting}</div>;
};
