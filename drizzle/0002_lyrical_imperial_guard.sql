CREATE TABLE IF NOT EXISTS "expense_shares" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"expense_id" integer NOT NULL,
	"person_id" integer NOT NULL,
	"share_bp" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "paid_by_person_id" integer;--> statement-breakpoint
ALTER TABLE "people" ADD COLUMN "is_self" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "people" ADD COLUMN "active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "people" ADD COLUMN "color" text;--> statement-breakpoint
ALTER TABLE "repayments" ADD COLUMN "from_person_id" integer;--> statement-breakpoint
ALTER TABLE "repayments" ADD COLUMN "to_person_id" integer;