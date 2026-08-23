import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and, ne, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getAdminSession } from "@/lib/auth";
import { 
  sanitizeInput, 
  validateEmail, 
  validateUsername, 
  validatePasswordStrength 
} from "@/lib/security";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, username, email, password, role, status, gender, dateOfBirth, socialHandle } = body;

    // 1. Validate required fields
    if (!name || !username || !email) {
      return NextResponse.json({ error: "Name, username, and email are required" }, { status: 400 });
    }

    // 2. Length validation
    if (name.length > 100) return NextResponse.json({ error: "Name must be 100 characters or less" }, { status: 400 });
    if (username.length > 50) return NextResponse.json({ error: "Username must be 50 characters or less" }, { status: 400 });
    if (email.length > 255) return NextResponse.json({ error: "Email must be 255 characters or less" }, { status: 400 });
    if (socialHandle && socialHandle.length > 255) return NextResponse.json({ error: "Social handle must be 255 characters or less" }, { status: 400 });

    // 3. Format validation
    if (!validateEmail(email)) return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    if (!validateUsername(username)) return NextResponse.json({ error: "Username can only contain alphanumeric characters, periods, or underscores (3-50 chars)" }, { status: 400 });

    const sanitizedUsername = username.trim().toLowerCase();
    const sanitizedEmail = email.trim().toLowerCase();

    // 4. Check if username or email is taken by another user
    const existing = await db.query.users.findFirst({
      where: and(
        ne(users.id, id),
        or(eq(users.email, sanitizedEmail), eq(users.username, sanitizedUsername))
      ),
    });

    if (existing) {
      if (existing.email === sanitizedEmail) {
        return NextResponse.json({ error: "Email is already registered by another user" }, { status: 409 });
      }
      return NextResponse.json({ error: "Username is already taken by another user" }, { status: 409 });
    }

    // Prepare update payload
    const updateData: Record<string, unknown> = {
      name: sanitizeInput(name),
      username: sanitizedUsername,
      email: sanitizedEmail,
      role: role || "user",
      status: status || "active",
      gender: gender || null,
      dateOfBirth: dateOfBirth || null,
      socialHandle: socialHandle ? sanitizeInput(socialHandle) : null,
      updatedAt: new Date(),
    };

    // If password is provided, validate and hash it
    if (password && password.trim().length > 0) {
      if (password.length > 72) {
        return NextResponse.json({ error: "Password must be 72 characters or less" }, { status: 400 });
      }
      if (!validatePasswordStrength(password)) {
        return NextResponse.json({ error: "Password must be at least 8 chars with an uppercase, lowercase, number, and special character" }, { status: 400 });
      }
      const salt = await bcrypt.genSalt(12);
      updateData.passwordHash = await bcrypt.hash(password, salt);
    }

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        role: users.role,
        status: users.status,
        updatedAt: users.updatedAt,
      });

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully", user: updated });
  } catch (error) {
    console.error("PUT user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (deleted.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
