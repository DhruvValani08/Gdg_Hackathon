export const DOCTOR_ROSTER = [
  {
    id: 'doc-cardio',
    name: 'Dr. Aarav Mehta',
    specialty: 'Cardiology & Chest Medicine',
    department: 'Cardiology',
    cabin: 'OPD Cabin 102 (1st Floor)',
    avatar: '👨‍⚕️',
    color: '#ef4444'
  },
  {
    id: 'doc-genmed',
    name: 'Dr. Priya Shah',
    specialty: 'General Medicine & Diabetology',
    department: 'General Medicine',
    cabin: 'OPD Cabin 105 (1st Floor)',
    avatar: '👩‍⚕️',
    color: '#3b82f6'
  },
  {
    id: 'doc-ortho',
    name: 'Dr. Rajesh Patel',
    specialty: 'Orthopedics & Joint Care',
    department: 'Orthopedics',
    cabin: 'OPD Cabin 204 (2nd Floor)',
    avatar: '👨‍⚕️',
    color: '#f59e0b'
  },
  {
    id: 'doc-emergency',
    name: 'Dr. Neha Verma',
    specialty: 'Emergency Medicine & Critical Care',
    department: 'Emergency & Trauma',
    cabin: 'Emergency Trauma Bay 1',
    avatar: '👩‍⚕️',
    color: '#dc2626'
  }
];

export const STAFF_ROSTER = [
  {
    id: 'staff-1',
    name: 'Sister Anjali Sharma',
    role: 'Senior Triage Nurse',
    desk: 'OPD Triage Desk A',
    avatar: '👩‍⚕️'
  },
  {
    id: 'staff-2',
    name: 'Vikram Joshi',
    role: 'Registration & Intake Officer',
    desk: 'Main Intake Counter 1',
    avatar: '👨‍💼'
  }
];

export const INITIAL_INTAKES = [
  {
    id: 'PAT-4821',
    patient_name: 'Ramesh Patel',
    phone: '98250 12345',
    age: '54 years',
    gender: 'Male',
    type: 'Walk-in OPD Intake',
    origin: 'Patient Self-Intake Kiosk',
    chief_complaint: 'Severe retrosternal chest pain and shortness of breath for 2 days. Active BP medications.',
    duration: '2 days',
    severity: 8,
    existing_conditions: ['Hypertension (High BP)'],
    current_medicines: ['Amlodipine 5mg OD'],
    allergies: ['No known drug allergies'],
    doctor_summary: '54-year-old male with 2-day history of worsening chest pain and dyspnea. Known hypertensive on Amlodipine. High clinical concern for acute coronary event.',
    emergency_indicators: ['Chest pain - Immediate cardiac evaluation needed'],
    status: 'ASSIGNED_TO_DOCTOR',
    assignedDoctorId: 'doc-cardio',
    assignedDoctorName: 'Dr. Aarav Mehta (Cardiology)',
    priority: 'EMERGENCY',
    timestamp: '10:15 AM',
    prescription: null
  },
  {
    id: 'PAT-3190',
    patient_name: 'Shantaben Vankar',
    phone: '94280 87654',
    age: '62 years',
    gender: 'Female',
    type: 'Walk-in OPD Intake',
    origin: 'Patient Self-Intake Kiosk',
    chief_complaint: 'Knee joint pain, stiffness, and severe swelling for 1 week. Difficulty in walking.',
    duration: '1 week',
    severity: 7,
    existing_conditions: ['Osteoarthritis', 'Diabetes Mellitus'],
    current_medicines: ['Metformin 500mg BD'],
    allergies: ['Penicillin allergy'],
    doctor_summary: '62-year-old female presenting with 1-week history of right knee swelling and pain. Diabetic on Metformin. Penicillin allergic.',
    emergency_indicators: ['None detected'],
    status: 'ASSIGNED_TO_DOCTOR',
    assignedDoctorId: 'doc-ortho',
    assignedDoctorName: 'Dr. Rajesh Patel (Orthopedics)',
    priority: 'ROUTINE',
    timestamp: '10:40 AM',
    prescription: null
  },
  {
    id: 'TR-9042',
    patient_name: 'Ketan Solanki',
    phone: '97120 45678',
    age: '38 years',
    gender: 'Male',
    type: 'Emergency Rural Transfer',
    origin: 'PHC Dholka (108 Ambulance Dispatch)',
    chief_complaint: 'Suspected venomous snakebite on left foot. Vomited twice during transit.',
    duration: '3 hours',
    severity: 9,
    existing_conditions: ['None reported'],
    current_medicines: ['2 vials Anti-Snake Venom (ASV) given at PHC Dholka at 09:30 AM'],
    allergies: ['Unverified'],
    doctor_summary: 'SBAR Transfer: 38M transferred from PHC Dholka post-snakebite. 2 vials ASV administered. Vomited in transit. Needs immediate 20WBCT coagulation check.',
    emergency_indicators: ['SNAKEBITE ENVENOMATION: Immediate Toxicology & ASV protocol required'],
    status: 'ASSIGNED_TO_DOCTOR',
    assignedDoctorId: 'doc-emergency',
    assignedDoctorName: 'Dr. Neha Verma (Emergency)',
    priority: 'EMERGENCY',
    timestamp: '11:05 AM',
    prescription: null
  },
  {
    id: 'PAT-7714',
    patient_name: 'Mohammad Ansari',
    phone: '99090 33211',
    age: '42 years',
    gender: 'Male',
    type: 'Walk-in OPD Intake',
    origin: 'Patient Self-Intake Voice Input',
    chief_complaint: 'High fever, severe body ache, and persistent headache for 4 days.',
    duration: '4 days',
    severity: 6,
    existing_conditions: ['None reported'],
    current_medicines: ['Paracetamol 650mg SOS'],
    allergies: ['None'],
    doctor_summary: '42-year-old male with 4-day acute pyrexia and myalgia. Ready for doctor evaluation and fever workup.',
    emergency_indicators: ['None detected'],
    status: 'PENDING_STAFF_REVIEW', // Needs staff to assign a doctor!
    assignedDoctorId: null,
    assignedDoctorName: null,
    priority: 'URGENT',
    timestamp: '11:20 AM',
    prescription: null
  }
];
