import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, admins, loginAttempts } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createSession, createAdminSession } from "@/lib/auth";
import { getClientIp, checkMultipleRateLimits, getRateLimitHeaders, LOGIN_IP_LIMIT_CONFIG, LOGIN_ID_LIMIT_CONFIG } from "@/lib/rateLimit";
import { sanitizeInput } from "@/lib/security";

async function recordLoginAttempt(
  userId: string | null,
  username: string,
  req: Request,
  status: "success" | "failed",
  deviceFingerprint: string | null
) {
  try {
    let ip = getClientIp(req);
    let country = req.headers.get("x-vercel-ip-country") || "India";
    let state = req.headers.get("x-vercel-ip-country-region") || "Delhi";
    let city = req.headers.get("x-vercel-ip-city") || "New Delhi";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // If running locally, let's fetch GeoIP for rich visualization
    if (ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
      try {
        const geoRes = await fetch("https://ipapi.co/json/");
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          ip = geoData.ip || ip;
          country = geoData.country_name || country;
          state = geoData.region || state;
          city = geoData.city || city;
        }
      } catch (e) {
        console.error("Local GeoIP lookup failed:", e);
      }
    }

    await db.insert(loginAttempts).values({
      userId,
      username,
      ipAddress: ip,
      country,
      state,
      city,
      deviceFingerprint: deviceFingerprint || null,
      userAgent,
      status,
    });
  } catch (err) {
    console.error("Error recording login attempt:", err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, password, deviceFingerprint } = body;

    // 1. Validate required fields
    if (!identifier || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Prevent ReDoS/CPU starvation: Enforce max input length
    if (identifier.length > 255) {
      return NextResponse.json({ error: "Identifier must be 255 characters or less" }, { status: 400 });
    }
    if (password.length > 72) {
      return NextResponse.json({ error: "Password must be 72 characters or less" }, { status: 400 });
    }

    // Sanitize identifier & fingerprint
    const sanitizedIdentifier = identifier.trim().toLowerCase();
    const sanitizedFingerprint = deviceFingerprint ? sanitizeInput(deviceFingerprint) : null;

    // Rate Limiting
    const ip = getClientIp(req);
    const checks = [
      { key: `LOGIN_IP:${ip}`, config: LOGIN_IP_LIMIT_CONFIG },
      { key: `LOGIN_ID:${sanitizedIdentifier}`, config: LOGIN_ID_LIMIT_CONFIG }
    ];

    if (sanitizedFingerprint) {
      checks.push({ key: `LOGIN_FP:${sanitizedFingerprint}`, config: LOGIN_IP_LIMIT_CONFIG });
    }

    const rateLimitRes = checkMultipleRateLimits(checks);
    const headers = getRateLimitHeaders(rateLimitRes) as Record<string, string>;

    if (!rateLimitRes.allowed) {
      let errorMessage = "Too many login attempts. Please try again later.";
      if (rateLimitRes.keyFailed?.startsWith("LOGIN_ID:")) {
        errorMessage = "This account has been temporarily locked due to too many failed login attempts. Please try again in 2 hours.";
      }
      return NextResponse.json({ error: errorMessage }, { status: 429, headers });
    }

    // 3. Find the user by email or username in users table
    const user = await db.query.users.findFirst({
      where: or(
        eq(users.email, sanitizedIdentifier),
        eq(users.username, sanitizedIdentifier)
      ),
    });

    let admin = null;
    if (!user) {
      // If not found in users, check admins table
      admin = await db.query.admins.findFirst({
        where: or(
          eq(admins.email, sanitizedIdentifier),
          eq(admins.username, sanitizedIdentifier)
        ),
      });
    }

    if (!user && !admin) {
      await recordLoginAttempt(null, sanitizedIdentifier, req, "failed", sanitizedFingerprint);
      // Return a generic error to prevent email enumeration
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401, headers });
    }

    // 4. Verify password & create session
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatch) {
        await recordLoginAttempt(user.id, user.username, req, "failed", sanitizedFingerprint);
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401, headers });
      }

      // Update the last login timestamp
      await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, user.id));

      // Record successful login attempt
      await recordLoginAttempt(user.id, user.username, req, "success", sanitizedFingerprint);

      // Create standard user session (JWT Cookie)
      await createSession(user.id);

      return NextResponse.json({ message: "Login successful", role: "user" }, { status: 200, headers });
    } else if (admin) {
      // Check lockout status
      const now = new Date();
      if (admin.lockoutUntil && admin.lockoutUntil > now) {
        const minutesLeft = Math.ceil((admin.lockoutUntil.getTime() - now.getTime()) / (60 * 1000));
        return NextResponse.json(
          { error: `This account is locked. Please try again in ${minutesLeft} minutes.` },
          { status: 423, headers }
        );
      }

      // Verify the password
      const passwordMatch = await bcrypt.compare(password, admin.passwordHash);

      if (!passwordMatch) {
        // Increment login attempts
        const newAttempts = admin.loginAttempts + 1;
        let lockoutUntil = admin.lockoutUntil;
        
        if (newAttempts >= 5) {
          // Lock out for 15 minutes
          lockoutUntil = new Date(Date.now() + 15 * 60 * 1000);
        }

        await db.update(admins)
          .set({ loginAttempts: newAttempts, lockoutUntil })
          .where(eq(admins.id, admin.id));

        return NextResponse.json({ error: "Invalid credentials" }, { status: 401, headers });
      }

      // Successful login: reset attempts, update audit, create session
      await db.update(admins)
        .set({
          loginAttempts: 0,
          lockoutUntil: null,
          lastLoginAt: new Date(),
          lastLoginIp: ip,
        })
        .where(eq(admins.id, admin.id));

      // Create admin session (JWT Cookie)
      await createAdminSession(admin.id);

      return NextResponse.json({ 
        message: "Admin login successful", 
        role: admin.role, 
        redirect: "/admin" 
      }, { status: 200, headers });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401, headers });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


