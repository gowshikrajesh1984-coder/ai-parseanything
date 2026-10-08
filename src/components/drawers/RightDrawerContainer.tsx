import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useDocument } from '../../context/DocumentContext';
import { DocumentsProcessedDrawer } from './DocumentsProcessedDrawer';
import { AccuracyDrawer } from './AccuracyDrawer';
import { ReviewDrawer } from './ReviewDrawer';

export const RightDrawerContainer: React.FC = () => {
  const { activeDrawer, closeDrawer } = useDocument();

  return (
    <AnimatePresence>
      {activeDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden" role="dialog" aria-modal="true">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 bg-[#162719]/50 backdrop-blur-[2px]"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative z-50 w-full max-w-[540px] h-full bg-white rounded-l-[32px] shadow-2xl flex flex-col border-l border-[#DCE8D4] overflow-hidden"
          >
            {/* Top Close Bar */}
            <div className="flex items-center justify-end p-5 pb-2">
              <button
                type="button"
                onClick={closeDrawer}
                className="w-9 h-9 rounded-full bg-[#F6F9F2] hover:bg-[#EAF4E2] text-[#788773] hover:text-[#29452B] flex items-center justify-center transition-all duration-150 group cursor-pointer"
                aria-label="Close panel"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto px-7 pb-8">
              {activeDrawer === 'documents' && <DocumentsProcessedDrawer />}
              {activeDrawer === 'confidence' && <AccuracyDrawer />}
              {activeDrawer === 'review' && <ReviewDrawer />}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
