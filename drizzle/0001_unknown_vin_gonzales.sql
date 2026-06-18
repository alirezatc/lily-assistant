CREATE TABLE IF NOT EXISTS "settings" (
	"owner_id" text PRIMARY KEY NOT NULL,
	"business_labels" jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
