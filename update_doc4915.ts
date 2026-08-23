import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const abstractText = `A wearable ECG-based necklace prototype that continuously monitors heart activity and provides real-time alerts up to 15 minutes before potential myocardial infarction episodes.`;

const fullTextMarkdown = `## Abstract

Cardiovascular diseases are one of the most leading causes of mortality all around the world, often resulting from delayed diagnosis or irregular checkups. This paper presents a wearable **ECG-based necklace prototype** that continuously monitors the user's heart activity and detects abnormalities. It is connected with a mobile application via Bluetooth that keeps records of heart rates, sends reports to doctors and family on a routine basis, and has an alert system that sends notification on the user's phone and a few selective family member's phone approximately **15 minutes before any potential myocardial infarction episode**, if detected.

However, the system's predictive capability requires clinical validation and may generate false positives. Providing early warnings could potentially save lives of people by enabling timely medical attention. The proposed wearable offers a comfortable, fashionable, and accessible alternative to bulky monitoring systems and has potential for future integration with machine-learning-based prediction models.

---

## 1. Introduction

Cardiovascular diseases (CVDs) remain one of the most dominating causes of mortality worldwide, where a lot of factors cause CVDs. It is largely due to delayed diagnosis, lifestyle, medical awareness, and the lack of continuous heart monitoring in daily life.

Although wearable heart monitoring devices such as smartwatches from **Apple Watch** and **Fitbit** exist which are easy to wear and use PPG to measure pulse rate, they cannot detect heart attack signals like ST elevation. Additionally, the wrist is not ideal for heart monitoring.

Chest-strap ECG devices like **Polar H10** give accurate results and are used by athletes. However, they are very uncomfortable, bulky, and not wearable 24/7.

To address these limitations, this paper proposes a **wearable heart attack detecting necklace** that continuously monitors the user's heart activity using **ECG + PPG**. It analyzes abnormalities like arrhythmia, ST segment shifts, sudden heart-rate variability spikes, and heart-beat pauses in real time, and sends early alerts through a mobile application.

> **Primary Objective:** To design a comfortable, continuous, and accessible heart-monitoring wearable capable of providing early warning for potential myocardial infarction events.

---

## 2. Literature Review

### ECG-Based Monitoring
ECG-based monitoring remains the most accurate and reliable source for detecting electrical abnormalities in the heart, as it:
- Measures electrical activity of the heart.
- Can detect early signs of heart attack.
- Captures P, QRS, and T wave patterns essential for diagnosing cardiac events.

### PPG Technology
In contrast, PPG technology:
- Measures pulse rate using optical methods.
- Provides heart-rate trends.
- Is commonly used in smartwatches.
- Is easily affected by movement, skin tone, and external light.

### Existing Wearable Devices
- **Smartwatches (Apple Watch, Fitbit):** Provide convenient heart-rate tracking. Fail to deliver continuous ECG data without user input. Cannot reliably detect cardiac events.
- **Chest-Strap ECG Devices (Polar H10):** Offer high accuracy. Are uncomfortable for long-term use. Not suitable for daily lifestyle use.
- **Holter Monitors:** Record ECG continuously. Are bulky and wired. Not suited for daily lifestyle use.

### Research Gap
Existing solutions lack a comfortable, fashionable, and continuous ECG-based wearable capable of early cardiac abnormality detection. This research aims to fill this gap by developing a necklace-form wearable that combines accuracy, comfort, visual appeal, and real-time alert capabilities.

---

## 3. Methodology

### 3.1 System Architecture
The proposed system consists of a wearable necklace equipped with ECG and optional PPG sensors connected to a low-power microcontroller. The microcontroller continuously collects heart activity data and transmits it to an Android-based mobile application via **Bluetooth Low Energy (BLE)**.

The mobile application manages:
- **Data logging** and history archiving.
- **Real-time waveform visualization**.
- **Alert system** designed to notify the user and selected family members of potential myocardial abnormalities.

### 3.2 Hardware Components
- **ECG Sensor (AD8232):** Used to capture electrical activity of the heart, provides more accurate signal for detecting irregular rhythms, and detects potential pre-attack patterns.
- **PPG Sensor (Optional):** Provides optical measurement of heart rate and helps confirm abnormalities detected in ECG signals.
- **Microcontroller (ESP32 or Arduino Nano BLE):** Responsible for acquiring sensor data, performs basic signal processing, and manages BLE communication.
- **Bluetooth Low Energy (BLE):** Chosen for its low-power consumption, making it suitable for continuous wearable use.
- **Battery & Power System:** Compact rechargeable Li-ion battery powers the device, and power optimization techniques ensure extended operational time.

### 3.3 Software Pipeline & Algorithm Flow
The system follows a sequential pipeline:
1. **Data Acquisition:** ECG/PPG sensors continuously collect raw physiological data.
2. **Signal Conditioning:** The microcontroller filters noise and extracts relevant heart-rate features.
3. **Threshold Evaluation:** Threshold-based algorithm compares detected values with predefined safe ranges.
4. **Flag Generation:** Alert flag is generated if abnormalities exceed safe thresholds.
5. **BLE Transmission:** Data and alerts are transmitted to the Android app via BLE.
6. **Action & Routing:** Mobile app logs data, triggers notifications, and enables sharing with family members or healthcare providers.

### 3.4 Threshold-Based Alert Logic
The alert module uses simple rule-based conditions to detect dangerous events. Thresholds include:
- Heart rate exceeding safe upper limits
- Sudden heart-rate spikes or drops
- Irregular ECG patterns and waveform distortions
- Prolonged deviations from personalized baseline

If any threshold is crossed for a sustained window (e.g., 10–15 seconds), the system generates a potential myocardial infarction warning approximately **15 minutes before the predicted event**.

### 3.5 Detection Algorithm Window
A simple threshold-based algorithm analyzes the ECG waveform for irregularities. If the QRS amplitude, interval deviation, or heart-rate fluctuation exceeds preset boundaries for longer than a 20–30 second window, the system marks the event as abnormal.

The mobile application then issues an alert potentially up to 10–15 minutes before a critical episode depending on pattern severity. While this method provides rapid detection, false positives may occur due to noise or motion artifacts.

---

## 4. Expected Results

Since the hardware prototype and mobile application are still in the development phase, this study presents the expected outcomes based on the system's design architecture and algorithmic framework. The heart-monitoring necklace, combined with the threshold-based abnormality detection model, is expected to demonstrate the following performance characteristics:

### 4.1 Continuous and Stable Monitoring
The ECG (and optional PPG) sensors are expected to provide consistent real-time heart-activity readings suitable for early abnormality detection.

### 4.2 Accurate Identification of Abnormal Patterns
The threshold algorithm should accurately detect sudden spikes, drops, and irregular rhythms that typically precede myocardial infarction events. These abnormalities are expected to be flagged within seconds of detection.

### 4.3 Low-Power, Uninterrupted Operation
The BLE-enabled necklace is expected to maintain stable communication with the mobile application, operate on minimal power, and remain suitable for daily wearable use.

### 4.4 Reliable Alert Generation
When an abnormal pattern is detected, the system is expected to generate an early-warning alert approximately 10–15 minutes before a potential myocardial event, enabling timely medical attention.

### 4.5 Seamless Data Transmission to Mobile App
Heart-rate data, timestamps, and alert notifications are expected to be transmitted to the Android app without packet losses or significant delay.

### 4.6 User-Friendly App Experience
The mobile application is expected to represent real-time heart data visually, enable users to share reports with family members, and allow sharing with healthcare professionals.

> **Overall Impact:** The expected results indicate that the proposed system has the potential to function as an effective early-warning wearable for detecting cardiac abnormalities before they become life-threatening.

---

## 5. Discussion

### Advantages of the Necklace Form Factor
The necklace form factor provides distinct anatomical and practical advantages:
- **Chest Proximity:** Closer proximity to the heart enables more stable and high-fidelity ECG readings compared to wrist-based devices.
- **All-Day Comfort:** Unlike restrictive chest straps that cause irritation and chafing, the necklace is suitable for continuous 24/7 daily wearing.
- **Enhanced Safety:** Early warning notifications significantly boost user safety by bridging the gap between initial cardiac stress and emergency medical intervention.

### Limitations of Prototype Stage
The current design remains in the prototype stage, with the following considerations:
- **Clinical Validation:** No clinical validation performed on human subjects yet.
- **False Positives:** Threshold-based logic may generate false alerts during physical exertion or stress.
- **Motion Artifacts:** Body movement can introduce noise into continuous ECG readings.
- **Battery Optimization:** Power efficiency requires further empirical study under real-world conditions.
- **Long-term Durability:** Mechanical resilience over extended wear not yet tested.

### Future Work & Roadmap
Future enhancements planned for the architecture include:
- **Machine Learning Integration:** Moving beyond rule-based thresholds to deep neural network prediction models for improved accuracy.
- **Expanded App Functionality:** Enhanced UI/UX, personalized risk scoring, and interactive wellness logs.
- **Cloud-Based Data Storage:** HIPAA-compliant cloud synchronization for secure and accessible health records.
- **Clinical Trials:** Structured medical validation of performance and safety on diverse demographic groups.
- **Additional Biosensors:** Integrating temperature and skin conductance sensors for comprehensive diagnostic monitoring.
- **Advanced Power Management:** Ultra-low-power sleep cycles and energy harvesting for multi-week operational life.

---

## 6. Conclusion

This study presents a wearable heart attack detecting necklace designed to provide continuous ECG-based monitoring and early-warning alerts. By combining comfort, accuracy, and mobile connectivity, the device addresses the limitations of existing wearables and offers a practical solution for reducing cardiac risk through timely intervention.

The device is connected to a mobile-based application that:
- Sends alert notifications to the user's phone and trusted close contacts.
- Provides alerts approximately 15 minutes before a potential myocardial infarction episode.
- Tracks the user's heart health trends on a daily basis.
- Stores diagnostic records and automatically transmits reports to doctors and family members weekly.
- Keeps track of health habits, physical activity, and potential cardiac risk factors.

Overall, the proposed wearable demonstrates significant potential as an effective early-warning device for cardiac abnormality detection, with the capability to save lives through timely medical intervention when integrated with proper clinical validation and machine learning enhancements.

---

## Technical Specifications & Architecture Summary

### Key Features Matrix
- **Device Type:** Wearable Necklace Form Factor
- **Primary Sensor:** ECG (AD8232 Single-Lead Heart Rate Monitor)
- **Secondary Sensor:** Optical PPG (Pulse Oximetry / Heart Rate)
- **Core Microcontroller:** ESP32 / Arduino Nano 33 BLE
- **Wireless Protocol:** Bluetooth Low Energy (BLE 5.0)
- **Alert Window:** 10–15 minutes early warning before predicted cardiac event
- **Power Source:** Compact Rechargeable Li-ion Polymer Battery
- **Client Application:** Native Android Mobile App (Real-time Telemetry & Alerts)
- **Data Sharing:** Automated reporting to family members & healthcare providers
- **Development Status:** Prototype Build & Algorithmic Validation

### Complete Technology Stack
- **Hardware Architecture:** AD8232 ECG Sensor • Optical PPG Sensor Module • ESP32 / Arduino Nano BLE MCU • BLE 5.0 Transceiver Module • Li-ion Battery Management System
- **Software Architecture:** Android Mobile Application • Bluetooth Low Energy (BLE) Protocol Stack • Rule-Based Threshold Detection Engine • Real-time Waveform Rendering Pipeline
- **Signal Processing Pipeline:** Raw ECG Waveform Filtering • QRS Complex & Amplitude Detection • Heart Rate Variability (HRV) Analysis • ST Segment Shift Monitoring

### Target Applications & Use Cases
- **Continuous Healthcare Monitoring:** 24/7 non-invasive cardiac health tracking for at-risk patients.
- **Preventive Cardiology:** Early identification of pre-symptomatic cardiac stress and ischemic episodes.
- **Personal Health Management:** Daily heart health logging and lifestyle tracking for proactive individuals.
- **Telemedicine Integration:** Remote patient monitoring with real-time alert routing to physicians.
- **Family Safety Network:** Automated emergency notifications dispatched to designated family contacts.
- **Clinical Research & Trials:** High-frequency real-world ECG data collection for cardiological studies.

### Performance Expectations
- ✅ Continuous real-time heart-activity monitoring without signal degradation
- ✅ Accurate abnormality detection within seconds of threshold breach
- ✅ Ultra-low-power operation suitable for multi-day continuous daily wear
- ✅ Early-warning notifications dispatched 10–15 minutes prior to critical events
- ✅ Seamless BLE data transmission with zero packet loss or perceived latency
- ✅ Intuitive, user-friendly mobile application interface

---

## Current Status & Next Steps

### Completed Milestones
- End-to-end system design and architectural blueprinting
- Hardware component selection and schematic verification
- Core threshold-based detection algorithm development
- Mobile app UI/UX framework and BLE telemetry receiver

### Active Development
- Physical hardware PCB assembly and necklace enclosure integration
- Mobile app feature implementation and state management
- Benchtop system testing and simulated waveform validation

### Pending Phases
- Human subject clinical trials and institutional ethical review
- Algorithmic optimization and motion artifact rejection tuning
- Deep learning / AI prediction model training on annotated ECG datasets
- Medical device regulatory compliance and safety certification (FDA/CE)

---

## Attribution & References

**Document Classification:** Research Whitepaper — Technical Prototype Design  
**Author:** Riddhi Sinha  
**Version:** 1.0 (Draft — Pending Publication)  
**Last Updated:** December 3, 2025  

### Core References & Related Work
- *ECG-based continuous cardiac monitoring systems and clinical diagnostic thresholds*
- *Wearable health devices, IoT healthcare architectures, and patient compliance in daily wear*
- *Real-time physiological signal processing algorithms and QRS detection methodologies*
- *Bluetooth Low Energy communication protocols for low-power medical IoT telecare*
- *Mobile health applications, emergency notification systems, and remote telemedicine frameworks*

---

## License & Disclaimer

**License:** Licensed under the Creative Commons Attribution 4.0 International (CC BY 4.0) License. You are free to share and adapt this work with appropriate attribution.

> **Medical Disclaimer:** This document describes a prototype research project currently in the engineering and algorithmic development stage. The system has **not undergone clinical validation** and **must not be used for medical diagnosis, treatment, or real-life emergency monitoring** without formal clinical trials and regulatory approval. For any health or cardiac concerns, please consult a certified medical professional immediately.
`;

const keywordsList = [
  "ECG Monitoring",
  "PPG Sensors",
  "Wearable Health-Tech",
  "Myocardial Infarction Alert",
  "BLE Low Energy",
  "AD8232 Sensor",
  "Arrhythmia Detection",
  "Android Health App",
  "ST Segment Shift",
  "Cardiovascular Prevention"
];

async function updatePaper() {
  const client = postgres(process.env.DATABASE_URL!, { max: 1 });
  try {
    console.log("Updating DOC-4915 in research_papers...");
    await client`
      UPDATE research_papers
      SET
        abstract = ${abstractText},
        full_text = ${fullTextMarkdown},
        keywords = ${client.json(keywordsList)},
        institution = null,
        updated_at = NOW()
      WHERE id = 'DOC-4915'
    `;
    console.log("✓ Successfully updated DOC-4915!");
  } finally {
    await client.end();
  }
}

updatePaper().catch(console.error);
