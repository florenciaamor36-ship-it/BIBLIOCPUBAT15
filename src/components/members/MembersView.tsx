import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Building2,
  DoorClosed,
  Phone,
  ArrowLeftRight,
  User,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Send,
  Hash,
} from 'lucide-react';
import { Member, LibrarySettings } from '../../types/library';
import { exportMembersToCsv } from '../../utils/storage';

interface MembersViewProps {
  members: Member[];
  settings: LibrarySettings;
  onOpenNewMember: () => void;
  onSelectMember: (member: Member) => void;
  onEditMember: (member: Member) => void;
  onNewLoanForMember: (member: Member) => void;
}

export const MembersView: React.FC<MembersViewProps> = ({
  members,
  settings,
  onOpenNewMember,
  onSelectMember,
  onEditMember,
  onNewLoanForMember,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPavilion, setSelectedPavilion] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Unique list of pavilions
  const pavilions = useMemo(() => {
    const list: string[] = [];
    members.forEach((m) => {
      const p = m.pavilion?.trim();
      if (p && !list.includes(p)) list.push(p);
    });
    return list.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        (m.pavilion && m.pavilion.toLowerCase().includes(q)) ||
        (m.cell && m.cell.toLowerCase().includes(q)) ||
        (m.whatsapp && m.whatsapp.includes(q)) ||
        (m.memberNumber && m.memberNumber.toLowerCase().includes(q));

      const matchesPavilion = selectedPavilion === 'all' || m.pavilion === selectedPavilion;
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;

      return matchesSearch && matchesPavilion && matchesStatus;
    });
  }, [members, searchQuery, selectedPavilion, statusFilter]);

  return (
    <div className="space-y-5 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-cyan-400" />
            Padrón de Lectores por Pabellón
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {filteredMembers.length} de {members.length} lectores registrados con asignación de pabellón y celda
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => exportMembersToCsv(members)}
            title="Exportar padrón a CSV"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Exportar</span> CSV
          </button>

          <button
            onClick={onOpenNewMember}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95 ml-auto sm:ml-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nuevo Lector</span>
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Main Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre completo, pabellón, celda o WhatsApp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
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
              value={selectedPavilion}
              onChange={(e) => setSelectedPavilion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">Todos los Pabellones ({pavilions.length})</option>
              {pavilions.map((pav) => (
                <option key={pav} value={pav}>
                  {pav}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">Todos los Estados</option>
              <option value="activo">Activos (Habilitados)</option>
              <option value="suspendido">Suspendidos / Con Deuda</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Grid / Cards */}
      {filteredMembers.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-base text-white">No se encontraron lectores</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No hay lectores registrados que coincidan con "${searchQuery}".`
              : 'Todavía no hay lectores registrados en el sistema.'}
          </p>
          <button
            onClick={onOpenNewMember}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Registrar Primer Lector
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const hasLoans = member.currentLoansCount > 0;
            const cleanWhatsapp = member.whatsapp?.replace(/[^0-9]/g, '');

            return (
              <div
                key={member.id}
                onClick={() => onSelectMember(member)}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-lg flex flex-col justify-between space-y-3 group"
              >
                {/* Header: Name & Status */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
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

                  <h3 className="font-extrabold text-white text-sm group-hover:text-cyan-300 transition-colors">
                    {member.name}
                  </h3>
                </div>

                {/* Location: Pavilion & Cell */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-amber-400" />
                      Pabellón
                    </span>
                    <span className="font-bold text-white truncate block">
                      {member.pavilion}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block flex items-center gap-1">
                      <DoorClosed className="w-3 h-3 text-cyan-400" />
                      Celda
                    </span>
                    <span className="font-bold text-cyan-300 truncate block">
                      {member.cell}
                    </span>
                  </div>
                </div>

                {/* WhatsApp & Loans count */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  {member.whatsapp ? (
                    <a
                      href={`https://wa.me/${cleanWhatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-emerald-400 hover:text-emerald-300 font-mono font-bold text-[11px] flex items-center gap-1 hover:underline"
                    >
                      <Phone className="w-3 h-3" />
                      {member.whatsapp}
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">Sin WhatsApp</span>
                  )}

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      hasLoans
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {member.currentLoansCount} libro{member.currentLoansCount !== 1 ? 's' : ''} en celda
                  </span>
                </div>

                {/* Card Action */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNewLoanForMember(member);
                    }}
                    className="w-full py-2 bg-slate-800 hover:bg-cyan-500 text-slate-200 hover:text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>Prestar Libro a este Lector</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
