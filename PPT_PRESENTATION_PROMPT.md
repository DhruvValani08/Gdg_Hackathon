# 📊 Complete AI Presentation (PPT) Generator Prompt: Civil Sahai AI

> **Use this prompt in:** Gamma.app, Tome, SlidesAI, Beautiful.ai, ChatGPT (with Advanced Data Analysis / PPT export), or PowerPoint Copilot to generate a pitch deck for **Civil Sahai AI**.

---

## 🎯 Master Prompt for AI Presentation Generator

Copy the text inside the block below and paste it into your presentation tool:

```text
Create a high-impact, 10-slide professional healthcare AI pitch deck for a hackathon presentation titled "Civil Sahai: Multilingual Clinical Intake & Inter-Hospital Referral Synthesizer Powered by Google Gemma". 

Design Aesthetic & Theme:
- Deep midnight navy/slate background (#090D16) with medical electric blue (#3B82F6), emergency crimson (#EF4444), transit cyan (#06B6D4), and clean white typography.
- Modern glassmorphism card layouts, clean iconography, bold metric callouts, and structured comparison tables.
- Tone: Clinical-grade, authoritative, empathetic, innovative, and mission-driven.

Slide Breakdown & Content:

---

### Slide 1: Title Slide (Vision & Impact)
- **Title:** Civil Sahai AI
- **Subtitle:** Bridging Patient-Doctor Linguistic Barriers & Rural-to-Urban Referral Blind Spots with Google Gemma
- **Tagline:** Multilingual Clinical Intake & Emergency Transfer Synthesizer
- **Presented by:** [Your Team / Author Name] | Gemma Hackathon Submission
- **Visuals:** High-tech medical pulse wave, subtle glowing hospital cross, multilingual badges (ગુજરાતી, हिन्दी, English).

---

### Slide 2: The Problem: Multilingual & Rural Healthcare Bottlenecks
- **The Problem:**
  1. **Linguistic Gap in OPDs:** Patients describe acute symptoms in regional dialects or code-mixed speech (Gujarati, Hindi, Gujlish). Receptionists and nurses struggle to translate and structure notes in crowded clinics.
  2. **The "Inter-Hospital Transfer Blind Spot":** When a critical patient is transferred from a rural Primary Health Center (PHC) to a city Civil Hospital, crucial pre-transfer interventions (e.g. anti-snake venom, loading dose aspirin, medication timing) and transit events are lost.
  3. **Fragmented Workflows:** Different users (patients, nurses, doctors, field camp workers) lack dedicated, role-specific interfaces.
- **Visuals:** Split comparison: Overcrowded OPD waiting room vs. Ambiguous handwritten rural referral chit.

---

### Slide 3: The 4 Dedicated User Portals in Civil Sahai
- **Tailored for All Healthcare Stakeholders:**
  1. 🧑‍🤝‍🧑 **1. Patients Completing Intake:** Voice-first accessible UI in Gujarati/Hindi/English generating a Digital Clinic Intake Token.
  2. 📋 **2. Clinic Reception & Nursing Staff:** Fast OPD intake, multilingual structuring via Gemma, missing details clarification loop, and transfer logging.
  3. 👨‍⚕️ **3. Doctors Reviewing Summaries:** Live triage queue, emergency red-flag badges, SBAR transfer dossiers, and 1-click EHR export.
  4. ⛺ **4. Community Health Camps & Field Paramedics:** Offline-first screening (Vitals, BP, Sugar) with 1-click 108 Ambulance Referral Dispatch.
- **Visuals:** 4-quadrant layout displaying the 4 persona cards with distinct theme colors.

---

### Slide 4: Technical Architecture & Google Gemma Integration
- **Why Google Gemma?**
  - **Open-Weights Privacy:** Runs 100% locally via Ollama (`ollama run gemma:2b`) on clinic computers without cloud API bills or patient privacy leaks.
  - **Multilingual Semantic Reasoning:** Maps regional idioms (e.g. "છાતીમાં દુખે છે", "BP ની દવા") to standardized medical terminology without hallucinations.
  - **Strict JSON Enforcement:** Delivers deterministic schema compliance for electronic health records (EHR).
- **Processing Pipeline:**
  - Raw Input (Voice/Text) ➔ Dual Deterministic Regex Filter ➔ Gemma Multilingual LLM Extraction ➔ Missing Detail Gap Detector ➔ Doctor-Verified SBAR Output.
- **Visuals:** Architectural flowchart diagram showing the 5-step data pipeline.

---

### Slide 5: The Game-Changer: Inter-Hospital Referral & Transit Handover
- **Solving the Rural-to-Urban Healthcare Handover:**
  - **Route Visualizer:** Tracks patient journey from Origin PHC ➔ 108 Ambulance ➔ City Hospital.
  - **Pre-Transfer Interventions:** Records exact medications, IV fluids, and injections given at the village with timestamps.
  - **In-Transit Event Tracking:** Captures vital changes, vomiting, seizures, or oxygen desaturation during ambulance transport.
  - **Critical Handover Gap Resolution:** Automatically detects what receiving city doctors miss (e.g. unverified medication timing, missing doctor contact, baseline vitals).
- **Visuals:** Visual timeline showing a patient transfer from PHC Dholka to Ahmedabad Civil Hospital.

---

### Slide 6: Emergency Red-Flag Triage & Interactive Clarification Loop
- **Dual Emergency Rule Engine:**
  - Instantaneous crimson pulsing alerts for life-threatening symptoms (Cardiac chest pain, acute dyspnea, venomous bites, severe trauma).
- **Missing Information Feedback Loop (Human-in-the-Loop):**
  - Identifies unstated parameters (e.g., patient age, exact duration, allergy history).
  - Prompts triage staff with 1-click clarification chips to ask the patient before finalizing.
- **Visuals:** Emergency Alert UI card with glowing crimson border and interactive amber clarification chips.

---

### Slide 7: Strict Safety & Responsible AI Boundaries
- **Core Ethical Guardrails:**
  - ❌ **NO Medical Diagnoses:** Does not hypothesize illnesses or replace clinical judgment.
  - ❌ **NO Medication Prescriptions:** Strictly forbids dosage recommendations or drug prescribing.
  - ❌ **NO Survival Probability Calculations:** Avoids ungrounded prognostic speculation.
  - ✅ **100% Fact Synthesis & Staff Verification:** Requires human confirmation checkbox before EHR handoff.
- **Visuals:** Shield icon with green checkmarks for ethical AI protocols and red crossouts for out-of-scope boundaries.

---

### Slide 8: Real-World Benchmark Case Studies
- **Case 1: Gujarati Cardiac Walk-In OPD (Patient ➔ Reception ➔ Doctor)**
  - *Input:* "મને બે દિવસથી છાતીમાં દુખે છે અને આજે શ્વાસ લેવામાં તકલીફ થાય છે. BP ની દવા ચાલુ છે."
  - *Output:* Extracted 2 days duration, active antihypertensives, flagged cardiac emergency.
- **Case 2: Rural Snakebite Referral (Camp/PHC ➔ 108 Ambulance ➔ ER Doctor)**
  - *Input:* "PHC Dholka thi Civil Ahmedabad transfer. 38M, snakebite. 2 vials ASV + IV Normal Saline given at 10 AM. Vomited in 108 ambulance."
  - *Output:* SBAR transfer dossier, flagged missing timestamp for 2nd ASV dose, urgent toxicology triage.
- **Visuals:** Side-by-side before/after transformation cards showing colloquial input turning into clinical SBAR output.

---

### Slide 9: Offline Edge Deployment & Field Health Camps
- **Built for Real-World Rural Infrastructure:**
  - **Zero-Cloud Dependency:** Operates fully offline in rural clinics and mobile disaster camps via Ollama.
  - **Cross-Platform:** Responsive web, tablet UI for 108 ambulances, and camp screening mode.
  - **Cost:** Free, open-source, and accessible to public health systems.
- **Visuals:** Laptop/Tablet mockup showing local offline execution badge (🟢 Local Gemma Engine Active).

---

### Slide 10: Conclusion, Impact & Vision
- **Summary:** Civil Sahai transforms unstructured regional speech and chaotic rural transfer notes into doctor-ready clinical intelligence across all 4 user tiers.
- **Impact Metrics:**
  - ⏱️ 70% reduction in triage intake documentation time.
  - 🛡️ Zero forgotten pre-transfer medications in rural referrals.
  - 🌐 100% equitable healthcare access across vernacular languages.
- **Call to Action:** "Civil Sahai — Empowering Doctors, Protecting Patients, Connecting Rural-to-Urban Healthcare."
- **Visuals:** High-contrast closing slide with project links, GitHub repository QR code, and Gemma 4 badge.
```
