export type BookCondition = 'nuevo' | 'excelente' | 'bueno' | 'regular' | 'deteriorado';
export type BookStatus = 'disponible' | 'prestado_parcial' | 'agotado' | 'mantenimiento' | 'baja';
export type CopyStatus = 'disponible' | 'prestado' | 'mantenimiento' | 'extraviado';

export interface BookCopy {
  copyId: string;
  copyNumber: number;
  barcode: string;
  status: CopyStatus;
  condition: BookCondition;
  shelfLocation?: string;
  acquisitionDate?: string;
  notes?: string;
}

export interface Book {
  id: string;
  bookNumber: string; // N° de Libro para el lomo y control (ej: "1", "042", "105")
  title: string; // Título
  author: string; // Autor
  category: string; // Categoría (ej: Novela, Historia, Autoayuda, Religión, Oficios, etc.)
  publishYear: number; // Año
  totalCopies: number;
  availableCopies: number;
  status: BookStatus;
  notes?: string; // Observaciones opcionales

  // Campos complementarios compatibles
  isbn?: string;
  publisher?: string;
  edition?: string;
  deweyCode?: string;
  topographicSignature?: string;
  barcode: string; // e.g. "LIB-001" o el mismo bookNumber
  condition?: BookCondition;
  summary?: string;
  copiesList: BookCopy[];
}

export type MemberStatus = 'activo' | 'suspendido' | 'inactivo';

export interface Member {
  id: string;
  memberNumber: string; // N° de Lector / Ficha (ej: "LEC-01", "042")
  name: string; // Nombre Completo
  pavilion: string; // Pabellón (ej: "Pabellón 1", "Pabellón 3", "Pab. 7")
  cell: string; // Celda (ej: "Celda 4", "Celda 12")
  whatsapp: string; // Número de WhatsApp / Teléfono
  status: MemberStatus;
  registrationDate: string;
  maxAllowedLoans: number;
  currentLoansCount: number;
  totalLoansHistory: number;
  notes?: string;
  barcode?: string;
  dni?: string; // Documento opcional
  email?: string;
}

export type LoanStatus = 'activo' | 'devuelto' | 'vencido' | 'renovado';

export interface Loan {
  id: string;
  loanNumber: string; // e.g. "PREST-001"
  bookId: string;
  bookNumber: string; // N° de Libro
  bookTitle: string;
  bookAuthor: string;
  bookCategory: string;
  bookBarcode: string;
  copyNumber?: number;
  copyId?: string;
  memberId: string;
  memberName: string; // Nombre Completo del Lector
  memberPavilion: string; // Pabellón
  memberCell: string; // Celda
  memberWhatsapp: string; // WhatsApp
  loanDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  status: LoanStatus;
  renewalsCount: number;
  notes?: string;
}

export type LabelTemplateType = 
  | 'spine_label'        // Etiqueta para el LOMO (Número grande, Categoría, Título, Autor)
  | 'inside_slip'        // Ficha INTERIOR (Encabezado + Cuadrícula física de préstamos por pabellón/celda)
  | 'combo_kit';         // Juego completo (Lomo + Ficha interior en una sola hoja)

export type LabelPageFormat = 
  | 'A4_grid_spine'      // Planilla A4 de lomos (24 o 30 etiquetas por hoja)
  | 'A4_inside_slips'    // Planilla A4 de fichas interiores (2 o 4 por hoja)
  | 'Single_Print';      // Individual centrada

export interface LabelCustomization {
  templateType: LabelTemplateType;
  pageFormat: LabelPageFormat;
  libraryName: string;
  includeLibraryName: boolean;
  includeBookNumber: boolean;
  includeCategory: boolean;
  includeBookTitle: boolean;
  includeAuthor: boolean;
  includeYear: boolean;
  includeLoanGrid: boolean; // Cuadrícula de registro de préstamos en la ficha interior
  gridRowsCount: number; // Filas de la cuadrícula (ej: 10, 15, 20)
  fontSize: 'sm' | 'md' | 'lg';
  borderStyle: 'solid' | 'dashed' | 'none';
  copiesPerBook: number;
}

export interface LibrarySettings {
  libraryName: string;
  libraryCode: string;
  institutionName?: string; // Nombre de la Institución / Unidad / Penal
  motto?: string; // Lema o subtítulo
  logoUrl?: string; // URL o base64 del logo
  facebookUrl?: string; // Enlace a Facebook
  contactEmail?: string; // Correo de contacto
  defaultLoanDays: number; // default 14 días
  maxAllowedLoansPerMember: number; // default 3
  whatsappCountryCode: string; // default "+54" o libre
  theme: 'dark' | 'light';
  address?: string;
  phone?: string;
  maxRenewalsAllowed?: number;
  finePerDay?: number;
  currencySymbol?: string;
}

export interface PavilionStats {
  pavilion: string;
  activeLoansCount: number;
  totalMembersCount: number;
}

export interface LibraryStats {
  totalTitles: number;
  totalPhysicalCopies: number;
  availableCopies: number;
  activeLoans: number;
  overdueLoans: number;
  totalMembers: number;
  activeMembers: number;
  loansToday: number;
  returnsToday: number;
  pavilionsSummary: PavilionStats[];
}
