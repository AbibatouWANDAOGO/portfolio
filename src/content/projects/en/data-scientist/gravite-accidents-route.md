---
title: Predicting Road Accident Severity
domain: data-scientist
summary: Using the 125,000 people involved in road accidents in France in 2023 (BAAC open data), an XGBoost model that flags 58% of fatal cases, after detecting and fixing a data leak that inflated scores by 11 points.
date: 2025-11-15 # À AJUSTER
tools: [Python, Pandas, Scikit-learn, XGBoost, Random Forest, Pipeline, Seaborn]
github: https://github.com/AbibatouWANDAOGO/road-accident-severity-prediction
notebook: https://github.com/AbibatouWANDAOGO/road-accident-severity-prediction/blob/main/accident_severity_prediction.ipynb
status: terminé
featured: true
---

## Context

Every road accident causing injury in France is recorded in an **accident analysis report (BAAC)**, filled in by the police and published as open data on data.gouv.fr. For 2023, that means **54,822 accidents** and **125,789 people involved**. The data is split into four files: accident characteristics, locations, vehicles and road users.

This project builds on my design study on [accident detection and prediction](/portfolio/en/projects/data-scientist/detection-accidents) by putting it into practice on real data.

## Problem

- **Predict the injury severity** of each person involved: unharmed, slightly injured, hospitalised or killed.
- **Understand which factors make injuries worse**, to guide prevention.

The main difficulty: the classes are **highly imbalanced**, with only 2.7% of people killed.

## Solution

1. **Data quality audit before merging**: checking the grain of each table. The `lieux` file has several rows for some accidents (intersections), which duplicates people in a naive merge.
2. **Corrected merge**: starting from people, adding their vehicle, the accident, then a single location per accident. The result is 125,789 rows with no duplicates.
3. **Exploratory analysis**: share of serious injuries by road-user profile, area, lighting and age.
4. **Preparation**: 19 variables (circumstances, road, vehicle, person). Codes are encoded as categories, not numbers (`catv` = 7 is not "greater" than `catv` = 2). Imputation and encoding are done inside a scikit-learn `Pipeline`.
5. **Split by accident** (`GroupShuffleSplit`): everyone involved in the same accident ends up on the same side, training or test.
6. **Modelling**: Random Forest, then a regularised XGBoost, then XGBoost with **class weighting**.
7. **Interpretation**: confusion matrices and feature importance.

![Share of serious injuries by road-user profile](/portfolio/images/accidents/severe_rate_by_user.png)
*Motorcyclists (35%), pedestrians (32%) and cyclists (27%) are 2 to 3 times more likely to be killed or hospitalised than car occupants (13%).*

## Challenges

- **A data leak hidden in the merge.** The first version merged the tables starting from accidents. This created **37,894 duplicated rows** (23%), and 37% of test rows had their duplicate in the training set. The model was therefore partly evaluated on people it had already seen. After the fix, the Random Forest's test score drops from **70.5% to 59.6%**: nearly 11 points were artificial.

![Duplicates artificially inflate the Random Forest's test score](/portfolio/images/accidents/data_leakage_random_forest.png)

- **Massive overfitting**: the default Random Forest reaches 98% on training data but 60% on test data. I replaced it with a regularised XGBoost (shallow trees, subsampling), which scores 69% on training and 66% on test.
- **A misleading accuracy**: at 66% accuracy, the model looked fine, but it only detected **7% of fatal cases**. It had learned that predicting the majority classes "pays off". So I tracked per-class recall, balanced accuracy and macro F1.
- **Numeric codes that aren't numbers**: vehicle category, manoeuvre and point of impact are codes. Treating them as numbers meant inventing an order between them.

## Results

| Model | Test accuracy | Balanced accuracy | Macro F1 | Fatal cases detected |
| --- | --- | --- | --- | --- |
| XGBoost | **0.662** | 0.474 | 0.487 | 7% |
| XGBoost with class weighting | 0.605 | **0.573** | **0.497** | **58%** |

> With class weighting, the model detects **8 times more fatal cases** (58% instead of 7%) and 46% of hospitalised people. In return, overall accuracy drops and "killed" alerts are often wrong (15% precision). For road-safety use, such as prioritising emergency response or targeting prevention, missing a serious case costs far more than a false alarm.

![Confusion matrices before and after class weighting](/portfolio/images/accidents/confusion_matrices.png)
*Each row shows how people with a given actual severity are classified. With weighting (right), the "killed → killed" cell rises from 7% to 58%.*

![Most important variables for predicting severity](/portfolio/images/accidents/feature_importance.png)
*Safety equipment, manoeuvre, vehicle category and the obstacle hit account for nearly half of the importance. Weather and road surface do not appear in the top 12.*

**Key takeaways:**

- **Data quality matters as much as the model**: a simple grain issue in a join was enough to overestimate performance by 11 points.
- **The right metric depends on the use case**: accuracy alone hid the fact that the model detected almost no fatal accidents.
- **Severity depends mostly on how a person is exposed to the impact** (vehicle protection, safety equipment, obstacle hit). Outside built-up areas, the share of serious injuries is twice as high as in town (26% vs 13%). It also rises sharply after age 65 (32% over 75).

**Next steps**: merge "killed" and "hospitalised" into a single "seriously injured" class (a more robust binary problem), tune decision thresholds, add the 2019–2022 data and train one model per road-user type.

*Charts are labelled in French.*
