import { NextResponse } from "next/server";
import { db } from "@/db";
import { authors } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // 1. Fetch all authors
    let list = await db.select().from(authors);

    // 2. Auto-seed if empty
    if (list.length === 0) {
      const defaultAuthor = {
        name: "MR.Faiz",
        dateOfBirth: "2009-03-26",
        bio: "Founder & systems builder. Engineering sovereign digital systems from first principles, built without institutional backing or venture safety nets.",
        avatar: null,
        socialLinks: {
          twitter: "https://x.com/introlics",
          instagram: "https://www.instagram.com/introlics/",
          youtube: "https://youtube.com/@introlics",
          linkedin: "https://www.linkedin.com/company/introlic",
          github: "https://github.com/introlic",
          discord: "https://discord.com/invite/introlic"
        }
      };

      const [inserted] = await db.insert(authors).values(defaultAuthor).returning();
      list = [inserted];
    }

    return NextResponse.json(list);
  } catch (error) {
    console.error("GET authors error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, dateOfBirth, bio, avatar, socialLinks } = body;

    if (!name) {
      return NextResponse.json({ error: "Author name is required" }, { status: 400 });
    }

    // Insert new author
    const [newAuthor] = await db.insert(authors).values({
      name,
      dateOfBirth: dateOfBirth || null,
      bio: bio || null,
      avatar: avatar || null,
      socialLinks: socialLinks || {}
    }).returning();

    return NextResponse.json(newAuthor, { status: 201 });
  } catch (error: any) {
    console.error("POST authors error:", error);
    if (error.code === "23505") { // Unique constraint violation (duplicate name)
      return NextResponse.json({ error: "An author with this name already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
