import React from 'react';
import BlogGrid from '@/components/blog/BlogGrid';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Technical Dispatches & Blog",
  description: "Read our engineering updates, research announcements, and theoretical dispatches directly from the core development team.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#000000]">
      <BlogGrid />
    </main>
  );
}
