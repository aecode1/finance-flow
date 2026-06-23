import { LayoutDashboard, ArrowLeftRight, Tag, Settings, TrendingUp, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinanceStore } from '../../store/financeStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../utils/formatters';
import { useActiveSection } from '../../hooks/useActiveSection';

const SECTION_IDS = ['dashboard', 'kategoriler', 'islemler', 'ayarlar'];

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',   sectionId: 'dashboard'   },
  { icon: ArrowLeftRight,  label: 'İşlemler',    sectionId: 'islemler'    },
  { icon: Tag,             label: 'Kategoriler', sectionId: 'kategoriler' },
  { icon: Settings,        label: 'Ayarlar',     sectionId: 'ayarlar'     },
];

function scrollTo(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function Sidebar() {
  const { transactions } = useFinanceStore();
  const { user, signOut } = useAuthStore();
  const activeId = useActiveSection(SECTION_IDS, 'main-scroll');

  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netBalance   = totalIncome - totalExpense;

  return (
    <aside className="w-64 h-full bg-surface border-r border-border flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-border">
        <button
          onClick={() => scrollTo('dashboard')}
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
            <TrendingUp size={18} className="text-accent" />
          </div>
          <span className="font-display font-bold text-xl bg-gradient-to-r from-accent to-income bg-clip-text text-transparent">
            FinanceFlow
          </span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.sectionId;

          return (
            <button
              key={item.label}
              onClick={() => scrollTo(item.sectionId)}
              className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 group"
              style={{
                color: isActive ? '#F0F4FF' : '#8B9DC3',
                background: isActive ? '#1A2235' : 'transparent',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#1A223580';
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              {/* Animated accent bar */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="nav-accent"
                    className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-accent"
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </AnimatePresence>

              <Icon
                size={18}
                style={{ color: isActive ? '#6366F1' : '#8B9DC3' }}
                className="transition-colors duration-150 flex-shrink-0"
              />

              <span className="transition-colors duration-150">{item.label}</span>

              {/* Active dot */}
              {isActive && (
                <motion.span
                  layoutId="nav-dot"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-accent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Balance summary */}
      <div
        className="mx-3 p-4 rounded-2xl cursor-pointer"
        style={{ background: '#1A2235', border: '1px solid #1E2D45' }}
        onClick={() => scrollTo('dashboard')}
      >
        <p className="text-[10px] font-sans text-[#4A5C80] mb-2 uppercase tracking-widest">Net Bakiye</p>
        <p className={`font-display text-xl font-bold ${netBalance >= 0 ? 'text-income' : 'text-expense'}`}>
          {formatCurrency(netBalance)}
        </p>
        <div className="mt-3 pt-3 border-t border-[#1E2D45] flex justify-between text-xs font-sans">
          <span className="text-income flex items-center gap-1">
            <span className="text-[10px]">↑</span>{formatCurrency(totalIncome)}
          </span>
          <span className="text-expense flex items-center gap-1">
            <span className="text-[10px]">↓</span>{formatCurrency(totalExpense)}
          </span>
        </div>
      </div>

      {/* User + logout */}
      <div className="mx-3 mb-4 mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ border: '1px solid #1E2D45' }}>
        <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-mono font-bold text-accent uppercase">
            {user?.email?.[0] ?? '?'}
          </span>
        </div>
        <p className="flex-1 text-[11px] font-sans text-[#8B9DC3] truncate min-w-0">
          {user?.email ?? ''}
        </p>
        <button
          onClick={signOut}
          title="Çıkış Yap"
          className="p-1.5 rounded-lg text-[#4A5C80] hover:text-expense hover:bg-expense/10 transition-colors flex-shrink-0"
        >
          <LogOut size={13} />
        </button>
      </div>
    </aside>
  );
}
