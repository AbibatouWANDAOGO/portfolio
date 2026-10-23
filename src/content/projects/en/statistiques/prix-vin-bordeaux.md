---
title: Predicting Bordeaux Wine Prices from the Weather
domain: statistiques
summary: Rebuilding Ashenfelter's "Bordeaux equation". Four weather variables and age explain 83% of a vintage's price, and +1 °C during the growing season is worth about +84% in price.
date: 2024-04-29
tools: [Python, Statsmodels, Scikit-learn, Linear regression, Cross-validation, Seaborn]
github: https://github.com/AbibatouWANDAOGO/bordeaux-wine-price-prediction
notebook: https://github.com/AbibatouWANDAOGO/bordeaux-wine-price-prediction/blob/main/wine_price_prediction.ipynb
status: terminé
featured: false
---

## Context

In 1990, Princeton economist **Orley Ashenfelter** claimed that you could predict the quality of a Bordeaux vintage, and therefore its price, **without tasting it**, using only the weather of the harvest year. Wine critics were outraged. Yet his "Bordeaux equation" often beat the experts.

The data covers **25 vintages** (1952–1978): average auction price in 1990–1991, growing-season temperature, harvest rain, winter rain, age of the wine and French population. Two more vintages (1979 and 1980) are used as a test set.

## Problem

- **Does the model hold up statistically?** How much of the price does the weather really explain?
- **What is each factor worth?** What does one extra degree bring, and what do 100 mm of rain cost?
- **Can we predict the price of vintages the model has never seen?**

## Solution

1. **Data checks**: reading the documentation shows that `Price` is **already a logarithm**. It is modelled as is, so each coefficient reads directly as a percentage effect on the actual price.
2. **Exploratory analysis**: correlations and scatter plots of price against the weather.
3. **Six models of increasing complexity**, from the simple mean up to Ashenfelter's equation with an interaction between winter rain and harvest rain.
4. **Selection by leave-one-out cross-validation**: each vintage is predicted by a model trained on the other 24, rather than relying on the training R².
5. **Collinearity**: analysis of variance inflation factors (VIF).
6. **Interpretation**: coefficients, confidence intervals and p-values with `statsmodels`.
7. **Residual diagnostics** (normality, homoscedasticity) and **prediction** of 1979 and 1980 with 95% intervals.

![Price against temperature and harvest rain](/portfolio/images/vin/price_vs_weather.png)
*Great vintages such as 1961 and 1953 combine a hot summer and a dry harvest. 1968 and 1965 had the opposite.*

## Challenges

- **Avoiding a "double logarithm".** The first approach took the log of `Price`, even though it is already a logarithm. The R² values barely change, but the coefficients can no longer be read as percentages. A reminder to always read the data documentation.
- **A misleading R² with 25 observations.** Adding every variable gives the same training R² as Ashenfelter's equation (0.829) but a higher prediction error. So I compared models using **cross-validation**.
- **Perfect collinearity.** `Age` = 1983 − `Year` for every vintage, and `FrancePop` tracks the years (VIF ≈ 100). This does not hurt prediction, but it makes the coefficients uninterpretable: I kept only `Age`.
- **A model without an intercept.** A `statsmodels` fit without an intercept reported an R² of 0.999, which is meaningless. The constant has to be added explicitly (`sm.add_constant`).

## Results

| Model | R² | Adjusted R² | Prediction error (LOO) |
| --- | --- | --- | --- |
| Mean (baseline) | – | – | 0.664 |
| Temperature only | 0.435 | 0.410 | 0.516 |
| + harvest rain | 0.707 | 0.681 | 0.391 |
| All variables | 0.829 | 0.784 | 0.359 |
| Ashenfelter's equation | 0.829 | 0.794 | 0.338 |
| **+ rain interaction** | **0.856** | **0.818** | **0.309** |

![Model comparison: adjusted R² and cross-validation error](/portfolio/images/vin/model_comparison.png)

> **Yes, you can predict the quality of a Bordeaux without tasting it.** Temperature, rainfall and age explain **83% of the variance** in prices, and the best model **halves the prediction error** compared with the simple mean.

![Effect of weather and age on the price of a vintage](/portfolio/images/vin/weather_effects_on_price.png)
*All else being equal, +1 °C during the growing season multiplies the price by 1.8 (+84%), and +100 mm of rain during the harvest lowers it by 33%. Temperature is the most decisive factor (t = 6.2).*

![Cross-validated predictions and predictions for the 1979–1980 vintages](/portfolio/images/vin/predictions_new_vintages.png)
*For 1979 and 1980, never seen by the model, the actual prices fall within the 95% prediction intervals. Even 1961, the most expensive vintage, is predicted almost perfectly.*

**Key takeaways:**

- **Growing-season temperature** is the main driver of quality, and **rain during the harvest** is its main enemy: water dilutes the grapes just before picking.
- **With little data, cross-validation is essential** for choosing a model: the training R² rewards complexity.
- **The model's assumptions hold**: normal residuals (Shapiro-Wilk, p = 0.84) with constant variance (Breusch-Pagan, p = 0.69).

**Limits and next steps**: with 25 observations, the intervals remain wide (1979 is underestimated by 26% while still falling within its interval). Some unusual vintages, such as 1959, escape the model. Next steps: add recent vintages, use Ridge regression to stabilise the coefficients, and include wine-growing variables such as appellation or grape variety.

*Charts are labelled in French.*
