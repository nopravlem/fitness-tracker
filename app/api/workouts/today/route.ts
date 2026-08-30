import { NextResponse } from 'next/server';
import { and, desc, eq, lt } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { exercises, workoutSessions, workoutSets } from '@/lib/db/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type IncomingSet = { weight: string; reps: string; leftReps?: string; rightReps?: string };
type IncomingExercise = { name: string; sets: IncomingSet[] };
type IncomingLog = { date?: string; done: boolean; energy: number; protein: boolean; water: boolean; limited?: boolean; limitationNotes?: string; sessionType?: string; exercises: IncomingExercise[] };

const utcToday = () => new Date().toISOString().slice(0, 10);
const queryDate=(request:Request)=>new URL(request.url).searchParams.get('date')||utcToday();

async function loadSession(date:string){
  const db=getDb();
  const current=await db.query.workoutSessions.findFirst({where:eq(workoutSessions.date,date)});
  if(!current)return null;
  const rows=await db.select({exerciseName:exercises.name,setNumber:workoutSets.setNumber,weight:workoutSets.weight,reps:workoutSets.reps,leftReps:workoutSets.leftReps,rightReps:workoutSets.rightReps})
    .from(workoutSets).innerJoin(exercises,eq(workoutSets.exerciseId,exercises.id))
    .where(eq(workoutSets.sessionId,current.id)).orderBy(workoutSets.setNumber);
  return {id:current.id,date:current.date,done:current.completed,energy:current.energy??3,protein:current.proteinTarget??false,water:current.hydrationTarget??false,limited:current.limited,limitationNotes:current.limitationNotes??'',sessionType:current.sessionType,rows};
}

export async function GET(request:Request) {
  try {
    const db = getDb();
    const url=new URL(request.url);
    if(url.searchParams.get('history')==='1'){
      const sessions=await db.select({id:workoutSessions.id,date:workoutSessions.date,sessionType:workoutSessions.sessionType,completed:workoutSessions.completed,energy:workoutSessions.energy,limited:workoutSessions.limited,limitationNotes:workoutSessions.limitationNotes,updatedAt:workoutSessions.updatedAt})
        .from(workoutSessions).orderBy(desc(workoutSessions.date)).limit(100);
      return NextResponse.json({sessions,count:sessions.length});
    }
    const date=queryDate(request);
    const log=await loadSession(date);
    const previous = await db.select({ date: workoutSessions.date, exerciseName: exercises.name, setNumber: workoutSets.setNumber, weight: workoutSets.weight, reps: workoutSets.reps })
      .from(workoutSets).innerJoin(workoutSessions, eq(workoutSets.sessionId, workoutSessions.id)).innerJoin(exercises, eq(workoutSets.exerciseId, exercises.id))
      .where(and(lt(workoutSessions.date, date), eq(workoutSessions.completed, true))).orderBy(desc(workoutSessions.date), workoutSets.setNumber).limit(200);
    return NextResponse.json({ log, previous });
  } catch (error) {
    console.error('GET /api/workouts/today failed', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load workout' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const db = getDb();
    const body = await request.json() as IncomingLog;
    const date = body.date || utcToday();
    const sessionType = body.sessionType || 'general';
    const [session] = await db.insert(workoutSessions).values({ date, sessionType, completed: body.done, energy: body.energy, proteinTarget: body.protein, hydrationTarget: body.water, limited:!!body.limited, limitationNotes:body.limitationNotes||null })
      .onConflictDoUpdate({ target: workoutSessions.date, set: { sessionType, completed: body.done, energy: body.energy, proteinTarget: body.protein, hydrationTarget: body.water, limited:!!body.limited, limitationNotes:body.limitationNotes||null, updatedAt: new Date() } }).returning();

    await db.delete(workoutSets).where(eq(workoutSets.sessionId, session.id));
    for (const ex of body.exercises) {
      const [exercise] = await db.insert(exercises).values({ name: ex.name }).onConflictDoUpdate({ target: exercises.name, set: { name: ex.name } }).returning();
      const sets = ex.sets.map((s, i) => ({ sessionId: session.id, exerciseId: exercise.id, setNumber: i + 1, weight: s.weight || null, reps: s.reps ? Number(s.reps) : null, leftReps:s.leftReps?Number(s.leftReps):null, rightReps:s.rightReps?Number(s.rightReps):null }))
        .filter(s => s.weight || s.reps !== null || s.leftReps !== null || s.rightReps !== null);
      if (sets.length) await db.insert(workoutSets).values(sets);
    }
    return NextResponse.json({ ok: true, sessionId: session.id, date });
  } catch (error) {
    console.error('PUT /api/workouts/today failed', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to save workout' }, { status: 500 });
  }
}

export async function DELETE(request:Request){
  try{
    const db=getDb();const date=queryDate(request);
    const [row]=await db.delete(workoutSessions).where(eq(workoutSessions.date,date)).returning({id:workoutSessions.id,date:workoutSessions.date});
    if(!row)return NextResponse.json({error:'Workout not found'},{status:404});
    return NextResponse.json({ok:true,...row});
  }catch(error){
    console.error('DELETE /api/workouts/today failed',error);
    return NextResponse.json({error:error instanceof Error?error.message:'Unable to delete workout'},{status:500});
  }
}
