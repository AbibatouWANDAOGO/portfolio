// Langues du site et textes de l'interface (menus, boutons, titres de sections).
// Le français est servi à la racine du site, l'anglais sous /en/.
export const languages = { fr: 'FR', en: 'EN' } as const;
export type Lang = keyof typeof languages;
export const langs = Object.keys(languages) as Lang[];

// Lien interne qui respecte le "base" de astro.config.mjs (nécessaire sur GitHub Pages)
export function url(path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

const routes = {
  fr: { domains: 'domaines', projects: 'projets' },
  en: { domains: 'domains', projects: 'projects' },
};

const prefix = (lang: Lang) => (lang === 'fr' ? '' : `${lang}/`);

export const homePath = (lang: Lang, hash = '') => url(`${prefix(lang)}${hash}`);
export const domainPath = (lang: Lang, slug: string) => url(`${prefix(lang)}${routes[lang].domains}/${slug}`);
export const projectPath = (lang: Lang, slug: string) => url(`${prefix(lang)}${routes[lang].projects}/${slug}`);

export const ui = {
  fr: {
    nav: { experience: 'Expérience', education: 'Formation', projects: 'Projets', skills: 'Compétences', contact: 'Contact' },
    switchTo: 'Lire en français',
    hello: 'Bonjour, je suis',
    viewProjects: 'Voir mes projets',
    contactMe: 'Me contacter',
    myCv: 'Mon CV',
    photoOf: 'Photo de',
    experience: { eyebrow: 'Parcours professionnel', title: 'Expérience' },
    education: { eyebrow: 'Parcours académique', title: 'Formation' },
    certifications: 'Certifications',
    languagesTitle: 'Langues',
    interests: "Centres d'intérêt",
    projects: {
      eyebrow: 'Projets',
      title: 'Mes domaines',
      lead: 'Choisis un domaine pour voir les projets associés : contexte, problème, solution, outils, difficultés et résultats.',
      soon: 'Bientôt',
      count: (n: number) => `${n} projet${n > 1 ? 's' : ''}`,
      featured: 'Projets à la une',
    },
    skills: { eyebrow: 'Expertise', title: 'Compétences' },
    associations: { eyebrow: 'Engagement', title: 'Associations' },
    contact: {
      eyebrow: 'Contact',
      title: 'Travaillons ensemble',
      lead: 'Un projet data, une collaboration ou simplement une question ? Écris-moi, je réponds avec plaisir.',
    },
    domain: {
      back: '← Tous les domaines',
      eyebrow: 'Domaine',
      emptyTitle: 'Projets à venir',
      emptyText: 'Je travaille sur des projets dans ce domaine. Ils apparaîtront ici très bientôt.',
    },
    project: {
      crumbs: 'Projets',
      inProgress: 'En cours',
      draft: 'Brouillon',
      draftUnpublished: 'Brouillon — non publié',
      viewCode: 'Voir le code sur GitHub ↗',
      notebook: 'Voir le notebook ↗',
      codeSoon: 'Code bientôt disponible',
      demo: 'Démo ↗',
      tools: 'Outils utilisés',
      toc: 'Sommaire',
      more: 'Voir le projet →',
      others: (domain: string) => `← Autres projets ${domain}`,
      source: 'Code source sur GitHub ↗',
      fallback: '',
    },
  },
  en: {
    nav: { experience: 'Experience', education: 'Education', projects: 'Projects', skills: 'Skills', contact: 'Contact' },
    switchTo: 'Read in English',
    hello: "Hi, I'm",
    viewProjects: 'View my work',
    contactMe: 'Get in touch',
    myCv: 'Résumé',
    photoOf: 'Photo of',
    experience: { eyebrow: 'Professional experience', title: 'Experience' },
    education: { eyebrow: 'Academic background', title: 'Education' },
    certifications: 'Certifications',
    languagesTitle: 'Languages',
    interests: 'Interests',
    projects: {
      eyebrow: 'Portfolio',
      title: 'Areas of expertise',
      lead: 'Select an area to explore the related projects, each covering the context, problem, approach, tools, challenges and outcomes.',
      soon: 'Coming soon',
      count: (n: number) => `${n} project${n > 1 ? 's' : ''}`,
      featured: 'Featured projects',
    },
    skills: { eyebrow: 'Expertise', title: 'Skills' },
    associations: { eyebrow: 'Extracurricular', title: 'Activities & Involvement' },
    contact: {
      eyebrow: 'Contact',
      title: "Let's connect",
      lead: "Whether it's a data project, a collaboration opportunity or a quick question, feel free to reach out. I'd be glad to hear from you.",
    },
    domain: {
      back: '← All areas',
      eyebrow: 'Area of expertise',
      emptyTitle: 'Projects coming soon',
      emptyText: 'Projects in this area are currently in progress and will be published here shortly.',
    },
    project: {
      crumbs: 'Projects',
      inProgress: 'In progress',
      draft: 'Draft',
      draftUnpublished: 'Draft — not published',
      viewCode: 'View code on GitHub ↗',
      notebook: 'View notebook ↗',
      codeSoon: 'Code available soon',
      demo: 'Live demo ↗',
      tools: 'Tech stack',
      toc: 'On this page',
      more: 'View project →',
      others: (domain: string) => `← More ${domain} projects`,
      source: 'Source code on GitHub ↗',
      fallback: 'This case study is currently available in French only.',
    },
  },
};
