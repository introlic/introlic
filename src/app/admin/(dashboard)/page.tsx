import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { users, contacts, admins as adminTable, visits } from "@/db/schema";
import { desc, sql, gte } from "drizzle-orm";
import React from "react";
import ConsoleClient from "./ConsoleClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardOverview() {
  const session = await getAdminSession();
  
  if (!session) {
    redirect("/admin/login");
  }

  const [userCountResult] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [contactCountResult] = await db.select({ count: sql<number>`count(*)` }).from(contacts);
  const [adminCountResult] = await db.select({ count: sql<number>`count(*)` }).from(adminTable);
  const [visitCountResult] = await db
    .select({
      count: sql<number>`count(distinct concat(${visits.ipAddress}, '-', ${visits.path}, '-', TO_CHAR(${visits.createdAt}, 'YYYY-MM-DD')))`
    })
    .from(visits);
  const [uniqueVisitCountResult] = await db.select({ count: sql<number>`count(distinct ${visits.ipAddress})` }).from(visits);

  const totalUsers = Number(userCountResult?.count || 0);
  const totalContacts = Number(contactCountResult?.count || 0);
  const totalAdmins = Number(adminCountResult?.count || 0);
  const totalVisits = Number(visitCountResult?.count || 0);
  const totalUniqueVisitors = Number(uniqueVisitCountResult?.count || 0);

  const recentContacts = await db
    .select()
    .from(contacts)
    .orderBy(desc(contacts.createdAt))
    .limit(20);

  const recentUsers = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(20);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const registrationStatsRaw = await db
    .select({
      date: sql<string>`TO_CHAR(${users.createdAt}, 'YYYY-MM-DD')`,
      count: sql<number>`count(*)`
    })
    .from(users)
    .where(gte(users.createdAt, thirtyDaysAgo))
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  const visitStatsRaw = await db
    .select({
      date: sql<string>`TO_CHAR(${visits.createdAt}, 'YYYY-MM-DD')`,
      count: sql<number>`count(distinct concat(${visits.ipAddress}, '-', ${visits.path}))`
    })
    .from(visits)
    .where(gte(visits.createdAt, thirtyDaysAgo))
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  const fillLast30Days = (rawStats: { date: string; count: number }[]) => {
    const map = new Map(rawStats.map(item => [item.date, Number(item.count)]));
    const result = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      result.push({
        date: dateStr,
        count: map.get(dateStr) || 0
      });
    }
    return result;
  };

  const registrationGrowth = fillLast30Days(registrationStatsRaw);
  const visitGrowth = fillLast30Days(visitStatsRaw);

  const genderStatsRaw = await db
    .select({
      gender: users.gender,
      count: sql<number>`count(*)`
    })
    .from(users)
    .groupBy(users.gender);

  const genderStats = genderStatsRaw.map(item => ({
    gender: item.gender,
    count: Number(item.count || 0)
  }));

  const ageDataRaw = await db
    .select({
      dateOfBirth: users.dateOfBirth
    })
    .from(users)
    .where(sql`${users.dateOfBirth} IS NOT NULL`);

  const ageGroups = {
    "Under 18": 0,
    "18-25": 0,
    "26-35": 0,
    "36-50": 0,
    "50+": 0
  };

  const today = new Date();
  ageDataRaw.forEach(user => {
    if (!user.dateOfBirth) return;
    const dob = new Date(user.dateOfBirth);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age < 18) ageGroups["Under 18"]++;
    else if (age <= 25) ageGroups["18-25"]++;
    else if (age <= 35) ageGroups["26-35"]++;
    else if (age <= 50) ageGroups["36-50"]++;
    else ageGroups["50+"]++;
  });

  const ageGroupStats = Object.entries(ageGroups).map(([group, count]) => ({
    group,
    count
  }));

  const topPaths = await db
    .select({
      path: visits.path,
      uniqueViews: sql<number>`count(distinct concat(${visits.ipAddress}, '-', TO_CHAR(${visits.createdAt}, 'YYYY-MM-DD')))`,
      totalHits: sql<number>`count(*)`
    })
    .from(visits)
    .where(sql`${visits.path} NOT LIKE '/&%' AND ${visits.path} NOT LIKE '%&%' AND ${visits.path} NOT LIKE '/_next%'`)
    .groupBy(visits.path)
    .orderBy(desc(sql`count(distinct concat(${visits.ipAddress}, '-', TO_CHAR(${visits.createdAt}, 'YYYY-MM-DD')))`))
    .limit(10);

  const countryStatsRaw = await db
    .select({
      country: visits.country,
      count: sql<number>`count(distinct concat(${visits.ipAddress}, '-', ${visits.path}, '-', TO_CHAR(${visits.createdAt}, 'YYYY-MM-DD')))`
    })
    .from(visits)
    .groupBy(visits.country)
    .orderBy(desc(sql`count(distinct concat(${visits.ipAddress}, '-', ${visits.path}, '-', TO_CHAR(${visits.createdAt}, 'YYYY-MM-DD')))`))
    .limit(20);

  const countryNameMap: Record<string, string> = {
    "IN": "India",
    "US": "United States",
    "GB": "United Kingdom",
    "UK": "United Kingdom",
    "CA": "Canada",
    "DE": "Germany",
    "FR": "France",
    "CN": "China",
    "JP": "Japan",
    "Localhost": "Local Development",
  };

  const normalizedCountryMap = new Map<string, number>();
  for (const row of countryStatsRaw) {
    let name = row.country || "Unknown Location";
    if (countryNameMap[name]) name = countryNameMap[name];
    if (name.toLowerCase() === "unknown") name = "Unknown Location";
    normalizedCountryMap.set(name, (normalizedCountryMap.get(name) || 0) + Number(row.count || 0));
  }

  const countryStats = Array.from(normalizedCountryMap.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const sharedIps = await db
    .select({
      ipAddress: users.ipAddress,
      count: sql<number>`count(*)`,
      usernames: sql<string>`string_agg(${users.username}, ', ')`
    })
    .from(users)
    .where(sql`${users.ipAddress} IS NOT NULL AND ${users.ipAddress} != '127.0.0.1' AND ${users.ipAddress} != '::1'`)
    .groupBy(users.ipAddress)
    .having(sql`count(*) > 1`)
    .limit(10);

  const sharedFingerprints = await db
    .select({
      deviceFingerprint: users.deviceFingerprint,
      count: sql<number>`count(*)`,
      usernames: sql<string>`string_agg(${users.username}, ', ')`
    })
    .from(users)
    .where(sql`${users.deviceFingerprint} IS NOT NULL`)
    .groupBy(users.deviceFingerprint)
    .having(sql`count(*) > 1`)
    .limit(10);

  return (
    <ConsoleClient
      totalUsers={totalUsers}
      totalContacts={totalContacts}
      totalAdmins={totalAdmins}
      totalVisits={totalVisits}
      totalUniqueVisitors={totalUniqueVisitors}
      recentContacts={recentContacts}
      recentUsers={recentUsers.map(u => ({
        id: u.id,
        name: u.name,
        username: u.username,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt
      }))}
      registrationGrowth={registrationGrowth}
      visitGrowth={visitGrowth}
      genderStats={genderStats}
      ageGroupStats={ageGroupStats}
      topPaths={topPaths.map(p => ({ 
        path: p.path, 
        uniqueViews: Number(p.uniqueViews), 
        totalHits: Number(p.totalHits) 
      }))}
      countryStats={countryStats.map(c => ({ 
        country: c.country || "Unknown", 
        count: Number(c.count) 
      }))}
      sharedIps={sharedIps.map(item => ({ ipAddress: item.ipAddress!, count: Number(item.count), usernames: item.usernames }))}
      sharedFingerprints={sharedFingerprints.map(item => ({ deviceFingerprint: item.deviceFingerprint!, count: Number(item.count), usernames: item.usernames }))}
    />
  );
}
