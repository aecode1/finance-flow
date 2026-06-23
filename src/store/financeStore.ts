import { create } from 'zustand';
import { FinanceState, Transaction, Category } from '../types';
import { defaultTransactions, defaultCategories } from '../data/daviData';
import { nanoid } from 'nanoid';

const STORAGE_KEY = (userId: string) => `ff-data-${userId}`;

function saveToStorage(userId: string, transactions: Transaction[], categories: Category[]) {
  try {
    localStorage.setItem(STORAGE_KEY(userId), JSON.stringify({ transactions, categories }));
  } catch {
    // storage full or unavailable
  }
}

function loadFromStorage(userId: string): { transactions: Transaction[]; categories: Category[] } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(userId));
    if (raw) return JSON.parse(raw);
  } catch {
    // parse error
  }
  return null;
}

let currentUserId: string | null = null;

export const useFinanceStore = create<FinanceState>()((set) => ({
  transactions: [],
  categories:   [],

  loadForUser: (userId: string) => {
    currentUserId = userId;
    const saved = loadFromStorage(userId);
    set({
      transactions: saved?.transactions ?? defaultTransactions,
      categories:   saved?.categories   ?? defaultCategories,
    });
  },

  resetStore: () => {
    currentUserId = null;
    set({ transactions: [], categories: [] });
  },

  addTransaction: (data) =>
    set((s) => {
      const transactions = [{ ...data, id: `tx-${nanoid(6)}` }, ...s.transactions];
      if (currentUserId) saveToStorage(currentUserId, transactions, s.categories);
      return { transactions };
    }),

  removeTransaction: (id) =>
    set((s) => {
      const transactions = s.transactions.filter((t) => t.id !== id);
      if (currentUserId) saveToStorage(currentUserId, transactions, s.categories);
      return { transactions };
    }),

  addCategory: (data) =>
    set((s) => {
      const categories = [...s.categories, { ...data, id: `cat-${nanoid(6)}` }];
      if (currentUserId) saveToStorage(currentUserId, s.transactions, categories);
      return { categories };
    }),
}));

// Auto-save on any state change
useFinanceStore.subscribe((state) => {
  if (currentUserId) {
    saveToStorage(currentUserId, state.transactions, state.categories);
  }
});
