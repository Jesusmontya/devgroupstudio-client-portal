import Link from 'next/link';

export default function Admin(){
  return (
    <main className="shell">
      <header className="topbar">
        <Link href="/" className="brand">DEV GROUP STUDIO</Link>
        <span className="tiny">ADMIN CONSOLE</span>
      </header>

      <div className="container section">
        <div className="admin-toolbar">
          <div>
            <div className="eyebrow">Agency operations</div>
            <h2 style={{marginTop:10}}>Client billing overview</h2>
            <p className="muted">Manage clients, recurring services and the money your agency keeps.</p>
          </div>
          <div className="admin-actions">
            <Link className="btn secondary" href="/admin/finances">Financial allocation</Link>
            <Link className="btn" href="/admin/clients/new">+ Add client</Link>
          </div>
        </div>

        <div className="stats">
          <div className="card stat"><span className="tiny">ACTIVE CLIENTS</span><strong>3</strong><span className="tiny">All accounts current</span></div>
          <div className="card stat"><span className="tiny">MONTHLY BILLING</span><strong>$2,600</strong><span className="tiny">Client-facing total</span></div>
          <div className="card stat"><span className="tiny">AGENCY REVENUE</span><strong>$950</strong><span className="tiny">Management and services</span></div>
          <div className="card stat"><span className="tiny">NEXT PAYOUT</span><strong>$712</strong><span className="tiny">Demo net after fees</span></div>
        </div>

        <div className="card admin-table-wrap">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,marginBottom:12}}>
            <div><div className="eyebrow">Accounts</div><h3 style={{marginTop:8}}>Active clients</h3></div>
            <span className="tiny">Demo data until Supabase + Stripe are connected</span>
          </div>
          <table className="admin-table">
            <thead><tr><th>Client</th><th>Service</th><th>Ad budget</th><th>Agency fee</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td><strong>TerraNova Landscaping</strong></td><td>Google Ads Management</td><td>$500</td><td>$300</td><td>$800/mo</td><td><span className="status"><span className="dot"/>Active</span></td></tr>
              <tr><td><strong>Baldos Auto Sales</strong></td><td>SEO + Ads</td><td>$150</td><td>$200</td><td>$350/mo</td><td><span className="status"><span className="dot"/>Active</span></td></tr>
              <tr><td><strong>Cornerstone Construction</strong></td><td>Website + Ads</td><td>$1,000</td><td>$450</td><td>$1,450/mo</td><td><span className="status"><span className="dot"/>Active</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
