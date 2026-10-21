/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { WaveguideParameters, CalculatedParameters } from '../types/waveguide';
import { Play, Pause, RotateCcw, Eye, Compass, Waves } from 'lucide-react';
import MathView from './MathView';

interface WaveguideCanvasProps {
  params: WaveguideParameters;
  results: CalculatedParameters;
}

type ViewMode = 'isometric' | 'transverse' | 'longitudinal';

export const WaveguideCanvas: React.FC<WaveguideCanvasProps> = ({
  params,
  results,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1.0);
  const [viewMode, setViewMode] = useState<ViewMode>('isometric');
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const timeRef = useRef<number>(0);
  const animFrameId = useRef<number | null>(null);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const dt = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        // Increment phase based on frequency and speed
        timeRef.current += dt * speed * 4.0;
      }

      drawScene(ctx, canvas.width, canvas.height, timeRef.current);
      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [params, results, isPlaying, speed, viewMode, showVectors]);

  // Handle high-DPI canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }
    });
    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, []);

  const drawScene = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number
  ) => {
    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0F172A');
    bgGrad.addColorStop(1, '#1E293B');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    if (viewMode === 'isometric') {
      drawIsometricView(ctx, width, height, time);
    } else if (viewMode === 'transverse') {
      drawTransverseView(ctx, width, height, time);
    } else {
      drawLongitudinalView(ctx, width, height, time);
    }

    ctx.restore();
  };

  /**
   * Evaluates electric field Ey or Ez for the chosen mode at normalized (xNorm in [0,1], yNorm in [0,1], zNorm in [0,1])
   */
  const evaluateField = (
    xNorm: number,
    yNorm: number,
    zNorm: number,
    time: number
  ) => {
    const { m, n, modeType } = params;
    const { isPropagating, lambdaG, lambdaMedium, alpha } = results;

    let spatialFactor = 0;
    if (modeType === 'TE') {
      // For TE10: Ey = sin(pi * x / a)
      // Generic: Ey proportional to sin(m*pi*x/a)*cos(n*pi*y/b)
      if (m > 0 && n === 0) {
        spatialFactor = Math.sin(m * Math.PI * xNorm);
      } else if (m === 0 && n > 0) {
        spatialFactor = Math.sin(n * Math.PI * yNorm);
      } else {
        spatialFactor =
          Math.sin(m * Math.PI * xNorm) * Math.cos(n * Math.PI * yNorm);
      }
    } else {
      // TM modes: Ez = sin(m*pi*x/a) * sin(n*pi*y/b)
      spatialFactor =
        Math.sin(m * Math.PI * xNorm) * Math.sin(n * Math.PI * yNorm);
    }

    if (isPropagating) {
      // Propagating wave: e^(j*(wt - beta*z))
      // Normalized guide wavelength along length
      const effectivePeriods = 3.0;
      const phase = time - zNorm * (effectivePeriods * 2 * Math.PI);
      return spatialFactor * Math.cos(phase);
    } else {
      // Evanescent cutoff: exponential decay e^(-alpha * z) * cos(wt)
      const decay = Math.exp(-zNorm * 5.5);
      return spatialFactor * decay * Math.cos(time);
    }
  };

  /**
   * 3D Isometric Projection
   */
  const drawIsometricView = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    time: number
  ) => {
    const originX = w * 0.22;
    const originY = h * 0.65;

    // Aspect ratio representation
    const aspect = Math.max(0.3, Math.min(params.b / params.a, 0.8));
    const guideWidth = w * 0.32;
    const guideHeight = guideWidth * aspect;
    const guideLength = w * 0.48;

    // Angles: X-axis horizontal-ish right, Y-axis vertical up, Z-axis receding up-right
    const angleZ = -Math.PI / 6; // 30 degrees up-right
    const cosZ = Math.cos(angleZ);
    const sinZ = Math.sin(angleZ);

    const project = (xNorm: number, yNorm: number, zNorm: number) => {
      // x: along width [0, 1]
      // y: along height [0, 1]
      // z: along length [0, 1]
      const px = originX + xNorm * guideWidth + zNorm * guideLength * cosZ;
      const py =
        originY - yNorm * guideHeight + zNorm * guideLength * sinZ;
      return { x: px, y: py };
    };

    // Draw metallic guide wireframe (Back faces)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 1.5;

    // Back bottom line
    const p000 = project(0, 0, 0);
    const p100 = project(1, 0, 0);
    const p010 = project(0, 1, 0);
    const p110 = project(1, 1, 0);

    const p001 = project(0, 0, 1);
    const p101 = project(1, 0, 1);
    const p011 = project(0, 1, 1);
    const p111 = project(1, 1, 1);

    // Fill Guide Bottom/Top Interior
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.beginPath();
    ctx.moveTo(p000.x, p000.y);
    ctx.lineTo(p100.x, p100.y);
    ctx.lineTo(p101.x, p101.y);
    ctx.lineTo(p001.x, p001.y);
    ctx.closePath();
    ctx.fill();

    // Draw Internal Wave Mesh slices along z
    const zSlices = 36;
    const xSamples = 16;

    for (let zi = 0; zi < zSlices - 1; zi++) {
      const z0 = zi / zSlices;
      const z1 = (zi + 1) / zSlices;

      for (let xi = 0; xi < xSamples; xi++) {
        const x0 = xi / xSamples;
        const x1 = (xi + 1) / xSamples;

        const val0 = evaluateField((x0 + x1) / 2, 0.5, z0, time);
        const val1 = evaluateField((x0 + x1) / 2, 0.5, z1, time);
        const avgVal = (val0 + val1) / 2;

        const pA = project(x0, 0.5, z0);
        const pB = project(x1, 0.5, z0);
        const pC = project(x1, 0.5, z1);
        const pD = project(x0, 0.5, z1);

        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.lineTo(pC.x, pC.y);
        ctx.lineTo(pD.x, pD.y);
        ctx.closePath();

        // Color mapped to field amplitude
        if (results.isPropagating) {
          if (avgVal > 0) {
            const alpha = Math.min(0.9, Math.abs(avgVal) * 0.85 + 0.05);
            ctx.fillStyle = `rgba(37, 99, 235, ${alpha})`; // Blue
          } else {
            const alpha = Math.min(0.9, Math.abs(avgVal) * 0.85 + 0.05);
            ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`; // Mint green
          }
        } else {
          // Evanescent cutoff glow: Red decaying
          const alpha = Math.min(0.95, Math.abs(avgVal) * 0.9);
          ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
        }
        ctx.fill();
      }
    }

    // Draw field arrows on several transversal slices if toggled
    if (showVectors) {
      const arrowZSlices = [0.15, 0.45, 0.75];
      for (const zNorm of arrowZSlices) {
        for (let xi = 0.15; xi <= 0.85; xi += 0.18) {
          const fieldE = evaluateField(xi, 0.5, zNorm, time);
          if (Math.abs(fieldE) > 0.08) {
            const baseY = 0.5 - fieldE * 0.38;
            const targetY = 0.5 + fieldE * 0.38;
            const pStart = project(xi, Math.max(0.05, Math.min(0.95, baseY)), zNorm);
            const pEnd = project(xi, Math.max(0.05, Math.min(0.95, targetY)), zNorm);

            ctx.beginPath();
            ctx.moveTo(pStart.x, pStart.y);
            ctx.lineTo(pEnd.x, pEnd.y);
            ctx.strokeStyle = fieldE > 0 ? '#38BDF8' : '#34D399';
            ctx.lineWidth = 2.0;
            ctx.stroke();

            // Arrow head
            const arrowAngle = Math.atan2(pEnd.y - pStart.y, pEnd.x - pStart.x);
            const headLen = 6;
            ctx.beginPath();
            ctx.moveTo(pEnd.x, pEnd.y);
            ctx.lineTo(
              pEnd.x - headLen * Math.cos(arrowAngle - Math.PI / 6),
              pEnd.y - headLen * Math.sin(arrowAngle - Math.PI / 6)
            );
            ctx.lineTo(
              pEnd.x - headLen * Math.cos(arrowAngle + Math.PI / 6),
              pEnd.y - headLen * Math.sin(arrowAngle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fillStyle = fieldE > 0 ? '#38BDF8' : '#34D399';
            ctx.fill();
          }
        }
      }
    }

    // Outer Metallic Guide Edges (Front/Golden border)
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2.5;

    // Front aperture (z=0)
    ctx.strokeRect(p000.x, p010.y, guideWidth, guideHeight);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.fillRect(p000.x, p010.y, guideWidth, guideHeight);

    // Connecting longitudinal edges
    ctx.beginPath();
    ctx.moveTo(p000.x, p000.y);
    ctx.lineTo(p001.x, p001.y);
    ctx.moveTo(p100.x, p100.y);
    ctx.lineTo(p101.x, p101.y);
    ctx.moveTo(p010.x, p010.y);
    ctx.lineTo(p011.x, p011.y);
    ctx.moveTo(p110.x, p110.y);
    ctx.lineTo(p111.x, p111.y);

    // Back aperture (z=1)
    ctx.moveTo(p001.x, p001.y);
    ctx.lineTo(p101.x, p101.y);
    ctx.lineTo(p111.x, p111.y);
    ctx.lineTo(p011.x, p011.y);
    ctx.closePath();
    ctx.stroke();

    // Axis Labels & Dimension Indicators
    ctx.font = '600 13px Inter, sans-serif';
    ctx.fillStyle = '#CBD5E1';

    // Width 'a' label
    ctx.fillText(`a = ${params.a.toFixed(2)} cm`, p000.x + guideWidth * 0.35, p000.y + 24);
    // Height 'b' label
    ctx.fillText(`b = ${params.b.toFixed(2)} cm`, p000.x - 70, p000.y - guideHeight * 0.45);
    // Axis propagation direction 'z'
    ctx.fillStyle = '#38BDF8';
    ctx.fillText('Dirección de Propagación (+z)', p001.x + 10, p001.y - 12);

    // Draw arrow for +z
    ctx.beginPath();
    ctx.moveTo(p001.x, p001.y);
    ctx.lineTo(p001.x + 35 * cosZ, p001.y + 35 * sinZ);
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Cutoff status overlay tag in canvas
    if (!results.isPropagating) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
      ctx.strokeStyle = '#FCA5A5';
      ctx.lineWidth = 1;
      const badgeW = 260;
      const badgeH = 34;
      const bx = w - badgeW - 20;
      const by = 20;
      ctx.beginPath();
      ctx.roundRect(bx, by, badgeW, badgeH, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('⚠ ATENUACIÓN EVANESCENTE (f ≤ fc)', bx + 16, by + 21);
    }
  };

  /**
   * Transverse Cross-Section View (XY Plane)
   */
  const drawTransverseView = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    time: number
  ) => {
    const boxW = Math.min(w * 0.65, 420);
    const aspect = Math.max(0.3, Math.min(params.b / params.a, 0.85));
    const boxH = boxW * aspect;

    const startX = (w - boxW) / 2;
    const startY = (h - boxH) / 2;

    // Field colormap inside aperture
    const cols = 40;
    const rows = 20;
    const cellW = boxW / cols;
    const cellH = boxH / rows;

    for (let c = 0; c < cols; c++) {
      const xNorm = (c + 0.5) / cols;
      for (let r = 0; r < rows; r++) {
        const yNorm = (rows - 1 - r + 0.5) / rows;
        const val = evaluateField(xNorm, yNorm, 0.2, time);

        if (results.isPropagating) {
          const absVal = Math.abs(val);
          if (val >= 0) {
            ctx.fillStyle = `rgba(37, 99, 235, ${absVal * 0.9})`;
          } else {
            ctx.fillStyle = `rgba(16, 185, 129, ${absVal * 0.9})`;
          }
        } else {
          ctx.fillStyle = `rgba(239, 68, 68, ${Math.abs(val) * 0.85})`;
        }
        ctx.fillRect(startX + c * cellW, startY + r * cellH, cellW + 1, cellH + 1);
      }
    }

    // Vector Field Quiver (Arrows)
    if (showVectors) {
      const vCols = 10;
      const vRows = 6;
      for (let vc = 0; vc < vCols; vc++) {
        const xN = (vc + 0.5) / vCols;
        for (let vr = 0; vr < vRows; vr++) {
          const yN = (vr + 0.5) / vRows;
          const val = evaluateField(xN, yN, 0.2, time);

          if (Math.abs(val) > 0.05) {
            const cx = startX + xN * boxW;
            const cy = startY + (1 - yN) * boxH;
            const arrowLen = val * (cellH * 1.8);

            ctx.beginPath();
            ctx.moveTo(cx, cy - arrowLen / 2);
            ctx.lineTo(cx, cy + arrowLen / 2);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Head
            const head = 4;
            const dir = Math.sign(arrowLen);
            ctx.beginPath();
            ctx.moveTo(cx, cy + arrowLen / 2);
            ctx.lineTo(cx - 3, cy + arrowLen / 2 - head * dir);
            ctx.lineTo(cx + 3, cy + arrowLen / 2 - head * dir);
            ctx.closePath();
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
          }
        }
      }
    }

    // Guide Metallic Boundaries (PEC walls)
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 4;
    ctx.strokeRect(startX, startY, boxW, boxH);

    // Wall PEC Labels
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '500 12px Inter, sans-serif';
    ctx.fillText('Pared metálica conductora (PEC, Et = 0)', startX, startY - 10);
    ctx.fillText(`x = 0`, startX - 35, startY + boxH + 18);
    ctx.fillText(`x = a (${params.a.toFixed(2)} cm)`, startX + boxW - 50, startY + boxH + 18);
    ctx.fillText(`y = b (${params.b.toFixed(2)} cm)`, startX - 90, startY + 14);
    ctx.fillText(`y = 0`, startX - 35, startY + boxH);

    // Title info in canvas
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText(`Corte Transversal XY - Modo ${params.modeType}${params.m}${params.n}`, 24, 30);
  };

  /**
   * Longitudinal Slice View (Along z)
   */
  const drawLongitudinalView = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    time: number
  ) => {
    const boxW = w * 0.75;
    const boxH = Math.min(h * 0.45, 180);
    const startX = (w - boxW) / 2;
    const startY = (h - boxH) / 2;

    const zCols = 80;
    const yRows = 16;
    const cellW = boxW / zCols;
    const cellH = boxH / yRows;

    for (let c = 0; c < zCols; c++) {
      const zNorm = c / zCols;
      for (let r = 0; r < yRows; r++) {
        const yNorm = (yRows - 1 - r + 0.5) / yRows;
        // Evaluate at center of width (x = a/2 -> xNorm = 0.5)
        const val = evaluateField(0.5, yNorm, zNorm, time);

        if (results.isPropagating) {
          const absVal = Math.abs(val);
          if (val >= 0) {
            ctx.fillStyle = `rgba(37, 99, 235, ${absVal * 0.9})`;
          } else {
            ctx.fillStyle = `rgba(16, 185, 129, ${absVal * 0.9})`;
          }
        } else {
          ctx.fillStyle = `rgba(239, 68, 68, ${Math.abs(val) * 0.85})`;
        }
        ctx.fillRect(startX + c * cellW, startY + r * cellH, cellW + 1, cellH + 1);
      }
    }

    // Guide Boundary
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 3;
    ctx.strokeRect(startX, startY, boxW, boxH);

    // Longitudinal Guide Wavelength annotation if propagating
    if (results.isPropagating && results.lambdaG) {
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      const lineY = startY + boxH + 24;
      const markerZ0 = startX + boxW * 0.15;
      const markerZ1 = markerZ0 + boxW * (1 / 3.0); // 1 period

      ctx.beginPath();
      ctx.moveTo(markerZ0, lineY - 6);
      ctx.lineTo(markerZ0, lineY + 6);
      ctx.moveTo(markerZ0, lineY);
      ctx.lineTo(markerZ1, lineY);
      ctx.moveTo(markerZ1, lineY - 6);
      ctx.lineTo(markerZ1, lineY + 6);
      ctx.stroke();

      ctx.fillStyle = '#F59E0B';
      ctx.font = '600 12px Inter, sans-serif';
      ctx.fillText(`λg = ${results.lambdaG.toFixed(2)} cm`, (markerZ0 + markerZ1) / 2 - 40, lineY + 18);
    }

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '500 12px Inter, sans-serif';
    ctx.fillText('z = 0 (Entrada de señal)', startX, startY - 12);
    ctx.fillText('z → +∞ (Eje longitudinal)', startX + boxW - 140, startY - 12);
  };

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-700/60 flex flex-col">
      {/* Canvas Top Bar */}
      <div className="bg-slate-800/90 border-b border-slate-700/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Waves className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-white text-sm">
            Visualizador Dinámico de Campo
          </span>
          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">
            {params.modeType}_{params.m}{params.n}
          </span>
        </div>

        {/* View Mode Selector Tabs */}
        <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => setViewMode('isometric')}
            className={`px-3 py-1 rounded-md transition-colors ${
              viewMode === 'isometric'
                ? 'bg-blue-600 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Vista 3D Isométrica
          </button>
          <button
            onClick={() => setViewMode('transverse')}
            className={`px-3 py-1 rounded-md transition-colors ${
              viewMode === 'transverse'
                ? 'bg-blue-600 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Corte Transversal (XY)
          </button>
          <button
            onClick={() => setViewMode('longitudinal')}
            className={`px-3 py-1 rounded-md transition-colors ${
              viewMode === 'longitudinal'
                ? 'bg-blue-600 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Corte Longitudinal (Z)
          </button>
        </div>

        {/* Playback & View Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowVectors(!showVectors)}
            className={`p-1.5 rounded-md text-xs flex items-center gap-1 border transition-colors ${
              showVectors
                ? 'bg-blue-950/60 text-blue-300 border-blue-500/50'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Alternar flechas vectoriales de campo"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vectores</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-white text-xs flex items-center gap-1 transition-colors"
            title={isPlaying ? 'Pausar simulación' : 'Reanudar simulación'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Play className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </button>

          <button
            onClick={() => {
              timeRef.current = 0;
            }}
            className="p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs transition-colors"
            title="Reiniciar fase temporal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1 ml-1 text-xs text-slate-400">
            <span>Velocidad:</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              aria-label="Velocidad de simulación"
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded px-1.5 py-0.5 text-xs focus:outline-none"
            >
              <option value="0.25">0.25x</option>
              <option value="0.5">0.5x</option>
              <option value="1.0">1.0x</option>
              <option value="2.0">2.0x</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-950">
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-crosshair"
        />

        {/* Status Indicator Floating Bar */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {results.isPropagating ? (
            <div className="flex items-center gap-2 bg-emerald-950/85 text-emerald-300 border border-emerald-500/50 px-3 py-1.5 rounded-lg shadow-md backdrop-blur-xs text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>PROPAGACIÓN PERMITIDA</span>
              <span className="text-emerald-400/80 font-mono text-[11px]">
                (f &gt; fc)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-rose-950/85 text-rose-300 border border-rose-500/50 px-3 py-1.5 rounded-lg shadow-md backdrop-blur-xs text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>MODO EN CORTE / ATENUACIÓN</span>
              <span className="text-rose-400/80 font-mono text-[11px]">
                (f ≤ fc)
              </span>
            </div>
          )}
        </div>

        {/* Colormap Legend */}
        <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-700/80 rounded-md p-2 text-[11px] text-slate-300 flex items-center gap-3 backdrop-blur-xs">
          <span className="text-slate-400 font-medium">Amplitud Campo:</span>
          {results.isPropagating ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-xs bg-emerald-500" />
                <span>+E</span>
              </div>
              <div className="w-12 h-2.5 rounded bg-linear-to-r from-emerald-500 via-slate-800 to-blue-600" />
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-xs bg-blue-600" />
                <span>-E</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-rose-400">
              <span className="w-3 h-3 rounded-xs bg-rose-600" />
              <span>Atenuación exponencial e^(-αz)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaveguideCanvas;
