import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cafprtkgqftisptsbpxe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhZnBydGtncWZ0aXNwdHNicHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NDgyODEsImV4cCI6MjA5MDUyNDI4MX0.M5shfOyW26AQkNk83CMBS8eaq6vVn_wh1Y_AVf_thTY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);