/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math?: string;
  children?: string;
  block?: boolean;
  className?: string;
}

/**
 * Normalizes LaTeX string by replacing accidental double backslashes before LaTeX control words or symbols.
 * (e.g. \\quad -> \quad, \\sin -> \sin, \\vec -> \vec, \\neq -> \neq, \\hat -> \hat, \\partial -> \partial)
 */
export function cleanLatex(input: string): string {
  if (!input) return '';
  let str = input.trim();
  
  // Replace \\ before command letters or common symbols with single \
  // e.g. \\quad -> \quad, \\sin -> \sin, \\vec -> \vec, \\neq -> \neq, \\, -> \,
  str = str.replace(/\\\\([a-zA-Z,;:!])/g, '\\$1');
  
  // Replace \\ followed by space with \ followed by space (TeX space)
  str = str.replace(/\\\\ /g, '\\ ');
  
  return str;
}

/**
 * MathView renders mathematical equations using KaTeX with textbook typographical fidelity.
 * Supports inline equations, block equations, and mixed texts containing $ inline $ or $$ display $$.
 */
export const MathView: React.FC<MathViewProps> = ({
  math,
  children,
  block = false,
  className = '',
}) => {
  const rawContent = (math ?? (typeof children === 'string' ? children : '')).trim();

  const renderedHtml = useMemo(() => {
    if (!rawContent) return '';

    const content = cleanLatex(rawContent);

    // If block is true or whole string is enclosed in $$, render in display mode
    if (block) {
      const clean = cleanLatex(content.replace(/^\$\$|\$\$$/g, '').trim());
      try {
        return katex.renderToString(clean, {
          displayMode: true,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
      } catch {
        return `<span class="font-serif italic">${clean}</span>`;
      }
    }

    // If it's a direct formula without any $ delimiters
    if (!content.includes('$')) {
      try {
        return katex.renderToString(content, {
          displayMode: false,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
      } catch {
        return `<span class="font-serif italic">${content}</span>`;
      }
    }

    // Process mixed string containing $ inline $ and $$ block $$
    try {
      // Replace $$ ... $$ first
      let html = content.replace(/\$\$([\s\S]*?)\$\$/g, (_, eq) => {
        const cleanEq = cleanLatex(eq.trim());
        return katex.renderToString(cleanEq, {
          displayMode: true,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
      });

      // Replace $ ... $
      html = html.replace(/\$([^\$]+?)\$/g, (_, eq) => {
        const cleanEq = cleanLatex(eq.trim());
        return katex.renderToString(cleanEq, {
          displayMode: false,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
      });

      return html;
    } catch {
      return content;
    }
  }, [rawContent, block]);

  if (block) {
    return (
      <div
        className={`my-3 overflow-x-auto text-center py-2.5 px-4 rounded-xl bg-slate-50/80 border border-slate-200/90 shadow-2xs ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  return (
    <span
      className={`inline-math font-serif inline-block align-baseline ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

export default MathView;
