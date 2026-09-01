import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';

// Color coding according to Dewey Decimal Classification 10 Main Classes (Universal standard for physical libraries)
export interface DeweyCategoryInfo {
  range: string;
  name: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
}

export function getDeweyColor(deweyCode: string): DeweyCategoryInfo {
  const codeNum = parseFloat(deweyCode) || 0;
  
  if (codeNum >= 0 && codeNum < 100) {
    return { range: '000-099', name: 'Generalidades y Computación', colorBg: '#3b82f6', colorBorder: '#1d4ed8', colorText: '#ffffff' };
  } else if (codeNum >= 100 && codeNum < 200) {
    return { range: '100-199', name: 'Filosofía y Psicología', colorBg: '#8b5cf6', colorBorder: '#6d28d9', colorText: '#ffffff' };
  } else if (codeNum >= 200 && codeNum < 300) {
    return { range: '200-299', name: 'Religión y Mitología', colorBg: '#6366f1', colorBorder: '#4338ca', colorText: '#ffffff' };
  } else if (codeNum >= 300 && codeNum < 400) {
    return { range: '300-399', name: 'Ciencias Sociales y Derecho', colorBg: '#f59e0b', colorBorder: '#d97706', colorText: '#18181b' };
  } else if (codeNum >= 400 && codeNum < 500) {
    return { range: '400-499', name: 'Lenguas y Lingüística', colorBg: '#06b6d4', colorBorder: '#0891b2', colorText: '#ffffff' };
  } else if (codeNum >= 500 && codeNum < 600) {
    return { range: '500-599', name: 'Ciencias Puras y Matemáticas', colorBg: '#10b981', colorBorder: '#047857', colorText: '#ffffff' };
  } else if (codeNum >= 600 && codeNum < 700) {
    return { range: '600-699', name: 'Tecnología y Ciencias Aplicadas', colorBg: '#ef4444', colorBorder: '#b91c1c', colorText: '#ffffff' };
  } else if (codeNum >= 700 && codeNum < 800) {
    return { range: '700-799', name: 'Artes, Recreación y Deportes', colorBg: '#ec4899', colorBorder: '#be185d', colorText: '#ffffff' };
  } else if (codeNum >= 800 && codeNum < 900) {
    return { range: '800-899', name: 'Literatura y Retórica', colorBg: '#0d9488', colorBorder: '#0f766e', colorText: '#ffffff' };
  } else {
    return { range: '900-999', name: 'Historia, Geografía y Biografías', colorBg: '#ea580c', colorBorder: '#c2410c', colorText: '#ffffff' };
  }
}

/**
 * Generate Topographic Signature (Signatura Topográfica)
 * Format standard: Dewey / 3 letters author / 3 letters title
 * Example: 863.64 / GAR / cie
 */
export function generateTopographicSignature(deweyCode: string, author: string, title: string): string {
  const dewey = (deweyCode || '000').trim();
  
  // Extract first 3 letters of main author surname
  const cleanAuthor = author.replace(/^(Dr\.|Dra\.|Prof\.|Lic\.)\s+/i, '').trim();
  const authorParts = cleanAuthor.split(' ');
  // If "Gabriel García Márquez", take "García" -> "GAR"
  let surname = authorParts.length > 1 ? authorParts[authorParts.length - 2] || authorParts[0] : authorParts[0];
  if (authorParts.length >= 3) {
    surname = authorParts[1] || authorParts[0];
  }
  const authorCode = surname.substring(0, 3).toUpperCase() || 'AUT';

  // Extract first 3 letters of title (skip articles like El, La, Los, Las, Un, Una)
  const cleanTitle = title.replace(/^(El|La|Los|Las|Un|Una|Unos|Unas|The|A|An)\s+/i, '').trim();
  const titleCode = cleanTitle.substring(0, 3).toLowerCase() || 'tit';

  return `${dewey} / ${authorCode} / ${titleCode}`;
}

/**
 * Renders Code128 Barcode to an SVG string using JsBarcode
 */
export function generateBarcodeSvg(value: string, options?: { height?: number; width?: number; displayValue?: boolean; fontSize?: number }): string {
  try {
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    JsBarcode(svgNode, value || '000000', {
      format: 'CODE128',
      height: options?.height ?? 36,
      width: options?.width ?? 1.5,
      displayValue: options?.displayValue ?? true,
      fontSize: options?.fontSize ?? 11,
      font: 'JetBrains Mono, monospace',
      textMargin: 2,
      margin: 4,
      background: '#ffffff',
      lineColor: '#000000',
    });
    return svgNode.outerHTML;
  } catch (error) {
    console.error('Error generating barcode SVG:', error);
    return `<div class="text-xs font-mono font-bold text-center border p-1 bg-white text-black">[BARCODE: ${value}]</div>`;
  }
}

/**
 * Generates QR Code Data URL synchronously or asynchronously
 */
export async function generateQrCodeDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 160,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}

/**
 * Generate a new unique barcode for a book or copy
 */
export function generateNextBarcode(prefix: string = 'LIB', count: number = 1): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randomNum}`;
}
