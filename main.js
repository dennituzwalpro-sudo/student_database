import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "YOUR_PROJECT_URL";
const SUPABASE_KEY = "YOUR_ANON_KEY";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Test connection
async function testConnection() {
  const { data, error } = await supabase.from('students').select('*');
  if (error) {
    console.error("Supabase connection error:", error);
  } else {
    console.log("Fetched data:", data);
  }
}

testConnection();
