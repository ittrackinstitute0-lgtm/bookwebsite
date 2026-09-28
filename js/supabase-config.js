// Supabase Configuration
const SUPABASE_URL = 'https://oufwwythfrmpyudqbcdt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91Znd3eXRoZnJtcHl1ZHFiY2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NzE5OTgsImV4cCI6MjEwNjE0Nzk5OH0.rNFdaD5DmCzf8TUm9mMK_PipbtRb22BoFXxKOxtMpso';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database table names
const TABLES = {
  BOOKS: 'books',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items'
};
