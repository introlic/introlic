import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, loginAttempts } from "@/db/schema";
import { eq, or, desc, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getAdminSession } from "@/lib/auth";
import { 
  sanitizeInput, 
  validateEmail, 
  validateUsername, 
  validatePasswordStrength 
} from "@/lib/security";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        role: users.role,
        status: users.status,
        gender: users.gender,
        dateOfBirth: users.dateOfBirth,
        socialHandle: users.socialHandle,
        ipAddress: users.ipAddress,
        country: users.country,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        loginAttemptsCount: sql<number>`(select count(*) from ${loginAttempts} where ${loginAttempts.userId} = ${users.id})::int`
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("GET users error:", error);
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
    const { name, username, email, password, role, status, gender, dateOfBirth, socialHandle } = body;

    // 1. Validate required fields
    if (!name || !username || !email || !password) {
      return NextResponse.json({ error: "Missing required fields (name, username, email, password)" }, { status: 400 });
    }

    // 2. Length validation
    if (name.length > 100) return NextResponse.json({ error: "Name must be 100 characters or less" }, { status: 400 });
    if (username.length > 50) return NextResponse.json({ error: "Username must be 50 characters or less" }, { status: 400 });
    if (email.length > 255) return NextResponse.json({ error: "Email must be 255 characters or less" }, { status: 400 });
    if (password.length > 72) return NextResponse.json({ error: "Password must be 72 characters or less" }, { status: 400 });
    if (socialHandle && socialHandle.length > 255) return NextResponse.json({ error: "Social handle must be 255 characters or less" }, { status: 400 });

    // 3. Formats validation
    if (!validateEmail(email)) return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    if (!validateUsername(username)) return NextResponse.json({ error: "Username can only contain alphanumeric characters, periods, or underscores (3-50 chars)" }, { status: 400 });
    if (!validatePasswordStrength(password)) return NextResponse.json({ error: "Password must be at least 8 chars with an uppercase, lowercase, number, and special character" }, { status: 400 });

    const sanitizedUsername = username.trim().toLowerCase();
    const sanitizedEmail = email.trim().toLowerCase();

    // 4. Check uniqueness
    const existing = await db.query.users.findFirst({
      where: or(eq(users.email, sanitizedEmail), eq(users.username, sanitizedUsername)),
    });

    if (existing) {
      if (existing.email === sanitizedEmail) {
        return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
      }
      return NextResponse.json({ error: "Username is already taken" }, { status: 409 });
    }

    // 5. Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // 6. Insert new user
    const [inserted] = await db.insert(users).values({
      name: sanitizeInput(name),
      username: sanitizedUsername,
      email: sanitizedEmail,
      passwordHash,
      role: role || "user",
      status: status || "active",
      gender: gender || null,
      dateOfBirth: dateOfBirth || null,
      socialHandle: socialHandle ? sanitizeInput(socialHandle) : null,
      termsAccepted: true,
    }).returning({
      id: users.id,
      name: users.name,
      username: users.username,
      email: users.email,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
    });

    return NextResponse.json({ message: "User created successfully", user: inserted }, { status: 201 });
  } catch (error) {
    console.error("POST users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
