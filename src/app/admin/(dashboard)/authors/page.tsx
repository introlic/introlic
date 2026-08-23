import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { authors } from "@/db/schema";
import { desc } from "drizzle-orm";
import React from "react";
import AuthorsClient from "./AuthorsClient";

export const dynamic = "force-dynamic";

export default async function AuthorsPage() {
  const session = await getAdminSession();
  
  if (!session) {
    redirect("/admin/login");
  }

  // Fetch authors initially
  const list = await db
    .select()
    .from(authors)
    .orderBy(desc(authors.createdAt));

  return (
    <AuthorsClient 
      initialAuthors={list.map(a => ({
        id: a.id,
        name: a.name,
        dateOfBirth: a.dateOfBirth,
        bio: a.bio,
        avatar: a.avatar,
        socialLinks: a.socialLinks || {},
        createdAt: a.createdAt.toISOString()
      }))} 
    />
  );
}
