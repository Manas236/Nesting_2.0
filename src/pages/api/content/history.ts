/* ============================================================
   GET /api/content/history?path=<pathname>&key=<edit_key>
   ------------------------------------------------------------
   Every version of one piece of text, newest first. The client shows
   the last five in the right-click menu; the full list is returned
   because the table is append-only and this is the only way to read
   the trail.

   `original` on the OLDEST row is the text the page was built with.
   ============================================================ */
import type { APIRoute } from "astro";
import type { RowDataPacket } from "mysql2";
import pool from "../../../lib/db";
import { isValidKey, normalizePath } from "../../../lib/editable";

export const prerender = false;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

const SELECT_HISTORY = `
  SELECT id, original_text, new_text, created_at
    FROM content_edits
   WHERE page_path = ? AND edit_key = ?
   ORDER BY id DESC
`;

export const GET: APIRoute = async ({ url }) => {
  const path = normalizePath(url.searchParams.get("path"));
  if (!path) return json({ error: "That page cannot be edited." }, 400);

  const key = url.searchParams.get("key");
  if (!isValidKey(key))
    return json({ error: "Could not identify the text on the page." }, 400);

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(SELECT_HISTORY, [
      path,
      key,
    ]);

    return json({
      path,
      key,
      history: rows.map((r) => ({
        id: r.id,
        text: r.new_text,
        original: r.original_text,
        created_at:
          r.created_at instanceof Date
            ? r.created_at.toISOString()
            : String(r.created_at),
      })),
    });
  } catch (err) {
    console.error("Failed to read content history:", err);
    return json({ error: "History is unavailable right now." }, 503);
  }
};
