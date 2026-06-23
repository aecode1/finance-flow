import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

type Tab = 'login' | 'register';

export function AuthPage() {
  const [tab, setTab]               = useState<Tab>('login');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [confirmed, setConfirmed]   = useState(false);

  const { signIn, signUp, loading, error, clearError } = useAuthStore();

  const handleTabChange = (next: Tab) => {
    setTab(next);
    clearError();
    setConfirmed(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (tab === 'login') {
      await signIn(email, password).catch(() => {});
    } else {
      const result = await signUp(email, password).catch(() => null);
      if (result?.needsConfirmation) setConfirmed(true);
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-income/10 border border-income/20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-income" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#F0F4FF] mb-2">
            Doğrulama E-postası Gönderildi
          </h2>
          <p className="text-sm font-sans text-[#8B9DC3] mb-6 leading-relaxed">
            <span className="text-[#F0F4FF] font-medium">{email}</span> adresine bir doğrulama linki gönderdik. Gelen kutunuzu kontrol edin ve linke tıklayın.
          </p>
          <button
            onClick={() => { setConfirmed(false); setTab('login'); }}
            className="text-sm font-sans font-medium text-accent hover:text-accent/80 transition-colors"
          >
            Giriş sayfasına dön
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-base flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#6366F1 1px, transparent 1px), linear-gradient(90deg, #6366F1 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Ambient glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/20 flex items-center justify-center mb-4 shadow-glow">
            <TrendingUp size={26} className="text-accent" />
          </div>
          <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-accent to-income bg-clip-text text-transparent">
            FinanceFlow
          </h1>
          <p className="text-sm font-sans text-[#4A5C80] mt-1">
            Kişisel finansını akıllıca yönet
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #0F1623 0%, #0a1020 100%)',
            border: '1px solid #1E2D45',
            boxShadow: '0 8px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(30,45,69,0.8)',
          }}
        >
          {/* Tab switcher */}
          <div className="p-1.5 mx-6 mt-6 rounded-2xl flex gap-1" style={{ background: '#080C16', border: '1px solid #1E2D45' }}>
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => handleTabChange(t)}
                className="relative flex-1 py-2 rounded-xl text-sm font-sans font-semibold transition-colors duration-200"
                style={{ color: tab === t ? '#F0F4FF' : '#4A5C80' }}
              >
                {tab === t && (
                  <motion.span
                    layoutId="auth-tab-bg"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #6366F1cc)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {t === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
                </span>
              </button>
            ))}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={tab}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: tab === 'login' ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: tab === 'login' ? 10 : -10 }}
              transition={{ duration: 0.2 }}
              className="p-6 space-y-4"
            >
              {/* Email */}
              <div>
                <label className="block text-xs font-sans font-medium text-[#8B9DC3] mb-1.5 uppercase tracking-wider">
                  E-posta
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A5C80]" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); clearError(); }}
                    placeholder="ornek@email.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-sans text-[#F0F4FF] placeholder:text-[#2A3C60] outline-none transition-all duration-150"
                    style={{
                      background: '#080C16',
                      border: '1px solid #1E2D45',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = '#6366F1'}
                    onBlur={e => e.currentTarget.style.borderColor = '#1E2D45'}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-sans font-medium text-[#8B9DC3] mb-1.5 uppercase tracking-wider">
                  Şifre
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A5C80]" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); clearError(); }}
                    placeholder={tab === 'register' ? 'En az 6 karakter' : '••••••••'}
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-sans text-[#F0F4FF] placeholder:text-[#2A3C60] outline-none transition-all duration-150"
                    style={{
                      background: '#080C16',
                      border: '1px solid #1E2D45',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = '#6366F1'}
                    onBlur={e => e.currentTarget.style.borderColor = '#1E2D45'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A5C80] hover:text-[#8B9DC3] transition-colors"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-sans"
                    style={{
                      background: '#F43F5E10',
                      border: '1px solid #F43F5E25',
                      color: '#F43F5E',
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-sans font-semibold text-sm text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: loading
                    ? '#6366F180'
                    : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  boxShadow: loading ? 'none' : '0 0 24px rgba(99,102,241,0.3)',
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
                    <span>{tab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              {/* Switch tab hint */}
              <p className="text-center text-xs font-sans text-[#4A5C80]">
                {tab === 'login' ? (
                  <>Hesabın yok mu?{' '}
                    <button type="button" onClick={() => handleTabChange('register')} className="text-accent hover:text-accent/80 font-medium transition-colors">
                      Kayıt ol
                    </button>
                  </>
                ) : (
                  <>Zaten üye misin?{' '}
                    <button type="button" onClick={() => handleTabChange('login')} className="text-accent hover:text-accent/80 font-medium transition-colors">
                      Giriş yap
                    </button>
                  </>
                )}
              </p>
            </motion.form>
          </AnimatePresence>
        </div>

        <p className="text-center text-[10px] font-mono text-[#2A3C60] mt-6 uppercase tracking-widest">
          Veriler güvenli şekilde saklanır
        </p>
      </motion.div>
    </div>
  );
}
