---
title: "Q-Learning : de la Q-table au Deep Q-Network"
domain: ai-engineer
summary: Implémentation et comparaison de deux approches d'apprentissage par renforcement sur FrozenLake (Q-table et réseau de neurones), étude de l'effet des hyperparamètres et application à un agent de trading simulé.
date: 2026-03-20
tools: [Python, Gymnasium, NumPy, TensorFlow, Pandas, Matplotlib]
# github: https://github.com/AbibatouWANDAOGO/q-learning-practice
status: terminé
---

## Contexte

Ce TP d'apprentissage par renforcement (E4, filière FD, ESIEE Paris) avait pour objectif de comprendre le Q-Learning en pratique : l'implémenter soi-même, le faire tourner sur un environnement standard, puis observer l'effet de chaque réglage.

L'environnement choisi est **FrozenLake-v1** (Gymnasium). L'agent doit traverser un lac gelé de 4×4 cases, de la case départ jusqu'à l'objectif, sans tomber dans les trous. La glace est glissante : une action ne mène pas toujours dans la direction choisie.

## Problème

- Un agent peut-il apprendre à atteindre l'objectif dans un environnement **aléatoire**, où la même action ne donne pas toujours le même résultat ?
- Quand faut-il préférer une **Q-table** à un **réseau de neurones** (DQN) ?
- Quel est l'impact réel des hyperparamètres : taux d'apprentissage, facteur d'actualisation, décroissance de l'exploration ?

## Solution

1. **Q-table** : une table de 16 états × 4 actions, mise à jour avec l'équation de Bellman (α = 0,8, γ = 0,95). L'exploration se fait en ajoutant un bruit qui décroît en 1/(i+1). L'entraînement dure 1 000 épisodes.
2. **Deep Q-Network simple** : un réseau à une couche sous TensorFlow. Il reçoit l'état encodé en one-hot (1×16) et prédit les 4 Q-values. Il est entraîné par descente de gradient sur l'erreur entre Q prédit et Q cible.
3. **Étude des hyperparamètres** : la Q-table est ré-entraînée sur 5 000 épisodes avec une exploration ε-greedy. Je fais ensuite varier un paramètre à la fois : α de 0,9 à 0,5, γ de 0,99 à 0,85, et la décroissance de ε de 0,0001 à 0,0005. Les courbes sont comparées avec une moyenne mobile sur 100 épisodes.
4. **Ouverture : un agent de trading** : un environnement `TradingEnv` sur des prix simulés, avec trois actions (acheter, vendre, attendre) et une récompense liée au profit.

## Difficultés rencontrées

- **Une « amélioration » qui dégradait le score** : en passant à 5 000 épisodes avec une décroissance de ε de 0,0001 par épisode, le score moyen d'entraînement est tombé à 0,02. ε valait encore 0,5 à la fin, donc l'agent jouait au hasard la moitié du temps. En accélérant la décroissance (0,0005), le score remonte à **0,27**. Le réglage de l'exploration compte autant que le reste.
- **Bien choisir la métrique** : le score moyen sur tout l'entraînement inclut la phase d'exploration et sous-estime l'agent final. Il faut évaluer l'agent **sans exploration** sur des épisodes à part.
- **Compatibilité des bibliothèques** : le code d'origine utilisait l'ancienne API Gym et TensorFlow 1. Je l'ai adapté à **Gymnasium**, dont `reset()` et `step()` renvoient des tuples différents, et à `tensorflow.compat.v1`.

## Résultats

| Approche                                    | Résultat                                    |
| ------------------------------------------- | ------------------------------------------- |
| Q-table, évaluation sans exploration        | **80 % de réussite** (100 épisodes)         |
| Q-table, score moyen pendant l'entraînement | 0,59                                        |
| DQN à une couche                            | 48 % d'épisodes réussis                     |
| Agent de trading (prix simulés)             | Capital de 1 000 → 1 740 (+74 %) sur un épisode |

> Sur un petit espace d'états comme FrozenLake (16 cases), la **Q-table bat le réseau de neurones** : elle est plus simple, plus rapide et plus précise. Le DQN devient intéressant quand les états sont trop nombreux pour tenir dans une table.

Ce TP a servi de base à mon projet [Agent de combat IA](/portfolio/projets/ai-engineer/agent-combat-q-learning).

**Pistes d'amélioration** : DQN avec *experience replay* et *target network*, recherche systématique des hyperparamètres, et évaluation de l'agent de trading sur de vraies données de marché et sur plusieurs épisodes.
