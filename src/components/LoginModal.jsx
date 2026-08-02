import React, { useState } from 'react';
import { DOCTOR_ROSTER, STAFF_ROSTER } from '../services/clinicalData';

export default function LoginModal({ role, onLogin, onCancel }) {
  const isDoctorRole = role === 'doctor';
  const [selectedProfileId, setSelectedProfileId] = useState(
    isDoctorRole ? DOCTOR_ROSTER[0].id : STAFF_ROSTER[0].id
  );
  const [pin, setPin] = useState('1234');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDoctorRole) {
      const doc = DOCTOR_ROSTER.find((d) => d.id === selectedProfileId);
      onLogin(doc);
    } else {
      const staff = STAFF_ROSTER.find((s) => s.id === selectedProfileId);
      onLogin(staff);
    }
  };

  const handleQuickSelect = (profile) => {
    setSelectedProfileId(profile.id);
    if (isDoctorRole) {
      onLogin(profile);
    } else {
      onLogin(profile);
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="glass-panel login-modal-card">
        <div className="login-modal-header">
          <div className="login-badge-icon">{isDoctorRole ? '👨‍⚕️' : '📋'}</div>
          <h2>{isDoctorRole ? 'Doctor Secure Portal Login' : 'Clinical Staff Portal Login'}</h2>
          <p className="login-subtitle">
            {isDoctorRole
              ? 'Log in to view patients assigned to your specific clinical specialty.'
              : 'Log in to review patient intakes and assign them to respective doctors.'}
          </p>
        </div>

        <div className="quick-login-section">
          <span className="quick-login-label">
            {isDoctorRole ? 'Select Doctor Profile (1-Click Login):' : 'Select Staff Account (1-Click Login):'}
          </span>
          <div className="profile-chips-grid">
            {isDoctorRole
              ? DOCTOR_ROSTER.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    className={`profile-card-btn ${selectedProfileId === doc.id ? 'active-profile' : ''}`}
                    onClick={() => handleQuickSelect(doc)}
                  >
                    <span className="profile-avatar">{doc.avatar}</span>
                    <div className="profile-info">
                      <strong>{doc.name}</strong>
                      <span className="profile-dept" style={{ color: doc.color }}>
                        {doc.specialty}
                      </span>
                      <span className="profile-cabin">{doc.cabin}</span>
                    </div>
                  </button>
                ))
              : STAFF_ROSTER.map((staff) => (
                  <button
                    key={staff.id}
                    type="button"
                    className={`profile-card-btn ${selectedProfileId === staff.id ? 'active-profile' : ''}`}
                    onClick={() => handleQuickSelect(staff)}
                  >
                    <span className="profile-avatar">{staff.avatar}</span>
                    <div className="profile-info">
                      <strong>{staff.name}</strong>
                      <span className="profile-dept">{staff.role}</span>
                      <span className="profile-cabin">{staff.desk}</span>
                    </div>
                  </button>
                ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label>Security PIN / Access Code (Demo PIN: 1234)</label>
            <input
              type="password"
              className="field-input"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              required
            />
          </div>

          <div className="login-actions-row">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              ← Back to Main Menu
            </button>
            <button type="submit" className="btn btn-primary">
              Authorize & Enter Portal →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
