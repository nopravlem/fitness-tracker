import Link from 'next/link';

export default function AboutPage(){
  return <main className="shell">
    <header><div><p className="eyebrow">SADHANA</p><h1>About</h1><p className="subtle">A practice for becoming less stuck, one day at a time.</p></div></header>

    <section className="card">
      <p className="eyebrow">THE NAME</p>
      <h2>Sadhana · साधना</h2>
      <p>Sadhana is a Sanskrit word for a deliberate, sustained practice undertaken in pursuit of a goal. It can mean practice, discipline, or a means of accomplishment.</p>
      <p>It is not really about a finish line. It is about the work you return to.</p>
    </section>

    <section className="card">
      <p className="eyebrow">WHY THIS EXISTS</p>
      <h2>I was stuck in a rut.</h2>
      <p>I wanted to improve my life, but “improve my life” is too big to act on all at once. Fitness, food, sleep, routines, mobility, energy, discipline, and everything else can quickly become one giant project.</p>
      <p>Sadhana is my way of turning that vague desire into something concrete: what matters today, what can wait, and what I can keep practicing long enough to actually change.</p>
    </section>

    <section className="card">
      <p className="eyebrow">THE IDEA</p>
      <h2>Progress is a practice.</h2>
      <p>Some days the practice is getting stronger. Some days it is eating in a way that supports my goals. Some days it is mobility, recovery, getting up when I said I would, or simply not turning one rough day into a rough month.</p>
      <p>Rest counts when it is intentional. Small actions count when they are repeated. The plan can change when life changes without the whole thing becoming a failure.</p>
    </section>

    <section className="card">
      <p className="eyebrow">WHAT SADHANA SHOULD DO</p>
      <h2>Make the next step easier to see.</h2>
      <p>This site is not meant to demand constant tracking or perfect discipline. It should reduce decisions, keep the long view visible, and give me a realistic next action based on the life I am actually living.</p>
      <p>The goal is not to become perfect. It is to keep becoming more capable, more intentional, and more like the person I want to be.</p>
    </section>

    <div className="inlineActions"><Link href="/">← Back to today</Link></div>
    <nav><Link href="/">Today</Link><Link href="/plan">Plan</Link></nav>
  </main>
}
