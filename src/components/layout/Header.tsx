import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  onAddTransaction: () => void;
}

export function Header({ onAddTransaction }: HeaderProps) {
  const now = new Date();
  const monthYear = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(now);

  return (
    <header className="sticky top-0 z-10 bg-base/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
      {/* Month selector (visual only) */}
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#4A5C80] hover:bg-elevated hover:text-[#F0F4FF] transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="font-sans font-medium text-[#F0F4FF] capitalize min-w-[140px] text-center">
          {monthYear}
        </span>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#4A5C80] hover:bg-elevated hover:text-[#F0F4FF] transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Add transaction button */}
      <Button onClick={onAddTransaction} size="md">
        <Plus size={16} />
        İşlem Ekle
      </Button>
    </header>
  );
}
