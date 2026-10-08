import React from 'react';
import { motion } from 'motion/react';
import { FileText, Image as ImageIcon, ChevronRight, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';

export const DocumentsProcessedDrawer: React.FC = () => {
  const { processedDocuments, closeDrawer } = useDocument();
  const navigate = useNavigate();

  const handleSelectDoc = () => {
    closeDrawer();
    navigate('/results');
  };

  return (
    <div className="space-y-6 text-[#29452B]">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#29452B] tracking-tight">
          Documents Processed
        </h2>
        <p className="text-sm text-[#788773] mt-1.5 leading-relaxed">
          Here are the documents that have been processed and extracted successfully.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#F6F9F2] border border-[#DCE8D4]">
          <p className="text-xs font-bold text-[#788773]">Total Documents</p>
          <p className="text-2xl font-extrabold text-[#29452B] mt-1 tabular-nums">5</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#EAF4E2] border border-[#DCE8D4]">
          <p className="text-xs font-bold text-[#4D9857]">Processed</p>
          <p className="text-2xl font-extrabold text-[#4D9857] mt-1 tabular-nums">5</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#F6F9F2] border border-[#DCE8D4]">
          <p className="text-xs font-bold text-[#788773]">Pending</p>
          <p className="text-2xl font-extrabold text-[#29452B] mt-1 tabular-nums">0</p>
        </div>
      </div>

      {/* Documents List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-extrabold text-[#29452B] uppercase tracking-wider">
            Processed Documents
          </h3>
          <span className="text-xs text-[#788773]">5 files available</span>
        </div>

        <div className="space-y-2.5">
          {processedDocuments.slice(0, 5).map((doc, index) => {
            const isPdf = doc.type === 'PDF';
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.25 }}
                onClick={handleSelectDoc}
                className="group p-3.5 rounded-2xl bg-white border border-[#DCE8D4] hover:border-[#729C56] hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isPdf ? 'bg-[#EAF4E2] text-[#4D9857]' : 'bg-[#F0F6E9] text-[#729C56]'
                    }`}
                  >
                    {isPdf ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#29452B] group-hover:text-[#4D9857] transition-colors">
                      {doc.name}
                    </h4>
                    <p className="text-xs text-[#788773] mt-0.5">
                      {doc.type} • {doc.size} • {doc.date} • {doc.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAF4E2] text-[#4D9857]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Processed
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#F6F9F2] group-hover:bg-[#EAF4E2] text-[#788773] group-hover:text-[#29452B] flex items-center justify-center transition-colors">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA at bottom */}
      <div className="pt-2">
        <button
          onClick={() => {
            closeDrawer();
            navigate('/documents');
          }}
          className="w-full py-3 px-4 rounded-full bg-[#A8D584] hover:bg-[#97C770] text-[#29452B] text-sm font-extrabold shadow-md shadow-[#A8D584]/20 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Upload Another Document</span>
          <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
