---
title: Prédire la gravité des accidents de la route
domain: data-scientist
summary: À partir des 125 000 personnes impliquées dans un accident en France en 2023 (open data BAAC), un modèle XGBoost qui repère 58 % des accidents mortels, après avoir détecté et corrigé une fuite de données qui gonflait les scores de 11 points.
date: 2025-11-15 # À AJUSTER
tools: [Python, Pandas, Scikit-learn, XGBoost, Random Forest, Pipeline, Seaborn]
github: https://github.com/AbibatouWANDAOGO/road-accident-severity-prediction
notebook: https://github.com/AbibatouWANDAOGO/road-accident-severity-prediction/blob/main/accident_severity_prediction.ipynb
status: terminé
featured: true
---

## Contexte

Chaque accident corporel de la circulation en France fait l'objet d'un **bulletin d'analyse (BAAC)**, rempli par les forces de l'ordre et publié en open data sur data.gouv.fr. Pour 2023, cela représente **54 822 accidents** et **125 789 personnes impliquées**. Les données sont réparties en quatre fichiers : caractéristiques de l'accident, lieux, véhicules et usagers.

Ce projet prolonge mon étude de conception sur la [détection et la prédiction des accidents](/portfolio/projets/data-scientist/detection-accidents) en passant à la pratique sur des données réelles.

## Problème

- **Prédire la gravité des blessures** de chaque personne impliquée : indemne, blessé léger, blessé hospitalisé ou tué.
- **Comprendre quels facteurs aggravent les blessures**, pour orienter la prévention.

La difficulté principale : les classes sont **très déséquilibrées**, avec seulement 2,7 % de tués.

## Solution

1. **Audit de qualité avant la fusion** : vérification du grain de chaque table. Le fichier `lieux` contient plusieurs lignes pour certains accidents (intersections), ce qui duplique les personnes lors d'une fusion naïve.
2. **Fusion corrigée** : on part des personnes, on ajoute leur véhicule, l'accident, puis un seul lieu par accident. On obtient 125 789 lignes, sans aucun doublon.
3. **Analyse exploratoire** : taux de blessés graves selon le profil de l'usager, la zone, la luminosité et l'âge.
4. **Préparation** : 19 variables (circonstances, route, véhicule, personne). Les codes sont encodés comme des catégories, pas comme des nombres (`catv` = 7 n'est pas « plus grand » que `catv` = 2). L'imputation et l'encodage sont faits dans un `Pipeline` scikit-learn.
5. **Découpage par accident** (`GroupShuffleSplit`) : toutes les personnes d'un même accident sont du même côté, apprentissage ou test.
6. **Modélisation** : Random Forest, puis XGBoost régularisé, puis XGBoost avec **pondération des classes**.
7. **Interprétation** : matrices de confusion et importance des variables.

![Taux de blessés graves selon le profil de l'usager](/portfolio/images/accidents/severe_rate_by_user.png)
*Les deux-roues motorisés (35 %), les piétons (32 %) et les cyclistes (27 %) sont 2 à 3 fois plus souvent tués ou hospitalisés que les occupants d'une voiture (13 %).*

## Difficultés rencontrées

- **Une fuite de données cachée dans la fusion.** La première version fusionnait les tables à partir des accidents. Cela créait **37 894 lignes en double** (23 %), et 37 % des lignes de test avaient leur double dans l'apprentissage. Le modèle était donc évalué en partie sur des personnes qu'il avait déjà vues. Après correction, le score de test de la Random Forest passe de **70,5 % à 59,6 %** : près de 11 points étaient artificiels.

![Les doublons gonflent artificiellement le score de test de la Random Forest](/portfolio/images/accidents/data_leakage_random_forest.png)

- **Un sur-apprentissage massif** : la Random Forest par défaut atteint 98 % en apprentissage, contre 60 % en test. J'ai remplacé ce modèle par un XGBoost régularisé (arbres peu profonds, sous-échantillonnage), qui obtient 69 % en apprentissage et 66 % en test.
- **Une accuracy trompeuse** : avec 66 % d'accuracy, le modèle semblait correct, mais il ne détectait que **7 % des tués**. Il avait appris qu'il est « rentable » de prédire les classes majoritaires. J'ai donc suivi le rappel par classe, l'accuracy équilibrée et le F1 macro.
- **Des codes numériques qui n'en sont pas** : la catégorie de véhicule, la manœuvre ou le point de choc sont des codes. Les traiter comme des nombres revenait à inventer un ordre entre eux.

## Résultats

| Modèle | Accuracy test | Accuracy équilibrée | F1 macro | Tués détectés |
| --- | --- | --- | --- | --- |
| XGBoost | **0,662** | 0,474 | 0,487 | 7 % |
| XGBoost avec pondération des classes | 0,605 | **0,573** | **0,497** | **58 %** |

> En pondérant les classes, le modèle détecte **8 fois plus d'accidents mortels** (58 % au lieu de 7 %) et 46 % des hospitalisés. En contrepartie, l'accuracy globale baisse et les alertes « tué » sont souvent fausses (précision de 15 %). Pour un usage de sécurité routière, comme prioriser les secours ou cibler la prévention, rater un cas grave coûte bien plus cher qu'une fausse alerte.

![Matrices de confusion avant et après pondération des classes](/portfolio/images/accidents/confusion_matrices.png)
*Chaque ligne indique comment sont classées les personnes d'une gravité réelle donnée. Avec la pondération (à droite), la case « tué → tué » passe de 7 % à 58 %.*

![Variables les plus déterminantes pour prédire la gravité](/portfolio/images/accidents/feature_importance.png)
*L'équipement de sécurité, la manœuvre, la catégorie du véhicule et l'obstacle heurté concentrent près de la moitié de l'importance. La météo et l'état de la route n'apparaissent pas dans le top 12.*

**Ce que j'en retiens :**

- **La qualité des données compte autant que le modèle** : un simple problème de grain dans une jointure suffisait à surestimer la performance de 11 points.
- **Le choix de la métrique dépend de l'usage** : l'accuracy seule masquait que le modèle ne détectait presque aucun accident mortel.
- **La gravité dépend surtout de la façon dont on est exposé au choc** (protection du véhicule, équipement de sécurité, obstacle heurté). Hors agglomération, la part de blessés graves est deux fois plus élevée qu'en ville (26 % contre 13 %). Elle augmente aussi fortement après 65 ans (32 % au-delà de 75 ans).

**Pistes d'amélioration** : fusionner « tué » et « hospitalisé » en une classe « blessé grave » (problème binaire plus robuste), ajuster les seuils de décision, ajouter les années 2019 à 2022 et entraîner un modèle par type d'usager.
