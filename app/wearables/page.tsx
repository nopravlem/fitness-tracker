import Link from 'next/link';

export default function WearablesPage(){
  return <main className="shell">
    <header><div><p className="eyebrow">SADHANA</p><h1>Wearables</h1><p className="subtle">In progress.</p></div></header>

    <section className="card">
      <p className="eyebrow">COMING LATER</p>
      <h2>Connect your watch.</h2>
      <p className="subtle">Sadhana will eventually use wearable data as quiet context for the plan — things like sleep, activity, workouts, and recovery signals — without turning into a wall of health metrics.</p>
      <p className="subtle">COROS is the first device target, with Apple Watch, Garmin, and WHOOP planned for later.</p>
    </section>

    <div className="inlineActions"><Link href="/">← Back to today</Link></div>
    <nav><Link href="/">Today</Link><Link href="/plan">Plan</Link></nav>
  </main>
}
