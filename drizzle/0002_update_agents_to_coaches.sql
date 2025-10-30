ALTER TABLE "agent" RENAME TO "coach";--> statement-breakpoint
ALTER TABLE "coach" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "coach" ADD CONSTRAINT "coach_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;