import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { caller } from "@/trpc/server";
import BlogHeader from "@/modules/blog/ui/components/blog-header";
import BlogFooter from "@/modules/blog/ui/components/blog-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export async function generateStaticParams() {
  const slugs = await caller().posts.getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await caller().posts.getBySlug({ slug });

    return {
      title: `${post.title} | Interview Crew Blog`,
      description: post.excerpt || post.title,
      authors: [{ name: post.author }],
      openGraph: {
        type: "article",
        title: post.title,
        description: post.excerpt || post.title,
        url: `https://interviewcrew.io/blog/${slug}/`,
        siteName: "Interview Crew",
        publishedTime: post.publishedAt?.toISOString(),
        authors: [post.author],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt || post.title,
      },
      alternates: {
        canonical: `https://interviewcrew.io/blog/${slug}/`,
      },
    };
  } catch {
    return {
      title: "Post Not Found | Interview Crew",
    };
  }
}

function BlogPostJsonLd({
  post,
  slug,
}: {
  post: Awaited<ReturnType<typeof trpc.posts.getBySlug>>;
  slug: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    datePublished: post.publishedAt?.toISOString(),
    url: `https://interviewcrew.io/blog/${slug}/`,
    publisher: {
      "@type": "Organization",
      name: "Interview Crew",
      logo: {
        "@type": "ImageObject",
        url: "https://interviewcrew.io/logo-dark.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://interviewcrew.io/blog/${slug}/`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = await caller().posts.getBySlug({ slug });
  } catch {
    notFound();
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const readingTime = calculateReadingTime(post.content);

  return (
    <>
      <BlogPostJsonLd post={post} slug={slug} />
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
        <BlogHeader />
        <main className="flex-1">
          <article className="container mx-auto px-4 py-12 lg:px-8 lg:py-16 max-w-3xl">
            <Link href="/blog/">
              <Button
                variant="ghost"
                className="mb-8 -ml-4 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-4 mr-2" />
                Back to Blog
              </Button>
            </Link>

            <header className="mb-8">
              {post.category && (
                <Badge variant="outline" className="mb-4">
                  {post.category}
                </Badge>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="size-4" />
                  <span>{post.author}</span>
                </div>
                {formattedDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    <time dateTime={post.publishedAt?.toISOString()}>
                      {formattedDate}
                    </time>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </header>

            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </article>
        </main>
        <BlogFooter />
      </div>
    </>
  );
}
