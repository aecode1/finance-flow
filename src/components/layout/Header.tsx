import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  onAddTransaction: () => void;
}

export function Header({ onAddTransaction }: HeaderProps) {
  const now = new Date();
  const monthYearLong  = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(now);
  const monthYearShort = new Intl.DateTimeFormat('tr-TR', { month: 'short', year: 'numeric' }).format(now);

  return (
    <header className="sticky top-0 z-10 bg-base/80 backdrop-blur-md border-b border-border px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
      {/* Month selector (visual only) */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#4A5C80] hover:bg-elevated hover:text-[#F0F4FF] transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="font-sans font-medium text-[#F0F4FF] capitalize text-sm sm:text-base text-center">
          {/* Short on mobile, long on desktop */}
          <span className="sm:hidden">{monthYearShort}</span>
          <span className="hidden sm:inline min-w-[140px] block">{monthYearLong}</span>
        </span>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#4A5C80] hover:bg-elevated hover:text-[#F0F4FF] transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Add transaction button */}
      <Button onClick={onAddTransaction} size="md" className="text-sm px-3 py-2 sm:px-4">
        <Plus size={15} />
        <span className="hidden sm:inline">İşlem Ekle</span>
        <span className="sm:hidden">Ekle</span>
      </Button>
    </header>
  );
}
