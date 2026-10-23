---
title: Dashboard Vélib' en temps réel
domain: data-analyst
summary: Un dashboard web interactif qui analyse l'occupation des 1 511 stations Vélib' de Paris pour repérer les zones délaissées, normales et saturées.
date: 2026-04-14
tools: [Python, Pandas, Dash, Plotly, SQLite, Requests, API GBFS]
# github: https://github.com/AbibatouWANDAOGO/velib-dashboard
status: terminé
featured: true
---

## Contexte

Vélib' Métropole est un service de mobilité essentiel à Paris et en petite couronne. Ses données sont publiques (Open Data) et mises à jour en continu via l'API **GBFS** (General Bikeshare Feed Specification).

Réalisé dans le cadre du cours de Python avancé, ce projet consistait à concevoir un dashboard complet à partir de données ouvertes réelles : récupération, nettoyage, stockage et visualisation.

## Problème

Comment savoir, à un instant donné, **où le réseau est déséquilibré** ?

- Les **usagers** veulent trouver rapidement une station avec des vélos disponibles.
- Les **gestionnaires** doivent savoir où rééquilibrer les vélos entre stations.
- Les **décideurs** veulent identifier les zones sous-desservies pour planifier l'extension du réseau.

## Solution

Une application web multi-pages construite avec **Dash** :

1. **Collecte** : deux flux de l'API GBFS sont récupérés, les informations statiques (nom, position, capacité) et le statut en temps réel (vélos et bornes disponibles).
2. **Nettoyage** : les deux sources sont fusionnées sur `station_id`, puis on calcule le taux d'occupation `vélos disponibles / capacité` et la part de vélos électriques.
3. **Catégorisation** : chaque station est classée **délaissée** (< 5 %), **normale** (5–95 %) ou **saturée** (> 95 %).
4. **Stockage** : les données sont sauvegardées en CSV et dans une base **SQLite**. Un mode « production » lit directement la base, et un script la met à jour toutes les 5 minutes.
5. **Visualisation** : le dashboard comporte trois pages :
   - **Accueil** : indicateurs globaux.
   - **Carte** : les 1 511 stations, colorées selon leur zone.
   - **Statistiques** : histogramme, répartition par zone et top 10 des stations les plus occupées.

Le code est organisé en modules : `utils` pour les données, `pages`, `components` et `callbacks`. Il est documenté avec des docstrings et des type hints, et vérifié avec `ruff`.

## Difficultés rencontrées

- **Dépendance à l'API** : si l'API est lente ou indisponible, le dashboard ne doit pas planter. J'ai ajouté un cache local de 5 minutes et une base SQLite pour que l'application fonctionne même hors ligne.
- **Fusion de deux sources** : les informations statiques et le statut temps réel arrivent séparément. Il a fallu les aligner proprement sur l'identifiant de station.
- **Choix des seuils** : il fallait définir des seuils simples et lisibles pour qualifier une station de « délaissée » ou « saturée ».
- **Architecture multi-pages** : il fallait structurer le routing et les callbacks Dash pour que l'ajout d'une page reste simple.

## Résultats

| Zone      | Stations | Part   | Occupation moyenne |
| --------- | -------- | ------ | ------------------ |
| Délaissée | ~50      | 3,3 %  | 2,5 %              |
| Normale   | ~1 450   | 96 %   | 50 %               |
| Saturée   | ~10      | 0,7 %  | 98 %               |

> Le réseau est globalement bien équilibré (96 % de stations en occupation normale). Quelques stations saturent aux heures de pointe, près des gares et des centres commerciaux, et certains quartiers périphériques restent sous-desservis.

**Pistes d'amélioration** : prédiction de la demande par machine learning, historisation des données pour analyser l'évolution dans le temps, alertes en temps réel.
