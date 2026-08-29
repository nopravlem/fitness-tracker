'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { blockForDate, localDateKey, planForDate, PROGRAM_START } from '@/lib/program';

type SetLog={weight:string;reps:string};
type Exercise={name:string;target:string;note?:string;sets:SetLog[]};
type DayLog={done:boolean;energy:number;protein:boolean;water:boolean;sessionType:string;exercises:Exercise[]};
type PreviousRow={date:string;exerciseName:string;setNumber:number;weight:string|null;reps:number|null};
type ProgressRow={measuredOn:string};

function buildExercises():Exercise[]{const p=planForDate();return (p.exercises||[]).map(ex=>({name:ex.name,target:ex.target,note:ex.note,sets:Array.from({length:ex.sets},()=>({weight:ex.defaultWeight||'',reps:''}))}))}
function freshLog():DayLog{const p=planForDate();return{done:false,energy:3,protein:false,water:false,sessionType:p.key,exercises:buildExercises()}}
function suggestion(ex:Exercise,rows:PreviousRow[]){const dates=Array.from(new Set(rows.filter(r=>r.exerciseName===ex.name).map(r=>r.date)));if(!dates.length)return 'First logged session — establish a clean baseline.';const last=rows.filter(r=>r.exerciseName===ex.name&&r.date===dates[0]);const reps:number[]=last.map(r=>r.reps??0);const weight=last[0]?.weight||'same load';const total=reps.reduce((a,b)=>a+b,0);if(ex.name==='Assisted Pull-ups')return `Last: ${weight} assist · ${reps.join('/')} reps. Add clean reps; reduce assistance only after the top of the range.`;if(ex.name==='Push-up Progression')return `Last: ${reps.join('/')} reps. Beat ${total} clean total reps, then lower the incline.`;if(ex.name==='Bench Press')return `Last: ${weight} · ${reps.join('/')} reps. Add clean reps before load.`;if(ex.name==='21s')return `Last: ${weight}. Progress 5-5-5 → 6-6-6 → 7-7-7, then add load.`;return `Last: ${weight} · ${reps.join('/')} reps. Add reps within the target range before load.`}

function foodPlanForDate(d=new Date()){
  const key=localDateKey(d);const day=d.getDay();const sepWfh=key>='2026-09-01'&&key<='2026-09-04';const office=[1,2,4,5].includes(day)&&!sepWfh;
  return {
    breakfast:'Protein drink + fruit + bagel or toast',
    lunch:office?'Forkable: choose a meal with a clear protein + carb + vegetable. No optimizing beyond that.':'Choose one: Greek yogurt + fruit + granola + protein drink; microwave rice + fully cooked chicken + bagged salad; or order a chicken, steak, or tofu bowl.',
    dinner:'Pick one default: chicken/rice/veg, Mediterranean chicken + rice/pita/salad/hummus, sushi + edamame, Indian chicken + rice + veg, steak + potato/rice + veg, salmon + rice + veg, or tofu + rice + veg.',
    emergency:'Too tired to decide: protein drink + fruit now, then order one of the defaults above. Taco Bell is allowed on purpose — it is not a failed day.',
    note:'Aim roughly for 1,600–1,700 calories on average and ~100g protein. You do not need to log every meal here.'
  };
}

export default function Home(){
  const todayPlan=useMemo(()=>planForDate(),[]);const todayKey=useMemo(()=>localDateKey(),[]);const block=useMemo(()=>blockForDate(todayKey),[todayKey]);const food=useMemo(()=>foodPlanForDate(),[]);
  const projectDay=useMemo(()=>{const [sy,sm,sd]=PROGRAM_START.split('-').map(Number);const now=new Date();const diff=Math.floor((Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())-Date.UTC(sy,sm-1,sd))/86400000);return Math.max(1,diff+1)},[]);
  const[log,setLog]=useState<DayLog>(freshLog());const[previous,setPrevious]=useState<PreviousRow[]>([]);const[saving,setSaving]=useState(false);const[loaded,setLoaded]=useState(false);const[dbError,setDbError]=useState<string|null>(null);const[saved,setSaved]=useState(false);const[notice,setNotice]=useState<string|null>(null);const[progressRows,setProgressRows]=useState<ProgressRow[]>([]);const[menuOpen,setMenuOpen]=useState(false);
  const[cardio,setCardio]=useState({activity:'Run / walk',durationMinutes:'',distanceMiles:'',painDuring:'0',painAfter:'0',nextDayPain:'0',notes:''});
  const[progress,setProgress]=useState({weightLb:'',waistIn:'',pushups:'',pullupAssistanceLb:'',pullups:'',mileSeconds:'',splitDistanceIn:'',notes:''});

  useEffect(()=>{document.body.classList.toggle('menuOpen',menuOpen);return()=>document.body.classList.remove('menuOpen')},[menuOpen]);
  useEffect(()=>{Promise.all([
    fetch('/api/workouts/today').then(async r=>{if(!r.ok){const j=await r.json().catch(()=>null);throw new Error(j?.error||`Workout load failed (${r.status})`)}return r.json()}),
    fetch('/api/tracker').then(async r=>{if(!r.ok){const j=await r.json().catch(()=>null);throw new Error(j?.error||`Tracker load failed (${r.status})`)}return r.json()})
  ]).then(([workoutData,trackerData])=>{setPrevious(workoutData.previous||[]);setProgressRows(trackerData.progress||[]);if(workoutData.log){const next=freshLog();next.done=workoutData.log.done;next.energy=workoutData.log.energy;for(const row of workoutData.log.rows){const ex=next.exercises.find(e=>e.name===row.exerciseName);if(ex&&ex.sets[row.setNumber-1])ex.sets[row.setNumber-1]={weight:row.weight||'',reps:row.reps?.toString()||''}}setLog(next);setSaved(next.done)}setDbError(null);setLoaded(true)}).catch(e=>{setDbError(e instanceof Error?e.message:'Unable to sync with database');setLoaded(true)});},[]);

  const monthlyCheckinDue=useMemo(()=>{if(!progressRows.length)return true;const last=new Date(`${progressRows[0].measuredOn}T00:00:00`);const today=new Date(`${todayKey}T00:00:00`);return today.getTime()-last.getTime()>=28*86400000},[progressRows,todayKey]);
  const showRunLog=todayPlan.kind==='cardio'||Boolean(todayPlan.cardio);

  async function saveWorkout(next=log){setSaving(true);setDbError(null);try{const r=await fetch('/api/workouts/today',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(next)});if(!r.ok){const j=await r.json().catch(()=>null);throw new Error(j?.error||`Save failed (${r.status})`)}setSaved(true);setNotice('Workout saved')}catch(e){setSaved(false);setDbError(e instanceof Error?e.message:'Unable to save workout')}finally{setSaving(false)}}
  async function saveTracker(payload:any,message:string){setNotice(null);setDbError(null);const r=await fetch('/api/tracker',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});if(!r.ok){const j=await r.json().catch(()=>null);setDbError(j?.error||`Save failed (${r.status})`);return}setNotice(message);const fresh=await fetch('/api/tracker').then(x=>x.json());setProgressRows(fresh.progress||[])}
  function editSet(ei:number,si:number,field:keyof SetLog,value:string){setSaved(false);setLog(p=>{const n=structuredClone(p);n.exercises[ei].sets[si][field]=value;return n})}

  return <main className="shell">
    <header className="appHeader"><div><p className="eyebrow">SIX MONTH PRACTICE</p><h1>Sadhana</h1><span className="dayPill">Day {projectDay}</span>{block&&<p className="subtle">{block.name} · {block.focus}</p>}</div><button className={`menuButton ${menuOpen?'open':''}`} aria-label={menuOpen?'Close menu':'Open menu'} aria-expanded={menuOpen} onClick={()=>setMenuOpen(v=>!v)}><span/><span/><span/></button></header>

    <div className={`mobileMenu ${menuOpen?'open':''}`} aria-hidden={!menuOpen}>
      <div className="mobileMenuInner"><p className="eyebrow">MENU</p><Link href="/progress" onClick={()=>setMenuOpen(false)}>Progress <span>→</span></Link><Link href="/about" onClick={()=>setMenuOpen(false)}>About <span>→</span></Link></div>
    </div>

    {dbError&&<section className="card errorCard"><p className="eyebrow">DATABASE SYNC ERROR</p><p>{dbError}</p></section>}{notice&&<section className="card successCard"><b>{notice}</b></section>}

    <section className="hero card"><p className="eyebrow">TODAY · {todayPlan.label.toUpperCase()}</p><h2>{todayPlan.description}</h2><p>{todayPlan.duration}{todayPlan.cardio?` · ${todayPlan.cardio}`:''}</p></section>

    <div className="sectionTitle"><h2>Food today</h2><span>Decisions already made</span></div>
    <section className="card foodPlan"><div><b>Breakfast</b><p>{food.breakfast}</p></div><div><b>Lunch</b><p>{food.lunch}</p></div><div><b>Dinner</b><p>{food.dinner}</p></div><div className="foodEmergency"><b>If work fried your brain</b><p>{food.emergency}</p></div><p className="note">{food.note}</p></section>

    {todayPlan.exercises&&<><div className="sectionTitle"><h2>Workout</h2><span>{loaded?todayPlan.duration:'Loading…'}</span></div>{log.exercises.map((ex,ei)=><section className="card exercise" key={ex.name}><div className="exerciseHead"><div><h3>{ex.name}</h3><p>{ex.target}</p></div><span>{ei+1}</span></div><p className="note"><b>Next target:</b> {suggestion(ex,previous)}</p>{ex.note&&<p className="subtle">{ex.note}</p>}<div className="setHeader"><span>SET</span><span>WEIGHT / ASSIST</span><span>REPS</span></div>{ex.sets.map((s,si)=><div className="setRow" key={si}><b>{si+1}</b><input value={s.weight} placeholder="—" onChange={e=>editSet(ei,si,'weight',e.target.value)}/><input inputMode="numeric" value={s.reps} placeholder="—" onChange={e=>editSet(ei,si,'reps',e.target.value)}/></div>)}</section>)}</>}
    {todayPlan.mobility&&<section className="card"><p className="eyebrow">MOBILITY</p><h3>Short, useful, repeatable.</h3><div className="chips">{todayPlan.mobility.map(x=><span key={x}>{x}</span>)}</div></section>}
    {todayPlan.exercises&&<><section className="card energy"><h3>How did the workout feel?</h3><div>{[1,2,3,4,5].map(n=><button key={n} className={log.energy===n?'active':''} onClick={()=>{setSaved(false);setLog({...log,energy:n})}}>{n}</button>)}</div><p>1 = could do more · 5 = wrecked</p></section><button className="finish" disabled={saving} onClick={()=>{const n={...log,done:true,sessionType:todayPlan.key};setLog(n);saveWorkout(n)}}>{saving?'Saving…':saved?'✓ Workout saved':'Finish & save workout'}</button></>}

    {showRunLog&&<section className="card contextualLog"><p className="eyebrow">AFTER CARDIO · OPTIONAL QUICK LOG</p><h2>How did the knee respond?</h2><div className="formGrid"><label>Minutes<input inputMode="numeric" value={cardio.durationMinutes} onChange={e=>setCardio({...cardio,durationMinutes:e.target.value})}/></label><label>Miles<input inputMode="decimal" value={cardio.distanceMiles} onChange={e=>setCardio({...cardio,distanceMiles:e.target.value})}/></label><label>Pain during 0–10<input inputMode="numeric" value={cardio.painDuring} onChange={e=>setCardio({...cardio,painDuring:e.target.value})}/></label><label>Pain after 0–10<input inputMode="numeric" value={cardio.painAfter} onChange={e=>setCardio({...cardio,painAfter:e.target.value})}/></label><label>Next-day pain 0–10<input inputMode="numeric" value={cardio.nextDayPain} onChange={e=>setCardio({...cardio,nextDayPain:e.target.value})}/></label></div><textarea placeholder="Optional trigger / note" value={cardio.notes} onChange={e=>setCardio({...cardio,notes:e.target.value})}/><button className="secondary" onClick={()=>saveTracker({type:'cardio',...cardio},'Knee response saved')}>Save knee response</button></section>}

    {monthlyCheckinDue&&<section className="card periodicCheckin"><p className="eyebrow">MONTHLY CHECK-IN</p><h2>This is occasional, not daily.</h2><p className="subtle">A quick snapshot for trend-level decisions. Weight and waist are optional.</p><div className="formGrid"><label>Weight (optional)<input inputMode="decimal" value={progress.weightLb} onChange={e=>setProgress({...progress,weightLb:e.target.value})}/></label><label>Waist (optional)<input inputMode="decimal" value={progress.waistIn} onChange={e=>setProgress({...progress,waistIn:e.target.value})}/></label><label>Floor push-ups<input inputMode="numeric" value={progress.pushups} onChange={e=>setProgress({...progress,pushups:e.target.value})}/></label><label>Pull-up assistance lb<input inputMode="decimal" value={progress.pullupAssistanceLb} onChange={e=>setProgress({...progress,pullupAssistanceLb:e.target.value})}/></label><label>Unassisted pull-ups<input inputMode="numeric" value={progress.pullups} onChange={e=>setProgress({...progress,pullups:e.target.value})}/></label><label>Mile seconds<input inputMode="numeric" value={progress.mileSeconds} onChange={e=>setProgress({...progress,mileSeconds:e.target.value})}/></label><label>Split distance in<input inputMode="decimal" value={progress.splitDistanceIn} onChange={e=>setProgress({...progress,splitDistanceIn:e.target.value})}/></label></div><textarea placeholder="Optional note" value={progress.notes} onChange={e=>setProgress({...progress,notes:e.target.value})}/><button className="secondary" onClick={()=>saveTracker({type:'progress',...progress},'Monthly check-in saved')}>Save monthly check-in</button></section>}

    <nav><Link className="active" href="/">Today</Link><Link href="/plan">Plan</Link></nav>
  </main>
}
