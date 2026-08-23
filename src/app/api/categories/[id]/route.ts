import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogCategories, blogPosts, researchPapers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";

// PUT /api/categories/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session?.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, slug } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanSlug = (slug || cleanName)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Get current category to know its type
    const [currentCategory] = await db
      .select()
      .from(blogCategories)
      .where(eq(blogCategories.id, id))
      .limit(1);

    if (!currentCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Check if category name is already taken by another category of the SAME type
    const [existing] = await db
      .select()
      .from(blogCategories)
      .where(and(eq(blogCategories.name, cleanName), eq(blogCategories.type, currentCategory.type)))
      .limit(1);

    if (existing && existing.id !== id) {
      return NextResponse.json({ error: `Category name already exists for ${currentCategory.type}` }, { status: 409 });
    }

    // Update category
    const [updated] = await db
      .update(blogCategories)
      .set({
        name: cleanName,
        slug: cleanSlug,
      })
      .where(eq(blogCategories.id, id))
      .returning();

    // Cascading update: if name changed, update any associated blog posts or research papers
    if (currentCategory.name !== cleanName) {
      if (currentCategory.type === "blog") {
        await db
          .update(blogPosts)
          .set({ category: cleanName })
          .where(eq(blogPosts.category, currentCategory.name));
      } else if (currentCategory.type === "research") {
        await db
          .update(researchPapers)
          .set({ type: cleanName })
          .where(eq(researchPapers.type, currentCategory.name));
      }
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PUT /api/categories/[id]]", err);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

// DELETE /api/categories/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session?.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Fetch the category first
    const [category] = await db
      .select()
      .from(blogCategories)
      .where(eq(blogCategories.id, id))
      .limit(1);

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Check if in use by blog posts
    if (category.type === "blog") {
      const [inUsePost] = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.category, category.name))
        .limit(1);

      if (inUsePost) {
        return NextResponse.json(
          { error: `Category "${category.name}" is in use by one or more blog posts. Please reassign those posts before deleting.` },
          { status: 409 }
        );
      }
    }

    // Check if in use by research papers
    if (category.type === "research") {
      const [inUsePaper] = await db
        .select()
        .from(researchPapers)
        .where(eq(researchPapers.type, category.name))
        .limit(1);

      if (inUsePaper) {
        return NextResponse.json(
          { error: `Type "${category.name}" is in use by one or more research papers. Please reassign those papers before deleting.` },
          { status: 409 }
        );
      }
    }

    const [deleted] = await db
      .delete(blogCategories)
      .where(eq(blogCategories.id, id))
      .returning({ id: blogCategories.id });

    return NextResponse.json({ success: true, id: deleted.id });
  } catch (err) {
    console.error("[DELETE /api/categories/[id]]", err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
