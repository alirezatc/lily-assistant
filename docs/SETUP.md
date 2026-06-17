# Setup & Deploy — Nilou Personal Assistant

Three steps to a live app: **database → auth → deploy**. The repo is already on
GitHub at `alirezatc/lily-assistant`.

---

## 1. Apply the database schema to Neon

The migration lives at `drizzle/0000_glamorous_rawhide_kid.sql` (8 tables).
Pick **either** option:

**Option A — Neon SQL Editor (fastest, no tooling).**
Open your Neon project → **SQL Editor** → paste the entire contents of
`drizzle/0000_glamorous_rawhide_kid.sql` → **Run**. Done.

**Option B — from your machine (one command).**
```bash
git clone https://github.com/alirezatc/lily-assistant.git
cd lily-assistant
npm install
# create .env.local with your DATABASE_URL (Neon pooled connection string)
echo 'DATABASE_URL=YOUR_NEON_POOLED_URL' > .env.local
npm run db:migrate     # applies drizzle/ migrations to Neon
```
> Note: this app's build environment couldn't reach the Neon host directly, which
> is why the schema is shipped as SQL for you to apply once.

---

## 2. Add authentication (Clerk)

1. Create an app at https://dashboard.clerk.com.
2. Copy the **Publishable key** and **Secret key**.
3. Put them in `.env.local` (already scaffolded with the right variable names):
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   CLERK_SECRET_KEY=sk_...
   ```

---

## 3. Deploy to Vercel

1. https://vercel.com/new → **Import** the `lily-assistant` GitHub repo.
2. Add Environment Variables (Project → Settings → Environment Variables):
   - `DATABASE_URL` = your Neon **pooled** connection string
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
3. Deploy. Vercel auto-builds on every push to `main`.

---

## Local development
```bash
npm install
npm run test     # 41 money/reminder unit tests — no DB or secrets needed
npm run dev      # http://localhost:3000
```

## Security note
`.env.local` is gitignored and never committed. The GitHub token you shared was
used only to create the push and is not stored in the repo — you can revoke it any
time at https://github.com/settings/tokens . Treat your Neon connection string the
same way; rotate it in the Neon dashboard if it's ever exposed.

## What's next (see docs/BACKLOG.md)
Sprint 2 — credit-account UI for the 12 cards + lines of credit, due-this-week
reminders, recurring fixed costs per property. Sprint 4 — Google Calendar push.
