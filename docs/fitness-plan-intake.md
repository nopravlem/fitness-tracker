# Fitness Plan Intake + Generation Spec

This document captures the information used to create the original fitness plan in this repository and turns it into a reusable intake/generation spec for a future LLM-powered planner.

The goal is not to generate a generic workout template. The goal is to create a plan that behaves like the one built here: specific to the user's goals, training history, schedule, food habits, constraints, travel, injuries, preferences, current ability, and available equipment/classes.

This file should evolve over time as we learn which inputs materially improve plan quality.

---

## 1. Plan duration

Offer explicit planning horizons:

- 12 weeks
- 6 months
- 1 year

The selected horizon changes periodization depth, number of reassessment points, and how long-term goals are staged.

The original plan in this repository is a **6-month plan**.

---

## 2. Goal intake

### Appearance / body composition

Collect:

- Fat loss, muscle gain, recomp, maintenance, or performance-first
- Whether appearance is primary, secondary, or not important
- Specific visual changes the user cares about
- Historical body weight/body composition where they felt best
- Whether target weight matters, is only a loose reference, or is irrelevant
- Deadline/event/vacation/wedding if any

Do not assume the user's lowest weight is the correct endpoint. A stronger, more muscular body at a slightly higher weight may be preferable.

### Specific fitness goals

Collect concrete abilities the user wants to develop, for example:

- Pull-ups
- Push-ups
- Mile time / running distance
- Squat / bench / deadlift numbers
- Mobility goals such as a split
- Sport-specific goals
- Hiking/endurance goals
- Core/back strength

For each goal, collect a baseline and target where possible.

### Fat loss / weight

Collect:

- Current weight
- Historical preferred weight
- Whether the scale matters to the user
- Desired rate of change if they care
- Whether they want calorie targets, loose guardrails, or no calorie tracking

---

## 3. Baseline body + performance data

### Body baseline

- Age
- Height
- Weight
- Optional waist measurement
- Optional other measurements
- Optional progress photos if supported

### Fitness baseline

For each important lift or goal, collect current ability:

- Bench press: load + reps
- Overhead press: load + reps
- Lat pulldown: load + reps
- Hip thrust: load + reps
- RDL: load + reps
- Pull-ups: unassisted reps or assistance amount
- Push-ups: floor reps or incline level
- Running: current distance, pace, or symptom-free duration
- Mobility: current split distance or qualitative range limitation

The planner should distinguish between:

- true beginner
- detrained former lifter
- intermediate lifter
- experienced athlete

A detrained former lifter should not be treated as a novice solely because current numbers are lower than historical numbers.

---

## 4. Injury and pain history

This should be a dedicated section, not a single optional notes field.

For every injury/pain area, collect:

- Body part
- Side
- Known diagnosis if any
- How it started
- Triggering movements
- Symptom-free movements
- How long symptoms last after aggravation
- Swelling, locking, catching, instability, numbness, weakness, or loss of function
- Prior PT/rehab recommendations
- Whether rehab-style exercises should be integrated into normal workouts

The planner should use this information to change exercise selection, progression speed, running volume, mobility work, and recovery days.

Do not repeatedly prescribe activity until pain occurs just to determine tolerance.

---

## 5. Current lifestyle and schedule

Collect:

- Typical working hours
- Commute time
- Office days
- WFH days
- Regular standing appointments/classes
- Gym location/access
- Typical sleep/wake schedule
- Weekday vs weekend availability
- Realistic number of hard training days
- Preferred workout duration
- Preferred workout time
- Typical baseline walking/activity
- Whether incidental walking is already high

Also collect known disruptions:

- PTO
- Vacations
- Work travel
- Weddings/events
- Holidays
- Family visits
- Long flights
- Expected high-stress work periods

The planner should create travel/recovery/deload blocks in advance instead of pretending the normal schedule will continue uninterrupted.

---

## 6. Current training setup

Collect:

- Gym membership / home gym / no gym
- Available equipment
- Classes or memberships already being paid for
- Preferred exercises
- Exercises the user dislikes
- Exercises that are inconvenient due to setup
- Previous training style
- Historical training consistency
- Understanding of progressive overload
- How much logging/tracking they are willing to do

Reuse exercises the user likes when those exercises support the goal. Adherence matters.

Do not add random volume merely to make a plan look comprehensive.

---

## 7. Diet, food, and cooking habits

The planner should understand how the user actually eats rather than assuming meal prep.

### Current diet

Collect:

- Typical breakfast
- Typical lunch
- Typical dinner
- Snacks
- Takeout / restaurant frequency
- Office-provided food
- Alcohol frequency and typical drinks per outing
- Protein intake estimate if known
- Whether calories are currently tracked

### Cooking behavior

Collect:

- Likes cooking / tolerates cooking / hates cooking
- Grocery-shopping tolerance
- Meal-prep tolerance
- Comfort handling raw meat
- Kitchen access
- Time available for cooking
- Food-safety anxiety or other practical barriers

### Food likes / dislikes / cuisine

Collect explicit dislikes and do not repeatedly recommend them.

Also collect:

- Favorite proteins
- Favorite carbs
- Favorite fruits/vegetables
- Favorite cuisines
- Common restaurant orders
- Foods the user reliably eats when stressed
- Convenient protein products/snacks they like

The nutrition plan should be allowed to use takeout, office lunches, convenience food, microwave food, fully cooked proteins, protein shakes, restaurants, or grocery delivery when that is more sustainable than meal prep.

---

## 8. Stress, decision fatigue, and adherence constraints

Ask what usually causes previous plans to fail.

Examples:

- Work stress
- Decision fatigue
- Too much meal planning
- Too many workouts
- Workouts that are too long
- All-or-nothing thinking
- Travel
- Sleep
- Boredom
- Pain flares
- Forgetting to log

Every generated plan should include a **minimum viable week** for stressful periods.

Missed sessions should not automatically create doubled-up make-up sessions.

---

## 9. Reference intake used to create the current plan

This is the concrete example future planning behavior should mimic.

### Body / timeline

- Age: 31
- Height: 5'0.75"
- Current weight: about 124 lb
- Historical preferred weight: around 115 lb
- Scale importance: low; appearance and performance matter more
- No hard deadline
- Preference: sustainable long-term system rather than aggressive cut

### Appearance / body composition goals

- Lose body fat while maintaining/regaining/building muscle
- Previously became visibly fitter from lifting but still felt there was general overlying fat
- Do not imply lifting alone reduces body fat; energy deficit is still required

### Performance goals

- 1 unassisted pull-up
- 10 consecutive floor push-ups
- Eventually run an 8-minute mile
- Eventually do a split
- Improve aerobic conditioning
- Improve mobility, especially hips, knees, and neck
- Train abs and back intentionally
- Improve capability/performance, not just aesthetics

### Training history

- Lifted consistently about 5x/week from 2021–2024
- Used progressive overload
- Then stopped and became detrained
- Not a novice
- Likes a clear program with measurable progression

### Current / recent strength references

- Bench press: standard 45-lb bar, usually 3–5 reps
- 21s: 20-lb bar; prefers 5 bottom-half + 5 top-half + 5 full reps
- DB overhead press: 17.5 lb per hand
- Lat pulldown: historically around 110 lb; current estimate around 70 lb
- Hip thrust: historical/current-ish reference around 100 lb, but recalibrate
- Single-leg RDL: around 15–20 lb
- Floor push-ups: 0
- Pull-ups: 0

### Exercise preferences

Likes:

- Bench press
- 21s
- DB overhead press
- Lat pulldown
- Hip thrusts
- RDLs

Constraints:

- Hip thrust/RDL setup can be annoying
- Easier substitutions/setup are acceptable
- Wants more abs, back, and cardio

### Left knee history

- Runner's-knee-type issue; exact diagnosis unknown
- Began during the descent from Kilimanjaro
- Walking hurt for weeks afterward, then resolved
- Daily walking is generally fine now
- Pain returns after running around 1 mile or with sprints/speed work
- Pain feels like a hammer hit to the kneecap, mainly under/behind the kneecap and around the upper edge, with some pain below
- Lifelong tendency to hyperextend/hyperlock knees

Programming implications used:

- Do not repeatedly run until pain appears
- No sprinting initially
- Build below symptom threshold
- Run/walk → continuous easy mile → longer easy running → speed later
- Strengthen quads, glutes, hamstrings, calves, and single-leg control
- Avoid snapping into hyperextension
- Knee mobility should emphasize control rather than extra passive flexibility
- Integrate useful rehab/PT-style exercises into normal gym work rather than creating a separate rehab program

### Neck / desk-work issues

- Tech-neck-type discomfort after work
- Certain directions of movement can hurt after a workday
- Useful movements: chin tucks, thoracic rotation/open books, scapular retraction, thoracic extension
- Avoid aggressive neck stretching/cracking
- Short workday movement breaks are useful

### Mobility goals

- Hips
- Knee control
- Neck/upper back
- Ankles/calves
- Full split long term

Split work:

- Hamstrings
- Hip flexors
- Adductors
- Supported split positions
- Active range; no forcing

### Work / lifestyle

- Job hours: about 10am–6pm
- Commute: about 15 minutes
- Usually WFH Wednesday
- Lives in NYC and naturally walks a lot
- Normal NYC walking counts as baseline activity; no arbitrary extra step target needed
- Work stress contributed to reduced consistency and body-fat gain over the previous year

### Existing memberships

- Gym membership
- Solidcore membership: 4 classes/month

### Default weekly architecture

- Monday: Strength A + pull-up/push-up skills + abs + short mobility
- Tuesday: easy cardio + mobility
- Wednesday: Solidcore + optional mobility
- Thursday: Strength B + pull-up/push-up skills + abs
- Friday: recovery / normal walking + mobility
- Saturday: Strength C + running/cardio + split work
- Sunday: rest

Only about three days are intentionally hard.

Minimum viable bad-work-week version:

- 2 strength sessions
- Solidcore
- Normal walking

No doubling up to make up missed sessions.

### Running progression

- 2 min easy run / 2 min walk × 5
- 3 min run / 2 min walk × 5
- 5 min run / 2 min walk × 4
- 8 min run / 2 min walk
- 10 min run / 1 min walk
- Continuous easy mile
- Build easy distance before speed work

Progress only when the knee does not significantly flare during the session or the following day.

### Nutrition / cooking behavior

- Hates cooking
- Hates grocery shopping / meal planning
- Strongly dislikes meal prep
- Does not want to handle raw meat and worries about food safety
- Decision fatigue is a major reason for ordering fast food
- Core problem is executive-function load, not necessarily cravings

Useful food anchors:

- Fairlife protein drinks
- Chobani protein drinks
- Fruit
- Bagel/toast
- Greek yogurt
- Rice bowls
- Chicken
- Steak
- Salmon
- Tofu
- Sushi + edamame
- Mediterranean food
- Indian food

Explicit do-not-recommend foods:

- Turkey
- Shrimp
- Lamb

Office food:

- Free Forkable lunch on office days

Nutrition structure created from intake:

- Breakfast default: protein drink + fruit + bagel/toast
- Office lunch: Forkable meal with protein + carb + vegetable
- WFH lunch: Greek yogurt/fruit/granola + protein drink, microwave rice + fully cooked chicken + salad, or ordered chicken/steak/tofu bowl
- Emergency decision-fatigue option: protein drink + fruit, then a predetermined default order
- Dinner can be ordered; home cooking is not required
- Taco Bell can be included intentionally rather than treated as failure

Initial nutrition targets:

- About 1,600–1,700 calories/day average
- Around 90–105 g protein/day, roughly 100 g target
- Slow fat loss around 0.25–0.5 lb/week if comfortable
- Evaluate trend over about 4–6 weeks rather than reacting to daily scale changes

### Alcohol

- Typically 2–4 drinks when going out
- Plan should allow this rather than requiring abstinence
- Do not recommend starving beforehand
- Resume normal eating afterward rather than compensatory restriction

### Known events / recovery blocks

- Friend's wedding: Sep 4, 2026
- Sep 1–4 WFH
- Staycation/PTO around Sep 7
- India: Oct 25 to around Nov 7
- Thanksgiving deload: Nov 23–29
- Holiday recovery: Dec 20–Jan 2
- Jan 3 onward rebuild

These events were incorporated directly into the six-month periodization.

---

## 10. Plan-generation rules

### A. Use specificity, not generic fitness advice

If the user wants a pull-up, train pull-ups directly.

If the user wants push-ups, program push-up progression directly.

If the user wants an 8-minute mile, build an aerobic/running progression rather than assuming strength work will transfer automatically.

If the user wants a split, include actual split practice.

### B. Respect training history

A detrained former lifter should generally use conservative re-entry loads while still benefiting from prior experience and motor familiarity.

### C. Use exercise-specific progressive overload

Examples from the original plan:

- Bench: build clean reps before adding weight
- Lat pulldown / OHP: add reps within range before load
- 21s: 5-5-5 → 6-6-6 → 7-7-7 → then load
- Assisted pull-up: reduce assistance after reps are strong at the top of the range
- Push-up progression: lower incline after 3 strong sets at the current level
- Running: increase continuous easy running before adding speed

### D. Program recovery deliberately

Include recovery days and travel/deload blocks.

Do not turn vacations, PTO, or stressful weeks into bootcamps.

### E. Minimize nutrition friction

If the user hates cooking, do not prescribe weekly meal prep as the core strategy.

Build defaults around foods, restaurants, office lunches, convenience foods, prepared proteins, or protein drinks they will actually use.

### F. Track meaningful performance metrics

Examples:

- Push-up reps
- Pull-up assistance / reps
- Bench performance
- Lat pulldown performance
- Run distance/pace
- Knee response
- Split progress
- Optional weight/waist

### G. Make the plan calendar-aware

The plan should know the date and return the correct session for that day.

Trips, weddings, holidays, classes, PTO, or recovery weeks should override the default weekly template.

### H. Always provide a minimum viable week

Every generated plan should specify what to do when life is awful for a week.

The minimum should preserve momentum without making the user feel they failed the program.

---

## 11. Recommended LLM intake schema

```ts
interface FitnessPlanIntake {
  planDuration: '12_weeks' | '6_months' | '1_year';

  demographics: {
    age?: number;
    height?: string;
    weight?: number;
    optionalMeasurements?: Record<string, number>;
  };

  goals: {
    appearance?: string[];
    bodyComposition?: 'fat_loss' | 'muscle_gain' | 'recomp' | 'maintenance';
    targetWeight?: number;
    historicalPreferredWeight?: number;
    performance: Array<{
      goal: string;
      baseline?: string;
      target?: string;
    }>;
    deadline?: string;
  };

  trainingHistory: {
    experienceLevel?: string;
    previousRoutine?: string;
    yearsTraining?: number;
    currentConsistency?: string;
    preferredExercises?: string[];
    dislikedExercises?: string[];
    currentLifts?: Record<string, string>;
  };

  injuries: Array<{
    area: string;
    side?: string;
    diagnosis?: string;
    onset?: string;
    triggers?: string[];
    symptomFreeActivities?: string[];
    symptoms?: string;
    rehabHistory?: string;
    notes?: string;
  }>;

  lifestyle: {
    workHours?: string;
    commute?: string;
    officeDays?: string[];
    wfhDays?: string[];
    baselineActivity?: string;
    preferredTrainingTimes?: string[];
    availableDays?: string[];
    maxHardDays?: number;
    preferredWorkoutDuration?: string;
  };

  equipment: {
    gym?: boolean;
    homeEquipment?: string[];
    classes?: string[];
    memberships?: string[];
  };

  nutrition: {
    calorieTrackingPreference?: string;
    typicalMeals?: Record<string, string>;
    proteinEstimate?: string;
    cookingTolerance?: string;
    groceryTolerance?: string;
    mealPrepTolerance?: string;
    rawMeatComfort?: string;
    foodLikes?: string[];
    foodDislikes?: string[];
    favoriteCuisines?: string[];
    defaultRestaurantsOrOrders?: string[];
    alcohol?: string;
    officeFood?: string;
  };

  adherence: {
    majorBarriers?: string[];
    stressLevel?: string;
    decisionFatigue?: boolean;
    minimumWeekPreference?: string;
  };

  calendar: Array<{
    start: string;
    end?: string;
    type: 'travel' | 'holiday' | 'event' | 'pto' | 'work_stress' | 'other';
    description: string;
  }>;
}
```

This is a starting point, not necessarily the final product schema.

---

## 12. Recommended generated-plan output

The LLM should produce structured output that can be stored and rendered by the app, not only prose.

At minimum:

- Plan start/end dates
- Training blocks/phases
- Weekly template
- Date-specific overrides
- Strength workouts with exercises, sets, rep ranges, notes, starting references, and progression rules
- Cardio progression
- Injury-aware constraints
- Mobility plan
- Nutrition targets/guardrails
- Meal/default-food strategy
- Minimum viable week
- Travel/holiday rules
- Metrics to track
- Reassessment dates

The app should persist actual performance separately and allow the LLM to revise future targets using completed-session data.

---

## 13. Future adaptive-planning behavior

Eventually, the LLM should use both the original intake and live tracker history.

Examples:

- Pull-up assistance stalls for 4 weeks → adjust volume or progression
- Knee pain increases during the current run stage → regress or change conditioning mode
- User regularly skips one weekday → redesign the weekly structure instead of nagging
- Protein target is rarely hit → lower friction in food defaults
- Bench reps are consistently above target range → advance load
- Travel dates change → regenerate only affected calendar blocks
- Goals change → preserve history while revising future programming

The planner should treat the plan as a living program, not a static PDF.
