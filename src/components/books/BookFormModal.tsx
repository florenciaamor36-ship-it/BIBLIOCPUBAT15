import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  BookOpen,
  Save,
  Plus,
  Hash,
  Layers,
  FolderOpen,
  Calendar,
  User,
  FileText,
  Sparkles,
  CheckCircle2,
  Info,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { Book } from '../../types/library';
import {
  CATEGORY_DEFINITIONS,
  getCategoryCode,
  getCategoryDefinition,
  formatBookIdentifier,
  parseBookIdentifier,
  getNextBookNumberForCategory,
} from '../../utils/categoryCodes';

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBook: (book: Book) => void;
  bookToEdit?: Book | null;
  existingBooks?: Book[];
  highestBookNumber?: number;
}

export const BookFormModal: React.FC<BookFormModalProps> = ({
  isOpen,
  onClose,
  onSaveBook,
  bookToEdit,
  existingBooks = [],
  highestBookNumber = 10,
}) => {
  const isEditing = !!bookToEdit;

  // Form states
  const [selectedCategoryDef, setSelectedCategoryDef] = useState(CATEGORY_DEFINITIONS[0]);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [customCategoryCode, setCustomCategoryCode] = useState('99');

  // Identification Code Elements (Category 2 digits + Book 3/4 digits)
  const [categoryPrefix, setCategoryPrefix] = useState('01');
  const [bookSeqDigits, setBookSeqDigits] = useState('001');
  const [digitCount, setDigitCount] = useState<3 | 4>(3);
  const [useHyphen, setUseHyphen] = useState<boolean>(true);
  const [isManualCodeOverride, setIsManualCodeOverride] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState<number>(new Date().getFullYear());
  const [totalCopies, setTotalCopies] = useState<number>(1);
  const [notes, setNotes] = useState('');

  // Calculate full resulting code
  const fullBookCode = useMemo(() => {
    if (isManualCodeOverride) {
      return manualCode.trim();
    }
    const cat = categoryPrefix.replace(/\D/g, '').padStart(2, '0').slice(-2) || '01';
    const seq = bookSeqDigits.replace(/\D/g, '').padStart(digitCount, '0') || (digitCount === 3 ? '001' : '0001');
    return useHyphen ? `${cat}-${seq}` : `${cat}${seq}`;
  }, [isManualCodeOverride, manualCode, categoryPrefix, bookSeqDigits, digitCount, useHyphen]);

  // When modal opens or editing changes
  useEffect(() => {
    if (!isOpen) return;

    if (bookToEdit) {
      const rawCode = bookToEdit.bookNumber || bookToEdit.barcode || '';
      const parsed = parseBookIdentifier(rawCode);
      const catCode = parsed.isStructured ? parsed.categoryCode : getCategoryCode(bookToEdit.category);
      const matchedCat = CATEGORY_DEFINITIONS.find((c) => c.code === catCode || c.name === bookToEdit.category);

      if (matchedCat) {
        setSelectedCategoryDef(matchedCat);
        setIsCustomCategory(false);
        setCustomCategoryName('');
        setCustomCategoryCode(matchedCat.code);
        setCategoryPrefix(matchedCat.code);
      } else {
        setIsCustomCategory(true);
        setCustomCategoryName(bookToEdit.category || 'Personalizada');
        setCustomCategoryCode(catCode || '99');
        setCategoryPrefix(catCode || '99');
      }

      setBookSeqDigits(parsed.bookNumber);
      setDigitCount(parsed.bookNumber.length >= 4 ? 4 : 3);
      setUseHyphen(rawCode.includes('-'));
      setIsManualCodeOverride(false);
      setManualCode(rawCode);

      setTitle(bookToEdit.title || '');
      setAuthor(bookToEdit.author || '');
      setPublishYear(bookToEdit.publishYear || new Date().getFullYear());
      setTotalCopies(bookToEdit.totalCopies || 1);
      setNotes(bookToEdit.notes || '');
    } else {
      // NEW BOOK: Auto-calculate next sequence for default category 01
      const initialCat = CATEGORY_DEFINITIONS[0];
      setSelectedCategoryDef(initialCat);
      setIsCustomCategory(false);
      setCustomCategoryName('');
      setCustomCategoryCode(initialCat.code);
      setCategoryPrefix(initialCat.code);

      const nextInfo = getNextBookNumberForCategory(initialCat.code, existingBooks, 3, true);
      setBookSeqDigits(nextInfo.nextSequential.toString().padStart(3, '0'));
      setDigitCount(3);
      setUseHyphen(true);
      setIsManualCodeOverride(false);
      setManualCode('');

      setTitle('');
      setAuthor('');
      setPublishYear(new Date().getFullYear());
      setTotalCopies(1);
      setNotes('');
    }
  }, [bookToEdit, isOpen, existingBooks]);

  // When category selection changes in New Book mode, recalculate category prefix and next sequential number
  const handleCategorySelect = (catDef: typeof CATEGORY_DEFINITIONS[0]) => {
    setSelectedCategoryDef(catDef);
    setIsCustomCategory(false);
    setCategoryPrefix(catDef.code);

    if (!isEditing && !isManualCodeOverride) {
      const nextInfo = getNextBookNumberForCategory(catDef.code, existingBooks, digitCount, useHyphen);
      setBookSeqDigits(nextInfo.nextSequential.toString().padStart(digitCount, '0'));
    }
  };

  const handleCustomCategoryToggle = () => {
    setIsCustomCategory(true);
    setCategoryPrefix(customCategoryCode);
  };

  const handleRecalculateNextNumber = () => {
    const currentCatCode = isCustomCategory ? customCategoryCode : selectedCategoryDef.code;
    const nextInfo = getNextBookNumberForCategory(currentCatCode, existingBooks, digitCount, useHyphen);
    setBookSeqDigits(nextInfo.nextSequential.toString().padStart(digitCount, '0'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Por favor ingresa el título del libro.');
      return;
    }

    const finalCategory = isCustomCategory
      ? (customCategoryName.trim() || 'General')
      : selectedCategoryDef.name;

    const numStr = fullBookCode || `01-001`;
    const copiesCount = Math.max(1, totalCopies);

    // Build copies list
    const copiesList = Array.from({ length: copiesCount }, (_, idx) => {
      const copyNum = idx + 1;
      return {
        copyId: `${bookToEdit?.id || 'book'}-${numStr}-${copyNum}`,
        copyNumber: copyNum,
        barcode: `${numStr}-${copyNum}`,
        status: (bookToEdit?.copiesList?.[idx]?.status || 'disponible') as any,
        condition: (bookToEdit?.copiesList?.[idx]?.condition || 'bueno') as any,
      };
    });

    const availableCount = isEditing
      ? (bookToEdit?.availableCopies !== undefined ? Math.min(bookToEdit.availableCopies, copiesCount) : copiesCount)
      : copiesCount;

    const newBook: Book = {
      id: bookToEdit ? bookToEdit.id : `book-${Date.now()}`,
      bookNumber: numStr,
      barcode: numStr,
      title: title.trim(),
      author: author.trim() || 'Autor Desconocido',
      category: finalCategory,
      publishYear: Number(publishYear) || new Date().getFullYear(),
      totalCopies: copiesCount,
      availableCopies: availableCount,
      status: availableCount === 0 ? 'agotado' : availableCount < copiesCount ? 'prestado_parcial' : 'disponible',
      notes: notes.trim(),
      copiesList: copiesList,
    };

    onSaveBook(newBook);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                {isEditing ? 'Modificar Datos del Libro' : 'Registrar Nuevo Libro en el Sistema'}
              </h3>
              <p className="text-xs text-slate-400">
                Sistema estructurado de identificación: <b>2 Dígitos Categoría + 3/4 Dígitos Libro</b>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* SECTION 1: IDENTIFICACIÓN Y CATEGORÍA (RULE MANDATE) */}
          <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-xs">
                  1
                </span>
                <h4 className="font-bold text-sm text-white">
                  Categoría y Número de Identificación para Lomo
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setIsManualCodeOverride(!isManualCodeOverride)}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold underline"
              >
                {isManualCodeOverride ? '⚙️ Usar Asistente Automático' : '✏️ Escribir Código Manual'}
              </button>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                  Seleccionar Categoría (Prefijo de 2 Dígitos):
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Código actual: <b>[{categoryPrefix}]</b>
                </span>
              </label>

              {!isCustomCategory ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={selectedCategoryDef.code}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        handleCustomCategoryToggle();
                      } else {
                        const found = CATEGORY_DEFINITIONS.find((c) => c.code === e.target.value);
                        if (found) handleCategorySelect(found);
                      }
                    }}
                    className="w-full sm:col-span-2 px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-white font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  >
                    {CATEGORY_DEFINITIONS.map((cat) => (
                      <option key={cat.code} value={cat.code}>
                        [{cat.code}] &bull; {cat.name} ({cat.description})
                      </option>
                    ))}
                    <option value="CUSTOM">+ Escribir otra categoría personalizada...</option>
                  </select>
                </div>
              ) : (
                <div className="p-3 bg-slate-900 rounded-xl border border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300">Categoría Personalizada</span>
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(false)}
                      className="text-[11px] text-slate-400 hover:text-white underline"
                    >
                      Volver a categorías estándar
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={customCategoryName}
                        onChange={(e) => setCustomCategoryName(e.target.value)}
                        placeholder="Nombre de categoría (ej: Idiomas, Computación...)"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        maxLength={2}
                        value={customCategoryCode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                          setCustomCategoryCode(val);
                          setCategoryPrefix(val);
                        }}
                        placeholder="Código 2 dígitos (ej: 14)"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-mono font-bold text-xs focus:outline-none focus:border-amber-400 text-center"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Code Generator Controls / Breakdown */}
            {!isManualCodeOverride ? (
              <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Category 2 Digits */}
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      1. Categoría (2 dígitos)
                    </label>
                    <div className="flex items-center gap-1 bg-slate-950 px-3 py-2 rounded-xl border border-slate-700">
                      <span className="text-xs text-slate-500 font-mono">CAT</span>
                      <input
                        type="text"
                        maxLength={2}
                        value={categoryPrefix}
                        onChange={(e) => setCategoryPrefix(e.target.value.replace(/\D/g, '').slice(0, 2))}
                        className="w-12 bg-transparent text-amber-400 font-mono font-black text-base text-center focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Separator toggle */}
                  <div className="sm:col-span-3 flex flex-col items-center justify-center">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-center">
                      Formato
                    </label>
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setUseHyphen(true)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors ${
                          useHyphen ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Formato con guión: 01-001"
                      >
                        01-001
                      </button>
                      <button
                        type="button"
                        onClick={() => setUseHyphen(false)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors ${
                          !useHyphen ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Formato continuo: 01001"
                      >
                        01001
                      </button>
                    </div>
                  </div>

                  {/* Sequential Number (3 or 4 digits) */}
                  <div className="sm:col-span-5">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        2. N° de Libro ({digitCount} dígitos)
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const newCount = digitCount === 3 ? 4 : 3;
                            setDigitCount(newCount);
                            setBookSeqDigits((prev) => prev.padStart(newCount, '0').slice(-newCount));
                          }}
                          className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 hover:bg-slate-700"
                        >
                          {digitCount === 3 ? 'Cambiar a 4 dígitos' : 'Cambiar a 3 dígitos'}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700">
                      <span className="text-xs text-slate-500 font-mono">N°</span>
                      <input
                        type="text"
                        maxLength={digitCount}
                        value={bookSeqDigits}
                        onChange={(e) => setBookSeqDigits(e.target.value.replace(/\D/g, '').slice(0, digitCount))}
                        className="flex-1 bg-transparent text-white font-mono font-black text-base focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleRecalculateNextNumber}
                        title="Calcular siguiente correlativo automático para esta categoría"
                        className="p-1 rounded-lg hover:bg-slate-800 text-amber-400 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/40 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400">
                      CÓDIGO RESULTANTE:
                    </span>
                    <span className="px-3 py-1 bg-amber-500 text-slate-950 font-mono font-black text-base rounded-lg shadow-sm">
                      {fullBookCode}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">
                    (Cat: <b>{categoryPrefix}</b> + Libro: <b>{bookSeqDigits}</b>)
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-amber-300">
                  Código de Identificación Manual Libre
                </label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="ej: 01-001, 02-0045, 05-0105"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-amber-400 rounded-xl text-amber-300 font-mono font-black text-lg focus:outline-none"
                />
                <p className="text-[11px] text-slate-400">
                  Recomendado: mantén los 2 primeros dígitos para la categoría y los últimos 3 o 4 para el identificador.
                </p>
              </div>
            )}
          </div>

          {/* SECTION 2: DATOS DEL LIBRO (Título, Autor, Año, Ejemplares, Notas) */}
          <div className="space-y-4">
            {/* Título */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                Título del Libro *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ej: Cien Años de Soledad, Manual de Electricidad..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 placeholder-slate-600"
              />
            </div>

            {/* Autor y Año */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Autor
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="ej: Gabriel García Márquez, Viktor Frankl..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 placeholder-slate-600"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Año de Publicación
                </label>
                <input
                  type="number"
                  min="1500"
                  max="2030"
                  value={publishYear}
                  onChange={(e) => setPublishYear(Number(e.target.value))}
                  placeholder="ej: 2021"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            {/* Ejemplares Físicos */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                Cantidad de Ejemplares Físicos en Biblioteca
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={totalCopies}
                  onChange={(e) => setTotalCopies(Math.max(1, Number(e.target.value)))}
                  className="w-24 px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl text-white font-bold text-sm focus:outline-none"
                />
                <span className="text-xs text-slate-400">
                  {totalCopies === 1 ? '1 ejemplar único' : `${totalCopies} copias físicas para circular`}
                </span>
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Observaciones / Estado del Libro (Opcional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ej: Donado por pastoral, encuadernación rústica, tomo 1 de 2..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 placeholder-slate-600"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-800 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Guardar Cambios' : 'Registrar Libro e Imprimir'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
