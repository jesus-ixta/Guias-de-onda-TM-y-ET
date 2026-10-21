/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import MathView from './MathView';
import {
  MessageSquare,
  Send,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  BookOpenCheck,
  ChevronRight,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'tutor' | 'student';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

const INITIAL_SUGGESTIONS = [
  '¿Por qué no existe el modo TM10?',
  '¿Qué diferencia a la velocidad de fase de la de grupo?',
  '¿Qué pasa si reduzco el ancho a?',
  '¿Por qué TE10 es el modo dominante en una guía rectangular?',
  '¿Cómo viaja la energía en la guía de onda?',
  '¿Por qué se diseña habitualmente con la proporción a ≈ 2b?',
];

// Rich, pedagogically curated Socratic knowledge base for immediate response & fallback
const SOCRATIC_KNOWLEDGE_BASE: Record<
  string,
  {
    response: string;
    followUps: string[];
  }
> = {
  tm10: {
    response:
      '¡Excelente inquietud analítica! Para descubrir por ti mismo la razón, recordemos la función matemática del campo eléctrico longitudinal en modos TM:\n\n$$E_z(x, y) = E_0 \\sin\\left(\\frac{m\\pi x}{a}\\right) \\sin\\left(\\frac{n\\pi y}{b}\\right)$$\n\nAhora reflexiona en estas dos preguntas orientadoras:\n1. Si evaluamos el modo $TM_{10}$, ¿qué valor toma el subíndice $n$?\n2. Si $n = 0$, ¿a qué es igual el término $\\sin\\left(\\frac{0 \\cdot \\pi y}{b}\\right)$ para cualquier punto dentro de la guía?\n\n¿Qué le ocurre entonces al potencial $E_z$ y a todas las componentes de campo $E_x, E_y, H_x, H_y$ que dependen directamente de sus derivadas?',
    followUps: [
      '¿Qué pasaría si tanto m como n fueran cero (TM00)?',
      '¿Cuál es entonces el primer modo TM que sí puede existir físicamente?',
    ],
  },
  velocidad: {
    response:
      'Una de las preguntas más fascinantes de la física electromagnética. Consideremos primero esta analogía física:\n\nImagina una ola del mar que choca en ángulo contra un rompeolas en la costa. El punto de impacto donde rompe la espuma parece correr rapidísimo a lo largo de la pared (incluso más rápido que la propia ola incidente).\n\nEn la guía de onda ocurre algo análogo: la onda confinada puede interpretarse como **dos ondas electromagnéticas planas que viajan rebotando en zigzag** entre las paredes metálicas a la velocidad de la luz $u = c/\\sqrt{\\epsilon_r}$.\n\nCon esto en mente, pregúntate:\n- ¿Hacia dónde se desplaza la energía real: en línea recta hacia adelante, o en trayectoria zigzagueante rebotando en las paredes?\n- Si la velocidad de fase es $v_p = \\frac{u}{\\cos \\theta}$ y la de grupo es $v_g = u \\cos \\theta$, ¿cuál de las dos transporta realmente la información?',
    followUps: [
      '¿Por qué el producto vp · vg es igual al cuadrado de la velocidad de la luz u²?',
      '¿Qué ocurre con vp y vg justo cuando nos acercamos a la frecuencia de corte fc?',
    ],
  },
  ancho: {
    response:
      'Muy buen planteamiento experimental. Examinemos la ecuación de la frecuencia de corte para el modo dominante $TE_{10}$:\n\n$$f_{c,10} = \\frac{c}{2a\\sqrt{\\epsilon_r}}$$\n\nAnalicemos la relación matemática entre el ancho $a$ y la frecuencia $f_c$:\n1. Si el ancho $a$ está en el denominador, al **reducir $a$**, ¿la frecuencia de corte $f_c$ aumenta o disminuye?\n2. Si tu transmisor genera una frecuencia fija de $10\\text{ GHz}$ y reduces $a$ hasta que $f_{c,10}$ suba a $12\\text{ GHz}$, ¿qué le ocurrirá a la señal dentro del tubo?\n\n¿Se propagará libremente o se transformará en una onda evanescente atenuada?',
    followUps: [
      '¿Qué le ocurre a la longitud de onda de corte λc = 2a al reducir el ancho?',
      '¿Afecta la altura b a la frecuencia de corte del modo TE10?',
    ],
  },
  dominante: {
    response:
      'Para comprender por qué el modo $TE_{10}$ se corona como el rey indiscutible de las guías rectangulares, comparemos las fórmulas de corte:\n\n$$f_{c,mn} = \\frac{u}{2} \\sqrt{\\left(\\frac{m}{a}\\right)^2 + \\left(\\frac{n}{b}\\right)^2}$$\n\nRecordando que por convención geométrica siempre se construye $a > b$ (el ancho es mayor que el alto):\n- Si comparamos el modo $TE_{10}$ ($m=1, n=0$) con el modo $TE_{01}$ ($m=0, n=1$), ¿cuál de los dos términos $1/a$ o $1/b$ es menor?\n- Dado que $TM_{10}$ no existe (requiere $m,n \\ge 1$), ¿cuál es el primer modo que puede propagarse conforme incrementamos la frecuencia desde cero?',
    followUps: [
      '¿Por qué es crucial operar la guía únicamente en modo dominante?',
      '¿Qué ventajas tiene evitar que se propaguen modos de orden superior?',
    ],
  },
  proporcion: {
    response:
      '¡Una pregunta clave de diseño de microondas! La proporción clásica casi universal es **$a \\approx 2b$** (como en la guía WR-90 con $a=2.286\\text{ cm}$ y $b=1.016\\text{ cm}$).\n\nPara deducir la razón, calcula mentalmente:\n- Frecuencia del modo dominante: $f_{c,10} = \\frac{u}{2a}$.\n- Frecuencia del siguiente modo $TE_{20}$: $f_{c,20} = \\frac{u}{2(a/2)} = 2 f_{c,10}$.\n- Frecuencia del modo transversal vertical $TE_{01}$: $f_{c,01} = \\frac{u}{2b}$.\n\nSi eliges $b = a/2$, ¿cómo coinciden $f_{c,20}$ y $f_{c,01}$? ¿Qué ancho de banda libre de interferencias multimodo se obtiene entre $f_{c,10}$ y $2 f_{c,10}$?',
    followUps: [
      '¿Qué pasaría si la guía fuera cuadrada con a = b?',
      '¿Por qué una guía cuadrada tendría degeneración de modos TE10 y TE01?',
    ],
  },
  energia: {
    response:
      'El transporte de energía electromagnética está regido por el célebre **Vector de Poynting** instantáneo:\n\n$$\\vec{S} = \\vec{E} \\times \\vec{H}$$\n\nEn el modo dominante $TE_{10}$:\n- El campo eléctrico solo tiene componente vertical: $\\vec{E} = E_y \\hat{y}$.\n- El campo magnético tiene dos componentes: una transversal $H_x \\hat{x}$ y una longitudinal $H_z \\hat{z}$.\n\nSi calculas el producto vectorial:\n$$\\vec{E} \\times \\vec{H} = (E_y \\hat{y}) \\times (H_x \\hat{x} + H_z \\hat{z}) = -E_y H_x \\hat{z} + E_y H_z \\hat{x}$$\n\nObserva bien los dos términos resultantes:\n1. El término en $\\hat{z}$ transporta potencia neta hacia el final de la guía.\n2. ¿Qué crees que representa el término oscilante en $\\hat{x}$ con respecto a las paredes laterales?',
    followUps: [
      '¿Cómo se relaciona la velocidad de grupo vg con el flujo del vector de Poynting?',
      '¿Qué ocurre con el vector de Poynting si la frecuencia cae por debajo del corte (f < fc)?',
    ],
  },
};

export const StageSocraticTutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'tutor',
      text: '¡Hola! Soy tu tutor pedagógico de Teoría Electromagnética para el **Tema 3: Guías de Onda Rectangulares**.\n\nMi propósito es guiarte mediante el método socrático para que construyas tu propio entendimiento a partir de las leyes fundamentales de Maxwell y las condiciones de frontera. No te daré respuestas memorizadas directas, sino preguntas clave, analogías físicas y pistas orientadoras.\n\n¿Qué concepto o fenómeno de las guías de onda te gustaría explorar hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: INITIAL_SUGGESTIONS.slice(0, 3),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'student',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      // Try to query the backend Gemini Socratic API
      const response = await fetch('/api/socratic-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          history: messages.map((m) => ({
            role: m.sender === 'student' ? 'user' : 'model',
            parts: [{ text: m.text }],
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.reply) {
          const tutorMsg: ChatMessage = {
            id: `tutor-${Date.now()}`,
            sender: 'tutor',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestions: data.suggestions || [
              '¿Podrías darme una pista matemática adicional?',
              '¿Cómo se relaciona esto con la simulación del laboratorio?',
            ],
          };
          setMessages((prev) => [...prev, tutorMsg]);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Backend not running or network fallback
    }

    // Fallback: Socratic Reasoning Engine
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      let matchedKey = 'tm10';

      if (lowerQuery.includes('tm') || lowerQuery.includes('tm10') || lowerQuery.includes('tm01') || lowerQuery.includes('tm00')) {
        matchedKey = 'tm10';
      } else if (lowerQuery.includes('velocidad') || lowerQuery.includes('fase') || lowerQuery.includes('grupo') || lowerQuery.includes('vp') || lowerQuery.includes('vg')) {
        matchedKey = 'velocidad';
      } else if (lowerQuery.includes('ancho') || lowerQuery.includes('reduzc') || lowerQuery.includes('dimensión a') || lowerQuery.includes('aumentar')) {
        matchedKey = 'ancho';
      } else if (lowerQuery.includes('dominante') || lowerQuery.includes('te10') || lowerQuery.includes('fundamental') || lowerQuery.includes('primer')) {
        matchedKey = 'dominante';
      } else if (lowerQuery.includes('proporci') || lowerQuery.includes('2b') || lowerQuery.includes('relaci') || lowerQuery.includes('cuadrada')) {
        matchedKey = 'proporcion';
      } else if (lowerQuery.includes('energ') || lowerQuery.includes('potencia') || lowerQuery.includes('poynting') || lowerQuery.includes('viaja')) {
        matchedKey = 'energia';
      } else {
        matchedKey = 'dominante';
      }

      const item = SOCRATIC_KNOWLEDGE_BASE[matchedKey];
      const tutorMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: item.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: item.followUps,
      };

      setMessages((prev) => [...prev, tutorMsg]);
      setIsLoading(false);
    }, 700);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'init-1',
        sender: 'tutor',
        text: 'He reiniciado nuestra sesión de diálogo socrático. ¿Sobre qué aspecto de las guías de onda (ecuaciones de corte, modos TM, modos TE, o propagación de potencia) quisieras reflexionar ahora?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: INITIAL_SUGGESTIONS.slice(0, 3),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Tutor Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Etapa 3: Acompañamiento Cognitivo</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Tutor Socrático de Teoría Electromagnética
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Metodología pedagógica basada en preguntas orientadoras, pistas conceptuales y analogías físicas.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetChat}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors self-start sm:self-auto"
            title="Reiniciar conversación"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Chat</span>
          </button>
        </div>
      </div>

      {/* Main Conversation Window */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col h-[560px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.sender === 'student' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'student'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-indigo-600 text-white shadow-xs'
                }`}
              >
                {msg.sender === 'student' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'student'
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span
                    className={`font-semibold text-[11px] ${
                      msg.sender === 'student' ? 'text-blue-100' : 'text-indigo-700'
                    }`}
                  >
                    {msg.sender === 'student' ? 'Tú (Estudiante)' : 'Tutor Socrático'}
                  </span>
                  <span
                    className={`text-[10px] ${
                      msg.sender === 'student' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {/* Formatted Text with LaTeX */}
                <div className="space-y-2 whitespace-pre-line">
                  <MathView math={msg.text} />
                </div>

                {/* Dynamic Suggestions Buttons */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(sug)}
                        className="text-[11px] bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-lg px-2.5 py-1 text-left transition-colors flex items-center gap-1"
                      >
                        <ChevronRight className="w-3 h-3 text-blue-500 shrink-0" />
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 mr-auto">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-500 ml-1">El tutor está formulando una pista orientadora...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts Bar */}
        <div className="bg-slate-100/90 border-t border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-500 shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Sugerencias:
          </span>
          <div className="flex gap-1.5 shrink-0">
            {INITIAL_SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(sug)}
                className="text-[11px] bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 px-2.5 py-1 rounded-md whitespace-nowrap transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Formula tu pregunta o hipótesis sobre el tema 3 (ej. ¿Qué ocurre con la impedancia en el corte?)..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Preguntar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StageSocraticTutor;
