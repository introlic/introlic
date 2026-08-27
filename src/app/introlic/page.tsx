import React from "react";
import { db } from "@/db";
import { projects, researchPapers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import MemberDashboardClient from "./MemberDashboardClient";

export const dynamic = "force-dynamic";

export default async function MemberDashboardPage() {
  let projectList: any[] = [];
  let paperList: any[] = [];

  try {
    projectList = await db
      .select()
      .from(projects)
      .orderBy(desc(projects.createdAt));
  } catch (e) {
    console.error("Error fetching member projects:", e);
  }

  try {
    paperList = await db
      .select()
      .from(researchPapers)
      .where(eq(researchPapers.status, "published"))
      .orderBy(desc(researchPapers.createdAt));
  } catch (e) {
    console.error("Error fetching member research papers:", e);
  }

  return (
    <MemberDashboardClient 
      initialProjects={projectList} 
      initialPapers={paperList}
    />
  );
}
