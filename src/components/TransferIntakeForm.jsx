import React, { useState } from 'react';

const TRANSFER_SAMPLE_CASES = [
  {
    id: 'snakebite-rural',
    title: '🐍 Rural Snakebite Transfer (PHC to Civil)',
    lang: 'Gujarati / Mixed',
    text: 'PHC Dholka thi Civil Hospital Ahmedabad transfer karyo che. 38 year male, khetar ma saap kadyo hato. 2 vials ASV and IV Normal Saline aapelu che at 10 AM. Ambulance ma 1 vaar vomit thayu ane drowsiness che.',
    desc: 'Rural snakebite, 2 vials ASV given, vomiting in 108 ambulance.'
  },
  {
    id: 'cardiac-transit',
    title: '❤️ Acute Cardiac Transfer (Village Clinic to City)',
    lang: 'English / Gujlish',
    text: 'Patient transferred from Primary Health Centre Bavla to City Hospital. 58-year-old male with crushing chest pain for 3 hours. Disprin 300mg + Sorbitrate given at 11:30 AM before ambulance dispatch. Oxygen 4L/min on 108 ambulance. BP was 170/100 at village.',
    desc: 'Severe chest pain, loading dose given, transit O2 given.'
  },
  {
    id: 'trauma-chc',
    title: '🚑 High-Risk Trauma (Taluka CHC to Tertiary)',
    lang: 'Hindi / Mixed',
    text: 'CHC Sanand se Civil Trauma Center referral. 24 year old male, bike accident on highway. Head injury and open right leg fracture. IV line RL chalaya hai. Splint lagaya hai. Blood group and tetanus vaccination status not recorded at CHC.',
    desc: 'Polytrauma, IV fluids started, blood group missing.'
  }
];

export default function TransferIntakeForm({ onSubmit, isLoading }) {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported] = useState(
    typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  );

  const handleSampleClick = (text) => {
    setInputText(text);
  };

  const handleVoiceToggle = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'gu-IN';

    if (!isRecording) {
      setIsRecording(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        console.error('Voice error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    } else {
      setIsRecording(false);
      recognition.stop();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSubmit(inputText.trim());
    }
  };

  return (
    <div className="glass-panel transfer-card">
      <div className="card-header">
        <div>
          <div className="transfer-header-pill">
            <span>🚑 Inter-Hospital & Rural-to-Urban Transfer Handover</span>
          </div>
          <h2>Hospital Referral & Transit Handover</h2>
          <p className="subtitle">
            Paste referral chit, paramedic transit report, or verbal village doctor notes to prevent critical handover communication gaps.
          </p>
        </div>
        <div className="badge gemma-badge">
          <span>✨ Gemma SBAR Engine</span>
        </div>
      </div>

      <div className="sample-chips-container transfer-sample-container">
        <span className="chips-label">Select Common Rural Referral Scenarios:</span>
        <div className="sample-chips">
          {TRANSFER_SAMPLE_CASES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              className="chip-btn transfer-chip"
              onClick={() => handleSampleClick(sample.text)}
              title={sample.desc}
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="textarea-wrapper">
            <textarea
              className="textarea-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. PHC Dholka thi Civil Hospital transfer karyo che. 38 year male, khetar ma saap kadyo hato. 2 vials ASV and IV Normal Saline aapelu che at 10 AM. Ambulance ma 1 vaar vomit thayu..."
              rows={5}
              required
            />

            <div className="input-toolbar">
              <button
                type="button"
                className={`voice-btn ${isRecording ? 'recording' : ''}`}
                onClick={handleVoiceToggle}
              >
                {isRecording ? '🔴 Listening...' : '🎤 Paramedic / Staff Voice Note'}
              </button>

              <button
                type="button"
                className="clear-btn"
                onClick={() => setInputText('')}
                disabled={!inputText}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-transfer-submit"
          disabled={isLoading || !inputText.trim()}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Synthesizing Transfer Dossier with Gemma...
            </>
          ) : (
            'Generate Doctor Transfer Handover (SBAR) →'
          )}
        </button>
      </form>
    </div>
  );
}
