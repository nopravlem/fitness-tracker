'use client';

import { useEffect, useMemo, useState } from 'react';
import type { DayPlan } from '@/lib/program';
import styles from './TodayPractice.module.css';

type PracticeState={done:Record<string,boolean>;sideways:boolean};
type PracticeItem={id:string;label:string;detail?:string;automatic?:boolean};

function storageKey(date:string){return `sadhana:practice:${date}`}
function readState(date:string):PracticeState{
  if(typeof window==='undefined')return{done:{},sideways:false};
  try{const raw=window.localStorage.getItem(storageKey(date));return raw?{done:{},sideways:false,...JSON.parse(raw)}:{done:{},sideways:false}}catch{return{done:{},sideways:false}}
}

export default function TodayPractice({todayKey,plan,workoutDone}:{todayKey:string;plan:DayPlan;workoutDone:boolean}){
  const items=useMemo<PracticeItem[]>(()=>{
    const result:PracticeItem[]=[];
    const [y,m,d]=todayKey.split('-').map(Number);const weekday=new Date(y,m-1,d).getDay();
    if(weekday>=1&&weekday<=5)result.push({id:'wake-630',label:'6:30 wake',detail:'Try again next weekday if it does not happen. Never carries over.'});
    if(['strength','cardio','solidcore'].includes(plan.kind))result.push({id:'training',label:plan.label,detail:'The planned training for today.',automatic:plan.kind==='strength'});
    if(plan.mobility?.length)result.push({id:'mobility',label:'Mobility',detail:plan.kind==='recovery'?'Optional recovery work counts.':'Short and useful is enough.'});
    return result;
  },[todayKey,plan]);
  const[state,setState]=useState<PracticeState>({done:{},sideways:false});
  const[ready,setReady]=useState(false);

  useEffect(()=>{setState(readState(todayKey));setReady(true)},[todayKey]);
  useEffect(()=>{if(!ready)return;window.localStorage.setItem(storageKey(todayKey),JSON.stringify(state))},[state,todayKey,ready]);
  useEffect(()=>{if(workoutDone&&items.some(i=>i.id==='training'))setState(s=>s.done.training?s:{...s,done:{...s.done,training:true}})},[workoutDone,items]);

  function toggle(id:string){setState(s=>({...s,done:{...s.done,[id]:!s.done[id]}}))}
  const completed=items.filter(i=>state.done[i.id]).length;
  return <section className={`card ${styles.practice}`}>
    <div className={styles.heading}><div><p className="eyebrow">TODAY'S PRACTICE</p><h2>What actually happened?</h2></div>{items.length>0&&<span>{completed}/{items.length}</span>}</div>
    <p className={styles.intro}>{items.length>0?'One tap. No streaks, no make-up debt. Unfinished things do not automatically become tomorrow’s problem.':'Nothing needs checking off today. Rest is already part of the plan — but you can still flag that the day went differently than expected.'}</p>
    {items.length>0&&<div className={styles.items}>{items.map(item=><button key={item.id} type="button" className={`${styles.item} ${state.done[item.id]?styles.done:''}`} onClick={()=>toggle(item.id)} aria-pressed={!!state.done[item.id]}><span className={styles.check}>{state.done[item.id]?'✓':''}</span><span><b>{item.label}</b>{item.detail&&<small>{item.detail}</small>}</span></button>)}</div>}
    <button type="button" className={`${styles.sideways} ${state.sideways?styles.sidewaysActive:''}`} onClick={()=>setState(s=>({...s,sideways:!s.sideways}))}>{state.sideways?'✓ Day went sideways':'Day went sideways?'}</button>
    {state.sideways&&<p className={styles.context}>Noted. Today is information, not debt. Nothing extra gets stacked onto tomorrow just because today was messy.</p>}
  </section>
}
