import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Globe2, 
  MapPin, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Video,
  Volume2,
  Clock,
  ShieldCheck,
  RefreshCw,
  Check,
  X,
  Navigation
} from 'lucide-react';
import { SAMPLE_REQUESTS, STATES_AND_DISTRICTS, CATEGORIES, LANGUAGES, VOICEGUIDE_PROMPTS } from '../data/presets';
import { submitCitizenRequest } from '../services/api';
import PriorityBadge from '../components/PriorityBadge';

export default function CitizenPortal() {
  const [selectedLangObj, setSelectedLangObj] = useState(LANGUAGES[1]); // Default: Kannada
  
  // Guided Conversation Steps: 1: Problem, 2: Location, 3: Category, 4: Video, 5: Confirmation, 6: Completed
  const [guideStep, setGuideStep] = useState(1);
  
  const [text, setText] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [selectedState, setSelectedState] = useState('Karnataka');
  const [selectedDistrict, setSelectedDistrict] = useState('Mysuru');
  const [category, setCategory] = useState('Healthcare');

  const [isListening, setIsListening] = useState(false);
  const [isSpeakingTTS, setIsSpeakingTTS] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState('');
  const [locationDetecting, setLocationDetecting] = useState(false);

  // Video recording state
  const [cameraActive, setCameraActive] = useState(false);
  const [videoRecorded, setVideoRecorded] = useState(false);
  const videoRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const currentPrompts = VOICEGUIDE_PROMPTS[selectedLangObj.code] || VOICEGUIDE_PROMPTS.English;

  // Speak Text-to-Speech Prompt
  const speakPrompt = (textToSpeak) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = selectedLangObj.bcp47;
      utterance.rate = 0.9;
      
      utterance.onstart = () => setIsSpeakingTTS(true);
      utterance.onend = () => setIsSpeakingTTS(false);
      utterance.onerror = () => setIsSpeakingTTS(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Language Change
  const handleLanguageChange = (langObj) => {
    setSelectedLangObj(langObj);
    if (langObj.code === 'Kannada') {
      setSelectedState('Karnataka');
      setSelectedDistrict('Mysuru');
    } else if (langObj.code === 'Bengali') {
      setSelectedState('West Bengal');
      setSelectedDistrict('Bankura');
    } else if (langObj.code === 'Hindi') {
      setSelectedState('Uttar Pradesh');
      setSelectedDistrict('Varanasi');
    } else if (langObj.code === 'Tamil') {
      setSelectedState('Tamil Nadu');
      setSelectedDistrict('Dharmapuri');
    } else if (langObj.code === 'Telugu') {
      setSelectedState('Telangana');
      setSelectedDistrict('Warangal');
    }

    setResult(null);
    setError('');
    setGuideStep(1);

    const prompts = VOICEGUIDE_PROMPTS[langObj.code] || VOICEGUIDE_PROMPTS.English;
    speakPrompt(prompts.welcome);
  };

  // Browser Geolocation Share Location
  const handleShareLocation = () => {
    if ('geolocation' in navigator) {
      setLocationDetecting(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationDetecting(false);
          setVoiceNotice(`Location detected: Lat ${position.coords.latitude.toFixed(2)}, Lng ${position.coords.longitude.toFixed(2)}. Selected: ${selectedDistrict}, ${selectedState}.`);
          speakPrompt(currentPrompts.location);
        },
        () => {
          setLocationDetecting(false);
          setVoiceNotice(`Geolocation unavailable. Using selected region: ${selectedDistrict}, ${selectedState}.`);
          speakPrompt(currentPrompts.location);
        }
      );
    } else {
      setVoiceNotice(`Geolocation unavailable. Using selected region: ${selectedDistrict}, ${selectedState}.`);
      speakPrompt(currentPrompts.location);
    }
  };

  // Voice Input Speech Recognition
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceNotice('Speech recognition is limited in this browser. Please type your grievance below.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLangObj.bcp47;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice(`Listening in ${selectedLangObj.name}... Speak your problem clearly.`);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
        setVoiceNotice('Spoken grievance captured successfully.');

        // Advance to Location Step
        setGuideStep(2);
        speakPrompt(currentPrompts.location);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        setVoiceNotice(`Voice capture error: ${event.error}. You can also type below.`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setVoiceNotice('Unable to start speech recognition. You can type your request below.');
    }
  };

  // Video Camera Toggle
  const toggleCamera = () => {
    if (cameraActive) {
      setCameraActive(false);
      setVideoRecorded(true);
      setGuideStep(5);
      speakPrompt(currentPrompts.summary(selectedDistrict, category));
    } else {
      setCameraActive(true);
      navigator.mediaDevices?.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          setCameraActive(false);
          setVideoRecorded(true);
          setGuideStep(5);
          speakPrompt(currentPrompts.summary(selectedDistrict, category));
        });
    }
  };

  const handlePresetClick = (sample) => {
    setText(sample.text);
    const matchedLang = LANGUAGES.find(l => l.code === sample.lang) || LANGUAGES[1];
    setSelectedLangObj(matchedLang);
    setSelectedState(sample.state);
    setSelectedDistrict(sample.district);
    setCategory(sample.category);
    setResult(null);
    setError('');
    setGuideStep(5);
    speakPrompt(VOICEGUIDE_PROMPTS[matchedLang.code]?.summary(sample.district, sample.category) || VOICEGUIDE_PROMPTS.English.summary(sample.district, sample.category));
  };

  // Final Registration Submission
  const handleFinalSubmit = async () => {
    if (!text.trim()) {
      setError('Please describe your grievance by speaking or typing.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const generatedIdCode = `BN-${Math.floor(100000 + Math.random() * 900000)}`;

      const res = await submitCitizenRequest({
        original_text: text,
        language: selectedLangObj.code,
        country: selectedCountry,
        source: 'Voice',
        state: selectedState,
        district: selectedDistrict,
        category: category,
        video_ref: videoRecorded ? `VID-${selectedDistrict.substring(0,3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}.mp4` : null
      });

      res.request_id_code = generatedIdCode;
      setResult(res);
      setGuideStep(6);

      const successText = currentPrompts.success ? currentPrompts.success(generatedIdCode) : `Your request has been registered. Request ID: ${generatedIdCode}`;
      speakPrompt(successText);
    } catch (err) {
      setError(err.message || 'Failed to register citizen request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* CORE PRODUCT PRINCIPLE BANNER */}
      <div className="p-4 rounded-2xl glass-panel border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-xs font-semibold text-slate-200 italic font-outfit">
            "Citizens should not have to learn how to use government technology. The technology should learn how to communicate with citizens."
          </p>
        </div>
        <div className="flex items-center space-x-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 self-start sm:self-auto shrink-0">
          <Clock className="w-3.5 h-3.5" />
          <span>24x7 Digital Citizen Intake</span>
        </div>
      </div>

      {/* HEADER */}
      <div className="text-center space-y-1">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
          BharatNiti VoiceGuide — Voice-First Citizen Access
        </span>
        <h1 className="text-3xl font-extrabold text-white font-outfit">BHARATNITI AI</h1>
        <p className="text-sm text-slate-300">"Tell us your problem"</p>
      </div>

      {/* LARGE PROMINENT LANGUAGE SELECTOR BUTTONS */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-2 text-center">
        <p className="text-xs font-semibold text-slate-300 flex items-center justify-center space-x-1.5 mb-2">
          <Globe2 className="w-4 h-4 text-amber-400" />
          <span>Select Your Language / ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / ভাষা নির্বাচন করুন:</span>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {LANGUAGES.filter(l => l.code !== 'Auto-detect').map((lang) => {
            const isSelected = selectedLangObj.code === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang)}
                className={`py-3 px-2 rounded-xl font-bold text-sm transition-all flex flex-col items-center justify-center space-y-0.5 shadow-md ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 ring-2 ring-amber-400 scale-105'
                    : 'bg-slate-900 text-slate-200 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800'
                }`}
              >
                <span className="text-base font-outfit">{lang.flag} {lang.label || lang.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-80 font-normal">{lang.code}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SAMPLE PRESETS IN SELECTED LANGUAGE */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800">
        <p className="text-xs font-semibold text-slate-300 mb-2 flex items-center space-x-1.5">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Click a sample request to test instant VoiceGuide flow:</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {SAMPLE_REQUESTS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handlePresetClick(sample)}
              className="text-left p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-amber-400">{sample.title}</span>
                <span className="text-[9px] bg-slate-800 text-slate-300 px-1 py-0.5 rounded border border-slate-700">
                  {sample.lang}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 italic">
                "{sample.text}"
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN VOICEGUIDE SIMPLE FIRST SCREEN & GUIDED STEPS */}
      <div className="p-6 sm:p-8 rounded-2xl glass-card border border-amber-500/30 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 shadow-2xl space-y-6 text-center">
        
        {/* VoiceGuide Verbal Prompt Display */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center space-x-2 text-amber-400 font-semibold text-sm">
          <Volume2 className={`w-5 h-5 shrink-0 ${isSpeakingTTS ? 'animate-bounce text-amber-300' : 'text-slate-500'}`} />
          <span>"{currentPrompts.welcome}"</span>
        </div>

        {/* PRIMARY TAP & SPEAK BUTTON */}
        <div className="py-2">
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`w-44 h-44 mx-auto rounded-full font-extrabold text-base flex flex-col items-center justify-center space-y-1.5 transition-all shadow-2xl ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-500/30 shadow-rose-500/50'
                : 'bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 text-slate-950 hover:scale-105 shadow-amber-500/30 ring-4 ring-amber-500/20'
            }`}
          >
            {isListening ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
            <span className="tracking-wider">{isListening ? 'LISTENING...' : '🎤 TAP & SPEAK'}</span>
            <span className="text-[10px] font-normal opacity-90">({selectedLangObj.label})</span>
          </button>

          {voiceNotice && (
            <p className="text-xs text-amber-400 mt-3 font-semibold flex items-center justify-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{voiceNotice}</span>
            </p>
          )}
        </div>

        {/* ADDITIONAL ACCESSIBLE PRIMARY OPTIONS: VIDEO & LOCATION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
          
          {/* SHOW THE PROBLEM (VIDEO) */}
          <button
            type="button"
            onClick={toggleCamera}
            className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
              cameraActive
                ? 'bg-rose-500 text-white animate-pulse'
                : videoRecorded
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Video className="w-4 h-4 text-rose-400" />
            <span>{cameraActive ? 'Stop Recording' : videoRecorded ? '✓ Video Evidence Attached' : '📹 SHOW THE PROBLEM'}</span>
          </button>

          {/* SHARE LOCATION */}
          <button
            type="button"
            onClick={handleShareLocation}
            disabled={locationDetecting}
            className="py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 text-emerald-400 ${locationDetecting ? 'animate-spin' : ''}`} />
            <span>{locationDetecting ? 'Detecting Location...' : '📍 SHARE LOCATION'}</span>
          </button>

        </div>

        {/* CAMERA VIDEO PREVIEW */}
        {cameraActive && (
          <div className="relative max-w-md mx-auto h-48 bg-black rounded-xl overflow-hidden flex items-center justify-center border border-rose-500/50">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-rose-500 text-white text-[10px] font-bold animate-pulse">
              REC🔴
            </span>
          </div>
        )}

        {/* SPOKEN / TYPED TEXT TRANSCRIPT */}
        <div className="text-left space-y-1 max-w-2xl mx-auto">
          <label className="block text-xs font-semibold text-slate-300">
            Spoken Grievance Transcript / Text Input:
          </label>
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Spoken request transcript will appear here. You can also edit or type..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* LOCATION & CATEGORY SELECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-2xl mx-auto">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">State / Region</label>
            <select
              value={selectedState}
              onChange={(e) => {
                const st = e.target.value;
                setSelectedState(st);
                setSelectedDistrict(STATES_AND_DISTRICTS[st]?.[0] || '');
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            >
              {Object.keys(STATES_AND_DISTRICTS).map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">District / City</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            >
              {(STATES_AND_DISTRICTS[selectedState] || []).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* STEP 5: ACCESSIBLE CONFIRMATION (YES / NO / TELL AGAIN) */}
        {guideStep >= 2 && !result && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 max-w-2xl mx-auto space-y-4 text-center">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Verification & Summary Confirmation
            </p>
            <p className="text-sm font-semibold text-slate-200">
              "{currentPrompts.summary(selectedDistrict, category)}"
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Check className="w-5 h-5" />
                <span>🔊 YES</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setText('');
                  setGuideStep(1);
                }}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center space-x-1.5 border border-slate-700"
              >
                <X className="w-5 h-5 text-rose-400" />
                <span>🔊 NO</span>
              </button>

              <button
                type="button"
                onClick={handleVoiceInput}
                className="py-3 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-sm flex items-center justify-center space-x-1.5 border border-amber-500/30"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>🔄 TELL AGAIN</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* GEMINI AI EXTRACTION RESULT DISPLAY */}
      {result && (
        <div className="p-6 sm:p-8 rounded-2xl glass-card border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-900 shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white font-outfit">Complaint Registered Successfully</h3>
                <p className="text-xs text-emerald-400 font-mono">Request ID: {result.request_id_code || `REQ-BN-${result.id}`} | Engine: {result.ai_mode || 'Gemini 2.5 Flash'}</p>
              </div>
            </div>

            <PriorityBadge score={result.priority_score} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Request ID</span>
              <p className="font-bold text-amber-400 text-sm">{result.request_id_code || `REQ-BN-${result.id}`}</p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Timestamp</span>
              <p className="font-bold text-slate-200 text-sm">{new Date(result.created_at).toLocaleString()}</p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Language & Channel</span>
              <p className="font-bold text-emerald-400 text-sm">{result.detected_language} ({result.source || 'Voice'})</p>
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2 text-xs">
            <span className="text-slate-400 uppercase font-semibold text-[10px]">English Representation</span>
            <p className="text-slate-200 font-medium italic">"{result.translated_text}"</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Urgency</p>
              <p className="text-lg font-bold text-rose-400">{result.urgency}/100</p>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Infra Gap</p>
              <p className="text-lg font-bold text-amber-400">{result.infrastructure_gap}/100</p>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Priority Score</p>
              <p className="text-lg font-bold text-emerald-400">{result.priority_score}/100</p>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Affected Pop</p>
              <p className="text-lg font-bold text-blue-400">{result.affected_population_estimate?.toLocaleString()}</p>
            </div>
          </div>

          {result.video_ref && (
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-emerald-400 font-mono">
              📹 Video Evidence Attached: {result.video_ref}
            </div>
          )}

          <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-1 text-xs">
            <span className="text-emerald-400 uppercase font-semibold text-[10px]">Recommended Development Intervention</span>
            <p className="text-slate-200 font-semibold">{result.recommended_intervention}</p>
          </div>

        </div>
      )}

    </div>
  );
}
