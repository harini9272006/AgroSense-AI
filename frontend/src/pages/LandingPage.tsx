import React from 'react';
import {
  Sprout,
  ScanLine,
  LayoutDashboard,
  CloudSun,
  Layers,
  Sliders,
  MessageSquareText,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Activity
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  lang: 'en' | 'ta';
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, lang }) => {
  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-[#4A5D23] text-white p-8 md:p-14 overflow-hidden shadow-xl border border-[#718355]">
        {/* Subtle decorative leaf pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, #CFE1B9 10%, transparent 20%),
            radial-gradient(circle at 80% 80%, #97A97C 15%, transparent 30%)`
          }}
        />

        <div className="relative z-10 max-w-3xl space-y-5">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {lang === 'ta'
              ? 'இலை படத்தை மட்டும் நம்பாதீர்: வானிலை & மண் சார்ந்த நுண்ணறிவு'
              : 'Beyond Leaf Images: Vision AI Meets Climate & Soil Intelligence'}
          </h1>

          <p className="text-sm md:text-base text-[#CFE1B9] leading-relaxed">
            {lang === 'ta'
              ? 'பாரம்பரிய அமைப்புகள் இலை படங்களை மட்டுமே ஆய்வு செய்து தவறான முடிவுகளை தருகின்றன. அக்ரோசென்ஸ் AI, கணினி பார்வை (PyTorch), நாசா வானிலை (NASA POWER) மற்றும் மண் தரவுகளை (SoilGrids) ஒன்றிணைத்து துல்லியமான பயிர் மருத்துவத்தை வழங்குகிறது.'
              : 'Traditional systems analyze leaf photos in isolation, ignoring local micro-climates and soil chemistry. AgroSense AI fuses computer vision with live satellite climatology and pedology for context-validated agronomic diagnosis.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigate('scanner')}
              className="px-6 py-3.5 rounded-2xl bg-[#CFE1B9] text-[#202820] font-extrabold text-xs md:text-sm hover:bg-white transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <ScanLine className="w-4 h-4 text-[#4A5D23]" />
              <span>{lang === 'ta' ? 'இலை ஸ்கேனர் திறக்க' : 'Launch AI Leaf Scanner'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs md:text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{lang === 'ta' ? 'பண்ணை பலகை பார்க்க' : 'Explore Farm Dashboard'}</span>
            </button>

            <button
              onClick={() => onNavigate('simulator')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs md:text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>{lang === 'ta' ? 'சிமுலேட்டர்' : 'What-If Simulator'}</span>
            </button>
          </div>
        </div>

        {/* HHH — centered in the free rectangle above the stats card (same column) */}
        <div className="hidden lg:flex absolute right-12 top-0 w-80 items-center justify-center pointer-events-none select-none" style={{ bottom: 'calc(50% + 20px)' }}>
          <span className="text-7xl md:text-8xl font-black tracking-tight text-white/20">HHH</span>
        </div>

        {/* Floating Quick Stats Card */}
        <div className="hidden lg:block absolute right-12 bottom-12 w-80 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-white text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/15">
            <span className="font-bold">Multimodal Fusion Status</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">PyTorch AgroSenseNet:</span>
            <span className="font-bold text-[#CFE1B9]">Trained (12 Classes)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">NASA POWER Satellite:</span>
            <span className="font-bold text-[#CFE1B9]">Live REST Sync</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">ISRIC SoilGrids:</span>
            <span className="font-bold text-[#CFE1B9]">250m Resolution</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Language Core:</span>
            <span className="font-bold text-[#CFE1B9]">English + தமிழ் + Tanglish</span>
          </div>
        </div>

      </section>

      {/* The 7-Step Multimodal Architecture Visual */}
      <section className="bg-white rounded-3xl p-8 border border-[#CFE1B9]/80 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#718355]">
            Algorithmic Pipeline
          </span>
          <h2 className="text-2xl font-extrabold text-[#202820] mt-1">
            How the Crop Context Intelligence Engine Works
          </h2>
          <p className="text-xs text-[#718355] mt-1">
            Going beyond basic image classification by cross-verifying pathogen biology with environmental sensors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#F4F9F4] border border-[#CFE1B9]/70 space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#4A5D23] text-white flex items-center justify-center font-bold text-xs">
              1
            </span>
            <h3 className="text-sm font-bold text-[#202820]">Visual Leaf Feature Extraction</h3>
            <p className="text-xs text-[#718355]">
              PyTorch AgroSenseNet inspects lesions, chlorotic halos, pustules, and fungal rings on leaf cuticles.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4F9F4] border border-[#CFE1B9]/70 space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#718355] text-white flex items-center justify-center font-bold text-xs">
              2
            </span>
            <h3 className="text-sm font-bold text-[#202820]">NASA POWER & Weather Sync</h3>
            <p className="text-xs text-[#718355]">
              Fetches real-time ambient temperature, humidity, precipitation, and solar radiation for the farm's GPS.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4F9F4] border border-[#CFE1B9]/70 space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#97A97C] text-white flex items-center justify-center font-bold text-xs">
              3
            </span>
            <h3 className="text-sm font-bold text-[#202820]">SoilGrids Pedology Inspection</h3>
            <p className="text-xs text-[#718355]">
              Analyzes soil pH (H2O), organic carbon (SOC), and texture across 0-5cm and root zone horizons.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4F9F4] border border-[#CFE1B9]/70 space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#4A5D23] text-white flex items-center justify-center font-bold text-xs">
              4
            </span>
            <h3 className="text-sm font-bold text-[#202820]">Epidemiological Synthesis</h3>
            <p className="text-xs text-[#718355]">
              Cross-evaluates concordance. Flags mismatches (e.g. Late Blight suspected in dry 38°C heat) to prevent improper fungicide application.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Feature Pillars Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          onClick={() => onNavigate('scanner')}
          className="bg-white p-6 rounded-3xl border border-[#CFE1B9]/80 shadow-xs hover:border-[#4A5D23] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#F4F9F4] flex items-center justify-center text-[#4A5D23] group-hover:scale-110 transition-transform mb-4">
            <ScanLine className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#202820]">Smart Leaf Scanner</h3>
          <p className="text-xs text-[#718355] mt-1.5 leading-relaxed">
            Drag-and-drop diagnostic scan with symptom checklists, verified sample leaves, and dual-confidence scores.
          </p>
        </div>

        <div
          onClick={() => onNavigate('climate')}
          className="bg-white p-6 rounded-3xl border border-[#CFE1B9]/80 shadow-xs hover:border-[#4A5D23] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#F4F9F4] flex items-center justify-center text-[#4A5D23] group-hover:scale-110 transition-transform mb-4">
            <CloudSun className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#202820]">Micro-Climate Risk</h3>
          <p className="text-xs text-[#718355] mt-1.5 leading-relaxed">
            Live Open-Meteo & NASA POWER climate forecasting with pathogen incubation gauges.
          </p>
        </div>

        <div
          onClick={() => onNavigate('soil')}
          className="bg-white p-6 rounded-3xl border border-[#CFE1B9]/80 shadow-xs hover:border-[#4A5D23] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#F4F9F4] flex items-center justify-center text-[#4A5D23] group-hover:scale-110 transition-transform mb-4">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#202820]">Soil Intelligence</h3>
          <p className="text-xs text-[#718355] mt-1.5 leading-relaxed">
            ISRIC SoilGrids 250m resolution pedology, pH balance, and soil organic carbon rating.
          </p>
        </div>

        <div
          onClick={() => onNavigate('assistant')}
          className="bg-white p-6 rounded-3xl border border-[#CFE1B9]/80 shadow-xs hover:border-[#4A5D23] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#F4F9F4] flex items-center justify-center text-[#4A5D23] group-hover:scale-110 transition-transform mb-4">
            <MessageSquareText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#202820]">Tamil AI Assistant</h3>
          <p className="text-xs text-[#718355] mt-1.5 leading-relaxed">
            Conversational agronomist answering in English, Tamil, and Tanglish with organic recipes & KVK advisory.
          </p>
        </div>
      </section>
    </div>
  );
};
