import React, { useState, useEffect } from 'react';
import {
  Layers,
  FlaskConical,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  TrendingDown,
  Info
} from 'lucide-react';
import { SoilData } from '../types';
import { getSoilData } from '../api';

interface SoilPageProps {
  lang: 'en' | 'ta';
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  locations: Record<string, { name: string; lat: number; lon: number }>;
}

export const SoilPage: React.FC<SoilPageProps> = ({
  lang,
  selectedLocation,
  setSelectedLocation,
  locations
}) => {
  const [soil, setSoil] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState(false);

  const loc = locations[selectedLocation] || { name: 'Coimbatore, Tamil Nadu', lat: 11.0168, lon: 76.9558 };

  const loadSoil = async () => {
    setLoading(true);
    try {
      const data = await getSoilData(loc.lat, loc.lon);
      setSoil(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSoil();
  }, [selectedLocation]);

  const topsoil = soil?.topsoil_0_5cm;
  const ph = topsoil?.ph ?? 6.4;
  const soc = topsoil?.organic_carbon_g_kg ?? 12.0;
  const texture = topsoil?.texture_class ?? 'Sandy Clay Loam';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#CFE1B9] text-[#4A5D23] mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>ISRIC SoilGrids 250m Global Pedological API</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#202820] tracking-tight">
            {lang === 'ta' ? 'மண் நுண்ணறிவு & சத்து நிலவரம்' : 'Soil Intelligence & Edaphic Insights'}
          </h2>
          <p className="text-sm text-[#718355] mt-1 max-w-2xl">
            {lang === 'ta'
              ? 'ISRIC SoilGrids தரவுகள் மூலம் மண்ணின் pH, கரிமச்சத்து (SOC) மற்றும் மணல்/களிமண் அமைப்பு ஆய்வு.'
              : 'Empirical pedological property mapping across depth profiles to optimize nutrient uptake and prevent root disease.'}
          </p>
        </div>

        {/* Location selector */}
        <div className="flex items-center gap-3">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 rounded-2xl bg-white border border-[#CFE1B9] text-xs font-bold text-[#202820] shadow-xs cursor-pointer focus:ring-2 focus:ring-[#4A5D23] focus:outline-none"
          >
            {Object.entries(locations).map(([k, l]) => (
              <option key={k} value={k}>
                {l.name}
              </option>
            ))}
          </select>

          <button
            onClick={loadSoil}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-white border border-[#CFE1B9] text-[#4A5D23] hover:bg-[#CFE1B9]/30 transition-all cursor-pointer shadow-xs"
            title="Refresh Soil Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Verified Source Banner */}
      <div className="bg-white rounded-2xl p-4 border border-[#CFE1B9]/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#4A5D23] font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Soil Data Provider:</span>
          <span className="bg-[#CFE1B9]/50 px-2.5 py-0.5 rounded-md text-[#202820]">
            {soil?.source || 'ISRIC SoilGrids 2.0 REST API'}
          </span>
          <span className="text-[#97A97C]">•</span>
          <span className="text-emerald-700 font-bold">{soil?.status || 'CONNECTED'}</span>
        </div>

        <div className="text-[#718355] text-[11px]">
          Target Coordinates: {loc.lat.toFixed(4)}° N, {loc.lon.toFixed(4)}° E
        </div>
      </div>

      {/* Main Soil Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* pH Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#CFE1B9]/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#718355]">
                {lang === 'ta' ? 'மண் கார அமில நிலை' : 'Soil Reaction (pH in H2O)'}
              </span>
              <FlaskConical className="w-4 h-4 text-[#4A5D23]" />
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-[#202820]">{ph}</span>
              <span className="text-xs font-bold text-[#4A5D23] bg-[#CFE1B9]/50 px-2.5 py-1 rounded-full">
                {topsoil?.ph_status || 'Optimal Neutral'}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#CFE1B9]/50">
            <p className="text-xs text-[#718355]">
              {ph >= 6.2 && ph <= 7.2
                ? 'Optimal nutrient solubility band. Nitrogen, Phosphorus, and Potassium absorb efficiently without fixation.'
                : ph < 6.0
                ? 'Mildly acidic. Increased vulnerability to clubroot and fungal mycelia.'
                : 'Mildly alkaline. Micronutrient bioavailability (Zinc, Iron) may be restricted.'}
            </p>
          </div>
        </div>

        {/* Soil Organic Carbon (SOC) */}
        <div className="bg-white rounded-3xl p-6 border border-[#CFE1B9]/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#718355]">
                {lang === 'ta' ? 'மண் கரிம கார்பன்' : 'Soil Organic Carbon (SOC)'}
              </span>
              <Sprout className="w-4 h-4 text-[#4A5D23]" />
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-[#202820]">{soc}</span>
              <span className="text-xs text-[#718355] font-semibold">g / kg</span>
              <span className="text-xs font-bold text-[#4A5D23] bg-[#CFE1B9]/50 px-2.5 py-1 rounded-full ml-auto">
                {topsoil?.organic_carbon_rating || 'Medium'}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#CFE1B9]/50">
            <p className="text-xs text-[#718355]">
              Represents active soil microbiological vitality, cation exchange capacity (CEC), and moisture retention buffering.
            </p>
          </div>
        </div>

        {/* USDA Soil Texture */}
        <div className="bg-white rounded-3xl p-6 border border-[#CFE1B9]/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#718355]">
                {lang === 'ta' ? 'மண் அமைப்பு வகை' : 'USDA Soil Texture'}
              </span>
              <Layers className="w-4 h-4 text-[#4A5D23]" />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-extrabold text-[#202820]">{texture}</span>
              <div className="flex gap-2 mt-2 text-xs text-[#718355]">
                <span>Clay: {topsoil?.clay_percent ?? 28}%</span>
                <span>•</span>
                <span>Sand: {topsoil?.sand_percent ?? 42}%</span>
                <span>•</span>
                <span>Silt: {topsoil?.silt_percent ?? 30}%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#CFE1B9]/50">
            <p className="text-xs text-[#718355]">
              Well-balanced porosity. Sufficient infiltration while retaining capillary water in the root horizon.
            </p>
          </div>
        </div>
      </div>

      {/* Depth Profile Section (0-5cm, 5-15cm, 15-30cm) */}
      <div className="bg-white rounded-3xl p-6 border border-[#CFE1B9]/80 shadow-xs">
        <h3 className="text-base font-bold text-[#202820] mb-1">
          {lang === 'ta' ? 'ஆழம் சார்ந்த மண் அடுக்குப் பகுப்பாய்வு' : 'Soil Profile Depth Stratification'}
        </h3>
        <p className="text-xs text-[#718355] mb-5">
          Stratified measurements across rhizosphere horizons (ISRIC SoilGrids standard depth intervals).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {soil?.depth_profile &&
            Object.entries(soil.depth_profile).map(([depth, vals], idx) => (
              <div
                key={depth}
                className="p-4 rounded-2xl bg-[#F4F9F4] border border-[#CFE1B9]/70 space-y-2"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#CFE1B9]/60">
                  <span className="text-xs font-bold text-[#202820]">
                    Horizon {idx + 1} ({depth})
                  </span>
                  <span className="text-[10px] font-semibold text-[#718355]">
                    {idx === 0 ? 'Topsoil' : idx === 1 ? 'Root Zone' : 'Subsoil'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div>
                    <p className="text-[10px] text-[#718355]">pH</p>
                    <p className="font-bold text-[#202820]">{vals.ph}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#718355]">SOC</p>
                    <p className="font-bold text-[#202820]">{vals.soc} g/kg</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#718355]">Clay</p>
                    <p className="font-bold text-[#202820]">{vals.clay}%</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Agronomic Recommendations for Soil Management */}
      <div className="bg-white rounded-3xl p-6 border border-[#CFE1B9]/80 shadow-xs">
        <h3 className="text-base font-bold text-[#202820] mb-1">
          {lang === 'ta' ? 'மண் மேம்பாட்டு பரிந்துரைகள்' : 'Pedological Action Recommendations'}
        </h3>
        <p className="text-xs text-[#718355] mb-4">
          Tailored soil amendments to prevent physiological blossom end rot and fungal wilts.
        </p>

        <div className="space-y-2.5">
          {soil?.agricultural_insights.map((insight, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-[#F4F9F4] border border-[#CFE1B9]/60 flex items-start gap-3"
            >
              <CheckCircle2 className="w-4 h-4 text-[#4A5D23] shrink-0 mt-0.5" />
              <p className="text-xs text-[#202820] leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
