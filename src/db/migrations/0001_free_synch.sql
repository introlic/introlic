ALTER TABLE "users" ADD COLUMN "ip_address" varchar(45);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "country" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "device_fingerprint" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "terms_accepted" boolean DEFAULT false NOT NULL;