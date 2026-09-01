import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeftRight,
  Search,
  User,
  BookOpen,
  Calendar,
  Building2,
  DoorClosed,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Hash,
} from 'lucide-react';
import { Book, Member, Loan, LibrarySettings } from '../../types/library';

interface NewLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  members: Member[];
  settings: LibrarySettings;
  preselectedBook?: Book | null;
  preselectedMember?: Member | null;
  onRegisterLoan: (newLoan: Loan) => void;
}

export const NewLoanModal: React.FC<NewLoanModalProps> = ({
  isOpen,
  onClose,
  books,
  members,
  settings,
  preselectedBook,
  preselectedMember,
  onRegisterLoan,
}) => {
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [loanDays, setLoanDays] = useState<number>(settings.defaultLoanDays || 14);
  const [customDueDate, setCustomDueDate] = useState<string>('');
  const [loanNotes, setLoanNotes] = useState<string>('');

  const [bookSearch, setBookSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');

  useEffect(() => {
    if (preselectedBook) {
      setSelectedBookId(preselectedBook.id);
    } else {
      setSelectedBookId('');
    }

    if (preselectedMember) {
      setSelectedMemberId(preselectedMember.id);
    } else {
      setSelectedMemberId('');
    }

    const d = new Date();
    d.setDate(d.getDate() + (settings.defaultLoanDays || 14));
    setCustomDueDate(d.toISOString().split('T')[0]);
    setLoanDays(settings.defaultLoanDays || 14);
    setBookSearch('');
    setMemberSearch('');
    setLoanNotes('');
  }, [preselectedBook, preselectedMember, isOpen, settings.defaultLoanDays]);

  const selectedBook = books.find((b) => b.id === selectedBookId);
  const selectedMember = members.find((m) => m.id === selectedMemberId);

  // Filter books with available copies
  const availableBooks = books.filter((b) => {
    const q = bookSearch.toLowerCase().trim();
    const num = (b.bookNumber || b.barcode || '').toLowerCase();
    const matchesSearch =
      !q ||
      num.includes(q) ||
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q);
    return matchesSearch && b.availableCopies > 0;
  });

  // Filter active members
  const availableMembers = members.filter((m) => {
    const q = memberSearch.toLowerCase().trim();
    return (
      !q ||
      m.name.toLowerCase().includes(q) ||
      (m.pavilion && m.pavilion.toLowerCase().includes(q)) ||
      (m.cell && m.cell.toLowerCase().includes(q)) ||
      (m.whatsapp && m.whatsapp.includes(q))
    );
  });

  const handleLoanDaysChange = (days: number) => {
    setLoanDays(days);
    const d = new Date();
    d.setDate(d.getDate() + days);
    setCustomDueDate(d.toISOString().split('T')[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || !selectedMember) {
      alert('Por favor selecciona un libro disponible y un lector.');
      return;
    }

    if (selectedBook.availableCopies <= 0) {
      alert('Este libro no tiene ejemplares disponibles para préstamo.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const loanNum = `PREST-${Date.now().toString().slice(-4)}`;

    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      loanNumber: loanNum,
      bookId: selectedBook.id,
      bookNumber: selectedBook.bookNumber || selectedBook.barcode,
      bookTitle: selectedBook.title,
      bookAuthor: selectedBook.author,
      bookCategory: selectedBook.category,
      bookBarcode: selectedBook.barcode || selectedBook.bookNumber,
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      memberPavilion: selectedMember.pavilion || 'Sin Pabellón',
      memberCell: selectedMember.cell || 'Sin Celda',
      memberWhatsapp: selectedMember.whatsapp || '',
      loanDate: todayStr,
      dueDate: customDueDate || todayStr,
      status: 'activo',
      renewalsCount: 0,
      notes: loanNotes.trim() || undefined,
    };

    onRegisterLoan(newLoan);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Registrar Préstamo de Libro
              </h3>
              <p className="text-xs text-slate-400">
                Asignación de ejemplar físico a lector con destino a pabellón y celda
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

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* STEP 1: SELECT BOOK */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <label className="block text-xs font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-amber-400">
                <BookOpen className="w-4 h-4" />
                1. Seleccionar Libro a Prestar *
              </span>
              {selectedBook && (
                <span className="text-emerald-400 font-bold">
                  ✓ {selectedBook.availableCopies} ejemplar(es) disp.
                </span>
              )}
            </label>

            {!preselectedBook && (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrar por N° de libro, título o autor..."
                    value={bookSearch}
                    onChange={(e) => setBookSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none"
                  />
                </div>

                {bookSearch.trim().length > 0 && availableBooks.length > 0 && !selectedBookId && (
                  <div className="max-h-36 overflow-y-auto space-y-1 bg-slate-900 p-2 rounded-xl border border-slate-700">
                    {availableBooks.slice(0, 5).map((b) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          setSelectedBookId(b.id);
                          setBookSearch('');
                        }}
                        className="p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-extrabold text-amber-400 font-mono mr-2">
                            #{b.bookNumber || b.barcode}
                          </span>
                          <span className="font-bold text-white truncate">{b.title}</span>
                          <span className="text-slate-400 block text-[10px]">
                            {b.author} • {b.category}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold shrink-0">
                          {b.availableCopies} disp.
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Book Selector dropdown */}
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white font-medium text-xs focus:outline-none"
            >
              <option value="">-- Elige un libro del catálogo --</option>
              {availableBooks.map((b) => (
                <option key={b.id} value={b.id}>
                  #{b.bookNumber || b.barcode} - {b.title} ({b.author}) [{b.availableCopies} disp.]
                </option>
              ))}
            </select>

            {selectedBook && (
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 flex items-center justify-between">
                <div>
                  <span className="font-mono font-black text-sm mr-2">
                    Nº {selectedBook.bookNumber || selectedBook.barcode}
                  </span>
                  <span className="font-bold text-white">{selectedBook.title}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Autor: {selectedBook.author} • {selectedBook.category} (Año {selectedBook.publishYear})
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: SELECT READER */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <label className="block text-xs font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <User className="w-4 h-4" />
                2. Seleccionar Lector (Pabellón y Celda) *
              </span>
              {selectedMember && (
                <span className="text-cyan-300 font-bold">
                  {selectedMember.pavilion} • {selectedMember.cell}
                </span>
              )}
            </label>

            {!preselectedMember && (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrar por nombre del lector, pabellón o celda..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none"
                  />
                </div>

                {memberSearch.trim().length > 0 && availableMembers.length > 0 && !selectedMemberId && (
                  <div className="max-h-36 overflow-y-auto space-y-1 bg-slate-900 p-2 rounded-xl border border-slate-700">
                    {availableMembers.slice(0, 5).map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setSelectedMemberId(m.id);
                          setMemberSearch('');
                        }}
                        className="p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div>
                          <span className="font-bold text-white block">{m.name}</span>
                          <span className="text-cyan-400 text-[10px] font-bold">
                            {m.pavilion} • {m.cell}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {m.currentLoansCount} libros
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Member Selector dropdown */}
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl text-white font-medium text-xs focus:outline-none"
            >
              <option value="">-- Elige un lector --</option>
              {availableMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.pavilion} - {m.cell}) [{m.currentLoansCount} libros en celda]
                </option>
              ))}
            </select>

            {selectedMember && (
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-300 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-white text-xs block">
                    {selectedMember.name}
                  </span>
                  <span className="text-[10px] text-cyan-300 font-bold block mt-0.5">
                    📍 {selectedMember.pavilion} • {selectedMember.cell}
                  </span>
                </div>
                {selectedMember.whatsapp && (
                  <span className="text-[10px] text-emerald-400 font-mono">
                    WA: {selectedMember.whatsapp}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* STEP 3: DURATION & DUE DATE */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <label className="block text-xs font-bold text-white flex items-center gap-1.5 text-amber-400">
              <Calendar className="w-4 h-4" />
              3. Plazo y Fecha de Devolución
            </label>

            <div className="grid grid-cols-4 gap-2 pt-1">
              {[7, 14, 21, 30].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => handleLoanDaysChange(days)}
                  className={`py-2 rounded-xl font-extrabold text-xs transition-all ${
                    loanDays === days
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {days} Días
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-[11px] text-slate-400 font-bold mb-1">
                Fecha Límite de Devolución
              </label>
              <input
                type="date"
                required
                value={customDueDate}
                onChange={(e) => {
                  setCustomDueDate(e.target.value);
                  setLoanDays(0);
                }}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white font-bold text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">
              Notas u Observaciones del Préstamo (Opcional)
            </label>
            <input
              type="text"
              value={loanNotes}
              onChange={(e) => setLoanNotes(e.target.value)}
              placeholder="ej: Retirado para estudio, en buen estado..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 border-t border-slate-800 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedBookId || !selectedMemberId}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Confirmar Préstamo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
