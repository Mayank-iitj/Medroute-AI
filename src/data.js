// ═══════════════════════════════════════════════════════════════
// MEDROUTE AI — SYNTHETIC HEALTHCARE DATASET FOR INDIA
// ═══════════════════════════════════════════════════════════════

export const PROCEDURES_DB = [
  {
    id: 'proc-001', name: 'Angioplasty', icd10_code: 'Z95.5', snomed_code: '36969009',
    category: 'cardiac',
    typical_symptoms: ['chest pain', 'shortness of breath', 'fatigue during exercise', 'seene mein dard'],
    related_conditions: ['Coronary artery disease', 'Angina pectoris', 'Heart attack'],
    cost_bands: { budget_min: 150000, budget_max: 250000, mid_min: 250000, mid_max: 400000, premium_min: 400000, premium_max: 700000 },
    breakdown: { procedure_pct: 45, stay_pct: 20, medicines_pct: 18, diagnostics_pct: 10, contingency_pct: 7 },
    avg_stay_days: { budget: 3, mid: 4, premium: 5 },
    comorbidity_multipliers: { diabetes: 1.15, hypertension: 1.10, cardiac_history: 1.20, obesity: 1.12, elderly: 1.18 },
    risk_level: 'high', recovery_days: 14, doctor_specialization_required: 'Interventional Cardiology'
  },
  {
    id: 'proc-002', name: 'Bypass Surgery (CABG)', icd10_code: 'Z95.1', snomed_code: '232717009',
    category: 'cardiac',
    typical_symptoms: ['severe chest pain', 'dil mein dard', 'difficulty breathing', 'heart blockage'],
    related_conditions: ['Triple vessel disease', 'Left main disease', 'Severe coronary artery disease'],
    cost_bands: { budget_min: 200000, budget_max: 350000, mid_min: 350000, mid_max: 550000, premium_min: 550000, premium_max: 900000 },
    breakdown: { procedure_pct: 40, stay_pct: 25, medicines_pct: 18, diagnostics_pct: 10, contingency_pct: 7 },
    avg_stay_days: { budget: 7, mid: 8, premium: 10 },
    comorbidity_multipliers: { diabetes: 1.20, hypertension: 1.15, cardiac_history: 1.25, obesity: 1.18, elderly: 1.22 },
    risk_level: 'high', recovery_days: 60, doctor_specialization_required: 'Cardiothoracic Surgery'
  },
  {
    id: 'proc-003', name: 'Knee Replacement', icd10_code: 'Z96.65', snomed_code: '609588000',
    category: 'orthopedic',
    typical_symptoms: ['knee pain', 'ghutne mein dard', 'difficulty walking', 'joint stiffness', 'swelling in knee'],
    related_conditions: ['Osteoarthritis', 'Rheumatoid arthritis', 'Knee joint degeneration'],
    cost_bands: { budget_min: 150000, budget_max: 250000, mid_min: 250000, mid_max: 400000, premium_min: 400000, premium_max: 650000 },
    breakdown: { procedure_pct: 50, stay_pct: 18, medicines_pct: 15, diagnostics_pct: 10, contingency_pct: 7 },
    avg_stay_days: { budget: 5, mid: 6, premium: 7 },
    comorbidity_multipliers: { diabetes: 1.15, hypertension: 1.08, cardiac_history: 1.12, obesity: 1.20, elderly: 1.15 },
    risk_level: 'medium', recovery_days: 90, doctor_specialization_required: 'Orthopedic Surgery'
  },
  {
    id: 'proc-004', name: 'Hip Replacement', icd10_code: 'Z96.64', snomed_code: '52734007',
    category: 'orthopedic',
    typical_symptoms: ['hip pain', 'koolhe mein dard', 'difficulty standing', 'groin pain'],
    related_conditions: ['Osteoarthritis of hip', 'Avascular necrosis', 'Hip fracture'],
    cost_bands: { budget_min: 200000, budget_max: 320000, mid_min: 320000, mid_max: 480000, premium_min: 480000, premium_max: 750000 },
    breakdown: { procedure_pct: 48, stay_pct: 20, medicines_pct: 15, diagnostics_pct: 10, contingency_pct: 7 },
    avg_stay_days: { budget: 5, mid: 7, premium: 8 },
    comorbidity_multipliers: { diabetes: 1.15, hypertension: 1.08, cardiac_history: 1.12, obesity: 1.22, elderly: 1.18 },
    risk_level: 'medium', recovery_days: 90, doctor_specialization_required: 'Orthopedic Surgery'
  },
  {
    id: 'proc-005', name: 'Appendectomy', icd10_code: 'K35.80', snomed_code: '80146002',
    category: 'general',
    typical_symptoms: ['stomach pain right side', 'pet mein dard', 'nausea', 'fever', 'loss of appetite'],
    related_conditions: ['Acute appendicitis', 'Peritonitis'],
    cost_bands: { budget_min: 30000, budget_max: 60000, mid_min: 60000, mid_max: 100000, premium_min: 100000, premium_max: 180000 },
    breakdown: { procedure_pct: 40, stay_pct: 25, medicines_pct: 18, diagnostics_pct: 10, contingency_pct: 7 },
    avg_stay_days: { budget: 2, mid: 3, premium: 3 },
    comorbidity_multipliers: { diabetes: 1.10, hypertension: 1.05, cardiac_history: 1.08, obesity: 1.10, elderly: 1.12 },
    risk_level: 'low', recovery_days: 14, doctor_specialization_required: 'General Surgery'
  },
  {
    id: 'proc-006', name: 'Cataract Surgery', icd10_code: 'H25.9', snomed_code: '54885007',
    category: 'ophthalmology',
    typical_symptoms: ['blurry vision', 'aankhon ki roshni kam', 'difficulty seeing at night', 'dhundhla dikhna'],
    related_conditions: ['Age-related cataract', 'Diabetic cataract', 'Secondary cataract'],
    cost_bands: { budget_min: 15000, budget_max: 35000, mid_min: 35000, mid_max: 65000, premium_min: 65000, premium_max: 120000 },
    breakdown: { procedure_pct: 55, stay_pct: 10, medicines_pct: 15, diagnostics_pct: 12, contingency_pct: 8 },
    avg_stay_days: { budget: 1, mid: 1, premium: 1 },
    comorbidity_multipliers: { diabetes: 1.15, hypertension: 1.05, cardiac_history: 1.05, obesity: 1.05, elderly: 1.10 },
    risk_level: 'low', recovery_days: 30, doctor_specialization_required: 'Ophthalmology'
  },
  {
    id: 'proc-007', name: 'Dialysis (per session)', icd10_code: 'Z99.2', snomed_code: '108241001',
    category: 'general',
    typical_symptoms: ['kidney failure', 'gurde kharab', 'swelling in body', 'fatigue', 'less urination'],
    related_conditions: ['Chronic kidney disease', 'End-stage renal failure', 'Acute kidney injury'],
    cost_bands: { budget_min: 1500, budget_max: 3000, mid_min: 3000, mid_max: 5000, premium_min: 5000, premium_max: 8000 },
    breakdown: { procedure_pct: 50, stay_pct: 15, medicines_pct: 20, diagnostics_pct: 10, contingency_pct: 5 },
    avg_stay_days: { budget: 0, mid: 0, premium: 0 },
    comorbidity_multipliers: { diabetes: 1.20, hypertension: 1.15, cardiac_history: 1.15, obesity: 1.10, elderly: 1.12 },
    risk_level: 'medium', recovery_days: 1, doctor_specialization_required: 'Nephrology'
  },
  {
    id: 'proc-008', name: 'Chemotherapy (per cycle)', icd10_code: 'Z51.11', snomed_code: '367336001',
    category: 'oncology',
    typical_symptoms: ['cancer diagnosed', 'tumor found', 'gaanth', 'unexplained weight loss', 'blood in stool'],
    related_conditions: ['Various cancers', 'Malignant tumors', 'Metastatic disease'],
    cost_bands: { budget_min: 15000, budget_max: 40000, mid_min: 40000, mid_max: 80000, premium_min: 80000, premium_max: 150000 },
    breakdown: { procedure_pct: 60, stay_pct: 10, medicines_pct: 18, diagnostics_pct: 7, contingency_pct: 5 },
    avg_stay_days: { budget: 1, mid: 1, premium: 2 },
    comorbidity_multipliers: { diabetes: 1.15, hypertension: 1.10, cardiac_history: 1.15, obesity: 1.10, elderly: 1.20 },
    risk_level: 'high', recovery_days: 7, doctor_specialization_required: 'Medical Oncology'
  },
  {
    id: 'proc-009', name: 'C-Section Delivery', icd10_code: 'O82', snomed_code: '11466000',
    category: 'gynecology',
    typical_symptoms: ['pregnancy', 'delivery complications', 'labor pain', 'high risk pregnancy'],
    related_conditions: ['Complicated labor', 'Previous C-section', 'Placenta previa', 'Breech presentation'],
    cost_bands: { budget_min: 25000, budget_max: 50000, mid_min: 50000, mid_max: 100000, premium_min: 100000, premium_max: 200000 },
    breakdown: { procedure_pct: 35, stay_pct: 30, medicines_pct: 15, diagnostics_pct: 12, contingency_pct: 8 },
    avg_stay_days: { budget: 3, mid: 4, premium: 5 },
    comorbidity_multipliers: { diabetes: 1.15, hypertension: 1.15, cardiac_history: 1.10, obesity: 1.18, elderly: 1.10 },
    risk_level: 'medium', recovery_days: 42, doctor_specialization_required: 'Obstetrics & Gynecology'
  },
  {
    id: 'proc-010', name: 'Normal Delivery', icd10_code: 'O80', snomed_code: '48782003',
    category: 'gynecology',
    typical_symptoms: ['pregnancy', 'labor pain', 'normal delivery', 'bachcha hone wala hai'],
    related_conditions: ['Full term pregnancy', 'Normal labor'],
    cost_bands: { budget_min: 10000, budget_max: 25000, mid_min: 25000, mid_max: 50000, premium_min: 50000, premium_max: 100000 },
    breakdown: { procedure_pct: 30, stay_pct: 35, medicines_pct: 15, diagnostics_pct: 12, contingency_pct: 8 },
    avg_stay_days: { budget: 2, mid: 2, premium: 3 },
    comorbidity_multipliers: { diabetes: 1.12, hypertension: 1.10, cardiac_history: 1.08, obesity: 1.10, elderly: 1.05 },
    risk_level: 'low', recovery_days: 30, doctor_specialization_required: 'Obstetrics & Gynecology'
  },
  {
    id: 'proc-011', name: 'Coronary Angiography', icd10_code: 'Z13.6', snomed_code: '33367005',
    category: 'cardiac',
    typical_symptoms: ['chest pain', 'suspected heart block', 'abnormal ECG', 'dil ki jaanch'],
    related_conditions: ['Suspected coronary artery disease', 'Unstable angina'],
    cost_bands: { budget_min: 15000, budget_max: 30000, mid_min: 30000, mid_max: 50000, premium_min: 50000, premium_max: 80000 },
    breakdown: { procedure_pct: 50, stay_pct: 15, medicines_pct: 15, diagnostics_pct: 15, contingency_pct: 5 },
    avg_stay_days: { budget: 1, mid: 1, premium: 2 },
    comorbidity_multipliers: { diabetes: 1.10, hypertension: 1.08, cardiac_history: 1.15, obesity: 1.10, elderly: 1.12 },
    risk_level: 'medium', recovery_days: 3, doctor_specialization_required: 'Interventional Cardiology'
  },
  {
    id: 'proc-012', name: 'MRI Brain', icd10_code: 'Z01.89', snomed_code: '113091000',
    category: 'neurology',
    typical_symptoms: ['severe headache', 'sir mein dard', 'seizures', 'dizziness', 'vision problems'],
    related_conditions: ['Brain tumor suspected', 'Stroke', 'Multiple sclerosis', 'Epilepsy'],
    cost_bands: { budget_min: 3000, budget_max: 6000, mid_min: 6000, mid_max: 10000, premium_min: 10000, premium_max: 18000 },
    breakdown: { procedure_pct: 70, stay_pct: 5, medicines_pct: 5, diagnostics_pct: 15, contingency_pct: 5 },
    avg_stay_days: { budget: 0, mid: 0, premium: 0 },
    comorbidity_multipliers: { diabetes: 1.05, hypertension: 1.05, cardiac_history: 1.05, obesity: 1.05, elderly: 1.05 },
    risk_level: 'low', recovery_days: 0, doctor_specialization_required: 'Radiology / Neurology'
  },
  {
    id: 'proc-013', name: 'CT Scan Chest', icd10_code: 'Z87.09', snomed_code: '169069000',
    category: 'general',
    typical_symptoms: ['cough', 'khansi', 'chest congestion', 'breathing difficulty', 'saans lene mein dikkat'],
    related_conditions: ['Lung infection', 'Pulmonary embolism', 'Lung cancer screening'],
    cost_bands: { budget_min: 2000, budget_max: 4000, mid_min: 4000, mid_max: 7000, premium_min: 7000, premium_max: 12000 },
    breakdown: { procedure_pct: 75, stay_pct: 0, medicines_pct: 5, diagnostics_pct: 15, contingency_pct: 5 },
    avg_stay_days: { budget: 0, mid: 0, premium: 0 },
    comorbidity_multipliers: { diabetes: 1.05, hypertension: 1.05, cardiac_history: 1.05, obesity: 1.05, elderly: 1.05 },
    risk_level: 'low', recovery_days: 0, doctor_specialization_required: 'Radiology / Pulmonology'
  },
  {
    id: 'proc-014', name: 'LASIK Eye Surgery', icd10_code: 'H52.1', snomed_code: '312965008',
    category: 'ophthalmology',
    typical_symptoms: ['poor vision', 'chasma utarna hai', 'nearsightedness', 'farsightedness'],
    related_conditions: ['Myopia', 'Hyperopia', 'Astigmatism'],
    cost_bands: { budget_min: 20000, budget_max: 40000, mid_min: 40000, mid_max: 70000, premium_min: 70000, premium_max: 120000 },
    breakdown: { procedure_pct: 65, stay_pct: 5, medicines_pct: 15, diagnostics_pct: 10, contingency_pct: 5 },
    avg_stay_days: { budget: 0, mid: 0, premium: 0 },
    comorbidity_multipliers: { diabetes: 1.20, hypertension: 1.05, cardiac_history: 1.02, obesity: 1.02, elderly: 1.10 },
    risk_level: 'low', recovery_days: 7, doctor_specialization_required: 'Ophthalmology'
  },
  {
    id: 'proc-015', name: 'Laparoscopic Cholecystectomy', icd10_code: 'K80.20', snomed_code: '45595009',
    category: 'general',
    typical_symptoms: ['gallstone pain', 'pittay ki pathri', 'upper stomach pain', 'nausea after eating'],
    related_conditions: ['Gallstones', 'Cholecystitis', 'Biliary colic'],
    cost_bands: { budget_min: 40000, budget_max: 70000, mid_min: 70000, mid_max: 120000, premium_min: 120000, premium_max: 200000 },
    breakdown: { procedure_pct: 42, stay_pct: 22, medicines_pct: 18, diagnostics_pct: 12, contingency_pct: 6 },
    avg_stay_days: { budget: 2, mid: 2, premium: 3 },
    comorbidity_multipliers: { diabetes: 1.12, hypertension: 1.08, cardiac_history: 1.10, obesity: 1.15, elderly: 1.12 },
    risk_level: 'low', recovery_days: 14, doctor_specialization_required: 'General Surgery'
  },
  {
    id: 'proc-016', name: 'Bariatric Surgery', icd10_code: 'E66.01', snomed_code: '83391003',
    category: 'general',
    typical_symptoms: ['morbid obesity', 'bahut mota', 'weight loss surgery', 'unable to lose weight'],
    related_conditions: ['Morbid obesity', 'Metabolic syndrome', 'Type 2 diabetes'],
    cost_bands: { budget_min: 200000, budget_max: 350000, mid_min: 350000, mid_max: 550000, premium_min: 550000, premium_max: 850000 },
    breakdown: { procedure_pct: 45, stay_pct: 20, medicines_pct: 15, diagnostics_pct: 12, contingency_pct: 8 },
    avg_stay_days: { budget: 4, mid: 5, premium: 6 },
    comorbidity_multipliers: { diabetes: 1.20, hypertension: 1.15, cardiac_history: 1.20, obesity: 1.00, elderly: 1.15 },
    risk_level: 'medium', recovery_days: 30, doctor_specialization_required: 'Bariatric Surgery'
  },
  {
    id: 'proc-017', name: 'Prostate Surgery (TURP)', icd10_code: 'N40.1', snomed_code: '176106009',
    category: 'general',
    typical_symptoms: ['difficulty urinating', 'peshab mein dikkat', 'frequent urination', 'prostate enlargement'],
    related_conditions: ['Benign prostatic hyperplasia', 'Prostate enlargement'],
    cost_bands: { budget_min: 60000, budget_max: 100000, mid_min: 100000, mid_max: 170000, premium_min: 170000, premium_max: 280000 },
    breakdown: { procedure_pct: 42, stay_pct: 25, medicines_pct: 15, diagnostics_pct: 12, contingency_pct: 6 },
    avg_stay_days: { budget: 3, mid: 4, premium: 5 },
    comorbidity_multipliers: { diabetes: 1.12, hypertension: 1.10, cardiac_history: 1.10, obesity: 1.08, elderly: 1.15 },
    risk_level: 'medium', recovery_days: 21, doctor_specialization_required: 'Urology'
  },
  {
    id: 'proc-018', name: 'Hysterectomy', icd10_code: 'N85.9', snomed_code: '236886002',
    category: 'gynecology',
    typical_symptoms: ['heavy periods', 'mahavari mein zyada khoon', 'uterine fibroids', 'pelvic pain'],
    related_conditions: ['Uterine fibroids', 'Endometriosis', 'Uterine prolapse', 'Abnormal bleeding'],
    cost_bands: { budget_min: 50000, budget_max: 100000, mid_min: 100000, mid_max: 180000, premium_min: 180000, premium_max: 300000 },
    breakdown: { procedure_pct: 40, stay_pct: 25, medicines_pct: 18, diagnostics_pct: 10, contingency_pct: 7 },
    avg_stay_days: { budget: 3, mid: 5, premium: 5 },
    comorbidity_multipliers: { diabetes: 1.12, hypertension: 1.10, cardiac_history: 1.12, obesity: 1.15, elderly: 1.12 },
    risk_level: 'medium', recovery_days: 42, doctor_specialization_required: 'Obstetrics & Gynecology'
  },
  {
    id: 'proc-019', name: 'Spinal Fusion', icd10_code: 'M43.10', snomed_code: '174764001',
    category: 'orthopedic',
    typical_symptoms: ['back pain', 'kamar dard', 'sciatica', 'numbness in legs', 'disc problem'],
    related_conditions: ['Herniated disc', 'Spinal stenosis', 'Degenerative disc disease', 'Spondylolisthesis'],
    cost_bands: { budget_min: 200000, budget_max: 350000, mid_min: 350000, mid_max: 550000, premium_min: 550000, premium_max: 900000 },
    breakdown: { procedure_pct: 45, stay_pct: 22, medicines_pct: 15, diagnostics_pct: 12, contingency_pct: 6 },
    avg_stay_days: { budget: 5, mid: 7, premium: 8 },
    comorbidity_multipliers: { diabetes: 1.15, hypertension: 1.10, cardiac_history: 1.15, obesity: 1.22, elderly: 1.20 },
    risk_level: 'high', recovery_days: 120, doctor_specialization_required: 'Spine Surgery / Neurosurgery'
  },
  {
    id: 'proc-020', name: 'Liver Transplant', icd10_code: 'Z94.4', snomed_code: '18027006',
    category: 'transplant',
    typical_symptoms: ['liver failure', 'jigar kharab', 'jaundice', 'peeliya', 'abdominal swelling'],
    related_conditions: ['Cirrhosis', 'Liver failure', 'Hepatocellular carcinoma', 'Hepatitis'],
    cost_bands: { budget_min: 1500000, budget_max: 2500000, mid_min: 2500000, mid_max: 3500000, premium_min: 3500000, premium_max: 5000000 },
    breakdown: { procedure_pct: 40, stay_pct: 25, medicines_pct: 18, diagnostics_pct: 10, contingency_pct: 7 },
    avg_stay_days: { budget: 14, mid: 18, premium: 21 },
    comorbidity_multipliers: { diabetes: 1.20, hypertension: 1.15, cardiac_history: 1.25, obesity: 1.15, elderly: 1.25 },
    risk_level: 'high', recovery_days: 180, doctor_specialization_required: 'Hepatobiliary Surgery / Transplant Surgery'
  },
  {
    id: 'proc-021', name: 'Kidney Transplant', icd10_code: 'Z94.0', snomed_code: '70536003',
    category: 'transplant',
    typical_symptoms: ['kidney failure', 'gurde fail', 'dialysis dependent', 'creatinine high'],
    related_conditions: ['End-stage renal disease', 'Chronic kidney failure', 'Polycystic kidney disease'],
    cost_bands: { budget_min: 500000, budget_max: 800000, mid_min: 800000, mid_max: 1200000, premium_min: 1200000, premium_max: 2000000 },
    breakdown: { procedure_pct: 42, stay_pct: 22, medicines_pct: 20, diagnostics_pct: 10, contingency_pct: 6 },
    avg_stay_days: { budget: 10, mid: 14, premium: 16 },
    comorbidity_multipliers: { diabetes: 1.22, hypertension: 1.15, cardiac_history: 1.20, obesity: 1.12, elderly: 1.20 },
    risk_level: 'high', recovery_days: 120, doctor_specialization_required: 'Transplant Surgery / Nephrology'
  },
  {
    id: 'proc-022', name: 'Dental Implant', icd10_code: 'K08.1', snomed_code: '398999003',
    category: 'general',
    typical_symptoms: ['missing teeth', 'daant tuta', 'tooth loss', 'dental problem'],
    related_conditions: ['Tooth loss', 'Periodontal disease', 'Dental trauma'],
    cost_bands: { budget_min: 15000, budget_max: 30000, mid_min: 30000, mid_max: 50000, premium_min: 50000, premium_max: 90000 },
    breakdown: { procedure_pct: 60, stay_pct: 5, medicines_pct: 15, diagnostics_pct: 12, contingency_pct: 8 },
    avg_stay_days: { budget: 0, mid: 0, premium: 0 },
    comorbidity_multipliers: { diabetes: 1.15, hypertension: 1.05, cardiac_history: 1.05, obesity: 1.02, elderly: 1.08 },
    risk_level: 'low', recovery_days: 14, doctor_specialization_required: 'Dental Implantology'
  },
  {
    id: 'proc-023', name: 'Rhinoplasty', icd10_code: 'J34.2', snomed_code: '62480006',
    category: 'general',
    typical_symptoms: ['nasal deformity', 'naak ki problem', 'breathing through nose difficult', 'deviated septum'],
    related_conditions: ['Deviated septum', 'Nasal deformity', 'Cosmetic correction'],
    cost_bands: { budget_min: 40000, budget_max: 80000, mid_min: 80000, mid_max: 150000, premium_min: 150000, premium_max: 300000 },
    breakdown: { procedure_pct: 55, stay_pct: 15, medicines_pct: 12, diagnostics_pct: 10, contingency_pct: 8 },
    avg_stay_days: { budget: 1, mid: 2, premium: 2 },
    comorbidity_multipliers: { diabetes: 1.08, hypertension: 1.05, cardiac_history: 1.05, obesity: 1.05, elderly: 1.08 },
    risk_level: 'low', recovery_days: 21, doctor_specialization_required: 'ENT / Plastic Surgery'
  },
  {
    id: 'proc-024', name: 'Tonsillectomy', icd10_code: 'J35.1', snomed_code: '173422009',
    category: 'general',
    typical_symptoms: ['frequent sore throat', 'gale mein dard', 'tonsil infection', 'difficulty swallowing'],
    related_conditions: ['Chronic tonsillitis', 'Peritonsillar abscess', 'Obstructive sleep apnea'],
    cost_bands: { budget_min: 20000, budget_max: 40000, mid_min: 40000, mid_max: 70000, premium_min: 70000, premium_max: 120000 },
    breakdown: { procedure_pct: 45, stay_pct: 20, medicines_pct: 18, diagnostics_pct: 10, contingency_pct: 7 },
    avg_stay_days: { budget: 1, mid: 1, premium: 2 },
    comorbidity_multipliers: { diabetes: 1.08, hypertension: 1.05, cardiac_history: 1.05, obesity: 1.05, elderly: 1.10 },
    risk_level: 'low', recovery_days: 14, doctor_specialization_required: 'ENT Surgery'
  },
  {
    id: 'proc-025', name: 'Hernia Repair', icd10_code: 'K40.90', snomed_code: '44558001',
    category: 'general',
    typical_symptoms: ['bulge in groin', 'pet mein gaanth', 'pain when lifting', 'hernia', 'haath pair mein sujan'],
    related_conditions: ['Inguinal hernia', 'Umbilical hernia', 'Incisional hernia'],
    cost_bands: { budget_min: 35000, budget_max: 65000, mid_min: 65000, mid_max: 110000, premium_min: 110000, premium_max: 180000 },
    breakdown: { procedure_pct: 42, stay_pct: 22, medicines_pct: 18, diagnostics_pct: 12, contingency_pct: 6 },
    avg_stay_days: { budget: 2, mid: 2, premium: 3 },
    comorbidity_multipliers: { diabetes: 1.12, hypertension: 1.08, cardiac_history: 1.08, obesity: 1.15, elderly: 1.12 },
    risk_level: 'low', recovery_days: 21, doctor_specialization_required: 'General Surgery'
  },
  {
    id: 'proc-026', name: 'Varicose Vein Treatment', icd10_code: 'I83.90', snomed_code: '233581004',
    category: 'general',
    typical_symptoms: ['swollen veins on legs', 'pairo ki nason mein sujan', 'heavy legs', 'leg pain'],
    related_conditions: ['Varicose veins', 'Venous insufficiency'],
    cost_bands: { budget_min: 30000, budget_max: 60000, mid_min: 60000, mid_max: 100000, premium_min: 100000, premium_max: 180000 },
    breakdown: { procedure_pct: 50, stay_pct: 15, medicines_pct: 15, diagnostics_pct: 12, contingency_pct: 8 },
    avg_stay_days: { budget: 1, mid: 1, premium: 2 },
    comorbidity_multipliers: { diabetes: 1.10, hypertension: 1.08, cardiac_history: 1.08, obesity: 1.12, elderly: 1.10 },
    risk_level: 'low', recovery_days: 14, doctor_specialization_required: 'Vascular Surgery'
  },
  {
    id: 'proc-027', name: 'Pacemaker Implant', icd10_code: 'Z95.0', snomed_code: '307280005',
    category: 'cardiac',
    typical_symptoms: ['heart rhythm issue', 'dil ki dhadkan gair mamooli', 'fainting', 'dizziness', 'bradycardia'],
    related_conditions: ['Bradycardia', 'Heart block', 'Sick sinus syndrome', 'Atrial fibrillation'],
    cost_bands: { budget_min: 200000, budget_max: 350000, mid_min: 350000, mid_max: 550000, premium_min: 550000, premium_max: 850000 },
    breakdown: { procedure_pct: 55, stay_pct: 18, medicines_pct: 12, diagnostics_pct: 10, contingency_pct: 5 },
    avg_stay_days: { budget: 3, mid: 4, premium: 5 },
    comorbidity_multipliers: { diabetes: 1.12, hypertension: 1.10, cardiac_history: 1.25, obesity: 1.10, elderly: 1.18 },
    risk_level: 'high', recovery_days: 30, doctor_specialization_required: 'Cardiac Electrophysiology'
  },
  {
    id: 'proc-028', name: 'Gastric Bypass', icd10_code: 'E66.01', snomed_code: '26390003',
    category: 'general',
    typical_symptoms: ['morbid obesity', 'bahut wajan', 'weight related issues', 'diabetes not controlled'],
    related_conditions: ['Class III obesity', 'Metabolic syndrome', 'Failed weight loss'],
    cost_bands: { budget_min: 250000, budget_max: 400000, mid_min: 400000, mid_max: 600000, premium_min: 600000, premium_max: 950000 },
    breakdown: { procedure_pct: 45, stay_pct: 22, medicines_pct: 15, diagnostics_pct: 12, contingency_pct: 6 },
    avg_stay_days: { budget: 4, mid: 5, premium: 7 },
    comorbidity_multipliers: { diabetes: 1.18, hypertension: 1.12, cardiac_history: 1.18, obesity: 1.00, elderly: 1.15 },
    risk_level: 'medium', recovery_days: 42, doctor_specialization_required: 'Bariatric Surgery'
  },
  {
    id: 'proc-029', name: 'ACL Repair', icd10_code: 'S83.51', snomed_code: '239220009',
    category: 'orthopedic',
    typical_symptoms: ['knee injury', 'ghutna chot', 'knee popping sound', 'knee instability', 'sports injury'],
    related_conditions: ['ACL tear', 'Knee ligament injury', 'Sports injury'],
    cost_bands: { budget_min: 100000, budget_max: 180000, mid_min: 180000, mid_max: 300000, premium_min: 300000, premium_max: 500000 },
    breakdown: { procedure_pct: 48, stay_pct: 18, medicines_pct: 15, diagnostics_pct: 12, contingency_pct: 7 },
    avg_stay_days: { budget: 2, mid: 3, premium: 3 },
    comorbidity_multipliers: { diabetes: 1.12, hypertension: 1.05, cardiac_history: 1.08, obesity: 1.15, elderly: 1.12 },
    risk_level: 'medium', recovery_days: 180, doctor_specialization_required: 'Orthopedic Surgery / Sports Medicine'
  },
  {
    id: 'proc-030', name: 'Thyroid Surgery', icd10_code: 'E04.9', snomed_code: '13619001',
    category: 'general',
    typical_symptoms: ['thyroid swelling', 'gale mein gaanth', 'weight gain', 'fatigue', 'thyroid problem'],
    related_conditions: ['Thyroid nodule', 'Thyroid cancer', 'Goiter', 'Hyperthyroidism'],
    cost_bands: { budget_min: 50000, budget_max: 90000, mid_min: 90000, mid_max: 150000, premium_min: 150000, premium_max: 250000 },
    breakdown: { procedure_pct: 42, stay_pct: 22, medicines_pct: 18, diagnostics_pct: 12, contingency_pct: 6 },
    avg_stay_days: { budget: 2, mid: 3, premium: 3 },
    comorbidity_multipliers: { diabetes: 1.10, hypertension: 1.08, cardiac_history: 1.10, obesity: 1.08, elderly: 1.12 },
    risk_level: 'medium', recovery_days: 21, doctor_specialization_required: 'ENT Surgery / Endocrine Surgery'
  }
];

export const HOSPITALS_DB = [
  // MUMBAI (3 hospitals)
  {
    id: 'hosp-001', name: 'Kokilaben Dhirubhai Ambani Hospital', city: 'Mumbai', pincode: '400053',
    lat: 19.1298, lng: 72.8279, tier: 'premium', nabh_accredited: true,
    rating: 4.8, review_count: 12450,
    specializations: ['Cardiology', 'Oncology', 'Neurology', 'Transplant Surgery', 'Orthopedics'],
    procedures: [
      { name: 'Angioplasty', base_cost_min: 500000, base_cost_max: 750000 },
      { name: 'Bypass Surgery (CABG)', base_cost_min: 600000, base_cost_max: 950000 },
      { name: 'Knee Replacement', base_cost_min: 450000, base_cost_max: 700000 },
      { name: 'Liver Transplant', base_cost_min: 4000000, base_cost_max: 5500000 },
      { name: 'Kidney Transplant', base_cost_min: 1400000, base_cost_max: 2200000 }
    ],
    beds: 750, icu_beds: 120, avg_wait_days: 3,
    insurance_accepted: ['Star Health', 'ICICI Lombard', 'HDFC ERGO', 'Max Bupa', 'New India Assurance'],
    contact: '+91-22-3069-9999', established_year: 2009
  },
  {
    id: 'hosp-002', name: 'Lilavati Hospital', city: 'Mumbai', pincode: '400050',
    lat: 19.0509, lng: 72.8294, tier: 'premium', nabh_accredited: true,
    rating: 4.6, review_count: 9800,
    specializations: ['Cardiology', 'Orthopedics', 'Gynecology', 'Ophthalmology', 'General Surgery'],
    procedures: [
      { name: 'Angioplasty', base_cost_min: 450000, base_cost_max: 680000 },
      { name: 'Knee Replacement', base_cost_min: 420000, base_cost_max: 650000 },
      { name: 'C-Section Delivery', base_cost_min: 120000, base_cost_max: 220000 },
      { name: 'Cataract Surgery', base_cost_min: 70000, base_cost_max: 130000 },
      { name: 'Hernia Repair', base_cost_min: 120000, base_cost_max: 190000 }
    ],
    beds: 323, icu_beds: 65, avg_wait_days: 2,
    insurance_accepted: ['Star Health', 'ICICI Lombard', 'Bajaj Allianz', 'Max Bupa'],
    contact: '+91-22-2675-1000', established_year: 1978
  },
  {
    id: 'hosp-003', name: 'Shushrusha Citizens Hospital', city: 'Mumbai', pincode: '400028',
    lat: 19.0176, lng: 72.8414, tier: 'budget', nabh_accredited: false,
    rating: 3.9, review_count: 3200,
    specializations: ['General Surgery', 'Gynecology', 'Orthopedics', 'ENT'],
    procedures: [
      { name: 'Appendectomy', base_cost_min: 35000, base_cost_max: 65000 },
      { name: 'C-Section Delivery', base_cost_min: 30000, base_cost_max: 55000 },
      { name: 'Hernia Repair', base_cost_min: 40000, base_cost_max: 70000 },
      { name: 'Tonsillectomy', base_cost_min: 22000, base_cost_max: 42000 },
      { name: 'Normal Delivery', base_cost_min: 12000, base_cost_max: 28000 }
    ],
    beds: 120, icu_beds: 15, avg_wait_days: 1,
    insurance_accepted: ['New India Assurance', 'Star Health'],
    contact: '+91-22-2422-5000', established_year: 1962
  },
  // DELHI (3)
  {
    id: 'hosp-004', name: 'Medanta - The Medicity', city: 'Delhi', pincode: '122001',
    lat: 28.4422, lng: 77.0421, tier: 'premium', nabh_accredited: true,
    rating: 4.7, review_count: 15600,
    specializations: ['Cardiology', 'Oncology', 'Neurology', 'Transplant Surgery', 'Bariatric Surgery'],
    procedures: [
      { name: 'Bypass Surgery (CABG)', base_cost_min: 580000, base_cost_max: 920000 },
      { name: 'Liver Transplant', base_cost_min: 3800000, base_cost_max: 5200000 },
      { name: 'Kidney Transplant', base_cost_min: 1300000, base_cost_max: 2100000 },
      { name: 'Bariatric Surgery', base_cost_min: 580000, base_cost_max: 880000 },
      { name: 'Spinal Fusion', base_cost_min: 580000, base_cost_max: 920000 }
    ],
    beds: 1250, icu_beds: 350, avg_wait_days: 4,
    insurance_accepted: ['Star Health', 'ICICI Lombard', 'HDFC ERGO', 'Max Bupa', 'Bajaj Allianz', 'New India Assurance'],
    contact: '+91-124-414-1414', established_year: 2009
  },
  {
    id: 'hosp-005', name: 'Sir Ganga Ram Hospital', city: 'Delhi', pincode: '110060',
    lat: 28.6383, lng: 77.1881, tier: 'mid', nabh_accredited: true,
    rating: 4.5, review_count: 11200,
    specializations: ['Cardiology', 'Orthopedics', 'Gynecology', 'Neurology', 'Urology'],
    procedures: [
      { name: 'Angioplasty', base_cost_min: 280000, base_cost_max: 420000 },
      { name: 'Knee Replacement', base_cost_min: 280000, base_cost_max: 420000 },
      { name: 'Hysterectomy', base_cost_min: 110000, base_cost_max: 190000 },
      { name: 'Prostate Surgery (TURP)', base_cost_min: 110000, base_cost_max: 180000 },
      { name: 'Pacemaker Implant', base_cost_min: 370000, base_cost_max: 570000 }
    ],
    beds: 675, icu_beds: 100, avg_wait_days: 3,
    insurance_accepted: ['Star Health', 'ICICI Lombard', 'HDFC ERGO', 'New India Assurance'],
    contact: '+91-11-2575-0000', established_year: 1921
  },
  {
    id: 'hosp-006', name: 'Safdarjung Hospital', city: 'Delhi', pincode: '110029',
    lat: 28.5677, lng: 77.2097, tier: 'budget', nabh_accredited: false,
    rating: 3.7, review_count: 8900,
    specializations: ['General Surgery', 'Orthopedics', 'Gynecology', 'Ophthalmology'],
    procedures: [
      { name: 'Appendectomy', base_cost_min: 32000, base_cost_max: 58000 },
      { name: 'C-Section Delivery', base_cost_min: 28000, base_cost_max: 52000 },
      { name: 'Cataract Surgery', base_cost_min: 18000, base_cost_max: 38000 },
      { name: 'Hernia Repair', base_cost_min: 38000, base_cost_max: 68000 },
      { name: 'Normal Delivery', base_cost_min: 10000, base_cost_max: 22000 }
    ],
    beds: 1531, icu_beds: 80, avg_wait_days: 5,
    insurance_accepted: ['New India Assurance', 'ECHS', 'CGHS'],
    contact: '+91-11-2673-0000', established_year: 1942
  },
  // BENGALURU (3)
  {
    id: 'hosp-007', name: 'Narayana Health City', city: 'Bengaluru', pincode: '560099',
    lat: 12.8861, lng: 77.5986, tier: 'mid', nabh_accredited: true,
    rating: 4.6, review_count: 14200,
    specializations: ['Cardiology', 'Orthopedics', 'Oncology', 'Transplant Surgery', 'Neurology'],
    procedures: [
      { name: 'Bypass Surgery (CABG)', base_cost_min: 380000, base_cost_max: 580000 },
      { name: 'Angioplasty', base_cost_min: 270000, base_cost_max: 420000 },
      { name: 'Kidney Transplant', base_cost_min: 900000, base_cost_max: 1300000 },
      { name: 'Knee Replacement', base_cost_min: 270000, base_cost_max: 420000 },
      { name: 'Chemotherapy (per cycle)', base_cost_min: 45000, base_cost_max: 85000 }
    ],
    beds: 3200, icu_beds: 500, avg_wait_days: 2,
    insurance_accepted: ['Star Health', 'ICICI Lombard', 'HDFC ERGO', 'Max Bupa', 'Bajaj Allianz'],
    contact: '+91-80-7122-2222', established_year: 2001
  },
  {
    id: 'hosp-008', name: 'Manipal Hospital Whitefield', city: 'Bengaluru', pincode: '560066',
    lat: 12.9698, lng: 77.7500, tier: 'premium', nabh_accredited: true,
    rating: 4.5, review_count: 8900,
    specializations: ['Cardiology', 'Orthopedics', 'Oncology', 'Gynecology', 'Ophthalmology'],
    procedures: [
      { name: 'Angioplasty', base_cost_min: 480000, base_cost_max: 720000 },
      { name: 'Knee Replacement', base_cost_min: 430000, base_cost_max: 670000 },
      { name: 'LASIK Eye Surgery', base_cost_min: 75000, base_cost_max: 125000 },
      { name: 'C-Section Delivery', base_cost_min: 110000, base_cost_max: 210000 },
      { name: 'Cataract Surgery', base_cost_min: 68000, base_cost_max: 125000 }
    ],
    beds: 520, icu_beds: 90, avg_wait_days: 3,
    insurance_accepted: ['Star Health', 'ICICI Lombard', 'HDFC ERGO', 'Max Bupa'],
    contact: '+91-80-2502-4444', established_year: 2014
  },
  {
    id: 'hosp-009', name: 'St. Johns Medical College Hospital', city: 'Bengaluru', pincode: '560034',
    lat: 12.9279, lng: 77.6197, tier: 'budget', nabh_accredited: true,
    rating: 4.2, review_count: 6700,
    specializations: ['General Surgery', 'Orthopedics', 'Gynecology', 'Neurology', 'Cardiology'],
    procedures: [
      { name: 'Appendectomy', base_cost_min: 32000, base_cost_max: 62000 },
      { name: 'C-Section Delivery', base_cost_min: 28000, base_cost_max: 52000 },
      { name: 'Thyroid Surgery', base_cost_min: 55000, base_cost_max: 95000 },
      { name: 'Normal Delivery', base_cost_min: 12000, base_cost_max: 26000 },
      { name: 'Hernia Repair', base_cost_min: 38000, base_cost_max: 68000 }
    ],
    beds: 1250, icu_beds: 60, avg_wait_days: 4,
    insurance_accepted: ['New India Assurance', 'Star Health'],
    contact: '+91-80-2206-5000', established_year: 1963
  },
  // PUNE (2)
  {
    id: 'hosp-010', name: 'Ruby Hall Clinic', city: 'Pune', pincode: '411001',
    lat: 18.5357, lng: 73.8903, tier: 'mid', nabh_accredited: true,
    rating: 4.4, review_count: 7800,
    specializations: ['Cardiology', 'Orthopedics', 'Oncology', 'Gynecology', 'General Surgery'],
    procedures: [
      { name: 'Angioplasty', base_cost_min: 260000, base_cost_max: 400000 },
      { name: 'Bypass Surgery (CABG)', base_cost_min: 360000, base_cost_max: 560000 },
      { name: 'Knee Replacement', base_cost_min: 260000, base_cost_max: 410000 },
      { name: 'C-Section Delivery', base_cost_min: 55000, base_cost_max: 105000 },
      { name: 'Laparoscopic Cholecystectomy', base_cost_min: 75000, base_cost_max: 125000 }
    ],
    beds: 550, icu_beds: 80, avg_wait_days: 2,
    insurance_accepted: ['Star Health', 'ICICI Lombard', 'HDFC ERGO', 'Bajaj Allianz'],
    contact: '+91-20-2616-3391', established_year: 1969
  },
  {
    id: 'hosp-011', name: 'Sahyadri Hospitals', city: 'Pune', pincode: '411004',
    lat: 18.5120, lng: 73.8569, tier: 'mid', nabh_accredited: true,
    rating: 4.3, review_count: 6500,
    specializations: ['Cardiology', 'Neurology', 'Orthopedics', 'Urology', 'General Surgery'],
    procedures: [
      { name: 'Coronary Angiography', base_cost_min: 32000, base_cost_max: 52000 },
      { name: 'Spinal Fusion', base_cost_min: 360000, base_cost_max: 560000 },
      { name: 'Prostate Surgery (TURP)', base_cost_min: 105000, base_cost_max: 175000 },
      { name: 'ACL Repair', base_cost_min: 190000, base_cost_max: 310000 },
      { name: 'Hernia Repair', base_cost_min: 68000, base_cost_max: 115000 }
    ],
    beds: 420, icu_beds: 70, avg_wait_days: 2,
    insurance_accepted: ['Star Health', 'ICICI Lombard', 'HDFC ERGO', 'New India Assurance'],
    contact: '+91-20-4014-8000', established_year: 1988
  },
  // NAGPUR (2)
  {
    id: 'hosp-012', name: 'Wockhardt Hospital Nagpur', city: 'Nagpur', pincode: '440015',
    lat: 21.1480, lng: 79.0694, tier: 'mid', nabh_accredited: true,
    rating: 4.2, review_count: 4200,
    specializations: ['Cardiology', 'Orthopedics', 'General Surgery', 'Gynecology', 'Neurology'],
    procedures: [
      { name: 'Angioplasty', base_cost_min: 220000, base_cost_max: 350000 },
      { name: 'Knee Replacement', base_cost_min: 220000, base_cost_max: 350000 },
      { name: 'Bypass Surgery (CABG)', base_cost_min: 300000, base_cost_max: 480000 },
      { name: 'C-Section Delivery', base_cost_min: 45000, base_cost_max: 85000 },
      { name: 'Appendectomy', base_cost_min: 28000, base_cost_max: 52000 }
    ],
    beds: 280, icu_beds: 50, avg_wait_days: 1,
    insurance_accepted: ['Star Health', 'ICICI Lombard', 'Max Bupa', 'New India Assurance'],
    contact: '+91-712-666-3000', established_year: 1989
  },
  {
    id: 'hosp-013', name: 'KRIMS Hospital', city: 'Nagpur', pincode: '440012',
    lat: 21.1329, lng: 79.0480, tier: 'budget', nabh_accredited: false,
    rating: 3.8, review_count: 2800,
    specializations: ['General Surgery', 'Orthopedics', 'Gynecology', 'Ophthalmology'],
    procedures: [
      { name: 'Appendectomy', base_cost_min: 25000, base_cost_max: 48000 },
      { name: 'Cataract Surgery', base_cost_min: 14000, base_cost_max: 30000 },
      { name: 'Hernia Repair', base_cost_min: 30000, base_cost_max: 56000 },
      { name: 'Normal Delivery', base_cost_min: 8000, base_cost_max: 20000 },
      { name: 'Tonsillectomy', base_cost_min: 18000, base_cost_max: 35000 }
    ],
    beds: 180, icu_beds: 25, avg_wait_days: 1,
    insurance_accepted: ['New India Assurance', 'Star Health'],
    contact: '+91-712-254-4444', established_year: 1995
  },
  // HYDERABAD (3)
  {
    id: 'hosp-014', name: 'AIG Hospitals', city: 'Hyderabad', pincode: '500032',
    lat: 17.4225, lng: 78.4528, tier: 'premium', nabh_accredited: true,
    rating: 4.7, review_count: 9400,
    specializations: ['Gastroenterology', 'Cardiology', 'Orthopedics', 'Oncology', 'Bariatric Surgery'],
    procedures: [
      { name: 'Bariatric Surgery', base_cost_min: 370000, base_cost_max: 570000 },
      { name: 'Gastric Bypass', base_cost_min: 420000, base_cost_max: 620000 },
      { name: 'Laparoscopic Cholecystectomy', base_cost_min: 80000, base_cost_max: 130000 },
      { name: 'Angioplasty', base_cost_min: 270000, base_cost_max: 420000 },
      { name: 'Chemotherapy (per cycle)', base_cost_min: 42000, base_cost_max: 82000 }
    ],
    beds: 450, icu_beds: 75, avg_wait_days: 2,
    insurance_accepted: ['Star Health', 'ICICI Lombard', 'HDFC ERGO', 'Max Bupa', 'Bajaj Allianz'],
    contact: '+91-40-4244-4222', established_year: 2011
  },
  {
    id: 'hosp-015', name: 'Yashoda Hospitals Malakpet', city: 'Hyderabad', pincode: '500036',
    lat: 17.3733, lng: 78.5008, tier: 'mid', nabh_accredited: true,
    rating: 4.3, review_count: 7200,
    specializations: ['Cardiology', 'Nephrology', 'Orthopedics', 'Neurology', 'Urology'],
    procedures: [
      { name: 'Kidney Transplant', base_cost_min: 850000, base_cost_max: 1250000 },
      { name: 'Dialysis (per session)', base_cost_min: 3200, base_cost_max: 5200 },
      { name: 'Knee Replacement', base_cost_min: 260000, base_cost_max: 410000 },
      { name: 'Pacemaker Implant', base_cost_min: 360000, base_cost_max: 560000 },
      { name: 'Prostate Surgery (TURP)', base_cost_min: 105000, base_cost_max: 175000 }
    ],
    beds: 500, icu_beds: 80, avg_wait_days: 2,
    insurance_accepted: ['Star Health', 'ICICI Lombard', 'HDFC ERGO', 'New India Assurance'],
    contact: '+91-40-4567-4567', established_year: 1989
  },
  {
    id: 'hosp-016', name: 'Gandhi Hospital', city: 'Hyderabad', pincode: '500003',
    lat: 17.4036, lng: 78.4742, tier: 'budget', nabh_accredited: false,
    rating: 3.6, review_count: 5400,
    specializations: ['General Surgery', 'Orthopedics', 'Gynecology', 'Ophthalmology'],
    procedures: [
      { name: 'Appendectomy', base_cost_min: 26000, base_cost_max: 50000 },
      { name: 'C-Section Delivery', base_cost_min: 25000, base_cost_max: 48000 },
      { name: 'Cataract Surgery', base_cost_min: 15000, base_cost_max: 32000 },
      { name: 'Normal Delivery', base_cost_min: 9000, base_cost_max: 20000 },
      { name: 'Thyroid Surgery', base_cost_min: 48000, base_cost_max: 85000 }
    ],
    beds: 1500, icu_beds: 60, avg_wait_days: 5,
    insurance_accepted: ['New India Assurance', 'ECHS'],
    contact: '+91-40-2750-1000', established_year: 1851
  },
  // CHENNAI (3)
  {
    id: 'hosp-017', name: 'Apollo Hospital Greams Road', city: 'Chennai', pincode: '600006',
    lat: 13.0572, lng: 80.2526, tier: 'premium', nabh_accredited: true,
    rating: 4.7, review_count: 16800,
    specializations: ['Cardiology', 'Oncology', 'Transplant Surgery', 'Orthopedics', 'Neurology'],
    procedures: [
      { name: 'Liver Transplant', base_cost_min: 2800000, base_cost_max: 3800000 },
      { name: 'Bypass Surgery (CABG)', base_cost_min: 370000, base_cost_max: 580000 },
      { name: 'Kidney Transplant', base_cost_min: 900000, base_cost_max: 1350000 },
      { name: 'Angioplasty', base_cost_min: 270000, base_cost_max: 420000 },
      { name: 'Knee Replacement', base_cost_min: 280000, base_cost_max: 450000 }
    ],
    beds: 710, icu_beds: 130, avg_wait_days: 3,
    insurance_accepted: ['Star Health', 'ICICI Lombard', 'HDFC ERGO', 'Max Bupa', 'Bajaj Allianz', 'New India Assurance'],
    contact: '+91-44-2829-3333', established_year: 1983
  },
  {
    id: 'hosp-018', name: 'MIOT International', city: 'Chennai', pincode: '600089',
    lat: 13.0105, lng: 80.1713, tier: 'mid', nabh_accredited: true,
    rating: 4.4, review_count: 7600,
    specializations: ['Orthopedics', 'Cardiology', 'Neurology', 'Spine Surgery', 'General Surgery'],
    procedures: [
      { name: 'Knee Replacement', base_cost_min: 260000, base_cost_max: 400000 },
      { name: 'Hip Replacement', base_cost_min: 340000, base_cost_max: 500000 },
      { name: 'Spinal Fusion', base_cost_min: 370000, base_cost_max: 570000 },
      { name: 'ACL Repair', base_cost_min: 190000, base_cost_max: 310000 },
      { name: 'Coronary Angiography', base_cost_min: 32000, base_cost_max: 52000 }
    ],
    beds: 600, icu_beds: 95, avg_wait_days: 2,
    insurance_accepted: ['Star Health', 'ICICI Lombard', 'HDFC ERGO', 'New India Assurance'],
    contact: '+91-44-4200-2288', established_year: 1999
  },
  {
    id: 'hosp-019', name: 'Stanley Medical College Hospital', city: 'Chennai', pincode: '600001',
    lat: 13.1135, lng: 80.2874, tier: 'budget', nabh_accredited: false,
    rating: 3.8, review_count: 4500,
    specializations: ['General Surgery', 'Orthopedics', 'Gynecology', 'ENT'],
    procedures: [
      { name: 'Appendectomy', base_cost_min: 28000, base_cost_max: 55000 },
      { name: 'C-Section Delivery', base_cost_min: 25000, base_cost_max: 50000 },
      { name: 'Hernia Repair', base_cost_min: 35000, base_cost_max: 62000 },
      { name: 'Tonsillectomy', base_cost_min: 20000, base_cost_max: 38000 },
      { name: 'Varicose Vein Treatment', base_cost_min: 32000, base_cost_max: 62000 }
    ],
    beds: 1200, icu_beds: 50, avg_wait_days: 4,
    insurance_accepted: ['New India Assurance', 'ECHS'],
    contact: '+91-44-2521-1100', established_year: 1938
  },
  // JAIPUR (2)
  {
    id: 'hosp-020', name: 'Fortis Escorts Hospital Jaipur', city: 'Jaipur', pincode: '302017',
    lat: 26.8600, lng: 75.7700, tier: 'mid', nabh_accredited: true,
    rating: 4.3, review_count: 5800,
    specializations: ['Cardiology', 'Orthopedics', 'Neurology', 'Urology', 'General Surgery'],
    procedures: [
      { name: 'Angioplasty', base_cost_min: 210000, base_cost_max: 340000 },
      { name: 'Knee Replacement', base_cost_min: 210000, base_cost_max: 340000 },
      { name: 'Bypass Surgery (CABG)', base_cost_min: 300000, base_cost_max: 470000 },
      { name: 'Pacemaker Implant', base_cost_min: 300000, base_cost_max: 470000 },
      { name: 'ACL Repair', base_cost_min: 155000, base_cost_max: 255000 }
    ],
    beds: 300, icu_beds: 55, avg_wait_days: 2,
    insurance_accepted: ['Star Health', 'ICICI Lombard', 'HDFC ERGO', 'Bajaj Allianz'],
    contact: '+91-141-254-7000', established_year: 2007
  },
  {
    id: 'hosp-021', name: 'Mahatma Gandhi Hospital', city: 'Jaipur', pincode: '302022',
    lat: 26.8100, lng: 75.7900, tier: 'budget', nabh_accredited: false,
    rating: 3.7, review_count: 4100,
    specializations: ['General Surgery', 'Orthopedics', 'Gynecology', 'Ophthalmology', 'ENT'],
    procedures: [
      { name: 'Appendectomy', base_cost_min: 22000, base_cost_max: 42000 },
      { name: 'Cataract Surgery', base_cost_min: 12000, base_cost_max: 28000 },
      { name: 'C-Section Delivery', base_cost_min: 22000, base_cost_max: 42000 },
      { name: 'Hernia Repair', base_cost_min: 28000, base_cost_max: 52000 },
      { name: 'Normal Delivery', base_cost_min: 8000, base_cost_max: 18000 }
    ],
    beds: 900, icu_beds: 40, avg_wait_days: 3,
    insurance_accepted: ['New India Assurance', 'ECHS', 'CGHS'],
    contact: '+91-141-251-8888', established_year: 1972
  }
];

export const SYMPTOM_MAP = {
  // Hindi / Hinglish mappings
  'seene mein dard': { category: 'cardiac', keywords: ['chest pain', 'angina'], urgency: 'urgent' },
  'dil mein dard': { category: 'cardiac', keywords: ['heart pain', 'cardiac'], urgency: 'urgent' },
  'ghutne mein dard': { category: 'orthopedic', keywords: ['knee pain', 'joint pain'], urgency: 'routine' },
  'kamar dard': { category: 'orthopedic', keywords: ['back pain', 'spinal'], urgency: 'routine' },
  'koolhe mein dard': { category: 'orthopedic', keywords: ['hip pain'], urgency: 'routine' },
  'aankhon ki roshni': { category: 'ophthalmology', keywords: ['vision', 'eye sight'], urgency: 'routine' },
  'aankhon ki roshni kam': { category: 'ophthalmology', keywords: ['blurry vision', 'cataract'], urgency: 'routine' },
  'dhundhla dikhna': { category: 'ophthalmology', keywords: ['blurry vision'], urgency: 'routine' },
  'chasma utarna': { category: 'ophthalmology', keywords: ['LASIK', 'vision correction'], urgency: 'routine' },
  'pet mein dard': { category: 'general', keywords: ['stomach pain', 'abdominal'], urgency: 'routine' },
  'sir mein dard': { category: 'neurology', keywords: ['headache', 'migraine'], urgency: 'routine' },
  'saans lene mein dikkat': { category: 'cardiac', keywords: ['breathing difficulty', 'dyspnea'], urgency: 'urgent' },
  'gurde kharab': { category: 'transplant', keywords: ['kidney failure', 'renal'], urgency: 'urgent' },
  'jigar kharab': { category: 'transplant', keywords: ['liver failure'], urgency: 'urgent' },
  'peeliya': { category: 'transplant', keywords: ['jaundice', 'liver'], urgency: 'urgent' },
  'pittay ki pathri': { category: 'general', keywords: ['gallstone'], urgency: 'routine' },
  'gale mein dard': { category: 'general', keywords: ['throat pain', 'tonsillitis'], urgency: 'routine' },
  'gale mein gaanth': { category: 'general', keywords: ['thyroid', 'neck lump'], urgency: 'routine' },
  'pet mein gaanth': { category: 'general', keywords: ['hernia', 'lump'], urgency: 'routine' },
  'peshab mein dikkat': { category: 'general', keywords: ['urinary problem', 'prostate'], urgency: 'routine' },
  'mahavari mein zyada khoon': { category: 'gynecology', keywords: ['heavy periods', 'menorrhagia'], urgency: 'routine' },
  'bachcha hone wala hai': { category: 'gynecology', keywords: ['pregnancy', 'delivery'], urgency: 'routine' },
  'gaanth': { category: 'oncology', keywords: ['tumor', 'lump', 'cancer'], urgency: 'urgent' },
  'naak ki problem': { category: 'general', keywords: ['nasal', 'ENT'], urgency: 'routine' },
  'daant tuta': { category: 'general', keywords: ['dental', 'tooth'], urgency: 'routine' },
  'bahut mota': { category: 'general', keywords: ['obesity', 'weight'], urgency: 'routine' },
  'dil ki dhadkan': { category: 'cardiac', keywords: ['heart rhythm', 'palpitations'], urgency: 'urgent' },
  'khansi': { category: 'general', keywords: ['cough', 'pulmonary'], urgency: 'routine' },
  'pairo ki nason mein sujan': { category: 'general', keywords: ['varicose veins'], urgency: 'routine' },
  
  // English symptom mappings  
  'chest pain': { category: 'cardiac', keywords: ['angina', 'heart attack'], urgency: 'urgent' },
  'knee pain': { category: 'orthopedic', keywords: ['joint', 'arthritis'], urgency: 'routine' },
  'back pain': { category: 'orthopedic', keywords: ['spine', 'disc'], urgency: 'routine' },
  'heart problem': { category: 'cardiac', keywords: ['cardiac', 'coronary'], urgency: 'urgent' },
  'eye problem': { category: 'ophthalmology', keywords: ['vision', 'cataract'], urgency: 'routine' },
  'cancer': { category: 'oncology', keywords: ['tumor', 'malignant'], urgency: 'urgent' },
  'pregnancy': { category: 'gynecology', keywords: ['delivery', 'maternity'], urgency: 'routine' },
  'kidney problem': { category: 'transplant', keywords: ['renal', 'dialysis'], urgency: 'urgent' },
  'liver problem': { category: 'transplant', keywords: ['hepatic', 'cirrhosis'], urgency: 'urgent' },
  'headache': { category: 'neurology', keywords: ['migraine', 'brain'], urgency: 'routine' },
  'stomach pain': { category: 'general', keywords: ['abdominal', 'gastric'], urgency: 'routine' },
  'difficulty breathing': { category: 'cardiac', keywords: ['dyspnea', 'respiratory'], urgency: 'urgent' },
  'weight loss surgery': { category: 'general', keywords: ['bariatric', 'obesity'], urgency: 'routine' },
  'thyroid': { category: 'general', keywords: ['goiter', 'endocrine'], urgency: 'routine' },
  'hernia': { category: 'general', keywords: ['inguinal', 'umbilical'], urgency: 'routine' },
  'fracture': { category: 'orthopedic', keywords: ['bone', 'break'], urgency: 'urgent' },
  'sports injury': { category: 'orthopedic', keywords: ['ACL', 'ligament'], urgency: 'routine' }
};

export const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Nagpur', 'Hyderabad', 'Chennai', 'Jaipur'];

export const CITY_TIERS = {
  Mumbai: 'metro', Delhi: 'metro', Bengaluru: 'metro',
  Pune: 'tier2', Hyderabad: 'tier2', Chennai: 'tier2',
  Nagpur: 'tier3', Jaipur: 'tier3'
};

export const CITY_PRICE_MULTIPLIERS = {
  metro: 1.25, tier2: 1.0, tier3: 0.85
};

export const LENDER_OPTIONS = [
  {
    name: 'Bajaj Finserv Health EMI',
    rate_display: '0% for 3 months, then 14% p.a.',
    effective_rate: 14,
    min_amount: 10000, max_amount: 2500000,
    min_tenure: 3, max_tenure: 36,
    features: ['No-cost EMI for select hospitals', 'Instant approval', 'Pre-approved offers'],
    eligibility: 'Min income ₹15,000/month'
  },
  {
    name: 'HDFC Credila Medical Loan',
    rate_display: '12.5–15% p.a.',
    effective_rate: 13.5,
    min_amount: 50000, max_amount: 5000000,
    min_tenure: 6, max_tenure: 60,
    features: ['No collateral up to ₹10L', 'Flexible tenure', 'Top-up facility'],
    eligibility: 'Min income ₹20,000/month, CIBIL 650+'
  },
  {
    name: 'CareEdge Finance',
    rate_display: '13% p.a.',
    effective_rate: 13,
    min_amount: 25000, max_amount: 1500000,
    min_tenure: 6, max_tenure: 48,
    features: ['Quick disbursal in 4 hours', 'Minimal documentation', 'Digital process'],
    eligibility: 'Min income ₹12,000/month'
  },
  {
    name: 'Arogya Nidhi (Govt Scheme)',
    rate_display: '8% p.a. (subsidized)',
    effective_rate: 8,
    min_amount: 10000, max_amount: 1000000,
    min_tenure: 12, max_tenure: 60,
    features: ['Government subsidized rate', 'For BPL & EWS category', 'Moratorium period available'],
    eligibility: 'BPL card holders, annual income < ₹3L'
  }
];

export const SEASONAL_INSIGHTS = {
  cardiac: 'Higher demand in winter months (Nov–Feb) for cardiac procedures. Hospital beds fill faster.',
  orthopedic: 'Post-monsoon (Oct–Dec) sees increased orthopedic cases. Plan ahead for better scheduling.',
  oncology: 'Oncology procedures are year-round. Some hospitals have 2–3 week wait for chemo slots.',
  general: 'Summer months see higher appendectomy & GI cases. Monsoon brings infectious disease surge.',
  ophthalmology: 'Eye surgeries peak in winter. Book LASIK slots 2–3 weeks in advance.',
  gynecology: 'Maternity wards peak in spring. Book early for preferred hospitals.',
  neurology: 'Neurology diagnostics generally available year-round with shorter wait times.',
  transplant: 'Transplant wait times are donor-dependent. Register early on transplant lists.'
};

export const formatCurrency = (amount) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
};

export const formatCurrencyFull = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};
