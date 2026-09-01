import { createHash, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 64 * 1024;

function secureEqual(a: string, b: string) {
  const ah = createHash('sha256').update(a).digest();
  const bh = createHash('sha256').update(b).digest();
  return timingSafeEqual(ah, bh);
}

function parseAllowList(value?: string) {
  return new Set((value || '').split(',').map((v) => v.trim()).filter(Boolean));
}

function pick(columns: Array<{ column_id?: string; column_name?: string; string_value?: string }>, ids: string[]) {
  const normalized = ids.map((id) => id.toUpperCase());
  const match = columns.find((column) => normalized.includes(String(column.column_id || '').toUpperCase()));
  return match?.string_value?.trim() || null;
}

function customAnswers(columns: Array<{ column_id?: string; column_name?: string; string_value?: string }>) {
  const known = new Set(['FULL_NAME', 'FIRST_NAME', 'LAST_NAME', 'EMAIL', 'PHONE_NUMBER', 'POSTAL_CODE', 'ZIP', 'CITY', 'REGION']);
  return columns
    .filter((column) => !known.has(String(column.column_id || '').toUpperCase()))
    .map((column) => ({
      id: column.column_id || null,
      question: column.column_name || column.column_id || 'Custom question',
      answer: column.string_value || '',
    }));
}

async function saveLead(payload: any) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) throw new Error('Supabase is not configured');

  const columns = Array.isArray(payload.user_column_data) ? payload.user_column_data : [];
  const record = {
    lead_id: String(payload.lead_id),
    source: 'google_ads_lead_form',
    status: payload.is_test === true ? 'test' : 'new',
    is_test: payload.is_test === true,
    full_name: pick(columns, ['FULL_NAME']) || [pick(columns, ['FIRST_NAME']), pick(columns, ['LAST_NAME'])].filter(Boolean).join(' ') || null,
    phone: pick(columns, ['PHONE_NUMBER']),
    email: pick(columns, ['EMAIL']),
    postal_code: pick(columns, ['POSTAL_CODE', 'ZIP']),
    city: pick(columns, ['CITY']),
    region: pick(columns, ['REGION']),
    campaign_id: payload.campaign_id ? String(payload.campaign_id) : null,
    form_id: payload.form_id ? String(payload.form_id) : null,
    asset_group_id: payload.asset_group_id ? String(payload.asset_group_id) : null,
    gclid: payload.gcl_id || payload.gclid || null,
    lead_stage: payload.lead_stage || null,
    lead_source: payload.lead_source || 'LEAD_FORM',
    lead_submit_time: payload.lead_submit_time || null,
    custom_answers: customAnswers(columns),
    raw_payload: payload,
  };

  const response = await fetch(`${supabaseUrl}/rest/v1/google_ads_leads?on_conflict=lead_id`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify(record),
    cache: 'no-store',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase insert failed: ${response.status} ${message.slice(0, 300)}`);
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  const webhookPathToken = process.env.GOOGLE_ADS_WEBHOOK_PATH_TOKEN;
  const googleKey = process.env.GOOGLE_ADS_WEBHOOK_KEY;

  if (!webhookPathToken || !googleKey) {
    return NextResponse.json({ message: 'Webhook is not configured' }, { status: 503 });
  }

  // Security layer 1: secret URL token.
  if (!secureEqual(token, webhookPathToken)) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return NextResponse.json({ message: 'Content-Type must be application/json' }, { status: 415 });
  }

  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ message: 'Payload too large' }, { status: 413 });
  }

  let text = '';
  let payload: any;
  try {
    text = await request.text();
    if (Buffer.byteLength(text, 'utf8') > MAX_BODY_BYTES) {
      return NextResponse.json({ message: 'Payload too large' }, { status: 413 });
    }
    payload = JSON.parse(text);
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  // Security layer 2: Google sends this key inside the webhook payload.
  if (typeof payload.google_key !== 'string' || !secureEqual(payload.google_key, googleKey)) {
    return NextResponse.json({ message: 'Invalid webhook key' }, { status: 401 });
  }

  if (typeof payload.lead_id !== 'string' || payload.lead_id.length < 3 || payload.lead_id.length > 2048) {
    return NextResponse.json({ message: 'Invalid lead_id' }, { status: 400 });
  }

  if (!Array.isArray(payload.user_column_data) || payload.user_column_data.length > 50) {
    return NextResponse.json({ message: 'Invalid lead fields' }, { status: 400 });
  }

  // Optional third layer: lock the endpoint to known Google Ads form/campaign IDs.
  const allowedForms = parseAllowList(process.env.GOOGLE_ADS_ALLOWED_FORM_IDS);
  const allowedCampaigns = parseAllowList(process.env.GOOGLE_ADS_ALLOWED_CAMPAIGN_IDS);
  if (allowedForms.size && !allowedForms.has(String(payload.form_id || ''))) {
    return NextResponse.json({ message: 'Unknown form' }, { status: 403 });
  }
  if (allowedCampaigns.size && !allowedCampaigns.has(String(payload.campaign_id || ''))) {
    return NextResponse.json({ message: 'Unknown campaign' }, { status: 403 });
  }

  try {
    await saveLead(payload);
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error('Google Ads lead webhook error', error instanceof Error ? error.message : error);
    return NextResponse.json({ message: 'Temporary processing error' }, { status: 500 });
  }
}
