'use client';

import { useEffect, useMemo, useState } from 'react';
import type { DayPlan } from '@/lib/program';
import styles from './TodayPractice.module.css';

type PracticeState={done:Record<string,boolean>;sideways:boolean};
type PracticeItem={id:string;label:string;detail?:string};

type DailyCheckin={wake630Met:boolean|null;trainingDone:boolean|null;mobilityDone:boolean|null;proteinTargetMet:boolean|null;practiceSideways:boolean};

function fromCheckin(checkin:DailyCheckin|null):PracticeState{
  return {
    done:{
      'wake-630':checkin?.wake630Met===true,
      training:checkin?.trainingDone===true,
      mobility:checkin?.mobilityDone===true,
      'protein-forward':checkin?.proteinTargetMet===true
    },
    sideways:checkin?.practiceSideways===true
  };
}

export default function TodayPractice({todayKey,plan,workoutDone}:{todayKey:string;plan:DayPlan;workoutDone:boolean}){
  const items=useMemo<PracticeItem[]>(()=>{
    const result:PracticeItem[]=[];
    const [y,m,d]=todayKey.split('-').map(Number);const weekday=new Date(y,m-1,d).getDay();
    if(weekday>=1&&weekday<=5)result.push({id:'wake-630',label:'6:30 wake',detail:'Try again next weekday if it does not happen. Never carries over.'});
    if(['strength','cardio','solidcore'].includes(plan.kind))result.push({id:'training',label:plan.label,detail:'The planned training for today.'});
    if(plan.mobility?.length)result.push({id:'mobility',label:'Mobility',detail:plan.kind==='recovery'?'Optional recovery work counts.':'Short and useful is enough.'});
    result.push({id:'protein-forward',label:'Protein-forward meals',detail:'Good enough counts. No meal-by-meal logging.'});
    return result;
  },[todayKey,plan]);
  const[state,setState]=useState<PracticeState>({done:{},sideways:false});
  const[ready,setReady]=useState(false);
  const[saving,setSaving]=useState(false);

  useEffect(()=>{
    let cancelled=false;
    fetch(`/api/tracker?date=${todayKey}`).then(async r=>{
      if(!r.ok)throw new Error('Unable to load practice');
      const data=await r.json();
      if(!cancelled){setState(fromCheckin(data.checkin??null));setReady(true)}
    }).catch(()=>{if(!cancelled)setReady(true)});
    return()=>{cancelled=true};
  },[todayKey]);

  async function persist(next:PracticeState){
    setState(next);setSaving(true);
    try{
      await fetch('/api/tracker',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        type:'practice',date:todayKey,
        wake630Met:next.done['wake-630']??null,
        trainingDone:next.done.training??null,
        mobilityDone:next.done.mobility??null,
        proteinTargetMet:next.done['protein-forward']??null,
        practiceSideways:next.sideways
      })});
    }finally{setSaving(false)}
  }

  useEffect(()=>{
    if(!ready||!workoutDone||!items.some(i=>i.id==='training')||state.done.training)return;
    void persist({...state,done:{...state.done,training:true}});
  },[workoutDone,ready]);

  function toggle(id:string){void persist({...state,done:{...state.done,[id]:!state.done[id]}})}
  function toggleSideways(){void persist({...state,sideways:!state.sideways})}
  const completed=items.filter(i=>state.done[i.id]).length;
  return <section className={`card ${styles.practice}`}>
    <div className={styles.heading}><div><p className="eyebrow">TODAY'S PRACTICE</p><h2>What actually happened?</h2></div>{items.length>0&&<span>{completed}/{items.length}</span>}</div>
    <p className={styles.intro}>One record for today. No streaks, no make-up debt. Unfinished things do not automatically become tomorrow’s problem.{saving?' Saving…':''}</p>
    {items.length>0&&<div className={styles.items}>{items.map(item=><button key={item.id} type="button" disabled={!ready} className={`${styles.item} ${state.done[item.id]?styles.done:''}`} onClick={()=>toggle(item.id)} aria-pressed={!!state.done[item.id]}><span className={styles.check}>{state.done[item.id]?'✓':''}</span><span><b>{item.label}</b>{item.detail&&<small>{item.detail}</small>}</span></button>)}</div>}
    <button type="button" disabled={!ready} className={`${styles.sideways} ${state.sideways?styles.sidewaysActive:''}`} onClick={toggleSideways}>{state.sideways?'✓ Day went sideways':'Day went sideways?'}</button>
    {state.sideways&&<p className={styles.context}>Noted. Today is information, not debt. Nothing extra gets stacked onto tomorrow just because today was messy.</p>}
  </section>
}
