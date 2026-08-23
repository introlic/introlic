import React from "react";
import ProjectDetailClient from "./ProjectDetailClient";
import { Metadata } from 'next';
import { db } from "@/db";
import { projects, authors } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// Derive a URL slug from a project title (e.g. "XMEETA" → "xmeeta")
function titleToSlug(str: string): string {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Resolve a project by id OR by title-slug (backward compat)
async function resolveProject(id: string) {
  const [byId] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (byId) return byId;
  const all = await db.select().from(projects);
  return all.find(p => titleToSlug(p.title) === id) ?? null;
}


interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const project = await resolveProject(id);

    if (project) {
      const slug = titleToSlug(project.title) || project.id;
      const fullTitle = `Introlic | ${project.title}`;
      return {
        title: { absolute: fullTitle },
        description: project.topic || `Explore ${project.title}, an active initiative by ${project.author} at Introlic.`,
        openGraph: {
          title: fullTitle,
          description: project.topic || `Explore ${project.title} at Introlic.`,
          url: `https://introlic.site/projects/${slug}`,
          type: 'website',
        },
        alternates: {
          canonical: `/projects/${slug}`,
        },
      };
    }
  } catch (e) {
    console.error("Error generating project metadata:", e);
  }

  return {
    title: { absolute: "Introlic | Project Initiative Details" },
    description: "Explore advanced computational and systems development projects at Introlic.",
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // 1. Fetch project on the server (by id or title slug)
  let projectObj = null;
  try {
    projectObj = await resolveProject(id);
  } catch (e) {
    console.error("Error fetching project on server:", e);
  }

  // 2. Fetch authors on the server
  let authorsList: any[] = [];
  try {
    authorsList = await db.select().from(authors);
  } catch (e) {
    console.error("Error fetching authors on server:", e);
  }

  // 3. Build JSON-LD Schema
  let schemaJson = null;
  if (projectObj) {
    const isSoftware = ["Game", "Tool", "AI / ML", "Infrastructure", "Science"].includes(projectObj.category);
    schemaJson = {
      "@context": "https://schema.org",
      "@type": isSoftware ? "SoftwareApplication" : "CreativeWork",
      "name": projectObj.title,
      "description": projectObj.topic,
      "url": `https://introlic.site/projects/${projectObj.id}`,
      "dateCreated": projectObj.started || undefined,
      "author": {
        "@type": "Person",
        "name": projectObj.author,
        "jobTitle": projectObj.authorRole || undefined
      },
      "publisher": {
        "@type": "Organization",
        "name": "Introlic",
        "url": "https://introlic.site"
      }
    };
    if (isSoftware) {
      (schemaJson as any)["applicationCategory"] = projectObj.category === "Game" ? "GameApplication" : "DeveloperApplication";
      (schemaJson as any)["operatingSystem"] = "All";
    }
  }

  return (
    <>
      <ProjectDetailClient 
        id={id} 
        initialProject={projectObj} 
        initialAuthors={authorsList} 
      />
      {schemaJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
      )}
    </>
  );
}

