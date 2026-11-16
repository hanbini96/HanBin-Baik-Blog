// Option lists for the project intake form (issue #146).
// Keep values in sync with the CHECK constraints in
// supabase/migrations/20261116000000_inquiries.sql and supabase/functions/submit-inquiry.

export const PROJECT_TYPES = [
  { value: 'automation', label: 'Workflow automation (n8n / Zapier / Make)' },
  { value: 'crm_integration', label: 'CRM / HubSpot integration' },
  { value: 'apps_script', label: 'Google Apps Script' },
  { value: 'web_app', label: 'Full stack web app' },
  { value: 'data_pipeline', label: 'Data pipeline / scraping' },
  { value: 'other', label: 'Other' },
] as const;

export const TOOLS = [
  'HubSpot',
  'Google Workspace',
  'Salesforce',
  'Field service (FSM)',
  'Airtable',
  'Slack',
  'Stripe',
] as const;

export const BUDGETS = [
  { value: 'lt_500', label: 'Under $500' },
  { value: '500_2k', label: '$500 – $2k' },
  { value: '2k_5k', label: '$2k – $5k' },
  { value: '5k_plus', label: '$5k+' },
  { value: 'not_sure', label: 'Not sure yet' },
] as const;

export const TIMELINES = [
  { value: 'asap', label: 'ASAP' },
  { value: '2_4_weeks', label: '2–4 weeks' },
  { value: '1_3_months', label: '1–3 months' },
  { value: 'flexible', label: 'Flexible' },
] as const;

export const SOURCES = [
  { value: 'fiverr', label: 'Fiverr' },
  { value: 'upwork', label: 'Upwork' },
  { value: 'contra', label: 'Contra' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'github', label: 'GitHub' },
  { value: 'referral', label: 'Referral' },
  { value: 'search', label: 'Search' },
  { value: 'other', label: 'Other' },
] as const;

export const STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'replied', label: 'Replied' },
  { value: 'call_booked', label: 'Call booked' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
  { value: 'spam', label: 'Spam' },
] as const;

export function labelFor(list: readonly { value: string; label: string }[], value: string): string {
  return list.find((o) => o.value === value)?.label ?? value;
}
