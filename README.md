# Violet's Memoirs

Violette's poetry site. Next.js 15 (App Router) with Supabase for the
database, auth, comments, likes, and the forum. Built to deploy on Vercel.

## What's here

- Home, About, Poems, and Forum: the four tabs, styled after the homepage mock
  (butter-cream ground, violet didone type, the snow-capped violet field,
  now with drifting snow, snow-capped pines, and a couple of deeper indigo
  blooms for more depth and color).
- Poems with likes (works for anonymous readers too), comments, and a share
  button.
- A forum with two ways to post: a quick chat for anything short, no form to
  fill out, and a formal thread option for longer ideas or requests. Anyone
  can read; posting needs a free account.
- Two levels: admin (Violette) and reader (anyone with a free account can
  comment and post; anyone at all, account or not, can read).
- Sign in, sign up, forgot password, and reset password, all through Supabase
  Auth.
- An admin writing desk at /admin for publishing poems.
- SEO: per-page titles and descriptions, canonical URLs, Open Graph tags,
  JSON-LD structured data, sitemap.xml, robots.txt.

## Setup (about 20 minutes)

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com) (free tier is fine
   to start).
2. Open SQL Editor -> New query, paste the whole of `supabase/schema.sql`,
   and run it. This creates every table, index, and Row Level Security policy.
   It's safe to re-run later too (say, after an update to this project) --
   objects are dropped and recreated where needed.
3. In Authentication -> URL Configuration, set the Site URL to your deployed
   domain and add `https://your-domain.com/reset-password` to the redirect
   URLs (plus `http://localhost:3000/reset-password` for local work).
4. Copy the Project URL and anon key from Project Settings -> API.

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill it in. On Vercel, add the same
variables under Project Settings -> Environment Variables.

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

## How the two levels work

| Level | How they get it | What they can do |
| --- | --- | --- |
| Reader | Just visits, no account | Read everything, like poems, share |
| Reader with an account | Free sign-up | All of the above, plus comment and post in the forum |
| Admin | Set once via SQL (step 4) | All of the above, plus publish poems |

## Security notes

- Every table has Row Level Security on. Even if someone tampers with the
  client, the database refuses writes they aren't allowed to make.
- Users cannot change their own `role`: column-level grants only let them
  edit their display name. Promotion to admin only happens via SQL.
- Middleware refreshes sessions and blocks `/admin` and `/account` for
  signed-out visitors; the database policies remain the real gate.
- Security headers (X-Frame-Options, nosniff, HSTS, referrer and permissions
  policies) are set in `next.config.mjs`.
- Poem bodies, comments, and chat messages render as plain text through
  React, so pasted HTML or scripts show as text instead of running.
- Passwords, sessions, and reset emails are handled by Supabase Auth; this
  code never sees or stores a password.
- Worth adding later if the forum or chat gets busy: Supabase Auth's built-in
  CAPTCHA option, and rate limits (Vercel Firewall or Upstash).

## SEO notes

The technical side is done: unique titles and meta descriptions per page,
canonical URLs, Open Graph and Twitter tags, JSON-LD (WebSite on every page,
CreativeWork on each poem), a sitemap that includes every published poem,
robots.txt, semantic HTML, fast static rendering for the busiest pages,
and self-explanatory URLs like `/poems/the-color-of-evening`.

Honest caveat: no code can guarantee the #1 spot on Google. Rankings depend
mostly on things outside the codebase: how often Violette publishes, whether
other sites link to hers, and how long the site has existed. Two things help
a lot early on: submit the sitemap in Google Search Console, and use a real
custom domain from day one.

## Performance notes

- The home page and poems index are statically cached and revalidate every
  60 seconds, so heavy traffic hits the CDN, not the database.
- The flower field is inline SVG (a few KB, no image request), the ambient
  snow is CSS-only, and fonts load with `display=swap`, so nothing blocks on
  network requests. Both respect prefers-reduced-motion.
- Interactive pieces (likes, comments, chat, forms) are small client islands;
  everything else is server-rendered.

## Note on a past version

An earlier draft of this project had a paid membership tier through Stripe.
That's been removed at Violette's request -- everything published is simply
public now. If your Supabase project still has the old `is_member` /
`stripe_customer_id` columns from a previous run of `schema.sql`, they're
harmless left as-is (nothing reads them anymore), but you can drop them with:

```sql
alter table public.profiles drop column if exists is_member;
alter table public.profiles drop column if exists stripe_customer_id;
alter table public.poems drop column if exists members_only;
```

## Project map

```
src/
  app/            pages and API routes (one folder per tab + auth pages)
  components/     nav, footer, flower field, snowfall, forms, chat, likes
  lib/            supabase clients (browser/server/public), types, slug
supabase/
  schema.sql      run this once in the Supabase SQL editor
```
