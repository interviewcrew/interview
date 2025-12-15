import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { PostForm } from "@/modules/blog/ui/components/post-form";

export default async function NewPostPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const isAdmin =
    session.user.email?.endsWith("@interviewcrew.io") && session.user.emailVerified;

  if (!isAdmin) {
    redirect("/dashboard/interviews");
  }

  return (
    <div className="flex-1 overflow-auto p-4 md:p-6">
      <PostForm />
    </div>
  );
}

