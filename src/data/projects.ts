import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export interface Project {
  slug: string; // ex. "ai-engineer/agent-combat-q-learning"
  entry: CollectionEntry<'projects'>;
  fallback: boolean; // true = pas encore traduit, on affiche la version française
}

// Projets publiés dans la langue demandée (ou en français s'ils ne sont pas traduits),
// du plus récent au plus ancien. Les brouillons n'apparaissent qu'en local.
export async function getProjects(lang: Lang, domain?: string): Promise<Project[]> {
  const all = await getCollection('projects', ({ data }) => import.meta.env.DEV || !data.draft);

  // Les fichiers sont rangés par langue : fr/<domaine>/<projet>.md et en/<domaine>/<projet>.md
  const versions = new Map<string, Partial<Record<Lang, CollectionEntry<'projects'>>>>();
  for (const entry of all) {
    const [entryLang, ...rest] = entry.id.split('/');
    const slug = rest.join('/');
    versions.set(slug, { ...versions.get(slug), [entryLang]: entry });
  }

  return [...versions]
    .flatMap(([slug, v]) => {
      const entry = v[lang] ?? v.fr ?? v.en;
      return entry ? [{ slug, entry, fallback: !v[lang] }] : [];
    })
    .filter((p) => !domain || p.entry.data.domain === domain)
    .sort((a, b) => b.entry.data.date.getTime() - a.entry.data.date.getTime());
}

export function formatDate(date: Date, lang: Lang) {
  return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { month: 'long', year: 'numeric' });
}
