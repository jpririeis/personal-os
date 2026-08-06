import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow POST requests from your Shortcut
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Initialize Supabase
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { date, sleepHours } = req.body;

  // Insert the sleep data
  const { data, error } = await supabase
    .from('sleep_logs')
    .insert([{ date: date, sleep_hours: sleepHours }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true, message: 'Sleep logged successfully!' });
}
