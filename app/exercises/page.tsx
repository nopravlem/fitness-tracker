import Link from 'next/link';
import { exerciseReferences } from '@/lib/exercise-reference';

function renderStep(step:string,related?:{id:string;label:string}[]){
  if(!related?.length)return step;
  const match=related.find(item=>step.toLowerCase().includes(item.label.toLowerCase()));
  if(!match)return step;
  const index=step.toLowerCase().indexOf(match.label.toLowerCase());
  const before=step.slice(0,index);const linked=step.slice(index,index+match.label.length);const after=step.slice(index+match.label.length);
  return <>{before}<a className="inlineReferenceLink" href={`#${match.id}`}>{linked}</a>{after}</>;
}

export default function ExercisesPage(){
  const mobility=exerciseReferences.filter(x=>x.category==='Mobility');
  const strength=exerciseReferences.filter(x=>x.category==='Strength');
  return <main className="shell exerciseLibrary">
    <header><div><p className="eyebrow">SADHANA</p><h1>Exercises</h1><p className="subtle">A reference for movements in the plan. Use it when a name is unfamiliar or you want the setup and cues again.</p></div></header>

    <section className="card exerciseIndex"><p className="eyebrow">JUMP TO</p><div className="chips referenceChips"><a href="#mobility">Mobility</a><a href="#strength">Strength</a></div></section>

    <section id="mobility" className="exerciseReferenceSection"><div className="sectionTitle"><h2>Mobility</h2><span>{mobility.length} references</span></div>{mobility.map(item=><article className="card exerciseReference" id={item.id} key={item.id}><p className="eyebrow">{item.name.toUpperCase()}</p><h2>{item.area?`${item.area} mobility`:item.name}</h2><p className="subtle">{item.summary}</p><h3>How to do it</h3><ol>{item.howTo.map(step=><li key={step}>{renderStep(step,item.related)}</li>)}</ol>{item.cues?.length&&<><h3>Cues</h3><ul>{item.cues.map(cue=><li key={cue}>{cue}</li>)}</ul></>}</article>)}</section>

    <section id="strength" className="exerciseReferenceSection"><div className="sectionTitle"><h2>Strength</h2><span>{strength.length} references</span></div>{strength.map(item=><article className="card exerciseReference" id={item.id} key={item.id}><p className="eyebrow">{item.name.toUpperCase()} STRENGTH</p><h2>{item.name}</h2><p className="subtle">{item.summary}</p><h3>How to do it</h3><ol>{item.howTo.map(step=><li key={step}>{step}</li>)}</ol>{item.cues?.length&&<><h3>Cues</h3><ul>{item.cues.map(cue=><li key={cue}>{cue}</li>)}</ul></>}</article>)}</section>

    <div className="inlineActions"><Link href="/">← Back to today</Link></div>
    <nav><Link href="/">Today</Link><Link href="/plan">Plan</Link></nav>
  </main>
}
