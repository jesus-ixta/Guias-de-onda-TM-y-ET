/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI server client if GEMINI_API_KEY is available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Socratic Tutor endpoint
app.post('/api/socratic-chat', async (req, res) => {
  try {
    const { prompt, history } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'El mensaje prompt es requerido' });
    }

    if (!ai) {
      // Fallback handled gracefully by client
      return res.status(503).json({
        fallback: true,
        message: 'No external Gemini API key provided; using local socratic engine',
      });
    }

    const systemInstruction = `Eres un distinguido Profesor Universitario y Diseñador de Experiencias de Aprendizaje experto en Teoría Electromagnética y Guías de Onda Rectangulares (Temas 3.1, 3.2 y 3.3).
Tu rol pedagógico es el de un TUTOR SOCRÁTICO riguroso:
- NUNCA des la respuesta final o la solución numérica directa de inmediato.
- Guía al estudiante mediante preguntas orientadoras, descomposición de fórmulas y analogías físicas vívidas (por ejemplo, ondas planas rebotando en zigzag entre placas metálicas a la velocidad de la luz u, olas del mar en rompeolas para la velocidad de fase vs grupo, etc.).
- Utiliza SIEMPRE notación matemática formal LaTeX entre signos de dólar ($inline$ o $$display$$) para todas las variables y fórmulas (ej. $f_{c,mn}$, $\\beta$, $\\lambda_g$, $v_p$, $v_g$, $Z_{TE}$, $Z_{TM}$, $\\epsilon_r$, $\\mu_r$).
- Enfatiza por qué $TM_{10}$ y $TM_{01}$ no existen debido a que $E_z = 0$ anula todo el campo, por qué $TE_{10}$ es el modo dominante, y la regla $a > b$ (típicamente $a \\approx 2b$).
- Mantén tus respuestas concisas (2 a 3 párrafos), inspiradoras y enfocadas en despertar la curiosidad y el razonamiento del alumno.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || '';

    return res.json({
      reply: replyText,
      suggestions: [
        '¿Podrías profundizar con una analogía física?',
        '¿Cómo compruebo esto en el laboratorio de simulación?',
      ],
    });
  } catch (error: any) {
    console.error('Error in /api/socratic-chat:', error);
    return res.status(500).json({
      error: 'Error procesando consulta socrática',
      fallback: true,
    });
  }
});

// Vite Middleware for development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Waveguides Learning App server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
