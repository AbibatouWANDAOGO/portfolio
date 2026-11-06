---
title: Prédire le prix d'Apple à la seconde depuis le carnet d'ordres
domain: ai-engineer
summary: À partir de 400 000 événements du carnet d'ordres d'Apple (LOBSTER), un modèle qui prédit si le prix va monter, baisser ou rester stable dans la seconde suivante, avec une évaluation sans fuite de données, puis servi par une API FastAPI conteneurisée avec Docker.
date: 2026-11-06
tools: [Python, Pandas, Scikit-learn, Random Forest, FastAPI, Pydantic, Pytest, Docker]
github: https://github.com/AbibatouWANDAOGO/lobster-market-ml
notebook: https://github.com/AbibatouWANDAOGO/lobster-market-ml/blob/main/notebooks/02_modeling.ipynb
status: terminé
featured: true
---

## Contexte

Sur un marché électronique, le **carnet d'ordres** liste en continu les ordres d'achat et de vente en attente, niveau de prix par niveau de prix. C'est la matière première du trading algorithmique et de la mesure de la qualité d'exécution, au cœur de mon poste de Listed Derivatives Analyst.

J'ai travaillé sur l'échantillon public **LOBSTER** : le carnet d'ordres d'**Apple** sur 10 niveaux, pour la journée du **21 juin 2012**, soit **400 391 événements** (ordres placés, annulés, exécutés) horodatés à la nanoseconde.

L'objectif était double : mener une démarche de **data science** rigoureuse sur des données financières, puis la transformer en **service de machine learning** testé et déployable.

![Meilleur prix acheteur et vendeur sur deux minutes](/portfolio/images/lobster/02_bid_ask_zoom.png)
*Deux minutes de marché : chaque marche est une modification du meilleur prix acheteur (bleu) ou vendeur (orange). L'écart entre les deux est le spread.*

## Problème

**L'état du carnet d'ordres permet-il de prédire si le prix médian va monter, baisser ou rester stable dans la seconde qui suit ?**

- Les données sont **temporelles et très corrélées** : un découpage aléatoire donnerait des scores artificiellement élevés.
- Chaque étiquette regarde **une seconde dans le futur** : sans précaution, de l'information du futur se glisse dans l'entraînement.
- Le modèle doit pouvoir être **servi** de façon fiable, avec des entrées validées.

## Solution

1. **Validation des données** : format, cohérence du carnet, chronologie, et un test d'alignement strict entre les deux fichiers. Chaque nouvel ordre doit apparaître dans le carnet à la même ligne, à l'action près. Résultat : 100 % d'alignement.
2. **Exploration** : spread médian de 14 ticks, prix en baisse toute la journée, classes équilibrées (environ un tiers chacune) avec un seuil de 1 cent.
3. **Cible** : direction du prix médian à une seconde (hausse, baisse ou stable).
4. **15 variables calculées uniquement avec le passé** : spread, tailles et déséquilibre au meilleur niveau, profondeur sur 5 niveaux, rendements et volatilité récents, activité et flux de transactions signé.
5. **Évaluation sans fuite** : découpage chronologique 70 / 15 / 15, avec un trou d'une seconde et une **purge** des lignes dont l'étiquette regarde dans la période suivante.
6. **Protocole fixé à l'avance** : 4 modèles comparés sur la validation, groupes de variables ajoutés un par un, puis **une seule évaluation sur le test**.
7. **Mise en production** : modèle sauvegardé avec ses métadonnées, API FastAPI (`/health`, `/model-info`, `/predict`) avec validation Pydantic, image Docker testée.

![Ajout progressif des groupes de variables](/portfolio/images/lobster/11_feature_ablation_validation.png)
*La dynamique récente du prix apporte le plus grand gain. Ajouter l'heure de la journée dégrade le modèle : les heures du test sont absentes de l'entraînement.*

## Difficultés rencontrées

- **Une fuite de données invisible** : une étiquette regarde « le premier événement une seconde plus tard ». Quand le marché est calme, cet événement peut arriver bien après, et tomber dans la période suivante. Un simple trou d'une seconde ne suffisait donc pas : j'ai ajouté une **purge**, vérifiée par des tests.
- **Des événements simultanés** : plusieurs événements partagent parfois le même horodatage. Les fenêtres de calcul sont donc bornées par le numéro de ligne, pour ne jamais utiliser un événement arrivé juste après. Un test vérifie que les variables sont identiques avec ou sans la suite de la journée.
- **Des variables trompeuses** : le prix chute toute la journée, et la période de test cote sous tous les prix vus à l'entraînement. J'ai exclu le niveau de prix et l'heure, et une expérience confirme que l'heure dégrade le modèle.
- **Une erreur de méthode corrigée** : un découpage en déciles coupait arbitrairement des valeurs identiques et créait de faux motifs. Je l'ai remplacé par des intervalles fixes.
- **Un bug d'API révélé par les tests** : une valeur `Infinity` était bien refusée, mais le message d'erreur faisait planter le serveur (erreur 500 au lieu de 422). C'est corrigé et testé.

## Résultats

| Test final (15h26 – 16h00, jamais utilisé pour un choix) | Macro F1 | Accuracy |
| --- | --- | --- |
| **Random Forest, 15 variables** | **0,437** | **44,3 %** |
| Baseline (classe majoritaire) | 0,162 | 32,1 % |

> Sur une période qu'il n'a jamais vue, le modèle prédit la direction de la seconde suivante **nettement mieux que le hasard**. Le signal principal est le **momentum à très court terme** : après une hausse de 5 cents ou plus sur la dernière seconde, la suivante monte 42 % du temps et ne baisse que 34 % du temps.

![Importance des variables par permutation](/portfolio/images/lobster/13_permutation_importance.png)
*Le rendement de la dernière seconde domine, suivi du flux de transactions signé. Les niveaux profonds du carnet n'apportent presque rien à une seconde d'horizon.*

![Matrice de confusion sur le test](/portfolio/images/lobster/12_confusion_matrix_test.png)
*En fin de journée, la période la plus agitée, le modèle reconnaît bien les baisses (53 %) et les hausses (46 %), moins bien les périodes calmes.*

**Côté ingénierie** : 109 tests automatisés, un artefact reproductible (un test retrouve exactement le score enregistré), une API qui refuse toute entrée invalide et ne renvoie jamais de prédiction sans modèle, et une image Docker vérifiée (utilisateur non-root, health check).

![Prédiction exécutée depuis la documentation interactive de l'API](/portfolio/images/lobster/16_api_predict.png)
*La documentation interactive de l'API : une requête avec les 15 variables renvoie la classe prédite et ses probabilités.*

**Limites** : une seule action, une seule journée, un test de 34 minutes. Mieux prédire la direction que le hasard ne constitue pas une stratégie de trading : le spread est bien plus large que le mouvement typique sur une seconde, et les coûts ne sont pas modélisés.

**Pistes** : étendre à plusieurs journées et à d'autres titres (Microsoft, Amazon…), tester d'autres horizons et seuils, et calculer les variables en continu à partir d'un flux de marché.

*Les graphiques sont en anglais.*
