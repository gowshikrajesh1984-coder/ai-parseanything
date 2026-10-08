import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Image as ImageIcon, Search, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';

export const HistoryView: React.FC = () => {
  const { processedDocuments, setDocument } = useDocument();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'PDF' | 'Image'>('All');
  const navigate = useNavigate();

  const filteredDocs = processedDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' ? true : doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleOpenDoc = (docName: string) => {
    setDocument((prev) => ({ ...prev, name: docName }));
    navigate('/results');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8 text-[#29452B]">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#29452B] tracking-tight">
          Document History
        </h1>
        <p className="text-base text-[#788773] mt-1.5 leading-relaxed">
          Search, review, and re-export previously parsed documents.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#DCE8D4] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#788773] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by document name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F6F9F2] border border-[#DCE8D4] text-xs font-semibold text-[#29452B] placeholder-[#95A590] focus:outline-none focus:ring-2 focus:ring-[#A8D584]/40"
          />
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F6F9F2] border border-[#DCE8D4] self-stretch sm:self-auto justify-center">
          {(['All', 'PDF', 'Image'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-white text-[#29452B] shadow-2xs'
                  : 'text-[#788773] hover:text-[#29452B]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#DCE8D4] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DCE8D4] text-[11px] font-extrabold text-[#788773] uppercase tracking-wider">
                <th className="pb-3 pl-2">Document</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Size</th>
                <th className="pb-3">Processed Date</th>
                <th className="pb-3">Confidence</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE8D4]/60 text-xs">
              {filteredDocs.map((doc, idx) => {
                const isPdf = doc.type === 'PDF';
                return (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="hover:bg-[#F6F9F2] transition-colors group cursor-pointer"
                    onClick={() => handleOpenDoc(doc.name)}
                  >
                    <td className="py-3.5 pl-2 font-bold text-[#29452B] flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isPdf ? 'bg-[#EAF4E2] text-[#4D9857]' : 'bg-[#F0F6E9] text-[#729C56]'
                        }`}
                      >
                        {isPdf ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                      </div>
                      <span className="group-hover:text-[#4D9857] transition-colors">{doc.name}</span>
                    </td>
                    <td className="py-3.5 text-[#788773] font-semibold">{doc.type}</td>
                    <td className="py-3.5 text-[#788773] tabular-nums font-mono">{doc.size}</td>
                    <td className="py-3.5 text-[#788773]">{doc.date} • {doc.time}</td>
                    <td className="py-3.5 font-extrabold text-[#29452B] tabular-nums">{doc.confidence}%</td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF4E2] text-[#4D9857]">
                        <CheckCircle2 className="w-3 h-3" />
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-2 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDoc(doc.name);
                        }}
                        className="p-1.5 rounded-lg text-[#4D9857] hover:bg-[#EAF4E2] transition-colors cursor-pointer"
                        title="View extracted results"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
