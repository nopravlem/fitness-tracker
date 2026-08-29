# Sadhana

Mobile-first personal fitness, mobility, running, nutrition, recovery, and progress planner built around a structured six-month training plan.

The current app is single-user and designed around one personalized program, but the longer-term direction is to support an LLM-powered intake flow that can generate similarly detailed plans for other users.

## What the app tracks

- Date-aware daily training plan
- Strength A / B / C workouts
- Previous-session context and progression targets
- Push-up and pull-up progression
- Running and knee-response tracking
- Mobility and split practice
- Nutrition guidance and low-friction food defaults
- Performance-first progress metrics
- Travel, recovery, holiday, and deload blocks

## Current architecture

- **Frontend / server:** Next.js + React + TypeScript
- **Database:** Postgres via Neon
- **ORM / migrations:** Drizzle ORM + Drizzle Kit
- **Hosting:** Vercel
- **Persistence:** server-backed Postgres APIs; no longer dependent on browser localStorage for core tracker data
- **Database migrations:** GitHub Actions runs Drizzle migrations when migration files change on `main`, with a manual workflow trigger also available
- **Auth:** intentionally omitted for now because the app is single-user; a users table and user-scoped foreign keys can be introduced before multi-user exposure

## Training-plan model

The plan is not intended to be a generic workout template. It combines:

- appearance and body-composition goals
- explicit performance goals
- current and historical strength baselines
- injury and pain history
- work schedule and normal activity level
- gym/classes/equipment already available
- food preferences and dislikes
- cooking, grocery-shopping, and meal-prep tolerance
- travel, PTO, holidays, and other calendar disruptions
- adherence barriers such as work stress and decision fatigue

The result is a calendar-aware program with strength, cardio, mobility, nutrition guardrails, recovery blocks, and measurable progression rules.

## Future LLM planner

The goal is to eventually let a user complete a structured intake and have an LLM generate a plan with the same level of specificity as the original program in this repo.

The working intake and generation specification lives at:

[`docs/fitness-plan-intake.md`](docs/fitness-plan-intake.md)

Recent product/planner learnings are captured in:

[`docs/fitness-plan-llm-learnings.md`](docs/fitness-plan-llm-learnings.md)

These docs are intentionally living specs. They include:

- recommended intake questions
- plan-duration options: 12 weeks, 6 months, or 1 year
- body and performance baselines
- injury/history fields
- lifestyle and calendar inputs
- diet/cooking/food preference inputs
- adherence constraints
- plan-generation rules
- a proposed TypeScript intake schema
- a proposed structured plan output
- future adaptive-planning behavior using tracker history
- product rules for contextual logging, scheduled classes, recovery, and dynamic replanning

## Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Create a migration after schema changes:

```bash
npm run db:generate
```

Apply migrations:

```bash
npm run db:migrate
```

`DATABASE_URL` must point to the Postgres database for server/database operations.

## Product direction

Near term, the app remains deliberately single-user while the tracking UX and plan model are refined.

Longer term:

1. Turn the intake spec into a structured onboarding flow.
2. Use an LLM to generate a typed, structured training plan rather than prose-only output.
3. Store generated programs separately from completed workout history.
4. Let the LLM use live training, pain, mobility, nutrition, adherence, and eventually wearable data to adjust future programming.
5. Add users/auth only before exposing the product to multiple people.

The planner should behave like a living coach/programming system: preserve history, adapt future sessions, and redesign the plan when reality changes instead of treating a static plan as immutable.
