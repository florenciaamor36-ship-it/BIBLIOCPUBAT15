import React from 'react';
import { Book } from '../../types/library';
import { getCategoryCode, parseBookIdentifier, getCategoryDefinition } from '../../utils/categoryCodes';

interface SpineLabelTagProps {
  book: Book;
  libraryName?: string;
  className?: string;
}

export const SpineLabelTag: React.FC<SpineLabelTagProps> = ({
  book,
  libraryName = 'CPU BATÁN - U.P. 15',
  className = '',
}) => {
  const numberText = book.bookNumber || book.barcode || '01-001';
  const parsed = parseBookIdentifier(numberText);
  const catCode = parsed.isStructured ? parsed.categoryCode : getCategoryCode(book.category);
  const catDef = getCategoryDefinition(catCode) || getCategoryDefinition(book.category);

  const displayCode = parsed.isStructured ? parsed.raw : `${catCode}-${parsed.bookNumber}`;

  return (
    <div
      id={`spine-label-${book.id}`}
      className={`bg-white text-black border-2 border-black rounded-md w-full max-w-[45mm] sm:w-[45mm] min-h-[58mm] p-2 flex flex-col justify-between select-none shadow-sm font-sans print:w-[45mm] print:max-w-none ${className}`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Header: Library Name & Category with 2-digit code */}
      <div className="border-b-2 border-black pb-1 text-center">
        <div className="text-[7.5px] font-black uppercase tracking-wider text-black truncate leading-tight">
          {libraryName}
        </div>
        <div className="flex items-center justify-center gap-1 mt-0.5">
          <span className="text-[8.5px] font-black bg-black text-white px-1.5 py-0.2 rounded font-mono">
            CAT {catCode}
          </span>
          <span className="text-[8px] font-extrabold text-neutral-800 uppercase truncate max-w-[90px]">
            {catDef?.shortName || book.category}
          </span>
        </div>
      </div>

      {/* Main Identification Box: 2 Digits Category + 3/4 Digits Book */}
      <div className="flex-1 flex flex-col items-center justify-center my-1 text-center bg-neutral-50 border border-neutral-300 rounded p-1">
        <span className="text-[7px] font-extrabold uppercase tracking-widest text-neutral-500">
          CÓDIGO DE LOMO
        </span>
        <div className="text-2xl font-mono font-black tracking-tight text-black py-0.5 leading-none flex items-center justify-center gap-0.5">
          <span>{displayCode}</span>
        </div>
        <div className="flex items-center justify-center gap-1 text-[7px] font-mono text-neutral-600 font-bold mt-0.5 border-t border-neutral-200 pt-0.5 w-full">
          <span>CAT: <b className="text-black">{catCode}</b></span>
          <span>&bull;</span>
          <span>N°: <b className="text-black">{parsed.bookNumber}</b></span>
        </div>
      </div>

      {/* Footer: Title & Author */}
      <div className="border-t-2 border-black pt-1 text-center">
        <div className="text-[8.5px] font-black text-black uppercase line-clamp-2 leading-tight">
          {book.title}
        </div>
        <div className="text-[7.5px] font-bold text-neutral-700 truncate mt-0.5">
          {book.author} {book.publishYear ? `(${book.publishYear})` : ''}
        </div>
      </div>
    </div>
  );
};
