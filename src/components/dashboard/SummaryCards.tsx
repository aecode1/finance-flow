import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFinanceStore } from '../../store/financeStore';
import { formatCurrency } from '../../utils/formatters';

interface CardConfig {
  label: string;
  sublabel: string;
  amount: number;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  borderColor: string;
  glowColor: string;
  TrendIcon: React.ElementType;
}

export function SummaryCards() {
  const { transactions } = useFinanceStore();

  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netBalance   = totalIncome - totalExpense;
  const incomeCount  = transactions.filter(t => t.type === 'income').length;
  const expenseCount = transactions.filter(t => t.type === 'expense').length;

  const cards: CardConfig[] = [
    {
      label:       'Toplam Gelir',
      sublabel:    `${incomeCount} işlem`,
      amount:      totalIncome,
      icon:        TrendingUp,
      color:       '#10B981',
      bgGradient:  'linear-gradient(135deg, #10B98108 0%, #10B98103 100%)',
      borderColor: '#10B98130',
      glowColor:   'rgba(16,185,129,0.12)',
      TrendIcon:   ArrowUpRight,
    },
    {
      label:       'Toplam Gider',
      sublabel:    `${expenseCount} işlem`,
      amount:      totalExpense,
      icon:        TrendingDown,
      color:       '#F43F5E',
      bgGradient:  'linear-gradient(135deg, #F43F5E08 0%, #F43F5E03 100%)',
      borderColor: '#F43F5E30',
      glowColor:   'rgba(244,63,94,0.12)',
      TrendIcon:   ArrowDownRight,
    },
    {
      label:       'Net Bakiye',
      sublabel:    netBalance >= 0 ? 'Pozitif bakiye' : 'Negatif bakiye',
      amount:      netBalance,
      icon:        Wallet,
      color:       netBalance >= 0 ? '#10B981' : '#F43F5E',
      bgGradient:  netBalance >= 0
        ? 'linear-gradient(135deg, #10B98108 0%, #6366F103 100%)'
        : 'linear-gradient(135deg, #F43F5E08 0%, #6366F103 100%)',
      borderColor: netBalance >= 0 ? '#10B98130' : '#F43F5E30',
      glowColor:   netBalance >= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
      TrendIcon:   netBalance >= 0 ? ArrowUpRight : ArrowDownRight,
    },
  ];

  return (
    /* Mobile: tek sütun | Tablet+: 3 sütun */
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const TrendIcon = card.TrendIcon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="relative rounded-2xl overflow-hidden cursor-default"
            style={{
              background: card.bgGradient,
              border: `1px solid ${card.borderColor}`,
              boxShadow: `0 0 0 1px ${card.borderColor}, 0 4px 24px ${card.glowColor}`,
            }}
          >
            {/* Top shine */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${card.color}50, transparent)` }}
            />

            {/* Mobile: yatay düzen | Desktop: dikey */}
            <div className="p-4 sm:p-6 flex sm:block items-center gap-4">
              {/* Icon — mobilde solda */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${card.color}15`, border: `1px solid ${card.color}25` }}
              >
                <Icon size={18} style={{ color: card.color }} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 sm:mt-0">
                {/* Desktop: badge üstte | Mobile: badge gizli (yer kaplıyor) */}
                <div className="hidden sm:flex justify-end mb-3">
                  <div
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-sans font-medium"
                    style={{ backgroundColor: `${card.color}12`, color: card.color }}
                  >
                    <TrendIcon size={12} />
                    {card.sublabel}
                  </div>
                </div>

                <p className="text-[10px] sm:text-xs font-sans font-medium uppercase tracking-widest mb-1" style={{ color: '#4A5C80' }}>
                  {card.label}
                </p>
                <p className="font-display text-xl sm:text-2xl font-bold leading-none" style={{ color: card.color }}>
                  {formatCurrency(card.amount)}
                </p>

                {/* Mobile'da sublabel küçük yazı */}
                <p className="sm:hidden text-[10px] font-sans mt-1" style={{ color: card.color + '99' }}>
                  {card.sublabel}
                </p>
              </div>
            </div>

            {/* Bottom shimmer — sadece desktop'ta */}
            <div
              className="hidden sm:block mx-6 mb-5 h-0.5 rounded-full"
              style={{ background: `linear-gradient(90deg, ${card.color}30, transparent)` }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
