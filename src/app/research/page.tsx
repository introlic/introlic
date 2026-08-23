import React from 'react';
import type { Metadata } from 'next';
import SovereignUplink from '@/components/SovereignUplink';
import WhitepaperGallery from '@/components/research/WhitepaperGallery';
import { db } from "@/db";
import { researchPapers } from "@/db/schema";
import { eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Research Papers & Technical Archives",
  description: "Browse our dynamic technical papers, whitepapers, milestone releases, and research dispatches in advanced mathematics, parallel intelligence, and physics-native AI layers.",
  alternates: {
    canonical: "/research",
  },
  openGraph: {
    title: "Research Papers & Technical Archives | Introlic",
    description: "Browse our dynamic technical papers, whitepapers, milestone releases, and research dispatches.",
    url: "https://introlic.in/research",
    type: "website",
  },
};

export default async function ResearchPage() {
  let papersList: any[] = [];
  try {
    papersList = await db
      .select({
        id: researchPapers.id,
        title: researchPapers.title,
        abstract: researchPapers.abstract,
      })
      .from(researchPapers)
      .where(eq(researchPapers.status, "published"));
  } catch (e) {
    console.error("Error querying research papers for schema:", e);
  }

  return (
    <>
      <div id="papers" className="relative">
         <WhitepaperGallery />
      </div>
      <SovereignUplink />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Introlic Research Library",
            "description": "Technical papers, whitepapers, and research dispatches from the Introlic AI Lab.",
            "url": "https://introlic.in/research",
            "numberOfItems": papersList.length,
            "itemListElement": papersList.map((paper, idx) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "url": `https://introlic.in/research/${paper.id}`,
              "name": paper.title,
              "description": paper.abstract
            }))
          })
        }}
      />
    </>
  );
}
