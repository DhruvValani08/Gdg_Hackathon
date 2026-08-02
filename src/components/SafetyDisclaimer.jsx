import React from 'react';

export default function SafetyDisclaimer() {
  return (
    <div className="safety-banner">
      <div className="safety-icon">🛡️</div>
      <div className="safety-text">
        <strong>Safety & Responsible-AI Protocol:</strong> This assistant structures intake notes only. It does <em>not</em> provide medical diagnoses, treatment plans, or dosage advice. All summaries require human review and verification by certified medical professionals.
      </div>
    </div>
  );
}
