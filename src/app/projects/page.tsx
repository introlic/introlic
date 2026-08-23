import React from 'react';
import type { Metadata } from 'next';
import SovereignUplink from '@/components/SovereignUplink';
import ProjectsGallery from '@/components/projects/ProjectsGallery';
import { db } from "@/db";
import { projects } from "@/db/schema";

export const metadata: Metadata = {
  title: "Projects & Initiatives",
  description: "Track our active open-source, mathematical, AI, hardware-native, and community projects. Apply to collaborate or download public source files.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects & Initiatives | Introlic",
    description: "Track our active open-source, mathematical, AI, hardware-native, and community projects.",
    url: "https://introlic.in/projects",
    type: "website",
  },
};

export default async function ProjectsPage() {
  let projectList: any[] = [];
  try {
    projectList = await db
      .select({
        id: projects.id,
        title: projects.title,
        topic: projects.topic,
        category: projects.category,
      })
      .from(projects);
  } catch (e) {
    console.error("Error fetching projects for schema:", e);
  }

  return (
    <main className="min-h-screen bg-[#020202]">
      <ProjectsGallery />
      <SovereignUplink />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Introlic Projects & Initiatives",
            "description": "Active open-source, mathematical, AI, and systems engineering projects at Introlic.",
            "url": "https://introlic.in/projects",
            "numberOfItems": projectList.length,
            "itemListElement": projectList.map((p, idx) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "url": `https://introlic.in/projects/${p.id}`,
              "name": p.title,
              "description": p.topic
            }))
          })
        }}
      />
    </main>
  );
}
