import * as LucideIcons from 'lucide-react';
import { useFinanceStore } from '../../store/financeStore';
import { formatCurrency } from '../../utils/formatters';
import { Card } from '../ui/Card';

export function CategoryBreakdown() {
  const { transactions, categories } = useFinanceStore();

  const breakdown = categories
    .filter(c => c.type === 'expense')
    .map(cat => {
      const total = transactions
        .filter(t => t.categoryId === cat.id && t.type === 'expense')
        .reduce((s, t) => s + t.amount, 0);
      return { ...cat, total };
    })
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total);

  const grandTotal = breakdown.reduce((s, c) => s + c.total, 0);

  return (
    <Card className="p-6">
      <h2 className="font-display text-lg font-semibold text-[#F0F4FF] mb-5">Kategori Detayı</h2>
      <div className="space-y-4">
        {breakdown.map((cat) => {
          const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[cat.icon];
          const pct = grandTotal > 0 ? (cat.total / grandTotal) * 100 : 0;
          return (
            <div key={cat.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {Icon && <Icon size={14} style={{ color: cat.color }} />}
                  <span className="text-sm font-sans text-[#F0F4FF]">{cat.name}</span>
                </div>
                <span className="text-sm font-mono text-[#8B9DC3]">{formatCurrency(cat.total)}</span>
              </div>
              <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: cat.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
