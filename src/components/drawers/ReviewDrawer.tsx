import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';

export const ReviewDrawer: React.FC = () => {
  const { flaggedPages, resolveFlaggedPage, setSelectedFlaggedPage, closeDrawer } = useDocument();
  const [activeItem, setActiveItem] = useState<number>(3);
  const navigate = useNavigate();

  const handleSelect = (pageNumber: number) => {
    setActiveItem(pageNumber);
    setSelectedFlaggedPage(pageNumber);
  };

  const handleOpenResults = (pageNumber: number) => {
    setSelectedFlaggedPage(pageNumber);
    closeDrawer();
    navigate('/results');
  };

  return (
    <div className="space-y-6 text-[#29452B]">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#29452B] tracking-tight">
          Review
        </h2>
        <p className="text-sm text-[#788773] mt-1.5 leading-relaxed">
          Manually review and validate the extracted data before export.
        </p>
      </div>

      {/* Pages Flagged for Review List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-extrabold text-[#29452B] uppercase tracking-wider">
            Flagged Pages for Human Review
          </h3>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FDE8E8] text-[#E76F6F]">
            {flaggedPages.filter((p) => !p.resolved).length} Pending
          </span>
        </div>

        <div className="space-y-2.5">
          {flaggedPages.map((item, idx) => {
            const isSelected = activeItem === item.page;
            return (
              <motion.div
                key={item.page}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.2 }}
                onClick={() => handleSelect(item.page)}
                className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#EAF4E2] border-[#729C56] shadow-sm'
                    : 'bg-white border-[#DCE8D4] hover:border-[#729C56]/60 hover:bg-[#F6F9F2]'
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Left: Thumbnail & details */}
                  <div className="flex items-center gap-3">
                    {/* Small document preview box with flag marker */}
                    <div className="w-11 h-14 rounded-lg bg-white border border-[#DCE8D4] flex flex-col items-center justify-between p-1.5 relative shadow-2xs shrink-0 overflow-hidden">
                      <div className="w-full space-y-1">
                        <div className="w-full h-1 bg-[#DCE8D4] rounded" />
                        <div className="w-3/4 h-1 bg-[#DCE8D4] rounded" />
                        <div className="w-full h-1 bg-[#DCE8D4] rounded" />
                      </div>
                      {/* Flag icon */}
                      <div className="w-full flex justify-end">
                        <Flag className="w-3 h-3 text-[#E76F6F] fill-[#E76F6F]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-[#29452B]">
                          Page {item.page}
                        </span>
                        {item.resolved && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-[#4D9857] font-bold bg-white px-1.5 py-0.5 rounded shadow-2xs">
                            <Check className="w-2.5 h-2.5" /> Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#788773] mt-0.5 font-semibold">
                        {item.issue}
                      </p>
                    </div>
                  </div>

                  {/* Right: Confidence & Review Badge */}
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FDE8E8] text-[#E76F6F] border border-[#E76F6F]/20">
                      Review
                    </span>
                    <span className="text-xs font-bold text-[#29452B] tabular-nums">
                      {item.confidence}%
                    </span>
                  </div>
                </div>

                {/* Expanded Inspection Box when selected */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-[#DCE8D4] text-xs space-y-2.5"
                  >
                    <p className="text-[12px] text-[#788773] leading-relaxed">
                      {item.details}
                    </p>
                    <div className="flex items-center justify-between pt-1">
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
                        <span>{item.resolved ? 'Marked Verified' : 'Mark as Verified'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenResults(item.page);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#A8D584] hover:bg-[#97C770] text-[#29452B] font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Inspect in Editor</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2">
        <button
          onClick={() => {
            closeDrawer();
            navigate('/results');
          }}
          className="w-full py-3 px-4 rounded-full bg-[#A8D584] hover:bg-[#97C770] text-[#29452B] text-sm font-extrabold shadow-md shadow-[#A8D584]/20 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Open Full Review Workspace</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
