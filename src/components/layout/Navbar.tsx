import React from 'react';
import {
  BookOpen,
  LayoutDashboard,
  Library,
  ArrowLeftRight,
  Users,
  Printer,
  Settings,
  Plus,
  Bell,
  HelpCircle,
  Share2,
} from 'lucide-react';
import { LibrarySettings, LibraryStats } from '../../types/library';
import { CpuPastoralLogo } from '../common/CpuPastoralLogo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: LibraryStats;
  settings: LibrarySettings;
  unreadNotificationsCount: number;
  hasOverdueAlerts: boolean;
  onOpenNewLoan: () => void;
  onOpenNewBook: () => void;
  onOpenNotifications: () => void;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  settings,
  unreadNotificationsCount,
  hasOverdueAlerts,
  onOpenNewLoan,
  onOpenNewBook,
  onOpenNotifications,
  onOpenGuide,
  onOpenSettings,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
    { id: 'catalog', label: 'Libros', icon: Library, badge: stats.totalTitles },
    {
      id: 'loans',
      label: 'Préstamos',
      icon: ArrowLeftRight,
      badge: stats.overdueLoans > 0 ? `${stats.overdueLoans} moras` : stats.activeLoans,
      badgeAlert: stats.overdueLoans > 0,
    },
    { id: 'members', label: 'Lectores & Pabellones', icon: Users, badge: stats.totalMembers },
    { id: 'labels', label: 'Etiquetas & Fichas A4', icon: Printer },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-sm print:hidden w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Brand Logo & Name: CPU Batán Pastoral */}
          <div
            className="flex items-center gap-2 cursor-pointer group shrink min-w-0"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-9 h-9 sm:w-11 sm:h-10 rounded-2xl bg-white border border-slate-200/30 overflow-hidden flex items-center justify-center p-1 shadow-md shadow-black/20 group-hover:scale-105 transition-transform shrink-0">
              <CpuPastoralLogo variant="icon" size="sm" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm sm:text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors truncate">
                  CPU Batán
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono font-extrabold px-1 sm:px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  U.P. 15
                </span>
              </div>
              <p className="text-[9px] sm:text-[11px] text-slate-400 font-medium truncate max-w-[100px] xs:max-w-[130px] sm:max-w-xs">
                Comunidad Pastoral Universitaria
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all relative ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-extrabold ${
                        item.badgeAlert
                          ? 'bg-rose-500 text-white animate-pulse'
                          : isActive
                          ? 'bg-slate-950/20 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* User Guide Button (hidden on mobile, accessible via bottom nav/menu/dashboard) */}
            <button
              id="btn-open-guide"
              onClick={onOpenGuide}
              title="Guía de Uso del Sistema"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span className="hidden xl:inline">Guía de Uso</span>
            </button>

            {/* Notifications Button */}
            <button
              id="btn-open-notifications"
              onClick={onOpenNotifications}
              title="Notificaciones y Alertas"
              className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors relative"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadNotificationsCount > 0 && (
                <span
                  className={`absolute top-0.5 right-0.5 min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] px-1 rounded-full text-[9px] sm:text-[10px] font-black font-mono flex items-center justify-center text-white ${
                    hasOverdueAlerts ? 'bg-rose-500 animate-pulse' : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Quick Loan Button */}
            <button
              id="btn-quick-loan"
              onClick={onOpenNewLoan}
              title="Registrar Préstamo"
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-colors shadow-md shadow-amber-500/20 active:scale-95"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden xs:inline">Prestar</span>
            </button>

            {/* Quick New Book Button */}
            <button
              id="btn-quick-book"
              onClick={onOpenNewBook}
              title="Registrar Nuevo Libro"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Nuevo Libro</span>
            </button>

            {/* Settings Button */}
            <button
              id="btn-open-settings"
              onClick={onOpenSettings}
              title="Configuración de la Biblioteca"
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
