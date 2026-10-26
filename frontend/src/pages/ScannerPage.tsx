import React, { useState, useEffect } from 'react';
import {
  Upload,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  RefreshCw,
  Sparkles,
  Layers,
  Thermometer,
  Droplets,
  Calendar,
  MapPin,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { submitCropScan, getSampleLeaves } from '../api';
import { MultimodalReport } from '../types';

interface ScannerPageProps {
  lang: 'en' | 'ta';
  selectedLocation: string;
  locations: Record<string, { name: string; lat: number; lon: number }>;
  onReportGenerated: (report: MultimodalReport) => void;
}

export const ScannerPage: React.FC<ScannerPageProps> = ({
  lang,
  selectedLocation,
  locations,
  onReportGenerated
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [sampleLeaves, setSampleLeaves] = useState<Array<{ key: string; crop: string; disease: string; tamil_name: string; image_url: string }>>([]);
  const [selectedSampleKey, setSelectedSampleKey] = useState<string>('');

  const [cropType, setCropType] = useState('Tomato');
  const [growthStage, setGrowthStage] = useState('Flowering & Early Fruiting');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'Concentric dark brown rings',
    'Lower leaf yellowing'
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [report, setReport] = useState<MultimodalReport | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const symptomsOptions = [
    'Concentric dark brown rings',
    'Yellow halo around spots',
    'Lower leaf yellowing',
    'Water-soaked dark lesions',
    'White fungal fuzzy growth on underside',
    'Cinnamon-brown pustules on leaf',
    'Spindle-shaped elliptical lesions',
    'Leaf curl and margin drying'
  ];

  useEffect(() => {
    getSampleLeaves()
      .then((data) => {
        setSampleLeaves(data);
        if (data.length > 0 && !selectedFile) {
          setSelectedSampleKey(data[0].key);
          setPreviewUrl(data[0].image_url);
        }
      })
      .catch((err) => console.log('Sample leaves load note:', err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setSelectedSampleKey('');
      setPreviewUrl(URL.createObjectURL(file));
      setReport(null);
      setErrorMsg('');
    }
  };

  const handleSelectSample = (sample: { key: string; crop: string; image_url: string }) => {
    setSelectedSampleKey(sample.key);
    setSelectedFile(null);
    setPreviewUrl(sample.image_url);
    setCropType(sample.crop);
    setReport(null);
    setErrorMsg('');
  };

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleStartScan = async () => {
    if (!selectedFile && !selectedSampleKey) {
      setErrorMsg('Please select or upload a crop leaf image first.');
      return;
    }

    setIsScanning(true);
    setErrorMsg('');
    setScanStep(1);

    const stepTimer1 = setTimeout(() => setScanStep(2), 600);
    const stepTimer2 = setTimeout(() => setScanStep(3), 1200);

    try {
      const loc = locations[selectedLocation] || { name: 'Coimbatore, Tamil Nadu', lat: 11.0168, lon: 76.9558 };
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (selectedSampleKey) {
        formData.append('sample_key', selectedSampleKey);
      }
      formData.append('crop_selected', cropType);
      formData.append('growth_stage', growthStage);
      formData.append('symptoms', JSON.stringify(selectedSymptoms));
      formData.append('latitude', loc.lat.toString());
      formData.append('longitude', loc.lon.toString());
      formData.append('location_name', loc.name);

      const res = await submitCropScan(formData);
      setReport(res);
      onReportGenerated(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Scanning encountered an error.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsScanning(false);
      setScanStep(0);
    }
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-16">
      {/* Title & Multimodal Explanation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#202820] tracking-tight">
            {lang === 'ta' ? 'ஸ்மார்ட் இலை நோய் பரிசோதகர்' : 'Smart Multimodal Leaf Scanner'}
          </h2>
          <p className="text-sm text-[#718355] mt-1 max-w-3xl">
            {lang === 'ta'
              ? 'கணினி பார்வை மாதிரி (PyTorch) + நேரடி வானிலை (Open-Meteo / NASA POWER) + மண் தன்மை (SoilGrids) மூன்றையும் ஒருங்கிணைத்து துல்லியமான நோயறிதல்.'
              : 'Combines PyTorch Vision AI + Live Climate (NASA POWER / Open-Meteo) + ISRIC SoilGrids data for context-aware agricultural diagnosis.'}
          </p>
        </div>

        {report && (
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#CFE1B9] text-xs font-bold text-[#4A5D23] hover:bg-[#CFE1B9]/30 transition-all cursor-pointer shadow-xs"
          >
            <FileDown className="w-4 h-4" />
            <span>{lang === 'ta' ? 'அறிக்கை அச்சிடு / PDF' : 'Print / Export PDF'}</span>
          </button>
        )}
      </div>

      {/* Main Grid: Upload & Controls on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Picker & Agronomic Observations */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Image Dropzone & Preview Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#CFE1B9]/80 shadow-xs">
            <h3 className="text-sm font-bold text-[#202820] mb-3">
              {lang === 'ta' ? '1. இலை படம் பதிவேற்றம்' : '1. Upload Leaf Image'}
            </h3>

            {/* Preview Box */}
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden border-2 border-dashed border-[#CFE1B9] bg-[#F4F9F4] flex flex-col items-center justify-center group">
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt="Leaf Scan Preview"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay change button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="px-4 py-2 bg-white text-[#4A5D23] font-semibold text-xs rounded-xl shadow cursor-pointer">
                      {lang === 'ta' ? 'படத்தை மாற்றுக' : 'Change Image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 text-center cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-[#CFE1B9]/50 flex items-center justify-center text-[#4A5D23] mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-[#202820]">
                    {lang === 'ta' ? 'படத்தை இங்கே இழுத்துப் போடுங்கள்' : 'Drag & drop leaf photo here'}
                  </span>
                  <span className="text-[11px] text-[#718355] mt-1">
                    Supports JPG, PNG, WEBP (Max 15MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>

            {/* Quick Sample Selector */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-[#718355] mb-2">
                {lang === 'ta' ? 'அல்லது விரைவு மாதிரி இலையை தேர்ந்தெடுக்கவும்:' : 'Or test instantly with verified sample leaves:'}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {sampleLeaves.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => handleSelectSample(s)}
                    className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-center ${
                      selectedSampleKey === s.key
                        ? 'border-[#4A5D23] bg-[#CFE1B9]/30 ring-1 ring-[#4A5D23]'
                        : 'border-[#CFE1B9]/60 hover:bg-[#F4F9F4]'
                    }`}
                  >
                    <img
                      src={s.image_url}
                      alt={s.disease}
                      className="w-12 h-12 rounded-lg object-cover mb-1"
                    />
                    <span className="text-[10px] font-bold text-[#202820] text-center line-clamp-1">
                      {s.crop}
                    </span>
                    <span className="text-[9px] text-[#718355] text-center line-clamp-1">
                      {s.disease.split('(')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Crop Metadata Form */}
          <div className="bg-white rounded-3xl p-5 border border-[#CFE1B9]/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#202820]">
              {lang === 'ta' ? '2. கள விவரங்கள் & அறிகுறிகள்' : '2. Field Context & Symptoms'}
            </h3>

            {/* Crop Type */}
            <div>
              <label className="text-xs font-semibold text-[#718355] block mb-1">
                {lang === 'ta' ? 'பயிர் வகை' : 'Crop Type'}
              </label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F4F9F4] border border-[#CFE1B9] text-xs font-medium text-[#202820] focus:ring-2 focus:ring-[#4A5D23] focus:outline-none"
              >
                <option value="Tomato">Tomato (தக்காளி)</option>
                <option value="Potato">Potato (உருளைக்கிழங்கு)</option>
                <option value="Corn">Corn / Maize (மக்காச்சோளம்)</option>
                <option value="Rice">Rice / Paddy (நெல்)</option>
                <option value="Bell Pepper">Bell Pepper (குடைமிளகாய்)</option>
                <option value="Apple">Apple (ஆப்பிள்)</option>
              </select>
            </div>

            {/* Growth Stage */}
            <div>
              <label className="text-xs font-semibold text-[#718355] block mb-1">
                {lang === 'ta' ? 'பயிர் வளர்ச்சி நிலை' : 'Growth Stage'}
              </label>
              <select
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F4F9F4] border border-[#CFE1B9] text-xs font-medium text-[#202820] focus:ring-2 focus:ring-[#4A5D23] focus:outline-none"
              >
                <option value="Seedling / Nursery">Seedling / Nursery Stage</option>
                <option value="Vegetative Canopy Growth">Vegetative Canopy Growth</option>
                <option value="Flowering & Early Fruiting">Flowering & Early Fruiting</option>
                <option value="Tuber / Grain Filling">Tuber / Grain Filling</option>
                <option value="Maturity & Pre-Harvest">Maturity & Pre-Harvest</option>
              </select>
            </div>

            {/* Symptoms Checklist */}
            <div>
              <label className="text-xs font-semibold text-[#718355] block mb-2">
                {lang === 'ta' ? 'கவனித்த அறிகுறிகள் (Symptom Checklist)' : 'Observed Symptoms'}
              </label>
              <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                {symptomsOptions.map((sym) => {
                  const isChecked = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`px-3 py-2 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer border ${
                        isChecked
                          ? 'bg-[#CFE1B9]/40 border-[#718355] text-[#202820]'
                          : 'bg-[#F4F9F4] border-transparent text-[#718355] hover:border-[#CFE1B9]'
                      }`}
                    >
                      <span>{sym}</span>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        isChecked ? 'bg-[#4A5D23] text-white' : 'border border-[#97A97C]'
                      }`}>
                        {isChecked && '✓'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scan Action Button */}
            <button
              onClick={handleStartScan}
              disabled={isScanning}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isScanning ? 'bg-[#718355]/80 cursor-wait' : 'bg-[#4A5D23] hover:bg-[#364419]'
              }`}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>
                    {scanStep === 1 && 'Extracting PyTorch Leaf Features...'}
                    {scanStep === 2 && 'Querying NASA & Open-Meteo Climate...'}
                    {scanStep === 3 && 'Evaluating Soil & Context Logic...'}
                  </span>
                </>
              ) : (
                <>
                  <ScanLine className="w-5 h-5" />
                  <span>{lang === 'ta' ? 'முழுமையான நோய் ஆய்வு தொடங்குக' : 'Run Multimodal AI Diagnosis'}</span>
                </>
              )}
            </button>

            {errorMsg && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl">
                {errorMsg}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Multimodal Diagnosis Report */}
        <div className="lg:col-span-7 space-y-5">
          {!report ? (
            /* Empty State / Prompt to Scan */
            <div className="bg-white rounded-3xl p-8 border border-[#CFE1B9]/80 shadow-xs flex flex-col items-center justify-center text-center min-h-[500px]">
              <div className="w-20 h-20 rounded-3xl bg-[#F4F9F4] flex items-center justify-center text-[#718355] mb-4">
                <ScanLine className="w-10 h-10 text-[#4A5D23] animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-[#202820]">
                {lang === 'ta' ? 'நோய் ஆய்வு அறிக்கை தயாராக உள்ளது' : 'Ready for Multimodal Diagnosis'}
              </h3>
              <p className="text-xs text-[#718355] max-w-md mt-1.5 leading-relaxed">
                Select an image on the left and click "Run Multimodal AI Diagnosis". The engine will evaluate the leaf visual signature, compare it against live climate data ({locations[selectedLocation]?.name}), and formulate a context-verified report.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <span className="text-[11px] font-semibold bg-[#F4F9F4] px-3 py-1.5 rounded-full border border-[#CFE1B9] text-[#4A5D23]">
                  ✓ PyTorch AgroSenseNet Model
                </span>
                <span className="text-[11px] font-semibold bg-[#F4F9F4] px-3 py-1.5 rounded-full border border-[#CFE1B9] text-[#4A5D23]">
                  ✓ NASA POWER API Integration
                </span>
                <span className="text-[11px] font-semibold bg-[#F4F9F4] px-3 py-1.5 rounded-full border border-[#CFE1B9] text-[#4A5D23]">
                  ✓ ISRIC SoilGrids 250m
                </span>
              </div>
            </div>
          ) : (
            /* Active Full Multimodal Report */
            <div className="space-y-5 print:space-y-4">
              {/* Primary Suspected Disease Header Card */}
              <div className="bg-white rounded-3xl p-6 border border-[#CFE1B9]/80 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#CFE1B9]/50">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#718355]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{report.location.name}</span>
                    <span className="text-gray-300">•</span>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{report.timestamp}</span>
                  </div>
                  <span className="text-xs font-bold text-[#4A5D23] bg-[#CFE1B9]/50 px-3 py-1 rounded-full">
                    ID: {report.scan_id}
                  </span>
                </div>

                <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#718355]">
                      {report.contextual_diagnosis.primary_diagnosis.pathogen_type} Pathogen
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#202820] mt-0.5">
                      {report.contextual_diagnosis.primary_diagnosis.disease_name}
                    </h3>
                    <p className="text-sm font-semibold text-[#4A5D23] mt-0.5">
                      {report.contextual_diagnosis.primary_diagnosis.tamil_name}
                    </p>
                  </div>

                  {/* Confidence Pill comparison */}
                  <div className="flex items-center gap-3">
                    <div className="bg-[#F4F9F4] p-3 rounded-2xl border border-[#CFE1B9] text-center">
                      <p className="text-[10px] text-[#718355] font-semibold">Raw Vision AI</p>
                      <p className="text-lg font-bold text-[#202820]">
                        {report.computer_vision.top_prediction.confidence}%
                      </p>
                    </div>

                    <div className="bg-[#4A5D23] p-3 rounded-2xl text-white text-center shadow-xs">
                      <p className="text-[10px] text-[#CFE1B9] font-semibold">Context-Adjusted</p>
                      <p className="text-xl font-extrabold text-white">
                        {report.contextual_diagnosis.primary_diagnosis.context_adjusted_confidence}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Concordance Status Banner */}
                <div className="mt-4 pt-3 border-t border-[#CFE1B9]/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      report.contextual_diagnosis.primary_diagnosis.agreement_badge === 'CONFIRMED_BY_CLIMATE'
                        ? 'bg-emerald-500'
                        : report.contextual_diagnosis.primary_diagnosis.agreement_badge === 'ANOMALY_FLAGGED'
                        ? 'bg-amber-500'
                        : 'bg-[#718355]'
                    }`} />
                    <span className="text-xs font-bold text-[#202820]">
                      {report.contextual_diagnosis.primary_diagnosis.agreement_label}
                    </span>
                  </div>

                  <span className="text-xs text-[#718355]">
                    Severity: <strong>{report.contextual_diagnosis.primary_diagnosis.severity_level}</strong>
                  </span>
                </div>
              </div>

              {/* Multimodal Evidence Breakdown (Climate & Soil Corroboration) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Climate Evidence Card */}
                <div className="bg-white rounded-3xl p-5 border border-[#CFE1B9]/80 shadow-xs">
                  <div className="flex items-center gap-2 text-[#4A5D23] mb-3">
                    <Thermometer className="w-4 h-4 text-[#4A5D23]" />
                    <h4 className="text-xs font-bold text-[#202820]">
                      {lang === 'ta' ? 'பருவநிலை ஆதரவு சான்று' : 'Micro-Climate Corroboration'}
                    </h4>
                  </div>
                  <ul className="space-y-2 text-xs text-[#202820]/90">
                    {report.contextual_diagnosis.multimodal_evidence.climate_evidence.map((ev, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-0.5">•</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-2 border-t border-[#CFE1B9]/40 flex items-center justify-between text-[11px] text-[#718355]">
                    <span>Source: {report.environmental_context.weather.source}</span>
                    <span className="font-semibold text-emerald-700">Verified</span>
                  </div>
                </div>

                {/* Soil Evidence Card */}
                <div className="bg-white rounded-3xl p-5 border border-[#CFE1B9]/80 shadow-xs">
                  <div className="flex items-center gap-2 text-[#4A5D23] mb-3">
                    <Layers className="w-4 h-4 text-[#4A5D23]" />
                    <h4 className="text-xs font-bold text-[#202820]">
                      {lang === 'ta' ? 'மண் பண்புகள் & தாக்கம்' : 'Soil Pedological Corroboration'}
                    </h4>
                  </div>
                  <ul className="space-y-2 text-xs text-[#202820]/90">
                    {report.contextual_diagnosis.multimodal_evidence.soil_evidence.map((ev, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#4A5D23] font-bold mt-0.5">•</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-2 border-t border-[#CFE1B9]/40 flex items-center justify-between text-[11px] text-[#718355]">
                    <span>Topsoil pH: {report.environmental_context.soil.topsoil_0_5cm.ph}</span>
                    <span className="font-semibold text-[#4A5D23]">
                      {report.environmental_context.soil.topsoil_0_5cm.texture_class}
                    </span>
                  </div>
                </div>
              </div>

              {/* Environmental Warnings if Mismatch */}
              {report.contextual_diagnosis.environmental_warnings.length > 0 && (
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Contextual Anomaly Warning:</p>
                    {report.contextual_diagnosis.environmental_warnings.map((w, idx) => (
                      <p key={idx} className="mt-0.5">{w}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Prioritized Action Plan Checklist */}
              <div className="bg-white rounded-3xl p-6 border border-[#CFE1B9]/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-base font-bold text-[#202820]">
                      {lang === 'ta' ? 'பரிந்துரைக்கப்பட்ட விவசாய நடவடிக்கைகள்' : 'Prioritized Action Plan'}
                    </h4>
                    <p className="text-xs text-[#718355]">
                      {lang === 'ta' ? 'இயற்கை மற்றும் அங்கீகரிக்கப்பட்ட தடுப்பு முறைகள்' : 'Context-tailored cultural, bio-control, and remedial steps'}
                    </p>
                  </div>
                  <span className="text-xs font-semibold bg-[#F4F9F4] text-[#4A5D23] border border-[#CFE1B9] px-3 py-1 rounded-full">
                    {report.contextual_diagnosis.action_plan.length} Steps
                  </span>
                </div>

                <div className="space-y-3">
                  {report.contextual_diagnosis.action_plan.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#F4F9F4] border border-[#CFE1B9]/70 hover:border-[#718355] transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#4A5D23] uppercase tracking-wide">
                          {item.priority} • {item.category}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-[#202820] mt-1">
                        {lang === 'ta' ? item.title_ta : item.title_en}
                      </h5>
                      <p className="text-xs text-[#202820]/80 mt-1 leading-relaxed">
                        {lang === 'ta' ? item.description_ta : item.description_en}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternative Possibilities */}
              {report.contextual_diagnosis.alternative_diagnoses.length > 0 && (
                <div className="bg-white rounded-3xl p-5 border border-[#CFE1B9]/80 shadow-xs">
                  <h4 className="text-xs font-bold text-[#718355] uppercase tracking-wider mb-2">
                    {lang === 'ta' ? 'மாற்று சாத்தியக்கூறுகள் (Alternative Differential)' : 'Alternative Differential Diagnoses'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {report.contextual_diagnosis.alternative_diagnoses.map((alt, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#F4F9F4] border border-[#CFE1B9]/60 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-[#202820]">{alt.disease}</span>
                        <span className="font-bold text-[#718355]">{alt.confidence}%</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2.5">
                    * Scientific Notice: Automated predictions are computational diagnostic estimates. Confirm severe infections with local Krishi Vigyan Kendra (KVK) pathologists.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
