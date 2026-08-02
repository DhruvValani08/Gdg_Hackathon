import React, { useState } from 'react';

export default function TransferSummaryView({ data, rawInput, onReset, modelSource }) {
  const [formData, setFormData] = useState({
    patient_name: data.patient_name || 'Patient Handover',
    age_gender: data.age_gender || 'Not specified',
    referring_facility: data.referring_facility || 'Rural Primary Health Center',
    receiving_facility: data.receiving_facility || 'District / Tertiary Civil Hospital',
    transfer_reason: data.transfer_reason || '',
    chief_condition_at_referral: data.chief_condition_at_referral || '',
    pre_transfer_treatments: Array.isArray(data.pre_transfer_treatments) 
      ? data.pre_transfer_treatments.join('\n') 
      : (data.pre_transfer_treatments || ''),
    transit_events: Array.isArray(data.transit_events) 
      ? data.transit_events.join('\n') 
      : (data.transit_events || ''),
    allergies: Array.isArray(data.allergies) ? data.allergies.join(', ') : (data.allergies || 'Unverified'),
    critical_handover_gaps: data.critical_handover_gaps || [],
    doctor_handover_summary: data.doctor_handover_summary || ''
  });

  const [isReceived, setIsReceived] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeGap, setActiveGap] = useState(null);
  const [gapClarification, setGapClarification] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResolveGap = (gap) => {
    if (!gapClarification.trim()) return;

    setFormData(prev => ({
      ...prev,
      doctor_handover_summary: `${prev.doctor_handover_summary}\n[Handover Clarification: ${gap} -> ${gapClarification.trim()}]`,
      critical_handover_gaps: prev.critical_handover_gaps.filter(g => g !== gap)
    }));

    setActiveGap(null);
    setGapClarification('');
  };

  const handleCopy = () => {
    const textToCopy = `=== 🚑 EMERGENCY INTER-HOSPITAL TRANSFER DOSSIER (SBAR) ===
PATIENT: ${formData.patient_name} (${formData.age_gender})
ROUTE: [Origin] ${formData.referring_facility} ➔ [Destination] ${formData.receiving_facility}
PRIMARY REFERRAL REASON: ${formData.transfer_reason}

PRE-TRANSFER INTERVENTIONS AT RURAL FACILITY:
${formData.pre_transfer_treatments}

TRANSIT & AMBULANCE EVENTS:
${formData.transit_events}

KNOWN ALLERGIES: ${formData.allergies}

SBAR CLINICAL HANDOVER FOR CITY DOCTOR:
${formData.doctor_handover_summary}

STATUS: ${isReceived ? '✓ HANDOVER CONFIRMED & RECEIVED BY CITY ER DOCTOR' : '⚠️ PRELIMINARY TRANSIT PACKET'}
SYNTHESIZED VIA: ${modelSource || 'Gemma SBAR Engine'}
===========================================================`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const emergencyRedFlags = Array.isArray(data.emergency_red_flags) ? data.emergency_red_flags : [];

  return (
    <div className="summary-container transfer-dossier-wrapper">
      {/* Emergency Handover Red Flags */}
      {emergencyRedFlags.length > 0 && (
        <div className="alert emergency-alert-pulse">
          <div className="alert-icon">🚨</div>
          <div className="alert-content">
            <h4>CRITICAL REFERRAL ALERT - IMMEDIATE ER ATTENTION REQUIRED</h4>
            <ul>
              {emergencyRedFlags.map((flag, idx) => (
                <li key={idx}><strong>{flag}</strong></li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="glass-panel summary-card transfer-summary-card">
        {/* Top Header Bar */}
        <div className="summary-top-bar">
          <div className="top-title-group">
            <span className="badge transfer-badge">🚑 Inter-Hospital Transfer Handover</span>
            <span className="badge lang-badge">Language: {data.language_detected || 'Multilingual'}</span>
            <span className={`badge status-badge ${isReceived ? 'badge-verified' : 'badge-pending'}`}>
              {isReceived ? '✓ Received & Accepted by City ER Team' : '⏳ Handover In-Transit / Pending ER Review'}
            </span>
          </div>

          <div className="top-action-buttons">
            <button
              type="button"
              className="btn-action btn-copy"
              onClick={handleCopy}
            >
              {copied ? '✓ SBAR Dossier Copied!' : '📋 Copy SBAR for ER Doctor'}
            </button>
            <button
              type="button"
              className="btn-action btn-new"
              onClick={onReset}
            >
              + New Handover
            </button>
          </div>
        </div>

        {/* Transfer Route Visualizer */}
        <div className="transfer-route-visualizer">
          <div className="route-step">
            <span className="step-icon">🏥</span>
            <div className="step-details">
              <span className="step-label">Referring Center</span>
              <strong>{formData.referring_facility}</strong>
            </div>
          </div>
          <div className="route-arrow">➔ 108 Ambulance ➔</div>
          <div className="route-step">
            <span className="step-icon">🏙️</span>
            <div className="step-details">
              <span className="step-label">Receiving Center</span>
              <strong>{formData.receiving_facility}</strong>
            </div>
          </div>
        </div>

        {/* Original Referral Chit Preview */}
        <div className="raw-input-preview">
          <span className="preview-label">Original Referral Note / Paramedic Transit Audio Note:</span>
          <p className="preview-text">"{rawInput}"</p>
        </div>

        {/* Critical Handover Gaps - Blind spot detection */}
        {formData.critical_handover_gaps && formData.critical_handover_gaps.length > 0 && (
          <div className="missing-info-card transfer-gaps-card">
            <div className="missing-title-row">
              <span className="warning-icon">⚠️</span>
              <h4>Critical Handover Gaps (Common Blindspots for Receiving Doctors)</h4>
            </div>
            <p className="missing-desc">
              Gemma flagged the following vital transfer details that are missing from the rural chit. Clarify with the ambulance paramedic or calling doctor:
            </p>

            <div className="missing-list">
              {formData.critical_handover_gaps.map((gap, idx) => (
                <div key={idx} className="missing-chip-container">
                  {activeGap === gap ? (
                    <div className="missing-input-inline">
                      <input
                        type="text"
                        placeholder="Enter verified detail..."
                        value={gapClarification}
                        onChange={(e) => setGapClarification(e.target.value)}
                        autoFocus
                      />
                      <button
                        type="button"
                        className="btn-tiny-save"
                        onClick={() => handleResolveGap(gap)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn-tiny-cancel"
                        onClick={() => {
                          setActiveGap(null);
                          setGapClarification('');
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="missing-chip-btn"
                      onClick={() => {
                        setActiveGap(gap);
                        setGapClarification('');
                      }}
                    >
                      <span>🔍 Resolve: {gap}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transfer Grid Fields */}
        <div className="structured-grid">
          <div className="field-group">
            <label>Referring Facility (Village/PHC/CHC)</label>
            <input
              type="text"
              className="field-input"
              value={formData.referring_facility}
              onChange={(e) => handleChange('referring_facility', e.target.value)}
            />
          </div>

          <div className="field-group">
            <label>Receiving Tertiary Hospital</label>
            <input
              type="text"
              className="field-input"
              value={formData.receiving_facility}
              onChange={(e) => handleChange('receiving_facility', e.target.value)}
            />
          </div>

          <div className="field-group full-width">
            <label>Reason for Transfer / Lack of Resources at Rural Center</label>
            <input
              type="text"
              className="field-input highlight-field"
              value={formData.transfer_reason}
              onChange={(e) => handleChange('transfer_reason', e.target.value)}
            />
          </div>

          <div className="field-group">
            <label>💉 Pre-Transfer Interventions Given at Village</label>
            <textarea
              className="field-input"
              rows={3}
              placeholder="e.g. IV fluids, Injections, Loading dose meds with timestamps"
              value={formData.pre_transfer_treatments}
              onChange={(e) => handleChange('pre_transfer_treatments', e.target.value)}
            />
          </div>

          <div className="field-group">
            <label>🚑 In-Transit & Ambulance Events</label>
            <textarea
              className="field-input"
              rows={3}
              placeholder="e.g. Oxygen desaturation, vomiting, seizure, vitals in ambulance"
              value={formData.transit_events}
              onChange={(e) => handleChange('transit_events', e.target.value)}
            />
          </div>

          {/* SBAR Handover Box for Receiving City Physician */}
          <div className="field-group full-width doctor-summary-box transfer-sbar-box">
            <div className="doctor-header-row">
              <label>👨‍⚕️ SBAR Structured Handover for Receiving City ER Doctor</label>
              <span className="no-diag-tag">Situation • Background • Assessment • Recommendation</span>
            </div>
            <textarea
              className="doctor-textarea"
              rows={4}
              value={formData.doctor_handover_summary}
              onChange={(e) => handleChange('doctor_handover_summary', e.target.value)}
            />
          </div>
        </div>

        {/* Receiving Physician Confirmation */}
        <div className="verification-row">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={isReceived}
              onChange={(e) => setIsReceived(e.target.checked)}
            />
            <span className="checkmark"></span>
            <span className="checkbox-text">
              I (Receiving City Medical Officer / ER Registrar) have verified pre-transfer medications, transit timeline, and accepted the patient handover.
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
