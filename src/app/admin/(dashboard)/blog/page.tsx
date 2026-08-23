import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import React from "react";
import BlogClient from "./BlogClient";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const session = await getAdminSession();
  
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <BlogClient />
  );
}
