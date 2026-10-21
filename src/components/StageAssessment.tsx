/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QuizQuestion, CertificateData } from '../types/waveguide';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import MathView from './MathView';
import Certificate from './Certificate';
import confetti from 'canvas-confetti';
import {
  ClipboardCheck,
  User,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface StageAssessmentProps {
  onNavigateToStage: (stageIndex: number) => void;
}

export const StageAssessment: React.FC<StageAssessmentProps> = ({
  onNavigateToStage,
}) => {
  // State
  const [studentName, setStudentName] = useState<string>('');
  const [nameSubmitted, setNameSubmitted] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Start exam after validating name
  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || studentName.trim().length < 3) {
      setErrorMessage('Por favor ingresa tu nombre completo (mínimo 3 caracteres) para emitir la constancia.');
      return;
    }
    setErrorMessage(null);
    setNameSubmitted(true);
  };

  // Handle Answer Selection
  const handleSelectOption = (questionId: number, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Submit and Grade Exam
  const handleSubmitExam = () => {
    // Check if all answered
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < QUIZ_QUESTIONS.length) {
      if (!confirm(`Has respondido ${answeredCount} de ${QUIZ_QUESTIONS.length} preguntas. ¿Deseas enviar la evaluación de todas formas?`)) {
        return;
      }
    }

    let correctCount = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerId) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
    setScore(correctCount);
    setIsSubmitted(true);

    if (percentage >= 80) {
      // Trigger Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }

      // Generate verification folio and hash
      const randomFolioSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      const folio = `TEO-GO-2026-${randomFolioSuffix}`;
      const verificationHash = Array.from(
        `${studentName}-${percentage}-${Date.now()}`
      )
        .map((c) => c.charCodeAt(0).toString(16))
        .join('');

      const cert: CertificateData = {
        studentName: studentName.trim(),
        score: correctCount,
        totalQuestions: QUIZ_QUESTIONS.length,
        percentage,
        date: new Date().toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        folio,
        verificationHash,
      };

      setCertificateData(cert);
    }
  };

  // Retake exam
  const handleRetakeExam = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setCertificateData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If passed and viewing certificate
  if (isSubmitted && certificateData && certificateData.percentage >= 80) {
    return (
      <div className="space-y-6">
        {/* Celebration Banner */}
        <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-md border border-emerald-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500 rounded-2xl text-slate-900">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                ¡Enhorabuena, Examen Acreditado!
              </span>
              <h2 className="text-2xl font-black">
                {studentName}, has obtenido {certificateData.percentage}% ({score}/20)
              </h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                Has cumplido satisfactoriamente con el estándar mínimo de acreditación (&ge; 80%). Tu constancia oficial se encuentra lista.
              </p>
            </div>
          </div>

          <button
            onClick={handleRetakeExam}
            className="flex items-center gap-1.5 text-xs bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border border-emerald-600 px-4 py-2.5 rounded-xl font-medium transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Volver a Intentar Evaluación</span>
          </button>
        </div>

        {/* Certificate Display */}
        <Certificate
          data={certificateData}
          onReturnToApp={() => onNavigateToStage(1)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Assessment Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Etapa 4: Evaluación y Acreditación Académica
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Examen Teórico-Práctico de Guías de Onda
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluación integral de 20 reactivos (Temas 3.1, 3.2 y 3.3). Calificación mínima de acreditación: 80% (16/20).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Mandatory Student Name Registration */}
      {!nameSubmitted ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-xs max-w-xl mx-auto text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
            <User className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Registro Obligatorio del Estudiante
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Ingresa tu nombre completo tal como debe figurar en tu <strong>Constancia Oficial de Acreditación</strong> al aprobar con 80% o más.
            </p>
          </div>

          <form onSubmit={handleStartExam} className="space-y-4 pt-2">
            <div className="text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nombre Completo del Alumno:
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Ej. Ing. Carlos Mendoza Alvarado"
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                autoFocus
              />
              {errorMessage && (
                <div className="text-rose-600 text-xs mt-2 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-left text-xs text-blue-900 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <ClipboardCheck className="w-4 h-4 text-blue-600" /> Criterios de la Prueba:
              </span>
              <ul className="list-disc pl-4 space-y-0.5 text-blue-800 text-[11px]">
                <li>20 preguntas de opción múltiple con fórmulas LaTeX.</li>
                <li>Mínimo para aprobar: 16 aciertos de 20 (80%).</li>
                <li>Emisión instantánea de Constancia con folio de autenticidad en PDF al aprobar.</li>
                <li>Si obtienes menos del 80%, podrás consultar la retroalimentación y reintentar libremente.</li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Comenzar Evaluación</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Step 2: 20 Questions Exam View */
        <div className="space-y-6">
          {/* Progress Bar & Student Banner */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Alumno Registrado:</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                {studentName}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="text-slate-600">
                Respondidas:{' '}
                <span className="text-blue-600 font-bold">
                  {Object.keys(selectedAnswers).length}
                </span>{' '}
                de {QUIZ_QUESTIONS.length}
              </div>

              {/* Progress bar */}
              <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{
                    width: `${(Object.keys(selectedAnswers).length / QUIZ_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Feedback Banner if Submitted and < 80% */}
          {isSubmitted && (
            <div
              className={`p-6 rounded-2xl border shadow-sm ${
                (score / QUIZ_QUESTIONS.length) >= 0.8
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-black text-lg">
                    {(score / QUIZ_QUESTIONS.length) >= 0.8 ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        <span>¡Aprobado con Distinción! Calificación: {Math.round((score / QUIZ_QUESTIONS.length) * 100)}% ({score}/20)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 text-rose-600" />
                        <span>Calificación: {Math.round((score / QUIZ_QUESTIONS.length) * 100)}% ({score}/20) — Requiere Repaso</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed max-w-2xl">
                    {(score / QUIZ_QUESTIONS.length) >= 0.8 ? (
                      'Has superado con éxito el estándar del 80%. Tu constancia está disponible.'
                    ) : (
                      'Para acreditar y emitir tu constancia oficial es necesario alcanzar al menos el 80% (16 reactivos correctos). Revisa a continuación la retroalimentación detallada de cada pregunta y vuelve a intentarlo.'
                    )}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleRetakeExam}
                    className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 transition-all shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reintentar Examen</span>
                  </button>

                  {(score / QUIZ_QUESTIONS.length) < 0.8 && (
                    <button
                      onClick={() => onNavigateToStage(0)}
                      className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Repasar Teoría (Etapa 1)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* List of 20 Questions */}
          <div className="space-y-5">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const selectedOption = selectedAnswers[q.id];
              const isCorrect = isSubmitted && selectedOption === q.correctAnswerId;
              const isWrong = isSubmitted && selectedOption && selectedOption !== q.correctAnswerId;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-5 border transition-all ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-rose-300 bg-rose-50/20'
                      : selectedOption
                      ? 'border-blue-200 shadow-xs'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-[11px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded border border-blue-200">
                        Tema {q.category} • {q.topic}
                      </span>
                    </div>

                    {isSubmitted && (
                      <div>
                        {isCorrect ? (
                          <span className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4" /> Correcto (+1)
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-600 font-bold text-xs">
                            <XCircle className="w-4 h-4" /> Incorrecto (0)
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Question Text with KaTeX */}
                  <div className="text-sm font-medium text-slate-900 mb-4 leading-relaxed">
                    <MathView math={q.question} />
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {q.options.map((opt) => {
                      const isOptionSelected = selectedOption === opt.id;
                      const isOptionCorrectAnswer = isSubmitted && opt.id === q.correctAnswerId;

                      let optClasses =
                        'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700';

                      if (isSubmitted) {
                        if (isOptionCorrectAnswer) {
                          optClasses = 'border-emerald-400 bg-emerald-100/80 text-emerald-950 font-medium';
                        } else if (isOptionSelected) {
                          optClasses = 'border-rose-400 bg-rose-100/80 text-rose-950';
                        } else {
                          optClasses = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                        }
                      } else if (isOptionSelected) {
                        optClasses = 'border-blue-600 bg-blue-50 text-blue-900 font-medium ring-1 ring-blue-600';
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt.id)}
                          disabled={isSubmitted}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-all ${optClasses}`}
                        >
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${
                              isOptionSelected
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-slate-600 border-slate-300'
                            }`}
                          >
                            {opt.id}
                          </span>
                          <div className="flex-1 space-y-1">
                            <div>
                              <MathView math={opt.text} />
                            </div>
                            {opt.latex && (
                              <div className="pt-1">
                                <MathView math={opt.latex} block />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation feedback after submit */}
                  {isSubmitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200 text-xs bg-slate-50 p-3.5 rounded-xl space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        <span>Justificación Teórica y Solución:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        <MathView math={q.explanation} />
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Action Bar at bottom */}
          {!isSubmitted && (
            <div className="sticky bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-300 shadow-xl flex items-center justify-between gap-4">
              <div className="text-xs text-slate-600">
                Has contestado{' '}
                <strong className="text-slate-900">
                  {Object.keys(selectedAnswers).length}
                </strong>{' '}
                de <strong>{QUIZ_QUESTIONS.length}</strong> preguntas.
              </div>

              <button
                onClick={handleSubmitExam}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-[1.01] flex items-center gap-2"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Finalizar y Calificar Evaluación</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StageAssessment;
