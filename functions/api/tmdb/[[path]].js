// Cloudflare Pages Function: TMDB proxy.
// Catch-all GET passthrough — forwards /api/tmdb/<anything> to TMDB with the
// server-side api_key injected. Replaces the Express src/routes/tmdb.js.
// Same-origin as the site, so no CORS needed.
export async function onRequestGet(context) {
  const { request, env, params } = context;
  const path = Array.isArray(params.path) ? params.path.join('/') : params.path || '';
  const base = env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

  const target = new URL(`${base}/${path}`);
  new URL(request.url).searchParams.forEach((v, k) => target.searchParams.set(k, v));
  target.searchParams.set('api_key', env.TMDB_API_KEY);

  const upstream = await fetch(target, { headers: { accept: 'application/json' } });
  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { 'content-type': 'application/json' },
  });
}
