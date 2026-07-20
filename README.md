# Violet's Memoirs

A poetry blog for Violette. Next.js 15 (App Router) with Supabase for the
database, auth, comments, likes, and the forum, plus optional Stripe for the
monthly membership. Built to deploy on Vercel.

## What's here

- Home, About, Poems, and Forum: the four tabs, styled after the homepage mock
  (butter-cream ground, violet didone type, the snow-capped violet field).
- Poems with likes (works for anonymous readers too), comments, and a share
  button.
- A forum where readers post ideas and requests. Anyone can read; posting
  needs a free account.
- Three levels: admin (Violette), subscriber (free account), reader (no
  account needed, just visits and reads).
- Sign in, sign up, forgot password, and reset password, all through Supabase
  Auth.
- A members-only "notebook" (behind-the-scenes writing) unlocked by a monthly
  Stripe subscription, or manually by the admin.
- An admin writing desk at /admin for publishing poems.
- SEO: per-page titles and descriptions, canonical URLs, Open Graph tags,
  JSON-LD structured data, sitemap.xml, robots.txt.

## Setup (about 20 minutes)

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com) (free tier is fine
   to start).
2. Open SQL Editor -> New query, paste the whole of `supabase/schema.sql`,
   and run it. This creates every table, index, and Row Level Security policy.
3. In Authentication -> URL Configuration, set the Site URL to your deployed
   domain and add `https://your-domain.com/reset-password` to the redirect
   URLs (plus `http://localhost:3000/reset-password` for local work).
4. Copy the Project URL, anon key, and service role key from
   Project Settings -> API.

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill it in. On Vercel, add the same
variables under Project Settings -> Environment Variables. The service role
key and Stripe keys are server-only secrets; never put them in client code.

### 3. Run locally

```bash
npm install
npm run dev
```

### 4. Make Violette the admin

Sign up through the site with her email, confirm it, then run this in the
Supabase SQL editor:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'violette@example.com');
```

She can now open `/admin` and publish poems.

### 5. Deploy to Vercel

Vercel is the right host here: it's made by the Next.js team, so middleware,
image handling, ISR caching, and the CDN all work with zero configuration,
and the free tier handles a lot of traffic. (Netlify also runs Next.js, but
Vercel needs no adapter.)

1. Push this folder to a GitHub repository.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add the environment variables, deploy, and point your domain at it.

### 6. Stripe (optional, for paid memberships)

The site works fully without Stripe; the membership page will just say
memberships aren't set up yet. Violette can also grant members by hand with
the SQL at the bottom of `schema.sql`.

To turn on paid memberships:

1. In the Stripe dashboard, create a Product with a recurring monthly Price.
   Copy the Price ID into `STRIPE_PRICE_ID`.
2. Copy your secret key into `STRIPE_SECRET_KEY`.
3. Add a webhook endpoint pointing at
   `https://your-domain.com/api/stripe/webhook`, subscribed to
   `checkout.session.completed` and `customer.subscription.deleted`. Copy the
   signing secret into `STRIPE_WEBHOOK_SECRET`.

When someone pays, the webhook flips `is_member` on their profile and the
notebook unlocks. When their subscription is cancelled, it flips back.

## How the three levels work

| Level | How they get it | What they can do |
| --- | --- | --- |
| Reader | Just visits, no account | Read everything public, like poems, share |
| Subscriber | Free sign-up | All of the above, plus comment and post in the forum |
| Admin | Set once via SQL (step 4) | All of the above, plus publish poems and moderate |

Paid membership is a flag on top of a subscriber account (`is_member`), not a
separate level, so a member keeps commenting and posting like any subscriber
and also sees the notebook.

## Security notes

- Every table has Row Level Security on. Even if someone tampers with the
  client, the database refuses writes they aren't allowed to make.
- Users cannot change their own `role` or `is_member`: column-level grants
  only let them edit their display name. Promotion happens via SQL or the
  Stripe webhook (which uses the server-only service role key).
- Middleware refreshes sessions and blocks `/admin` and `/account` for
  signed-out visitors; the database policies remain the real gate.
- Security headers (X-Frame-Options, nosniff, HSTS, referrer and permissions
  policies) are set in `next.config.mjs`.
- Poem bodies and comments render as plain text through React, so pasted
  HTML or scripts show as text instead of running.
- Passwords, sessions, and reset emails are handled by Supabase Auth; this
  code never sees or stores a password.
- Worth adding later if the forum gets busy: Supabase Auth's built-in
  CAPTCHA option, and rate limits (Vercel Firewall or Upstash).

## SEO notes

The technical side is done: unique titles and meta descriptions per page,
canonical URLs, Open Graph and Twitter tags, JSON-LD (WebSite on every page,
CreativeWork on each poem), a sitemap that includes every published public
poem, robots.txt, semantic HTML, fast static rendering for the busiest pages,
and self-explanatory URLs like `/poems/the-color-of-evening`.

Honest caveat: no code can guarantee the #1 spot on Google. Rankings depend
mostly on things outside the codebase: how often Violette publishes, whether
other sites link to hers, and how long the site has existed. Two things help
a lot early on: submit the sitemap in Google Search Console, and use a real
custom domain from day one.

## Performance notes

- The home page and poems index are statically cached and revalidate every
  60 seconds, so heavy traffic hits the CDN, not the database.
- The flower field is inline SVG (a few KB, no image request) and fonts load
  with `display=swap`, so text never blocks on them.
- Interactive pieces (likes, comments, forms) are small client islands;
  everything else is server-rendered.

## Project map

```
src/
  app/            pages and API routes (one folder per tab + auth pages)
  components/     nav, footer, flower field, forms, like/share buttons
  lib/            supabase clients (browser/server/public/admin), types, slug
supabase/
  schema.sql      run this once in the Supabase SQL editor
```
