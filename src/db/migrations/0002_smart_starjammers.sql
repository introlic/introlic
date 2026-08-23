DROP INDEX "email_idx";--> statement-breakpoint
DROP INDEX "username_idx";--> statement-breakpoint
CREATE INDEX "device_fingerprint_idx" ON "users" USING btree ("device_fingerprint");--> statement-breakpoint
CREATE INDEX "status_idx" ON "users" USING btree ("status");--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "username_idx" ON "users" USING btree ("username");