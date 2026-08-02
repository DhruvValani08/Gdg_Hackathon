export const checkEmergencies = (text) => {
  const lowerText = text.toLowerCase();
  const alerts = [];

  const emergencyKeywords = [
    { keywords: ['છાતીમાં દુખે', 'chest pain', 'छाती में दर्द'], message: 'Potential cardiac issue reported (Chest Pain).' },
    { keywords: ['શ્વાસ લેવામાં તકલીફ', 'breathing difficulty', 'shortness of breath', 'सांस लेने में दिक्कत'], message: 'Respiratory distress reported (Breathing Difficulty).' },
    { keywords: ['બેભાન', 'unconscious', 'fainted', 'बेहोश'], message: 'Loss of consciousness reported.' },
    { keywords: ['ખૂબ લોહી', 'severe bleeding', 'भारी खून'], message: 'Severe bleeding reported.' },
  ];

  emergencyKeywords.forEach(rule => {
    if (rule.keywords.some(keyword => lowerText.includes(keyword))) {
      alerts.push(rule.message);
    }
  });

  return alerts;
};
