# Fitness Planner — Recent LLM/Product Learnings

This document is an addendum to [`fitness-plan-intake.md`](fitness-plan-intake.md). It captures planner/product rules learned while iterating on the first real plan and its UI. These should eventually be folded into the main intake/generation spec as the planner evolves.

## 1. Scheduled classes are real calendar events, not weekday assumptions

A membership such as “4 Solidcore classes/month” should **not** automatically become “Solidcore every Wednesday.”

The planner should collect:

- class/membership frequency
- actual booked dates when known
- class time
- optional class focus/type
- whether the class replaces a normal workout or supplements it

Rules:

- Actual booked dates override the default weekly template.
- If a class is not booked on the default class day, do not invent one.
- **Workout classes are swaps, not replacements, by default.** When a booked class lands on a day that already had a planned session, the class should usually take that day’s slot and the displaced session should move to the normal class day or another sensible open training slot in the same week.
- A class should not silently erase a planned session from the week or create an accidental extra recovery/rest day unless the planner intentionally reduces volume for recovery, travel, symptoms, or another explicit reason.
- Do not stack the class and displaced workout on the same day merely to preserve volume.
- If a user explicitly wants the class to replace or supplement a workout, follow that preference instead of forcing a swap.
- Future generated plans should support calendar overrides and session swaps as first-class data.

Example from the reference plan: Solidcore is 4 classes/month and September bookings fall on different weekdays. The plan follows those actual dates, and when Solidcore is booked off the default Wednesday slot, the workout it displaces is moved to Wednesday so the intended weekly training rhythm remains intact.

## 2. Progress check-ins should be periodic, not daily

Body weight, waist measurements, and broad performance check-ins should not be surfaced as daily obligations by default.

Recommended default cadence:

- every 4 weeks for general progress
- optionally every 2 weeks when the user explicitly prefers more frequent feedback
- daily logging only for data that genuinely benefits from daily capture

Rules:

- Weight and measurements should be optional fields.
- The UI should emphasize trends and capability rather than daily fluctuations.
- The planner should define reassessment dates when generating the plan.
- The app should remind the user only when a check-in is due rather than keeping the form permanently prominent.

## 3. Nutrition guidance should reduce decisions, not create more work

For users who are mentally exhausted by food decisions, a plan that says “track every meal” or presents dozens of interchangeable options can make adherence worse.

The LLM should be able to generate a **decision-reduction nutrition plan** with:

- a default breakfast
- office-day lunch rule
- WFH/home lunch defaults
- a short dinner rotation
- an emergency “I am too tired to decide” fallback
- optional calorie/protein guardrails without requiring detailed meal logging

The planner should distinguish between:

- users who enjoy tracking and meal planning
- users who tolerate light structure
- users for whom decision fatigue is the primary barrier

For the latter group, the goal is to pre-make decisions rather than ask them to repeatedly make “healthy choices” in the moment.

When several food choices are shown in the UI, render them as a **scannable list** rather than a dense comma- or semicolon-separated paragraph. This applies especially to lunch and dinner defaults on mobile.

## 4. Plan output and logging UI are different concerns

The LLM should generate enough structured detail to create a useful plan, but the app should **not expose every generated field as a daily input**.

Examples:

- The plan can contain nutrition targets, but the user may not need a daily nutrition form.
- The plan can contain mobility progression, but mobility logging can remain optional/contextual.
- The plan can define progress metrics, while the app only surfaces the progress form every few weeks.

Planner output should therefore separate:

- `plan`: what the user should do
- `tracking`: what is useful to record
- `checkInCadence`: how often each metric should be requested
- `contextualPrompts`: forms/logging that appear only on relevant days

This prevents a detailed LLM plan from turning into an overwhelming interface.

## 5. Contextual input beats permanent tracker tabs

Inputs should appear where they are relevant instead of living in a permanent “Track everything” area.

Examples:

- Knee-response logging appears on run/cardio days.
- Workout set logging appears on strength days.
- Progress measurements appear when a periodic check-in is due.
- Food defaults appear on Today because they help make the day easier, not because the user needs to record every meal.

The generated plan should include enough metadata for the UI to know **when** an input is relevant.

## 6. Calendar awareness should include deliberate breaks

A calendar view should show not only workouts but also:

- rest days
- recovery days
- travel blocks
- deloads
- holidays
- PTO/staycation adjustments
- scheduled classes
- one-off event overrides

Rest and recovery should be treated as intentional plan states, not blank or failed days.

The planner should distinguish:

- `rest`: intentionally no training
- `recovery`: light movement/mobility/walking okay
- `travel_recovery`: flexible movement, no obligation to maintain full program
- `deload`: deliberately reduced training stress

## 7. The plan has a real start date

Before the selected start date, calendar dates should not be backfilled with invented sessions.

Rules:

- Day 1 is the actual plan start date.
- Project-day counters should derive from that date.
- Calendar dates before Day 1 are outside the program.
- If a user starts mid-month, the calendar should begin mid-month rather than pretending earlier days were missed.

## 8. History management should support correction

Progress/history data should not be append-only.

The user should be able to:

- add a historical check-in
- edit an incorrect check-in
- delete a check-in
- edit a historical workout when the original entry was partial or incorrect
- delete a workout that should not exist

This matters for future LLM adaptation: the model should consume corrected history rather than treating accidental or duplicate records as truth.

Daily-practice state is different: for now it is one date-keyed snapshot that can be changed during that day, then treated as closed context rather than a historical form to rewrite later.

## 9. UX principle: avoid unnecessary nesting and clutter

When the user chooses to add or edit optional data, the editing surface should be visually distinct from the history it modifies.

For example, opening “Add progress” on the same `/progress` page is fine, but the form should live in its own standalone card rather than being nested inside the history card.

This is a product/UI rule rather than a fitness-programming rule, but it matters for an LLM-driven product because richer generated plans can easily produce clutter if every concept is rendered at once.

## 10. Suggested schema additions

Future structured planner output should consider fields like:

```ts
interface ScheduledClass {
  provider?: string;
  date: string;
  time?: string;
  classType?: string;
  focus?: string;
  replacesPlannedSession?: boolean;
}

interface TrackingRule {
  metric: string;
  cadence: 'per_session' | 'contextual' | 'biweekly' | 'monthly' | 'optional';
  required: boolean;
}

interface NutritionDefaults {
  breakfast?: string[];
  officeLunchRule?: string;
  homeLunches?: string[];
  dinners?: string[];
  emergencyFallback?: string;
  calorieRange?: string;
  proteinTarget?: string;
  requiresFoodLogging?: boolean;
}
```

## 11. A dynamic plan must respond to what actually happened

A calendar that advances as though every planned action happened perfectly creates hidden “plan debt.” Missing one day can make the next day feel like the user is already behind even when they intellectually know that missing a day is okay.

The planner should treat planned actions and completed actions as separate state.

Rules:

- A missed action does **not** automatically roll forward.
- Every planned action should eventually have a carryover policy such as `never`, `if_still_relevant`, `reschedule`, or `planner_decides`.
- Routine actions such as a target wake time or optional mobility normally use `never`: try again on the next relevant day rather than creating debt.
- Errands or prerequisites can use `if_still_relevant`.
- Training sessions should generally use `planner_decides`: the planner may move, replace, modify, or drop the session based on the rest of the week and current recovery.
- Rest/recovery missed or spent differently is not something to “make up.”
- The planner should explicitly communicate when a new day is a clean re-entry point.

Daily completion UI should be intentionally low friction. One-tap state is preferred; rich postmortems are not required. A lightweight “day went sideways” signal can provide context without forcing the user to explain every unchecked item.

The goal is not to maximize checkbox completion. The goal is to capture enough reality for the next plan decision to be better.

## 12. Wearables are context, not the product

Wearable integrations should primarily reduce manual input and improve planning decisions. They should not turn the app into a generic health-metrics dashboard.

Potential useful signals include:

- sleep duration
- steps/general activity
- detected workouts
- resting heart rate
- HRV/recovery signals when reliable and available
- heart-rate data relevant to cardio progression

Estimated calories burned should not be a primary planning signal.

The integration layer should normalize external signals so the planner is not tightly coupled to one provider. Initial device interest includes COROS, with Apple Watch, Garmin, and WHOOP as future targets.

## 13. Preserve progression while introducing occasional novelty

Repeated exposure is necessary for measurable strength and skill progression, but a long plan should not become mechanically identical forever.

Default rule: when training is reasonably stable, introduce **about one new exercise or movement variation every 6–8 weeks**. The intent is exploration and renewed engagement, not program hopping.

Rules:

- Do not replace several core lifts at once.
- Keep goal-critical movements stable long enough to evaluate progress.
- Prefer introducing one low-risk accessory, core movement, machine, cable movement, or variation at a time.
- A new movement can replace a similar accessory or occupy a small exploratory slot rather than simply adding more volume.
- Do not force novelty during disrupted travel/re-entry weeks or when the user is still struggling to establish the existing routine.
- If the user strongly likes or dislikes a new movement, that feedback should influence future exercise selection.

The planner should optimize for both **progression and curiosity**.

## 14. Physical limitations should be first-class planning context

A workout can be partial for legitimate physical reasons: cramping, grip fatigue, joint pain, an irritated area, unexpected soreness, or another limitation that appears during the session. This is especially likely during re-entry after time away from training.

The product should capture a lightweight signal such as `trainingLimited` plus an optional note rather than forcing the user to classify every event as an injury.

Rules:

- A limited or adapted session can still count as practicing/training; it should not automatically be classified as failure.
- The planner should distinguish `not attempted`, `stopped because life intervened`, and `stopped/modified because of a physical limitation` when that information is available.
- Do not automatically reschedule unfinished sets as debt.
- A limitation should affect the next relevant plan only when it is still relevant or meaningful.
- Repeated limitations involving the same movement/body area deserve more weight than one isolated event.
- The planner may reduce load/volume, swap an exercise, change grip/setup, choose a less demanding variation, or recommend recovery depending on context.
- Unilateral exercises should have explicit left/right logging metadata instead of assuming one reps value accurately represents both sides.

## 15. Exercise references should be reachable from the plan without cluttering Today

Mobility and exercise names can be unfamiliar even when the daily plan itself should remain compact. The preferred pattern is a dedicated **Exercises** reference library plus contextual deep links from Today.

Rules:

- Mobility chips on Today can deep-link to the relevant entry on `/exercises`.
- The full Exercises library should also be reachable from the hamburger menu.
- A broad/composite mobility item such as `Neck/upper back` can explain a short sequence, while specific movements within that sequence should have their own reference entries when useful.
- If a composite instruction mentions a movement that has its own entry, link the **movement words directly inside “How to do it”** rather than adding a separate “See related movements” block.
- Inline reference links should look like part of the prose: same text color in normal, visited, hover, and active states; underline; about `font-weight: 500`; no default browser blue/purple and no decorative arrow/icon.
- Reference-card hierarchy should keep the **body-area/category in the small eyebrow** (`HIP MOBILITY`, `NECK MOBILITY`) and the **actual movement/reference name as the large title** (`Hip 90/90`, `Neck/upper back`). Do not invert those roles.
- Broad tags should route to a useful specific reference or section rather than pretending every tag is a single exercise.
- Wrapped mobility chips need enough row spacing to remain clearly separated on mobile.

The exercise library is reference material, not another logging surface. It should answer “what is this and how do I do it?” without increasing daily input burden.

The central lesson is: **the LLM can generate a rich plan without making the user interact with a rich form every day.** The product should surface only what helps on that particular day.
