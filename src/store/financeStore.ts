import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FinanceState } from '../types';
import { defaultTransactions, defaultCategories } from '../data/daviData';
import { nanoid } from 'nanoid';

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: defaultTransactions,
      categories:   defaultCategories,

      addTransaction: (data) =>
        set((s) => ({
          transactions: [{ ...data, id: `tx-${nanoid(6)}` }, ...s.transactions],
        })),

      removeTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      addCategory: (data) =>
        set((s) => ({
          categories: [...s.categories, { ...data, id: `cat-${nanoid(6)}` }],
        })),
    }),
    { name: 'financeflow-store' }
  )
);
