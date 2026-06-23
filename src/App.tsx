import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { PieChartPanel } from './components/dashboard/PieChartPanel';
import { TransactionList } from './components/dashboard/TransactionList';
import { CategoryBreakdown } from './components/dashboard/CategoryBreakdown';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { SaveDataModal } from './components/auth/SaveDataModal';
import { useAuthStore } from './store/authStore';
import { useFinanceStore } from './store/financeStore';
import { Settings, Database, Bell, Shield, Moon, CloudUpload, LogOut } from 'lucide-react';

function SettingsSection({ onSaveData }: { onSaveData: () => void }) {
  const { user, signOut } = useAuthStore();

  const rows = [
    { icon: Bell,     label: 'Bildirimler',  desc: 'Bütçe uyarıları ve hatırlatıcılar',   badge: 'Yakında' },
    { icon: Database, label: 'Veri Yönetimi', desc: 'Dışa/içe aktar, yedekle',             badge: 'Yakında' },
    { icon: Shield,   label: 'Gizlilik',     desc: 'Veriler yalnızca bu cihazda saklanır', badge: 'Yerel'   },
    { icon: Moon,     label: 'Görünüm',      desc: 'Sadece karanlık mod desteklenir',      badge: 'Dark'    },
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
      <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-[#162035] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Settings size={15} className="text-accent" />
        </div>
        <h2 className="font-display text-lg sm:text-xl font-bold text-[#F0F4FF]">Ayarlar</h2>
      </div>

      {/* Account card */}
      <div className="px-4 sm:px-6 pt-4">
        {user ? (
          <div
            className="flex items-center gap-3 p-4 rounded-xl mb-4"
            style={{ background: '#6366F110', border: '1px solid #6366F125' }}
          >
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-mono font-bold text-accent uppercase">
                {user.email?.[0] ?? '?'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-sans font-semibold text-[#F0F4FF] truncate">{user.email}</p>
              <p className="text-[10px] font-sans text-[#4A5C80] mt-0.5">Hesabınız bağlı — veriler korumalı</p>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans text-[#4A5C80] hover:text-expense hover:bg-expense/10 transition-colors"
            >
              <LogOut size={12} />
              Çıkış
            </button>
          </div>
        ) : (
          <button
            onClick={onSaveData}
            className="w-full flex items-center gap-3 p-4 rounded-xl mb-4 text-left transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #6366F110, #6366F108)',
              border: '1px solid #6366F130',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6366F155'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#6366F130'}
          >
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
              <CloudUpload size={18} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-sans font-semibold text-[#F0F4FF]">Verilerimi Kaydet</p>
              <p className="text-xs font-sans text-[#4A5C80] mt-0.5 leading-snug">
                Hesap oluştur veya giriş yap. Mevcut verileriniz korunur.
              </p>
            </div>
            <div
              className="px-2.5 py-1 rounded-lg text-[10px] font-sans font-semibold text-accent flex-shrink-0"
              style={{ background: '#6366F115', border: '1px solid #6366F125' }}
            >
              Ücretsiz
            </div>
          </button>
        )}
      </div>

      <div className="px-3 sm:px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rows.map(({ icon: Icon, label, desc, badge }) => (
          <div
            key={label}
            className="flex items-start gap-3 p-3 sm:p-4 rounded-xl border border-[#1E2D45] bg-[#0F1623] opacity-70 cursor-not-allowed select-none"
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
          FinanceFlow v0.1.0 — {user ? 'Hesap bağlı' : 'Misafir modu'}
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [isSaveOpen, setIsSaveOpen]     = useState(false);
  const { user, initialized, initialize } = useAuthStore();
  const { loadForUser }                   = useFinanceStore();

  // Load guest data immediately, then check auth in background
  useEffect(() => {
    loadForUser(null);   // instant — show dashboard right away
    initialize();        // async — resolves Supabase session
  }, []);

  // When auth resolves or changes, switch to user data if logged in
  useEffect(() => {
    if (!initialized) return;
    if (user) {
      loadForUser(user.id);
    }
    // If no user: guest data is already loaded, nothing to do
  }, [user?.id, initialized]);

  return (
    <div className="flex h-screen bg-base overflow-hidden">
      {/* Sidebar — only on md+ */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onAddTransaction={() => setIsModalOpen(true)} />

        <main id="main-scroll" className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-5 pb-24 md:pb-6">
          <section id="dashboard" className="scroll-mt-4 sm:scroll-mt-6">
            <SummaryCards />
          </section>

          <section id="kategoriler" className="scroll-mt-4 sm:scroll-mt-6">
            <div className="flex flex-col md:grid md:grid-cols-5 gap-4 sm:gap-5">
              <div className="md:col-span-3">
                <PieChartPanel />
              </div>
              <div className="md:col-span-2">
                <CategoryBreakdown />
              </div>
            </div>
          </section>

          <section id="islemler" className="scroll-mt-4 sm:scroll-mt-6">
            <TransactionList />
          </section>

          <section id="ayarlar" className="scroll-mt-4 sm:scroll-mt-6">
            <SettingsSection onSaveData={() => setIsSaveOpen(true)} />
          </section>
        </main>
      </div>

      {/* Bottom navigation — only on mobile */}
      <BottomNav />

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <SaveDataModal
        isOpen={isSaveOpen}
        onClose={() => setIsSaveOpen(false)}
      />
    </div>
  );
}
