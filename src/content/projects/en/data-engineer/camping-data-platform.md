---
title: A Databricks Data Platform for a Group of Campsites
domain: data-engineer
summary: Designed and built alone, a Databricks lakehouse (bronze, silver, gold) that connects the booking system, online travel agencies and connected meters to publish four data products every morning, with 23 data quality controls, GDPR protections and a French-speaking AI assistant evaluated before being trusted.
date: 2026-11-04
tools: [Databricks, Delta Lake, Unity Catalog, SQL, Hackolade, Genie, GDPR, C4, BPMN, OpenAPI]
github: https://github.com/AbibatouWANDAOGO/camping-data-platform
status: terminé
featured: true
---

## Context

Les Pins d'Argent is a family group of four campsites on the French Atlantic coast, with 950 pitches. **80 % of its revenue comes in nine summer weeks**, yet management reads its figures in spreadsheets at the end of the season: too late to act.

Three systems do not talk to each other: the booking system (PMS), one export file a day per online travel agency (Booking, Campings.com…), and water and power meters whose readings go nowhere.

This is the final-year engineering project of the Software Factory course at ESIEE Paris. It was planned for two students: **I did it alone**, from the requirements to a platform running on Databricks, including almost all of the advanced level. The data is fictitious.

## Problem

**How do you publish reliable figures for four business teams every morning at 6 a.m., from sources that do not talk to each other, without ever exposing customers' personal data?**

| Data product | The question it answers | For |
| --- | --- | --- |
| dp_occupation_yield | How many pitches were occupied last night, at what price, through which channel? | Sales management |
| dp_taxe_sejour | How much tourist tax do I owe the town for August? | Accounting |
| dp_conso_anomalies | Is there a water leak somewhere this morning? | Technical team |
| dp_profil_clientele | Who are our customers, among those who agreed to statistics? | Marketing |

- An agency booking also appears in the PMS under another identifier: without care, it would be counted twice.
- Some source data is wrong (a stay that leaves before it arrives): it must be set aside, not silently fixed.
- The customer profile is only allowed for customers who agreed, and the platform must be able to prove it.

## Project map

![The platform, layer by layer](/portfolio/images/camping/platform_map.png)
*From source files to four data products. Every night: files land in a volume, then bronze (raw copy), silver (typed and validated), gold (data products). Below, what surrounds the layers: protections, controls, GDPR purge, governance. Figures come from the sample dataset run on Databricks.*

The project ran in **four sprints**, each with a single goal:

| Sprint | Goal | What I delivered |
| --- | --- | --- |
| 1. Existing system and needs | Understand before designing | Map of actors, applications and eleven flows (three data silos); nine processes in three families; BPMN of "book and welcome a client", before and after; use cases; 9 functional and 14 non-functional requirements, each with how it is verified; 17 user stories |
| 2. Tools and data | Model, create, load | Polyglot model and derived Databricks model in Hackolade (19 tables, composite keys, CHECK constraints, every column described); notebooks to create and load the tables; rules for the 27 bronze, silver and gold tables; 4 data contracts (ODCS) |
| 3. Target architecture and AI | Describe, decide, evaluate | C4 diagrams at levels 1, 2 and 3; gaps with the existing system and a two-step roadmap; 2 architecture decision records; OpenAPI spec; Genie assistant configured and evaluated |
| 4. Ethics and security | Protect and prove it | Personal data classified in four levels; legal basis checked for the five purposes; impact assessment; AI impact assessment (EU AI Act risk level); purge notebook; 23 automatic controls |
| Beyond the brief | Decide | 17-week delivery plan, budget (94 days, €48,645 excl. VAT), go / no-go by increment, traceability matrix from requirement to code |

## Solution

1. **Bronze**: the eight files land in a Unity Catalog volume, one folder per source, then are copied as they are, all as text, with the file name and load time. Nothing is corrected.
2. **Silver**: data is typed and validated. An inconsistent stay goes to a rejects table with its reason. An agency booking is matched to its PMS stay (same pitch, same dates, same channel). Each stay is split into nights (`sequence()` then `explode()`), the night of departure never counting. Quarter-hour consumption is computed, including when a meter restarts from zero.
3. **The customer is split in two**: on one side a pseudonymised reference, the birth year and the country; on the other the identity, kept apart, with e-mail and phone masked and a `dcp` tag on every personal column. Fields nothing needs (family status, partner's name) never enter the platform.
4. **Gold**: four data products, aggregates only, each with a business owner and a contract (grain, fields, quality rules, freshness).
5. **Control**: 23 automatic controls (one row per grain, tax = nights × rate, revenue consistent within €0.10, profile limited to consenting customers, masks in place…). On the first failure the job stops and yesterday's figures stay published.
6. **GDPR purge**: identity is erased 36 months after the last activity, the ID number 6 months after departure, **in silver and in bronze**, with a log that identifies no one, then `VACUUM` on the Delta history.

![C4 level 2: the platform's containers](/portfolio/images/camping/c4_containers.png)
*The architecture at level 2 of the C4 model: each building block with its technology in brackets.*

![The "book and welcome a client" process, target version](/portfolio/images/camping/bpmn_to_be.png)
*The key process in its target version: matching agency bookings becomes automatic and consent is recorded with its date.*

## Results

Every value comes from the platform run on Databricks Free Edition, and was compared with a separate calculation on the source files.

| Check | Result |
| --- | --- |
| Stays loaded | 15 valid, 1 rejected with its reason, never silently fixed |
| Nights (the central table) | 62; a stay from 31 August to 1 September counts **one** night, in August |
| Agency bookings | 3 of 3 matched to the PMS: counted once |
| Occupancy, night of 31 August | 8 pitches out of 12, i.e. **66.7 %**, computed from sums (averaging the rates would give 69.4 %) |
| Share of direct sales | 35 nights out of 62, i.e. 56.5 %, weighted (averaging the shares would give 62.5 %) |
| August tourist tax | 92 adult nights × €0.60 = **€55.20**; children are exempt |
| Water leak | E07, 50 litres an hour from midnight to 6 a.m., on an **empty** pitch: the most urgent alert |
| Customer profile | 8 customers, only those whose **last dated choice** is a yes |

**An AI assistant tested before being trusted.** Genie answers in French by writing the SQL query itself. I limited it to the four gold tables, then evaluated it on thirteen questions, several of them traps:

| Evaluation | Result |
| --- | --- |
| Without instructions | 10 correct answers out of 13 |
| With instructions and an example query | 11 out of 13; the last two (an invented seasonal explanation, a share generalised to all customers) fixed by two targeted lines of instructions |
| Requests for a person's data | **3 refusals out of 3**: gold holds no identifying data |
| Automatic benchmarks | 4 out of 4 |
| Same table without column comments | same answers on three questions: column names already carried the meaning |

![Genie refuses personal data and reports the leak on an empty pitch](/portfolio/images/camping/genie_refus_et_fuite.png)
*Genie refuses to give customers' names and e-mails, and reports the night's leak on an empty pitch.*

**On ethics**: the impact assessment showed that with a small dataset, four of the six profile rows hold a single customer, enough to recognise a person. My conclusion: the profile can be published only with a minimum group size per row.

**On steering**: a 17-week plan in four increments, a budget of 94 days (€48,645 excl. VAT) and a proposed decision: commit first to occupancy and tax (about €21,200), measure the effect over a season, then decide on the rest.

## Difficulties

- **Calculation traps**: across several categories, occupancy is computed from sums, not by averaging the rates; the same goes for the share of direct sales. I computed every expected value separately, then checked it on the platform.
- **A duplicate with no shared identifier**: an agency booking has another identifier than in the PMS. I matched it on pitch, dates and channel, and a control checks that none is left unmatched.
- **Truly erasing**: I planned to purge silver; while trying to prove the erasure, I found that bronze also keeps the identity and that a `DELETE` is not enough on a Delta table. The purge therefore targets both layers, then the history.
- **An AI that is confidently wrong**: Genie invented a seasonal explanation and generalised a figure to customers who had refused statistics. Only targeted instructions fixed it: any answer used to decide is still cross-checked.
- **A project planned for two**: I held the roles of project manager, architect, data engineer and quality lead on my own.

## Limits and next steps

- The information-system map was drawn and documented, but not entered in MEGA HOPEX, the tool the course required.
- Bronze is loaded with SQL queries; the Lakeflow pipeline, the scheduled nightly job and the dashboard are designed but not built.
- Read rights per business team are written (`GRANT`) but not applied on Databricks Free Edition.
- Reloading bronze from the files brings purged rows back: in production, the PMS must stop sending them. The purge does not yet handle nationality or consent expiry.
- Next steps: automate the nightly job with its controls, add the minimum group size to the profile, publish the sales dashboard.

*Diagrams and screenshots are in French or English depending on the tool. The dataset, provided by the course, is not redistributed.*
