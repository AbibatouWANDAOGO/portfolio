---
title: Real-Time Vélib' Dashboard
domain: data-analyst
summary: A Dash web application that monitors Paris's 1,500 Vélib' bike-sharing stations in real time, featuring an interactive map, analytics and a maintenance dashboard. Team project.
date: 2026-06-13
tools: [Python, Dash, Plotly, Pandas, SQLite, GBFS API, Pytest]
github: https://github.com/AbibatouWANDAOGO/velib-dashboard
status: terminé
featured: true
---

## Context

Vélib' Métropole is a cornerstone of urban mobility in Paris and its inner suburbs, with roughly **1,500 stations** and close to **20,000 bikes** available at any given time. Its data is publicly available and continuously updated through the **GBFS** API (General Bikeshare Feed Specification).

I developed this project **with Youcef Guediri** as part of an advanced Python course. The goal was to deliver a production-style dashboard built on real open data, covering the full workflow: data ingestion, cleaning, storage, visualization and testing.

![Dashboard home page: key metrics and bike fleet breakdown](/portfolio/images/velib/01_accueil.jpg)

## Problem

How can we identify, at any given moment, **where the network is out of balance** and **where action is needed**?

- **Riders** need to quickly find a station with available bikes, or an open dock to return one.
- **Operations teams** need to spot empty or full stations to rebalance the network.
- **Managers** need a high-level view: availability rate, share of e-bikes and areas under pressure.

## Approach

A **five-page** web application built with **Dash** and **Plotly**:

1. **Data ingestion**: two GBFS feeds, one for static station information (name, location, capacity) and one for real-time status (mechanical bikes, e-bikes, open docks).
2. **Cleaning and integration**: both sources are joined on `station_id`, bike types are extracted, and key metrics are derived (availability and occupancy rates, share of e-bikes, operational status).
3. **Storage**: data is persisted to CSV and to a **SQLite** database. If the API is unavailable, the dashboard automatically falls back to the most recent snapshot.
4. **Visualization**:
   - **Home**: headline KPIs and mechanical vs. electric bike breakdown.
   - **Map**: all 1,500 stations color-coded by status, with filters, summary metrics and station search.
   - **Analytics**: filters by bike count and bike type, capacity vs. availability, and occupancy rate distribution.
   - **Maintenance**: priority stations displayed on a map and in a filterable table.
   - **About**: data sources and methodology.
5. **Code quality**: a modular codebase (`utils`, `pages`, `components`), documented with docstrings and type hints, tested with **pytest** and checked with `mypy` and `ruff`.

![Station map: real-time status of every station](/portfolio/images/velib/03_carte.jpg)
*Each station is color-coded by status: empty (no bikes), full (no open docks), nearly empty (5 bikes or fewer) or available. Marker size reflects station capacity.*

![Station search: the map zooms in on Châtelet](/portfolio/images/velib/04_carte_recherche.jpg)
*Search is accent- and case-insensitive: typing "Châtelet" returns the "Victoria - Place du Chatelet" station, and the map zooms in to highlight it.*

![Analytics page: capacity, availability and occupancy rates](/portfolio/images/velib/02_analyse.jpg)

![Maintenance page: critical and urgent stations to address](/portfolio/images/velib/05_insights.jpg)
*A station is flagged as **critical** when it is empty or full, and as **urgent** when it is more than 90% imbalanced or has no e-bikes. The table can be filtered by severity, area and issue type.*

## Challenges

- **Dependency on an external API**: the dashboard must remain available even if the Vélib' API is slow or down. It therefore falls back to the latest stored data, from CSV or SQLite.
- **Inconsistent data formats**: the API's JSON nests mechanical and e-bike counts inside a list, whereas the CSV export stores them as flat columns. Both had to be normalized so that a single pipeline could process either source.
- **A map broken by a library upgrade**: Plotly removed `scatter_mapbox` in version 6, so any fresh install rendered a blank Map page. I migrated both maps to `scatter_map` (MapLibre) and set a minimum Plotly version to prevent regressions.
- **Accent-sensitive search**: Dash 4's dropdown matches text literally, so "Châtelet" did not match "Chatelet". I replaced it with a server-side search field that ignores accents and case.

## Results

Real-time snapshot taken on **October 29, 2026, at 10:28 p.m.**:

| Metric | Value |
| --- | --- |
| Operational stations | **1,500** of 1,520 |
| Available bikes | **≈ 19,000**, of which **39%** are e-bikes |
| Open docks | **≈ 28,000** |
| Available / nearly empty / empty / full stations | **71%** / 24% / 2.9% / 1.7% |
| Stations requiring maintenance | **68 critical** and 297 urgent (76% of the network in good condition) |

> Overall, the network is well supplied: 7 out of 10 stations have more than 5 bikes. However, nearly one station in four is close to empty, and 68 stations, either empty or full, were blocking riders at the time of the snapshot. These are the top priorities for rebalancing teams.

**Post-delivery improvements**: real-time data loading with a "Refresh" button, both maps repaired, status-based color coding, summary metrics that update with the filters, and station search.

**Next steps**: store historical snapshots to analyze hourly and weekly patterns, forecast station-level demand, and deploy the application online (Render or Railway).

*Screenshots show the French-language interface.*
