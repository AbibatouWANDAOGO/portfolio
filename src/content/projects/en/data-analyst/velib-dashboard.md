---
title: Real-time Vélib' Dashboard
domain: data-analyst
summary: An interactive web dashboard analysing the occupancy of Paris's 1,511 Vélib' bike-sharing stations to spot underused, balanced and saturated areas.
date: 2026-04-14
tools: [Python, Pandas, Dash, Plotly, SQLite, Requests, GBFS API]
# github: https://github.com/AbibatouWANDAOGO/velib-dashboard
status: terminé
featured: true
---

## Context

Vélib' Métropole is a key mobility service in Paris and its inner suburbs. Its data is public (Open Data) and continuously updated through the **GBFS** API (General Bikeshare Feed Specification).

Built for the advanced Python course, this project consisted of designing a complete dashboard from real open data: collection, cleaning, storage and visualisation.

## Problem

How can we tell, at any given moment, **where the network is unbalanced**?

- **Users** want to quickly find a station with bikes available.
- **Operators** need to know where to rebalance bikes between stations.
- **Decision-makers** want to identify under-served areas to plan the network's expansion.

## Solution

A multi-page web application built with **Dash**:

1. **Collection**: two GBFS feeds are fetched, static information (name, location, capacity) and real-time status (available bikes and docks).
2. **Cleaning**: the two sources are merged on `station_id`, then the occupancy rate `available bikes / capacity` and the share of e-bikes are computed.
3. **Categorisation**: each station is classified as **underused** (< 5%), **balanced** (5–95%) or **saturated** (> 95%).
4. **Storage**: data is saved as CSV and in a **SQLite** database. A "production" mode reads directly from the database, and a script refreshes it every 5 minutes.
5. **Visualisation**: the dashboard has three pages:
   - **Home**: global indicators.
   - **Map**: all 1,511 stations, coloured by category.
   - **Statistics**: histogram, breakdown by category and top 10 busiest stations.

The code is organised into modules: `utils` for data, `pages`, `components` and `callbacks`. It is documented with docstrings and type hints, and checked with `ruff`.

## Challenges

- **Dependence on the API**: if the API is slow or down, the dashboard must not crash. I added a 5-minute local cache and a SQLite database so the app works even offline.
- **Merging two sources**: static information and real-time status arrive separately. They had to be aligned cleanly on the station ID.
- **Choosing thresholds**: simple, readable thresholds were needed to label a station as "underused" or "saturated".
- **Multi-page architecture**: Dash routing and callbacks had to be structured so that adding a page stays simple.

## Results

| Category   | Stations | Share  | Average occupancy |
| ---------- | -------- | ------ | ----------------- |
| Underused  | ~50      | 3.3%   | 2.5%              |
| Balanced   | ~1,450   | 96%    | 50%               |
| Saturated  | ~10      | 0.7%   | 98%               |

> The network is well balanced overall (96% of stations at normal occupancy). A few stations saturate at peak hours, near train stations and shopping centres, and some outer districts remain under-served.

**Next steps**: demand forecasting with machine learning, storing historical data to analyse trends over time, and real-time alerts.
