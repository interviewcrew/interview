import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { PostForm } from "@/modules/blog/ui/components/post-form";
import { trpc } from "@/trpc/server";

type EditPostPageProps = {
  params: Promise<{ postId: string }>;
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { postId } = await params;
  
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

  const post = await trpc.posts.getById({ id: postId });

  if (!post) {
    notFound();
  }

  return (
    <div className="flex-1 overflow-auto p-4 md:p-6">
      <PostForm post={post} />
    </div>
  );
}

