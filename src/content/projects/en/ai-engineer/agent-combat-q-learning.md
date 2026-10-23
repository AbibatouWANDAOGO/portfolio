---
title: AI Combat Agent with Q-Learning
domain: ai-engineer
summary: An agent that teaches itself, through reinforcement learning, when to attack, defend or heal in a turn-based fight, and adapts its strategy to the enemy's style (97 to 100% win rate).
date: 2026-03-25
tools: [Python, NumPy, Q-Learning, ε-greedy, Matplotlib, Seaborn]
# github: https://github.com/AbibatouWANDAOGO/agent-combat-q-learning
status: terminé
featured: true
---

## Context

This project was built for a reinforcement learning course (4th year, FD track) at ESIEE Paris. The idea was to apply **Q-Learning** to something more concrete than a grid world: a turn-based mini combat game, like in a video game, where the AI must choose each turn between **Attack**, **Defend** and **Heal**.

## Problem

Can we train an agent that, **without knowing the rules in advance**, discovers a winning strategy and then **adapts it to the opponent's behaviour**?

Two kinds of enemies were tested:

- **Aggressive**: attacks 70% of the time.
- **Defensive**: defends or heals 80% of the time.

## Solution

1. **`CombatEnv` environment**: built from scratch. It handles hit points (100 on each side), random damage (10–25 for the player), defending that halves incoming damage, healing, and a random distance (close, medium, far).
2. **State discretisation**: HP are grouped into buckets of 20, giving the state `(player HP, enemy HP, distance)`. This keeps the number of states small enough for a Q-table.
3. **Rewards**: +5 for landing a hit, +3 for healing, +1 for defending, −5 for taking a hit, and **±100** at the end of the fight depending on victory or defeat.
4. **Q-Learning agent**: the Q-table is stored in a dictionary and filled in as new states are discovered. It is updated with the Bellman equation (α = 0.1, γ = 0.9). Exploration is **ε-greedy**, with ε decaying from 1 to 0.01.
5. **Training**: 5,000 fights per enemy type, with a separate agent for each.
6. **Analysis**: reward curves, extraction of the learned policy, heatmaps of the best action by HP, and inspection of the Q-values.
7. **Hyperparameter tuning**: grid search over 27 combinations (α ∈ {0.05; 0.1; 0.2}, γ ∈ {0.8; 0.9; 0.95}, ε decay ∈ {0.99; 0.995; 0.999}) for each enemy type.

## Challenges

- **An action that is never chosen**: the agent **never** picks "Defend". Looking at the rewards, I realised that defending pays little (+1) compared with attacking (+5 and a faster win). The agent's behaviour depends directly on how the rewards are designed (*reward shaping*).
- **A distance with no effect**: distance is part of the state but does not yet influence damage. It multiplies the number of states without helping the decision.
- **Rarely visited states**: some situations, such as "weak player against a strong enemy" when facing the defensive enemy, almost never come up during training. Their Q-values stay close to 0 and cannot be trusted.
- **Unexpected states**: enemy HP can drop below 0, which creates a "−1" bucket I had not planned for in the discretisation.

## Results

Evaluation over 100 fights, with no exploration:

| Metric                 | vs aggressive enemy | vs defensive enemy |
| ---------------------- | ------------------- | ------------------ |
| **Win rate**           | **97%**             | **100%**           |
| Average reward         | 105.6               | 140.3              |
| "Attack" actions       | 744                 | 1,002              |
| "Heal" actions         | 34                  | 14                 |
| "Defend" actions       | 0                   | 0                  |

> The agent **adapts its strategy to the opponent**. Against an aggressive enemy that deals more damage, it heals more than twice as often. Against a defensive enemy, it can attack almost non-stop.

**Tuning**: the best configuration is α = 0.05 and γ = 0.95 for both enemy types. The average reward rises to 111.9 against the aggressive enemy and 152.5 against the defensive one. Slower learning and a long-term view give a more stable policy.

**Next steps**: give distance a real role (range-based damage, "Move closer" and "Move away" actions), redesign the rewards so that defending becomes worthwhile, and move to a **Deep Q-Network** to handle continuous states.
