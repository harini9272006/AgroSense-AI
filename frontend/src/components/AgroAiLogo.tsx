import React from 'react';

interface AgroAiLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  lang?: 'en' | 'ta';
}

export const AgroAiLogo: React.FC<AgroAiLogoProps> = ({
  size = 'md',
  className = '',
  showText = true,
  lang = 'en'
}) => {
  const dimensions = {
    sm: { box: 'w-8 h-8', svg: 32, text: 'text-xs', sub: 'text-[10px]' },
    md: { box: 'w-10 h-10', svg: 40, text: 'text-sm', sub: 'text-[11px]' },
    lg: { box: 'w-12 h-12', svg: 48, text: 'text-base', sub: 'text-xs' },
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Creative Botanical AI Neural Logo Icon */}
      <div
        className={`relative ${dimensions.box} rounded-2xl flex items-center justify-center shadow-sm select-none transition-transform hover:scale-105 group cursor-pointer`}
        style={{
          background: 'linear-gradient(135deg, #4A5D23 0%, #718355 60%, #97A97C 100%)',
          boxShadow: '0 4px 12px rgba(74, 93, 35, 0.25)'
        }}
      >
        {/* Creative SVG: Sprout Leaf Merging With Neural AI Circuit */}
        <svg
          width={dimensions.svg * 0.72}
          height={dimensions.svg * 0.72}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform group-hover:rotate-6"
        >
          {/* Left Organic Leaf Blade */}
          <path
            d="M18 31C18 31 7 26 7 15C7 8.5 12.5 4 18 4C18 4 18 18 18 31Z"
            fill="#CFE1B9"
            fillOpacity="0.95"
          />

          {/* Right AI Circuit Leaf Blade with Neural Tracks */}
          <path
            d="M18 31C18 31 29 26 29 15C29 9 24 4.5 18 4C18 14 18 24 18 31Z"
            fill="#F4F9F4"
            fillOpacity="0.3"
          />

          {/* Central Stem (Neural Spine) */}
          <path
            d="M18 5V31"
            stroke="#202820"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* AI Neural Circuit Tracks on Right Leaf */}
          <path
            d="M18 12L24 10M18 18L26 17M18 24L23 23"
            stroke="#CFE1B9"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Glowing Neural Data Nodes */}
          <circle cx="24" cy="10" r="1.8" fill="#F4F9F4" />
          <circle cx="26" cy="17" r="1.8" fill="#CFE1B9" />
          <circle cx="23" cy="23" r="1.8" fill="#97A97C" />

          {/* Top Seedling Bio-Chip Dot */}
          <circle cx="18" cy="4" r="2.2" fill="#CFE1B9" stroke="#4A5D23" strokeWidth="1" />
        </svg>

        {/* Pulsing Active Status Indicator */}
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white" />
        </span>
      </div>

      {/* Typography Section */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <h3 className={`${dimensions.text} font-extrabold text-[#202820] tracking-tight leading-tight`}>
              {lang === 'ta' ? 'வேளாண் AI உதவியாளர்' : 'AgroSense AI Assistant'}
            </h3>
            <span className="text-[9px] font-bold uppercase tracking-wider bg-[#CFE1B9] text-[#4A5D23] px-1.5 py-0.2 rounded-md">
              AI
            </span>
          </div>
          <p className={`${dimensions.sub} text-[#718355] font-medium leading-tight mt-0.5`}>
            {lang === 'ta'
              ? 'பயிர் & மண் நுண்ணறிவு ஆலோசகர்'
              : 'Context-Aware Agricultural Intelligence'}
          </p>
        </div>
      )}
    </div>
  );
};
