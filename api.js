export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/members' && request.method === 'GET') {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM members").all();
        return Response.json(results);
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    }

    if (url.pathname === '/api/attendance' && request.method === 'POST') {
      try {
        const log = await request.json();
        await env.DB.prepare(
          "INSERT INTO attendance_logs (id, date, serviceType, recorder, presentCount, absentCount, snapshot) VALUES (?, ?, ?, ?, ?, ?, ?)"
        ).bind(log.id, log.date, log.serviceType, log.recorder, log.presentCount, log.absentCount, JSON.stringify(log.snapshot)).run();
        return Response.json({ ok: true });
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
