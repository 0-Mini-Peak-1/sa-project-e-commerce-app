import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jkivnmdfpigrjeyyqint.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpraXZubWRmcGlncmpleXlxaW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY0OTEyMDAsImV4cCI6MjA0MjA2NzIwMH0.mN2URqrKh9J-Oeml9cGCv7m2bWQCThW76VnVqfZnmBw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
