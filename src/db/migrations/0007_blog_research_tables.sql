CREATE TABLE "blog_posts" (
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
);
--> statement-breakpoint
CREATE TABLE "research_papers" (
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
);
--> statement-breakpoint
CREATE INDEX "blog_slug_idx" ON "blog_posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blog_category_idx" ON "blog_posts" USING btree ("category");--> statement-breakpoint
CREATE INDEX "blog_author_idx" ON "blog_posts" USING btree ("author");--> statement-breakpoint
CREATE INDEX "blog_status_idx" ON "blog_posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "blog_created_at_idx" ON "blog_posts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "research_type_idx" ON "research_papers" USING btree ("type");--> statement-breakpoint
CREATE INDEX "research_author_idx" ON "research_papers" USING btree ("author");--> statement-breakpoint
CREATE INDEX "research_status_idx" ON "research_papers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "research_created_at_idx" ON "research_papers" USING btree ("created_at");