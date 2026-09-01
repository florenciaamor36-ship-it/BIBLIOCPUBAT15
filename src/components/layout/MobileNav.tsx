import React from 'react';
import {
  LayoutDashboard,
  Library,
  ArrowLeftRight,
  Users,
  Printer,
  Plus,
} from 'lucide-react';
import { LibraryStats } from '../../types/library';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: LibraryStats;
  onOpenNewLoan: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  stats,
  onOpenNewLoan,
}) => {
  const items = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'catalog', label: 'Libros', icon: Library },
    { id: 'loans', label: 'Préstamos', icon: ArrowLeftRight, badge: stats.overdueLoans > 0 ? stats.overdueLoans : undefined },
    { id: 'members', label: 'Pabellones', icon: Users },
    { id: 'labels', label: 'Etiquetas', icon: Printer },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-1 py-1 pb-safe text-white shadow-2xl print:hidden w-full max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between w-full max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 flex-1 min-w-0 rounded-xl transition-all relative ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 text-[9px] font-bold bg-rose-500 text-white rounded-full min-w-[14px] text-center animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 truncate max-w-full text-center leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
