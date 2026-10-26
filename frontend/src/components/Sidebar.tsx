import React from 'react';
import {
  LayoutDashboard,
  ScanLine,
  CloudSun,
  Layers,
  FileSpreadsheet,
  Sliders,
  MessageSquareText,
  Info,
  Sprout,
  Compass
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'en' | 'ta';
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, lang }) => {
  const menuItems = [
    { id: 'landing', labelEn: 'Overview', labelTa: 'முகப்பு', icon: Compass },
    { id: 'dashboard', labelEn: 'Farm Dashboard', labelTa: 'பண்ணை பலகை', icon: LayoutDashboard },
    { id: 'scanner', labelEn: 'AI Leaf Scanner', labelTa: 'இலை ஸ்கேனர்', icon: ScanLine },
    { id: 'climate', labelEn: 'Climate & Weather', labelTa: 'வானிலை & பருவநிலை', icon: CloudSun },
    { id: 'soil', labelEn: 'Soil Intelligence', labelTa: 'மண் நுண்ணறிவு', icon: Layers },
    { id: 'reports', labelEn: 'Diagnosis Reports', labelTa: 'பரிசோதனை அறிக்கை', icon: FileSpreadsheet },
    { id: 'simulator', labelEn: 'Farm Simulator', labelTa: 'பண்ணை சிமுலேட்டர்', icon: Sliders },
    { id: 'assistant', labelEn: 'Tamil AI Assistant', labelTa: 'தமிழ் உதவியாளர்', icon: MessageSquareText },
    { id: 'about', labelEn: 'About & Datasets', labelTa: 'தொழில்நுட்பம்', icon: Info },
  ];

  return (
    <aside className="w-16 md:w-20 bg-white border-r border-[#CFE1B9]/60 flex flex-col items-center py-5 justify-between min-h-screen sticky top-0 z-40 select-none shadow-xs">
      <div className="flex flex-col items-center gap-7 w-full">
        {/* Brand Logo */}
        <button
          onClick={() => setActiveTab('landing')}
          className="w-11 h-11 rounded-2xl bg-[#4A5D23] flex items-center justify-center text-white shadow-md hover:scale-105 transition-all cursor-pointer group relative"
          title="AgroSense AI"
        >
          <Sprout className="w-6 h-6 text-[#CFE1B9] group-hover:rotate-12 transition-transform" />
          <span className="absolute left-16 bg-[#202820] text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
            AgroSense AI
          </span>
        </button>

        {/* Navigation Icons Stack */}
        <nav className="flex flex-col gap-2 w-full px-2.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative group w-full aspect-square rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#4A5D23] text-white shadow-sm font-semibold'
                    : 'text-[#718355] hover:bg-[#F4F9F4] hover:text-[#4A5D23]'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />

                {/* Left Active Indicator Bar */}
                {isActive && (
                  <span className="absolute -left-2.5 top-2 bottom-2 w-1.5 bg-[#4A5D23] rounded-r-full" />
                )}

                {/* Floating Tooltip */}
                <span className="absolute left-16 bg-[#202820] text-white text-xs font-medium px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-md">
                  {lang === 'ta' ? item.labelTa : item.labelEn}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status / Mode Dot */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse"
          title="AgroSense Multimodal Engine: Online"
        />
        <span className="text-[10px] text-[#718355] font-semibold">v2.0</span>
      </div>
    </aside>
  );
};
