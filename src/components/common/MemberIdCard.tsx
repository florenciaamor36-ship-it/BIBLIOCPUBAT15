import React from 'react';
import { Member } from '../../types/library';
import { BarcodeSvg } from './BarcodeSvg';
import { QrCodeCanvas } from './QrCodeCanvas';
import { Building2, DoorClosed, Phone } from 'lucide-react';
import { CpuPastoralLogo } from './CpuPastoralLogo';

interface MemberIdCardProps {
  member: Member;
  libraryName?: string;
  logoUrl?: string;
  className?: string;
}

export const MemberIdCard: React.FC<MemberIdCardProps> = ({
  member,
  libraryName = 'COMUNIDAD PASTORAL UNIVERSITARIA',
  logoUrl,
  className = '',
}) => {
  return (
    <div
      id={`member-card-${member.id}`}
      className={`bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl shadow-md overflow-hidden border border-slate-700 w-full max-w-[85.6mm] sm:w-[85.6mm] min-h-[53.98mm] p-3 flex flex-col justify-between font-sans relative select-none print:w-[85.6mm] print:max-w-none print:text-black print:border-black print:shadow-none ${className}`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-blue-500 to-indigo-500"></div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5 pt-0.5">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-md bg-white overflow-hidden border border-amber-500/40 flex items-center justify-center p-0.5 shrink-0 shadow-sm">
            <CpuPastoralLogo variant="icon" size="xs" />
          </div>
          <div>
            <h3 className="font-extrabold text-[9.5px] uppercase tracking-wider text-amber-300 truncate max-w-[170px]">
              COMUNIDAD PASTORAL UNIVERSITARIA
            </h3>
            <p className="text-[7px] text-slate-300 uppercase tracking-widest">
              U.P. N° 15 BATÁN &bull; CARNET DE LECTOR
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 text-[8px] font-bold tracking-wider uppercase rounded-full text-white bg-amber-600">
          LECTOR
        </span>
      </div>

      {/* Body: Info & Location */}
      <div className="flex items-center gap-2.5 my-1">
        {/* Member Details */}
        <div className="flex-1 min-w-0 space-y-1">
          <h4 className="font-extrabold text-xs text-white truncate">
            {member.name}
          </h4>
          <div className="text-[8.5px] text-amber-300 font-mono font-bold">
            FICHA N°: {member.memberNumber}
          </div>
          <div className="flex items-center gap-2 text-[8px] text-slate-300">
            <span className="flex items-center gap-1 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
              <Building2 className="w-2.5 h-2.5 text-amber-400" />
              {member.pavilion || 'Pabellón -'}
            </span>
            <span className="flex items-center gap-1 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
              <DoorClosed className="w-2.5 h-2.5 text-cyan-400" />
              {member.cell || 'Celda -'}
            </span>
          </div>
          {member.whatsapp && (
            <div className="text-[7.5px] text-slate-400 flex items-center gap-1">
              <Phone className="w-2.5 h-2.5 text-emerald-400" />
              <span>{member.whatsapp}</span>
            </div>
          )}
        </div>

        {/* QR Code */}
        <div className="flex-shrink-0 bg-white p-1 rounded-md shadow-sm border border-neutral-200">
          <QrCodeCanvas value={`MEMBER:${member.memberNumber}|${member.name}|${member.pavilion}|${member.cell}`} size={44} />
        </div>
      </div>

      {/* Footer Barcode */}
      <div className="bg-white rounded-md p-1 flex items-center justify-center shadow-inner">
        <BarcodeSvg
          value={member.barcode || member.memberNumber}
          height={18}
          width={1.2}
          fontSize={8}
          displayValue={true}
        />
      </div>
    </div>
  );
};
