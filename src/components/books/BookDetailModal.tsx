import React from 'react';
import {
  X,
  BookOpen,
  Layers,
  Calendar,
  User,
  Printer,
  ArrowLeftRight,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Hash,
  FolderOpen,
  FileText,
  FileCheck,
} from 'lucide-react';
import { Book, Loan } from '../../types/library';
import { getCategoryCode, parseBookIdentifier } from '../../utils/categoryCodes';

interface BookDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  loans: Loan[];
  onEdit: (book: Book) => void;
  onDelete: (bookId: string) => void;
  onLoanBook: (book: Book) => void;
  onPrintLabels: (book: Book, type?: 'spine' | 'inside' | 'combo') => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  isOpen,
  onClose,
  book,
  loans,
  onEdit,
  onDelete,
  onLoanBook,
  onPrintLabels,
}) => {
  if (!isOpen || !book) return null;

  const rawCode = book.bookNumber || book.barcode || '01-001';
  const parsed = parseBookIdentifier(rawCode);
  const catCode = parsed.isStructured ? parsed.categoryCode : getCategoryCode(book.category);

  // Active loans for this book
  const activeLoansForBook = loans.filter(
    (l) => l.bookId === book.id && l.status !== 'devuelto'
  );

  // All loans history
  const allHistoryForBook = loans.filter((l) => l.bookId === book.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-black text-lg shadow-inner">
              {rawCode}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  [{catCode}] {book.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Año {book.publishYear}
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white truncate max-w-md">
                {book.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Card Details Summary */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 break-words">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Código de Lomo</span>
                <span className="text-amber-400 font-mono font-black text-base">
                  {rawCode}
                </span>
                <span className="text-[10px] text-slate-500 block font-mono">
                  Cat: {catCode} &bull; N°: {parsed.bookNumber}
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Autor</span>
                <span className="text-white font-bold truncate block">
                  {book.author}
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Categoría</span>
                <span className="text-white font-semibold truncate block">
                  [{catCode}] {book.category}
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Disponibilidad</span>
                <span className={`font-extrabold text-xs sm:text-sm ${book.availableCopies > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {book.availableCopies} de {book.totalCopies} disp.
                </span>
              </div>
            </div>

            {book.notes && (
              <div className="pt-2 border-t border-slate-800/80 text-slate-300 text-xs">
                <span className="text-slate-400 font-bold">Observaciones: </span>
                {book.notes}
              </div>
            )}
          </div>

          {/* Active Loans / Where is the book right now */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-amber-400" />
              Estado Actual en Pabellones
            </h4>

            {activeLoansForBook.length > 0 ? (
              <div className="divide-y divide-slate-800 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                {activeLoansForBook.map((loan) => (
                  <div key={loan.id} className="p-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold font-mono text-[10px]">
                          {loan.memberPavilion} &bull; {loan.memberCell}
                        </span>
                        <span className="font-bold text-white text-xs">
                          {loan.memberName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Retirado el {new Date(loan.loanDate).toLocaleDateString('es-AR')} &bull; Vence:{' '}
                        <b className={loan.status === 'vencido' ? 'text-rose-400' : 'text-slate-300'}>
                          {new Date(loan.dueDate).toLocaleDateString('es-AR')}
                        </b>
                      </p>
                    </div>

                    <span
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                        loan.status === 'vencido'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {loan.status === 'vencido' ? '⚠️ Retrasado' : 'Activo'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center text-slate-400">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <p>Todos los ejemplares de este libro están disponibles en la biblioteca.</p>
              </div>
            )}
          </div>

          {/* Loan History */}
          {allHistoryForBook.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                Historial de Circulación ({allHistoryForBook.length} préstamos registrados)
              </h4>

              <div className="max-h-36 overflow-y-auto space-y-1 bg-slate-950 p-2 rounded-xl border border-slate-800">
                {allHistoryForBook.map((loan) => (
                  <div
                    key={loan.id}
                    className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-[11px]"
                  >
                    <div>
                      <span className="font-bold text-white">{loan.memberName}</span>
                      <span className="text-slate-500 ml-1">
                        ({loan.memberPavilion} &bull; {loan.memberCell})
                      </span>
                    </div>
                    <div className="text-slate-400 font-mono text-[10px]">
                      {new Date(loan.loanDate).toLocaleDateString('es-AR')}
                      {loan.returnDate && ` → ${new Date(loan.returnDate).toLocaleDateString('es-AR')}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 justify-between sm:justify-start">
            <button
              onClick={() => {
                if (confirm(`¿Estás seguro de eliminar el libro "${book.title}" (${rawCode})?`)) {
                  onDelete(book.id);
                  onClose();
                }
              }}
              className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-colors border border-rose-500/20"
              title="Eliminar libro del sistema"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onClose();
                onEdit(book);
              }}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700 flex-1 sm:flex-none justify-center"
            >
              <Edit className="w-3.5 h-3.5" />
              Editar
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onPrintLabels(book, 'combo');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir Lomo + Ficha (A4)
            </button>

            <button
              disabled={book.availableCopies === 0}
              onClick={() => {
                onClose();
                onLoanBook(book);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                book.availableCopies > 0
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 active:scale-95'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Prestar Este Libro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
