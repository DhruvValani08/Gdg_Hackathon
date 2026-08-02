import React, { useState } from 'react';
import IntakeForm from './IntakeForm';
import SummaryView from './SummaryView';
import TransferIntakeForm from './TransferIntakeForm';
import TransferSummaryView from './TransferSummaryView';
import { DOCTOR_ROSTER } from '../services/clinicalData';

export default function ReceptionPortal({
  onProcessIntake,
  isLoading,
  parsedData,
  rawInput,
  emergencyAlerts,
  modelSource,
  onReset,
  patientIntakes,
  onAssignDoctor,
  onAddNewIntakeDirectly
}) {
  const [receptionTab, setReceptionTab] = useState('triage_queue'); // 'triage_queue' | 'walkin' | 'inbound_transfer'
  const [selectedQueuePatientId, setSelectedQueuePatientId] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(DOCTOR_ROSTER[0].id);
  const [assignmentNote, setAssignmentNote] = useState('');
  const [tokenSearch, setTokenSearch] = useState('');
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const selectedPatient = patientIntakes.find((p) => p.id === selectedQueuePatientId) || patientIntakes[0];

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const doc = DOCTOR_ROSTER.find((d) => d.id === selectedDoctorId);
    if (!doc) return;

    onAssignDoctor(selectedPatient.id, doc.id, `${doc.name} (${doc.department})`, assignmentNote);
    showToast(`✓ Assigned ${selectedPatient.patient_name} (${selectedPatient.id}) to ${doc.name}!`);
    setAssignmentNote('');
  };

  const handleTokenLookup = (e) => {
    e.preventDefault();
    if (!tokenSearch.trim()) return;

    const found = patientIntakes.find(
      (p) => p.id.toLowerCase() === tokenSearch.trim().toLowerCase()
    );

    if (found) {
      setSelectedQueuePatientId(found.id);
      setReceptionTab('triage_queue');
      showToast(`✓ Found Patient Token: ${found.id} (${found.patient_name})`);
    } else {
      showToast(`⚠️ Token ${tokenSearch} not found in system.`);
    }
  };

  const handleForwardNewIntakeToTriage = () => {
    if (!parsedData) return;

    const newId = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEntry = {
      id: newId,
      patient_name: parsedData.patient_name || 'Walk-in Patient',
      phone: 'Not provided',
      age: parsedData.age || 'Not specified',
      gender: parsedData.gender || 'Not specified',
      type: 'Reception Walk-in Intake',
      origin: 'Reception OPD Counter',
      chief_complaint: parsedData.chief_complaint || rawInput.slice(0, 75),
      duration: parsedData.duration || 'Not specified',
      severity: 6,
      existing_conditions: parsedData.existing_conditions || ['None reported'],
      current_medicines: parsedData.current_medicines || ['None reported'],
      allergies: parsedData.allergies || ['None reported'],
      doctor_summary: parsedData.doctor_summary || 'Intake recorded by reception staff.',
      emergency_indicators: emergencyAlerts || [],
      status: 'PENDING_STAFF_REVIEW',
      assignedDoctorId: null,
      assignedDoctorName: null,
      priority: (emergencyAlerts && emergencyAlerts.length > 0) ? 'EMERGENCY' : 'ROUTINE',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      prescription: null
    };

    onAddNewIntakeDirectly(newEntry);
    onReset();
    setReceptionTab('triage_queue');
    setSelectedQueuePatientId(newId);
    showToast(`✓ Patient Intake ${newId} added to Triage Queue!`);
  };

  return (
    <div className="portal-container reception-portal">
      <div className="portal-header">
        <div className="portal-title-group">
          <span className="portal-tag tag-purple">📋 Clinical Staff & Triage Nursing Desk</span>
          <h2>Intake Review, Triage & Doctor Assignment Hub</h2>
          <p className="portal-subtitle">
            Review patient self-intakes, assess emergencies, and route patients to the appropriate department specialist.
          </p>
        </div>

        <div className="reception-submode-toggle">
          <button
            type="button"
            className={`submode-btn ${receptionTab === 'triage_queue' ? 'active' : ''}`}
            onClick={() => setReceptionTab('triage_queue')}
          >
            📥 Patient Triage & Doctor Routing ({patientIntakes.filter((p) => p.status === 'PENDING_STAFF_REVIEW').length} Pending)
          </button>
          <button
            type="button"
            className={`submode-btn ${receptionTab === 'walkin' ? 'active' : ''}`}
            onClick={() => setReceptionTab('walkin')}
          >
            📝 New Walk-In Intake
          </button>
          <button
            type="button"
            className={`submode-btn ${receptionTab === 'inbound_transfer' ? 'active' : ''}`}
            onClick={() => setReceptionTab('inbound_transfer')}
          >
            🚑 Inbound Rural Transfer
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="alert alert-toast" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#6ee7b7' }}>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TAB 1: TRIAGE & DOCTOR ASSIGNMENT QUEUE */}
      {receptionTab === 'triage_queue' && (
        <div className="staff-triage-layout">
          {/* Quick Token Search */}
          <div className="token-lookup-bar glass-panel full-width">
            <form onSubmit={handleTokenLookup} className="token-search-form">
              <div className="token-search-input-wrap">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Look up Patient Token ID (e.g. PAT-4821, PAT-7714)..."
                  value={tokenSearch}
                  onChange={(e) => setTokenSearch(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-search-token">
                Locate Patient Token
              </button>
            </form>
          </div>

          <div className="doctor-split-view">
            {/* Left Column: Intakes List */}
            <div className="doctor-queue-list">
              <div className="queue-header">
                <h3>Incoming Patient Intakes</h3>
                <span className="queue-count">{patientIntakes.length} Total</span>
              </div>

              <div className="queue-items">
                {patientIntakes.map((p) => {
                  const isSelected = selectedPatient?.id === p.id;
                  const isPending = p.status === 'PENDING_STAFF_REVIEW';
                  const isEmergency = p.priority === 'EMERGENCY';

                  return (
                    <div
                      key={p.id}
                      className={`queue-card ${isSelected ? 'selected' : ''} ${isEmergency ? 'emergency-card' : ''}`}
                      onClick={() => setSelectedQueuePatientId(p.id)}
                    >
                      <div className="queue-card-top">
                        <span className="patient-id">{p.id}</span>
                        <span className={`priority-badge ${isEmergency ? 'badge-emergency' : isPending ? 'badge-urgent' : 'status-badge'}`}>
                          {isEmergency ? '🔴 EMERGENCY' : isPending ? '🟡 NEEDS DOCTOR' : '🟢 ASSIGNED'}
                        </span>
                      </div>

                      <div className="patient-name">{p.patient_name}</div>
                      <span className="patient-meta">
                        {p.age} • {p.type}
                      </span>
                      <p className="queue-chief-preview">{p.chief_complaint}</p>

                      <div className="queue-card-footer">
                        <span>🕒 {p.timestamp}</span>
                        {p.assignedDoctorName ? (
                          <span className="assigned-tag">➔ {p.assignedDoctorName.split(' ')[1]}</span>
                        ) : (
                          <span style={{ color: '#fbbf24', fontWeight: 700 }}>Unassigned</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Intake Details & Doctor Assignment Pad */}
            {selectedPatient && (
              <div className="glass-panel staff-assignment-panel">
                <div className="detail-top-bar">
                  <div>
                    <span className="portal-tag">Patient Intake Review</span>
                    <h2>{selectedPatient.patient_name} ({selectedPatient.age})</h2>
                    <p className="detail-subtitle">
                      Token ID: <strong>{selectedPatient.id}</strong> • Origin: {selectedPatient.origin}
                    </p>
                  </div>

                  <div className="assignment-status-chip">
                    {selectedPatient.assignedDoctorName ? (
                      <span className="pill-badge" style={{ borderColor: '#10b981', color: '#6ee7b7' }}>
                        ✓ Assigned to: {selectedPatient.assignedDoctorName}
                      </span>
                    ) : (
                      <span className="pill-badge" style={{ borderColor: '#f59e0b', color: '#fbbf24' }}>
                        🟡 Pending Doctor Assignment
                      </span>
                    )}
                  </div>
                </div>

                {selectedPatient.emergency_indicators && selectedPatient.emergency_indicators.length > 0 && selectedPatient.emergency_indicators[0] !== 'None' && selectedPatient.emergency_indicators[0] !== 'None detected' && (
                  <div className="alert emergency-alert-pulse">
                    <span className="alert-icon">🚨</span>
                    <div className="alert-content">
                      <h4>Emergency Red Flag Alert</h4>
                      <ul>
                        {selectedPatient.emergency_indicators.map((em, idx) => (
                          <li key={idx}>{em}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="detail-sections-grid">
                  <div className="detail-section full">
                    <label>Chief Complaint & Symptoms</label>
                    <div className="detail-value highlight">{selectedPatient.chief_complaint}</div>
                  </div>

                  <div className="detail-section">
                    <label>Duration / Severity</label>
                    <div className="detail-value">
                      {selectedPatient.duration} (Severity: {selectedPatient.severity}/10)
                    </div>
                  </div>

                  <div className="detail-section">
                    <label>Chronic Medical History</label>
                    <div className="detail-value">
                      {Array.isArray(selectedPatient.existing_conditions)
                        ? selectedPatient.existing_conditions.join(', ')
                        : selectedPatient.existing_conditions}
                    </div>
                  </div>

                  <div className="detail-section">
                    <label>Active Medications</label>
                    <div className="detail-value">
                      {Array.isArray(selectedPatient.current_medicines)
                        ? selectedPatient.current_medicines.join(', ')
                        : selectedPatient.current_medicines}
                    </div>
                  </div>

                  <div className="detail-section">
                    <label>Known Allergies</label>
                    <div className="detail-value">
                      {Array.isArray(selectedPatient.allergies)
                        ? selectedPatient.allergies.join(', ')
                        : selectedPatient.allergies}
                    </div>
                  </div>

                  <div className="detail-section full">
                    <label>Gemma Objective Clinical Synthesis for Doctor</label>
                    <div className="detail-value">{selectedPatient.doctor_summary}</div>
                  </div>
                </div>

                {/* DOCTOR ASSIGNMENT FORM */}
                <form onSubmit={handleAssignSubmit} className="doctor-assignment-card">
                  <div className="assignment-form-header">
                    <h4>👨‍⚕️ Assign to Department Specialist Doctor</h4>
                    <span className="sublabel">Select the appropriate physician based on symptoms</span>
                  </div>

                  <div className="structured-grid">
                    <div className="field-group full-width">
                      <label>Select Doctor & Department</label>
                      <select
                        className="field-input select-doctor-dropdown"
                        value={selectedDoctorId}
                        onChange={(e) => setSelectedDoctorId(e.target.value)}
                      >
                        {DOCTOR_ROSTER.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.name} — {doc.specialty} ({doc.cabin})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="field-group full-width">
                      <label>Staff Triage Note / Priority Instructions (Optional)</label>
                      <input
                        type="text"
                        className="field-input"
                        placeholder="e.g. Priority chest pain patient, requested ECG before consult"
                        value={assignmentNote}
                        onChange={(e) => setAssignmentNote(e.target.value)}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-assign-submit">
                    🚀 Confirm & Route Intake to Doctor's Queue →
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: NEW WALKIN INTAKE */}
      {receptionTab === 'walkin' && (
        <div>
          {!parsedData ? (
            <IntakeForm
              onSubmit={(text) => onProcessIntake(text, false)}
              isLoading={isLoading}
            />
          ) : (
            <div className="reception-summary-wrapper">
              <SummaryView
                data={parsedData}
                rawInput={rawInput}
                emergencyAlerts={emergencyAlerts}
                modelSource={modelSource}
                onReset={onReset}
              />
              <div className="reception-forward-bar">
                <button
                  type="button"
                  className="btn btn-forward-doctor"
                  onClick={handleForwardNewIntakeToTriage}
                >
                  🚀 Add to Triage Queue & Assign Doctor →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INBOUND RURAL TRANSFER */}
      {receptionTab === 'inbound_transfer' && (
        <div>
          {!parsedData ? (
            <TransferIntakeForm
              onSubmit={(text) => onProcessIntake(text, true)}
              isLoading={isLoading}
            />
          ) : (
            <div className="reception-summary-wrapper">
              <TransferSummaryView
                data={parsedData}
                rawInput={rawInput}
                emergencyAlerts={emergencyAlerts}
                modelSource={modelSource}
                onReset={onReset}
              />
              <div className="reception-forward-bar">
                <button
                  type="button"
                  className="btn btn-forward-doctor"
                  onClick={handleForwardNewIntakeToTriage}
                >
                  🚀 Add Transfer to Triage Queue & Assign Emergency Doctor →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
