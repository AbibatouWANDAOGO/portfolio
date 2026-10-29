---
title: Dashboard Vélib' en temps réel
domain: data-analyst
summary: Une application web Dash qui suit en temps réel les 1 500 stations Vélib' de Paris, avec une carte interactive, des analyses et un tableau de bord de maintenance. Projet en binôme.
date: 2026-06-13
tools: [Python, Dash, Plotly, Pandas, SQLite, API GBFS, Pytest]
github: https://github.com/AbibatouWANDAOGO/velib-dashboard
status: terminé
featured: true
---

## Contexte

Vélib' Métropole est un service de mobilité essentiel à Paris et en petite couronne : environ **1 500 stations** et près de **20 000 vélos** disponibles à un instant donné. Ses données sont publiques et mises à jour en continu via l'API **GBFS** (General Bikeshare Feed Specification).

Projet réalisé **en binôme avec Youcef Guediri** dans le cadre du cours de Python avancé. L'objectif était de concevoir un dashboard complet à partir de données ouvertes réelles : récupération, nettoyage, stockage, visualisation et tests.

![Page d'accueil du dashboard : indicateurs clés et répartition des vélos](/portfolio/images/velib/01_accueil.jpg)

## Problème

Comment savoir, à un instant donné, **où le réseau est déséquilibré** et **où intervenir** ?

- Les **usagers** veulent trouver rapidement une station avec des vélos, ou une place libre pour rendre le leur.
- Les **équipes d'exploitation** doivent repérer les stations vides ou pleines pour rééquilibrer le réseau.
- Les **gestionnaires** veulent une vue d'ensemble : taux de disponibilité, part de vélos électriques, zones sous tension.

## Solution

Une application web de **5 pages** construite avec **Dash** et **Plotly** :

1. **Collecte** : deux flux de l'API GBFS, les informations statiques (nom, position, capacité) et le statut en temps réel (vélos mécaniques, vélos électriques, places libres).
2. **Nettoyage et fusion** : alignement des deux sources sur `station_id`, extraction des types de vélos, puis calcul des indicateurs (taux de disponibilité et d'occupation, part d'électriques, station opérationnelle ou non).
3. **Stockage** : les données sont sauvegardées en CSV et dans une base **SQLite**. Si l'API ne répond pas, le dashboard bascule automatiquement sur les dernières données enregistrées.
4. **Visualisation** :
   - **Accueil** : indicateurs clés et répartition mécaniques / électriques.
   - **Carte** : les 1 500 stations colorées par état, avec filtres, chiffres clés et recherche de station.
   - **Analyse** : filtres par nombre de vélos et type de vélo, capacité contre disponibilité, distribution des taux d'occupation.
   - **Maintenance** : stations à traiter en priorité, sur une carte et dans un tableau filtrable.
   - **À propos** : sources et méthodologie.
5. **Qualité** : le code est organisé en modules (`utils`, `pages`, `components`), documenté avec des docstrings et des annotations de type, testé avec **pytest** et vérifié avec `mypy` et `ruff`.

![Carte des stations : état de chaque station en temps réel](/portfolio/images/velib/03_carte.jpg)
*Chaque station est colorée selon son état : vide (aucun vélo), pleine (aucune place pour rendre un vélo), presque vide (5 vélos ou moins) ou disponible. La taille du point dépend de la capacité de la station.*

![Recherche d'une station : la carte zoome sur Châtelet](/portfolio/images/velib/04_carte_recherche.jpg)
*La recherche ignore les accents et les majuscules : « Châtelet » trouve la station « Victoria - Place du Chatelet ». La carte zoome dessus et la met en évidence.*

![Page d'analyse : capacité, disponibilité et taux d'occupation](/portfolio/images/velib/02_analyse.jpg)

![Page maintenance : stations critiques et urgentes à traiter](/portfolio/images/velib/05_insights.jpg)
*Une station est **critique** si elle est vide ou pleine, et **urgente** si elle est déséquilibrée à plus de 90 % ou n'a aucun vélo électrique. Le tableau se filtre par gravité, zone et type de problème.*

## Difficultés rencontrées

- **La dépendance à l'API** : si l'API Vélib' est lente ou indisponible, le dashboard ne doit pas planter. Il se replie donc sur les dernières données enregistrées, en CSV ou en base SQLite.
- **Des formats de données différents** : dans le JSON de l'API, les vélos mécaniques et électriques sont imbriqués dans une liste, alors que l'export CSV les présente à plat. Il a fallu les extraire pour que le même pipeline traite les deux sources.
- **Une carte devenue vide après une mise à jour** : Plotly a supprimé `scatter_mapbox` à partir de sa version 6. Toute nouvelle installation affichait donc une page Carte vide. J'ai migré les deux cartes vers `scatter_map` (MapLibre) et fixé la version minimale de Plotly pour que le problème ne revienne pas.
- **Une recherche sensible aux accents** : la liste déroulante de Dash 4 compare le texte tel quel. Taper « Châtelet » ne trouvait donc pas « Chatelet ». J'ai remplacé la liste par un champ de recherche traité côté serveur, qui ignore les accents et les majuscules.

## Résultats

Relevé en temps réel du **29 octobre 2026 à 22h28** :

| Indicateur | Valeur |
| --- | --- |
| Stations opérationnelles | **1 500** sur 1 520 |
| Vélos disponibles | **≈ 19 000**, dont **39 %** électriques |
| Places libres pour rendre un vélo | **≈ 28 000** |
| Stations disponibles / presque vides / vides / pleines | **71 %** / 24 % / 2,9 % / 1,7 % |
| Stations à traiter en maintenance | **68 critiques** et 297 urgentes (76 % du réseau en bon état) |

> Le réseau est globalement bien servi : 7 stations sur 10 ont plus de 5 vélos. Mais près d'une station sur quatre est presque vide, et 68 stations, vides ou pleines, bloquent les usagers au moment du relevé. Ce sont les priorités des équipes de rééquilibrage.

**Améliorations apportées après le rendu** : chargement des données en temps réel avec un bouton « Actualiser », réparation des deux cartes, coloration par état, chiffres clés recalculés selon les filtres et recherche de station.

**Pistes d'amélioration** : historiser les relevés pour analyser l'évolution selon l'heure et le jour, prédire la demande par station, et mettre l'application en ligne (Render ou Railway).
