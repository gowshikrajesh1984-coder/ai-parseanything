import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  Eye,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';
import { ParseLogoIcon } from '../common/ParseLogo';

export const BookModal: React.FC = () => {
  const {
    bookModalOpen,
    closeBookModal,
    bookPage,
    setBookPage,
    document: doc,
    uploadedFileUrl,
    uploadedFile,
    selectedFlaggedPage,
    selectedBlockId,
  } = useDocument();

  const [isFlipping, setIsFlipping] = useState(false);
  const navigate = useNavigate();

  const handleNextPage = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setBookPage(2);
    setTimeout(() => {
      setIsFlipping(false);
    }, 850);
  };

  const handlePrevPage = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setBookPage(1);
    setTimeout(() => {
      setIsFlipping(false);
    }, 850);
  };

  const handleViewResults = () => {
    closeBookModal();
    navigate('/results');
  };

  // Preview source: real uploaded object URL if available, fallback to invoice asset
  const previewSource = uploadedFileUrl || '/src/assets/images/invoice_doc_preview_1791377572904.jpg';
  const isImageFile = doc.format === 'JPG' || doc.format === 'JPEG' || doc.format === 'PNG';
  const isPdfFile = doc.format === 'PDF';
  const isDocxFile = doc.format === 'DOCX';

  return (
    <AnimatePresence>
      {bookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Darkened backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#162719]/80 backdrop-blur-md"
            onClick={closeBookModal}
            aria-hidden="true"
          />

          {/* Book Container with 3D perspective */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            className="relative z-50 w-full max-w-4xl perspective-1200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Top Right */}
            <button
              onClick={closeBookModal}
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-50 w-10 h-10 rounded-full bg-white text-[#29452B] hover:text-[#E76F6F] hover:rotate-90 shadow-xl flex items-center justify-center border border-[#DCE8D4] transition-all duration-200 cursor-pointer"
              aria-label="Close book"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Hardcover Outer Frame in Elegant Forest Green */}
            <div className="relative rounded-[32px] bg-[#1E3520] p-3 sm:p-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)] border-2 border-[#335636]">
              {/* Outer Spine Crease behind pages */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 bg-gradient-to-r from-[#172B19] via-[#243F27] to-[#172B19] hidden md:block z-0 shadow-inner" />

              {/* Book Pages Container (Spread: Left Page + Right Page)
                  CRITICAL REQUIREMENT (Part 24): BOTH PAGES HAVE THE SAME BASE COLOR (#F8FBF5) */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden bg-[#F8FBF5] shadow-2xl border border-[#DCE8D4] min-h-[510px]">

                {/* Spine Center Groove Shadow */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/15 via-black/25 to-black/15 hidden md:block z-30 pointer-events-none" />

                {/* ================= LEFT PAGE (Base color: #F8FBF5) ================= */}
                <div className="p-6 sm:p-8 bg-[#F8FBF5] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#DCE8D4] relative">
                  {/* Subtle paper texture overlay */}
                  <div className="absolute inset-0 bg-radial from-transparent to-black/[0.015] pointer-events-none" />

                  {/* Header of Left Page */}
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <ParseLogoIcon size={30} />
                        <span className="text-xs font-extrabold text-[#29452B] tracking-wider uppercase">
                          ParseAnything AI
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#788773]">
                        Doc ID: #{doc.id || '2025-PA'}
                      </span>
                    </div>

                    <div className="pt-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF4E2] text-[#4D9857] text-xs font-bold mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Document Extraction Succeeded</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-[#29452B] tracking-tight">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-[#788773] mt-1 leading-relaxed">
                        Multi-modal extraction analyzed with {doc.confidence}% confidence score across {doc.pages} pages.
                      </p>
                    </div>

                    {/* Extraction Summary Badges on Left Page */}
                    <div className="grid grid-cols-2 gap-2.5 pt-2">
                      <div className="p-3 rounded-xl bg-white border border-[#DCE8D4] shadow-2xs">
                        <span className="text-[11px] text-[#788773] font-medium block">Total Blocks</span>
                        <span className="text-lg font-extrabold text-[#29452B] tabular-nums">
                          {doc.totalBlocks} blocks
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#DCE8D4] shadow-2xs">
                        <span className="text-[11px] text-[#788773] font-medium block">Tables Extracted</span>
                        <span className="text-lg font-extrabold text-[#4D9857] tabular-nums">
                          {doc.tables} structured
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#DCE8D4] shadow-2xs">
                        <span className="text-[11px] text-[#788773] font-medium block">Text Regions</span>
                        <span className="text-lg font-extrabold text-[#29452B] tabular-nums">
                          {doc.textBlocks} regions
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#DCE8D4] shadow-2xs">
                        <span className="text-[11px] text-[#788773] font-medium block">AI Engine</span>
                        <span className="text-xs font-extrabold text-[#4D9857]">Neural v3.4</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer / Page index indicator */}
                  <div className="relative z-10 pt-6 mt-4 border-t border-[#DCE8D4] flex items-center justify-between text-xs text-[#788773]">
                    <span>Volume 1 • Section A</span>
                    <span className="font-mono font-bold text-[#29452B]">
                      Leaf {bookPage === 1 ? '1' : '2'} of 2
                    </span>
                  </div>
                </div>

                {/* ================= RIGHT PAGE (Base color: #F8FBF5) ================= */}
                <div className="relative bg-[#F8FBF5] min-h-[480px] flex flex-col justify-between overflow-hidden">

                  {/* FLIPPING LEAF CONTAINER (Framer Motion 3D) */}
                  <AnimatePresence mode="wait">
                    {bookPage === 1 ? (
                      /* ================= BOOK PAGE 1: FILE DETAILS ================= */
                      <motion.div
                        key="book-page-1"
                        initial={{ opacity: 0, rotateY: 35, transformOrigin: 'left center' }}
                        animate={{ opacity: 1, rotateY: 0, transformOrigin: 'left center' }}
                        exit={{ opacity: 0, rotateY: -75, transformOrigin: 'left center' }}
                        transition={{ duration: 0.75, ease: [0.25, 1, 0.5, 1] }}
                        className="p-6 sm:p-8 flex flex-col justify-between h-full bg-[#F8FBF5] preserve-3d"
                      >
                        <div className="space-y-5">
                          {/* Title */}
                          <div className="border-b border-[#DCE8D4] pb-3 flex items-center justify-between">
                            <h2 className="text-xl sm:text-2xl font-extrabold text-[#29452B] tracking-tight">
                              File Details
                            </h2>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EAF4E2] text-[#29452B]">
                              Specification
                            </span>
                          </div>

                          {/* Two-Column Information Layout */}
                          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                            <div className="space-y-1">
                              <span className="text-xs font-medium text-[#788773] block">File Name</span>
                              <p className="font-bold text-[#29452B] truncate text-[13px]" title={doc.name}>
                                {doc.name}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-xs font-medium text-[#788773] block">File Format</span>
                              <span className="inline-flex items-center gap-1 font-bold text-[#29452B] text-[13px]">
                                <FileText className="w-3.5 h-3.5 text-[#4D9857]" />
                                {doc.format}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <span className="text-xs font-medium text-[#788773] block">No. of Pages</span>
                              <p className="font-bold text-[#29452B] tabular-nums text-[13px]">
                                {doc.pages} pages
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-xs font-medium text-[#788773] block">Size</span>
                              <p className="font-bold text-[#29452B] tabular-nums text-[13px]">
                                {doc.size}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-xs font-medium text-[#788773] block">Processed At</span>
                              <p className="font-bold text-[#29452B] text-xs">
                                {doc.processedAt}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-xs font-medium text-[#788773] block">Processing Time</span>
                              <span className="inline-flex items-center gap-1 font-bold text-[#4D9857] text-[13px]">
                                <Clock className="w-3.5 h-3.5" />
                                {doc.processingTime}
                              </span>
                            </div>
                          </div>

                          {/* Extra info box */}
                          <div className="p-3.5 rounded-2xl bg-white border border-[#DCE8D4] text-xs text-[#29452B] space-y-1 shadow-2xs">
                            <div className="flex items-center gap-2 font-bold text-[#4D9857]">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Extraction Verified</span>
                            </div>
                            <p className="text-[11px] text-[#788773] leading-relaxed">
                              OCR text tokens, table borders, and financial entities have been aligned with provenance coordinates.
                            </p>
                          </div>
                        </div>

                        {/* Bottom Center Button: Next Page → */}
                        <div className="pt-6 border-t border-[#DCE8D4] flex flex-col items-center">
                          <button
                            type="button"
                            onClick={handleNextPage}
                            disabled={isFlipping}
                            className="px-8 py-3 rounded-full bg-[#A8D584] hover:bg-[#97C770] text-[#29452B] text-sm font-extrabold shadow-md shadow-[#A8D584]/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2.5 cursor-pointer disabled:opacity-50"
                          >
                            <span>Next Page</span>
                            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                          </button>
                          <span className="text-[11px] text-[#788773] mt-2">
                            Flip to Document Preview
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      /* ================= BOOK PAGE 2: DOCUMENT PREVIEW (Base color: #F8FBF5) ================= */
                      <motion.div
                        key="book-page-2"
                        initial={{ opacity: 0, rotateY: -35, transformOrigin: 'left center' }}
                        animate={{ opacity: 1, rotateY: 0, transformOrigin: 'left center' }}
                        exit={{ opacity: 0, rotateY: 75, transformOrigin: 'left center' }}
                        transition={{ duration: 0.75, ease: [0.25, 1, 0.5, 1] }}
                        className="p-6 sm:p-8 flex flex-col justify-between h-full bg-[#F8FBF5] preserve-3d"
                      >
                        <div className="space-y-3">
                          {/* Title & Back Link */}
                          <div className="border-b border-[#DCE8D4] pb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={handlePrevPage}
                                disabled={isFlipping}
                                className="p-1 rounded-full hover:bg-white text-[#788773] hover:text-[#29452B] transition-colors cursor-pointer"
                                title="Flip back to File Details"
                              >
                                <ArrowLeft className="w-4 h-4" />
                              </button>
                              <h2 className="text-xl sm:text-2xl font-extrabold text-[#29452B] tracking-tight">
                                Document Preview
                              </h2>
                            </div>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF4E2] text-[#4D9857]">
                              Live Document
                            </span>
                          </div>

                          {/* Large Document Preview Box with Provenance Bounding Box (Part 22) */}
                          <div className="relative rounded-2xl border-2 border-[#DCE8D4] bg-white overflow-hidden shadow-inner max-h-[230px] flex items-center justify-center group">
                            {/* ACTUAL Uploaded document preview */}
                            {isImageFile ? (
                              <img
                                src={previewSource}
                                alt={doc.name}
                                className="w-full h-full object-contain max-h-[230px] p-2"
                              />
                            ) : isPdfFile ? (
                              <div className="w-full h-full min-h-[210px] relative flex flex-col items-center justify-center p-3 bg-white">
                                {uploadedFile ? (
                                  <object
                                    data={previewSource}
                                    type="application/pdf"
                                    className="w-full h-[210px] rounded-lg"
                                  >
                                    <img
                                      src="/src/assets/images/invoice_doc_preview_1791377572904.jpg"
                                      alt="PDF Page Render"
                                      className="w-full h-full object-contain max-h-[210px]"
                                    />
                                  </object>
                                ) : (
                                  <img
                                    src="/src/assets/images/invoice_doc_preview_1791377572904.jpg"
                                    alt="Invoice PDF Preview"
                                    className="w-full h-full object-contain max-h-[210px]"
                                  />
                                )}
                              </div>
                            ) : (
                              /* DOCX Structured Preview */
                              <div className="w-full h-full min-h-[210px] p-4 bg-white text-left space-y-2 overflow-y-auto">
                                <div className="flex items-center gap-2 pb-2 border-b border-[#DCE8D4]">
                                  <FileText className="w-4 h-4 text-[#4D9857]" />
                                  <span className="font-bold text-xs text-[#29452B]">{doc.name}</span>
                                </div>
                                <div className="space-y-1.5 text-[11px] text-[#788773]">
                                  <p className="font-semibold text-[#29452B]">
                                    Document Section 1: Executive Summary
                                  </p>
                                  <p>Parsed structured paragraphs, detected headers and embedded tabular definitions.</p>
                                </div>
                              </div>
                            )}

                            {/* Traceability: Bounding box highlight in subtle pastel green (Part 22) */}
                            <div className="absolute top-4 left-6 right-6 h-12 border-2 border-[#A8D584] bg-[#A8D584]/20 rounded-lg pointer-events-none flex items-center justify-between px-2.5">
                              <span className="text-[10px] font-extrabold text-[#29452B] bg-white/90 px-1.5 py-0.5 rounded shadow-2xs">
                                Page 1 • Header [Confidence 98%]
                              </span>
                              <span className="text-[10px] font-mono text-[#29452B]">x:50, y:40</span>
                            </div>

                            {/* Interactive Provenance Badge */}
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#29452B]/85 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1 shadow-sm">
                              <MapPin className="w-3 h-3 text-[#A8D584]" />
                              <span>Provenance Traceability: Active</span>
                            </div>

                            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-[#4D9857] text-white text-[10px] font-bold shadow-sm">
                              Page 1 of {doc.pages}
                            </div>
                          </div>

                          <p className="text-[11px] text-[#788773] text-center">
                            Here's a preview of your uploaded document with provenance coordinates.
                          </p>
                        </div>

                        {/* Bottom Center Button: View Parsed Results → */}
                        <div className="pt-4 border-t border-[#DCE8D4] flex flex-col items-center">
                          <button
                            type="button"
                            onClick={handleViewResults}
                            className="px-8 py-3 rounded-full bg-[#A8D584] hover:bg-[#97C770] text-[#29452B] text-sm font-extrabold shadow-md shadow-[#A8D584]/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2.5 cursor-pointer"
                          >
                            <span>View Parsed Results</span>
                            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                          </button>
                          <span className="text-[11px] text-[#788773] mt-2">
                            Explore full analytics & export options
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Paper edge shadow */}
                  <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-l from-black/5 to-transparent pointer-events-none" />
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
