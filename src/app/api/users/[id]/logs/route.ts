import { NextResponse } from "next/server";
import { db } from "@/db";
import { loginAttempts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const logs = await db
      .select()
      .from(loginAttempts)
      .where(eq(loginAttempts.userId, id))
      .orderBy(desc(loginAttempts.createdAt));

    return NextResponse.json(logs);
  } catch (error) {
    console.error("GET user logs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
