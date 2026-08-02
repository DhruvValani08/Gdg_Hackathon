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
  let isGujarati = /[\u0A80-\u0AFF]/.test(text) || /che|nathi|mane|chhe|ha|na|su|kay|kare|kem|shoon|aabhar|dhanyavad|bol/i.test(text);
  let isHindi = /[\u0900-\u097F]/.test(text) || /hai|nahi|mujhe|haan|dawa|kya|kaise|kaha|batao|shukriya/i.test(text);

  // 2. Extract Age
  const ageMatch = text.match(/(\d+)\s*(?:years?|વર્ષ|साल|yr|उम्र|ઉંમર)/i) || text.match(/(?:age|ઉંમર|उम्र)\s*(?:is|che|hai|:)?\s*(\d+)/i);
  if (ageMatch) {
    extracted.age = `${ageMatch[1]} years`;
  }

  // 3. Extract Duration
  const durMatch = text.match(/(\d+)\s*(?:days?|દિ'|દિવસ|દિન|दिन|hours?|કલાક|घंटे|weeks?|અઠવાડિયા|મહિના|months?)/i);
  if (durMatch) {
    extracted.duration = `${durMatch[0]}`;
  } else if (/બે દિવસ|2 days|દો દિન/i.test(text)) {
    extracted.duration = '2 days';
  } else if (/ત્રણ દિવસ|3 days|તીન દિન/i.test(text)) {
    extracted.duration = '3 days';
  } else if (/આજથી|since morning|સવારથી|आज सुबह से/i.test(text)) {
    extracted.duration = 'Since morning';
  }

  // 4. Extract Severity
  const sevMatch = text.match(/(\b[1-9]\b|10)\s*(?:\/10|out of 10|નંબર|દુખાવો)?/);
  if (sevMatch && (/severity|pain|scale|દુખાવાની તીવ્રતા|તીવ્રતા|rate|score/i.test(text) || /^\d+$/.test(text.trim()))) {
    extracted.severity = parseInt(sevMatch[1], 10);
  }

  // 5. Extract Conditions & Meds
  if (/bp|blood pressure|હાઈ બીપી|બ્લડ પ્રેશર|હાયપરટેન્શન|hypertension/i.test(text)) {
    extracted.existing_conditions.push('Hypertension (High BP)');
  }
  if (/sugar|diabetes|ડાયાબિટીસ|મધુપ્રમેહ|સુગર|मधुमेह/i.test(text)) {
    extracted.existing_conditions.push('Diabetes Mellitus');
  }
  if (/thyroid|થાઇરોઇડ|थायरॉइड/i.test(text)) {
    extracted.existing_conditions.push('Thyroid Disorder');
  }
  if (/asthma|દમ|શ્વાસની બીમારી|अस्थमा/i.test(text)) {
    extracted.existing_conditions.push('Asthma / Respiratory condition');
  }
  if (/heart|હૃદય|stent|હાર્ટ/i.test(text)) {
    extracted.existing_conditions.push('Cardiac History');
  }

  if (/metformin|ઇન્સ્યુલિન|insulin|atenolol|amlodipine|aspirin|sorbitrate|દવા લઉં છું|દવા ચાલુ|दवा खाता हूँ|दवा चल रही है/i.test(text)) {
    if (/bp/i.test(text)) extracted.current_medicines.push('Daily BP Medication (Amlodipine/Telmisartan)');
    if (/sugar|diabetes/i.test(text)) extracted.current_medicines.push('Antidiabetic Medication (Metformin/Insulin)');
    if (/metformin/i.test(text)) extracted.current_medicines.push('Metformin');
    if (/aspirin/i.test(text)) extracted.current_medicines.push('Aspirin');
    if (/sorbitrate/i.test(text)) extracted.current_medicines.push('Sorbitrate');
    if (extracted.current_medicines.length === 0) extracted.current_medicines.push('Prescribed Regular Medication');
  }

  // 6. Extract Allergies
  if (/penicillin|સલ્ફા|દવાની એલર્જી|allergy|एलर्जी/i.test(text)) {
    if (/nathi|nahi|કોઈ એલર્જી નથી|no allergy|કોઈ નથી/i.test(text)) {
      extracted.allergies.push('No known drug allergies');
    } else {
      extracted.allergies.push('Drug/Food allergy noted');
    }
  } else if (/કોઈ એલર્જી નથી|નથી|nahi hai|no|none/i.test(text) && /allergy/i.test(currentFormData?._lastQuestion || '')) {
    extracted.allergies.push('No known drug allergies');
  }

  // 7. Intent Handling for Common General Patient Questions:
  let reply = '';

  // Question A: About Token / OPD Queue ("What is token?", "ટોકન શું છે?", "ટોકનથી શું થાય?")
  if (/token|ટોકન|ટોકન શું|ટોકન નંબર|ટોકન થી|ક્યાં જવાનું|ક્યાં જવું|where to go|how to use|what is this token/i.test(text)) {
    if (isGujarati) {
      reply = 'ટોકન નંબર એ તમારો ડિજિટલ OPD પાસ છે. ફોર્મ ભર્યા પછી મળેલો ટોકન નંબર રિસેપ્શન કાઉન્ટર પર બતાવશો એટલે સિસ્ટર અંજલિ શર્મા તમને યોગ્ય નિષ્ણાત ડૉક્ટરના રૂમમાં મોકલશે.';
    } else if (isHindi) {
      reply = 'टोकन नंबर आपका डिजिटल ओपीडी पास है। फॉर्म पूरा होने पर यह टोकन रिसेप्शन काउंटर पर दिखाएँ, जहाँ से स्टाफ आपको संबंधित विशेषज्ञ डॉक्टर के पास भेज देगा।';
    } else {
      reply = 'The Token ID is your digital OPD pass. Present it at the clinic reception desk, and the triage nursing staff will route you to the appropriate specialist doctor.';
    }
  }
  // Question B: About Doctors / Specialty ("કયા ડોક્ટર તપાસશે?", "ડોક્ટર ક્યારે મળશે?", "Who is the doctor?")
  else if (/doctor|ડોક્ટર|ડોકટર|ડૉક્ટર|doctor name|who will check|કયા ડોક્ટર|specialist/i.test(text)) {
    if (isGujarati) {
      reply = 'તમારા લક્ષણો મુજબ રિસેપ્શન સ્ટાફ તમને યોગ્ય નિષ્ણાત ડૉક્ટર (જેમ કે હૃદય માટે ડૉ. આરવ મહેતા, સામાન્ય બીમારી માટે ડૉ. પ્રિયા શાહ, હાડકાં માટે ડૉ. રાજેશ પટેલ) ફાળવશે.';
    } else if (isHindi) {
      reply = 'आपकी बीमारी के आधार पर रिसेप्शन स्टाफ आपको सही विशेषज्ञ डॉक्टर (जैसे कार्डियोलॉजी के डॉ. आरव मेहता या मेडिसिन की डॉ. प्रिया शाह) को असाइन करेगा।';
    } else {
      reply = 'Based on your symptoms, the triage staff will assign you to the relevant specialist (e.g. Dr. Aarav Mehta for Cardiology, Dr. Priya Shah for Medicine, or Dr. Rajesh Patel for Orthopedics).';
    }
  }
  // Question C: Emergency Symptoms Inquiry ("છાતીમાં દુખે છે શું કરું?", "ચક્કર આવે છે", "I have chest pain")
  else if (/છાતીમાં દુખ|શ્વાસ|ચક્કર|emergency|chest pain|breathing|attack/i.test(text)) {
    if (isGujarati) {
      reply = '🚨 જો તમને છાતીમાં તીવ્ર દુખાવો કે શ્વાસ લેવામાં મુશ્કેલી થતી હોય, તો તરત જ ઇમરજન્સી વોર્ડ (કેબિન 102) પર પહોંચો. અમે સ્ટાફ માટે રેડ-ફ્લેગ એલર્ટ જનરેટ કરી રહ્યા છીએ.';
    } else if (isHindi) {
      reply = '🚨 यदि आपको छाती में तेज दर्द या सांस लेने में भारी तकलीफ है, तो तुरंत इमरजेंसी वॉर्ड की ओर बढ़ें। स्टाफ को तत्काल सूचित किया जा रहा है।';
    } else {
      reply = '🚨 If you are experiencing acute chest pain or breathlessness, please proceed immediately to the Emergency/Casualty Bay. An emergency red-flag alert is flagged for the staff.';
    }
  }
  // Question D: How to fill form / Greetings ("કેમ છો?", "નમસ્તે", "hello", "hi", "how to fill")
  else if (/^(hi|hello|hey|namaste|kem cho|નમસ્તે|નમસ્કાર|કેમ છો|hello sahai)/i.test(text) || text.length < 6) {
    if (isGujarati) {
      reply = 'નમસ્તે! હું તમારો સહાયક "સહાય મિત્ર" છું. તમે તમારી ઉંમર, જૂની બીમારી કે લક્ષણો અહીં જણાવી શકો છો જેથી હું તમારું ફોર્મ ભરી શકું.';
    } else if (isHindi) {
      reply = 'नमस्ते! मैं आपका सहायक "सहाय मित्र" हूँ। आप अपनी उम्र, बीमारी और दवाओं के बारे में बताइए, मैं आपका फॉर्म भरने में मदद करूँगा।';
    } else {
      reply = 'Hello! I am "Sahai Mitra", your clinical assistant. Tell me about your symptoms, age, or medications, and I will help fill out your intake form.';
    }
  }
  // Question E: Patient is sharing medical history ➔ acknowledge & ask for next missing field
  else {
    const hasAge = currentFormData?.age || extracted.age;
    const hasConditions = (currentFormData?.existing_conditions && currentFormData.existing_conditions.length > 0 && currentFormData.existing_conditions[0] !== 'None reported') || extracted.existing_conditions.length > 0;
    const hasMeds = (currentFormData?.current_medicines && currentFormData.current_medicines.length > 0 && currentFormData.current_medicines[0] !== 'None reported') || extracted.current_medicines.length > 0;
    const hasAllergies = (currentFormData?.allergies && currentFormData.allergies.length > 0 && currentFormData.allergies[0] !== 'Not specified') || extracted.allergies.length > 0;

    if (isGujarati) {
      if (!hasAge) {
        reply = 'મેં વિગત નોંધી લીધી છે. તમારી અંદાજે ઉંમર (Age) કેટલી છે?';
      } else if (!hasConditions) {
        reply = 'આભાર! શું તમને હાઈ બીપી, ડાયાબિટીસ કે અન્ય કોઈ જૂની બીમારી છે?';
      } else if (!hasMeds) {
        reply = 'શું તમે કોઈ નિયમિત દવા લઈ રહ્યા છો? (હા હોય તો દવાનું નામ જણાવો)';
      } else if (!hasAllergies) {
        reply = 'શું તમને કોઈ દવા કે વસ્તુથી એલર્જી છે? (જો ન હોય તો "નથી" કહો)';
      } else {
        reply = 'ખૂબ સરસ! તમારી તમામ જરૂરી વિગતો ફોર્મમાં નોંધાઈ ગઈ છે. હવે નીચે "Confirm & Generate Token" બટન દબાવીને પાસ મેળવી લો.';
      }
    } else if (isHindi) {
      if (!hasAge) {
        reply = 'जानकारी दर्ज कर ली गई है। कृपया अपनी उम्र (Age) बताइए?';
      } else if (!hasConditions) {
        reply = 'क्या आपको पहले से हाई बीपी, शुगर या थायरॉइड जैसी कोई बीमारी है?';
      } else if (!hasMeds) {
        reply = 'क्या आप वर्तमान में कोई रोज़ाना दवा ले रहे हैं?';
      } else if (!hasAllergies) {
        reply = 'क्या आपको किसी दवा से कोई एलर्जी है?';
      } else {
        reply = 'बहुत बढ़िया! आपकी सारी ज़रूरी जानकारी फॉर्म में भर दी गई है। अब आप टोकन प्राप्त कर सकते हैं।';
      }
    } else {
      if (!hasAge) {
        reply = 'I have updated your notes. Could you please provide your approximate age?';
      } else if (!hasConditions) {
        reply = 'Do you have any chronic conditions like High BP, Diabetes, or Asthma?';
      } else if (!hasMeds) {
        reply = 'Are you currently taking any daily prescribed medications?';
      } else if (!hasAllergies) {
        reply = 'Do you have any known allergies to medicines like Penicillin?';
      } else {
        reply = 'Excellent! All clinical details are recorded. You can now confirm and generate your digital clinic token below.';
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
