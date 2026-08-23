import { NextResponse } from "next/server";
import { db } from "@/db";
import { authors } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, dateOfBirth, bio, avatar, socialLinks } = body;

    if (!name) {
      return NextResponse.json({ error: "Author name is required" }, { status: 400 });
    }

    const [updatedAuthor] = await db
      .update(authors)
      .set({
        name,
        dateOfBirth: dateOfBirth || null,
        bio: bio || null,
        avatar: avatar || null,
        socialLinks: socialLinks || {}
      })
      .where(eq(authors.id, id))
      .returning();

    if (!updatedAuthor) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAuthor);
  } catch (error: any) {
    console.error("PUT author error:", error);
    if (error.code === "23505") { // Unique constraint violation (duplicate name)
      return NextResponse.json({ error: "An author with this name already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [deletedAuthor] = await db
      .delete(authors)
      .where(eq(authors.id, id))
      .returning();

    if (!deletedAuthor) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Author deleted successfully", author: deletedAuthor });
  } catch (error) {
    console.error("DELETE author error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
