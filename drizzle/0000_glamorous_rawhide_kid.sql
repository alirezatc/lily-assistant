CREATE TYPE "public"."account_source" AS ENUM('manual', 'equifax', 'transunion');--> statement-breakpoint
CREATE TYPE "public"."account_type" AS ENUM('credit_card', 'line_of_credit');--> statement-breakpoint
CREATE TYPE "public"."business" AS ENUM('tobacco', 'card_night', 'dealer', 'misc');--> statement-breakpoint
CREATE TYPE "public"."cadence" AS ENUM('monthly', 'quarterly', 'annual');--> statement-breakpoint
CREATE TYPE "public"."payer" AS ENUM('nilou', 'mom');--> statement-breakpoint
CREATE TYPE "public"."responsibility" AS ENUM('nilou', 'household', 'mom');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credit_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"type" "account_type" DEFAULT 'credit_card' NOT NULL,
	"last4" text,
	"issuer" text,
	"credit_limit_cents" integer,
	"statement_balance_cents" integer,
	"current_balance_cents" integer,
	"min_payment_cents" integer,
	"statement_day" integer,
	"due_day" integer,
	"autopay" boolean DEFAULT false NOT NULL,
	"source" "account_source" DEFAULT 'manual' NOT NULL,
	"external_ref" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"occurred_on" date NOT NULL,
	"amount_cents" integer NOT NULL,
	"category" text NOT NULL,
	"responsibility" "responsibility" NOT NULL,
	"paid_by" "payer" DEFAULT 'nilou' NOT NULL,
	"household_mom_share_bp" integer,
	"property_id" integer,
	"recurring_id" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "income_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"business" "business" NOT NULL,
	"occurred_on" date NOT NULL,
	"gross_cents" integer DEFAULT 0 NOT NULL,
	"net_cents" integer NOT NULL,
	"session_id" integer,
	"detail" jsonb,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "people" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"label" text NOT NULL,
	"address" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recurring_expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"category" text NOT NULL,
	"responsibility" "responsibility" NOT NULL,
	"cadence" "cadence" NOT NULL,
	"next_due" date NOT NULL,
	"property_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reminders" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"type" text NOT NULL,
	"source_id" integer,
	"fire_on" date NOT NULL,
	"lead_days" integer DEFAULT 3 NOT NULL,
	"channel" text DEFAULT 'in_app' NOT NULL,
	"status" text DEFAULT 'scheduled' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "repayments" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"from_person" "payer" DEFAULT 'mom' NOT NULL,
	"amount_cents" integer NOT NULL,
	"occurred_on" date NOT NULL,
	"notes" text
);
