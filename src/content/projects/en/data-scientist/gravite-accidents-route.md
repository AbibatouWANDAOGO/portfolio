---
title: Predicting Road Accident Severity
domain: data-scientist
summary: Using records of the 125,000 people involved in road accidents in France in 2023 (BAAC open data), an XGBoost model that identifies 58% of fatal cases, built after detecting and fixing a data leak that inflated scores by 11 points.
date: 2025-11-15 # À AJUSTER
tools: [Python, Pandas, Scikit-learn, XGBoost, Random Forest, Pipeline, Seaborn]
github: https://github.com/AbibatouWANDAOGO/road-accident-severity-prediction
notebook: https://github.com/AbibatouWANDAOGO/road-accident-severity-prediction/blob/main/accident_severity_prediction.ipynb
status: terminé
featured: true
---

## Context

Every injury-causing road accident in France is documented by law enforcement in a **road accident report (BAAC)**, published as open data on data.gouv.fr. The 2023 edition covers **54,822 accidents** and **125,789 people involved**, split across four tables: accident characteristics, locations, vehicles and road users.

This project builds on my [accident detection and prediction](/portfolio/en/projects/data-scientist/detection-accidents) design study by applying it to real-world data.

## Problem

- **Predict the injury severity** of each person involved: uninjured, slightly injured, hospitalized or killed.
- **Identify the factors that drive injury severity**, to inform prevention efforts.

The core challenge: the classes are **highly imbalanced**, with only 2.7% of people killed.

## Approach

1. **Pre-merge data quality audit**: verifying the granularity of each table. The `lieux` (locations) table contains multiple rows for some accidents (intersections), which duplicates people in a naive join.
2. **Corrected join**: starting from the people table, then adding each person's vehicle, the accident and a single location per accident. The result is 125,789 rows with no duplicates.
3. **Exploratory data analysis**: share of severe injuries by road-user type, area, lighting conditions and age.
4. **Feature preparation**: 19 features covering circumstances, road, vehicle and person. Coded fields are treated as categorical rather than numeric (`catv` = 7 is not "greater than" `catv` = 2). Imputation and encoding are handled within a scikit-learn `Pipeline`.
5. **Group-based split** (`GroupShuffleSplit`): all people involved in the same accident are assigned to the same set, training or test.
6. **Modeling**: Random Forest, then a regularized XGBoost, then XGBoost with **class weighting**.
7. **Interpretation**: confusion matrices and feature importance.

![Share of severe injuries by road-user type](/portfolio/images/accidents/severe_rate_by_user.png)
*Motorcyclists (35%), pedestrians (32%) and cyclists (27%) are 2 to 3 times more likely to be killed or hospitalized than car occupants (13%).*

## Challenges

- **A data leak hidden in the join.** The initial version joined the tables starting from the accident level. This produced **37,894 duplicate rows** (23%), and 37% of test rows had a duplicate in the training set, so the model was partly evaluated on people it had already seen. Once fixed, the Random Forest's test accuracy dropped from **70.5% to 59.6%**: nearly 11 points had been artificial.

![Duplicate rows artificially inflate the Random Forest's test score](/portfolio/images/accidents/data_leakage_random_forest.png)

- **Severe overfitting**: the default Random Forest reached 98% accuracy on training data but only 60% on test data. I replaced it with a regularized XGBoost (shallow trees, subsampling), which scores 69% on training and 66% on test.
- **Misleading accuracy**: at 66% accuracy the model looked reasonable, yet it detected only **7% of fatal cases**, having learned that predicting the majority classes "pays off". I therefore tracked per-class recall, balanced accuracy and macro F1.
- **Numeric codes that are not numbers**: vehicle category, maneuver and point of impact are codes. Treating them as numbers would impose an ordering that does not exist.

## Results

| Model | Test accuracy | Balanced accuracy | Macro F1 | Fatal cases detected |
| --- | --- | --- | --- | --- |
| XGBoost | **0.662** | 0.474 | 0.487 | 7% |
| XGBoost with class weighting | 0.605 | **0.573** | **0.497** | **58%** |

> With class weighting, the model detects **8 times as many fatal cases** (58% vs. 7%) and 46% of hospitalized cases. The trade-off is lower overall accuracy and frequent false "killed" alerts (15% precision). For road safety applications, such as prioritizing emergency response or targeting prevention, missing a severe case is far more costly than a false alarm.

![Confusion matrices before and after class weighting](/portfolio/images/accidents/confusion_matrices.png)
*Each row shows how people with a given actual severity are classified. With weighting (right), the "killed → killed" cell rises from 7% to 58%.*

![Top features for predicting injury severity](/portfolio/images/accidents/feature_importance.png)
*Safety equipment, maneuver, vehicle category and the obstacle struck account for nearly half of total importance. Weather and road surface conditions do not appear in the top 12.*

**Key takeaways:**

- **Data quality matters as much as the model**: a single granularity issue in a join was enough to overstate performance by 11 points.
- **The right metric depends on the use case**: accuracy alone masked the fact that the model was missing almost all fatal accidents.
- **Severity depends primarily on how exposed a person is to the impact** (vehicle protection, safety equipment, obstacle struck). Outside built-up areas, the share of severe injuries is twice that of urban areas (26% vs. 13%), and it rises sharply after age 65 (32% over 75).

**Next steps**: merge "killed" and "hospitalized" into a single "seriously injured" class (a more robust binary problem), optimize decision thresholds, incorporate 2019–2022 data and train a separate model for each road-user type.

*Chart labels are in French.*
