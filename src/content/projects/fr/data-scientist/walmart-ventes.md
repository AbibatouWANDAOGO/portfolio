---
title: Prédiction des ventes chez Walmart
domain: data-scientist
summary: Prédire les ventes hebdomadaires de 45 magasins Walmart à partir de données économiques, météo et calendaires. De la préparation des données au feature engineering, une régression linéaire qui explique 94 % de la variance sur des données de test.
date: 2025-12-01 # À AJUSTER
tools: [Python, Pandas, Seaborn, Scikit-learn, KNN Imputer, Régression linéaire]
github: https://github.com/AbibatouWANDAOGO/walmart-sales-forecasting
notebook: https://github.com/AbibatouWANDAOGO/walmart-sales-forecasting/blob/main/walmart_sales_forecasting.ipynb
status: terminé
draft: false
---

## Contexte

Projet personnel de data science, mené de bout en bout : du nettoyage et de la qualité des données jusqu'à la prédiction. Il s'appuie sur les données de la compétition Kaggle *Walmart Recruiting – Store Sales Forecasting*. Le jeu de données couvre 3 ans de **ventes hebdomadaires de 45 magasins Walmart** aux États-Unis (6 438 semaines-magasins). Il contient aussi des variables de contexte : température, prix du carburant, indice des prix (CPI), chômage, campagnes publicitaires, jours fériés, ainsi que le type, la taille et le nombre d'employés de chaque magasin.

## Problème

Peut-on **prévoir les ventes hebdomadaires** d'un magasin à partir de ces facteurs, et **quelles variables influencent réellement** les ventes ?

## Solution

1. **Fusion des données** : jointure (`pd.merge`) entre la table des ventes et celle des magasins sur la clé `Store`. Le résultat est vérifié par rapport au fichier de référence.
2. **Qualité des données** : détection et suppression de 3 lignes dupliquées. Des valeurs manquantes sont ensuite ajoutées volontairement (55 NaN répartis dans toutes les colonnes) pour s'entraîner à les traiter :
   - variables qualitatives (magasin, date, type, vacances) : propagation de la valeur précédente (`ffill`) ;
   - variables quantitatives : **standardisation** (`StandardScaler`), puis **imputation par les 5 plus proches voisins** (`KNNImputer`), puis retour à l'échelle d'origine.
3. **Analyse exploratoire** : matrice de corrélation, boxplots des ventes par type de magasin et par période de vacances, évolution des ventes dans le temps.
4. **Encodage** : décomposition de la date (année, mois, semaine, jour) et encodage one-hot de `Store`, `Type` et `IsHoliday`. On obtient 62 variables.
5. **Modélisation** : régression linéaire avec séparation apprentissage / test (80 / 20). Elle est évaluée par le RSS, le RSE et le R² sur les deux ensembles.
6. **Feature engineering** : les ventes explosent à Thanksgiving et avant Noël, ce que `IsHoliday` capte mal. J'ai donc créé une variable `End_of_year_holidays`, qui vaut 1 pour les semaines 47 et 49 à 51.

## Difficultés rencontrées

- **Des valeurs manquantes partout, y compris dans la date et dans les variables booléennes.** L'imputation KNN de scikit-learn ne fonctionne qu'avec des nombres. J'ai donc séparé les variables qualitatives, complétées par la valeur précédente, des variables quantitatives, imputées par KNN. Il fallait aussi standardiser avant le KNN : sinon, `Size` (≈ 100 000) écrase complètement `Fuel_Price` (≈ 3) dans le calcul des distances.
- **Vérifier l'imputation.** En comparant les valeurs imputées aux vraies valeurs, j'ai constaté que la taille du magasin est retrouvée exactement : les voisins sont d'autres semaines du même magasin. Le prix du carburant, lui, est estimé avec environ 9 % d'erreur.
- **Compatibilité des versions de pandas.** L'injection de valeurs manquantes écrit des NaN dans une colonne booléenne. C'est déprécié dans pandas 2 et interdit dans pandas 3, et `fillna(method='ffill')` a aussi été retiré. J'ai adapté le code (`.ffill()`) et fixé la version de pandas pour garantir des résultats reproductibles.
- **Faut-il standardiser pour la régression ?** Non : pour une régression linéaire classique, changer l'échelle d'une variable modifie les coefficients mais pas les prédictions ni le R². J'ai donc gardé les ventes en dollars pour garder des résultats interprétables.

## Résultats

| Modèle                                        | R² apprentissage | R² test   |
| --------------------------------------------- | ---------------- | --------- |
| Variables quantitatives seules                | 0,675            | 0,658     |
| + date + one-hot (magasin, type, vacances)    | 0,930            | 0,918     |
| + variable « fêtes de fin d'année »           | **0,954**        | **0,941** |

> Une simple régression linéaire, avec un bon encodage et **une seule variable bien choisie**, explique **94 % de la variance** des ventes sur des semaines jamais vues. L'erreur type passe de 319 000 $ à 121 000 $ par semaine.

**Ce que j'en retiens :**

- **La taille du magasin** est le premier facteur des ventes (corrélation de 0,81). Le chômage, le CPI et le prix du carburant ont très peu d'influence.
- **L'identité du magasin** (encodage one-hot) apporte le plus gros gain : chaque magasin a son propre niveau de ventes.
- **Une semaine de fêtes de fin d'année** rapporte en moyenne **+460 000 $** de ventes par magasin. C'est l'effet saisonnier dominant. Les semaines `IsHoliday`, qui mélangent Super Bowl, fête du Travail et Noël, n'augmentent les ventes que d'environ 8 %.

**Pistes d'amélioration** : validation croisée temporelle (entraîner sur le passé, tester sur le futur), modèles non linéaires (Random Forest, Gradient Boosting) et variables de décalage (ventes des semaines précédentes).
