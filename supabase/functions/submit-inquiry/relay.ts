// Sends inquiry emails through the Apps Script Gmail relay
// (apps-script/inquiry-relay). Best-effort: never fails the submission.
//
// Function secrets (synced by db.yml):
//   GMAIL_RELAY_URL     the web app's /exec URL
//   GMAIL_RELAY_SECRET  shared secret, same as RELAY_SECRET in the script
//
// Supabase Edge Functions can't open SMTP ports 25/587, so mail goes out over
// HTTPS through Apps Script, which sends from your Gmail account.

export type InquiryPayload = {
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

export async function relayInquiryEmails(inquiry: InquiryPayload): Promise<void> {
  const url = Deno.env.get('GMAIL_RELAY_URL');
  const secret = Deno.env.get('GMAIL_RELAY_SECRET');
  if (!url || !secret) {
    console.log('GMAIL_RELAY_URL/SECRET not set; skipping emails');
    return;
  }
  try {
    // Apps Script answers with a 302 to googleusercontent.com; fetch follows it.
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, inquiry }),
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });
    const text = await res.text();
    let out: { ok?: boolean; error?: string } = {};
    try {
      out = JSON.parse(text);
    } catch {
      /* Apps Script returned HTML (e.g. auth page or error) */
    }
    if (!res.ok || out.ok !== true) {
      console.error('gmail relay failed', res.status, out.error ?? text.slice(0, 300));
    }
  } catch (err) {
    console.error('gmail relay error', err instanceof Error ? err.message : err);
  }
}
