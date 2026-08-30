# Sadhana — Project Context / Session Handoff

Use this file as the first context document in a new development session.

Recommended startup prompt:

> Read `docs/project-context.md`, `docs/fitness-plan-intake.md`, and `docs/fitness-plan-llm-learnings.md`, then inspect the current `main` branch and recent open PRs before making changes.

## Development workflow: PRs only

**Never commit or push changes directly to `main`.** All code, documentation, configuration, migration, and other repository changes must be made on a separate branch and submitted through a pull request for review.

Rules:

- Treat `main` as protected, even if repository permissions technically allow direct writes.
- Before making any change, create or use a dedicated branch from the current `main`.
- Commit changes only to that branch.
- Open a pull request targeting `main` and leave merging to the user unless explicitly asked to merge.
- Do not bypass the PR workflow for “small,” “obvious,” documentation-only, or corrective changes.

This workflow is a standing project requirement and applies to every development session.

This file is intentionally concise. It captures the product philosophy, architectural direction, UX rules, and major decisions that are easy to lose when starting a fresh chat. The more detailed fitness-planning rules live in the two planner docs above.

## Product identity

**Sadhana is a practice app, not another workout tracker.**

The name comes from the Sanskrit idea of a deliberate, sustained practice undertaken toward growth or accomplishment. The product should embody that idea: help a person repeatedly return to the practices that make life better, even when real life disrupts the plan.

Fitness is the first and most developed implementation, but the product concept is broader than fitness. It can include training, food, recovery, sleep, routines, mobility, errands or prerequisites, and other actions that support the user’s goals.

The product should answer:

- What matters today?
- What actually happened?
- Given reality, what should happen next?

It should **not** behave like a rigid calendar that assumes perfect execution.

## Core philosophy: no plan debt

A missed action does not automatically become tomorrow’s problem.

The app must distinguish between:

- what was planned
- what actually happened
- what remains relevant
- what the planner should change next

The desired loop is:

**Plan → life happens → Sadhana observes → plan changes.**

Not:

**Plan → life happens → plan ignores it → user feels behind.**

Future planned actions should support a carryover policy such as:

- `never`
- `if_still_relevant`
- `reschedule`
- `planner_decides`

Examples:

- target wake time: `never`
- optional mobility: usually `never`
- prerequisite errand: `if_still_relevant`
- strength session: `planner_decides`
- appointment: `reschedule`

Rest and recovery are intentional plan states, not failed or empty days.

## Today should be low-friction

The Today screen is the operational center of the product.

It should show only what helps the user act today. Rich planner output should **not** turn into rich forms everywhere.

Current lightweight reality capture:

- `Today’s practice` appears under the Today hero.
- It uses a few one-tap checkoffs, not a giant habit list.
- Saved strength workouts can auto-complete the corresponding practice item.
- `Day went sideways?` captures context without requiring a postmortem.
- No streaks.
- No make-up debt.
- Today Practice is persisted server-side in the date-unique `daily_checkins` record.
- There is one practice record per date. The current day is editable; historical practice editing is intentionally not exposed for now.

If the checkoffs become annoying, guilt-inducing, or redundant, simplify or remove them. The product goal is reality capture, not checkbox completion.

## Wearables

Wearables are **context for the planner, not the product itself**.

There is currently a `/wearables` placeholder page in the hamburger menu.

Likely useful signals:

- sleep duration
- steps / general activity
- detected workouts
- resting heart rate
- HRV / recovery signals when reliable
- heart-rate data useful for cardio progression

Do not make estimated calories burned a primary planning signal.

Expected provider direction:

1. COROS first
2. Apple Watch / Apple Health later
3. Garmin
4. WHOOP

Normalize external data behind a provider-agnostic model rather than coupling planner logic directly to one vendor.

## Navigation / information architecture

Keep primary navigation intentionally small.

Bottom navigation:

- Today
- Plan

Hamburger menu currently includes supporting destinations such as:

- Progress
- Exercises
- Wearables
- About

Do not create a new permanent tab for every feature. Contextual input is preferred over a generic “track everything” area.

## Exercise reference library

`/exercises` is the browse-all reference library for movements used in the plan. It should remain reference material, not another logging surface.

Current UX rules:

- Today mobility chips deep-link to the relevant `/exercises` entry or useful section.
- Broad/composite references may describe a short sequence, while individual movements can have their own entries.
- When a `How to do it` instruction mentions a movement with its own entry, link the movement words directly in the sentence instead of adding a separate related-links block.
- Inline reference links use the surrounding text color for normal, visited, hover, and active states; the distinction is underline plus roughly `font-weight: 500`. Avoid default blue/purple browser link styling and unnecessary arrow icons.
- Mobility cards use the body area as the small eyebrow (`HIP MOBILITY`, `NECK MOBILITY`) and the actual movement/reference name as the large title (`Hip 90/90`, `Neck/upper back`). Do not reverse this hierarchy.
- Mobility chips must have enough row spacing on mobile that wrapped tags never overlap.

## Progress and tracking

Broad progress checks are periodic, not daily.

Current rule:

- general progress check-in appears 28 days after the most recent progress entry
- weight and waist are optional
- performance metrics matter more than frequent scale data

History must support correction: add, edit, and delete historical progress entries. Workout history lives under Progress and supports historical workout editing and deletion.

Workout set logging belongs on strength days. Unilateral movements can store left/right reps separately. A workout can also record that something physically limited or adapted the session, with an optional note, so partial work has context instead of reading as unexplained failure.

Knee-response logging belongs on relevant cardio/run days. Other inputs should appear only when useful.

## Nutrition direction

Nutrition should reduce decisions, not create another tracking burden.

The current app uses defaults such as:

- simple breakfast default
- office vs home/WFH lunch logic
- short dinner rotation
- emergency decision-fatigue fallback
- rough calorie/protein guardrails without requiring daily food logging

When multiple lunch or dinner options are displayed, use a scannable bulleted list rather than a dense prose sentence. Mobile readability matters more than compressing the options into fewer lines.

Avoid turning this into a calorie-tracking app unless the user explicitly wants that behavior.

## Dynamic planning rules

The long-term planner should use completed history, symptoms, recovery, schedule changes, travel, classes, and eventually wearable data to adjust future programming.

Scheduled classes are real calendar events, not weekday assumptions. Actual bookings override templates.

A missed workout should not automatically get stacked onto the next day. The planner may move, replace, modify, or drop it depending on the rest of the week and current recovery.

A physical limitation or adapted/partial workout is first-class context. Do not automatically turn unfinished sets into make-up debt. Repeated limitations should influence future exercise/load decisions more than one isolated event.

The system should explicitly support re-entry after disrupted days or weeks.

When training is stable, introduce roughly one new exercise or variation every 6–8 weeks without churning the goal-critical core movements.

## Current product / technical architecture

Repository: `nopravlem/fitness-tracker`

Stack:

- Next.js
- React
- TypeScript
- Vercel
- Neon Postgres
- Drizzle ORM / Drizzle Kit

Current app is intentionally single-user with no auth yet. Add users/auth before multi-user exposure rather than prematurely complicating the current build.

Core tracker data, workout history, and Today Practice are persisted server-side in Postgres.

Workout reads/writes use an explicit client-local date rather than deriving the date from server UTC. Preserve this distinction when adding date-based behavior.

Database migrations are checked into `drizzle/` and run through the repository’s migration workflow.

## Current plan structure

Program start: `2026-08-28`.

Main weekly structure includes Strength A/B/C, cardio, recovery, rest, mobility, and actual-date Solidcore overrides.

The program includes calendar-aware recovery/travel/deload blocks and a February assessment block.

Do not invent sessions before the actual program start date.

Detailed exercises, training blocks, overrides, and progression rules live in `lib/program.ts` and `docs/fitness-plan-intake.md`.

## Product language / tone

Use direct, practical language. Avoid generic fitness-influencer copy, punishment framing, or perfectionist language.

Good concepts:

- practice
- re-entry
- no debt
- what matters today
- decisions already made
- reality is input to the plan
- rest is intentional

Avoid framing missed days as failure or encouraging compensatory behavior.

Use plain-language labels instead of unexplained gym shorthand in user-facing UI. For example, bodyweight defaults are displayed as `bodyweight` rather than `BW`.

## Visual / UX direction

Current visual palette is dark aubergine/plum with coral/dusty-rose accents.

Important established preferences:

- no gradient buttons
- do not over-nest cards/forms
- keep mobile UI clean
- fullscreen hamburger menu is opaque
- preserve generous rounded styling for now; a broader design pass may happen later
- do not make ad hoc global visual changes without considering the whole design system
- lists of choices should be visually scannable rather than encoded as long prose
- links embedded in reference prose should remain visually integrated with the surrounding text rather than taking on default browser colors

## Recently completed work

Recent merged work includes:

- Sadhana rename and About page
- progress CRUD and cleaner editor layout
- workout history under Progress with historical edit/delete
- native mobile date-input fixes
- explicit client-local workout dates to avoid UTC rollover bugs
- workout draft autosave and extra-set logging
- training-limitation context and unilateral left/right reps
- workout-feel scale changed to `1 = could do more`, `5 = wrecked`
- header label changed to `SIX MONTH PRACTICE`
- database-backed Today Practice with one record per date
- Wearables placeholder
- dynamic-planning / no-debt rules added to planner learnings
- `/exercises` reference library, hamburger navigation entry, and deep-linked mobility chips
- mobile readability refinements for nutrition lists and mobility/reference links

Always inspect current `main` and recent PRs before assuming this list is still exhaustive.

## Key docs to read next

- `README.md` — architecture and overall project direction
- `docs/fitness-plan-intake.md` — canonical intake and plan-generation specification
- `docs/fitness-plan-llm-learnings.md` — product/planner rules learned through real usage
- `lib/program.ts` — current concrete six-month reference plan

## North star

Sadhana should not judge whether the user followed a perfect plan.

It should help the user **return to a useful practice today**, learn from what actually happened, and make the next plan more realistic than the last one.
