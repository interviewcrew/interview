ALTER TABLE "coach" RENAME COLUMN "instructions" TO "system_prompt";--> statement-breakpoint
ALTER TABLE "coach" ADD COLUMN "interview_instructions" json;