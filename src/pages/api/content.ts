/* ============================================================
   GET  /api/content?path=<pathname>   — the edits for one page
   POST /api/content                   — save one edit
   ------------------------------------------------------------
   The read half runs on every page view, so it stays cheap: one
   indexed query, no session, no cookies.

   The write half is the only thing standing between the site's copy
   and the open internet — there is no login on this feature — so it
   trusts nothing in the request body. Every field goes through
   validateEdit() in src/lib/editable.ts, which is the same module the
   browser uses to decide what it will let you click into.

   Be clear about how little that is now. validateEdit checks the SHAPE
   of a request — known page, well-formed key, non-empty text under the
   length cap, markup stripped — and, since the denylist was removed on
   13 Aug 2026, nothing whatever about what the text says. Anyone who
   can load a page can rewrite any of its copy, including prices, RERA
   numbers and the sales phone number. What survives is not prevention
   but the audit trail below.

   content_edits is APPEND-ONLY. A save is an INSERT; the current text
   for a key is the row with the highest id. Nothing here UPDATEs or
   DELETEs, so the table doubles as the audit trail of who changed what
   to what (and /api/content/revert can walk back through it).
   ============================================================ */
import type { APIRoute } from "astro";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../../lib/db";
import {
  cleanText,
  clientIpFrom,
  normalizePath,
  userAgentFrom,
  validateEdit,
} from "../../lib/editable";

export const prerender = false;

/** Every response here is per-visitor state that must never be cached. */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

/* ------------------------------------------------------------
   GET — the latest row per edit_key for one page.

   The inner query finds the highest id per key (that is "current"),
   the join pulls the text back out. idx_page keeps it to the rows for
   this one page.
   ------------------------------------------------------------ */
/* Columns are named one by one, and client_ip / user_agent are not among
   them. This response goes to the browser — never widen it to SELECT *. */
const SELECT_LATEST = `
  SELECT e.id, e.edit_key, e.original_text, e.new_text
    FROM content_edits e
    JOIN (
      SELECT edit_key, MAX(id) AS max_id
        FROM content_edits
       WHERE page_path = ?
       GROUP BY edit_key
    ) latest ON latest.max_id = e.id
`;

export const GET: APIRoute = async ({ url }) => {
  const path = normalizePath(url.searchParams.get("path"));

  // An unknown page simply has no edits. The head script fires this
  // request on every page — including ones that are not editable — and
  // a 400 there would be console noise, not information.
  if (!path) return json({ edits: {} });

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(SELECT_LATEST, [path]);

    const edits: Record<
      string,
      { text: string; original: string; id: number }
    > = {};
    for (const row of rows) {
      edits[row.edit_key] = {
        text: row.new_text,
        original: row.original_text,
        id: row.id,
      };
    }
    return json({ edits });
  } catch (err) {
    console.error("Failed to read content edits:", err);
    // 503, not 500: the client keeps showing its localStorage copy
    // rather than snapping the page back to the built-in text.
    return json({ edits: {}, error: "Edits are unavailable right now." }, 503);
  }
};

/* ------------------------------------------------------------
   POST — save one edit.
   Body: { path, key, original, text }

   `original_text` means one thing throughout this table: the text the
   page was BUILT with. It never moves. That is what makes an edit
   findable months later — the browser looks the element up by key, and
   if the markup has shifted underneath it, falls back to hunting for
   the string this edit replaced. If each save filed itself under the
   PREVIOUS save's text instead, a second edit would already have no
   string on the page to match, and the whole page's edits would quietly
   stop applying for new visitors.

   So the `original` in the body is only ever used for the first edit of
   a key. After that the anchor is read back off the existing rows.
   ------------------------------------------------------------ */
const SELECT_CURRENT = `
  SELECT original_text, new_text
    FROM content_edits
   WHERE page_path = ? AND edit_key = ?
   ORDER BY id DESC
   LIMIT 1
`;

const INSERT_EDIT = `
  INSERT INTO content_edits
    (page_path, edit_key, original_text, new_text, client_ip, user_agent)
  VALUES (?, ?, ?, ?, ?, ?)
`;

/** Roughly 8x the longest legal edit. nginx caps this too. */
const MAX_BODY = 16 * 1024;

export const POST: APIRoute = async (context) => {
  const { request } = context;

  // The socket address, used only if X-Forwarded-For does not parse.
  // Astro throws here rather than returning undefined when the adapter
  // cannot report it, and a save must not 500 over an audit column.
  let socket: string | null = null;
  try {
    socket = context.clientAddress;
  } catch {
    socket = null;
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY) return json({ error: "That is too much text." }, 413);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Could not read the change." }, 400);
  }
  if (!body || typeof body !== "object")
    return json({ error: "Could not read the change." }, 400);

  const check = validateEdit(body as Record<string, unknown>);
  if (!check.ok) return json({ error: check.reason }, 400);

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(SELECT_CURRENT, [
      check.path,
      check.key,
    ]);
    const latest = rows[0];
    const anchor = latest ? latest.original_text : check.original;
    const current = latest ? cleanText(latest.new_text) : check.original;

    if (current === check.text)
      return json({ error: "That is already what the page says." }, 400);

    const [res] = await pool.execute<ResultSetHeader>(INSERT_EDIT, [
      check.path,
      check.key,
      anchor,
      check.text,
      clientIpFrom(request, socket),
      userAgentFrom(request),
    ]);
    return json({ ok: true, id: res.insertId, text: check.text });
  } catch (err) {
    console.error("Failed to save content edit:", err);
    return json({ error: "Could not save — please try again." }, 500);
  }
};
