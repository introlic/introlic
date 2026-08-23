import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogCategories } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";
import { asc, eq, and } from "drizzle-orm";

const DEFAULT_SEEDS: Record<string, string[]> = {
  blog: ["Architecture", "Engineering", "Strategy", "Privacy", "AI Research"],
  project: ["Game", "Research", "Tool", "Community", "Science", "Creative", "Infrastructure", "AI / ML", "Web3", "Design", "Education"],
  research: ["Publication", "Milestone", "Conclusion", "Release"],
};

// GET /api/categories?type=blog|project|research
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "blog";

    if (!["blog", "project", "research"].includes(type)) {
      return NextResponse.json({ error: "Invalid category type" }, { status: 400 });
    }

    let rows = await db
      .select()
      .from(blogCategories)
      .where(eq(blogCategories.type, type))
      .orderBy(asc(blogCategories.name));
    
    // If no categories exist for this type, auto-seed with type-specific defaults
    if (rows.length === 0) {
      const defaults = DEFAULT_SEEDS[type] || [];
      const valuesToInsert = defaults.map(name => {
        const slug = name.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();
        return { name, slug, type };
      });
      
      if (valuesToInsert.length > 0) {
        await db.insert(blogCategories).values(valuesToInsert);
      }
      
      rows = await db
        .select()
        .from(blogCategories)
        .where(eq(blogCategories.type, type))
        .orderBy(asc(blogCategories.name));
    }
    
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[GET /api/categories]", err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST /api/categories
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session?.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, slug: customSlug, type = "blog" } = await req.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    if (!["blog", "project", "research"].includes(type)) {
      return NextResponse.json({ error: "Invalid category type" }, { status: 400 });
    }

    const cleanName = name.trim();
    const slug = (customSlug || cleanName)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Check if category name already exists for this specific type
    const [existing] = await db
      .select()
      .from(blogCategories)
      .where(and(eq(blogCategories.name, cleanName), eq(blogCategories.type, type)))
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: `Category "${cleanName}" already exists for ${type}` }, { status: 409 });
    }

    const [inserted] = await db
      .insert(blogCategories)
      .values({ name: cleanName, slug, type })
      .returning();

    return NextResponse.json(inserted, { status: 201 });
  } catch (err) {
    console.error("[POST /api/categories]", err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
