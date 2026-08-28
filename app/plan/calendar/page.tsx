import Link from 'next/link';
import { blockForDate, dateOverrides, PROGRAM_START, trainingBlocks, weeklyPlans } from '@/lib/program';

const months=[
  {year:2026,month:7,label:'August 2026'},
  {year:2026,month:8,label:'September 2026'},
  {year:2026,month:9,label:'October 2026'},
  {year:2026,month:10,label:'November 2026'},
  {year:2026,month:11,label:'December 2026'},
  {year:2027,month:0,label:'January 2027'},
  {year:2027,month:1,label:'February 2027'}
];

function keyFor(year:number,month:number,day:number){return `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`}
function planForKey(key:string,weekday:number){
  if(dateOverrides[key])return dateOverrides[key];
  const block=blockForDate(key);
  if(block&&(block.name.includes('Recovery')||block.name.includes('Deload')||block.name.includes('India'))){
    return {key:'recovery-block',label:block.name,kind:'recovery' as const,duration:'Flexible',description:block.focus};
  }
  return weeklyPlans[weekday];
}
function shortLabel(label:string){
  return label.replace('Strength C + run','Strength C').replace('Easy cardio + mobility','Cardio').replace('Recovery + mobility','Recovery').replace('Target walk + apartment reset','Reset day').replace('September Re-entry','Re-entry').replace('India / Recovery','India').replace('Thanksgiving Deload','Deload').replace('Holiday Recovery','Holiday');
}

export default function PlanCalendarPage(){
  return <main className="shell calendarShell">
    <header><div><p className="eyebrow">6 MONTH PROJECT</p><h1>Calendar.</h1><p className="subtle">Day 1 starts on {PROGRAM_START}. Earlier dates are intentionally outside the plan.</p></div></header>

    <section className="card calendarLegend"><p className="eyebrow">KEY</p><div className="legendItems"><span data-kind="strength">Strength</span><span data-kind="cardio">Cardio</span><span data-kind="solidcore">Solidcore</span><span data-kind="recovery">Recovery / travel</span><span data-kind="rest">Rest</span></div></section>

    {months.map(({year,month,label})=>{
      const firstWeekday=new Date(Date.UTC(year,month,1)).getUTCDay();
      const daysInMonth=new Date(Date.UTC(year,month+1,0)).getUTCDate();
      const cells:Array<null|{day:number;key:string;label?:string;kind?:string;block?:string|null;beforeStart?:boolean}>=Array(firstWeekday).fill(null);
      for(let day=1;day<=daysInMonth;day++){
        const key=keyFor(year,month,day);
        if(key<PROGRAM_START){cells.push({day,key,beforeStart:true});continue;}
        const weekday=new Date(Date.UTC(year,month,day)).getUTCDay();const plan=planForKey(key,weekday);const block=blockForDate(key);
        cells.push({day,key,label:shortLabel(plan.label),kind:plan.kind,block:block?.name??null});
      }
      return <section className="card monthCard" key={label}><div className="monthHead"><h2>{label}</h2>{trainingBlocks.filter(b=>b.start<=keyFor(year,month,daysInMonth)&&b.end>=keyFor(year,month,1)).map(b=><span key={b.name}>{b.name}</span>)}</div><div className="calendarWeekdays">{['S','M','T','W','T','F','S'].map((d,i)=><b key={`${d}-${i}`}>{d}</b>)}</div><div className="calendarGrid">{cells.map((cell,i)=>!cell?<div className="calendarDay empty" key={`empty-${i}`}/>:cell.beforeStart?<div className="calendarDay beforeStart" key={cell.key}><span>{cell.day}</span></div>:<div className="calendarDay" data-kind={cell.kind} key={cell.key}><span>{cell.day}</span><strong>{cell.label}</strong>{cell.block&&<small>{cell.block}</small>}</div>)}</div></section>
    })}

    <section className="card"><p className="eyebrow">BREAKS ARE PART OF THE PLAN</p><h2>No catching up afterward.</h2><p className="subtle">Travel, Thanksgiving, and the holiday period are intentionally lighter. When the normal program resumes, it resumes from there — no doubled workouts to repay a missed week.</p></section>

    <div className="inlineActions"><Link href="/plan">← Back to plan overview</Link></div>
    <nav><Link href="/">Today</Link><Link className="active" href="/plan">Plan</Link></nav>
  </main>
}
