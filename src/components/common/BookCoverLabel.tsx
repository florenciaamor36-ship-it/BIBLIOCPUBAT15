import React from 'react';
import { Book, BookCopy } from '../../types/library';
import { BarcodeSvg } from './BarcodeSvg';
import { QrCodeCanvas } from './QrCodeCanvas';
import { getDeweyColor } from '../../utils/barcodeGenerator';

interface BookCoverLabelProps {
  book: Book;
  copy?: BookCopy;
  libraryName?: string;
  showBarcode?: boolean;
  showQrCode?: boolean;
  showDewey?: boolean;
  showShelf?: boolean;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  fontSize?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const BookCoverLabel: React.FC<BookCoverLabelProps> = ({
  book,
  copy,
  libraryName = 'CPU BATÁN - PASTORAL',
  showBarcode = true,
  showQrCode = false,
  showDewey = true,
  showShelf = true,
  borderStyle = 'solid',
  fontSize = 'sm',
  className = '',
}) => {
  const deweyInfo = getDeweyColor(book.deweyCode);
  const activeBarcode = copy?.barcode || book.barcode;

  const borderClass = {
    solid: 'border border-neutral-400',
    dashed: 'border border-dashed border-neutral-400',
    dotted: 'border border-dotted border-neutral-400',
    none: 'border-0',
  }[borderStyle];

  const fontSizes = {
    xs: { title: 'text-xs', author: 'text-[9px]', meta: 'text-[8px]' },
    sm: { title: 'text-sm', author: 'text-xs', meta: 'text-[9px]' },
    md: { title: 'text-base', author: 'text-sm', meta: 'text-xs' },
    lg: { title: 'text-lg', author: 'text-base', meta: 'text-sm' },
  }[fontSize];

  return (
    <div
      id={`cover-label-${book.id}-${copy?.copyId || 'default'}`}
      className={`bg-white text-black p-2.5 rounded-sm shadow-sm select-none flex flex-col justify-between w-[70mm] min-h-[38mm] font-sans ${borderClass} ${className}`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Header: Library name and Dewey category badge */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-1 mb-1 gap-1">
        <span className="font-bold text-[8px] uppercase tracking-wider text-neutral-600 truncate">
          {libraryName}
        </span>
        {showDewey && (
          <span
            className="px-1.5 py-0.2 text-[8px] font-mono font-bold rounded text-white truncate max-w-[120px]"
            style={{ backgroundColor: deweyInfo.colorBg }}
          >
            CDU: {book.deweyCode}
          </span>
        )}
      </div>

      {/* Book Title & Author */}
      <div className="flex-1 flex flex-col justify-center my-0.5">
        <h4 className={`font-serif font-bold text-neutral-900 leading-tight line-clamp-2 ${fontSizes.title}`}>
          {book.title}
        </h4>
        <p className={`text-neutral-700 font-medium truncate ${fontSizes.author}`}>
          {book.author}
        </p>

        {/* Dewey Signature + Shelf Location */}
        <div className="flex items-center gap-2 mt-0.5 text-neutral-600 font-mono text-[8px]">
          <span className="font-semibold text-neutral-900 bg-neutral-100 px-1 rounded">
            {book.topographicSignature || book.deweyCode}
          </span>
          {showShelf && book.location?.shelf && (
            <span className="truncate font-sans">
              📍 {book.location.shelf} {copy ? `(Ej. ${copy.copyNumber})` : ''}
            </span>
          )}
        </div>
      </div>

      {/* Barcode & Optional QR Code Section */}
      <div className="flex items-center justify-between gap-1 pt-1 border-t border-neutral-200 mt-1">
        {showBarcode && (
          <div className="flex-1 flex justify-center items-center overflow-hidden">
            <BarcodeSvg
              value={activeBarcode}
              height={26}
              width={1.2}
              fontSize={9}
              displayValue={true}
            />
          </div>
        )}

        {showQrCode && (
          <div className="flex-shrink-0 flex items-center justify-center p-0.5 bg-white border border-neutral-200 rounded">
            <QrCodeCanvas value={`BIBLIO:${activeBarcode}|${book.id}`} size={38} />
          </div>
        )}
      </div>
    </div>
  );
};
