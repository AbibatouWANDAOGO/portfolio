import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { domainSlugs } from './data/domains';

// Chaque projet = un fichier .md dans src/content/projects/<domaine>/
// Les fichiers qui commencent par "_" (ex. _modele.md) sont ignorés.
const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    domain: z.enum(domainSlugs),
    summary: z.string(),
    date: z.coerce.date(),
    tools: z.array(z.string()).default([]),
    github: z.string().url().optional(),
    notebook: z.string().url().optional(), // lien direct vers le notebook (affiché comme bouton)
    demo: z.string().url().optional(),
    status: z.enum(['terminé', 'en cours']).default('terminé'),
    featured: z.boolean().default(false),
    // draft: true → visible en local (npm run dev) mais pas sur le site publié
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
