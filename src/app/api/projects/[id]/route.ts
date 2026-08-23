import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";

// Derive a URL slug from a project title (same logic as POST)
function titleToSlug(str: string): string {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// GET /api/projects/[id]
// Resolves by exact id OR by title-derived slug (e.g. "xmeeta" → XMEETA project)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // 1. Try exact ID match first
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (project) return NextResponse.json(project);

    // 2. Fallback: scan all projects and compare title slug to the requested id
    // This allows /projects/xmeeta to work even if db id is prj_mqqx2sv0
    const all = await db.select().from(projects);
    const bySlug = all.find(p => titleToSlug(p.title) === id);

    if (bySlug) return NextResponse.json(bySlug);

    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  } catch (err) {
    console.error("[GET /api/projects/[id]]", err);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

// PUT /api/projects/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session?.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const {
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

    const [updated] = await db
      .update(projects)
      .set({
        ...(title !== undefined && { title }),
        ...(category !== undefined && { category }),
        ...(author !== undefined && { author }),
        ...(authorRole !== undefined && { authorRole }),
        ...(status !== undefined && { status }),
        ...(started !== undefined && { started }),
        ...(openTo !== undefined && { openTo }),
        ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : [] }),
        ...(topic !== undefined && { topic }),
        ...(why !== undefined && { why }),
        ...(factors !== undefined && { factors: Array.isArray(factors) ? factors : [] }),
        ...(readme !== undefined && { readme }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(demoUrl !== undefined && { demoUrl }),
        ...(logoUrl !== undefined && { logoUrl }),
      })
      .where(eq(projects.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PUT /api/projects/[id]]", err);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE /api/projects/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session?.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const [deleted] = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning({ id: projects.id });

    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, id: deleted.id });
  } catch (err) {
    console.error("[DELETE /api/projects/[id]]", err);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
