import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Loader2,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Check,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';
import { DocumentsSecondarySidebar } from './DocumentsSecondarySidebar';

export const DocumentUploadView: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    document: doc,
    uploadStatus,
    uploadProgress,
    parsingProgress,
    parsingStage,
    startUpload,
    removeFile,
    startParsing,
    validationError,
    clearValidationError,
  } = useDocument();

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    clearValidationError();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await startUpload(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      clearValidationError();
      await startUpload(e.target.files[0]);
    }
  };

  const handleSelectSample = async (sampleName: string, size: string, type: string) => {
    clearValidationError();
    await startUpload({ name: sampleName, size, type });
  };

  const isParsingComplete = parsingProgress >= 100;

  return (
    <div className="max-w-7xl mx-auto py-4 px-2 sm:px-4 space-y-6">
      {/* Hidden native file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.png,.jpg,.jpeg,.docx"
        className="hidden"
      />

      {/* Main 2-Column Workspace Layout: Secondary Sidebar + Main Upload Area */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* DOCUMENTS SECONDARY SIDEBAR (Part 4) */}
        <DocumentsSecondarySidebar />

        {/* MAIN DOCUMENT WORKSPACE */}
        <div className="flex-1 w-full space-y-6">
          {/* Header */}
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#29452B] tracking-tight">
              File Upload
            </h1>
            <p className="text-sm sm:text-base text-[#788773] leading-relaxed">
              Upload your document and let AI extract the information for you.
            </p>
          </div>

          {/* Structured Validation Error Banner (Part 7 & 8) */}
          <AnimatePresence>
            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-4 sm:p-5 rounded-2xl bg-[#FDE8E8] border border-[#E76F6F]/40 shadow-xs flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white text-[#E76F6F] shadow-2xs shrink-0">
                    <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-[#E76F6F]">
                        ⚠ Unable to process file
                      </h4>
                      <span className="text-[10px] font-mono font-bold bg-white text-[#E76F6F] px-2 py-0.5 rounded-full border border-[#E76F6F]/20">
                        Code: {validationError.code}
                      </span>
                    </div>
                    <p className="text-xs text-[#29452B] font-medium leading-relaxed">
                      {validationError.message}
                    </p>
                    <p className="text-[11px] text-[#788773]">
                      Please choose a supported valid document under 25 MB (PDF, JPG, PNG, DOCX).
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={clearValidationError}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FDE8E8] text-xs font-bold text-[#E76F6F] border border-[#E76F6F]/30 transition-colors shrink-0"
                >
                  Dismiss
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Upload Box / State Area */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {/* ================= STATE 1: IDLE UPLOAD BOX ================= */}
              {uploadStatus === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-10 sm:p-14 rounded-3xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center group ${
                    isDragOver
                      ? 'border-[#729C56] bg-[#EAF4E2] scale-[1.01]'
                      : 'border-[#A8D584] hover:border-[#729C56] bg-white hover:bg-[#F6F9F2] shadow-xs hover:shadow-md'
                  }`}
                >
                  {/* Centered Upload Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-[#EAF4E2] group-hover:bg-[#A8D584] text-[#29452B] flex items-center justify-center shadow-xs transition-all duration-300 group-hover:scale-110 mb-4">
                    <UploadCloud className="w-8 h-8 stroke-[2.2]" />
                  </div>

                  <h2 className="text-lg sm:text-xl font-extrabold text-[#29452B]">
                    Drag & drop your file here
                  </h2>
                  <p className="text-sm text-[#788773] mt-1">
                    or <span className="text-[#29452B] underline font-bold">browse from your computer</span>
                  </p>

                  {/* Supported types & size limit */}
                  <div className="mt-6 pt-6 border-t border-[#DCE8D4] w-full max-w-sm flex items-center justify-between text-xs text-[#788773]">
                    <span className="font-semibold text-[#29452B]">Supported: PDF, JPG, PNG, DOCX</span>
                    <span className="font-bold text-[#4D9857] bg-[#EAF4E2] px-2 py-0.5 rounded-full">
                      Max: 25 MB
                    </span>
                  </div>
                </motion.div>
              )}

              {/* ================= STATE 2: UPLOADING PROGRESS ================= */}
              {uploadStatus === 'uploading' && (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="p-8 sm:p-10 rounded-3xl bg-white border border-[#DCE8D4] shadow-md flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-[#4D9857] animate-spin" />
                    <span className="text-xs font-bold text-[#29452B] absolute tabular-nums">
                      {uploadProgress}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#29452B]">{doc.name}</h3>
                    <p className="text-xs text-[#788773]">Uploading and validating file signature…</p>
                  </div>

                  <div className="w-full max-w-md bg-[#EAF4E2] h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#729C56] to-[#A8D584] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ ease: 'easeOut' }}
                    />
                  </div>

                  <span className="text-xs font-bold text-[#29452B] tabular-nums">
                    {uploadProgress}% completed
                  </span>
                </motion.div>
              )}

              {/* ================= STATE 3: SUCCESSFUL UPLOAD CARD ================= */}
              {uploadStatus === 'uploaded' && (
                <motion.div
                  key="uploaded"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  {/* File details card */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#DCE8D4] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#EAF4E2] text-[#29452B] flex items-center justify-center shrink-0 shadow-2xs">
                        <FileText className="w-7 h-7 stroke-[2.2]" />
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-[#29452B]">{doc.name}</h3>
                        <p className="text-xs text-[#788773] mt-0.5">
                          {doc.format} • {doc.size} • {doc.pages} pages • Signature Verified
                        </p>
                        <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#4D9857]">
                          <CheckCircle2 className="w-4 h-4 text-[#4D9857]" />
                          <span>Validated & uploaded securely</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeFile}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#E76F6F] hover:bg-[#FDE8E8] border border-transparent hover:border-[#E76F6F]/20 flex items-center gap-1.5 transition-colors self-end sm:self-center cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>

                  {/* Format Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#788773]">Supported Formats:</span>
                      <div className="flex items-center gap-1.5">
                        {['PDF', 'JPG', 'PNG', 'DOCX'].map((type) => (
                          <span
                            key={type}
                            className="px-2.5 py-0.5 rounded-md bg-white border border-[#DCE8D4] text-[11px] font-bold text-[#29452B]"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    <span className="text-xs text-[#788773] font-medium">Max allowed size: 25 MB</span>
                  </div>

                  {/* Begin Parsing Button */}
                  <div className="pt-4 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => startParsing()}
                      className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#A8D584] hover:bg-[#97C770] text-[#29452B] text-base font-extrabold shadow-lg shadow-[#A8D584]/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <span>Begin Parsing</span>
                      <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                    </button>
                    <p className="text-xs text-[#788773] mt-3">
                      Launches isolated document parser & opens book inspection preview
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ================= STATE 4: PARSING PROCESSING (Part 23) ================= */}
              {(uploadStatus === 'parsing' || uploadStatus === 'completed') && (
                <motion.div
                  key="parsing-card"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 sm:p-12 rounded-3xl bg-white border border-[#DCE8D4] shadow-xl flex flex-col items-center justify-center text-center space-y-6"
                >
                  {/* Concentric Status Indicator: RED/CORAL active, GREEN completed */}
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    {/* Outer Pulsing Concentric Ring */}
                    <motion.div
                      animate={
                        isParsingComplete
                          ? { scale: 1, opacity: 0 }
                          : { scale: [1, 1.4, 1], opacity: [0.6, 0.2, 0.6] }
                      }
                      transition={{
                        duration: 1.6,
                        repeat: isParsingComplete ? 0 : Infinity,
                        ease: 'easeInOut',
                      }}
                      className={`absolute inset-0 rounded-full ${
                        isParsingComplete ? 'bg-[#4D9857]' : 'bg-[#E76F6F]'
                      }`}
                    />

                    {/* Rotating Dashed Ring while active */}
                    <motion.div
                      animate={isParsingComplete ? { rotate: 0 } : { rotate: 360 }}
                      transition={{
                        duration: 2.5,
                        repeat: isParsingComplete ? 0 : Infinity,
                        ease: 'linear',
                      }}
                      className={`w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center transition-colors duration-500 ${
                        isParsingComplete ? 'border-transparent' : 'border-[#E76F6F]/60'
                      }`}
                    />

                    {/* Central Status Circle: RED active -> GREEN completed with WHITE checkmark */}
                    <motion.div
                      initial={false}
                      animate={{
                        backgroundColor: isParsingComplete ? '#4D9857' : '#E76F6F',
                        scale: isParsingComplete ? [0.85, 1.1, 1] : 1,
                      }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="absolute w-12 h-12 rounded-full flex items-center justify-center shadow-md shadow-black/10"
                    >
                      {isParsingComplete ? (
                        <Check className="w-6 h-6 text-white stroke-[3] animate-in zoom-in" />
                      ) : (
                        <Sparkles className="w-6 h-6 text-white animate-pulse" />
                      )}
                    </motion.div>
                  </div>

                  <div className="space-y-1.5 max-w-md">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#29452B]">
                      {isParsingComplete ? 'Parsing Complete!' : 'Parsing your document...'}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#788773] leading-relaxed">
                      {isParsingComplete
                        ? '✓ Document parsing is complete! Launching book view…'
                        : 'AI is extracting text, tables, images and structured information.'}
                    </p>
                  </div>

                  {/* Rectangular Progress Bar: RED/CORAL active -> GREEN completed */}
                  <div className="w-full max-w-md space-y-2">
                    <div className="w-full bg-[#EAF4E2] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#DCE8D4]">
                      <motion.div
                        className={`h-full rounded-full transition-colors duration-500 ${
                          isParsingComplete
                            ? 'bg-[#4D9857]'
                            : 'bg-gradient-to-r from-[#DC2626] to-[#E76F6F]'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${parsingProgress}%` }}
                        transition={{ ease: 'easeOut', duration: 0.3 }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#788773]">
                      <span className={isParsingComplete ? 'text-[#4D9857]' : 'text-[#E76F6F] animate-pulse'}>
                        {parsingStage}
                      </span>
                      <span className="tabular-nums font-mono text-[#29452B]">
                        {parsingProgress}%
                      </span>
                    </div>
                  </div>

                  {isParsingComplete && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EAF4E2] text-[#4D9857] text-xs font-bold animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-[#4D9857]" />
                      <span>✓ Document parsing is complete!</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Sample Selector for immediate evaluation */}
            {uploadStatus === 'idle' && (
              <div className="pt-2">
                <span className="text-xs font-bold text-[#788773] uppercase tracking-wider block mb-2.5">
                  Or test immediately with a validated sample:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelectSample('Invoice_2025.pdf', '2.4 MB', 'PDF')}
                    className="p-3.5 rounded-2xl bg-white border border-[#DCE8D4] hover:border-[#729C56] hover:bg-[#EAF4E2]/40 text-left transition-all group cursor-pointer"
                  >
                    <p className="text-xs font-extrabold text-[#29452B] group-hover:text-[#4D9857]">
                      Invoice_2025.pdf
                    </p>
                    <p className="text-[11px] text-[#788773] mt-0.5">Corporate Tax Invoice • 5 Pages</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectSample('Application_Form.pdf', '3.2 MB', 'PDF')}
                    className="p-3.5 rounded-2xl bg-white border border-[#DCE8D4] hover:border-[#729C56] hover:bg-[#EAF4E2]/40 text-left transition-all group cursor-pointer"
                  >
                    <p className="text-xs font-extrabold text-[#29452B] group-hover:text-[#4D9857]">
                      Application_Form.pdf
                    </p>
                    <p className="text-[11px] text-[#788773] mt-0.5">Structured Form • 4 Pages</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectSample('Address_Proof.png', '1.9 MB', 'PNG')}
                    className="p-3.5 rounded-2xl bg-white border border-[#DCE8D4] hover:border-[#729C56] hover:bg-[#EAF4E2]/40 text-left transition-all group cursor-pointer"
                  >
                    <p className="text-xs font-extrabold text-[#29452B] group-hover:text-[#4D9857]">
                      Address_Proof.png
                    </p>
                    <p className="text-[11px] text-[#788773] mt-0.5">Scanned Receipt • 1 Page</p>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Security & Privacy Notice (Part 27) */}
          <div className="p-4 rounded-2xl bg-[#EAF4E2]/70 border border-[#DCE8D4] flex items-start gap-3 text-xs text-[#29452B]">
            <ShieldCheck className="w-5 h-5 text-[#4D9857] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">
                Your documents are processed securely and are not retained unnecessarily.
              </p>
              <p className="text-[11px] text-[#788773] leading-relaxed">
                Files undergo pre-parsing client validation, execute inside sandbox environments, and temporary memory references are purged upon session completion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
