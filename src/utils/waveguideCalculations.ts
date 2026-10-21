/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  WaveguideParameters,
  CalculatedParameters,
  DielectricMaterial,
  PresetWaveguide,
  ModeSpectrumItem,
} from '../types/waveguide';

// Physical constants
export const C_LIGHT = 29.9792458; // cm * GHz (equivalent to 2.99792458e8 m/s)
export const C_LIGHT_MS = 2.99792458e8; // m/s
export const ETA_0 = 376.730313668; // Ohms (vacuum intrinsic impedance)

export const DIELECTRIC_PRESETS: DielectricMaterial[] = [
  {
    id: 'air',
    name: 'Aire / Vacío (εr = 1.0)',
    er: 1.0,
    ur: 1.0,
    lossTangent: 0.0,
    description: 'Dieléctrico estándar para la gran mayoría de guías de microondas de alta potencia y bajas pérdidas.',
  },
  {
    id: 'teflon',
    name: 'Teflón / PTFE (εr = 2.1)',
    er: 2.1,
    ur: 1.0,
    lossTangent: 0.00028,
    description: 'Polímero fluorado de gran estabilidad térmica y muy bajo factor de pérdidas.',
  },
  {
    id: 'polyethylene',
    name: 'Polietileno (εr = 2.25)',
    er: 2.25,
    ur: 1.0,
    lossTangent: 0.0004,
    description: 'Termoplástico utilizado frecuentemente como soporte dieléctrico de bajo costo.',
  },
  {
    id: 'alumina',
    name: 'Alúmina Cerámica (εr = 9.8)',
    er: 9.8,
    ur: 1.0,
    lossTangent: 0.001,
    description: 'Sustrato cerámico denso que reduce drásticamente las dimensiones de corte.',
  },
];

export const WAVEGUIDE_PRESETS: PresetWaveguide[] = [
  {
    id: 'wr90',
    name: 'Banda X Estándar (WR-90)',
    standard: 'EIA WR-90 / IEC R100',
    band: 'Banda X (8.20 – 12.40 GHz)',
    a: 2.286, // 0.900 in
    b: 1.016, // 0.400 in
    recommendedFreqMin: 8.2,
    recommendedFreqMax: 12.4,
    defaultFreq: 10.0,
    description: 'La guía comercial más representativa de radares meteorológicos, militares y telecomunicaciones satelitales.',
    dominantCutoff: 6.557,
  },
  {
    id: 'wr62',
    name: 'Banda Ku Estándar (WR-62)',
    standard: 'EIA WR-62 / IEC R140',
    band: 'Banda Ku (12.40 – 18.00 GHz)',
    a: 1.5799, // 0.622 in
    b: 0.7899, // 0.311 in
    recommendedFreqMin: 12.4,
    recommendedFreqMax: 18.0,
    defaultFreq: 14.5,
    description: 'Empleada en enlaces satelitales direct-to-home (DTH) y radares de control de tiro de alta resolución.',
    dominantCutoff: 9.488,
  },
  {
    id: 'wr284',
    name: 'Banda S de Alta Potencia (WR-284)',
    standard: 'EIA WR-284 / IEC R32',
    band: 'Banda S (2.60 – 3.95 GHz)',
    a: 7.2136, // 2.840 in
    b: 3.4036, // 1.340 in
    recommendedFreqMin: 2.6,
    recommendedFreqMax: 3.95,
    defaultFreq: 3.0,
    description: 'Guía de gran porte para radares de vigilancia aeroportuaria y aceleradores lineales de partículas.',
    dominantCutoff: 2.078,
  },
  {
    id: 'wr42',
    name: 'Banda K Satelital (WR-42)',
    standard: 'EIA WR-42 / IEC R220',
    band: 'Banda K (18.00 – 26.50 GHz)',
    a: 1.0668, // 0.420 in
    b: 0.4318, // 0.170 in
    recommendedFreqMin: 18.0,
    recommendedFreqMax: 26.5,
    defaultFreq: 22.0,
    description: 'Guía compacta para transmisiones de radioenlace y sensores automotrices de onda milimétrica.',
    dominantCutoff: 14.051,
  },
  {
    id: 'case_cutoff',
    name: 'Caso Estudio: Modo en Corte (f < fc)',
    standard: 'Didáctico - Atenuación Evanescente',
    band: 'Régimen No Propagante',
    a: 2.286,
    b: 1.016,
    recommendedFreqMin: 3.0,
    recommendedFreqMax: 6.0,
    defaultFreq: 5.0, // below 6.557 GHz
    description: 'Demuestra la respuesta de la guía cuando la frecuencia es inferior a la de corte: onda reactiva puramente atenuada.',
    dominantCutoff: 6.557,
  },
  {
    id: 'case_bimodal',
    name: 'Caso Estudio: Propagación Multimodo (Bimodal)',
    standard: 'Didáctico - Modos Superiores',
    band: 'Régimen Multimodo Indeseado',
    a: 4.5,
    b: 2.0,
    recommendedFreqMin: 7.0,
    recommendedFreqMax: 12.0,
    defaultFreq: 8.5,
    description: 'Permite observar la propagación simultánea del modo TE10 y del modo TE20, generando interferencia modal.',
    dominantCutoff: 3.331,
  },
];

/**
 * Calculates cutoff frequency fc in GHz
 * fc,mn = (c / 2*sqrt(ur*er)) * sqrt((m/a)^2 + (n/b)^2)
 * a and b in cm, result in GHz
 */
export function calculateCutoffFrequency(
  aCm: number,
  bCm: number,
  m: number,
  n: number,
  er: number = 1.0,
  ur: number = 1.0
): number {
  if (m === 0 && n === 0) return 0;
  const mediumSpeed = C_LIGHT / Math.sqrt(ur * er);
  const geomFactor = Math.sqrt(Math.pow(m / aCm, 2) + Math.pow(n / bCm, 2));
  return 0.5 * mediumSpeed * geomFactor;
}

/**
 * Full calculation of propagation parameters for the selected mode
 */
export function calculateWaveguideParameters(
  params: WaveguideParameters
): CalculatedParameters {
  const { a, b, frequency: f, modeType, m, n, er, ur } = params;

  // Medium velocity in m/s and cm*GHz
  const u_cm_ghz = C_LIGHT / Math.sqrt(ur * er);
  const u_ms = C_LIGHT_MS / Math.sqrt(ur * er);

  // Medium intrinsic impedance
  const eta = ETA_0 * Math.sqrt(ur / er);

  // Cutoff frequency
  const fc = calculateCutoffFrequency(a, b, m, n, er, ur);

  // Free space and medium wavelengths in cm
  const lambda0 = C_LIGHT / f;
  const lambdaMedium = u_cm_ghz / f;

  const ratioF_Fc = fc > 0 ? f / fc : 0;
  const isPropagating = f > fc;

  let lambdaG: number | null = null;
  let beta = 0;
  let alpha = 0;
  let vp = 0;
  let vg = 0;
  let zWave = 0;
  let isReactive = false;

  const omega = 2 * Math.PI * f * 1e9; // rad/s
  const kMedium = (2 * Math.PI * f) / u_cm_ghz * 100; // rad/m

  if (isPropagating) {
    const factor = Math.sqrt(1 - Math.pow(fc / f, 2));
    
    // Guide wavelength (cm)
    lambdaG = lambdaMedium / factor;

    // Phase constant beta (rad/m)
    beta = kMedium * factor;
    alpha = 0;

    // Phase velocity (m/s) vp = u / sqrt(1 - (fc/f)^2)
    vp = u_ms / factor;

    // Group velocity (m/s) vg = u * sqrt(1 - (fc/f)^2)
    vg = u_ms * factor;

    // Wave impedance
    if (modeType === 'TE') {
      zWave = eta / factor;
    } else {
      zWave = eta * factor;
    }
    isReactive = false;
  } else {
    // Cutoff evanescent decay
    const factorCutoff = Math.sqrt(Math.pow(fc / f, 2) - 1);
    lambdaG = null;
    beta = 0;
    
    // Attenuation constant alpha (Np/m)
    alpha = kMedium * factorCutoff;

    // In cutoff, energy does not propagate
    vp = 0;
    vg = 0;

    // Reactive wave impedance:
    // TE: purely inductive +j * (eta / factorCutoff)
    // TM: purely capacitive -j * (eta * factorCutoff)
    if (modeType === 'TE') {
      zWave = eta / factorCutoff;
    } else {
      zWave = eta * factorCutoff;
    }
    isReactive = true;
  }

  return {
    fc,
    lambda0,
    lambdaMedium,
    lambdaG,
    isPropagating,
    ratioF_Fc,
    beta,
    alpha,
    vp,
    vg,
    vpRatioC: vp / C_LIGHT_MS,
    vgRatioC: vg / C_LIGHT_MS,
    zWave,
    isReactive,
    eta,
  };
}

/**
 * Calculates ordered spectrum of first modes for the waveguide dimensions
 */
export function getWaveguideSpectrum(
  aCm: number,
  bCm: number,
  er: number = 1.0,
  ur: number = 1.0,
  currentFreq: number = 10.0
): ModeSpectrumItem[] {
  const modes: ModeSpectrumItem[] = [];

  // Generate candidate modes
  // TE: m>=0, n>=0, but not m=n=0
  for (let m = 0; m <= 3; m++) {
    for (let n = 0; n <= 3; n++) {
      if (m === 0 && n === 0) continue;
      const fc = calculateCutoffFrequency(aCm, bCm, m, n, er, ur);
      modes.push({
        modeName: `TE_{${m}${n}}`,
        modeType: 'TE',
        m,
        n,
        fc,
        isPropagating: currentFreq > fc,
        isDominant: m === 1 && n === 0,
      });
    }
  }

  // TM: m>=1, n>=1
  for (let m = 1; m <= 3; m++) {
    for (let n = 1; n <= 3; n++) {
      const fc = calculateCutoffFrequency(aCm, bCm, m, n, er, ur);
      modes.push({
        modeName: `TM_{${m}${n}}`,
        modeType: 'TM',
        m,
        n,
        fc,
        isPropagating: currentFreq > fc,
        isDominant: false,
      });
    }
  }

  // Sort by cutoff frequency ascending
  modes.sort((a, b) => a.fc - b.fc);

  // Return the first 8 modes
  return modes.slice(0, 8);
}
