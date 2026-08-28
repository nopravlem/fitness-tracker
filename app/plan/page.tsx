import Link from 'next/link';
import { trainingBlocks, weeklyPlans } from '@/lib/program';

export default function PlanPage(){
  return <main className="shell">
    <header><div><p className="eyebrow">6 MONTH PROJECT</p><h1>Your plan.</h1><p className="subtle">The default week and bigger training blocks. Today still lives at home.</p></div></header>

    <section className="card plan"><p className="eyebrow">DEFAULT WEEK</p><h2>Three hard days. No punishment workouts.</h2>{[1,2,3,4,5,6,0].map(d=><p key={d}><b>{['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d]}</b> · {weeklyPlans[d].label} — {weeklyPlans[d].description}</p>)}</section>

    <section className="card"><p className="eyebrow">TRAINING BLOCKS</p>{trainingBlocks.map(b=><div className="blockRow" key={b.name}><b>{b.name}</b><span>{b.start} → {b.end}</span><p>{b.focus}</p></div>)}</section>

    <nav><Link href="/">Today</Link><Link className="active" href="/plan">Plan</Link></nav>
  </main>
}
