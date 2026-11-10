---
title: DeepResearch AI, a Research Agent That Cites and Checks Its Sources
domain: ai-engineer
summary: An autonomous agent that turns a question into a research plan, searches the web, reads pages and PDFs, fact-checks every important claim and writes a report where each sentence links to the exact passage of its source. Hybrid RAG, 5 agents orchestrated with LangGraph, a free local model, a 10-question evaluation, security hardening and Docker.
date: 2026-11-10
tools: [Python, LangGraph, RAG, Qdrant, BM25, Sentence-Transformers, Ollama, Pydantic, Streamlit, SQLite, Pytest, Docker]
github: https://github.com/AbibatouWANDAOGO/deepresearch-ai
status: terminé
featured: true
---

## Context

LLM research assistants answer quickly, but you rarely know **where each claim comes from**, or whether the source really says it. I wanted to build the opposite: an agent whose every report sentence can be traced back to the passage that supports it.

My constraint: **everything runs for free on a laptop**, with a local model (`qwen2.5:3b` through Ollama) and no GPU. A paid API remains possible, but only when explicitly enabled and with a spending cap. The whole project, evaluation included, cost **$0**.

## Problem

**How do you get a reliable, sourced report when the model writing it is small, slow and fallible?**

- A small model sometimes invents references, cites unrelated passages, or states a hypothesis as a fact.
- The web is **hostile**: a page can hide instructions (prompt injection) or make the downloader reach the machine's own internal addresses (SSRF).
- A research takes tens of minutes: it must be possible to follow it, stop it and resume it.

My principle: **the model proposes, the code decides.** Every model output is validated against a schema, and rules written in code keep a verdict from being stronger than the cited evidence.

## Project map

![Project map: the research pipeline and the phase that built each part](/portfolio/images/deepresearch/project_map.png)
*The pipeline, from question to cited report. Each badge is the phase that built the part. When a sub-question lacks evidence, the router starts a targeted search again (orange arrow).*

I built the project in **11 steps**. Each had a single goal, and was tested and documented before the next one started.

| # | Step | What I built | Decision or difficulty | Proof |
| --- | --- | --- | --- | --- |
| 1 | **Foundations** | validated settings, `.env.example`, starter dashboard | free and local by default, paid API opt-in only | 20 tests |
| 2 | **Web search** | Tavily with DuckDuckGo fallback | typed errors: an invalid key is never retried, a rate limit is; the free quota is checked before each call | 34 tests |
| 3 | **Collection** | pages and PDFs: download, extraction, cleaning, de-duplication | a redirect can lead to the machine itself, so every hop is checked again; 12 access statuses, never a crash | 42 tests |
| 4 | **Hybrid RAG** | chunks, E5 vectors in Qdrant, BM25, RRF fusion, reranker | the brief asked for 800-token chunks but the embedding model reads 512: 480, enforced by a guard | 21 tests |
| 5 | **5 agents** | Planner, Researcher, Analyst, Fact Checker, Writer | structured outputs validated by Pydantic; ids invented by the model are rejected | 60 tests |
| 6 | **Orchestration** | LangGraph graph: loops when evidence is missing, time limits, checkpoints | first full run (34 min) cut by a timeout, then resumed from its checkpoint | 14 tests |
| 7 | **Cited report** | sentences built by code, `[S#]` citations to the exact passage, Markdown and PDF | the model cited no source: 0 → **7 sources cited** | 8 tests |
| 8 | **Dashboard** | Streamlit: background research, progress, cancel and resume | the vector index accepts one process: one research at a time | 20 tests |
| 9 | **Evaluation** | 10 questions (FR/EN), 8 metrics, manual annotation | 3 Fact Checker fixes, validated without calling the model again | 13 tests |
| 10 | **Security** | SSRF, DNS rebinding, rate limit, logs without secrets | flaw found and closed: the address was checked, then resolved a 2nd time | 45 tests |
| 11 | **Docker** | Ollama and the app started with one command | a full research run inside the container | 3 tests |

In total: **283 tests**, which need no network, model or credit, and **5,600 lines** of application code.

## Solution

1. **Plan**: the Planner splits the question into 2 to 5 sub-questions, with search queries.
2. **Search and collect**: web search (Tavily or DuckDuckGo), then a safe download of pages and PDFs. Only public addresses are allowed, and robots.txt is respected.
3. **Index**: each document is split into chunks that keep their page and position. Two searches are combined: semantic (multilingual E5 vectors in Qdrant) and keyword (BM25). Their rankings are merged (RRF), then a reranking model reorders them. A French question also finds passages in English.
4. **Analyze, then check**: the Analyst extracts claims tied to their passages. The Fact Checker checks them against fresh passages, and code rules cap its verdict: no "verified" without a valid passage, no "verified" if a figure of the claim is missing from the cited passages.
5. **Loop if needed**: a poorly supported sub-question triggers another research cycle, a bounded number of times.
6. **Write**: the report is built by code from the checked claims. The model writes only the title and the summary, and any summary sentence that adds a figure not in the evidence is dropped.

![Report view of the dashboard](/portfolio/images/deepresearch/dashboard_report.png)
*A real report produced by the local model: verification counts, a status badge on every sentence and [S#] citations. Unverified claims are listed apart, never stated as facts.*

![Traceability of a claim](/portfolio/images/deepresearch/dashboard_claim_trace.png)
*Traceability: a claim, the Fact Checker's justification and the exact passages that support it, with their position (characters 6933 to 7133) in the source text.*

## Results

I evaluated the agent on **10 questions**, 5 in French and 5 in English: batteries, heat pumps, mRNA, sea level, CRISPR, nuclear power, Transformers, GDPR, the SVB collapse and inflation. Each question has 5 expected key points. Every metric is computed from what the research recorded, without running it again.

| Metric | Result |
| --- | --- |
| Researches completed | **10 / 10** |
| Supported claims really stated by their passages (manual annotation) | **87 %**, no invented claim |
| Origin passage of a claim retrieved again to check it (recall) | **96 %** |
| Cited passages that really state the claim, after the fixes | **65 % → 84 %** |
| Mean duration of a quick research on a laptop | **16.5 min** |
| Cost | **$0** |

![Coverage per question](/portfolio/images/deepresearch/eval_coverage.png)
*The research finds 64 % of the expected points on average, but only 32 % reach the report: only checked claims get in.*

![Where the extracted claims went](/portfolio/images/deepresearch/eval_claims.png)
*Why the gap: of 110 extracted claims, 23 could be checked within the "quick" budget, and **all** were supported. The limit is compute time, not the quality of the evidence.*

The evaluation also overturned an assumption. I expected a lenient Fact Checker, but the numbers showed the opposite: it is more often **too strict**, with 7 near-verbatim claims rated "partial". Above all, it validated 3 fixes, replayed on the stored verdicts without calling the model again:

![Fact Checker fixes](/portfolio/images/deepresearch/eval_fixes.png)
*Passages sharing few words with the claim are no longer cited, and a figure missing from the passages downgrades the claim to "partially verified". That rule caught a period, "2010 to 2020", that no passage mentioned.*

![Time per step](/portfolio/images/deepresearch/eval_time.png)
*The local model concentrates the compute time: analysis and fact-checking take over 60 % of a research.*

**On security**, several protections are tested:
- A web page cannot make the downloader reach the machine's internal addresses (SSRF), neither through a redirect nor through DNS rebinding. A test starts a real local server and a fake DNS: the server is never reached.
- API keys are masked in every log and in stored errors.
- Page text is treated as data, never as instructions, against prompt injection.

**On deployment**, `docker compose up` starts the model and the app. A full research in French ran inside the container: 9 pages downloaded, 16 model calls, 8 sources cited, 31 minutes, $0.

## Difficulties

- **A model that does not cite its sources**: in the first full run, the report cited no source and stated unverified claims as facts. I took the report body away from the model: code builds every sentence from the checked claims.
- **A hidden limit of the embedding model**: with 800-token chunks, the last third of every chunk would have been ignored without any error message. I spotted it, then blocked it with a guard.
- **A subtle security flaw**: a site's address was checked, then the HTTP client asked DNS again. A malicious DNS server could answer "public address" to the check and "127.0.0.1" to the connection. The connection now goes to the exact address that was checked.
- **A laptop that falls asleep**: the evaluation researches ran overnight, and sleep spoiled several measurements (one research took almost 2 hours). The process now prevents sleep, and the affected questions were rerun.
- **Measuring without rerunning**: a research costs 15 to 30 minutes. I designed metrics computed from what the research recorded, and validated the fixes by replaying them on the existing verdicts.

## Limits and next steps

- The "quick" budget checks only 2 claims per sub-question. A GPU or a hosted model would allow checking many more, and covering more points.
- 6 of 23 supported claims shift a date or a scope ("prospects" become current use). A code rule cannot see such shifts, a stronger model can.
- The Analyst sometimes extracts the same claim from several sources. Merging them before checking would save model calls.
- The evaluation covers 10 questions, and the annotations were made by the AI assistant that built the project. An independent human annotation would strengthen it.

*The example report is in French.*
