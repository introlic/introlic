import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { users, loginAttempts } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import React from "react";
import UsersClient from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await getAdminSession();
  
  if (!session) {
    redirect("/admin/login");
  }

  const recentUsers = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      email: users.email,
      role: users.role,
      status: users.status,
      gender: users.gender,
      dateOfBirth: users.dateOfBirth,
      socialHandle: users.socialHandle,
      createdAt: users.createdAt,
      loginAttemptsCount: sql<number>`(select count(*) from ${loginAttempts} where ${loginAttempts.userId} = ${users.id})::int`
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return (
    <UsersClient 
      recentUsers={recentUsers.map(u => ({
        id: u.id,
        name: u.name,
        username: u.username,
        email: u.email,
        role: u.role,
        status: u.status,
        gender: u.gender,
        dateOfBirth: u.dateOfBirth,
        socialHandle: u.socialHandle,
        createdAt: u.createdAt,
        loginAttemptsCount: u.loginAttemptsCount
      }))} 
    />
  );
}
