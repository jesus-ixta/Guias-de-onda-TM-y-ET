/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { CertificateData } from '../types/waveguide';
import {
  Download,
  Award,
  ArrowLeft,
  Printer,
  CheckCircle,
  FileCheck,
  ShieldCheck,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CertificateProps {
  data: CertificateData;
  onReturnToApp: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({
  data,
  onReturnToApp,
}) => {
  const certificateRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Generate and Download 1-Page PDF
  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    setIsExporting(true);
    setExportSuccess(null);

    try {
      const element = certificateRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5, // High resolution for crystal-clear text and borders
        useCORS: true,
        backgroundColor: '#FCFBF7',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      // Letter Landscape format: 279.4 mm x 215.9 mm
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'letter',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Fit single page without margins or overflow
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const cleanFileName = `Constancia_GuiasDeOnda_${data.studentName.replace(/\s+/g, '_')}.pdf`;
      pdf.save(cleanFileName);
      setExportSuccess('PDF generado y descargado exitosamente');
    } catch (err) {
      console.error('Error al generar PDF:', err);
      // Fallback to window.print()
      window.print();
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportSuccess(null), 4000);
    }
  };

  // Download High-Resolution Image PNG
  const handleDownloadImage = async () => {
    if (!certificateRef.current) return;
    setIsExporting(true);

    try {
      const element = certificateRef.current;
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#FCFBF7',
      });

      const link = document.createElement('a');
      link.download = `Constancia_GuiasDeOnda_${data.studentName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setExportSuccess('Imagen de alta resolución guardada');
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportSuccess(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onReturnToApp}
          className="flex items-center gap-2 text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Regresar a la Aplicación (Sin perder avance)</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {exportSuccess && (
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium animate-fade-in">
              <CheckCircle className="w-3.5 h-3.5" />
              {exportSuccess}
            </span>
          )}

          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="flex items-center gap-1.5 text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3.5 py-2 rounded-xl border border-slate-300 transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-slate-600" />
            <span>Descargar Imagen</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-2 text-xs sm:text-sm bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-xl shadow-md transition-all hover:scale-[1.01]"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generando PDF...' : 'Descargar Constancia (PDF)'}</span>
          </button>
        </div>
      </div>

      {/* Certificate Outer Container (Rendered to 1 Letter/A4 Landscape page) */}
      <div className="overflow-x-auto pb-4 flex justify-center">
        <div
          ref={certificateRef}
          style={{ width: '1050px', minHeight: '740px', backgroundColor: '#FCFBF7' }}
          className="relative text-slate-800 p-10 shadow-2xl rounded-sm border-8 border-[#1E3A8A] select-none font-sans"
        >
          {/* Inner Golden Guilloche-style Double Border */}
          <div className="w-full h-full border-2 border-[#D97706] p-4 relative flex flex-col justify-between">
            {/* Fine Corner Accents */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#B45309]" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#B45309]" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#B45309]" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#B45309]" />

            {/* Subtle Watermark in background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
              <Award className="w-[500px] h-[500px] text-[#1E3A8A]" />
            </div>

            {/* Header Section */}
            <div className="text-center space-y-2 relative z-10 pt-2">
              <div className="flex items-center justify-center gap-3">
                <div className="h-0.5 w-16 bg-[#D97706]" />
                <span className="text-[#1E3A8A] uppercase tracking-[0.25em] text-xs font-extrabold">
                  INSTITUTO DE TEORÍA ELECTROMAGNÉTICA &amp; MICROONDAS
                </span>
                <div className="h-0.5 w-16 bg-[#D97706]" />
              </div>

              <h1
                style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                className="text-4xl font-extrabold text-[#1E3A8A] tracking-wider pt-1"
              >
                CONSTANCIA DE ACREDITACIÓN
              </h1>

              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                EXCELENCIA ACADÉMICA EN INGENIERÍA ELECTRÓNICA
              </p>
            </div>

            {/* Certificate Body Text */}
            <div className="text-center space-y-4 my-auto relative z-10 px-8 py-3">
              <p className="text-xs uppercase tracking-wider text-slate-600 font-medium">
                Se otorga con distinción el presente reconocimiento a:
              </p>

              {/* Student Name */}
              <div className="py-1">
                <h2
                  style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                  className="text-3xl sm:text-4xl font-black text-[#1E3A8A] tracking-wide border-b-2 border-[#D97706]/70 pb-2 inline-block px-10 min-w-[480px]"
                >
                  {data.studentName}
                </h2>
              </div>

              {/* Endorsement Paragraph */}
              <p className="text-slate-700 text-sm max-w-2xl mx-auto leading-relaxed font-serif italic">
                Por haber demostrado dominio teórico riguroso, destreza analítica y competencia en la resolución cuantitativa de problemas en el módulo especializado:
              </p>

              {/* Course Title Badge */}
              <div className="bg-[#FEF3C7]/80 border border-[#D97706]/60 rounded-xl py-3 px-6 max-w-2xl mx-auto shadow-xs">
                <h3 className="font-extrabold text-[#1E3A8A] text-base tracking-wide uppercase">
                  Tema 3: Guías de Onda Rectangulares
                </h3>
                <p className="text-xs text-[#92400E] font-medium mt-0.5">
                  Subtemas Acreditados: 3.1 Ecuaciones y Parámetros | 3.2 Modos Transversales Magnéticos (TM) | 3.3 Modos Transversales Eléctricos (TE)
                </p>
              </div>

              {/* Score and Validation */}
              <div className="flex items-center justify-center gap-8 pt-2">
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                    Calificación Obtenida
                  </span>
                  <span className="text-2xl font-black text-[#10B981] font-mono">
                    {data.percentage}%
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium block">
                    ({data.score} de {data.totalQuestions} reactivos)
                  </span>
                </div>

                <div className="h-10 w-px bg-slate-200" />

                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                    Estatus de Evaluación
                  </span>
                  <span className="text-sm font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-3 py-0.5 rounded-full inline-block mt-0.5">
                    ACREDITADO
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-0.5">
                    Criterio Mínimo Exigido: 80%
                  </span>
                </div>
              </div>
            </div>

            {/* Footer with Signatures, Official Gold Seal and Folio */}
            <div className="relative z-10 pt-4 border-t border-[#D97706]/40 flex items-end justify-between px-6">
              {/* Left Signature: Socratic Academic Committee */}
              <div className="text-center w-60">
                <div className="h-10 flex items-end justify-center pb-1">
                  <span
                    style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                    className="italic text-base text-slate-700 tracking-wider"
                  >
                    Dr. H. Hertz &amp; J. C. Maxwell
                  </span>
                </div>
                <div className="w-full border-t border-slate-400 pt-1">
                  <p className="text-[11px] font-bold text-slate-800 uppercase">
                    Comité de Teoría Electromagnética
                  </p>
                  <p className="text-[9px] text-slate-500">
                    Cátedra de Microondas &amp; Guías de Onda
                  </p>
                </div>
              </div>

              {/* Center: Official Seal Badge */}
              <div className="flex flex-col items-center justify-center px-4">
                <div className="w-20 h-20 rounded-full border-4 border-[#D97706] bg-linear-to-b from-[#FEF3C7] to-[#FDE68A] flex flex-col items-center justify-center shadow-md relative">
                  <Award className="w-8 h-8 text-[#B45309]" />
                  <span className="text-[8px] font-black uppercase text-[#78350F] tracking-tighter">
                    VERIFICADO
                  </span>
                  <div className="absolute -bottom-2 bg-[#1E3A8A] text-[#FEF3C7] text-[7px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    VALIDEZ 100%
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-600 mt-3 font-semibold">
                  Fecha: {data.date}
                </span>
              </div>

              {/* Right: Verification Folio & QR Mock */}
              <div className="text-right w-60">
                <div className="space-y-1">
                  <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-slate-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                    <span>Folio Digital de Verificación:</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-[#1E3A8A] bg-slate-100 py-1 px-2.5 rounded border border-slate-300 inline-block">
                    {data.folio}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">
                    Hash: {data.verificationHash.slice(0, 20)}...
                  </div>
                  <p className="text-[9px] text-slate-500 pt-0.5">
                    Certificado emitido electrónicamente de acuerdo a los criterios del programa académico.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
