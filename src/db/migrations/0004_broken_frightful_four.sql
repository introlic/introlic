CREATE TABLE "visits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ip_address" varchar(45) NOT NULL,
	"user_agent" varchar(512),
	"path" varchar(255) NOT NULL,
	"referer" varchar(512),
	"country" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "visit_ip_idx" ON "visits" USING btree ("ip_address");--> statement-breakpoint
CREATE INDEX "visit_path_idx" ON "visits" USING btree ("path");--> statement-breakpoint
CREATE INDEX "visit_created_at_idx" ON "visits" USING btree ("created_at");