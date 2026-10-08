import React from 'react';
import { motion } from 'motion/react';
import { useDocument } from '../../context/DocumentContext';

export const PagesOverviewCard: React.FC = () => {
  const { selectedFlaggedPage, setSelectedFlaggedPage, document: doc, flaggedPages } = useDocument();

  const totalPages = Math.max(1, doc.pages || 1);
  const flaggedPageNumbers = flaggedPages.map((p) => p.page);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#DCE8D4] shadow-xs flex flex-col justify-between text-[#29452B]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-[#29452B] tracking-tight">
            Document Pages Overview
          </h2>
          <span className="text-xs text-[#788773] font-bold">
            {totalPages} Total Page{totalPages > 1 ? 's' : ''}
          </span>
        </div>

        {/* 5x5 Grid of Page Numbers */}
        <div className="grid grid-cols-5 gap-2.5">
          {pages.map((pageNum) => {
            const isFlagged = flaggedPageNumbers.includes(pageNum);
            const isSelected = selectedFlaggedPage === pageNum;

            return (
              <motion.button
                key={pageNum}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setSelectedFlaggedPage(pageNum)}
                className={`h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center transition-all duration-150 cursor-pointer ${
                  isFlagged
                    ? 'bg-[#FDE8E8] text-[#E76F6F] border-2 border-[#E76F6F]/60 hover:bg-[#FCD4D4] hover:border-[#E76F6F]'
                    : 'bg-[#EAF4E2] text-[#29452B] border border-[#DCE8D4] hover:bg-[#D8ECCB]'
                } ${
                  isSelected ? 'ring-2 ring-offset-2 ring-[#29452B] shadow-sm' : ''
                }`}
                aria-label={`Page ${pageNum} ${isFlagged ? '(Flagged for review)' : '(Normal page)'}`}
              >
                {pageNum}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Legend & Selected info */}
      <div className="mt-6 pt-4 border-t border-[#DCE8D4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-[#FDE8E8] border border-[#E76F6F]" />
            <span className="text-[#E76F6F] font-bold">Flagged for review</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-[#EAF4E2] border border-[#DCE8D4]" />
            <span className="text-[#29452B] font-bold">Normal page</span>
          </div>
        </div>

        {selectedFlaggedPage && (
          <span className="text-[11px] font-bold text-[#29452B] bg-[#EAF4E2] px-2.5 py-0.5 rounded-full border border-[#DCE8D4]">
            Page {selectedFlaggedPage} Selected
          </span>
        )}
      </div>
    </div>
  );
};
