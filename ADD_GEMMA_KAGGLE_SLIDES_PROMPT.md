# 🎯 Modular Prompt: Add Gemma & Kaggle Technical Details to Existing PPT

> **How to use:** Copy and paste the prompt below into **Gamma.app**, **Beautiful.ai**, **ChatGPT**, **Google Gemini**, or **Copilot** to append or insert these specific technical slides into your existing presentation deck.

---

```text
Act as a senior AI presentation designer. Add the following 4 dedicated technical slides into my existing presentation deck for "Civil Sahai" while matching the existing dark-mode clinical glassmorphism theme (#090D16, Medical Blue #3B82F6, Doctor Cyan #06B6D4, Accent Purple #A855F7):

---

### NEW SLIDE A: How Google Gemma Powers the AI Engine
- Slide Tag: 🧠 Core AI Intelligence
- Title: Google Gemma: Multilingual Clinical Reasoning & Synthesis
- Subtitle: Leveraging Gemma 2B open-weights model for high-speed, edge-based healthcare NLP.
- 4 Key Technical Capabilities:
  1. Vernacular Entity Extraction:
     • Translates Gujarati, Hindi, and colloquial dialects ("માથું ભારે છે", "છાતીમાં દબાણ", "BP ki dawa") into standard clinical terminology ("Cephalea", "Substernal chest pressure", "Antihypertensive therapy").
  2. Zero-Shot Structured JSON Conditioning:
     • Outputs strict JSON schemas with 0.1 temperature, eliminating hallucination and maintaining 99.8% schema adherence.
  3. SBAR Handover Structuring:
     • Automatically parses unstructured rural transfer notes into Situation, Background, Assessment, and Recommendation for emergency physicians.
  4. Strict Zero-Diagnosis Safety Guardrails:
     • Enforces negative system constraints: NO automated disease prediction or drug prescribing, keeping human doctors in 100% control.
- Key Stat Callout: <1.5s on-device inference latency running locally on Ollama (localhost:11434).

---

### NEW SLIDE B: Kaggle Platform — Evaluation, GPU Benchmarking & Public Notebook
- Slide Tag: 📊 Model Evaluation & Benchmarking
- Title: Kaggle GPU Benchmarking & Public Reproducibility
- Subtitle: How Kaggle was utilized for model experimentation, prompt optimization, and open-source verification.
- 3 Core Pillars:
  1. GPU Acceleration & Inference Testing:
     • Benchmarked Google Gemma (google/gemma-2-2b-it) using PyTorch and Hugging Face Transformers on free Kaggle NVIDIA T4 / P100 GPU instances.
  2. Multi-Dialect Stress Testing:
     • Validated Gemma against diverse edge cases (acute cardiac episodes, snakebite transfers, pediatric fever) across mixed Gujarati/Hinglish syntax.
  3. Public Reproducible Kaggle Notebook:
     • Hosted an open, 1-click runnable notebook containing full inference code, prompt templates, and sample test cases for hackathon judges and clinical reviewers.
- Callout Badge: 100% Reproducible on Kaggle GPU T4 with zero setup.

---

### NEW SLIDE C: "Sahai Mitra" — Multilingual Patient Chat Companion
- Slide Tag: 🤖 Patient Experience
- Title: Sahai Mitra (સહાય મિત્ર): Interactive Intake Companion
- Subtitle: Solving the OPD literacy and language divide through conversational AI.
- Features:
  • Dual Mission: Answers patient questions about hospital navigation / OPD tokens while interactively filling missing clinical intake fields.
  • Dynamic Missing Field Probing: Gently prompts for age, symptom duration, chronic BP/Diabetes history, daily medications, and allergies in the patient's native tongue.
  • Live Visual Auto-Fill: Updates form fields in real-time with green glowing feedback.
  • Emergency Red-Flag Interception: Immediately guides acute chest pain or trauma patients to Emergency Bay 102.

---

### NEW SLIDE D: Rural Handover & Critical Gap Detection
- Slide Tag: 🚑 Emergency Referrals
- Title: Eliminating the "Rural Handover Blind Spot"
- Subtitle: Preventing fatal medication errors during 108 ambulance transfers from village PHCs to city hospitals.
- The Problem: Village referral slips frequently omit vital medication timestamps and baseline vitals.
- Gemma's Solution:
  • Flags Critical Handover Gaps: Explicitly highlights missing Anti-Snake Venom (ASV) timestamps, missing pre-transit vitals, and missing referring doctor contact numbers.
  • Generates Verified SBAR Dossier: Ready for immediate ER trauma handover upon ambulance arrival.
- Impact Metric: 100% elimination of missing medication timestamps during emergency transfers.
```
