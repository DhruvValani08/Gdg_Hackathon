import React from 'react';

export default function ArchitectureView() {
  return (
    <div className="glass-panel info-view-panel">
      <h2>🚀 Gemma Clinical Architecture & Safety Protocols</h2>
      <p className="panel-desc">
        Civil Sahai utilizes Google's lightweight open model <strong>Gemma</strong> to perform multilingual semantic translation, clinical entity extraction, and doctor-ready synthesis while strictly respecting responsible AI boundaries.
      </p>

      <div className="arch-grid">
        <div className="arch-card">
          <div className="card-icon">🌐</div>
          <h3>Multilingual Entity Parsing</h3>
          <p>
            Patients often speak in colloquial dialects (Gujarati, Hindi, Gujlish, Hinglish). Gemma maps colloquial phrases (e.g., <em>"છાતીમાં દુખે છે"</em>, <em>"BP ની દવા"</em>) into standardized clinical entities without altering the underlying patient meaning.
          </p>
        </div>

        <div className="arch-card">
          <div className="card-icon">🚨</div>
          <h3>Dual Emergency Rule Engine</h3>
          <p>
            Combines deterministic regex pattern matching with Gemma's contextual understanding to instantly flag high-urgency symptoms (e.g. chest pain, severe dyspnea, anaphylaxis) directly to triage nursing staff.
          </p>
        </div>

        <div className="arch-card">
          <div className="card-icon">🛡️</div>
          <h3>Strict Zero-Diagnosis Boundary</h3>
          <p>
            The system prompt explicitly disables diagnostic hypothesizing, medication prescription, and survival calculations. It is strictly a note-structuring and communication tool.
          </p>
        </div>

        <div className="arch-card">
          <div className="card-icon">🔄</div>
          <h3>Missing Information Feedback Loop</h3>
          <p>
            When essential parameters (e.g., age, duration, allergy history) are omitted, the assistant prompts staff to clarify the exact missing items with the patient before locking the record.
          </p>
        </div>
      </div>

      <div className="prompt-showcase">
        <h3>System Prompt Specification (JSON Enforced)</h3>
        <pre className="code-block">
{`CRITICAL SAFETY & RESPONSIBLE-USE RULES:
1. NEVER provide medical diagnosis.
2. NEVER suggest medicines, treatments, or dosages.
3. NEVER predict survival or disease probabilities.
4. Extract only facts directly stated or clearly implied.
5. Identify any missing critical parameters (Age, Duration, Allergies).
6. Output STRICT JSON conforming to the clinical intake schema.`}
        </pre>
      </div>
    </div>
  );
}
