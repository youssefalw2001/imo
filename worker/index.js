// Cloudflare Worker — Token Receiver + Keep-Alive
// Forwards token to predictor server
// Cron: pings predictor every 5 min to prevent Render cold starts

const PREDICTOR = 'https://rugs-predictor.onrender.com';

export default {
  // ── Keep Render alive every 5 minutes ─────────────────────────────────────
  async scheduled(event, env, ctx) {
    ctx.waitUntil(
      fetch(PREDICTOR + '/api/state').catch(() => {})
    );
  },

  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === 'POST') {
      try {
        const body = await request.json();
        const token = body.token;

        if (token && token.length > 50) {
          ctx.waitUntil(
            fetch(PREDICTOR + '/token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token, source: 'cloudflare-worker' })
            }).catch(() => {})
          );

          return new Response(JSON.stringify({ ok: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      } catch (e) {}
    }

    return new Response(JSON.stringify({ ok: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};
