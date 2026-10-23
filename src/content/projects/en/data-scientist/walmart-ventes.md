---
title: Walmart Sales Forecasting
domain: data-scientist
summary: Forecasting weekly sales for 45 Walmart stores from economic, weather and calendar data. From data preparation to feature engineering, a linear regression that explains 94% of the variance on test data.
date: 2025-12-01 # À AJUSTER
tools: [Python, Pandas, Seaborn, Scikit-learn, KNN Imputer, Linear regression]
github: https://github.com/AbibatouWANDAOGO/walmart-sales-forecasting
notebook: https://github.com/AbibatouWANDAOGO/walmart-sales-forecasting/blob/main/walmart_sales_forecasting.ipynb
status: terminé
draft: false
---

## Context

A personal data science project, carried out end to end: from data cleaning and quality checks to prediction. It is built on data from the Kaggle competition *Walmart Recruiting – Store Sales Forecasting*. The dataset covers 3 years of **weekly sales for 45 Walmart stores** in the United States (6,438 store-weeks). It also includes context variables: temperature, fuel price, consumer price index (CPI), unemployment, advertising campaigns, holidays, plus the type, size and headcount of each store.

## Problem

Can we **forecast a store's weekly sales** from these factors, and **which variables actually drive** sales?

## Solution

1. **Merging the data**: a join (`pd.merge`) between the sales table and the stores table on the `Store` key. The result is checked against the reference file.
2. **Data quality**: 3 duplicated rows are detected and removed. Missing values are then added on purpose (55 NaNs spread across every column) to practise handling them:
   - qualitative variables (store, date, type, holiday): forward fill (`ffill`);
   - quantitative variables: **standardisation** (`StandardScaler`), then **5-nearest-neighbour imputation** (`KNNImputer`), then back to the original scale.
3. **Exploratory analysis**: correlation matrix, boxplots of sales by store type and by holiday period, and sales over time.
4. **Encoding**: the date is split into year, month, week and day, and `Store`, `Type` and `IsHoliday` are one-hot encoded. This gives 62 variables.
5. **Modelling**: linear regression with an 80 / 20 train / test split. It is evaluated with RSS, RSE and R² on both sets.
6. **Feature engineering**: sales soar at Thanksgiving and before Christmas, which `IsHoliday` captures poorly. So I created an `End_of_year_holidays` variable, equal to 1 for weeks 47 and 49 to 51.

## Challenges

- **Missing values everywhere, including in the date and in boolean variables.** Scikit-learn's KNN imputer only works with numbers. I therefore split the qualitative variables, filled with the previous value, from the quantitative ones, imputed with KNN. Standardising before KNN was also essential: otherwise `Size` (≈ 100,000) completely drowns out `Fuel_Price` (≈ 3) in the distance calculation.
- **Checking the imputation.** Comparing imputed and true values showed that store size is recovered exactly, because the neighbours are other weeks of the same store. Fuel price, on the other hand, is estimated with about 9% error.
- **pandas version compatibility.** Injecting missing values writes NaNs into a boolean column. This is deprecated in pandas 2 and forbidden in pandas 3, and `fillna(method='ffill')` has also been removed. I adapted the code (`.ffill()`) and pinned the pandas version to keep the results reproducible.
- **Should we standardise for the regression?** No: for an ordinary linear regression, rescaling a variable changes the coefficients but not the predictions or the R². I kept sales in dollars so the results stay interpretable.

## Results

| Model                                         | Train R²  | Test R²   |
| --------------------------------------------- | --------- | --------- |
| Quantitative variables only                   | 0.675     | 0.658     |
| + date + one-hot (store, type, holiday)       | 0.930     | 0.918     |
| + "end-of-year holidays" variable             | **0.954** | **0.941** |

> A simple linear regression, with good encoding and **one well-chosen variable**, explains **94% of the variance** in sales on unseen weeks. The standard error drops from $319,000 to $121,000 per week.

**Key takeaways:**

- **Store size** is the main driver of sales (correlation of 0.81). Unemployment, CPI and fuel price have very little influence.
- **Store identity** (one-hot encoding) brings the biggest gain: each store has its own sales level.
- **An end-of-year holiday week** brings in **+$460,000** of sales per store on average. It is the dominant seasonal effect. `IsHoliday` weeks, which mix the Super Bowl, Labor Day and Christmas, only lift sales by about 8%.

**Next steps**: time-based cross-validation (train on the past, test on the future), non-linear models (Random Forest, Gradient Boosting) and lag features (previous weeks' sales).
