import { createFileRoute } from '@tanstack/react-router';
import { createClient } from '@supabase/supabase-js';

export const Route = createFileRoute('/api/workout-sync')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // The URL is public so we can hardcode it safely. The Key remains hidden as an environment variable.
        const supabaseUrl = 'https://kmbpmplfuqkhxtiygyro.supabase.co';
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseKey) {
          return Response.json({ error: 'Missing database secret key' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        try {
          const body = await request.json();
          const { type, distance, activeCalories, duration, hrv, avgHr } = body;

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
});
