import { integer, numeric, pgTable, serial, text, timestamp, date, boolean, uniqueIndex } from "drizzle-orm/pg-core";

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull().default("strength"),
  unit: text("unit").notNull().default("lb"),
  notes: text("notes"),
});

export const workoutSessions = pgTable("workout_sessions", {
  id: serial("id").primaryKey(),
  date: date("performed_on").notNull().unique(),
  sessionType: text("session_type").notNull().default("upper-skills"),
  completed: boolean("completed").notNull().default(false),
  energy: integer("energy"),
  proteinTarget: boolean("protein_target_met"),
  hydrationTarget: boolean("hydration_target_met"),
  limited: boolean("limited").notNull().default(false),
  limitationNotes: text("limitation_notes"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const workoutSets = pgTable("exercise_sets", {
  id: serial("id").primaryKey(),
  sessionId: integer("workout_session_id").notNull().references(() => workoutSessions.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id").notNull().references(() => exercises.id),
  setNumber: integer("set_number").notNull(),
  reps: integer("reps"),
  leftReps: integer("left_reps"),
  rightReps: integer("right_reps"),
  weight: text("weight"),
  rpe: numeric("rpe", { precision: 3, scale: 1 }),
  variation: text("variation"),
  notes: text("notes"),
}, t => ({ sessionExerciseSet: uniqueIndex("exercise_sets_session_exercise_set_idx").on(t.sessionId, t.exerciseId, t.setNumber) }));

export const cardioSessions = pgTable("cardio_sessions", { id: serial("id").primaryKey(), performedOn: date("performed_on").notNull(), activity: text("activity").notNull(), durationMinutes: integer("duration_minutes"), runMinutes: integer("run_minutes"), distanceMiles: numeric("distance_miles", { precision: 6, scale: 2 }), paceSecondsPerMile: integer("pace_seconds_per_mile"), painDuring: integer("pain_during"), painAfter: integer("pain_after"), nextDayPain: integer("next_day_pain"), notes: text("notes"), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow() });
export const mobilitySessions = pgTable("mobility_sessions", { id: serial("id").primaryKey(), performedOn: date("performed_on").notNull(), hip: boolean("hip").notNull().default(false), ankleCalf: boolean("ankle_calf").notNull().default(false), neckUpperBack: boolean("neck_upper_back").notNull().default(false), splitPractice: boolean("split_practice").notNull().default(false), minutes: integer("minutes"), stiffness: integer("stiffness"), notes: text("notes") });
export const dailyCheckins = pgTable("daily_checkins", {
  id: serial("id").primaryKey(),
  checkinDate: date("checkin_date").notNull().unique(),
  wake630Met: boolean("wake_630_met"),
  trainingDone: boolean("training_done"),
  mobilityDone: boolean("mobility_done"),
  practiceSideways: boolean("practice_sideways").notNull().default(false),
  proteinTargetMet: boolean("protein_target_met"),
  calorieRangeMet: boolean("calorie_range_met"),
  hydrationTargetMet: boolean("hydration_target_met"),
  energy: integer("energy"),
  sleepHours: numeric("sleep_hours", { precision: 4, scale: 1 }),
  notes: text("notes")
});
export const progressMetrics = pgTable("progress_metrics", { id: serial("id").primaryKey(), measuredOn: date("measured_on").notNull(), weightLb: numeric("weight_lb", { precision: 5, scale: 1 }), waistIn: numeric("waist_in", { precision: 5, scale: 2 }), pushups: integer("pushups"), pullupAssistanceLb: numeric("pullup_assistance_lb", { precision: 6, scale: 1 }), pullups: integer("pullups"), mileSeconds: integer("mile_seconds"), splitDistanceIn: numeric("split_distance_in", { precision: 5, scale: 2 }), notes: text("notes") });
export const trainingBlocks = pgTable("training_blocks", { id: serial("id").primaryKey(), name: text("name").notNull(), startsOn: date("starts_on").notNull(), endsOn: date("ends_on").notNull(), focus: text("focus").notNull(), notes: text("notes") });
