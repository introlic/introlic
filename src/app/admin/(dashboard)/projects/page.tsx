import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import React from "react";
import ProjectsClient from "./ProjectsClient";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const session = await getAdminSession();
  
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <ProjectsClient />
  );
}
