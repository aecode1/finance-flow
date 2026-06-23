import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  initialize: async () => {
    const { data } = await supabase.auth.getSession();
    set({ user: data.session?.user ?? null, initialized: true });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null });
    });
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ loading: false, error: translateError(error.message) });
      throw error;
    }
    set({ loading: false });
  },

  signUp: async (email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      set({ loading: false, error: translateError(error.message) });
      throw error;
    }
    set({ loading: false });
    return { needsConfirmation: !data.session };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },

  clearError: () => set({ error: null }),
}));

function translateError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'E-posta veya şifre hatalı.';
  if (msg.includes('Email not confirmed')) return 'E-posta adresinizi doğrulayın.';
  if (msg.includes('User already registered')) return 'Bu e-posta zaten kayıtlı.';
  if (msg.includes('Password should be at least')) return 'Şifre en az 6 karakter olmalı.';
  if (msg.includes('Unable to validate email')) return 'Geçersiz e-posta adresi.';
  if (msg.includes('rate limit')) return 'Çok fazla deneme. Lütfen bekleyin.';
  return msg;
}
