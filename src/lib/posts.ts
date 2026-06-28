import { getCollection, type CollectionEntry } from 'astro:content';

// Shared data-loading for the dev log and writing sections. Both collections
// share one schema (see content.config.ts), so the same logic works for
// either — centralized here instead of duplicated across index.astro,
// devlog/index.astro, writing/index.astro, and both [slug].astro routes.

type PostCollection = 'devlog' | 'writing';

export interface PostSummary {
  slug: string;
  title: string;
  description: string;
  date: Date;
  tags: string[];
}

// Drops drafts in production, sorts newest-first, maps to plain objects for
// the PostList component.
export async function loadPosts(collection: PostCollection): Promise<PostSummary[]> {
  const entries = await getCollection(collection, ({ data }) => !data.draft);
  return entries
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((entry) => ({
      slug: entry.id,
      title: entry.data.title,
      description: entry.data.description,
      date: entry.data.date,
      tags: entry.data.tags,
    }));
}

interface NeighborLink {
  href: string;
  title: string;
}

interface PostPageProps {
  entry: CollectionEntry<PostCollection>;
  prev: NeighborLink | null;
  next: NeighborLink | null;
}

// Builds the getStaticPaths() result for a post detail route: every
// non-draft entry in the collection, newest first, each carrying links to
// its chronological neighbors ("prev" = older, "next" = newer).
export async function buildPostPaths(collection: PostCollection, basePath: string) {
  const entries = await getCollection(collection, ({ data }) => !data.draft);
  const sorted = entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return sorted.map((entry, i): { params: { slug: string }; props: PostPageProps } => ({
    params: { slug: entry.id },
    props: {
      entry,
      prev: sorted[i + 1]
        ? { href: `${basePath}/${sorted[i + 1].id}/`, title: sorted[i + 1].data.title }
        : null,
      next: sorted[i - 1]
        ? { href: `${basePath}/${sorted[i - 1].id}/`, title: sorted[i - 1].data.title }
        : null,
    },
  }));
}

// ~200 words per minute, rounded, minimum 1 minute.
export function estimateReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
