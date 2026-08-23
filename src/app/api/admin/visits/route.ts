import { NextResponse } from "next/server";
import { db } from "@/db";
import { visits } from "@/db/schema";
import { desc, and, gte, lte, like, sql, inArray } from "drizzle-orm";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET || "default_super_secret_key_change_me_in_production";
const key = new TextEncoder().encode(secretKey);

async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    if (payload.expires) {
      const expires = new Date(payload.expires as string);
      if (expires.getTime() < Date.now()) return false;
    }
    return !!payload.adminId;
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  try {
    // Admin auth check
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;
    if (!sessionCookie || !(await verifyAdminToken(sessionCookie))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(200, Math.max(1, parseInt(url.searchParams.get("limit") || "100", 10)));
    const offset = (page - 1) * limit;
    const pathFilter = url.searchParams.get("path") || "";
    const dateFrom = url.searchParams.get("dateFrom") || "";
    const dateTo = url.searchParams.get("dateTo") || "";
    const searchQ = url.searchParams.get("q") || "";

    // Build conditions
    const conditions = [];
    if (pathFilter) conditions.push(like(visits.path, `%${pathFilter}%`));
    if (dateFrom) conditions.push(gte(visits.createdAt, new Date(dateFrom)));
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      conditions.push(lte(visits.createdAt, end));
    }
    if (searchQ) {
      conditions.push(
        sql`(${visits.ipAddress} ILIKE ${"%" + searchQ + "%"} OR ${visits.path} ILIKE ${"%" + searchQ + "%"} OR ${visits.os} ILIKE ${"%" + searchQ + "%"} OR ${visits.browser} ILIKE ${"%" + searchQ + "%"} OR ${visits.country} ILIKE ${"%" + searchQ + "%"} OR ${visits.state} ILIKE ${"%" + searchQ + "%"} OR ${visits.deviceBrand} ILIKE ${"%" + searchQ + "%"} OR ${visits.deviceModel} ILIKE ${"%" + searchQ + "%"})`
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, countResult] = await Promise.all([
      db.select().from(visits)
        .where(whereClause)
        .orderBy(desc(visits.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(visits).where(whereClause),
    ]);

    const total = Number(countResult[0]?.count ?? 0);

    // Fetch visit counts for these visitorIds
    const visitorIds = [...new Set(rows.map(r => r.visitorId).filter((id): id is string => !!id))];
    const visitCountsMap: Record<string, number> = {};
    if (visitorIds.length > 0) {
      const counts = await db
        .select({
          visitorId: visits.visitorId,
          count: sql<number>`count(*)::int`,
        })
        .from(visits)
        .where(inArray(visits.visitorId, visitorIds))
        .groupBy(visits.visitorId);

      counts.forEach(c => {
        if (c.visitorId) {
          visitCountsMap[c.visitorId] = c.count;
        }
      });
    }

    const visitsWithCounts = rows.map(r => ({
      ...r,
      visitCount: r.visitorId ? (visitCountsMap[r.visitorId] || 1) : 1,
    }));

    return NextResponse.json({
      visits: visitsWithCounts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Failed to fetch visitor logs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
