import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { researchPapers } from "@/db/schema";
import { eq, desc, asc, and, ilike, or, SQL } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";

// ── GET /api/research ─────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page   = Math.max(1, parseInt(searchParams.get("page")   || "1"));
    const limit  = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const type   = searchParams.get("type")   || "";
    const author = searchParams.get("author") || "";
    const sort   = searchParams.get("sort")   || "newest";
    const status = searchParams.get("status") || "published";
    const search = searchParams.get("search") || "";

    const conditions: SQL[] = [];
    if (status !== "all") conditions.push(eq(researchPapers.status, status));
    if (type && type !== "All") conditions.push(eq(researchPapers.type, type));
    if (author && author !== "All Authors") conditions.push(eq(researchPapers.author, author));
    if (search) {
      conditions.push(
        or(
          ilike(researchPapers.title,    `%${search}%`),
          ilike(researchPapers.abstract, `%${search}%`),
          ilike(researchPapers.author,   `%${search}%`),
          ilike(researchPapers.id,       `%${search}%`)
        )!
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const orderBy =
      sort === "oldest" ? asc(researchPapers.createdAt) :
      sort === "title"  ? asc(researchPapers.title)      :
      desc(researchPapers.createdAt);

    const offset = (page - 1) * limit;
    const rows = await db.select().from(researchPapers).where(where).orderBy(orderBy).limit(limit).offset(offset);
    const countRows = await db.select({ id: researchPapers.id }).from(researchPapers).where(where);

    return NextResponse.json({
      papers: rows,
      total: countRows.length,
      page,
      limit,
      totalPages: Math.ceil(countRows.length / limit),
    });
  } catch (err) {
    console.error("[GET /api/research]", err);
    return NextResponse.json({ error: "Failed to fetch research papers" }, { status: 500 });
  }
}

// ── POST /api/research ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session?.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { id, title, type, author, date, abstract, fullText,
            keywords, doi, institution, externalUrl,
            showContributors, contributors, status } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const paperId = id || "DOC-" + Math.floor(Math.random() * 9000 + 1000);

    const [inserted] = await db.insert(researchPapers).values({
      id:              paperId,
      title,
      type:            type            || "Publication",
      author:          author          || null,
      date:            date            || null,
      abstract:        abstract        || null,
      fullText:        fullText        || null,
      keywords:        keywords        || null,
      doi:             doi             || null,
      institution:     institution     || null,
      externalUrl:     externalUrl     || null,
      showContributors: showContributors === true,
      contributors:    contributors    || null,
      status:          status          || "published",
    }).returning();

    return NextResponse.json({ paper: inserted }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/research]", err);
    if (err?.cause?.code === "23505") {
      return NextResponse.json({ error: "A paper with this ID already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create research paper" }, { status: 500 });
  }
}
