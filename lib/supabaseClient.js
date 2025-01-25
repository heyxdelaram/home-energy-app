import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://gnymyimzwxpjzumulbob.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueW15aW16d3hwanp1bXVsYm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1MzU5NjYsImV4cCI6MjA1MjExMTk2Nn0.qJ6oEuKc8JLdMnUcnNy6ZdaMpZukG3oLiwRfSmUqdKw';

export const supabase = createClient(supabaseUrl, supabaseKey, supabaseKey);
