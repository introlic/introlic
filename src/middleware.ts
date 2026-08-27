import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || "default_super_secret_key_change_me_in_production";
const key = new TextEncoder().encode(secretKey);

async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    
    // Check if the session is expired
    if (payload.expires) {
      const expires = new Date(payload.expires as string);
      if (expires.getTime() < Date.now()) {
        return false;
      }
    }
    return !!payload.adminId;
  } catch (e) {
    return false;
  }
}

async function verifyUserToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    
    if (payload.expires) {
      const expires = new Date(payload.expires as string);
      if (expires.getTime() < Date.now()) {
        return false;
      }
    }
    return !!payload.userId;
  } catch (e) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { method } = request;

  // 1. Centralized Admin Panel Protection
  if (pathname.startsWith("/admin")) {
    const adminSessionCookie = request.cookies.get("admin_session")?.value;
    const isValid = adminSessionCookie ? await verifyAdminToken(adminSessionCookie) : false;

    // Direct unauthorized visitors away from admin pages to the login form
    if (!isValid && pathname !== "/admin/login") {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Direct authenticated admins away from the login form to the dashboard Console
    if (isValid && pathname === "/admin/login") {
      const dashboardUrl = new URL("/admin", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // 2. Members Panel Protection (/introlic)
  if (pathname.startsWith("/introlic")) {
    const userSessionCookie = request.cookies.get("session")?.value;
    const adminSessionCookie = request.cookies.get("admin_session")?.value;

    const isUserValid = userSessionCookie ? await verifyUserToken(userSessionCookie) : false;
    const isAdminValid = adminSessionCookie ? await verifyAdminToken(adminSessionCookie) : false;

    if (!isUserValid && !isAdminValid) {
      const homeUrl = new URL("/?login=true", request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  // 3. Centralized administrative API write protection
  if (pathname.startsWith("/api")) {
    // Read-only methods (GET, OPTIONS, HEAD) are allowed publicly
    const readMethods = ["GET", "OPTIONS", "HEAD"];
    if (readMethods.includes(method.toUpperCase())) {
      return NextResponse.next();
    }

    // Exclude public and member-authenticated endpoints that require write methods
    const publicWritePaths = [
      "/api/admin/login",
      "/api/auth/register",
      "/api/auth/login",
      "/api/auth/logout",
      "/api/auth/validate",
      "/api/member/profile",
      "/api/contact",
      "/api/analytics/hit"
    ];

    const isPublicWrite = publicWritePaths.some(
      path => pathname === path || pathname.startsWith(path + "/")
    );

    if (!isPublicWrite) {
      const adminSessionCookie = request.cookies.get("admin_session")?.value;
      const isValid = adminSessionCookie ? await verifyAdminToken(adminSessionCookie) : false;

      if (!isValid) {
        return new NextResponse(
          JSON.stringify({ error: "Access denied: Unauthorized database operation" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/introlic/:path*",
    "/api/:path*",
  ],
};
