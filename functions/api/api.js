export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. API route: Return children members from Cloudflare D1
    if (url.pathname === '/api/members') {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM members").all();
        return Response.json(results);
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    }

    // 2. All other requests: Serve index.html and static assets
    return env.ASSETS.fetch(request);
  }
};
