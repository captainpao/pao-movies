// Cloudflare Pages Function: DeepSeek chat proxy.
// POST /api/deepseek/chat — forwards to DeepSeek with the server-side key.
// Replaces the non-streaming route in Express src/routes/deepseek.js.
// ponytail: skipped /chat/stream — the frontend never calls it. Add back as
// chat/stream.js piping upstream.body if streaming is ever needed.
export async function onRequestPost(context) {
  const { request, env } = context;

  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.messages)) {
    return Response.json({ error: 'Messages array is required' }, { status: 400 });
  }

  const { messages, model = 'deepseek-chat', temperature = 0.7, max_tokens } = body;
  const base = env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';

  const upstream = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages, temperature, ...(max_tokens && { max_tokens }) }),
  });

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { 'content-type': 'application/json' },
  });
}
