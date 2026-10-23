---
title: Prédire le prix d'un Bordeaux à partir de la météo
domain: statistiques
summary: Reconstruction de la « Bordeaux equation » d'Ashenfelter. Quatre variables météo et l'âge expliquent 83 % du prix d'un millésime, et +1 °C pendant la saison de croissance vaut environ +84 % de prix.
date: 2024-04-29
tools: [Python, Statsmodels, Scikit-learn, Régression linéaire, Validation croisée, Seaborn]
github: https://github.com/AbibatouWANDAOGO/bordeaux-wine-price-prediction
notebook: https://github.com/AbibatouWANDAOGO/bordeaux-wine-price-prediction/blob/main/wine_price_prediction.ipynb
status: terminé
featured: false
---

## Contexte

En 1990, l'économiste de Princeton **Orley Ashenfelter** affirme qu'on peut prédire la qualité d'un millésime de Bordeaux, et donc son prix, **sans le goûter**, uniquement à partir de la météo de l'année de récolte. Les critiques œnologiques crient au scandale. Pourtant, sa « Bordeaux equation » a souvent fait mieux que les experts.

Les données couvrent **25 millésimes** (1952-1978) : prix moyen aux enchères de 1990-1991, température de la saison de croissance, pluie des vendanges, pluie d'hiver, âge du vin et population française. Deux millésimes supplémentaires (1979 et 1980) servent de test.

## Problème

- **Ce modèle tient-il statistiquement ?** Quelle part du prix la météo explique-t-elle vraiment ?
- **Combien vaut chaque facteur ?** Que rapporte un degré de plus, ou que coûtent 100 mm de pluie ?
- **Peut-on prédire le prix de millésimes jamais vus ?**

## Solution

1. **Contrôle des données** : en lisant la documentation, `Price` s'avère être **déjà un logarithme**. On le modélise tel quel, et chaque coefficient se lit directement comme un effet en pourcentage sur le prix réel.
2. **Analyse exploratoire** : corrélations et nuages de points du prix en fonction de la météo.
3. **Six modèles de complexité croissante**, de la simple moyenne jusqu'à l'équation d'Ashenfelter avec interaction entre pluie d'hiver et pluie des vendanges.
4. **Sélection par validation croisée leave-one-out** : chaque millésime est prédit par un modèle entraîné sur les 24 autres, plutôt que de se fier au R² d'apprentissage.
5. **Colinéarité** : analyse des facteurs d'inflation de la variance (VIF).
6. **Interprétation** : coefficients, intervalles de confiance et p-values avec `statsmodels`.
7. **Diagnostic** des résidus (normalité, homoscédasticité) et **prédiction** de 1979 et 1980 avec intervalles à 95 %.

![Prix en fonction de la température et de la pluie des vendanges](/portfolio/images/vin/price_vs_weather.png)
*Les grands millésimes comme 1961 et 1953 combinent un été chaud et des vendanges sèches. 1968 et 1965 cumulent l'inverse.*

## Difficultés rencontrées

- **Un « double logarithme » à éviter.** La première approche reprenait le log de `Price`, alors que cette variable est déjà un logarithme. Les R² n'en sont presque pas affectés, mais les coefficients ne sont plus interprétables en pourcentage. C'est un rappel : toujours lire la documentation des données.
- **Un R² trompeur avec 25 observations.** Ajouter toutes les variables donne le même R² d'apprentissage que l'équation d'Ashenfelter (0,829), mais une erreur de prédiction plus élevée. J'ai donc comparé les modèles par **validation croisée**.
- **Une colinéarité parfaite.** `Age` = 1983 − `Year` pour tous les millésimes, et `FrancePop` suit les années (VIF ≈ 100). Cela ne gêne pas la prédiction, mais rend les coefficients ininterprétables : je n'ai gardé que `Age`.
- **Un modèle sans constante.** Un ajustement `statsmodels` sans constante affichait un R² de 0,999, qui ne veut rien dire. Il faut ajouter la constante explicitement (`sm.add_constant`).

## Résultats

| Modèle | R² | R² ajusté | Erreur de prédiction (LOO) |
| --- | --- | --- | --- |
| Moyenne (référence) | – | – | 0,664 |
| Température seule | 0,435 | 0,410 | 0,516 |
| + pluie des vendanges | 0,707 | 0,681 | 0,391 |
| Toutes les variables | 0,829 | 0,784 | 0,359 |
| Équation d'Ashenfelter | 0,829 | 0,794 | 0,338 |
| **+ interaction des pluies** | **0,856** | **0,818** | **0,309** |

![Comparaison des modèles : R² ajusté et erreur en validation croisée](/portfolio/images/vin/model_comparison.png)

> **Oui, on peut prédire la qualité d'un Bordeaux sans le goûter.** La température, les pluies et l'âge expliquent **83 % de la variance** des prix, et le meilleur modèle **divise par 2 l'erreur de prédiction** par rapport à la simple moyenne.

![Effet de la météo et de l'âge sur le prix d'un millésime](/portfolio/images/vin/weather_effects_on_price.png)
*À conditions égales, +1 °C pendant la saison de croissance multiplie le prix par 1,8 (+84 %), et +100 mm de pluie pendant les vendanges le font baisser de 33 %. La température est le facteur le plus déterminant (t = 6,2).*

![Prédictions en validation croisée et sur les millésimes 1979-1980](/portfolio/images/vin/predictions_new_vintages.png)
*Pour 1979 et 1980, jamais vus par le modèle, les prix réels tombent dans les intervalles de prédiction à 95 %. Même 1961, le millésime le plus cher, est prédit presque parfaitement.*

**Ce que j'en retiens :**

- **La température de la saison de croissance** est le premier facteur de qualité, et **la pluie pendant les vendanges** le principal ennemi : l'eau dilue les raisins juste avant la récolte.
- **Avec peu de données, la validation croisée est indispensable** pour choisir un modèle : le R² d'apprentissage récompense la complexité.
- **Les hypothèses du modèle sont vérifiées** : résidus normaux (Shapiro-Wilk, p = 0,84) et de variance constante (Breusch-Pagan, p = 0,69).

**Limites et pistes** : avec 25 observations, les intervalles restent larges (1979 est sous-estimé de 26 %, tout en restant dans l'intervalle). Certains millésimes atypiques, comme 1959, échappent au modèle. Pistes : ajouter des millésimes récents, utiliser une régression Ridge pour stabiliser les coefficients, et intégrer des variables viticoles comme l'appellation ou le cépage.
