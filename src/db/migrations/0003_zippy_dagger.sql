CREATE TABLE "admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100),
	"username" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" varchar(20) DEFAULT 'admin' NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"login_attempts" integer DEFAULT 0 NOT NULL,
	"lockout_until" timestamp,
	"last_login_ip" varchar(45),
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_username_unique" UNIQUE("username"),
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"date_of_birth" date NOT NULL,
	"gender" varchar(50) DEFAULT 'PREFER_NOT_TO_SAY' NOT NULL,
	"state" varchar(100),
	"subject" varchar(100) NOT NULL,
	"message" varchar(5000) NOT NULL,
	"social_handles" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "admin_email_idx" ON "admins" USING btree ("email");--> statement-breakpoint
CREATE INDEX "admin_username_idx" ON "admins" USING btree ("username");--> statement-breakpoint
CREATE INDEX "admin_status_idx" ON "admins" USING btree ("status");--> statement-breakpoint
CREATE INDEX "contact_email_idx" ON "contacts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "contact_subject_idx" ON "contacts" USING btree ("subject");--> statement-breakpoint
CREATE INDEX "contact_created_at_idx" ON "contacts" USING btree ("created_at");