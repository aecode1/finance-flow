import { LayoutDashboard, ArrowLeftRight, Tag, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveSection } from '../../hooks/useActiveSection';

const SECTION_IDS = ['dashboard', 'kategoriler', 'islemler', 'ayarlar'];

const navItems = [
  { icon: LayoutDashboard, label: 'Ana Sayfa', sectionId: 'dashboard'   },
  { icon: ArrowLeftRight,  label: 'İşlemler',  sectionId: 'islemler'    },
  { icon: Tag,             label: 'Kategoriler',sectionId: 'kategoriler' },
  { icon: Settings,        label: 'Ayarlar',   sectionId: 'ayarlar'     },
];

function scrollTo(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function BottomNav() {
  const activeId = useActiveSection(SECTION_IDS, 'main-scroll');

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(15, 22, 35, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid #1E2D45',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.sectionId;

          return (
            <button
              key={item.label}
              onClick={() => scrollTo(item.sectionId)}
              className="relative flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors duration-150"
              style={{ minWidth: 64 }}
            >
              {/* Active background pill */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-bg"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: '#6366F115' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <div className="relative">
                <Icon
                  size={22}
                  style={{ color: isActive ? '#6366F1' : '#4A5C80' }}
                  className="transition-colors duration-150"
                />
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-dot"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className="text-[10px] font-sans font-medium leading-none transition-colors duration-150"
                style={{ color: isActive ? '#6366F1' : '#4A5C80' }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
