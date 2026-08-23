import { NextResponse } from "next/server";
import { db } from "@/db";
import { admins, loginAttempts } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createAdminSession } from "@/lib/auth";
import { 
  getClientIp, 
  checkMultipleRateLimits, 
  getRateLimitHeaders, 
  ADMIN_LOGIN_IP_LIMIT_CONFIG, 
  ADMIN_LOGIN_ID_LIMIT_CONFIG 
} from "@/lib/rateLimit";

// Pre-computed bcrypt dummy hash for constant-time comparison against non-existent users (Prevents Timing Attacks)
const DUMMY_HASH = "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj40qA3Lp2Tu";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const userAgent = req.headers.get("user-agent") || "unknown";

  try {
    const body = await req.json();
    const { identifier, password } = body;

    // 1. Validate required inputs
    if (!identifier || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Prevent ReDoS & CPU starvation: Strict length bounds
    if (typeof identifier !== "string" || identifier.length > 100) {
      return NextResponse.json({ error: "Invalid identifier length" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length > 72) {
      return NextResponse.json({ error: "Invalid password length" }, { status: 400 });
    }

    // Sanitize identifier
    const sanitizedIdentifier = identifier.trim().toLowerCase();

    // 3. Dual-Layer Hardened Rate Limiting (IP + Account ID)
    const checks = [
      { key: `ADMIN_LOGIN_IP:${ip}`, config: ADMIN_LOGIN_IP_LIMIT_CONFIG },
      { key: `ADMIN_LOGIN_ID:${sanitizedIdentifier}`, config: ADMIN_LOGIN_ID_LIMIT_CONFIG }
    ];

    const rateLimitRes = checkMultipleRateLimits(checks);
    const headers = getRateLimitHeaders(rateLimitRes) as Record<string, string>;

    if (!rateLimitRes.allowed) {
      // Record blocked attack attempt in audit log
      try {
        await db.insert(loginAttempts).values({
          username: sanitizedIdentifier.substring(0, 50),
          ipAddress: ip,
          userAgent: userAgent.substring(0, 512),
          status: "rate_limited",
        });
      } catch (logErr) {
        console.error("Failed to log rate-limited attempt:", logErr);
      }

      let errorMessage = "Too many login attempts from this network. Access temporarily restricted.";
      if (rateLimitRes.keyFailed?.startsWith("ADMIN_LOGIN_ID:")) {
        errorMessage = "This account is temporarily locked due to repeated authentication failures.";
      }
      return NextResponse.json({ error: errorMessage }, { status: 429, headers });
    }

    // 4. Query Admin from Database
    const admin = await db.query.admins.findFirst({
      where: or(
        eq(admins.email, sanitizedIdentifier),
        eq(admins.username, sanitizedIdentifier)
      ),
    });

    // 5. Account Lockout Check (Database Level)
    const now = new Date();
    if (admin && admin.lockoutUntil && admin.lockoutUntil > now) {
      const minutesLeft = Math.ceil((admin.lockoutUntil.getTime() - now.getTime()) / (60 * 1000));
      
      try {
        await db.insert(loginAttempts).values({
          username: sanitizedIdentifier.substring(0, 50),
          ipAddress: ip,
          userAgent: userAgent.substring(0, 512),
          status: "account_locked",
        });
      } catch {}

      return NextResponse.json(
        { error: `Account locked due to consecutive security violations. Retry in ${minutesLeft} minute(s).` },
        { status: 423, headers }
      );
    }

    // 6. Constant-Time Password Verification (Immune to User Enumeration Timing Attacks)
    const targetHash = admin ? admin.passwordHash : DUMMY_HASH;
    const passwordMatch = await bcrypt.compare(password, targetHash);

    if (!admin || !passwordMatch) {
      // If admin exists, increment failed attempts and trigger lockout if >= 5
      if (admin) {
        const newAttempts = (admin.loginAttempts || 0) + 1;
        let lockoutUntil: Date | null = null;
        
        if (newAttempts >= 5) {
          // 15-minute exponential lock
          lockoutUntil = new Date(Date.now() + 15 * 60 * 1000);
        }

        await db.update(admins)
          .set({ loginAttempts: newAttempts, lockoutUntil })
          .where(eq(admins.id, admin.id));
      }

      // Log failed attempt
      try {
        await db.insert(loginAttempts).values({
          username: sanitizedIdentifier.substring(0, 50),
          ipAddress: ip,
          userAgent: userAgent.substring(0, 512),
          status: "failed",
        });
      } catch (logErr) {
        console.error("Failed to log failed login attempt:", logErr);
      }

      return NextResponse.json({ error: "Invalid credentials" }, { status: 401, headers });
    }

    // 7. Successful Authentication: Reset attempts, update audit trail, issue JWT session
    await db.update(admins)
      .set({
        loginAttempts: 0,
        lockoutUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ip,
      })
      .where(eq(admins.id, admin.id));

    // Log successful login
    try {
      await db.insert(loginAttempts).values({
        username: admin.username,
        ipAddress: ip,
        userAgent: userAgent.substring(0, 512),
        status: "success",
      });
    } catch (logErr) {
      console.error("Failed to log successful login attempt:", logErr);
    }

    // Create hardened session
    await createAdminSession(admin.id);

    return NextResponse.json({ message: "Authentication successful" }, { status: 200, headers });
  } catch (error) {
    console.error("Admin login security error:", error);
    return NextResponse.json({ error: "Internal security processing error" }, { status: 500 });
  }
}
