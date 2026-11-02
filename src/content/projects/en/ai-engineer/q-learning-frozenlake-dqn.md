---
title: "Q-Learning: From Q-Table to Deep Q-Network"
domain: ai-engineer
summary: Implementing and benchmarking two reinforcement learning approaches on FrozenLake (tabular Q-learning and a neural network), analyzing the impact of hyperparameters, and extending the work to a simulated trading agent.
date: 2026-03-20
tools: [Python, Gymnasium, NumPy, TensorFlow, Pandas, Matplotlib]
# github: https://github.com/AbibatouWANDAOGO/q-learning-practice
status: terminé
---

## Context

This reinforcement learning lab (fourth year, Data Science track, ESIEE Paris) aimed to build a hands-on understanding of Q-Learning: implementing the algorithm from scratch, running it on a standard benchmark, and measuring the effect of each parameter.

The benchmark is **FrozenLake-v1** (Gymnasium). The agent must cross a 4×4 frozen lake from the start tile to the goal without falling through the holes. The ice is slippery, so an action does not always move the agent in the intended direction.

## Problem

- Can an agent learn to reach the goal in a **stochastic** environment, where the same action does not always produce the same outcome?
- When is a **Q-table** preferable to a **neural network** (DQN)?
- How much do the hyperparameters (learning rate, discount factor, exploration decay) actually matter?

## Approach

1. **Tabular Q-learning**: a 16-state × 4-action table updated with the Bellman equation (α = 0.8, γ = 0.95). Exploration relies on noise that decays as 1/(i+1). Training runs for 1,000 episodes.
2. **Simple Deep Q-Network**: a single-layer TensorFlow network that takes a one-hot encoded state (1×16) and outputs the four Q-values. It is trained by gradient descent on the error between predicted and target Q-values.
3. **Hyperparameter study**: the Q-table is retrained over 5,000 episodes with ε-greedy exploration, varying one parameter at a time: α from 0.9 to 0.5, γ from 0.99 to 0.85, and the ε decay rate from 0.0001 to 0.0005. Runs are compared using a 100-episode moving average.
4. **Extension to trading**: a custom `TradingEnv` on simulated prices, with three actions (buy, sell, hold) and a profit-based reward.

## Challenges

- **An "improvement" that hurt performance**: extending training to 5,000 episodes with an ε decay of 0.0001 per episode dropped the average training score to 0.02. With ε still at 0.5 at the end of training, the agent was acting randomly half the time. A faster decay (0.0005) brought the score back up to **0.27**. Exploration tuning matters as much as any other setting.
- **Choosing the right metric**: the average score over the full training run includes the exploration phase and understates the final agent's performance. The agent has to be evaluated **with exploration disabled**, on separate episodes.
- **Library migration**: the original code relied on the legacy Gym API and TensorFlow 1. I ported it to **Gymnasium**, whose `reset()` and `step()` return different tuples, and to `tensorflow.compat.v1`.

## Results

| Approach                                   | Result                                         |
| ------------------------------------------ | ---------------------------------------------- |
| Q-table, evaluated without exploration     | **80% success rate** (100 episodes)            |
| Q-table, average score during training     | 0.59                                           |
| Single-layer DQN                           | 48% of episodes successful                     |
| Trading agent (simulated prices)           | Capital grew from 1,000 to 1,740 (+74%) in one episode |

> On a small state space such as FrozenLake (16 tiles), the **Q-table outperforms the neural network**: it is simpler, faster and more accurate. A DQN only pays off once the state space is too large to fit in a table.

This lab laid the groundwork for my [Q-Learning Combat Agent](/portfolio/en/projects/ai-engineer/agent-combat-q-learning) project.

**Next steps**: a DQN with *experience replay* and a *target network*, a systematic hyperparameter search, and a multi-episode evaluation of the trading agent on real market data.
