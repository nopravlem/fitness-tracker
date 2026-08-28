'use client';

import { useEffect, useMemo, useState } from 'react';

type SetLog = { weight: string; reps: string };
type Exercise = { name: string; target: string; note?: string; sets: SetLog[] };
type DayLog = { done: boolean; energy: number; protein: boolean; water: boolean; exercises: Exercise[] };

const workout: Exercise[] = [
  { name: 'Bench Press', target: '3 × 5', note: 'Start conservatively. Add weight only after clean reps.', sets: [{weight:'',reps:''},{weight:'',reps:''},{weight:'',reps:''}] },
  { name: 'Assisted Pull-ups', target: '4 × 5–8', note: 'Use the least assistance that keeps every rep controlled.', sets: [{weight:'',reps:''},{weight:'',reps:''},{weight:'',reps:''},{weight:'',reps:''}] },
  { name: 'Push-up Progression', target: '3 quality sets', note: 'Incline or floor — stop 1–2 reps before form breaks.', sets: [{weight:'BW',reps:''},{weight:'BW',reps:''},{weight:'BW',reps:''}] },
  { name: 'Seated Cable Row', target: '3 × 8–12', sets: [{weight:'',reps:''},{weight:'',reps:''},{weight:'',reps:''}] },
  { name: 'Dead Bug', target: '3 × 8 / side', sets: [{weight:'BW',reps:''},{weight:'BW',reps:''},{weight:'BW',reps:''}] },
];

const freshLog = (): DayLog => ({ done:false, energy:3, protein:false, water:false, exercises: JSON.parse(JSON.stringify(workout)) });

export default function Home() {
  const [tab, setTab] = useState<'today'|'plan'|'progress'>('today');
  const [log, setLog] = useState<DayLog>(freshLog());
  const key = useMemo(() => `fitness-${new Date().toISOString().slice(0,10)}`, []);

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) setLog(JSON.parse(saved));
  }, [key]);
  useEffect(() => { localStorage.setItem(key, JSON.stringify(log)); }, [key, log]);

  function editSet(exerciseIndex:number, setIndex:number, field:keyof SetLog, value:string) {
    setLog(prev => {
      const next = structuredClone(prev);
      next.exercises[exerciseIndex].sets[setIndex][field] = value;
      return next;
    });
  }

  return <main className="shell">
    <header>
      <div><p className="eyebrow">6 MONTH PROJECT</p><h1>Strong, capable, consistent.</h1></div>
      <div className="streak">Day 1</div>
    </header>

    {tab === 'today' && <>
      <section className="hero card">
        <p className="eyebrow">TODAY · UPPER + SKILLS</p>
        <h2>Build the things you actually want to be good at.</h2>
        <p>Strength + pull-up/push-up practice + core. Walking counts as your baseline activity.</p>
        <div className="checks">
          <button className={log.protein?'active':''} onClick={()=>setLog({...log,protein:!log.protein})}>✓ Protein target</button>
          <button className={log.water?'active':''} onClick={()=>setLog({...log,water:!log.water})}>✓ Hydration</button>
        </div>
      </section>

      <div className="sectionTitle"><h2>Workout</h2><span>45–60 min</span></div>
      {log.exercises.map((ex, ei) => <section className="card exercise" key={ex.name}>
        <div className="exerciseHead"><div><h3>{ex.name}</h3><p>{ex.target}</p></div><span>{ei+1}</span></div>
        {ex.note && <p className="note">{ex.note}</p>}
        <div className="setHeader"><span>SET</span><span>WEIGHT / ASSIST</span><span>REPS</span></div>
        {ex.sets.map((set, si) => <div className="setRow" key={si}>
          <b>{si+1}</b>
          <input aria-label={`${ex.name} set ${si+1} weight`} value={set.weight} placeholder="—" onChange={e=>editSet(ei,si,'weight',e.target.value)} />
          <input aria-label={`${ex.name} set ${si+1} reps`} inputMode="numeric" value={set.reps} placeholder="—" onChange={e=>editSet(ei,si,'reps',e.target.value)} />
        </div>)}
      </section>)}

      <section className="card energy"><h3>How did today feel?</h3><div>{[1,2,3,4,5].map(n=><button key={n} className={log.energy===n?'active':''} onClick={()=>setLog({...log,energy:n})}>{n}</button>)}</div><p>1 = wrecked · 5 = could do more</p></section>
      <button className="finish" onClick={()=>setLog({...log,done:!log.done})}>{log.done?'✓ Workout complete':'Finish workout'}</button>
    </>}

    {tab === 'plan' && <section className="card plan"><p className="eyebrow">WEEKLY RHYTHM</p><h2>Your training has a direction now.</h2>
      <p><b>Day A</b> · Upper strength + push-up/pull-up skills + core</p><p><b>Day B</b> · Lower strength + knee capacity + core</p><p><b>Day C</b> · Cardio + mobility</p><p><b>Day D</b> · Upper/back + skills + abs</p><p><b>Day E</b> · Lower/full body + conditioning</p>
      <hr/><p><b>Travel blocks</b></p><p>India · Oct 25 → ~Nov 8</p><p>Thanksgiving week · recovery/travel mode</p><p>Dec 20 → Jan 2 · home/holiday mode</p><p className="note">Travel weeks preserve momentum with walking, mobility, and short bodyweight sessions instead of pretending your normal gym schedule still exists.</p>
    </section>}

    {tab === 'progress' && <><section className="card"><p className="eyebrow">THE SCOREBOARD</p><h2>Performance first.</h2><div className="metrics"><div><strong>Push-ups</strong><span>Build → floor reps</span></div><div><strong>Pull-ups</strong><span>Assisted → unassisted</span></div><div><strong>Running</strong><span>Build aerobic capacity</span></div><div><strong>Core</strong><span>Control + endurance</span></div></div></section><section className="card"><h3>6-month outcome</h3><p>We care about looking fitter, but the plan is built around measurable abilities so you aren't just doing random lifting and hoping your body changes.</p></section></>}

    <nav><button className={tab==='today'?'active':''} onClick={()=>setTab('today')}>Today</button><button className={tab==='plan'?'active':''} onClick={()=>setTab('plan')}>Plan</button><button className={tab==='progress'?'active':''} onClick={()=>setTab('progress')}>Progress</button></nav>
  </main>
}
