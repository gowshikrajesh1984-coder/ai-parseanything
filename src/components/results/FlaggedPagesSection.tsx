import React from 'react';
import { motion } from 'motion/react';
import { Flag, Check, ChevronRight } from 'lucide-react';
import { useDocument } from '../../context/DocumentContext';

export const FlaggedPagesSection: React.FC = () => {
  const { flaggedPages, selectedFlaggedPage, setSelectedFlaggedPage, resolveFlaggedPage } = useDocument();

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#DCE8D4] shadow-xs text-[#29452B]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-extrabold text-[#29452B] tracking-tight">
            Flagged Pages for Human Review
          </h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FDE8E8] text-[#E76F6F]">
            {flaggedPages.filter((p) => !p.resolved).length} pages
          </span>
        </div>
        <span className="text-xs text-[#788773] hidden sm:inline">
          Click an entry to inspect provenance coordinates
        </span>
      </div>

      {/* Five horizontal review cards */}
      <div className="space-y-2.5">
        {flaggedPages.map((item, idx) => {
          const isSelected = selectedFlaggedPage === item.page;
          return (
            <motion.div
              key={item.page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.2 }}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedFlaggedPage(item.page)}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#EAF4E2] border-[#729C56] shadow-sm ring-1 ring-[#A8D584]'
                  : 'bg-white border-[#DCE8D4] hover:border-[#729C56]/60 hover:bg-[#F6F9F2]'
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Left: Thumbnail & Issue Details */}
                <div className="flex items-center gap-3.5">
                  {/* Small Document Thumbnail with Flag marker */}
                  <div className="w-10 h-13 rounded-lg bg-white border border-[#DCE8D4] flex flex-col justify-between p-1 relative shadow-2xs shrink-0 overflow-hidden">
                    <div className="space-y-1">
                      <div className="w-full h-1 bg-[#DCE8D4] rounded" />
                      <div className="w-3/4 h-1 bg-[#DCE8D4] rounded" />
                      <div className="w-5/6 h-1 bg-[#DCE8D4] rounded" />
                    </div>
                    {/* Small red flag marker */}
                    <div className="flex justify-end">
                      <Flag className="w-2.5 h-2.5 text-[#E76F6F] fill-[#E76F6F]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#29452B]">
                        PAGE {item.page}
                      </span>
                      {item.resolved && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#4D9857] font-bold bg-[#EAF4E2] px-1.5 py-0.5 rounded">
                          <Check className="w-2.5 h-2.5" /> Validated
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-[#29452B] mt-0.5">
                      {item.issue}
                    </p>
                  </div>
                </div>

                {/* Right: Confidence percentage and arrow */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#E76F6F] bg-[#FDE8E8] px-2.5 py-1 rounded-full border border-[#E76F6F]/20 tabular-nums">
                    {item.confidence}%
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#F6F9F2] flex items-center justify-center text-[#788773]">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Inline expansion inspector when item is selected */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-t border-[#DCE8D4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <p className="text-[#788773] text-xs leading-relaxed max-w-xl">
                    <span className="font-bold text-[#29452B]">Provenance Inspector: </span>
                    {item.details}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        resolveFlaggedPage(item.page);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        item.resolved
                          ? 'bg-[#EAF4E2] text-[#4D9857] border border-[#4D9857]/30'
                          : 'bg-white border border-[#DCE8D4] hover:bg-[#EAF4E2] hover:text-[#4D9857] text-[#29452B]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{item.resolved ? 'Approved' : 'Approve Alignment'}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
