import React, { useState } from 'react';

export default function MissingInfoPrompt({ missingItems, onAddInfo }) {
  const [activeItem, setActiveItem] = useState(null);
  const [detailValue, setDetailValue] = useState('');

  if (!missingItems || missingItems.length === 0) {
    return null;
  }

  const handleSave = (item) => {
    if (!detailValue.trim()) return;
    onAddInfo(item, detailValue.trim());
    setActiveItem(null);
    setDetailValue('');
  };

  return (
    <div className="missing-info-card">
      <div className="missing-header">
        <div className="missing-title-row">
          <span className="warning-icon">⚠️</span>
          <h4>Incomplete Clinical Details Detected</h4>
        </div>
        <p className="missing-desc">
          Gemma identified key missing clinical parameters. Ask the patient or update the details below to complete the intake:
        </p>
      </div>

      <div className="missing-list">
        {missingItems.map((item, idx) => (
          <div key={idx} className="missing-chip-container">
            {activeItem === item ? (
              <div className="missing-input-inline">
                <input
                  type="text"
                  placeholder={`Enter ${item}...`}
                  value={detailValue}
                  onChange={(e) => setDetailValue(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  className="btn-tiny-save"
                  onClick={() => handleSave(item)}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn-tiny-cancel"
                  onClick={() => {
                    setActiveItem(null);
                    setDetailValue('');
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
                  setActiveItem(item);
                  setDetailValue('');
                }}
              >
                <span>+ Clarify {item}</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
