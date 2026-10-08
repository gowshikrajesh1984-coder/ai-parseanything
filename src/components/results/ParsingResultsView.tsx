import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, Calendar, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';
import { DocumentSummaryCard } from './DocumentSummaryCard';
import { ConfidenceDistributionCard } from './ConfidenceDistributionCard';
import { FlaggedPagesSection } from './FlaggedPagesSection';
import { PagesOverviewCard } from './PagesOverviewCard';
import { ExportPanel } from './ExportPanel';

export const ParsingResultsView: React.FC = () => {
  const navigate = useNavigate();
  const { document: doc, openBookModal } = useDocument();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8 text-[#29452B]">
      {/* Header & Document Metadata Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => navigate('/documents')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DCE8D4] hover:border-[#729C56] text-xs font-bold text-[#29452B] hover:text-[#4D9857] shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Upload</span>
          </button>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#29452B] tracking-tight">
              Parsing Results
            </h1>
            <p className="text-base text-[#788773] mt-1 leading-relaxed">
              Here's a summary of your document and the extracted information.
            </p>
          </div>
        </div>

        {/* Top-Right Document Badge */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#DCE8D4] shadow-xs shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#EAF4E2] text-[#4D9857] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>

          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#29452B]">{doc.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#EAF4E2] text-[#4D9857] font-bold text-[10px]">
                {doc.format}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#788773] mt-0.5">
              <Calendar className="w-3 h-3" />
              <span>{doc.processedAt}</span>
            </div>
          </div>

          {/* Quick Button to Reopen Book Modal */}
          <button
            type="button"
            onClick={openBookModal}
            className="ml-2 p-2 rounded-xl bg-[#EAF4E2] text-[#29452B] hover:bg-[#A8D584] transition-colors cursor-pointer"
            title="Open Book View"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Row 1: Section 1 (Document Summary) & Section 2 (Confidence Distribution) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <DocumentSummaryCard />
        <ConfidenceDistributionCard />
      </motion.div>

      {/* Grid Row 2: Section 3 (Flagged Pages) & Section 4 (Document Pages Overview) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <FlaggedPagesSection />
        <PagesOverviewCard />
      </motion.div>

      {/* Section 5: Export Parsed Results Card (NO ProcessingStatusCard on this page) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <ExportPanel />
      </motion.div>
    </div>
  );
};
