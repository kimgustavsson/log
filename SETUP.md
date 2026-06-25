# Setup & deployment

Follow these in order. Steps 1–2 get the site running locally. Steps 3–5 add
the view counter and comments. Step 6 deploys.

## 1. Install

You need Node 18+ (you have a recent version). In the project folder:

```bash
npm install
npm run dev
```

Open the printed localhost URL. The site works fully right now — view counts
and comments are just inactive until you do the steps below.

## 2. Make it yours

- Replace `your name` in `src/components/Nav.astro` and `Footer.astro`.
- Set your real LinkedIn/GitHub URLs in those same two files.
- Set `site:` in `astro.config.mjs` to your final domain.
- Edit the hero copy in `src/components/Hero.astro` (or pass props from
  `src/pages/index.astro`).
- Add your own posts in `src/content/posts/` and delete the samples.

## 3. View counter (Supabase)

1. Create a free project at supabase.com.
2. In the SQL editor, run:

   ```sql
   -- Table: one row per post slug
   create table post_views (
     slug text primary key,
     count integer not null default 0
   );

   -- Enable Row Level Security
   alter table post_views enable row level security;

   -- Allow anyone to READ counts
   create policy "read counts" on post_views
     for select using (true);

   -- Atomic increment via a function (creates the row if missing)
   create or replace function increment_view(page_slug text)
   returns integer
   language plpgsql
   security definer
   as $$
   declare new_count integer;
   begin
     insert into post_views (slug, count) values (page_slug, 1)
     on conflict (slug) do update set count = post_views.count + 1
     returning count into new_count;
     return new_count;
   end;
   $$;
   ```

3. Copy `.env.example` to `.env` and paste your Project URL and anon key
   (Supabase dashboard → Project Settings → API).
4. Restart `npm run dev`. View counts now increment.

Note: the anon key is safe in the browser because RLS only permits reading and
the controlled increment function — nothing else.

## 4. Comments (Giscus)

1. Push this repo to GitHub (public).
2. Enable **Discussions** on the repo (Settings → General → Features).
3. Install the Giscus app: https://github.com/apps/giscus
4. Go to https://giscus.app, enter your repo, pick the "Announcements"
   category, and copy the generated `data-repo-id` and `data-category-id`.
5. Paste those four values into the `GISCUS` object in
   `src/components/Comments.astro`.

Heads-up: Giscus requires commenters to sign in with GitHub. If you later want
login-free comments, replace only `Comments.astro` with a Supabase-backed
version — nothing else in the project depends on Giscus.

## 5. Add your photos to the hero trail (optional)

Drop images into `public/photos/`, then edit the `images` array in
`src/scripts/photo-trail.ts` to point at them, e.g. `['/photos/1.jpg', ...]`.

## 6. Deploy (Vercel)

1. Push to GitHub.
2. Import the repo at vercel.com (it auto-detects Astro).
3. Add the two env vars (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`)
   in the Vercel project settings.
4. Deploy. Every push to main redeploys automatically.

(GitHub Pages also works since the output is static, but Vercel handles the
env vars and future server features more cleanly.)
