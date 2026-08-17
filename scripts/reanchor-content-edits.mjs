/* ============================================================
   One-off repair: re-anchor content edits the page can no longer match.

   WHY THIS EXISTS
   ---------------
   Every row in `content_edits` carries an `original_text` anchor: the
   text the page was BUILT with under that key. applyOne() in the head
   script of src/layouts/BaseLayout.astro will only write an edit onto an
   element that still holds that string (or the edit's own text, or a
   value applyOne itself put there) — otherwise it hunts the page for the
   anchor, and failing that, skips the edit in silence.

   That check is right: it is what stops an edit landing on unrelated
   copy after the markup shifts. But the site's own source text has been
   rewritten repeatedly — the owner's 12 and 13 Aug 2026 reviews rewrote
   most of it — while the anchors stayed on 6 Aug wording. On 17 Aug 2026,
   60 of 224 stored edits could no longer be placed on any page:

     35  the key still resolves, but the element holds different copy
     25  the key resolves to nothing at all — that markup is gone

   POST /api/content now adopts a fresh anchor whenever the browser
   reports text other than the one on file, so a drifted line heals on
   its next edit. That fixes the future and nothing else: rows already
   stranded are never sent back through that route, because the owner has
   no reason to retype copy that looks, to them, like it simply vanished.
   This script is the pass that recovers them.

   WHAT IT DOES
   ------------
   Renders the real site in headless Chrome — not a parsed copy of the
   HTML. The anchor has to be the string applyOne() will compare against,
   and that is computed after ensureWrapped() has inserted its <nt-t>
   wrappers and after nth-of-type has been counted over the live DOM. Any
   reimplementation of that outside a browser is a guess, and a wrong
   guess re-anchors an edit onto the wrong sentence.

   For each stranded edit whose key still resolves it writes ONE NEW ROW:
   the same key and the same text, with the anchor set to what the page
   says there now. Nothing is updated and nothing is deleted — the table
   stays append-only, the history stays readable, and the new row becomes
   `latest` and so what GET /api/content serves.

   Edits whose key resolves to nothing are reported and left alone. There
   is no honest way to place them: the elements they were made on are not
   on the page in any form, and matching them by content would be a guess
   about which paragraph replaced which.

   ONE GROUP IS LEFT ALONE ON PURPOSE, and it is worth knowing about: a
   key whose stored anchor is dead but whose edit text is what the page
   already says. applyOne() places those through its "it already holds
   this exact text" branch, so nothing is broken for anyone looking at
   the site, and the edit is a no-op against the source anyway — somebody
   folded it back into src/pages. Writing a row for them would be churn
   in an append-only table to fix nothing visible. If the copy under one
   of them is later rewritten, it strands like any other, and the next
   edit to that line adopts a live anchor through POST /api/content.

   RUNNING IT
   ----------
   Dry run, against the local dev server, printing what it would do:

       node scripts/reanchor-content-edits.mjs

   The site it renders and the database it writes to are separate choices,
   which matters because the preview server has its own database and is
   unlikely to have Chrome on it. Render the deployed site here, emit SQL,
   and apply that on the server:

       node scripts/reanchor-content-edits.mjs \
            --site https://<preview-host> --out reanchor.sql
       # then, on the server:  mysql nesting_tree < reanchor.sql

   Or write straight to the database named in .env, having rendered the
   site that database is behind:

       node scripts/reanchor-content-edits.mjs --site http://localhost:4321 --apply

   RUN IT AGAIN AFTER ANY BUILD THAT REWRITES COPY. Rewording a line in
   src/pages strands every edit under it in exactly the same way; the
   adoption in the API route only catches the ones somebody happens to
   edit again.

   It is safe to re-run: a second pass finds the rows it wrote already
   matching and reports nothing to do.
   ============================================================ */
import { spawn } from "node:child_process";
import { readFile, mkdtemp, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import path from "node:path";
import mysql from "mysql2/promise";
import { escape as sqlEscape } from "mysql2";
import "dotenv/config";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* ------------------------------------------------------------
   Arguments
   ------------------------------------------------------------ */
const argv = process.argv.slice(2);
function flag(name) {
  return argv.includes(`--${name}`);
}
function option(name, fallback) {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
}

const SITE = option("site", "http://localhost:4321").replace(/\/+$/, "");
const OUT = option("out", null);
const APPLY = flag("apply");
const PORT = Number(option("port", 9455));

/* ------------------------------------------------------------
   The page list, read from the module that owns it
   ------------------------------------------------------------
   Not restated here. src/lib/editable.ts is what the API route accepts,
   so a page missing from that list has no rows to repair anyway, and a
   second copy of the list is a second thing to forget to update.
   ------------------------------------------------------------ */
async function knownPaths() {
  const src = await readFile(path.join(root, "src", "lib", "editable.ts"), "utf8");
  const block = /KNOWN_PATHS:\s*readonly string\[\]\s*=\s*\[([\s\S]*?)\]/.exec(src);
  if (!block) throw new Error("Could not find KNOWN_PATHS in src/lib/editable.ts");
  const paths = [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  if (!paths.length) throw new Error("KNOWN_PATHS parsed empty — has its shape changed?");
  return paths;
}

/* ------------------------------------------------------------
   Chrome
   ------------------------------------------------------------ */
function findChrome() {
  const fromEnv = process.env.CHROME_PATH;
  if (fromEnv) return fromEnv;
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  const found = candidates.find((c) => existsSync(c));
  if (!found)
    throw new Error(
      "No Chrome found. Set CHROME_PATH to a Chrome or Edge binary — this " +
        "script needs a real browser, see the note at the top of the file."
    );
  return found;
}

/* A throwaway profile every run. localStorage is the reason: the head
   script paints its cached copy of a page's edits before the server's
   answer lands, and a cache left over from an earlier run would show us
   an edit sitting on an element the live page does not actually place it
   on — which is exactly the string we must not adopt as an anchor. */
async function openBrowser() {
  const profile = await mkdtemp(path.join(tmpdir(), "nt-reanchor-"));
  const proc = spawn(
    findChrome(),
    [
      "--headless=new",
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${profile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-gpu",
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  let target = null;
  for (let i = 0; i < 60 && !target; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      target = list.find((t) => t.type === "page");
    } catch {
      /* not listening yet */
    }
    if (!target) await new Promise((r) => setTimeout(r, 250));
  }
  if (!target) {
    proc.kill();
    throw new Error(`Chrome did not open a debugging port on ${PORT}.`);
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = () => reject(new Error("Could not attach to Chrome."));
  });

  let id = 0;
  const pending = new Map();
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };
  const send = (method, params = {}) => {
    const n = ++id;
    ws.send(JSON.stringify({ id: n, method, params }));
    return new Promise((resolve) => pending.set(n, resolve));
  };

  await send("Page.enable");
  await send("Runtime.enable");

  return {
    send,
    async evaluate(expression) {
      const r = await send("Runtime.evaluate", {
        expression,
        awaitPromise: true,
        returnByValue: true,
      });
      const thrown = r.result?.exceptionDetails;
      if (thrown)
        throw new Error(
          thrown.exception?.description ?? thrown.text ?? "evaluation failed"
        );
      return r.result?.result?.value;
    },
    async close() {
      ws.close();
      proc.kill();
      await rm(profile, { recursive: true, force: true }).catch(() => {});
    },
  };
}

/* ------------------------------------------------------------
   The audit, run inside the page
   ------------------------------------------------------------
   Everything here calls back into window.__ntEdit rather than restating
   it, for the same reason the editor does: a key computed one way and
   compared another is how this whole problem started.

   `applied` is awaited first. It resolves once the server's answer is on
   the page, so by the time anything is measured, applyOne() has had its
   turn and the elements it could not place are still holding the text
   the page was built with — which is the anchor we are here to collect.
   ------------------------------------------------------------ */
const AUDIT = `(async () => {
  const NT = window.__ntEdit;
  if (!NT) return { error: "window.__ntEdit is missing — is this a BaseLayout page?" };

  const answer = await NT.applied;
  if (!answer || !answer.edits) return { error: "GET /api/content returned nothing" };

  const out = { path: NT.path, total: 0, ok: 0, stale: [], dead: [], skipped: [] };

  for (const key of Object.keys(answer.edits)) {
    const edit = answer.edits[key];
    out.total++;

    const el = NT.elFor(key);

    /* applyOne() stamps what it wrote. Both marks together are the only
       proof this edit is the one on screen. */
    if (el && el.dataset.ntKey === key && el.dataset.ntApplied != null) {
      out.ok++;
      continue;
    }

    if (!el || !NT.isTextLeaf(el)) {
      out.dead.push({ key, text: edit.text, anchor: edit.original });
      continue;
    }

    /* The fallback scan re-homed some OTHER edit onto this element, so
       what it says belongs to that key, not this one. Adopting it would
       anchor two edits to one string. */
    if (el.dataset.ntKey && el.dataset.ntKey !== key) {
      out.skipped.push({ key, why: "element already carries another edit" });
      continue;
    }

    const now = NT.textOf(el);
    if (!now) {
      out.skipped.push({ key, why: "element is empty" });
      continue;
    }
    if (now === edit.text) {
      /* The page already says what the edit says — the source copy was
         updated to match it. Nothing to anchor. */
      out.ok++;
      continue;
    }

    out.stale.push({ key, text: edit.text, anchor: edit.original, now });
  }
  return out;
})()`;

/* ------------------------------------------------------------ */
const INSERT = `INSERT INTO content_edits
  (page_path, edit_key, original_text, new_text, client_ip, user_agent)
VALUES (?, ?, ?, ?, NULL, NULL)`;

/* client_ip and user_agent are NULL, and that is deliberate. They are
   audit columns — src/lib/editable.ts calls them data that must be
   "either true or absent". No visitor made this row. */

function statementFor(page, row) {
  return (
    "INSERT INTO content_edits\n" +
    "  (page_path, edit_key, original_text, new_text, client_ip, user_agent)\n" +
    "VALUES (" +
    [sqlEscape(page), sqlEscape(row.key), sqlEscape(row.now), sqlEscape(row.text)].join(", ") +
    ", NULL, NULL);"
  );
}

function short(s, n = 58) {
  const one = String(s ?? "").replace(/\s+/g, " ");
  return one.length > n ? one.slice(0, n - 1) + "…" : one;
}

async function main() {
  const paths = await knownPaths();
  const browser = await openBrowser();

  const repairs = [];
  const dead = [];
  const skipped = [];
  let total = 0;
  let ok = 0;

  console.log(`Rendering ${paths.length} pages from ${SITE}\n`);

  try {
    for (const page of paths) {
      await browser.send("Page.navigate", { url: SITE + page });
      // Long enough for the head script's fetch and the parse to land.
      await new Promise((r) => setTimeout(r, 1500));

      let report;
      try {
        report = await browser.evaluate(AUDIT);
      } catch (err) {
        console.log(`${page.padEnd(20)} could not be read: ${err.message}`);
        continue;
      }
      if (report?.error) {
        console.log(`${page.padEnd(20)} ${report.error}`);
        continue;
      }

      total += report.total;
      ok += report.ok;
      for (const r of report.stale) repairs.push({ page, ...r });
      for (const d of report.dead) dead.push({ page, ...d });
      for (const s of report.skipped) skipped.push({ page, ...s });

      const note =
        report.stale.length || report.dead.length
          ? `${String(report.stale.length).padStart(3)} to re-anchor, ${String(
              report.dead.length
            ).padStart(3)} unrecoverable`
          : "all applying";
      console.log(
        `${page.padEnd(20)} ${String(report.total).padStart(3)} stored   ${note}`
      );
    }
  } finally {
    await browser.close();
  }

  console.log(
    `\n${total} stored edits: ${ok} already applying, ${repairs.length} ` +
      `re-anchorable, ${dead.length} unrecoverable, ${skipped.length} left alone.`
  );

  if (repairs.length) {
    console.log("\nWould re-anchor:");
    for (const r of repairs) {
      console.log(`  ${r.page}`);
      console.log(`    was anchored to : ${short(r.anchor)}`);
      console.log(`    page now says   : ${short(r.now)}`);
      console.log(`    edit says       : ${short(r.text)}`);
    }
  }

  if (dead.length) {
    console.log(
      "\nUnrecoverable — the markup these were made on is gone. Nothing is\n" +
        "written for them; the copy has to be re-entered by hand if it is\n" +
        "still wanted:"
    );
    for (const d of dead) console.log(`  ${d.page.padEnd(18)} ${short(d.text)}`);
  }

  if (skipped.length) {
    console.log("\nLeft alone:");
    for (const s of skipped) console.log(`  ${s.page.padEnd(18)} ${s.why}`);
  }

  if (OUT && repairs.length) {
    const sql =
      "-- Re-anchors content edits the page could no longer match.\n" +
      `-- Generated ${new Date().toISOString()} from ${SITE}\n` +
      "-- by scripts/reanchor-content-edits.mjs. Append-only: inserts, no\n" +
      "-- updates and no deletes.\n\n" +
      "START TRANSACTION;\n\n" +
      repairs.map((r) => statementFor(r.page, r)).join("\n\n") +
      "\n\nCOMMIT;\n";
    await writeFile(OUT, sql, "utf8");
    console.log(`\nWrote ${repairs.length} statements to ${OUT}`);
  }

  if (!APPLY) {
    console.log(
      repairs.length
        ? "\nDry run — nothing written to the database. Re-run with --apply."
        : "\nNothing to do."
    );
    return;
  }

  if (!repairs.length) return;

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  try {
    await conn.beginTransaction();
    for (const r of repairs) {
      await conn.execute(INSERT, [r.page, r.key, r.now, r.text]);
    }
    await conn.commit();
    console.log(
      `\nWrote ${repairs.length} re-anchoring rows to ` +
        `${process.env.DB_NAME} on ${process.env.DB_HOST}.`
    );
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.end();
  }
}

await main();
