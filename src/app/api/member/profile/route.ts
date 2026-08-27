import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import bcrypt from "bcryptjs";
import {
  sanitizeInput,
  validateEmail,
  validatePasswordStrength
} from "@/lib/security";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const member = await db.query.users.findFirst({
      where: eq(users.id, session.userId as string),
      columns: {
        id: true,
        name: true,
        username: true,
        email: true,
        gender: true,
        dateOfBirth: true,
        socialHandle: true,
        role: true,
        status: true,
        createdAt: true,
        lastLogin: true,
      }
    });

    if (!member) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("GET /api/member/profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId as string;
    const body = await req.json();
    const { name, email, gender, dateOfBirth, socialHandle, currentPassword, newPassword } = body;

    const currentMember = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!currentMember) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (name && name.trim().length > 0) {
      if (name.length > 100) return NextResponse.json({ error: "Name must be 100 characters or less" }, { status: 400 });
      updateData.name = sanitizeInput(name);
    }

    if (email && email.trim().length > 0) {
      const sanitizedEmail = email.trim().toLowerCase();
      if (!validateEmail(sanitizedEmail)) {
        return NextResponse.json({ error: "Invalid email address format" }, { status: 400 });
      }

      // Check if email taken by another user
      const existingEmail = await db.query.users.findFirst({
        where: and(ne(users.id, userId), eq(users.email, sanitizedEmail)),
      });

      if (existingEmail) {
        return NextResponse.json({ error: "Email is already in use by another account" }, { status: 409 });
      }

      updateData.email = sanitizedEmail;
    }

    if (gender !== undefined) {
      updateData.gender = gender ? sanitizeInput(gender) : null;
    }

    if (dateOfBirth !== undefined) {
      updateData.dateOfBirth = dateOfBirth || null;
    }

    if (socialHandle !== undefined) {
      updateData.socialHandle = socialHandle ? sanitizeInput(socialHandle) : null;
    }

    // Password change handling
    if (newPassword && newPassword.trim().length > 0) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required to set a new password" }, { status: 400 });
      }

      const match = await bcrypt.compare(currentPassword, currentMember.passwordHash);
      if (!match) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
      }

      if (!validatePasswordStrength(newPassword)) {
        return NextResponse.json({ error: "New password must be at least 8 chars with an uppercase, lowercase, number, and special character" }, { status: 400 });
      }

      const salt = await bcrypt.genSalt(12);
      updateData.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        gender: users.gender,
        dateOfBirth: users.dateOfBirth,
        socialHandle: users.socialHandle,
        role: users.role,
        updatedAt: users.updatedAt,
      });

    return NextResponse.json({ message: "Profile updated successfully", user: updated });
  } catch (error) {
    console.error("PUT /api/member/profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
