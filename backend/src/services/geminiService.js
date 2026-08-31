const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Intelligent AI Triage Service
 * Uses Google Gemini API if GEMINI_API_KEY is defined in .env
 * Fallback to robust NLP Heuristic engine if key is absent.
 */
async function triageSymptoms({ symptoms, age, gender, isPregnant, language = 'English' }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== '') {
    try {
      console.log('🤖 Invoking Google Gemini AI for symptom triage...');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
You are an expert AI Triage Assistant in a smart hospital system.
Analyze the following patient information and return a strict JSON object with NO markdown formatting around it.

Patient Data:
- Symptoms: "${symptoms}"
- Age: ${age}
- Gender: "${gender}"
- Is Pregnant: ${isPregnant ? 'Yes' : 'No'}
- Output Language Preference: "${language}"

JSON Output schema:
{
  "triageCategory": "EMERGENCY" | "VULNERABLE" | "GENERAL",
  "severityScore": number (1 to 10),
  "department": "Emergency" | "Cardiology" | "Orthopedics" | "Pulmonology" | "Neurology" | "Pediatrics" | "General OPD",
  "urgencyLevel": "CRITICAL / IMMEDIATE" | "HIGH URGENCY" | "MODERATE" | "ROUTINE",
  "recommendedAction": "Short summary of what patient should do next",
  "whatToBring": ["Government ID (Aadhaar/Voter ID)", "Medical Records", "Ayushman Card if applicable"],
  "govtSchemeNote": "Brief advice on Ayushman Bharat / AB-PMJAY scheme eligibility based on symptoms/condition"
}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanJsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJsonStr);
    } catch (err) {
      console.warn('⚠️ Gemini API call failed or rate limited. Falling back to heuristic NLP triage engine:', err.message);
    }
  }

  // Fallback Heuristic Engine
  return fallbackTriageEngine({ symptoms, age, gender, isPregnant, language });
}

function fallbackTriageEngine({ symptoms, age, gender, isPregnant, language }) {
  const symLower = (symptoms || '').toLowerCase();
  let triageCategory = 'GENERAL';
  let severityScore = 3;
  let department = 'General OPD';
  let urgencyLevel = 'ROUTINE';
  let recommendedAction = 'Proceed to General OPD counter for routine registration.';

  // Critical Emergency patterns
  const emergencyKeywords = [
    'chest pain', 'heart attack', 'shortness of breath', 'can\'t breathe', 'unable to breathe',
    'severe bleeding', 'stroke', 'unconscious', 'seizure', 'paralysis', 'head injury', 'gunshot', 'stab',
    'choking', 'anaphylaxis', 'poison'
  ];

  // Vulnerable patterns
  const vulnerableKeywords = ['pregnant', 'elderly', 'wheelchair', 'infant', 'high fever', 'fracture', 'trauma', 'dizziness'];

  const isEmergency = emergencyKeywords.some(kw => symLower.includes(kw));
  const isVulnerable = isPregnant || (age >= 65) || (age <= 2) || vulnerableKeywords.some(kw => symLower.includes(kw));

  if (isEmergency) {
    triageCategory = 'EMERGENCY';
    severityScore = 9;
    urgencyLevel = 'CRITICAL / IMMEDIATE';
    department = symLower.includes('chest') || symLower.includes('heart') ? 'Cardiology' : 'Emergency';
    recommendedAction = '🚨 URGENT: Report immediately to Emergency Triage Desk / Trauma Ward without waiting in main queue.';
  } else if (isVulnerable) {
    triageCategory = 'VULNERABLE';
    severityScore = 6;
    urgencyLevel = 'HIGH URGENCY (Priority Queue)';
    if (symLower.includes('fracture') || symLower.includes('bone')) department = 'Orthopedics';
    else if (symLower.includes('cough') || symLower.includes('asthma') || symLower.includes('breathing')) department = 'Pulmonology';
    else if (age <= 12) department = 'Pediatrics';
    else department = 'General OPD';
    recommendedAction = 'Proceed to Priority Counter for Vulnerable Patients (Elderly/Maternal/Pediatric).';
  } else {
    // General OPD routing rules
    if (symLower.includes('bone') || symLower.includes('joint') || symLower.includes('leg pain') || symLower.includes('back pain')) {
      department = 'Orthopedics';
    } else if (symLower.includes('heart') || symLower.includes('bp') || symLower.includes('pulse')) {
      department = 'Cardiology';
    } else if (symLower.includes('headache') || symLower.includes('numbness') || symLower.includes('neuro')) {
      department = 'Neurology';
    } else if (symLower.includes('cough') || symLower.includes('cold') || symLower.includes('fever')) {
      department = 'Pulmonology';
    }
  }

  // Health Scheme Note
  let govtSchemeNote = 'Eligible patients holding Ayushman Bharat (AB-PMJAY) or state health cards can present them at cash desk for 100% cashless treatment.';
  if (triageCategory === 'EMERGENCY') {
    govtSchemeNote = 'Emergency pre-authorization under Ayushman Bharat (AB-PMJAY) is automatically activated for critical admissions.';
  }

  return {
    triageCategory,
    severityScore,
    department,
    urgencyLevel,
    recommendedAction,
    whatToBring: [
      'Government Photo ID (Aadhaar / Voter ID)',
      'Previous Medical Reports / Prescriptions',
      'Ayushman Card / Insurance Card (If applicable)'
    ],
    govtSchemeNote
  };
}

module.exports = { triageSymptoms };
