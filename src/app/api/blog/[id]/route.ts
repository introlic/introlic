import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";

// ── GET /api/blog/[id] ───────────────────────────────────────────────────────
// Supports both UUID id and slug lookup
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(isUuid ? or(eq(blogPosts.id, id), eq(blogPosts.slug, id)) : eq(blogPosts.slug, id))
      .limit(1);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (err) {
    console.error("[GET /api/blog/[id]]", err);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

// ── PUT /api/blog/[id] ───────────────────────────────────────────────────────
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session?.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const { title, slug, category, tag, date, readTime, excerpt,
            body: postBody, author, thumbnailUrl, coverName,
            showContributors, contributors, status } = body;

    const [updated] = await db
      .update(blogPosts)
      .set({
        ...(title        !== undefined && { title }),
        ...(slug         !== undefined && { slug }),
        ...(category     !== undefined && { category }),
        ...(tag          !== undefined && { tag }),
        ...(date         !== undefined && { date }),
        ...(readTime     !== undefined && { readTime }),
        ...(excerpt      !== undefined && { excerpt }),
        ...(postBody     !== undefined && { body: postBody }),
        ...(author       !== undefined && { author }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(coverName    !== undefined && { coverName }),
        ...(showContributors !== undefined && { showContributors }),
        ...(contributors !== undefined && { contributors }),
        ...(status       !== undefined && { status }),
      })
      .where(eq(blogPosts.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ post: updated });
  } catch (err) {
    console.error("[PUT /api/blog/[id]]", err);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// ── DELETE /api/blog/[id] ────────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session?.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const [deleted] = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id))
      .returning({ id: blogPosts.id });

    if (!deleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, id: deleted.id });
  } catch (err) {
    console.error("[DELETE /api/blog/[id]]", err);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
