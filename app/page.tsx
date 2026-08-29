import Link from 'next/link';

export default function Home(){
  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">DEV GROUP STUDIO</div>
        <nav className="nav">
          <span>Client services</span>
          <span>Secure billing</span>
          <Link href="/login">Sign in</Link>
        </nav>
      </header>

      <div className="container">
        <section className="hero">
          <div>
            <div className="kicker">Private client portal</div>
            <h1>Billing, services and results without the clutter.</h1>
            <p className="lead">A clean workspace for Dev Group Studio clients to activate services, manage recurring billing, review payment history and follow campaign performance.</p>
            <div className="hero-actions">
              <Link className="btn" href="/login">Open client portal →</Link>
              <a className="btn secondary" href="mailto:support@devgroupstudio.xyz">Contact support</a>
            </div>
            <div className="trust-strip">
              <div className="trust-item"><strong>Secure billing</strong><span className="tiny">Stripe-ready checkout flow</span></div>
              <div className="trust-item"><strong>Private access</strong><span className="tiny">Invitation-only client accounts</span></div>
              <div className="trust-item"><strong>Clear reporting</strong><span className="tiny">Simple metrics clients understand</span></div>
            </div>
          </div>

          <div className="card login-card">
            <div className="eyebrow">Client access</div>
            <h2 style={{marginTop:12}}>Welcome back.</h2>
            <p className="muted">Sign in with the email assigned to your Dev Group Studio account.</p>
            <div className="field"><label>Email address</label><input placeholder="you@company.com" type="email" /></div>
            <div className="field"><label>Password</label><input placeholder="••••••••" type="password" /></div>
            <Link className="btn full" href="/dashboard">Sign in</Link>
            <div className="divider" />
            <p className="tiny">New client? You’ll receive an invitation after your service and billing terms are prepared.</p>
          </div>
        </section>

        <section className="section">
          <div className="eyebrow">One workspace</div>
          <h2 style={{marginTop:12}}>Everything your client needs to see.</h2>
          <p className="lead" style={{fontSize:16}}>No complicated ad dashboards or confusing invoices. The portal keeps the important information in one place.</p>
          <div className="grid3" style={{marginTop:28}}>
            <div className="card feature"><span>01 · BILLING</span><h3 style={{marginTop:30}}>Know exactly what is being charged.</h3><p className="muted">Recurring services, payment history and upcoming charges in a simple client-facing view.</p></div>
            <div className="card feature"><span>02 · SERVICES</span><h3 style={{marginTop:30}}>See what is active.</h3><p className="muted">Website, SEO and advertising services can each be shown with their own scope and status.</p></div>
            <div className="card feature"><span>03 · PERFORMANCE</span><h3 style={{marginTop:30}}>Focus on outcomes.</h3><p className="muted">Spend, leads, calls, forms and monthly results without exposing unnecessary platform complexity.</p></div>
          </div>
        </section>
      </div>
    </main>
  );
}
