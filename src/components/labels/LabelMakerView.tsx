import React, { useState, useMemo } from 'react';
import {
  Printer,
  Tag,
  FileText,
  Layers,
  Search,
  CheckSquare,
  Square,
  Sliders,
  Sparkles,
  BookOpen,
  Hash,
  RotateCcw,
  Info,
  Maximize2,
  Minimize2,
  Scissors,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FolderOpen,
} from 'lucide-react';
import { Book, Member, LibrarySettings } from '../../types/library';
import { SpineLabelTag } from '../common/SpineLabelTag';
import { PocketDueSlip } from '../common/PocketDueSlip';
import {
  CATEGORY_DEFINITIONS,
  getCategoryCode,
  formatBookIdentifier,
  parseBookIdentifier,
} from '../../utils/categoryCodes';

export type LabelType = 'combo_2_per_page' | 'combo_4_per_page' | 'spine' | 'pocket_slip';

interface LabelMakerViewProps {
  books: Book[];
  members: Member[];
  settings: LibrarySettings;
  preselectedBookIds?: string[];
}

export const LabelMakerView: React.FC<LabelMakerViewProps> = ({
  books,
  members,
  settings,
  preselectedBookIds = [],
}) => {
  const [labelType, setLabelType] = useState<LabelType>('combo_2_per_page');
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>(
    preselectedBookIds.length > 0 ? preselectedBookIds : books.slice(0, 6).map((b) => b.id)
  );

  // Batch Range Mode (Generate structured labels e.g. 01-001 to 01-020)
  const [isRangeMode, setIsRangeMode] = useState(false);
  const [rangeCategoryCode, setRangeCategoryCode] = useState<string>('01');
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(20);
  const [rangeDigits, setRangeDigits] = useState<3 | 4>(3);
  const [rangeUseHyphen, setRangeUseHyphen] = useState<boolean>(true);

  const [bookSearch, setBookSearch] = useState('');
  const [showCategoryGuide, setShowCategoryGuide] = useState(false);

  // Get Category Name for Range
  const rangeCategoryDef = useMemo(() => {
    return CATEGORY_DEFINITIONS.find((c) => c.code === rangeCategoryCode) || CATEGORY_DEFINITIONS[0];
  }, [rangeCategoryCode]);

  // Books to render
  const selectedBooks = useMemo(() => {
    if (isRangeMode) {
      const generated: Book[] = [];
      const start = Math.max(1, rangeStart);
      const end = Math.max(start, Math.min(start + 100, rangeEnd));
      for (let i = start; i <= end; i++) {
        const code = formatBookIdentifier(rangeCategoryCode, i, rangeDigits, rangeUseHyphen);
        generated.push({
          id: `range-${rangeCategoryCode}-${i}`,
          bookNumber: code,
          barcode: code,
          title: `LIBRO N° ${code}`,
          author: 'BIBLIOTECA CPU',
          category: rangeCategoryDef.name,
          publishYear: new Date().getFullYear(),
          totalCopies: 1,
          availableCopies: 1,
          status: 'disponible',
          copiesList: [],
        });
      }
      return generated;
    }
    return books.filter((b) => selectedBookIds.includes(b.id));
  }, [books, selectedBookIds, isRangeMode, rangeCategoryCode, rangeStart, rangeEnd, rangeDigits, rangeUseHyphen, rangeCategoryDef]);

  const handleToggleSelectBook = (id: string) => {
    setSelectedBookIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedBookIds.length === books.length) {
      setSelectedBookIds([]);
    } else {
      setSelectedBookIds(books.map((b) => b.id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate estimated A4 sheets
  const estimatedSheets = useMemo(() => {
    const count = selectedBooks.length;
    if (count === 0) return 0;
    if (labelType === 'combo_2_per_page') return Math.ceil(count / 2);
    if (labelType === 'combo_4_per_page') return Math.ceil(count / 4);
    if (labelType === 'spine') return Math.ceil(count / 16);
    if (labelType === 'pocket_slip') return Math.ceil(count / 4);
    return 1;
  }, [selectedBooks.length, labelType]);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
              <Printer className="w-6 h-6 text-amber-400" />
              Impresión de Etiquetas y Fichas en Hoja A4
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Formato A4 Optimizado
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Etiquetas con código de identificación estructurado (<b>2 Dígitos Categoría + 3/4 Dígitos Libro</b>).
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowCategoryGuide(!showCategoryGuide)}
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <FolderOpen className="w-4 h-4 text-amber-400" />
            <span>{showCategoryGuide ? 'Ocultar Códigos' : 'Ver Tabla de Categorías'}</span>
            {showCategoryGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex-1 sm:flex-none justify-center"
          >
            <Printer className="w-4 h-4 stroke-[3]" />
            <span>Imprimir ({estimatedSheets} {estimatedSheets === 1 ? 'Hoja A4' : 'Hojas A4'})</span>
          </button>
        </div>
      </div>

      {/* CATEGORY REFERENCE TABLE COLLAPSIBLE */}
      {showCategoryGuide && (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl print:hidden animate-fade-in space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Tabla Oficial de Códigos de Categoría (2 Dígitos)
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">
              Los 2 primeros números del lomo identifican la temática
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
            {CATEGORY_DEFINITIONS.map((cat) => (
              <div
                key={cat.code}
                className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-black text-sm flex items-center justify-center border border-amber-500/30 shrink-0">
                  {cat.code}
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-white block truncate">{cat.name}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{cat.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* A4 DIMENSION EXPLANATION BOX */}
      <div className="p-4 bg-slate-900 border border-amber-500/30 rounded-2xl print:hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Scissors className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              Medidas Físicas y Distribución en Hoja A4 (210 mm × 297 mm)
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono">
                🏷️ <b>Etiqueta de Lomo:</b> 45 mm × 58 mm (Con código [01-001] y categoría destacados)
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono">
                📄 <b>Ficha Interior:</b> 80 mm × 125 mm (Membrete Pastoral + 9 casilleros)
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-center shrink-0 w-full md:w-auto">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
            Rendimiento Seleccionado
          </span>
          <span className="text-sm font-black text-amber-400 font-mono">
            {labelType === 'combo_2_per_page' && '2 Libros por Hoja A4'}
            {labelType === 'combo_4_per_page' && '4 Libros por Hoja A4'}
            {labelType === 'spine' && '16 a 20 Lomos por Hoja A4'}
            {labelType === 'pocket_slip' && '4 Fichas por Hoja A4'}
          </span>
        </div>
      </div>

      {/* Control Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 print:hidden">
        {/* Left: Label Type Selection */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <Sliders className="w-4 h-4" />
            1. Formato y Distribución A4
          </h3>

          <div className="space-y-2">
            {[
              {
                id: 'combo_2_per_page',
                name: '✨ 2 Libros por Hoja A4 (Kit Estándar Recomendado)',
                desc: 'Cada libro incluye su Etiqueta de Lomo + Ficha Interior de Préstamo con líneas de recorte guías. Ideal para uso cómodo.',
                badge: '2 por Hoja A4',
              },
              {
                id: 'combo_4_per_page',
                name: '⚡ 4 Libros por Hoja A4 (Kit Compacto Económico)',
                desc: 'Organiza 4 libros completos (Lomo + Ficha interior) en 2 columnas para máximo ahorro de papel.',
                badge: '4 por Hoja A4',
              },
              {
                id: 'spine',
                name: '🏷️ Solo Etiquetas de Lomo (Número Grande)',
                desc: 'Para rotular exclusivamente el canto/lomo de los libros. Entran hasta 16 a 20 por hoja A4.',
                badge: '16 por Hoja A4',
              },
              {
                id: 'pocket_slip',
                name: '📄 Solo Fichas Interiores de Préstamos',
                desc: 'Papeletas con membrete CPU Pastoral y cuadrícula de fechas, lector, pabellón y celda. Entran 4 por hoja.',
                badge: '4 por Hoja A4',
              },
            ].map((type) => {
              const isSelected = labelType === type.id;
              return (
                <div
                  key={type.id}
                  onClick={() => setLabelType(type.id as LabelType)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold text-xs ${
                        isSelected ? 'text-amber-300 font-extrabold' : 'text-slate-200'
                      }`}
                    >
                      {type.name}
                    </span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 shrink-0 ml-1">
                      {type.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {type.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mode switch: Books from Catalog vs Number Range */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300">
                Origen de los datos:
              </span>
              <button
                type="button"
                onClick={() => setIsRangeMode(!isRangeMode)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  isRangeMode
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {isRangeMode ? '🔢 Rango Correlativo' : '📚 Libros del Catálogo'}
              </button>
            </div>
          </div>
        </div>

        {/* Middle & Right: Selection or Number Range Configurator */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-amber-400 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                2. {isRangeMode ? 'Generador por Rango y Categoría (2+3/4 Dígitos)' : 'Selección de Libros a Imprimir'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {selectedBooks.length} libros listos &bull; ~{estimatedSheets} {estimatedSheets === 1 ? 'Hoja A4' : 'Hojas A4'}
              </span>
            </h3>

            {isRangeMode ? (
              <div className="space-y-4 pt-3 text-xs">
                <p className="text-slate-300">
                  Genera una tirada correlativa según el formato oficial: <b>[2 dígitos categoría] + [3 o 4 dígitos identificativos del libro]</b>:
                </p>

                {/* Range Category Selector */}
                <div>
                  <label className="block text-slate-400 font-bold mb-1">
                    Categoría (Prefijo de 2 Dígitos):
                  </label>
                  <select
                    value={rangeCategoryCode}
                    onChange={(e) => setRangeCategoryCode(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold text-xs focus:outline-none focus:border-amber-400"
                  >
                    {CATEGORY_DEFINITIONS.map((cat) => (
                      <option key={cat.code} value={cat.code}>
                        [{cat.code}] &bull; {cat.name} ({cat.description})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">
                      N° Correlativo Inicial
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={rangeStart}
                      onChange={(e) => setRangeStart(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">
                      N° Correlativo Final
                    </label>
                    <input
                      type="number"
                      min={rangeStart}
                      max={rangeStart + 100}
                      value={rangeEnd}
                      onChange={(e) => setRangeEnd(parseInt(e.target.value) || rangeStart)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">
                      Dígitos Identificador
                    </label>
                    <select
                      value={rangeDigits}
                      onChange={(e) => setRangeDigits(Number(e.target.value) as 3 | 4)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold text-xs focus:outline-none"
                    >
                      <option value={3}>3 dígitos (ej: 001)</option>
                      <option value={4}>4 dígitos (ej: 0001)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">
                      Separador
                    </label>
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 h-[38px]">
                      <button
                        type="button"
                        onClick={() => setRangeUseHyphen(true)}
                        className={`flex-1 py-1 rounded text-[11px] font-mono font-bold ${
                          rangeUseHyphen ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                        }`}
                      >
                        01-001
                      </button>
                      <button
                        type="button"
                        onClick={() => setRangeUseHyphen(false)}
                        className={`flex-1 py-1 rounded text-[11px] font-mono font-bold ${
                          !rangeUseHyphen ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                        }`}
                      >
                        01001
                      </button>
                    </div>
                  </div>
                </div>

                {/* Example sample indicator */}
                <div className="p-2.5 bg-slate-950 rounded-xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
                  <span className="text-slate-400">
                    Se generarán códigos desde: <b className="text-amber-400 font-mono">{formatBookIdentifier(rangeCategoryCode, rangeStart, rangeDigits, rangeUseHyphen)}</b> hasta <b className="text-amber-400 font-mono">{formatBookIdentifier(rangeCategoryCode, rangeEnd, rangeDigits, rangeUseHyphen)}</b>
                  </span>
                  <span className="text-white font-bold shrink-0">
                    Total: {Math.max(1, rangeEnd - rangeStart + 1)} etiquetas
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                {/* Search in catalog */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filtrar por código (ej: 01-001), título, autor o categoría..."
                      value={bookSearch}
                      onChange={(e) => setBookSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold shrink-0"
                  >
                    {selectedBookIds.length === books.length
                      ? 'Deseleccionar Todos'
                      : 'Seleccionar Todos'}
                  </button>
                </div>

                {/* Books list scroll */}
                <div className="max-h-48 overflow-y-auto space-y-1 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  {books
                    .filter((b) => {
                      const q = bookSearch.toLowerCase().trim();
                      const num = (b.bookNumber || b.barcode || '').toLowerCase();
                      return (
                        !q ||
                        num.includes(q) ||
                        b.title.toLowerCase().includes(q) ||
                        b.category.toLowerCase().includes(q) ||
                        b.author.toLowerCase().includes(q)
                      );
                    })
                    .map((book) => {
                      const isSelected = selectedBookIds.includes(book.id);
                      const catCode = getCategoryCode(book.category);
                      return (
                        <div
                          key={book.id}
                          onClick={() => handleToggleSelectBook(book.id)}
                          className={`p-2 rounded-lg flex items-center justify-between cursor-pointer text-xs transition-colors ${
                            isSelected ? 'bg-amber-500/10 text-white' : 'text-slate-400 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-amber-400 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-600 shrink-0" />
                            )}
                            <span className="font-mono font-black text-amber-400 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                              {book.bookNumber || book.barcode}
                            </span>
                            <span className="font-semibold text-white truncate">
                              {book.title}
                            </span>
                          </div>

                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0 ml-2 font-mono">
                            [{catCode}] {book.category}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="text-slate-400 text-center sm:text-left">
              Seleccionados <b>{selectedBooks.length}</b> libros &rarr; Requiere aproximadamente <b>{estimatedSheets}</b> {estimatedSheets === 1 ? 'hoja A4' : 'hojas A4'}.
            </span>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all shadow-md shadow-amber-500/20 w-full sm:w-auto"
            >
              Imprimir Ahora (Ctrl + P)
            </button>
          </div>
        </div>
      </div>

      {/* PRINTABLE PREVIEW CANVAS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 sm:p-6 space-y-4 print:p-0 print:border-0 print:bg-white print:m-0 w-full max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 border-b border-slate-800 pb-3 print:hidden">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            Vista Previa de Hoja A4 ({selectedBooks.length} libros &bull; ~{estimatedSheets} hojas)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Papel A4 Estándar (210mm × 297mm)
          </span>
        </div>

        {selectedBooks.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
            <p className="text-sm">Selecciona al menos un libro para generar sus etiquetas.</p>
          </div>
        ) : (
          <div className="w-full max-w-full overflow-x-auto bg-slate-950/80 p-2 sm:p-6 rounded-2xl border border-slate-800 flex flex-col items-center print:p-0 print:bg-transparent print:border-0 print:overflow-visible">
            {/* Mobile swipe helper */}
            <div className="sm:hidden text-center text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl py-1 px-2.5 mb-3 font-semibold flex items-center justify-center gap-1.5 w-full">
              <span>↔️ Desliza horizontalmente para ver la hoja A4 completa</span>
            </div>

            {/* RENDER ACCORDING TO LABEL TYPE */}

            {/* FORMAT 1: 2 BOOKS PER A4 PAGE (STANDARD COMFORTABLE KIT) */}
            {labelType === 'combo_2_per_page' && (
              <div className="min-w-[560px] sm:min-w-0 w-full max-w-[210mm] print-sheet space-y-6 print:min-w-0 print:w-full print:overflow-hidden print:space-y-0 print:m-0">
                {/* Chunk books into groups of 2 per A4 sheet */}
                {Array.from({ length: Math.ceil(selectedBooks.length / 2) }).map((_, sheetIndex) => {
                  const sheetBooks = selectedBooks.slice(sheetIndex * 2, sheetIndex * 2 + 2);
                  return (
                    <div
                      key={`sheet-${sheetIndex}`}
                      className="bg-white text-black p-4 rounded-xl border border-neutral-300 shadow-xl print:shadow-none print:border-0 print:p-2 print:m-0 print:page-break-after-always"
                      style={{
                        minHeight: '275mm',
                        boxSizing: 'border-box',
                        pageBreakAfter: sheetIndex < estimatedSheets - 1 ? 'always' : 'auto',
                      }}
                    >
                      {/* Sheet Header indicator for print */}
                      <div className="border-b border-dashed border-neutral-400 pb-1 mb-3 flex items-center justify-between text-[8px] font-mono text-neutral-500 uppercase">
                        <span>CPU BATÁN U.P. 15 &bull; KIT DE IDENTIFICACIÓN (LOMO + FICHA)</span>
                        <span>HOJA A4 N° {sheetIndex + 1} DE {estimatedSheets} &bull; 2 LIBROS POR HOJA</span>
                      </div>

                      {/* 2 Book Kits vertically */}
                      <div className="space-y-4">
                        {sheetBooks.map((book) => (
                          <div
                            key={book.id}
                            className="p-3 bg-white rounded-lg border-2 border-dashed border-neutral-400 flex flex-row items-stretch justify-start gap-4 print:p-2 print:border-neutral-400 print:page-break-inside-avoid relative"
                          >
                            {/* Cut guide badge */}
                            <div className="absolute -top-2.5 left-4 bg-black text-white px-2 py-0.2 rounded text-[8px] font-mono font-bold flex items-center gap-1">
                              <span>CÓDIGO: {book.bookNumber || book.barcode}</span>
                              <span>&bull;</span>
                              <span>CORTAR POR LA LÍNEA DE PUNTOS</span>
                            </div>

                            {/* Left: Spine Tag */}
                            <div className="shrink-0 flex flex-col items-center">
                              <SpineLabelTag book={book} libraryName={settings.libraryName} />
                              <span className="text-[7.5px] font-bold text-neutral-500 mt-1 uppercase text-center">
                                ✂️ Pegar en Lomo
                              </span>
                            </div>

                            {/* Right: Pocket Due Slip */}
                            <div className="flex-1 flex flex-col min-w-0">
                              <PocketDueSlip book={book} libraryName={settings.libraryName} logoUrl={settings.logoUrl} />
                              <span className="text-[7.5px] font-bold text-neutral-500 mt-1 uppercase text-center">
                                ✂️ Pegar en Contratapa Interior
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* FORMAT 2: 4 BOOKS PER A4 PAGE (COMPACT 2 COLUMNS) */}
            {labelType === 'combo_4_per_page' && (
              <div className="min-w-[560px] sm:min-w-0 w-full max-w-[210mm] print-sheet space-y-6 print:min-w-0 print:w-full print:overflow-hidden print:space-y-0 print:m-0">
                {Array.from({ length: Math.ceil(selectedBooks.length / 4) }).map((_, sheetIndex) => {
                  const sheetBooks = selectedBooks.slice(sheetIndex * 4, sheetIndex * 4 + 4);
                  return (
                    <div
                      key={`sheet-compact-${sheetIndex}`}
                      className="bg-white text-black p-3 rounded-xl border border-neutral-300 shadow-xl print:shadow-none print:border-0 print:p-1 print:m-0 print:page-break-after-always"
                      style={{
                        minHeight: '275mm',
                        boxSizing: 'border-box',
                        pageBreakAfter: sheetIndex < estimatedSheets - 1 ? 'always' : 'auto',
                      }}
                    >
                      <div className="border-b border-dashed border-neutral-400 pb-1 mb-2 flex items-center justify-between text-[8px] font-mono text-neutral-500 uppercase">
                        <span>CPU BATÁN U.P. 15 &bull; KIT COMPACTO (4 LIBROS POR HOJA)</span>
                        <span>HOJA A4 N° {sheetIndex + 1} DE {estimatedSheets}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {sheetBooks.map((book) => (
                          <div
                            key={book.id}
                            className="p-2 bg-white rounded-lg border-2 border-dashed border-neutral-400 flex flex-col gap-2 print:border-neutral-400 print:page-break-inside-avoid relative"
                          >
                            <div className="text-[8px] font-mono font-bold text-black border-b border-neutral-300 pb-0.5 flex justify-between">
                              <span>CÓDIGO: {book.bookNumber || book.barcode}</span>
                              <span className="truncate max-w-[90px]">{book.category}</span>
                            </div>

                            <div className="flex gap-2 items-start">
                              <div className="w-1/3">
                                <SpineLabelTag book={book} libraryName="CPU BATÁN" className="w-full min-h-[42mm] p-1.5 text-[8px]" />
                              </div>
                              <div className="w-2/3">
                                <PocketDueSlip book={book} libraryName="CPU BATÁN" logoUrl={settings.logoUrl} className="w-full min-h-[58mm] p-2 text-[8px]" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* FORMAT 3: GRID OF SPINE LABELS (16 to 20 per A4 page) */}
            {labelType === 'spine' && (
              <div className="min-w-[560px] sm:min-w-0 w-full max-w-[210mm] print-sheet bg-white text-black p-4 rounded-xl border border-neutral-300 shadow-xl print:min-w-0 print:w-full print:overflow-hidden print:shadow-none print:border-0 print:p-1 print:m-0">
                <div className="border-b border-dashed border-neutral-400 pb-1 mb-3 flex items-center justify-between text-[8px] font-mono text-neutral-500 uppercase print:hidden">
                  <span>ETIQUETAS DE LOMO (2+3/4 DÍGITOS) &bull; CPU BATÁN U.P. 15</span>
                  <span>~16 ETIQUETAS POR HOJA A4</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 print:grid-cols-4 print:gap-2 justify-items-center">
                  {selectedBooks.map((book) => (
                    <SpineLabelTag
                      key={book.id}
                      book={book}
                      libraryName={settings.libraryName}
                      className="print:page-break-inside-avoid"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* FORMAT 4: GRID OF POCKET DUE SLIPS (4 per A4 page) */}
            {labelType === 'pocket_slip' && (
              <div className="min-w-[560px] sm:min-w-0 w-full max-w-[210mm] print-sheet bg-white text-black p-4 rounded-xl border border-neutral-300 shadow-xl print:min-w-0 print:w-full print:overflow-hidden print:shadow-none print:border-0 print:p-1 print:m-0">
                <div className="border-b border-dashed border-neutral-400 pb-1 mb-3 flex items-center justify-between text-[8px] font-mono text-neutral-500 uppercase print:hidden">
                  <span>FICHAS INTERIORES DE CONTROL DE PRÉSTAMOS &bull; CPU BATÁN</span>
                  <span>4 FICHAS POR HOJA A4</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3 justify-items-center">
                  {selectedBooks.map((book) => (
                    <PocketDueSlip
                      key={book.id}
                      book={book}
                      libraryName={settings.libraryName}
                      logoUrl={settings.logoUrl}
                      className="print:page-break-inside-avoid"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
