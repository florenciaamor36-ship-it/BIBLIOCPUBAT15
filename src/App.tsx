import React, { useState, useEffect, useMemo } from 'react';
import {
  Book,
  Member,
  Loan,
  LibrarySettings,
} from './types/library';
import {
  loadLibraryData,
  saveLibraryData,
  calculateLibraryStats,
} from './utils/storage';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { BookCatalogView } from './components/books/BookCatalogView';
import { LoansView } from './components/loans/LoansView';
import { MembersView } from './components/members/MembersView';
import { LabelMakerView } from './components/labels/LabelMakerView';

// Modals
import { BookFormModal } from './components/books/BookFormModal';
import { BookDetailModal } from './components/books/BookDetailModal';
import { NewLoanModal } from './components/loans/NewLoanModal';
import { ReturnModal } from './components/loans/ReturnModal';
import { MemberFormModal } from './components/members/MemberFormModal';
import { MemberDetailModal } from './components/members/MemberDetailModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { UserGuideModal } from './components/guide/UserGuideModal';
import { NotificationsModal } from './components/notifications/NotificationsModal';

import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  // Primary Data State loaded from localStorage / initial seed
  const [data, setData] = useState(() => loadLibraryData());
  const { books, members, loans, settings } = data;

  // Active navigation tab: 'dashboard' | 'catalog' | 'loans' | 'members' | 'labels'
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toast notifications
  const [toast, setToast] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Book modals
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [selectedBookDetail, setSelectedBookDetail] = useState<Book | null>(null);

  // Loan modals
  const [isNewLoanOpen, setIsNewLoanOpen] = useState(false);
  const [preselectedLoanBook, setPreselectedLoanBook] = useState<Book | null>(null);
  const [preselectedLoanMember, setPreselectedLoanMember] = useState<Member | null>(null);
  const [selectedReturnLoan, setSelectedReturnLoan] = useState<Loan | null>(null);

  // Member modals
  const [isMemberFormOpen, setIsMemberFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [selectedMemberDetail, setSelectedMemberDetail] = useState<Member | null>(null);

  // Label maker preselection
  const [labelPreselectedBookIds, setLabelPreselectedBookIds] = useState<string[]>([]);

  // Save locally and create a cloud backup 3 seconds after the last change.
  // The server keeps JSONBin credentials private in its environment variables.
  useEffect(() => {
    saveLibraryData(books, members, loans, settings);

    const timer = window.setTimeout(() => {
      fetch('/api/backup/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: '2.0',
          app: 'Biblioteca y Control de Pabellones',
          exportDate: new Date().toISOString(),
          settings,
          books,
          members,
          loans,
        }),
      }).catch((error) => {
        console.error('No se pudo realizar el respaldo automático:', error);
      });
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [books, members, loans, settings]);

  // Derived library statistics
  const stats = useMemo(() => {
    return calculateLibraryStats(books, members, loans);
  }, [books, members, loans]);

  // Active notifications count
  const unreadNotificationsCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let count = 0;
    loans.forEach((l) => {
      if (l.status === 'devuelto') return;
      const due = new Date(l.dueDate);
      due.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0 || (diffDays >= 0 && diffDays <= 3)) {
        count += 1;
      }
    });
    return count;
  }, [loans]);

  // Highest book and member numbers for sequential autogeneration
  const highestBookNumber = useMemo(() => {
    let max = 0;
    books.forEach((b) => {
      const num = parseInt(b.bookNumber?.replace(/\D/g, '') || '0', 10);
      if (num > max) max = num;
    });
    return max;
  }, [books]);

  const highestMemberNumber = useMemo(() => {
    let max = 0;
    members.forEach((m) => {
      const num = parseInt(m.memberNumber?.replace(/\D/g, '') || '0', 10);
      if (num > max) max = num;
    });
    return max;
  }, [members]);

  // --- BOOK ACTIONS ---
  const handleSaveBook = (savedBook: Book) => {
    setData((prev) => {
      const exists = prev.books.some((b) => b.id === savedBook.id);
      const updatedBooks = exists
        ? prev.books.map((b) => (b.id === savedBook.id ? savedBook : b))
        : [savedBook, ...prev.books];
      return { ...prev, books: updatedBooks };
    });
    showToast(editingBook ? `Libro "${savedBook.title}" actualizado` : `Libro "${savedBook.title}" registrado con éxito`);
    setEditingBook(null);
  };

  const handleDeleteBook = (bookId: string) => {
    setData((prev) => ({
      ...prev,
      books: prev.books.filter((b) => b.id !== bookId),
    }));
    showToast('Libro eliminado del catálogo', 'info');
  };

  // --- MEMBER ACTIONS ---
  const handleSaveMember = (savedMember: Member) => {
    setData((prev) => {
      const exists = prev.members.some((m) => m.id === savedMember.id);
      const updatedMembers = exists
        ? prev.members.map((m) => (m.id === savedMember.id ? savedMember : m))
        : [savedMember, ...prev.members];
      return { ...prev, members: updatedMembers };
    });
    showToast(editingMember ? `Lector "${savedMember.name}" actualizado` : `Lector "${savedMember.name}" registrado`);
    setEditingMember(null);
  };

  const handleDeleteMember = (memberId: string) => {
    setData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
    }));
    showToast('Lector eliminado del registro', 'info');
  };

  // --- LOAN ACTIONS ---
  const handleRegisterLoan = (newLoan: Loan) => {
    setData((prev) => {
      // 1. Add new loan
      const updatedLoans = [newLoan, ...prev.loans];

      // 2. Decrement available copies on Book
      const updatedBooks = prev.books.map((b) => {
        if (b.id === newLoan.bookId) {
          const newAvail = Math.max(0, b.availableCopies - 1);
          return {
            ...b,
            availableCopies: newAvail,
            status: (newAvail === 0 ? 'agotado' : 'disponible') as any,
          };
        }
        return b;
      });

      // 3. Increment member loans count
      const updatedMembers = prev.members.map((m) => {
        if (m.id === newLoan.memberId) {
          return { ...m, currentLoansCount: m.currentLoansCount + 1 };
        }
        return m;
      });

      return {
        ...prev,
        loans: updatedLoans,
        books: updatedBooks,
        members: updatedMembers,
      };
    });

    showToast(`Préstamo registrado a ${newLoan.memberName} (${newLoan.memberPavilion} - ${newLoan.memberCell})`);
    setPreselectedLoanBook(null);
    setPreselectedLoanMember(null);
  };

  const handleConfirmReturn = (
    loanId: string,
    returnData: { notes: string }
  ) => {
    const todayStr = new Date().toISOString().split('T')[0];

    setData((prev) => {
      const targetLoan = prev.loans.find((l) => l.id === loanId);
      if (!targetLoan) return prev;

      // 1. Update loan status to 'devuelto'
      const updatedLoans = prev.loans.map((l) =>
        l.id === loanId
          ? {
              ...l,
              status: 'devuelto' as const,
              returnDate: todayStr,
              notes: returnData.notes ? `${l.notes || ''} [Devuelto: ${returnData.notes}]` : l.notes,
            }
          : l
      );

      // 2. Increment book available copies
      const updatedBooks = prev.books.map((b) => {
        if (b.id === targetLoan.bookId) {
          const newAvail = Math.min(b.totalCopies, b.availableCopies + 1);
          return {
            ...b,
            availableCopies: newAvail,
            status: 'disponible' as any,
          };
        }
        return b;
      });

      // 3. Decrement member active loans
      const updatedMembers = prev.members.map((m) => {
        if (m.id === targetLoan.memberId) {
          return { ...m, currentLoansCount: Math.max(0, m.currentLoansCount - 1) };
        }
        return m;
      });

      return {
        ...prev,
        loans: updatedLoans,
        books: updatedBooks,
        members: updatedMembers,
      };
    });

    showToast(`Devolución confirmada. El libro reingresó a la biblioteca.`);
    setSelectedReturnLoan(null);
  };

  const handleRenewLoan = (loanId: string, additionalDays: number = 7) => {
    setData((prev) => {
      const updatedLoans = prev.loans.map((l) => {
        if (l.id === loanId) {
          const currentDue = new Date(l.dueDate);
          currentDue.setDate(currentDue.getDate() + additionalDays);
          const newDueDateStr = currentDue.toISOString().split('T')[0];

          return {
            ...l,
            dueDate: newDueDateStr,
            renewalsCount: (l.renewalsCount || 0) + 1,
            status: 'renovado' as const,
          };
        }
        return l;
      });
      return { ...prev, loans: updatedLoans };
    });

    showToast(`Plazo extendido por ${additionalDays} días`);
  };

  // --- SHORTCUT ACTIONS ---
  const handleOpenLoanForBook = (book: Book) => {
    setPreselectedLoanBook(book);
    setPreselectedLoanMember(null);
    setIsNewLoanOpen(true);
  };

  const handleOpenLoanForMember = (member: Member) => {
    setPreselectedLoanMember(member);
    setPreselectedLoanBook(null);
    setIsNewLoanOpen(true);
  };

  const handlePrintLabelsForBook = (book: Book) => {
    setLabelPreselectedBookIds([book.id]);
    setActiveTab('labels');
  };

  const handlePrintBatchLabels = (selectedBookIds: string[]) => {
    setLabelPreselectedBookIds(selectedBookIds);
    setActiveTab('labels');
  };

  const handleUpdateSettings = (newSettings: LibrarySettings) => {
    setData((prev) => ({ ...prev, settings: newSettings }));
    showToast('Configuración actualizada');
  };

  const handleDataRestored = (restoredData: {
    books: Book[];
    members: Member[];
    loans: Loan[];
    settings: LibrarySettings;
  }) => {
    setData(restoredData);
    showToast('Base de datos restaurada correctamente');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 w-full max-w-full overflow-x-hidden">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right max-w-sm">
          <div
            className={`p-3.5 rounded-2xl shadow-2xl border flex items-center gap-2.5 text-xs font-bold ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-300'
                : 'bg-slate-900/90 border-slate-700 text-slate-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        settings={settings}
        unreadNotificationsCount={unreadNotificationsCount}
        hasOverdueAlerts={stats.overdueLoans > 0}
        onOpenNewLoan={() => {
          setPreselectedLoanBook(null);
          setPreselectedLoanMember(null);
          setIsNewLoanOpen(true);
        }}
        onOpenNewBook={() => {
          setEditingBook(null);
          setIsBookFormOpen(true);
        }}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-20 md:pb-8 overflow-x-hidden">
        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            settings={settings}
            books={books}
            members={members}
            loans={loans}
            onNavigate={setActiveTab}
            onOpenNewLoan={() => {
              setPreselectedLoanBook(null);
              setPreselectedLoanMember(null);
              setIsNewLoanOpen(true);
            }}
            onOpenNewBook={() => {
              setEditingBook(null);
              setIsBookFormOpen(true);
            }}
            onOpenNewMember={() => {
              setEditingMember(null);
              setIsMemberFormOpen(true);
            }}
            onOpenReturn={(loan) => {
              if (loan) setSelectedReturnLoan(loan);
            }}
            onSelectBook={(book) => setSelectedBookDetail(book)}
            onSelectLoan={(loan) => setSelectedReturnLoan(loan)}
            onOpenGuide={() => setIsGuideOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {activeTab === 'catalog' && (
          <BookCatalogView
            books={books}
            settings={settings}
            onOpenNewBook={() => {
              setEditingBook(null);
              setIsBookFormOpen(true);
            }}
            onSelectBook={(book) => setSelectedBookDetail(book)}
            onEditBook={(book) => {
              setEditingBook(book);
              setIsBookFormOpen(true);
            }}
            onLoanBook={handleOpenLoanForBook}
            onPrintLabelForBook={handlePrintLabelsForBook}
            onPrintBatchLabels={handlePrintBatchLabels}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeTab === 'loans' && (
          <LoansView
            loans={loans}
            settings={settings}
            onOpenNewLoan={() => {
              setPreselectedLoanBook(null);
              setPreselectedLoanMember(null);
              setIsNewLoanOpen(true);
            }}
            onOpenReturnModal={(loan) => setSelectedReturnLoan(loan)}
            onRenewLoan={handleRenewLoan}
          />
        )}

        {activeTab === 'members' && (
          <MembersView
            members={members}
            settings={settings}
            onOpenNewMember={() => {
              setEditingMember(null);
              setIsMemberFormOpen(true);
            }}
            onSelectMember={(member) => setSelectedMemberDetail(member)}
            onEditMember={(member) => {
              setEditingMember(member);
              setIsMemberFormOpen(true);
            }}
            onNewLoanForMember={handleOpenLoanForMember}
          />
        )}

        {activeTab === 'labels' && (
          <LabelMakerView
            books={books}
            members={members}
            settings={settings}
            preselectedBookIds={labelPreselectedBookIds}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        onOpenNewLoan={() => {
          setPreselectedLoanBook(null);
          setPreselectedLoanMember(null);
          setIsNewLoanOpen(true);
        }}
      />

      {/* MODALS */}
      {/* Book Form Modal (New / Edit) */}
      <BookFormModal
        isOpen={isBookFormOpen}
        onClose={() => {
          setIsBookFormOpen(false);
          setEditingBook(null);
        }}
        onSaveBook={handleSaveBook}
        bookToEdit={editingBook}
        existingBooks={books}
        highestBookNumber={highestBookNumber}
      />

      {/* Book Detail Modal */}
      <BookDetailModal
        isOpen={!!selectedBookDetail}
        onClose={() => setSelectedBookDetail(null)}
        book={selectedBookDetail}
        loans={loans}
        onEdit={(book) => {
          setSelectedBookDetail(null);
          setEditingBook(book);
          setIsBookFormOpen(true);
        }}
        onDelete={handleDeleteBook}
        onLoanBook={handleOpenLoanForBook}
        onPrintLabels={handlePrintLabelsForBook}
      />

      {/* Member Form Modal (New / Edit) */}
      <MemberFormModal
        isOpen={isMemberFormOpen}
        onClose={() => {
          setIsMemberFormOpen(false);
          setEditingMember(null);
        }}
        onSaveMember={handleSaveMember}
        memberToEdit={editingMember}
        highestMemberNumber={highestMemberNumber}
      />

      {/* Member Detail Modal */}
      <MemberDetailModal
        isOpen={!!selectedMemberDetail}
        onClose={() => setSelectedMemberDetail(null)}
        member={selectedMemberDetail}
        loans={loans}
        settings={settings}
        onEdit={(member) => {
          setSelectedMemberDetail(null);
          setEditingMember(member);
          setIsMemberFormOpen(true);
        }}
        onDelete={handleDeleteMember}
        onNewLoanForMember={handleOpenLoanForMember}
        onReturnLoan={(loan) => setSelectedReturnLoan(loan)}
      />

      {/* New Loan Modal */}
      <NewLoanModal
        isOpen={isNewLoanOpen}
        onClose={() => {
          setIsNewLoanOpen(false);
          setPreselectedLoanBook(null);
          setPreselectedLoanMember(null);
        }}
        books={books}
        members={members}
        settings={settings}
        preselectedBook={preselectedLoanBook}
        preselectedMember={preselectedLoanMember}
        onRegisterLoan={handleRegisterLoan}
      />

      {/* Return Loan Modal */}
      <ReturnModal
        isOpen={!!selectedReturnLoan}
        onClose={() => setSelectedReturnLoan(null)}
        loan={selectedReturnLoan}
        settings={settings}
        onConfirmReturn={handleConfirmReturn}
        onRenewLoan={handleRenewLoan}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        books={books}
        members={members}
        loans={loans}
        onDataRestored={handleDataRestored}
      />

      {/* User Guide Modal */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onNavigate={(tab) => {
          setIsGuideOpen(false);
          setActiveTab(tab);
        }}
      />

      {/* Notifications and Alerts Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        loans={loans}
        books={books}
        members={members}
        onOpenReturnModal={(loan) => {
          setIsNotificationsOpen(false);
          setSelectedReturnLoan(loan);
        }}
        onRenewLoan={(loan) => {
          handleRenewLoan(loan);
        }}
      />
    </div>
  );
}
