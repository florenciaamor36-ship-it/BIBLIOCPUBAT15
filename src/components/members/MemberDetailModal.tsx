import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Building2,
  DoorClosed,
  Calendar,
  ArrowLeftRight,
  Printer,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Send,
  CreditCard,
} from 'lucide-react';
import { Member, Loan, LibrarySettings } from '../../types/library';
import { MemberIdCard } from '../common/MemberIdCard';

interface MemberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  loans: Loan[];
  settings: LibrarySettings;
  onEdit: (member: Member) => void;
  onDelete: (memberId: string) => void;
  onNewLoanForMember: (member: Member) => void;
  onReturnLoan?: (loan: Loan) => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  isOpen,
  onClose,
  member,
  loans,
  settings,
  onEdit,
  onDelete,
  onNewLoanForMember,
  onReturnLoan,
}) => {
  const [showCard, setShowCard] = useState(false);

  if (!isOpen || !member) return null;

  const memberLoans = loans.filter((l) => l.memberId === member.id);
  const activeLoans = memberLoans.filter(
    (l) => l.status === 'activo' || l.status === 'renovado' || l.status === 'vencido'
  );
  const pastLoans = memberLoans.filter((l) => l.status === 'devuelto');

  const cleanWhatsapp = member.whatsapp?.replace(/[^0-9]/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-extrabold text-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {member.memberNumber}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    member.status === 'activo'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {member.status.toUpperCase()}
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {member.name}
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Ubicación y Contacto */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] font-bold uppercase flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                Pabellón
              </span>
              <span className="text-white font-extrabold text-sm block mt-1">
                {member.pavilion}
              </span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] font-bold uppercase flex items-center gap-1">
                <DoorClosed className="w-3.5 h-3.5 text-cyan-400" />
                Celda
              </span>
              <span className="text-cyan-300 font-extrabold text-sm block mt-1">
                {member.cell}
              </span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <span className="text-slate-400 block text-[10px] font-bold uppercase flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                WhatsApp
              </span>
              {member.whatsapp ? (
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-mono font-bold text-xs flex items-center gap-1 mt-1 truncate"
                >
                  <Send className="w-3 h-3" />
                  {member.whatsapp}
                </a>
              ) : (
                <span className="text-slate-500 italic mt-1">Sin registrar</span>
              )}
            </div>
          </div>

          {member.notes && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
              <span className="text-slate-400 font-bold">Observaciones: </span>
              {member.notes}
            </div>
          )}

          {/* Libros en poder del lector (Préstamos Activos) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                Libros Actualmente en su Pabellón / Celda ({activeLoans.length})
              </h4>
            </div>

            {activeLoans.length > 0 ? (
              <div className="divide-y divide-slate-800 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                {activeLoans.map((loan) => {
                  const isLate = loan.status === 'vencido';

                  return (
                    <div key={loan.id} className="p-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 font-mono font-bold text-xs">
                            Libro #{loan.bookNumber}
                          </span>
                          <span className="font-bold text-white text-xs">
                            {loan.bookTitle}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Fecha préstamo: {loan.loanDate} | Devolución prevista:{' '}
                          <b className={isLate ? 'text-rose-400' : 'text-amber-400'}>
                            {loan.dueDate}
                          </b>
                          {isLate && ' (¡VENCIDO!)'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {member.whatsapp && (
                          <a
                            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                              `Hola ${member.name}, te recordamos desde la Biblioteca que tienes el libro "${loan.bookTitle}" (Libro #${loan.bookNumber}) en ${member.pavilion} ${member.cell} con fecha de devolución ${loan.dueDate}.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            Avisar
                          </a>
                        )}

                        {onReturnLoan && (
                          <button
                            onClick={() => onReturnLoan(loan)}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors"
                          >
                            Devolver
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center text-slate-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                No tiene libros pendientes de devolución en este momento.
              </div>
            )}
          </div>

          {/* Carnet Preview Toggle & Box */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowCard(!showCard)}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" />
                {showCard ? 'Ocultar Carnet de Lector' : 'Ver Carnet Oficial de Lector'}
              </button>
              {showCard && (
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 border border-slate-700"
                >
                  <Printer className="w-3 h-3 text-amber-400" />
                  Imprimir Carnet
                </button>
              )}
            </div>

            {showCard && (
              <div className="w-full max-w-full overflow-x-auto flex justify-center p-2 sm:p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <MemberIdCard
                  member={member}
                  libraryName={settings.libraryName}
                  logoUrl={settings.logoUrl}
                />
              </div>
            )}
          </div>

          {/* Historial anterior */}
          {pastLoans.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <h4 className="font-bold text-xs text-slate-400">
                Historial de Libros Leídos ({pastLoans.length})
              </h4>
              <div className="max-h-36 overflow-y-auto space-y-1 bg-slate-950 p-2 rounded-xl border border-slate-800">
                {pastLoans.map((pl) => (
                  <div
                    key={pl.id}
                    className="p-1.5 flex items-center justify-between text-[11px] text-slate-300"
                  >
                    <span>
                      #{pl.bookNumber} {pl.bookTitle}
                    </span>
                    <span className="text-slate-500">Devuelto: {pl.returnDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => onEdit(member)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-700 flex-1 sm:flex-none justify-center"
            >
              <Edit className="w-3.5 h-3.5" />
              Editar
            </button>
            <button
              onClick={() => {
                if (confirm(`¿Estás seguro de eliminar al lector "${member.name}"?`)) {
                  onDelete(member.id);
                  onClose();
                }
              }}
              className="px-3.5 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-rose-800/40 flex-1 sm:flex-none justify-center"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Eliminar
            </button>
          </div>

          <button
            onClick={() => {
              onNewLoanForMember(member);
              onClose();
            }}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20 active:scale-95 w-full sm:w-auto"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Prestar Libro a este Lector
          </button>
        </div>
      </div>
    </div>
  );
};
