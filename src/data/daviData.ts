import { Transaction, Category } from '../types';

export const defaultCategories: Category[] = [
  { id: 'cat-1',  name: 'Maaş',      icon: 'Briefcase',    color: '#10B981', type: 'income'  },
  { id: 'cat-2',  name: 'Freelance',  icon: 'Laptop',       color: '#6366F1', type: 'income'  },
  { id: 'cat-3',  name: 'Yatırım',   icon: 'TrendingUp',   color: '#F59E0B', type: 'income'  },
  { id: 'cat-4',  name: 'Kira',      icon: 'Home',         color: '#F43F5E', type: 'expense' },
  { id: 'cat-5',  name: 'Market',    icon: 'ShoppingCart', color: '#FB923C', type: 'expense' },
  { id: 'cat-6',  name: 'Ulaşım',   icon: 'Car',          color: '#A78BFA', type: 'expense' },
  { id: 'cat-7',  name: 'Eğlence',  icon: 'Music',        color: '#F472B6', type: 'expense' },
  { id: 'cat-8',  name: 'Sağlık',   icon: 'Heart',        color: '#34D399', type: 'expense' },
  { id: 'cat-9',  name: 'Eğitim',   icon: 'BookOpen',     color: '#60A5FA', type: 'expense' },
  { id: 'cat-10', name: 'Faturalar', icon: 'Zap',          color: '#FBBF24', type: 'expense' },
];

export const defaultTransactions: Transaction[] = [
  { id: 'tx-01', title: 'Haziran Maaşı',        amount: 42000, type: 'income',  categoryId: 'cat-1',  date: '2025-06-01', note: 'Net maaş' },
  { id: 'tx-02', title: 'Web Projesi',           amount: 8500,  type: 'income',  categoryId: 'cat-2',  date: '2025-06-05' },
  { id: 'tx-03', title: 'Temettü Geliri',        amount: 2200,  type: 'income',  categoryId: 'cat-3',  date: '2025-06-08' },
  { id: 'tx-04', title: 'Kira Ödemesi',          amount: 12500, type: 'expense', categoryId: 'cat-4',  date: '2025-06-03' },
  { id: 'tx-05', title: 'Haftalık Market',       amount: 1850,  type: 'expense', categoryId: 'cat-5',  date: '2025-06-07' },
  { id: 'tx-06', title: 'Metro & Otobüs',        amount: 400,   type: 'expense', categoryId: 'cat-6',  date: '2025-06-10' },
  { id: 'tx-07', title: 'Sinema & Dışarı Yeme', amount: 950,   type: 'expense', categoryId: 'cat-7',  date: '2025-06-12' },
  { id: 'tx-08', title: 'Diş Hekimi',            amount: 2200,  type: 'expense', categoryId: 'cat-8',  date: '2025-06-14' },
  { id: 'tx-09', title: 'Online Kurs',           amount: 750,   type: 'expense', categoryId: 'cat-9',  date: '2025-06-15' },
  { id: 'tx-10', title: 'Elektrik & Su',         amount: 1100,  type: 'expense', categoryId: 'cat-10', date: '2025-06-16' },
  { id: 'tx-11', title: 'Market Alışverişi',     amount: 2100,  type: 'expense', categoryId: 'cat-5',  date: '2025-06-18' },
  { id: 'tx-12', title: 'Mobil Uygulama Geliri', amount: 3400,  type: 'income',  categoryId: 'cat-2',  date: '2025-06-20' },
  { id: 'tx-13', title: 'Taksi',                 amount: 280,   type: 'expense', categoryId: 'cat-6',  date: '2025-06-21' },
  { id: 'tx-14', title: 'Spor Salonu',           amount: 600,   type: 'expense', categoryId: 'cat-8',  date: '2025-06-22' },
  { id: 'tx-15', title: 'Haftalık Market',       amount: 1650,  type: 'expense', categoryId: 'cat-5',  date: '2025-06-24' },
];
