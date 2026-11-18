---
title: Une plateforme de données Databricks pour un groupe de campings
domain: data-engineer
summary: Conception et réalisation, seule, d'un lakehouse Databricks (bronze, silver, gold) qui relie le logiciel de réservation, les agences en ligne et les compteurs connectés pour publier chaque matin quatre data products, avec 23 contrôles de qualité, la protection des données personnelles (RGPD) et un assistant IA en français évalué avant d'être utilisé.
date: 2026-11-04
tools: [Databricks, Delta Lake, Unity Catalog, SQL, Hackolade, Genie, RGPD, C4, BPMN, OpenAPI]
github: https://github.com/AbibatouWANDAOGO/camping-data-platform
status: terminé
featured: true
---

## Contexte

Les Pins d'Argent est un groupe familial de quatre campings sur la côte atlantique, avec 950 emplacements. **80 % de son chiffre d'affaires se fait en neuf semaines d'été**, mais la direction découvre ses chiffres sur tableur, en fin de saison : trop tard pour agir.

Trois systèmes ne se parlent pas : le logiciel de réservation (PMS), un fichier d'export par jour pour chaque agence en ligne (Booking, Campings.com…) et des compteurs d'eau et d'électricité dont les relevés ne vont nulle part.

C'est le projet fil rouge de dernière année du cycle ingénieur à l'ESIEE Paris (cours Software Factory). Il était prévu pour un binôme : **je l'ai réalisé seule**, du besoin jusqu'à la plateforme qui tourne sur Databricks, avec presque tout le niveau avancé. Les données sont fictives.

## Problème

**Comment publier chaque matin, à 6 h, des chiffres fiables pour quatre métiers, à partir de sources qui ne se parlent pas, sans jamais exposer les données personnelles des clients ?**

| Data product | La question à laquelle il répond | Pour qui |
| --- | --- | --- |
| dp_occupation_yield | Combien d'emplacements étaient occupés hier soir, à quel prix, par quel canal ? | Direction commerciale |
| dp_taxe_sejour | Combien dois-je reverser à la commune pour août ? | Comptabilité |
| dp_conso_anomalies | Y a-t-il une fuite d'eau quelque part ce matin ? | Services techniques |
| dp_profil_clientele | Qui sont nos clients, parmi ceux qui ont accepté les statistiques ? | Marketing |

- Une réservation d'agence apparaît aussi dans le PMS, avec un autre identifiant : sans précaution, elle serait comptée deux fois.
- Certaines données sont fausses à la source (un séjour qui part avant d'arriver) : il faut les écarter sans les corriger en silence.
- Le profil de clientèle n'est permis que pour les clients qui ont donné leur accord, et la plateforme doit savoir le prouver.

## Cartographie du projet

![La plateforme, couche par couche](/portfolio/images/camping/platform_map.png)
*Des fichiers sources aux quatre data products. Chaque nuit : dépôt des fichiers, bronze (copie brute), silver (données typées et validées), gold (data products). En bas, ce qui entoure les couches : protections, contrôles, purge RGPD, gouvernance. Les chiffres sont ceux du jeu d'exemple, exécuté sur Databricks.*

Le projet s'est déroulé en **quatre sprints**, chacun avec un objectif unique :

| Sprint | Objectif | Ce que j'ai livré |
| --- | --- | --- |
| 1. Existant et besoin | Comprendre avant de concevoir | Carte des acteurs, applications et onze flux (trois silos) ; neuf processus en trois familles ; BPMN du processus « réserver et accueillir un client », avant et après ; cas d'utilisation ; 9 exigences fonctionnelles et 14 non fonctionnelles, chacune avec sa vérification ; 17 user stories |
| 2. Outils et données | Modéliser, créer, charger | Modèle polyglot et modèle Databricks dérivé dans Hackolade (19 tables, clés composées, contraintes CHECK, chaque colonne décrite) ; notebooks de création et de chargement ; règles des 27 tables bronze, silver et gold ; 4 contrats de données (ODCS) |
| 3. Architecture cible et IA | Décrire, décider, évaluer | Schémas C4 aux niveaux 1, 2 et 3 ; écarts avec l'existant et feuille de route en deux étapes ; 2 décisions d'architecture ; API OpenAPI ; assistant Genie configuré et évalué |
| 4. Éthique et sécurité | Protéger et le prouver | Données personnelles classées en quatre niveaux ; base légale vérifiée pour les cinq finalités ; analyse d'impact ; fiche d'impact de l'IA (niveau de risque selon l'AI Act) ; notebook de purge ; 23 contrôles automatiques |
| Au-delà du sujet | Décider | Plan de réalisation de 17 semaines, budget (94 jours, 48 645 € HT), décision go / no go par incrément, matrice de traçabilité de l'exigence jusqu'au code |

## Solution

1. **Bronze** : les huit fichiers sont déposés dans un volume Unity Catalog, un dossier par source, puis copiés tels quels, tout en texte, avec le nom du fichier et l'heure de chargement. Rien n'est corrigé.
2. **Silver** : les données sont typées et validées. Un séjour incohérent part dans une table de rejets avec son motif. Une réservation d'agence est rapprochée de son séjour PMS (même emplacement, mêmes dates, même canal). Chaque séjour est découpé en nuits (`sequence()` puis `explode()`), la nuit du départ n'étant jamais comptée. La consommation de chaque quart d'heure est calculée, y compris quand un compteur repart à zéro.
3. **Le client est coupé en deux** : d'un côté une référence pseudonymisée, l'année de naissance et le pays ; de l'autre l'identité, à part, avec l'e-mail et le téléphone masqués et une étiquette `dcp` sur chaque colonne personnelle. Les champs qui ne servent à rien (situation familiale, nom du conjoint) n'entrent pas dans la plateforme.
4. **Gold** : quatre data products, uniquement des agrégats, chacun avec un responsable métier et un contrat (grain, champs, règles de qualité, fraîcheur).
5. **Contrôle** : 23 contrôles automatiques (une ligne par grain, taxe = nuitées × tarif, chiffre d'affaires cohérent à 0,10 € près, profil limité aux consentants, masques posés…). Au premier échec, le traitement s'arrête et les chiffres de la veille restent affichés.
6. **Purge RGPD** : l'identité est effacée 36 mois après la dernière activité, le numéro de pièce d'identité 6 mois après le départ, **en silver et en bronze**, avec un journal sans donnée identifiante, puis `VACUUM` sur l'historique Delta.

![C4 niveau 2 : les conteneurs de la plateforme](/portfolio/images/camping/c4_containers.png)
*L'architecture au niveau 2 du modèle C4 : chaque brique avec sa technologie entre crochets.*

![Processus « réserver et accueillir un client », version cible](/portfolio/images/camping/bpmn_to_be.png)
*Le processus clé dans sa version cible : le rapprochement des réservations d'agence devient automatique et le consentement est enregistré avec sa date.*

## Résultats

Chaque valeur vient de la plateforme exécutée sur Databricks Free Edition, et a été comparée à un calcul fait à part sur les fichiers sources.

| Contrôle | Résultat |
| --- | --- |
| Séjours chargés | 15 valides, 1 rejeté avec son motif, jamais corrigé en silence |
| Nuitées (la table centrale) | 62 ; un séjour du 31 août au 1er septembre compte **une** nuit, en août |
| Réservations d'agence | 3 sur 3 rapprochées du PMS : comptées une seule fois |
| Taux d'occupation du 31 août | 8 emplacements sur 12, soit **66,7 %**, calculé par somme (la moyenne des taux donnerait 69,4 %) |
| Part des ventes en direct | 35 nuitées sur 62, soit 56,5 %, pondérée (la moyenne des parts donnerait 62,5 %) |
| Taxe de séjour d'août | 92 nuitées d'adultes × 0,60 € = **55,20 €** ; les mineurs sont exonérés |
| Fuite d'eau | E07, 50 litres par heure de minuit à 6 h, sur un emplacement **vide** : l'alerte la plus urgente |
| Profil de clientèle | 8 clients, seulement ceux dont le **dernier choix daté** est un accord |

**L'assistant IA, testé avant d'être cru.** Genie répond en français en écrivant lui-même la requête SQL. Je l'ai limité aux quatre tables gold, puis évalué sur treize questions, dont plusieurs pièges :

| Évaluation | Résultat |
| --- | --- |
| Sans instructions | 10 réponses justes sur 13 |
| Avec instructions et un exemple de requête | 11 sur 13 ; les deux dernières (une explication saisonnière inventée, une part généralisée à toute la clientèle) corrigées par deux lignes d'instructions ciblées |
| Demandes de données sur une personne | **3 refus sur 3** : le gold ne contient aucune donnée identifiante |
| Benchmarks automatiques | 4 sur 4 |
| Même table sans commentaires de colonnes | mêmes réponses sur trois questions : les noms de colonnes portaient déjà le sens |

![Genie répond au taux d'occupation du 31 août](/portfolio/images/camping/genie_taux_occupation.png)
*Une question posée en français : Genie additionne les catégories et répond 66,67 %, soit 8 emplacements occupés sur 12.*

![Genie trace la répartition des séjours par type de groupe](/portfolio/images/camping/genie_graphique_groupes.png)
*Genie peut aussi tracer un graphique : 62,5 % des séjours sont des familles. Ce chiffre ne couvre que les clients qui ont accepté les statistiques, ce que Genie n'a précisé qu'une fois ses instructions renforcées.*

![Évaluation automatique des benchmarks : 100 %](/portfolio/images/camping/genie_benchmarks.png)
*L'évaluation automatique contre des requêtes SQL de référence : 4 benchmarks réussis sur 4.*

![Genie refuse les données personnelles et signale la fuite sur emplacement vide](/portfolio/images/camping/genie_refus_et_fuite.png)
*Genie refuse de donner les noms et e-mails des clients, et signale la fuite de la nuit sur un emplacement vide.*

**Côté éthique** : l'analyse d'impact a montré qu'avec un petit jeu de données, quatre lignes sur six du profil ne comptent qu'un seul client, ce qui permet de reconnaître une personne. Ma conclusion : le profil n'est publiable qu'avec un effectif minimal par ligne.

**Côté pilotage** : un plan de 17 semaines en quatre incréments, un budget de 94 jours (48 645 € HT) et une décision proposée : engager d'abord l'occupation et la taxe (environ 21 200 €), mesurer l'effet sur une saison, puis décider de la suite.

## Difficultés rencontrées

- **Des pièges de calcul** : sur plusieurs catégories, le taux d'occupation se calcule par somme, pas par moyenne des taux. Même chose pour la part du direct. J'ai calculé chaque valeur attendue à part, puis vérifié qu'on la retrouvait sur la plateforme.
- **Un doublon sans identifiant commun** : une réservation d'agence a un autre identifiant que dans le PMS. Je l'ai rapprochée par emplacement, dates et canal, et un contrôle vérifie qu'aucune ne reste orpheline.
- **Effacer vraiment** : je pensais purger le silver ; en cherchant à prouver l'effacement, j'ai vu que le bronze garde aussi l'identité, et qu'un `DELETE` ne suffit pas sur une table Delta. La purge vise donc les deux couches, puis l'historique.
- **Une IA qui se trompe avec assurance** : Genie a inventé une explication saisonnière et généralisé un chiffre aux clients qui avaient refusé les statistiques. Seules des instructions ciblées l'ont corrigé : chaque réponse utilisée pour décider reste recoupée.
- **Un projet prévu pour deux** : j'ai tenu seule les rôles de cheffe de projet, d'architecte, de data engineer et de responsable qualité.

## Limites et pistes

- La cartographie du système d'information a été dessinée et documentée, mais pas saisie dans MEGA HOPEX, l'outil demandé.
- Le bronze est chargé par des requêtes SQL ; le pipeline Lakeflow, le traitement de nuit programmé et le tableau de bord sont conçus mais pas construits.
- Les droits de lecture par métier sont écrits (`GRANT`) mais pas appliqués sur l'édition gratuite de Databricks.
- Recharger le bronze depuis les fichiers ramène les lignes purgées : en production, le PMS doit cesser de les envoyer. La purge ne traite pas encore la nationalité ni l'expiration des consentements.
- Pistes : automatiser le traitement de nuit avec ses contrôles, ajouter le seuil d'effectif au profil, publier le tableau de bord de la direction.

*Les schémas et l'interface sont en anglais ou en français selon l'outil. Le jeu de données, fourni par le cours, n'est pas redistribué.*
