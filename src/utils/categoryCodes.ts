import { Book } from '../types/library';

export interface CategoryDefinition {
  code: string; // 2 dígitos (ej: '01', '02', '03')
  name: string; // Nombre descriptivo (ej: 'Novelas y Ficción')
  shortName: string; // Nombre corto para lomos angostos
  description: string;
  color: string; // Color distintivo para visualización
  badgeBg: string;
  badgeText: string;
}

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    code: '01',
    name: 'Novelas y Ficción',
    shortName: 'Novela/Ficción',
    description: 'Literatura, novelas, cuentos, narrativa y ficción',
    color: '#3b82f6',
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-blue-300',
  },
  {
    code: '02',
    name: 'Religión y Espiritualidad',
    shortName: 'Religión/Espirit.',
    description: 'Biblias, evangelios, teología, devocionarios y reflexión espiritual',
    color: '#8b5cf6',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300',
  },
  {
    code: '03',
    name: 'Historia y Biografías',
    shortName: 'Historia/Biogr.',
    description: 'Historia universal, argentina, biografías y memorias',
    color: '#f59e0b',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
  },
  {
    code: '04',
    name: 'Autoayuda y Superación',
    shortName: 'Autoayuda/Super.',
    description: 'Psicología, desarrollo personal, resiliencia y motivación',
    color: '#10b981',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
  },
  {
    code: '05',
    name: 'Educación, Oficios y Técnica',
    shortName: 'Oficios/Técnica',
    description: 'Electricidad, carpintería, mecánica, manuales y formación laboral',
    color: '#06b6d4',
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-300',
  },
  {
    code: '06',
    name: 'Derecho y Asuntos Jurídicos',
    shortName: 'Derecho/Leyes',
    description: 'Códigos penal/civil, leyes, garantías y derechos humanos',
    color: '#ec4899',
    badgeBg: 'bg-pink-500/20',
    badgeText: 'text-pink-300',
  },
  {
    code: '07',
    name: 'Filosofía y Pensamiento',
    shortName: 'Filosofía/Ensayo',
    description: 'Filosofía, ensayos críticos y corrientes de pensamiento',
    color: '#6366f1',
    badgeBg: 'bg-indigo-500/20',
    badgeText: 'text-indigo-300',
  },
  {
    code: '08',
    name: 'Ciencia y Naturaleza',
    shortName: 'Ciencia/Natur.',
    description: 'Divulgación científica, física, astronomía, biología y ecología',
    color: '#14b8a6',
    badgeBg: 'bg-teal-500/20',
    badgeText: 'text-teal-300',
  },
  {
    code: '09',
    name: 'Poesía y Teatro',
    shortName: 'Poesía/Teatro',
    description: 'Poemarios, antologías poéticas, dramaturgia y obras de teatro',
    color: '#f43f5e',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-300',
  },
  {
    code: '10',
    name: 'Salud y Deportes',
    shortName: 'Salud/Deportes',
    description: 'Bienestar, medicina general, entrenamiento y actividades físicas',
    color: '#84cc16',
    badgeBg: 'bg-lime-500/20',
    badgeText: 'text-lime-300',
  },
  {
    code: '11',
    name: 'Infantil y Juvenil',
    shortName: 'Infantil/Juvenil',
    description: 'Cuentos, fábulas y lecturas formativas para jóvenes',
    color: '#f97316',
    badgeBg: 'bg-orange-500/20',
    badgeText: 'text-orange-300',
  },
  {
    code: '12',
    name: 'Arte, Música y Cultura',
    shortName: 'Arte/Música',
    description: 'Pintura, dibujo, música, guitarra y expresiones artísticas',
    color: '#a855f7',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300',
  },
  {
    code: '13',
    name: 'Ciencias Sociales y Política',
    shortName: 'Cs. Sociales',
    description: 'Sociología, política, antropología y relaciones humanas',
    color: '#0284c7',
    badgeBg: 'bg-sky-500/20',
    badgeText: 'text-sky-300',
  },
  {
    code: '99',
    name: 'Varios / Otros',
    shortName: 'Varios/Otros',
    description: 'Revistas, enciclopedias y libros sin categoría específica',
    color: '#64748b',
    badgeBg: 'bg-slate-500/20',
    badgeText: 'text-slate-300',
  },
];

/**
 * Obtiene la definición de categoría por nombre o código.
 */
export function getCategoryDefinition(categoryNameOrCode: string): CategoryDefinition | undefined {
  if (!categoryNameOrCode) return undefined;
  const clean = categoryNameOrCode.trim().toLowerCase();

  // Buscar por código exacto (ej: '01', '02')
  const byCode = CATEGORY_DEFINITIONS.find((c) => c.code.toLowerCase() === clean);
  if (byCode) return byCode;

  // Buscar por nombre exacto o que contenga
  const byName = CATEGORY_DEFINITIONS.find((c) => c.name.toLowerCase() === clean);
  if (byName) return byName;

  const byPartialName = CATEGORY_DEFINITIONS.find(
    (c) =>
      clean.includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(clean) ||
      clean.includes(c.shortName.toLowerCase())
  );
  if (byPartialName) return byPartialName;

  return undefined;
}

/**
 * Obtiene el código de 2 dígitos correspondiente a una categoría.
 */
export function getCategoryCode(categoryName: string): string {
  const def = getCategoryDefinition(categoryName);
  if (def) return def.code;

  // Si la categoría empieza con números (ej: "01 - Novelas"), extraer los 2 primeros dígitos
  const match = categoryName.match(/^(\d{1,2})/);
  if (match) {
    return match[1].padStart(2, '0');
  }

  return '99'; // Default Varios
}

/**
 * Formatea el número identificador completo del libro:
 * 2 dígitos de categoría + 3 o 4 dígitos del libro.
 * Ejemplos:
 *  - formatBookIdentifier('01', 1, 3, true) -> '01-001'
 *  - formatBookIdentifier('02', 45, 4, true) -> '02-0045'
 *  - formatBookIdentifier('01', 1, 3, false) -> '01001'
 */
export function formatBookIdentifier(
  categoryCode: string,
  bookSeqNumber: number | string,
  digits: 3 | 4 = 3,
  useHyphen: boolean = true
): string {
  const catCode2 = (categoryCode || '01').replace(/\D/g, '').padStart(2, '0').slice(-2);
  const numInt = typeof bookSeqNumber === 'number' ? bookSeqNumber : parseInt(bookSeqNumber.replace(/\D/g, '') || '1', 10);
  const numDigits = isNaN(numInt) ? '001' : numInt.toString().padStart(digits, '0');

  return useHyphen ? `${catCode2}-${numDigits}` : `${catCode2}${numDigits}`;
}

/**
 * Descompone un código de libro existente para saber sus 2 dígitos de categoría
 * y sus 3 o 4 dígitos de libro.
 */
export function parseBookIdentifier(identifier: string): {
  categoryCode: string;
  bookNumber: string;
  isStructured: boolean;
  raw: string;
} {
  if (!identifier) {
    return { categoryCode: '01', bookNumber: '001', isStructured: false, raw: '' };
  }

  const raw = identifier.trim();

  // Caso 1: Formato con guión o punto o espacio: "01-001", "02-0042", "01.001", "01 001"
  const matchHyphen = raw.match(/^(\d{1,2})[-.\s/](\d{1,5})$/);
  if (matchHyphen) {
    const cat = matchHyphen[1].padStart(2, '0');
    const num = matchHyphen[2];
    return {
      categoryCode: cat,
      bookNumber: num.length < 3 ? num.padStart(3, '0') : num,
      isStructured: true,
      raw,
    };
  }

  // Caso 2: Formato continuo de 5 o 6 dígitos: "01001" (2 cat + 3 num) o "010001" (2 cat + 4 num)
  const matchDigits = raw.match(/^(\d{2})(\d{3,4})$/);
  if (matchDigits) {
    return {
      categoryCode: matchDigits[1],
      bookNumber: matchDigits[2],
      isStructured: true,
      raw,
    };
  }

  // Caso 3: Número simple (ej: "1", "42", "105")
  const numericOnly = raw.replace(/\D/g, '');
  if (numericOnly) {
    const n = parseInt(numericOnly, 10);
    return {
      categoryCode: '01',
      bookNumber: n.toString().padStart(3, '0'),
      isStructured: false,
      raw,
    };
  }

  return { categoryCode: '01', bookNumber: '001', isStructured: false, raw };
}

/**
 * Calcula el siguiente correlativo para una categoría específica o globalmente.
 */
export function getNextBookNumberForCategory(
  categoryNameOrCode: string,
  existingBooks: Book[],
  digits: 3 | 4 = 3,
  useHyphen: boolean = true
): {
  categoryCode: string;
  nextSequential: number;
  formattedCode: string;
} {
  const catCode = getCategoryCode(categoryNameOrCode);
  let maxSeq = 0;

  existingBooks.forEach((book) => {
    const idStr = book.bookNumber || book.barcode || '';
    const parsed = parseBookIdentifier(idStr);

    // Si el libro pertenece a la misma categoría o su código empieza con ese prefijo
    const bookCatCode = getCategoryCode(book.category);
    if (parsed.categoryCode === catCode || bookCatCode === catCode) {
      const num = parseInt(parsed.bookNumber, 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  });

  const nextSequential = maxSeq + 1;
  const formattedCode = formatBookIdentifier(catCode, nextSequential, digits, useHyphen);

  return {
    categoryCode: catCode,
    nextSequential,
    formattedCode,
  };
}
