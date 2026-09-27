export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const log = await request.json();

    await env.DB.prepare(
      `INSERT INTO attendancedb (id, date, serviceType, recorder, presentCount, absentCount, snapshot) 
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`
    ).bind(
      log.id,
      log.date,
      log.serviceType,
      log.recorder,
      log.presentCount,
      log.absentCount,
      JSON.stringify(log.snapshot)
    ).run();

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function onRequestGet(context) {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare("SELECT * FROM attendancedb ORDER BY date DESC").all();
    return Response.json(results);
  } catch (err) {
    return Response.json({ message: "API is working", db_connected: !!env.DB, error: err.message });
  }
}
