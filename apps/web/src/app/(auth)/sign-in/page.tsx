// Imports from the framework
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Imports from the libraries
import { auth } from "@/lib/auth";

// Imports from the components
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";

const SignInPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if(!!session) {
    redirect("/dashboard");
  }

  return <SignInView />;
};

export default SignInPage;
