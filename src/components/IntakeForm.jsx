import React, { useState } from 'react';

const SAMPLE_CASES = [
  {
    id: 'gujarati-chest',
    lang: 'Gujarati (Challenge Example)',
    text: 'મને બે દિવસથી છાતીમાં દુખે છે અને આજે શ્વાસ લેવામાં તકલીફ થાય છે. BP ની દવા ચાલુ છે.',
    desc: 'Chest pain + breathing difficulty + BP meds'
  },
  {
    id: 'hindi-fever',
    lang: 'Hindi',
    text: 'मुझे 3 दिन से तेज बुखार और सिरदर्द है। उम्र 45 साल है, शुगर की दवा ले रहा हूँ।',
    desc: 'High fever + headache + Diabetes history'
  },
  {
    id: 'mixed-gujlish',
    lang: 'Mixed (Gujlish)',
    text: 'Maru age 52 che. Past 1 week thi knee joint ma severe swelling and pain che. Metformin chalu che, penicillin allergy che.',
    desc: 'Knee swelling + Metformin + Penicillin allergy'
  },
  {
    id: 'english-stomach',
    lang: 'English',
    text: 'I am a 29-year-old female experiencing severe stomach cramps and nausea for 24 hours. No known allergies.',
    desc: 'Acute abdominal cramps + nausea'
  }
];

export default function IntakeForm({ onSubmit, isLoading }) {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(
    typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  );

  const handleSampleClick = (text) => {
    setInputText(text);
  };

  const handleVoiceToggle = () => {
    if (!speechSupported) {
      alert('Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    // Multi-language recognition preference (defaults to Indian English / Gujarati / Hindi)
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
        console.error('Speech recognition error:', event.error);
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
    <div className="glass-panel intake-card">
      <div className="card-header">
        <div>
          <h2>Patient Clinical Intake</h2>
          <p className="subtitle">
            Speak or type in <span className="highlight">Gujarati, Hindi, English</span>, or mixed dialects.
          </p>
        </div>
        <div className="badge gemma-badge">
          <span>✨ Powered by Gemma</span>
        </div>
      </div>

      <div className="sample-chips-container">
        <span className="chips-label">Quick Test Scenarios:</span>
        <div className="sample-chips">
          {SAMPLE_CASES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              className="chip-btn"
              onClick={() => handleSampleClick(sample.text)}
              title={sample.desc}
            >
              {sample.lang}
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
              placeholder="e.g. મને બે દિવસથી છાતીમાં દુખે છે અને આજે શ્વાસ લેવામાં તકલીફ થાય છે. BP ની દવા ચાલુ છે..."
              rows={5}
              required
            />
            
            <div className="input-toolbar">
              <button
                type="button"
                className={`voice-btn ${isRecording ? 'recording' : ''}`}
                onClick={handleVoiceToggle}
                title="Voice input (Speech to text)"
              >
                {isRecording ? '🔴 Listening...' : '🎤 Voice Intake'}
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
          className="btn btn-primary"
          disabled={isLoading || !inputText.trim()}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Structuring with Gemma...
            </>
          ) : (
            'Generate Clinical Summary →'
          )}
        </button>
      </form>
    </div>
  );
}
