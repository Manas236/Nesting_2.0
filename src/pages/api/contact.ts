/* ============================================================
   POST /api/contact
   ------------------------------------------------------------
   Receives an enquiry form submission, validates it, stores it
   in the MySQL `leads` table, then redirects the visitor to the
   thank-you page. This runs on the server at request time, which
   is why it is marked `prerender = false`.
   ============================================================ */
import type { APIRoute } from "astro";
import pool from "../../lib/db";
import { projects } from "../../data/site";

export const prerender = false;

const knownSlugs = new Set(projects.map((p) => p.slug));

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();

  const name = String(form.get("name") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const project = String(form.get("project") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();

  // Where the enquiry came from (which project page). Falls back to the
  // Referer header so we know the source even without a hidden field.
  const sourcePage =
    String(form.get("source_page") ?? "").trim() ||
    request.headers.get("referer") ||
    null;

  // Name and phone are the two required fields on every form.
  if (!name || !phone) {
    return redirect("/thank-you?status=error", 303);
  }

  try {
    await pool.execute(
      `INSERT INTO leads (name, phone, email, project, message, source_page)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, phone, email || null, project || null, message || null, sourcePage]
    );
  } catch (err) {
    console.error("Failed to save enquiry:", err);
    return redirect("/thank-you?status=error", 303);
  }

  // Pass the chosen project through so the thank-you page can show its render.
  const to = knownSlugs.has(project)
    ? `/thank-you?project=${encodeURIComponent(project)}`
    : "/thank-you";
  return redirect(to, 303);
};
