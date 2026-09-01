import React, { useState, useMemo } from 'react';
import {
  Library,
  Search,
  Plus,
  Filter,
  Grid,
  List,
  Printer,
  ArrowLeftRight,
  BookOpen,
  Layers,
  ChevronDown,
  CheckSquare,
  Square,
  FileSpreadsheet,
  Hash,
  FolderOpen,
  Calendar,
  User,
} from 'lucide-react';
import { Book, LibrarySettings } from '../../types/library';
import { exportBooksToCsv } from '../../utils/storage';
import { getCategoryCode, parseBookIdentifier, getCategoryDefinition } from '../../utils/categoryCodes';

interface BookCatalogViewProps {
  books: Book[];
  settings: LibrarySettings;
  onOpenNewBook: () => void;
  onSelectBook: (book: Book) => void;
  onEditBook: (book: Book) => void;
  onLoanBook: (book: Book) => void;
  onPrintLabelForBook: (book: Book) => void;
  onPrintBatchLabels: (selectedBookIds: string[]) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const BookCatalogView: React.FC<BookCatalogViewProps> = ({
  books,
  settings,
  onOpenNewBook,
  onSelectBook,
  onEditBook,
  onLoanBook,
  onPrintLabelForBook,
  onPrintBatchLabels,
  searchQuery,
  setSearchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);

  // Unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(books.map((b) => b.category))).filter(Boolean);
  }, [books]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const q = searchQuery.toLowerCase().trim();
      const num = (book.bookNumber || book.barcode || '').toLowerCase();
      const catCode = getCategoryCode(book.category).toLowerCase();
      const parsed = parseBookIdentifier(num);

      const matchesSearch =
        !q ||
        num.includes(q) ||
        catCode.includes(q) ||
        parsed.categoryCode.toLowerCase().includes(q) ||
        parsed.bookNumber.toLowerCase().includes(q) ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.category.toLowerCase().includes(q) ||
        (book.publishYear && book.publishYear.toString().includes(q)) ||
        (book.notes && book.notes.toLowerCase().includes(q));

      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;

      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'disponible' && book.availableCopies > 0) ||
        (selectedStatus === 'prestado' && book.availableCopies < book.totalCopies) ||
        (selectedStatus === 'agotado' && book.availableCopies === 0);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [books, searchQuery, selectedCategory, selectedStatus]);

  // Handle batch selection
  const handleToggleSelectBook = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBookIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    if (selectedBookIds.length === filteredBooks.length && filteredBooks.length > 0) {
      setSelectedBookIds([]);
    } else {
      setSelectedBookIds(filteredBooks.map((b) => b.id));
    }
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Library className="w-6 h-6 text-amber-400" />
            Inventario de Libros
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {books.length} títulos registrados &bull; {filteredBooks.length} mostrados con identificación [Categoría + Libro]
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => exportBooksToCsv(books)}
            title="Descargar lista en Excel / CSV"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Exportar</span> CSV
          </button>

          {selectedBookIds.length > 0 && (
            <button
              onClick={() => onPrintBatchLabels(selectedBookIds)}
              className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir ({selectedBookIds.length}) Etiquetas
            </button>
          )}

          <button
            onClick={onOpenNewBook}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 active:scale-95 ml-auto sm:ml-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Nuevo Libro
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Main Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por código (ej: 01-001), título, autor, año o categoría..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
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

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 text-xs focus:outline-none"
            >
              <option value="all">Todas las Categorías ({categories.length})</option>
              {categories.map((cat) => {
                const code = getCategoryCode(cat);
                return (
                  <option key={cat} value={cat}>
                    [{code}] &bull; {cat}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3 flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 text-xs focus:outline-none"
            >
              <option value="all">Todos los Estados</option>
              <option value="disponible">Disponibles en Biblioteca</option>
              <option value="prestado">Prestados en Pabellones</option>
              <option value="agotado">Sin Copias Disponibles</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="Vista de Tarjetas"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="Vista de Lista Detallada"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Selection Toolbar */}
        {filteredBooks.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
            <button
              onClick={handleSelectAllFiltered}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              {selectedBookIds.length === filteredBooks.length && filteredBooks.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-amber-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-500" />
              )}
              <span>
                {selectedBookIds.length === filteredBooks.length && filteredBooks.length > 0
                  ? 'Deseleccionar todos'
                  : 'Seleccionar todos los visibles para imprimir'}
              </span>
            </button>

            <span>
              {selectedBookIds.length > 0 && (
                <b className="text-amber-400">{selectedBookIds.length} seleccionados</b>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Books Content */}
      {filteredBooks.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-base text-white">No se encontraron libros</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No hay resultados para "${searchQuery}". Intenta con otro término o limpia la búsqueda.`
              : 'Todavía no hay libros registrados en el inventario.'}
          </p>
          <button
            onClick={onOpenNewBook}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Registrar Primer Libro
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW: Clean typography cards with prominent Book Number */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBooks.map((book) => {
            const isSelected = selectedBookIds.includes(book.id);
            const isAvailable = book.availableCopies > 0;
            const catCode = getCategoryCode(book.category);

            return (
              <div
                key={book.id}
                onClick={() => onSelectBook(book)}
                className={`bg-slate-900 border rounded-2xl p-4 cursor-pointer transition-all hover:border-amber-500/50 hover:shadow-lg flex flex-col justify-between relative group ${
                  isSelected ? 'border-amber-500 bg-slate-900/90 ring-1 ring-amber-500' : 'border-slate-800'
                }`}
              >
                {/* Select checkbox */}
                <button
                  type="button"
                  onClick={(e) => handleToggleSelectBook(book.id, e)}
                  className="absolute top-3 right-3 p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white z-10"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                  )}
                </button>

                {/* Top Section: Book Number & Category */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 pr-6">
                    <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 font-mono font-black text-sm flex items-center justify-center shrink-0 shadow-inner">
                      {book.bookNumber || book.barcode}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 truncate max-w-[100px] sm:max-w-[140px] font-mono">
                      [{catCode}] {book.category}
                    </span>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h3 className="font-extrabold text-white text-sm line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors break-words">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium truncate mt-0.5 break-words">
                      {book.author}
                    </p>
                  </div>
                </div>

                {/* Bottom Section: Year & Stock Info & Actions */}
                <div className="pt-3 mt-3 border-t border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Año {book.publishYear}
                    </span>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isAvailable
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {isAvailable ? `${book.availableCopies} de ${book.totalCopies} disp.` : 'Prestado'}
                    </span>
                  </div>

                  {/* Quick Card Action Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPrintLabelForBook(book);
                      }}
                      className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors border border-slate-700"
                    >
                      <Printer className="w-3 h-3 text-amber-400" />
                      Lomo / Ficha
                    </button>

                    <button
                      type="button"
                      disabled={!isAvailable}
                      onClick={(e) => {
                        e.stopPropagation();
                        onLoanBook(book);
                      }}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors ${
                        isAvailable
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
                          : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      <ArrowLeftRight className="w-3 h-3" />
                      Prestar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW: Dense list for catalog managers */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3 w-10 text-center">Sel.</th>
                  <th className="p-3">Código Lomo</th>
                  <th className="p-3">Título</th>
                  <th className="p-3">Autor</th>
                  <th className="p-3">Categoría</th>
                  <th className="p-3">Año</th>
                  <th className="p-3 text-center">Disponibles</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filteredBooks.map((book) => {
                  const isSelected = selectedBookIds.includes(book.id);
                  const isAvailable = book.availableCopies > 0;
                  const catCode = getCategoryCode(book.category);

                  return (
                    <tr
                      key={book.id}
                      onClick={() => onSelectBook(book)}
                      className={`hover:bg-slate-800/60 cursor-pointer transition-colors ${
                        isSelected ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <td className="p-3 text-center" onClick={(e) => handleToggleSelectBook(book.id, e)}>
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-amber-400 mx-auto" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 hover:text-slate-400 mx-auto" />
                        )}
                      </td>
                      <td className="p-3 font-mono font-extrabold text-amber-400">
                        <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800">
                          {book.bookNumber || book.barcode}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-white max-w-xs truncate">
                        {book.title}
                      </td>
                      <td className="p-3 text-slate-300 max-w-xs truncate">
                        {book.author}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold font-mono">
                          [{catCode}] {book.category}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-400">
                        {book.publishYear}
                      </td>
                      <td className="p-3 text-center font-bold">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] ${
                            isAvailable
                              ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {book.availableCopies} / {book.totalCopies}
                        </span>
                      </td>
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onPrintLabelForBook(book)}
                            title="Imprimir etiquetas"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={!isAvailable}
                            onClick={() => onLoanBook(book)}
                            title="Prestar"
                            className={`p-1.5 rounded-lg font-bold ${
                              isAvailable
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                            }`}
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
