---
title: Predicting Bordeaux Wine Prices from Weather Data
domain: statistiques
summary: A replication of Orley Ashenfelter's "Bordeaux equation". Four weather variables and the age of the wine explain 83% of the variation in vintage prices, and each additional 1 °C during the growing season raises prices by roughly 84%.
date: 2024-04-29
tools: [Python, Statsmodels, Scikit-learn, Linear regression, Cross-validation, Seaborn]
github: https://github.com/AbibatouWANDAOGO/bordeaux-wine-price-prediction
notebook: https://github.com/AbibatouWANDAOGO/bordeaux-wine-price-prediction/blob/main/wine_price_prediction.ipynb
status: terminé
featured: false
---

## Context

In 1990, Princeton economist **Orley Ashenfelter** claimed that the quality of a Bordeaux vintage, and therefore its price, could be predicted **without tasting the wine**, using only weather data from the harvest year. Wine critics were outraged, yet his "Bordeaux equation" frequently outperformed the experts.

The dataset covers **25 vintages** (1952–1978): average auction price in 1990–1991, growing-season temperature, harvest rainfall, winter rainfall, age of the wine and the population of France. Two additional vintages (1979 and 1980) serve as a holdout test set.

## Problem

- **Is the model statistically sound?** How much of the price variation does weather actually explain?
- **How much is each factor worth?** What is one extra degree worth, and how much do 100 mm of rain cost?
- **Can the model predict prices for vintages it has never seen?**

## Approach

1. **Data validation**: the documentation shows that `Price` is **already log-transformed**. It is modeled as is, so each coefficient can be read directly as a percentage effect on the actual price.
2. **Exploratory data analysis**: correlations and scatter plots of price against weather variables.
3. **Six models of increasing complexity**, from a mean-only baseline up to Ashenfelter's equation with an interaction between winter and harvest rainfall.
4. **Model selection via leave-one-out cross-validation**: each vintage is predicted by a model trained on the remaining 24, rather than relying on in-sample R².
5. **Multicollinearity**: analysis of variance inflation factors (VIF).
6. **Inference**: coefficients, confidence intervals and p-values with `statsmodels`.
7. **Residual diagnostics** (normality, homoscedasticity) and **out-of-sample forecasts** for 1979 and 1980 with 95% prediction intervals.

![Price vs. growing-season temperature and harvest rainfall](/portfolio/images/vin/price_vs_weather.png)
*Exceptional vintages such as 1961 and 1953 combine a hot summer with a dry harvest; 1968 and 1965 had the opposite conditions.*

## Challenges

- **Avoiding a "double log".** My first approach log-transformed `Price`, even though it was already on a log scale. The R² barely changed, but the coefficients could no longer be interpreted as percentages: a reminder to always read the data documentation.
- **A misleading R² with only 25 observations.** Including every variable yields the same in-sample R² as Ashenfelter's equation (0.829) but a higher prediction error. I therefore compared models using **cross-validation**.
- **Perfect multicollinearity.** `Age` = 1983 − `Year` for every vintage, and `FrancePop` moves in lockstep with time (VIF ≈ 100). This does not harm prediction, but it makes the coefficients uninterpretable, so I kept only `Age`.
- **A model fitted without an intercept.** A `statsmodels` fit without an intercept reported an R² of 0.999, which is meaningless. The constant must be added explicitly (`sm.add_constant`).

## Results

| Model | R² | Adjusted R² | Prediction error (LOOCV) |
| --- | --- | --- | --- |
| Mean (baseline) | – | – | 0.664 |
| Temperature only | 0.435 | 0.410 | 0.516 |
| + harvest rainfall | 0.707 | 0.681 | 0.391 |
| All variables | 0.829 | 0.784 | 0.359 |
| Ashenfelter's equation | 0.829 | 0.794 | 0.338 |
| **+ rainfall interaction** | **0.856** | **0.818** | **0.309** |

![Model comparison: adjusted R² and cross-validation error](/portfolio/images/vin/model_comparison.png)

> **Yes, the quality of a Bordeaux can be predicted without tasting it.** Temperature, rainfall and age explain **83% of the variance** in prices, and the best model **cuts prediction error in half** compared with the mean-only baseline.

![Impact of weather and age on vintage prices](/portfolio/images/vin/weather_effects_on_price.png)
*All else being equal, an additional 1 °C during the growing season multiplies the price by 1.8 (+84%), while an extra 100 mm of rain at harvest lowers it by 33%. Temperature is the most significant factor (t = 6.2).*

![Cross-validated predictions and forecasts for the 1979 and 1980 vintages](/portfolio/images/vin/predictions_new_vintages.png)
*For 1979 and 1980, which the model never saw, actual prices fall within the 95% prediction intervals. Even 1961, the most expensive vintage, is predicted almost exactly.*

**Key takeaways:**

- **Growing-season temperature** is the main driver of quality, while **rain at harvest time** is its main enemy, as it dilutes the grapes just before picking.
- **With limited data, cross-validation is essential** for model selection: in-sample R² rewards complexity.
- **The model's assumptions hold**: residuals are normally distributed (Shapiro-Wilk, p = 0.84) with constant variance (Breusch-Pagan, p = 0.69).

**Limitations and next steps**: with only 25 observations, prediction intervals remain wide (1979 is underestimated by 26%, though still within its interval), and some atypical vintages, such as 1959, are poorly captured by the model. Next steps include adding more recent vintages, applying Ridge regression to stabilize the coefficients, and incorporating viticultural variables such as appellation or grape variety.

*Chart labels are in French.*
