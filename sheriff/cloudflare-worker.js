const SESSION_COOKIE = "sheriff_session";
const PUBLIC_PATHS = new Set([
  "/",
  "/index.html",
  "/styles.css",
  "/supabase-config.js",
  "/sheriff-auth.js",
  "/interaction-limits.js"
]);

function getCookie(request, name) {
  const cookies = request.headers.get("Cookie") || "";
  const prefix = `${name}=`;
  const item = cookies.split(";").map((value) => value.trim()).find((value) => value.startsWith(prefix));
  return item ? item.slice(prefix.length) : null;
}

function sessionCookie(value, maxAge) {
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

function redirectResponse(url, cookie) {
  const headers = new Headers({ Location: url, "Cache-Control": "no-store" });
  if (cookie) headers.append("Set-Cookie", cookie);
  return new Response(null, { status: 302, headers });
}

function loginRedirect(request, clearCookie = false) {
  const current = new URL(request.url);
  const login = new URL("/index.html", current.origin);
  login.searchParams.set("next", `${current.pathname}${current.search}`);
  return redirectResponse(login.href, clearCookie ? sessionCookie("", 0) : null);
}

async function getSupabaseUser(token, env) {
  const response = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`
    }
  });
  if ([401, 403].includes(response.status)) return null;
  if (!response.ok) throw new Error(`Verificarea autentificării a returnat HTTP ${response.status}.`);
  return response.json();
}

async function getMemberProfile(userId, token, env) {
  const query = new URLSearchParams({
    select: "id,grade,is_blocked",
    id: `eq.${userId}`
  });
  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/profiles?${query}`, {
    headers: {
      apikey: env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error(`Verificarea profilului a returnat HTTP ${response.status}.`);
  const profiles = await response.json();
  return profiles[0] || null;
}

function getTokenExpiry(token) {
  const payloadPart = token.split(".")[1];
  if (!payloadPart) return null;
  const encoded = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
  const payload = JSON.parse(atob(encoded));
  return Number.isInteger(payload.exp) ? payload.exp : null;
}

async function createSession(request, env) {
  if (request.headers.get("Origin") !== new URL(request.url).origin) {
    return new Response("Origine neacceptată.", { status: 403 });
  }
  if (request.method === "DELETE") {
    return new Response(null, {
      status: 204,
      headers: { "Set-Cookie": sessionCookie("", 0) }
    });
  }
  if (request.method !== "POST") {
    return new Response("Cerere neacceptată.", { status: 405 });
  }

  const authorization = request.headers.get("Authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token || token.length > 8192) {
    return Response.json({ error: "Token de autentificare invalid." }, {
      status: 401,
      headers: { "Cache-Control": "no-store", "Set-Cookie": sessionCookie("", 0) }
    });
  }

  try {
    const user = await getSupabaseUser(token, env);
    if (!user?.id) {
      return Response.json({ error: "Sesiunea Supabase nu este validă." }, {
        status: 401,
        headers: { "Cache-Control": "no-store", "Set-Cookie": sessionCookie("", 0) }
      });
    }
    const profile = await getMemberProfile(user.id, token, env);
    if (!profile) {
      return Response.json({ error: "Profilul contului nu a fost găsit." }, {
        status: 403,
        headers: { "Cache-Control": "no-store", "Set-Cookie": sessionCookie("", 0) }
      });
    }

    const accessResponse = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/record_access`, {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        p_ip_address: request.headers.get("CF-Connecting-IP")
      })
    });
    if (!accessResponse.ok) {
      throw new Error(`Înregistrarea accesului a returnat HTTP ${accessResponse.status}.`);
    }
    const allowed = await accessResponse.json();
    if (!allowed) {
      return Response.json({ error: "Accesul contului este blocat." }, {
        status: 403,
        headers: { "Cache-Control": "no-store", "Set-Cookie": sessionCookie("", 0) }
      });
    }

    if (!profile || profile.is_blocked) {
      return Response.json({ error: "Accesul contului este blocat." }, {
        status: 403,
        headers: { "Cache-Control": "no-store", "Set-Cookie": sessionCookie("", 0) }
      });
    }
    const expiry = getTokenExpiry(token);
    const maxAge = expiry ? Math.max(0, expiry - Math.floor(Date.now() / 1000)) : 0;
    if (maxAge === 0) {
      return Response.json({ error: "Sesiunea a expirat." }, {
        status: 401,
        headers: { "Cache-Control": "no-store", "Set-Cookie": sessionCookie("", 0) }
      });
    }

    return Response.json({ ok: true }, {
      headers: {
        "Set-Cookie": sessionCookie(token, maxAge),
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    return Response.json({ error: `Nu s-a putut valida sesiunea: ${error.message}` }, {
      status: 502,
      headers: { "Cache-Control": "no-store" }
    });
  }
}

async function serveProtectedAsset(request, env) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) return loginRedirect(request);

  let user;
  let profile;
  try {
    user = await getSupabaseUser(token, env);
    if (!user?.id) return loginRedirect(request, true);
    profile = await getMemberProfile(user.id, token, env);
  } catch {
    return new Response("Serviciul de verificare a accesului nu este disponibil. Reîncearcă mai târziu.", {
      status: 503,
      headers: { "Cache-Control": "no-store" }
    });
  }

  if (!profile || profile.is_blocked) {
    return loginRedirect(request, true);
  }

  const url = new URL(request.url);
  if (url.pathname === "/admin.html" && profile.grade !== "STAFF") {
    return new Response("Accesul la panoul Admin este permis doar personalului STAFF.", {
      status: 403,
      headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" }
    });
  }
  if (!["GET", "HEAD"].includes(request.method)) {
    return new Response("Metodă neacceptată.", { status: 405 });
  }

  const assetResponse = await env.ASSETS.fetch(request);
  const headers = new Headers(assetResponse.headers);
  headers.set("Cache-Control", "private, no-store");
  return new Response(assetResponse.body, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/auth/session") return createSession(request, env);
    if (PUBLIC_PATHS.has(url.pathname)) {
      if (!["GET", "HEAD"].includes(request.method)) {
        return new Response("Metodă neacceptată.", { status: 405 });
      }
      return env.ASSETS.fetch(request);
    }

    return serveProtectedAsset(request, env);
  }
};
