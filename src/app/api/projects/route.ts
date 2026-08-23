import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";

// GET /api/projects
export async function GET(req: NextRequest) {
  try {
    const list = await db
      .select()
      .from(projects)
      .orderBy(desc(projects.createdAt));
    return NextResponse.json(list);
  } catch (err) {
    console.error("[GET /api/projects]", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST /api/projects
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session?.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      title,
      category,
      author,
      authorRole,
      status,
      started,
      openTo,
      tags,
      topic,
      why,
      factors,
      readme,
      githubUrl,
      demoUrl,
      logoUrl
    } = body;

    if (!title || !author) {
      return NextResponse.json({ error: "Title and Author are required" }, { status: 400 });
    }

    // Generate a slug-based ID from the project title (e.g. "XMEETA" → "xmeeta")
    const toSlug = (str: string) =>
      str.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    let baseSlug = toSlug(title);
    if (!baseSlug) baseSlug = 'prj-' + Date.now().toString(36);

    // Ensure uniqueness — check DB for conflicts and add suffix if needed
    let resolvedId = id || baseSlug;
    if (!id) {
      const { or } = await import('drizzle-orm');
      const existing = await db.select({ id: projects.id }).from(projects);
      const existingIds = new Set(existing.map(p => p.id));
      if (existingIds.has(resolvedId)) {
        let suffix = 2;
        while (existingIds.has(`${baseSlug}-${suffix}`)) suffix++;
        resolvedId = `${baseSlug}-${suffix}`;
      }
    }

    const [inserted] = await db
      .insert(projects)
      .values({
        id: resolvedId,
        title,
        category,
        author,
        authorRole: authorRole || null,
        status: status || "Active",
        started: started || null,
        openTo: openTo || null,
        tags: Array.isArray(tags) ? tags : [],
        topic: topic || null,
        why: why || null,
        factors: Array.isArray(factors) ? factors : [],
        readme: readme || null,
        githubUrl: githubUrl || null,
        demoUrl: demoUrl || null,
        logoUrl: logoUrl || null,
      })
      .returning();

    return NextResponse.json(inserted, { status: 201 });
  } catch (err: any) {
    // Duplicate primary key (project ID already exists)
    if (err?.code === "23505" || err?.message?.includes("duplicate key") || err?.message?.includes("unique constraint")) {
      return NextResponse.json({ error: "Project with this ID already exists" }, { status: 409 });
    }
    console.error("[POST /api/projects]", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
