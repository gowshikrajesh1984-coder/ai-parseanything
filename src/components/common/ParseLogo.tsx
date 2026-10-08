import React from 'react';

export interface ParseLogoProps {
  /** Size preset or numeric pixel value */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Whether to show the text label alongside the icon mark */
  showText?: boolean;
  /** Custom tagline under the brand name (defaults to "Document AI") */
  tagline?: string;
  /** Hide the tagline completely even if showText is true */
  hideTagline?: boolean;
  /** Color theme variant */
  variant?: 'brand' | 'dark' | 'white' | 'minimal';
  /** Additional CSS class for the wrapper */
  className?: string;
  /** Class name specifically for the icon mark */
  iconClassName?: string;
  /** Whether hovering triggers a playful micro-interaction */
  interactive?: boolean;
}

const sizeMap = {
  xs: { icon: 28, text: 'text-sm', tag: 'text-[9px]' },
  sm: { icon: 32, text: 'text-base', tag: 'text-[10px]' },
  md: { icon: 40, text: 'text-lg', tag: 'text-[10px]' },
  lg: { icon: 48, text: 'text-xl', tag: 'text-xs' },
  xl: { icon: 56, text: 'text-2xl', tag: 'text-xs' },
};

export const ParseLogoIcon: React.FC<{
  size?: number;
  variant?: 'brand' | 'dark' | 'white' | 'minimal';
  className?: string;
}> = ({ size = 40, variant = 'brand', className = '' }) => {
  const isDark = variant === 'dark';
  const isWhite = variant === 'white';
  const isMinimal = variant === 'minimal';

  // Palette according to variant
  const bgGradStart = isDark ? '#1C331E' : isWhite ? '#FFFFFF' : '#B2DF8F';
  const bgGradMid = isDark ? '#233F25' : isWhite ? '#F8FCF5' : '#A8D584';
  const bgGradEnd = isDark ? '#172B19' : isWhite ? '#F0F6E9' : '#80BE53';
  const strokeColor = isDark ? '#A8D584' : isWhite ? '#29452B' : '#223B24';
  const bracketColor = isDark ? '#A8D584' : '#FFFFFF';
  const accentDotColor = isDark ? '#A8D584' : '#4D9857';
  const sparkColor = isDark ? '#A8D584' : isWhite ? '#29452B' : '#223B24';
  const borderStroke = isDark ? 'rgba(168, 213, 132, 0.25)' : isWhite ? '#DCE8D4' : 'rgba(255, 255, 255, 0.45)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`pabg_${variant}_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={bgGradStart} />
          <stop offset="50%" stopColor={bgGradMid} />
          <stop offset="100%" stopColor={bgGradEnd} />
        </linearGradient>
        <linearGradient id={`pabracket_${variant}_${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={bracketColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor={bracketColor} stopOpacity="0.8" />
        </linearGradient>
        <filter id={`pashadow_${variant}_${size}`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow
            dx="0"
            dy="1.5"
            stdDeviation="1.2"
            floodColor={isDark ? '#000000' : '#1B321D'}
            floodOpacity={isDark ? '0.45' : '0.18'}
          />
        </filter>
      </defs>

      {/* Outer rounded squircle badge */}
      {!isMinimal && (
        <>
          <rect
            width="48"
            height="48"
            rx="14"
            fill={`url(#pabg_${variant}_${size})`}
          />
          <rect
            x="0.75"
            y="0.75"
            width="46.5"
            height="46.5"
            rx="13.25"
            stroke={borderStroke}
            strokeWidth="1.5"
          />
        </>
      )}

      {/* Main Vector Monogram Mark: Folded Document "P" & Extraction Beam */}
      <g filter={!isMinimal ? `url(#pashadow_${variant}_${size})` : undefined}>
        {/* Document Spine (Left Pillar of P) */}
        <rect
          x="10.5"
          y="10"
          width="6.5"
          height="28"
          rx="3.25"
          fill={strokeColor}
        />

        {/* Dynamic Curved Document Loop (Head of P) */}
        <path
          d="M13.5 10H27C32.523 10 37 14.029 37 19C37 23.971 32.523 28 27 28H13.5"
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* High-Precision Parser Aperture / Angle Bracket */}
        <path
          d="M23 15.75L26.75 19L23 22.25"
          fill="none"
          stroke={`url(#pabracket_${variant}_${size})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Structured Output Nodes (Raw docs -> clean schema data) */}
        <rect
          x="21"
          y="31.5"
          width="15"
          height="3"
          rx="1.5"
          fill={strokeColor}
        />
        <rect
          x="21"
          y="36.5"
          width="9.5"
          height="3"
          rx="1.5"
          fill={strokeColor}
          fillOpacity={isDark ? 0.7 : 0.8}
        />
        <circle
          cx="34"
          cy="38"
          r="1.5"
          fill={accentDotColor}
        />

        {/* 4-Point AI Intelligence Spark at Document Fold Apex */}
        <path
          d="M37.5 5.5C37.5 7.4 38.6 8.5 40.5 8.5C38.6 8.5 37.5 9.6 37.5 11.5C37.5 9.6 36.4 8.5 34.5 8.5C36.4 8.5 37.5 7.4 37.5 5.5Z"
          fill={sparkColor}
        />
      </g>
    </svg>
  );
};

export const ParseLogo: React.FC<ParseLogoProps> = ({
  size = 'md',
  showText = true,
  tagline = 'Document AI',
  hideTagline = false,
  variant = 'brand',
  className = '',
  iconClassName = '',
  interactive = true,
}) => {
  const pixelSize =
    typeof size === 'number'
      ? size
      : sizeMap[size]?.icon ?? sizeMap.md.icon;

  const fontClass =
    typeof size === 'string' && sizeMap[size]
      ? sizeMap[size].text
      : 'text-lg';

  const tagClass =
    typeof size === 'string' && sizeMap[size]
      ? sizeMap[size].tag
      : 'text-[10px]';

  return (
    <div
      className={`inline-flex items-center gap-3 select-none ${
        interactive ? 'group cursor-pointer' : ''
      } ${className}`}
    >
      <div
        className={`relative ${
          interactive
            ? 'transition-transform duration-200 group-hover:scale-105 group-hover:-rotate-1'
            : ''
        } ${iconClassName}`}
      >
        <ParseLogoIcon size={pixelSize} variant={variant} />
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-baseline">
            <span
              className={`font-extrabold tracking-tight ${fontClass} ${
                variant === 'dark' ? 'text-white' : 'text-[#29452B]'
              }`}
            >
              Parse
            </span>
            <span
              className={`font-bold tracking-tight ${fontClass} ${
                variant === 'dark' ? 'text-[#A8D584]' : 'text-[#4D9857]'
              }`}
            >
              Anything
            </span>
          </div>

          {!hideTagline && tagline && (
            <span
              className={`font-extrabold uppercase tracking-widest mt-1 ${tagClass} ${
                variant === 'dark' ? 'text-[#A8D584]/80' : 'text-[#729C56]'
              }`}
            >
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ParseLogo;
