import { NextResponse } from "next/server";
import { db } from "@/db";
import { visits } from "@/db/schema";
import { getClientIp, checkMultipleRateLimits, getRateLimitHeaders } from "@/lib/rateLimit";

const HIT_LIMIT_CONFIG = {
  windowMs: 60 * 1000, // 1 minute
  limit: 60, // 60 page hits per minute max
};

async function getGeoDetails(ip: string): Promise<{ country: string; state: string | null }> {
  // Check if private/local IP
  if (
    !ip ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "localhost" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("fe80:")
  ) {
    return { country: "Localhost", state: "Local Development" };
  }

  // Handle 172.16.0.0/12 range
  if (ip.startsWith("172.")) {
    const parts = ip.split(".");
    if (parts.length >= 2) {
      const secondPart = parseInt(parts[1], 10);
      if (secondPart >= 16 && secondPart <= 31) {
        return { country: "Localhost", state: "Local Development" };
      }
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s timeout

    const res = await fetch(`http://ip-api.com/json/${ip}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.status === "success") {
        return {
          country: data.country || "unknown",
          state: data.regionName || null,
        };
      }
    }
  } catch (err) {
    console.error("IP Geolocation lookup failed for IP:", ip, err);
  }

  return { country: "unknown", state: null };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      path, referer,
      deviceType, deviceBrand, deviceModel, visitorId,
      os, browser, screenResolution, cpuCores, language, sessionId
    } = body;

    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    const ip = getClientIp(req);
    const rateLimitRes = checkMultipleRateLimits([
      { key: `ANALYTICS_IP:${ip}`, config: HIT_LIMIT_CONFIG }
    ]);
    const headers = getRateLimitHeaders(rateLimitRes) as Record<string, string>;

    if (!rateLimitRes.allowed) {
      return NextResponse.json(
        { error: "Too many hits." },
        { status: 429, headers }
      );
    }

    const userAgent = req.headers.get("user-agent") || null;
    
    // Default country from headers
    let country = req.headers.get("x-vercel-ip-country") ||
                  req.headers.get("cf-ipcountry") || "unknown";
    let state: string | null = null;

    // Do geolocation lookup with a timeout to keep tracking fast
    const geo = await getGeoDetails(ip);
    if (geo.country !== "unknown") {
      country = geo.country;
      state = geo.state;
    }

    await db.insert(visits).values({
      ipAddress: ip,
      userAgent: userAgent ? userAgent.substring(0, 512) : null,
      path: path.substring(0, 255),
      referer: referer ? referer.substring(0, 512) : null,
      country,
      state,
      // Device telemetry
      deviceType: deviceType ? String(deviceType).substring(0, 50) : null,
      deviceBrand: deviceBrand ? String(deviceBrand).substring(0, 100) : null,
      deviceModel: deviceModel ? String(deviceModel).substring(0, 150) : null,
      visitorId: visitorId ? String(visitorId).substring(0, 64) : null,
      os: os ? String(os).substring(0, 100) : null,
      browser: browser ? String(browser).substring(0, 100) : null,
      screenResolution: screenResolution ? String(screenResolution).substring(0, 30) : null,
      cpuCores: typeof cpuCores === "number" ? cpuCores : null,
      language: language ? String(language).substring(0, 20) : null,
      sessionId: sessionId ? String(sessionId).substring(0, 64) : null,
    });

    return NextResponse.json({ success: true }, { status: 200, headers });
  } catch (error) {
    console.error("Failed to track analytics hit:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
