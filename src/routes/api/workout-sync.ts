import { createFileRoute } from '@tanstack/react-router';
import { createClient } from '@supabase/supabase-js';

export const Route = createFileRoute('/api/workout-sync')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Use Service Role Key to bypass Row Level Security for automated webhooks
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
          return Response.json({ error: 'Missing database environment variables' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        try {
          // Parse the JSON body sent from Apple Shortcuts
          const body = await request.json();
          const { type, distance, activeCalories, duration, hrv, avgHr } = body;

          // Insert into Supabase (Change 'fitness_logs' if your table is named differently)
          const { error } = await supabase
            .from('fitness_logs') 
            .insert([
              {
                type: type,
                distance: distance,
                active_calories: activeCalories,
                duration: duration,
                hrv: hrv,
                avg_hr: avgHr,
              }
            ]);

          if (error) throw error;

          return Response.json({ success: true, message: 'Workout synced successfully!' }, { status: 200 });
        } catch (error) {
          console.error('Database error:', error);
          return Response.json({ error: 'Internal Server Error' }, { status: 500 });
        }
      },
    },
  },
});
