// Supabase Edge Function: submit-inquiry (issue #146)
// Verifies Cloudflare Turnstile + honeypot, validates input, inserts with the
// service role. The browser never writes to `public.inquiries` directly.
//
// Secrets (supabase secrets set ...):
//   TURNSTILE_SECRET   Cloudflare Turnstile secret key (required in prod)
//   ALLOWED_ORIGINS    comma-separated, default hanbinbaik.dev (+www) and hanbini96.github.io
//   TURNSTILE_DISABLED "true" only for local dev
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected by Supabase.

import { createClient } from 'jsr:@supabase/supabase-js@2';

const ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') ?? 'https://hanbinbaik.dev,https://www.hanbinbaik.dev,https://hanbini96.github.io')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const PROJECT_TYPES = ['automation', 'crm_integration', 'apps_script', 'web_app', 'data_pipeline', 'other'];
const BUDGETS = ['lt_500', '500_2k', '2k_5k', '5k_plus', 'not_sure'];
const TIMELINES = ['asap', '2_4_weeks', '1_3_months', 'flexible'];
const SOURCES = ['fiverr', 'upwork', 'contra', 'linkedin', 'github', 'referral', 'search', 'other'];
const MIN_FILL_MS = 3000;

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  });
}

const INVALID = Symbol('invalid');

// Trimmed string within [min, max]; optional fields (min 0) may be empty → null.
function str(v: unknown, max: number, min = 0): string | null | typeof INVALID {
  if (v === undefined || v === null) return min === 0 ? null : INVALID;
  if (typeof v !== 'string') return INVALID;
  const s = v.trim();
  if (s.length < min || s.length > max) return INVALID;
  return s.length ? s : null;
}

type Fields = {
  name: string;
  email: string;
  company: string | null;
  project_type: string;
  tools: string[];
  problem: string;
  outcome: string;
  budget: string;
  timeline: string;
  links: string | null;
  source: string;
};

export function validate(body: Record<string, unknown>): { ok: true; data: Fields } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const name = str(body.name, 120, 1);
  const email = str(body.email, 254, 3);
  const company = str(body.company, 160);
  const problem = str(body.problem, 4000, 10);
  const outcome = str(body.outcome, 4000, 10);
  const links = str(body.links, 1000);

  if (typeof name !== 'string') errors.push('name');
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('email');
  if (company === INVALID) errors.push('company');
  if (typeof problem !== 'string') errors.push('problem');
  if (typeof outcome !== 'string') errors.push('outcome');
  if (links === INVALID) errors.push('links');
  if (!PROJECT_TYPES.includes(body.project_type as string)) errors.push('project_type');
  if (!BUDGETS.includes(body.budget as string)) errors.push('budget');
  if (!TIMELINES.includes(body.timeline as string)) errors.push('timeline');
  if (!SOURCES.includes(body.source as string)) errors.push('source');

  const tools = Array.isArray(body.tools) ? body.tools : [];
  if (tools.length > 12 || tools.some((t) => typeof t !== 'string' || t.length > 60)) errors.push('tools');

  if (body.consent !== true) errors.push('consent');

  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    data: {
      name: name as string,
      email: (email as string).toLowerCase(),
      company: company as string | null,
      project_type: body.project_type as string,
      tools: (tools as string[]).map((t) => t.trim()).filter(Boolean),
      problem: problem as string,
      outcome: outcome as string,
      budget: body.budget as string,
      timeline: body.timeline as string,
      links: links as string | null,
      source: body.source as string,
    },
  };
}

async function verifyTurnstile(token: unknown, ip: string | null): Promise<boolean> {
  if (Deno.env.get('TURNSTILE_DISABLED') === 'true') return true;
  const secret = Deno.env.get('TURNSTILE_SECRET');
  if (!secret || typeof token !== 'string' || !token) return false;
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });
  const out = await res.json().catch(() => ({ success: false }));
  return out.success === true;
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(origin) });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, origin);
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return json({ error: 'origin_not_allowed' }, 403, origin);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid_json' }, 400, origin);
  }

  // Honeypot + minimum fill time: answer 200 so bots get no signal.
  const startedAt = Number(body.startedAt);
  if ((typeof body.website === 'string' && body.website.length > 0) ||
      !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return json({ ok: true }, 200, origin);
  }

  const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return json({ error: 'captcha_failed' }, 400, origin);
  }

  const result = validate(body);
  if (!result.ok) return json({ error: 'invalid_fields', fields: result.errors }, 400, origin);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  );

  const { error } = await supabase.from('inquiries').insert({
    ...result.data,
    user_agent: req.headers.get('user-agent')?.slice(0, 400) ?? null,
  });

  if (error) {
    console.error('insert failed', error.message);
    return json({ error: 'server_error' }, 500, origin);
  }
  return json({ ok: true }, 200, origin);
});
