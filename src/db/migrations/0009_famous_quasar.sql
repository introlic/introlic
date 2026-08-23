CREATE TABLE "projects" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"category" varchar(100) NOT NULL,
	"author" varchar(200) NOT NULL,
	"author_role" varchar(200),
	"status" varchar(50) DEFAULT 'Active' NOT NULL,
	"started" varchar(50),
	"open_to" varchar(500),
	"tags" jsonb,
	"topic" text,
	"why" text,
	"factors" jsonb,
	"readme" text,
	"github_url" varchar(500),
	"demo_url" varchar(500),
	"logo_url" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog_categories" ADD COLUMN "type" varchar(50) DEFAULT 'blog' NOT NULL;--> statement-breakpoint
ALTER TABLE "visits" ADD COLUMN "device_type" varchar(50);--> statement-breakpoint
ALTER TABLE "visits" ADD COLUMN "os" varchar(100);--> statement-breakpoint
ALTER TABLE "visits" ADD COLUMN "browser" varchar(100);--> statement-breakpoint
ALTER TABLE "visits" ADD COLUMN "screen_resolution" varchar(30);--> statement-breakpoint
ALTER TABLE "visits" ADD COLUMN "cpu_cores" integer;--> statement-breakpoint
ALTER TABLE "visits" ADD COLUMN "language" varchar(20);--> statement-breakpoint
ALTER TABLE "visits" ADD COLUMN "session_id" varchar(64);--> statement-breakpoint
CREATE INDEX "project_title_idx" ON "projects" USING btree ("title");--> statement-breakpoint
CREATE INDEX "project_category_idx" ON "projects" USING btree ("category");--> statement-breakpoint
CREATE INDEX "project_author_idx" ON "projects" USING btree ("author");--> statement-breakpoint
CREATE INDEX "visit_session_idx" ON "visits" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "visit_device_idx" ON "visits" USING btree ("device_type");