import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileDown,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Layers
} from 'lucide-react';
import { ScanHistoryItem } from '../types';
import { getScanHistory } from '../api';

interface ReportsPageProps {
  lang: 'en' | 'ta';
  onNavigateToScan: () => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ lang, onNavigateToScan }) => {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [selectedScan, setSelectedScan] = useState<ScanHistoryItem | null>(null);

  // Temporal comparison state (Day 1 vs Day 7)
  const [compareMode, setCompareMode] = useState(false);

  useEffect(() => {
    getScanHistory()
      .then((data) => {
        setHistory(data);
        if (data.length > 0) setSelectedScan(data[0]);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#CFE1B9] text-[#4A5D23] mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Farm Records & Disease Progression Timeline</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#202820] tracking-tight">
            {lang === 'ta' ? 'நோய் ஆய்வு அறிக்கைகள் & வரலாறு' : 'Diagnosis Reports & Farm History'}
          </h2>
          <p className="text-sm text-[#718355] mt-1">
            {lang === 'ta'
              ? 'முந்தைய பரிசோதனைகளின் வரலாற்றுப் பதிவுகள் மற்றும் நோய் முன்னேற்ற ஒப்பீடு.'
              : 'Archive of past diagnostic scans, temporal recovery comparisons, and completed agronomic interventions.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
              compareMode
                ? 'bg-[#4A5D23] text-white border-[#4A5D23]'
                : 'bg-white text-[#4A5D23] border-[#CFE1B9] hover:bg-[#CFE1B9]/30'
            }`}
          >
            {compareMode
              ? lang === 'ta' ? '✓ கால ஒப்பீடு பயன்முறை' : '✓ Temporal Compare Mode'
              : lang === 'ta' ? 'கால ஒப்பீடு (Before/After)' : 'Temporal Compare (Before / After)'}
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-[#CFE1B9] text-xs font-bold text-[#4A5D23] hover:bg-[#CFE1B9]/30 transition-all cursor-pointer shadow-xs"
          >
            <FileDown className="w-4 h-4" />
            <span>{lang === 'ta' ? 'அறிக்கை பதிவிறக்கு' : 'Export Logs'}</span>
          </button>
        </div>
      </div>

      {/* Temporal Comparison Carousel / Split View if Active */}
      {compareMode && (
        <div className="bg-white rounded-3xl p-6 border-2 border-[#718355] shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-[#CFE1B9]/60">
            <div>
              <h3 className="text-base font-bold text-[#202820]">
                {lang === 'ta' ? 'நோய் மீட்பு கால ஒப்பீடு (Temporal Progression)' : 'Disease Recovery Timeline Comparison'}
              </h3>
              <p className="text-xs text-[#718355]">
                Side-by-side progression: Day 1 (Initial Infection) vs Day 7 (Post-Trichoderma & Drip Adjustment).
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Recovery: +65% Foliage Restored
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Scan 1: Day 1 */}
            <div className="p-4 rounded-2xl bg-[#F4F9F4] border border-rose-200">
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wide">
                Day 1 • Initial Detection
              </span>
              <div className="mt-2 aspect-4/3 rounded-xl overflow-hidden bg-black/10">
                <img
                  src="/api/sample-leaves/Tomato___Early_blight.jpg"
                  alt="Day 1 Scan"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-3 text-xs space-y-1">
                <p className="font-bold text-[#202820]">Tomato Early Blight (Alternaria solani)</p>
                <p className="text-[#718355]">Severity: High (Concentric lesions covering 28% leaf area)</p>
                <p className="text-[#4A5D23] font-semibold">Action: Immediate bottom pruning & Pseudomonas spray</p>
              </div>
            </div>

            {/* Scan 2: Day 7 */}
            <div className="p-4 rounded-2xl bg-[#F4F9F4] border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                Day 7 • Post Treatment Review
              </span>
              <div className="mt-2 aspect-4/3 rounded-xl overflow-hidden bg-black/10">
                <img
                  src="/api/sample-leaves/Tomato___healthy.jpg"
                  alt="Day 7 Scan"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-3 text-xs space-y-1">
                <p className="font-bold text-[#202820]">New Growth Healthy (No Pathogen Extension)</p>
                <p className="text-[#718355]">Severity: Resolved • Chlorotic halos halted</p>
                <p className="text-emerald-700 font-semibold">Status: Successful Bio-Control Containment</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: History Table on Left, Detailed Selected Report on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scans List Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#CFE1B9]/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#CFE1B9]/50">
            <h3 className="text-base font-bold text-[#202820]">
              {lang === 'ta' ? 'பதிவான பரிசோதனைகள்' : 'Historical Diagnostic Scans'}
            </h3>
            <span className="text-xs text-[#718355] font-semibold">{history.length} Records</span>
          </div>

          <div className="divide-y divide-[#CFE1B9]/40 mt-3">
            {history.map((item) => {
              const isSelected = selectedScan?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedScan(item)}
                  className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#CFE1B9]/40 ring-1 ring-[#4A5D23]'
                      : 'hover:bg-[#F4F9F4]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image_url}
                      alt={item.crop}
                      className="w-12 h-12 rounded-xl object-cover border border-[#CFE1B9]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#202820]">{item.crop}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'Healthy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Resolved'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#718355] mt-0.5">
                        {item.disease_detected}
                      </p>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {item.timestamp} • {item.field_zone}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#4A5D23]">
                      {item.confidence}%
                    </span>
                    <p className="text-[10px] text-[#718355]">Confidence</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Scan Inspection Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#CFE1B9]/80 shadow-xs flex flex-col justify-between">
          {selectedScan ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#CFE1B9]/50">
                <span className="text-xs font-bold text-[#4A5D23]">
                  SCAN #{selectedScan.id}
                </span>
                <span className="text-xs text-[#718355]">{selectedScan.timestamp}</span>
              </div>

              <div className="aspect-4/3 rounded-2xl overflow-hidden bg-black/10 border border-[#CFE1B9]">
                <img
                  src={selectedScan.image_url}
                  alt={selectedScan.disease_detected}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#718355]">
                  {selectedScan.crop} Disease Record
                </span>
                <h4 className="text-xl font-extrabold text-[#202820] mt-0.5">
                  {selectedScan.disease_detected}
                </h4>
                {selectedScan.tamil_name && (
                  <p className="text-xs font-semibold text-[#4A5D23] mt-0.5">
                    {selectedScan.tamil_name}
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4F9F4] border border-[#CFE1B9]/70 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#718355]">Confidence Score:</span>
                  <span className="font-bold text-[#202820]">{selectedScan.confidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718355]">Severity Rating:</span>
                  <span className="font-bold text-[#202820]">{selectedScan.severity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718355]">Field Location:</span>
                  <span className="font-semibold text-[#202820]">{selectedScan.field_zone}</span>
                </div>
                <div className="pt-2 border-t border-[#CFE1B9]/50">
                  <span className="text-[#718355] block mb-0.5 font-medium">Agronomic Action Taken:</span>
                  <span className="font-bold text-[#4A5D23]">{selectedScan.action_taken}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#718355]">
              Select a scan from the left to inspect detailed history.
            </div>
          )}

          <button
            onClick={onNavigateToScan}
            className="w-full mt-4 py-3 rounded-2xl bg-[#4A5D23] hover:bg-[#364419] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            {lang === 'ta' ? '+ புதிய இலை ஸ்கேன் செய்க' : '+ Perform New Diagnostic Scan'}
          </button>
        </div>
      </div>
    </div>
  );
};
