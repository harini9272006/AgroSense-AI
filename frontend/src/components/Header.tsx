import React from 'react';
import { Languages, MapPin, Activity, ShieldCheck, ChevronDown } from 'lucide-react';
import { SystemStatusData } from '../types';

interface HeaderProps {
  lang: 'en' | 'ta';
  setLang: (lang: 'en' | 'ta') => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  locations: Record<string, { name: string; lat: number; lon: number }>;
  systemStatus: SystemStatusData | null;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  selectedLocation,
  setSelectedLocation,
  locations,
  systemStatus
}) => {
  return (
    <header className="w-full bg-[#F4F9F4] border-b border-[#CFE1B9]/70 px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left: Salutation & Status (Directly inspired by reference screenshot) */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-bold text-[#202820] tracking-tight">
            {lang === 'ta' ? 'வணக்கம், விவசாயி!' : 'Hi, Farmer!'}
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#CFE1B9] text-[#4A5D23]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A5D23] animate-pulse" />
            {lang === 'ta' ? 'பண்ணை நிலை சீரானது' : 'Farm is stable'}
          </span>
        </div>
        <p className="text-xs md:text-sm text-[#718355] mt-0.5">
          {lang === 'ta'
            ? 'இன்றைய பண்ணை பகுப்பாய்வு, வானிலை மற்றும் மண் நிலவரம்.'
            : "Your farm performance is stable. Here's today's multimodal intelligence overview."}
        </p>
      </div>

      {/* Right Controls: Location, API Badge, Language & Profile Pill */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Farm Location Selector */}
        <div className="relative inline-flex items-center">
          <MapPin className="w-4 h-4 text-[#718355] absolute left-3 pointer-events-none" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="pl-8 pr-7 py-1.5 text-xs font-medium rounded-full bg-white border border-[#CFE1B9] text-[#202820] shadow-xs hover:border-[#97A97C] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#718355]"
          >
            {Object.entries(locations).map(([key, loc]) => (
              <option key={key} value={key}>
                {loc.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#718355] absolute right-2.5 pointer-events-none" />
        </div>

        {/* Live Model & API Connectivity Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#CFE1B9] text-[11px] font-medium text-[#4A5D23] shadow-xs">
          <Activity className="w-3.5 h-3.5 text-[#718355]" />
          <span>PyTorch AI:</span>
          <span className="font-bold text-[#4A5D23]">
            {systemStatus?.vision_model.status === 'OPERATIONAL' ? 'Active' : 'Standby'}
          </span>
          <span className="text-[#97A97C] mx-0.5">|</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>NASA & SoilGrids:</span>
          <span className="font-bold text-emerald-700">Live</span>
        </div>

        {/* Language Switcher Pill */}
        <button
          onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#CFE1B9] text-xs font-semibold text-[#4A5D23] hover:bg-[#CFE1B9]/30 transition-all cursor-pointer shadow-xs"
          title="Toggle English / தமிழ்"
        >
          <Languages className="w-3.5 h-3.5 text-[#718355]" />
          <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
        </button>
      </div>
    </header>
  );
};
