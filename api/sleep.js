import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const supabaseUrl = 'https://kmbpmplfuqkhxtiygyro.supabase.co';
  const supabaseKey = 'sb_publishable_5s3AR_xO14UCI4QMreTvtg_f2UKs4nY';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { date, sleepHours } = req.body;

  // THE FIX: If sleepHours is completely blank, convert it to the number 0
  const safeSleepHours = Number(sleepHours) || 0;

  const { data, error } = await supabase
    .from('sleep_logs')
    .insert([{ date: date, sleep_hours: safeSleepHours }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true, message: 'Sleep logged successfully!' });
}
