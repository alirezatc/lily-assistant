# Nilou Personal Assistant

Mobile-first personal finance assistant for tracking income across several small
businesses, splitting household/Mom expenses with automatic settlement, and never
missing a credit-card or line-of-credit due date.

## Docs (read these first)
- [`docs/PRODUCT_BRIEF.md`](docs/PRODUCT_BRIEF.md) — vision, users, scope, roadmap.
- [`docs/DOMAIN_MODEL.md`](docs/DOMAIN_MODEL.md) — entities + money math (source of truth).
- [`.claude/agents/`](.claude/agents/) — the four delivery agents.

## Stack
Next.js (App Router) · Clerk auth · Postgres + Drizzle · Tailwind · TypeScript.
Deploys to Vercel; Cloudflare available for DNS/edge.

## Getting started
```bash
npm install
cp .env.example .env.local   # fill in Clerk + DATABASE_URL
npm run test                 # money-math unit tests (no DB/secrets needed)
npm run dev                  # http://localhost:3000
```

## Money math
All amounts are **integer cents**. The single implementation lives in
[`lib/money/`](lib/money/index.ts) and is unit-tested in `lib/money/index.test.ts`.
Key rules: tobacco net = packs×cost×margin; card-night rake per round =
`max(10% of pot, $15)`; dealer cut = (fee+tips)×split; "Mom owes Nilou" derived
from expense responsibility + repayments.

## Status
Phase-1 scaffold: docs, agents, money layer (tested), DB schema, mobile shell with
a working live-math demo on the Income screen. Feature wiring is the first sprint.
