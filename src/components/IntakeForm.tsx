import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BUDGETS, PROJECT_TYPES, SOURCES, TIMELINES, TOOLS } from '../lib/inquiryOptions';

// Project intake form (issue #146). Submits to the `submit-inquiry` Edge
// Function, which verifies Turnstile and writes with the service role.

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined;
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const input =
  'w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-400 focus:outline-none';
const label = 'block text-sm font-medium text-zinc-200 mb-1';

export default function IntakeForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [tools, setTools] = useState<string[]>([]);
  const [token, setToken] = useState('');
  const startedAt = useRef(Date.now());
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>();

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !widgetRef.current) return;
    const render = () => {
      if (!window.turnstile || !widgetRef.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(widgetRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'dark',
        callback: (t: string) => setToken(t),
        'expired-callback': () => setToken(''),
      });
    };
    if (window.turnstile) {
      render();
      return;
    }
    let script = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = TURNSTILE_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', render);
    return () => script?.removeEventListener('load', render);
  }, []);

  const toggleTool = (tool: string) =>
    setTools((prev) => (prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const otherTool = String(form.get('otherTool') ?? '').trim();

    if (TURNSTILE_SITE_KEY && !token) {
      setStatus('error');
      setMessage('Please complete the verification check.');
      return;
    }

    setStatus('sending');
    setMessage('');

    const payload = {
      name: form.get('name'),
      email: form.get('email'),
      company: form.get('company'),
      project_type: form.get('project_type'),
      tools: otherTool ? [...tools, otherTool] : tools,
      problem: form.get('problem'),
      outcome: form.get('outcome'),
      budget: form.get('budget'),
      timeline: form.get('timeline'),
      links: form.get('links'),
      source: form.get('source'),
      consent: form.get('consent') === 'on',
      website: form.get('website'),
      startedAt: startedAt.current,
      turnstileToken: token,
    };

    const { error } = await supabase.functions.invoke('submit-inquiry', { body: payload });

    if (error) {
      let detail = 'Something went wrong. Please try again, or email me directly.';
      try {
        const body = await (error as { context?: Response }).context?.json();
        if (body?.error === 'invalid_fields') {
          detail = `Please check: ${(body.fields as string[]).join(', ')}.`;
        } else if (body?.error === 'captcha_failed') {
          detail = 'Verification failed. Please retry the check.';
        }
      } catch {
        /* keep generic message */
      }
      setStatus('error');
      setMessage(detail);
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
      setToken('');
      return;
    }

    setStatus('sent');
  };

  if (status === 'sent') {
    return (
      <div className="rounded-lg border border-emerald-700/60 bg-emerald-950/40 p-6">
        <h2 className="text-lg font-semibold text-emerald-200 mb-2">Thanks — request received.</h2>
        <p className="text-sm text-zinc-300">
          You'll get a confirmation email shortly. I reply to every request within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="name">Name *</label>
          <input id="name" name="name" required maxLength={120} className={input} autoComplete="name" />
        </div>
        <div>
          <label className={label} htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" required maxLength={254} className={input} autoComplete="email" />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="company">Company / organization</label>
        <input id="company" name="company" maxLength={160} className={input} autoComplete="organization" />
      </div>

      <div>
        <label className={label} htmlFor="project_type">Project type *</label>
        <select id="project_type" name="project_type" required defaultValue="" className={input}>
          <option value="" disabled>Choose one</option>
          {PROJECT_TYPES.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className={label}>Tools involved</legend>
        <div className="flex flex-wrap gap-2">
          {TOOLS.map((tool) => (
            <label
              key={tool}
              className={
                'cursor-pointer rounded-full border px-3 py-1 text-xs ' +
                (tools.includes(tool)
                  ? 'border-zinc-300 bg-zinc-200 text-zinc-900'
                  : 'border-zinc-700 text-zinc-300 hover:border-zinc-500')
              }
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={tools.includes(tool)}
                onChange={() => toggleTool(tool)}
              />
              {tool}
            </label>
          ))}
        </div>
        <input name="otherTool" maxLength={60} placeholder="Other tool (optional)" className={input + ' mt-2'} />
      </fieldset>

      <div>
        <label className={label} htmlFor="problem">What manual work or problem do you want gone? *</label>
        <textarea id="problem" name="problem" required minLength={10} maxLength={4000} rows={4} className={input} />
      </div>

      <div>
        <label className={label} htmlFor="outcome">What does "done" look like? *</label>
        <textarea id="outcome" name="outcome" required minLength={10} maxLength={4000} rows={3} className={input} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={label} htmlFor="budget">Budget *</label>
          <select id="budget" name="budget" required defaultValue="" className={input}>
            <option value="" disabled>Choose</option>
            {BUDGETS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="timeline">Timeline *</label>
          <select id="timeline" name="timeline" required defaultValue="" className={input}>
            <option value="" disabled>Choose</option>
            {TIMELINES.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="source">How did you find me? *</label>
          <select id="source" name="source" required defaultValue="" className={input}>
            <option value="" disabled>Choose</option>
            {SOURCES.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={label} htmlFor="links">Links (specs, screenshots, docs)</label>
        <input id="links" name="links" maxLength={1000} placeholder="https://…" className={input} />
        <p className="mt-1 text-xs text-zinc-500">Please don't share passwords or API keys here.</p>
      </div>

      <label className="flex items-start gap-2 text-sm text-zinc-300">
        <input type="checkbox" name="consent" required className="mt-1" />
        <span>OK to contact me about this project. *</span>
      </label>

      {TURNSTILE_SITE_KEY && <div ref={widgetRef} />}

      {status === 'error' && <p className="text-sm text-red-400" role="alert">{message}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="rounded-md bg-zinc-100 px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Send request'}
      </button>

      <p className="text-xs text-zinc-500">
        Your details are stored only to respond to this request and are never shared. Email me to have them deleted.
      </p>
    </form>
  );
}
