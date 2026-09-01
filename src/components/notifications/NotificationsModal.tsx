import React, { useState } from 'react';
import {
  X,
  Bell,
  AlertTriangle,
  Clock,
  BookOpen,
  Users,
  CheckCircle2,
  Building2,
  DoorClosed,
  ArrowRight,
  Send,
  Database,
  RefreshCw,
  Phone,
} from 'lucide-react';
import { Book, Member, Loan, LibrarySettings } from '../../types/library';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  members: Member[];
  loans: Loan[];
  settings: LibrarySettings;
  onOpenReturnModal: (loan: Loan) => void;
  onOpenMemberDetail: (member: Member) => void;
  onOpenBackupSettings: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  books,
  members,
  loans,
  settings,
  onOpenReturnModal,
  onOpenMemberDetail,
  onOpenBackupSettings,
}) => {
  const [filter, setFilter] = useState<'all' | 'overdue' | 'dueSoon' | 'stock'>('all');

  if (!isOpen) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Overdue Loans
  const activeLoans = loans.filter((l) => l.status === 'activo' || l.status === 'vencido');

  const overdueList = activeLoans
    .filter((loan) => {
      const due = new Date(loan.dueDate);
      due.setHours(0, 0, 0, 0);
      return due < today;
    })
    .map((loan) => {
      const due = new Date(loan.dueDate);
      const diffTime = Math.abs(today.getTime() - due.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const member = members.find((m) => m.id === loan.memberId);
      const book = books.find((b) => b.id === loan.bookId);
      return {
        loan,
        member,
        book,
        daysOverdue: diffDays,
      };
    })
    .sort((a, b) => b.daysOverdue - a.daysOverdue);

  // 2. Due Soon Loans (Due today or within 3 days)
  const dueSoonList = activeLoans
    .filter((loan) => {
      const due = new Date(loan.dueDate);
      due.setHours(0, 0, 0, 0);
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 3;
    })
    .map((loan) => {
      const due = new Date(loan.dueDate);
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const member = members.find((m) => m.id === loan.memberId);
      const book = books.find((b) => b.id === loan.bookId);
      return {
        loan,
        member,
        book,
        daysLeft: diffDays,
      };
    });

  // 3. Out of stock / High Demand Books
  const outOfStockBooks = books.filter((b) => b.availableCopies === 0);

  // Total notification count
  const totalCount = overdueList.length + dueSoonList.length + (outOfStockBooks.length > 0 ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 relative shadow-inner">
              <Bell className="w-5 h-5" />
              {overdueList.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-slate-900 animate-ping"></span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  Centro de Notificaciones y Alertas
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-slate-300 border border-slate-700">
                  {totalCount} activas
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Avisos automáticos de moras, vencimientos y estado de biblioteca
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

        {/* Filter Pills */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-950/30 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filter === 'all'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Todas ({totalCount})
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              filter === 'overdue'
                ? 'bg-rose-500 text-white font-black'
                : 'bg-slate-800 text-rose-300 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Vencidos ({overdueList.length})</span>
          </button>
          <button
            onClick={() => setFilter('dueSoon')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              filter === 'dueSoon'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-800 text-amber-300 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Por Vencer ({dueSoonList.length})</span>
          </button>
          <button
            onClick={() => setFilter('stock')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              filter === 'stock'
                ? 'bg-blue-500 text-white font-black'
                : 'bg-slate-800 text-blue-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sin Stock ({outOfStockBooks.length})</span>
          </button>
        </div>

        {/* List of Notifications */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 text-xs">
          {totalCount === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-80" />
              <h4 className="text-white font-bold text-sm">
                ¡Todo al día en la Biblioteca!
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No hay préstamos vencidos ni alertas urgentes en este momento.
              </p>
            </div>
          ) : null}

          {/* OVERDUE LIST */}
          {(filter === 'all' || filter === 'overdue') &&
            overdueList.map(({ loan, member, book, daysOverdue }) => (
              <div
                key={`overdue-${loan.id}`}
                className="p-3.5 sm:p-4 rounded-2xl bg-rose-950/20 border border-rose-500/40 hover:border-rose-500/70 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md font-mono font-black text-[10px] bg-rose-500 text-white">
                        {daysOverdue} {daysOverdue === 1 ? 'DÍA DE MORA' : 'DÍAS DE MORA'}
                      </span>
                      <span className="font-extrabold text-white text-xs truncate">
                        {loan.bookTitle} (Libro #{book?.bookNumber || loan.bookBarcode})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300 flex-wrap">
                      <span className="font-semibold text-slate-200">
                        Lector: <b>{loan.memberName}</b>
                      </span>
                      {member?.pavilion && (
                        <span className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-amber-300 font-bold">
                          <Building2 className="w-3 h-3 text-amber-400" />
                          {member.pavilion}
                        </span>
                      )}
                      {member?.cell && (
                        <span className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-cyan-300 font-bold">
                          <DoorClosed className="w-3 h-3 text-cyan-400" />
                          {member.cell}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-rose-900/40">
                  {member?.whatsapp && (
                    <a
                      href={`https://wa.me/${member.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hola ${member.name}, te recordamos desde la Biblioteca CPU Batán U.P. 15 la devolución del libro "${loan.bookTitle}". Muchas gracias!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-[11px] flex items-center gap-1 transition-colors"
                      title="Enviar recordatorio por WhatsApp"
                    >
                      <Phone className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      onClose();
                      onOpenReturnModal(loan);
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-[11px] flex items-center gap-1 transition-colors shadow-md shadow-amber-500/20"
                  >
                    <span>Recibir Libro</span>
                  </button>
                </div>
              </div>
            ))}

          {/* DUE SOON LIST */}
          {(filter === 'all' || filter === 'dueSoon') &&
            dueSoonList.map(({ loan, member, book, daysLeft }) => (
              <div
                key={`duesoon-${loan.id}`}
                className="p-3.5 sm:p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md font-mono font-black text-[10px] bg-amber-500 text-slate-950">
                        {daysLeft === 0 ? 'VENCE HOY' : `VENCE EN ${daysLeft} DÍAS`}
                      </span>
                      <span className="font-extrabold text-white text-xs truncate">
                        {loan.bookTitle} (Libro #{book?.bookNumber || loan.bookBarcode})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300 flex-wrap">
                      <span className="font-semibold text-slate-200">
                        Lector: <b>{loan.memberName}</b>
                      </span>
                      {member?.pavilion && (
                        <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-amber-300 font-bold">
                          {member.pavilion} {member.cell ? `(${member.cell})` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenReturnModal(loan);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-colors self-end sm:self-center shrink-0"
                >
                  <span>Ver Préstamo</span>
                </button>
              </div>
            ))}

          {/* OUT OF STOCK BOOKS */}
          {(filter === 'all' || filter === 'stock') && outOfStockBooks.length > 0 && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold">
                <BookOpen className="w-4 h-4" />
                <span>Libros con 100% de ejemplares prestados ({outOfStockBooks.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {outOfStockBooks.map((b) => (
                  <span
                    key={b.id}
                    className="px-2 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-[11px] flex items-center gap-1.5 font-medium"
                  >
                    <b className="text-amber-400 font-mono">#{b.bookNumber || b.barcode}</b>
                    <span className="truncate max-w-[160px]">{b.title}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Backup Reminder Banner */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">
                  Seguridad de Datos en CPU Batán
                </span>
                <span className="text-[11px] text-slate-400">
                  Recuerda descargar una copia de seguridad en pendrive periódicamente.
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenBackupSettings();
              }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-[11px] shrink-0 transition-colors"
            >
              Hacer Backup
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            Actualizado en tiempo real según la fecha actual
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
