export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Route: GET /api/members
    if (url.pathname === "/api/members" && request.method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM members").all();
        return Response.json(results);
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    }

    // Route: POST /api/members (Add new member)
    if (url.pathname === "/api/members" && request.method === "POST") {
      try {
        const body = await request.json();
        await env.DB.prepare(
          "INSERT INTO members (id, name, gender, dob, parent, contact, address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(
          body.id || crypto.randomUUID(),
          body.name,
          body.gender,
          body.dob,
          body.parent,
          body.contact,
          body.address,
          body.status || 'Active'
        ).run();

        return Response.json({ success: true });
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    }

    // Pass through to static assets (index.html, CSS, client JS)
    return env.ASSETS.fetch(request);
  }
};
