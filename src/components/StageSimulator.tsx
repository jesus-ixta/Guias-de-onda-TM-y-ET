/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  WaveguideParameters,
  PresetWaveguide,
  DielectricMaterial,
} from '../types/waveguide';
import {
  calculateWaveguideParameters,
  getWaveguideSpectrum,
  WAVEGUIDE_PRESETS,
  DIELECTRIC_PRESETS,
  C_LIGHT_MS,
} from '../utils/waveguideCalculations';
import WaveguideCanvas from './WaveguideCanvas';
import DispersionPlot from './DispersionPlot';
import MathView from './MathView';
import {
  Sliders,
  Settings2,
  FolderOpen,
  Zap,
  Gauge,
  Sparkles,
  Info,
  Maximize2,
  Radio,
  Compass,
} from 'lucide-react';

export const StageSimulator: React.FC = () => {
  // Simulator State
  const [params, setParams] = useState<WaveguideParameters>({
    a: 2.286, // WR-90 standard in cm
    b: 1.016,
    frequency: 10.0, // 10 GHz
    modeType: 'TE',
    m: 1,
    n: 0,
    dielectricName: 'Aire / Vacío (εr = 1.0)',
    er: 1.0,
    ur: 1.0,
  });

  const [selectedPresetId, setSelectedPresetId] = useState<string>('wr90');

  // Calculate live electromagnetic parameters
  const results = useMemo(() => {
    return calculateWaveguideParameters(params);
  }, [params]);

  // Calculate ordered spectrum of candidate modes
  const spectrum = useMemo(() => {
    return getWaveguideSpectrum(
      params.a,
      params.b,
      params.er,
      params.ur,
      params.frequency
    );
  }, [params.a, params.b, params.er, params.ur, params.frequency]);

  // Handle Preset Load
  const handleLoadPreset = (presetId: string) => {
    const preset = WAVEGUIDE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);

    // If preset is cutoff test, choose appropriate mode and lower freq
    if (preset.id === 'case_cutoff') {
      setParams((prev) => ({
        ...prev,
        a: preset.a,
        b: preset.b,
        frequency: preset.defaultFreq,
        modeType: 'TE',
        m: 1,
        n: 0,
        er: 1.0,
        dielectricName: 'Aire / Vacío (εr = 1.0)',
      }));
    } else if (preset.id === 'case_bimodal') {
      setParams((prev) => ({
        ...prev,
        a: preset.a,
        b: preset.b,
        frequency: preset.defaultFreq,
        modeType: 'TE',
        m: 2,
        n: 0,
        er: 1.0,
        dielectricName: 'Aire / Vacío (εr = 1.0)',
      }));
    } else {
      setParams((prev) => ({
        ...prev,
        a: preset.a,
        b: preset.b,
        frequency: preset.defaultFreq,
        modeType: 'TE',
        m: 1,
        n: 0,
        er: 1.0,
        dielectricName: 'Aire / Vacío (εr = 1.0)',
      }));
    }
  };

  // Handle Dielectric change
  const handleDielectricChange = (dielectricId: string) => {
    const mat = DIELECTRIC_PRESETS.find((d) => d.id === dielectricId);
    if (!mat) return;
    setParams((prev) => ({
      ...prev,
      er: mat.er,
      ur: mat.ur,
      dielectricName: mat.name,
    }));
  };

  // Available modes selector list
  const availableModes = [
    { type: 'TE' as const, m: 1, n: 0, label: 'TE₁₀ (Dominante)' },
    { type: 'TE' as const, m: 2, n: 0, label: 'TE₂₀' },
    { type: 'TE' as const, m: 0, n: 1, label: 'TE₀₁' },
    { type: 'TE' as const, m: 1, n: 1, label: 'TE₁₁' },
    { type: 'TM' as const, m: 1, n: 1, label: 'TM₁₁ (Primer modo TM)' },
    { type: 'TM' as const, m: 2, n: 1, label: 'TM₂₁' },
    { type: 'TE' as const, m: 3, n: 0, label: 'TE₃₀' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Preset Selector Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Etapa 2: Laboratorio Virtual Interactivo
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Simulador Dinámico de Guías de Onda Rectangulares
              </h2>
            </div>
          </div>

          {/* Quick Presets Menu */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap flex items-center gap-1">
              <FolderOpen className="w-3.5 h-3.5" /> Casos Rápidos:
            </span>
            <div className="flex gap-1.5">
              {WAVEGUIDE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset.id)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-all ${
                    selectedPresetId === preset.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {preset.name.split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Controls and Adjustments */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Parámetros de Entrada y Modos
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {params.modeType}_{params.m}{params.n}
              </span>
            </div>

            {/* Slider 1: Dimension a (Width) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-medium text-slate-700 flex items-center gap-1">
                  <span>Ancho de la guía (<MathView math="a" />):</span>
                </label>
                <div className="flex items-center gap-1">
                  <span className="font-mono font-bold text-blue-700 text-sm">
                    {params.a.toFixed(2)}
                  </span>
                  <span className="text-slate-500">cm</span>
                </div>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.05"
                value={params.a}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setParams((prev) => ({
                    ...prev,
                    a: val,
                    // keep a >= b constraint logical
                    b: Math.min(prev.b, val * 0.95),
                  }));
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1.0 cm</span>
                <span>Proporción recomendada a ≈ 2b</span>
                <span>10.0 cm</span>
              </div>
            </div>

            {/* Slider 2: Dimension b (Height) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-medium text-slate-700 flex items-center gap-1">
                  <span>Alto de la guía (<MathView math="b" />):</span>
                </label>
                <div className="flex items-center gap-1">
                  <span className="font-mono font-bold text-blue-700 text-sm">
                    {params.b.toFixed(2)}
                  </span>
                  <span className="text-slate-500">cm</span>
                </div>
              </div>
              <input
                type="range"
                min="0.5"
                max={Math.max(0.6, params.a * 0.95)}
                step="0.05"
                value={params.b}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    b: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0.5 cm</span>
                <span>Máx: {(params.a * 0.95).toFixed(2)} cm</span>
              </div>
            </div>

            {/* Slider 3: Operation Frequency f */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-medium text-slate-700 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-blue-600" />
                  <span>Frecuencia de Excitación (<MathView math="f" />):</span>
                </label>
                <div className="flex items-center gap-1">
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    {params.frequency.toFixed(2)}
                  </span>
                  <span className="text-slate-500">GHz</span>
                </div>
              </div>
              <input
                type="range"
                min="1.0"
                max="30.0"
                step="0.1"
                value={params.frequency}
                onChange={(e) =>
                  setParams((prev) => ({
                    ...prev,
                    frequency: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1.0 GHz</span>
                <span>Corte del modo: {results.fc.toFixed(2)} GHz</span>
                <span>30.0 GHz</span>
              </div>
            </div>

            {/* Selector: Propagation Mode */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">
                Modo Electromagnético a Analizar:
              </label>
              <select
                value={`${params.modeType}-${params.m}-${params.n}`}
                onChange={(e) => {
                  const [mType, mStr, nStr] = e.target.value.split('-');
                  setParams((prev) => ({
                    ...prev,
                    modeType: mType as 'TE' | 'TM',
                    m: parseInt(mStr, 10),
                    n: parseInt(nStr, 10),
                  }));
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableModes.map((m) => (
                  <option
                    key={`${m.type}-${m.m}-${m.n}`}
                    value={`${m.type}-${m.m}-${m.n}`}
                  >
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector: Dielectric Material */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">
                Material Dieléctrico Interno:
              </label>
              <select
                value={
                  DIELECTRIC_PRESETS.find((d) => d.er === params.er)?.id || 'air'
                }
                onChange={(e) => handleDielectricChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DIELECTRIC_PRESETS.map((mat) => (
                  <option key={mat.id} value={mat.id}>
                    {mat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Instant Mode Status summary box */}
            <div
              className={`p-3 rounded-xl border text-xs ${
                results.isPropagating
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    results.isPropagating ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                <span>
                  {results.isPropagating
                    ? 'ESTADO: PROPAGACIÓN ACTIVA'
                    : 'ESTADO: CORTE EVANESCENTE'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {results.isPropagating ? (
                  <>
                    La frecuencia operativa (<MathView math="f = " />
                    {params.frequency.toFixed(2)} GHz) supera la frecuencia de
                    corte calculada (<MathView math="f_c = " />
                    {results.fc.toFixed(2)} GHz). La energía se transfiere a lo
                    largo del eje <MathView math="+z" /> con impedancia real.
                  </>
                ) : (
                  <>
                    Frecuencia insuficiente (<MathView math="f = " />
                    {params.frequency.toFixed(2)} GHz &le; <MathView math="f_c = " />
                    {results.fc.toFixed(2)} GHz). El campo decae exponencialmente
                    sin transferir potencia activa (<MathView math="\beta = 0" />, impedancia reactiva).
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Main Simulation Screen */}
        <div className="lg:col-span-7 space-y-4">
          <WaveguideCanvas params={params} results={results} />
        </div>
      </div>

      {/* Bottom Panel: Calculated Metrics & Auxiliary Charts */}
      <div className="space-y-6">
        {/* Metric Cards Row with KaTeX */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Cutoff Frequency */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs space-y-1">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
              <span>Frecuencia de Corte</span>
              <MathView math="f_{c,mn}" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {results.fc.toFixed(3)}{' '}
              <span className="text-xs font-normal text-slate-500">GHz</span>
            </div>
            <div className="text-[11px] text-slate-500">
              <MathView
                math={`\\lambda_c = ${(C_LIGHT_MS / (results.fc * 1e7)).toFixed(2)} \\text{ cm}`}
              />
            </div>
          </div>

          {/* Metric 2: Guide Wavelength */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs space-y-1">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
              <span>Longitud en Guía</span>
              <MathView math="\lambda_g" />
            </div>
            <div className="text-xl font-bold font-mono text-blue-700">
              {results.lambdaG !== null ? (
                <>
                  {results.lambdaG.toFixed(3)}{' '}
                  <span className="text-xs font-normal text-slate-500">cm</span>
                </>
              ) : (
                <span className="text-rose-600 text-sm font-semibold">
                  No aplica (En corte)
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500">
              <MathView
                math={`\\lambda_0 = ${results.lambda0.toFixed(2)} \\text{ cm}`}
              />
            </div>
          </div>

          {/* Metric 3: Wave Impedance */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs space-y-1">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
              <span>Impedancia de Onda</span>
              <MathView
                math={params.modeType === 'TE' ? 'Z_{TE}' : 'Z_{TM}'}
              />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {results.isReactive ? (
                <span className="text-rose-600">
                  {params.modeType === 'TE' ? '+j ' : '-j '}
                  {results.zWave.toFixed(1)}{' '}
                  <span className="text-xs font-normal">Ω</span>
                </span>
              ) : (
                <>
                  {results.zWave.toFixed(1)}{' '}
                  <span className="text-xs font-normal text-slate-500">Ω</span>
                </>
              )}
            </div>
            <div className="text-[11px] text-slate-500">
              <MathView
                math={`\\eta = ${results.eta.toFixed(1)} \\ \\Omega`}
              />
            </div>
          </div>

          {/* Metric 4: Phase Velocity */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs space-y-1">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
              <span>Velocidad de Fase</span>
              <MathView math="v_p" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {results.isPropagating ? (
                <>
                  {(results.vp / 1e8).toFixed(3)}{' '}
                  <span className="text-xs font-normal text-slate-500">
                    ×10⁸ m/s
                  </span>
                </>
              ) : (
                <span className="text-rose-600 text-sm font-semibold">
                  0 (Reactiva)
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500">
              {results.isPropagating ? (
                <MathView
                  math={`v_p / c = ${results.vpRatioC.toFixed(2)} > 1`}
                />
              ) : (
                <MathView
                  math={`\\alpha = ${results.alpha.toFixed(1)} \\text{ Np/m}`}
                />
              )}
            </div>
          </div>
        </div>

        {/* Auxiliary Dispersion Plots */}
        <DispersionPlot
          params={params}
          results={results}
          spectrum={spectrum}
        />
      </div>
    </div>
  );
};

export default StageSimulator;
