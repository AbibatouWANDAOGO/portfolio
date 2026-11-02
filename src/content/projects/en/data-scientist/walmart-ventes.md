---
title: Walmart Sales Forecasting
domain: data-scientist
summary: Forecasting weekly sales across 45 Walmart stores using economic, weather and calendar data. An end-to-end workflow, from data preparation to feature engineering, resulting in a linear regression that explains 94% of the variance on unseen data.
date: 2025-12-01 # À AJUSTER
tools: [Python, Pandas, Seaborn, Scikit-learn, KNN Imputer, Linear regression]
github: https://github.com/AbibatouWANDAOGO/walmart-sales-forecasting
notebook: https://github.com/AbibatouWANDAOGO/walmart-sales-forecasting/blob/main/walmart_sales_forecasting.ipynb
status: terminé
draft: false
---

## Context

A personal data science project covering the full workflow, from data cleaning and quality assurance through to forecasting. It uses data from the Kaggle competition *Walmart Recruiting – Store Sales Forecasting*: three years of **weekly sales for 45 Walmart stores** across the United States (6,438 store-weeks), along with contextual variables such as temperature, fuel price, consumer price index (CPI), unemployment rate, marketing campaigns and holidays, plus each store's type, size and headcount.

## Problem

Can we **accurately forecast a store's weekly sales** from these factors, and **which variables actually drive** sales?

## Approach

1. **Data integration**: joining the sales and store tables on the `Store` key (`pd.merge`), then validating the result against the reference file.
2. **Data quality**: 3 duplicate rows were identified and removed. Missing values were then deliberately injected (55 NaNs across all columns) to build a robust handling strategy:
   - categorical variables (store, date, type, holiday): forward fill (`ffill`);
   - numerical variables: **standardization** (`StandardScaler`), followed by **5-nearest-neighbor imputation** (`KNNImputer`), then rescaling to the original units.
3. **Exploratory data analysis**: correlation matrix, box plots of sales by store type and holiday period, and sales trends over time.
4. **Encoding**: the date is broken down into year, month, week and day, and `Store`, `Type` and `IsHoliday` are one-hot encoded, for a total of 62 features.
5. **Modeling**: linear regression with an 80/20 train/test split, evaluated using RSS, RSE and R² on both sets.
6. **Feature engineering**: sales spike sharply at Thanksgiving and in the run-up to Christmas, which `IsHoliday` fails to capture. I engineered an `End_of_year_holidays` feature, set to 1 for weeks 47 and 49 through 51.

![Average weekly sales over time: two sharp peaks at Thanksgiving and before Christmas](/portfolio/images/walmart/sales_over_time.png)
*Average weekly sales across the 45 stores remain stable throughout the year, apart from two sharp peaks at Thanksgiving and ahead of Christmas. This pattern motivated the "end-of-year holidays" feature.*


## Challenges

- **Missing values everywhere, including in date and boolean fields.** Scikit-learn's KNN imputer only handles numerical data, so I separated categorical variables, filled with the previous value, from numerical ones, imputed with KNN. Standardizing before KNN was critical: otherwise `Size` (≈ 100,000) completely dominates `Fuel_Price` (≈ 3) in the distance calculation.
- **Validating the imputation.** Comparing imputed values with the ground truth showed that store size is recovered exactly, since the nearest neighbors are other weeks from the same store. Fuel price, by contrast, is estimated with roughly 9% error.
- **pandas version compatibility.** Injecting missing values writes NaNs into a boolean column, which is deprecated in pandas 2 and disallowed in pandas 3; `fillna(method='ffill')` has also been removed. I updated the code (`.ffill()`) and pinned the pandas version to ensure reproducibility.
- **Should features be standardized for the regression?** No: in ordinary least squares, rescaling a feature changes its coefficient but not the predictions or the R². I kept sales in dollars to preserve interpretability.

## Results

| Model                                          | Train R²  | Test R²   |
| ---------------------------------------------- | --------- | --------- |
| Numerical features only                        | 0.675     | 0.658     |
| + date + one-hot encoding (store, type, holiday) | 0.930   | 0.918     |
| + "end-of-year holidays" feature               | **0.954** | **0.941** |

![R² comparison across the three models](/portfolio/images/walmart/model_comparison.png)

> A simple linear regression, combined with sound encoding and **one well-designed feature**, explains **94% of the variance** in sales on unseen weeks. The residual standard error falls from $319,000 to $121,000 per week.

![Predicted vs. actual sales on the test set, and error distribution](/portfolio/images/walmart/predictions_vs_actual.png)
*Left: each point is a test-set week; the closer it lies to the diagonal, the more accurate the forecast. Right: errors are centered on zero, with a median error of **$48,000** against average weekly sales of about $1M.*

**Key takeaways:**

- **Store size** is the primary driver of sales (correlation of 0.81). Unemployment, CPI and fuel price have very little impact.
- **Store identity** (one-hot encoding) delivers the largest performance gain, as each store has its own baseline sales level.
- **An end-of-year holiday week** adds an average of **$460,000** in sales per store and is the dominant seasonal effect. By contrast, `IsHoliday` weeks, which combine the Super Bowl, Labor Day and Christmas, lift sales by only about 8%.

**Model limitations:** for the largest store in the network, the model correctly times the Christmas peaks but significantly underestimates their magnitude (≈ $2.5M predicted vs. $3.8M actual). In a linear regression, the holiday effect is a fixed dollar amount applied equally to every store, whereas in reality it scales with store size.

![Actual vs. predicted sales for Store 20](/portfolio/images/walmart/store_20_actual_vs_predicted.png)

**Next steps**: add a `holidays × store size` interaction term or log-transform the target to capture proportional effects, use time-series cross-validation (train on past data, test on future data), try non-linear models (Random Forest, Gradient Boosting) and add lag features (prior weeks' sales).
