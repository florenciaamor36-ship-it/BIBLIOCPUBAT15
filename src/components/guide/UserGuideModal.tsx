import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Printer,
  Users,
  ArrowLeftRight,
  Database,
  Bell,
  HelpCircle,
  CheckCircle2,
  FileText,
  Building2,
  Sparkles,
  Download,
  Shield,
  Layers,
  ChevronRight,
  Info,
  FolderOpen,
  Hash,
} from 'lucide-react';
import { LibrarySettings } from '../../types/library';
import { CpuPastoralLogo } from '../common/CpuPastoralLogo';
import { CATEGORY_DEFINITIONS } from '../../utils/categoryCodes';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LibrarySettings;
  onNavigateToTab?: (tab: string) => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  settings,
  onNavigateToTab,
}) => {
  const [activeSection, setActiveSection] = useState<'numbering' | 'workflow' | 'labels' | 'members' | 'loans' | 'storage' | 'faq'>('numbering');

  if (!isOpen) return null;

  const sections = [
    { id: 'numbering', label: '1. Códigos de Lomo (2+3/4 Dígitos)', icon: Hash },
    { id: 'workflow', label: '2. Flujo General CPU', icon: Sparkles },
    { id: 'labels', label: '3. Etiquetas y Hoja A4', icon: Printer },
    { id: 'members', label: '4. Lectores y Pabellones', icon: Users },
    { id: 'loans', label: '5. Préstamos y Devoluciones', icon: ArrowLeftRight },
    { id: 'storage', label: '6. Almacenamiento y Backup', icon: Database },
    { id: 'faq', label: '7. Preguntas Frecuentes', icon: HelpCircle },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center border border-slate-200/40 shadow-sm shrink-0">
              <CpuPastoralLogo variant="icon" size="xs" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  Guía de Uso del Sistema de Biblioteca
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  CPU Batán U.P. 15
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manual operativo: rotulado estructurado de libros, fichas de préstamo y control penitenciario
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

        {/* Content with Sidebar & Detail Panel */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Navigation Sidebar */}
          <div className="w-full md:w-64 bg-slate-950/80 border-b md:border-b-0 md:border-r border-slate-800 p-3 space-y-1 overflow-x-auto md:overflow-y-auto shrink-0 flex md:flex-col gap-1 md:gap-0">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id as any)}
                  className={`flex items-center justify-between w-full p-2.5 rounded-xl text-xs font-bold transition-all text-left shrink-0 md:shrink ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span className="truncate">{sec.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 hidden md:block ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
                </button>
              );
            })}

            {/* Quick backup tip box */}
            <div className="hidden md:block mt-6 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-300 text-[11px] space-y-1.5">
              <div className="font-bold text-amber-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>Modo 100% Offline</span>
              </div>
              <p className="text-[10.5px] leading-relaxed text-slate-400">
                Esta app no requiere conexión a internet. Todos los datos quedan guardados en la PC de la biblioteca.
              </p>
            </div>
          </div>

          {/* Section Body */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 text-sm">
            {/* 1. STRUCTURED NUMBERING SYSTEM (NEW DIRECT USER SPECIFICATION) */}
            {activeSection === 'numbering' && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Hash className="w-5 h-5 text-amber-400" />
                    Estructura del Número de Identificación en el Lomo
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Cada libro lleva un código de identificación claro y unificado:
                  </p>
                </div>

                {/* Structure Diagram */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/40 space-y-3">
                  <h5 className="font-extrabold text-amber-400 text-xs uppercase tracking-wider">
                    📐 Desglose del Código: [XX] - [YYY]
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-mono font-black text-xs">
                          Primeros 2 números
                        </span>
                        <span className="font-bold text-white">Categoría Temática</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Indican el género o materia del libro (ej: <b>01</b> Novelas, <b>02</b> Religión, <b>03</b> Historia, <b>05</b> Oficios).
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono font-black text-xs border border-amber-400/30">
                          Últimos 3 o 4 números
                        </span>
                        <span className="font-bold text-white">Correlativo del Libro</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Número identificativo individual correlativo dentro de esa categoría (ej: <b>001</b>, <b>002</b>, <b>0045</b>).
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 flex items-center justify-between text-xs">
                    <span className="text-slate-300">
                      Ejemplos: <b className="font-mono text-amber-400">01-001</b> (Novela N° 1) &bull; <b className="font-mono text-amber-400">02-0045</b> (Religión N° 45) &bull; <b className="font-mono text-amber-400">05-0105</b> (Oficios N° 105)
                    </span>
                  </div>
                </div>

                {/* Categories Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <FolderOpen className="w-4 h-4 text-amber-400" />
                      Tabla Oficial de Códigos de Categoría
                    </h5>
                    <span className="text-[11px] text-slate-500 font-mono">14 categorías estándar</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {CATEGORY_DEFINITIONS.map((cat) => (
                      <div
                        key={cat.code}
                        className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2.5"
                      >
                        <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-black text-xs flex items-center justify-center border border-amber-500/30 shrink-0">
                          {cat.code}
                        </span>
                        <div className="min-w-0">
                          <span className="font-bold text-white block truncate">{cat.name}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{cat.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. GENERAL WORKFLOW */}
            {activeSection === 'workflow' && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Flujo de Trabajo Operativo en la Biblioteca
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Paso a paso recomendado para poner en marcha y mantener la biblioteca organizada:
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-xs shrink-0">
                      1
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-white text-xs sm:text-sm">
                        Cargar Libro y Asignar Código de Identificación (ej: 01-001)
                      </h5>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Carga el libro en la pestaña <b>Libros</b>. Selecciona la categoría temática y el sistema generará automáticamente los 2 dígitos de categoría y los 3/4 dígitos de correlativo.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-xs shrink-0">
                      2
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-white text-xs sm:text-sm">
                        Imprimir Etiquetas y Fichas Físicas (Hoja A4)
                      </h5>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Ve a la sección <b>Etiquetas & Fichas</b>. Imprime el <i>Kit Completo</i> (Lomo + Ficha interior). Entran <b>al menos 2 libros completos por hoja A4</b> (o 4 compactos). Pega el lomo en el canto exterior y la ficha en la contratapa interior.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-xs shrink-0">
                      3
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-white text-xs sm:text-sm">
                        Empadronar al Lector con Pabellón y Celda
                      </h5>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        En <b>Lectores & Pabellones</b>, registra al interno con su Nombre, Ficha N°, Pabellón (ej. Pabellón 3), Celda y WhatsApp del referente si aplica.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-xs shrink-0">
                      4
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-white text-xs sm:text-sm">
                        Registrar Préstamo y Anotar Ficha Física
                      </h5>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Haz clic en el botón <b>Prestar</b>. Selecciona el código del libro y el lector. En la ficha física pegada al libro, anota la fecha y pabellón para tener doble respaldo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. LABELS AND A4 PRINTING */}
            {activeSection === 'labels' && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Printer className="w-5 h-5 text-amber-400" />
                    Dimensiones y Rendimiento en Hoja A4
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Cálculo exacto de medidas para imprimir sin desperdiciar papel:
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <h5 className="font-bold text-amber-400 text-xs uppercase tracking-wider">
                    ¿Cuántos libros entran por cada Hoja A4 (210 mm x 297 mm)?
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-black text-white text-sm text-amber-300">
                        2 Libros por Hoja A4
                      </div>
                      <div className="font-bold text-slate-300">Kit Completo Estándar</div>
                      <p className="text-[11px] text-slate-400">
                        1 Lomo (45×58mm) + 1 Ficha de Préstamo (80×125mm) por libro. Entran 2 kits holgados por hoja A4 en vertical con líneas de corte.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-black text-white text-sm text-emerald-300">
                        4 Libros por Hoja A4
                      </div>
                      <div className="font-bold text-slate-300">Kit Compacto (2 Col)</div>
                      <p className="text-[11px] text-slate-400">
                        Organizado en 2 columnas para máxima economía de papel y tinta.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-black text-white text-sm text-cyan-300">
                        16 a 20 Lomos por Hoja
                      </div>
                      <div className="font-bold text-slate-300">Tira de Números</div>
                      <p className="text-[11px] text-slate-400">
                        Para rotular estanterías o lotes de libros nuevos correlativos (ej: 01-001 al 01-020 en 1 sola hoja).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Consejos de Impresión:
                  </h5>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>Al pulsar <b>Ctrl + P</b>, asegúrate de seleccionar papel <b>A4</b> y escala <b>100% (o Ajustar a página)</b>.</li>
                    <li>Puedes usar papel autoadhesivo para recortar y pegar directamente en los lomos, o papel común protegido con cinta adhesiva transparente.</li>
                    <li>Las fichas interiores cuentan con cuadrícula de 9 a 10 préstamos con espacio para fecha, nombre del lector, pabellón, celda y firma/devolución.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 4. MEMBERS AND PAVILIONS */}
            {activeSection === 'members' && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-400" />
                    Gestión de Lectores, Pabellones y Celdas
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Control específico adaptado a la estructura de la Unidad Penitenciaria:
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                    <h5 className="font-bold text-white text-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      Ficha N° de Lector
                    </h5>
                    <p className="text-slate-400 leading-relaxed">
                      Cada lector cuenta con un número correlativo (ej: #01, #02). Este número se imprime en su carnet oficial y se usa para registrar préstamos al instante.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                    <h5 className="font-bold text-white text-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      Filtro Rápido por Pabellón
                    </h5>
                    <p className="text-slate-400 leading-relaxed">
                      En la sección de <b>Lectores & Pabellones</b> y en <b>Préstamos</b>, puedes filtrar con 1 clic para ver quiénes tienen libros en el <i>Pabellón 1, Pabellón 3, Pabellón 5</i>, etc.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                    <h5 className="font-bold text-white text-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Carnet Oficial de Lector Imprimible
                    </h5>
                    <p className="text-slate-400 leading-relaxed">
                      Desde la ficha del lector puedes abrir e imprimir su carnet tamaño credencial con el logo oficial de CPU Pastoral, sus datos de pabellón y código QR.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 5. LOANS AND RETURNS */}
            {activeSection === 'loans' && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-amber-400" />
                    Préstamos, Devoluciones y Alertas de Vencimiento
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Control de plazos, renovaciones y aviso a pabellones:
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                    <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <span className="text-amber-400 font-bold">1.</span> Registro Inmediato
                    </h5>
                    <p className="text-slate-400 leading-relaxed">
                      Al presionar el botón amarillo <b>Prestar</b>, busca el libro por su código (ej. "01-001") o título. El sistema te muestra si está disponible y permite seleccionar al lector en segundos.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                    <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <span className="text-rose-400 font-bold">2.</span> Detección Automática de Moras
                    </h5>
                    <p className="text-slate-400 leading-relaxed">
                      El sistema calcula automáticamente cuántos días de retraso tiene un libro. Los préstamos vencidos se resaltan en rojo con el pabellón y celda del lector para enviar aviso.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                    <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">3.</span> Devolución y Estado del Libro
                    </h5>
                    <p className="text-slate-400 leading-relaxed">
                      Al recibir el libro devuelto, puedes registrar el estado físico (Excelente, Bueno, Deteriorado) y dejar notas si falta alguna hoja o requiere restauración.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. STORAGE & BACKUP EXPLANATION */}
            {activeSection === 'storage' && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-400" />
                    ¿Qué Almacenamiento Utiliza el Sistema?
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Explicación técnica y operativa sobre cómo se guardan tus datos:
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-extrabold">
                      Almacenamiento Local Seguro (LocalStorage / Offline-First)
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    Actualmente, todos los libros, socios, préstamos, configuraciones y registros se guardan de forma <b>permanente en el almacenamiento local del navegador de la computadora</b>.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ventajas Clave
                      </span>
                      <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                        <li><b>100% Offline:</b> Funciona sin internet dentro del penal.</li>
                        <li><b>Inmediatez total:</b> No hay demoras de carga ni caídas de servidor.</li>
                        <li><b>Privacidad:</b> Los datos quedan exclusivamente en tu computadora.</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <span className="font-bold text-amber-400 flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        Copias de Seguridad (Backup)
                      </span>
                      <p className="text-[11px] text-slate-400">
                        En el menú <b>Configuración (⚙️)</b> puedes descargar un archivo <b>.JSON</b> con todos los datos o un <b>.CSV (Excel)</b> para guardarlo en un pendrive y restaurarlo en cualquier otra máquina.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl text-[11px] text-blue-200">
                    <b>¿Se puede conectar una Base de Datos en la Nube?</b> Sí. Si más adelante desean que varias computadoras compartan los mismos datos en tiempo real a través de internet, se puede conectar a <b>Firebase Firestore o Cloud SQL</b>.
                  </div>
                </div>
              </div>
            )}

            {/* 7. FAQ */}
            {activeSection === 'faq' && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-400" />
                    Preguntas Frecuentes
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-amber-300">
                      ¿Cómo funciona el número de identificación del lomo?
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Los primeros 2 números indican la categoría (ej: 01 Novelas, 02 Religión) y los últimos 3 o 4 números son el identificador del libro (ej: 001). Así, 01-001 es la primera novela y 02-001 el primer libro de religión.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-amber-300">
                      ¿Qué pasa si cierro el navegador o apago la computadora?
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      No se pierde nada. Todo queda guardado automáticamente en la memoria del navegador. Al volver a abrir la página, todo estará tal cual lo dejaste.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-amber-300">
                      ¿Cómo paso los datos a otra computadora?
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      En la máquina actual, abre <b>Configuración (⚙️)</b> &rarr; haz clic en <b>Exportar Copia de Seguridad (JSON)</b>. Pasa ese archivo a un pendrive, ábrelo en la nueva computadora y haz clic en <b>Restaurar Copia de Seguridad</b>.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 flex items-center gap-2">
            <span className="font-bold text-amber-400">Pastoral Universitaria CPU Batán</span>
            <span>&bull;</span>
            <span>U.P. N° 15</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl transition-colors shadow-md shadow-amber-500/20"
          >
            Entendido, Cerrar Guía
          </button>
        </div>
      </div>
    </div>
  );
};
