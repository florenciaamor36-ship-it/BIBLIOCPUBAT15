import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Save,
  Building2,
  DoorClosed,
  Phone,
  Hash,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { Member, MemberStatus } from '../../types/library';

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMember: (member: Member) => void;
  memberToEdit?: Member | null;
  highestMemberNumber?: number;
}

const COMMON_PAVILIONS = [
  'Pabellón 1',
  'Pabellón 2',
  'Pabellón 3',
  'Pabellón 4',
  'Pabellón 5',
  'Pabellón 6',
  'Pabellón 7',
  'Pabellón 8',
  'Pabellón 9',
  'Pabellón 10',
  'Pabellón de Régimen Abierto',
  'Pabellón de Tránsito',
];

export const MemberFormModal: React.FC<MemberFormModalProps> = ({
  isOpen,
  onClose,
  onSaveMember,
  memberToEdit,
  highestMemberNumber = 6,
}) => {
  const isEditing = !!memberToEdit;

  const [name, setName] = useState('');
  const [pavilion, setPavilion] = useState(COMMON_PAVILIONS[0]);
  const [customPavilion, setCustomPavilion] = useState('');
  const [isCustomPavilion, setIsCustomPavilion] = useState(false);
  const [cell, setCell] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  const [status, setStatus] = useState<MemberStatus>('activo');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (memberToEdit) {
      setName(memberToEdit.name || '');
      
      if (COMMON_PAVILIONS.includes(memberToEdit.pavilion)) {
        setPavilion(memberToEdit.pavilion);
        setIsCustomPavilion(false);
        setCustomPavilion('');
      } else {
        setIsCustomPavilion(true);
        setCustomPavilion(memberToEdit.pavilion || '');
      }

      setCell(memberToEdit.cell || '');
      setWhatsapp(memberToEdit.whatsapp || '');
      setMemberNumber(memberToEdit.memberNumber || '');
      setStatus(memberToEdit.status || 'activo');
      setNotes(memberToEdit.notes || '');
    } else {
      const nextNum = `LEC-${(highestMemberNumber + 1).toString().padStart(2, '0')}`;
      setName('');
      setPavilion(COMMON_PAVILIONS[0]);
      setIsCustomPavilion(false);
      setCustomPavilion('');
      setCell('Celda 1');
      setWhatsapp('');
      setMemberNumber(nextNum);
      setStatus('activo');
      setNotes('');
    }
  }, [memberToEdit, isOpen, highestMemberNumber]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Por favor escribe el nombre completo del lector.');
      return;
    }

    const finalPavilion = isCustomPavilion
      ? (customPavilion.trim() || 'Sin Pabellón')
      : pavilion;

    const formattedMember: Member = {
      id: memberToEdit ? memberToEdit.id : `member-${Date.now()}`,
      memberNumber: memberNumber.trim() || `LEC-${Date.now().toString().slice(-3)}`,
      name: name.trim(),
      pavilion: finalPavilion,
      cell: cell.trim() || 'Sin Celda',
      whatsapp: whatsapp.trim(),
      status,
      registrationDate: memberToEdit?.registrationDate || new Date().toISOString().split('T')[0],
      maxAllowedLoans: 3,
      currentLoansCount: memberToEdit?.currentLoansCount || 0,
      totalLoansHistory: memberToEdit?.totalLoansHistory || 0,
      notes: notes.trim(),
    };

    onSaveMember(formattedMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                {isEditing ? 'Modificar Datos del Lector' : 'Registrar Nuevo Lector'}
              </h3>
              <p className="text-xs text-slate-400">
                Control por nombre completo, pabellón, celda y WhatsApp
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Row 1: Nombre Completo */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              Nombre Completo del Lector / Interno *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej: Juan Carlos Morales"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 placeholder-slate-600"
            />
          </div>

          {/* Row 2: Pabellón y Celda */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                Pabellón *
              </label>

              {!isCustomPavilion ? (
                <select
                  value={pavilion}
                  onChange={(e) => {
                    if (e.target.value === 'OTRO') {
                      setIsCustomPavilion(true);
                    } else {
                      setPavilion(e.target.value);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl text-white font-bold text-sm focus:outline-none"
                >
                  {COMMON_PAVILIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                  <option value="OTRO">+ Escribir otro pabellón...</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={customPavilion}
                    onChange={(e) => setCustomPavilion(e.target.value)}
                    placeholder="ej: Pabellón 12..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-amber-500 rounded-xl text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomPavilion(false)}
                    className="px-2.5 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                  >
                    Lista
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <DoorClosed className="w-3.5 h-3.5 text-cyan-400" />
                Celda *
              </label>
              <input
                type="text"
                required
                value={cell}
                onChange={(e) => setCell(e.target.value)}
                placeholder="ej: Celda 4, Celda 12"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl text-white font-bold text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Row 3: Número de WhatsApp */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              Número de WhatsApp / Celular de Contacto
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="ej: +54 9 223 540-1234 o 2235401234"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl text-emerald-300 font-mono font-bold text-sm focus:outline-none placeholder-slate-600"
            />
            <span className="text-[10px] text-slate-500">
              Permite enviar avisos y recordatorios de devolución con 1 solo clic
            </span>
          </div>

          {/* Row 4: N° de Lector & Estado */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                N° de Ficha / Lector
              </label>
              <input
                type="text"
                value={memberNumber}
                onChange={(e) => setMemberNumber(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-300 font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                Estado del Lector
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MemberStatus)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none"
              >
                <option value="activo">Activo (Habilitado para retirar)</option>
                <option value="suspendido">Suspendido (Libros pendientes)</option>
                <option value="inactivo">Inactivo (Trasladado / Egresado)</option>
              </select>
            </div>
          </div>

          {/* Row 5: Observaciones */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Observaciones / Notas (Opcional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ej: Asiste a talleres de carpintería, prefiere libros de historia..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl text-white text-xs focus:outline-none placeholder-slate-600"
            />
          </div>

          {/* Submit Buttons */}
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
              className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Guardar Cambios' : 'Registrar Lector'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
