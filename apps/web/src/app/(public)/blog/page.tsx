import type { Metadata } from "next";
import { caller } from "@/trpc/server";
import BlogCard from "@/modules/blog/ui/components/blog-card";
import BlogHeader from "@/modules/blog/ui/components/blog-header";
import BlogFooter from "@/modules/blog/ui/components/blog-footer";

export const metadata: Metadata = {
  title: "Blog | Interview Crew - Career Tips for Software Engineers",
  description:
    "Expert advice on acing technical interviews, building standout resumes, and advancing your software engineering career.",
  keywords: [
    "software engineering career",
    "technical interview tips",
    "system design interview",
    "coding interview",
    "resume tips",
  ],
  openGraph: {
    type: "website",
    title: "Blog | Interview Crew",
    description:
      "Expert advice on technical interviews and career growth for software engineers.",
    url: "https://interviewcrew.io/blog/",
    siteName: "Interview Crew",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Interview Crew",
    description:
      "Expert advice on technical interviews and career growth for software engineers.",
  },
  alternates: {
    canonical: "https://interviewcrew.io/blog/",
  },
};

export default async function BlogPage() {
  const { items: posts } = await caller().posts.getPublished({ pageSize: 100 });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <BlogHeader />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Tips on technical interviews, career growth, and landing your
              dream engineering job.
            </p>
          </div>

          {posts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts yet. Check back soon!</p>
            </div>
          )}
        </section>
      </main>
      <BlogFooter />
    </div>
  );
}
