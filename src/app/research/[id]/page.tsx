import React from "react";
import ResearchDetailClient from "./ResearchDetailClient";
import { Metadata } from 'next';
import { db } from "@/db";
import { researchPapers, authors } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const [paper] = await db
      .select()
      .from(researchPapers)
      .where(eq(researchPapers.id, id))
      .limit(1);

    if (paper) {
      const fullTitle = `Introlic | ${paper.title}`;
      return {
        title: { absolute: fullTitle },
        description: paper.abstract || `Technical research paper ${paper.title} by ${paper.author} at Introlic.`,
        openGraph: {
          title: fullTitle,
          description: paper.abstract || `Technical research paper ${paper.title} at Introlic.`,
          url: `https://introlic.site/research/${paper.id}`,
          type: 'article',
        },
        alternates: {
          canonical: `/research/${paper.id}`,
        },
      };
    }
  } catch (e) {
    console.error("Error generating research paper metadata:", e);
  }

  return {
    title: { absolute: "Introlic | Research Dispatch Details" },
    description: "Read technical research dispatches and papers from the Introlic research library.",
  };
}

export default async function ResearchDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let paper = null;
  try {
    const [fetchedPaper] = await db
      .select()
      .from(researchPapers)
      .where(eq(researchPapers.id, id))
      .limit(1);
    
    if (fetchedPaper) {
      paper = fetchedPaper;
    }
  } catch (e) {
    console.error("Error fetching paper on server:", e);
  }

  let authorsList: any[] = [];
  try {
    authorsList = await db.select().from(authors);
  } catch (e) {
    console.error("Error fetching authors on server:", e);
  }

  // 3. Build JSON-LD Schema
  let schemaJson = null;
  if (paper) {
    schemaJson = {
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      "headline": paper.title,
      "description": paper.abstract || undefined,
      "url": `https://introlic.site/research/${paper.id}`,
      "datePublished": paper.createdAt ? paper.createdAt.toISOString() : undefined,
      "author": {
        "@type": "Person",
        "name": paper.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "Introlic",
        "url": "https://introlic.site"
      },
      "keywords": paper.keywords ? paper.keywords.join(", ") : undefined
    };
  }

  return (
    <>
      <ResearchDetailClient 
        id={id} 
        initialPaper={paper} 
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

