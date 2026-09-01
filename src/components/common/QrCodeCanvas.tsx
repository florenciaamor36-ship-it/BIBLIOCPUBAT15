import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QrCodeCanvasProps {
  value: string;
  size?: number;
  className?: string;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
}

export const QrCodeCanvas: React.FC<QrCodeCanvasProps> = ({
  value,
  size = 90,
  className = '',
  margin = 1,
  darkColor = '#000000',
  lightColor = '#ffffff',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(
        canvasRef.current,
        value,
        {
          width: size,
          margin,
          color: {
            dark: darkColor,
            light: lightColor,
          },
          errorCorrectionLevel: 'M',
        },
        (err) => {
          if (err) console.error('Error generating QR Canvas:', err);
        }
      );
    }
  }, [value, size, margin, darkColor, lightColor]);

  if (!value) return null;

  return (
    <div className={`inline-block overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="block max-w-full h-auto" />
    </div>
  );
};
