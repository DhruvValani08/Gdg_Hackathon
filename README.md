# 🏥 Civil Sahai (સિવિલ સહાય)
### Multilingual Clinical Intake, Staff Triage & Rural-to-Urban Referral Synthesizer powered by Google Gemma

[![Google Gemma](https://img.shields.io/badge/Model-Google%20Gemma%202B-blue.svg)](https://ai.google.dev/gemma)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Kaggle Track](https://img.shields.io/badge/Kaggle-Gemma%20Sprint%202026-blueviolet)](https://www.kaggle.com/)
[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb.svg)](https://reactjs.org/)
[![Ollama Edge](https://img.shields.io/badge/Edge%20Runtime-Ollama%20(Local)-emerald.svg)](https://ollama.com/)

---

## 📌 Executive Summary
In high-volume public hospitals (such as Ahmedabad Civil Hospital handling 5,000+ OPD patients daily) and rural emergency transit networks, two critical communication bottlenecks cause severe delays and medical errors:

1. **The OPD Language Divide:** Patients describe acute symptoms in regional dialects (Gujarati, Hindi, Gujlish). Reception counters with 45-second interactions struggle to record structured clinical history.
2. **The Rural Referral Blind Spot:** When 108 Ambulances transfer critical cases from village Primary Health Centres (PHCs) to district hospitals, paper referral chits are frequently smudged, lost, or lack critical timestamps (e.g. Anti-Snake Venom administration times or in-transit vitals).

**Civil Sahai** is an edge-first, role-based clinical platform powered by **Google Gemma**. It translates vernacular voice/text descriptions into structured doctor-ready notes, eliminates handover blind spots via SBAR referral dossiers, and enforces strict **zero-diagnosis responsible AI guardrails**.

---

## 🌟 Key Capabilities & Clinical Personas

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CIVIL SAHAI ECOSYSTEM                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────┬───────┴───────────────┬─────────────────────┐
    ▼                       ▼                       ▼                     ▼
[ 1. Patient Portal ]   [ 2. Triage Desk ]     [ 3. Doctor Suite ]   [ 4. Health Camps ]
• Multilingual Voice    • Sister Anjali Queue  • Isolated Doctor     • 100% Offline Edge
• "Sahai Mitra" Chat    • Instant Token Lookup • Objective Summary   • Mass Screening
• Live Field Auto-fill  • Specialty Routing    • Digital Rx Pad      • 108 Dispatch
• PAT-4821 Token Pass   • Emergency Flagging   • Certified Sign-off  • ASV Gap Detection
```

### 1. 🧑‍🤝‍🧑 Patient Voice Intake & "Sahai Mitra" Chat Assistant
- **1-Click Voice Dictation:** Natural speech recognition in Gujarati (`gu-IN`), Hindi (`hi-IN`), and English (`en-IN`).
- **Sahai Mitra (સહાય મિત્ર):** Intelligent conversational companion powered by Google Gemma. It answers questions regarding OPD tokens and hospital navigation while interactively asking for missing clinical history (age, duration, BP/sugar, allergies, and 1–10 pain severity) with live glowing form auto-fills.
- **Digital Clinic Token:** Generates a secure token (e.g. `PAT-4821`) with instant lookup.

### 2. 📋 Clinical Staff Triage & Specialist Routing Desk
- **Senior Triage Nurse Queue (Sister Anjali Sharma):** Real-time monitoring of walk-ins and camp transfers.
- **1-Click Specialty Routing:** Direct assignment to:
  - 🫀 **Cardiology & Chest Medicine** (Dr. Aarav Mehta - Cabin 102)
  - 🩺 **General Medicine & Diabetology** (Dr. Priya Shah - Cabin 105)
  - 🦴 **Orthopedics & Joint Care** (Dr. Rajesh Patel - Cabin 204)
  - 🚨 **Emergency Trauma Bay** (Dr. Neha Verma - Bay 1)

### 3. 👨‍⚕️ Specialist Doctor Suite & Digital Prescription Pad (Rx)
- **Isolated Specialty Queues:** Doctors only see patients assigned to their specific department.
- **Objective Clinical Summary:** 3-sentence non-diagnostic clinical synthesis.
- **Digital Prescription Suite:** Add medications (1-0-1, SOS), advice, and sign official digital OPD prescriptions.

### 4. ⛺ Community Health Camps & 108 Ambulance Dispatch
- **100% Offline Edge Operation:** Operates in remote villages with zero internet dependency.
- **Outbound 108 Transfer Dossier:** Pre-formats emergency SBAR dossiers for ambulance EMTs, ensuring pre-transit medications (such as Anti-Snake Venom) and vital timestamps are never lost.

---

## 🧠 Google Gemma Architecture & Responsible AI

Civil Sahai utilizes **Google Gemma 2B** (`gemma-2-2b-it` / `gemma:2b`) with strict safety guardrails:

- **Vernacular Entity Extraction:** Converts colloquial idioms (*"છાતીમાં દબાણ અને શ્વાસ ચડે છે"*) into standard medical terminology (*"Substernal chest pressure / Dyspnea"*).
- **Critical Handover Gap Analysis:** Scans referral notes to flag fatal omissions (e.g. missing ASV dose timestamp, unverified baseline vitals).
- **Strict Zero-Diagnosis Boundaries:** Gemma **NEVER** predicts diseases or prescribes medication dosages. It strictly structures facts to empower certified physicians.
- **Complete Edge Privacy:** Runs locally on Ollama (`http://localhost:11434`), keeping sensitive patient data strictly within the hospital LAN.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Ollama](https://ollama.com/) (for local Gemma LLM inference)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/civil-sahai.git
cd civil-sahai
npm install
```

### 2. Start Local Google Gemma Model
In any terminal, run:
```bash
ollama run gemma2:2b
```
*(Ollama will host the local API endpoint at `http://localhost:11434`)*

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 📊 Kaggle Benchmarking & Reproducibility
The prompt engineering and JSON schema stability were benchmarked on **Kaggle GPU T4 / P100** environments:
- **Notebook Code & Write-up:** See [`KAGGLE_SUBMISSION_PACK.md`](./KAGGLE_SUBMISSION_PACK.md)
- **Interactive Presentation Deck:** Open [`presentation_preview.html`](./presentation_preview.html) in your browser.

---

## 🛠️ Technology Stack
- **AI / LLM:** Google Gemma 2B via Ollama (`localhost:11434`)
- **Frontend:** React 18, Vite
- **Styling:** Custom Vanilla CSS Design System (Glassmorphic Dark Mode)
- **Audio / Speech:** Multilingual Web Speech Recognition API
- **Deployment:** Edge-ready on hospital intranet mini-PCs or field laptops

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
