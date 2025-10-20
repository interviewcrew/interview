"use client";

// Imports from the framework
import { useRouter } from "next/navigation";

// Imports from the packages
import { authClient } from "@/lib/auth-client";

// Imports from the components
import { Button } from "@/components/ui/button";

export const HomeView = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  if (!session) {
    return (
      <div className="flex flex-col p-4 gap-y-4">
        <p>Not logged in</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 gap-y-4">
      <p>Logged in as {session.user.name}</p>
      <Button
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/sign-in");
              },
            },
          })
        }
        variant="destructive"
      >
        Sign Out
      </Button>
    </div>
  );
};
