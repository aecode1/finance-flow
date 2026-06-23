import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import { AnimatePresence, motion } from 'framer-motion';
import { useFinanceStore } from '../../store/financeStore';
import { formatCurrency } from '../../utils/formatters';
import { TransactionType } from '../../types';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl px-4 py-3 shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #1A2235, #0F1623)',
        border: '1px solid #1E2D45',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
        <p className="text-xs text-[#8B9DC3] font-sans">{payload[0].name}</p>
      </div>
      <p className="text-base font-mono font-semibold text-[#F0F4FF]">{formatCurrency(payload[0].value)}</p>
    </motion.div>
  );
}

function ActiveShape(props: Record<string, unknown>) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props as {
    cx: number; cy: number; innerRadius: number; outerRadius: number;
    startAngle: number; endAngle: number; fill: string;
  };
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={(outerRadius as number) + 8}
        startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={1} />
      <Sector cx={cx} cy={cy} innerRadius={(outerRadius as number) + 12} outerRadius={(outerRadius as number) + 14}
        startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.4} />
    </g>
  );
}

export function PieChartPanel() {
  const [activeTab, setActiveTab]     = useState<TransactionType>('expense');
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const { transactions, categories }  = useFinanceStore();

  const filtered = transactions.filter(t => t.type === activeTab);
  const chartData = categories
    .filter(c => c.type === activeTab)
    .map(cat => ({
      name:  cat.name,
      value: filtered.filter(t => t.categoryId === cat.id).reduce((s, t) => s + t.amount, 0),
      color: cat.color,
    }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const grandTotal  = chartData.reduce((s, d) => s + d.value, 0);
  const topCategory = chartData[0];

  /* Chart boyutu: mobilde biraz küçük */
  const CHART_SIZE   = 200;
  const INNER_RADIUS = 58;
  const OUTER_RADIUS = 85;

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
      <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-[#162035]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-[#F0F4FF]">
              {activeTab === 'expense' ? 'Harcama Dağılımı' : 'Gelir Dağılımı'}
            </h2>
            {topCategory && (
              <p className="text-xs text-[#4A5C80] font-sans mt-0.5">
                En yüksek: <span style={{ color: topCategory.color }}>{topCategory.name}</span>
              </p>
            )}
          </div>

          <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#080C16', border: '1px solid #1E2D45' }}>
            {(['expense', 'income'] as TransactionType[]).map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setActiveIndex(undefined); }}
                className="relative px-3 sm:px-4 py-1.5 rounded-lg text-xs font-sans font-semibold transition-colors duration-200 z-10"
                style={{ color: activeTab === tab ? '#fff' : '#4A5C80' }}
              >
                {activeTab === tab && (
                  <motion.span
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-lg z-[-1]"
                    style={{ background: tab === 'expense' ? '#F43F5E' : '#10B981' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {tab === 'expense' ? 'Gider' : 'Gelir'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-44 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-elevated flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-[#4A5C80] font-sans text-sm">Henüz işlem yok</p>
              </div>
            ) : (
              /* Mobilde: chart üstte, legend altta (flex-col)
                 Desktop: chart solda, legend sağda (flex-row) */
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 sm:items-center">

                {/* Chart — mobilde ortalanmış */}
                <div className="flex justify-center sm:justify-start flex-shrink-0">
                  <div className="relative" style={{ width: CHART_SIZE, height: CHART_SIZE }}>
                    <div className="chart-glow-ring" />
                    <div className="relative z-10 w-full h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%" cy="50%"
                            innerRadius={INNER_RADIUS}
                            outerRadius={OUTER_RADIUS}
                            paddingAngle={3}
                            dataKey="value"
                            activeIndex={activeIndex}
                            activeShape={<ActiveShape />}
                            animationBegin={0}
                            animationDuration={700}
                            animationEasing="ease-out"
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(undefined)}
                          >
                            {chartData.map((entry, index) => (
                              <Cell
                                key={index}
                                fill={entry.color}
                                stroke="transparent"
                                opacity={activeIndex === undefined || activeIndex === index ? 1 : 0.35}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>

                      {/* Center label */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <AnimatePresence mode="wait">
                          {activeIndex !== undefined ? (
                            <motion.div key="active" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="text-center px-2">
                              <span className="block text-[9px] font-sans uppercase tracking-wider truncate max-w-[80px]" style={{ color: chartData[activeIndex]?.color }}>
                                {chartData[activeIndex]?.name}
                              </span>
                              <span className="block font-display text-sm font-bold text-[#F0F4FF] leading-tight mt-0.5">
                                {formatCurrency(chartData[activeIndex]?.value ?? 0)}
                              </span>
                              <span className="block text-[9px] font-mono mt-0.5" style={{ color: '#4A5C80' }}>
                                %{grandTotal > 0 ? ((chartData[activeIndex]?.value / grandTotal) * 100).toFixed(1) : 0}
                              </span>
                            </motion.div>
                          ) : (
                            <motion.div key="total" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="text-center">
                              <span className="block text-[9px] font-sans uppercase tracking-widest text-[#4A5C80]">toplam</span>
                              <span className="block font-display text-sm font-bold text-[#F0F4FF] leading-tight mt-0.5">
                                {formatCurrency(grandTotal)}
                              </span>
                              <span className="block text-[9px] font-sans text-[#4A5C80] mt-0.5">
                                {chartData.length} kategori
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legend — mobilde 2 kolon grid, desktop tek kolon */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2.5 sm:gap-y-3 sm:overflow-y-auto sm:max-h-52">
                  {chartData.map((entry, i) => {
                    const pct      = grandTotal > 0 ? (entry.value / grandTotal) * 100 : 0;
                    const isActive = activeIndex === i;
                    return (
                      <motion.div
                        key={entry.name}
                        initial={{ opacity: 0, x: 6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onMouseEnter={() => setActiveIndex(i)}
                        onMouseLeave={() => setActiveIndex(undefined)}
                        className="cursor-pointer"
                        style={{ opacity: activeIndex !== undefined && !isActive ? 0.45 : 1 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0 transition-transform duration-150"
                              style={{ backgroundColor: entry.color, transform: isActive ? 'scale(1.4)' : 'scale(1)' }}
                            />
                            <span className="text-xs font-sans font-medium text-[#F0F4FF] truncate">{entry.name}</span>
                          </div>
                          <span className="text-[10px] font-mono ml-1 flex-shrink-0" style={{ color: entry.color }}>
                            %{pct.toFixed(0)}
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="h-1 rounded-full overflow-hidden" style={{ background: '#1A2235' }}>
                          <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
                            style={{ backgroundColor: entry.color, opacity: isActive ? 1 : 0.7 }}
                          />
                        </div>
                        {/* Tutar — sadece desktop'ta göster */}
                        <p className="hidden sm:block text-[10px] font-mono text-[#8B9DC3] mt-0.5">
                          {formatCurrency(entry.value)}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>

              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
