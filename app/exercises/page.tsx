import Link from 'next/link';
import { exerciseReferences } from '@/lib/exercise-reference';

export default function ExercisesPage(){
  const mobility=exerciseReferences.filter(x=>x.category==='Mobility');
  const strength=exerciseReferences.filter(x=>x.category==='Strength');
  const byId=new Map(exerciseReferences.map(item=>[item.id,item]));
  return <main className="shell exerciseLibrary">
    <header><div><p className="eyebrow">SADHANA</p><h1>Exercises</h1><p className="subtle">A reference for movements in the plan. Use it when a name is unfamiliar or you want the setup and cues again.</p></div></header>

    <section className="card exerciseIndex"><p className="eyebrow">JUMP TO</p><div className="chips referenceChips"><a href="#mobility">Mobility</a><a href="#strength">Strength</a></div></section>

    <section id="mobility" className="exerciseReferenceSection"><div className="sectionTitle"><h2>Mobility</h2><span>{mobility.length} references</span></div>{mobility.map(item=><article className="card exerciseReference" id={item.id} key={item.id}><p className="eyebrow">{item.name.toUpperCase()} MOBILITY</p><h2>{item.name}</h2><p className="subtle">{item.summary}</p><h3>How to do it</h3><ol>{item.howTo.map(step=><li key={step}>{step}</li>)}</ol>{item.cues?.length&&<><h3>Cues</h3><ul>{item.cues.map(cue=><li key={cue}>{cue}</li>)}</ul></>}{item.related?.length&&<div className="relatedLinks"><h3>See the individual movements</h3><div className="chips referenceChips">{item.related.map(id=>{const related=byId.get(id);return related?<a key={id} href={`#${id}`}>{related.name} ↓</a>:null})}</div></div>}</article>)}</section>

    <section id="strength" className="exerciseReferenceSection"><div className="sectionTitle"><h2>Strength</h2><span>{strength.length} references</span></div>{strength.map(item=><article className="card exerciseReference" id={item.id} key={item.id}><p className="eyebrow">{item.name.toUpperCase()} STRENGTH</p><h2>{item.name}</h2><p className="subtle">{item.summary}</p><h3>How to do it</h3><ol>{item.howTo.map(step=><li key={step}>{step}</li>)}</ol>{item.cues?.length&&<><h3>Cues</h3><ul>{item.cues.map(cue=><li key={cue}>{cue}</li>)}</ul></>}</article>)}</section>

    <div className="inlineActions"><Link href="/">← Back to today</Link></div>
    <nav><Link href="/">Today</Link><Link href="/plan">Plan</Link></nav>
  </main>
}
