# Portfolio — Abibatou WANDAOGO

Portfolio data & IA construit avec [Astro](https://astro.build), publié sur GitHub Pages.

## Lancer le site en local

Prérequis : [Node.js](https://nodejs.org) 20 ou plus récent.

```bash
npm install
npm run dev      # http://localhost:4321/portfolio
```

## Où modifier quoi

| Je veux…                                   | Fichier                                   |
| ------------------------------------------ | ----------------------------------------- |
| Changer mes infos, formation, compétences  | `src/data/profile.ts` (blocs `fr` et `en`) |
| Changer les textes des menus / boutons     | `src/i18n/ui.ts`                          |
| Ajouter / renommer un domaine              | `src/data/domains.ts`                     |
| Ajouter un projet                          | `src/content/projects/fr/<domaine>/*.md`  |
| Traduire un projet en anglais              | `src/content/projects/en/<domaine>/*.md`  |
| Ajouter ma photo ou mon CV                 | `public/` puis `src/data/profile.ts`      |
| Changer les couleurs                       | `src/styles/global.css` (variables `--`)  |

## Ajouter un projet

1. Copie `src/content/projects/_modele.md` dans le dossier du domaine (ex. `fr/data-scientist/`).
2. Renomme-le (ex. `detection-accidents.md`). Ce nom devient l'URL : `/projets/data-scientist/detection-accidents`.
3. Remplis l'en-tête (titre, outils, lien GitHub…) et les 5 sections : Contexte, Problème, Solution, Difficultés rencontrées, Résultats.
4. Tant que `draft: true`, le projet n'est visible qu'en local. Passe-le à `false` pour le publier.
5. Version anglaise : crée un fichier **du même nom** dans `en/<domaine>/` (sections Context, Problem, Solution, Challenges, Results).
   Tant qu'il n'existe pas, la page anglaise affiche la version française avec un message « only available in French ».

## Langues

Le site existe en français (`/portfolio/`) et en anglais (`/portfolio/en/`), avec un sélecteur FR | EN dans l'en-tête.
À la première visite, un navigateur qui n'est pas en français est envoyé vers la version anglaise ; ensuite, le choix fait dans le sélecteur est mémorisé.

Les images d'un projet peuvent être mises dans `public/images/` et insérées avec `![description](/portfolio/images/mon-image.png)`.

## Publier sur GitHub Pages

1. Crée un dépôt GitHub (ex. `portfolio`) et pousse ce dossier dessus.
2. Dans `astro.config.mjs`, le site est configuré pour le compte `AbibatouWANDAOGO` (ajuste `base` si le dépôt ne s'appelle pas `portfolio`).
3. Sur GitHub : **Settings → Pages → Source : GitHub Actions**.
4. Chaque `git push` sur `main` redéploie automatiquement le site sur `https://abibatouwandaogo.github.io/portfolio/`.
