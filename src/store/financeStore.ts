import { create } from 'zustand';
import { FinanceState, Transaction, Category } from '../types';
import { defaultTransactions, defaultCategories } from '../data/daviData';
import { nanoid } from 'nanoid';

const GUEST_KEY = 'ff-data-guest';
const userKey = (userId: string | null) => userId ? `ff-data-${userId}` : GUEST_KEY;

function saveToStorage(key: string, transactions: Transaction[], categories: Category[]) {
  try {
    localStorage.setItem(key, JSON.stringify({ transactions, categories }));
  } catch { /* storage full */ }
}

function loadFromStorage(key: string): { transactions: Transaction[]; categories: Category[] } | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch { /* parse error */ }
  return null;
}

let activeKey: string = GUEST_KEY;

export const useFinanceStore = create<FinanceState>()((set) => ({
  transactions: [],
  categories:   [],

  loadForUser: (userId) => {
    activeKey = userKey(userId);
    const saved = loadFromStorage(activeKey);
    set({
      transactions: saved?.transactions ?? defaultTransactions,
      categories:   saved?.categories   ?? defaultCategories,
    });
  },

  resetStore: () => {
    activeKey = GUEST_KEY;
    const saved = loadFromStorage(GUEST_KEY);
    set({
      transactions: saved?.transactions ?? defaultTransactions,
      categories:   saved?.categories   ?? defaultCategories,
    });
  },

  addTransaction: (data) =>
    set((s) => {
      const transactions = [{ ...data, id: `tx-${nanoid(6)}` }, ...s.transactions];
      saveToStorage(activeKey, transactions, s.categories);
      return { transactions };
    }),

  removeTransaction: (id) =>
    set((s) => {
      const transactions = s.transactions.filter((t) => t.id !== id);
      saveToStorage(activeKey, transactions, s.categories);
      return { transactions };
    }),

  addCategory: (data) =>
    set((s) => {
      const categories = [...s.categories, { ...data, id: `cat-${nanoid(6)}` }];
      saveToStorage(activeKey, s.transactions, categories);
      return { categories };
    }),
}));

// Auto-save on any state change
useFinanceStore.subscribe((state) => {
  saveToStorage(activeKey, state.transactions, state.categories);
});
