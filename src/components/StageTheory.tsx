/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import MathView from './MathView';
import { BookOpen, ChevronRight, ShieldAlert } from 'lucide-react';

export const StageTheory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'3.1' | '3.2' | '3.3'>('3.1');

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Etapa 1: Fundamentación Teórica Rigurosa</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Tema 3: Guías de Onda Rectangulares
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-3xl">
              Estudio analítico de estructuras metálicas huecas para confinamiento y guiado de ondas electromagnéticas en frecuencias de microondas y milimétricas.
            </p>
          </div>

          {/* Subtopic Selector Tabs */}
          <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('3.1')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
                activeTab === '3.1'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>3.1</span>
              <span>Ecuaciones y Parámetros</span>
            </button>
            <button
              onClick={() => setActiveTab('3.2')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
                activeTab === '3.2'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>3.2</span>
              <span>Modos TM</span>
            </button>
            <button
              onClick={() => setActiveTab('3.3')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
                activeTab === '3.3'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>3.3</span>
              <span>Modos TE y Modo Dominante</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content for Subtopic 3.1 */}
      {activeTab === '3.1' && (
        <div className="space-y-6">
          {/* Section: Geometry and Reference System */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">
                3.1.1
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Geometría y Sistema de Coordenadas de la Guía Rectangular
              </h3>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed">
              Una guía de onda rectangular consiste en un tubo conductor metálico hueco de sección transversal rectangular uniforme, relleno de un medio dieléctrico caracterizado por permitividad <MathView math="\epsilon = \epsilon_0 \epsilon_r" /> y permeabilidad <MathView math="\mu = \mu_0 \mu_r" />.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-3 text-sm text-slate-700">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Convenciones Geométricas Estándar:</h4>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Dimensión mayor <MathView math="a" /> (ancho):</strong> orientada sobre el eje <MathView math="x" /> en el intervalo <MathView math="0 \le x \le a" />.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Dimensión menor <MathView math="b" /> (alto):</strong> orientada sobre el eje <MathView math="y" /> en el intervalo <MathView math="0 \le y \le b" />.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Regla de diseño:</strong> Por convenio internacional se establece siempre <MathView math="a > b" /> (habitualmente <MathView math="a \approx 2b" />) para maximizar la separación entre el modo fundamental y los modos de orden superior.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Eje de propagación:</strong> El eje <MathView math="+z" /> coincide con la longitud de la guía, con dependencia espacial y temporal de la forma <MathView math="e^{j(\omega t - \beta z)}" />.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <div>
                    <span className="font-bold block mb-1">Condición de Frontera Conductora Perfecta (PEC):</span>
                    <span>
                      En las cuatro paredes metálicas (<MathView math="x=0, a" /> e <MathView math="y=0, b" />), el campo eléctrico tangencial debe anularse idénticamente: <MathView math="\hat{n} \times \vec{E} = 0" />.
                    </span>
                  </div>
                </div>
              </div>

              {/* Vector SVG Diagram of Waveguide */}
              <div className="lg:col-span-5 flex justify-center bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-inner">
                <svg viewBox="0 0 340 220" className="w-full max-w-xs h-auto">
                  {/* Outer Perspective Box */}
                  <polygon points="40,160 180,160 280,70 140,70" fill="rgba(30, 41, 59, 0.7)" stroke="#64748B" strokeWidth="1.5" />
                  <polygon points="40,80 180,80 280,20 140,20" fill="rgba(51, 65, 85, 0.5)" stroke="#64748B" strokeWidth="1.5" />
                  
                  {/* Front Aperture */}
                  <rect x="40" y="80" width="140" height="80" fill="rgba(37, 99, 235, 0.15)" stroke="#38BDF8" strokeWidth="2.5" />
                  
                  {/* Connectors */}
                  <line x1="40" y1="80" x2="140" y2="20" stroke="#64748B" strokeWidth="1.5" />
                  <line x1="180" y1="80" x2="280" y2="20" stroke="#64748B" strokeWidth="1.5" />
                  <line x1="180" y1="160" x2="280" y2="70" stroke="#64748B" strokeWidth="1.5" />

                  {/* Dimensions Annotations */}
                  <line x1="40" y1="175" x2="180" y2="175" stroke="#F59E0B" strokeWidth="1.5" />
                  <polyline points="46,171 40,175 46,179" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
                  <polyline points="174,171 180,175 174,179" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
                  <text x="105" y="195" fill="#F59E0B" fontSize="12" fontWeight="bold" textAnchor="middle">ancho: a (eje x)</text>

                  <line x1="25" y1="80" x2="25" y2="160" stroke="#F59E0B" strokeWidth="1.5" />
                  <polyline points="21,86 25,80 29,86" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
                  <polyline points="21,154 25,160 29,154" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
                  <text x="18" y="125" fill="#F59E0B" fontSize="12" fontWeight="bold" textAnchor="end">alto: b (eje y)</text>

                  <line x1="200" y1="110" x2="270" y2="55" stroke="#10B981" strokeWidth="2.5" />
                  <polygon points="273,53 260,57 266,66" fill="#10B981" />
                  <text x="245" y="45" fill="#10B981" fontSize="11" fontWeight="bold">Propagación +z</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Section: Cutoff Frequency Equation */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">
                3.1.2
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Ecuación General de la Frecuencia de Corte
              </h3>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed">
              La frecuencia de corte <MathView math="f_{c,mn}" /> representa la frecuencia umbral por debajo de la cual el modo particular <MathView math="(m,n)" /> no puede transportar potencia activa y sufre atenuación evanescente:
            </p>

            <MathView block math="f_{c,mn} = \frac{c}{2\sqrt{\mu_r \epsilon_r}} \sqrt{\left(\frac{m}{a}\right)^2 + \left(\frac{n}{b}\right)^2}" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2">Desglose de Parámetros:</h4>
                <ul className="space-y-1.5 text-slate-600">
                  <li><MathView math="c \approx 3 \times 10^8\text{ m/s}" />: Velocidad de la luz en el vacío.</li>
                  <li><MathView math="\epsilon_r, \mu_r" />: Constantes dieléctricas relativas del medio interno.</li>
                  <li><MathView math="m" />: Número de semi-variaciones senoidales de campo a lo largo del ancho <MathView math="a" />.</li>
                  <li><MathView math="n" />: Número de semi-variaciones senoidales a lo largo del alto <MathView math="b" />.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2">Número de Onda de Corte:</h4>
                <p className="text-slate-600">
                  El número de onda transversal de corte <MathView math="k_c" /> se define como:
                </p>
                <MathView block math="k_{c,mn} = \sqrt{ \left(\frac{m\pi}{a}\right)^2 + \left(\frac{n\pi}{b}\right)^2 }" />
              </div>
            </div>
          </div>

          {/* Section: Secondary Parameters (beta, lambda_g, vp, vg, Z) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">
                3.1.3
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Parámetros Secundarios de Propagación
              </h3>
            </div>

            <p className="text-slate-700 text-sm">
              Cuando la frecuencia de excitación supera la de corte (<MathView math="f > f_c" />), la onda se propaga con los siguientes parámetros característicos:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card Beta */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-semibold text-blue-700 text-sm flex items-center justify-between">
                  <span>Constante de Fase</span>
                  <MathView math="\beta" />
                </div>
                <MathView block math="\beta = k \sqrt{1 - \left(\frac{f_c}{f}\right)^2}" />
                <p className="text-xs text-slate-600">
                  Donde <MathView math="k = \omega\sqrt{\mu\epsilon} = 2\pi/\lambda" /> es el número de onda del medio no acotado.
                </p>
              </div>

              {/* Card Lambda g */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-semibold text-blue-700 text-sm flex items-center justify-between">
                  <span>Longitud de Onda en Guía</span>
                  <MathView math="\lambda_g" />
                </div>
                <MathView block math="\lambda_g = \frac{\lambda}{\sqrt{1 - \left(\frac{f_c}{f}\right)^2}} > \lambda" />
                <p className="text-xs text-slate-600">
                  Nótese que <MathView math="\lambda_g" /> es <strong>siempre mayor</strong> que la longitud de onda en espacio libre <MathView math="\lambda" />.
                </p>
              </div>

              {/* Card Phase Velocity */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-semibold text-blue-700 text-sm flex items-center justify-between">
                  <span>Velocidad de Fase</span>
                  <MathView math="v_p" />
                </div>
                <MathView block math="v_p = \frac{u}{\sqrt{1 - \left(\frac{f_c}{f}\right)^2}} > u" />
                <p className="text-xs text-slate-600">
                  La velocidad a la que se desplaza la cresta de fase en el eje <MathView math="z" /> supera la velocidad de la luz en el medio (<MathView math="v_p > u" />).
                </p>
              </div>

              {/* Card Group Velocity */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-semibold text-emerald-700 text-sm flex items-center justify-between">
                  <span>Velocidad de Grupo (Energía)</span>
                  <MathView math="v_g" />
                </div>
                <MathView block math="v_g = u \sqrt{1 - \left(\frac{f_c}{f}\right)^2} < u" />
                <p className="text-xs text-slate-600">
                  Velocidad real de transporte de energía e información. Satisface siempre la relación relativista <MathView math="v_p \cdot v_g = u^2" />.
                </p>
              </div>

              {/* Card Wave Impedance TE */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-semibold text-blue-700 text-sm flex items-center justify-between">
                  <span>Impedancia de Onda TE</span>
                  <MathView math="Z_{TE}" />
                </div>
                <MathView block math="Z_{TE} = \frac{\eta}{\sqrt{1 - \left(\frac{f_c}{f}\right)^2}} > \eta" />
                <p className="text-xs text-slate-600">
                  Para el vacío <MathView math="\eta_0 \approx 377\ \Omega" />. Al acercarse al corte (<MathView math="f \to f_c" />), <MathView math="Z_{TE} \to \infty" />.
                </p>
              </div>

              {/* Card Wave Impedance TM */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-semibold text-blue-700 text-sm flex items-center justify-between">
                  <span>Impedancia de Onda TM</span>
                  <MathView math="Z_{TM}" />
                </div>
                <MathView block math="Z_{TM} = \eta \sqrt{1 - \left(\frac{f_c}{f}\right)^2} < \eta" />
                <p className="text-xs text-slate-600">
                  En los modos TM, la impedancia es siempre menor que la intrínseca <MathView math="\eta" /> y tiende a cero en el corte.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content for Subtopic 3.2 (Modos TM) */}
      {activeTab === '3.2' && (
        <div className="space-y-6">
          {/* TM Definition */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">
                3.2.1
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Definición y Ecuación de Campo en Modos Transversales Magnéticos (TM)
              </h3>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed">
              En los modos <strong>Transversales Magnéticos (TM)</strong>, el vector de campo magnético no posee componente a lo largo del eje de propagación, mientras que el campo eléctrico sí cuenta con una componente longitudinal:
            </p>

            {/* Clean Centered Highlight Box */}
            <div className="flex justify-center my-3">
              <div className="py-2.5 px-8 bg-blue-50/90 border border-blue-200 rounded-xl shadow-xs text-center">
                <MathView math="H_z = 0, \quad E_z \neq 0" className="text-base font-bold text-blue-950" />
              </div>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed">
              Resolviendo la ecuación de onda de Helmholtz bidimensional por el método de separación de variables <MathView math="E_z(x, y) = X(x) Y(y)" /> sujeto a las condiciones de frontera de Dirichlet impuestas por las paredes conductoras ideales:
            </p>

            <MathView block math="E_z(x, y, z) = E_0 \sin\left(\frac{m\pi x}{a}\right) \sin\left(\frac{n\pi y}{b}\right) e^{-j\beta z}" />

            <p className="text-slate-700 text-sm">
              Las componentes transversales restantes se derivan analíticamente aplicando las ecuaciones de Maxwell:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <MathView block math="E_x = -\frac{j\beta}{k_c^2} \left(\frac{m\pi}{a}\right) E_0 \cos\left(\frac{m\pi x}{a}\right) \sin\left(\frac{n\pi y}{b}\right) e^{-j\beta z}" />
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <MathView block math="E_y = -\frac{j\beta}{k_c^2} \left(\frac{n\pi}{b}\right) E_0 \sin\left(\frac{m\pi x}{a}\right) \cos\left(\frac{n\pi y}{b}\right) e^{-j\beta z}" />
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <MathView block math="H_x = \frac{j\omega\epsilon}{k_c^2} \left(\frac{n\pi}{b}\right) E_0 \sin\left(\frac{m\pi x}{a}\right) \cos\left(\frac{n\pi y}{b}\right) e^{-j\beta z}" />
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <MathView block math="H_y = -\frac{j\omega\epsilon}{k_c^2} \left(\frac{m\pi}{a}\right) E_0 \cos\left(\frac{m\pi x}{a}\right) \sin\left(\frac{n\pi y}{b}\right) e^{-j\beta z}" />
              </div>
            </div>
          </div>

          {/* Mathematical Proof: Inexistence of TM00, TM10, TM01 */}
          <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-amber-200">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
              <h3 className="text-lg font-bold text-amber-950">
                3.2.2 Demostración Matemática: ¿Por qué NO existen los modos TM00, TM10 y TM01?
              </h3>
            </div>

            <p className="text-amber-900 text-sm leading-relaxed">
              Examinemos minuciosamente la función potencial del campo eléctrico longitudinal <MathView math="E_z" />:
            </p>

            <MathView block math="E_z(x, y) = E_0 \sin\left(\frac{m\pi x}{a}\right) \sin\left(\frac{n\pi y}{b}\right)" />

            <div className="space-y-3 text-xs sm:text-sm text-amber-950">
              {/* Caso 1 */}
              <div className="p-4 bg-white/90 rounded-xl border border-amber-200 space-y-1.5 shadow-2xs">
                <strong className="text-amber-900 block text-sm font-bold">
                  Caso 1: Si <MathView math="m = 0" />:
                </strong>
                <p className="text-slate-700 text-xs sm:text-sm">
                  Para cualquier valor de <MathView math="n" />, el primer factor senoidal resulta:{' '}
                  <MathView math="\sin\left(\frac{0 \cdot \pi x}{a}\right) = \sin(0) \equiv 0" />.
                  Por tanto, el potencial longitudinal se anula por completo:{' '}
                  <MathView math="E_z(x,y) = E_0 \cdot 0 \cdot \sin\left(\frac{n\pi y}{b}\right) \equiv 0" />{' '}
                  en todos los puntos interiores de la guía.
                </p>
              </div>

              {/* Caso 2 */}
              <div className="p-4 bg-white/90 rounded-xl border border-amber-200 space-y-1.5 shadow-2xs">
                <strong className="text-amber-900 block text-sm font-bold">
                  Caso 2: Si <MathView math="n = 0" />:
                </strong>
                <p className="text-slate-700 text-xs sm:text-sm">
                  Para cualquier valor de <MathView math="m" />, el segundo factor senoidal resulta:{' '}
                  <MathView math="\sin\left(\frac{0 \cdot \pi y}{b}\right) = \sin(0) \equiv 0" />.
                  Por consiguiente, el potencial longitudinal es idénticamente nulo:{' '}
                  <MathView math="E_z(x,y) \equiv 0" /> en toda la sección transversal.
                </p>
              </div>

              {/* Consecuencia Física */}
              <div className="p-4 bg-white/90 rounded-xl border border-amber-200 space-y-2.5 shadow-2xs">
                <strong className="text-amber-900 block text-sm font-bold">
                  Consecuencia Física sobre las Componentes Transversales:
                </strong>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  Si <MathView math="E_z \equiv 0" />, y como por definición propia del modo TM ya se tiene <MathView math="H_z = 0" />, al ser ambas componentes longitudinales nulas simultáneamente, <strong>todas las derivadas espaciales se anulan</strong>, conllevando de inmediato a:
                </p>
                <div className="py-2.5 px-4 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <MathView math="E_x = 0, \quad E_y = 0, \quad H_x = 0, \quad H_y = 0" className="text-sm font-semibold text-slate-800" />
                </div>
                <p className="text-xs text-rose-700 font-medium">
                  ¡No existe ningún campo electromagnético! Esto representa una solución física trivial (onda nula).
                </p>
              </div>
            </div>

            <div className="bg-emerald-100/90 border border-emerald-300 p-4 rounded-xl text-emerald-950 text-xs sm:text-sm font-medium">
              <span className="font-bold">Conclusión Fundamental:</span> Para que un modo TM exista en una guía rectangular metálica, ambos subíndices deben ser estrictamente enteros positivos no nulos:
              <MathView block math="m \ge 1 \quad \text{y} \quad n \ge 1" />
              Por consiguiente, el modo magnético transversal de <strong>menor frecuencia de corte</strong> posible es el <MathView math="TM_{11}" />.
            </div>
          </div>
        </div>
      )}

      {/* Content for Subtopic 3.3 (Modos TE y Modo Dominante TE10) */}
      {activeTab === '3.3' && (
        <div className="space-y-6">
          {/* TE Definition */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">
                3.3.1
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Definición de Modos Transversales Eléctricos (TE)
              </h3>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed">
              En los modos <strong>Transversales Eléctricos (TE)</strong>, el vector de campo eléctrico es enteramente transversal al eje de propagación, de modo que:
            </p>

            {/* Clean Centered Highlight Box */}
            <div className="flex justify-center my-3">
              <div className="py-2.5 px-8 bg-blue-50/90 border border-blue-200 rounded-xl shadow-xs text-center">
                <MathView math="E_z = 0, \quad H_z \neq 0" className="text-base font-bold text-blue-950" />
              </div>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed">
              La componente longitudinal de campo magnético <MathView math="H_z" /> satisface la ecuación de Helmholtz con condiciones de frontera de tipo Neumann (<MathView math="\frac{\partial H_z}{\partial n} = 0" /> en las paredes):
            </p>

            <MathView block math="H_z(x, y, z) = H_0 \cos\left(\frac{m\pi x}{a}\right) \cos\left(\frac{n\pi y}{b}\right) e^{-j\beta z}" />

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              A diferencia de los modos TM, en los modos TE <strong>sí se permite que <MathView math="m=0" /> o <MathView math="n=0" /></strong> de manera individual (debido a que la función coseno evaluada en cero es la unidad: <MathView math="\cos(0) = 1" />). La única restricción es que ambos no pueden ser cero simultáneamente (<MathView math="m=n=0" /> anularía el gradiente transversal).
            </div>
          </div>

          {/* Deep Dive into TE10 Dominant Mode */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md">
                  3.3.2
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Análisis a Fondo del Modo Dominante TE10
                </h3>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded-md border border-emerald-200">
                MODO FUNDAMENTAL
              </span>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed">
              Al ser <MathView math="a > b" />, el modo con la menor frecuencia de corte de toda la guía es el <MathView math="TE_{10}" /> (<MathView math="m=1, n=0" />).
            </p>

            {/* Cutoff frequency for TE10 */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-600 mb-1">
                Frecuencia de corte del modo dominante:
              </div>
              <MathView block math="f_{c,10} = \frac{c}{2a\sqrt{\mu_r \epsilon_r}} = \frac{u}{2a}" />
              <p className="text-xs text-slate-600 mt-2">
                Esta expresión revela que <MathView math="f_{c,10}" /> depende <strong>única y exclusivamente del ancho <MathView math="a" /></strong> y de las propiedades del dieléctrico, siendo completamente independiente de la altura <MathView math="b" />.
              </p>
            </div>

            {/* Field Expressions for TE10 */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-3">
                Componentes de Campo del Modo <MathView math="TE_{10}" />:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-blue-900">Campo Eléctrico Vertical:</div>
                  <MathView block math="E_y = -j \frac{\omega\mu a}{\pi} H_0 \sin\left(\frac{\pi x}{a}\right) e^{-j\beta z}" />
                  <p className="text-[11px] text-blue-800">
                    Máximo en el centro (<MathView math="x = a/2" />) y cero en las paredes laterales (<MathView math="x = 0, a" />).
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-slate-900">Campo Magnético Transversal:</div>
                  <MathView block math="H_x = j \frac{\beta a}{\pi} H_0 \sin\left(\frac{\pi x}{a}\right) e^{-j\beta z}" />
                  <p className="text-[11px] text-slate-600">
                    Proporcional a <MathView math="E_y" /> mediante la relación <MathView math="H_x = -E_y / Z_{TE}" />.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-slate-900">Campo Magnético Longitudinal:</div>
                  <MathView block math="H_z = H_0 \cos\left(\frac{\pi x}{a}\right) e^{-j\beta z}" />
                  <p className="text-[11px] text-slate-600">
                    Cero en el centro (<MathView math="x = a/2" />) y máximo en las paredes laterales.
                  </p>
                </div>
              </div>

              {/* Clean Componentes Nulas Card */}
              <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 text-center flex flex-wrap items-center justify-center gap-2">
                <span className="font-semibold text-slate-600">Componentes Nulas del Modo Dominante TE₁₀:</span>
                <MathView math="E_x = 0, \quad E_z = 0, \quad H_y = 0" className="text-sm font-semibold text-slate-900" />
              </div>
            </div>

            {/* Surface currents and Slots */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex flex-wrap items-center gap-1.5">
                <span>Corrientes Superficiales de Pared (</span>
                <MathView math="\vec{J}_s = \hat{n} \times \vec{H}" />
                <span>) y Ranuras de Radiación</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Las líneas de campo magnético <MathView math="\vec{H}" /> cierran en bucles horizontales en el plano <MathView math="xz" />. Esto induce corrientes eléctricas de conducción en las paredes internas metálicas:
              </p>
              <ul className="text-xs sm:text-sm space-y-1.5 text-slate-700 pl-4 list-disc">
                <li>
                  <strong>Pared ancha superior e inferior (<MathView math="y = b" /> e <MathView math="y = 0" />):</strong> En la línea central <MathView math="x = a/2" />, <MathView math="H_z = 0" />, por lo que las corrientes fluyen <strong>estrictamente longitudinales</strong> en dirección <MathView math="z" />.
                </li>
                <li>
                  <strong>Aplicación práctica en antenas de ranura:</strong> Cortar una ranura longitudinal delgada exactamente en el centro <MathView math="x = a/2" /> de la pared ancha no perturba la corriente y no radia; mientras que desplazar la ranura hacia un lado intercepta corriente transversal e induce radiación eficiente hacia el espacio exterior.
                </li>
              </ul>
            </div>
          </div>

          {/* Standard Waveguides Table (EIA WR standards) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">
              Tabla de Guías de Onda Rectangulares Comerciales Estándar (EIA)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Designación EIA</th>
                    <th className="p-2.5">Banda Frecuencia</th>
                    <th className="p-2.5">Dimensión a (cm)</th>
                    <th className="p-2.5">Dimensión b (cm)</th>
                    <th className="p-2.5">Corte TE10 (GHz)</th>
                    <th className="p-2.5">Rango Monomodo Recomendado (GHz)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold font-mono text-blue-700">WR-284</td>
                    <td className="p-2.5">Banda S</td>
                    <td className="p-2.5 font-mono">7.214</td>
                    <td className="p-2.5 font-mono">3.404</td>
                    <td className="p-2.5 font-mono font-semibold text-slate-900">2.08</td>
                    <td className="p-2.5 font-mono">2.60 – 3.95</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-blue-50/30">
                    <td className="p-2.5 font-bold font-mono text-blue-700">WR-90 (Estándar)</td>
                    <td className="p-2.5 font-semibold text-blue-900">Banda X</td>
                    <td className="p-2.5 font-mono">2.286</td>
                    <td className="p-2.5 font-mono">1.016</td>
                    <td className="p-2.5 font-mono font-semibold text-slate-900">6.56</td>
                    <td className="p-2.5 font-mono font-semibold text-blue-800">8.20 – 12.40</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold font-mono text-blue-700">WR-62</td>
                    <td className="p-2.5">Banda Ku</td>
                    <td className="p-2.5 font-mono">1.580</td>
                    <td className="p-2.5 font-mono">0.790</td>
                    <td className="p-2.5 font-mono font-semibold text-slate-900">9.49</td>
                    <td className="p-2.5 font-mono">12.40 – 18.00</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold font-mono text-blue-700">WR-42</td>
                    <td className="p-2.5">Banda K</td>
                    <td className="p-2.5 font-mono">1.067</td>
                    <td className="p-2.5 font-mono">0.432</td>
                    <td className="p-2.5 font-mono font-semibold text-slate-900">14.05</td>
                    <td className="p-2.5 font-mono">18.00 – 26.50</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold font-mono text-blue-700">WR-28</td>
                    <td className="p-2.5">Banda Ka</td>
                    <td className="p-2.5 font-mono">0.711</td>
                    <td className="p-2.5 font-mono">0.356</td>
                    <td className="p-2.5 font-mono font-semibold text-slate-900">21.08</td>
                    <td className="p-2.5 font-mono">26.50 – 40.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StageTheory;
