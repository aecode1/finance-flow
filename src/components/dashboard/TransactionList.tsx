import { Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useFinanceStore } from '../../store/financeStore';
import { formatCurrency, formatDate } from '../../utils/formatters';

function CategoryIcon({ iconName, color }: { iconName: string; color: string }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[iconName];
  if (!Icon) return null;
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{
        background: `linear-gradient(135deg, ${color}20, ${color}08)`,
        border: `1px solid ${color}25`,
      }}
    >
      <Icon size={16} style={{ color }} />
    </div>
  );
}

export function TransactionList() {
  const { transactions, categories, removeTransaction } = useFinanceStore();

  const sorted = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const incomeTotal  = sorted.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenseTotal = sorted.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #0F1623 0%, #0a1020 100%)',
        border: '1px solid #1E2D45',
        boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
      }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-[#162035]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-bold text-[#F0F4FF]">Son İşlemler</h2>
            <span
              className="px-2 py-0.5 rounded-lg text-xs font-mono font-medium"
              style={{ background: '#6366F115', color: '#6366F1', border: '1px solid #6366F125' }}
            >
              {sorted.length}
            </span>
          </div>

          {/* Mini summary */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-income">
              <ArrowUpRight size={12} />
              {formatCurrency(incomeTotal)}
            </span>
            <span className="text-[#1E2D45]">|</span>
            <span className="flex items-center gap-1 text-expense">
              <ArrowDownRight size={12} />
              {formatCurrency(expenseTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="px-3 py-3">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-elevated flex items-center justify-center">
              <span className="text-2xl">💸</span>
            </div>
            <p className="text-[#4A5C80] font-sans text-sm">Henüz işlem yok</p>
          </div>
        ) : (
          <ul>
            <AnimatePresence>
              {sorted.map((tx, i) => {
                const cat = categories.find(c => c.id === tx.categoryId);
                const isIncome = tx.type === 'income';
                const accentColor = isIncome ? '#10B981' : '#F43F5E';

                return (
                  <motion.li
                    key={tx.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24, transition: { duration: 0.18 } }}
                    transition={{ duration: 0.22, delay: i * 0.03 }}
                    className="group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-150 hover:bg-[#1A2235]"
                  >
                    {/* Left accent bar */}
                    <div
                      className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                      style={{ backgroundColor: accentColor }}
                    />

                    {cat && <CategoryIcon iconName={cat.icon} color={cat.color} />}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-sans font-semibold text-[#F0F4FF] truncate leading-snug">
                        {tx.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {cat && (
                          <>
                            <span
                              className="text-[10px] font-sans px-1.5 py-0.5 rounded-md"
                              style={{ background: `${cat.color}15`, color: cat.color }}
                            >
                              {cat.name}
                            </span>
                            <span className="text-[#1E2D45]">·</span>
                          </>
                        )}
                        <span className="text-[10px] font-mono text-[#4A5C80]">{formatDate(tx.date)}</span>
                      </div>
                    </div>

                    {/* Amount pill */}
                    <div
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl flex-shrink-0"
                      style={{
                        background: `${accentColor}10`,
                        border: `1px solid ${accentColor}20`,
                      }}
                    >
                      {isIncome
                        ? <ArrowUpRight size={11} style={{ color: accentColor }} />
                        : <ArrowDownRight size={11} style={{ color: accentColor }} />
                      }
                      <span className="font-mono text-xs font-semibold" style={{ color: accentColor }}>
                        {formatCurrency(tx.amount)}
                      </span>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeTransaction(tx.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1.5 rounded-lg hover:bg-[#F43F5E15] text-[#4A5C80] hover:text-expense ml-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {/* Footer */}
      {sorted.length > 0 && (
        <div className="px-6 py-3 border-t border-[#162035]">
          <p className="text-[10px] font-sans text-[#4A5C80] text-center uppercase tracking-widest">
            Son {sorted.length} işlem gösteriliyor
          </p>
        </div>
      )}
    </div>
  );
}
