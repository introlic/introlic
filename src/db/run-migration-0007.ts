import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const runMigration0007 = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  const client = postgres(process.env.DATABASE_URL, { max: 1 });

  console.log("Running migration 0007: blog_research_tables...");

  try {
    await client`
      CREATE TABLE IF NOT EXISTS "blog_posts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "slug" varchar(255) NOT NULL,
        "title" varchar(500) NOT NULL,
        "category" varchar(100) DEFAULT 'Architecture' NOT NULL,
        "tag" varchar(100),
        "date" varchar(50),
        "read_time" varchar(50),
        "excerpt" text,
        "body" text,
        "author" varchar(200),
        "thumbnail_url" varchar(500),
        "cover_name" varchar(100) DEFAULT 'CoverIntrolicDWaves',
        "show_contributors" boolean DEFAULT false NOT NULL,
        "contributors" jsonb,
        "status" varchar(20) DEFAULT 'published' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
      )
    `;
    console.log("✓ blog_posts table created");

    await client`
      CREATE TABLE IF NOT EXISTS "research_papers" (
        "id" varchar(50) PRIMARY KEY NOT NULL,
        "title" varchar(500) NOT NULL,
        "type" varchar(50) DEFAULT 'Publication' NOT NULL,
        "author" varchar(200),
        "date" varchar(50),
        "abstract" text,
        "full_text" text,
        "keywords" jsonb,
        "doi" varchar(500),
        "institution" varchar(300),
        "external_url" varchar(500),
        "show_contributors" boolean DEFAULT false NOT NULL,
        "contributors" jsonb,
        "status" varchar(20) DEFAULT 'published' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      )
    `;
    console.log("✓ research_papers table created");

    // Create indexes (IF NOT EXISTS)
    await client`CREATE INDEX IF NOT EXISTS "blog_slug_idx" ON "blog_posts" USING btree ("slug")`;
    await client`CREATE INDEX IF NOT EXISTS "blog_category_idx" ON "blog_posts" USING btree ("category")`;
    await client`CREATE INDEX IF NOT EXISTS "blog_author_idx" ON "blog_posts" USING btree ("author")`;
    await client`CREATE INDEX IF NOT EXISTS "blog_status_idx" ON "blog_posts" USING btree ("status")`;
    await client`CREATE INDEX IF NOT EXISTS "blog_created_at_idx" ON "blog_posts" USING btree ("created_at")`;
    await client`CREATE INDEX IF NOT EXISTS "research_type_idx" ON "research_papers" USING btree ("type")`;
    await client`CREATE INDEX IF NOT EXISTS "research_author_idx" ON "research_papers" USING btree ("author")`;
    await client`CREATE INDEX IF NOT EXISTS "research_status_idx" ON "research_papers" USING btree ("status")`;
    await client`CREATE INDEX IF NOT EXISTS "research_created_at_idx" ON "research_papers" USING btree ("created_at")`;
    console.log("✓ Indexes created");

    console.log("\nMigration 0007 complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
};

runMigration0007().catch(console.error);
