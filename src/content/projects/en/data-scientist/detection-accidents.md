---
title: Road Accident Detection and Prediction
domain: data-scientist
summary: Solution design for an AI system that detects road accidents in real time and anticipates high-risk situations (team project), followed by a hands-on application to the 125,000 people involved in road accidents in France in 2023.
date: 2025-10-16
tools: [Computer vision, YOLOv8, LSTM / GRU, ST-GCN, Sensor fusion, Python, XGBoost]
github: https://github.com/AbibatouWANDAOGO/road-accident-severity-prediction
notebook: https://github.com/AbibatouWANDAOGO/road-accident-severity-prediction/blob/main/accident_severity_prediction.ipynb
status: terminé
---

## Context

A team project at ESIEE Paris with **Samba Diallo** and **Youcef Guederi**, focused on AI for intelligent transportation systems. Among several possible topics (driver behavior, traffic forecasting, object detection, intrusion detection, etc.), we chose **accident detection**.

This is a **solution design study**: defining objectives, identifying available data sources and selecting appropriate methods ahead of implementation.

## Problem

In the aftermath of an accident, every minute counts, and accidents tend to cluster on the same stretches of road. We set two objectives:

1. **Detect accidents as they happen**, to alert emergency services or trigger an automated response (braking, incident reporting).
2. **Predict where and when accidents are likely to occur** (*hotspots*), so that preventive measures can be taken, such as signage or traffic management.

## Approach

### 1. Real-time detection

- **Data sources**: roadside and city cameras, dashcams, onboard cameras (buses, taxis), vehicle sensors (accelerometer, gyroscope, ABS, CAN bus), acoustic sensors and automatic emergency calls (eCall).
- **Data types**: video streams, acceleration and orientation time series, audio signals and metadata (GPS, timestamp, speed).
- **Methods**:
  - **Computer vision**: object detectors (YOLOv5/v8, EfficientDet) to locate vehicles, and action recognition models (3D-CNN, I3D, temporal ConvNets) to identify collisions, falls or stopped vehicles.
  - **Sensor fusion**: business rules combined with sequence models (LSTM, GRU, temporal Transformers) that correlate accelerometer, GPS and speed signals.

### 2. Predicting high-risk areas

- **Data sources**: historical accident records, real-time traffic, weather, local events, road conditions (construction work), IoT traffic sensors and socio-demographic data.
- **Data types**: time series, gridded spatial data, categorical variables, and satellite and Street View imagery to assess infrastructure condition.
- **Methods**: spatio-temporal models (ST-GCN, ConvLSTM, Prophet with exogenous regressors), geostatistical *hotspot* analysis and supervised risk classification at the road-segment level.

## Challenges

- **Sensor synchronization**: cameras, accelerometers and GPS operate at different frequencies and on different clocks. Fusing them requires precise time alignment; otherwise the model compares events that are out of sync.
- **Bias in historical data**: sensors cover only part of the road network, so the model risks labeling areas as "safe" simply because they are under-monitored.
- **Method selection**: detection required striking the right balance between accuracy and real-time latency constraints.

## Results

The deliverable is an **end-to-end solution architecture** for both use cases, specifying for each the data sources, data types, suitable model families and key risks.

> This project taught me to **scope an AI project before writing any code**: start from the business need, inventory the data that is actually available, and anticipate potential biases. These upstream decisions largely determine the quality of the final model.

## Applying the design to real-world data

To test this design against real data, I implemented the **prediction** component using France's open road accident data (BAAC 2023): **54,822 accidents** involving **125,789 people**. The goal is to predict each person's injury severity based on the circumstances of the accident, the road, the vehicle and the person's profile.

![Injury severity of people involved in road accidents in 2023](/portfolio/images/accidents/severity_distribution.png)
*Severe outcomes are rare: 15% hospitalized and 2.7% killed. This class imbalance is what makes the prediction task challenging.*

The data supports the study's emphasis on **targeting high-risk situations**:

![Share of severe injuries by area, lighting conditions and age](/portfolio/images/accidents/severe_rate_by_context.png)
*Outside built-up areas, the share of people killed or hospitalized is twice as high as in urban areas (26% vs. 13%). It reaches 27% at night on unlit roads and 32% among people over 75.*

**Model performance:** an XGBoost model trained with class weighting identifies **58% of fatal cases**, compared with 7% without weighting. The trade-off is a high false-alarm rate (15% precision on fatal cases): the model is designed to prioritize high-risk situations, not to deliver a diagnosis.

![Confusion matrices before and after class weighting](/portfolio/images/accidents/confusion_matrices.png)

**An anticipated risk, confirmed in practice:** the design study had flagged bias in historical data. In practice, the pitfall lay in the table joins: duplicate rows inflated the first model's score by **11 percentage points**. I detected and fixed the issue before any modeling.

👉 Full case study: [Predicting Road Accident Severity](/portfolio/en/projects/data-scientist/gravite-accidents-route) · [notebook](https://github.com/AbibatouWANDAOGO/road-accident-severity-prediction/blob/main/accident_severity_prediction.ipynb)

**Next step**: prototype the real-time detection component using YOLOv8 on a public dataset of accident videos.

*Chart labels are in French.*
