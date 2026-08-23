import { db } from "@/db";
import { visits } from "@/db/schema";
import { desc, sql, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import VisitorLogsClient from "./VisitorLogsClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Visitor Logs | Admin" };
export const dynamic = "force-dynamic";

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

export default async function VisitorLogsPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;
  if (!sessionCookie || !(await verifyAdminToken(sessionCookie))) {
    redirect("/admin/login");
  }

  const rows = await db
    .select()
    .from(visits)
    .orderBy(desc(visits.createdAt))
    .limit(200);

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

  const initialVisits = rows.map(v => ({
    ...v,
    createdAt: v.createdAt.toISOString(),
    visitCount: v.visitorId ? (visitCountsMap[v.visitorId] || 1) : 1,
  }));

  return <VisitorLogsClient initialVisits={initialVisits} />;
}
