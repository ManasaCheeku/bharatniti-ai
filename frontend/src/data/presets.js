export const SAMPLE_REQUESTS = [
  {
    id: 1,
    title: "Mysuru Hospital Access (Kannada)",
    lang: "Kannada",
    state: "Karnataka",
    district: "Mysuru",
    category: "Healthcare",
    text: "ನಮ್ಮ ಊರಿನಲ್ಲಿ ಆಸ್ಪತ್ರೆ ಇಲ್ಲ. ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ 30 ಕಿಲೋಮೀಟರ್ ದೂರ ಹೋಗಬೇಕು."
  },
  {
    id: 2,
    title: "Bankura Hospital Access (Bengali)",
    lang: "Bengali",
    state: "West Bengal",
    district: "Bankura",
    category: "Healthcare",
    text: "আমাদের গ্রামে কোনো হাসপাতাল নেই। জরুরি সময়ে প্রায় ৩০ কিলোমিটার যেতে হয়।"
  },
  {
    id: 3,
    title: "Varanasi Monsoon Road Quality (Hindi)",
    lang: "Hindi",
    state: "Uttar Pradesh",
    district: "Varanasi",
    category: "Roads",
    text: "हमारे गांव में अच्छी सड़क नहीं है और बारिश के समय सड़क पूरी तरह खराब हो जाती है। एम्बुलेंस भी नहीं आ पाती।"
  },
  {
    id: 4,
    title: "Dharmapuri Health Access (Tamil)",
    lang: "Tamil",
    state: "Tamil Nadu",
    district: "Dharmapuri",
    category: "Healthcare",
    text: "எங்கள் கிராமத்தில் ஆரம்ப சுகாதார நிலையம் இல்லை. அவசர தேவைக்கு 25 கி.மீ செல்ல வேண்டும்."
  },
  {
    id: 5,
    title: "Warangal Rural Hospital (Telugu)",
    lang: "Telugu",
    state: "Telangana",
    district: "Warangal",
    category: "Healthcare",
    text: "మా ఊరిలో మంచి ఆసుపత్రి లేదు. అత్యవసర సమయంలో 35 కిలోమీటర్లు ప్రయాణించాలి."
  },
  {
    id: 6,
    title: "Latur Tap Water Scarcity (English)",
    lang: "English",
    state: "Maharashtra",
    district: "Latur",
    category: "Water & Sanitation",
    text: "Severe drinking water scarcity in our locality. Water supply comes only once every 4 days for 1 hour."
  }
];

export const STATES_AND_DISTRICTS = {
  "Karnataka": ["Mysuru", "Belagavi", "Shivamogga", "Mandya", "Bengaluru Urban"],
  "West Bengal": ["Bankura", "Kolkata", "Howrah"],
  "Uttar Pradesh": ["Varanasi", "Mirzapur", "Bundelkhand", "Lucknow"],
  "Tamil Nadu": ["Dharmapuri", "Chennai", "Coimbatore"],
  "Telangana": ["Warangal", "Hyderabad", "Nizamabad"],
  "Maharashtra": ["Latur", "Thane", "Mumbai Suburban", "Pune"],
  "Bihar": ["Gaya", "Darbhanga", "Patna"],
  "Rajasthan": ["Barmer", "Jalor", "Jaipur"],
  "Gujarat": ["Dahod", "Ahmedabad", "Surat"],
  "Kerala": ["Palakkad", "Ernakulam", "Thiruvananthapuram"]
};

export const CATEGORIES = [
  "Healthcare",
  "Education",
  "Roads",
  "Public Transport",
  "Water & Sanitation",
  "Electricity",
  "Digital Infrastructure",
  "Housing",
  "Agriculture",
  "Environment",
  "Public Safety",
  "Other"
];

export const LANGUAGES = [
  { code: "Auto-detect", name: "Auto-detect Language", bcp47: "en-IN" },
  { code: "Kannada", name: "ಕನ್ನಡ (Kannada)", bcp47: "kn-IN", label: "ಕನ್ನಡ", flag: "🟡" },
  { code: "Bengali", name: "বাংলা (Bengali)", bcp47: "bn-IN", label: "বাংলা", flag: "🇧🇩" },
  { code: "Hindi", name: "हिन्दी (Hindi)", bcp47: "hi-IN", label: "हिन्दी", flag: "🟠" },
  { code: "Tamil", name: "தமிழ் (Tamil)", bcp47: "ta-IN", label: "தமிழ்", flag: "🔵" },
  { code: "Telugu", name: "తెలుగు (Telugu)", bcp47: "te-IN", label: "తెలుగు", flag: "🟢" },
  { code: "English", name: "English (English)", bcp47: "en-IN", label: "English", flag: "🌐" }
];

export const VOICEGUIDE_PROMPTS = {
  Kannada: {
    welcome: "ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಹೇಳಿ. ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.",
    location: "ನೀವು ಯಾವ ಊರು ಅಥವಾ ಪ್ರದೇಶದಲ್ಲಿ ಇದ್ದೀರಿ?",
    categoryConfirm: (cat) => `ನಿಮ್ಮ ಸಮಸ್ಯೆ ${cat || 'ಆರೋಗ್ಯ ಮೂಲಸೌಕರ್ಯ'} ಗೆ ಸಂಬಂಧಿಸಿದೆಯೇ?`,
    videoPrompt: "ಸಮಸ್ಯೆಯನ್ನು ತೋರಿಸಲು ನೀವು ವೀಡಿಯೊ ತೆಗೆದುಕೊಳ್ಳಲು ಬಯಸುತ್ತೀರಾ?",
    summary: (dist, cat) => `ನೀವು ${dist} ಜಿಲ್ಲೆಯ ಪ್ರದೇಶದಲ್ಲಿ ${cat} ಸಮಸ್ಯೆಯನ್ನು ತಿಳಿಸಿದ್ದೀರಿ. ಇದನ್ನು ನೋಂದಾಯಿಸಬೇಕೇ?`,
    success: (id) => `ನಿಮ್ಮ ಮನವಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ಮನವಿ ಸಂಖ್ಯೆ ${id}.`
  },
  Bengali: {
    welcome: "আপনার সমস্যাটি বলুন। আমি আপনাকে সাহায্য করব।",
    location: "আপনি কোন জেলা বা এলাকায় থাকেন?",
    categoryConfirm: (cat) => `আপনার সমস্যাটি কি ${cat || 'স্বাস্থ্য পরিষেবা'} সংক্রান্ত?`,
    videoPrompt: "আপনি কি সমস্যাটি ভিডিওতে দেখাতে চান?",
    summary: (dist, cat) => `আপনি ${dist} জেলায় ${cat} সংক্রান্ত সমস্যার কথা জানিয়েছেন। আপনি কি এটি নথিভুক্ত করতে চান?`,
    success: (id) => `আপনার অভিযোগ সফলভাবে নথিভুক্ত হয়েছে। আপনার অভিযোগ নম্বর ${id}।`
  },
  Hindi: {
    welcome: "अपनी समस्या बताएं। मैं आपकी मदद करूंगा।",
    location: "आप किस जिले या इलाके में रहते हैं?",
    categoryConfirm: (cat) => `क्या आपकी समस्या ${cat || 'स्वास्थ्य सेवा'} से संबंधित है?`,
    videoPrompt: "क्या आप समस्या का वीडियो रिकॉर्ड करना चाहते हैं?",
    summary: (dist, cat) => `आपने ${dist} जिले में ${cat} की समस्या बताई है। क्या आप इसे दर्ज करना चाहते हैं?`,
    success: (id) => `आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है। आपकी शिकायत संख्या ${id} है।`
  },
  Tamil: {
    welcome: "உங்கள் பிரச்சினையை கூறுங்கள். நான் உங்களுக்கு உதவுவேன்.",
    location: "நீங்கள் எந்த மாவட்டத்தில் வசிக்கிறீர்கள்?",
    categoryConfirm: (cat) => `உங்கள் பிரச்சினை ${cat || 'சுகாதாரம்'} தொடர்பானதா?`,
    videoPrompt: "பிரச்சினையை வீடியோவாக பதிவு செய்ய விரும்புகிறீர்களா?",
    summary: (dist, cat) => `நீங்கள் ${dist} மாவட்டத்தில் ${cat} பிரச்சினையை தெரிவித்துள்ளீர்கள். இதை பதிவு செய்யவா?`,
    success: (id) => `உங்கள் புகார் வெற்றிகரமாக பதிவு செய்யப்பட்டது. உங்கள் புகார் எண் ${id}.`
  },
  Telugu: {
    welcome: "మీ సమస్యను చెప్పండి. నేను మీకు సహాయం చేస్తాను.",
    location: "మీరు ఏ జిల్లాలో నివసిస్తున్నారు?",
    categoryConfirm: (cat) => `మీ సమస్య ${cat || 'ఆరోగ్య సేవలు'}కి సంబంధించినదా?`,
    videoPrompt: "మీరు సమస్యను వీడియో తీయాలనుకుంటున్నారా?",
    summary: (dist, cat) => `మీరు ${dist} జిల్లాలో ${cat} సమస్యను తెలిపారు. దీన్ని నమోదు చేయాలా?`,
    success: (id) => `మీ ఫిర్యాదు విజయవంతంగా నమోదైంది. మీ ఫిర్యాదు సంఖ్య ${id}.`
  },
  English: {
    welcome: "Please tell us your problem. I will guide you.",
    location: "Which district or region are you located in?",
    categoryConfirm: (cat) => `Is your issue related to ${cat || 'Healthcare'}?`,
    videoPrompt: "Would you like to record video evidence of the issue?",
    summary: (dist, cat) => `You reported a ${cat} issue in ${dist} district. Would you like to register this complaint?`,
    success: (id) => `Your request has been successfully registered. Your Request ID is ${id}.`
  }
};
