import ArticleLayout from '@/components/blog/ArticleLayout';
import { allPosts } from '@/components/blog/BlogData';
import { Metadata } from 'next';
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Check static posts first
  let post = allPosts.find((p) => p.slug === slug);

  // Check DB if not in static
  if (!post) {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
      const [dbPost] = await db
        .select()
        .from(blogPosts)
        .where(isUuid ? or(eq(blogPosts.id, slug), eq(blogPosts.slug, slug)) : eq(blogPosts.slug, slug))
        .limit(1);
      
      if (dbPost) {
        post = dbPost as any;
      }
    } catch (e) {
      console.error("Error fetching metadata from DB:", e);
    }
  }

  if (!post) {
    return {
      title: 'Dispatch Not Found | Introlic',
      description: 'The requested technical dispatch could not be found.',
    };
  }

  return {
    title: `${post.title} | Introlic`,
    description: post.excerpt || "",
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      type: 'article',
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return (
    <>
      <ArticleLayout slug={resolvedParams.slug} />
    </>
  );
}

