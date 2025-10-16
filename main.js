import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "https://nylutsjvyiqerbrsztnn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55bHV0c2p2eWlxZXJicnN6dG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1OTEwODcsImV4cCI6MjA3NjE2NzA4N30.8zeOzwpSs_jhQxHQcFBXd6zEtVW4A_hXyviDFAtdrWE";

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
