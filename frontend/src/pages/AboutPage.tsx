import React from 'react';
import {
  Info,
  Database,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  Award,
  ExternalLink
} from 'lucide-react';
import { SystemStatusData } from '../types';

interface AboutPageProps {
  lang: 'en' | 'ta';
  systemStatus: SystemStatusData | null;
}

export const AboutPage: React.FC<AboutPageProps> = ({ lang, systemStatus }) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#CFE1B9] text-[#4A5D23] mb-2">
          <Info className="w-3.5 h-3.5" />
          <span>Scientific Documentation & Data Transparency</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#202820] tracking-tight">
          {lang === 'ta' ? 'தொழில்நுட்பம் & தரவு மூலங்கள்' : 'System Architecture & Data Sources'}
        </h2>
        <p className="text-sm text-[#718355] mt-1 max-w-3xl">
          {lang === 'ta'
            ? 'அக்ரோசென்ஸ் AI தளத்தின் கட்டமைப்பு, பயன்படுத்தப்பட்ட PyTorch மாதிரி, நாசா மற்றும் SoilGrids தரவுகளின் வெளிப்படைத்தன்மை.'
            : 'Complete architectural specification, dataset citations, machine learning training methodologies, and scientific limitations.'}
        </p>
      </div>

      {/* Model & Architecture Specifications */}
      <div className="bg-white rounded-3xl p-6 border border-[#CFE1B9]/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#CFE1B9]/50">
          <Cpu className="w-5 h-5 text-[#4A5D23]" />
          <h3 className="text-base font-bold text-[#202820]">
            1. PyTorch Computer Vision Architecture (AgroSenseNet)
          </h3>
        </div>

        <p className="text-xs text-[#202820]/90 leading-relaxed">
          The core leaf diagnostic engine is powered by an authentic Convolutional Neural Network (<strong>AgroSenseNet</strong>) developed in PyTorch. Unlike static mockups, the model weights (<code className="bg-[#F4F9F4] px-1.5 py-0.5 rounded text-[#4A5D23]">crop_disease_model.pth</code>) are actively loaded into memory on the FastAPI server and perform genuine forward-pass tensor inference.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[#F4F9F4] border border-[#CFE1B9]/60">
            <span className="text-[#718355] text-[11px]">Framework</span>
            <p className="font-bold text-[#202820] mt-0.5">
              {systemStatus?.vision_model.framework || 'PyTorch 2.14.0'}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#F4F9F4] border border-[#CFE1B9]/60">
            <span className="text-[#718355] text-[11px]">Parameters</span>
            <p className="font-bold text-[#202820] mt-0.5">2,554,252 (2.55M)</p>
          </div>

          <div className="p-3 rounded-2xl bg-[#F4F9F4] border border-[#CFE1B9]/60">
            <span className="text-[#718355] text-[11px]">Target Classes</span>
            <p className="font-bold text-[#202820] mt-0.5">
              {systemStatus?.vision_model.classes_count || 12} Crop Conditions
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#F4F9F4] border border-[#CFE1B9]/60">
            <span className="text-[#718355] text-[11px]">Validation Accuracy</span>
            <p className="font-bold text-[#4A5D23] mt-0.5">
              {systemStatus?.vision_model.accuracy || '77.08%'}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F4F9F4] border border-[#CFE1B9]/60 text-xs">
          <p className="font-bold text-[#202820]">Network Topology:</p>
          <p className="text-[#718355] mt-1 font-mono text-[11px]">
            Input(3, 112, 112) → Conv2D(32, 3x3) + BatchNorm + MaxPool → Conv2D(64, 3x3) + BatchNorm + MaxPool → Conv2D(128, 3x3) + BatchNorm + MaxPool → Conv2D(256, 3x3) + BatchNorm + AdaptiveAvgPool(4,4) → Dense(512) + Dropout(0.4) → Dense(128) + Dropout(0.2) → Softmax(12)
          </p>
        </div>
      </div>

      {/* Dataset & External API Citations */}
      <div className="bg-white rounded-3xl p-6 border border-[#CFE1B9]/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#CFE1B9]/50">
          <Database className="w-5 h-5 text-[#4A5D23]" />
          <h3 className="text-base font-bold text-[#202820]">
            2. Datasets & External Scientific Integrations
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          {/* PlantVillage */}
          <div className="p-3.5 rounded-2xl bg-[#F4F9F4] border border-[#CFE1B9]/60">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-[#202820]">
                PlantVillage Leaf Disease Dataset (Penn State University & EPFL)
              </h4>
              <span className="text-[10px] font-semibold bg-[#CFE1B9] text-[#4A5D23] px-2 py-0.5 rounded-md">
                Dataset Citation
              </span>
            </div>
            <p className="text-[#718355] mt-1 leading-relaxed">
              Hughes, D., & Salathé, M. (2015). An open access repository of images on plant health to enable the development of mobile disease diagnostics. <em>arXiv:1511.08060</em>. Covers Solanaceae, Poaceae, and Fabaceae foliar pathogens.
            </p>
          </div>

          {/* NASA POWER */}
          <div className="p-3.5 rounded-2xl bg-[#F4F9F4] border border-[#CFE1B9]/60">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-[#202820]">
                NASA POWER Agroclimatology (Prediction of Worldwide Energy Resources)
              </h4>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                Live REST API
              </span>
            </div>
            <p className="text-[#718355] mt-1 leading-relaxed">
              NASA Langley Research Center. Daily meteorological parameters: Solar Radiation (ALLSKY_SFC_SW_DWN), 2m Relative Humidity (RH2M), Dew Point (T2MDEW), and Corrected Precipitation (PRECTOTCORR) derived from GEOS assimilation models.
            </p>
          </div>

          {/* ISRIC SoilGrids */}
          <div className="p-3.5 rounded-2xl bg-[#F4F9F4] border border-[#CFE1B9]/60">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-[#202820]">
                ISRIC — World Soil Information (SoilGrids 250m v2.0)
              </h4>
              <span className="text-[10px] font-semibold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md">
                Global REST API
              </span>
            </div>
            <p className="text-[#718355] mt-1 leading-relaxed">
              Poggio, L., et al. (2021). SoilGrids 2.0: producing soil information for the globe with quantified spatial uncertainty. <em>SOIL</em>, 7(1), 217-240. Supplies geo-referenced soil pH (H2O), Soil Organic Carbon (SOC), and USDA sand/silt/clay fractions across 6 depth intervals.
            </p>
          </div>
        </div>
      </div>

      {/* Limitations and Scientific Ethics */}
      <div className="bg-white rounded-3xl p-6 border border-[#CFE1B9]/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#CFE1B9]/50">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-[#202820]">
            3. Scientific Responsibility, Limitations & Ethics
          </h3>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Honesty & Ethical AI Disclosure</span>
          </div>
          <p className="leading-relaxed">
            • <strong>Diagnostic Estimates vs Laboratory Confirmation:</strong> Deep learning predictions are probabilistic visual estimates, not culture plates or Polymerase Chain Reaction (PCR) tests.
          </p>
          <p className="leading-relaxed">
            • <strong>Pesticide Safety:</strong> AgroSense AI strongly prioritizes organic bio-fungicides (Trichoderma harzianum, Pseudomonas fluorescens, Neem Oil, Panchagavya). Chemical fungicides must follow strict label withholding periods and be vetted by local Agricultural Extension Officers.
          </p>
          <p className="leading-relaxed">
            • <strong>Demonstration Mode:</strong> When external network APIs (NASA POWER or ISRIC) encounter rate limits or timeouts, AgroSense AI gracefully serves calibrated regional agrometeorological baselines rather than hallucinating fake data.
          </p>
        </div>
      </div>

      {/* College Project Submission Credits */}
      <div className="bg-[#4A5D23] rounded-3xl p-6 text-white text-xs flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#CFE1B9]">
            College Capstone Project & Portfolio
          </span>
          <h4 className="text-base font-extrabold text-white mt-0.5">
            AgroSense AI — Multimodal Agricultural Diagnostic Platform
          </h4>
          <p className="text-[#CFE1B9] mt-1">
            Engineered with PyTorch, FastAPI, React 19, TypeScript, Tailwind CSS, Open-Meteo, NASA POWER, and SoilGrids.
          </p>
        </div>

        <div className="text-right">
          <span className="inline-block px-3 py-1.5 rounded-full bg-white/20 text-[#CFE1B9] font-bold">
            Status: Fully Operational on Localhost
          </span>
        </div>
      </div>
    </div>
  );
};
