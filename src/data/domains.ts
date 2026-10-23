import type { Lang } from '../i18n/ui';

// Les domaines affichés sur la page d'accueil.
// Pour en ajouter un : ajoute une entrée ici + un dossier du même slug dans src/content/projects/fr/ (et en/).
export const domains = [
  {
    slug: 'ai-engineer',
    name: 'AI Engineer',
    tagline: {
      fr: 'Agents, apprentissage par renforcement, LLM',
      en: 'Agents, reinforcement learning, LLMs',
    },
    description: {
      fr: "Conception d'agents intelligents et de systèmes d'IA : apprentissage par renforcement, deep learning, intégration de modèles.",
      en: 'Designing intelligent agents and AI systems: reinforcement learning, deep learning, model integration.',
    },
  },
  {
    slug: 'data-scientist',
    name: 'Data Scientist',
    tagline: {
      fr: 'Modélisation, prédiction, machine learning',
      en: 'Modelling, prediction, machine learning',
    },
    description: {
      fr: 'Construire des modèles prédictifs à partir de données réelles : préparation, feature engineering, entraînement et évaluation.',
      en: 'Building predictive models from real-world data: preparation, feature engineering, training and evaluation.',
    },
  },
  {
    slug: 'data-analyst',
    name: 'Data Analyst',
    tagline: {
      fr: 'Dashboards, visualisation, aide à la décision',
      en: 'Dashboards, visualisation, decision support',
    },
    description: {
      fr: 'Transformer des données brutes en indicateurs lisibles : nettoyage, analyse exploratoire et tableaux de bord (Power BI, Excel, Dash).',
      en: 'Turning raw data into clear indicators: cleaning, exploratory analysis and dashboards (Power BI, Excel, Dash).',
    },
  },
  {
    slug: 'data-engineer',
    name: 'Data Engineer',
    tagline: {
      fr: 'Pipelines, bases de données, DevOps',
      en: 'Pipelines, databases, DevOps',
    },
    description: {
      fr: 'Collecter, stocker et acheminer la donnée de façon fiable : pipelines, bases de données, conteneurisation et CI/CD.',
      en: 'Collecting, storing and moving data reliably: pipelines, databases, containerisation and CI/CD.',
    },
  },
  {
    slug: 'statistiques',
    name: 'Statistiques',
    tagline: {
      fr: 'Fouille de données, inférence, algorithmes',
      en: 'Data mining, inference, algorithms',
    },
    description: {
      fr: 'Les fondations : statistiques descriptives et inférentielles, fouille de données et algorithmique.',
      en: 'The foundations: descriptive and inferential statistics, data mining and algorithms.',
    },
  },
] as const;

const names: Partial<Record<string, Record<Lang, string>>> = {
  statistiques: { fr: 'Statistiques', en: 'Statistics' },
};

export type DomainSlug = (typeof domains)[number]['slug'];
export const domainSlugs = domains.map((d) => d.slug) as [DomainSlug, ...DomainSlug[]];

export function getDomain(slug: string) {
  return domains.find((d) => d.slug === slug);
}

export function domainName(slug: string, lang: Lang) {
  return names[slug]?.[lang] ?? getDomain(slug)?.name ?? slug;
}
