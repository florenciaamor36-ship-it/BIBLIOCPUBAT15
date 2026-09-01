import React, { useState, useMemo } from 'react';
import {
  ArrowLeftRight,
  Search,
  Plus,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Printer,
  Calendar,
  Building2,
  DoorClosed,
  Phone,
  BookOpen,
  FileSpreadsheet,
  Send,
  Hash,
} from 'lucide-react';
import { Loan, LibrarySettings, LoanStatus } from '../../types/library';
import { exportLoansToCsv } from '../../utils/storage';

interface LoansViewProps {
  loans: Loan[];
  settings: LibrarySettings;
  onOpenNewLoan: () => void;
  onOpenReturnModal: (loan: Loan) => void;
  onRenewLoan: (loanId: string) => void;
  onNavigateToBook?: (bookId: string) => void;
  onNavigateToMember?: (memberId: string) => void;
}

export const LoansView: React.FC<LoansViewProps> = ({
  loans,
  settings,
  onOpenNewLoan,
  onOpenReturnModal,
  onRenewLoan,
  onNavigateToBook,
  onNavigateToMember,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('circulando');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pavilionFilter, setPavilionFilter] = useState<string>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  const overdueCount = loans.filter((l) => l.status === 'vencido').length;
  const activeCount = loans.filter((l) => l.status === 'activo' || l.status === 'renovado').length;
  const returnedCount = loans.filter((l) => l.status === 'devuelto').length;

  // Unique list of pavilions from loans
  const pavilions = useMemo(() => {
    const list: string[] = [];
    loans.forEach((l) => {
      const p = l.memberPavilion?.trim();
      if (p && !list.includes(p)) list.push(p);
    });
    return list.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [loans]);

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const q = searchQuery.toLowerCase().trim();
      const num = (loan.bookNumber || '').toLowerCase();
      const matchesSearch =
        !q ||
        num.includes(q) ||
        loan.bookTitle.toLowerCase().includes(q) ||
        loan.memberName.toLowerCase().includes(q) ||
        (loan.memberPavilion && loan.memberPavilion.toLowerCase().includes(q)) ||
        (loan.memberCell && loan.memberCell.toLowerCase().includes(q)) ||
        (loan.memberWhatsapp && loan.memberWhatsapp.includes(q)) ||
        loan.loanNumber.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all' ||
        loan.status === statusFilter ||
        (statusFilter === 'circulando' && (loan.status === 'activo' || loan.status === 'renovado' || loan.status === 'vencido'));

      const matchesPavilion = pavilionFilter === 'all' || loan.memberPavilion === pavilionFilter;

      return matchesSearch && matchesStatus && matchesPavilion;
    });
  }, [loans, searchQuery, statusFilter, pavilionFilter]);

  return (
    <div className="space-y-5 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <ArrowLeftRight className="w-6 h-6 text-amber-400" />
            Control de Préstamos en Pabellones
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Seguimiento de libros prestados, destinos por celda y alertas de vencimiento
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => exportLoansToCsv(loans)}
            title="Exportar historial de préstamos a CSV"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Exportar</span> CSV
          </button>

          <button
            onClick={onOpenNewLoan}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 ml-auto sm:ml-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nuevo Préstamo</span>
          </button>
        </div>
      </div>

      {/* KPI mini strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setStatusFilter('circulando')}
          className={`p-3 rounded-2xl border text-left transition-all ${
            statusFilter === 'circulando'
              ? 'bg-amber-500/15 border-amber-500/50 shadow-inner'
              : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-slate-400 block">En Pabellones</span>
          <div className="text-xl font-extrabold text-white font-mono mt-0.5">{activeCount + overdueCount}</div>
          <span className="text-[10px] text-amber-400 font-medium">Libros prestados</span>
        </button>

        <button
          onClick={() => setStatusFilter('vencido')}
          className={`p-3 rounded-2xl border text-left transition-all ${
            statusFilter === 'vencido'
              ? 'bg-rose-950/40 border-rose-500/50 shadow-inner'
              : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1 block">
            <AlertTriangle className="w-3 h-3" /> Vencidos
          </span>
          <div className="text-xl font-extrabold text-rose-400 font-mono mt-0.5">{overdueCount}</div>
          <span className="text-[10px] text-rose-300 font-medium">Requieren aviso</span>
        </button>

        <button
          onClick={() => setStatusFilter('devuelto')}
          className={`p-3 rounded-2xl border text-left transition-all ${
            statusFilter === 'devuelto'
              ? 'bg-emerald-950/40 border-emerald-500/50 shadow-inner'
              : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1 block">
            <CheckCircle2 className="w-3 h-3" /> Devueltos
          </span>
          <div className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">{returnedCount}</div>
          <span className="text-[10px] text-emerald-300 font-medium">Reingresados</span>
        </button>

        <button
          onClick={() => setStatusFilter('all')}
          className={`p-3 rounded-2xl border text-left transition-all ${
            statusFilter === 'all'
              ? 'bg-slate-800 border-slate-600 shadow-inner'
              : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Histórico</span>
          <div className="text-xl font-extrabold text-slate-200 font-mono mt-0.5">{loans.length}</div>
          <span className="text-[10px] text-slate-400 font-medium">Registros</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Main Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por N° libro, título, lector, pabellón, celda o WhatsApp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Pavilion Filter */}
          <div className="md:col-span-3">
            <select
              value={pavilionFilter}
              onChange={(e) => setPavilionFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">Todos los Pabellones ({pavilions.length})</option>
              {pavilions.map((pav) => (
                <option key={pav} value={pav}>
                  {pav}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="circulando">Activos en Pabellón (Todos)</option>
              <option value="vencido">Solo Vencidos</option>
              <option value="activo">Solo En Plazo Vigente</option>
              <option value="devuelto">Solo Devueltos</option>
              <option value="all">Ver Todo el Historial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loans List */}
      {filteredLoans.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <ArrowLeftRight className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-base text-white">No hay préstamos para mostrar</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No se encontraron préstamos que coincidan con "${searchQuery}".`
              : 'No hay registros con los filtros seleccionados.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLoans.map((loan) => {
            const isLate = loan.status === 'vencido';
            const isReturned = loan.status === 'devuelto';
            const cleanWhatsapp = loan.memberWhatsapp?.replace(/[^0-9]/g, '');

            const whatsappMessage = encodeURIComponent(
              `Hola ${loan.memberName}, te escribimos desde la Biblioteca. Tienes el libro "${loan.bookTitle}" (N° ${loan.bookNumber}) en ${loan.memberPavilion} ${loan.memberCell}. Fecha de devolución: ${loan.dueDate}. Por favor acercarlo para renovación o entrega.`
            );

            return (
              <div
                key={loan.id}
                className={`bg-slate-900 border rounded-2xl p-4 transition-all hover:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isLate
                    ? 'border-rose-900/60 bg-rose-950/10'
                    : isReturned
                    ? 'border-slate-800 opacity-75'
                    : 'border-slate-800'
                }`}
              >
                {/* Left: Book & Member Info */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-black text-sm shrink-0 border ${
                      isLate
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : isReturned
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    #{loan.bookNumber}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-white text-sm hover:underline cursor-pointer break-words">
                        {loan.bookTitle}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isLate
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : isReturned
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {loan.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Member & Location */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
                      <span className="font-bold text-white flex items-center gap-1 break-words">
                        👤 {loan.memberName}
                      </span>
                      <span className="text-cyan-300 font-bold flex items-center gap-1 break-words">
                        📍 {loan.memberPavilion} • {loan.memberCell}
                      </span>
                    </div>

                    {/* Dates */}
                    <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3">
                      <span>Prestado: {loan.loanDate}</span>
                      <span>
                        Límite:{' '}
                        <b className={isLate ? 'text-rose-400 font-bold' : 'text-amber-400'}>
                          {loan.dueDate}
                        </b>
                        {isLate && ' (¡Vencido!)'}
                      </span>
                      {isReturned && (
                        <span className="text-emerald-400 font-semibold">
                          Devuelto el {loan.returnDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Quick Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  {cleanWhatsapp && !isReturned && (
                    <a
                      href={`https://wa.me/${cleanWhatsapp}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Enviar aviso por WhatsApp"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Aviso WhatsApp</span>
                    </a>
                  )}

                  {!isReturned && (
                    <>
                      <button
                        onClick={() => onRenewLoan(loan.id)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors"
                        title="Extender plazo 7 días más"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>+7 Días</span>
                      </button>

                      <button
                        onClick={() => onOpenReturnModal(loan)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Devolver</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
