import { NextResponse } from 'next/server';
import { and, desc, eq, lt } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { exercises, workoutSessions, workoutSets } from '@/lib/db/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type IncomingSet = { weight: string; reps: string };
type IncomingExercise = { name: string; sets: IncomingSet[] };
type IncomingLog = { done: boolean; energy: number; protein: boolean; water: boolean; exercises: IncomingExercise[] };

const today = () => new Date().toISOString().slice(0, 10);

export async function GET() {
  const db = getDb();
  const date = today();
  const current = await db.query.workoutSessions.findFirst({ where: eq(workoutSessions.date, date) });
  let log = null;
  if (current) {
    const rows = await db.select({ exerciseName: exercises.name, setNumber: workoutSets.setNumber, weight: workoutSets.weight, reps: workoutSets.reps })
      .from(workoutSets).innerJoin(exercises, eq(workoutSets.exerciseId, exercises.id))
      .where(eq(workoutSets.sessionId, current.id)).orderBy(workoutSets.setNumber);
    log = { done: current.completed, energy: current.energy ?? 3, protein: current.proteinTarget ?? false, water: current.hydrationTarget ?? false, rows };
  }

  const previous = await db.select({ date: workoutSessions.date, exerciseName: exercises.name, setNumber: workoutSets.setNumber, weight: workoutSets.weight, reps: workoutSets.reps })
    .from(workoutSets).innerJoin(workoutSessions, eq(workoutSets.sessionId, workoutSessions.id)).innerJoin(exercises, eq(workoutSets.exerciseId, exercises.id))
    .where(and(lt(workoutSessions.date, date), eq(workoutSessions.completed, true))).orderBy(desc(workoutSessions.date), workoutSets.setNumber).limit(100);

  return NextResponse.json({ log, previous });
}

export async function PUT(request: Request) {
  const db = getDb();
  const body = await request.json() as IncomingLog;
  const date = today();
  const [session] = await db.insert(workoutSessions).values({ date, completed: body.done, energy: body.energy, proteinTarget: body.protein, hydrationTarget: body.water })
    .onConflictDoUpdate({ target: workoutSessions.date, set: { completed: body.done, energy: body.energy, proteinTarget: body.protein, hydrationTarget: body.water, updatedAt: new Date() } }).returning();

  await db.delete(workoutSets).where(eq(workoutSets.sessionId, session.id));
  for (const ex of body.exercises) {
    const [exercise] = await db.insert(exercises).values({ name: ex.name }).onConflictDoUpdate({ target: exercises.name, set: { name: ex.name } }).returning();
    const sets = ex.sets.filter(s => s.weight || s.reps).map((s, i) => ({ sessionId: session.id, exerciseId: exercise.id, setNumber: i + 1, weight: s.weight || null, reps: s.reps ? Number(s.reps) : null }));
    if (sets.length) await db.insert(workoutSets).values(sets);
  }
  return NextResponse.json({ ok: true, sessionId: session.id });
}
