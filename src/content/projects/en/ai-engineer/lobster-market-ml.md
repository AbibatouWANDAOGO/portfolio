---
title: Predicting Apple's Next-Second Price Move from the Order Book
domain: ai-engineer
summary: Using 400,000 Apple limit order book events (LOBSTER), a model that predicts whether the price will rise, fall or stay flat over the next second, evaluated with strict leakage controls and served through a containerized FastAPI service.
date: 2026-11-06
tools: [Python, Pandas, Scikit-learn, Random Forest, FastAPI, Pydantic, Pytest, Docker]
github: https://github.com/AbibatouWANDAOGO/lobster-market-ml
notebook: https://github.com/AbibatouWANDAOGO/lobster-market-ml/blob/main/notebooks/02_modeling.ipynb
status: terminé
featured: true
---

## Context

On an electronic exchange, the **limit order book** continuously lists the buy and sell orders waiting at each price level. It is the raw material of algorithmic trading and execution quality analysis, which is at the core of my role as a Listed Derivatives Analyst.

I worked with the public **LOBSTER** sample: **Apple's** order book across 10 levels for **June 21, 2012**, totaling **400,391 events** (orders placed, canceled and executed), timestamped to the nanosecond.

The project had two goals: apply a rigorous **data science** process to financial market data, then turn the result into a tested, deployable **machine learning service**.

![Best bid and best ask over two minutes](/portfolio/images/lobster/02_bid_ask_zoom.png)
*Two minutes of trading: each step is a change in the best bid (blue) or best ask (orange). The gap between them is the spread.*

## Problem

**Can the state of the order book predict whether the mid-price will rise, fall or stay flat over the next second?**

- The data is **sequential and highly autocorrelated**: a random split would produce artificially inflated scores.
- Each label looks **one second into the future**: without safeguards, future information leaks into training.
- The model has to be **served** reliably, with validated inputs.

## Approach

1. **Data validation**: format, order book consistency, chronology, and a strict alignment test between the two source files. Every new order must appear in the book on the same row, down to the share. Result: 100% alignment.
2. **Exploratory analysis**: a median spread of 14 ticks, a price that falls all day, and balanced classes (about one third each) with a 1-cent threshold.
3. **Target**: direction of the mid-price one second ahead (up, down or stable).
4. **15 features computed from past data only**: spread, size and imbalance at the best level, 5-level depth, recent returns and volatility, activity and signed trade flow.
5. **Leakage-safe evaluation**: chronological 70/15/15 split with a one-second gap and **purging** of rows whose label looks into the next period.
6. **Protocol defined upfront**: four models compared on validation, feature groups added one at a time, then **a single evaluation on the test set**.
7. **Productionization**: model saved with full metadata, a FastAPI service (`/health`, `/model-info`, `/predict`) with Pydantic validation, and a tested Docker image.

![Adding feature groups one at a time](/portfolio/images/lobster/11_feature_ablation_validation.png)
*Recent price dynamics deliver the largest gain. Adding time of day hurts performance, because the test hours never appear in training.*

## Challenges

- **A hidden data leak**: each label looks at "the first event one second later". In quiet markets, that event can arrive much later and fall into the next period, so a one-second gap alone was not enough. I added **purging**, backed by tests.
- **Simultaneous events**: several events can share the same timestamp. Rolling windows are therefore bounded by row index, so an event that arrives just after the current one is never used. A test confirms that features are identical with or without the rest of the day.
- **Misleading features**: the price declines all day, and the test period trades below every price seen in training. I excluded the price level and the time of day, and an experiment confirms that time of day degrades the model.
- **A methodological error caught and fixed**: a decile-based binning split identical values arbitrarily and created spurious patterns. I replaced it with fixed-width bins.
- **An API bug surfaced by testing**: an `Infinity` input was correctly rejected, but the error message crashed the server (a 500 instead of a 422). Fixed and covered by tests.

## Results

| Final test (3:26–4:00 p.m., never used for any decision) | Macro F1 | Accuracy |
| --- | --- | --- |
| **Random Forest, 15 features** | **0.437** | **44.3%** |
| Baseline (majority class) | 0.162 | 32.1% |

> On a period it had never seen, the model predicts next-second direction **well above chance**. The main signal is **very short-term momentum**: after a rise of 5 cents or more over the last second, the next second moves up 42% of the time and down only 34%.

![Permutation feature importance](/portfolio/images/lobster/13_permutation_importance.png)
*The last-second return dominates, followed by signed trade flow. Deeper book levels add almost nothing at a one-second horizon.*

![Confusion matrix on the test set](/portfolio/images/lobster/12_confusion_matrix_test.png)
*At the end of the day, the most active period, the model identifies down moves (53%) and up moves (46%) well, and quiet periods less well.*

**On the engineering side**: 109 automated tests, a reproducible artifact (a test recomputes the exact recorded score), an API that rejects any invalid input and never returns a prediction without a model, and a verified Docker image (non-root user, health check).

![Prediction run from the interactive API documentation](/portfolio/images/lobster/16_api_predict.png)
*The interactive API documentation: a request with the 15 features returns the predicted class and its probabilities.*

**Limitations**: a single stock, a single day and a 34-minute test window. Predicting direction better than chance is not a trading strategy: the spread is far wider than the typical one-second move, and transaction costs are not modeled.

**Next steps**: extend to multiple days and other stocks (Microsoft, Amazon, etc.), test other horizons and thresholds, and compute features in real time from a live market feed.
