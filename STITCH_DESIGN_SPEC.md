# 🎨 Civil Sahai AI — Stitch Frontend Design System & Prompts

> **Project Name:** Civil Sahai AI  
> **Tagline:** Gemma-Powered Multilingual Clinical Intake & Rural Referral Synthesizer  
> **Design Framework:** Google Stitch / Modern Medical Glassmorphism

---

## 📋 Table of Contents
1. [Global Design System (Design MD)](#1-global-design-system-design-md)
2. [Screen 1: Multilingual Patient Clinical Intake (OPD Walk-in)](#2-screen-1-multilingual-patient-clinical-intake-opd-walk-in)
3. [Screen 2: Doctor-Ready Structured Summary & Emergency Triage](#3-screen-2-doctor-ready-structured-summary--emergency-triage)
4. [Screen 3: Inter-Hospital & Rural-to-Urban Transfer Handover](#4-screen-3-inter-hospital--rural-to-urban-transfer-handover)
5. [Screen 4: Paramedic & 108 Ambulance Field Tablet](#5-screen-4-paramedic--108-ambulance-field-tablet)
6. [Instructions for Stitch](#6-how-to-use-in-google-stitch)

---

## 1. Global Design System (Design MD)

Copy and paste this block into Stitch's **Design MD / Design System** input:

```markdown
# Design System: Civil Sahai Clinical AI

## Brand Identity
- **Name:** Civil Sahai AI
- **Domain:** Clinical Healthcare, Emergency Triage, Rural Referral Workflows
- **Theme:** High-Contrast Medical Dark Mode with Glassmorphism
- **Visual Feel:** Premium, High-Speed, Clinical-Grade, Accessible

## Color Palette (HEX & HSL Tokens)
- **Background Primary:** `#090D16` (Deep Midnight Slate)
- **Card Background:** `rgba(18, 26, 43, 0.75)` with `16px backdrop-blur`
- **Card Border:** `rgba(255, 255, 255, 0.08)`
- **Primary Brand Accent:** `#3B82F6` (Electric Medical Blue)
- **Primary Gradient:** `linear-gradient(135deg, #2563EB, #3B82F6)`
- **Cyan Accent (Transfer & Transit):** `#06B6D4` / `#38BDF8`
- **Emergency Crimson:** `#EF4444` / Background: `rgba(239, 68, 68, 0.15)` (Pulsing Glow)
- **Warning Amber (Missing Details):** `#F59E0B` / Background: `rgba(245, 158, 11, 0.12)`
- **Verified Emerald:** `#10B981` / Background: `rgba(16, 185, 129, 0.15)`
- **Text Main:** `#F8FAFC`
- **Text Muted:** `#94A3B8`
- **Text Dim:** `#64748B`

## Typography
- **Headings & Body UI:** 'Plus Jakarta Sans', sans-serif (Weights: 500, 600, 700, 800)
- **Clinical Data, SBAR & Timestamps:** 'JetBrains Mono', monospace (Weights: 400, 500)

## UI Components & Tokens
- **Glass Panels:** Rounded 16px to 18px, subtle 1px border, soft deep shadow `0 10px 40px -10px rgba(0, 0, 0, 0.5)`.
- **Badges:** Pill-shaped, semi-transparent background with colored borders.
- **Form Controls:** Dark translucent inputs with 2px bright blue focus rings.
- **Pulsing Emergency Banners:** Glowing animated border for immediate clinical triage attention.
```

---

## 2. Screen 1: Multilingual Patient Clinical Intake (OPD Walk-in)

### 🎯 Purpose:
Allows walk-in patients or triage receptionists to input spoken or written descriptions in Gujarati, Hindi, English, or mixed dialects.

### 📝 Stitch Prompt:
```text
A dark-mode, futuristic clinical intake dashboard for a hospital OPD named 'Civil Sahai'. 
Header: Pill badges saying 'Clinical Intake' and 'Gemma 4 Powered', title 'Civil Sahai', subtitle 'Intelligent multilingual patient intake note synthesizer for clinic staff and triage doctors'. 
Mode Selector: Two rounded toggle tabs at the top — 'Standard Clinic Intake' (Active, bright blue) and 'Inter-Hospital & Rural Transfer' (Dark slate).
Safety Banner: Thin blue glassmorphic banner with shield icon: 'Safety & Responsible-AI Protocol: This assistant structures intake notes only. No automated diagnosis or prescriptions.'
Main Glassmorphic Card:
- Header: 'Patient Clinical Intake' with subtitle 'Speak or type in Gujarati, Hindi, English, or mixed dialects', top right pill 'Powered by Gemma'.
- Quick Test Scenarios: Row of 4 sleek interactive chips ('Gujarati (Challenge Example)', 'Hindi', 'Mixed (Gujlish)', 'English').
- Textarea: Large dark slate input with placeholder in Gujarati script ('મને બે દિવસથી છાતીમાં દુખે છે...').
- Input Toolbar inside textarea: Microphone button '🎤 Paramedic / Voice Intake' and 'Clear' button.
- Big CTA Button: Gradient blue button 'Generate Clinical Summary →'.
Deep midnight blue background with subtle violet and cyan atmospheric glowing radial gradients.
```

---

## 3. Screen 2: Doctor-Ready Structured Summary & Emergency Triage

### 🎯 Purpose:
Displays extracted clinical entities, triggers red-flag emergency banners, prompts staff for missing parameters, and outputs a concise doctor-ready summary.

### 📝 Stitch Prompt:
```text
A high-fidelity clinical review screen in a dark-mode healthcare app. 
Top: High-urgency crimson alert banner with emergency siren icon and red glowing border: 'EMERGENCY INDICATOR DETECTED - IMMEDIATE TRIAGE RECOMMENDED', listing 'Potential cardiac issue reported (Chest Pain)' and 'Respiratory distress reported (Breathing Difficulty)'.
Main Summary Glass Panel:
- Top Bar: Badges showing 'Language: Gujarati', 'Gemma Engine', and yellow status badge '⏳ Pending Staff Verification'. Right side buttons: '📋 Copy for Doctor' (Blue) and '+ New Intake' (Outline).
- Original Quote Box: Italicized patient quote: 'મને બે દિવસથી છાતીમાં દુખે છે અને આજે શ્વાસ લેવામાં તકલીફ થાય છે. BP ની દવા ચાલુ છે.'
- Missing Info Clarification Box: Amber themed card with warning icon 'Incomplete Clinical Details Detected' with dashed prompt buttons '+ Clarify Patient Age', '+ Clarify Known Allergies', '+ Clarify Pain Severity'.
- 2-Column Editable Clinical Grid:
  - Chief Complaint (Full width): 'Chest pain and discomfort'
  - Duration: '2 days'
  - Patient Age / Gender: '45 yrs' / 'Male'
  - Reported Symptoms: 'Chest pain (retrosubsternal), Dyspnea / Shortness of breath'
  - Current Medications: 'Antihypertensive medication (Active)'
  - Known Allergies: 'Not specified'
  - Chronic Conditions: 'Hypertension (High Blood Pressure)'
- Doctor Summary Box: Dark highlighted box labeled '👨‍⚕️ Concise Doctor-Ready Summary (Non-diagnostic fact synthesis)' containing an objective 3-sentence summary for the doctor.
- Bottom: Green checkbox 'I have confirmed the accuracy of these details with the patient'.
```

---

## 4. Screen 3: Inter-Hospital & Rural-to-Urban Transfer Handover

### 🎯 Purpose:
Solves the rural-to-urban referral communication breakdown by synthesizing pre-transfer interventions, transit ambulance events, and doctor handover blind spots.

### 📝 Stitch Prompt:
```text
A specialized emergency transfer handover screen for receiving city emergency doctors.
Top Header: Active cyan toggle '🚑 Inter-Hospital & Rural Transfer'.
Main Dossier Glassmorphic Panel:
- Header: 'Hospital Referral & Transit Handover' with cyan badge 'Gemma SBAR Engine'.
- Transfer Route Visualizer: Horizontal journey bar showing '[🏥 Origin: PHC Dholka] ➔ [108 Ambulance] ➔ [🏙️ Destination: Civil Hospital Ahmedabad]'.
- Critical Handover Gaps Card: Crimson/amber warning card: 'Critical Handover Gaps (Common Blindspots for Receiving Doctors)' with buttons '🔍 Resolve: Exact timestamp when ASV was given at village PHC', '🔍 Resolve: Referring Doctor contact phone number', '🔍 Resolve: Baseline blood pressure before departure'.
- Structured Handover Grid:
  - Referring Facility: 'PHC Dholka'
  - Receiving Facility: 'Civil Hospital Ahmedabad'
  - Reason for Transfer: 'Envenomation management requiring ICU bed and continuous vitals monitoring'
  - Pre-Transfer Interventions: '2 vials Anti-Snake Venom (ASV) administered at 10:00 AM, IV Normal Saline line running'
  - In-Transit Ambulance Events: '1 episode of vomiting, increasing drowsiness noted in 108 ambulance'
- SBAR Doctor Handover Box: Cyan bordered box '👨‍⚕️ SBAR Structured Handover for Receiving City ER Doctor' (Situation, Background, Assessment, Recommendation).
- Bottom: Checkbox 'I (Receiving City Medical Officer) have verified pre-transfer medications and accepted patient handover'.
```

---

## 5. Screen 4: Paramedic & 108 Ambulance Field Tablet

### 🎯 Purpose:
Rugged, high-contrast mobile/tablet interface for paramedics and rural Community Health Workers (CHWs) with voice-first recording and offline indicators.

### 📝 Stitch Prompt:
```text
A rugged, mobile-responsive tablet UI for rural paramedics and 108 ambulance technicians.
Compact layout with large touch-friendly buttons.
Prominent central audio recording visualizer (pulsing red sound wave) with button 'Tap to Dictate Rural Referral'.
Quick-entry fields for 'Origin PHC', 'Medications Given Before Transit', and 'Transit Vitals (BP, SpO2, Pulse)'.
Offline Ready status badge: '🟢 Local Gemma Engine Active (No Internet Required)'.
```

---

## 6. How to Use in Google Stitch

1. Open [Stitch](https://stitch.withgoogle.com/) and create a new project called **Civil Sahai AI**.
2. Go to **Design System** and paste the Markdown from **Section 1**.
3. Generate the 4 screens sequentially by pasting the text prompts from **Sections 2, 3, 4, and 5**.
4. Export the resulting UI previews, Figma tokens, or embed links to attach to your **Kaggle Hackathon Writeup**!
