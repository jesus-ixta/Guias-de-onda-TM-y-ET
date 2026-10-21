/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WaveguideParameters, CalculatedParameters, ModeSpectrumItem } from '../types/waveguide';
import MathView from './MathView';
import { LineChart, Activity, Layers, Info } from 'lucide-react';
import { C_LIGHT_MS } from '../utils/waveguideCalculations';

interface DispersionPlotProps {
  params: WaveguideParameters;
  results: CalculatedParameters;
  spectrum: ModeSpectrumItem[];
}

export const DispersionPlot: React.FC<DispersionPlotProps> = ({
  params,
  results,
  spectrum,
}) => {
  const [activeChart, setActiveChart] = useState<'beta' | 'velocities' | 'spectrum'>('beta');

  const { fc, isPropagating, beta } = results;
  const currentF = params.frequency;

  // Render SVG for Freq vs Beta
  const renderBetaChart = () => {
    const fMax = Math.max(fc * 2.5, currentF * 1.5, 20);
    const w = 500;
    const h = 240;
    const padding = { top: 20, right: 30, bottom: 40, left: 60 };
    const plotW = w - padding.left - padding.right;
    const plotH = h - padding.top - padding.bottom;

    // Generate curve points
    const points: { f: number; beta: number }[] = [];
    const steps = 60;
    const fStart = fc;
    const betaMaxCalc =
      (2 * Math.PI * fMax * 1e9 / (C_LIGHT_MS / Math.sqrt(params.er))) *
      Math.sqrt(1 - Math.pow(fc / fMax, 2));

    for (let i = 0; i <= steps; i++) {
      const fVal = fStart + (i / steps) * (fMax - fStart);
      const bVal =
        (2 * Math.PI * fVal * 1e9 / (C_LIGHT_MS / Math.sqrt(params.er))) *
        Math.sqrt(Math.max(0, 1 - Math.pow(fc / fVal, 2)));
      points.push({ f: fVal, beta: bVal });
    }

    const scaleX = (b: number) => padding.left + (b / (betaMaxCalc * 1.1)) * plotW;
    const scaleY = (f: number) => padding.top + plotH - (f / fMax) * plotH;

    // SVG path string for dispersion curve
    const pathD = points
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${scaleX(p.beta).toFixed(1)} ${scaleY(p.f).toFixed(1)}`)
      .join(' ');

    // Free space light line (beta0 = omega / u)
    const lightLineStart = { beta: 0, f: 0 };
    const lightLineEnd = {
      beta: (2 * Math.PI * fMax * 1e9 / (C_LIGHT_MS / Math.sqrt(params.er))),
      f: fMax,
    };

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto text-slate-600">
        {/* Grid and Axes */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + plotH}
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />
        <line
          x1={padding.left}
          y1={padding.top + plotH}
          x2={padding.left + plotW}
          y2={padding.top + plotH}
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />

        {/* Cutoff frequency horizontal dashed marker */}
        <line
          x1={padding.left}
          y1={scaleY(fc)}
          x2={padding.left + plotW}
          y2={scaleY(fc)}
          stroke="#EF4444"
          strokeDasharray="4 4"
          strokeWidth="1.5"
        />
        <text
          x={padding.left + 8}
          y={scaleY(fc) - 6}
          fill="#DC2626"
          fontSize="11"
          fontWeight="600"
        >
          fc = {fc.toFixed(2)} GHz (Corte)
        </text>

        {/* Free space asymptote line (Light line) */}
        <line
          x1={scaleX(lightLineStart.beta)}
          y1={scaleY(lightLineStart.f)}
          x2={scaleX(lightLineEnd.beta)}
          y2={scaleY(lightLineEnd.f)}
          stroke="#94A3B8"
          strokeDasharray="2 3"
          strokeWidth="1.2"
        />
        <text
          x={padding.left + plotW - 90}
          y={scaleY(fMax * 0.95)}
          fill="#64748B"
          fontSize="10"
        >
          Línea de luz (Medio no acotado)
        </text>

        {/* Waveguide Dispersion Hyperbola Path */}
        <path d={pathD} fill="none" stroke="#2563EB" strokeWidth="2.5" />

        {/* Cutoff region shading */}
        <rect
          x={padding.left}
          y={scaleY(fc)}
          width={plotW}
          height={scaleY(0) - scaleY(fc)}
          fill="#FEE2E2"
          opacity="0.35"
        />
        <text
          x={padding.left + plotW * 0.4}
          y={scaleY(fc * 0.5)}
          fill="#991B1B"
          fontSize="11"
          fontWeight="500"
        >
          Zona en Corte (β = 0, atenuación e^-αz)
        </text>

        {/* Operating Point */}
        {isPropagating && (
          <g>
            <circle
              cx={scaleX(beta)}
              cy={scaleY(currentF)}
              r="5"
              fill="#10B981"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <text
              x={scaleX(beta) + 8}
              y={scaleY(currentF) - 6}
              fill="#065F46"
              fontSize="11"
              fontWeight="bold"
            >
              Operación: {currentF.toFixed(2)} GHz
            </text>
          </g>
        )}

        {/* Axis Labels */}
        <text
          x={padding.left + plotW / 2}
          y={h - 10}
          textAnchor="middle"
          fill="#334155"
          fontSize="12"
          fontWeight="500"
        >
          Constante de Fase β (rad/m)
        </text>
        <text
          transform={`rotate(-90 ${16} ${padding.top + plotH / 2})`}
          x={16}
          y={padding.top + plotH / 2}
          textAnchor="middle"
          fill="#334155"
          fontSize="12"
          fontWeight="500"
        >
          Frecuencia f (GHz)
        </text>
      </svg>
    );
  };

  // Render SVG for Phase Velocity vs Group Velocity
  const renderVelocitiesChart = () => {
    const fMax = Math.max(fc * 3.0, currentF * 1.5, 20);
    const w = 500;
    const h = 240;
    const padding = { top: 25, right: 30, bottom: 40, left: 60 };
    const plotW = w - padding.left - padding.right;
    const plotH = h - padding.top - padding.bottom;

    const u = C_LIGHT_MS / Math.sqrt(params.er);
    const steps = 60;
    const vpPoints: { f: number; vNorm: number }[] = [];
    const vgPoints: { f: number; vNorm: number }[] = [];

    // Evaluate from just above fc (1.02*fc) to fMax
    for (let i = 1; i <= steps; i++) {
      const fVal = fc * (1 + (i / steps) * (fMax / fc - 1));
      const factor = Math.sqrt(1 - Math.pow(fc / fVal, 2));
      const vpNorm = 1 / factor; // vp / u
      const vgNorm = factor; // vg / u
      vpPoints.push({ f: fVal, vNorm: Math.min(vpNorm, 3.5) });
      vgPoints.push({ f: fVal, vNorm: vgNorm });
    }

    const scaleX = (f: number) => padding.left + ((f - fc) / (fMax - fc)) * plotW;
    const scaleY = (vNorm: number) => padding.top + plotH - (vNorm / 3.5) * plotH;

    const pathVp = vpPoints
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${scaleX(p.f).toFixed(1)} ${scaleY(p.vNorm).toFixed(1)}`)
      .join(' ');

    const pathVg = vgPoints
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${scaleX(p.f).toFixed(1)} ${scaleY(p.vNorm).toFixed(1)}`)
      .join(' ');

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto text-slate-600">
        {/* Grid and Axes */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + plotH}
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />
        <line
          x1={padding.left}
          y1={padding.top + plotH}
          x2={padding.left + plotW}
          y2={padding.top + plotH}
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />

        {/* u line (v / u = 1.0) */}
        <line
          x1={padding.left}
          y1={scaleY(1.0)}
          x2={padding.left + plotW}
          y2={scaleY(1.0)}
          stroke="#64748B"
          strokeDasharray="4 4"
          strokeWidth="1.5"
        />
        <text
          x={padding.left + plotW - 140}
          y={scaleY(1.0) - 6}
          fill="#475569"
          fontSize="10"
          fontWeight="500"
        >
          u = c / √(εr) (Velocidad en medio)
        </text>

        {/* Phase Velocity Curve (vp > u) */}
        <path d={pathVp} fill="none" stroke="#2563EB" strokeWidth="2.5" />
        {/* Group Velocity Curve (vg < u) */}
        <path d={pathVg} fill="none" stroke="#10B981" strokeWidth="2.5" />

        {/* Curve Labels */}
        <text
          x={padding.left + plotW * 0.25}
          y={scaleY(2.1)}
          fill="#1D4ED8"
          fontSize="11"
          fontWeight="bold"
        >
          vp &gt; u (Velocidad de Fase)
        </text>
        <text
          x={padding.left + plotW * 0.45}
          y={scaleY(0.7)}
          fill="#047857"
          fontSize="11"
          fontWeight="bold"
        >
          vg &lt; u (Velocidad de Grupo / Energía)
        </text>

        {/* Condition vp * vg = u^2 */}
        <rect
          x={padding.left + 10}
          y={padding.top + 8}
          width={150}
          height={26}
          rx="4"
          fill="#F8FAFC"
          stroke="#E2E8F0"
        />
        <text
          x={padding.left + 16}
          y={padding.top + 24}
          fill="#0F172A"
          fontSize="10"
          fontFamily="monospace"
        >
          vp · vg = u² = c² / (εr·μr)
        </text>

        {/* Current frequency line if propagating */}
        {isPropagating && currentF <= fMax && (
          <line
            x1={scaleX(currentF)}
            y1={padding.top}
            x2={scaleX(currentF)}
            y2={padding.top + plotH}
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
        )}

        {/* Axis Labels */}
        <text
          x={padding.left + plotW / 2}
          y={h - 10}
          textAnchor="middle"
          fill="#334155"
          fontSize="12"
          fontWeight="500"
        >
          Frecuencia f (GHz)
        </text>
        <text
          transform={`rotate(-90 ${16} ${padding.top + plotH / 2})`}
          x={16}
          y={padding.top + plotH / 2}
          textAnchor="middle"
          fill="#334155"
          fontSize="12"
          fontWeight="500"
        >
          Razón de Velocidad (v / u)
        </text>
      </svg>
    );
  };

  // Render Mode Spectrum Map
  const renderSpectrumChart = () => {
    return (
      <div className="space-y-3 p-2">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>Distribución espectral de frecuencias de corte (Primeros modos):</span>
          <span className="flex items-center gap-1 text-blue-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Frecuencia actual: {currentF.toFixed(2)} GHz
          </span>
        </div>

        <div className="relative pt-6 pb-4">
          {/* Frequency Axis Line */}
          <div className="w-full h-1.5 bg-slate-200 rounded-full relative">
            {/* Operating frequency needle */}
            {spectrum.length > 0 && (
              <div
                className="absolute -top-3 bottom-0 w-0.5 bg-blue-600 z-20 flex flex-col items-center"
                style={{
                  left: `${Math.min(96, Math.max(4, (currentF / (spectrum[spectrum.length - 1].fc * 1.2)) * 100))}%`,
                }}
              >
                <div className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-xs -mt-1.5" />
                <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1 py-0.5 rounded border border-blue-200 mt-3 whitespace-nowrap">
                  f = {currentF.toFixed(2)} GHz
                </span>
              </div>
            )}
          </div>

          {/* Mode Markers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-8">
            {spectrum.map((m, idx) => {
              const isPassed = currentF > m.fc;
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs transition-all ${
                    isPassed
                      ? m.isDominant
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                        : 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-500 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="font-mono text-sm">
                      {m.modeType === 'TE' ? 'TE' : 'TM'}{m.m}{m.n}
                    </span>
                    {m.isDominant && (
                      <span className="text-[9px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                        DOMINANTE
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono">
                    fc = {m.fc.toFixed(2)} GHz
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[10px]">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isPassed ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                    <span>{isPassed ? 'Propagando' : 'En corte'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monomode Bandwidth explanation */}
        {spectrum.length >= 2 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Banda de Operación Monomodo Recomendada:</span>{' '}
              Para evitar dispersión modal indeseada, se opera exclusivamente entre{' '}
              <span className="font-mono font-bold">1.25·fc,10 ({ (spectrum[0].fc * 1.25).toFixed(2) } GHz)</span> y{' '}
              <span className="font-mono font-bold">0.95·fc,segundo ({ (spectrum[1].fc * 0.95).toFixed(2) } GHz)</span>.
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4">
      {/* Chart Switcher Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-slate-800 text-sm">
            Análisis Gráfico Auxiliar de Dispersión
          </h3>
        </div>

        <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveChart('beta')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeChart === 'beta'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Frecuencia vs Constante β
          </button>
          <button
            onClick={() => setActiveChart('velocities')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeChart === 'velocities'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Velocidades (vp y vg) vs f
          </button>
          <button
            onClick={() => setActiveChart('spectrum')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeChart === 'spectrum'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Espectro de Modos
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full">
        {activeChart === 'beta' && renderBetaChart()}
        {activeChart === 'velocities' && renderVelocitiesChart()}
        {activeChart === 'spectrum' && renderSpectrumChart()}
      </div>
    </div>
  );
};

export default DispersionPlot;
