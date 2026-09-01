import React from 'react';
import {
  Library,
  BookOpen,
  ArrowLeftRight,
  AlertTriangle,
  Users,
  Printer,
  Plus,
  CheckCircle2,
  Calendar,
  Building2,
  DoorClosed,
  Phone,
  Send,
  Hash,
  HelpCircle,
  Database,
  Download,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Book, Member, Loan, LibraryStats, LibrarySettings } from '../../types/library';
import { CpuPastoralLogo } from '../common/CpuPastoralLogo';

interface DashboardViewProps {
  stats: LibraryStats;
  settings: LibrarySettings;
  books: Book[];
  members: Member[];
  loans: Loan[];
  onNavigate: (tab: string) => void;
  onOpenNewLoan: () => void;
  onOpenNewBook: () => void;
  onOpenNewMember: () => void;
  onOpenReturn: (loan?: Loan) => void;
  onSelectBook: (book: Book) => void;
  onSelectLoan: (loan: Loan) => void;
  onOpenGuide?: () => void;
  onOpenSettings?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  settings,
  books,
  members,
  loans,
  onNavigate,
  onOpenNewLoan,
  onOpenNewBook,
  onOpenNewMember,
  onOpenReturn,
  onSelectBook,
  onSelectLoan,
  onOpenGuide,
  onOpenSettings,
}) => {
  const overdueLoans = loans.filter((l) => l.status === 'vencido');
  const activeLoans = loans.filter((l) => l.status === 'activo' || l.status === 'renovado');
  const circulatingLoans = loans.filter((l) => l.status !== 'devuelto');

  // Breakdown by pavilion
  const pavilionStats = React.useMemo(() => {
    const map: Record<string, { totalMembers: number; activeLoans: number }> = {};
    members.forEach((m) => {
      const pav = m.pavilion?.trim() || 'Sin Pabellón';
      if (!map[pav]) map[pav] = { totalMembers: 0, activeLoans: 0 };
      map[pav].totalMembers += 1;
    });

    circulatingLoans.forEach((l) => {
      const pav = l.memberPavilion?.trim() || 'Sin Pabellón';
      if (!map[pav]) map[pav] = { totalMembers: 0, activeLoans: 0 };
      map[pav].activeLoans += 1;
    });

    return Object.entries(map).map(([pavilion, data]) => ({
      pavilion,
      ...data,
    })).sort((a, b) => b.activeLoans - a.activeLoans || a.pavilion.localeCompare(b.pavilion));
  }, [members, circulatingLoans]);

  // Categories breakdown
  const categoryStats = React.useMemo(() => {
    const map: Record<string, number> = {};
    books.forEach((b) => {
      const cat = b.category?.trim() || 'General';
      map[cat] = (map[cat] || 0) + (b.totalCopies || 1);
    });
    return Object.entries(map).map(([category, count]) => ({
      category,
      count,
    })).sort((a, b) => b.count - a.count);
  }, [books]);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                Biblioteca de Libros Físicos
              </div>
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-bold transition-colors"
                >
                  <span className="font-extrabold text-[11px]">fb</span>
                  <span>Facebook: @cpupastoral</span>
                </a>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {settings.libraryName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {settings.institutionName || 'Pastoral Universitaria en Contextos de Encierro - Batán'} &bull; Control de inventario por número físico, registro de lectores por pabellón y celda, circulación de préstamos y etiquetas para lomos y fichas de control.
            </p>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <button
                onClick={onOpenNewLoan}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 active:scale-95"
              >
                <ArrowLeftRight className="w-4 h-4" />
                Nuevo Préstamo
              </button>
              <button
                onClick={onOpenNewBook}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 border border-slate-700 transition-colors"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                Registrar Libro
              </button>
              <button
                onClick={onOpenNewMember}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 border border-slate-700 transition-colors"
              >
                <Users className="w-4 h-4 text-cyan-400" />
                Nuevo Lector
              </button>
              <button
                onClick={() => onNavigate('labels')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 border border-slate-700 transition-colors"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                Imprimir Etiquetas A4
              </button>
              {onOpenGuide && (
                <button
                  onClick={onOpenGuide}
                  className="px-4 py-2.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-extrabold rounded-xl text-xs sm:text-sm flex items-center gap-2 border border-amber-500/30 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  Guía de Uso
                </button>
              )}
            </div>
          </div>

          {/* Logo Badge Card */}
          <div className="hidden sm:flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-xl flex-shrink-0">
            <CpuPastoralLogo variant="badge" className="!bg-transparent !p-0 !border-0 !shadow-none" />
            <div className="mt-2 pt-2 border-t border-slate-100 w-full flex items-center justify-between text-[9px] font-bold text-slate-500">
              <span>Pastoral Universitaria</span>
              <span className="text-amber-600 font-extrabold">U.P. N° 15</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Card 1: Books & Copies */}
        <div
          onClick={() => onNavigate('catalog')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Libros en Catálogo
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Library className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">
            {stats.totalTitles}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats.totalCopies} ejemplares físicos en total
          </p>
        </div>

        {/* Card 2: Active loans in pavilions */}
        <div
          onClick={() => onNavigate('loans')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              En Pabellones
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-2">
            {stats.activeLoans}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats.availableCopies} disponibles en estantes
          </p>
        </div>

        {/* Card 3: Overdue loans */}
        <div
          onClick={() => onNavigate('loans')}
          className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 p-5 rounded-2xl cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Vencidos / Mora
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono mt-2">
            {stats.overdueLoans}
          </div>
          <p className="text-[11px] text-rose-300 mt-1 font-semibold">
            {stats.overdueLoans > 0 ? 'Requieren aviso de devolución' : 'Sin préstamos atrasados'}
          </p>
        </div>

        {/* Card 4: Readers & Pavilions */}
        <div
          onClick={() => onNavigate('members')}
          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Lectores Activos
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">
            {stats.totalMembers}
          </div>
          <p className="text-[11px] text-cyan-300 mt-1">
            En {pavilionStats.length} pabellones distintos
          </p>
        </div>
      </div>

      {/* Main Grid: Circulating Loans vs Pavilion Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Loans Currently in Pavilions (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-amber-400" />
              Libros Actualmente en Pabellones ({circulatingLoans.length})
            </h3>
            <button
              onClick={() => onNavigate('loans')}
              className="text-xs text-amber-400 hover:underline font-bold"
            >
              Ver Todos →
            </button>
          </div>

          {circulatingLoans.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-slate-950 rounded-2xl border border-slate-800/80">
              <p className="text-xs">No hay libros prestados en este momento.</p>
              <button
                onClick={onOpenNewLoan}
                className="mt-3 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors"
              >
                Registrar primer préstamo
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {circulatingLoans.slice(0, 6).map((loan) => {
                const isLate = loan.status === 'vencido';
                const member = members.find((m) => m.id === loan.memberId);
                const cleanWhatsapp = member?.whatsapp?.replace(/\D/g, '');

                return (
                  <div
                    key={loan.id}
                    className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs transition-all ${
                      isLate
                        ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                        : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-400 text-xs">
                          #{loan.bookNumber || loan.bookBarcode}
                        </span>
                        <span className="font-bold text-white truncate max-w-[180px] sm:max-w-xs">
                          {loan.bookTitle}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-200">{loan.memberName}</span>
                        <span>&bull;</span>
                        <span className="text-amber-300 font-medium">
                          {loan.memberPavilion} {loan.memberCell ? `(Celda ${loan.memberCell})` : ''}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Límite devolución:{' '}
                        <b className={isLate ? 'text-rose-400 font-bold' : 'text-amber-400'}>
                          {loan.dueDate}
                        </b>
                        {isLate && ' (¡VENCIDO!)'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                      {cleanWhatsapp && (
                        <a
                          href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                            `Hola ${loan.memberName}, recordatorio de la Biblioteca: tienes el libro "${loan.bookTitle}" (N° ${loan.bookNumber}) en ${loan.memberPavilion} ${loan.memberCell}. Fecha de devolución: ${loan.dueDate}.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 rounded-xl text-xs font-bold transition-colors"
                          title="Enviar aviso por WhatsApp"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => onOpenReturn(loan)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold transition-colors shadow-sm"
                      >
                        Devolver
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Pavilion Distribution & Categories (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pavilion Distribution */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                Lectores por Pabellón
              </h3>
              <button
                onClick={() => onNavigate('members')}
                className="text-xs text-cyan-400 hover:underline font-bold"
              >
                Ver Padrón →
              </button>
            </div>

            <div className="space-y-2">
              {pavilionStats.slice(0, 5).map((p) => (
                <div
                  key={p.pavilion}
                  className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span className="font-bold text-white">{p.pavilion}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{p.totalMembers} lectores</span>
                    <span
                      className={`font-bold font-mono px-2 py-0.5 rounded ${
                        p.activeLoans > 0
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {p.activeLoans} prestados
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              Categorías de Libros
            </h3>

            <div className="flex flex-wrap gap-2">
              {categoryStats.map((c) => (
                <span
                  key={c.category}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-1.5"
                >
                  <span className="font-semibold text-white">{c.category}</span>
                  <span className="text-amber-400 font-mono font-bold">({c.count})</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER INFO BAR: STORAGE & BACKUP STATUS */}
      <div className="p-4 sm:p-5 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Almacenamiento Local Offline Activo</span>
              <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Seguro
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Todos los datos se guardan en esta PC. Puedes exportar una copia completa en JSON o Excel en cualquier momento.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Exportar Backup</span>
            </button>
          )}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ver Guía</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
