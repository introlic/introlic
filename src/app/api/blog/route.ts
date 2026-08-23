import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq, desc, asc, and, ilike, or, SQL } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";

// ── GET /api/blog ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page     = Math.max(1, parseInt(searchParams.get("page")     || "1"));
    const limit    = Math.min(50, parseInt(searchParams.get("limit")   || "20"));
    const category = searchParams.get("category") || "";
    const author   = searchParams.get("author")   || "";
    const sort     = searchParams.get("sort")     || "newest";
    const status   = searchParams.get("status")   || "published";
    const search   = searchParams.get("search")   || "";

    const conditions: SQL[] = [];
    if (status !== "all") conditions.push(eq(blogPosts.status, status));
    if (category && category !== "All") conditions.push(eq(blogPosts.category, category));
    if (author && author !== "All Authors") conditions.push(eq(blogPosts.author, author));
    if (search) {
      conditions.push(
        or(
          ilike(blogPosts.title,   `%${search}%`),
          ilike(blogPosts.excerpt, `%${search}%`),
          ilike(blogPosts.tag,     `%${search}%`),
          ilike(blogPosts.author,  `%${search}%`)
        )!
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const orderBy =
      sort === "oldest" ? asc(blogPosts.createdAt) :
      sort === "title"  ? asc(blogPosts.title)      :
      desc(blogPosts.createdAt);

    const offset = (page - 1) * limit;
    const rows = await db.select().from(blogPosts).where(where).orderBy(orderBy).limit(limit).offset(offset);
    const countRows = await db.select({ id: blogPosts.id }).from(blogPosts).where(where);

    return NextResponse.json({
      posts: rows,
      total: countRows.length,
      page,
      limit,
      totalPages: Math.ceil(countRows.length / limit),
    });
  } catch (err) {
    console.error("[GET /api/blog]", err);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

// ── POST /api/blog ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session?.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { title, slug, category, tag, date, readTime, excerpt,
            body: postBody, author, thumbnailUrl, coverName,
            showContributors, contributors, status } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const [inserted] = await db.insert(blogPosts).values({
      slug,
      title,
      category:         category        || "Architecture",
      tag:              tag             || null,
      date:             date            || null,
      readTime:         readTime        || "5 min read",
      excerpt:          excerpt         || null,
      body:             postBody        || null,
      author:           author          || null,
      thumbnailUrl:     thumbnailUrl    || null,
      coverName:        coverName       || "CoverIntrolicDWaves",
      showContributors: showContributors === true,
      contributors:     contributors    || null,
      status:           status          || "published",
    }).returning();

    return NextResponse.json({ post: inserted }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/blog]", err);
    if (err?.cause?.code === "23505") {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
