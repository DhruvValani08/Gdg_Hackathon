import React from 'react';

const ROLE_INFO = {
  patient: { label: 'Patient Self-Intake', icon: '🧑‍🤝‍🧑', color: '#3b82f6' },
  reception: { label: 'Reception & Nursing Staff', icon: '📋', color: '#a855f7' },
  doctor: { label: 'Doctor Review & Prescription', icon: '👨‍⚕️', color: '#06b6d4' },
  camp: { label: 'Community Health Camp', icon: '⛺', color: '#10b981' }
};

export default function Header({
  currentRole,
  onSwitchRole,
  activeStaff,
  activeDoctor,
  onLogoutUser,
  theme = 'dark',
  onToggleTheme
}) {
  const activeRoleData = currentRole ? ROLE_INFO[currentRole] : null;

  return (
    <header className="header">
      <div className="header-badge-row">
        <span className="pill-badge">🏥 Multilingual Clinical AI</span>
        <span className="pill-badge pill-gradient">Gemma Powered</span>
        
        {activeRoleData && (
          <span
            className="pill-badge active-role-pill"
            style={{ borderColor: activeRoleData.color, color: activeRoleData.color }}
          >
            {activeRoleData.icon} {activeRoleData.label}
          </span>
        )}

        {activeStaff && currentRole === 'reception' && (
          <span className="pill-badge user-auth-badge">
            👤 Staff: {activeStaff.name} ({activeStaff.role})
          </span>
        )}

        {activeDoctor && currentRole === 'doctor' && (
          <span className="pill-badge user-auth-badge doctor-badge-glow">
            {activeDoctor.avatar} Logged in: {activeDoctor.name} — {activeDoctor.specialty}
          </span>
        )}

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          <span className="theme-toggle-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
          <span className="theme-toggle-text">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </div>

      <h1>Civil Sahai</h1>
      <p className="header-subtitle">
        Intelligent Multilingual Clinical Intake & Rural-to-Urban Referral Synthesizer
      </p>

      {currentRole && (
        <div className="role-switch-container">
          <button
            type="button"
            className="btn-switch-role"
            onClick={onSwitchRole}
          >
            🏠 Main Menu (મુખ્ય મેનુ)
          </button>
          
          {((currentRole === 'reception' && activeStaff) || (currentRole === 'doctor' && activeDoctor)) && (
            <button
              type="button"
              className="btn-logout-role"
              onClick={onLogoutUser}
            >
              {currentRole === 'doctor' ? '👨‍⚕️ Switch Doctor Account' : '📋 Switch Staff Account'}
            </button>
          )}
        </div>
      )}
    </header>
  );
}
