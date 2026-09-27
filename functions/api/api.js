export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();

    // CHANGE 'users' and 'name, email' to your real table/columns
    await env.DB.prepare(
      "INSERT INTO users (name, email) VALUES (?1, ?2)"
    ).bind(body.name, body.email).run();

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

// This lets you test if DB is connected: visit /api/api
export async function onRequestGet(context) {
  return Response.json({ 
    message: "API is working", 
    db_connected: !!context.env.DB 
  });
}
