"use client";

import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function BlogAdminView() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(trpc.posts.getMany.queryOptions({ pageSize: 100 }));
  const deleteMutation = useMutation(trpc.posts.remove.mutationOptions());
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Post",
    "Are you sure you want to delete this post? This action cannot be undone."
  );

  const handleDelete = async (id: string) => {
    const confirmed = await confirm();
    if (!confirmed) return;

    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Post deleted");
          queryClient.invalidateQueries({ queryKey: trpc.posts.getMany.queryKey() });
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  if (isLoading) {
    return <BlogAdminViewLoading />;
  }

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-4">
        {data?.items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No posts yet. Create your first post!</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="line-clamp-1">{post.title}</p>
                      <p className="text-xs text-muted-foreground">/{post.slug}/</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={post.status === "published" ? "default" : "secondary"}
                    >
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {post.status === "published" && (
                        <Link href={`/blog/${post.slug}/`} target="_blank">
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="size-4" />
                          </Button>
                        </Link>
                      )}
                      <Link href={`/dashboard/blog/${post.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="size-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}

export function BlogAdminViewLoading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

export function BlogAdminViewError() {
  return (
    <div className="text-center py-12 text-destructive">
      <p>Failed to load posts. Please try again.</p>
    </div>
  );
}

export function BlogAdminHeader() {
  return (
    <div className="flex items-center justify-between p-4 md:p-6 border-b bg-background">
      <div>
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <p className="text-sm text-muted-foreground">
          Manage your blog content
        </p>
      </div>
      <Link href="/dashboard/blog/new">
        <Button>
          <Plus className="size-4 mr-2" />
          New Post
        </Button>
      </Link>
    </div>
  );
}

