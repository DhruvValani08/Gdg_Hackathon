import React, { useState } from 'react';

const CAMP_SAMPLES = [
  {
    name: 'Maniben Vankar',
    village: 'Kasindra Village Health Camp',
    age: '62 yrs, Female',
    bp: '185/110 mmHg',
    sugar: '340 mg/dL (RBS)',
    symptoms: 'ચક્કર આવે છે, માથું ભારે છે અને 3 દિવસથી પગમાં સોજા છે. (Dizziness, heavy head, bilateral foot edema for 3 days)'
  },
  {
    name: 'Ketan Solanki',
    village: 'Sanand Mobile Medical Van',
    age: '31 yrs, Male',
    bp: '120/80 mmHg',
    sugar: '110 mg/dL',
    symptoms: 'ખેતરમાં જંતુનાશક દવાનો છંટકાવ કરતી વખતે ઉલટી અને બેભાન જેવું થયું. (Vomiting and near-syncope while spraying pesticide in field)'
  }
];

export default function CampPortal({ onProcessIntake, isLoading }) {
  const [patientName, setPatientName] = useState('');
  const [village, setVillage] = useState('');
  const [age, setAge] = useState('');
  const [bp, setBp] = useState('');
  const [sugar, setSugar] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [referralPass, setReferralPass] = useState(null);

  const loadSample = (sample) => {
    setPatientName(sample.name);
    setVillage(sample.village);
    setAge(sample.age);
    setBp(sample.bp);
    setSugar(sample.sugar);
    setSymptoms(sample.symptoms);
  };

  const handleVoiceToggle = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'gu-IN';

    if (!isRecording) {
      setIsRecording(true);
      recognition.start();
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setSymptoms(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
    } else {
      setIsRecording(false);
      recognition.stop();
    }
  };

  const handleDispatchReferral = (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    const fullCampNote = `[COMMUNITY HEALTH CAMP OUTBOUND REFERRAL]
Patient: ${patientName || 'Anonymous'} (${age || 'Age unstated'})
Field Camp Location: ${village || 'Rural Health Camp'}
Screened Field Vitals: BP: ${bp || 'Not measured'}, Blood Sugar: ${sugar || 'Not measured'}
Reported Symptoms / Field Worker Notes: ${symptoms}`;

    // Generate outbound transfer pass
    setReferralPass({
      id: `CAMP-DISPATCH-${Math.floor(1000 + Math.random() * 9000)}`,
      name: patientName || 'Camp Patient',
      village: village || 'Rural Health Camp',
      age: age || 'Not specified',
      vitals: `BP: ${bp || 'N/A'} | RBS: ${sugar || 'N/A'}`,
      symptoms,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    if (onProcessIntake) {
      onProcessIntake(fullCampNote, true);
    }
  };

  return (
    <div className="portal-container camp-portal">
      <div className="portal-header">
        <div className="portal-title-group">
          <span className="portal-tag tag-emerald">⛺ Rural Community Health Camp & Mobile Station</span>
          <h2>Field Health Screening & 108 Ambulance Outbound Referral Dispatch</h2>
          <p className="portal-subtitle">
            Perform rapid vitals screening at remote village camps and dispatch critical emergency referrals to city tertiary hospitals.
          </p>
        </div>

        <div className="camp-offline-badge">
          <span className="offline-dot">🟢</span>
          <span>Local Gemma Offline Engine Active (Zero Cloud Internet Needed)</span>
        </div>
      </div>

      {!referralPass ? (
        <div className="glass-panel camp-form-card">
          <div className="sample-chips-container">
            <span className="chips-label">Load Camp Patient Preset:</span>
            <div className="sample-chips">
              {CAMP_SAMPLES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="chip-btn"
                  onClick={() => loadSample(sample)}
                >
                  📍 {sample.village} — {sample.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleDispatchReferral}>
            <div className="structured-grid">
              <div className="field-group">
                <label>Patient Name</label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="e.g. Maniben Vankar"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>Village Camp / Mobile Van Location</label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="e.g. Kasindra Primary Health Center"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>Age & Gender</label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="e.g. 62 yrs, Female"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="field-group inline-fields">
                <div>
                  <label>Field Blood Pressure</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="e.g. 180/110"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                  />
                </div>
                <div>
                  <label>Random Blood Sugar (RBS)</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="e.g. 320 mg/dL"
                    value={sugar}
                    onChange={(e) => setSugar(e.target.value)}
                  />
                </div>
              </div>

              <div className="field-group full-width">
                <label>Field Observations / Patient Vernacular Complaint</label>
                <div className="textarea-wrapper">
                  <textarea
                    className="textarea-input"
                    rows={3}
                    placeholder="Speak or type in Gujarati/Hindi (e.g. ચક્કર આવે છે, ખેતરમાં કામ કરતા ઉલટી થઈ...)"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    required
                  />

                  <div className="input-toolbar">
                    <button
                      type="button"
                      className={`voice-btn ${isRecording ? 'recording' : ''}`}
                      onClick={handleVoiceToggle}
                    >
                      {isRecording ? '🔴 Recording...' : '🎤 Voice Intake'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-emerald-submit"
              disabled={isLoading || !symptoms.trim()}
            >
              {isLoading ? 'Synthesizing with Gemma...' : '🚨 Dispatch 108 Ambulance Outbound Referral Pass →'}
            </button>
          </form>
        </div>
      ) : (
        <div className="glass-panel camp-referral-dossier">
          <div className="token-top">
            <span className="token-badge badge-emerald">✓ 108 Ambulance Outbound Referral Dossier</span>
            <span className="token-time">{referralPass.time}</span>
          </div>

          <div className="transfer-route-visualizer" style={{ marginTop: '1rem' }}>
            <div className="route-step">
              <span className="step-icon">⛺</span>
              <div className="step-details">
                <span className="step-label">Origin Field Camp</span>
                <strong>{referralPass.village}</strong>
              </div>
            </div>
            <div className="route-arrow">➔ 108 Ambulance ➔</div>
            <div className="route-step">
              <span className="step-icon">🏥</span>
              <div className="step-details">
                <span className="step-label">Destination Hospital</span>
                <strong>District Civil Hospital Emergency</strong>
              </div>
            </div>
          </div>

          <div className="camp-dossier-body">
            <h3>{referralPass.name} ({referralPass.age})</h3>
            <p><strong>Field Screened Vitals:</strong> {referralPass.vitals}</p>
            <p><strong>Camp Observations:</strong> "{referralPass.symptoms}"</p>
          </div>

          <div className="token-footer">
            <p className="token-instruction">
              🚑 Hand this referral pass to the 108 Ambulance Emergency Medical Technician (EMT) for direct SBAR handover at the Civil Hospital emergency trauma room.
            </p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setReferralPass(null)}
            >
              + Screen Next Camp Patient
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
