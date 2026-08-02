import React, { useState } from 'react';
import MissingInfoPrompt from './MissingInfoPrompt';

export default function SummaryView({ data, rawInput, emergencyAlerts, onReset, modelSource }) {
  const [formData, setFormData] = useState({
    chief_complaint: data.chief_complaint || '',
    duration: data.duration || '',
    age: data.age || '',
    gender: data.gender || '',
    symptoms: Array.isArray(data.symptoms) ? data.symptoms.join(', ') : (data.symptoms || ''),
    existing_conditions: Array.isArray(data.existing_conditions) ? data.existing_conditions.join(', ') : (data.existing_conditions || ''),
    current_medicines: Array.isArray(data.current_medicines) ? data.current_medicines.join(', ') : (data.current_medicines || ''),
    allergies: Array.isArray(data.allergies) ? data.allergies.join(', ') : (data.allergies || ''),
    doctor_summary: data.doctor_summary || '',
    missing_details: data.missing_details || []
  });

  const [isVerified, setIsVerified] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddMissingInfo = (missingItem, value) => {
    // Dynamically update formData based on what was clarified
    const lowerItem = missingItem.toLowerCase();
    
    setFormData(prev => {
      const updated = { ...prev };
      
      if (lowerItem.includes('age')) {
        updated.age = value;
      } else if (lowerItem.includes('duration')) {
        updated.duration = value;
      } else if (lowerItem.includes('allerg')) {
        updated.allergies = prev.allergies && prev.allergies !== 'Not specified' ? `${prev.allergies}, ${value}` : value;
      } else if (lowerItem.includes('condition') || lowerItem.includes('history')) {
        updated.existing_conditions = prev.existing_conditions && prev.existing_conditions !== 'None explicitly stated' ? `${prev.existing_conditions}, ${value}` : value;
      } else if (lowerItem.includes('severity')) {
        updated.symptoms = `${prev.symptoms} (Pain severity: ${value})`;
      } else {
        updated.doctor_summary = `${prev.doctor_summary} [Additional Note: ${missingItem} = ${value}]`;
      }

      // Remove from missing list
      updated.missing_details = prev.missing_details.filter(item => item !== missingItem);

      return updated;
    });
  };

  const handleCopy = () => {
    const textToCopy = `--- DOCTOR INTAKE SUMMARY ---
Patient Age/Gender: ${formData.age || 'N/A'} / ${formData.gender || 'N/A'}
Chief Complaint: ${formData.chief_complaint}
Duration: ${formData.duration}
Symptoms: ${formData.symptoms}
Current Medications: ${formData.current_medicines}
Past Conditions: ${formData.existing_conditions}
Allergies: ${formData.allergies}

Doctor Summary:
${formData.doctor_summary}

Status: ${isVerified ? 'VERIFIED BY CLINIC STAFF' : 'PRELIMINARY (UNVERIFIED)'}
Generated via: ${modelSource || 'Gemma AI'}
-----------------------------`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Combine rule-based emergency alerts with LLM detected indicators
  const allEmergencies = [
    ...(emergencyAlerts || []),
    ...(Array.isArray(data.emergency_indicators) ? data.emergency_indicators.filter(e => e.toLowerCase() !== 'none' && e.toLowerCase() !== 'none detected') : [])
  ];
  const uniqueEmergencies = Array.from(new Set(allEmergencies));

  return (
    <div className="summary-container">
      {/* Emergency Alert Banner */}
      {uniqueEmergencies.length > 0 && (
        <div className="alert emergency-alert-pulse">
          <div className="alert-icon">🚨</div>
          <div className="alert-content">
            <h4>EMERGENCY INDICATOR DETECTED - IMMEDIATE TRIAGE RECOMMENDED</h4>
            <ul>
              {uniqueEmergencies.map((alert, idx) => (
                <li key={idx}><strong>{alert}</strong></li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Review Card */}
      <div className="glass-panel summary-card">
        <div className="summary-top-bar">
          <div className="top-title-group">
            <span className="badge lang-badge">Language: {data.language_detected || 'Multilingual'}</span>
            <span className="badge engine-badge">{modelSource || 'Gemma Engine'}</span>
            <span className={`badge status-badge ${isVerified ? 'badge-verified' : 'badge-pending'}`}>
              {isVerified ? '✓ Verified by Staff' : '⏳ Pending Staff Verification'}
            </span>
          </div>

          <div className="top-action-buttons">
            <button
              type="button"
              className="btn-action btn-copy"
              onClick={handleCopy}
            >
              {copied ? '✓ Summary Copied!' : '📋 Copy for Doctor'}
            </button>
            <button
              type="button"
              className="btn-action btn-new"
              onClick={onReset}
            >
              + New Intake
            </button>
          </div>
        </div>

        <div className="raw-input-preview">
          <span className="preview-label">Original Patient Description:</span>
          <p className="preview-text">"{rawInput}"</p>
        </div>

        {/* Missing Information Prompt (Ask user again) */}
        <MissingInfoPrompt
          missingItems={formData.missing_details}
          onAddInfo={handleAddMissingInfo}
        />

        {/* Structured Form Grid */}
        <div className="structured-grid">
          <div className="field-group full-width">
            <label>Chief Complaint (Primary Reason for Visit)</label>
            <input
              type="text"
              className="field-input highlight-field"
              value={formData.chief_complaint}
              onChange={(e) => handleChange('chief_complaint', e.target.value)}
            />
          </div>

          <div className="field-group">
            <label>Duration / Onset</label>
            <input
              type="text"
              className="field-input"
              value={formData.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
            />
          </div>

          <div className="field-group">
            <label>Patient Age / Gender</label>
            <div className="inline-fields">
              <input
                type="text"
                placeholder="Age (e.g. 45 yrs)"
                className="field-input"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
              />
              <input
                type="text"
                placeholder="Gender"
                className="field-input"
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
              />
            </div>
          </div>

          <div className="field-group full-width">
            <label>Reported Symptoms</label>
            <input
              type="text"
              className="field-input"
              value={formData.symptoms}
              onChange={(e) => handleChange('symptoms', e.target.value)}
            />
          </div>

          <div className="field-group">
            <label>Current Medications</label>
            <input
              type="text"
              className="field-input"
              value={formData.current_medicines}
              onChange={(e) => handleChange('current_medicines', e.target.value)}
            />
          </div>

          <div className="field-group">
            <label>Known Allergies</label>
            <input
              type="text"
              className="field-input"
              value={formData.allergies}
              onChange={(e) => handleChange('allergies', e.target.value)}
            />
          </div>

          <div className="field-group full-width">
            <label>Past Medical History / Chronic Conditions</label>
            <input
              type="text"
              className="field-input"
              value={formData.existing_conditions}
              onChange={(e) => handleChange('existing_conditions', e.target.value)}
            />
          </div>

          {/* Doctor-Ready Summary Box */}
          <div className="field-group full-width doctor-summary-box">
            <div className="doctor-header-row">
              <label>👨‍⚕️ Concise Doctor-Ready Summary</label>
              <span className="no-diag-tag">Non-diagnostic fact synthesis</span>
            </div>
            <textarea
              className="doctor-textarea"
              rows={3}
              value={formData.doctor_summary}
              onChange={(e) => handleChange('doctor_summary', e.target.value)}
            />
          </div>
        </div>

        {/* Verification Checkbox & Staff Confirmation */}
        <div className="verification-row">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={isVerified}
              onChange={(e) => setIsVerified(e.target.checked)}
            />
            <span className="checkmark"></span>
            <span className="checkbox-text">
              I (Receptionist / Nurse / Medical Staff) have confirmed the accuracy of these details with the patient.
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
