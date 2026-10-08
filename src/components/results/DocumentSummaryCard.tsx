import React from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Table as TableIcon,
  BarChart3,
  Binary,
  Image as ImageIcon,
  ListOrdered,
} from 'lucide-react';
import { useDocument } from '../../context/DocumentContext';

export const DocumentSummaryCard: React.FC = () => {
  const { document: doc } = useDocument();

  const statItems = [
    { label: 'Text Blocks', count: doc.textBlocks, icon: FileText, bg: 'bg-[#EAF4E2]', text: 'text-[#29452B]' },
    { label: 'Tables', count: doc.tables, icon: TableIcon, bg: 'bg-[#EAF4E2]', text: 'text-[#4D9857]' },
    { label: 'Figures', count: doc.figures, icon: BarChart3, bg: 'bg-[#F0F6E9]', text: 'text-[#729C56]' },
    { label: 'Equations', count: doc.equations, icon: Binary, bg: 'bg-[#FEF9C3]', text: 'text-[#A16207]' },
    { label: 'Images', count: doc.images, icon: ImageIcon, bg: 'bg-[#EAF4E2]', text: 'text-[#29452B]' },
    { label: 'List', count: doc.lists, icon: ListOrdered, bg: 'bg-[#F0F6E9]', text: 'text-[#788773]' },
  ];

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#DCE8D4] shadow-xs flex flex-col justify-between text-[#29452B]">
      <div>
        <h2 className="text-xl font-extrabold text-[#29452B] tracking-tight">
          Document Summary
        </h2>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xs font-bold text-[#788773] uppercase tracking-wider">
            TOTAL BLOCKS
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold text-[#29452B] tabular-nums">
            {doc.totalBlocks}
          </span>
        </div>
      </div>

      {/* Six small statistic cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
        {statItems.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.25 }}
              whileHover={{ y: -2 }}
              className={`p-3 sm:p-3.5 rounded-2xl ${stat.bg} border border-[#DCE8D4]/50 flex flex-col justify-between transition-all`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#29452B]">
                  {stat.label}
                </span>
                <div className={`p-1.5 rounded-lg bg-white/80 ${stat.text}`}>
                  <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
              </div>
              <span className={`text-xl sm:text-2xl font-extrabold mt-2 ${stat.text} tabular-nums`}>
                {stat.count}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
