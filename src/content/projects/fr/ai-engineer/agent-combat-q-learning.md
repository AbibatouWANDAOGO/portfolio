---
title: Agent de combat IA par Q-Learning
domain: ai-engineer
summary: Un agent qui apprend seul, par renforcement, à attaquer, se défendre ou se soigner dans un combat au tour par tour, et qui adapte sa stratégie au style de l'ennemi (97 à 100 % de victoires).
date: 2026-03-25
tools: [Python, NumPy, Q-Learning, ε-greedy, Matplotlib, Seaborn]
# github: https://github.com/AbibatouWANDAOGO/agent-combat-q-learning
status: terminé
featured: true
---

## Contexte

Ce projet a été réalisé en cours d'apprentissage par renforcement (E4, filière FD) à l'ESIEE Paris. L'idée était d'appliquer le **Q-Learning** à un cas plus concret qu'une grille : un mini-jeu de combat au tour par tour, comme dans un jeu vidéo, où l'IA doit choisir à chaque tour entre **Attaquer**, **Défendre** et **Se soigner**.

## Problème

Peut-on entraîner un agent qui, **sans connaître les règles à l'avance**, découvre une stratégie gagnante, puis l'**adapte au comportement de l'adversaire** ?

Deux types d'ennemis ont été testés :

- **Agressif** : il attaque 70 % du temps.
- **Défensif** : il se défend ou se soigne 80 % du temps.

## Solution

1. **Environnement `CombatEnv`** : je l'ai codé de zéro. Il gère les points de vie (100 de chaque côté), des dégâts aléatoires (10–25 pour le joueur), la défense qui divise les dégâts par deux, les soins, et une distance tirée au hasard (proche, moyenne, loin).
2. **Discrétisation de l'état** : les PV sont regroupés par tranches de 20, ce qui donne l'état `(PV joueur, PV ennemi, distance)`. On obtient ainsi un nombre d'états réduit, compatible avec une Q-table.
3. **Récompenses** : +5 pour un coup porté, +3 pour un soin, +1 pour une défense, −5 pour un coup reçu, et **±100** à la fin du combat selon la victoire ou la défaite.
4. **Agent Q-Learning** : la Q-table est stockée dans un dictionnaire et remplie au fur et à mesure que les états sont découverts. Elle est mise à jour avec l'équation de Bellman (α = 0,1, γ = 0,9). L'exploration est **ε-greedy**, avec ε qui décroît de 1 à 0,01.
5. **Entraînement** : 5 000 combats par type d'ennemi, avec un agent distinct pour chacun.
6. **Analyse** : courbes de récompense, extraction de la politique apprise, heatmaps de l'action optimale selon les PV, et inspection des Q-values.
7. **Optimisation des hyperparamètres** : recherche sur une grille de 27 combinaisons (α ∈ {0,05 ; 0,1 ; 0,2}, γ ∈ {0,8 ; 0,9 ; 0,95}, décroissance de ε ∈ {0,99 ; 0,995 ; 0,999}) pour chaque type d'ennemi.

## Difficultés rencontrées

- **Une action jamais choisie** : l'agent n'utilise **jamais** « Défendre ». En analysant les récompenses, j'ai compris que la défense rapporte peu (+1) comparée à l'attaque (+5 et une victoire plus rapide). Le comportement de l'agent dépend donc directement de la façon dont les récompenses sont conçues (*reward shaping*).
- **Une distance sans effet** : la distance fait partie de l'état mais n'influence pas encore les dégâts. Elle multiplie le nombre d'états sans rien apporter à la décision.
- **Des états rarement visités** : certaines situations, comme « joueur faible face à un ennemi fort » contre l'ennemi défensif, n'apparaissent presque jamais pendant l'entraînement. Leurs Q-values restent proches de 0 et ne sont pas fiables.
- **Des états imprévus** : les PV de l'ennemi peuvent passer sous 0, ce qui crée une tranche « −1 » que je n'avais pas prévue dans la discrétisation.

## Résultats

Évaluation sur 100 combats, sans exploration :

| Métrique                   | vs ennemi agressif | vs ennemi défensif |
| -------------------------- | ------------------ | ------------------ |
| **Taux de victoire**       | **97 %**           | **100 %**          |
| Récompense moyenne         | 105,6              | 140,3              |
| Actions « Attaquer »       | 744                | 1 002              |
| Actions « Se soigner »     | 34                 | 14                 |
| Actions « Défendre »       | 0                  | 0                  |

> L'agent **adapte sa stratégie à l'adversaire**. Face à un ennemi agressif qui inflige plus de dégâts, il se soigne plus de deux fois plus souvent. Face à un ennemi défensif, il peut attaquer presque sans interruption.

**Optimisation** : la meilleure configuration est α = 0,05 et γ = 0,95 pour les deux types d'ennemi. La récompense moyenne passe à 111,9 contre l'agressif et à 152,5 contre le défensif. Un apprentissage plus lent et une vision à long terme donnent une politique plus stable.

**Pistes d'amélioration** : donner un vrai rôle à la distance (dégâts selon la portée, actions « Se rapprocher » et « S'éloigner »), revoir les récompenses pour que la défense ait un intérêt, et passer à un **Deep Q-Network** pour gérer des états continus.
