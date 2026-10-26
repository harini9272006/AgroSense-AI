import React, { useState } from 'react';
import {
  CloudSun,
  Wind,
  Droplets,
  Sprout,
  Layers,
  Thermometer,
  Compass,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  MapPin
} from 'lucide-react';
import { WeatherPayload, SoilData } from '../types';
import { AgroAiLogo } from '../components/AgroAiLogo';

interface DashboardPageProps {
  weather: WeatherPayload | null;
  soil: SoilData | null;
  lang: 'en' | 'ta';
  selectedLocation: string;
  locations: Record<string, { name: string; lat: number; lon: number; crop_hub?: string }>;
  onNavigateToScan: () => void;
  onNavigateToAssistant: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  weather,
  soil,
  lang,
  selectedLocation,
  locations,
  onNavigateToScan,
  onNavigateToAssistant,
}) => {
  // Interactive control states matching the reference design
  const [autoWatering, setAutoWatering] = useState(true);
  const [phBalancerAuto, setPhBalancerAuto] = useState(true);
  const activeDistrict = locations[selectedLocation] || { name: 'Coimbatore', crop_hub: 'Cotton, Sugarcane, Tomato' };
  const [sensorLogOpen, setSensorLogOpen] = useState(true);
  // Satellite map interactive state
  const [zoomLevel, setZoomLevel] = useState(3); // 1-5
  const [mapLayer, setMapLayer] = useState<'NDVI' | 'RGB' | 'Thermal'>('NDVI');
  const layerCycle: Array<'NDVI' | 'RGB' | 'Thermal'> = ['NDVI', 'RGB', 'Thermal'];
  const layerColors: Record<string, string> = {
    NDVI:    'rgba(74,93,35,0.35)',
    RGB:     'rgba(60,100,60,0.30)',
    Thermal: 'rgba(160,80,20,0.30)',
  };
  const gridSize = Math.max(8, 28 - zoomLevel * 4); // zoom in = smaller grid squares
  const handleZoomIn  = () => setZoomLevel(z => Math.min(5, z + 1));
  const handleZoomOut = () => setZoomLevel(z => Math.max(1, z - 1));
  const handleLayerToggle = () => setMapLayer(l => {
    const idx = layerCycle.indexOf(l);
    return layerCycle[(idx + 1) % layerCycle.length];
  });
  const [customPrompt, setCustomPrompt] = useState('');
  const [assistantMessages, setAssistantMessages] = useState([
    {
      sender: 'user',
      text: 'Give me recommendation for Area 1 (Rice Field)'
    },
    {
      sender: 'bot',
      text: lang === 'ta'
        ? `பகுதி 1 (நெல் வயல்) க்கான பரிந்துரைகள்:\n• அடுத்த 48 மணிநேரத்திற்கு மண் ஈரப்பதத்தை கண்காணிக்கவும்\n• தற்போதைய சமச்சீர் உர அளவை பராமரிக்கவும்\n• இலைக் குலை நோய் (Blast) வராமல் கீழ் இலைகளை ஆய்வு செய்யவும்\n• தானியங்கி சொட்டு நீர் பாசனத்தை இயக்கத்தில் வைக்கவும்`
        : `Sure, here are my recommendations for your Area 1 (Rice Field):\n• Monitor soil moisture over next 48 hours\n• Maintain current balanced fertilization level\n• Prepare for mid-season blast inspection\n• Keep the auto watering active\n• Check back after 48 hours`
    }
  ]);

  const currWeather = weather?.current;
  const temp = currWeather?.temperature_c ?? 24;
  const humidity = currWeather?.relative_humidity_pct ?? 80;
  const wind = currWeather?.wind_speed_kmh ? Math.round(currWeather.wind_speed_kmh / 3.6) : 3;
  const phVal = soil?.topsoil_0_5cm.ph ?? 6.4;

  const handleSendPrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customPrompt.trim()) return;
    const userText = customPrompt;
    setCustomPrompt('');
    setAssistantMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText },
      {
        sender: 'bot',
        text: lang === 'ta'
          ? `உங்கள் கேள்விக்கு பதில்: தற்போதைய வானிலை (${temp}°C, ${humidity}% ஈரப்பதம்) அடிப்படையில் பயிர் வளர்ச்சி சீராக உள்ளது. வேப்பெண்ணெய் கரைசல் தெளிப்பது பூச்சிகளை தடுக்கும்.`
          : `Based on your live microclimate (${temp}°C, ${humidity}% humidity), crop transpiration is optimal. Soil pH is stable at ${phVal}. Maintain regular canopy scouting.`
      }
    ]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Grid: Weather Card, Plant Health, Active Zones, and Field Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (Weather + Metrics) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* 1. Weather Card (Exact match to reference) */}
          <div className="bg-white rounded-3xl p-5 border border-[#CFE1B9]/80 shadow-xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#CFE1B9]/60 text-[#4A5D23] text-xs font-bold mb-1">
                  <MapPin className="w-3 h-3" />
                  <span>{activeDistrict.name}</span>
                </div>
                <span className="text-sm font-semibold text-[#202820] block">
                  {currWeather?.condition || 'Partly Cloudy'}
                </span>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-16 h-16 rounded-2xl bg-[#F4F9F4] flex items-center justify-center text-[#718355]">
                    <CloudSun className="w-10 h-10 text-[#4A5D23]" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-extrabold text-[#202820] tracking-tight">16</span>
                  <span className="text-sm font-medium text-[#718355] ml-2">March 2026</span>
                </div>
              </div>

              {/* Weather Stats Pills */}
              <div className="flex flex-col gap-2 w-44">
                <div className="flex items-center justify-between bg-[#F4F9F4] px-3 py-2 rounded-2xl border border-[#CFE1B9]/60">
                  <div className="flex items-center gap-2 text-xs text-[#718355] font-medium">
                    <Thermometer className="w-4 h-4 text-[#4A5D23]" />
                    <span>{lang === 'ta' ? 'வெப்பநிலை' : 'Temperature'}</span>
                  </div>
                  <span className="text-sm font-bold text-[#202820]">{temp} °c</span>
                </div>

                <div className="flex items-center justify-between bg-[#F4F9F4] px-3 py-2 rounded-2xl border border-[#CFE1B9]/60">
                  <div className="flex items-center gap-2 text-xs text-[#718355] font-medium">
                    <Wind className="w-4 h-4 text-[#4A5D23]" />
                    <span>{lang === 'ta' ? 'காற்று' : 'Wind'}</span>
                  </div>
                  <span className="text-sm font-bold text-[#202820]">{wind} m/s</span>
                </div>

                <div className="flex items-center justify-between bg-[#F4F9F4] px-3 py-2 rounded-2xl border border-[#CFE1B9]/60">
                  <div className="flex items-center gap-2 text-xs text-[#718355] font-medium">
                    <Droplets className="w-4 h-4 text-[#4A5D23]" />
                    <span>{lang === 'ta' ? 'ஈரப்பதம்' : 'Humidity'}</span>
                  </div>
                  <span className="text-sm font-bold text-[#202820]">{humidity} %</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Plant Health & Active Zones Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Plant Health */}
            <div className="bg-white rounded-3xl p-5 border border-[#CFE1B9]/80 shadow-xs">
              <div className="flex items-center gap-2 text-[#4A5D23]">
                <div className="w-8 h-8 rounded-full bg-[#CFE1B9]/50 flex items-center justify-center">
                  <Sprout className="w-4 h-4 text-[#4A5D23]" />
                </div>
                <span className="text-xs font-semibold text-[#718355]">
                  {lang === 'ta' ? 'பயிர் நலம்' : 'Plant Health'}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#202820]">95%</span>
                <span className="text-xs font-semibold text-[#4A5D23]">
                  {lang === 'ta' ? 'சிறந்தது' : 'Excellent'}
                </span>
              </div>
            </div>

            {/* Active Crop Zones */}
            <div className="bg-white rounded-3xl p-5 border border-[#CFE1B9]/80 shadow-xs">
              <div className="flex items-center gap-2 text-[#4A5D23]">
                <div className="w-8 h-8 rounded-full bg-[#CFE1B9]/50 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-[#4A5D23]" />
                </div>
                <span className="text-xs font-semibold text-[#718355]">
                  {lang === 'ta' ? 'செயலில் உள்ள மண்டலங்கள்' : 'Active Crop Zones'}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#202820]">9</span>
                <span className="text-xs font-semibold text-[#202820]">Zones</span>
                <span className="text-[11px] font-semibold text-[#4A5D23] ml-auto">
                  +2 {lang === 'ta' ? 'நேற்று முதல்' : 'from yesterday'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Interactive Satellite Farm Map */}
        <div className="lg:col-span-7 bg-[#202820] rounded-3xl p-5 relative overflow-hidden min-h-[300px] flex flex-col justify-between border border-[#4A5D23]/30 shadow-md">

          {/* Dynamic animated map background — responds to zoom & layer */}
          <div
            className="absolute inset-0 transition-all duration-500"
            style={{
              backgroundImage: [
                `radial-gradient(circle at 55% 45%, ${layerColors[mapLayer]}, rgba(20,32,20,0.97))`,
                `repeating-linear-gradient(45deg,
                  rgba(74,93,35,0.18) 0px, rgba(74,93,35,0.18) ${gridSize}px,
                  rgba(20,32,20,0.22) ${gridSize}px, rgba(20,32,20,0.22) ${gridSize * 2}px)`,
                `repeating-linear-gradient(-45deg,
                  rgba(74,93,35,0.10) 0px, rgba(74,93,35,0.10) ${gridSize}px,
                  transparent ${gridSize}px, transparent ${gridSize * 2}px)`,
              ].join(', '),
            }}
          />

          {/* Animated field polygon SVG overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice">
            <polygon points="320,40 500,70 540,180 460,250 300,220 260,140" fill="none" stroke="#CFE1B9" strokeWidth="1.5" strokeDasharray="6 4" />
            <polygon points="320,40 500,70 540,180 460,250 300,220 260,140" fill="rgba(207,225,185,0.06)" />
            <circle cx="390" cy="140" r="5" fill="#CFE1B9" opacity="0.7" />
            <line x1="390" y1="140" x2="320" y2="40"  stroke="#CFE1B9" strokeWidth="0.8" opacity="0.4" />
            <line x1="390" y1="140" x2="540" y2="180" stroke="#CFE1B9" strokeWidth="0.8" opacity="0.4" />
          </svg>

          {/* ── TOP BAR ── */}
          <div className="relative z-10 flex items-center justify-between">
            {/* Layer toggle pill — clickable, cycles NDVI → RGB → Thermal */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLayerToggle}
                title="Toggle map layer"
                className="w-8 h-8 rounded-full bg-[#202820]/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#4A5D23] active:scale-95 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={handleLayerToggle}
                className="text-xs font-semibold text-white/90 bg-[#202820]/70 px-3 py-1 rounded-full border border-white/10 hover:bg-[#4A5D23]/60 active:scale-95 transition-all cursor-pointer select-none"
              >
                {mapLayer === 'NDVI' ? '🌿 NDVI View' : mapLayer === 'RGB' ? '📷 RGB View' : '🌡️ Thermal View'}
              </button>
            </div>

            {/* Scan Leaf */}
            <button
              onClick={onNavigateToScan}
              className="px-3.5 py-1.5 rounded-full bg-[#718355] hover:bg-[#4A5D23] active:scale-95 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{lang === 'ta' ? 'இலை ஸ்கேன் செய்க' : 'Scan Leaf'}</span>
            </button>
          </div>

          {/* ── CENTER FARM INFO CARD ── */}
          <div className="relative z-10 my-3 max-w-sm bg-[#163D2B]/90 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold tracking-tight text-white">{activeDistrict.name} Farm Zone</h3>
              <span className="text-[11px] font-semibold bg-[#4A5D23] text-[#CFE1B9] px-2 py-0.5 rounded-md truncate max-w-[150px]">
                {activeDistrict.crop_hub || 'Active'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-3 text-xs">
              <div>
                <p className="text-white/60 text-[11px]">{lang === 'ta' ? 'விதைத்த தேதி' : 'Planting date'}</p>
                <p className="font-semibold text-white">24 Aug 25</p>
              </div>
              <div>
                <p className="text-white/60 text-[11px]">{lang === 'ta' ? 'அறுவடை தேதி' : 'Harvest Date'}</p>
                <p className="font-semibold text-white">12 Dec 25</p>
              </div>
            </div>

            {/* Crop Health Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-white/80">{lang === 'ta' ? 'பயிர் ஆரோக்கியம்' : 'Crop health'}</span>
                <span className="text-[#CFE1B9]">87 %</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full transition-all duration-700" style={{ width: '87%' }} />
              </div>
            </div>

            {/* Sensor Log Accordion */}
            <div className="bg-black/30 rounded-xl p-2.5 border border-white/10 text-xs">
              <button
                onClick={() => setSensorLogOpen(!sensorLogOpen)}
                className="w-full flex items-center justify-between text-white/80 font-medium cursor-pointer hover:text-white transition-colors"
              >
                <span>{lang === 'ta' ? 'சென்சார் அளவீடு' : 'Sensor log'}</span>
                <span className="text-xs transition-transform duration-200" style={{ display: 'inline-block', transform: sensorLogOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}>▴</span>
              </button>

              {sensorLogOpen && (
                <div className="mt-2 space-y-1 pt-1 border-t border-white/10 text-white/90 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-white/60">Temperature:</span>
                    <span className="font-semibold">{temp} °C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Humidity:</span>
                    <span className="font-semibold">{humidity} %</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Soil Moisture:</span>
                    <span className="font-semibold">68 % (Optimal)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── BOTTOM BAR: Zoom level + +/- buttons ── */}
          <div className="relative z-10 flex items-center justify-end gap-2">
            {/* Zoom level indicator */}
            <span className="text-[10px] font-bold text-white/40 mr-1">Z{zoomLevel}</span>
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-xl p-1 border border-white/10">
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 5}
                title="Zoom In"
                className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-[#4A5D23] active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                title="Zoom Out"
                className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-[#4A5D23] active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Soil Nutrient Status, Auto Watering, pH Balancer, Fertilizer Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Soil Nutrient Status */}
        <div className="bg-white rounded-3xl p-5 border border-[#CFE1B9]/80 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#202820]">
              {lang === 'ta' ? 'மண் ஊட்டச்சத்து நிலை' : 'Soil Nutrient Status'}
            </h4>
            <p className="text-xs text-[#718355] mt-0.5">
              {lang === 'ta' ? 'சமச்சீர் ஊட்டச்சத்து கலவை' : 'Balanced nutrient composition'}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            {/* Visual Wedge Gradient */}
            <div className="h-6 flex-1 mr-3 relative flex items-center">
              <div
                className="w-full h-3 rounded-full"
                style={{
                  background: 'linear-gradient(to right, #CFE1B9 0%, #718355 70%, #4A5D23 100%)'
                }}
              />
            </div>
            <span className="text-xs font-bold text-[#4A5D23] bg-[#CFE1B9]/40 px-2.5 py-1 rounded-full">
              {lang === 'ta' ? 'சிறப்பானது' : 'Optimal'}
            </span>
          </div>
        </div>

        {/* 2. Auto Watering */}
        <div className="bg-white rounded-3xl p-5 border border-[#CFE1B9]/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#202820]">
                {lang === 'ta' ? 'தானியங்கி பாசனம்' : 'Auto Watering'}
              </h4>
              <p className="text-xs text-[#718355]">
                {autoWatering
                  ? lang === 'ta' ? '3 மணி நேரத்திற்கு ஒருமுறை' : 'Watering every 3 hours'
                  : lang === 'ta' ? 'இடைநிறுத்தப்பட்டது' : 'Currently Paused'}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#718355]">
              {autoWatering ? (lang === 'ta' ? 'இயங்குகிறது' : 'On') : (lang === 'ta' ? 'நிறுத்தப்பட்டது' : 'Off')}
            </span>
            <button
              onClick={() => setAutoWatering(!autoWatering)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoWatering ? 'bg-sky-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  autoWatering ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 3. pH Balancer */}
        <div className="bg-white rounded-3xl p-5 border border-[#CFE1B9]/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#CFE1B9]/50 flex items-center justify-center text-[#4A5D23]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#202820]">
                  {lang === 'ta' ? 'pH சமநிலை' : 'pH Balancer'}
                </h4>
                <p className="text-xs text-[#718355]">
                  {lang === 'ta' ? 'நிலை: சீரானது' : 'Status: Stable'}
                </p>
              </div>
            </div>
            <span className="text-2xl font-extrabold text-[#202820]">{phVal}</span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#718355]">
              {lang === 'ta' ? 'தானியங்கி' : 'Auto'}
            </span>
            <button
              onClick={() => setPhBalancerAuto(!phBalancerAuto)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                phBalancerAuto ? 'bg-sky-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  phBalancerAuto ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 4. Fertilizer Application Level */}
        <div className="bg-white rounded-3xl p-5 border border-[#CFE1B9]/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-bold text-[#202820]">
                {lang === 'ta' ? 'உர பயன்பாட்டு அளவு' : 'Fertilizer Application Level'}
              </h4>
              <p className="text-xs text-[#718355]">
                {lang === 'ta' ? 'தற்போதைய செறிவு' : 'Current dosage intensity'}
              </p>
            </div>
            <span className="text-xs font-bold text-[#202820]">Moderate - High</span>
          </div>

          {/* Segmented bar chart matching reference */}
          <div className="mt-4 flex items-end gap-1 h-8">
            {Array.from({ length: 32 }).map((_, i) => {
              const isGreen = i > 22;
              const isAmber = i >= 12 && i <= 22;
              const isCurrent = i === 25;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-xs transition-all ${
                    isCurrent
                      ? 'bg-[#4A5D23] h-full ring-2 ring-[#4A5D23]/30'
                      : isGreen
                      ? 'bg-emerald-500 h-6'
                      : isAmber
                      ? 'bg-amber-400 h-5'
                      : 'bg-rose-400 h-4'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Growth Analytics Gauge & AI Assistant Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Growth Analytics Card (Matching circular arc gauge in reference) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#CFE1B9]/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#202820]">
              {lang === 'ta' ? 'பயிர் வளர்ச்சி பகுப்பாய்வு' : 'Growth Analytics'}
            </h3>
            <p className="text-xs text-[#718355] mt-0.5">
              {lang === 'ta' ? 'வலுவான ஊட்டச்சத்து சமநிலை' : 'Strong nutrient balance'}
            </p>
          </div>

          {/* SVG Circular Arc Gauge */}
          <div className="my-6 flex flex-col items-center justify-center relative">
            <svg viewBox="0 0 200 120" className="w-48 max-w-full">
              {/* Background Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#E2EFE2"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Progress Arc (87%) */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#4A5D23"
                strokeWidth="14"
                strokeDasharray="251"
                strokeDashoffset="35"
                strokeLinecap="round"
              />
              {/* Indicator Dot */}
              <circle cx="160" cy="55" r="7" fill="#CFE1B9" stroke="#4A5D23" strokeWidth="4" />
            </svg>

            {/* Value in Center */}
            <div className="text-center -mt-8">
              <span className="text-4xl font-extrabold text-[#202820] tracking-tight">87%</span>
              <p className="text-xs text-[#718355] font-semibold mt-0.5">
                {lang === 'ta' ? 'வளர்ச்சி நிலை' : 'Growth Level'}
              </p>
            </div>
          </div>

          {/* Bottom Stats: Max, Min, Avg */}
          <div className="flex justify-around items-center pt-4 border-t border-[#CFE1B9]/50 text-center">
            <div>
              <span className="text-lg font-bold text-[#202820]">92</span>
              <span className="text-xs text-[#718355] ml-1">Max</span>
            </div>
            <div className="h-6 w-[1px] bg-[#CFE1B9]" />
            <div>
              <span className="text-lg font-bold text-[#202820]">72</span>
              <span className="text-xs text-[#718355] ml-1">Min</span>
            </div>
            <div className="h-6 w-[1px] bg-[#CFE1B9]" />
            <div>
              <span className="text-lg font-bold text-[#202820]">64</span>
              <span className="text-xs text-[#718355] ml-1">Avg</span>
            </div>
          </div>
        </div>

        {/* AI Assistant Card (Matching the chat bubble layout in reference) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#CFE1B9]/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#CFE1B9]/40">
            <AgroAiLogo size="md" lang={lang} />
            <button
              onClick={onNavigateToAssistant}
              className="text-xs font-semibold text-[#4A5D23] hover:underline cursor-pointer"
            >
              {lang === 'ta' ? 'முழு உரையாடல் →' : 'Full Chat →'}
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="my-4 space-y-3 max-h-56 overflow-y-auto pr-1">
            {assistantMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs whitespace-pre-line leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#4A5D23] text-white rounded-tr-xs'
                      : 'bg-[#F4F9F4] text-[#202820] border border-[#CFE1B9]/70 rounded-tl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendPrompt} className="relative mt-2">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={lang === 'ta' ? 'எதையும் கேளுங்கள்...' : '+ Ask anything about Area 1 or diseases...'}
              className="w-full pl-4 pr-10 py-2.5 rounded-full bg-[#F4F9F4] border border-[#CFE1B9] text-xs text-[#202820] placeholder-[#718355] focus:outline-none focus:ring-2 focus:ring-[#4A5D23]"
            />
            <button
              type="submit"
              className="absolute right-2 top-1.5 w-7 h-7 rounded-full bg-[#4A5D23] text-white flex items-center justify-center hover:bg-[#364419] transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            AI Assistant can make mistakes. Verify critical pesticide dosages with local KVK.
          </p>
        </div>
      </div>
    </div>
  );
};
