import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { PieChartPanel } from './components/dashboard/PieChartPanel';
import { TransactionList } from './components/dashboard/TransactionList';
import { CategoryBreakdown } from './components/dashboard/CategoryBreakdown';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { Settings, Database, Bell, Shield, Moon } from 'lucide-react';

function SettingsSection() {
  const rows = [
    { icon: Bell,     label: 'Bildirimler',      desc: 'Bütçe uyarıları ve hatırlatıcılar',   badge: 'Yakında' },
    { icon: Database, label: 'Veri Yönetimi',     desc: 'Dışa/içe aktar, yedekle',             badge: 'Yakında' },
    { icon: Shield,   label: 'Gizlilik',          desc: 'Veriler yalnızca bu cihazda saklanır', badge: 'Yerel'   },
    { icon: Moon,     label: 'Görünüm',           desc: 'Sadece karanlık mod desteklenir',      badge: 'Dark'    },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #0F1623 0%, #0a1020 100%)',
        border: '1px solid #1E2D45',
        boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
      }}
    >
      <div className="px-6 pt-6 pb-4 border-b border-[#162035] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Settings size={15} className="text-accent" />
        </div>
        <h2 className="font-display text-xl font-bold text-[#F0F4FF]">Ayarlar</h2>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3">
        {rows.map(({ icon: Icon, label, desc, badge }) => (
          <div
            key={label}
            className="flex items-start gap-3 p-4 rounded-xl border border-[#1E2D45] bg-[#0F1623] opacity-70 cursor-not-allowed select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-elevated flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon size={14} className="text-[#4A5C80]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-sans font-medium text-[#8B9DC3]">{label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#1A2235] text-[#4A5C80]">
                  {badge}
                </span>
              </div>
              <p className="text-xs font-sans text-[#4A5C80] mt-0.5 leading-snug">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-[#162035] text-center">
        <p className="text-[10px] font-mono text-[#4A5C80] uppercase tracking-widest">
          FinanceFlow v0.1.0 — Veriler localStorage'da saklanır
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-base overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onAddTransaction={() => setIsModalOpen(true)} />

        <main id="main-scroll" className="flex-1 overflow-y-auto p-6 space-y-5">
          <section id="dashboard" className="scroll-mt-6">
            <SummaryCards />
          </section>

          <section id="kategoriler" className="scroll-mt-6">
            <div className="grid grid-cols-5 gap-5">
              <div className="col-span-3">
                <PieChartPanel />
              </div>
              <div className="col-span-2">
                <CategoryBreakdown />
              </div>
            </div>
          </section>

          <section id="islemler" className="scroll-mt-6">
            <TransactionList />
          </section>

          <section id="ayarlar" className="scroll-mt-6">
            <SettingsSection />
          </section>
        </main>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
