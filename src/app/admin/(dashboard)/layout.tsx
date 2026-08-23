import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import Sidebar from "./Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  
  if (!session) {
    redirect("/admin/login");
  }

  const adminId = session.adminId as string;
  const currentAdmin = await db.query.admins.findFirst({
    where: (admins, { eq }) => eq(admins.id, adminId),
  });

  if (!currentAdmin || currentAdmin.status !== "active") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white flex relative overflow-hidden font-sans">
      <Sidebar 
        currentAdmin={{
          name: currentAdmin.name,
          username: currentAdmin.username,
          email: currentAdmin.email,
          lastLoginIp: currentAdmin.lastLoginIp,
          role: currentAdmin.role,
        }} 
      />
      <main className="flex-1 overflow-y-auto h-screen p-6 md:p-10 relative z-10 custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
