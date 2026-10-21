/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuizQuestion } from '../types/waveguide';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: '3.1',
    topic: 'Ecuación de Frecuencia de Corte',
    question:
      '¿Cuál es la expresión analítica exacta para calcular la frecuencia de corte $f_{c,mn}$ de un modo en una guía de onda rectangular de dimensiones $a$ y $b$ rellena con un dieléctrico $(\\mu_r, \\epsilon_r)$?',
    options: [
      {
        id: 'A',
        text: 'Ecuación estándar de corte',
        latex: 'f_{c,mn} = \\frac{c}{2\\sqrt{\\mu_r \\epsilon_r}} \\sqrt{\\left(\\frac{m}{a}\\right)^2 + \\left(\\frac{n}{b}\\right)^2}',
      },
      {
        id: 'B',
        text: 'Ecuación con producto de dimensiones',
        latex: 'f_{c,mn} = \\frac{c}{2\\pi \\sqrt{\\mu_r \\epsilon_r}} \\left(\\frac{m}{a} + \\frac{n}{b}\\right)',
      },
      {
        id: 'C',
        text: 'Ecuación sin raíz cuadrática',
        latex: 'f_{c,mn} = \\frac{c}{\\sqrt{\\mu_r \\epsilon_r}} \\sqrt{\\frac{m^2 + n^2}{a^2 - b^2}}',
      },
      {
        id: 'D',
        text: 'Ecuación inversa',
        latex: 'f_{c,mn} = \\frac{2c}{\\sqrt{\\mu_r \\epsilon_r}} \\sqrt{\\frac{a^2}{m} + \\frac{b^2}{n}}',
      },
    ],
    correctAnswerId: 'A',
    explanation:
      'La solución de la ecuación de Helmholtz con las condiciones de frontera transversales impone números de onda propios $k_x = m\\pi/a$ y $k_y = n\\pi/b$. El número de corte es $k_c = \\sqrt{k_x^2 + k_y^2}$, lo cual genera $f_{c,mn} = \\frac{u}{2\\pi} k_c = \\frac{c}{2\\sqrt{\\mu_r \\epsilon_r}} \\sqrt{(m/a)^2 + (n/b)^2}$.',
  },
  {
    id: 2,
    category: '3.2',
    topic: 'Inexistencia de Modos TM con índices nulos',
    question:
      '¿Por qué razón física y matemática los modos $TM_{10}$ y $TM_{01}$ no pueden existir en una guía de onda rectangular metálica?',
    options: [
      {
        id: 'A',
        text: 'Porque el campo longitudinal $E_z \\propto \\sin(m\\pi x/a)\\sin(n\\pi y/b)$ se anula idénticamente si $m=0$ o $n=0$, anulando todo el campo electromagnético.',
      },
      {
        id: 'B',
        text: 'Porque la impedancia de onda del modo TM se vuelve infinita.',
      },
      {
        id: 'C',
        text: 'Porque las paredes metálicas no soportan corrientes superficiales longitudinales.',
      },
      {
        id: 'D',
        text: 'Porque la constante de permeabilidad relativa $\\mu_r$ siempre debe ser mayor a 1.',
      },
    ],
    correctAnswerId: 'A',
    explanation:
      'Para modos TM, la condición de frontera Dirichlet exige que $E_z = 0$ en las 4 paredes. La solución es $E_z = E_0 \\sin(m\\pi x/a)\\sin(n\\pi y/b)$. Si $m=0$ o $n=0$, $\\sin(0)=0$ hace $E_z \\equiv 0$. Y como en TM ya $H_z = 0$, todos los campos se anulan por completo (solución trivial). Por ello, estrictamente $m \\ge 1$ y $n \\ge 1$.',
  },
  {
    id: 3,
    category: '3.1',
    topic: 'Cálculo Numérico de Corte TE10',
    question:
      'Para una guía comercial WR-90 estándar rellena de aire con ancho $a = 2.286\\text{ cm}$ y alto $b = 1.016\\text{ cm}$, ¿cuál es la frecuencia de corte teórica de su modo dominante $TE_{10}$?',
    options: [
      { id: 'A', text: '$f_{c,10} \\approx 6.557\\text{ GHz}$' },
      { id: 'B', text: '$f_{c,10} \\approx 10.000\\text{ GHz}$' },
      { id: 'C', text: '$f_{c,10} \\approx 14.763\\text{ GHz}$' },
      { id: 'D', text: '$f_{c,10} \\approx 3.278\\text{ GHz}$' },
    ],
    correctAnswerId: 'A',
    explanation:
      'Aplicando $f_{c,10} = \\frac{c}{2a} = \\frac{29.979\\text{ cm}\\cdot\\text{GHz}}{2 \\times 2.286\\text{ cm}} \\approx 6.557\\text{ GHz}$. Por debajo de 6.56 GHz, la guía WR-90 en aire no propaga.',
  },
  {
    id: 4,
    category: '3.3',
    topic: 'Definición de Modo Dominante',
    question:
      '¿Qué se entiende formalmente por "modo dominante" o "modo fundamental" en una guía de onda?',
    options: [
      {
        id: 'A',
        text: 'El modo que posee la frecuencia de corte más baja de todos los posibles ($f_c$ mínima).',
      },
      {
        id: 'B',
        text: 'El modo que transporta la mayor cantidad de potencia sin disipación térmica.',
      },
      {
        id: 'C',
        text: 'Aquel modo que tiene la impedancia de onda exactamente igual a $50\\ \\Omega$.',
      },
      {
        id: 'D',
        text: 'Cualquier modo donde el campo eléctrico no posea armónicos espaciales.',
      },
    ],
    correctAnswerId: 'A',
    explanation:
      'El modo dominante es, por definición en teoría electromagnética, aquel que presenta la frecuencia de corte más baja. En guías rectangulares con $a > b$, dicho modo es siempre el $TE_{10}$.',
  },
  {
    id: 5,
    category: '3.1',
    topic: 'Relación de Velocidades de Fase y Grupo',
    question:
      'En el régimen de propagación activa ($f > f_c$), ¿qué relación fundamental cumplen la velocidad de fase $v_p$, la velocidad de grupo $v_g$ y la velocidad de la luz en el medio $u$?',
    options: [
      { id: 'A', text: '$v_p \\cdot v_g = u^2 = \\frac{c^2}{\\mu_r \\epsilon_r}$' },
      { id: 'B', text: '$v_p + v_g = 2u$' },
      { id: 'C', text: '$v_p / v_g = 1$' },
      { id: 'D', text: '$v_p^2 + v_g^2 = u^2$' },
    ],
    correctAnswerId: 'A',
    explanation:
      'Como $v_p = \\frac{u}{\\sqrt{1-(f_c/f)^2}}$ y $v_g = u\\sqrt{1-(f_c/f)^2}$, el producto directo es $v_p \\cdot v_g = u^2$. Dado que $v_g < u$, necesariamente $v_p > u$.',
  },
  {
    id: 6,
    category: '3.1',
    topic: 'Velocidad de Fase Superior a c',
    question:
      '¿Por qué el hecho de que la velocidad de fase en la guía sea mayor que la velocidad de la luz ($v_p > c$) NO viola la Teoría de la Relatividad Especial?',
    options: [
      {
        id: 'A',
        text: 'Porque la velocidad de fase es solo la velocidad aparente del frente de fase geométrico; la información y la energía viajan a la velocidad de grupo $v_g < c$.',
      },
      {
        id: 'B',
        text: 'Porque las paredes de la guía están construidas de metales superconductores.',
      },
      {
        id: 'C',
        text: 'Porque las ecuaciones de Maxwell no son relativistas.',
      },
      {
        id: 'D',
        text: 'Porque el campo magnético contrarresta el efecto relativista del campo eléctrico.',
      },
    ],
    correctAnswerId: 'A',
    explanation:
      'La relatividad especial restringe la velocidad con la que se transmite masa, energía o información modulada. En la guía, la información viaja a la velocidad de grupo $v_g = c\\sqrt{1-(f_c/f)^2} < c$. La velocidad de fase $v_p$ solo mide la intersección de dos frentes de onda planos que rebotan.',
  },
  {
    id: 7,
    category: '3.1',
    topic: 'Longitud de Onda en la Guía',
    question:
      '¿Cómo se compara la longitud de onda dentro de la guía ($\\lambda_g$) con la longitud de onda en espacio libre no acotado ($\\lambda$) cuando la onda se propaga?',
    options: [
      { id: 'A', text: '$\\lambda_g > \\lambda$' },
      { id: 'B', text: '$\\lambda_g < \\lambda$' },
      { id: 'C', text: '$\\lambda_g = \\lambda$' },
      { id: 'D', text: '$\\lambda_g = \\lambda / 2$' },
    ],
    correctAnswerId: 'A',
    explanation:
      'La longitud de onda en la guía viene dada por $\\lambda_g = \\frac{\\lambda}{\\sqrt{1-(f_c/f)^2}}$. Como el denominador es un número menor a 1 (para $f > f_c$), $\\lambda_g$ es estrictamente mayor que $\\lambda$. Al aproximarse al corte ($f \\to f_c$), $\\lambda_g \\to \\infty$.',
  },
  {
    id: 8,
    category: '3.1',
    topic: 'Impedancia de Onda TE en el Corte',
    question:
      '¿Qué le ocurre a la impedancia de onda del modo $TE$ ($Z_{TE}$) cuando la frecuencia de operación $f$ se aproxima por arriba a la frecuencia de corte ($f \\to f_c^+$)?',
    options: [
      { id: 'A', text: 'Tiende a infinito ($Z_{TE} \\to \\infty$).' },
      { id: 'B', text: 'Tiende a cero ($Z_{TE} \\to 0$).' },
      { id: 'C', text: 'Permanece constante e igual a $377\\ \\Omega$.' },
      { id: 'D', text: 'Se vuelve puramente resistiva de $50\\ \\Omega$.' },
    ],
    correctAnswerId: 'A',
    explanation:
      'La impedancia del modo TE es $Z_{TE} = \\frac{\\eta}{\\sqrt{1-(f_c/f)^2}}$. Cuando $f \\to f_c$, el denominador tiende a 0, haciendo que la impedancia tienda a infinito ($Z_{TE} \\to \\infty$). En cambio, para modos TM, $Z_{TM} \\to 0$.',
  },
  {
    id: 9,
    category: '3.2',
    topic: 'Condiciones de Frontera en Conductor Eléctrico Perfecto',
    question:
      'En las paredes metálicas de una guía ideal considerada Conductor Eléctrico Perfecto (PEC), ¿cuál es la condición de frontera que debe satisfacer el campo eléctrico?',
    options: [
      { id: 'A', text: 'El campo eléctrico tangencial debe ser idénticamente cero: $\\hat{n} \\times \\vec{E} = 0$.' },
      { id: 'B', text: 'El campo eléctrico normal debe ser nulo: $\\hat{n} \\cdot \\vec{E} = 0$.' },
      { id: 'C', text: 'El campo magnético tangencial debe ser cero en todo instante.' },
      { id: 'D', text: 'La derivada del campo eléctrico tangencial debe ser infinita.' },
    ],
    correctAnswerId: 'A',
    explanation:
      'En cualquier superficie conductora ideal, cualquier campo eléctrico tangencial movería cargas libres instantáneamente hasta anular la componente tangencial. Por ello, la componente tangencial en la superficie es cero: $E_t = 0$.',
  },
  {
    id: 10,
    category: '3.3',
    topic: 'Antenas de Ranura y Corrientes Superficiales en TE10',
    question:
      'En el modo $TE_{10}$, ¿en qué posición de la pared ancha ($y=b$) una ranura longitudinal delgada NO interrumpe corrientes superficiales y por ende no radia energía al exterior?',
    options: [
      { id: 'A', text: 'Exactamente sobre la línea central longitudinal $x = a/2$.' },
      { id: 'B', text: 'En la esquina lateral izquierda $x = 0$.' },
      { id: 'C', text: 'A una distancia de un cuarto del ancho $x = a/4$.' },
      { id: 'D', text: 'Cualquier ranura siempre radia la misma potencia sin importar su ubicación.' },
    ],
    correctAnswerId: 'A',
    explanation:
      'En la pared ancha, la densidad de corriente es $\\vec{J}_s = \\hat{n} \\times \\vec{H} = -\\hat{y} \\times (H_x \\hat{x} + H_z \\hat{z}) = -H_z \\hat{x} + H_x \\hat{z}$. Dado que $H_z \\propto \\cos(\\pi x/a)$, en el centro $x = a/2$ se tiene $H_z = 0$, por lo que la corriente es puramente longitudinal en $z$. Una ranura longitudinal en $x = a/2$ es paralela al flujo de corriente y no interrumpe ninguna línea de corriente.',
  },
  {
    id: 11,
    category: '3.1',
    topic: 'Efecto de Relleno Dieléctrico',
    question:
      'Si se rellena por completo una guía de onda con un dieléctrico homogéneo no magnético de permitividad relativa $\\epsilon_r = 4$, ¿cómo cambia la frecuencia de corte $f_c$ con respecto al caso en aire?',
    options: [
      { id: 'A', text: 'Se reduce a la mitad: $f_{c,\\text{diel}} = f_{c,\\text{aire}} / 2$.' },
      { id: 'B', text: 'Se reduce a la cuarta parte: $f_{c,\\text{diel}} = f_{c,\\text{aire}} / 4$.' },
      { id: 'C', text: 'Se duplica: $f_{c,\\text{diel}} = 2 f_{c,\\text{aire}}$.' },
      { id: 'D', text: 'Permanece idéntica, porque las dimensiones físicas $a$ y $b$ no cambiaron.' },
    ],
    correctAnswerId: 'A',
    explanation:
      'La velocidad en el medio es $u = c / \\sqrt{\\epsilon_r} = c / \\sqrt{4} = c / 2$. Como la frecuencia de corte es proporcional a $u$, $f_c$ disminuye en un factor de $\\sqrt{\\epsilon_r} = 2$. Esto permite fabricar guías más compactas para la misma frecuencia de operación.',
  },
  {
    id: 12,
    category: '3.2',
    topic: 'Inexistencia de Modos TEM en Guías de un Solo Conductor',
    question:
      '¿Por qué una guía de onda metálica rectangular hueca no puede soportar el modo Transversal Electromagnético (TEM)?',
    options: [
      {
        id: 'A',
        text: 'Porque para un modo TEM ($E_z = 0, H_z = 0$) en una región simplemente conexa rodeada por un solo conductor, las leyes electrostáticas exigen potencial constante y campo transversal nulo en el interior.',
      },
      {
        id: 'B',
        text: 'Porque el modo TEM requiere dimensiones transversales infinitas.',
      },
      {
        id: 'C',
        text: 'Porque el modo TEM solo puede existir en corriente continua (DC).',
      },
      {
        id: 'D',
        text: 'Porque la impedancia de un modo TEM sería puramente compleja en cualquier frecuencia.',
      },
    ],
    correctAnswerId: 'A',
    explanation:
      'El modo TEM obedece a la ecuación de Laplace en la sección transversal $\\nabla_t^2 \\Phi = 0$. En un único conductor cerrado que se encuentra a un potencial equipotencial uniforme, el teorema del valor extremo estipula que $\\Phi = \\text{cte}$ en todo el interior, lo que conlleva a $\\vec{E}_t = -\\nabla_t \\Phi = 0$. Los modos TEM requieren al menos dos conductores aislados (como el cable coaxial o la línea bifilar).',
  },
  {
    id: 13,
    category: '3.1',
    topic: 'Régimen en Corte y Onda Evanescente',
    question:
      'Cuando se excita una guía con una frecuencia inferior a la de corte ($f < f_c$), ¿cuál es el comportamiento físico del campo electromagnético a lo largo del eje $z$?',
    options: [
      {
        id: 'A',
        text: 'El campo sufre decaimiento exponencial espacial $\\propto e^{-\\alpha z}$ sin transportar potencia activa neta (onda reactiva evanescente).',
      },
      {
        id: 'B',
        text: 'El campo oscila normalmente pero a una velocidad de fase igual a cero.',
      },
      {
        id: 'C',
        text: 'La onda se refleja y amplifica progresivamente su amplitud.',
      },
      {
        id: 'D',
        text: 'La guía entra en resonancia destructiva con corriente infinita en las paredes.',
      },
    ],
    correctAnswerId: 'A',
    explanation:
      'Para $f < f_c$, la constante de propagación $\\gamma = \\sqrt{k_c^2 - k^2} = \\alpha$ es real positiva. El campo decae como $e^{-\\alpha z}$. La constante de fase es cero ($\\beta = 0$), lo que significa que no hay onda viajera, y la impedancia es puramente reactiva: no hay potencia activa transmitida.',
  },
  {
    id: 14,
    category: '3.3',
    topic: 'Diferencia Clave entre Modos TE y TM',
    question:
      '¿Cuál es la distinción formal en cuanto a las componentes longitudinales de campo entre los modos TE y TM?',
    options: [
      { id: 'A', text: 'Modo TE: $E_z = 0, H_z \\neq 0$; Modo TM: $H_z = 0, E_z \\neq 0$.' },
      { id: 'B', text: 'Modo TE: $E_z \\neq 0, H_z = 0$; Modo TM: $H_z \\neq 0, E_z = 0$.' },
      { id: 'C', text: 'Modo TE: $E_x = 0$; Modo TM: $E_y = 0$.' },
      { id: 'D', text: 'Modo TE: ambos campos son longitudinales; Modo TM: ambos son transversales.' },
    ],
    correctAnswerId: 'A',
    explanation:
      'Por definición: Transversal Eléctrico (TE) significa que el campo eléctrico es puramente transversal al eje de propagación ($E_z = 0$). Transversal Magnético (TM) significa que el campo magnético es puramente transversal ($H_z = 0$).',
  },
  {
    id: 15,
    category: '3.1',
    topic: 'Ancho de Banda Monomodo y Proporción a ≈ 2b',
    question:
      '¿Por qué en ingeniería de microondas se prefiere diseñar guías rectangulares con una relación de aspecto $a \\approx 2b$?',
    options: [
      {
        id: 'A',
        text: 'Porque maximiza el ancho de banda útil monomodo entre el corte del modo $TE_{10}$ y los modos siguientes ($TE_{20}$ y $TE_{01}$), evitando degeneración modal.',
      },
      {
        id: 'B',
        text: 'Porque minimiza el peso del metal en un factor de $1/4$.',
      },
      {
        id: 'C',
        text: 'Porque elimina la necesidad de soldar las tapas de la guía.',
      },
      {
        id: 'D',
        text: 'Porque hace que la velocidad de fase sea exactamente igual a $c$.',
      },
    ],
    correctAnswerId: 'A',
    explanation:
      'Si $a = 2b$, entonces $f_{c,20} = 2 f_{c,10}$ y $f_{c,01} = \\frac{u}{2b} = \\frac{u}{a} = 2 f_{c,10}$. Esto otorga un ancho de banda teórico de 2:1 donde únicamente puede existir el modo $TE_{10}$, evitando que coexistan múltiples modos con diferentes velocidades que deformarían las señales transmitidas.',
  },
  {
    id: 16,
    category: '3.3',
    topic: 'Frecuencia de Corte del Modo TE20',
    question:
      'Para una guía rectangular con $a = 4\\text{ cm}$ y $b = 2\\text{ cm}$ en vacío, ¿cuál es la frecuencia de corte del modo $TE_{20}$?',
    options: [
      { id: 'A', text: '$f_{c,20} = 7.50\\text{ GHz}$' },
      { id: 'B', text: '$f_{c,20} = 3.75\\text{ GHz}$' },
      { id: 'C', text: '$f_{c,20} = 15.00\\text{ GHz}$' },
      { id: 'D', text: '$f_{c,20} = 5.30\\text{ GHz}$' },
    ],
    correctAnswerId: 'A',
    explanation:
      'Para el modo $TE_{20}$, $m=2, n=0$. Entonces $f_{c,20} = \\frac{c}{2} \\sqrt{(2/a)^2 + 0} = \\frac{c}{a} = \\frac{29.98\\text{ cm}\\cdot\\text{GHz}}{4\\text{ cm}} \\approx 7.50\\text{ GHz}$. Nótese que es exactamente el doble de $f_{c,10} = 3.75\\text{ GHz}$.',
  },
  {
    id: 17,
    category: '3.2',
    topic: 'Frecuencia de Corte del Modo TM11',
    question:
      'En una guía rectangular con $a = 3\\text{ cm}$ y $b = 1.5\\text{ cm}$ en aire, ¿cuál es la frecuencia de corte del primer modo TM ($TM_{11}$)?',
    options: [
      { id: 'A', text: '$f_{c,TM11} \\approx 11.17\\text{ GHz}$' },
      { id: 'B', text: '$f_{c,TM11} \\approx 5.00\\text{ GHz}$' },
      { id: 'C', text: '$f_{c,TM11} \\approx 10.00\\text{ GHz}$' },
      { id: 'D', text: '$f_{c,TM11} \\approx 20.00\\text{ GHz}$' },
    ],
    correctAnswerId: 'A',
    explanation:
      'Calculando: $(1/a)^2 = (1/3)^2 = 0.1111$, $(1/b)^2 = (1/1.5)^2 = 0.4444$. La suma es $0.5555$, y su raíz es $0.74535\\text{ cm}^{-1}$. Multiplicando por $c/2 = 14.99\\text{ cm}\\cdot\\text{GHz}$, obtenemos $f_{c,11} = 14.99 \\times 0.74535 \\approx 11.17\\text{ GHz}$.',
  },
  {
    id: 18,
    category: '3.1',
    topic: 'Naturaleza de la Impedancia en Corte',
    question:
      '¿Qué tipo de impedancia de onda presenta el modo $TE$ cuando opera en la zona de corte evanescente ($f < f_c$)?',
    options: [
      { id: 'A', text: 'Impedancia puramente reactiva inductiva ($+j X$).' },
      { id: 'B', text: 'Impedancia puramente reactiva capacitiva ($-j X$).' },
      { id: 'C', text: 'Impedancia puramente resistiva real.' },
      { id: 'D', text: 'Impedancia nula ($0\\ \\Omega$).' },
    ],
    correctAnswerId: 'A',
    explanation:
      'Para el modo TE, $Z_{TE} = \\frac{\\eta}{\\sqrt{1-(f_c/f)^2}} = \\frac{\\eta}{-j \\sqrt{(f_c/f)^2 - 1}} = +j \\frac{\\eta}{\\sqrt{(f_c/f)^2 - 1}}$. Al ser un número imaginario positivo ($+j$), es una reactancia puramente inductiva.',
  },
  {
    id: 19,
    category: '3.3',
    topic: 'Componentes de Campo del Modo Fundamental TE10',
    question:
      'En el modo fundamental $TE_{10}$, ¿cuál es la orientación espacial exclusiva del vector de campo eléctrico $\\vec{E}$?',
    options: [
      { id: 'A', text: 'Está orientado exclusivamente a lo largo del eje $y$ (vertical: $\\vec{E} = E_y \\hat{y}$).' },
      { id: 'B', text: 'Está orientado exclusivamente a lo largo del eje $x$ (horizontal: $\\vec{E} = E_x \\hat{x}$).' },
      { id: 'C', text: 'Posee componentes en $x$, $y$ y $z$ simultáneamente.' },
      { id: 'D', text: 'Gira helicoidalmente a lo largo del eje $z$.' },
    ],
    correctAnswerId: 'A',
    explanation:
      'Para el modo $TE_{10}$, con $m=1, n=0$: $E_x = 0$ y $E_z = 0$. Por lo tanto, el campo eléctrico es puramente vertical: $\\vec{E} = E_y(x) \\hat{y}$, con valor máximo en el centro de la guía $x = a/2$.',
  },
  {
    id: 20,
    category: '3.1',
    topic: 'Flujo de Potencia del Vector de Poynting',
    question:
      '¿Cómo se calcula la potencia media transportada por una guía de onda a lo largo de su sección transversal $S$?',
    options: [
      {
        id: 'A',
        text: 'Mediante la integral de superficie del promedio temporal del vector de Poynting:',
        latex: 'P_{\\text{prom}} = \\frac{1}{2} \\text{Re} \\iint_S (\\vec{E} \\times \\vec{H}^*) \\cdot d\\vec{S}',
      },
      {
        id: 'B',
        text: 'Multiplicando directamente el voltaje pico por la corriente total en las paredes.',
      },
      {
        id: 'C',
        text: 'Mediante la integral de línea del campo eléctrico alrededor del perímetro.',
      },
      {
        id: 'D',
        text: 'Sumando la energía electrostática y magnetostática en un volumen cúbico.',
      },
    ],
    correctAnswerId: 'A',
    explanation:
      'El teorema de Poynting en el dominio fasorial establece que la potencia activa promedio transmitida a través de la sección transversal de la guía es la integral de superficie de la parte real del vector de Poynting complejo: $P_{\\text{prom}} = \\frac{1}{2} \\text{Re} \\iint_S (\\vec{E} \\times \\vec{H}^*) \\cdot \\hat{z}\\, dx\\, dy$.',
  },
];
