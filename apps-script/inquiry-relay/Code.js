/**
 * Inquiry email relay (Apps Script web app).
 *
 * The `submit-inquiry` Supabase Edge Function POSTs each saved inquiry here.
 * This script sends, from the deploying Gmail account:
 *   1. an alert to NOTIFY_EMAIL (reply-to = the submitter)
 *   2. a confirmation to the submitter (reply-to = NOTIFY_EMAIL)
 * and optionally appends a row to a Google Sheet (LEAD_SHEET_ID).
 *
 * Why Apps Script: Supabase Edge Functions can't open SMTP ports 25/587, and
 * this keeps mail in Gmail (Sent folder) with no DNS setup. Free quota for a
 * consumer Gmail account is 100 recipients/day (2 per inquiry).
 *
 * Script properties (Project Settings → Script properties):
 *   RELAY_SECRET   shared secret, same value as GMAIL_RELAY_SECRET in Supabase
 *   NOTIFY_EMAIL   where alerts go
 *   SENDER_NAME    optional display name (default "HanBin Marrero-Baik")
 *   LEAD_SHEET_ID  optional spreadsheet ID for a lead log
 *
 * Deployed by .github/workflows/apps-script.yml with clasp.
 */

function doPost(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var secret = props.getProperty('RELAY_SECRET');
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    if (!secret || !constantTimeEquals_(String(body.secret || ''), secret)) {
      return json_({ ok: false, error: 'unauthorized' });
    }

    var q = body.inquiry || {};
    if (!q.email || !q.name) return json_({ ok: false, error: 'invalid' });

    var notify = props.getProperty('NOTIFY_EMAIL');
    var senderName = props.getProperty('SENDER_NAME') || 'HanBin Marrero-Baik';
    var results = { owner: 'skipped', submitter: 'skipped', sheet: 'skipped' };

    if (notify) {
      MailApp.sendEmail({
        to: notify,
        replyTo: q.email,
        name: senderName,
        subject: 'New project inquiry: ' + q.name + ' (' + q.project_type + ')',
        htmlBody: ownerHtml_(q),
      });
      results.owner = 'sent';
    }

    MailApp.sendEmail({
      to: q.email,
      replyTo: notify || undefined,
      name: senderName,
      subject: 'Got your project request — ' + senderName,
      htmlBody: confirmHtml_(q),
    });
    results.submitter = 'sent';

    var sheetId = props.getProperty('LEAD_SHEET_ID');
    if (sheetId) {
      appendLead_(sheetId, q);
      results.sheet = 'appended';
    }

    return json_({ ok: true, results: results, remainingQuota: MailApp.getRemainingDailyQuota() });
  } catch (err) {
    console.error('relay failed', err && err.stack ? err.stack : err);
    return json_({ ok: false, error: 'relay_error' });
  }
}

/** Health check: GET returns remaining daily quota, no secrets. */
function doGet() {
  return json_({ ok: true, remainingQuota: MailApp.getRemainingDailyQuota() });
}

function ownerHtml_(q) {
  var rows = [
    ['Name', q.name],
    ['Email', q.email],
    ['Company', q.company || '—'],
    ['Project type', q.project_type],
    ['Tools', (q.tools || []).join(', ') || '—'],
    ['Budget', q.budget],
    ['Timeline', q.timeline],
    ['Source', q.source],
    ['Links', q.links || '—'],
  ]
    .map(function (r) {
      return '<tr><td style="padding:4px 12px 4px 0;color:#666">' + r[0] + '</td><td>' + esc_(r[1]) + '</td></tr>';
    })
    .join('');
  return (
    '<table>' + rows + '</table>' +
    block_('Problem', q.problem) +
    block_('Desired outcome', q.outcome) +
    '<p style="margin-top:16px">Reply to answer ' + esc_(q.name) +
    ' directly, or open <a href="https://hanbinbaik.dev/inbox/">your inbox</a>.</p>'
  );
}

function confirmHtml_(q) {
  return (
    '<p>Hi ' + esc_(q.name) + ',</p>' +
    '<p>Thanks for reaching out. I received your request and will reply within one business day.</p>' +
    block_('What you sent', q.problem) +
    '<p style="margin-top:16px">If anything changes, just reply to this email.</p><p>— HanBin</p>'
  );
}

function appendLead_(sheetId, q) {
  var sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Received', 'Name', 'Email', 'Company', 'Project type', 'Budget', 'Timeline', 'Source', 'Problem']);
  }
  sheet.appendRow([new Date(), q.name, q.email, q.company || '', q.project_type, q.budget, q.timeline, q.source, q.problem]);
}

function block_(title, text) {
  return '<h3 style="margin:16px 0 4px">' + title + '</h3><p style="white-space:pre-wrap;margin:0">' + esc_(text) + '</p>';
}

function esc_(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function constantTimeEquals_(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
