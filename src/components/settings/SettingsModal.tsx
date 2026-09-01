import React, { useState, useRef } from 'react';
import { X, Settings, Download, Upload, RotateCcw, Save, ShieldCheck, Database, FileSpreadsheet, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Book, Member, Loan, LibrarySettings } from '../../types/library';
import { exportBackupJson, exportBooksToCsv, resetToInitialData } from '../../utils/storage';
import { CpuPastoralLogo } from '../common/CpuPastoralLogo';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LibrarySettings;
  onUpdateSettings: (newSettings: LibrarySettings) => void;
  books: Book[];
  members: Member[];
  loans: Loan[];
  onDataRestored: (data: { books: Book[]; members: Member[]; loans: Loan[]; settings: LibrarySettings }) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  books,
  members,
  loans,
  onDataRestored,
}) => {
  const [formData, setFormData] = useState<LibrarySettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportJson = () => {
    exportBackupJson(books, members, loans, formData);
  };

  const handleExportCsv = () => {
    exportBooksToCsv(books);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (parsed.books && parsed.members && parsed.loans) {
          onDataRestored({
            books: parsed.books,
            members: parsed.members,
            loans: parsed.loans,
            settings: parsed.settings || formData,
          });
          setImportStatus('¡Respaldo importado y restaurado con éxito!');
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Error: El archivo JSON no tiene la estructura de respaldo válida.');
        }
      } catch (err) {
        setImportStatus('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de restablecer todos los datos a la biblioteca de ejemplo inicial? Se perderán los cambios locales no exportados.')) {
      const restored = resetToInitialData();
      onDataRestored(restored);
      setFormData(restored.settings);
      setImportStatus('Base de datos restaurada a valores iniciales.');
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Configuración del Sistema
              </h3>
              <p className="text-xs text-slate-400">
                Parámetros de biblioteca, políticas de préstamo y respaldos
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {saveSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              ¡Configuración guardada correctamente!
            </div>
          )}

          {importStatus && (
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center gap-2 text-indigo-300 text-xs font-semibold">
              <Database className="w-4 h-4" />
              {importStatus}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Identidad de la Biblioteca y Pastoral
            </h4>

            {/* Logo Settings */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-16 rounded-xl border border-amber-500/30 overflow-hidden bg-white flex items-center justify-center p-1 shrink-0 shadow-md">
                <CpuPastoralLogo variant="icon" size="md" />
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-slate-300">
                    Logo Oficial CPU Pastoral (Vector Original Adaptado)
                  </label>
                  <span className="text-[10px] font-bold text-amber-400">
                    U.P. N° 15 Batán
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.logoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="Vector Oficial CPU Pastoral (predeterminado)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cambiar</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              setFormData({ ...formData, logoUrl: ev.target.result as string });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nombre Oficial de la Biblioteca
                </label>
                <input
                  type="text"
                  required
                  value={formData.libraryName}
                  onChange={(e) => setFormData({ ...formData, libraryName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Comunidad / Institución
                </label>
                <input
                  type="text"
                  value={formData.institutionName || ''}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  placeholder="Comunidad Pastoral Universitaria - Batán"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Enlace Facebook Oficial
                </label>
                <input
                  type="url"
                  value={formData.facebookUrl || ''}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  placeholder="https://www.facebook.com/cpupastoral/"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-blue-300 focus:outline-none focus:border-amber-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email de Contacto
                </label>
                <input
                  type="email"
                  value={formData.contactEmail || ''}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="cpubatan2021@gmail.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Código o Sigla Institucional
                </label>
                <input
                  type="text"
                  value={formData.libraryCode}
                  onChange={(e) => setFormData({ ...formData, libraryCode: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Ubicación / Unidad
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Unidad Penitenciaria Batán"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 pt-3 border-t border-slate-800">
              ⏱️ Políticas de Circulación y Préstamos
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Días de Préstamo por Defecto
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={formData.defaultLoanDays}
                  onChange={(e) => setFormData({ ...formData, defaultLoanDays: parseInt(e.target.value) || 14 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Máximo de Renovaciones
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.maxRenewalsAllowed}
                  onChange={(e) => setFormData({ ...formData, maxRenewalsAllowed: parseInt(e.target.value) || 2 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Multa Diaria por Atraso ({formData.currencySymbol})
                </label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={formData.currencySymbol}
                    onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                    className="w-12 bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-sm text-center text-amber-400 font-bold"
                  />
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.finePerDay}
                    onChange={(e) => setFormData({ ...formData, finePerDay: parseFloat(e.target.value) || 0 })}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar Configuración
              </button>
            </div>
          </form>

          {/* Backup & Persistence Section */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-cyan-400" />
              Gestión de Datos y Copias de Seguridad
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={handleExportJson}
                className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-1">
                  <Download className="w-4 h-4" />
                  Descargar Copia JSON
                </div>
                <p className="text-[11px] text-slate-400">
                  Respaldo completo de catálogo, socios, préstamos y ajustes.
                </p>
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    const response = await fetch('/api/backup/save', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ books, members, loans, settings: formData }),
                    });
                    if (response.ok) {
                      setImportStatus('¡Respaldo en la nube (JSONBin) realizado con éxito!');
                      setTimeout(() => setImportStatus(null), 3000);
                    } else {
                      setImportStatus('Error al realizar respaldo en la nube.');
                    }
                  } catch (e) {
                    setImportStatus('Error de conexión con el servidor.');
                  }
                }}
                className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-1">
                  <Database className="w-4 h-4" />
                  Respaldar en Nube
                </div>
                <p className="text-[11px] text-slate-400">
                  Guardar datos cifrados en JSONBin.
                </p>
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    const response = await fetch('/api/backup/load');
                    if (response.ok) {
                      const data = await response.json();
                      onDataRestored(data);
                      setFormData(data.settings);
                      setImportStatus('¡Datos restaurados desde la nube con éxito!');
                      setTimeout(() => setImportStatus(null), 3000);
                    } else {
                      setImportStatus('Error al cargar respaldo desde la nube.');
                    }
                  } catch (e) {
                    setImportStatus('Error de conexión con el servidor.');
                  }
                }}
                className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs mb-1">
                  <Upload className="w-4 h-4" />
                  Restaurar de Nube
                </div>
                <p className="text-[11px] text-slate-400">
                  Cargar datos desde JSONBin.
                </p>
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
                  <FileSpreadsheet className="w-4 h-4" />
                  Exportar Libros (CSV)
                </div>
                <p className="text-[11px] text-slate-400">
                  Archivo compatible con Excel para inventario bibliotecario.
                </p>
              </button>

              <label className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-colors cursor-pointer flex flex-col justify-between">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs mb-1">
                  <Upload className="w-4 h-4" />
                  Restaurar JSON Local
                </div>
                <p className="text-[11px] text-slate-400">
                  Carga un archivo de respaldo previo en esta app.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>

            <div className="pt-2 flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>¿Deseas reiniciar la base de datos a los valores de muestra originales?</span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restablecer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
