import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, or, sql } from "drizzle-orm";

export const REGISTRATION_LIMIT = 50;
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { getClientIp, checkMultipleRateLimits, getRateLimitHeaders, REGISTER_LIMIT_CONFIG } from "@/lib/rateLimit";
import { 
  sanitizeInput, 
  validateEmail, 
  validateUsername, 
  validatePasswordStrength, 
  validateDateOfBirth 
} from "@/lib/security";

export async function POST(req: Request) {
  try {
    return NextResponse.json(
      { error: "Right now we have stopped accepting new user registration requests." },
      { status: 403 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [userCountResult] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const currentCount = Number(userCountResult?.count || 0);
    return NextResponse.json({ count: currentCount, limit: REGISTRATION_LIMIT });
  } catch (error) {
    console.error("Failed to get registration count:", error);
    return NextResponse.json({ error: "Failed to get registration count" }, { status: 500 });
  }
}

