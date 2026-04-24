# The Ocadiz Family Site — Full Build Reference

> This document contains everything needed to understand, maintain, or rebuild this project from scratch.
> Written for Issac Ocadiz and any LLM picking up this conversation in a future session.

---

## 1. Project Overview

A personal family website for the Ocadiz family, deployed as a static site on GitHub Pages with a custom domain, visitor registry form, and automated email system.

**Live URL:** https://theocadizofvegas.blog
**GitHub Repo:** https://github.com/tnkissac/theocadiz-family
**Local project path:** /Users/issacocadiz/family-site

---

## 2. Family Details

| Person | Name | Role | Bio |
|---|---|---|---|
| Dad | Luis Issac Ocadiz | Dad | Motorcycle enthusiast, hard worker, and hands-on learner |
| Mom | Reyna Isabel Cuevas | Mom | Pool server, loves fashion, and always has the perfect nails |
| Son | Abel Jayson | Son | Two-year-old rockstar that loves fruit snacks a bit too much |
| Baby | Baby A | Baby Girl | Sweet little girl coming to you in May |

**Baby due date:** May 4th, 2026

---

## 3. Tech Stack

| Layer | Technology | Cost |
|---|---|---|
| Site | Plain HTML + CSS + Vanilla JS | Free |
| Hosting | GitHub Pages | Free |
| Custom domain | Namecheap (`theocadizofvegas.blog`) | Paid (domain only) |
| Email sending | Resend (3,000 emails/month) | Free |
| API key protection | Cloudflare Workers (100k req/day) | Free |
| Email inbox | Namecheap Private Email (privateemail.com) | Free (with domain) |

**No frameworks. No build step. Open index.html in browser and it works.**

---

## 4. File Structure

```
/Users/issacocadiz/family-site/
├── index.html           Single-page site
├── styles.css           All styling
├── script.js            Scroll animations + form submission
├── worker.js            Cloudflare Worker source code (reference copy)
├── BUILD_REFERENCE.md   This file
├── README.md            Deployment instructions
└── images/
    ├── README.md        Photo size guide
    ├── luis.jpg         Dad profile photo
    ├── reyna.jpg        Mom profile photo
    ├── abel.jpg         Son profile photo
    ├── baby-a.jpg       Baby A photo (cupcake)
    ├── gallery-1.jpg    through gallery-5.jpg (added so far)
    └── gallery-6.jpg    through gallery-9.jpg (still needed)
```

---

## 5. Design System

| Token | Value |
|---|---|
| Background | `#fdfcfa` (cream) |
| Text | `#1a1a1a` (dark charcoal) |
| Accent | `#c1694f` (terracotta) |
| Accent light | `#f7ede8` |
| Accent mid | `#e8b5a4` |
| Muted text | `#6b6360` |
| Font | Inter (Google Fonts) |
| Card radius | 18px |
| Card shadow | `0 4px 20px rgba(0,0,0,0.08)` |

---

## 6. Site Sections (in order)

1. **Hero** — Full viewport, "The Ocadiz Family", tagline, bounce scroll arrow
2. **Our Family** — 4-card grid (Luis, Reyna, Abel, Baby A)
3. **Our Story** — Single paragraph, cream background
4. **Gallery** — 3×3 CSS grid of family photos
5. **Baby on the Way** — Announcement card, May 4th 2026
6. **Sign Our Registry** — Visitor intake form wired to Cloudflare Worker
7. **Footer** — Family name, "Made with love", year

---

## 7. GitHub Pages Deployment

**Repo:** `theocadiz-family` (public)
**GitHub username:** `tnkissac`
**Branch:** `main`
**Folder:** `/` (root)
**Settings path:** github.com/tnkissac/theocadiz-family/settings/pages

To push updates:
```
git add .
git commit -m "Your message"
git push
```
Site redeploys automatically within ~60 seconds.

---

## 8. Custom Domain Setup

**Domain:** `theocadizofvegas.blog` (purchased on Namecheap)
**Registrar:** Namecheap
**DNS managed at:** Namecheap Advanced DNS

### Complete DNS Records

| Type | Host | Value | Priority | Notes |
|---|---|---|---|---|
| A | @ | 185.199.108.153 | — | GitHub Pages |
| A | @ | 185.199.109.153 | — | GitHub Pages |
| A | @ | 185.199.110.153 | — | GitHub Pages |
| A | @ | 185.199.111.153 | — | GitHub Pages |
| CNAME | www | tnkissac.github.io | — | GitHub Pages www |
| TXT | resend._domainkey | `p=MIGfMA0...` (long DKIM key) | — | Resend DKIM |
| MX | send | feedback-smtp.us-east-1.amazonses.com | 10 | Resend bounce handling |
| TXT | send | `v=spf1 include:amazonses.com ~all` | — | Resend SPF (subdomain) |
| TXT | _dmarc | `v=DMARC1; p=none;` | — | DMARC policy |
| TXT | @ | `v=spf1 include:privateemail.com include:amazonses.com ~all` | — | Root SPF — allows both privateemail AND Resend to send |
| (Auto) | @ | privateemail MX records | — | Auto-configured by Namecheap for private email |

**HTTPS/SSL:** Enforced via GitHub Pages (Let's Encrypt). Check status at github.com/tnkissac/theocadiz-family/settings/pages.

---

## 9. Email System

### How It Works

```
Visitor fills form → script.js POSTs to Cloudflare Worker
→ Worker calls Resend API
→ Resend sends 2 emails:
   1. Thank you email → visitor's inbox
   2. Notification email → hello@theocadizofvegas.blog
```

### Resend Account
- **Site:** resend.com
- **Verified domain:** theocadizofvegas.blog
- **Sending from:** hello@theocadizofvegas.blog (thank you) / noreply@theocadizofvegas.blog (notification)
- **Free tier:** 3,000 emails/month

### Cloudflare Worker
- **Account login:** cloudflare.com
- **Worker name:** shy-mud-4771 (auto-generated)
- **Worker URL:** https://shy-mud-4771.tnkissac828.workers.dev
- **Source file:** worker.js in this repo (reference copy — live code is in Cloudflare dashboard)
- **Secret stored:** `RESEND_API_KEY` (set in Worker Settings → Variables and Secrets)
- **Free tier:** 100,000 requests/day

### Email Inboxes
- **hello@theocadizofvegas.blog** — receives visitor notifications (privateemail.com)
- **luis@innovativeblockchainsolutions.live** — Luis's other privateemail account (confirmed working)

### Email Templates
Both HTML email templates are inside `worker.js`:
- `thankYouHTML(name)` — terracotta header, warm cream body, quote card, sent to visitor
- `notificationHTML(name, email, message)` — dark header, visitor details cards, sent to Luis

---

## 10. Visitor Registry Form

**Fields:** Name (required), Email (required), Message (optional)
**Success state:** Shows green confirmation, resets form
**Error state:** Shows red error message, re-enables button
**Form element ID:** `registryForm`
**Worker URL in script.js:** line 1 — `const WORKER_URL = '...'`

---

## 11. Outstanding Issues (as of build completion)

| Issue | Status | Fix |
|---|---|---|
| Notification email to `hello@theocadizofvegas.blog` not arriving | ⏳ Pending | Root SPF record added (`@` TXT). Wait for DNS propagation (~1hr) then retest. If still failing, set up email forwarding in privateemail.com to forward `hello@` to `luis@innovativeblockchainsolutions.live` |
| Gallery photos 6–9 missing | ⏳ Pending | Drop `gallery-6.jpg` through `gallery-9.jpg` into the images/ folder |
| HTTPS Enforce checkbox | ✅ Should auto-resolve | Check github.com/tnkissac/theocadiz-family/settings/pages — click "Enforce HTTPS" if available |

---

## 12. How to Rebuild from Scratch

If starting over in a new session, here is the full sequence:

1. All site files exist at `/Users/issacocadiz/family-site/`
2. Push to GitHub: `git add . && git commit -m "msg" && git push`
3. GitHub Pages serves from `main` branch root
4. Custom domain configured in GitHub Pages settings + Namecheap DNS (see Section 8)
5. Resend account verified at resend.com — domain `theocadizofvegas.blog`
6. Cloudflare Worker deployed at cloudflare.com — paste `worker.js` content, add `RESEND_API_KEY` secret
7. Worker URL in `script.js` line 1 must match Cloudflare Worker URL
8. Privateemail inbox at privateemail.com — `hello@theocadizofvegas.blog`

---

## 13. Phase 3 Ideas (future)

- Supabase database to store visitor registry entries (view a log of all visitors)
- Photo upload capability
- Password-protected family updates section
