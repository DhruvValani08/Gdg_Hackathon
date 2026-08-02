import React, { useState } from 'react';

export default function DoctorPortal({ activeDoctor, patientIntakes, onSavePrescription }) {
  const [filterMode, setFilterMode] = useState('my_patients'); // 'my_patients' | 'all'
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  // Prescription Form State
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: '1-0-1', duration: '5 days', instructions: 'After meals' }
  ]);
  const [advice, setAdvice] = useState('');
  const [followUp, setFollowUp] = useState('3 days');
  const [toastMsg, setToastMsg] = useState(null);

  // Filter patients based on doctor ID
  const myAssignedPatients = patientIntakes.filter(
    (p) => p.assignedDoctorId === activeDoctor?.id
  );

  const displayList = filterMode === 'my_patients' ? myAssignedPatients : patientIntakes;

  const currentPatient =
    displayList.find((p) => p.id === selectedPatientId) || displayList[0] || null;

  const handleAddMedicineRow = () => {
    setMedicines([
      ...medicines,
      { name: '', dosage: '', frequency: '1-0-1', duration: '5 days', instructions: 'After meals' }
    ]);
  };

  const handleRemoveMedicineRow = (idx) => {
    setMedicines(medicines.filter((_, i) => i !== idx));
  };

  const handleMedChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSignPrescription = (e) => {
    e.preventDefault();
    if (!currentPatient) return;

    const prescriptionData = {
      doctor_name: activeDoctor?.name || 'Consulting Physician',
      doctor_specialty: activeDoctor?.specialty || 'General Medicine',
      doctor_cabin: activeDoctor?.cabin || 'OPD Room',
      diagnosis: diagnosis.trim() || 'Clinical assessment completed.',
      medicines: medicines.filter((m) => m.name.trim() !== ''),
      advice: advice.trim() || 'Follow prescribed regimen.',
      follow_up: followUp,
      signed_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString()
    };

    onSavePrescription(currentPatient.id, prescriptionData);
    setToastMsg(`✓ Prescription signed & issued for ${currentPatient.patient_name} (${currentPatient.id})!`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleCopyEHR = () => {
    if (!currentPatient) return;
    const text = `--- CIVIL HOSPITAL CLINICAL EHR RECORD ---
Patient: ${currentPatient.patient_name} (${currentPatient.age}, ${currentPatient.gender})
Token: ${currentPatient.id} | Priority: ${currentPatient.priority}
Chief Complaint: ${currentPatient.chief_complaint}
Chronic History: ${Array.isArray(currentPatient.existing_conditions) ? currentPatient.existing_conditions.join(', ') : currentPatient.existing_conditions}
Current Meds: ${Array.isArray(currentPatient.current_medicines) ? currentPatient.current_medicines.join(', ') : currentPatient.current_medicines}
Allergies: ${Array.isArray(currentPatient.allergies) ? currentPatient.allergies.join(', ') : currentPatient.allergies}
Gemma Intake Summary: ${currentPatient.doctor_summary}
--- DOCTOR ASSESSMENT ---
Doctor: ${activeDoctor?.name} (${activeDoctor?.specialty})
Diagnosis: ${currentPatient.prescription?.diagnosis || diagnosis || 'Pending'}
Issued at: ${new Date().toLocaleTimeString()}`;

    navigator.clipboard.writeText(text);
    setToastMsg('✓ Complete EHR note copied to clipboard!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="portal-container doctor-portal">
      <div className="portal-header">
        <div className="portal-title-group">
          <span className="portal-tag tag-cyan">👨‍⚕️ Physician Review & Prescription Suite</span>
          <h2>
            {activeDoctor?.name} — {activeDoctor?.specialty}
          </h2>
          <p className="portal-subtitle">
            {activeDoctor?.cabin} • Assigned Patient Triage Queue & Clinical Prescription Pad
          </p>
        </div>

        <div className="doctor-stats-bar">
          <div className="reception-submode-toggle">
            <button
              type="button"
              className={`submode-btn ${filterMode === 'my_patients' ? 'active' : ''}`}
              onClick={() => setFilterMode('my_patients')}
            >
              My Assigned Patients ({myAssignedPatients.length})
            </button>
            <button
              type="button"
              className={`submode-btn ${filterMode === 'all' ? 'active' : ''}`}
              onClick={() => setFilterMode('all')}
            >
              All Hospital Intakes ({patientIntakes.length})
            </button>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="alert" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#6ee7b7' }}>
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="doctor-split-view">
        {/* Left Column: Assigned Queue */}
        <div className="doctor-queue-list">
          <div className="queue-header">
            <h3>{filterMode === 'my_patients' ? 'My Patient Queue' : 'All Department Queue'}</h3>
            <span className="queue-count">{displayList.length} Active</span>
          </div>

          <div className="queue-items">
            {displayList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
                <p>No patients currently assigned to your queue.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  Reception staff assigns incoming patients based on specialty.
                </p>
              </div>
            ) : (
              displayList.map((p) => {
                const isSelected = currentPatient?.id === p.id;
                const isEmergency = p.priority === 'EMERGENCY';
                const isCompleted = !!p.prescription;

                return (
                  <div
                    key={p.id}
                    className={`queue-card ${isSelected ? 'selected' : ''} ${isEmergency ? 'emergency-card' : ''}`}
                    onClick={() => {
                      setSelectedPatientId(p.id);
                      if (p.prescription) {
                        setDiagnosis(p.prescription.diagnosis);
                        setMedicines(p.prescription.medicines || []);
                        setAdvice(p.prescription.advice || '');
                        setFollowUp(p.prescription.follow_up || '3 days');
                      } else {
                        setDiagnosis('');
                        setMedicines([
                          { name: '', dosage: '', frequency: '1-0-1', duration: '5 days', instructions: 'After meals' }
                        ]);
                        setAdvice('');
                        setFollowUp('3 days');
                      }
                    }}
                  >
                    <div className="queue-card-top">
                      <span className="patient-id">{p.id}</span>
                      <span className={`priority-badge ${isEmergency ? 'badge-emergency' : 'badge-urgent'}`}>
                        {p.priority}
                      </span>
                    </div>

                    <div className="patient-name">{p.patient_name}</div>
                    <span className="patient-meta">
                      {p.age} • {p.type}
                    </span>
                    <p className="queue-chief-preview">{p.chief_complaint}</p>

                    <div className="queue-card-footer">
                      <span>🕒 {p.timestamp}</span>
                      {isCompleted ? (
                        <span className="signed-tag">✓ Prescription Signed</span>
                      ) : (
                        <span style={{ color: '#38bdf8' }}>Pending Consult</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Intake & Prescription Pad */}
        {currentPatient ? (
          <div className="glass-panel doctor-detail-panel">
            <div className="detail-top-bar">
              <div>
                <span className="portal-tag">Clinical Review Dossier</span>
                <h2>{currentPatient.patient_name} ({currentPatient.age}, {currentPatient.gender})</h2>
                <p className="detail-subtitle">
                  Token: <strong>{currentPatient.id}</strong> • Origin: {currentPatient.origin}
                </p>
              </div>

              <div className="top-action-buttons">
                <button type="button" className="btn-action btn-copy" onClick={handleCopyEHR}>
                  📋 Copy EHR
                </button>
              </div>
            </div>

            {/* Emergency Alerts */}
            {currentPatient.emergency_indicators && currentPatient.emergency_indicators.length > 0 && currentPatient.emergency_indicators[0] !== 'None' && currentPatient.emergency_indicators[0] !== 'None detected' && (
              <div className="alert emergency-alert-pulse">
                <span className="alert-icon">🚨</span>
                <div className="alert-content">
                  <h4>Emergency Red Flag Identified by Intake Engine</h4>
                  <ul>
                    {currentPatient.emergency_indicators.map((em, idx) => (
                      <li key={idx}>{em}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Structured Findings */}
            <div className="detail-sections-grid">
              <div className="detail-section full">
                <label>Chief Complaint & Symptoms</label>
                <div className="detail-value highlight">{currentPatient.chief_complaint}</div>
              </div>

              <div className="detail-section">
                <label>Reported Duration & Severity</label>
                <div className="detail-value">
                  {currentPatient.duration} (Severity: {currentPatient.severity}/10)
                </div>
              </div>

              <div className="detail-section">
                <label>Chronic Medical Conditions</label>
                <div className="detail-value">
                  {Array.isArray(currentPatient.existing_conditions)
                    ? currentPatient.existing_conditions.join(', ')
                    : currentPatient.existing_conditions}
                </div>
              </div>

              <div className="detail-section">
                <label>Current Medications</label>
                <div className="detail-value">
                  {Array.isArray(currentPatient.current_medicines)
                    ? currentPatient.current_medicines.join(', ')
                    : currentPatient.current_medicines}
                </div>
              </div>

              <div className="detail-section">
                <label>Known Allergies</label>
                <div className="detail-value">
                  {Array.isArray(currentPatient.allergies)
                    ? currentPatient.allergies.join(', ')
                    : currentPatient.allergies}
                </div>
              </div>

              <div className="detail-section full">
                <label>Gemma Objective Clinical Intake Summary</label>
                <div className="detail-value">{currentPatient.doctor_summary}</div>
              </div>
            </div>

            {/* DOCTOR'S OFFICIAL PRESCRIPTION & DIAGNOSIS PAD */}
            <div className="prescription-pad-card">
              <div className="prescription-header">
                <div className="rx-symbol">℞</div>
                <div>
                  <h3>Doctor's Official Diagnosis & Prescription Pad</h3>
                  <span className="rx-sub">
                    Authorized Physician: {activeDoctor?.name} ({activeDoctor?.specialty})
                  </span>
                </div>
              </div>

              <form onSubmit={handleSignPrescription}>
                <div className="field-group full-width" style={{ marginBottom: '1rem' }}>
                  <label>Clinical Diagnosis / Assessment</label>
                  <input
                    type="text"
                    className="field-input rx-diagnosis-input"
                    placeholder="e.g. Acute Angina Pectoris / Essential Hypertension / Knee Osteoarthritis"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    required
                  />
                </div>

                <div className="rx-medicines-table-wrap">
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Prescribed Medications (Rx):
                  </label>

                  {medicines.map((med, idx) => (
                    <div key={idx} className="rx-medicine-row">
                      <input
                        type="text"
                        className="field-input rx-med-name"
                        placeholder="Medicine Name (e.g. Tab. Sorbitrate / Tab. Amlodipine)"
                        value={med.name}
                        onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="field-input rx-med-dosage"
                        placeholder="Dose (e.g. 5mg, 500mg)"
                        value={med.dosage}
                        onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                      />
                      <select
                        className="field-input rx-med-freq"
                        value={med.frequency}
                        onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                      >
                        <option value="1-0-1">1-0-1 (Morning & Night)</option>
                        <option value="1-1-1">1-1-1 (Thrice daily)</option>
                        <option value="1-0-0">1-0-0 (Morning only)</option>
                        <option value="0-0-1">0-0-1 (Night only)</option>
                        <option value="SOS">SOS (As needed for pain)</option>
                      </select>
                      <input
                        type="text"
                        className="field-input rx-med-dur"
                        placeholder="Duration (e.g. 5 days)"
                        value={med.duration}
                        onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                      />
                      {medicines.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-med"
                          onClick={() => handleRemoveMedicineRow(idx)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn-add-med"
                    onClick={handleAddMedicineRow}
                  >
                    + Add Another Medication
                  </button>
                </div>

                <div className="structured-grid" style={{ marginTop: '1rem' }}>
                  <div className="field-group full-width">
                    <label>Clinical Advice & Lifestyle / Dietary Guidance</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g. Bed rest, avoid salt/fatty food, repeat ECG if chest pain recurs"
                      value={advice}
                      onChange={(e) => setAdvice(e.target.value)}
                    />
                  </div>

                  <div className="field-group">
                    <label>Follow-up Schedule</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g. 3 days / 1 week / SOS"
                      value={followUp}
                      onChange={(e) => setFollowUp(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`btn ${currentPatient.prescription ? 'btn-signed' : 'btn-primary'}`}
                  style={{ marginTop: '1.5rem' }}
                >
                  {currentPatient.prescription
                    ? '✓ Prescription Signed & Saved (Click to Re-sign)'
                    : '✍️ Sign & Issue Official Digital Prescription →'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Select a patient from the queue to review and issue prescriptions.</p>
          </div>
        )}
      </div>
    </div>
  );
}
