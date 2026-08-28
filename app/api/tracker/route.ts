import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { cardioSessions, dailyCheckins, mobilitySessions, progressMetrics } from '@/lib/db/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const today=()=>new Date().toISOString().slice(0,10);

export async function GET(){
  try{
    const db=getDb();
    const date=today();
    const [checkin]=await db.select().from(dailyCheckins).where(eq(dailyCheckins.checkinDate,date)).limit(1);
    const cardio=await db.select().from(cardioSessions).orderBy(desc(cardioSessions.performedOn),desc(cardioSessions.id)).limit(12);
    const mobility=await db.select().from(mobilitySessions).orderBy(desc(mobilitySessions.performedOn),desc(mobilitySessions.id)).limit(12);
    const progress=await db.select().from(progressMetrics).orderBy(desc(progressMetrics.measuredOn),desc(progressMetrics.id)).limit(12);
    return NextResponse.json({checkin:checkin??null,cardio,mobility,progress});
  }catch(error){
    console.error('GET /api/tracker failed',error);
    return NextResponse.json({error:error instanceof Error?error.message:'Unable to load tracker data'},{status:500});
  }
}

export async function POST(request:Request){
  try{
    const db=getDb();
    const body=await request.json();
    const date=today();
    if(body.type==='checkin'){
      const [row]=await db.insert(dailyCheckins).values({checkinDate:date,proteinTargetMet:body.protein??null,calorieRangeMet:body.calories??null,hydrationTargetMet:body.hydration??null,energy:body.energy??null,sleepHours:body.sleepHours?String(body.sleepHours):null,notes:body.notes||null})
        .onConflictDoUpdate({target:dailyCheckins.checkinDate,set:{proteinTargetMet:body.protein??null,calorieRangeMet:body.calories??null,hydrationTargetMet:body.hydration??null,energy:body.energy??null,sleepHours:body.sleepHours?String(body.sleepHours):null,notes:body.notes||null}}).returning();
      return NextResponse.json({ok:true,row});
    }
    if(body.type==='cardio'){
      const [row]=await db.insert(cardioSessions).values({performedOn:date,activity:body.activity||'Run / walk',durationMinutes:body.durationMinutes?Number(body.durationMinutes):null,runMinutes:body.runMinutes?Number(body.runMinutes):null,distanceMiles:body.distanceMiles?String(body.distanceMiles):null,paceSecondsPerMile:body.paceSecondsPerMile?Number(body.paceSecondsPerMile):null,painDuring:body.painDuring!=null?Number(body.painDuring):null,painAfter:body.painAfter!=null?Number(body.painAfter):null,nextDayPain:body.nextDayPain!=null?Number(body.nextDayPain):null,notes:body.notes||null}).returning();
      return NextResponse.json({ok:true,row});
    }
    if(body.type==='mobility'){
      const [row]=await db.insert(mobilitySessions).values({performedOn:date,hip:!!body.hip,ankleCalf:!!body.ankleCalf,neckUpperBack:!!body.neckUpperBack,splitPractice:!!body.splitPractice,minutes:body.minutes?Number(body.minutes):null,stiffness:body.stiffness!=null?Number(body.stiffness):null,notes:body.notes||null}).returning();
      return NextResponse.json({ok:true,row});
    }
    if(body.type==='progress'){
      const [row]=await db.insert(progressMetrics).values({measuredOn:date,weightLb:body.weightLb?String(body.weightLb):null,waistIn:body.waistIn?String(body.waistIn):null,pushups:body.pushups!=null?Number(body.pushups):null,pullupAssistanceLb:body.pullupAssistanceLb?String(body.pullupAssistanceLb):null,pullups:body.pullups!=null?Number(body.pullups):null,mileSeconds:body.mileSeconds?Number(body.mileSeconds):null,splitDistanceIn:body.splitDistanceIn?String(body.splitDistanceIn):null,notes:body.notes||null}).returning();
      return NextResponse.json({ok:true,row});
    }
    return NextResponse.json({error:'Unknown tracker event type'},{status:400});
  }catch(error){
    console.error('POST /api/tracker failed',error);
    return NextResponse.json({error:error instanceof Error?error.message:'Unable to save tracker data'},{status:500});
  }
}
