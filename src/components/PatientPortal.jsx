import React, { useState, useEffect, useRef } from 'react';
import { chatWithGemmaAssistant } from '../services/llm';

const PATIENT_SAMPLES = [
  {
    lang: 'ગુજરાતી (Gujarati)',
    text: 'મને બે દિવસથી છાતીમાં દુખે છે અને આજે શ્વાસ લેવામાં તકલીફ થાય છે. BP ની દવા ચાલુ છે.',
    label: 'છાતીમાં દુખાવો + શ્વાસની તકલીફ (Chest Pain + Breathing Issue)'
  },
  {
    lang: 'हिन्दी (Hindi)',
    text: 'मुझे 3 दिन से तेज बुखार और सिरदर्द है। उम्र 45 साल है, शुगर की दवा ले रहा हूँ।',
    label: 'बुखार + सिरदर्द + शुगर (High Fever + Sugar history)'
  },
  {
    lang: 'English / Mixed',
    text: 'My age is 52. Severe knee joint pain and swelling for 1 week. Taking Metformin for diabetes.',
    label: 'Knee Pain + Metformin (Joint swelling)'
  }
];

const QUICK_CHAT_QUESTIONS = [
  { label: '💊 દવા કઈ લેવી? (Medicines)', query: 'દવા કઈ લેવી?' },
  { label: '🏥 ઓપીડી સમય શું છે? (Timings)', query: 'ઓપીડી સમય શું છે?' },
  { label: '📍 ડૉક્ટર ક્યાં બેસે છે? (Doctor Cabins)', query: 'ડૉક્ટર ક્યાં બેસે છે?' },
  { label: '💳 ખર્ચ / આયુષ્માન કાર્ડ (Free / PMJAY)', query: 'સારવાર મફત છે? આયુષ્માન કાર્ડ ચાલશે?' },
  { label: '🧪 લેબ / એક્સ-રે ક્યાં છે? (Lab/X-Ray)', query: 'લેબોરેટરી અને એક્સ-રે ક્યાં છે?' },
  { label: '🎟️ ટોકન શું છે? (Token Guide)', query: 'ટોકન શું છે અને આગળ શું કરવાનું?' }
];

export default function PatientPortal({ onSaveIntake, isLoading, patientIntakes = [] }) {
  const [patientTab, setPatientTab] = useState('new_intake'); // 'new_intake' | 'view_prescription'
  const [step, setStep] = useState('initial'); // 'initial' | 'assisted_form' | 'token_view'
  const [initialText, setInitialText] = useState('');
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isChatRecording, setIsChatRecording] = useState(false);

  // Search Prescription
  const [searchTokenId, setSearchTokenId] = useState('');
  const [searchedPatientRecord, setSearchedPatientRecord] = useState(null);

  // Detailed Structured Form Fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'Not specified',
    chief_complaint: '',
    duration: '',
    symptoms: '',
    severity: 5,
    existing_conditions: '',
    current_medicines: '',
    allergies: ''
  });

  const [recentlyUpdatedField, setRecentlyUpdatedField] = useState(null);

  // Chat Assistant State
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef(null);

  // Digital Token
  const [generatedToken, setGeneratedToken] = useState(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleVoiceToggle = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not available in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'gu-IN';

    if (!isRecording) {
      setIsRecording(true);
      recognition.start();
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInitialText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
    } else {
      setIsRecording(false);
      recognition.stop();
    }
  };

  const handleChatVoiceToggle = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not available in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'gu-IN';

    if (!isChatRecording) {
      setIsChatRecording(true);
      recognition.start();
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setChatInput(transcript);
        setIsChatRecording(false);
      };
      recognition.onerror = () => setIsChatRecording(false);
      recognition.onend = () => setIsChatRecording(false);
    } else {
      setIsChatRecording(false);
      recognition.stop();
    }
  };

  // Step 1 -> Step 2: Transition from initial voice/text to Assisted Form
  const handleProceedToAssistedForm = (e) => {
    e.preventDefault();
    if (!initialText.trim()) return;

    // Pre-populate initial extraction from text
    let age = '';
    const ageMatch = initialText.match(/(\d+)\s*(?:years?|વર્ષ|साल|yr|yrs|વરસ)/i)
      || initialText.match(/(?:age|ઉંમર|उम्र)\s*(?:is|che|hai|:)?\s*(\d+)/i);
    if (ageMatch) age = `${ageMatch[1] || ageMatch[0]} years`;

    let dur = '';
    const durMatch = initialText.match(/(\d+)\s*(?:days?|દિ'|દિવસ|દિન|दिन|hours?|કલાક|घंटे|weeks?|અઠવાડિયા)/i);
    if (durMatch) dur = `${durMatch[0]}`;

    let cond = '';
    if (/bp|hypertension|બ્લડ પ્રેશર|હાઈ બીપી/i.test(initialText)) cond = 'Hypertension (High BP)';
    if (/sugar|diabetes|ડાયાબિટીસ/i.test(initialText)) cond = cond ? `${cond}, Diabetes` : 'Diabetes Mellitus';

    let meds = '';
    if (/bp ની દવા|bp medicine|દવા ચાલુ/i.test(initialText)) meds = 'BP Medication';
    if (/metformin|sugar ki dawa/i.test(initialText)) meds = meds ? `${meds}, Sugar Medicine` : 'Diabetes Medicine';

    const newForm = {
      name: patientName.trim() || 'Patient',
      phone: phone.trim() || '',
      age: age || '',
      gender: 'Not specified',
      chief_complaint: initialText.slice(0, 80),
      duration: dur || '',
      symptoms: initialText,
      severity: 5,
      existing_conditions: cond,
      current_medicines: meds,
      allergies: ''
    };

    setFormData(newForm);

    // Initial warm assistant greeting tailored to missing fields
    const isGujarati = /[\u0A80-\u0AFF]/.test(initialText) || /che|nathi|mane/i.test(initialText);
    const isHindi = /[\u0900-\u097F]/.test(initialText) || /hai|nahi|mujhe/i.test(initialText);

    let initialGreeting = '';
    if (isGujarati) {
      initialGreeting = `નમસ્તે ${patientName ? patientName : ''}! હું તમારો સહાયક "સહાય મિત્ર" છું. મેં તમારી તકલીફ નોંધી લીધી છે.`;
      if (!age) {
        initialGreeting += ' તમારી અંદાજે ઉંમર (Age) કેટલી છે? (જેમ કે 45)';
      } else if (!cond) {
        initialGreeting += ' શું તમને કોઈ જૂની બીમારી (BP કે ડાયાબિટીસ) છે?';
      } else if (!meds) {
        initialGreeting += ' શું તમે દરરોજ કોઈ નિયમિત દવા લઈ રહ્યા છો?';
      } else {
        initialGreeting += ' તમારું ફોર્મ લગભગ તૈયાર છે. તમે કોઈ પ્રશ્ન પૂછી શકો છો અથવા નીચેથી ટોકન મેળવી શકો છો.';
      }
    } else if (isHindi) {
      initialGreeting = `नमस्ते ${patientName ? patientName : ''}! मैं आपका सहायक "सहाय मित्र" हूँ। मैंने आपकी समस्या दर्ज कर ली है।`;
      if (!age) {
        initialGreeting += ' कृपया अपनी उम्र (Age) बताइए?';
      } else if (!cond) {
        initialGreeting += ' क्या आपको पहले से बीपी या शुगर जैसी कोई बीमारी है?';
      } else if (!meds) {
        initialGreeting += ' क्या आप कोई नियमित दवा ले रहे हैं?';
      } else {
        initialGreeting += ' आपका फॉर्म तैयार है। आप सवाल पूछ सकते हैं या नीचे से टोकन ले सकते हैं।';
      }
    } else {
      initialGreeting = `Hello ${patientName ? patientName : ''}! I am "Sahai Mitra", your clinical intake assistant. I have recorded your symptoms.`;
      if (!age) {
        initialGreeting += ' What is your approximate age? (e.g. 45)';
      } else if (!cond) {
        initialGreeting += ' Do you have any chronic conditions (like BP or Diabetes)?';
      } else if (!meds) {
        initialGreeting += ' Are you currently taking any regular medications?';
      } else {
        initialGreeting += ' You can ask any OPD question or proceed to generate your token below.';
      }
    }

    setChatMessages([
      {
        id: 1,
        sender: 'assistant',
        text: initialGreeting
      }
    ]);

    setStep('assisted_form');
  };

  // Chat message submit handler
  const handleSendChatMessage = async (e, directText = null) => {
    e?.preventDefault();
    const rawMsg = directText !== null ? directText : chatInput;
    if (!rawMsg || !rawMsg.trim() || isChatLoading) return;

    const userMsg = rawMsg.trim();
    setChatInput('');

    // Add user message to chat
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'patient', text: userMsg }
    ]);

    setIsChatLoading(true);

    try {
      // Call Gemma Conversational Assistant
      const response = await chatWithGemmaAssistant(userMsg, formData, chatMessages);

      // Apply any extracted updates to the detailed form
      if (response.updates) {
        setFormData((prev) => {
          const updated = { ...prev };
          if (response.updates.age) {
            updated.age = response.updates.age;
            setRecentlyUpdatedField('age');
          }
          if (response.updates.duration && (!prev.duration || prev.duration === 'Not specified')) {
            updated.duration = response.updates.duration;
            setRecentlyUpdatedField('duration');
          }
          if (response.updates.severity) {
            updated.severity = response.updates.severity;
            setRecentlyUpdatedField('severity');
          }
          if (response.updates.symptoms && response.updates.symptoms.length > 0) {
            const addedSym = response.updates.symptoms.join(', ');
            updated.symptoms = prev.symptoms ? `${prev.symptoms}, ${addedSym}` : addedSym;
            setRecentlyUpdatedField('symptoms');
          }
          if (response.updates.existing_conditions && response.updates.existing_conditions.length > 0) {
            const added = response.updates.existing_conditions.join(', ');
            updated.existing_conditions = prev.existing_conditions && prev.existing_conditions !== 'None reported'
              ? `${prev.existing_conditions}, ${added}` 
              : added;
            setRecentlyUpdatedField('existing_conditions');
          }
          if (response.updates.current_medicines && response.updates.current_medicines.length > 0) {
            const added = response.updates.current_medicines.join(', ');
            updated.current_medicines = prev.current_medicines && prev.current_medicines !== 'None reported'
              ? `${prev.current_medicines}, ${added}` 
              : added;
            setRecentlyUpdatedField('current_medicines');
          }
          if (response.updates.allergies && response.updates.allergies.length > 0) {
            const added = response.updates.allergies.join(', ');
            updated.allergies = prev.allergies && prev.allergies !== 'Not specified'
              ? `${prev.allergies}, ${added}` 
              : added;
            setRecentlyUpdatedField('allergies');
          }
          return updated;
        });

        // Clear glow after 3 seconds
        setTimeout(() => setRecentlyUpdatedField(null), 3000);
      }

      // Add assistant response
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: response.reply
        }
      ]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleFinalTokenGenerate = () => {
    const token = {
      id: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
      patient_name: formData.name || 'Walk-in Patient',
      phone: formData.phone || 'Not provided',
      age: formData.age || 'Not specified',
      gender: formData.gender,
      type: 'Patient Self-Intake Kiosk',
      origin: 'Patient Mobile App / Kiosk',
      chief_complaint: formData.chief_complaint,
      duration: formData.duration || 'Not specified',
      symptoms: formData.symptoms,
      severity: formData.severity,
      existing_conditions: formData.existing_conditions ? [formData.existing_conditions] : ['None reported'],
      current_medicines: formData.current_medicines ? [formData.current_medicines] : ['None reported'],
      allergies: formData.allergies ? [formData.allergies] : ['No known allergies'],
      doctor_summary: `Patient ${formData.name || 'Walk-in'} reports ${formData.chief_complaint} lasting ${formData.duration}. Severity: ${formData.severity}/10.`,
      emergency_indicators: [],
      status: 'PENDING_STAFF_REVIEW',
      assignedDoctorId: null,
      assignedDoctorName: null,
      priority: 'ROUTINE',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      prescription: null
    };

    setGeneratedToken(token);
    setStep('token_view');

    if (onSaveIntake) {
      onSaveIntake(token);
    }
  };

  const handleSearchPrescription = (e) => {
    e.preventDefault();
    if (!searchTokenId.trim()) return;

    const found = patientIntakes.find(
      (p) => p.id.toLowerCase() === searchTokenId.trim().toLowerCase()
    );

    setSearchedPatientRecord(found || 'NOT_FOUND');
  };

  return (
    <div className="portal-container patient-portal">
      <div className="portal-header">
        <div className="portal-title-group">
          <span className="portal-tag">🧑‍🤝‍🧑 Patient Self-Intake & Prescription Portal</span>
          <h2>
            {patientTab === 'new_intake'
              ? step === 'initial'
                ? 'Tell Us How You Feel (તમારી તકલીફ જણાવો)'
                : step === 'assisted_form'
                ? 'Detailed Assisted Intake Form (વિગતવાર ફોર્મ)'
                : 'Your Digital Clinic Intake Pass (તમારો ડિજિટલ ટોકન)'
              : 'View Doctor Prescription & OPD Summary'}
          </h2>
          <p className="portal-subtitle">
            {patientTab === 'new_intake'
              ? 'Voice-first intake guided by our Gemma Assistant, automatically routed to the doctor by clinic staff.'
              : 'Enter your Token ID to download your doctor-signed digital prescription and clinical advice.'}
          </p>
        </div>

        <div className="reception-submode-toggle">
          <button
            type="button"
            className={`submode-btn ${patientTab === 'new_intake' ? 'active' : ''}`}
            onClick={() => setPatientTab('new_intake')}
          >
            📝 New Patient Intake
          </button>
          <button
            type="button"
            className={`submode-btn ${patientTab === 'view_prescription' ? 'active' : ''}`}
            onClick={() => setPatientTab('view_prescription')}
          >
            💊 Check My Prescription (પ્રિસ્ક્રિપ્શન જુઓ)
          </button>
        </div>
      </div>

      {patientTab === 'view_prescription' ? (
        <div className="glass-panel prescription-search-view">
          <form onSubmit={handleSearchPrescription} className="token-search-form">
            <div className="token-search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Enter your Token ID (e.g. PAT-4821, PAT-3190)..."
                value={searchTokenId}
                onChange={(e) => setSearchTokenId(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-search-token">
              Search Prescription
            </button>
          </form>

          {searchedPatientRecord === 'NOT_FOUND' && (
            <div className="alert" style={{ marginTop: '1.5rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5' }}>
              <span>No record found with Token ID "{searchTokenId}". Please check the token code.</span>
            </div>
          )}

          {searchedPatientRecord && searchedPatientRecord !== 'NOT_FOUND' && (
            <div className="patient-prescription-display" style={{ marginTop: '1.5rem' }}>
              <div className="token-top">
                <span className="token-badge">
                  {searchedPatientRecord.prescription ? '✓ Doctor Prescription Issued' : '🟡 In Consultation / Waiting for Doctor'}
                </span>
                <span className="token-time">{searchedPatientRecord.timestamp}</span>
              </div>

              <h3>{searchedPatientRecord.patient_name} ({searchedPatientRecord.age})</h3>
              <p><strong>Assigned Doctor:</strong> {searchedPatientRecord.assignedDoctorName || 'Pending Staff Assignment'}</p>

              {searchedPatientRecord.prescription ? (
                <div className="official-rx-paper">
                  <div className="rx-paper-header">
                    <h4>CIVIL HOSPITAL OPD PRESCRIPTION</h4>
                    <span className="rx-doc-sign">
                      👨‍⚕️ {searchedPatientRecord.prescription.doctor_name} ({searchedPatientRecord.prescription.doctor_specialty})
                    </span>
                  </div>

                  <div className="rx-diagnosis-banner">
                    <strong>Clinical Diagnosis:</strong> {searchedPatientRecord.prescription.diagnosis}
                  </div>

                  <div className="rx-medicines-list">
                    <strong>Prescribed Medications:</strong>
                    <ul>
                      {searchedPatientRecord.prescription.medicines?.map((med, i) => (
                        <li key={i}>
                          💊 <strong>{med.name}</strong> {med.dosage && `(${med.dosage})`} — Frequency: {med.frequency} for {med.duration} <em>[{med.instructions}]</em>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {searchedPatientRecord.prescription.advice && (
                    <p style={{ marginTop: '0.75rem' }}>
                      <strong>Doctor Advice:</strong> {searchedPatientRecord.prescription.advice}
                    </p>
                  )}

                  <p style={{ marginTop: '0.5rem', color: '#38bdf8' }}>
                    <strong>Follow-up:</strong> Review in OPD in {searchedPatientRecord.prescription.follow_up}.
                  </p>

                  <div className="rx-paper-footer">
                    <span>Signed digitally at {searchedPatientRecord.prescription.signed_at} on {searchedPatientRecord.prescription.date}</span>
                  </div>
                </div>
              ) : (
                <div className="token-instruction" style={{ marginTop: '1rem' }}>
                  ⏳ Your intake has been received and routed to <strong>{searchedPatientRecord.assignedDoctorName || 'the department specialist'}</strong>. Please wait for your consultation.
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* STEP 1: INITIAL VOICE / TEXT INPUT */}
          {step === 'initial' && (
            <div className="glass-panel patient-form-card">
              <div className="sample-chips-container">
                <span className="chips-label">Quick Examples (નમૂના ઉદાહરણો):</span>
                <div className="sample-chips">
                  {PATIENT_SAMPLES.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="chip-btn"
                      onClick={() => setInitialText(sample.text)}
                    >
                      {sample.lang}: {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleProceedToAssistedForm}>
                <div className="form-group inline-fields">
                  <div>
                    <label>Your Name (તમારું નામ)</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g. Ramesh Patel"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Phone Number (મોબાઇલ નંબર)</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Describe your symptoms (તમને શું તકલીફ થાય છે?)</label>
                  <div className="textarea-wrapper">
                    <textarea
                      className="textarea-input patient-textarea"
                      value={initialText}
                      onChange={(e) => setInitialText(e.target.value)}
                      placeholder="અહીં લખો અથવા નીચે માઇક્રોફોન દબાવીને બોલો (e.g. મને બે દિવસથી છાતીમાં દુખે છે...)"
                      rows={4}
                      required
                    />

                    <div className="input-toolbar">
                      <button
                        type="button"
                        className={`voice-btn ${isRecording ? 'recording' : ''}`}
                        onClick={handleVoiceToggle}
                      >
                        {isRecording ? '🔴 સાંભળી રહ્યા છીએ (Listening)...' : '🎤 બોલો (Tap & Speak)'}
                      </button>
                      <button
                        type="button"
                        className="clear-btn"
                        onClick={() => setInitialText('')}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading || !initialText.trim()}
                >
                  Continue to Assisted Form Filling with Gemma Assistant →
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: DETAILED FORM + GEMMA CHAT ASSISTANT (SAHAI MITRA) */}
          {step === 'assisted_form' && (
            <div className="assisted-form-container">
              {/* Left Column: Detailed Editable Form */}
              <div className="glass-panel patient-form-left">
                <div className="form-section-header">
                  <h3>📋 Clinical Details Checklist</h3>
                  <span className="live-badge">⚡ Real-time Auto-filling</span>
                </div>

                <div className="structured-grid">
                  <div className="field-group">
                    <label>Patient Full Name</label>
                    <input
                      type="text"
                      className="field-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="field-group">
                    <label className={recentlyUpdatedField === 'age' ? 'label-glow' : ''}>
                      Age {recentlyUpdatedField === 'age' && '✓ (Updated by Assistant)'}
                    </label>
                    <input
                      type="text"
                      className={`field-input ${recentlyUpdatedField === 'age' ? 'input-highlight-glow' : ''}`}
                      placeholder="e.g. 45 years"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>

                  <div className="field-group full-width">
                    <label>Primary Complaint & Symptoms</label>
                    <input
                      type="text"
                      className="field-input"
                      value={formData.chief_complaint}
                      onChange={(e) => setFormData({ ...formData, chief_complaint: e.target.value })}
                    />
                  </div>

                  <div className="field-group">
                    <label className={recentlyUpdatedField === 'duration' ? 'label-glow' : ''}>
                      Duration / Onset {recentlyUpdatedField === 'duration' && '✓ (Updated)'}
                    </label>
                    <input
                      type="text"
                      className={`field-input ${recentlyUpdatedField === 'duration' ? 'input-highlight-glow' : ''}`}
                      placeholder="e.g. 2 days"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>

                  <div className="field-group">
                    <label className={recentlyUpdatedField === 'severity' ? 'label-glow' : ''}>
                      Pain / Discomfort Severity ({formData.severity}/10)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      className="severity-slider"
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value, 10) })}
                    />
                  </div>

                  <div className="field-group full-width">
                    <label className={recentlyUpdatedField === 'existing_conditions' ? 'label-glow' : ''}>
                      Existing Conditions (BP, Sugar, Asthma, etc.) {recentlyUpdatedField === 'existing_conditions' && '✓ (Updated)'}
                    </label>
                    <input
                      type="text"
                      className={`field-input ${recentlyUpdatedField === 'existing_conditions' ? 'input-highlight-glow' : ''}`}
                      placeholder="e.g. Hypertension, Diabetes, or None"
                      value={formData.existing_conditions}
                      onChange={(e) => setFormData({ ...formData, existing_conditions: e.target.value })}
                    />
                  </div>

                  <div className="field-group full-width">
                    <label className={recentlyUpdatedField === 'current_medicines' ? 'label-glow' : ''}>
                      Current Daily Medications {recentlyUpdatedField === 'current_medicines' && '✓ (Updated)'}
                    </label>
                    <input
                      type="text"
                      className={`field-input ${recentlyUpdatedField === 'current_medicines' ? 'input-highlight-glow' : ''}`}
                      placeholder="e.g. Metformin, BP tablet, or None"
                      value={formData.current_medicines}
                      onChange={(e) => setFormData({ ...formData, current_medicines: e.target.value })}
                    />
                  </div>

                  <div className="field-group full-width">
                    <label className={recentlyUpdatedField === 'allergies' ? 'label-glow' : ''}>
                      Known Drug or Food Allergies {recentlyUpdatedField === 'allergies' && '✓ (Updated)'}
                    </label>
                    <input
                      type="text"
                      className={`field-input ${recentlyUpdatedField === 'allergies' ? 'input-highlight-glow' : ''}`}
                      placeholder="e.g. Penicillin allergy, or None"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-actions-row">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep('initial')}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleFinalTokenGenerate}
                  >
                    ✓ Confirm & Generate My Clinic Intake Pass →
                  </button>
                </div>
              </div>

              {/* Right Column: Gemma Interactive Chat Assistant (Sahai Mitra) */}
              <div className="glass-panel patient-chat-drawer">
                <div className="chat-drawer-header">
                  <div className="chat-avatar">🤖</div>
                  <div>
                    <h4>Sahai Mitra (સહાય મિત્ર)</h4>
                    <span className="chat-status">🟢 Gemma Patient Assistant Active</span>
                  </div>
                </div>

                <div className="chat-messages-container">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`chat-bubble ${msg.sender === 'assistant' ? 'assistant-bubble' : 'patient-bubble'}`}
                    >
                      {msg.sender === 'assistant' && <span className="bubble-label">Sahai Mitra</span>}
                      <p>{msg.text}</p>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="chat-bubble assistant-bubble typing-bubble">
                      <span>Sahai Mitra is typing...</span>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Quick Interactive Inquiry Chips */}
                <div className="chat-quick-suggestions">
                  {QUICK_CHAT_QUESTIONS.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="chat-quick-chip"
                      disabled={isChatLoading}
                      onClick={() => handleSendChatMessage(null, chip.query)}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSendChatMessage} className="chat-input-bar">
                  <input
                    type="text"
                    placeholder="Reply in Gujarati, Hindi, or English..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={isChatLoading}
                  />
                  <button
                    type="button"
                    className={`btn-chat-mic ${isChatRecording ? 'recording' : ''}`}
                    onClick={handleChatVoiceToggle}
                    title="Speak reply"
                  >
                    🎤
                  </button>
                  <button
                    type="submit"
                    className="btn-chat-send"
                    disabled={!chatInput.trim() || isChatLoading}
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* STEP 3: DIGITAL CLINIC TOKEN & PASS */}
          {step === 'token_view' && generatedToken && (
            <div className="glass-panel patient-token-card">
              <div className="token-top">
                <span className="token-badge">✓ Submitted to Clinical Staff Triage Queue</span>
                <span className="token-time">{generatedToken.timestamp}</span>
              </div>

              <div className="token-main">
                <div className="token-qr-sim">
                  <span className="qr-icon">📱</span>
                  <span className="token-id">{generatedToken.id}</span>
                </div>

                <div className="token-details">
                  <h3>{generatedToken.patient_name} ({generatedToken.age})</h3>
                  <p className="token-phone">📞 Phone: {generatedToken.phone}</p>
                  <div className="token-complaint-preview">
                    <strong>Chief Complaint:</strong> {generatedToken.chief_complaint}
                    <br />
                    <strong>Duration:</strong> {generatedToken.duration} | <strong>Severity:</strong> {generatedToken.severity}/10
                    <br />
                    <strong>Conditions:</strong> {Array.isArray(generatedToken.existing_conditions) ? generatedToken.existing_conditions.join(', ') : generatedToken.existing_conditions}
                    <br />
                    <strong>Allergies:</strong> {Array.isArray(generatedToken.allergies) ? generatedToken.allergies.join(', ') : generatedToken.allergies}
                  </div>
                </div>
              </div>

              <div className="token-footer">
                <p className="token-instruction">
                  👉 Your Token ID is <strong>{generatedToken.id}</strong>. The hospital triage nurse is reviewing your intake and assigning you to the respective department doctor. You can check back under "Check My Prescription" with this Token ID!
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setStep('initial');
                    setInitialText('');
                    setGeneratedToken(null);
                  }}
                >
                  + New Patient Intake
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
