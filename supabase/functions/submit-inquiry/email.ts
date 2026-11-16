// Inquiry emails via Resend (https://resend.com), issue: no emails on submit.
// Optional: if RESEND_API_KEY is unset, nothing is sent and the submission
// still succeeds. Failures are logged, never returned to the visitor.
//
// Secrets:
//   RESEND_API_KEY  Resend API key
//   NOTIFY_EMAIL    where new-inquiry alerts go (you)
//   MAIL_FROM       sender, e.g. "HanBin Marrero-Baik <hello@hanbinbaik.dev>"
//                   (domain must be verified in Resend; until then use
//                   "onboarding@resend.dev", which can only mail your own
//                   Resend account address)

export type InquiryEmail = {
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

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function send(apiKey: string, payload: Record<string, unknown>, label: string) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error(`email ${label} failed`, res.status, await res.text());
  } catch (err) {
    console.error(`email ${label} error`, err instanceof Error ? err.message : err);
  }
}

export async function sendInquiryEmails(q: InquiryEmail): Promise<void> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    console.log('RESEND_API_KEY not set; skipping emails');
    return;
  }
  const from = Deno.env.get('MAIL_FROM') ?? 'onboarding@resend.dev';
  const notify = Deno.env.get('NOTIFY_EMAIL');

  const rows: [string, string][] = [
    ['Name', q.name],
    ['Email', q.email],
    ['Company', q.company ?? '—'],
    ['Project type', q.project_type],
    ['Tools', q.tools.join(', ') || '—'],
    ['Budget', q.budget],
    ['Timeline', q.timeline],
    ['Source', q.source],
    ['Links', q.links ?? '—'],
  ];
  const table = rows
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td>${esc(v)}</td></tr>`)
    .join('');
  const block = (title: string, body: string) =>
    `<h3 style="margin:16px 0 4px">${title}</h3><p style="white-space:pre-wrap;margin:0">${esc(body)}</p>`;

  const jobs: Promise<void>[] = [];

  if (notify) {
    jobs.push(
      send(apiKey, {
        from,
        to: [notify],
        reply_to: q.email,
        subject: `New project inquiry: ${q.name} (${q.project_type})`,
        html: `<table>${table}</table>${block('Problem', q.problem)}${block('Desired outcome', q.outcome)}` +
          `<p style="margin-top:16px">Reply to this email to answer ${esc(q.name)} directly, or open <a href="https://hanbinbaik.dev/inbox/">your inbox</a>.</p>`,
      }, 'owner-notify'),
    );
  }

  jobs.push(
    send(apiKey, {
      from,
      to: [q.email],
      ...(notify ? { reply_to: notify } : {}),
      subject: 'Got your project request — HanBin Marrero-Baik',
      html: `<p>Hi ${esc(q.name)},</p>` +
        `<p>Thanks for reaching out. I received your request and will reply within one business day.</p>` +
        `${block('What you sent', q.problem)}` +
        `<p style="margin-top:16px">If anything changes, just reply to this email.</p><p>— HanBin</p>`,
    }, 'submitter-confirm'),
  );

  await Promise.all(jobs);
}
