ALTER TABLE "workout_sessions" ADD COLUMN "limited" boolean DEFAULT false NOT NULL;
ALTER TABLE "workout_sessions" ADD COLUMN "limitation_notes" text;
ALTER TABLE "exercise_sets" ADD COLUMN "left_reps" integer;
ALTER TABLE "exercise_sets" ADD COLUMN "right_reps" integer;
