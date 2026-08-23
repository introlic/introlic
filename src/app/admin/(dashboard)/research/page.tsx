import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import React from "react";
import ResearchClient from "./ResearchClient";

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const session = await getAdminSession();
  
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <ResearchClient />
  );
}
