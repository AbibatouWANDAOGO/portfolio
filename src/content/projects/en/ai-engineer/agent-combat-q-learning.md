---
title: Q-Learning Combat Agent
domain: ai-engineer
summary: A reinforcement learning agent that learns from scratch when to attack, defend or heal in a turn-based combat game, and adapts its strategy to each opponent's playstyle, reaching a 97–100% win rate.
date: 2026-03-25
tools: [Python, NumPy, Q-Learning, ε-greedy, Matplotlib, Seaborn]
# github: https://github.com/AbibatouWANDAOGO/agent-combat-q-learning
status: terminé
featured: true
---

## Context

This project was part of a reinforcement learning course in my fourth year at ESIEE Paris (Data Science track). The objective was to apply **Q-Learning** to a more realistic setting than the classic grid world: a turn-based combat game in which the agent must choose, at every turn, between **Attack**, **Defend** and **Heal**.

## Problem

Can an agent with **no prior knowledge of the rules** discover a winning strategy on its own, and then **adapt it to its opponent's behavior**?

The agent was tested against two opponent profiles:

- **Aggressive**: attacks 70% of the time.
- **Defensive**: defends or heals 80% of the time.

## Approach

1. **Custom `CombatEnv` environment**, built from scratch. It models hit points (100 per side), randomized damage (10–25 for the player), a defensive stance that halves incoming damage, healing, and a random distance (close, medium, far).
2. **State discretization**: hit points are binned in increments of 20, producing a compact `(player HP, enemy HP, distance)` state that keeps the Q-table tractable.
3. **Reward design**: +5 for a successful hit, +3 for healing, +1 for defending, −5 for taking damage, and a terminal reward of **±100** for a win or a loss.
4. **Q-Learning agent**: the Q-table is stored in a dictionary and expanded as new states are encountered. Values are updated with the Bellman equation (α = 0.1, γ = 0.9), using an **ε-greedy** policy with ε decaying from 1 to 0.01.
5. **Training**: 5,000 episodes per opponent type, with a dedicated agent for each.
6. **Analysis**: learning curves, extraction of the learned policy, heatmaps of the optimal action by HP level, and inspection of the Q-values.
7. **Hyperparameter tuning**: grid search over 27 combinations (α ∈ {0.05, 0.1, 0.2}, γ ∈ {0.8, 0.9, 0.95}, ε decay ∈ {0.99, 0.995, 0.999}) for each opponent.

## Challenges

- **An action the agent never uses**: the agent **never** chooses "Defend". Analyzing the reward structure showed why: defending yields only +1, compared with +5 and a faster win for attacking. This was a concrete illustration of how strongly *reward shaping* drives agent behavior.
- **A state feature with no impact**: distance is part of the state but does not yet affect damage. It inflates the state space without informing decisions.
- **Sparse state coverage**: some situations, such as a weakened player facing a healthy defensive opponent, are almost never visited during training. Their Q-values remain close to zero and are unreliable.
- **Unanticipated edge cases**: enemy HP can fall below zero, which created an unplanned "−1" bucket in the discretization.

## Results

Evaluation over 100 episodes with exploration disabled:

| Metric                 | vs. aggressive opponent | vs. defensive opponent |
| ---------------------- | ----------------------- | ---------------------- |
| **Win rate**           | **97%**                 | **100%**               |
| Average reward         | 105.6                   | 140.3                  |
| "Attack" actions       | 744                     | 1,002                  |
| "Heal" actions         | 34                      | 14                     |
| "Defend" actions       | 0                       | 0                      |

> The agent **tailors its strategy to its opponent**. Against the aggressive opponent, which deals more damage, it heals more than twice as often. Against the defensive opponent, it can attack almost continuously.

**Tuning**: the best configuration is α = 0.05 and γ = 0.95 for both opponents, raising the average reward to 111.9 against the aggressive opponent and 152.5 against the defensive one. A lower learning rate combined with a longer planning horizon yields a more stable policy.

**Next steps**: make distance meaningful (range-dependent damage, "Advance" and "Retreat" actions), redesign the rewards so that defending becomes a viable option, and move to a **Deep Q-Network** to handle continuous state spaces.
