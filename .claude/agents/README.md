# Project Agents

Four role-based agents drive delivery of the Nilou Personal Assistant. They are
Claude Code subagents (used with the Task tool):

- **product-owner-scrum** — backlog, user stories, acceptance criteria, prioritization.
- **ui-ux-designer** — mobile-first flows, component specs, design tokens.
- **senior-architect-dev** — architecture, schema, implementation (Next.js + Clerk + Postgres).
- **qa-engineer** — test plans, money-math verification, regression safety.

All four treat `docs/DOMAIN_MODEL.md` and `docs/PRODUCT_BRIEF.md` as sources of truth.
