import React from 'react';
import { Book } from '../../types/library';
import { CpuPastoralLogo } from './CpuPastoralLogo';
import { getCategoryCode, parseBookIdentifier, getCategoryDefinition } from '../../utils/categoryCodes';

interface PocketDueSlipProps {
  book: Book;
  libraryName?: string;
  logoUrl?: string;
  className?: string;
}

export const PocketDueSlip: React.FC<PocketDueSlipProps> = ({
  book,
  libraryName = 'COMUNIDAD PASTORAL UNIVERSITARIA - U.P. N° 15 BATÁN',
  logoUrl,
  className = '',
}) => {
  const numberText = book.bookNumber || book.barcode || '01-001';
  const parsed = parseBookIdentifier(numberText);
  const catCode = parsed.isStructured ? parsed.categoryCode : getCategoryCode(book.category);
  const catDef = getCategoryDefinition(catCode) || getCategoryDefinition(book.category);
  const displayCode = parsed.isStructured ? parsed.raw : `${catCode}-${parsed.bookNumber}`;

  return (
    <div
      id={`pocket-slip-${book.id}`}
      className={`bg-white text-black p-3.5 border-2 border-black rounded-md w-full max-w-[80mm] sm:w-[80mm] min-h-[125mm] font-sans flex flex-col justify-between select-none shadow-sm print:w-[80mm] print:max-w-none ${className}`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-1.5 flex items-center justify-between gap-2">
        <div className="w-9 h-9 rounded border border-black/30 overflow-hidden flex items-center justify-center p-0.5 shrink-0 bg-white">
          <CpuPastoralLogo variant="icon" size="sm" />
        </div>

        <div className="flex-1 text-center">
          <h3 className="font-black uppercase text-[9px] tracking-wider text-black leading-tight">
            COMUNIDAD PASTORAL UNIVERSITARIA
          </h3>
          <p className="text-[7.5px] font-extrabold text-neutral-800 uppercase tracking-widest">
            U.P. N° 15 BATÁN &bull; FICHA DE CONTROL DE PRÉSTAMOS
          </p>
        </div>
      </div>

      {/* Book Metadata Box */}
      <div className="bg-neutral-50 border border-neutral-400 p-2 my-2 rounded text-[10px] space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] font-bold text-neutral-600 uppercase">CÓDIGO LOMO:</span>
            <span className="font-mono font-black text-sm text-black bg-neutral-200 px-1.5 py-0.2 rounded border border-neutral-300">
              {displayCode}
            </span>
          </div>
          <span className="text-[8.5px] font-bold px-1.5 py-0.5 bg-black text-white rounded font-mono">
            CAT {catCode} &bull; {catDef?.shortName || book.category}
          </span>
        </div>
        <div className="pt-0.5">
          <span className="font-bold text-neutral-600">TÍTULO: </span>
          <span className="font-bold text-black line-clamp-1">{book.title}</span>
        </div>
        <div>
          <span className="font-bold text-neutral-600">AUTOR: </span>
          <span className="text-neutral-900 font-semibold truncate">{book.author} {book.publishYear ? `(${book.publishYear})` : ''}</span>
        </div>
      </div>

      {/* Date Stamp & Pavilion Grid */}
      <div className="flex-1 border-2 border-black rounded overflow-hidden flex flex-col my-1">
        <div className="grid grid-cols-12 bg-neutral-200 text-[8px] font-black text-black text-center py-1 border-b border-black">
          <div className="col-span-3 border-r border-neutral-400">FECHA RETIRO</div>
          <div className="col-span-4 border-r border-neutral-400">LECTOR</div>
          <div className="col-span-3 border-r border-neutral-400">PAB. / CELDA</div>
          <div className="col-span-2">DEV.</div>
        </div>
        <div className="flex-1 divide-y divide-neutral-300">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="grid grid-cols-12 h-6 text-[8px] text-center font-mono">
              <div className="col-span-3 border-r border-neutral-300 flex items-center justify-center"></div>
              <div className="col-span-4 border-r border-neutral-300 flex items-center justify-center"></div>
              <div className="col-span-3 border-r border-neutral-300 flex items-center justify-center"></div>
              <div className="col-span-2 flex items-center justify-center"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer warning */}
      <div className="pt-1 border-t border-neutral-300 text-center">
        <p className="text-[7.5px] font-bold text-neutral-600 uppercase">
          Por favor cuidar este libro y devolverlo a término en la biblioteca.
        </p>
      </div>
    </div>
  );
};
