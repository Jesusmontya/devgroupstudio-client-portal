import PortalShell from '../../../../components/PortalShell';

export const dynamic = 'force-dynamic';

type Lead = {
  lead_id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  postal_code: string | null;
  status: string;
  is_test: boolean;
  campaign_id: string | null;
  form_id: string | null;
  lead_submit_time: string | null;
  created_at: string;
  custom_answers: Array<{ question?: string; answer?: string }> | null;
};

async function getLeads(): Promise<Lead[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return [];

  const response = await fetch(
    `${supabaseUrl}/rest/v1/google_ads_leads?select=lead_id,full_name,phone,email,postal_code,status,is_test,campaign_id,form_id,lead_submit_time,created_at,custom_answers&order=created_at.desc&limit=100`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      cache: 'no-store',
    },
  );

  if (!response.ok) return [];
  return response.json();
}

function formatDate(value: string | null) {
  if (!value) return 'Just received';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export default async function LeadsPage() {
  const leads = await getLeads();
  const productionLeads = leads.filter((lead) => !lead.is_test);
  const newLeads = productionLeads.filter((lead) => lead.status === 'new').length;

  return (
    <PortalShell active="leads">
      <div className="eyebrow">Lead inbox</div>
      <h2 style={{ marginTop: 10 }}>Google Ads leads.</h2>
      <p className="muted">New lead-form submissions sent directly from Google Ads to Dev Group Studio.</p>

      <div className="stats">
        <div className="card stat"><span className="tiny">TOTAL LEADS</span><strong>{productionLeads.length}</strong><span className="tiny">latest 100</span></div>
        <div className="card stat"><span className="tiny">NEW</span><strong>{newLeads}</strong><span className="tiny">need follow-up</span></div>
        <div className="card stat"><span className="tiny">TESTS</span><strong>{leads.filter((lead) => lead.is_test).length}</strong><span className="tiny">Google test submissions</span></div>
      </div>

      <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
        {leads.length === 0 && (
          <div className="card">
            <h3>No leads received yet.</h3>
            <p className="muted">Once the webhook is connected and Google sends a test or real lead, it will appear here.</p>
          </div>
        )}

        {leads.map((lead) => (
          <article className="card" key={lead.lead_id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div>
                <div className="tiny">{lead.is_test ? 'TEST LEAD' : lead.status.replaceAll('_', ' ').toUpperCase()}</div>
                <h3 style={{ margin: '8px 0 4px' }}>{lead.full_name || 'Google Ads lead'}</h3>
                <div className="muted">{formatDate(lead.lead_submit_time || lead.created_at)}</div>
              </div>
              <div className="tiny">ID {lead.lead_id.slice(0, 18)}{lead.lead_id.length > 18 ? '…' : ''}</div>
            </div>

            <div style={{ display: 'grid', gap: 10, marginTop: 18 }}>
              {lead.phone && <div className="row"><span>Phone</span><a href={`tel:${lead.phone}`}>{lead.phone}</a></div>}
              {lead.email && <div className="row"><span>Email</span><a href={`mailto:${lead.email}`}>{lead.email}</a></div>}
              {lead.postal_code && <div className="row"><span>ZIP code</span><strong>{lead.postal_code}</strong></div>}
              {lead.custom_answers?.map((item, index) => (
                <div className="row" key={`${lead.lead_id}-${index}`}>
                  <span>{item.question || 'Question'}</span>
                  <strong>{item.answer || '—'}</strong>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </PortalShell>
  );
}
