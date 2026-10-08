import React from 'react';
import { motion } from 'motion/react';
import { Info, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';

export const AccuracyDrawer: React.FC = () => {
  const { document, confidenceDistribution, closeDrawer } = useDocument();
  const navigate = useNavigate();

  // Donut chart calculations
  const radius = 68;
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
    <div className="space-y-6 text-[#29452B]">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#29452B] tracking-tight">
          Accuracy / Confidence Level
        </h2>
        <p className="text-sm text-[#788773] mt-1.5 leading-relaxed">
          AI confidence scoring based on optical text density, glyph clarity, and table grid invariants.
        </p>
      </div>

      {/* Donut Chart Card */}
      <div className="p-6 rounded-3xl bg-[#F6F9F2] border border-[#DCE8D4] flex flex-col items-center justify-center">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 180 180">
            {/* Background ring */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="#DCE8D4"
              strokeWidth="16"
              fill="transparent"
            />
            {/* High confidence (Pastel Green #A8D584 / #4D9857: 90-100%) */}
            <motion.circle
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${highDash} ${circumference}` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              cx="90"
              cy="90"
              r={radius}
              stroke="#4D9857"
              strokeWidth="16"
              strokeDashoffset={highOffset}
              fill="transparent"
              strokeLinecap="round"
            />
            {/* Medium confidence (Secondary green #729C56: 70-89%) */}
            <motion.circle
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${mediumDash} ${circumference}` }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              cx="90"
              cy="90"
              r={radius}
              stroke="#729C56"
              strokeWidth="16"
              strokeDashoffset={mediumOffset}
              fill="transparent"
              strokeLinecap="round"
            />
            {/* Low confidence (Amber/Yellow: 50-69%) */}
            <motion.circle
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${lowDash} ${circumference}` }}
              transition={{ duration: 1, delay: 0.35, ease: 'easeOut' }}
              cx="90"
              cy="90"
              r={radius}
              stroke="#EAB308"
              strokeWidth="16"
              strokeDashoffset={lowOffset}
              fill="transparent"
              strokeLinecap="round"
            />
            {/* Very low confidence (Red: <50%) */}
            <motion.circle
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${veryLowDash} ${circumference}` }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              cx="90"
              cy="90"
              r={radius}
              stroke="#E76F6F"
              strokeWidth="16"
              strokeDashoffset={veryLowOffset}
              fill="transparent"
              strokeLinecap="round"
            />
          </svg>

          {/* Center text inside donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-xs font-bold text-[#788773] uppercase tracking-wider">
              Avg. Confidence
            </span>
            <span className="text-3xl font-extrabold text-[#29452B] tracking-tight tabular-nums mt-0.5">
              92.4%
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#4D9857] font-bold mt-1 bg-[#EAF4E2] px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              High Quality
            </span>
          </div>
        </div>

        {/* 4 Bracket Segments Legend */}
        <div className="w-full grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-[#DCE8D4]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white text-xs border border-[#DCE8D4]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4D9857]" />
              <span className="text-[#788773]">90–100%</span>
            </div>
            <span className="font-extrabold text-[#29452B] tabular-nums">68%</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-white text-xs border border-[#DCE8D4]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#729C56]" />
              <span className="text-[#788773]">70–89%</span>
            </div>
            <span className="font-extrabold text-[#29452B] tabular-nums">22%</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-white text-xs border border-[#DCE8D4]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
              <span className="text-[#788773]">50–69%</span>
            </div>
            <span className="font-extrabold text-[#29452B] tabular-nums">7%</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-white text-xs border border-[#DCE8D4]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E76F6F]" />
              <span className="text-[#788773]">Below 50%</span>
            </div>
            <span className="font-extrabold text-[#29452B] tabular-nums">3%</span>
          </div>
        </div>
      </div>

      {/* 3 Summary Badges */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#EAF4E2] border border-[#DCE8D4] text-center">
          <p className="text-xs text-[#4D9857] font-bold">High Confidence</p>
          <p className="text-xl font-extrabold text-[#4D9857] mt-1 tabular-nums">68%</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#F0F6E9] border border-[#DCE8D4] text-center">
          <p className="text-xs text-[#729C56] font-bold">Medium</p>
          <p className="text-xl font-extrabold text-[#729C56] mt-1 tabular-nums">22%</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#FDE8E8] border border-[#E76F6F]/20 text-center">
          <p className="text-xs text-[#E76F6F] font-bold">Needs Review</p>
          <p className="text-xl font-extrabold text-[#E76F6F] mt-1 tabular-nums">10%</p>
        </div>
      </div>

      {/* Explanation */}
      <div className="p-4 rounded-2xl bg-[#EAF4E2]/60 border border-[#DCE8D4] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#4D9857] shrink-0 mt-0.5" />
        <p className="text-xs text-[#29452B] leading-relaxed">
          Most extracted information has a high confidence level. Pages with lower confidence are automatically flagged for human review.
        </p>
      </div>

      {/* CTA Button */}
      <div className="pt-2">
        <button
          onClick={() => {
            closeDrawer();
            navigate('/results');
          }}
          className="w-full py-3 px-4 rounded-full bg-[#A8D584] hover:bg-[#97C770] text-[#29452B] text-sm font-extrabold shadow-md shadow-[#A8D584]/20 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>View Full Results & Analytics</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
