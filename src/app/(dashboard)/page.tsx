// import from the framework
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// import from the libraries
import { auth } from "@/lib/auth";

// import from the components
import { HomeView } from "@/modules/home/ui/views/home-view";

const HomePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if(!session) {
    redirect("/sign-in");
  }
  return <HomeView />
}

export default HomePage;