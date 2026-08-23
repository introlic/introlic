import { MetadataRoute } from 'next';
import { db } from "@/db";
import { blogPosts, projects, researchPapers } from "@/db/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://introlic.in';

  // Static routes configuration
  const staticRoutes = [
    '',
    '/about',
    '/projects',
    '/research',
    '/blog',
    '/docs',
    '/ethics',
    '/contact',
    '/terms',
    '/privacy',
    '/cookies',
    '/sitemap',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Fetch dynamic blog post URLs
  let dynamicBlogRoutes: MetadataRoute.Sitemap = [];
  try {
    const dbPosts = await db.select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt }).from(blogPosts);
    dynamicBlogRoutes = dbPosts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (e) {
    console.error("Sitemap: Failed to query blog posts:", e);
  }

  // Fetch dynamic project URLs
  let dynamicProjectRoutes: MetadataRoute.Sitemap = [];
  try {
    const dbProjects = await db.select({ id: projects.id, updatedAt: projects.updatedAt }).from(projects);
    dynamicProjectRoutes = dbProjects.map(proj => ({
      url: `${baseUrl}/projects/${proj.id}`,
      lastModified: proj.updatedAt ? new Date(proj.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (e) {
    console.error("Sitemap: Failed to query projects:", e);
  }

  // Fetch dynamic research paper URLs
  let dynamicResearchRoutes: MetadataRoute.Sitemap = [];
  try {
    const dbPapers = await db.select({ id: researchPapers.id, updatedAt: researchPapers.updatedAt }).from(researchPapers);
    dynamicResearchRoutes = dbPapers.map(paper => ({
      url: `${baseUrl}/research/${paper.id}`,
      lastModified: paper.updatedAt ? new Date(paper.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (e) {
    console.error("Sitemap: Failed to query research papers:", e);
  }

  return [
    ...staticRoutes,
    ...dynamicBlogRoutes,
    ...dynamicProjectRoutes,
    ...dynamicResearchRoutes,
  ];
}

