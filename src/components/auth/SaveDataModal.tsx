import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, CloudUpload, LogIn } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useFinanceStore } from '../../store/financeStore';

type Tab = 'register' | 'login';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SaveDataModal({ isOpen, onClose }: Props) {
  const [tab, setTab]             = useState<Tab>('register');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const { signIn, signUp, loading, error, clearError } = useAuthStore();
  const { transactions, categories }                   = useFinanceStore();

  const handleTabChange = (next: Tab) => {
    setTab(next);
    clearError();
    setConfirmed(false);
  };

  const handleClose = () => {
    onClose();
    // Reset form after close animation
    setTimeout(() => {
      setEmail('');
      setPassword('');
      setShowPw(false);
      setConfirmed(false);
      setTab('register');
      clearError();
    }, 300);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (tab === 'register') {
      const result = await signUp(email, password, { transactions, categories }).catch(() => null);
      if (result?.needsConfirmation) {
        setConfirmed(true);
      } else if (result && !result.needsConfirmation) {
        handleClose();
      }
    } else {
      await signIn(email, password).catch(() => {});
      if (!useAuthStore.getState().error) handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(8,12,22,0.75)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="w-full max-w-sm rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #0F1623 0%, #0a1020 100%)',
                border: '1px solid #1E2D45',
                boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {confirmed ? (
                /* Email confirmation screen */
                <div className="p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-income/10 border border-income/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={28} className="text-income" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#F0F4FF] mb-2">
                    Doğrulama E-postası Gönderildi
                  </h3>
                  <p className="text-sm font-sans text-[#8B9DC3] mb-1 leading-relaxed">
                    <span className="text-[#F0F4FF] font-medium">{email}</span> adresine
                  </p>
                  <p className="text-sm font-sans text-[#8B9DC3] mb-6 leading-relaxed">
                    bir doğrulama linki gönderdik. Linke tıkladıktan sonra giriş yapabilirsiniz.
                  </p>
                  <p className="text-xs font-sans text-[#4A5C80]">
                    Verileriniz kaydedildi ve giriş yaptığınızda hazır olacak.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-6 text-sm font-sans font-medium text-accent hover:text-accent/80 transition-colors"
                  >
                    Tamam, kapat
                  </button>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="px-6 pt-6 pb-4 flex items-start justify-between border-b border-[#162035]">
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#F0F4FF]">
                        Verilerimi Kaydet
                      </h3>
                      <p className="text-xs font-sans text-[#4A5C80] mt-0.5">
                        {transactions.length} işlem · {categories.length} kategori aktarılacak
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-1.5 rounded-lg text-[#4A5C80] hover:text-[#F0F4FF] hover:bg-elevated transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Info banner */}
                  <div
                    className="mx-6 mt-4 px-4 py-3 rounded-xl flex items-start gap-3"
                    style={{ background: '#6366F110', border: '1px solid #6366F120' }}
                  >
                    <CloudUpload size={16} className="text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-sans text-[#8B9DC3] leading-relaxed">
                      {tab === 'register'
                        ? 'Yeni hesap oluştur. Mevcut tüm verileriniz otomatik olarak aktarılır.'
                        : 'Hesabına giriş yap. Hesabınla ilişkili veriler yüklenecek.'}
                    </p>
                  </div>

                  {/* Tab switcher */}
                  <div className="px-6 pt-4">
                    <div className="p-1 rounded-xl flex gap-1" style={{ background: '#080C16', border: '1px solid #1E2D45' }}>
                      {([
                        { key: 'register', label: 'Yeni Hesap', icon: CloudUpload },
                        { key: 'login',    label: 'Giriş Yap',  icon: LogIn      },
                      ] as const).map(({ key, label, icon: Icon }) => (
                        <button
                          key={key}
                          onClick={() => handleTabChange(key)}
                          className="relative flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-sans font-semibold transition-colors duration-200"
                          style={{ color: tab === key ? '#F0F4FF' : '#4A5C80' }}
                        >
                          {tab === key && (
                            <motion.span
                              layoutId="save-tab-bg"
                              className="absolute inset-0 rounded-lg"
                              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}
                              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                          )}
                          <Icon size={12} className="relative z-10" />
                          <span className="relative z-10">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form */}
                  <AnimatePresence mode="wait">
                    <motion.form
                      key={tab}
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0, x: tab === 'register' ? -8 : 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: tab === 'register' ? 8 : -8 }}
                      transition={{ duration: 0.18 }}
                      className="p-6 space-y-4"
                    >
                      {/* Email */}
                      <div>
                        <label className="block text-[10px] font-sans font-medium text-[#8B9DC3] mb-1.5 uppercase tracking-wider">
                          E-posta
                        </label>
                        <div className="relative">
                          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A5C80]" />
                          <input
                            type="email"
                            value={email}
                            onChange={e => { setEmail(e.target.value); clearError(); }}
                            placeholder="ornek@email.com"
                            required
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-sans text-[#F0F4FF] placeholder:text-[#2A3C60] outline-none transition-all"
                            style={{ background: '#080C16', border: '1px solid #1E2D45' }}
                            onFocus={e => e.currentTarget.style.borderColor = '#6366F1'}
                            onBlur={e => e.currentTarget.style.borderColor = '#1E2D45'}
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-[10px] font-sans font-medium text-[#8B9DC3] mb-1.5 uppercase tracking-wider">
                          Şifre
                        </label>
                        <div className="relative">
                          <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A5C80]" />
                          <input
                            type={showPw ? 'text' : 'password'}
                            value={password}
                            onChange={e => { setPassword(e.target.value); clearError(); }}
                            placeholder={tab === 'register' ? 'En az 6 karakter' : '••••••••'}
                            required
                            className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm font-sans text-[#F0F4FF] placeholder:text-[#2A3C60] outline-none transition-all"
                            style={{ background: '#080C16', border: '1px solid #1E2D45' }}
                            onFocus={e => e.currentTarget.style.borderColor = '#6366F1'}
                            onBlur={e => e.currentTarget.style.borderColor = '#1E2D45'}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw(!showPw)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A5C80] hover:text-[#8B9DC3] transition-colors"
                          >
                            {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>

                      {/* Error */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-3 py-2.5 rounded-xl text-xs font-sans"
                            style={{ background: '#F43F5E10', border: '1px solid #F43F5E25', color: '#F43F5E' }}
                          >
                            {error}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-sans font-semibold text-sm text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          background: loading ? '#6366F180' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                          boxShadow: loading ? 'none' : '0 0 20px rgba(99,102,241,0.3)',
                        }}
                      >
                        {loading ? (
                          <motion.div
                            className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                          />
                        ) : (
                          <>
                            <span>{tab === 'register' ? 'Kayıt Ol ve Verileri Aktar' : 'Giriş Yap'}</span>
                            <ArrowRight size={14} />
                          </>
                        )}
                      </button>
                    </motion.form>
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
