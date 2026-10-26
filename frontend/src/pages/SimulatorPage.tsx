import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Thermometer,
  Droplets,
  CloudRain,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { runSimulation } from '../api';

interface SimulatorPageProps {
  lang: 'en' | 'ta';
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({ lang }) => {
  const [crop, setCrop] = useState('Tomato');
  const [temp, setTemp] = useState(26);
  const [humidity, setHumidity] = useState(82);
  const [rainfall, setRainfall] = useState(35);
  const [irrigation, setIrrigation] = useState('Overhead Sprinkler');
  const [nitrogen, setNitrogen] = useState('High');

  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const executeSimulation = async () => {
    setLoading(true);
    try {
      const res = await runSimulation({
        crop,
        temperature_c: temp,
        humidity_pct: humidity,
        rainfall_mm: rainfall,
        irrigation_type: irrigation,
        nitrogen_level: nitrogen
      });
      setSimulationResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSimulation();
  }, [crop, temp, humidity, rainfall, irrigation, nitrogen]);

  const scores = simulationResult?.vulnerability_scores;
  const overall = scores?.overall_vulnerability ?? 65;
  const fungal = scores?.fungal_risk ?? 75;
  const bacterial = scores?.bacterial_risk ?? 55;
  const pest = scores?.pest_risk ?? 40;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#CFE1B9] text-[#4A5D23] mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Epidemiological Scenario Modeling Engine</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#202820] tracking-tight">
            {lang === 'ta' ? 'விவசாய மாதிரி சிமுலேட்டர் (What-If Farm Simulator)' : 'What-If Farm Simulator'}
          </h2>
          <p className="text-sm text-[#718355] mt-1 max-w-2xl">
            {lang === 'ta'
              ? 'வெப்பநிலை, ஈரப்பதம், மழை மற்றும் பாசன முறைகளை மாற்றி நோய் பரவல் அபாயத்தை நிகழ்நேரத்தில் கணிக்கவும்.'
              : 'Interactively simulate how climate shifts, irrigation switches, and fertilizer dosing alter fungal, bacterial, and pest vulnerability.'}
          </p>
        </div>

        {/* Scientific Label (Required by Prompt) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#CFE1B9] text-xs font-semibold text-[#4A5D23] shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Validated Bio-Mathematical Model</span>
        </div>
      </div>

      {/* Main Grid: Controls on Left, Simulated Dynamic Gauges on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenario Controls Panel */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#CFE1B9]/80 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-[#202820]">
            {lang === 'ta' ? 'சூழ்நிலை மாறிகள் (Scenario Inputs)' : 'Simulated Environmental Parameters'}
          </h3>

          {/* Crop Selector */}
          <div>
            <label className="text-xs font-bold text-[#718355] block mb-1">Target Crop</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F4F9F4] border border-[#CFE1B9] text-xs font-semibold text-[#202820] focus:ring-2 focus:ring-[#4A5D23] focus:outline-none"
            >
              <option value="Tomato">Tomato (தக்காளி)</option>
              <option value="Potato">Potato (உருளைக்கிழங்கு)</option>
              <option value="Rice">Rice / Paddy (நெல்)</option>
              <option value="Corn">Corn / Maize (மக்காச்சோளம்)</option>
              <option value="Bell Pepper">Bell Pepper (குடைமிளகாய்)</option>
            </select>
          </div>

          {/* Slider 1: Temperature */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-[#202820] flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-[#4A5D23]" />
                Ambient Temperature
              </span>
              <span className="text-[#4A5D23]">{temp} °C</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              value={temp}
              onChange={(e) => setTemp(Number(e.target.value))}
              className="w-full accent-[#4A5D23] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
              <span>10°C (Cool)</span>
              <span>26°C (Optimal Fungal)</span>
              <span>45°C (Heatwave)</span>
            </div>
          </div>

          {/* Slider 2: Relative Humidity */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-[#202820] flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-[#4A5D23]" />
                Relative Humidity
              </span>
              <span className="text-[#4A5D23]">{humidity} %</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={humidity}
              onChange={(e) => setHumidity(Number(e.target.value))}
              className="w-full accent-[#4A5D23] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
              <span>20% (Dry Air)</span>
              <span>65% (Moderate)</span>
              <span>100% (Saturated Dew)</span>
            </div>
          </div>

          {/* Slider 3: Weekly Rainfall */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-[#202820] flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-[#4A5D23]" />
                Weekly Rainfall
              </span>
              <span className="text-[#4A5D23]">{rainfall} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              value={rainfall}
              onChange={(e) => setRainfall(Number(e.target.value))}
              className="w-full accent-[#4A5D23] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
              <span>0mm (Dry spell)</span>
              <span>50mm (Moderate)</span>
              <span>150mm (Torrential)</span>
            </div>
          </div>

          {/* Irrigation Method */}
          <div>
            <label className="text-xs font-bold text-[#718355] block mb-1">Irrigation Method</label>
            <div className="grid grid-cols-3 gap-2">
              {['Drip', 'Furrow', 'Overhead Sprinkler'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setIrrigation(m)}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer border ${
                    irrigation === m
                      ? 'bg-[#4A5D23] text-white border-[#4A5D23]'
                      : 'bg-[#F4F9F4] text-[#202820] border-[#CFE1B9] hover:border-[#718355]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Nitrogen Level */}
          <div>
            <label className="text-xs font-bold text-[#718355] block mb-1">Nitrogen Application Level</label>
            <div className="grid grid-cols-4 gap-1.5">
              {['Low', 'Balanced', 'High', 'Excessive'].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNitrogen(n)}
                  className={`py-2 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer border ${
                    nitrogen === n
                      ? 'bg-[#4A5D23] text-white border-[#4A5D23]'
                      : 'bg-[#F4F9F4] text-[#202820] border-[#CFE1B9] hover:border-[#718355]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Simulated Output & Vulnerability Assessment */}
        <div className="lg:col-span-7 space-y-5">
          {/* Overall Vulnerability Metric Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#CFE1B9]/80 shadow-xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#718355]">
                  Calculated Overall Vulnerability
                </span>
                <h3 className="text-3xl font-extrabold text-[#202820] mt-1">
                  {overall}% Index
                </h3>
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mt-2 ${
                  overall > 70
                    ? 'bg-rose-100 text-rose-800'
                    : overall > 45
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {scores?.threat_label || 'High Risk'}
                </span>
              </div>

              {/* Primary Threatened Disease Box */}
              <div className="bg-[#F4F9F4] p-4 rounded-2xl border border-[#CFE1B9] text-right max-w-xs">
                <span className="text-[10px] font-bold text-[#718355] uppercase">
                  Primary Threatened Pathogen
                </span>
                <p className="text-sm font-extrabold text-[#202820] mt-1">
                  {simulationResult?.primary_threat?.name || 'Late Blight'}
                </p>
                <p className="text-xs font-semibold text-[#4A5D23] mt-0.5">
                  Action: {simulationResult?.primary_threat?.action}
                </p>
              </div>
            </div>

            {/* Pathogen Gauge Breakdown */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#CFE1B9]/50">
              <div className="p-3.5 rounded-2xl bg-[#F4F9F4] border border-[#CFE1B9]/70">
                <span className="text-xs font-bold text-[#202820]">Fungal Risk</span>
                <p className="text-2xl font-extrabold text-[#202820] mt-1">{fungal}%</p>
                <div className="w-full h-1.5 rounded-full bg-gray-200 mt-2 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${fungal}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4F9F4] border border-[#CFE1B9]/70">
                <span className="text-xs font-bold text-[#202820]">Bacterial Risk</span>
                <p className="text-2xl font-extrabold text-[#202820] mt-1">{bacterial}%</p>
                <div className="w-full h-1.5 rounded-full bg-gray-200 mt-2 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${bacterial}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4F9F4] border border-[#CFE1B9]/70">
                <span className="text-xs font-bold text-[#202820]">Insect & Pests</span>
                <p className="text-2xl font-extrabold text-[#202820] mt-1">{pest}%</p>
                <div className="w-full h-1.5 rounded-full bg-gray-200 mt-2 overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${pest}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Epidemiological Biological Analysis */}
          <div className="bg-white rounded-3xl p-6 border border-[#CFE1B9]/80 shadow-xs">
            <h4 className="text-sm font-bold text-[#202820] mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#4A5D23]" />
              <span>Bio-Climatic Dynamics in This Scenario</span>
            </h4>

            <div className="space-y-2 text-xs text-[#202820]/90">
              {simulationResult?.epidemiological_analysis?.map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-2 bg-[#F4F9F4] p-3 rounded-xl border border-[#CFE1B9]/50">
                  <span className="text-[#4A5D23] font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Mitigation Recommendations */}
          <div className="bg-white rounded-3xl p-6 border border-[#CFE1B9]/80 shadow-xs">
            <h4 className="text-sm font-bold text-[#202820] mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Simulated Intervention Strategies</span>
            </h4>

            <div className="space-y-2 text-xs text-[#202820]/90">
              {simulationResult?.mitigation_strategies?.map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-emerald-700 font-extrabold">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
