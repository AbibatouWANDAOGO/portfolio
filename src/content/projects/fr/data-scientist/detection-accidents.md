---
title: Détection et prédiction des accidents de la route
domain: data-scientist
summary: Étude de conception d'un système d'IA qui détecte un accident en temps réel et prédit les situations à risque (projet de groupe), puis mise en pratique sur les 125 000 personnes impliquées dans un accident en France en 2023.
date: 2025-10-16
tools: [Computer vision, YOLOv8, LSTM / GRU, ST-GCN, Fusion de capteurs, Python, XGBoost]
github: https://github.com/AbibatouWANDAOGO/road-accident-severity-prediction
notebook: https://github.com/AbibatouWANDAOGO/road-accident-severity-prediction/blob/main/accident_severity_prediction.ipynb
status: terminé
---

## Contexte

Projet de groupe réalisé à l'ESIEE Paris avec **Samba Diallo** et **Youcef Guederi**, sur le thème de l'IA appliquée aux transports intelligents. Parmi plusieurs sujets possibles (comportement du conducteur, prédiction du trafic, détection d'objets, détection d'intrusions…), nous avons choisi la **détection des accidents**.

Il s'agit d'une **étude de conception** : définir les objectifs, identifier les données disponibles et choisir les méthodes adaptées, avant toute implémentation.

## Problème

Après un accident, chaque minute compte. Et beaucoup d'accidents surviennent sur les mêmes portions de route. Nous nous sommes fixé deux objectifs :

1. **Détecter immédiatement** qu'un accident vient d'avoir lieu, pour alerter les secours ou déclencher une action automatique (freinage, signalement).
2. **Prédire où et quand** un accident a de fortes chances de se produire (*hotspots*), pour agir en amont : signalisation, gestion du trafic.

## Solution

### 1. Détection en temps réel

- **Sources** : caméras routières et urbaines, dashcams, caméras embarquées (bus, taxis), capteurs du véhicule (accéléromètre, gyroscope, ABS, CAN bus), capteurs acoustiques, appels d'urgence automatiques.
- **Données** : flux vidéo, séries temporelles d'accélération et d'orientation, signaux sonores, métadonnées (GPS, horodatage, vitesse).
- **Méthodes** :
  - **Computer vision** : des détecteurs d'objets (YOLOv5/v8, EfficientDet) repèrent les véhicules. Des modèles d'action (3D-CNN, I3D, Temporal ConvNets) reconnaissent un choc, une chute ou un véhicule immobilisé.
  - **Fusion de capteurs** : des règles métier combinées à des modèles séquentiels (LSTM, GRU, Transformer temporel) croisent accéléromètre, GPS et vitesse.

### 2. Prédiction des zones à risque

- **Sources** : historique des accidents, trafic en temps réel, météo, événements locaux, état de la route (chantiers), capteurs IoT de flux et données socio-démographiques.
- **Données** : séries temporelles, données spatiales découpées en grille, variables catégorielles, images satellite et Street View pour l'état de l'infrastructure.
- **Méthodes** : modèles spatio-temporels (ST-GCN, ConvLSTM, Prophet avec variables explicatives), analyse géostatistique de *hotspots* et classification supervisée du risque par portion de route.

## Difficultés rencontrées

- **Synchronisation des capteurs** : caméras, accéléromètres et GPS n'ont ni la même fréquence ni la même horloge. Les fusionner demande un alignement temporel précis, sinon le modèle compare des événements décalés.
- **Biais dans les données historiques** : les capteurs ne sont installés que sur certaines routes. Le modèle risque de juger « sûres » des zones simplement peu observées.
- **Choix des méthodes** : il fallait trouver le bon compromis entre précision et contrainte de temps réel pour la détection.

## Résultats

Le livrable est une **architecture de solution complète** pour les deux cas d'usage. Pour chacun, elle précise les sources de données, les types de données, les familles de modèles adaptées et les principaux risques.

> Ce travail m'a appris à **cadrer un projet d'IA avant de coder** : partir du besoin métier, inventorier les données réellement disponibles et anticiper les biais. Ces étapes conditionnent la qualité du modèle final.

## Mise en pratique sur des données réelles

Pour confronter cette conception au terrain, j'ai travaillé sur la partie **prédiction** à partir des données ouvertes d'accidentologie (BAAC 2023) : **54 822 accidents** et **125 789 personnes impliquées** en France. Pour chaque personne, l'objectif est de prédire la gravité des blessures à partir des circonstances, de la route, du véhicule et de son profil.

![Gravité des blessures des personnes impliquées dans un accident en 2023](/portfolio/images/accidents/severity_distribution.png)
*Les cas graves sont rares : 15 % de blessés hospitalisés et 2,7 % de tués. C'est ce déséquilibre qui rend la prédiction difficile.*

Les données confirment l'intérêt de **cibler les situations à risque**, comme le prévoyait l'étude :

![Taux de blessés graves selon la zone, la luminosité et l'âge](/portfolio/images/accidents/severe_rate_by_context.png)
*Hors agglomération, la part de tués ou hospitalisés est deux fois plus élevée qu'en ville (26 % contre 13 %). Elle atteint 27 % la nuit sans éclairage et 32 % au-delà de 75 ans.*

**Résultat du modèle :** un XGBoost entraîné avec pondération des classes repère **58 % des accidents mortels**, contre 7 % sans pondération. En contrepartie, il donne beaucoup de fausses alertes (précision de 15 % sur les tués) : il sert à prioriser les situations à risque, pas à poser un diagnostic.

![Matrices de confusion avant et après pondération des classes](/portfolio/images/accidents/confusion_matrices.png)

**Un risque anticipé qui s'est vérifié :** l'étude pointait les biais des données historiques. En pratique, le piège venait de la fusion des tables : des doublons gonflaient le score du premier modèle de **11 points**. Je les ai détectés et corrigés avant toute modélisation.

👉 Détails complets : [Prédire la gravité des accidents de la route](/portfolio/projets/data-scientist/gravite-accidents-route) · [notebook](https://github.com/AbibatouWANDAOGO/road-accident-severity-prediction/blob/main/accident_severity_prediction.ipynb)

**Prochaine étape** : un prototype de la partie détection en temps réel, avec YOLOv8 sur un jeu de vidéos d'accidents public.
