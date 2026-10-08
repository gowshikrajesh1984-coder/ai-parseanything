import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useDocument } from '../../context/DocumentContext';

export const ConfidenceDistributionCard: React.FC = () => {
  const { document: doc, confidenceDistribution } = useDocument();
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  // SVG Donut geometry
  const radius = 64;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  const highOffset = 0;
  const highDash = (confidenceDistribution.high / 100) * circumference;

  const mediumOffset = -highDash;
  const mediumDash = (confidenceDistribution.medium / 100) * circumference;

  const lowOffset = -(highDash + mediumDash);
  const lowDash = (confidenceDistribution.low / 100) * circumference;

  const veryLowOffset = -(highDash + mediumDash + lowDash);
  const veryLowDash = (confidenceDistribution.veryLow / 100) * circumference;

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#DCE8D4] shadow-xs flex flex-col justify-between text-[#29452B]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-[#29452B] tracking-tight">
          Confidence Distribution
        </h2>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EAF4E2] text-[#4D9857]">
          AI Validated
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-4">
        {/* Large Donut Chart */}
        <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 170 170">
            {/* Background ring */}
            <circle
              cx="85"
              cy="85"
              r={radius}
              stroke="#F0F6E9"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* High confidence (Pastel Green #4D9857: 90-100%) */}
            <motion.circle
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${highDash} ${circumference}` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              cx="85"
              cy="85"
              r={radius}
              stroke="#4D9857"
              strokeWidth={hoveredSegment === 'high' ? strokeWidth + 3 : strokeWidth}
              strokeDashoffset={highOffset}
              fill="transparent"
              strokeLinecap="round"
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredSegment('high')}
              onMouseLeave={() => setHoveredSegment(null)}
            />

            {/* Medium confidence (Secondary Green #729C56: 70-89%) */}
            <motion.circle
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${mediumDash} ${circumference}` }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              cx="85"
              cy="85"
              r={radius}
              stroke="#729C56"
              strokeWidth={hoveredSegment === 'medium' ? strokeWidth + 3 : strokeWidth}
              strokeDashoffset={mediumOffset}
              fill="transparent"
              strokeLinecap="round"
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredSegment('medium')}
              onMouseLeave={() => setHoveredSegment(null)}
            />

            {/* Low confidence (Amber: 50-69%) */}
            <motion.circle
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${lowDash} ${circumference}` }}
              transition={{ duration: 1, delay: 0.35, ease: 'easeOut' }}
              cx="85"
              cy="85"
              r={radius}
              stroke="#EAB308"
              strokeWidth={hoveredSegment === 'low' ? strokeWidth + 3 : strokeWidth}
              strokeDashoffset={lowOffset}
              fill="transparent"
              strokeLinecap="round"
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredSegment('low')}
              onMouseLeave={() => setHoveredSegment(null)}
            />

            {/* Below 50% (Red: <50%) */}
            <motion.circle
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${veryLowDash} ${circumference}` }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              cx="85"
              cy="85"
              r={radius}
              stroke="#E76F6F"
              strokeWidth={hoveredSegment === 'veryLow' ? strokeWidth + 3 : strokeWidth}
              strokeDashoffset={veryLowOffset}
              fill="transparent"
              strokeLinecap="round"
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredSegment('veryLow')}
              onMouseLeave={() => setHoveredSegment(null)}
            />
          </svg>

          {/* Center Text inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[11px] font-bold text-[#788773] uppercase tracking-wider">
              Avg. Confidence
            </span>
            <span className="text-3xl font-extrabold text-[#29452B] tracking-tight tabular-nums">
              {doc.confidence}%
            </span>
            <span className="text-[10px] text-[#4D9857] font-bold mt-0.5">
              Grade A (Optimal)
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-2.5 w-full sm:w-auto">
          <div
            onMouseEnter={() => setHoveredSegment('high')}
            onMouseLeave={() => setHoveredSegment(null)}
            className={`flex items-center justify-between gap-4 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              hoveredSegment === 'high' ? 'bg-[#EAF4E2]' : 'hover:bg-[#F6F9F2]'
            }`}
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4D9857]" />
              <span className="text-[#29452B] font-semibold">90–100%</span>
            </div>
            <span className="text-xs font-bold text-[#4D9857] tabular-nums">{confidenceDistribution.high}%</span>
          </div>

          <div
            onMouseEnter={() => setHoveredSegment('medium')}
            onMouseLeave={() => setHoveredSegment(null)}
            className={`flex items-center justify-between gap-4 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              hoveredSegment === 'medium' ? 'bg-[#EAF4E2]' : 'hover:bg-[#F6F9F2]'
            }`}
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#729C56]" />
              <span className="text-[#29452B] font-semibold">70–89%</span>
            </div>
            <span className="text-xs font-bold text-[#729C56] tabular-nums">{confidenceDistribution.medium}%</span>
          </div>

          <div
            onMouseEnter={() => setHoveredSegment('low')}
            onMouseLeave={() => setHoveredSegment(null)}
            className={`flex items-center justify-between gap-4 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              hoveredSegment === 'low' ? 'bg-[#FEF9C3]' : 'hover:bg-[#F6F9F2]'
            }`}
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
              <span className="text-[#29452B] font-semibold">50–69%</span>
            </div>
            <span className="text-xs font-bold text-[#A16207] tabular-nums">{confidenceDistribution.low}%</span>
          </div>

          <div
            onMouseEnter={() => setHoveredSegment('veryLow')}
            onMouseLeave={() => setHoveredSegment(null)}
            className={`flex items-center justify-between gap-4 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              hoveredSegment === 'veryLow' ? 'bg-[#FDE8E8]' : 'hover:bg-[#F6F9F2]'
            }`}
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E76F6F]" />
              <span className="text-[#29452B] font-semibold">Below 50%</span>
            </div>
            <span className="text-xs font-bold text-[#E76F6F] tabular-nums">{confidenceDistribution.veryLow}%</span>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[#788773] text-center border-t border-[#DCE8D4] pt-3">
        Hover over sectors to highlight distribution brackets across document pages.
      </p>
    </div>
  );
};
