const VERCEL_BASE = 'https://rainbowlovely-puce.vercel.app';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      const targetUrl = VERCEL_BASE + url.pathname + url.search;
      try {
        const proxyRes = await fetch(targetUrl, {
          method: request.method,
          headers: { 'Content-Type': 'application/json' }
        });
        const body = await proxyRes.text();
        if (!body) {
          return new Response(JSON.stringify({
            debug: true,
            status: proxyRes.status,
            statusText: proxyRes.statusText,
            targetUrl: targetUrl
          }), {
            status: 502,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        return new Response(body, {
          status: proxyRes.status,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Proxy fetch failed: ' + err.message }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
