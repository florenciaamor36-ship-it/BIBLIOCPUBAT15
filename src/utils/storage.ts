import { Book, Member, Loan, LibrarySettings, LibraryStats, PavilionStats } from '../types/library';
import { INITIAL_BOOKS, INITIAL_MEMBERS, INITIAL_LOANS, DEFAULT_LIBRARY_SETTINGS } from '../data/initialData';

const STORAGE_KEYS = {
  BOOKS: 'biblioteca_pabellones_books_v2',
  MEMBERS: 'biblioteca_pabellones_members_v2',
  LOANS: 'biblioteca_pabellones_loans_v2',
  SETTINGS: 'biblioteca_pabellones_settings_v2',
};

// Load complete library bundle
export function loadLibraryData(): {
  books: Book[];
  members: Member[];
  loans: Loan[];
  settings: LibrarySettings;
} {
  return {
    books: getStoredBooks(),
    members: getStoredMembers(),
    loans: getStoredLoans(),
    settings: getStoredSettings(),
  };
}

// Save complete library bundle
export function saveLibraryData(
  books: Book[],
  members: Member[],
  loans: Loan[],
  settings: LibrarySettings
): void {
  saveStoredBooks(books);
  saveStoredMembers(members);
  saveStoredLoans(loans);
  saveStoredSettings(settings);
}

// Books
export function getStoredBooks(): Book[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKS);
    if (!data) {
      saveStoredBooks(INITIAL_BOOKS);
      return INITIAL_BOOKS;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveStoredBooks(INITIAL_BOOKS);
      return INITIAL_BOOKS;
    }
    return parsed;
  } catch (e) {
    console.error('Error reading books from localStorage:', e);
    return INITIAL_BOOKS;
  }
}

export function saveStoredBooks(books: Book[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  } catch (e) {
    console.error('Error saving books to localStorage:', e);
  }
}

// Members
export function getStoredMembers(): Member[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (!data) {
      saveStoredMembers(INITIAL_MEMBERS);
      return INITIAL_MEMBERS;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveStoredMembers(INITIAL_MEMBERS);
      return INITIAL_MEMBERS;
    }
    return parsed;
  } catch (e) {
    console.error('Error reading members from localStorage:', e);
    return INITIAL_MEMBERS;
  }
}

export function saveStoredMembers(members: Member[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  } catch (e) {
    console.error('Error saving members to localStorage:', e);
  }
}

// Loans
export function getStoredLoans(): Loan[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOANS);
    if (!data) {
      saveStoredLoans(INITIAL_LOANS);
      return INITIAL_LOANS;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      saveStoredLoans(INITIAL_LOANS);
      return INITIAL_LOANS;
    }
    return parsed;
  } catch (e) {
    console.error('Error reading loans from localStorage:', e);
    return INITIAL_LOANS;
  }
}

export function saveStoredLoans(loans: Loan[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  } catch (e) {
    console.error('Error saving loans to localStorage:', e);
  }
}

// Settings
export function getStoredSettings(): LibrarySettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      saveStoredSettings(DEFAULT_LIBRARY_SETTINGS);
      return DEFAULT_LIBRARY_SETTINGS;
    }
    const parsed = JSON.parse(data);
    if (
      parsed.libraryName === 'Biblioteca Central de Pabellones' ||
      parsed.libraryName === 'Biblioteca Central' ||
      !parsed.libraryName
    ) {
      parsed.libraryName = DEFAULT_LIBRARY_SETTINGS.libraryName;
    }
    if (!parsed.logoUrl) {
      parsed.logoUrl = DEFAULT_LIBRARY_SETTINGS.logoUrl;
    }
    if (!parsed.facebookUrl) {
      parsed.facebookUrl = DEFAULT_LIBRARY_SETTINGS.facebookUrl;
    }
    if (!parsed.contactEmail) {
      parsed.contactEmail = DEFAULT_LIBRARY_SETTINGS.contactEmail;
    }
    return { ...DEFAULT_LIBRARY_SETTINGS, ...parsed };
  } catch (e) {
    console.error('Error reading settings from localStorage:', e);
    return DEFAULT_LIBRARY_SETTINGS;
  }
}

export function saveStoredSettings(settings: LibrarySettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings to localStorage:', e);
  }
}

// Dynamic Stats calculation
export function calculateLibraryStats(
  books: Book[],
  members: Member[],
  loans: Loan[]
): LibraryStats {
  const todayStr = new Date().toISOString().split('T')[0];

  let totalPhysicalCopies = 0;
  let availableCopies = 0;

  books.forEach((book) => {
    totalPhysicalCopies += book.totalCopies;
    availableCopies += book.availableCopies;
  });

  const activeLoans = loans.filter((l) => l.status === 'activo' || l.status === 'renovado');
  const overdueLoans = loans.filter((l) => l.status === 'vencido');
  const activeMembers = members.filter((m) => m.status === 'activo');

  const loansToday = loans.filter((l) => l.loanDate?.startsWith(todayStr)).length;
  const returnsToday = loans.filter((l) => l.returnDate?.startsWith(todayStr)).length;

  // Group by pavilion
  const pavilionMap = new Map<string, { activeLoans: number; totalMembers: number }>();

  // Add all pavilions from members
  members.forEach((m) => {
    const pav = m.pavilion?.trim() || 'Sin Pabellón';
    const curr = pavilionMap.get(pav) || { activeLoans: 0, totalMembers: 0 };
    curr.totalMembers += 1;
    pavilionMap.set(pav, curr);
  });

  // Count active loans in each pavilion
  activeLoans.forEach((l) => {
    const pav = l.memberPavilion?.trim() || 'Sin Pabellón';
    const curr = pavilionMap.get(pav) || { activeLoans: 0, totalMembers: 0 };
    curr.activeLoans += 1;
    pavilionMap.set(pav, curr);
  });

  const pavilionsSummary: PavilionStats[] = Array.from(pavilionMap.entries()).map(([pavilion, data]) => ({
    pavilion,
    activeLoansCount: data.activeLoans,
    totalMembersCount: data.totalMembers,
  })).sort((a, b) => a.pavilion.localeCompare(b.pavilion, undefined, { numeric: true }));

  return {
    totalTitles: books.length,
    totalPhysicalCopies,
    availableCopies,
    activeLoans: activeLoans.length,
    overdueLoans: overdueLoans.length,
    totalMembers: members.length,
    activeMembers: activeMembers.length,
    loansToday,
    returnsToday,
    pavilionsSummary,
  };
}

// Export Backup JSON
export function exportBackupJson(books: Book[], members: Member[], loans: Loan[], settings: LibrarySettings): void {
  const backupData = {
    version: '2.0',
    app: 'Biblioteca y Control de Pabellones',
    exportDate: new Date().toISOString(),
    settings,
    books,
    members,
    loans,
  };

  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `biblioteca_pabellones_respaldo_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Export CSV for books
export function exportBooksToCsv(books: Book[]): void {
  const headers = ['N° Libro', 'Título', 'Autor', 'Categoría', 'Año', 'Ejemplares Totales', 'Disponibles', 'Estado', 'Notas'];
  const rows = books.map((b) => [
    `"${b.bookNumber || b.barcode}"`,
    `"${b.title.replace(/"/g, '""')}"`,
    `"${b.author.replace(/"/g, '""')}"`,
    `"${b.category}"`,
    b.publishYear,
    b.totalCopies,
    b.availableCopies,
    `"${b.status}"`,
    `"${(b.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `inventario_libros_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Export CSV for members (readers)
export function exportMembersToCsv(members: Member[]): void {
  const headers = ['N° Ficha', 'Nombre Completo', 'Pabellón', 'Celda', 'WhatsApp', 'Estado', 'Préstamos Actuales', 'Total Histórico', 'Notas'];
  const rows = members.map((m) => [
    `"${m.memberNumber}"`,
    `"${m.name.replace(/"/g, '""')}"`,
    `"${m.pavilion}"`,
    `"${m.cell}"`,
    `"${m.whatsapp}"`,
    `"${m.status}"`,
    m.currentLoansCount,
    m.totalLoansHistory,
    `"${(m.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `padron_lectores_pabellones_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Export CSV for loans
export function exportLoansToCsv(loans: Loan[]): void {
  const headers = ['N° Préstamo', 'N° Libro', 'Título', 'Autor', 'Lector', 'Pabellón', 'Celda', 'WhatsApp', 'Fecha Préstamo', 'Fecha Límite', 'Fecha Devolución', 'Estado', 'Notas'];
  const rows = loans.map((l) => [
    `"${l.loanNumber}"`,
    `"${l.bookNumber}"`,
    `"${l.bookTitle.replace(/"/g, '""')}"`,
    `"${l.bookAuthor.replace(/"/g, '""')}"`,
    `"${l.memberName.replace(/"/g, '""')}"`,
    `"${l.memberPavilion}"`,
    `"${l.memberCell}"`,
    `"${l.memberWhatsapp}"`,
    l.loanDate,
    l.dueDate,
    l.returnDate || '',
    `"${l.status}"`,
    `"${(l.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `registro_prestamos_pabellones_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Reset data to defaults
export function resetToInitialData(): { books: Book[]; members: Member[]; loans: Loan[]; settings: LibrarySettings } {
  saveStoredBooks(INITIAL_BOOKS);
  saveStoredMembers(INITIAL_MEMBERS);
  saveStoredLoans(INITIAL_LOANS);
  saveStoredSettings(DEFAULT_LIBRARY_SETTINGS);

  return {
    books: INITIAL_BOOKS,
    members: INITIAL_MEMBERS,
    loans: INITIAL_LOANS,
    settings: DEFAULT_LIBRARY_SETTINGS,
  };
}
