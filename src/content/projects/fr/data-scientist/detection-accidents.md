---
title: Détection et prédiction des accidents de la route
domain: data-scientist
summary: Étude de conception d'un système d'IA qui détecte un accident en temps réel (vidéo et capteurs) et prédit les zones à risque pour agir en prévention. Projet de groupe.
date: 2025-10-16
tools: [Computer vision, YOLOv8, 3D-CNN, LSTM / GRU, ST-GCN, ConvLSTM, Fusion de capteurs]
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

**Mise en pratique** : j'ai ensuite travaillé sur les données ouvertes d'accidentologie (BAAC 2023) pour [prédire la gravité des blessures](/portfolio/projets/data-scientist/gravite-accidents-route). **Prochaine étape** : un prototype de la partie détection en temps réel, avec YOLOv8 sur un jeu de vidéos d'accidents public.
