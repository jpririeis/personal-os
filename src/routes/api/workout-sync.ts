import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/workout-sync')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = 'https://kmbpmplfuqkhxtiygyro.supabase.co';
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseKey) {
          return Response.json({ error: 'Missing database secret key' }, { status: 500 });
        }

        try {
          const body = await request.json();
          const { type, distance, activeCalories, duration, hrv, avgHr } = body;

          // Use native fetch to bypass bundler import issues completely
          const res = await fetch(`${supabaseUrl}/rest/v1/fitness_logs`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              type: type,
              distance: distance,
              active_calories: activeCalories,
              duration: duration,
              hrv: hrv,
              avg_hr: avgHr
            })
          });

          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Supabase error: ${errorText}`);
          }

          return Response.json({ success: true, message: 'Workout synced successfully!' }, { status: 200 });
        } catch (error) {
          console.error('Database error:', error);
          return Response.json({ error: 'Internal Server Error' }, { status: 500 });
        }
      },
    },
  },
});
