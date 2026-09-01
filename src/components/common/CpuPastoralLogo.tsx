import React from 'react';

interface CpuPastoralLogoProps {
  variant?: 'full' | 'icon' | 'badge' | 'compact';
  textColor?: 'dark' | 'light' | 'auto';
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const CpuPastoralLogo: React.FC<CpuPastoralLogoProps> = ({
  variant = 'full',
  textColor = 'auto',
  className = '',
  size = 'md',
}) => {
  // Size mapping
  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textClasses =
    textColor === 'light'
      ? 'text-white'
      : textColor === 'dark'
      ? 'text-slate-900'
      : 'text-slate-900 dark:text-white';

  const subTextClasses =
    textColor === 'light'
      ? 'text-slate-300'
      : textColor === 'dark'
      ? 'text-slate-700'
      : 'text-slate-600 dark:text-slate-300';

  // SVG Emblem of CPU Pastoral
  const EmblemSvg = (
    <svg
      viewBox="0 0 300 240"
      className="w-full h-full drop-shadow-sm select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. Purple Cross in the background */}
      <g id="cross">
        {/* Vertical beam */}
        <rect x="132" y="12" width="36" height="150" rx="18" fill="#78569B" />
        {/* Horizontal beam */}
        <rect x="80" y="52" width="140" height="36" rx="18" fill="#78569B" />
      </g>

      {/* 2. Five Community Figures */}
      <g id="community-figures">
        {/* Red Figure (Left) */}
        <circle cx="68" cy="116" r="14" fill="#D9272E" />
        <path
          d="M 46 182 C 46 142, 88 142, 88 182 Z"
          fill="#D9272E"
        />

        {/* Yellow Figure (Center-Left) */}
        <circle cx="114" cy="126" r="14" fill="#F7DC1F" />
        <path
          d="M 88 186 C 88 146, 140 146, 140 186 Z"
          fill="#F7DC1F"
        />

        {/* Green Figure (Center-Back) */}
        <circle cx="150" cy="136" r="12" fill="#39B54A" />
        <path
          d="M 128 186 C 128 154, 172 154, 172 186 Z"
          fill="#39B54A"
        />

        {/* Orange Figure (Center-Right) */}
        <circle cx="186" cy="126" r="14" fill="#F37023" />
        <path
          d="M 160 186 C 160 146, 212 146, 212 186 Z"
          fill="#F37023"
        />

        {/* Blue Figure (Right) */}
        <circle cx="232" cy="116" r="14" fill="#1B75BC" />
        <path
          d="M 212 182 C 212 142, 254 142, 254 182 Z"
          fill="#1B75BC"
        />
      </g>

      {/* 3. Bold Lowercase 'cpu' lettering */}
      <g id="cpu-lettering">
        {/* 'c' */}
        <path
          d="M 96 160 C 82 154 62 160 56 176 C 50 192 62 208 80 210 C 94 211 102 204 105 197 L 91 190 C 89 194 85 198 78 197 C 69 196 66 186 68 178 C 70 170 78 166 86 167 C 91 168 94 171 96 174 Z"
          fill="#0B2046"
        />
        {/* 'p' with vertical stem and loop */}
        <path
          d="M 112 162 L 126 162 L 126 170 C 131 164 139 160 148 161 C 160 162 169 172 169 185 C 169 198 159 209 146 209 C 138 209 131 205 126 199 L 126 228 L 112 228 Z M 126 185 C 126 193 132 197 139 197 C 147 197 154 192 154 185 C 154 178 147 173 139 173 C 132 173 126 177 126 185 Z"
          fill="#0B2046"
        />
        {/* 'u' */}
        <path
          d="M 182 162 L 196 162 L 196 188 C 196 194 200 198 206 198 C 212 198 217 194 217 188 L 217 162 L 231 162 L 231 189 C 231 202 221 210 207 210 C 193 210 182 202 182 189 Z"
          fill="#0B2046"
        />
      </g>
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${iconSizes[size]} ${className}`}>
        {EmblemSvg}
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center gap-3 bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-sm ${className}`}
      >
        <div className="w-12 h-10 sm:w-14 sm:h-12 flex-shrink-0 flex items-center justify-center">
          {EmblemSvg}
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] sm:text-xs font-black tracking-wider text-slate-900 leading-none">
            COMUNIDAD
          </span>
          <span className="text-[11px] sm:text-xs font-black tracking-wider text-slate-900 leading-none mt-0.5">
            PASTORAL
          </span>
          <span className="text-[11px] sm:text-xs font-black tracking-wider text-slate-900 leading-none mt-0.5">
            UNIVERSITARIA
          </span>
          <span className="text-[8px] sm:text-[9px] font-extrabold tracking-widest text-slate-600 text-right mt-0.5">
            U.P. N° 15 BATAN
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <div className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 flex items-center justify-center">
          {EmblemSvg}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className={`text-sm sm:text-base font-black tracking-tight ${textClasses}`}>
              CPU Batán
            </span>
            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Pastoral
            </span>
          </div>
          <span className={`text-[10px] font-medium leading-none ${subTextClasses}`}>
            U.P. N° 15 Batán
          </span>
        </div>
      </div>
    );
  }

  // Full Variant
  return (
    <div className={`inline-flex items-center gap-3 sm:gap-4 ${className}`}>
      <div className="w-14 h-12 sm:w-20 sm:h-16 flex-shrink-0 flex items-center justify-center">
        {EmblemSvg}
      </div>
      <div className="flex flex-col justify-center">
        <span className={`text-sm sm:text-lg font-black tracking-widest leading-none ${textClasses}`}>
          COMUNIDAD
        </span>
        <span className={`text-sm sm:text-lg font-black tracking-widest leading-none mt-0.5 ${textClasses}`}>
          PASTORAL
        </span>
        <span className={`text-sm sm:text-lg font-black tracking-widest leading-none mt-0.5 ${textClasses}`}>
          UNIVERSITARIA
        </span>
        <span className={`text-[9px] sm:text-[11px] font-black tracking-widest text-right mt-1 ${subTextClasses}`}>
          U.P. N° 15 BATAN
        </span>
      </div>
    </div>
  );
};
