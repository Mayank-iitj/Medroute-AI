import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Search, Heart, Eye, Bone, Baby, Activity, Stethoscope, Building2, IndianRupee,
  MapPin, Star, Shield, Clock, Users, Phone, ChevronDown, ChevronUp, ChevronRight,
  AlertTriangle, CheckCircle, XCircle, Info, Loader2, Copy, Share2, TrendingUp,
  Filter, ArrowUpDown, Plus, X, Sparkles, Brain, Pill, BedDouble, Microscope,
  CreditCard, Calculator, FileText, Lock, RefreshCw, Zap, Award, Hospital,
  CircleDollarSign, Banknote, Landmark, BadgeCheck, ShieldCheck, HeartPulse,
  Clipboard, CalendarDays, ArrowRight, Mic
} from 'lucide-react';
import {
  HOSPITALS_DB, PROCEDURES_DB, SYMPTOM_MAP, CITIES, CITY_TIERS,
  CITY_PRICE_MULTIPLIERS, LENDER_OPTIONS, SEASONAL_INSIGHTS,
  formatCurrency, formatCurrencyFull
} from './data.js';

// ═══════════════════════════════════════════════════════════════
// MEDROUTE AI — Main Component
// ═══════════════════════════════════════════════════════════════

const MedRouteAI = () => {
  // ─── STATE ─────────────────────────────────────────────
  const [activeScreen, setActiveScreen] = useState('home');
  const [disclaimerDismissed, setDisclaimerDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simulated distances map
  const simulatedDistances = useMemo(() => {
    const dists = {};
    HOSPITALS_DB.forEach(h => {
      const charSum = (h.id || h.name).split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      dists[h.id] = ((charSum % 100) / 10 + 1).toFixed(1);
    });
    return dists;
  }, []);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchBudget, setSearchBudget] = useState('any');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [matchedHospitals, setMatchedHospitals] = useState([]);
  const [isListening, setIsListening] = useState(false);

  // Hospital Explorer state
  const [explorerFilters, setExplorerFilters] = useState({
    cities: [], tiers: [], nabhOnly: false, minRating: 3.0,
    specializations: [], sortBy: 'rating'
  });
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [expandedHospital, setExpandedHospital] = useState(null);
  const [showRankingExplainer, setShowRankingExplainer] = useState(false);

  // Cost Estimator state
  const [costForm, setCostForm] = useState({
    procedure: '', hospital: '', city: '', tier: 'any',
    age: 35, gender: 'Male', comorbidities: [],
    hasInsurance: false, insurer: '', roomPreference: 'semi-private'
  });
  const [costEstimate, setCostEstimate] = useState(null);
  const [costLoading, setCostLoading] = useState(false);
  const [costError, setCostError] = useState(null);

  // Treatment Pathways state  
  const [pathwayProcedure, setPathwayProcedure] = useState('');
  const [pathwayData, setPathwayData] = useState(null);
  const [pathwayLoading, setPathwayLoading] = useState(false);
  const [pathwayError, setPathwayError] = useState(null);
  const [expandedPhase, setExpandedPhase] = useState(null);

  // Loan state
  const [loanForm, setLoanForm] = useState({
    treatmentCost: 300000, insuranceCoverage: 0,
    monthlyIncome: 50000, employmentType: 'salaried',
    existingEMI: 0, creditScore: 750, tenure: 24
  });

  // Share modal
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareContent, setShareContent] = useState('');
  const [copyStatus, setCopyStatus] = useState(null);

  // ─── GROQ API CALL HELPER ──────────────────────────────
  const callGroqAPI = useCallback(async (systemPrompt, userMessage) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

    try {
      const response = await fetch('/api/groq-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.6,
          max_tokens: 4096
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API error: ${response.status}`);
      }
      
      const data = await response.json();
      let text = data.choices?.[0]?.message?.content || '';
      
      // Remove <think> and </think> wrapping if present
      text = text.replace(/<think>[\s\S]*?<\/think>/, '').trim();

      // Parse JSON from response
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : text;
      try {
        return JSON.parse(jsonStr.trim());
      } catch {
        const objMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (objMatch) return JSON.parse(objMatch[0]);
        throw new Error('Failed to parse AI response as JSON');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') throw new Error('Request timed out. Please try again.');
      throw err;
    }
  }, []);

  // ─── SEARCH HANDLER ───────────────────────────────────
  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) return;
    setSearchLoading(true);
    setSearchError(null);
    setSearchResults(null);
    setMatchedHospitals([]);

    try {
      const systemPrompt = `You are a clinical pathway intelligence engine for Indian healthcare. Map the user's natural language query to structured medical data. Return ONLY valid JSON (no markdown, no preamble) with this exact structure:
{
  "detected_condition": "string",
  "recommended_procedure": "string",
  "icd10_code": "string",
  "snomed_code": "string",
  "urgency_level": "routine" | "urgent" | "emergency",
  "recommended_specialization": "string",
  "suggested_questions": ["string","string","string"],
  "clinical_notes": "string",
  "disclaimer": "string",
  "detected_language": "English" | "Hindi" | "Hinglish",
  "confidence": 0.85
}
Use Indian medical context. The user may use Hinglish or local terms like "seene mein dard" for chest pain, "ghutne mein dard" for knee pain, etc. Always provide realistic ICD-10 and SNOMED codes.`;

      const userMsg = `Patient query: "${query}"${searchCity ? `, City: ${searchCity}` : ''}`;
      const result = await callGroqAPI(systemPrompt, userMsg);
      setSearchResults(result);

      // Match hospitals based on detected specialization
      const spec = (result.recommended_specialization || '').toLowerCase();
      const procName = (result.recommended_procedure || '').toLowerCase();
      let filtered = HOSPITALS_DB.filter(h => {
        const cityMatch = !searchCity || h.city === searchCity;
        const specMatch = h.specializations.some(s => 
          s.toLowerCase().includes(spec) || spec.includes(s.toLowerCase())
        ) || h.procedures.some(p => p.name.toLowerCase().includes(procName));
        return cityMatch && specMatch;
      });

      // Apply budget filter
      if (searchBudget !== 'any') {
        const budgetMap = {
          'under1l': h => h.tier === 'budget',
          '1-5l': h => h.tier === 'budget' || h.tier === 'mid',
          '5-10l': h => h.tier === 'mid' || h.tier === 'premium',
          'above10l': h => h.tier === 'premium'
        };
        if (budgetMap[searchBudget]) filtered = filtered.filter(budgetMap[searchBudget]);
      }

      // Sort by rating
      filtered.sort((a, b) => b.rating - a.rating);
      setMatchedHospitals(filtered.slice(0, 6));
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setSearchLoading(false);
    }
  }, [callGroqAPI, searchCity, searchBudget]);

  // ─── VOICE INPUT HANDLER ──────────────────────────────
  const handleVoiceInput = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice search is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    
    setIsListening(true);
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // Works well for Hinglish too
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
      handleSearch(transcript); // auto search after speaking
    };
    
    recognition.onerror = () => {
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  }, [handleSearch]);

  // ─── COST ESTIMATOR HANDLER ────────────────────────────
  const handleCostEstimate = useCallback(async () => {
    if (!costForm.procedure) return;
    setCostLoading(true);
    setCostError(null);
    setCostEstimate(null);

    const proc = PROCEDURES_DB.find(p => p.name === costForm.procedure);
    if (!proc) { setCostError('Procedure not found'); setCostLoading(false); return; }

    try {
      const systemPrompt = `You are a healthcare cost intelligence engine specializing in Indian hospital pricing. You produce transparent, range-based cost estimates with detailed breakdowns. Return ONLY valid JSON (no markdown):
{
  "total_cost_min": number,
  "total_cost_max": number,
  "confidence_score": number between 0 and 1,
  "breakdown": {
    "procedure": {"min": number, "max": number},
    "doctor_fees": {"min": number, "max": number},
    "hospital_stay": {"min": number, "max": number, "days_min": number, "days_max": number},
    "diagnostics": {"min": number, "max": number},
    "medicines": {"min": number, "max": number},
    "contingency": {"min": number, "max": number}
  },
  "comorbidity_impact": "string explaining how comorbidities affect this estimate",
  "geographic_adjustment": "string explaining city-tier pricing",
  "cost_drivers": ["string","string","string"],
  "cost_reducers": ["string","string"],
  "insurance_coverage_estimate": "string",
  "tips_to_reduce_cost": ["string","string","string"],
  "when_costs_increase": ["string","string"],
  "package_deal": "string describing any all-inclusive package option, or null",
  "multi_city_comparison": "string comparing cost in nearby cheaper city, or null",
  "second_opinion_recommended": boolean,
  "disclaimer": "string"
}
Indian city tier pricing: Metro (Mumbai, Delhi, Bengaluru): +25% premium. Tier-2 (Pune, Hyderabad, Chennai): baseline. Tier-3 (Nagpur, Jaipur): -15%.
The procedure "${costForm.procedure}" has base cost bands: Budget: ₹${proc.cost_bands.budget_min}–₹${proc.cost_bands.budget_max}, Mid: ₹${proc.cost_bands.mid_min}–₹${proc.cost_bands.mid_max}, Premium: ₹${proc.cost_bands.premium_min}–₹${proc.cost_bands.premium_max}.
Breakdown percentages: Procedure ${proc.breakdown.procedure_pct}%, Stay ${proc.breakdown.stay_pct}%, Medicines ${proc.breakdown.medicines_pct}%, Diagnostics ${proc.breakdown.diagnostics_pct}%, Contingency ${proc.breakdown.contingency_pct}%.
Comorbidity multipliers: Diabetes 1.15, Hypertension 1.10, Cardiac history 1.20, Obesity 1.12, Elderly (>60) 1.18.
Apply comorbidity multipliers from the patient profile. Use realistic Indian pricing.`;

      const userMsg = `Procedure: ${costForm.procedure}, City: ${costForm.city || 'Any'}, Hospital tier: ${costForm.tier}, Patient: ${costForm.age} year old ${costForm.gender}, Comorbidities: ${costForm.comorbidities.length > 0 ? costForm.comorbidities.join(', ') : 'None'}, Room preference: ${costForm.roomPreference}${costForm.hasInsurance ? `, Insurance: ${costForm.insurer || 'Yes'}` : ', No insurance'}`;

      const result = await callGroqAPI(systemPrompt, userMsg);
      setCostEstimate(result);
    } catch (err) {
      setCostError(err.message);
    } finally {
      setCostLoading(false);
    }
  }, [costForm, callGroqAPI]);

  // ─── PATHWAY HANDLER ──────────────────────────────────
  const handlePathwayGeneration = useCallback(async () => {
    if (!pathwayProcedure) return;
    setPathwayLoading(true);
    setPathwayError(null);
    setPathwayData(null);

    try {
      const systemPrompt = `You are a clinical pathway expert for Indian hospitals. Generate a structured treatment journey. Return ONLY valid JSON (no markdown):
{
  "phases": [
    {
      "phase": "string phase name",
      "duration": "string e.g. '1-2 days'",
      "activities": ["string","string"],
      "estimated_cost": "string e.g. '₹5,000-₹10,000'",
      "what_to_expect": "string",
      "documents_needed": ["string","string"]
    }
  ],
  "total_timeline": "string",
  "pre_authorization_required": boolean,
  "cashless_eligible": boolean,
  "recovery_tips": ["string","string","string","string"],
  "red_flags": ["string","string","string"],
  "follow_up_schedule": "string"
}
Include these phases: Pre-consultation, Diagnosis & Workup, Pre-operative Preparation, Procedure/Surgery, Hospital Stay & Monitoring, Discharge Planning, Recovery at Home, Follow-up & Rehabilitation.
Use Indian medical context with realistic cost estimates in INR.`;

      const proc = PROCEDURES_DB.find(p => p.name === pathwayProcedure);
      const userMsg = `Treatment pathway for "${pathwayProcedure}" at a mid-tier hospital in India for a 45-year-old patient. Risk level: ${proc?.risk_level || 'medium'}. Expected recovery: ${proc?.recovery_days || 30} days.`;

      const result = await callGroqAPI(systemPrompt, userMsg);
      setPathwayData(result);
    } catch (err) {
      setPathwayError(err.message);
    } finally {
      setPathwayLoading(false);
    }
  }, [pathwayProcedure, callGroqAPI]);

  // ─── LOAN CALCULATOR ──────────────────────────────────
  const calculateLoan = useCallback(() => {
    const netAmount = Math.max(0, loanForm.treatmentCost - loanForm.insuranceCoverage);
    const maxEMI = (loanForm.monthlyIncome * 0.40) - loanForm.existingEMI;
    const annualRate = 14;
    const monthlyRate = annualRate / 100 / 12;
    const n = loanForm.tenure;
    const emi = netAmount > 0 ? netAmount * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1) : 0;
    const totalPayable = emi * n;
    const totalInterest = totalPayable - netAmount;
    const foir = loanForm.monthlyIncome > 0 ? ((loanForm.existingEMI + emi) / loanForm.monthlyIncome) * 100 : 100;

    let eligibilityScore = 0;
    if (loanForm.creditScore >= 750) eligibilityScore += 30;
    else if (loanForm.creditScore >= 650) eligibilityScore += 20;
    else eligibilityScore += 10;

    if (foir < 40) eligibilityScore += 30;
    else if (foir < 50) eligibilityScore += 20;
    else if (foir < 60) eligibilityScore += 10;

    if (loanForm.employmentType === 'salaried') eligibilityScore += 25;
    else if (loanForm.employmentType === 'business') eligibilityScore += 20;
    else eligibilityScore += 15;

    if (loanForm.monthlyIncome >= 50000) eligibilityScore += 15;
    else if (loanForm.monthlyIncome >= 25000) eligibilityScore += 10;
    else eligibilityScore += 5;

    let status = 'APPROVED';
    if (eligibilityScore < 50) status = 'NEEDS REVIEW';
    else if (eligibilityScore < 70) status = 'CONDITIONAL';

    return {
      netAmount, maxEMI, emi: Math.round(emi), totalPayable: Math.round(totalPayable),
      totalInterest: Math.round(totalInterest), foir: foir.toFixed(1),
      eligibilityScore, status, canAfford: emi <= maxEMI
    };
  }, [loanForm]);

  // ─── HOSPITAL SCORING ─────────────────────────────────
  const scoreHospital = useCallback((hospital, searchSpec = '') => {
    const ratingScore = (hospital.rating / 5) * 0.30;
    const accreditScore = hospital.nabh_accredited ? 0.20 : 0;
    const specScore = searchSpec
      ? hospital.specializations.some(s => s.toLowerCase().includes(searchSpec.toLowerCase())) ? 0.25 : 0.05
      : 0.15;
    const affordScore = hospital.tier === 'budget' ? 0.15 : hospital.tier === 'mid' ? 0.10 : 0.05;
    const reviewScore = Math.min(hospital.review_count / 20000, 1) * 0.10;
    return {
      total: (ratingScore + accreditScore + specScore + affordScore + reviewScore).toFixed(2),
      rating: ratingScore.toFixed(2), accreditation: accreditScore.toFixed(2),
      specialization: specScore.toFixed(2), affordability: affordScore.toFixed(2),
      reviews: reviewScore.toFixed(2)
    };
  }, []);

  // ─── FILTERED HOSPITALS ───────────────────────────────
  const getFilteredHospitals = useCallback(() => {
    let filtered = [...HOSPITALS_DB];
    if (explorerFilters.cities.length > 0) {
      filtered = filtered.filter(h => explorerFilters.cities.includes(h.city));
    }
    if (explorerFilters.tiers.length > 0) {
      filtered = filtered.filter(h => explorerFilters.tiers.includes(h.tier));
    }
    if (explorerFilters.nabhOnly) {
      filtered = filtered.filter(h => h.nabh_accredited);
    }
    filtered = filtered.filter(h => h.rating >= explorerFilters.minRating);
    if (explorerFilters.specializations.length > 0) {
      filtered = filtered.filter(h =>
        explorerFilters.specializations.some(s => h.specializations.includes(s))
      );
    }
    // Sort
    const sortFns = {
      rating: (a, b) => b.rating - a.rating,
      cost_low: (a, b) => (a.tier === 'budget' ? 0 : a.tier === 'mid' ? 1 : 2) - (b.tier === 'budget' ? 0 : b.tier === 'mid' ? 1 : 2),
      cost_high: (a, b) => (b.tier === 'budget' ? 0 : b.tier === 'mid' ? 1 : 2) - (a.tier === 'budget' ? 0 : a.tier === 'mid' ? 1 : 2),
      reviews: (a, b) => b.review_count - a.review_count
    };
    filtered.sort(sortFns[explorerFilters.sortBy] || sortFns.rating);
    return filtered;
  }, [explorerFilters]);

  // ─── SHARE / EXPORT ────────────────────────────────────
  const generateShareContent = useCallback(() => {
    if (!costEstimate) return '';
    return `
📋 MedRoute AI — Cost Estimate Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 Procedure: ${costForm.procedure}
📍 City: ${costForm.city || 'Any'}
👤 Patient: ${costForm.age}yr ${costForm.gender}
${costForm.comorbidities.length ? `⚕️ Conditions: ${costForm.comorbidities.join(', ')}` : ''}

💰 Estimated Total Cost
   ${formatCurrencyFull(costEstimate.total_cost_min)} – ${formatCurrencyFull(costEstimate.total_cost_max)}
   Confidence: ${Math.round((costEstimate.confidence_score || 0.75) * 100)}%

📊 Breakdown:
   • Procedure: ${formatCurrencyFull(costEstimate.breakdown?.procedure?.min || 0)} – ${formatCurrencyFull(costEstimate.breakdown?.procedure?.max || 0)}
   • Hospital Stay: ${formatCurrencyFull(costEstimate.breakdown?.hospital_stay?.min || 0)} – ${formatCurrencyFull(costEstimate.breakdown?.hospital_stay?.max || 0)}
   • Diagnostics: ${formatCurrencyFull(costEstimate.breakdown?.diagnostics?.min || 0)} – ${formatCurrencyFull(costEstimate.breakdown?.diagnostics?.max || 0)}
   • Medicines: ${formatCurrencyFull(costEstimate.breakdown?.medicines?.min || 0)} – ${formatCurrencyFull(costEstimate.breakdown?.medicines?.max || 0)}

⚠️ This is an AI-generated estimate for informational purposes only.
   Always verify with your hospital. Generated by MedRoute AI.
`.trim();
  }, [costEstimate, costForm]);

  const handleShare = () => {
    const content = generateShareContent();
    setShareContent(content);
    setShowShareModal(true);
  };

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.prepend(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopyStatus('success');
      setTimeout(() => setCopyStatus(null), 3000);
    } catch (err) {
      console.error('Failed to copy', err);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus(null), 3000);
    }
  };

  // ─── UNIQUE SPECIALIZATIONS ────────────────────────────
  const allSpecializations = [...new Set(HOSPITALS_DB.flatMap(h => h.specializations))].sort();

  // API Key modal removed — Groq API key is hardcoded

  // ═══════════════════════════════════════════════════════════
  // RENDER: DISCLAIMER BANNER
  // ═══════════════════════════════════════════════════════════
  const renderDisclaimerBanner = () => {
    if (disclaimerDismissed) return null;
    return (
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>MedRoute AI</strong> provides decision support only. It does not provide medical diagnoses or treatment advice. 
              Always consult a qualified healthcare professional.
            </span>
          </div>
          <button onClick={() => setDisclaimerDismissed(true)} className="text-amber-600 hover:text-amber-800 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER: NAVBAR
  // ═══════════════════════════════════════════════════════════
  const renderNavBar = () => {
    const navItems = [
      { id: 'home', label: 'Smart Search', icon: Search },
      { id: 'explorer', label: 'Hospital Explorer', icon: Building2 },
      { id: 'estimator', label: 'Cost Estimator', icon: IndianRupee },
      { id: 'pathways', label: 'Treatment Pathways', icon: Activity },
      { id: 'loan', label: 'Loan Eligibility', icon: CreditCard }
    ];
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveScreen('home')}>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white rotate-45" />
              </div>
              <span className="text-lg font-bold text-gray-900">MedRoute <span className="text-primary">AI</span></span>
            </div>
            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveScreen(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeScreen === item.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
            {/* Mobile burger */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </button>
          </div>
          {/* Mobile dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-100 mt-1 pt-2 animate-fadeIn">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveScreen(item.id); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeScreen === item.id ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // HELPER COMPONENTS
  // ═══════════════════════════════════════════════════════════
  const LoadingSpinner = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-16 animate-fadeIn">
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full animate-pulse-slow" />
      </div>
      <p className="mt-4 text-sm text-gray-600 font-medium">{message || 'Processing...'}</p>
    </div>
  );

  const ErrorCard = ({ message, onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center animate-fadeIn">
      <XCircle className="w-10 h-10 text-danger mx-auto mb-3" />
      <p className="text-sm text-red-800 font-medium mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      )}
    </div>
  );

  const TierBadge = ({ tier }) => {
    const styles = { premium: 'bg-premium/15 text-premium', mid: 'bg-blue-100 text-blue-700', budget: 'bg-gray-100 text-gray-600' };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[tier]}`}>{tier.charAt(0).toUpperCase() + tier.slice(1)}</span>;
  };

  const UrgencyBadge = ({ level }) => {
    const styles = {
      routine: 'bg-green-100 text-green-700', urgent: 'bg-amber-100 text-amber-700',
      emergency: 'bg-red-100 text-red-700'
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${styles[level] || styles.routine}`}>{level}</span>;
  };

  const ConfidenceMeter = ({ score }) => {
    const pct = Math.round((score || 0.75) * 100);
    const color = pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-amber-500' : 'text-red-500';
    const bgColor = pct >= 80 ? 'stroke-green-500' : pct >= 60 ? 'stroke-amber-400' : 'stroke-red-400';
    return (
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" fill="none" stroke="#e5e7eb" strokeWidth="4" />
            <circle cx="28" cy="28" r="24" fill="none" className={bgColor} strokeWidth="4"
              strokeDasharray={`${pct * 1.508} 151`} strokeLinecap="round" />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${color}`}>{pct}%</span>
        </div>
        <div className="text-xs text-gray-500">
          <p className="font-medium text-gray-700">{pct >= 80 ? 'High' : pct >= 60 ? 'Medium' : 'Low'} confidence</p>
          <p>Actual costs may vary ±{pct >= 80 ? '15' : pct >= 60 ? '30' : '45'}%</p>
        </div>
      </div>
    );
  };

  const StarRating = ({ rating }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
      ))}
      <span className="text-sm font-semibold text-gray-700 ml-1">{rating}</span>
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // SCREEN 1: HOME / SMART SEARCH
  // ═══════════════════════════════════════════════════════════
  const renderHome = () => {
    const quickChips = ['Knee pain', 'Heart procedure', 'Eye surgery', 'Cancer treatment', 'Delivery & maternity', 'Kidney issues'];
    const budgetOptions = [
      { value: 'any', label: 'Any Budget' },
      { value: 'under1l', label: 'Under ₹1L' },
      { value: '1-5l', label: '₹1–5L' },
      { value: '5-10l', label: '₹5–10L' },
      { value: 'above10l', label: 'Above ₹10L' }
    ];

    return (
      <div className="min-h-screen">
        {/* HERO */}
        <div className="bg-gradient-to-br from-primary via-primary-dark to-emerald-900 text-white">
          <div className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-white rotate-45" />
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">MedRoute AI</h1>
            </div>
            <p className="text-lg text-emerald-100 mb-10">Your intelligent healthcare navigator for India</p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch(searchQuery)}
                  placeholder="Describe your condition, symptom, or procedure..."
                  className="w-full pl-12 pr-36 py-4 rounded-2xl text-gray-900 text-base shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
                />
                <button
                  onClick={handleVoiceInput}
                  disabled={searchLoading}
                  className={`absolute right-[6.5rem] top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                    isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-400 hover:text-primary hover:bg-gray-100'
                  }`}
                  title="Voice Search"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleSearch(searchQuery)}
                  disabled={searchLoading || !searchQuery.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                </button>
              </div>

              {/* Filters row */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                <select
                  value={searchCity}
                  onChange={e => setSearchCity(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/15 backdrop-blur text-white text-sm border border-white/20 focus:outline-none"
                >
                  <option value="" className="text-gray-900">All Cities</option>
                  {CITIES.map(c => <option key={c} value={c} className="text-gray-900">{c}</option>)}
                </select>
                <div className="flex gap-1 flex-wrap justify-center">
                  {budgetOptions.map(b => (
                    <button
                      key={b.value}
                      onClick={() => setSearchBudget(b.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        searchBudget === b.value ? 'bg-white text-primary' : 'bg-white/15 text-white hover:bg-white/25'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick chips */}
              <div className="flex flex-wrap justify-center gap-2 mt-5">
                {quickChips.map(chip => (
                  <button
                    key={chip}
                    onClick={() => { setSearchQuery(chip); handleSearch(chip); }}
                    className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full border border-white/20 transition-all"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {searchLoading && <LoadingSpinner message="Mapping your condition to clinical pathways..." />}
          {searchError && <ErrorCard message={searchError} onRetry={() => handleSearch(searchQuery)} />}

          {searchResults && !searchLoading && (
            <div className="space-y-8 animate-fadeIn">
              {/* Urgency alert */}
              {(searchResults.urgency_level === 'emergency' || searchResults.urgency_level === 'urgent') && (
                <div className={`p-4 rounded-xl border-2 flex items-start gap-3 ${
                  searchResults.urgency_level === 'emergency' ? 'bg-red-50 border-red-300' : 'bg-amber-50 border-amber-300'
                }`}>
                  <AlertTriangle className={`w-6 h-6 flex-shrink-0 ${searchResults.urgency_level === 'emergency' ? 'text-danger' : 'text-warning'}`} />
                  <div>
                    <p className="font-bold text-gray-900">
                      {searchResults.urgency_level === 'emergency' ? '🚨 This may require emergency attention!' : '⚠️ This condition may need prompt medical attention'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {searchResults.urgency_level === 'emergency'
                        ? 'Please consult a doctor or call 112 immediately.'
                        : 'We recommend scheduling a consultation within the next few days.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Clinical Intelligence Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/5 to-primary-light/5 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-gray-900">Clinical Intelligence</h2>
                    {searchResults.detected_language && searchResults.detected_language !== 'English' && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        {searchResults.detected_language} detected
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Detected Condition</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{searchResults.detected_condition}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Recommended Procedure</p>
                        <p className="text-base font-semibold text-primary mt-1">{searchResults.recommended_procedure}</p>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-xs text-gray-500 font-medium">ICD-10</p>
                          <p className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded mt-1">{searchResults.icd10_code}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">SNOMED</p>
                          <p className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded mt-1">{searchResults.snomed_code}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Urgency</p>
                          <div className="mt-1"><UrgencyBadge level={searchResults.urgency_level} /></div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Specialization</p>
                          <p className="text-sm font-semibold text-gray-700 mt-1">{searchResults.recommended_specialization}</p>
                        </div>
                      </div>
                      {searchResults.confidence && <ConfidenceMeter score={searchResults.confidence} />}
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Clinical Notes</p>
                        <p className="text-sm text-gray-600">{searchResults.clinical_notes}</p>
                      </div>
                    </div>
                  </div>

                  {/* Suggested questions */}
                  {searchResults.suggested_questions?.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 font-medium mb-2">Follow-up Questions</p>
                      <div className="flex flex-wrap gap-2">
                        {searchResults.suggested_questions.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => { setSearchQuery(q); handleSearch(q); }}
                            className="px-3 py-1.5 bg-primary/5 text-primary text-sm rounded-lg border border-primary/20 hover:bg-primary/10 transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Matched hospitals */}
              {matchedHospitals.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Top Matching Hospitals</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {matchedHospitals.slice(0, 3).map((hospital) => {
                      const proc = hospital.procedures.find(p =>
                        p.name.toLowerCase().includes((searchResults.recommended_procedure || '').toLowerCase().split(' ')[0])
                      );
                      return (
                        <div key={hospital.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">{hospital.name}</h4>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" />{hospital.city} - {hospital.pincode}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <TierBadge tier={hospital.tier} />
                              {hospital.nabh_accredited && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">NABH</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <StarRating rating={hospital.rating} />
                            <span className="text-xs text-gray-400">{hospital.review_count.toLocaleString()} reviews</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-1">Simulated distance: {simulatedDistances[hospital.id] || '5.0'} km</p>
                          {proc && (
                            <div className="bg-gray-50 rounded-lg px-3 py-2 mb-3">
                              <p className="text-xs text-gray-500">Estimated range</p>
                              <p className="text-sm font-bold text-primary">{formatCurrency(proc.base_cost_min)} – {formatCurrency(proc.base_cost_max)}</p>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => setActiveScreen('explorer')}
                              className="flex-1 py-2 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                setCostForm(f => ({ ...f, procedure: searchResults.recommended_procedure || '', hospital: hospital.name, city: hospital.city, tier: hospital.tier }));
                                setActiveScreen('estimator');
                              }}
                              className="flex-1 py-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                            >
                              Estimate Cost
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Trust bar */}
              <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-2 py-4">
                <Lock className="w-3 h-3" />
                Decision support only — not a diagnosis. Always consult a qualified physician.
              </div>
            </div>
          )}

          {/* Empty state */}
          {!searchResults && !searchLoading && !searchError && (
            <div className="text-center py-16">
              <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Start your healthcare journey</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Search for symptoms, conditions, or procedures in English or Hinglish. 
                Our AI will map your query to clinical pathways and find the best hospitals.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // SCREEN 2: HOSPITAL EXPLORER
  // ═══════════════════════════════════════════════════════════
  const renderHospitalExplorer = () => {
    const filteredHospitals = getFilteredHospitals();

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hospital Explorer</h2>

        {/* Ranking Explainer */}
        <div className="mb-6">
          <button onClick={() => setShowRankingExplainer(!showRankingExplainer)}
            className="flex items-center gap-2 text-sm text-primary font-medium hover:underline">
            <Info className="w-4 h-4" />
            How we rank hospitals
            {showRankingExplainer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showRankingExplainer && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-5 animate-fadeIn">
              <p className="text-sm text-gray-700 mb-2 font-medium">Transparent Scoring Formula:</p>
              <p className="text-xs font-mono text-gray-600 bg-white px-3 py-2 rounded-lg mb-3">
                Score = (Rating × 0.30) + (NABH Accreditation × 0.20) + (Specialization Match × 0.25) + (Affordability × 0.15) + (Review Volume × 0.10)
              </p>
              <p className="text-xs text-gray-500">This ensures a balanced mix of quality, trust, and affordability in our recommendations.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Panel */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</h3>

              {/* City */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">City</p>
                <div className="flex flex-wrap gap-1.5">
                  {CITIES.map(city => (
                    <button
                      key={city}
                      onClick={() => {
                        setExplorerFilters(f => ({
                          ...f,
                          cities: f.cities.includes(city) ? f.cities.filter(c => c !== city) : [...f.cities, city]
                        }));
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        explorerFilters.cities.includes(city)
                          ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tier */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Hospital Tier</p>
                <div className="flex gap-1.5">
                  {['premium', 'mid', 'budget'].map(tier => (
                    <button
                      key={tier}
                      onClick={() => {
                        setExplorerFilters(f => ({
                          ...f,
                          tiers: f.tiers.includes(tier) ? f.tiers.filter(t => t !== tier) : [...f.tiers, tier]
                        }));
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        explorerFilters.tiers.includes(tier)
                          ? tier === 'premium' ? 'bg-premium text-white' : tier === 'mid' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* NABH */}
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={explorerFilters.nabhOnly}
                    onChange={e => setExplorerFilters(f => ({ ...f, nabhOnly: e.target.checked }))}
                    className="w-4 h-4 accent-primary rounded"
                  />
                  <span className="text-sm text-gray-700 font-medium">NABH Accredited Only</span>
                </label>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Min Rating: {explorerFilters.minRating}</p>
                <input
                  type="range" min="3.0" max="5.0" step="0.1"
                  value={explorerFilters.minRating}
                  onChange={e => setExplorerFilters(f => ({ ...f, minRating: parseFloat(e.target.value) }))}
                  className="w-full accent-primary"
                />
              </div>

              {/* Specialization */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Specialization</p>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {allSpecializations.map(spec => (
                    <label key={spec} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={explorerFilters.specializations.includes(spec)}
                        onChange={() => {
                          setExplorerFilters(f => ({
                            ...f,
                            specializations: f.specializations.includes(spec)
                              ? f.specializations.filter(s => s !== spec)
                              : [...f.specializations, spec]
                          }));
                        }}
                        className="w-3.5 h-3.5 accent-primary rounded"
                      />
                      <span className="text-xs text-gray-700">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Sort By</p>
                <select
                  value={explorerFilters.sortBy}
                  onChange={e => setExplorerFilters(f => ({ ...f, sortBy: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  <option value="rating">Rating (High–Low)</option>
                  <option value="cost_low">Cost (Low–High)</option>
                  <option value="cost_high">Cost (High–Low)</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hospital Grid */}
          <div className="flex-1">
            {/* Compare button */}
            {compareList.length >= 2 && (
              <div className="sticky top-24 z-10 mb-4">
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="w-full py-3 bg-gradient-to-r from-premium to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <ArrowUpDown className="w-4 h-4" /> Compare {compareList.length} Hospitals
                </button>
              </div>
            )}

            <p className="text-sm text-gray-500 mb-4">{filteredHospitals.length} hospitals found</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHospitals.map(hospital => {
                const score = scoreHospital(hospital);
                const isCompared = compareList.includes(hospital.id);

                return (
                  <div key={hospital.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{hospital.name}</h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />{hospital.city} - {hospital.pincode}
                          </p>
                        </div>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isCompared}
                            onChange={() => {
                              setCompareList(prev =>
                                prev.includes(hospital.id) ? prev.filter(id => id !== hospital.id)
                                  : prev.length < 3 ? [...prev, hospital.id] : prev
                              );
                            }}
                            className="w-4 h-4 accent-primary"
                          />
                          <span className="text-xs text-gray-400">Compare</span>
                        </label>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <TierBadge tier={hospital.tier} />
                        {hospital.nabh_accredited && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center gap-1">
                            <BadgeCheck className="w-3 h-3" /> NABH
                          </span>
                        )}
                        <span className="text-xs text-gray-400">Est. {hospital.established_year}</span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <StarRating rating={hospital.rating} />
                        <span className="text-xs text-gray-400">{hospital.review_count.toLocaleString()} reviews</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {hospital.specializations.slice(0, 3).map(s => (
                          <span key={s} className="px-2 py-0.5 bg-primary/8 text-primary text-xs rounded-full font-medium">{s}</span>
                        ))}
                        {hospital.specializations.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">+{hospital.specializations.length - 3}</span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center mb-3">
                        <div className="bg-gray-50 rounded-lg py-1.5">
                          <p className="text-xs text-gray-400">Beds</p>
                          <p className="text-sm font-bold text-gray-700">{hospital.beds}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg py-1.5">
                          <p className="text-xs text-gray-400">ICU</p>
                          <p className="text-sm font-bold text-gray-700">{hospital.icu_beds}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg py-1.5">
                          <p className="text-xs text-gray-400">Wait</p>
                          <p className="text-sm font-bold text-gray-700">{hospital.avg_wait_days}d</p>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mb-3">
                        <span className="font-medium">Insurance:</span> {hospital.insurance_accepted.slice(0, 3).join(', ')}
                        {hospital.insurance_accepted.length > 3 && ` +${hospital.insurance_accepted.length - 3}`}
                      </div>

                      {/* Score mini bar */}
                      <div className="bg-gray-50 rounded-lg p-2 mb-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Quality Score</span>
                          <span className="font-bold text-primary">{score.total}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all" style={{ width: `${parseFloat(score.total) * 100}%` }} />
                        </div>
                      </div>

                      {/* Expandable procedures */}
                      <button
                        onClick={() => setExpandedHospital(expandedHospital === hospital.id ? null : hospital.id)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        View Procedures & Costs
                        {expandedHospital === hospital.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {expandedHospital === hospital.id && (
                        <div className="mt-2 space-y-1 animate-fadeIn">
                          {hospital.procedures.map(p => (
                            <div key={p.name} className="flex items-center justify-between px-3 py-1.5 bg-white border border-gray-100 rounded-lg">
                              <span className="text-xs text-gray-700">{p.name}</span>
                              <span className="text-xs font-semibold text-primary">{formatCurrency(p.base_cost_min)}–{formatCurrency(p.base_cost_max)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setCostForm(f => ({ ...f, hospital: hospital.name, city: hospital.city, tier: hospital.tier }));
                          setActiveScreen('estimator');
                        }}
                        className="w-full mt-3 py-2.5 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg text-sm font-semibold hover:shadow-md transition-all"
                      >
                        Get Cost Estimate
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Compare Modal */}
        {showCompareModal && compareList.length >= 2 && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Hospital Comparison</h3>
                <button onClick={() => setShowCompareModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-gray-500 text-xs uppercase w-36">Attribute</th>
                      {compareList.map(id => {
                        const h = HOSPITALS_DB.find(h => h.id === id);
                        return <th key={id} className="text-left py-3 px-2 font-bold text-gray-900">{h?.name}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { label: 'City', fn: h => h.city },
                      { label: 'Tier', fn: h => <TierBadge tier={h.tier} /> },
                      { label: 'NABH', fn: h => h.nabh_accredited ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-gray-300" /> },
                      { label: 'Rating', fn: h => <StarRating rating={h.rating} /> },
                      { label: 'Reviews', fn: h => h.review_count.toLocaleString() },
                      { label: 'Beds', fn: h => h.beds },
                      { label: 'ICU Beds', fn: h => h.icu_beds },
                      { label: 'Wait Days', fn: h => `${h.avg_wait_days} days` },
                      { label: 'Established', fn: h => h.established_year },
                      { label: 'Specializations', fn: h => h.specializations.join(', ') },
                      { label: 'Insurance', fn: h => h.insurance_accepted.join(', ') }
                    ].map(row => (
                      <tr key={row.label}>
                        <td className="py-2 px-2 text-gray-500 font-medium text-xs">{row.label}</td>
                        {compareList.map(id => {
                          const h = HOSPITALS_DB.find(h => h.id === id);
                          return <td key={id} className="py-2 px-2 text-gray-700 text-xs">{h ? row.fn(h) : '-'}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // SCREEN 3: COST ESTIMATOR
  // ═══════════════════════════════════════════════════════════
  const renderCostEstimator = () => {
    const selectedProc = PROCEDURES_DB.find(p => p.name === costForm.procedure);
    const comorbidityOptions = ['Diabetes', 'Hypertension', 'Cardiac history', 'Obesity', 'Kidney disease', 'COPD'];

    const tierComparisonData = selectedProc ? [
      { tier: 'Budget', min: selectedProc.cost_bands.budget_min, max: selectedProc.cost_bands.budget_max },
      { tier: 'Mid-tier', min: selectedProc.cost_bands.mid_min, max: selectedProc.cost_bands.mid_max },
      { tier: 'Premium', min: selectedProc.cost_bands.premium_min, max: selectedProc.cost_bands.premium_max }
    ] : [];

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cost Estimator</h2>
        <p className="text-sm text-gray-500 mb-8">Get AI-powered cost estimates with detailed breakdowns</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Calculator className="w-4 h-4 text-primary" /> Estimation Parameters</h3>

              {/* Procedure */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Procedure</label>
                <select
                  value={costForm.procedure}
                  onChange={e => setCostForm(f => ({ ...f, procedure: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">Select procedure...</option>
                  {PROCEDURES_DB.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">City</label>
                <select
                  value={costForm.city}
                  onChange={e => setCostForm(f => ({ ...f, city: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">Any city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Tier */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Hospital Tier</label>
                <div className="flex gap-1.5">
                  {['any', 'budget', 'mid', 'premium'].map(t => (
                    <button key={t} onClick={() => setCostForm(f => ({ ...f, tier: t }))}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                        costForm.tier === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {t === 'any' ? 'Any' : t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Age: {costForm.age}</label>
                <input
                  type="range" min="1" max="90" value={costForm.age}
                  onChange={e => setCostForm(f => ({ ...f, age: parseInt(e.target.value) }))}
                  className="w-full accent-primary"
                />
              </div>

              {/* Gender */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Gender</label>
                <div className="flex gap-1.5">
                  {['Male', 'Female', 'Other'].map(g => (
                    <button key={g} onClick={() => setCostForm(f => ({ ...f, gender: g }))}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                        costForm.gender === g ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comorbidities */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Comorbidities</label>
                <div className="space-y-1.5">
                  {comorbidityOptions.map(c => (
                    <label key={c} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={costForm.comorbidities.includes(c)}
                        onChange={() => {
                          setCostForm(f => ({
                            ...f,
                            comorbidities: f.comorbidities.includes(c)
                              ? f.comorbidities.filter(x => x !== c) : [...f.comorbidities, c]
                          }));
                        }}
                        className="w-3.5 h-3.5 accent-primary"
                      />
                      <span className="text-xs text-gray-700">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Insurance */}
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={costForm.hasInsurance}
                    onChange={e => setCostForm(f => ({ ...f, hasInsurance: e.target.checked }))}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-gray-700 font-medium">I have insurance</span>
                </label>
                {costForm.hasInsurance && (
                  <input
                    type="text"
                    placeholder="Insurer name (optional)"
                    value={costForm.insurer}
                    onChange={e => setCostForm(f => ({ ...f, insurer: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                )}
              </div>

              {/* Room */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Room Preference</label>
                <select
                  value={costForm.roomPreference}
                  onChange={e => setCostForm(f => ({ ...f, roomPreference: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  <option value="general">General Ward</option>
                  <option value="semi-private">Semi-Private</option>
                  <option value="private">Private Room</option>
                  <option value="icu">ICU (likely)</option>
                </select>
              </div>

              <button
                onClick={handleCostEstimate}
                disabled={!costForm.procedure || costLoading}
                className="w-full py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {costLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {costLoading ? 'Calculating...' : 'Get Estimate'}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {costLoading && <LoadingSpinner message={`Calculating cost estimates for ${costForm.city || 'India'}...`} />}
            {costError && <ErrorCard message={costError} onRetry={handleCostEstimate} />}

            {!costEstimate && !costLoading && !costError && (
              <div className="text-center py-24">
                <CircleDollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 mb-2">Configure your estimate</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  Select a procedure and fill in your details. Our AI will generate a detailed, transparent cost breakdown.
                </p>
              </div>
            )}

            {costEstimate && !costLoading && (
              <div className="space-y-6 animate-fadeIn">
                {/* Total Cost Hero */}
                <div className="bg-gradient-to-br from-primary to-emerald-700 text-white rounded-2xl p-8 shadow-xl">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="text-emerald-200 text-sm font-medium mb-1">Estimated Total Cost Range</p>
                      <p className="text-3xl md:text-4xl font-extrabold tracking-tight animate-countUp">
                        {formatCurrencyFull(costEstimate.total_cost_min)} – {formatCurrencyFull(costEstimate.total_cost_max)}
                      </p>
                      <p className="text-emerald-200 text-xs mt-2">
                        {costForm.procedure} · {costForm.city || 'India'} · {costForm.tier !== 'any' ? costForm.tier + ' tier' : 'All tiers'}
                      </p>
                    </div>
                    <ConfidenceMeter score={costEstimate.confidence_score} />
                  </div>
                  {costEstimate.geographic_adjustment && (
                    <p className="text-xs text-emerald-200 mt-4 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {costEstimate.geographic_adjustment}
                    </p>
                  )}
                </div>

                {/* Breakdown Chart */}
                {costEstimate.breakdown && (
                  <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Microscope className="w-4 h-4 text-primary" /> Cost Breakdown</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Procedure', min: costEstimate.breakdown.procedure?.min, max: costEstimate.breakdown.procedure?.max },
                          { name: 'Doctor Fees', min: costEstimate.breakdown.doctor_fees?.min, max: costEstimate.breakdown.doctor_fees?.max },
                          { name: 'Hospital Stay', min: costEstimate.breakdown.hospital_stay?.min, max: costEstimate.breakdown.hospital_stay?.max },
                          { name: 'Diagnostics', min: costEstimate.breakdown.diagnostics?.min, max: costEstimate.breakdown.diagnostics?.max },
                          { name: 'Medicines', min: costEstimate.breakdown.medicines?.min, max: costEstimate.breakdown.medicines?.max },
                          { name: 'Contingency', min: costEstimate.breakdown.contingency?.min, max: costEstimate.breakdown.contingency?.max }
                        ].filter(d => d.min || d.max)} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" tickFormatter={v => formatCurrency(v)} />
                          <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                          <Tooltip formatter={v => formatCurrencyFull(v)} />
                          <Bar dataKey="min" fill="#0F6E56" name="Min" radius={[0, 4, 4, 0]} />
                          <Bar dataKey="max" fill="#1D9E75" name="Max" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    {costEstimate.breakdown.hospital_stay?.days_min && (
                      <p className="text-xs text-gray-500 mt-2">
                        Expected stay: {costEstimate.breakdown.hospital_stay.days_min}–{costEstimate.breakdown.hospital_stay.days_max} days
                      </p>
                    )}
                  </div>
                )}

                {/* Smart Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Cost drivers */}
                  {costEstimate.cost_drivers?.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
                      <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-danger" /> What Drives Cost Up
                      </h4>
                      <ul className="space-y-2">
                        {costEstimate.cost_drivers.map((d, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />{d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Cost reducers */}
                  {costEstimate.tips_to_reduce_cost?.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
                      <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-green-500" /> How to Reduce Costs
                      </h4>
                      <ul className="space-y-2">
                        {costEstimate.tips_to_reduce_cost.map((t, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />{t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Comorbidity impact callout */}
                {costForm.comorbidities.length > 0 && costEstimate.comorbidity_impact && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                    <h4 className="font-bold text-amber-800 text-sm mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Comorbidity Impact
                    </h4>
                    <p className="text-sm text-amber-700">{costEstimate.comorbidity_impact}</p>
                  </div>
                )}

                {/* Insurance estimate */}
                {costEstimate.insurance_coverage_estimate && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                    <h4 className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Insurance Coverage Estimate
                    </h4>
                    <p className="text-sm text-blue-700">{costEstimate.insurance_coverage_estimate}</p>
                  </div>
                )}

                {/* Second opinion */}
                {costEstimate.second_opinion_recommended && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                    <h4 className="font-bold text-purple-800 text-sm mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4" /> Second Opinion Recommended
                    </h4>
                    <p className="text-sm text-purple-700">
                      This is a complex, high-cost procedure. We recommend seeking a second opinion to confirm the treatment plan and compare costs across providers.
                    </p>
                  </div>
                )}

                {/* Multi-city comparison */}
                {costEstimate.multi_city_comparison && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                    <h4 className="font-bold text-emerald-800 text-sm mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Multi-City Comparison
                    </h4>
                    <p className="text-sm text-emerald-700">{costEstimate.multi_city_comparison}</p>
                  </div>
                )}

                {/* Package deal */}
                {costEstimate.package_deal && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                    <h4 className="font-bold text-green-800 text-sm mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4" /> Package Deal Available
                    </h4>
                    <p className="text-sm text-green-700">{costEstimate.package_deal}</p>
                  </div>
                )}

                {/* Seasonal insight and cost trend */}
                {selectedProc && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <h4 className="font-bold text-gray-700 text-sm mb-2 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-blue-500" /> Seasonal Demand
                      </h4>
                      <p className="text-xs text-gray-600">{SEASONAL_INSIGHTS[selectedProc.category] || SEASONAL_INSIGHTS.general}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <h4 className="font-bold text-gray-700 text-sm mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-amber-500" /> Cost Trend
                      </h4>
                      <p className="text-xs text-gray-600">Procedure costs have risen ~8% YoY in India. Budget accordingly and check for hospital package deals.</p>
                    </div>
                  </div>
                )}

                {/* Tier Comparison Chart */}
                {tierComparisonData.length > 0 && (
                  <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">How Does This Compare?</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={tierComparisonData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="tier" tick={{ fontSize: 12 }} />
                          <YAxis tickFormatter={v => formatCurrency(v)} />
                          <Tooltip formatter={v => formatCurrencyFull(v)} />
                          <Bar dataKey="min" fill="#0F6E56" name="Min Cost" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="max" fill="#1D9E75" name="Max Cost" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Share button */}
                <div className="flex gap-3">
                  <button onClick={handleShare}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                    <Share2 className="w-4 h-4" /> Share Estimate
                  </button>
                  <button
                    onClick={() => {
                      setLoanForm(f => ({ ...f, treatmentCost: costEstimate.total_cost_max || 300000 }));
                      setActiveScreen('loan');
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
                  >
                    <CreditCard className="w-4 h-4" /> Check Loan Eligibility
                  </button>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-gray-400 text-center">{costEstimate.disclaimer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // SCREEN 4: TREATMENT PATHWAYS
  // ═══════════════════════════════════════════════════════════
  const renderPathways = () => {
    const phaseColors = ['#3B82F6', '#2563EB', '#1D4ED8', '#0F6E56', '#1D9E75', '#059669', '#10B981', '#34D399'];
    const phaseIcons = [Clipboard, Microscope, FileText, HeartPulse, BedDouble, CheckCircle, Activity, CalendarDays];

    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Treatment Pathways</h2>
        <p className="text-sm text-gray-500 mb-8">Understand your complete clinical journey from consultation to recovery</p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <select
            value={pathwayProcedure}
            onChange={e => setPathwayProcedure(e.target.value)}
            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary shadow-sm"
          >
            <option value="">Select a procedure...</option>
            {PROCEDURES_DB.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
          <button
            onClick={handlePathwayGeneration}
            disabled={!pathwayProcedure || pathwayLoading}
            className="px-8 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {pathwayLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
            Generate Pathway
          </button>
        </div>

        {pathwayLoading && <LoadingSpinner message="Generating your treatment journey..." />}
        {pathwayError && <ErrorCard message={pathwayError} onRetry={handlePathwayGeneration} />}

        {!pathwayData && !pathwayLoading && !pathwayError && (
          <div className="text-center py-24">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">Select a procedure to explore</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              We'll generate a complete clinical journey map including pre-op, surgery, recovery, and follow-up phases.
            </p>
          </div>
        )}

        {pathwayData && !pathwayLoading && (
          <div className="animate-fadeIn space-y-8">
            {/* Timeline header */}
            <div className="bg-gradient-to-r from-blue-600 to-primary text-white rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{pathwayProcedure}</h3>
                  <p className="text-blue-100 text-sm">Complete Treatment Journey</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-200 text-xs uppercase font-medium">Total Timeline</p>
                  <p className="text-2xl font-extrabold">{pathwayData.total_timeline || 'Varies'}</p>
                </div>
              </div>
              <div className="flex gap-4 mt-4 flex-wrap">
                {pathwayData.pre_authorization_required !== undefined && (
                  <div className="flex items-center gap-1 text-xs">
                    {pathwayData.pre_authorization_required ? <AlertTriangle className="w-3.5 h-3.5 text-amber-300" /> : <CheckCircle className="w-3.5 h-3.5 text-green-300" />}
                    Pre-auth {pathwayData.pre_authorization_required ? 'required' : 'not required'}
                  </div>
                )}
                {pathwayData.cashless_eligible !== undefined && (
                  <div className="flex items-center gap-1 text-xs">
                    <Shield className="w-3.5 h-3.5 text-green-300" />
                    {pathwayData.cashless_eligible ? 'Cashless eligible' : 'Reimbursement only'}
                  </div>
                )}
              </div>
            </div>

            {/* Phases timeline */}
            <div className="relative">
              {pathwayData.phases?.map((phase, index) => {
                const PhaseIcon = phaseIcons[index % phaseIcons.length];
                const isExpanded = expandedPhase === index;
                const color = phaseColors[index % phaseColors.length];

                return (
                  <div key={index} className="relative flex gap-4 mb-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center flex-shrink-0 w-10">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md" style={{ backgroundColor: color }}>
                        <PhaseIcon className="w-5 h-5" />
                      </div>
                      {index < (pathwayData.phases.length - 1) && (
                        <div className="w-0.5 flex-1 min-h-[20px]" style={{ backgroundColor: color + '40' }} />
                      )}
                    </div>

                    {/* Phase card */}
                    <div className="flex-1 pb-4">
                      <button
                        onClick={() => setExpandedPhase(isExpanded ? null : index)}
                        className="w-full bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-all text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900">{phase.phase}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{phase.duration}</span>
                              {phase.estimated_cost && (
                                <span className="text-xs font-semibold text-primary">{phase.estimated_cost}</span>
                              )}
                            </div>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>

                        {isExpanded && (
                          <div className="mt-4 space-y-3 animate-fadeIn" onClick={e => e.stopPropagation()}>
                            {phase.what_to_expect && (
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">What to Expect</p>
                                <p className="text-sm text-gray-600">{phase.what_to_expect}</p>
                              </div>
                            )}
                            {phase.activities?.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Activities</p>
                                <ul className="space-y-1">
                                  {phase.activities.map((a, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                      <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />{a}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {phase.documents_needed?.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Documents Needed</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {phase.documents_needed.map((d, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">{d}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Red flags */}
            {pathwayData.red_flags?.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <h4 className="font-bold text-red-800 text-sm mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Red Flags — When to Seek Immediate Help
                </h4>
                <ul className="space-y-2">
                  {pathwayData.red_flags.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />{f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recovery tips */}
            {pathwayData.recovery_tips?.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h4 className="font-bold text-green-800 text-sm mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Recovery Tips
                </h4>
                <ul className="space-y-2">
                  {pathwayData.recovery_tips.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />{t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Follow-up */}
            {pathwayData.follow_up_schedule && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h4 className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" /> Follow-up Schedule
                </h4>
                <p className="text-sm text-blue-700">{pathwayData.follow_up_schedule}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // SCREEN 5: LOAN ELIGIBILITY
  // ═══════════════════════════════════════════════════════════
  const renderLoanEligibility = () => {
    const loanResult = calculateLoan();
    const netAmount = loanResult.netAmount;

    // EMI vs Tenure data for chart
    const emiTenureData = [6, 12, 18, 24, 30, 36, 48, 60].map(t => {
      const r = 14 / 100 / 12;
      const emi = netAmount > 0 ? netAmount * r * Math.pow(1 + r, t) / (Math.pow(1 + r, t) - 1) : 0;
      return { tenure: `${t}m`, emi: Math.round(emi), totalInterest: Math.round(emi * t - netAmount) };
    });

    const statusColors = {
      'APPROVED': 'bg-green-100 text-green-800 border-green-300',
      'CONDITIONAL': 'bg-amber-100 text-amber-800 border-amber-300',
      'NEEDS REVIEW': 'bg-red-100 text-red-800 border-red-300'
    };

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Loan Eligibility</h2>
        <p className="text-sm text-gray-500 mb-8">Medical loan pre-qualification & NBFC integration</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Banknote className="w-4 h-4 text-primary" /> Loan Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Treatment Cost (₹)</label>
                  <input type="number" value={loanForm.treatmentCost}
                    onChange={e => setLoanForm(f => ({ ...f, treatmentCost: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Insurance Coverage (₹)</label>
                  <input type="number" value={loanForm.insuranceCoverage}
                    onChange={e => setLoanForm(f => ({ ...f, insuranceCoverage: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="bg-primary/5 rounded-lg px-4 py-3">
                  <p className="text-xs text-gray-500">Net Loan Amount Needed</p>
                  <p className="text-xl font-bold text-primary">{formatCurrencyFull(netAmount)}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Monthly Income (₹)</label>
                  <input type="number" value={loanForm.monthlyIncome}
                    onChange={e => setLoanForm(f => ({ ...f, monthlyIncome: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Employment Type</label>
                  <div className="flex gap-1.5">
                    {[['salaried', 'Salaried'], ['self-employed', 'Self-Employed'], ['business', 'Business']].map(([val, label]) => (
                      <button key={val} onClick={() => setLoanForm(f => ({ ...f, employmentType: val }))}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                          loanForm.employmentType === val ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Existing EMI (₹/month)</label>
                  <input type="number" value={loanForm.existingEMI}
                    onChange={e => setLoanForm(f => ({ ...f, existingEMI: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Credit Score: {loanForm.creditScore}</label>
                  <input type="range" min="300" max="900" value={loanForm.creditScore}
                    onChange={e => setLoanForm(f => ({ ...f, creditScore: parseInt(e.target.value) }))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-gray-400"><span>300</span><span>900</span></div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Tenure: {loanForm.tenure} months</label>
                  <input type="range" min="6" max="60" step="6" value={loanForm.tenure}
                    onChange={e => setLoanForm(f => ({ ...f, tenure: parseInt(e.target.value) }))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-gray-400"><span>6 mo</span><span>60 mo</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Status card */}
            <div className={`rounded-xl border-2 p-6 ${statusColors[loanResult.status]}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Eligibility Status</h3>
                <span className="text-2xl font-extrabold">{loanResult.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs opacity-70">Monthly EMI</p>
                  <p className="text-xl font-bold">{formatCurrencyFull(loanResult.emi)}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Max Affordable EMI</p>
                  <p className="text-xl font-bold">{formatCurrencyFull(Math.max(0, loanResult.maxEMI))}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Total Payable</p>
                  <p className="text-lg font-bold">{formatCurrencyFull(loanResult.totalPayable)}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Total Interest</p>
                  <p className="text-lg font-bold">{formatCurrencyFull(loanResult.totalInterest)}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs opacity-70">FOIR (Fixed Obligation to Income Ratio)</p>
                <div className="w-full h-3 bg-white/50 rounded-full mt-1 overflow-hidden">
                  <div className="h-full rounded-full bg-current transition-all" style={{ width: `${Math.min(parseFloat(loanResult.foir), 100)}%` }} />
                </div>
                <p className="text-xs font-bold mt-1">{loanResult.foir}% {parseFloat(loanResult.foir) < 40 ? '(Healthy)' : parseFloat(loanResult.foir) < 60 ? '(Moderate)' : '(High)'}</p>
              </div>
            </div>

            {/* EMI Chart */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">EMI vs Tenure</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={emiTenureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tenure" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={v => formatCurrency(v)} />
                    <Tooltip formatter={(v, name) => [formatCurrencyFull(v), name === 'emi' ? 'Monthly EMI' : 'Total Interest']} />
                    <Line type="monotone" dataKey="emi" stroke="#0F6E56" strokeWidth={2} dot={{ fill: '#0F6E56', r: 4 }} />
                    <Line type="monotone" dataKey="totalInterest" stroke="#EF9F27" strokeWidth={2} dot={{ fill: '#EF9F27', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Lender cards */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-primary" /> Recommended Lenders
              </h3>
              <div className="space-y-3">
                {LENDER_OPTIONS.map((lender, i) => {
                  const lr = lender.effective_rate / 100 / 12;
                  const lenderEMI = netAmount > 0 ? netAmount * lr * Math.pow(1 + lr, loanForm.tenure) / (Math.pow(1 + lr, loanForm.tenure) - 1) : 0;
                  return (
                    <div key={i} className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-gray-900 text-sm">{lender.name}</h4>
                        <span className="text-xs font-semibold text-primary">{lender.rate_display}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{lender.eligibility}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {lender.features.map((f, j) => (
                          <span key={j} className="px-2 py-0.5 bg-primary/5 text-primary text-xs rounded-full">{f}</span>
                        ))}
                      </div>
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-500">Estimated EMI for {loanForm.tenure} months</p>
                        <p className="text-lg font-bold text-primary">{formatCurrencyFull(Math.round(lenderEMI))}/mo</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* NBFC Intelligence */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary-light" /> Lender's View of This Case
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Treatment Risk Classification</span>
                  <span className="font-medium">{netAmount > 500000 ? 'High Value' : netAmount > 100000 ? 'Standard' : 'Low Value'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Repayment Capacity Signal</span>
                  <span className={`font-medium ${parseFloat(loanResult.foir) < 40 ? 'text-green-400' : parseFloat(loanResult.foir) < 60 ? 'text-amber-400' : 'text-red-400'}`}>
                    {parseFloat(loanResult.foir) < 40 ? 'Strong' : parseFloat(loanResult.foir) < 60 ? 'Moderate' : 'Strained'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Credit Profile</span>
                  <span className="font-medium">{loanForm.creditScore >= 750 ? 'Excellent' : loanForm.creditScore >= 650 ? 'Good' : 'Needs Improvement'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Recommended Loan Structure</span>
                  <span className="font-medium">{loanForm.tenure <= 12 ? 'Short-term, lower interest' : loanForm.tenure <= 36 ? 'Standard tenure' : 'Extended tenure'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Eligibility Score</span>
                  <span className="font-bold text-lg">{loanResult.eligibilityScore}/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // SHARE MODAL
  // ═══════════════════════════════════════════════════════════
  const renderShareModal = () => {
    if (!showShareModal) return null;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-fadeIn">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Share Estimate</h3>
            <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-6">
            <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 whitespace-pre-wrap max-h-80 overflow-y-auto font-mono">
              {shareContent}
            </pre>
            <button
              onClick={() => { copyToClipboard(shareContent); }}
              className="w-full mt-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" /> Copy to Clipboard
            </button>
            {copyStatus === 'success' && <p className="text-sm text-green-600 mt-2 text-center animate-fadeIn">✅ Copied to clipboard!</p>}
            {copyStatus === 'error' && <p className="text-sm text-red-600 mt-2 text-center animate-fadeIn">❌ Failed to copy to clipboard.</p>}
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════════════════════════
  const renderFooter = () => (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white rotate-45" />
            </div>
            <span className="text-lg font-bold text-white">MedRoute <span className="text-primary-light">AI</span></span>
          </div>
          <p className="text-xs text-center md:text-right max-w-lg">
            Cost estimates based on publicly available price benchmarks, NABH database, and synthetic training data. 
            Not sourced from proprietary hospital pricing. For informational purposes only.
          </p>
        </div>
        <div className="border-t border-gray-800 pt-4 text-center text-xs">
          <p>© {new Date().getFullYear()} MedRoute AI. Decision support tool — not a licensed medical provider.</p>
        </div>
      </div>
    </footer>
  );

  // ═══════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {renderShareModal()}
      {renderDisclaimerBanner()}
      {renderNavBar()}
      <main className="flex-1">
        {activeScreen === 'home' && renderHome()}
        {activeScreen === 'explorer' && renderHospitalExplorer()}
        {activeScreen === 'estimator' && renderCostEstimator()}
        {activeScreen === 'pathways' && renderPathways()}
        {activeScreen === 'loan' && renderLoanEligibility()}
      </main>
      {renderFooter()}
    </div>
  );
};

export default MedRouteAI;
