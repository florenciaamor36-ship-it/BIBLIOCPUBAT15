import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeSvgProps {
  value: string;
  height?: number;
  width?: number;
  displayValue?: boolean;
  fontSize?: number;
  className?: string;
  color?: string;
  background?: string;
}

export const BarcodeSvg: React.FC<BarcodeSvgProps> = ({
  value,
  height = 36,
  width = 1.6,
  displayValue = true,
  fontSize = 11,
  className = '',
  color = '#000000',
  background = 'transparent',
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: 'CODE128',
          height,
          width,
          displayValue,
          fontSize,
          font: 'JetBrains Mono, monospace',
          textMargin: 2,
          margin: 2,
          background,
          lineColor: color,
        });
      } catch (err) {
        console.error('Error rendering JsBarcode:', err);
      }
    }
  }, [value, height, width, displayValue, fontSize, color, background]);

  if (!value) return null;

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg ref={svgRef} className="max-w-full h-auto" />
    </div>
  );
};
