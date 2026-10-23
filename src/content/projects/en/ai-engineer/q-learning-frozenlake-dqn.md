---
title: "Q-Learning: from Q-table to Deep Q-Network"
domain: ai-engineer
summary: Implementing and comparing two reinforcement learning approaches on FrozenLake (Q-table and neural network), studying the effect of hyperparameters, and applying them to a simulated trading agent.
date: 2026-03-20
tools: [Python, Gymnasium, NumPy, TensorFlow, Pandas, Matplotlib]
# github: https://github.com/AbibatouWANDAOGO/q-learning-practice
status: terminé
---

## Context

The goal of this reinforcement learning lab (4th year, FD track, ESIEE Paris) was to understand Q-Learning in practice: implement it yourself, run it on a standard environment, then observe the effect of each setting.

The chosen environment is **FrozenLake-v1** (Gymnasium). The agent has to cross a 4×4 frozen lake, from the start tile to the goal, without falling into the holes. The ice is slippery: an action does not always lead in the chosen direction.

## Problem

- Can an agent learn to reach the goal in a **random** environment, where the same action does not always give the same result?
- When should we prefer a **Q-table** over a **neural network** (DQN)?
- What is the real impact of the hyperparameters: learning rate, discount factor, exploration decay?

## Solution

1. **Q-table**: a 16 states × 4 actions table, updated with the Bellman equation (α = 0.8, γ = 0.95). Exploration adds noise that decays as 1/(i+1). Training runs for 1,000 episodes.
2. **Simple Deep Q-Network**: a one-layer network in TensorFlow. It takes the one-hot encoded state (1×16) and predicts the 4 Q-values. It is trained by gradient descent on the error between predicted and target Q.
3. **Hyperparameter study**: the Q-table is retrained over 5,000 episodes with ε-greedy exploration. I then change one parameter at a time: α from 0.9 to 0.5, γ from 0.99 to 0.85, and the ε decay from 0.0001 to 0.0005. The curves are compared using a 100-episode moving average.
4. **Going further: a trading agent**: a `TradingEnv` environment on simulated prices, with three actions (buy, sell, hold) and a profit-based reward.

## Challenges

- **An "improvement" that lowered the score**: moving to 5,000 episodes with an ε decay of 0.0001 per episode made the average training score drop to 0.02. ε was still 0.5 at the end, so the agent was playing randomly half of the time. With a faster decay (0.0005), the score climbs back to **0.27**. Tuning exploration matters as much as the rest.
- **Choosing the right metric**: the average score over the whole training includes the exploration phase and underestimates the final agent. The agent must be evaluated **without exploration** on separate episodes.
- **Library compatibility**: the original code used the old Gym API and TensorFlow 1. I adapted it to **Gymnasium**, whose `reset()` and `step()` return different tuples, and to `tensorflow.compat.v1`.

## Results

| Approach                                  | Result                                      |
| ----------------------------------------- | ------------------------------------------- |
| Q-table, evaluated without exploration    | **80% success rate** (100 episodes)         |
| Q-table, average score during training    | 0.59                                        |
| One-layer DQN                             | 48% successful episodes                     |
| Trading agent (simulated prices)          | Capital from 1,000 → 1,740 (+74%) over one episode |

> On a small state space like FrozenLake (16 tiles), the **Q-table beats the neural network**: it is simpler, faster and more accurate. A DQN becomes worthwhile when there are too many states to fit in a table.

This lab laid the groundwork for my [AI Combat Agent](/portfolio/en/projects/ai-engineer/agent-combat-q-learning) project.

**Next steps**: DQN with *experience replay* and a *target network*, a systematic hyperparameter search, and evaluating the trading agent on real market data over several episodes.
