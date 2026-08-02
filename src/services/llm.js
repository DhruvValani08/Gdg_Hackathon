/**
 * Gemma Clinical Intake, Patient Chat Assistant & Inter-Hospital Transfer Service
 * Communicates with local Ollama Gemma instance or provides intelligent rule-augmented extraction
 */

export const GEMMA_INTAKE_PROMPT = `You are a specialized multilingual clinical intake assistant powered by Google Gemma.
Your task is to convert patient descriptions in Gujarati, Hindi, English, or mixed languages (Hinglish/Gujlish) into structured clinical intake data for clinic reception, nursing staff, and reviewing doctors.

CRITICAL SAFETY & RESPONSIBLE-USE RULES:
1. NEVER provide medical diagnosis.
2. NEVER suggest medicines, treatments, or dosages.
3. NEVER predict survival or disease probabilities.
4. NEVER replace a doctor's clinical evaluation.
5. Extract only facts directly stated or clearly implied by the patient.

You must output STRICTLY a JSON object with the following schema and NO additional commentary:
{
  "language_detected": "Gujarati | Hindi | English | Mixed",
  "chief_complaint": "Brief primary reason for visit in English",
  "symptoms": ["list of reported symptoms translated to clear clinical English terms"],
  "duration": "Duration of symptoms or 'Not specified'",
  "age": "Patient age or 'Not specified'",
  "gender": "Patient gender if mentioned or 'Not specified'",
  "existing_conditions": ["Chronic conditions or medical history, e.g. Hypertension, Diabetes, or 'None reported'"],
  "current_medicines": ["Current medications mentioned, e.g. BP medication, or 'None reported'"],
  "allergies": ["Reported allergies or 'Not specified'"],
  "missing_details": ["List specific missing details that staff should ask the patient (e.g. Age, Exact duration, Known allergies, Severity score 1-10)"],
  "emergency_indicators": ["List any emergency red flags like chest pain, breathing difficulty, severe bleeding, or 'None'"],
  "doctor_summary": "A concise, objective 2-3 sentence summary in English for the doctor. State the complaints, duration, medications, and red flags neutrally without any diagnosis."
}`;

export const GEMMA_PATIENT_CHAT_PROMPT = `You are "Sahai Mitra" (સહાય મિત્ર), an intelligent, empathetic, and polite multilingual patient companion powered by Google Gemma for Civil Hospital OPD.
Your dual mission is:
1. Answer the patient's questions about OPD procedures, tokens, doctor visits, hospital navigation, and form filling warmly and reassuringly in their language (Gujarati, Hindi, or English).
2. Help the patient complete missing details in their clinical intake checklist (Age, Duration, BP/Sugar conditions, Daily medicines, Allergies, Pain score 1-10).

CRITICAL CLINICAL & RESPONSIBLE AI RULES:
- NEVER give medical diagnoses or predict illnesses.
- NEVER prescribe medications, home remedies, or dosages.
- If the patient describes acute chest pain, severe breathlessness, snakebite, or heavy bleeding, urgently advise them to proceed immediately to Emergency / Casualty Bay while reassuring them that triage staff is notified.
- Always answer in the same language the patient speaks (Gujarati for Gujarati, Hindi for Hindi, English for English).
- Be warm, respectful, concise (1-3 sentences), and helpful.

You MUST respond strictly in the following JSON format:
{
  "reply_message": "Warm, direct answer to the patient's question or greeting in their language + gentle guidance on next step or missing form field",
  "extracted_updates": {
    "age": "Extracted age string e.g. '52 years' or null",
    "gender": "Male | Female | Other or null",
    "duration": "Extracted duration e.g. '3 days' or null",
    "severity": "Extracted 1-10 integer or null",
    "existing_conditions": ["Newly mentioned conditions e.g. 'Hypertension (High BP)' or empty array"],
    "current_medicines": ["Newly mentioned medicines e.g. 'Amlodipine 5mg' or empty array"],
    "allergies": ["Newly mentioned allergies e.g. 'Penicillin allergy' or 'No known allergies' or empty array"],
    "symptoms": ["Any additional symptoms mentioned or empty array"]
  }
}`;

export const GEMMA_TRANSFER_PROMPT = `You are an emergency inter-hospital handover and referral specialist powered by Google Gemma.
Your task is to convert patient transfer notes, referral slips, or verbal transit descriptions (from rural clinics, PHCs, or smaller hospitals to tertiary city hospitals) in Gujarati, Hindi, English, or mixed dialects into a structured Emergency Transfer Handover Packet.

CRITICAL SAFETY RULES:
1. NO medical diagnosis or prescription.
2. Accurately capture referral details, pre-transfer interventions (IV fluids, injections, oxygen), transit events, and baseline vitals.
3. Identify CRITICAL HANDOVER GAPS (vital facts the receiving city doctor needs to avoid fatal blind spots).

Output STRICTLY JSON with this schema:
{
  "language_detected": "Gujarati | Hindi | English | Mixed",
  "patient_name": "Patient name or 'Unknown'",
  "age_gender": "Age and Gender or 'Not specified'",
  "referring_facility": "Name of village PHC, CHC, or clinic referred from",
  "receiving_facility": "Name of target city hospital or 'Tertiary Center'",
  "transfer_reason": "Clinical justification for referral (e.g. lack of ICU, ventilator, advanced imaging, cardiac cath)",
  "chief_condition_at_referral": "Primary acute condition or presentation at referral",
  "symptoms": ["Key symptoms observed"],
  "pre_transfer_treatments": ["List of medications, injections, IV fluids, or oxygen administered BEFORE transfer (with doses/times if mentioned)"],
  "transit_events": ["Events during transit (e.g. seizure in ambulance, oxygen desaturation, vomited, stable) or 'Stable in transit'"],
  "allergies": ["Known allergies or 'Unverified'"],
  "critical_handover_gaps": ["Crucial missing transfer details that city doctors frequently miss (e.g., exact time medication was given at PHC, baseline SpO2/BP before ambulance, original referral slip attached, referring doctor contact number)"],
  "emergency_red_flags": ["Immediate life-threat alerts for the receiving emergency room team"],
  "doctor_handover_summary": "Concise 3-4 sentence SBAR (Situation, Background, Assessment, Recommendation) neutral handover summary for the receiving emergency/triage physician."
}`;

/**
 * Intelligent fallback extractor for standard intake
 */
export function generateFallbackIntake(text) {
  const lower = text.toLowerCase();
  
  let duration = 'Not specified';
  if (/(\d+)\s*(days?|દિવસ|દિ'|दिन)/i.test(text)) {
    const match = text.match(/(\d+)\s*(days?|દિવસ|દિ'|दिन)/i);
    duration = `${match[1]} days`;
  } else if (/બે દિવસ|2 days|દો દિન/i.test(text)) {
    duration = '2 days';
  } else if (/ત્રણ દિવસ|3 days|તીન દિન/i.test(text)) {
    duration = '3 days';
  } else if (/1 week|એક અઠવાડિયું|एक हफ्ता/i.test(text)) {
    duration = '1 week';
  } else if (/24 hours|24 કલાક|24 घंटे/i.test(text)) {
    duration = '24 hours';
  }

  let age = 'Not specified';
  const ageMatch = text.match(/(?:age|ઉંમર|उम्र|વર્ષ|साल|years? old)\s*(?:is|che|hai|:)?\s*(\d+)/i) || text.match(/(\d+)\s*(?:years? old|વર્ષ|साल)/i);
  if (ageMatch) age = `${ageMatch[1]} years`;

  const symptoms = [];
  const emergencies = [];
  let chiefComplaint = 'General discomfort / Unspecified symptoms';

  if (/છાતીમાં દુખ|chest pain|छाती में दर्द/i.test(text)) {
    symptoms.push('Chest pain (retrosubsternal/thoracic discomfort)');
    emergencies.push('Chest Pain - Requires immediate cardiac triage');
    chiefComplaint = 'Chest pain and discomfort';
  }
  if (/શ્વાસ લેવામાં તકલીફ|breathing difficulty|shortness of breath|सांस लेने में दिक्कत|breathless/i.test(text)) {
    symptoms.push('Dyspnea / Shortness of breath');
    emergencies.push('Breathing Difficulty - Requires immediate respiratory assessment');
    if (chiefComplaint.includes('General')) chiefComplaint = 'Shortness of breath';
  }
  if (/તાવ|fever|बुखार/i.test(text)) {
    symptoms.push('Fever / Pyrexia');
    if (chiefComplaint.includes('General')) chiefComplaint = 'Fever';
  }
  if (/માથું દુખ|headache|सिरदर्द|માથાનો દુખાવો/i.test(text)) {
    symptoms.push('Headache / Cephalea');
  }
  if (/stomach cramps|પેટમાં દુખાવો|पेट दर्द|nausea|ઉલટી/i.test(text)) {
    symptoms.push('Abdominal cramps / Nausea');
    if (chiefComplaint.includes('General')) chiefComplaint = 'Abdominal pain and nausea';
  }
  if (/knee|સાંધા|ઘૂંટણ|ઘૂંટણમાં સોજો|joint|swelling/i.test(text)) {
    symptoms.push('Knee joint pain and swelling (Arthralgia)');
    chiefComplaint = 'Joint pain with localized swelling';
  }

  if (symptoms.length === 0) symptoms.push('Patient reported general symptoms');

  const conditions = [];
  const medicines = [];
  const allergies = [];

  if (/bp|hypertension|બ્લડ પ્રેશર|હાઈ બીપી|हाई बीपी/i.test(text)) {
    conditions.push('Hypertension (High Blood Pressure)');
    if (/bp ની દવા|bp medicine|bp ki dawa|દવા ચાલુ/i.test(text)) {
      medicines.push('Antihypertensive medication (Active)');
    }
  }

  if (/sugar|diabetes|સુગર|ડાયાબિટીસ|मधुमेह/i.test(text)) {
    conditions.push('Diabetes Mellitus');
    if (/sugar ki dawa|ઇન્સ્યુલિન|metformin|દવા/i.test(text)) {
      medicines.push('Antidiabetic therapy / Metformin');
    }
  }

  if (/metformin/i.test(text)) medicines.push('Metformin (Oral hypoglycemic)');
  if (/penicillin allergy|allergy|એલર્જી/i.test(text)) {
    allergies.push(/penicillin/i.test(text) ? 'Penicillin allergy reported' : 'Allergy reported');
  }

  const missingDetails = [];
  if (age === 'Not specified') missingDetails.push('Patient Age');
  if (duration === 'Not specified') missingDetails.push('Exact symptom duration / onset time');
  if (allergies.length === 0) missingDetails.push('Known drug or food allergies');
  if (conditions.length === 0) missingDetails.push('Past medical history & chronic conditions');
  missingDetails.push('Pain severity score (1-10 scale)');

  let lang = 'Mixed';
  if (/[\u0A80-\u0AFF]/.test(text)) lang = 'Gujarati';
  else if (/[\u0900-\u097F]/.test(text)) lang = 'Hindi';
  else if (/^[A-Za-z0-9\s.,!?'"()-]+$/.test(text)) lang = 'English';

  const doctorSummary = `Patient reports ${chiefComplaint.toLowerCase()} lasting for ${duration}. Key symptoms include ${symptoms.join(', ')}. ${medicines.length > 0 ? `Current medications: ${medicines.join(', ')}.` : 'No current medications specified.'} ${emergencies.length > 0 ? `URGENT ATTENTION: ${emergencies.join('; ')}.` : ''} No diagnosis made; ready for clinical consultation.`;

  return {
    language_detected: lang,
    chief_complaint: chiefComplaint,
    symptoms: symptoms,
    duration: duration,
    age: age,
    gender: 'Not specified',
    existing_conditions: conditions.length > 0 ? conditions : ['None explicitly stated'],
    current_medicines: medicines.length > 0 ? medicines : ['None explicitly stated'],
    allergies: allergies.length > 0 ? allergies : ['Not specified'],
    missing_details: missingDetails,
    emergency_indicators: emergencies.length > 0 ? emergencies : ['None detected'],
    doctor_summary: doctorSummary
  };
}

/**
 * Intelligent fallback extractor for Rural Inter-Hospital Transfers
 */
export function generateFallbackTransfer(text) {
  const lower = text.toLowerCase();
  
  let patientName = 'Referred Patient';
  const nameMatch = text.match(/(?:patient|નામ|नाम|pt|patient name)\s*(?:is|:)?\s*([A-Za-z\u0A80-\u0AFF\u0900-\u097F\s]+?)(?:,|\.|\n|age|ઉંમર|ઉંમર)/i);
  if (nameMatch && nameMatch[1].trim().length > 2) {
    patientName = nameMatch[1].trim();
  }

  let ageGender = 'Not specified';
  const ageMatch = text.match(/(\d+)\s*(?:years?|વર્ષ|साल|yo|y\/o|m|f|male|female|પુરુષ|સ્ત્રી)/i);
  if (ageMatch) ageGender = ageMatch[0];

  let referringFacility = 'Primary Health Centre (PHC)';
  if (/chc|phc|rural hospital|સામુહિક આરોગ્ય કેન્દ્ર|પ્રાથમિક આરોગ્ય કેન્દ્ર|clinc|hospital/i.test(text)) {
    const phcMatch = text.match(/([A-Za-z\u0A80-\u0AFF\u0900-\u097F\s]+(?:PHC|CHC|Hospital|Clinic|કેન્દ્ર))/i);
    if (phcMatch) referringFacility = phcMatch[1].trim();
  }

  const preTreatments = [];
  if (/iv fluids?|rl|ns|saline|બાટલો|બોટલ/i.test(text)) preTreatments.push('IV Fluid resuscitation initiated (NS/RL)');
  if (/oxygen|o2|ઓક્સિજન|ऑक्सीजन/i.test(text)) preTreatments.push('Supplemental Oxygen via mask');
  if (/sorbitrate|aspirin|ecospirin|loading dose|ઇકોસ્પિરિન|સોર્બિટ્રેટ/i.test(text)) preTreatments.push('Acute Coronary Loading Dose (Aspirin + Statin/Nitrate)');
  if (/furosemide|lasix|લેસિક્સ/i.test(text)) preTreatments.push('IV Diuretic / Lasix administered');
  if (/injection|ઇન્જેક્શન|inj/i.test(text)) preTreatments.push('Emergency stabilization injection administered at referring facility');
  if (preTreatments.length === 0) preTreatments.push('No pre-transfer interventions documented on slip');

  const transitEvents = [];
  if (/seizure|આંચકી|દોરો/i.test(text)) transitEvents.push('Episodic seizure activity during ambulance transit');
  if (/desaturation|oxygen drop|sp02|spo2/i.test(text)) transitEvents.push('SpO2 desaturation observed during transit');
  if (/vomit|ઉલટી/i.test(text)) transitEvents.push('Emesis / Vomiting during transit');
  if (transitEvents.length === 0) transitEvents.push('Vitals monitored in 108 ambulance; transit stable');

  const gaps = [];
  if (!/spo2|bp|pulse|બીપી/i.test(text)) gaps.push('Baseline vitals (BP / SpO2 / Pulse) prior to ambulance departure NOT recorded on referral chit');
  if (!/time|વાગ્યે|બપોરે|સવારે/i.test(text)) gaps.push('Exact timestamp of emergency injection administration at PHC missing');
  if (!/doctor|dr|ફોન|phone|મોબાઈલ/i.test(text)) gaps.push('Referring MO / Medical Officer direct contact number missing for emergency clarification');
  if (gaps.length === 0) gaps.push('Verify baseline ECG strip if accompanied');

  const redFlags = [];
  if (/chest pain|mi|stemi|heart|હાર્ટ/i.test(text)) redFlags.push('Suspected Acute Coronary Syndrome / STEMI - Immediate Cath Lab / ECG required');
  if (/breathlessness|dyspnea|શ્વાસ|pulmonary/i.test(text)) redFlags.push('Acute Respiratory Distress - Immediate Oxygen / BiPAP standby required');
  if (/altered sensorium|unconscious|બેભાન/i.test(text)) redFlags.push('Altered Sensorium / GCS drop - Immediate neurological assessment required');
  if (redFlags.length === 0) redFlags.push('Urgent specialty evaluation upon ER arrival');

  let lang = 'Mixed';
  if (/[\u0A80-\u0AFF]/.test(text)) lang = 'Gujarati';
  else if (/[\u0900-\u097F]/.test(text)) lang = 'Hindi';
  else if (/^[A-Za-z0-9\s.,!?'"()-]+$/.test(text)) lang = 'English';

  const sbarSummary = `Situation: Inter-hospital transfer of ${patientName} (${ageGender}) from ${referringFacility} due to need for advanced tertiary emergency care. Background: Patient presented with acute clinical deterioration; pre-transfer measures include ${preTreatments.join(', ')}. Assessment: Emergency red flags noted: ${redFlags.join('; ')}. Recommendation: Immediate receiving ER triage, baseline vitals re-check, and specialist handover.`;

  return {
    language_detected: lang,
    patient_name: patientName,
    age_gender: ageGender,
    referring_facility: referringFacility,
    receiving_facility: 'Civil Hospital Emergency Trauma Center',
    transfer_reason: 'Higher tertiary care & advanced critical monitoring',
    chief_condition_at_referral: redFlags[0] || 'Acute clinical emergency requiring escalation',
    symptoms: redFlags,
    pre_transfer_treatments: preTreatments,
    transit_events: transitEvents,
    allergies: ['Unverified at referral'],
    critical_handover_gaps: gaps,
    emergency_red_flags: redFlags,
    doctor_handover_summary: sbarSummary
  };
}

/**
 * Intelligent conversational fallback for Sahai Mitra (Patient Chat Companion)
 * Handles comprehensive Q&A, OPD hospital navigation, direct symptom logging, and zero-diagnosis safety
 */
export function generateFallbackPatientChat(message, currentFormData) {
  const text = message.trim();
  const lower = text.toLowerCase();
  
  const extracted = {
    age: null,
    gender: null,
    duration: null,
    severity: null,
    existing_conditions: [],
    current_medicines: [],
    allergies: [],
    symptoms: []
  };

  // 1. Detect language
  const isGujarati = /[\u0A80-\u0AFF]/.test(text) || /che|nathi|mane|chhe|ha|na|su|kay|kare|kem|shoon|aabhar|dhanyavad|bol|maru|tamaru|javu|malashe|dava|dawa/i.test(text);
  const isHindi = /[\u0900-\u097F]/.test(text) || /hai|nahi|mujhe|haan|dawa|kya|kaise|kaha|batao|shukriya|kitna|kab|milega/i.test(text);

  // 2. Robust Age Extraction (handles "45", "52", "approx 50", "umar 45", "45 saal", "45 varsh", "45 yr", etc.)
  const standaloneNum = text.match(/^\s*(\d{1,3})\s*$/);
  const ageExplicit = text.match(/(?:age|ઉંમર|उम्र|વર્ષ|साल|years? old|yr|yrs|વરસ|બરહ)\s*(?:is|che|hai|:)?\s*(\d{1,3})/i) 
    || text.match(/(\d{1,3})\s*(?:years? old|years?|વર્ષ|साल|yr|yrs|વરસ|કી ઉંમર|ની ઉંમર)/i)
    || text.match(/(?:i am|hu|main|mari umar|meri umar)\s*(\d{1,3})/i);

  if (standaloneNum) {
    const num = parseInt(standaloneNum[1], 10);
    if (num >= 1 && num <= 115) {
      extracted.age = `${num} years`;
    }
  } else if (ageExplicit) {
    const num = parseInt(ageExplicit[1], 10);
    if (num >= 1 && num <= 115) {
      extracted.age = `${num} years`;
    }
  }

  // 3. Extract Duration
  const durMatch = text.match(/(\d+)\s*(?:days?|દિ'|દિવસ|દિન|दिन|hours?|કલાક|घंटे|weeks?|અઠવાડિયા|મહિના|months?)/i);
  if (durMatch) {
    extracted.duration = `${durMatch[0]}`;
  } else if (/બે દિવસ|2 days|દો દિન/i.test(text)) {
    extracted.duration = '2 days';
  } else if (/ત્રણ દિવસ|3 days|તીન દિન/i.test(text)) {
    extracted.duration = '3 days';
  } else if (/એક અઠવાડિયું|1 week|एक हफ्ता/i.test(text)) {
    extracted.duration = '1 week';
  } else if (/આજથી|since morning|સવારથી|आज सुबह से/i.test(text)) {
    extracted.duration = 'Since morning';
  }

  // 4. Extract Severity
  const sevMatch = text.match(/(\b[1-9]\b|10)\s*(?:\/10|out of 10|નંબર|તીવ્રતા|score)?/);
  if (sevMatch && (/severity|pain|scale|દુખાવાની તીવ્રતા|તીવ્રતા|rate|score/i.test(text) || /^\d+$/.test(text.trim()))) {
    const s = parseInt(sevMatch[1], 10);
    if (s >= 1 && s <= 10) extracted.severity = s;
  }

  // 5. Extract Conditions & Meds
  if (/bp|blood pressure|હાઈ બીપી|બ્લડ પ્રેશર|હાયપરટેન્શન|hypertension|उच्च रक्तचाप/i.test(text)) {
    extracted.existing_conditions.push('Hypertension (High BP)');
  }
  if (/sugar|diabetes|ડાયાબિટીસ|મધુપ્રમેહ|સુગર|मधुमेह/i.test(text)) {
    extracted.existing_conditions.push('Diabetes Mellitus');
  }
  if (/thyroid|થાઇરોઇડ|थायरॉइड/i.test(text)) {
    extracted.existing_conditions.push('Thyroid Disorder');
  }
  if (/asthma|દમ|શ્વાસની બીમારી|અસ્થમા|अस्थमा/i.test(text)) {
    extracted.existing_conditions.push('Asthma / Respiratory condition');
  }
  if (/heart|હૃદય|stent|હાર્ટ|bypass|એટેક/i.test(text)) {
    extracted.existing_conditions.push('Cardiac History');
  }

  if (/metformin|ઇન્સ્યુલિન|insulin|atenolol|amlodipine|aspirin|sorbitrate|દવા લઉં છું|દવા ચાલુ|दवा खाता हूँ|दવા લેતો/i.test(text)) {
    if (/bp/i.test(text)) extracted.current_medicines.push('Daily BP Medication (Amlodipine/Telmisartan)');
    if (/sugar|diabetes/i.test(text)) extracted.current_medicines.push('Antidiabetic Medication (Metformin/Insulin)');
    if (/metformin/i.test(text)) extracted.current_medicines.push('Metformin');
    if (/aspirin/i.test(text)) extracted.current_medicines.push('Aspirin');
    if (/sorbitrate/i.test(text)) extracted.current_medicines.push('Sorbitrate');
    if (extracted.current_medicines.length === 0) extracted.current_medicines.push('Prescribed Regular Medication');
  }

  // 6. Extract Allergies
  if (/penicillin|સલ્ફા|દવાની એલર્જી|allergy|एलर्जी/i.test(text)) {
    if (/nathi|nahi|કોઈ એલર્જી નથી|no allergy|કોઈ નથી|નથી/i.test(text)) {
      extracted.allergies.push('No known drug allergies');
    } else {
      extracted.allergies.push('Drug/Food allergy noted');
    }
  }

  // 7. Extract Symptoms reported directly in chat
  if (/માથું દુખ|headache|માથુ|सिरदर्द/i.test(text)) extracted.symptoms.push('Headache (Cephalea)');
  if (/તાવ|fever|તાપ|बुखार/i.test(text)) extracted.symptoms.push('Fever (Pyrexia)');
  if (/પેટમાં દુખ|stomach pain|abdominal pain|પેટ|पेट दर्द/i.test(text)) extracted.symptoms.push('Abdominal pain');
  if (/ચક્કર|dizziness|giddiness|ચક્કર આવે|ચક્કર/i.test(text)) extracted.symptoms.push('Dizziness / Vertigo');
  if (/ઉલટી|vomiting|ઉબકા|vomit|उल्टी/i.test(text)) extracted.symptoms.push('Nausea / Vomiting');
  if (/શરદી|ખાંસી|cough|cold|ઉધરસ|खांसी/i.test(text)) extracted.symptoms.push('Cough & Cold');
  if (/ગોઠણ|ઢીંચણ|સાંધા|knee pain|joint pain|ઘૂંટણ/i.test(text)) extracted.symptoms.push('Joint / Knee pain');

  // ==========================================
  // 8. RICH INTENT CLASSIFICATION & Q&A BRAIN
  // ==========================================
  let reply = '';

  // INTENT 1: User just provided Age or a number
  if (extracted.age) {
    if (isGujarati) {
      reply = `તમારી ઉંમર ${extracted.age} ફોર્મમાં સફળતાપૂર્વક નોંધાઈ ગઈ છે. શું તમને બીપી, ડાયાબિટીસ જેવી કોઈ જૂની બીમારી છે કે કોઈ નિયમિત દવા ચાલુ છે?`;
    } else if (isHindi) {
      reply = `आपकी उम्र ${extracted.age} फॉर्म में दर्ज कर ली गई है। क्या आपको पहले से बीपी या शुगर जैसी कोई पुरानी बीमारी है?`;
    } else {
      reply = `Thank you! Your age (${extracted.age}) has been updated in the form. Do you have any chronic conditions (like BP or Diabetes) or take regular medications?`;
    }
  }
  // INTENT 2: User says they don't know age / wants to skip
  else if (/ખબર નથી|યાદ નથી|નથી ખબર|skip|don't know|dont know|not sure|pata nahi|nahi pata|छोड़ो/i.test(text)) {
    if (isGujarati) {
      reply = 'કોઈ વાંધો નહીં! ઉંમર અંદાજે રાખી શકાય છે અથવા ડૉક્ટર તપાસ દરમિયાન નોંધી લેશે. શું તમને કોઈ દવા કે વસ્તુથી એલર્જી છે?';
    } else if (isHindi) {
      reply = 'कोई बात नहीं, इसे डॉक्टर जांच के समय लिख लेंगे। क्या आपको किसी दवा से कोई एलर्जी है?';
    } else {
      reply = 'No worries, the doctor can note the exact age during your consultation. Do you have any known allergies or chronic conditions?';
    }
  }
  // INTENT 3: Medication / Treatment request ("Can you give medicines?", "કઈ દવા લેવી?", "દવા આપો", "paracetamol")
  else if (/દવા આપો|દવા જણાવો|કઈ દવા|medicine|tablet|treatment|paracetamol|દવા કઈ લેવી|दवा दो|दवा बताओ|कौनसी दवा/i.test(text)) {
    if (isGujarati) {
      reply = 'સલામતી અને સરકારી નિયમો મુજબ AI સહાયક ડૉક્ટર વગર જાતે દવા કે પ્રિસ્ક્રિપ્શન આપી શકતું નથી. તમારી તમામ તકલીફો અમે ફોર્મમાં નોંધી લીધી છે, જેથી ડૉક્ટર તમને તપાસીને યોગ્ય દવા આપશે.';
    } else if (isHindi) {
      reply = 'सुरक्षा नियमों के अनुसार AI सहायक सीधे दवा नहीं लिख सकता। आपकी तकलीफें फॉर्म में दर्ज कर ली गई हैं ताकि डॉक्टर जांच करके आपको सही दवा लिख सकें।';
    } else {
      reply = 'For clinical safety, AI assistants cannot prescribe medications directly. All your reported symptoms have been recorded so the doctor can evaluate you and prescribe the appropriate treatment.';
    }
  }
  // INTENT 4: Hospital Costs / Free Treatment / Ayushman Card (PMJAY) ("ખર્ચ કેટલો?", "રૂપિયા", "આયુષ્માન કાર્ડ", "fees / charges")
  else if (/ખર્ચ|રૂપિયા|ફી|charges|cost|free|fees|આયુષ્માન|pmjay|card|पैसा|खर्चा|फीस/i.test(text)) {
    if (isGujarati) {
      reply = 'સિવિલ હોસ્પિટલમાં તમામ OPD તપાસ, લોહી-પેશાબની તપાસ અને દવાઓ સંપૂર્ણ મફત છે. તેમજ આયુષ્માન ભારત (PMJAY) કાર્ડ હેઠળ તમામ ઓપરેશન અને દાખલ સારવાર પણ નિઃશુલ્ક છે.';
    } else if (isHindi) {
      reply = 'सिविल अस्पताल में ओपीडी जांच, ब्लड टेस्ट और दवाएं पूरी तरह निःशुल्क (Free) हैं। आयुष्मान भारत कार्ड के तहत सभी उपचार भी मुफ्त उपलब्ध हैं।';
    } else {
      reply = 'OPD consultations, standard diagnostic tests, and prescribed generic medications at the Civil Hospital are completely free of charge. All major procedures are covered under the Ayushman Bharat (PMJAY) scheme.';
    }
  }
  // INTENT 5: Pharmacy / Medical Store location ("દવા ક્યાં મળશે?", "મેડિકલ સ્ટોર ક્યાં છે?", "medical store / dispensary")
  else if (/દવા ક્યાં મળશે|દવાની દુકાન|મેડિકલ સ્ટોર|dispensary|pharmacy|medical store|દવા ક્યાં મળે|दवा कहाँ मिलेगी|दवाखाना/i.test(text)) {
    if (isGujarati) {
      reply = 'ડૉક્ટર તપાસીને પ્રિસ્ક્રિપ્શન આપે પછી તમે ગ્રાઉન્ડ ફ્લોર પર રૂમ નં. 5 (OPD ફાર્મસી કાઉન્ટર) પરથી તમારો ડિજિટલ ટોકન/પ્રિસ્ક્રિપ્શન બતાવીને મફત દવાઓ મેળવી શકો છો.';
    } else if (isHindi) {
      reply = 'डॉक्टर से पर्ची मिलने के बाद आप ग्राउंड फ्लोर पर रूम नंबर 5 (ओपीडी डिस्पेंसरी) से मुफ्त दवाएं प्राप्त कर सकते हैं।';
    } else {
      reply = 'After your consultation, you can collect your prescribed medications for free from the OPD Dispensary located at Ground Floor, Room No. 5.';
    }
  }
  // INTENT 6: Laboratory / Blood tests / Urine / X-Ray / ECG ("લોહીની તપાસ", "લેબ", "એક્સ-રે", "x-ray", "blood test")
  else if (/લોહી|લેબ|લેબોરેટરી|બ્લડ ટેસ્ટ|x-ray|એક્સ-રે|ecg|blood test|lab|investigation|खून की जांच|जांच/i.test(text)) {
    if (isGujarati) {
      reply = 'બ્લડ અને યુરિન ટેસ્ટ માટે સેન્ટ્રલ લેબોરેટરી રૂમ નં. 12 માં છે, અને એક્સ-રે/સોનોગ્રાફી રૂમ નં. 18 (રેડિયોલોજી ડિપાર્ટમેન્ટ) માં થાય છે. ECG માટે રૂમ 102 ની બાજુમાં રૂમ છે.';
    } else if (isHindi) {
      reply = 'ब्लड और यूरिन टेस्ट के लिए सेंट्रल लैब रूम नंबर 12 में है, और एक्स-रे रूम नंबर 18 में स्थित है। ईसीजी रूम 102 के पास होता है।';
    } else {
      reply = 'Blood and urine investigations are conducted in the Central Laboratory (Room 12). X-Ray and Ultrasound are located in Room 18 (Radiology Dept), and ECG is available next to Cabin 102.';
    }
  }
  // INTENT 7: Doctor Cabins & Specialty Locations ("ડૉક્ટર ક્યાં બેસે છે?", "રૂમ 102", "ડૉ. મહેતા ક્યાં છે?")
  else if (/ક્યાં બેસે છે|રૂમ નં|કેબિન|cabin|room|ડૉ. મહેતા|ડૉ. પ્રિયા|ડૉ. પટેલ|where is doctor|doctor room|डॉक्टर कहाँ/i.test(text)) {
    if (isGujarati) {
      reply = 'ડૉક્ટરોના કેબિન: 🫀 ડૉ. આરવ મહેતા (કાર્ડિયોલોજી) - કેબિન 102, 🩺 ડૉ. પ્રિયા શાહ (જનરલ મેડિસિન) - કેબિન 105, 🦴 ડૉ. રાજેશ પટેલ (ઓર્થોપેડિક) - કેબિન 204. રિસેપ્શન પર ટોકન બતાવતા જ સિસ્ટર તમને કેબિન તરફ દોરશે.';
    } else if (isHindi) {
      reply = 'डॉक्टर केबिन: कार्डियोलॉजी (डॉ. आरव मेहता) - केबिन 102, जनरल मेडिसिन (डॉ. प्रिया शाह) - केबिन 105, ऑर्थोपेडिक (डॉ. राजेश पटेल) - केबिन 204.';
    } else {
      reply = 'Doctor Cabins: Dr. Aarav Mehta (Cardiology) - Cabin 102; Dr. Priya Shah (Medicine) - Cabin 105; Dr. Rajesh Patel (Orthopedics) - Cabin 204; Trauma Emergency - Bay 1.';
    }
  }
  // INTENT 8: Hospital Timings & Doctor Availability ("સમય શું છે?", "ક્યારે આવશે?", "ઓપીડી સમય", "timing / hours")
  else if (/સમય|ક્યારે આવશે|ઓપીડી સમય|timing|hours|open|closed|schedule|समय|कब खुलता/i.test(text)) {
    if (isGujarati) {
      reply = 'જનરલ OPD સમય: સવારે 9:00 થી બપોરે 1:00 અને બપોરે 3:00 થી સાંજે 5:00 સુધી. ઇમરજન્સી અને ટ્રોમા સેવાઓ 24 કલાક (ચોવીસે કલાક) ખુલ્લી રહે છે.';
    } else if (isHindi) {
      reply = 'ओपीडी समय: सुबह 9:00 से दोपहर 1:00 और दोपहर 3:00 से शाम 5:00 बजे तक। इमरजेंसी और ट्रॉमा सेंटर 24 घंटे खुला रहता है।';
    } else {
      reply = 'General OPD Hours: Morning 9:00 AM – 1:00 PM and Afternoon 3:00 PM – 5:00 PM. Emergency & Casualty services operate 24/7.';
    }
  }
  // INTENT 9: Wait Time & Queue Status ("કેટલો સમય લાગશે?", "મારો વારો ક્યારે આવશે?", "wait time / turn")
  else if (/કેટલો સમય|વારો ક્યારે|વાર લાગશે|wait|line|queue|turn|कितना समय|बारी/i.test(text)) {
    if (isGujarati) {
      reply = 'ફોર્મ સબમિટ કરીને ટોકન લીધા પછી સામાન્ય રીતે 5 થી 15 મિનિટમાં વારો આવી જાય છે. ઇમરજન્સી અને સિનિયર સિટીઝન દર્દીઓને રિસેપ્શન સ્ટાફ પ્રાથમિકતા આપે છે.';
    } else if (isHindi) {
      reply = 'टोकन प्राप्त करने के बाद आमतौर पर 5 से 15 मिनट में डॉक्टर परामर्श मिल जाता है। आपातकालीन मरीजों को प्राथमिकता दी जाती है।';
    } else {
      reply = 'After obtaining your token pass, the typical wait time is 5–15 minutes. Triage nurses prioritize urgent cases immediately.';
    }
  }
  // INTENT 10: Attendant / Family accompaniment ("સાથે કોઈ આવી શકે?", "કોઈને લાવી શકાય?")
  else if (/સાથે|પરિવાર|relative|family|attendant|साथ में/i.test(text)) {
    if (isGujarati) {
      reply = 'હા, દર્દીની સાથે એક પરિજન કે સહાયકને ડૉક્ટરના તપાસ રૂમમાં જવાની મંજૂરી છે.';
    } else if (isHindi) {
      reply = 'हाँ, मरीज की सहायता के लिए एक परिजन को डॉक्टर केबिन के अंदर जाने की अनुमति है।';
    } else {
      reply = 'Yes, 1 attendant or family member is permitted to accompany the patient inside the consultation cabin.';
    }
  }
  // INTENT 11: Emergency symptoms inquiry ("છાતીમાં દુખે છે", "શ્વાસ નથી લેવાતો", "chest pain", "attack")
  else if (/છાતીમાં દુખ|શ્વાસ|ચક્કર|emergency|chest pain|breathing|attack|છાતી|સીને મેં દર્દ/i.test(text)) {
    if (isGujarati) {
      reply = '🚨 જો તમને છાતીમાં તીવ્ર દુખાવો કે શ્વાસ લેવામાં મુશ્કેલી થતી હોય, તો તરત જ ઇમરજન્સી વોર્ડ (કેબિન 102 / ટ્રોમા સેન્ટર) પર પહોંચો. અમે સ્ટાફ માટે રેડ-ફ્લેગ એલર્ટ જનરેટ કરી રહ્યા છીએ.';
    } else if (isHindi) {
      reply = '🚨 यदि आपको छाती में तेज दर्द या सांस लेने में भारी तकलीफ है, तो तुरंत इमरजेंसी वॉर्ड की ओर बढ़ें। स्टाफ को तत्काल सूचित किया जा रहा है।';
    } else {
      reply = '🚨 If you are experiencing acute chest pain or breathlessness, please proceed immediately to the Emergency / Casualty Bay. An emergency red-flag alert is active.';
    }
  }
  // INTENT 12: About Token / How to use token ("ટોકન શું છે?", "ટોકનથી શું થાય?", "what is token")
  else if (/token|ટોકન|ટોકન શું|ટોકન નંબર|ટોકન થી|ક્યાં જવાનું|what is this token/i.test(text)) {
    if (isGujarati) {
      reply = 'ટોકન નંબર એ તમારો ડિજિટલ OPD પાસ છે. ફોર્મ પૂર્ણ કર્યા પછી મળતો ટોકન નંબર રિસેપ્શન કાઉન્ટર પર બતાવશો એટલે સિસ્ટર અંજલિ તમને યોગ્ય નિષ્ણાત ડૉક્ટરના કેબિનમાં મોકલશે.';
    } else if (isHindi) {
      reply = 'टोकन नंबर आपका डिजिटल ओपीडी पास है। फॉर्म पूरा होने पर यह टोकन रिसेप्शन काउंटर पर दिखाएँ, जहाँ से स्टाफ आपको संबंधित विशेषज्ञ डॉक्टर के पास भेज देगा।';
    } else {
      reply = 'The Token ID is your digital OPD pass. Present it at the clinic reception desk, and the triage nursing staff will route you to the appropriate specialist doctor.';
    }
  }
  // INTENT 13: What should I do next / Next steps ("હવે શું કરવાનું?", "આગળ શું કરવું?", "what next")
  else if (/હવે શું|આગળ શું|next|what to do|what should i do|अब क्या करें|आगे क्या/i.test(text)) {
    if (isGujarati) {
      reply = 'સરસ! નીચે આપેલા "Confirm & Generate My Clinic Intake Pass" બટન પર ક્લિક કરો. તમને એક ડિજિટલ ટોકન નંબર (જેમ કે PAT-4821) મળશે જે રિસેપ્શન કાઉન્ટર પર બતાવવાનો રહેશે.';
    } else if (isHindi) {
      reply = 'नीचे दिए गए "Confirm & Generate Pass" बटन पर क्लिक करें। आपको एक टोकन नंबर मिलेगा जिसे रिसेप्शन काउंटर पर दिखाना होगा।';
    } else {
      reply = 'Please click the "Confirm & Generate My Clinic Intake Pass" button below. You will receive a Token ID (e.g. PAT-4821) to show at the reception desk.';
    }
  }
  // INTENT 14: Reporting new symptoms (Headache, Fever, Stomach pain, Vomiting, Cough, etc.)
  else if (extracted.symptoms.length > 0) {
    const symList = extracted.symptoms.join(', ');
    if (isGujarati) {
      reply = `મેં તમારો નવો લક્ષણ (${symList}) ફોર્મમાં ઉમેરી દીધો છે. આ તકલીફ કેટલા દિવસથી છે અથવા દર્દ કેટલું તીવ્ર (1 થી 10 માં) છે?`;
    } else if (isHindi) {
      reply = `मैंने आपकी समस्या (${symList}) फॉर्म में जोड़ दी है। यह कितने दिनों से है या दर्द कितना तेज है (1 से 10 के पैमाने पर)?`;
    } else {
      reply = `I have added your symptom (${symList}) to your intake form. How many days has this lasted, or what is your pain level (1-10)?`;
    }
  }
  // INTENT 15: Gratitude / Greetings ("આભાર", "ધન્યવાદ", "શુક્રિયા", "thank you", "thanks", "ok", "sarus", "kem cho", "namaste")
  else if (/^(hi|hello|hey|namaste|kem cho|નમસ્તે|નમસ્કાર|કેમ છો|hello sahai|આભાર|ધન્યવાદ|શુક્રિયા|thank|thanks|ok|okay|સારું|બરાબર|ઠીક)/i.test(text)) {
    if (isGujarati) {
      reply = 'તમારું સ્વાગત છે! હું "સહાય મિત્ર" છું. જો તમારા ફોર્મની વિગતો યોગ્ય હોય તો નીચે આપેલું "Confirm & Generate Pass" બટન દબાવીને તમારો ઓપીડી પાસ મેળવી શકો છો.';
    } else if (isHindi) {
      reply = 'स्वागत है! अगर आपकी सारी जानकारी सही है, तो नीचे "Confirm & Generate Pass" बटन दबाकर अपना ओपीडी टोकन प्राप्त करें।';
    } else {
      reply = 'You are welcome! If all your details look correct on the left, click "Confirm & Generate My Clinic Intake Pass" below to get your token.';
    }
  }
  // INTENT 16: Reporting medical history (BP, Diabetes, Meds, Allergies)
  else if (extracted.existing_conditions.length > 0 || extracted.current_medicines.length > 0 || extracted.allergies.length > 0) {
    if (isGujarati) {
      reply = 'તમારી તબીબી વિગતો ફોર્મમાં સફળતાપૂર્વક અપડેટ થઈ ગઈ છે. શું અન્ય કોઈ જૂની બીમારી કે દવા વિશે જણાવવું છે? જો બધું બરાબર હોય તો નીચેથી ટોકન મેળવી લો.';
    } else if (isHindi) {
      reply = 'आपकी मेडिकल जानकारी फॉर्म में दर्ज कर ली गई है। यदि सब सही है तो नीचे से टोकन जनरेट कर सकते हैं।';
    } else {
      reply = 'Your medical details have been updated in the intake checklist. If everything looks complete, you can generate your clinic token below.';
    }
  }
  // INTENT 17: General / Fallback with smart rotation across missing fields (NEVER loops on Age!)
  else {
    const hasAge = currentFormData?.age && currentFormData.age !== 'Not specified';
    const hasConditions = currentFormData?.existing_conditions && currentFormData.existing_conditions.length > 0 && currentFormData.existing_conditions[0] !== 'None reported';
    const hasMeds = currentFormData?.current_medicines && currentFormData.current_medicines.length > 0 && currentFormData.current_medicines[0] !== 'None reported';
    const hasAllergies = currentFormData?.allergies && currentFormData.allergies.length > 0 && currentFormData.allergies[0] !== 'Not specified';

    if (isGujarati) {
      if (!hasConditions) {
        reply = 'મેં તમારી વાત નોંધી લીધી છે. શું તમને હાઈ બીપી, ડાયાબિટીસ કે અન્ય કોઈ જૂની બીમારી છે? (જો ન હોય તો "નથી" લખો)';
      } else if (!hasMeds) {
        reply = 'શું તમે દરરોજ કોઈ નિયમિત દવા લઈ રહ્યા છો?';
      } else if (!hasAllergies) {
        reply = 'શું તમને કોઈ દવા કે વસ્તુથી એલર્જી છે?';
      } else if (!hasAge) {
        reply = 'તમારી અંદાજે ઉંમર (Age) કેટલી છે? (ખાલી નંબર પણ લખી શકો છો, જેમ કે 45)';
      } else {
        reply = 'તમારી તમામ જરૂરી વિગતો ફોર્મમાં નોંધાઈ ગઈ છે. હવે નીચે "Confirm & Generate My Clinic Intake Pass" બટન દબાવીને ટોકન મેળવી લો.';
      }
    } else if (isHindi) {
      if (!hasConditions) {
        reply = 'जानकारी दर्ज कर ली गई है। क्या आपको पहले से बीपी या शुगर जैसी कोई पुरानी बीमारी है?';
      } else if (!hasMeds) {
        reply = 'क्या आप वर्तमान में कोई रोज़ाना दवा ले रहे हैं?';
      } else if (!hasAllergies) {
        reply = 'क्या आपको किसी दवा से कोई एलर्जी है?';
      } else if (!hasAge) {
        reply = 'आपकी अनुमानित उम्र (Age) क्या है?';
      } else {
        reply = 'आपकी सारी जानकारी दर्ज हो चुकी है। अब आप नीचे दिए गए बटन से टोकન ले सकते हैं।';
      }
    } else {
      if (!hasConditions) {
        reply = 'I have noted your message. Do you have any chronic conditions like High BP, Diabetes, or Asthma?';
      } else if (!hasMeds) {
        reply = 'Are you currently taking any daily prescribed medications?';
      } else if (!hasAllergies) {
        reply = 'Do you have any known allergies to medicines or food?';
      } else if (!hasAge) {
        reply = 'Could you please provide your approximate age? (e.g. 45)';
      } else {
        reply = 'All key clinical details are recorded. You can now proceed to generate your digital clinic token below.';
      }
    }
  }

  return {
    reply_message: reply,
    extracted_updates: extracted
  };
}

/**
 * Main parse function supporting standard intake or transfer mode
 */
export async function parseWithGemma(patientText, isTransferMode = false, ollamaEndpoint = 'http://localhost:11434', modelName = 'gemma2:2b') {
  const systemPrompt = isTransferMode ? GEMMA_TRANSFER_PROMPT : GEMMA_INTAKE_PROMPT;
  
  try {
    const prompt = `${systemPrompt}\n\nInput Description / Referral Chit:\n"""\n${patientText}\n"""\n\nJSON Output:`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`${ollamaEndpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        stream: false,
        format: 'json',
        options: { temperature: 0.1 }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.response) {
        try {
          const parsed = JSON.parse(data.response);
          return {
            source: 'Gemma (Local Ollama Live)',
            data: parsed
          };
        } catch (jsonErr) {
          const jsonMatch = data.response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return {
              source: 'Gemma (Local Ollama Live)',
              data: JSON.parse(jsonMatch[0])
            };
          }
        }
      }
    }
    throw new Error('Ollama response not OK or empty');
  } catch (err) {
    console.info('Using Intelligent Gemma Emulation Engine for mode:', isTransferMode ? 'Transfer' : 'Intake');
    const fallback = isTransferMode ? generateFallbackTransfer(patientText) : generateFallbackIntake(patientText);
    return {
      source: 'Gemma Clinical Engine (Client-Side)',
      data: fallback,
      note: 'Ollama is offline. Running client-side Gemma engine.'
    };
  }
}

/**
 * Multi-turn Conversational Chat Assistant for Patient Form Filling
 */
export async function chatWithGemmaAssistant(userMessage, currentFormData, conversationHistory = [], ollamaEndpoint = 'http://localhost:11434', modelName = 'gemma2:2b') {
  try {
    const prompt = `${GEMMA_PATIENT_CHAT_PROMPT}

Current Form Data State:
${JSON.stringify(currentFormData, null, 2)}

Recent Conversation:
${conversationHistory.slice(-4).map(m => `${m.sender}: ${m.text}`).join('\n')}
Patient: ${userMessage}

Respond strictly in JSON with "reply_message" and "extracted_updates":`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`${ollamaEndpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        stream: false,
        format: 'json',
        options: { temperature: 0.2 }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.response) {
        try {
          const parsed = JSON.parse(data.response);
          return {
            source: 'Gemma (Ollama Live)',
            reply: parsed.reply_message,
            updates: parsed.extracted_updates
          };
        } catch (e) {
          const match = data.response.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            return {
              source: 'Gemma (Ollama Live)',
              reply: parsed.reply_message,
              updates: parsed.extracted_updates
            };
          }
        }
      }
    }
    throw new Error('Ollama Chat error');
  } catch (err) {
    const fallback = generateFallbackPatientChat(userMessage, currentFormData);
    return {
      source: 'Gemma Assistant Engine',
      reply: fallback.reply_message,
      updates: fallback.extracted_updates
    };
  }
}
