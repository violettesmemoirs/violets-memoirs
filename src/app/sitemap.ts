import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://violetsmemoirs.com';

export const revalidate = 3600; // rebuild the sitemap at most once an hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/poems`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/forum`, changeFrequency: 'daily', priority: 0.6 },
  ];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return staticPages;

  try {
    const sb = createClient(url, key);
    const { data } = await sb
      .from('poems')
      .select('slug, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(1000);

    const poemPages: MetadataRoute.Sitemap = (data ?? []).map((p) => ({
      url: `${SITE_URL}/poems/${p.slug}`,
      lastModified: p.created_at,
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

    return [...staticPages, ...poemPages];
  } catch {
    return staticPages;
  }
}
