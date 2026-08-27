import React from "react";
import { redirect } from "next/navigation";
import { getSession, getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { users, admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import MemberShell from "./MemberShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members Portal // Introlic",
  description: "Introlic Members Mission Control and Sovereign Portal.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userSession = await getSession();
  const adminSession = await getAdminSession();

  let memberData = null;

  if (userSession?.userId) {
    const foundUser = await db.query.users.findFirst({
      where: eq(users.id, userSession.userId as string),
    });

    if (foundUser && foundUser.status === "active") {
      memberData = {
        id: foundUser.id,
        name: foundUser.name || foundUser.username,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
        gender: foundUser.gender,
        socialHandle: foundUser.socialHandle,
        createdAt: foundUser.createdAt ? new Date(foundUser.createdAt).toISOString() : null,
      };
    }
  }

  // Allow active admins to view the member dashboard as well
  if (!memberData && adminSession?.adminId) {
    const foundAdmin = await db.query.admins.findFirst({
      where: eq(admins.id, adminSession.adminId as string),
    });

    if (foundAdmin && foundAdmin.status === "active") {
      memberData = {
        id: foundAdmin.id,
        name: foundAdmin.name || foundAdmin.username,
        username: foundAdmin.username,
        email: foundAdmin.email,
        role: "admin",
        gender: null,
        socialHandle: null,
        createdAt: foundAdmin.createdAt ? new Date(foundAdmin.createdAt).toISOString() : null,
      };
    }
  }

  if (!memberData) {
    redirect("/?login=true");
  }

  // If user is just standard "user" role and not a member or admin, redirect back
  if (memberData.role !== "member" && memberData.role !== "admin" && memberData.role !== "superadmin") {
    redirect("/");
  }

  return (
    <MemberShell member={memberData}>
      {children}
    </MemberShell>
  );
}
