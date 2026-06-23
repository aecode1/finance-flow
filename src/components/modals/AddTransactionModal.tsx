import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinanceStore } from '../../store/financeStore';
import { Button } from '../ui/Button';
import { TransactionType } from '../../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const today = new Date().toISOString().split('T')[0];

export function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const { categories, addTransaction } = useFinanceStore();

  const [type, setType]       = useState<TransactionType>('expense');
  const [title, setTitle]     = useState('');
  const [amount, setAmount]   = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate]       = useState(today);
  const [note, setNote]       = useState('');

  const filteredCats = categories.filter(c => c.type === type);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !amount || !categoryId || !date) return;

    addTransaction({
      title,
      amount: Number(amount),
      type,
      categoryId,
      date,
      note: note || undefined,
    });

    setTitle(''); setAmount(''); setCategoryId(''); setNote(''); setDate(today);
    onClose();
  }

  const inputClass = 'w-full bg-elevated border border-border rounded-xl px-4 py-2.5 text-sm text-[#F0F4FF] font-sans placeholder-[#4A5C80] outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-surface border border-border rounded-3xl shadow-2xl w-full max-w-md">
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
                <h2 className="font-display text-xl font-semibold text-[#F0F4FF]">Yeni İşlem</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-[#4A5C80] hover:bg-elevated hover:text-[#F0F4FF] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                {/* Type tabs */}
                <div className="flex gap-2 bg-elevated rounded-xl p-1">
                  {(['income', 'expense'] as TransactionType[]).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => { setType(t); setCategoryId(''); }}
                      className={`flex-1 py-2 rounded-lg text-sm font-sans font-medium transition-all duration-200 ${
                        type === t
                          ? t === 'income'
                            ? 'bg-income text-white'
                            : 'bg-expense text-white'
                          : 'text-[#8B9DC3] hover:text-[#F0F4FF]'
                      }`}
                    >
                      {t === 'income' ? 'Gelir' : 'Gider'}
                    </button>
                  ))}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-sans text-[#8B9DC3] mb-1.5">Başlık</label>
                  <input
                    className={inputClass}
                    placeholder="İşlem başlığı"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-sans text-[#8B9DC3] mb-1.5">Tutar (₺)</label>
                  <input
                    className={inputClass}
                    type="number"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-sans text-[#8B9DC3] mb-1.5">Kategori</label>
                  <select
                    className={inputClass}
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    required
                  >
                    <option value="">Seçiniz</option>
                    {filteredCats.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-sans text-[#8B9DC3] mb-1.5">Tarih</label>
                  <input
                    className={inputClass}
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                  />
                </div>

                {/* Note */}
                <div>
                  <label className="block text-xs font-sans text-[#8B9DC3] mb-1.5">Not (opsiyonel)</label>
                  <input
                    className={inputClass}
                    placeholder="Kısa not..."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
                    İptal
                  </Button>
                  <Button type="submit" className="flex-1">
                    Kaydet
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
