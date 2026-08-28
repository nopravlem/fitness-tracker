'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type ProgressRow={id:number;measuredOn:string;weightLb:string|null;waistIn:string|null;pushups:number|null;pullupAssistanceLb:string|null;pullups:number|null;mileSeconds:number|null;splitDistanceIn:string|null;notes:string|null};

function mileLabel(seconds:number|null){if(seconds==null)return '—';const m=Math.floor(seconds/60);const s=String(seconds%60).padStart(2,'0');return `${m}:${s}`}

export default function ProgressPage(){
  const[rows,setRows]=useState<ProgressRow[]>([]);const[error,setError]=useState<string|null>(null);const[loading,setLoading]=useState(true);
  useEffect(()=>{fetch('/api/tracker').then(async r=>{if(!r.ok){const j=await r.json().catch(()=>null);throw new Error(j?.error||`Load failed (${r.status})`)}return r.json()}).then(data=>{setRows(data.progress||[]);setLoading(false)}).catch(e=>{setError(e instanceof Error?e.message:'Unable to load progress');setLoading(false)})},[]);
  const latest=rows[0];
  return <main className="shell">
    <header><div><p className="eyebrow">CADENCE</p><h1>Progress</h1><p className="subtle">A long-view scoreboard, not something to obsess over every day.</p></div></header>
    {error&&<section className="card errorCard"><p>{error}</p></section>}
    <section className="card"><p className="eyebrow">CURRENT SNAPSHOT</p><div className="metrics"><div><strong>Push-ups</strong><span>{latest?.pushups ?? '—'} floor reps</span></div><div><strong>Pull-up</strong><span>{latest?.pullups ?? 0} unassisted · {latest?.pullupAssistanceLb??'—'} lb assist</span></div><div><strong>Mile</strong><span>{mileLabel(latest?.mileSeconds??null)}</span></div><div><strong>Split</strong><span>{latest?.splitDistanceIn??'—'} in away</span></div></div></section>
    <section className="card"><p className="eyebrow">HISTORY</p>{loading?<p className="subtle">Loading…</p>:rows.length===0?<p className="subtle">No progress check-ins yet. The first one will appear when a periodic check-in is saved.</p>:rows.map(row=><div className="historyRow" key={row.id}><b>{row.measuredOn}</b><span>Push-ups {row.pushups??'—'} · Pull-ups {row.pullups??'—'} · Assist {row.pullupAssistanceLb??'—'} lb · Mile {mileLabel(row.mileSeconds)}</span>{(row.weightLb||row.waistIn)&&<span>Weight {row.weightLb??'—'} lb · Waist {row.waistIn??'—'} in</span>}{row.notes&&<p>{row.notes}</p>}</div>)}</section>
    <div className="inlineActions"><Link href="/">← Back to today</Link></div>
    <nav><Link href="/">Today</Link><Link href="/plan">Plan</Link></nav>
  </main>
}
