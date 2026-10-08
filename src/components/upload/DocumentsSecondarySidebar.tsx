import React from 'react';
import {
  FileCheck,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useDocument } from '../../context/DocumentContext';

export const DocumentsSecondarySidebar: React.FC = () => {
  const { openDrawer, activeDrawer, processedDocuments, flaggedPages, document: doc } = useDocument();

  const pendingReviewCount = flaggedPages.filter((p) => !p.resolved).length;

  const items = [
    {
      id: 'documents' as const,
      title: 'Documents Processed',
      subtitle: `${processedDocuments.length} files extracted`,
      icon: FileCheck,
      badge: `${processedDocuments.length} Total`,
      badgeColor: 'bg-[#EAF4E2] text-[#29452B]',
    },
    {
      id: 'confidence' as const,
      title: 'Accuracy / Confidence Level',
      subtitle: `${doc.confidence}% average score`,
      icon: ShieldCheck,
      badge: '92.4% Avg',
      badgeColor: 'bg-[#A8D584]/40 text-[#29452B]',
    },
    {
      id: 'review' as const,
      title: 'Review',
      subtitle: `${pendingReviewCount} pages flagged`,
      icon: AlertTriangle,
      badge: `${pendingReviewCount} Pending`,
      badgeColor: 'bg-[#FDE8E8] text-[#E76F6F]',
    },
  ];

  return (
    <aside className="w-full lg:w-72 bg-white rounded-3xl border border-[#DCE8D4] p-5 shadow-xs flex flex-col justify-between shrink-0 space-y-6">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#4D9857]" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#29452B]">
              Document Insights
            </h3>
          </div>
          <p className="text-[11px] text-[#788773] mt-1 leading-snug">
            Quick drawers for processed files, quality analytics, and human review.
          </p>
        </div>

        {/* 3 Secondary Navigation Action Items */}
        <div className="space-y-2.5">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeDrawer === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => openDrawer(item.id)}
                className={`w-full p-3.5 rounded-2xl text-left border transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                  isActive
                    ? 'bg-[#EAF4E2] border-[#729C56] shadow-2xs'
                    : 'bg-[#F6F9F2]/70 border-[#DCE8D4] hover:bg-[#EAF4E2]/50 hover:border-[#A8D584]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#A8D584] text-[#29452B]'
                        : 'bg-white text-[#4D9857] shadow-2xs group-hover:bg-[#A8D584]/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#29452B] leading-tight group-hover:text-[#29452B]">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#788773] mt-0.5">{item.subtitle}</p>
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1.5 ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-[#788773] group-hover:text-[#29452B] group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Pipeline Status Summary Card */}
      <div className="p-3.5 rounded-2xl bg-[#EAF4E2]/60 border border-[#DCE8D4] space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#29452B] text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#4D9857]" />
            Pipeline Sandbox
          </span>
          <span className="text-[10px] text-[#4D9857] font-extrabold bg-white px-1.5 py-0.5 rounded shadow-2xs">
            Active
          </span>
        </div>
        <p className="text-[10px] text-[#788773] leading-relaxed">
          Isolated processing environment active. Zero arbitrary macro execution.
        </p>
      </div>
    </aside>
  );
};
