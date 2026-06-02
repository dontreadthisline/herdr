import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

function docsPath({ entry }: { entry: string }) {
  // Detect locale prefix so non-root locale slugs become "zh-cn/docs/..." instead of "docs/zh-cn/..."
  // This allows Starlight's slugToLocale() to correctly identify the content locale.
  const localeMatch = entry.match(/^(zh-cn)\//);
  const locale = localeMatch ? localeMatch[1] : '';
  const entryPath = locale ? entry.slice(locale.length + 1) : entry;
  const rawSlug = entryPath.replace(/\.(md|mdx|markdown|mdown|mkdn|mkd|mdwn)$/i, '');
  const baseSlug = rawSlug === 'index' ? 'docs' : `docs/${rawSlug}`;
  return locale ? `${locale}/${baseSlug}` : baseSlug;
}

export const collections = {
  docs: defineCollection({ loader: docsLoader({ generateId: docsPath }), schema: docsSchema() }),
  blog: defineCollection({
    loader: glob({ pattern: '*.md', base: './src/content/blog' }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      draft: z.boolean().default(false),
    }),
  }),
  releases: defineCollection({
    loader: glob({ pattern: '*.md', base: './src/content/releases' }),
    schema: z.object({
      title: z.string(),
      version: z.string(),
      path: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      draft: z.boolean().default(false),
    }),
  }),
};
