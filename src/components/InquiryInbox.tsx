import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/useAuth';
import {
  BUDGETS,
  PROJECT_TYPES,
  SOURCES,
  STATUSES,
  TIMELINES,
  labelFor,
} from '../lib/inquiryOptions';

// Owner inbox for project inquiries (issue #146). Rendered inside
// ProtectedLayout; RLS (public.is_owner()) decides what is visible.

interface Inquiry {
  id: string;
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
  status: string;
  notes: string | null;
  replied_at: string | null;
  created_at: string;
}

const TEMPLATES = {
  good_fit: {
    label: 'Good fit → book a call',
    body: (q: Inquiry) =>
      `Hi ${q.name},\n\nThanks for reaching out about your ${labelFor(PROJECT_TYPES, q.project_type).toLowerCase()} project. ` +
      `From what you described, this is a good fit for what I do.\n\n` +
      `Could we do a 20-minute scoping call this week? Reply with a couple of times that work and I'll send an invite.\n\n` +
      `Best,\nHanBin`,
  },
  need_info: {
    label: 'Need more info',
    body: (q: Inquiry) =>
      `Hi ${q.name},\n\nThanks for the details on your project. A few questions so I can scope it accurately:\n\n` +
      `1. Which accounts/tools would I need access to?\n2. Roughly how many records or runs per day?\n3. Who maintains this after handoff?\n\n` +
      `Best,\nHanBin`,
  },
  not_fit: {
    label: 'Not a fit → refer',
    body: (q: Inquiry) =>
      `Hi ${q.name},\n\nThank you for considering me. This project is outside what I can take on right now, ` +
      `so I don't want to slow you down. I'd suggest looking for a specialist in this area, and I'm happy to point you to someone if helpful.\n\n` +
      `Best of luck,\nHanBin`,
  },
} as const;

type TemplateKey = keyof typeof TEMPLATES;

function fmt(ts: string) {
  return new Date(ts).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export default function InquiryInbox() {
  const { session } = useAuth();
  const [owner, setOwner] = useState<boolean | null>(null);
  const [items, setItems] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<string>('open');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateKey>('good_fit');
  const [notesDraft, setNotesDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data: isOwner, error: rpcError } = await supabase.rpc('is_owner');
      if (rpcError) {
        setError(rpcError.message);
        setLoading(false);
        return;
      }
      setOwner(Boolean(isOwner));
      if (!isOwner) {
        setLoading(false);
        return;
      }
      const { data, error: qError } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (qError) setError(qError.message);
      setItems((data as Inquiry[]) ?? []);
      setLoading(false);
    })();
  }, [session]);

  const visible = useMemo(() => {
    if (filter === 'all') return items;
    if (filter === 'open') return items.filter((i) => ['new', 'replied', 'call_booked'].includes(i.status));
    return items.filter((i) => i.status === filter);
  }, [items, filter]);

  const selected = items.find((i) => i.id === selectedId) ?? null;

  useEffect(() => {
    setNotesDraft(selected?.notes ?? '');
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const patch = async (id: string, changes: Partial<Pick<Inquiry, 'status' | 'notes' | 'replied_at'>>) => {
    const { error: uError } = await supabase.from('inquiries').update(changes).eq('id', id);
    if (uError) {
      setError(uError.message);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...changes } : i)));
  };

  const reply = (q: Inquiry) => {
    const subject = `Re: your ${labelFor(PROJECT_TYPES, q.project_type).toLowerCase()} project`;
    const body = TEMPLATES[template].body(q);
    window.location.href = `mailto:${encodeURIComponent(q.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (q.status === 'new') {
      patch(q.id, { status: 'replied', replied_at: new Date().toISOString() });
    }
  };

  if (loading) return <p className="text-zinc-400">Loading inquiries…</p>;
  if (error) return <p className="text-red-400" role="alert">{error}</p>;
  if (owner === false) {
    return <p className="text-zinc-400">This account isn't authorized to view inquiries.</p>;
  }

  const newCount = items.filter((i) => i.status === 'new').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">
          Inbox {newCount > 0 && <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-900">{newCount} new</span>}
        </h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm"
          aria-label="Filter by status"
        >
          <option value="open">Open</option>
          <option value="all">All</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {visible.length === 0 && <p className="text-zinc-400">No inquiries here yet.</p>}

      <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800">
        {visible.map((q) => (
          <li key={q.id}>
            <button
              onClick={() => setSelectedId(q.id === selectedId ? null : q.id)}
              className={'w-full px-4 py-3 text-left hover:bg-zinc-900 ' + (q.id === selectedId ? 'bg-zinc-900' : '')}
            >
              <div className="flex items-center justify-between gap-3">
                <span className={'font-medium ' + (q.status === 'new' ? 'text-white' : 'text-zinc-300')}>
                  {q.name}{q.company ? ` · ${q.company}` : ''}
                </span>
                <span className="text-xs text-zinc-500">{fmt(q.created_at)}</span>
              </div>
              <div className="mt-1 text-xs text-zinc-400">
                {labelFor(PROJECT_TYPES, q.project_type)} · {labelFor(BUDGETS, q.budget)} · {labelFor(STATUSES, q.status)}
              </div>
            </button>

            {q.id === selectedId && selected && (
              <div className="space-y-4 border-t border-zinc-800 bg-zinc-950 px-4 py-4 text-sm">
                <dl className="grid gap-x-4 gap-y-1 sm:grid-cols-[8rem_1fr]">
                  <dt className="text-zinc-500">Email</dt>
                  <dd><a className="underline" href={`mailto:${selected.email}`}>{selected.email}</a></dd>
                  <dt className="text-zinc-500">Timeline</dt>
                  <dd>{labelFor(TIMELINES, selected.timeline)}</dd>
                  <dt className="text-zinc-500">Source</dt>
                  <dd>{labelFor(SOURCES, selected.source)}</dd>
                  <dt className="text-zinc-500">Tools</dt>
                  <dd>{selected.tools.length ? selected.tools.join(', ') : '—'}</dd>
                  {selected.links && (
                    <>
                      <dt className="text-zinc-500">Links</dt>
                      <dd className="break-all">{selected.links}</dd>
                    </>
                  )}
                  {selected.replied_at && (
                    <>
                      <dt className="text-zinc-500">Replied</dt>
                      <dd>{fmt(selected.replied_at)}</dd>
                    </>
                  )}
                </dl>

                <div>
                  <h3 className="mb-1 font-semibold text-zinc-200">Problem</h3>
                  <p className="whitespace-pre-wrap text-zinc-300">{selected.problem}</p>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-zinc-200">Desired outcome</h3>
                  <p className="whitespace-pre-wrap text-zinc-300">{selected.outcome}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value as TemplateKey)}
                    className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5"
                    aria-label="Reply template"
                  >
                    {(Object.keys(TEMPLATES) as TemplateKey[]).map((k) => (
                      <option key={k} value={k}>{TEMPLATES[k].label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => reply(selected)}
                    className="rounded-md bg-zinc-100 px-4 py-1.5 font-semibold text-zinc-900 hover:bg-white"
                  >
                    Reply by email
                  </button>
                  <select
                    value={selected.status}
                    onChange={(e) => patch(selected.id, { status: e.target.value })}
                    className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5"
                    aria-label="Status"
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="notes" className="mb-1 block font-semibold text-zinc-200">Notes</label>
                  <textarea
                    id="notes"
                    rows={3}
                    maxLength={4000}
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
                  />
                  <button
                    onClick={() => patch(selected.id, { notes: notesDraft || null })}
                    disabled={notesDraft === (selected.notes ?? '')}
                    className="mt-2 rounded-md border border-zinc-600 px-3 py-1 text-xs hover:bg-zinc-800 disabled:opacity-50"
                  >
                    Save notes
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
