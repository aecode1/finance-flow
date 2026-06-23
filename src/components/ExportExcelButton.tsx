import { useState } from 'react';
import { FileSpreadsheet, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinanceStore } from '../store/financeStore';
import { exportFinancialFlowToExcel } from '../utils/exportFinancialFlowToExcel';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface Props {
  /** 'header' = compact icon+text button; 'settings' = full-width card button */
  variant?: 'header' | 'settings';
}

export function ExportExcelButton({ variant = 'header' }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [errMsg, setErrMsg] = useState('');
  const { transactions, categories } = useFinanceStore();

  const run = async () => {
    if (status === 'loading') return;
    if (!transactions.length) {
      setStatus('error');
      setErrMsg('No financial data available to export.');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }
    setStatus('loading');
    try {
      await exportFinancialFlowToExcel({ transactions, categories });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2500);
    } catch (e) {
      setStatus('error');
      setErrMsg(e instanceof Error ? e.message : 'Export failed. Please try again.');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  // ── Compact header variant ────────────────────────────────────────────────
  if (variant === 'header') {
    const color  = status === 'success' ? '#10B981' : status === 'error' ? '#F43F5E' : '#8B9DC3';
    const border = status === 'success' ? '#10B98130' : status === 'error' ? '#F43F5E30' : '#1E2D45';

    return (
      <div className="relative">
        <motion.button
          onClick={run}
          disabled={status === 'loading'}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-sans font-semibold transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: '#1A2235',
            border: `1px solid ${border}`,
            color,
          }}
          title="Export to Excel"
        >
          {status === 'loading' ? (
            <Loader2 size={13} className="animate-spin" />
          ) : status === 'success' ? (
            <CheckCircle2 size={13} />
          ) : status === 'error' ? (
            <AlertCircle size={13} />
          ) : (
            <FileSpreadsheet size={13} />
          )}
          <span className="hidden sm:inline">
            {status === 'loading' ? 'Hazırlanıyor…' : status === 'success' ? 'İndirildi' : status === 'error' ? 'Hata' : 'Excel'}
          </span>
        </motion.button>

        {/* Error tooltip */}
        <AnimatePresence>
          {status === 'error' && errMsg && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-full mt-1.5 right-0 z-50 px-3 py-2 rounded-xl text-xs font-sans whitespace-nowrap max-w-xs"
              style={{
                background: '#0F1623',
                border: '1px solid #F43F5E35',
                color: '#F43F5E',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}
            >
              {errMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── Settings card variant ─────────────────────────────────────────────────
  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const isError   = status === 'error';

  return (
    <div>
      <motion.button
        onClick={run}
        disabled={isLoading}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: isSuccess
            ? 'linear-gradient(135deg, #10B98110, #10B98108)'
            : isError
            ? 'linear-gradient(135deg, #F43F5E10, #F43F5E08)'
            : 'linear-gradient(135deg, #10B98110, #10B98108)',
          border: `1px solid ${isSuccess ? '#10B98130' : isError ? '#F43F5E30' : '#10B98130'}`,
        }}
        onMouseEnter={e => {
          if (!isLoading) e.currentTarget.style.borderColor = isError ? '#F43F5E60' : '#10B98160';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = isError ? '#F43F5E30' : '#10B98130';
        }}
      >
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: isSuccess ? '#10B98120' : isError ? '#F43F5E20' : '#10B98120',
          }}
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" style={{ color: '#10B981' }} />
          ) : isSuccess ? (
            <CheckCircle2 size={20} style={{ color: '#10B981' }} />
          ) : isError ? (
            <AlertCircle size={20} style={{ color: '#F43F5E' }} />
          ) : (
            <FileSpreadsheet size={20} style={{ color: '#10B981' }} />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-sans font-semibold text-[#F0F4FF]">
            {isLoading
              ? 'Excel Hazırlanıyor…'
              : isSuccess
              ? 'Excel Başarıyla İndirildi!'
              : isError
              ? 'Dışa Aktarma Başarısız'
              : 'Export Financial Flow to Excel'}
          </p>
          <p className="text-xs font-sans text-[#4A5C80] mt-0.5 leading-snug">
            {isLoading
              ? 'Grafikler ve tablolar oluşturuluyor…'
              : isSuccess
              ? 'financial-flow-report-*.xlsx dosyanız indirildi.'
              : isError
              ? errMsg
              : `${transactions.length} işlem, 3 sheet: Tablo · Grafikler · Özet`}
          </p>
        </div>

        {/* Badge */}
        {!isLoading && !isError && !isSuccess && (
          <div
            className="px-2.5 py-1 rounded-lg text-[10px] font-sans font-semibold flex-shrink-0"
            style={{ background: '#10B98115', color: '#10B981', border: '1px solid #10B98125' }}
          >
            .xlsx
          </div>
        )}
      </motion.button>
    </div>
  );
}
