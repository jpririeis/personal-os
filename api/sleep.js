import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Hardcoding the keys to completely bypass Vercel's environment variable bugs
  const supabaseUrl = 'https://kmbpmplfuqkhxtiygyro.supabase.co';
  const supabaseKey = 'sb_publishable_5s3AR_xO14UCI4QMreTvtg_f2UKs4nY';

  // Initialize Supabase
  const supabase = createClient(supabaseUrl, supabaseKey);

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
