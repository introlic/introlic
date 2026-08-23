import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { users, loginAttempts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import React from "react";
import SecurityLogsClient from "./SecurityLogsClient";

export const dynamic = "force-dynamic";

export default async function SecurityLogsPage() {
  const session = await getAdminSession();
  
  if (!session) {
    redirect("/admin/login");
  }

  // Fetch all login attempts, joining with users table to get name and email
  const logs = await db
    .select({
      id: loginAttempts.id,
      userId: loginAttempts.userId,
      username: loginAttempts.username,
      ipAddress: loginAttempts.ipAddress,
      country: loginAttempts.country,
      state: loginAttempts.state,
      city: loginAttempts.city,
      deviceFingerprint: loginAttempts.deviceFingerprint,
      userAgent: loginAttempts.userAgent,
      status: loginAttempts.status,
      createdAt: loginAttempts.createdAt,
      userFullName: users.name,
      userEmail: users.email,
      userRole: users.role,
    })
    .from(loginAttempts)
    .leftJoin(users, eq(loginAttempts.userId, users.id))
    .orderBy(desc(loginAttempts.createdAt));

  return (
    <SecurityLogsClient 
      initialLogs={logs.map(log => ({
        id: log.id,
        userId: log.userId,
        username: log.username,
        ipAddress: log.ipAddress,
        country: log.country,
        state: log.state,
        city: log.city,
        deviceFingerprint: log.deviceFingerprint,
        userAgent: log.userAgent,
        status: log.status,
        createdAt: log.createdAt.toISOString(),
        userFullName: log.userFullName,
        userEmail: log.userEmail,
        userRole: log.userRole
      }))} 
    />
  );
}
