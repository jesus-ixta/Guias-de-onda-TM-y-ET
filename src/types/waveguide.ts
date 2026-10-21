/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WaveguideParameters {
  a: number; // width in cm
  b: number; // height in cm
  frequency: number; // in GHz
  modeType: 'TE' | 'TM';
  m: number;
  n: number;
  dielectricName: string;
  er: number; // relative permittivity
  ur: number; // relative permeability (usually 1.0)
}

export interface DielectricMaterial {
  id: string;
  name: string;
  er: number;
  ur: number;
  lossTangent: number;
  description: string;
}

export interface PresetWaveguide {
  id: string;
  name: string;
  standard: string;
  band: string;
  a: number; // cm
  b: number; // cm
  recommendedFreqMin: number; // GHz
  recommendedFreqMax: number; // GHz
  defaultFreq: number; // GHz
  description: string;
  dominantCutoff: number; // GHz (in air)
}

export interface CalculatedParameters {
  fc: number; // Cutoff frequency (GHz)
  lambda0: number; // Free-space wavelength (cm)
  lambdaMedium: number; // Unbounded medium wavelength (cm)
  lambdaG: number | null; // Guide wavelength (cm, null if cutoff)
  isPropagating: boolean; // f > fc
  ratioF_Fc: number; // f / fc
  beta: number; // rad/m (0 if cutoff)
  alpha: number; // Np/m (attenuation if cutoff)
  vp: number; // Phase velocity in m/s
  vg: number; // Group velocity in m/s
  vpRatioC: number; // vp / c
  vgRatioC: number; // vg / c
  zWave: number; // Wave impedance in Ohms (or magnitude if reactive)
  isReactive: boolean;
  eta: number; // Intrinsic impedance of medium (Ohms)
}

export interface ModeSpectrumItem {
  modeName: string;
  modeType: 'TE' | 'TM';
  m: number;
  n: number;
  fc: number; // GHz
  isPropagating: boolean;
  isDominant: boolean;
}

export interface QuizQuestion {
  id: number;
  category: '3.1' | '3.2' | '3.3';
  topic: string;
  question: string;
  options: {
    id: string;
    text: string;
    latex?: string;
  }[];
  correctAnswerId: string;
  explanation: string;
}

export interface CertificateData {
  studentName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  folio: string;
  verificationHash: string;
}
