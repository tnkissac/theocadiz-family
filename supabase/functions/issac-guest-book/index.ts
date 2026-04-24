// issac-guest-book
//
// Public form intake for theocadizofvegas.blog guest book.
// Validates input, saves to issac_guest_book table, sends two Resend
// emails: thank-you to the visitor + notification to Isaac.
//
// verify_jwt = false — public form, no Supabase auth required. Input is
// validated inside the function.
//
// Env vars:
//   RESEND_API_KEY               — Resend API key (Supabase secret)
//   SUPABASE_URL                 — built-in
//   SUPABASE_SERVICE_ROLE_KEY    — built-in
//   ISSAC_NOTIFY_EMAIL           — where owner notifications go (e.g. a Gmail)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const RESEND_KEY   = Deno.env.get('RESEND_API_KEY') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SB_SRK       = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const NOTIFY_EMAIL = Deno.env.get('ISSAC_NOTIFY_EMAIL') ?? '';
const FROM_ADDRESS = 'The Ocadiz Family <noreply@theocadizofvegas.blog>';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const JSON_H = { ...CORS, 'Content-Type': 'application/json' };

function respond(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: JSON_H });
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_ADDRESS, to, subject, html }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error('[issac-guest-book] Resend error:', res.status, errText.slice(0, 300));
  }
  return res.ok;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST')    return respond(405, { error: 'method not allowed' });

  let body: any;
  try { body = await req.json(); } catch { return respond(400, { error: 'invalid JSON' }); }

  const name    = String(body.name    ?? '').trim().slice(0, 200);
  const email   = String(body.email   ?? '').trim().slice(0, 320);
  const message = String(body.message ?? '').trim().slice(0, 5000);

  if (!name || !email) {
    return respond(400, { error: 'name and email are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return respond(400, { error: 'invalid email format' });
  }

  // Save submission
  const sbAdmin = createClient(SUPABASE_URL, SB_SRK, { auth: { persistSession: false } });
  const { error: insertErr } = await sbAdmin
    .from('issac_guest_book')
    .insert({ name, email, message });
  if (insertErr) {
    console.error('[issac-guest-book] insert error:', insertErr.message);
    // Still try to send emails — submission is more important than the log
  }

  const visitorHtml      = thankYouHTML(name);
  const notificationHtml = notificationHTML(name, email, message);

  await Promise.all([
    sendEmail(email, 'Thank you for visiting — The Ocadiz Family', visitorHtml),
    NOTIFY_EMAIL ? sendEmail(NOTIFY_EMAIL, `New visitor: ${name}`, notificationHtml) : Promise.resolve(false),
  ]);

  return respond(200, { ok: true });
});

// ─── Thank You Email (sent to visitor) ──────────────────────────────────────

function thankYouHTML(name: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You — The Ocadiz Family</title>
</head>
<body style="margin:0;padding:0;background-color:#fdfcfa;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdfcfa;padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#c1694f;padding:44px 48px 40px;text-align:center;">
              <p style="margin:0 0 14px;font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.75);">The Ocadiz Family</p>
              <h1 style="margin:0;font-size:30px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;line-height:1.15;">Thank you for stopping by 🤍</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:44px 48px 36px;">
              <p style="margin:0 0 18px;font-size:17px;font-weight:600;color:#1a1a1a;">Hey ${name}!</p>
              <p style="margin:0 0 18px;font-size:15px;color:#6b6360;line-height:1.75;">
                Thank you so much for signing our visitor registry. It genuinely means the world to us
                that you took a moment to visit our little corner of the internet.
              </p>
              <p style="margin:0 0 36px;font-size:15px;color:#6b6360;line-height:1.75;">
                We're the Ocadiz family — Luis, Reyna, Abel, and our baby girl on the way — and we're
                grateful to share our story with you. Our family wishes you nothing but the best.
              </p>

              <!-- Quote card -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#f7ede8;border-left:3px solid #c1694f;border-radius:0 8px 8px 0;padding:18px 20px;">
                    <p style="margin:0;font-size:14px;font-style:italic;color:#c1694f;line-height:1.6;">
                      "Growing with love, one day at a time."
                    </p>
                    <p style="margin:8px 0 0;font-size:12px;font-weight:600;color:#1a1a1a;">— The Ocadiz Family</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f7ede8;padding:24px 48px;text-align:center;border-top:1px solid #ece8e3;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#1a1a1a;">The Ocadiz Family</p>
              <p style="margin:0;font-size:12px;color:#6b6360;">
                <a href="https://theocadizofvegas.blog" style="color:#c1694f;text-decoration:none;">theocadizofvegas.blog</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Notification Email (sent to Luis) ──────────────────────────────────────

function notificationHTML(name: string, email: string, message: string) {
  const messageRow = message ? `
              <tr>
                <td height="8"></td>
              </tr>
              <tr>
                <td style="padding:16px 18px;background-color:#f7ede8;border-radius:8px;">
                  <p style="margin:0 0 4px;font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#c1694f;">Message</p>
                  <p style="margin:0;font-size:15px;color:#1a1a1a;line-height:1.6;">${message}</p>
                </td>
              </tr>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Visitor</title>
</head>
<body style="margin:0;padding:0;background-color:#fdfcfa;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdfcfa;padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#1a1a1a;padding:36px 48px;text-align:center;">
              <p style="margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.4);">theocadizofvegas.blog</p>
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.01em;">New Visitor Registry Entry</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px;">
              <p style="margin:0 0 28px;font-size:14px;color:#6b6360;">Someone just signed your visitor registry!</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:16px 18px;background-color:#f7ede8;border-radius:8px 8px 0 0;border-bottom:1px solid #ece8e3;">
                    <p style="margin:0 0 4px;font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#c1694f;">Name</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#1a1a1a;">${name}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;background-color:#f7ede8;border-radius:0 0 8px 8px;">
                    <p style="margin:0 0 4px;font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#c1694f;">Email</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#1a1a1a;">${email}</p>
                  </td>
                </tr>
                ${messageRow}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f7ede8;padding:20px 48px;text-align:center;border-top:1px solid #ece8e3;">
              <p style="margin:0;font-size:12px;color:#6b6360;">The Ocadiz Family — Visitor Registry</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
