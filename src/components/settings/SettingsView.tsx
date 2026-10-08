import React, { useState } from 'react';
import { Cpu, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [minConfidence, setMinConfidence] = useState(75);
  const [enableOcrEnhancement, setEnableOcrEnhancement] = useState(true);
  const [autoFlagLowConfidence, setAutoFlagLowConfidence] = useState(true);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8 text-[#29452B]">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#29452B] tracking-tight">
          Settings & Pipeline Config
        </h1>
        <p className="text-base text-[#788773] mt-1.5 leading-relaxed">
          Configure document intelligence models, confidence thresholds, and extraction behavior.
        </p>
      </div>

      <div className="space-y-6">
        {/* Model Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#DCE8D4] shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF4E2] text-[#29452B] flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#29452B]">AI Extraction Pipeline</h2>
              <p className="text-xs text-[#788773]">Select the primary vision-language engine</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl border-2 border-[#729C56] bg-[#EAF4E2]/60 relative">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-[#29452B]">
                  Neural Layout v3.4 (Active)
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#4D9857]" />
              </div>
              <p className="text-xs text-[#788773] mt-1">
                Optimized for complex enterprise documents, rotated receipts, and embedded math.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#DCE8D4] bg-white opacity-60">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#29452B]">Legacy Fast OCR v2.1</span>
                <span className="text-[10px] text-[#788773] font-mono">Archived</span>
              </div>
              <p className="text-xs text-[#788773] mt-1">
                Linear plain text extractor for clean single-column digital PDFs.
              </p>
            </div>
          </div>
        </div>

        {/* Confidence Threshold Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#DCE8D4] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#29452B]">Confidence Threshold</h2>
              <p className="text-xs text-[#788773]">
                Pages below this score are automatically flagged for review
              </p>
            </div>
            <span className="text-xl font-extrabold text-[#4D9857] tabular-nums">
              {minConfidence}%
            </span>
          </div>

          <div className="pt-2">
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="w-full accent-[#4D9857] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#788773] font-semibold mt-1">
              <span>50% (Permissive)</span>
              <span>75% (Standard)</span>
              <span>95% (Strict)</span>
            </div>
          </div>
        </div>

        {/* Toggles Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#DCE8D4] shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-[#29452B]">Extraction Preferences</h2>

          <div className="divide-y divide-[#DCE8D4] text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#29452B]">Multi-Pass Table Reconstruction</p>
                <p className="text-[#788773] text-[11px]">Detect borderless grid cells and multi-line headers</p>
              </div>
              <button
                type="button"
                onClick={() => setEnableOcrEnhancement(!enableOcrEnhancement)}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                  enableOcrEnhancement ? 'bg-[#A8D584]' : 'bg-[#DCE8D4]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    enableOcrEnhancement ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#29452B]">Auto-Flag Low Confidence Tokens</p>
                <p className="text-[#788773] text-[11px]">Include bounding box coordinate warnings in exported JSON</p>
              </div>
              <button
                type="button"
                onClick={() => setAutoFlagLowConfidence(!autoFlagLowConfidence)}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                  autoFlagLowConfidence ? 'bg-[#A8D584]' : 'bg-[#DCE8D4]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    autoFlagLowConfidence ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-between pt-2">
          {savedNotification ? (
            <span className="text-xs font-bold text-[#4D9857] flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4" />
              Settings saved successfully!
            </span>
          ) : (
            <span className="text-xs text-[#788773]">Changes take effect immediately on next parsing run.</span>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-full bg-[#A8D584] hover:bg-[#97C770] text-[#29452B] text-xs font-extrabold transition-all shadow-sm cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
