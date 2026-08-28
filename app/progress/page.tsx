'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type ProgressRow={id:number;measuredOn:string;weightLb:string|null;waistIn:string|null;pushups:number|null;pullupAssistanceLb:string|null;pullups:number|null;mileSeconds:number|null;splitDistanceIn:string|null;notes:string|null};
type ProgressForm={measuredOn:string;weightLb:string;waistIn:string;pushups:string;pullupAssistanceLb:string;pullups:string;mileSeconds:string;splitDistanceIn:string;notes:string};

const emptyForm=():ProgressForm=>({measuredOn:new Date().toISOString().slice(0,10),weightLb:'',waistIn:'',pushups:'',pullupAssistanceLb:'',pullups:'',mileSeconds:'',splitDistanceIn:'',notes:''});
function mileLabel(seconds:number|null){if(seconds==null)return '—';const m=Math.floor(seconds/60);const s=String(seconds%60).padStart(2,'0');return `${m}:${s}`}
function rowToForm(row:ProgressRow):ProgressForm{return{measuredOn:row.measuredOn,weightLb:row.weightLb??'',waistIn:row.waistIn??'',pushups:row.pushups?.toString()??'',pullupAssistanceLb:row.pullupAssistanceLb??'',pullups:row.pullups?.toString()??'',mileSeconds:row.mileSeconds?.toString()??'',splitDistanceIn:row.splitDistanceIn??'',notes:row.notes??''}}

export default function ProgressPage(){
  const[rows,setRows]=useState<ProgressRow[]>([]);const[error,setError]=useState<string|null>(null);const[loading,setLoading]=useState(true);const[editingId,setEditingId]=useState<number|null>(null);const[form,setForm]=useState<ProgressForm>(emptyForm());const[saving,setSaving]=useState(false);
  async function load(){setLoading(true);try{const r=await fetch('/api/tracker');if(!r.ok){const j=await r.json().catch(()=>null);throw new Error(j?.error||`Load failed (${r.status})`)}const data=await r.json();setRows(data.progress||[]);setError(null)}catch(e){setError(e instanceof Error?e.message:'Unable to load progress')}finally{setLoading(false)}}
  useEffect(()=>{load()},[]);
  const latest=rows[0];
  function update(field:keyof ProgressForm,value:string){setForm(p=>({...p,[field]:value}))}
  function startAdd(){setEditingId(0);setForm(emptyForm());window.scrollTo({top:0,behavior:'smooth'})}
  function startEdit(row:ProgressRow){setEditingId(row.id);setForm(rowToForm(row));window.scrollTo({top:0,behavior:'smooth'})}
  function cancelEdit(){setEditingId(null);setForm(emptyForm())}
  async function save(){setSaving(true);setError(null);try{const method=editingId&&editingId>0?'PATCH':'POST';const body=editingId&&editingId>0?{id:editingId,...form}:{type:'progress',...form};const r=await fetch('/api/tracker',{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok){const j=await r.json().catch(()=>null);throw new Error(j?.error||`Save failed (${r.status})`)}await load();cancelEdit()}catch(e){setError(e instanceof Error?e.message:'Unable to save progress')}finally{setSaving(false)}}
  async function remove(row:ProgressRow){if(!window.confirm(`Delete progress check-in from ${row.measuredOn}?`))return;setError(null);const r=await fetch('/api/tracker',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:row.id})});if(!r.ok){const j=await r.json().catch(()=>null);setError(j?.error||`Delete failed (${r.status})`);return}await load();if(editingId===row.id)cancelEdit()}

  return <main className="shell">
    <header><div><p className="eyebrow">CADENCE</p><h1>Progress</h1><p className="subtle">A long-view scoreboard, not something to obsess over every day.</p></div></header>
    {error&&<section className="card errorCard"><p>{error}</p></section>}
    <section className="card"><p className="eyebrow">CURRENT SNAPSHOT</p><div className="metrics"><div><strong>Push-ups</strong><span>{latest?.pushups ?? '—'} floor reps</span></div><div><strong>Pull-up</strong><span>{latest?.pullups ?? 0} unassisted · {latest?.pullupAssistanceLb??'—'} lb assist</span></div><div><strong>Mile</strong><span>{mileLabel(latest?.mileSeconds??null)}</span></div><div><strong>Split</strong><span>{latest?.splitDistanceIn??'—'} in away</span></div></div></section>

    {editingId!==null&&<section className="card progressEditorCard"><div className="progressEditor"><p className="eyebrow">{editingId===0?'NEW CHECK-IN':'EDIT CHECK-IN'}</p><h2>{editingId===0?'Add progress':'Update progress'}</h2><div className="formGrid"><label>Date<input type="date" value={form.measuredOn} onChange={e=>update('measuredOn',e.target.value)}/></label><label>Weight (optional)<input inputMode="decimal" value={form.weightLb} onChange={e=>update('weightLb',e.target.value)}/></label><label>Waist (optional)<input inputMode="decimal" value={form.waistIn} onChange={e=>update('waistIn',e.target.value)}/></label><label>Floor push-ups<input inputMode="numeric" value={form.pushups} onChange={e=>update('pushups',e.target.value)}/></label><label>Pull-up assistance lb<input inputMode="decimal" value={form.pullupAssistanceLb} onChange={e=>update('pullupAssistanceLb',e.target.value)}/></label><label>Unassisted pull-ups<input inputMode="numeric" value={form.pullups} onChange={e=>update('pullups',e.target.value)}/></label><label>Mile seconds<input inputMode="numeric" value={form.mileSeconds} onChange={e=>update('mileSeconds',e.target.value)}/></label><label>Split distance in<input inputMode="decimal" value={form.splitDistanceIn} onChange={e=>update('splitDistanceIn',e.target.value)}/></label></div><textarea placeholder="Optional note" value={form.notes} onChange={e=>update('notes',e.target.value)}/><div className="editorActions"><button className="secondary" disabled={saving} onClick={save}>{saving?'Saving…':'Save check-in'}</button><button className="ghostButton" onClick={cancelEdit}>Cancel</button></div></div></section>}

    <section className="card progressManage"><div className="progressManageHead"><div><p className="eyebrow">HISTORY</p><h2>Check-ins</h2></div><button className="compactButton" onClick={startAdd}>+ Add</button></div>
      {loading?<p className="subtle">Loading…</p>:rows.length===0?<p className="subtle">No progress check-ins yet.</p>:rows.map(row=><div className="historyRow" key={row.id}><div className="historyRowHead"><b>{row.measuredOn}</b><div className="historyActions"><button onClick={()=>startEdit(row)}>Edit</button><button className="dangerText" onClick={()=>remove(row)}>Delete</button></div></div><span>Push-ups {row.pushups??'—'} · Pull-ups {row.pullups??'—'} · Assist {row.pullupAssistanceLb??'—'} lb · Mile {mileLabel(row.mileSeconds)}</span>{(row.weightLb||row.waistIn)&&<span>Weight {row.weightLb??'—'} lb · Waist {row.waistIn??'—'} in</span>}{row.notes&&<p>{row.notes}</p>}</div>)}
    </section>
    <div className="inlineActions"><Link href="/">← Back to today</Link></div>
    <nav><Link href="/">Today</Link><Link href="/plan">Plan</Link></nav>
  </main>
}
