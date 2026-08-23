import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { researchPapers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";

// ── GET /api/research/[id] ───────────────────────────────────────────────────
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [paper] = await db
      .select()
      .from(researchPapers)
      .where(eq(researchPapers.id, id))
      .limit(1);

    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }
    return NextResponse.json({ paper });
  } catch (err) {
    console.error("[GET /api/research/[id]]", err);
    return NextResponse.json({ error: "Failed to fetch paper" }, { status: 500 });
  }
}

// ── PUT /api/research/[id] ───────────────────────────────────────────────────
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session?.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const { title, type, author, date, abstract, fullText,
            keywords, doi, institution, externalUrl,
            showContributors, contributors, status } = body;

    const [updated] = await db
      .update(researchPapers)
      .set({
        ...(title        !== undefined && { title }),
        ...(type         !== undefined && { type }),
        ...(author       !== undefined && { author }),
        ...(date         !== undefined && { date }),
        ...(abstract     !== undefined && { abstract }),
        ...(fullText     !== undefined && { fullText }),
        ...(keywords     !== undefined && { keywords }),
        ...(doi          !== undefined && { doi }),
        ...(institution  !== undefined && { institution }),
        ...(externalUrl  !== undefined && { externalUrl }),
        ...(showContributors !== undefined && { showContributors }),
        ...(contributors !== undefined && { contributors }),
        ...(status       !== undefined && { status }),
      })
      .where(eq(researchPapers.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }
    return NextResponse.json({ paper: updated });
  } catch (err) {
    console.error("[PUT /api/research/[id]]", err);
    return NextResponse.json({ error: "Failed to update paper" }, { status: 500 });
  }
}

// ── DELETE /api/research/[id] ────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session?.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const [deleted] = await db
      .delete(researchPapers)
      .where(eq(researchPapers.id, id))
      .returning({ id: researchPapers.id });

    if (!deleted) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, id: deleted.id });
  } catch (err) {
    console.error("[DELETE /api/research/[id]]", err);
    return NextResponse.json({ error: "Failed to delete paper" }, { status: 500 });
  }
}
