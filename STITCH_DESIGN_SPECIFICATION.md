# 🎨 Stitch Frontend Design Specification & Generation Prompts
## Project: Civil Sahai (સિવિલ સહાય) — Multilingual Clinical AI Platform

This document contains everything needed to generate the UI for **Civil Sahai** in **Google Stitch** (or via Stitch MCP tools).

---

## 💎 1. Global Design System (Design MD)

Copy and paste this into Stitch's **Design MD** tab:

```markdown
# Design System: Civil Sahai Clinical AI

## Brand Identity
- **Product Name:** Civil Sahai (સિવિલ સહાય)
- **Tagline:** Intelligent Multilingual Clinical Intake, Staff Triage & Rural Referral Synthesizer
- **Theme:** Ultra-Modern Medical Dark Mode with Glassmorphism & High-Contrast Clinical Accents
- **Tone:** Clinical-Grade, Empathetic, High-Speed, Trustworthy, Accessible

## Color Palette Tokens
- **Background Main:** `#090D16` (Deep Midnight Slate)
- **Glass Panel Surface:** `rgba(18, 26, 43, 0.75)` with `16px backdrop-filter blur`
- **Glass Surface Hover:** `rgba(23, 34, 58, 0.85)`
- **Border Subtle:** `rgba(255, 255, 255, 0.08)`
- **Primary Brand (Blue):** `#3B82F6` (Electric Medical Blue)
- **Primary Gradient:** `linear-gradient(135deg, #2563EB, #3B82F6)`
- **Doctor Suite (Cyan):** `#06B6D4` / `#38BDF8`
- **Nursing / Staff Triage (Purple):** `#A855F7` / `#C084FC`
- **Community Camps (Emerald):** `#10B981` / `#34D399`
- **Emergency Crimson (Red Flags):** `#EF4444` / Alert Bg: `rgba(239, 68, 68, 0.15)`
- **Warning Amber (Gaps / Pending):** `#F59E0B` / Alert Bg: `rgba(245, 158, 11, 0.12)`
- **Text Primary:** `#F8FAFC`
- **Text Muted:** `#94A3B8`
- **Text Dim:** `#64748B`

## Typography
- **Headings & Body:** 'Plus Jakarta Sans', sans-serif (Weights: 400, 500, 600, 700, 800)
- **Clinical Summaries, Rx Codes & Tokens:** 'JetBrains Mono', monospace (Weights: 400, 500, 700)

## UI Elements & Micro-interactions
- **Glassmorphic Cards:** Border-radius 18px, subtle 1px border `rgba(255, 255, 255, 0.08)`, soft glow box-shadow `0 10px 40px -10px rgba(0, 0, 0, 0.5)`.
- **Active Role Badges:** Pill-shaped, semi-transparent background with glowing border.
- **Pulsing Emergency Banners:** Red glowing border with 2px crimson pulse for critical triage flags.
- **Field Auto-Fill Glow:** Green highlight `rgba(16, 185, 129, 0.35)` with checkmark badge when populated by conversational AI.
```

---

## 📱 2. Screen-by-Screen Stitch Prompts

### 🖥️ Screen 1: Central Persona Gateway & Role Selection Screen
```text
A futuristic, dark-mode healthcare portal landing screen named "Civil Sahai" with deep midnight slate background (#090D16) and subtle violet/cyan atmospheric glow.

Top Header:
- Pill badges: "🏥 Multilingual Clinical AI" and "Gemma 4 Powered".
- Large gradient title: "Civil Sahai", subtitle: "Intelligent Multilingual Clinical Intake & Rural-to-Urban Referral Synthesizer".
- Safety Disclaimer Banner: Blue glassmorphic bar with shield icon: "Responsible AI Protocol: This assistant structures clinical intake & transfers. No automated diagnoses or prescriptions."

Central Role Grid (2x2 Grid of Glowing Glassmorphic Cards):
1. Card 1 (Blue Accent #3B82F6):
   - Icon: "🧑‍🤝‍🧑"
   - Title: "Patients Completing Intake"
   - Target: "OPD Walk-in Patients & Family"
   - Description: "Voice-first multilingual intake in Gujarati, Hindi, or English. Conversational assistant helps complete medical history."
   - Button: "Enter Patient Portal →" (Blue Gradient)
2. Card 2 (Purple Accent #A855F7):
   - Icon: "📋"
   - Title: "Clinic Reception & Nursing Staff"
   - Target: "Triage Desk & Registration Officers"
   - Description: "Review incoming patient intakes, verify emergency red-flags, and route patients to appropriate department specialists."
   - Button: "Enter Reception & Triage Desk →" (Purple Gradient)
3. Card 3 (Cyan Accent #06B6D4):
   - Icon: "👨‍⚕️"
   - Title: "Doctors Reviewing Summaries"
   - Target: "Attending Specialist Physicians"
   - Description: "Review structured SBAR clinical summaries, check critical history, and issue official digital prescriptions (Rx)."
   - Button: "Enter Doctor Suite →" (Cyan Gradient)
4. Card 4 (Emerald Accent #10B981):
   - Icon: "⛺"
   - Title: "Community Health Camps"
   - Target: "Rural Field Workers & 108 Ambulance EMTs"
   - Description: "Offline village screening, rapid vitals logging, and outbound 108 emergency referral dossier dispatch."
   - Button: "Enter Health Camp Station →" (Emerald Gradient)
```

---

### 🖥️ Screen 2: Patient Multilingual Intake & "Sahai Mitra" Live Chat Assistant Drawer
```text
A modern clinical self-intake interface for patients in dark mode (#090D16).

Header:
- Title: "Detailed Assisted Intake Form (વિગતવાર ફોર્મ)"
- Subtitle: "Voice-first intake guided by our Gemma Assistant, automatically routed to the doctor by clinic staff."
- Top Toggle: "📝 New Patient Intake" (Active) vs "💊 Check My Prescription"

Two-Column Split Layout:
Left Column (Clinical Details Checklist - Glass Panel):
- Top Bar: Header "📋 Clinical Details Checklist" with green pill badge "⚡ Real-time Auto-filling".
- Structured Fields:
  - Patient Full Name: "Ramesh Patel"
  - Age (Highlighted in green glow with badge "✓ Updated by Assistant"): "54 years"
  - Primary Complaint: "Severe retrosternal chest pain and shortness of breath for 2 days"
  - Duration (Glowing input): "2 days"
  - Pain / Discomfort Severity Slider: Interactive bar set to 8/10.
  - Existing Chronic Conditions (Green glow): "Hypertension (High BP)"
  - Current Daily Medications (Green glow): "Amlodipine 5mg OD"
  - Known Allergies: "No known drug allergies"
- Bottom Buttons: "← Back" and "✓ Confirm & Generate My Clinic Intake Pass →" (Bright Blue CTA).

Right Column (Sahai Mitra Live Chat Drawer - Glassmorphic Companion):
- Header: Robot avatar 🤖 "Sahai Mitra (સહાય મિત્ર)" with green status dot "🟢 Gemma Patient Assistant Active".
- Chat Message Stream:
  - Assistant Bubble (Left, dark glass): "નમસ્તે રમેશભાઈ! હું તમારો સહાયક 'સહાય મિત્ર' છું. મેં તમારી છાતીના દુખાવાની વિગત નોંધી છે. શું તમને BP કે ડાયાબિટીસની કોઈ દવા ચાલુ છે?"
  - Patient Bubble (Right, bright blue gradient): "હા, મને 5 વર્ષથી હાઈ BP છે અને એમ્લોડિપિન દવા લઉં છું."
  - Assistant Bubble (Left): "આભાર! મેં તમારા ફોર્મમાં High BP અને Amlodipine દવા નોંધી દીધી છે. હવે તમે નીચે આપેલ બટન દબાવીને પાસ મેળવી શકો છો."
- Chat Input Bar: Rounded input "Reply in Gujarati, Hindi, or English...", microphone icon button 🎤, and "Send" button.
```

---

### 🖥️ Screen 3: Clinical Staff Triage & Specialist Doctor Routing Desk
```text
A high-efficiency clinical triage dashboard for hospital nursing and registration staff in dark mode (#090D16).

Header:
- User Badge: "👤 Staff: Sister Anjali Sharma (Senior Triage Nurse)" with "📋 Switch Staff Account" button.
- Sub-Navigation Tabs:
  - "📥 Patient Triage & Doctor Routing (4 Pending)" (Active Purple)
  - "📝 New Walk-In Intake"
  - "🚑 Inbound Rural Transfer"

Top Quick-Lookup: Full-width search bar with magnifying glass icon: "Look up Patient Token ID (e.g. PAT-4821, PAT-7714)..."

Two-Column Split Dashboard:
Left Column (Incoming Intakes Queue - 340px width):
- Queue Header: "Incoming Patient Intakes" with badge "4 Total".
- Queue Cards:
  1. Card 1 (Selected, Red left border):
     - Top: "PAT-4821" | Badge "🔴 EMERGENCY"
     - Patient: "Ramesh Patel (54 yrs, Male)"
     - Snippet: "Severe retrosternal chest pain and shortness of breath for 2 days..."
     - Footer: "🕒 10:15 AM | ➔ Dr. Mehta (Cardio)"
  2. Card 2:
     - Top: "PAT-3190" | Badge "🟢 ASSIGNED"
     - Patient: "Shantaben Vankar (62 yrs, Female)"
     - Snippet: "Knee joint stiffness and swelling for 1 week..."
     - Footer: "🕒 10:40 AM | ➔ Dr. Patel (Ortho)"
  3. Card 3:
     - Top: "PAT-7714" | Badge "🟡 NEEDS DOCTOR"
     - Patient: "Mohammad Ansari (42 yrs, Male)"
     - Snippet: "High fever and severe body ache for 4 days..."
     - Footer: "🕒 11:20 AM | Unassigned"

Right Column (Selected Patient Review & Doctor Routing Pad - Glass Panel):
- Top Bar: "Ramesh Patel (54 years)" | Token "PAT-4821" | Green pill "✓ Assigned to: Dr. Aarav Mehta (Cardiology)".
- Emergency Red Flag Alert (Crimson pulsing banner): "🚨 Emergency Red Flag: Potential cardiac issue (Chest pain) - Immediate ECG and cardiac triage required."
- Structured Findings Grid: Chief complaint, Duration, History (Hypertension), Active Meds (Amlodipine 5mg), Allergies (None).
- Objective Gemma Synthesis: "54M presenting with acute retrosternal chest pain and dyspnea. Known hypertensive on Amlodipine. High clinical priority for cardiac evaluation."
- Doctor Assignment Pad (Purple themed card):
  - Dropdown: Selected "Dr. Aarav Mehta — Cardiology & Chest Medicine (OPD Cabin 102)".
  - Staff Triage Note Input: "Priority chest pain patient, requested immediate 12-lead ECG before consult".
  - CTA Button: "🚀 Confirm & Route Intake to Doctor's Queue →" (Purple Gradient).
```

---

### 🖥️ Screen 4: Specialist Doctor Consultation & Official Prescription Pad (Rx)
```text
A specialized physician review and digital prescription pad in dark mode (#090D16).

Header:
- User Badge: "👨‍⚕️ Logged in: Dr. Aarav Mehta — Cardiology & Chest Medicine (Cabin 102)".
- Right Toggle: "My Assigned Patients (3)" (Active Cyan) vs "All Hospital Intakes".

Two-Column Clinical Split View:
Left Column (Assigned Patient Queue):
- List of cardiology patients assigned to Dr. Aarav Mehta.
- Card 1 (Selected, glowing cyan outline): "PAT-4821 — Ramesh Patel (54 yrs, Male)" | "🔴 EMERGENCY" | "Pending Consult".

Right Column (Clinical Dossier & Official Prescription Pad):
- Patient Dossier Top: "Ramesh Patel (54 yrs, Male)" | Token: "PAT-4821" | Button: "📋 Copy EHR Note".
- Emergency Alert: "🚨 Red Flag: Immediate cardiac evaluation needed".
- Structured Clinical History: Chief complaint, duration, chronic conditions, active medications, allergies, and Gemma synthesis.

Doctor's Official Diagnosis & Prescription Pad (Cyan themed card with large serif ℞ symbol):
- Title: "Doctor's Official Diagnosis & Prescription Pad" | Subtitle: "Authorized Physician: Dr. Aarav Mehta (Cardiology)".
- Clinical Diagnosis Input: "Acute Coronary Syndrome (ACS) Workup / Unstable Angina".
- Prescribed Medications (Rx Table):
  - Row 1: "Tab. Sorbitrate" | "5mg" | Dropdown: "SOS (As needed for chest pain)" | "5 days" | [✕]
  - Row 2: "Tab. Ecosprin" | "150mg" | Dropdown: "1-0-0 (Morning only)" | "30 days" | [✕]
  - Row 3: "Tab. Atorvastatin" | "40mg" | Dropdown: "0-0-1 (Night only)" | "30 days" | [✕]
  - Button: "+ Add Another Medication" (Dashed cyan border).
- Clinical Advice Input: "Urgent 12-lead ECG, Serum Troponin I, strictly low salt diet, complete bed rest."
- Follow-up Field: "Review in OPD after 3 days or immediately if chest pain recurs."
- Big Signature CTA: "✍️ Sign & Issue Official Digital Prescription →" (Cyan gradient with checkmark).
```

---

### 🖥️ Screen 5: Community Health Camp 108 Ambulance Outbound Referral & Patient Digital Rx Pass
```text
A dual-purpose visualizer screen showcasing Rural Camp 108 Ambulance Dispatch and Patient Digital Prescription Retrieval in dark mode (#090D16).

Left View: Community Health Camp 108 Ambulance Referral Pass:
- Top Tag: "⛺ Rural Community Health Camp & Mobile Station" with emerald badge "🟢 Local Gemma Offline Engine Active".
- Card Header: "✓ 108 Ambulance Outbound Referral Dossier" (Timestamp 11:05 AM).
- Route Journey Graphic:
  "[⛺ Origin: PHC Dholka Health Camp] ➔ 🚑 108 Ambulance ➔ [🏥 Destination: District Civil Hospital Emergency]"
- Screened Vitals: "BP: 185/110 mmHg | Blood Sugar (RBS): 340 mg/dL | Pulse: 98 bpm".
- Patient Observations: "Severe dizziness, pedal edema for 3 days, and near-syncope while working in fields."
- Bottom Instruction: "🚑 Hand this referral pass to 108 Ambulance EMT for direct SBAR handover at Civil Hospital trauma bay."

Right View: Patient Digital Prescription Retrieval Slip (Token PAT-4821):
- Top: "CIVIL HOSPITAL OPD OFFICIAL PRESCRIPTION" with green badge "✓ Doctor Prescription Issued".
- Doctor Info: "👨‍⚕️ Dr. Aarav Mehta (Cardiology & Chest Medicine - Cabin 102)".
- Diagnosis Banner: "Clinical Diagnosis: Acute Coronary Syndrome (ACS) Workup / Unstable Angina".
- Prescribed Medicines:
  - 💊 Tab. Sorbitrate (5mg) — SOS for chest pain
  - 💊 Tab. Ecosprin (150mg) — 1-0-0 (Morning) for 30 days [After food]
  - 💊 Tab. Atorvastatin (40mg) — 0-0-1 (Night) for 30 days [After food]
- Doctor Advice: "Urgent 12-lead ECG, Serum Troponin I, low sodium diet."
- Footer: "Digitally signed and verified via Civil Sahai Clinical Platform."
```

---

## 🛠️ Step-by-Step Instructions to Generate in Google Stitch:

1. **Step 1:** In Google Stitch, click **New Project** ➔ Name it `Civil Sahai Clinical AI`.
2. **Step 2:** Paste the contents of **Section 1 (Design MD)** into the Design System configuration.
3. **Step 3:** Generate **Screen 1 through Screen 5** sequentially using the exact prompts in **Section 2**.
4. **Step 4:** Export the Figma / Stitch screens or grab the preview URLs to include in your **Kaggle Hackathon Writeup** and **Presentation Slide Deck**!
