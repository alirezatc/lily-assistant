# Release Notes

## Sprint 4 — "Make it yours" · June 2026

Live at **https://lily-assistant.vercel.app**

### ✨ New

- **Rename your income types.** A new **Settings** screen (tap the ⚙️ gear, top‑right)
  lets you rename Tobacco, Card Night, Dealer, and Misc to whatever you like. The new
  names show up everywhere — the home screen totals and the income tabs follow along.
  *(Needs the one‑time database step below to start saving.)*
- **Filter your activity by date.** The Activity screen now has **From / To** date
  pickers. Pick a range and the table — plus the “Made” and “Spent” totals — update to
  just that window. Leave them blank to see everything.

### 🔧 Under the hood
- New `settings` table + safe data layer; if the rename data isn’t there yet the app
  quietly falls back to the default names (no errors).
- Type‑checked, 41/41 money & date tests passing, deployed and smoke‑tested live.

### ✅ One quick step from you (to turn on renaming)
Renaming needs a tiny database update — same as before:
open **Neon → SQL Editor**, paste the contents of
`drizzle/0001_unknown_vin_gonzales.sql`, and click **Run**. That’s it; the Settings
screen will start saving. (Everything else already works without this.)

---

## Still to come (these need accounts only you can create)

- **Turn on login (Clerk).** The login + splash screens are already built and waiting.
  To switch them on: create a free account at clerk.com, then add two keys to Vercel
  (just like the database step). The moment they’re in, the app locks behind a login.
  I’ll walk you through it whenever you’re ready.
- **Two‑factor authentication.** A simple toggle in Clerk once login is on.
- **Google Calendar reminders.** Push your “due this week” cards to your calendar so you
  get phone notifications — needs a one‑time Google authorization.

## Deliberately *not* done (for your safety)
- **Storing full card numbers.** We keep only the last 4 (shown masked, with the eye to
  reveal). Storing full card numbers in a website is a real risk if it’s ever hacked, so
  we don’t.

---

### Earlier releases
- **Sprint 3** — pink redesign, pink favicon, modern icons, time‑of‑day greeting,
  activity table, card nicknames + edit + masked reveal, fixed number inputs, login built.
- **Sprint 2** — credit‑card & line‑of‑credit tracker, “due this week”, graceful errors.
- **Sprint 1** — income capture (4 businesses), expenses with Mom‑owes settlement, the
  tested money engine.
