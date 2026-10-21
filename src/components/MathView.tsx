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
 * MathView renders mathematical equations using KaTeX.
 * If text contains mixed content with $ inline $ or $$ display $$, it parses and renders automatically.
 */
export const MathView: React.FC<MathViewProps> = ({
  math,
  children,
  block = false,
  className = '',
}) => {
  const content = (math ?? (typeof children === 'string' ? children : '')).trim();

  const renderedHtml = useMemo(() => {
    if (!content) return '';

    // If whole string is wrapped in $$ or block is true, render in display mode
    if (block) {
      const clean = content.replace(/^\$\$|\$\$$/g, '').trim();
      try {
        return katex.renderToString(clean, {
          displayMode: true,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
      } catch (e) {
        return `<span class="text-red-500 font-mono text-xs">${clean}</span>`;
      }
    }

    // Check if it's a simple raw equation without $ delimiters
    if (!content.includes('$')) {
      try {
        return katex.renderToString(content, {
          displayMode: false,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
      } catch (e) {
        return `<span class="text-red-500 font-mono text-xs">${content}</span>`;
      }
    }

    // Process mixed string containing $ inline $ and $$ block $$
    try {
      // Replace $$ ... $$ first
      let html = content.replace(/\$\$([\s\S]*?)\$\$/g, (_, eq) => {
        return katex.renderToString(eq.trim(), {
          displayMode: true,
          throwOnError: false,
        });
      });

      // Replace $ ... $
      html = html.replace(/\$([^\$]+?)\$/g, (_, eq) => {
        return katex.renderToString(eq.trim(), {
          displayMode: false,
          throwOnError: false,
        });
      });

      return html;
    } catch {
      return content;
    }
  }, [content, block]);

  if (block) {
    return (
      <div
        className={`my-3 overflow-x-auto text-center py-2 px-3 rounded-lg bg-slate-50 border border-slate-200/80 shadow-xs ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  return (
    <span
      className={`inline-math font-serif ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

export default MathView;
