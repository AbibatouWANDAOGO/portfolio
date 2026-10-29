---
title: Real-time Vélib' Dashboard
domain: data-analyst
summary: A Dash web app that tracks Paris's 1,500 Vélib' bike-sharing stations in real time, with an interactive map, analyses and a maintenance dashboard. Built as a pair.
date: 2026-06-13
tools: [Python, Dash, Plotly, Pandas, SQLite, GBFS API, Pytest]
github: https://github.com/AbibatouWANDAOGO/velib-dashboard
status: terminé
featured: true
---

## Context

Vélib' Métropole is a key mobility service in Paris and its inner suburbs: about **1,500 stations** and nearly **20,000 bikes** available at any given time. Its data is public and continuously updated through the **GBFS** API (General Bikeshare Feed Specification).

I built this project **with Youcef Guediri** for the advanced Python course. The goal was to design a complete dashboard from real open data: collection, cleaning, storage, visualisation and testing.

![Dashboard home page: key indicators and bike breakdown](/portfolio/images/velib/01_accueil.jpg)

## Problem

How can we tell, at any given moment, **where the network is unbalanced** and **where to step in**?

- **Riders** want to quickly find a station with bikes, or a free dock to return theirs.
- **Operations teams** need to spot empty or full stations to rebalance the network.
- **Managers** want an overview: availability rate, share of e-bikes, areas under pressure.

## Solution

A **5-page** web application built with **Dash** and **Plotly**:

1. **Collection**: two GBFS feeds, static information (name, location, capacity) and real-time status (mechanical bikes, e-bikes, free docks).
2. **Cleaning and merging**: both sources are aligned on `station_id`, bike types are extracted, then indicators are computed (availability and occupancy rates, share of e-bikes, whether the station is operational).
3. **Storage**: data is saved as CSV and in a **SQLite** database. If the API does not respond, the dashboard automatically falls back to the latest saved data.
4. **Visualisation**:
   - **Home**: key indicators and mechanical / e-bike breakdown.
   - **Map**: all 1,500 stations coloured by status, with filters, key figures and station search.
   - **Analysis**: filters by number and type of bikes, capacity vs availability, distribution of occupancy rates.
   - **Maintenance**: stations to handle first, on a map and in a filterable table.
   - **About**: sources and methodology.
5. **Quality**: the code is organised into modules (`utils`, `pages`, `components`), documented with docstrings and type hints, tested with **pytest** and checked with `mypy` and `ruff`.

![Station map: real-time status of every station](/portfolio/images/velib/03_carte.jpg)
*Each station is coloured by status: empty (no bikes), full (no dock to return a bike), almost empty (5 bikes or fewer) or available. Dot size reflects the station's capacity.*

![Station search: the map zooms in on Châtelet](/portfolio/images/velib/04_carte_recherche.jpg)
*The search ignores accents and case: typing "Châtelet" finds the "Victoria - Place du Chatelet" station. The map zooms in and highlights it.*

![Analysis page: capacity, availability and occupancy rates](/portfolio/images/velib/02_analyse.jpg)

![Maintenance page: critical and urgent stations to handle](/portfolio/images/velib/05_insights.jpg)
*A station is **critical** when it is empty or full, and **urgent** when it is more than 90% unbalanced or has no e-bikes. The table can be filtered by severity, area and type of problem.*

## Challenges

- **Depending on the API**: if the Vélib' API is slow or down, the dashboard must not crash. It falls back to the latest saved data, from CSV or the SQLite database.
- **Different data formats**: in the API's JSON, mechanical bikes and e-bikes are nested in a list, whereas the CSV export lists them flat. They had to be extracted so that the same pipeline handles both sources.
- **A map that went blank after an update**: Plotly removed `scatter_mapbox` in version 6, so any fresh install showed an empty Map page. I migrated both maps to `scatter_map` (MapLibre) and pinned the minimum Plotly version so the problem does not come back.
- **An accent-sensitive search**: Dash 4's dropdown compares text as typed, so "Châtelet" did not find "Chatelet". I replaced it with a server-side search field that ignores accents and case.

## Results

Real-time snapshot from **29 October 2026 at 10:28 pm**:

| Indicator | Value |
| --- | --- |
| Operational stations | **1,500** out of 1,520 |
| Available bikes | **≈ 19,000**, of which **39%** are e-bikes |
| Free docks to return a bike | **≈ 28,000** |
| Available / almost empty / empty / full stations | **71%** / 24% / 2.9% / 1.7% |
| Stations needing maintenance | **68 critical** and 297 urgent (76% of the network in good shape) |

> The network is well served overall: 7 stations out of 10 have more than 5 bikes. But nearly one station in four is almost empty, and 68 stations, empty or full, were blocking riders at the time of the snapshot. These are the priorities for the rebalancing teams.

**Improvements made after the submission**: real-time data loading with a "Refresh" button, both maps fixed, colouring by status, key figures that follow the filters, and station search.

**Next steps**: store snapshots over time to analyse patterns by hour and day, forecast demand per station, and deploy the app online (Render or Railway).

*Screenshots are in French.*
