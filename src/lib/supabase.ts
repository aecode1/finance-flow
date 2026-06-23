import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://hvffvobhepixibwlpshi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2ZmZ2b2JoZXBpeGlid2xwc2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMTM0NDgsImV4cCI6MjA5Nzc4OTQ0OH0.LWN_5NkrsJ7K4tCgs4qwM6vB3jNR5DJVE-qXSYPLuMI'
);
