ALTER TABLE "daily_checkins" ADD COLUMN "wake_630_met" boolean;
ALTER TABLE "daily_checkins" ADD COLUMN "training_done" boolean;
ALTER TABLE "daily_checkins" ADD COLUMN "mobility_done" boolean;
ALTER TABLE "daily_checkins" ADD COLUMN "practice_sideways" boolean DEFAULT false NOT NULL;
