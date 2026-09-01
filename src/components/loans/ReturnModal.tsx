import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  User,
  Calendar,
  RotateCcw,
  Building2,
  DoorClosed,
} from 'lucide-react';
import { Loan, LibrarySettings } from '../../types/library';

interface ReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: Loan | null;
  settings: LibrarySettings;
  onConfirmReturn: (loanId: string, returnData: { notes: string }) => void;
  onRenewLoan: (loanId: string, additionalDays: number) => void;
}

export const ReturnModal: React.FC<ReturnModalProps> = ({
  isOpen,
  onClose,
  loan,
  settings,
  onConfirmReturn,
  onRenewLoan,
}) => {
  if (!isOpen || !loan) return null;

  const [notes, setNotes] = useState('');
  const isOverdue = loan.status === 'vencido';

  const handleReturn = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmReturn(loan.id, {
      notes: notes.trim(),
    });
    onClose();
  };

  const handleRenew = () => {
    onRenewLoan(loan.id, 7);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Registrar Devolución de Libro
              </h3>
              <p className="text-xs text-slate-400">
                Retorno de ejemplar físico al estante de la biblioteca
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleReturn} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Summary Box */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div>
              <span className="text-amber-400 font-mono font-black text-sm mr-2">
                Nº {loan.bookNumber}
              </span>
              <span className="font-extrabold text-white text-sm">
                {loan.bookTitle}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 font-bold block">Lector:</span>
                <span className="font-bold text-white block">{loan.memberName}</span>
              </div>

              <div>
                <span className="text-slate-500 font-bold block">Pabellón y Celda:</span>
                <span className="font-bold text-cyan-300 block">
                  {loan.memberPavilion} • {loan.memberCell}
                </span>
              </div>

              <div>
                <span className="text-slate-500 font-bold block">Fecha de Préstamo:</span>
                <span className="text-slate-300 font-mono">{loan.loanDate}</span>
              </div>

              <div>
                <span className="text-slate-500 font-bold block">Fecha de Vencimiento:</span>
                <span className={`font-mono font-bold ${isOverdue ? 'text-rose-400' : 'text-amber-400'}`}>
                  {loan.dueDate} {isOverdue && '(Vencido)'}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Estado de Devolución / Observaciones (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ej: Devuelto completo y en óptimas condiciones"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={handleRenew}
              className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Renovar +7 Días Más</span>
            </button>

            <button
              type="submit"
              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar Reingreso a Biblioteca</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
