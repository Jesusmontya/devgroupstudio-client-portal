import Link from 'next/link';

export default function Finances(){
  return (
    <main className="shell">
      <header className="topbar">
        <Link href="/admin" className="brand">DEV GROUP STUDIO</Link>
        <span className="tiny">FINANCIAL ALLOCATION</span>
      </header>

      <div className="container section">
        <div className="admin-toolbar">
          <div>
            <div className="eyebrow">Monthly allocation</div>
            <h2 style={{marginTop:10}}>Know what to move before you spend it.</h2>
            <p className="muted">Set your percentages once. When Stripe is connected, this screen will calculate the exact monthly amounts automatically.</p>
          </div>
          <Link href="/admin" className="btn secondary">← Back to admin</Link>
        </div>

        <div className="stats">
          <div className="card stat"><span className="tiny">GROSS REVENUE</span><strong>$4,000</strong><span className="tiny">Demo month</span></div>
          <div className="card stat"><span className="tiny">STRIPE FEES</span><strong>-$120</strong><span className="tiny">Demo estimate</span></div>
          <div className="card stat"><span className="tiny">NET RECEIVED</span><strong>$3,880</strong><span className="tiny">Allocation base</span></div>
          <div className="card stat"><span className="tiny">AVAILABLE FOR YOU</span><strong>$1,940</strong><span className="tiny">At 50%</span></div>
        </div>

        <div className="allocation-grid">
          <div className="card">
            <div className="eyebrow">Your percentages</div>
            <h3 style={{marginTop:10}}>Financial allocation settings</h3>
            <p className="muted">Frontend demo. These values will later be saved in Supabase and calculated from Stripe net revenue.</p>

            <div className="allocation-item"><div><strong>Taxes</strong><div className="tiny">Reserve for tax obligations</div></div><input type="number" defaultValue="25" /><strong>$970</strong></div>
            <div className="allocation-item"><div><strong>Operations</strong><div className="tiny">Software, hosting and business expenses</div></div><input type="number" defaultValue="15" /><strong>$582</strong></div>
            <div className="allocation-item"><div><strong>Reserve</strong><div className="tiny">Cash buffer and future growth</div></div><input type="number" defaultValue="10" /><strong>$388</strong></div>
            <div className="allocation-item"><div><strong>Owner pay</strong><div className="tiny">Amount available to transfer to yourself</div></div><input type="number" defaultValue="50" /><strong>$1,940</strong></div>

            <div className="row"><strong>Total allocation</strong><strong>100%</strong></div>
            <button className="btn full" style={{marginTop:18}}>Save allocation</button>
          </div>

          <div className="card summary-card">
            <div className="eyebrow" style={{color:'#94a3b8'}}>August 2026</div>
            <h2 style={{marginTop:10}}>Transfer checklist</h2>
            <p className="muted">After Stripe pays out to Wells Fargo, use this as your monthly transfer guide.</p>
            <div className="row"><span>Taxes</span><strong>$970</strong></div>
            <div className="row"><span>Operations</span><strong>$582</strong></div>
            <div className="row"><span>Reserve</span><strong>$388</strong></div>
            <div className="row"><span>Personal / owner pay</span><strong>$1,940</strong></div>
            <button className="btn full" style={{marginTop:22,background:'#fff',color:'#0f172a'}}>Mark month as transferred</button>
            <p className="tiny" style={{marginTop:14}}>This button is visual only until the database is connected.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
