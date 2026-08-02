import React from 'react';

const ROLES = [
  {
    id: 'patient',
    icon: '🧑‍🤝‍🧑',
    title: 'Patient Self-Intake',
    target: 'For Patients & Family Members',
    desc: 'Speak or type symptoms in Gujarati, Hindi, or English. Generate a digital intake pass to show at clinic registration.',
    badge: 'Voice-First • Multi-language',
    color: '#3b82f6',
    borderGlow: 'rgba(59, 130, 246, 0.4)'
  },
  {
    id: 'reception',
    icon: '📋',
    title: 'Clinic Reception & Nursing Staff',
    target: 'For OPD & Intake Nurses',
    desc: 'Process walk-in patients, structure colloquial descriptions with Gemma, resolve missing details, and log rural transfers.',
    badge: 'OPD Intake • Gap Resolution',
    color: '#a855f7',
    borderGlow: 'rgba(168, 85, 247, 0.4)'
  },
  {
    id: 'doctor',
    icon: '👨‍⚕️',
    title: 'Doctor Reviewing Summaries',
    target: 'For Physicians & ER Registrars',
    desc: 'Review objective doctor-ready summaries, emergency red-flags, and SBAR inter-hospital transfer dossiers.',
    badge: 'SBAR Dossier • Zero-Diagnosis',
    color: '#06b6d4',
    borderGlow: 'rgba(6, 182, 212, 0.4)'
  },
  {
    id: 'camp',
    icon: '⛺',
    title: 'Community Health Camps',
    target: 'For Field Paramedics & Rural PHCs',
    desc: 'Offline-ready rapid screening for rural camps, mobile health vans, and 108 ambulance referral dispatch.',
    badge: 'Offline Gemma • Rural Dispatch',
    color: '#10b981',
    borderGlow: 'rgba(16, 185, 129, 0.4)'
  }
];

export default function RoleSelector({ onSelectRole }) {
  return (
    <div className="role-selector-container">
      <div className="role-selector-header">
        <div className="pill-badge pill-gradient">Gemma 4 Healthcare Portal</div>
        <h2>Select Your User Persona</h2>
        <p className="role-subtitle">
          Civil Sahai adapts its clinical interface specifically for patients, reception staff, doctors, and community health camps.
        </p>
      </div>

      <div className="roles-grid">
        {ROLES.map((role) => (
          <div
            key={role.id}
            className="role-card glass-panel"
            style={{ '--role-color': role.color, '--role-glow': role.borderGlow }}
            onClick={() => onSelectRole(role.id)}
          >
            <div className="role-card-top">
              <span className="role-icon">{role.icon}</span>
              <span className="role-badge" style={{ color: role.color, borderColor: role.borderGlow }}>
                {role.badge}
              </span>
            </div>

            <h3 className="role-title">{role.title}</h3>
            <span className="role-target">{role.target}</span>
            <p className="role-desc">{role.desc}</p>

            <button type="button" className="btn-role-enter" style={{ background: role.color }}>
              Enter as {role.title.split(' ')[0]} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
