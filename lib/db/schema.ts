import {
  pgTable, serial, text, integer, boolean, timestamp, date, jsonb, pgEnum,
} from "drizzle-orm/pg-core";

// Money is stored as INTEGER CENTS everywhere. Percentages as integer basis
// points where stored (3000 = 30%). See docs/DOMAIN_MODEL.md.

export const businessEnum = pgEnum("business", ["tobacco", "card_night", "dealer", "misc"]);
export const responsibilityEnum = pgEnum("responsibility", ["nilou", "household", "mom"]);
export const payerEnum = pgEnum("payer", ["nilou", "mom"]);
export const accountTypeEnum = pgEnum("account_type", ["credit_card", "line_of_credit"]);
export const cadenceEnum = pgEnum("cadence", ["monthly", "quarterly", "annual"]);
export const accountSourceEnum = pgEnum("account_source", ["manual", "equifax", "transunion"]);

export const people = pgTable("people", {
  id: serial("id").primaryKey(),
  ownerId: text("owner_id").notNull(), // Clerk user id (household owner)
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  label: text("label").notNull(),
  address: text("address"),
});

export const incomeEvents = pgTable("income_events", {
  id: serial("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  business: businessEnum("business").notNull(),
  occurredOn: date("occurred_on").notNull(),
  grossCents: integer("gross_cents").notNull().default(0),
  netCents: integer("net_cents").notNull(),
  sessionId: integer("session_id"), // links card_night <-> dealer for one physical night
  detail: jsonb("detail"), // business-specific structured payload
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  occurredOn: date("occurred_on").notNull(),
  amountCents: integer("amount_cents").notNull(),
  category: text("category").notNull(),
  responsibility: responsibilityEnum("responsibility").notNull(),
  paidBy: payerEnum("paid_by").notNull().default("nilou"),
  householdMomShareBp: integer("household_mom_share_bp"), // basis points, null -> default
  propertyId: integer("property_id"),
  recurringId: integer("recurring_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const recurringExpenses = pgTable("recurring_expenses", {
  id: serial("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  amountCents: integer("amount_cents").notNull(),
  category: text("category").notNull(),
  responsibility: responsibilityEnum("responsibility").notNull(),
  cadence: cadenceEnum("cadence").notNull(),
  nextDue: date("next_due").notNull(),
  propertyId: integer("property_id"),
});

export const repayments = pgTable("repayments", {
  id: serial("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  fromPerson: payerEnum("from_person").notNull().default("mom"),
  amountCents: integer("amount_cents").notNull(),
  occurredOn: date("occurred_on").notNull(),
  notes: text("notes"),
});

export const creditAccounts = pgTable("credit_accounts", {
  id: serial("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  name: text("name").notNull(),
  type: accountTypeEnum("type").notNull().default("credit_card"),
  last4: text("last4"),
  issuer: text("issuer"),
  creditLimitCents: integer("credit_limit_cents"),
  statementBalanceCents: integer("statement_balance_cents"),
  currentBalanceCents: integer("current_balance_cents"),
  minPaymentCents: integer("min_payment_cents"),
  statementDay: integer("statement_day"),
  dueDay: integer("due_day"), // day of month
  autopay: boolean("autopay").notNull().default(false),
  source: accountSourceEnum("source").notNull().default("manual"),
  externalRef: text("external_ref"),
  notes: text("notes"),
});

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  type: text("type").notNull(), // credit_due | expense_due | custom
  sourceId: integer("source_id"),
  fireOn: date("fire_on").notNull(),
  leadDays: integer("lead_days").notNull().default(3),
  channel: text("channel").notNull().default("in_app"), // in_app | google_calendar | both
  status: text("status").notNull().default("scheduled"),
});
