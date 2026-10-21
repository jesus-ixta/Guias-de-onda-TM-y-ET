/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Sliders,
  MessageSquareCode,
  GraduationCap,
  Waves,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Layers,
  Radio,
} from 'lucide-react';
import StageTheory from './components/StageTheory';
import StageSimulator from './components/StageSimulator';
import StageSocraticTutor from './components/StageSocraticTutor';
import StageAssessment from './components/StageAssessment';

export default function App() {
  const [activeStage, setActiveStage] = useState<number>(0);

  const STAGES = [
    {
      id: 0,
      number: 'Etapa 1',
      title: 'Módulo Teórico',
      sub: 'Temas 3.1, 3.2 y 3.3',
      icon: BookOpen,
      accent: 'text-blue-600',
    },
    {
      id: 1,
      number: 'Etapa 2',
      title: 'Laboratorio Virtual',
      sub: 'Simulador Dinámico 3D/2D',
      icon: Sliders,
      accent: 'text-emerald-600',
    },
    {
      id: 2,
      number: 'Etapa 3',
      title: 'Tutor Socrático',
      sub: 'Asistente Pedagógico',
      icon: MessageSquareCode,
      accent: 'text-indigo-600',
    },
    {
      id: 3,
      number: 'Etapa 4',
      title: 'Evaluación & Constancia',
      sub: '20 Reactivos (Mín. 80%)',
      icon: GraduationCap,
      accent: 'text-amber-600',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] flex flex-col font-sans">
      {/* Top Main Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Branding Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white flex items-center justify-center shadow-xs">
                <Waves className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    Guías de Onda Rectangulares
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full uppercase">
                    Unidad 3
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden md:block">
                  Teoría Electromagnética • Temas 3.1, 3.2 y 3.3
                </p>
              </div>
            </div>

            {/* Stage Navigation Desktop Tabs */}
            <nav className="hidden lg:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
              {STAGES.map((st) => {
                const Icon = st.icon;
                const isActive = activeStage === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => setActiveStage(st.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? st.accent : 'text-slate-400'}`} />
                    <span>{st.title}</span>
                  </button>
                );
              })}
            </nav>

            {/* Quick Helper Chip */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-lg text-xs font-medium">
                <Radio className="w-3.5 h-3.5 text-emerald-600" />
                <span>Modo Dominante: <strong>TE₁₀</strong></span>
              </div>
            </div>
          </div>

          {/* Mobile Stages Bar */}
          <div className="lg:hidden flex overflow-x-auto py-2 gap-2 border-t border-slate-100 scrollbar-none">
            {STAGES.map((st) => {
              const Icon = st.icon;
              const isActive = activeStage === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setActiveStage(st.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{st.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeStage === 0 && <StageTheory />}
        {activeStage === 1 && <StageSimulator />}
        {activeStage === 2 && <StageSocraticTutor />}
        {activeStage === 3 && (
          <StageAssessment onNavigateToStage={(idx) => setActiveStage(idx)} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/90 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              Teoría Electromagnética
            </span>
            <span>•</span>
            <span>Tema 3: Guías de Onda Rectangulares</span>
            <span>•</span>
            <span className="text-slate-400">Modos TE y TM</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Notación Formal LaTeX (KaTeX)</span>
            <span>•</span>
            <span>Acreditación con Criterio 80%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
