# Sadhana — Project Context / Session Handoff

Use this file as the first context document in a new development session.

Recommended startup prompt:

> Read `docs/project-context.md`, `docs/fitness-plan-intake.md`, and `docs/fitness-plan-llm-learnings.md`, then inspect the current `main` branch and recent open PRs before making changes.

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

Current lightweight reality-capture experiment:

- `Today’s practice` appears under the Today hero.
- It uses a few one-tap checkoffs, not a giant habit list.
- Saved strength workouts can auto-complete the corresponding practice item.
- `Day went sideways?` captures context without requiring a postmortem.
- No streaks.
- No make-up debt.
- Practice state is currently stored in `localStorage` on purpose so the interaction remains disposable while it is being tested.

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
- Wearables
- About

Do not create a new permanent tab for every feature. Contextual input is preferred over a generic “track everything” area.

## Progress and tracking

Broad progress checks are periodic, not daily.

Current rule:

- general progress check-in appears 28 days after the most recent progress entry
- weight and waist are optional
- performance metrics matter more than frequent scale data

History must support correction: add, edit, and delete historical entries.

Workout set logging belongs on strength days. Knee-response logging belongs on relevant cardio/run days. Other inputs should appear only when useful.

## Nutrition direction

Nutrition should reduce decisions, not create another tracking burden.

The current app uses defaults such as:

- simple breakfast default
- office vs home/WFH lunch logic
- short dinner rotation
- emergency decision-fatigue fallback
- rough calorie/protein guardrails without requiring daily food logging

Avoid turning this into a calorie-tracking app unless the user explicitly wants that behavior.

## Dynamic planning rules

The long-term planner should use completed history, symptoms, recovery, schedule changes, travel, classes, and eventually wearable data to adjust future programming.

Scheduled classes are real calendar events, not weekday assumptions. Actual bookings override templates.

A missed workout should not automatically get stacked onto the next day. The planner may move, replace, modify, or drop it depending on the rest of the week and current recovery.

The system should explicitly support re-entry after disrupted days or weeks.

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

Core tracker data is persisted server-side in Postgres. The Today Practice experiment is an exception and currently uses browser `localStorage` by design.

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

## Visual / UX direction

Current visual palette is dark aubergine/plum with coral/dusty-rose accents.

Important established preferences:

- no gradient buttons
- do not over-nest cards/forms
- keep mobile UI clean
- fullscreen hamburger menu is opaque
- preserve generous rounded styling for now; a broader design pass may happen later
- do not make ad hoc global visual changes without considering the whole design system

## Recently completed work

Recent merged work includes:

- Sadhana rename and About page
- progress CRUD and cleaner editor layout
- native mobile date-input fixes
- workout-feel scale changed to `1 = could do more`, `5 = wrecked`
- header label changed to `SIX MONTH PRACTICE`
- Today Practice experiment
- Wearables placeholder
- dynamic-planning / no-debt rules added to planner learnings

Always inspect current `main` and recent PRs before assuming this list is still exhaustive.

## Key docs to read next

- `README.md` — architecture and overall project direction
- `docs/fitness-plan-intake.md` — canonical intake and plan-generation specification
- `docs/fitness-plan-llm-learnings.md` — product/planner rules learned through real usage
- `lib/program.ts` — current concrete six-month reference plan

## North star

Sadhana should not judge whether the user followed a perfect plan.

It should help the user **return to a useful practice today**, learn from what actually happened, and make the next plan more realistic than the last one.
