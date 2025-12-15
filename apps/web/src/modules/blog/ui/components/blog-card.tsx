import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  author: string;
  category: string | null;
  publishedAt: Date | null;
};

type BlogCardProps = {
  post: Post;
};

export default function BlogCard({ post }: BlogCardProps) {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <Link href={`/blog/${post.slug}/`} className="group block h-full">
      <Card className="h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-cyan-500/50 flex flex-col">
        <div className="relative aspect-[16/10] bg-gradient-to-br from-cyan-900/20 to-purple-900/20" />
        <CardContent className="p-5 flex flex-col flex-1">
          {post.category && (
            <Badge variant="outline" className="w-fit mb-3 text-xs">
              {post.category}
            </Badge>
          )}
          <h3 className="text-lg font-semibold mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border/50">
            {formattedDate && <time dateTime={post.publishedAt?.toISOString()}>{formattedDate}</time>}
            <div className="flex items-center gap-1">
              <User className="size-3" />
              <span>{post.author}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
