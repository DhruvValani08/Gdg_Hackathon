import React, { useState } from 'react';
import Header from './components/Header';
import RoleSelector from './components/RoleSelector';
import PatientPortal from './components/PatientPortal';
import ReceptionPortal from './components/ReceptionPortal';
import DoctorPortal from './components/DoctorPortal';
import CampPortal from './components/CampPortal';
import LoginModal from './components/LoginModal';
import SafetyDisclaimer from './components/SafetyDisclaimer';
import { parseWithGemma } from './services/llm';
import { checkEmergencies } from './utils/emergencyRules';
import { INITIAL_INTAKES } from './services/clinicalData';

export default function App() {
  const [currentRole, setCurrentRole] = useState(null); // null = menu, 'patient' | 'reception' | 'doctor' | 'camp'
  const [activeStaff, setActiveStaff] = useState(null);
  const [activeDoctor, setActiveDoctor] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [rawInput, setRawInput] = useState('');
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [modelSource, setModelSource] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  // Central Master List of Intakes
  const [patientIntakes, setPatientIntakes] = useState(INITIAL_INTAKES);

  const handleSelectRole = (role) => {
    setCurrentRole(role);
    setParsedData(null);
    setRawInput('');
    setEmergencyAlerts([]);
    setErrorMessage(null);
  };

  const handleSwitchRole = () => {
    setCurrentRole(null);
    setParsedData(null);
    setRawInput('');
    setEmergencyAlerts([]);
    setErrorMessage(null);
  };

  const handleLogoutUser = () => {
    if (currentRole === 'reception') {
      setActiveStaff(null);
    } else if (currentRole === 'doctor') {
      setActiveDoctor(null);
    }
    // Retain currentRole so it immediately shows the respective login/account selection screen
  };

  const handleProcessIntake = async (inputText, isTransfer = false) => {
    setIsLoading(true);
    setErrorMessage(null);
    setRawInput(inputText);

    // 1. Run deterministic emergency rule engine
    const alerts = checkEmergencies(inputText);
    setEmergencyAlerts(alerts);

    try {
      // 2. Parse with Gemma
      const result = await parseWithGemma(inputText, isTransfer);
      setParsedData(result.data);
      setModelSource(result.source);
    } catch (err) {
      console.error('Processing error:', err);
      setErrorMessage('Failed to process note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add new patient intake into the triage pool
  const handleAddNewPatientIntake = (newIntake) => {
    setPatientIntakes((prev) => [newIntake, ...prev]);
  };

  // Staff assigns a specific Doctor
  const handleAssignDoctor = (patientId, doctorId, doctorName, note) => {
    setPatientIntakes((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            status: 'ASSIGNED_TO_DOCTOR',
            assignedDoctorId: doctorId,
            assignedDoctorName: doctorName,
            triage_note: note
          };
        }
        return p;
      })
    );
  };

  // Doctor issues and signs prescription
  const handleSavePrescription = (patientId, prescriptionData) => {
    setPatientIntakes((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            status: 'COMPLETED_BY_DOCTOR',
            prescription: prescriptionData
          };
        }
        return p;
      })
    );
  };

  const handleReset = () => {
    setParsedData(null);
    setRawInput('');
    setEmergencyAlerts([]);
    setErrorMessage(null);
  };

  return (
    <div className="app-wrapper">
      <div className="container">
        <Header
          currentRole={currentRole}
          onSwitchRole={handleSwitchRole}
          activeStaff={activeStaff}
          activeDoctor={activeDoctor}
          onLogoutUser={handleLogoutUser}
        />

        <SafetyDisclaimer />

        {errorMessage && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <div className="alert-content">
              <h4>Error</h4>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        <main className="main-content">
          {!currentRole ? (
            <RoleSelector onSelectRole={handleSelectRole} />
          ) : currentRole === 'reception' && !activeStaff ? (
            <LoginModal
              role="reception"
              onLogin={(staff) => setActiveStaff(staff)}
              onCancel={handleSwitchRole}
            />
          ) : currentRole === 'doctor' && !activeDoctor ? (
            <LoginModal
              role="doctor"
              onLogin={(doc) => setActiveDoctor(doc)}
              onCancel={handleSwitchRole}
            />
          ) : currentRole === 'patient' ? (
            <PatientPortal
              onSaveIntake={(tokenData) => handleAddNewPatientIntake(tokenData)}
              isLoading={isLoading}
              patientIntakes={patientIntakes}
            />
          ) : currentRole === 'reception' ? (
            <ReceptionPortal
              onProcessIntake={handleProcessIntake}
              isLoading={isLoading}
              parsedData={parsedData}
              rawInput={rawInput}
              emergencyAlerts={emergencyAlerts}
              modelSource={modelSource}
              onReset={handleReset}
              patientIntakes={patientIntakes}
              onAssignDoctor={handleAssignDoctor}
              onAddNewIntakeDirectly={handleAddNewPatientIntake}
            />
          ) : currentRole === 'doctor' ? (
            <DoctorPortal
              activeDoctor={activeDoctor}
              patientIntakes={patientIntakes}
              onSavePrescription={handleSavePrescription}
            />
          ) : currentRole === 'camp' ? (
            <CampPortal
              onProcessIntake={(text) => {
                handleProcessIntake(text, true);
                const campEntry = {
                  id: `CAMP-${Math.floor(1000 + Math.random() * 9000)}`,
                  patient_name: 'Camp Referral Patient',
                  phone: 'Rural Dispatch',
                  age: 'Not specified',
                  gender: 'Not specified',
                  type: 'Community Camp 108 Dispatch',
                  origin: 'Rural Health Camp Station',
                  chief_complaint: text.slice(0, 80),
                  duration: 'Acute',
                  severity: 8,
                  existing_conditions: ['Field Screened'],
                  current_medicines: ['None reported'],
                  allergies: ['Unverified'],
                  doctor_summary: text,
                  emergency_indicators: checkEmergencies(text),
                  status: 'PENDING_STAFF_REVIEW',
                  assignedDoctorId: null,
                  assignedDoctorName: null,
                  priority: 'EMERGENCY',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  prescription: null
                };
                handleAddNewPatientIntake(campEntry);
              }}
              isLoading={isLoading}
            />
          ) : null}
        </main>

        <footer className="footer">
          <p>Civil Sahai • Multilingual Clinical AI Platform • Powered by Google Gemma</p>
          <p className="subfooter">
            Integrated Patient Intake, Clinical Staff Triage & Specialist Doctor Prescription System
          </p>
        </footer>
      </div>
    </div>
  );
}
