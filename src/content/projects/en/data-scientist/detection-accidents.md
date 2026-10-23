---
title: Road Accident Detection and Prediction
domain: data-scientist
summary: Design study of an AI system that detects accidents in real time (video and sensors) and predicts high-risk areas for preventive action. Group project.
date: 2025-10-16
tools: [Computer vision, YOLOv8, 3D-CNN, LSTM / GRU, ST-GCN, ConvLSTM, Sensor fusion]
status: terminé
---

## Context

Group project at ESIEE Paris with **Samba Diallo** and **Youcef Guederi**, on the topic of AI for intelligent transport. Among several possible subjects (driver behaviour, traffic prediction, object detection, intrusion detection…), we chose **accident detection**.

It is a **design study**: defining the objectives, identifying the available data and choosing suitable methods, before any implementation.

## Problem

After an accident, every minute counts. And many accidents happen on the same stretches of road. We set ourselves two goals:

1. **Detect immediately** that an accident has just happened, to alert emergency services or trigger an automatic action (braking, reporting).
2. **Predict where and when** an accident is likely to happen (*hotspots*), so action can be taken upstream: signage, traffic management.

## Solution

### 1. Real-time detection

- **Sources**: road and city cameras, dashcams, on-board cameras (buses, taxis), vehicle sensors (accelerometer, gyroscope, ABS, CAN bus), acoustic sensors, automatic emergency calls.
- **Data**: video streams, acceleration and orientation time series, audio signals, metadata (GPS, timestamp, speed).
- **Methods**:
  - **Computer vision**: object detectors (YOLOv5/v8, EfficientDet) spot the vehicles. Action recognition models (3D-CNN, I3D, Temporal ConvNets) recognise a crash, a fall or a stopped vehicle.
  - **Sensor fusion**: business rules combined with sequence models (LSTM, GRU, temporal Transformer) cross-reference accelerometer, GPS and speed.

### 2. Predicting high-risk areas

- **Sources**: accident history, real-time traffic, weather, local events, road conditions (roadworks), IoT traffic-flow sensors and socio-demographic data.
- **Data**: time series, spatial data split into a grid, categorical variables, satellite and Street View images for the state of the infrastructure.
- **Methods**: spatio-temporal models (ST-GCN, ConvLSTM, Prophet with explanatory variables), geostatistical *hotspot* analysis and supervised risk classification per road segment.

## Challenges

- **Sensor synchronisation**: cameras, accelerometers and GPS have neither the same frequency nor the same clock. Fusing them requires precise time alignment, otherwise the model compares events that are out of sync.
- **Bias in historical data**: sensors are only installed on some roads. The model risks labelling areas as "safe" simply because they are poorly observed.
- **Choice of methods**: we had to find the right trade-off between accuracy and the real-time constraint for detection.

## Results

The deliverable is a **complete solution architecture** for both use cases. For each one, it specifies the data sources, the data types, the suitable model families and the main risks.

> This work taught me to **frame an AI project before writing code**: start from the business need, list the data that is actually available and anticipate biases. These steps determine the quality of the final model.

**Planned next step**: a prototype of the detection part, using YOLOv8 on a public dataset of accident videos, then a map of high-risk areas built from French open accident data (BAAC).
