CREATE TABLE "consent_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"ip_address_hash" text,
	"consent_snapshot" json NOT NULL,
	"status" text NOT NULL,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "consent_logs" ADD CONSTRAINT "consent_logs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;