// Supabase設定
const SUPABASE_URL = 'https://bjnyvjtilklrfbnnnybi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbnl2anRpbGtscmZibm5ueWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMjY4NjQsImV4cCI6MjA4MDYwMjg2NH0.vUVLkJvxntsF4YNzvQI2ouTC9VJOGsoVFu2iYqx_ObQ';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
