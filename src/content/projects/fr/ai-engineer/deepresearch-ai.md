---
title: DeepResearch AI, un agent de recherche qui cite et vérifie ses sources
domain: ai-engineer
summary: Un agent autonome qui, à partir d'une question, planifie une recherche, interroge le web, lit pages et PDF, vérifie chaque affirmation importante et rédige un rapport où chaque phrase renvoie au passage exact de sa source. RAG hybride, 5 agents orchestrés avec LangGraph, modèle local gratuit, évaluation sur 10 questions, protections de sécurité et Docker.
date: 2026-11-10
tools: [Python, LangGraph, RAG, Qdrant, BM25, Sentence-Transformers, Ollama, Pydantic, Streamlit, SQLite, Pytest, Docker]
github: https://github.com/AbibatouWANDAOGO/deepresearch-ai
status: terminé
featured: true
---

## Contexte

Les assistants de recherche à base de modèles de langage répondent vite, mais on ne sait pas toujours **d'où vient chaque affirmation**, ni si la source la dit vraiment. J'ai voulu construire l'inverse : un agent dont chaque phrase du rapport peut être retracée jusqu'au passage qui la justifie.

Contrainte que je me suis fixée : **tout doit fonctionner gratuitement, sur un ordinateur portable**, avec un modèle local (`qwen2.5:3b` via Ollama), sans carte graphique. Une API payante reste possible, mais seulement sur activation explicite et avec un plafond de dépense. Le projet entier, évaluation comprise, a coûté **0 $**.

## Problème

**Comment obtenir un rapport fiable et sourcé quand le modèle qui l'écrit est petit, lent et faillible ?**

- Un petit modèle invente parfois des références, cite des passages sans rapport ou présente une hypothèse comme un fait.
- Le web est une source **hostile** : une page peut contenir des instructions cachées (injection de prompt) ou faire télécharger une adresse interne de la machine (SSRF).
- Une recherche dure plusieurs dizaines de minutes : elle doit pouvoir être suivie, interrompue et reprise.

Mon principe : **le modèle propose, le code décide.** Chaque sortie du modèle est validée par un schéma, et des règles écrites en code empêchent un verdict d'être plus fort que les preuves citées.

## Cartographie du projet

![Carte du projet : le pipeline de recherche et la phase qui a construit chaque partie](/portfolio/images/deepresearch/project_map.png)
*Le pipeline, de la question au rapport cité. Chaque badge indique la phase qui a construit la brique. Si une sous-question manque de preuves, le routeur relance une recherche ciblée (flèche orange).*

J'ai construit le projet en **11 étapes**. Chacune avait un objectif unique, et elle était testée et documentée avant de passer à la suivante.

| # | Étape | Ce que j'ai construit | Décision ou difficulté | Preuve |
| --- | --- | --- | --- | --- |
| 1 | **Fondations** | configuration validée, `.env.example`, tableau de bord de départ | gratuit et local par défaut, API payante sur activation explicite seulement | 20 tests |
| 2 | **Recherche web** | Tavily, avec DuckDuckGo en secours | erreurs typées : une clé invalide n'est jamais relancée, une limite de débit l'est ; le quota gratuit est surveillé avant chaque appel | 34 tests |
| 3 | **Collecte** | pages et PDF : téléchargement, extraction, nettoyage, dédoublonnage | une redirection peut mener vers la machine elle-même, donc chaque saut est revérifié ; 12 statuts d'accès, jamais de plantage | 42 tests |
| 4 | **RAG hybride** | découpage en passages, vecteurs E5 dans Qdrant, BM25, fusion RRF, reranker | le cahier des charges demandait des passages de 800 tokens, mais le modèle d'embedding n'en lit que 512 : passage à 480, avec un garde-fou | 21 tests |
| 5 | **5 agents** | Planner, Researcher, Analyst, Fact Checker, Writer | sorties structurées validées par Pydantic ; les identifiants inventés par le modèle sont rejetés | 60 tests |
| 6 | **Orchestration** | graphe LangGraph : boucle si les preuves manquent, limites de temps, points de reprise | 1er essai complet (34 min) : coupé par un délai dépassé, puis repris depuis son point de reprise | 14 tests |
| 7 | **Rapport cité** | phrases construites par le code, citations `[S#]` vers le passage exact, export Markdown et PDF | le modèle ne citait aucune source : 0 → **7 sources citées** | 8 tests |
| 8 | **Tableau de bord** | Streamlit : recherche en arrière-plan, progression, annulation et reprise | l'index vectoriel n'accepte qu'un processus : une recherche à la fois | 20 tests |
| 9 | **Évaluation** | 10 questions (FR/EN), 8 mesures, annotation manuelle | 3 corrections du Fact Checker, validées sans rappeler le modèle | 13 tests |
| 10 | **Sécurité** | SSRF, DNS rebinding, limite de débit, journaux sans secrets | faille trouvée et fermée : l'adresse était vérifiée, puis résolue une 2e fois | 45 tests |
| 11 | **Docker** | Ollama et l'application lancés en une commande | une recherche complète exécutée dans le conteneur | 3 tests |

Au total : **283 tests**, qui n'ont besoin ni de réseau, ni de modèle, ni de crédit, et **5 600 lignes** de code applicatif.

## Solution

1. **Planifier** : le Planner découpe la question en 2 à 5 sous-questions, avec des requêtes de recherche.
2. **Chercher et collecter** : recherche web (Tavily ou DuckDuckGo), puis téléchargement sécurisé des pages et PDF. Seules les adresses publiques sont autorisées, et le robots.txt est respecté.
3. **Indexer** : chaque document est découpé en passages qui gardent leur page et leur position. Deux recherches sont combinées : sémantique (vecteurs E5 multilingues dans Qdrant) et par mots-clés (BM25). Leurs classements sont fusionnés (RRF), puis un modèle de reranking les réordonne. Une question en français trouve aussi des passages en anglais.
4. **Analyser puis vérifier** : l'Analyst extrait des affirmations liées à leurs passages. Le Fact Checker les vérifie contre de nouveaux passages, et des règles de code plafonnent son verdict : pas de « vérifié » sans passage valide, pas de « vérifié » si un chiffre de l'affirmation est absent des passages cités.
5. **Boucler si besoin** : une sous-question mal soutenue déclenche un nouveau cycle de recherche, en nombre limité.
6. **Écrire** : le rapport est construit par le code à partir des affirmations vérifiées. Le modèle n'écrit que le titre et le résumé, et toute phrase du résumé qui ajoute un chiffre absent des preuves est supprimée.

![Vue rapport du tableau de bord](/portfolio/images/deepresearch/dashboard_report.png)
*Un vrai rapport produit par le modèle local : compteurs de vérification, badge de statut sur chaque phrase et citations [S#]. Les affirmations non vérifiées sont listées à part, jamais présentées comme des faits.*

![Traçabilité d'une affirmation](/portfolio/images/deepresearch/dashboard_claim_trace.png)
*La traçabilité : une affirmation, la justification du Fact Checker et les passages exacts qui la soutiennent, avec leur position (caractères 6933 à 7133) dans le texte de la source.*

## Résultats

J'ai évalué l'agent sur **10 questions**, 5 en français et 5 en anglais : batteries, pompes à chaleur, ARN messager, niveau de la mer, CRISPR, nucléaire, Transformers, RGPD, faillite de SVB et inflation. Chaque question a 5 points clés attendus. Toutes les mesures sont calculées à partir de ce que la recherche a enregistré, sans la relancer.

| Mesure | Résultat |
| --- | --- |
| Recherches terminées | **10 / 10** |
| Affirmations soutenues réellement dites par leurs passages (annotation manuelle) | **87 %**, aucune affirmation inventée |
| Passage d'origine d'une affirmation retrouvé pour la vérifier (rappel) | **96 %** |
| Passages cités qui disent vraiment l'affirmation, après corrections | **65 % → 84 %** |
| Durée moyenne d'une recherche rapide sur ordinateur portable | **16,5 min** |
| Coût | **0 $** |

![Couverture par question](/portfolio/images/deepresearch/eval_coverage.png)
*La recherche trouve en moyenne 64 % des points attendus, mais seuls 32 % arrivent dans le rapport : seules les affirmations vérifiées y entrent.*

![Devenir des affirmations extraites](/portfolio/images/deepresearch/eval_claims.png)
*Pourquoi cet écart : sur 110 affirmations extraites, 23 ont pu être vérifiées dans le budget « rapide », et **toutes** ont été soutenues. La limite vient du temps de calcul, pas de la qualité des preuves.*

L'évaluation a aussi corrigé une idée reçue. Je pensais le Fact Checker trop laxiste, mais les chiffres ont montré l'inverse : il est plus souvent **trop sévère**, avec 7 affirmations recopiées presque mot pour mot et notées « partielles ». Elle a surtout permis de valider 3 corrections, rejouées sur les verdicts enregistrés sans rappeler le modèle :

![Corrections du Fact Checker](/portfolio/images/deepresearch/eval_fixes.png)
*Les passages qui partagent peu de mots avec l'affirmation ne sont plus cités, et un chiffre absent des passages rétrograde l'affirmation en « partiellement vérifiée ». Cette règle a rattrapé une période « 2010 à 2020 » qu'aucun passage ne mentionnait.*

![Temps par étape](/portfolio/images/deepresearch/eval_time.png)
*Le modèle local concentre le temps de calcul : l'analyse et la vérification représentent plus de 60 % d'une recherche.*

**Côté sécurité**, plusieurs protections sont testées :
- Une page web ne peut pas faire télécharger une adresse interne de la machine (SSRF), ni par redirection, ni par DNS rebinding. Un test démarre un vrai serveur local et un faux DNS : le serveur n'est jamais atteint.
- Les clés API sont masquées dans tous les journaux et dans les erreurs enregistrées.
- Le texte des pages est traité comme une donnée, jamais comme une instruction, pour contrer l'injection de prompt.

**Côté déploiement**, `docker compose up` lance le modèle et l'application. Une recherche complète en français a tourné dans le conteneur : 9 pages téléchargées, 16 appels au modèle, 8 sources citées, 31 minutes, 0 $.

## Difficultés rencontrées

- **Un modèle qui ne cite pas ses sources** : au premier essai complet, le rapport ne citait aucune source et présentait des affirmations non vérifiées comme des faits. J'ai retiré l'écriture du corps du rapport au modèle : le code construit chaque phrase à partir des affirmations vérifiées.
- **Une limite cachée du modèle d'embedding** : avec des passages de 800 tokens, le dernier tiers de chaque passage aurait été ignoré sans aucun message d'erreur. Je l'ai repéré, puis bloqué par un garde-fou.
- **Une faille de sécurité subtile** : l'adresse d'un site était vérifiée, puis le client HTTP la redemandait au DNS. Un serveur DNS malveillant pouvait alors répondre « adresse publique » à la vérification et « 127.0.0.1 » à la connexion. La connexion se fait maintenant vers l'adresse exacte qui a été vérifiée.
- **Un ordinateur qui s'endort** : les recherches d'évaluation tournaient la nuit, et la mise en veille a faussé plusieurs mesures (une recherche a duré près de 2 heures). Le processus empêche maintenant la veille, et j'ai relancé les questions touchées.
- **Mesurer sans tout relancer** : une recherche coûte 15 à 30 minutes. J'ai donc conçu des mesures calculées à partir de ce que la recherche a enregistré, et validé les corrections en les rejouant sur les verdicts existants.

## Limites et pistes

- Le budget « rapide » ne vérifie que 2 affirmations par sous-question. Un GPU ou un modèle hébergé permettrait d'en vérifier beaucoup plus, et donc de couvrir davantage de points.
- 6 affirmations soutenues sur 23 décalent une date ou une portée (« des perspectives » deviennent un usage actuel). Une règle de code ne voit pas ce genre de glissement, un modèle plus puissant oui.
- L'Analyst extrait parfois la même affirmation de plusieurs sources. Les fusionner avant la vérification économiserait des appels au modèle.
- L'évaluation porte sur 10 questions, et les annotations ont été faites par l'assistant IA qui a construit le projet. Une annotation humaine indépendante la renforcerait.

*Les graphiques et l'interface sont en anglais. Le rapport d'exemple est en français.*
