const MAX_COMMENT_LENGTH = 60;
const MAX_COMMENTS_PER_EQUIPMENT = 100;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return withCors(null, 204);
    }

    if (url.pathname !== "/comments") {
      return json({ error: "Not found" }, 404);
    }

    try {
      if (request.method === "GET") {
        return await listComments(url, env);
      }
      if (request.method === "POST") {
        return await createComment(request, env);
      }
      return json({ error: "Method not allowed" }, 405);
    } catch (error) {
      return json({ error: "Server error" }, 500);
    }
  }
};

async function listComments(url, env) {
  const equipmentId = normalizeEquipmentId(url.searchParams.get("equipmentId"));
  if (!equipmentId) {
    return json({ error: "Missing equipmentId" }, 400);
  }

  const result = await env.DB.prepare(
    `SELECT text, ip_prefix AS ipPrefix, created_at AS createdAt
     FROM comments
     WHERE equipment_id = ?
     ORDER BY created_at DESC
     LIMIT ?`
  ).bind(equipmentId, MAX_COMMENTS_PER_EQUIPMENT).all();

  return json({ comments: result.results || [] });
}

async function createComment(request, env) {
  const body = await request.json().catch(() => null);
  const equipmentId = normalizeEquipmentId(body?.equipmentId);
  const text = normalizeComment(body?.text);

  if (!equipmentId) {
    return json({ error: "Missing equipmentId" }, 400);
  }
  if (!text) {
    return json({ error: "评论不能为空" }, 400);
  }
  if (text.length > MAX_COMMENT_LENGTH) {
    return json({ error: "评论不能超过 60 字" }, 400);
  }

  const ipPrefix = getIpPrefix(request);
  await env.DB.prepare(
    `INSERT INTO comments (equipment_id, text, ip_prefix)
     VALUES (?, ?, ?)`
  ).bind(equipmentId, text, ipPrefix).run();

  return json({ ok: true }, 201);
}

function normalizeEquipmentId(value) {
  const text = String(value || "").trim();
  return /^[a-z0-9-]{2,80}$/.test(text) ? text : "";
}

function normalizeComment(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function getIpPrefix(request) {
  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "";
  const firstIp = ip.split(",")[0].trim();

  if (firstIp.includes(".")) {
    const parts = firstIp.split(".");
    return parts.length >= 2 ? `${parts[0]}.${parts[1]}.*.*` : "unknown";
  }

  if (firstIp.includes(":")) {
    const parts = firstIp.split(":").filter(Boolean);
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}:*:*` : "unknown";
  }

  return "unknown";
}

function json(payload, status = 200) {
  return withCors(JSON.stringify(payload), status, {
    "Content-Type": "application/json; charset=utf-8"
  });
}

function withCors(body, status = 200, headers = {}) {
  return new Response(body, {
    status,
    headers: {
      ...headers,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
