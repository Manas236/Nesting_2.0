/* ============================================================
   In-page text editing — the editor
   ------------------------------------------------------------
   Part 2 of 2. The early-boot half lives inline in the head of
   BaseLayout.astro and hangs window.__ntEdit: the page path, the
   edit_key walk, text normalisation, and the localStorage cache. This
   file calls back into those rather than reimplementing them, because
   a key generated on the way in must match a key generated on the way
   out, exactly, forever.

   The rules about WHAT may be edited come from src/lib/editable.ts —
   the same module the API routes import. The browser and the server
   therefore lock the same strings, and the greyed-out cursor is never
   a lie about what would be rejected.

   Shape of the thing:

     · every leaf that holds one run of words becomes editable, and a
       run that shares its parent with a <br>, an icon or a <strong> is
       given a leaf of its own so that it can be one too
     · figures — prices, RERA numbers, phone numbers, measurements —
       are locked, in the browser and again on the server
     · desktop enters an element by double-click, touch by a ~500 ms
       hold that a scroll cancels
     · one element is editable at a time, and only while it has focus
     · saving is optimistic: the text changes, then the POST goes; a
       rejection puts the old text back and says why
     · nothing is ever destroyed — a revert writes a new row

   No framework, no build-time dependency beyond the shared rules.
   ============================================================ */
import { MAX_TEXT, denyReason } from "../lib/editable";

const NT = window.__ntEdit;

/** How long a press has to last to count as deliberate. */
const HOLD_MS = 500;
/** Move further than this and it was a scroll, not a press. */
const MOVE_CANCEL_PX = 10;
/** Versions offered in the per-element menu. */
const MENU_VERSIONS = 5;
const TOAST_MS = 4200;
/** Window in which the click/callout that follows a hold is swallowed. */
const AFTER_HOLD_MS = 700;

const LOCK_TITLE = "Locked — contains figures from official documents";

const state = {
  /** key -> { text, original, id } for this page. */
  edits: {},
  /** The one element currently open for editing. */
  active: null,
  /** Its text when we entered, for the failure path. */
  before: "",
  menu: null,
  holdTimer: 0,
  holdFrom: null,
  swallowUntil: 0,
};

/* ============================================================
   Boot
   ============================================================ */
if (NT) boot();

async function boot() {
  const data = await NT.ready;

  // Copy that shares its parent with a <br>, an icon or a <strong> gets
  // a wrapper of its own first, so that everything below — applying,
  // marking, keying — sees one settled shape of the document. The head
  // script has normally done this already; this is the offline path,
  // where nothing else would have asked.
  NT.ensureWrapped();

  if (data && data.edits) {
    // Server wins over the cache, and refreshes it.
    state.edits = data.edits;
    NT.applyAll(state.edits);
    NT.writeCache(state.edits);
  } else {
    // Offline, or the database is down. Keep showing what we cached
    // rather than snapping back to the built-in copy.
    state.edits = NT.readCache();
  }

  markElements();
  installGestures();
  buildToolbar();
}

/* ============================================================
   Deciding what may be edited
   ------------------------------------------------------------
   One pass over the document. Elements are marked with attributes and
   every gesture is delegated off document, so nothing here scales with
   how long the page is.
   ============================================================ */
function markElements() {
  const all = document.body.querySelectorAll("*");

  for (const el of all) {
    if (NT.skipTag(el)) continue;
    // Inside an <svg>, our own furniture, or an opted-out block.
    if (el.closest(NT.optOut)) continue;
    // A leaf holding exactly one run of words. This is also what keeps
    // <a> wrappers around images out: they own no text of their own.
    if (!NT.isTextLeaf(el)) continue;

    const text = NT.textOf(el);
    if (!text) continue;

    if (denyReason(text)) {
      el.setAttribute("data-nt-locked", "");
      el.title = LOCK_TITLE;
      continue;
    }

    el.setAttribute("data-nt-editable", "");
  }
}

/** The stored key wins: an edit that was re-homed by the fallback scan
    keeps talking to its own row rather than opening a second one. */
function keyOf(el) {
  return el.dataset.ntKey || NT.keyFor(el);
}

/** The text the page shipped with — the anchor every row is filed under. */
function anchorOf(el, fallback) {
  return el.dataset.ntOriginal || fallback;
}

function editableFrom(target) {
  if (!target || !target.closest) return null;
  const el = target.closest("[data-nt-editable]");
  return el && !el.closest("[data-nt-ui]") ? el : null;
}

/* ============================================================
   Gestures
   ------------------------------------------------------------
   Getting in has to be deliberate — a phone visitor scrolling past
   must never find themselves typing into the page.

     desktop  double-click
     touch    hold ~500 ms, cancelled by a 10 px drift
     both     a hold on an element that is already open, or a
              right-click on one that has been edited, opens its
              version list

   The hold is wired through pointer events, so it also works with a
   mouse. That is deliberate: a double-click on a link races the
   browser's own navigation, and holding a link does not.
   ============================================================ */
function installGestures() {
  document.addEventListener("dblclick", (e) => {
    const el = editableFrom(e.target);
    if (!el) return;
    e.preventDefault(); // the second click of a double must not follow a link
    enter(el);
  });

  document.addEventListener(
    "pointerdown",
    (e) => {
      clearHold();
      if (e.button > 0) return; // right-click has its own path
      const el = editableFrom(e.target);
      if (!el) return;

      state.holdFrom = { x: e.clientX, y: e.clientY };
      state.holdTimer = window.setTimeout(() => {
        state.holdTimer = 0;
        // A second hold on an element already open, that has history,
        // asks for the version list instead of another edit.
        if (state.active === el && el.hasAttribute("data-nt-edited")) {
          openVersions(el);
        } else {
          enter(el);
        }
        // Swallow the click and the OS callout the hold is about to
        // produce, so holding a nav link neither navigates nor opens
        // the browser's own menu.
        state.swallowUntil = Date.now() + AFTER_HOLD_MS;
      }, HOLD_MS);
    },
    { passive: true }
  );

  document.addEventListener(
    "pointermove",
    (e) => {
      if (!state.holdTimer || !state.holdFrom) return;
      if (
        Math.abs(e.clientX - state.holdFrom.x) > MOVE_CANCEL_PX ||
        Math.abs(e.clientY - state.holdFrom.y) > MOVE_CANCEL_PX
      ) {
        clearHold(); // that was a scroll
      }
    },
    { passive: true }
  );

  for (const type of ["pointerup", "pointercancel", "wheel", "scroll"]) {
    document.addEventListener(type, clearHold, { passive: true, capture: true });
  }

  // Capture phase: this has to beat the browser's own click handling.
  document.addEventListener(
    "click",
    (e) => {
      if (e.target.closest && e.target.closest("[data-nt-ui]")) return;
      if (Date.now() < state.swallowUntil) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      // Clicking about inside the element you are editing moves the
      // caret; it must not also follow a link.
      if (state.active && state.active.contains(e.target)) e.preventDefault();
    },
    true
  );

  document.addEventListener("contextmenu", (e) => {
    if (Date.now() < state.swallowUntil) {
      e.preventDefault(); // the callout a touch hold just triggered
      return;
    }
    const el = editableFrom(e.target);
    if (!el || !el.hasAttribute("data-nt-edited")) return; // leave the browser menu alone
    e.preventDefault();
    openVersions(el);
  });

  document.addEventListener("focusout", (e) => {
    if (state.active && e.target === state.active) exit(true);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.menu) {
      closeMenu();
      return;
    }
    if (!state.active) return;
    if (e.key === "Enter") {
      e.preventDefault(); // one run of text, so Enter means "done"
      exit(true);
    } else if (e.key === "Escape") {
      e.preventDefault();
      exit(false);
    }
  });

  // Paste arrives as plain text or not at all.
  document.addEventListener("paste", (e) => {
    const el = state.active;
    if (!el || !(el === e.target || el.contains(e.target))) return;
    e.preventDefault();
    const raw = (e.clipboardData || window.clipboardData).getData("text/plain");
    insertPlain(NT.normalize(raw));
  });

  document.addEventListener("scroll", closeMenu, { passive: true });
}

function clearHold() {
  if (state.holdTimer) clearTimeout(state.holdTimer);
  state.holdTimer = 0;
  state.holdFrom = null;
}

function insertPlain(text) {
  if (!text) return;
  // execCommand is deprecated but is still the only insertion that
  // lands on the browser's own undo stack.
  if (document.execCommand && document.execCommand("insertText", false, text))
    return;

  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  range.deleteContents();
  const node = document.createTextNode(text);
  range.insertNode(node);
  range.setStartAfter(node);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

/* ============================================================
   Entering and leaving an element
   ============================================================ */
function enter(el) {
  if (state.active === el) return;
  exit(true); // only ever one at a time
  closeMenu();

  state.active = el;
  state.before = NT.textOf(el);
  // First edit of an untouched element: what it says now is the anchor.
  if (!el.dataset.ntOriginal) el.dataset.ntOriginal = state.before;

  // plaintext-only also blocks Ctrl+B and rich drops; not every engine
  // takes it, and an unsupported value throws rather than falling back.
  try {
    el.contentEditable = "plaintext-only";
  } catch (err) {
    el.contentEditable = "true";
  }
  if (!el.isContentEditable) el.contentEditable = "true";

  el.spellcheck = false;
  el.setAttribute("data-nt-editing", "");
  el.focus({ preventScroll: true });
}

function exit(commit) {
  const el = state.active;
  if (!el) return;

  state.active = null;
  el.contentEditable = "false";
  el.removeAttribute("data-nt-editing");
  if (document.activeElement === el) el.blur();

  const before = state.before;
  const after = NT.normalize(el.textContent);

  // Cancelled, emptied, or untouched: put it back the way it was. This
  // also collapses anything contentEditable did to the whitespace.
  if (!commit || !after || after === before) {
    NT.setText(el, before);
    return;
  }
  saveEdit(el, before, after);
}

/* ============================================================
   Saving — optimistic, then reconciled
   ============================================================ */
function saveEdit(el, before, after) {
  const key = keyOf(el);
  if (!key) return;
  const anchor = anchorOf(el, before);

  // The same rules the server is about to apply, so an obvious refusal
  // costs no round trip.
  const denied = denyReason(after) || denyReason(anchor);
  if (denied) {
    NT.setText(el, before);
    toast(denied);
    return;
  }
  if (after.length > MAX_TEXT) {
    NT.setText(el, before);
    toast(`Keep it under ${MAX_TEXT} characters.`);
    return;
  }

  const previous = state.edits[key];

  NT.setText(el, after);
  el.dataset.ntKey = key;
  el.dataset.ntApplied = after; // keeps the boot's "did we write this?" test honest
  el.setAttribute("data-nt-edited", "");
  state.edits[key] = { text: after, original: anchor, id: previous ? previous.id : 0 };
  NT.writeCache(state.edits);

  send("/api/content", {
    path: NT.path,
    key,
    original: anchor,
    text: after,
  }).then((res) => {
    if (res.ok) {
      state.edits[key] = { text: res.data.text, original: anchor, id: res.data.id };
      NT.writeCache(state.edits);
      return;
    }
    // Rejected. Put the page back exactly as it was and say why.
    NT.setText(el, before);
    el.dataset.ntApplied = before;
    if (previous) {
      state.edits[key] = previous;
    } else {
      delete state.edits[key];
      el.removeAttribute("data-nt-edited");
    }
    NT.writeCache(state.edits);
    toast(res.error);
  });
}

/* ============================================================
   Undo
   ============================================================ */
function undoLast() {
  const keys = Object.keys(state.edits);
  if (!keys.length) {
    toast("Nothing has been changed on this page yet.");
    return;
  }
  // The most recent change on the page is the highest row id.
  let newest = keys[0];
  for (const k of keys) {
    if ((state.edits[k].id || 0) > (state.edits[newest].id || 0)) newest = k;
  }
  revert(newest, null);
}

function revert(key, toId) {
  // The element actually carrying this key wins over the one the key
  // resolves to: if the fallback scan re-homed this edit, those are
  // two different elements and only the first one is showing it.
  const el = findByKey(key) || NT.elFor(key);

  send("/api/content/revert", { path: NT.path, key, toId }).then((res) => {
    if (!res.ok) {
      toast(res.error);
      return;
    }
    const entry = state.edits[key];
    if (el) {
      NT.setText(el, res.data.text);
      el.dataset.ntApplied = res.data.text;
    }
    state.edits[key] = {
      text: res.data.text,
      original: entry ? entry.original : el ? anchorOf(el, res.data.text) : res.data.text,
      id: res.data.id,
    };
    NT.writeCache(state.edits);
    toast("Change undone.");
  });
}

/** An edit the fallback scan re-homed lives on some other element. */
function findByKey(key) {
  return document.querySelector(`[data-nt-key="${CSS.escape(key)}"]`);
}

/* ============================================================
   Version menu
   ============================================================ */
async function openVersions(el) {
  closeMenu();
  const key = keyOf(el);
  if (!key) return;

  const res = await request(
    `/api/content/history?path=${encodeURIComponent(NT.path)}&key=${encodeURIComponent(key)}`
  );
  if (!res.ok) {
    toast(res.error);
    return;
  }
  const rows = (res.data.history || []).slice(0, MENU_VERSIONS);
  if (!rows.length) {
    toast("This text has not been changed yet.");
    return;
  }

  const menu = document.createElement("div");
  menu.className = "nt-menu";
  menu.setAttribute("data-nt-ui", "");
  menu.setAttribute("role", "menu");

  const head = document.createElement("p");
  head.className = "nt-menu-head";
  head.textContent = "Earlier versions";
  menu.appendChild(head);

  rows.forEach((row, i) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "nt-menu-item";

    const line = document.createElement("span");
    line.className = "nt-menu-text";
    line.textContent = row.text;
    item.appendChild(line);

    const meta = document.createElement("span");
    meta.className = "nt-menu-meta";
    // The newest row is what the page already says, so it is a label,
    // not an offer.
    meta.textContent = i === 0 ? "on the page now" : whenever(row.created_at);
    item.appendChild(meta);

    if (i === 0) {
      item.disabled = true;
    } else {
      item.addEventListener("click", () => {
        closeMenu();
        revert(key, row.id);
      });
    }
    menu.appendChild(item);
  });

  document.body.appendChild(menu);
  positionMenu(menu, el);
  state.menu = menu;

  // Any click that is not in the menu closes it.
  setTimeout(() => {
    document.addEventListener("pointerdown", onOutside, true);
  }, 0);
}

function onOutside(e) {
  if (state.menu && !state.menu.contains(e.target)) closeMenu();
}

function closeMenu() {
  if (!state.menu) return;
  document.removeEventListener("pointerdown", onOutside, true);
  state.menu.remove();
  state.menu = null;
}

function positionMenu(menu, el) {
  const r = el.getBoundingClientRect();
  const w = menu.offsetWidth;
  const h = menu.offsetHeight;
  const pad = 8;

  let left = r.left + window.scrollX;
  let top = r.bottom + window.scrollY + 6;

  left = Math.min(left, window.scrollX + window.innerWidth - w - pad);
  left = Math.max(left, window.scrollX + pad);
  // Flip above if it would hang off the bottom.
  if (r.bottom + h + 6 > window.innerHeight) {
    top = Math.max(window.scrollY + pad, r.top + window.scrollY - h - 6);
  }
  menu.style.left = `${Math.round(left)}px`;
  menu.style.top = `${Math.round(top)}px`;
}

function whenever(iso) {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  const mins = Math.round((Date.now() - t) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

/* ============================================================
   Toolbar and toast
   ============================================================ */
function buildToolbar() {
  const pill = document.createElement("button");
  pill.type = "button";
  pill.className = "nt-pill";
  pill.setAttribute("data-nt-ui", "");
  pill.textContent = "Undo last change";
  pill.addEventListener("click", undoLast);
  // Appended, never inserted: nth-of-type keys stay put.
  document.body.appendChild(pill);
}

let toastTimer = 0;
function toast(message) {
  if (!message) return;
  let node = document.querySelector(".nt-toast");
  if (!node) {
    node = document.createElement("div");
    node.className = "nt-toast";
    node.setAttribute("data-nt-ui", "");
    node.setAttribute("role", "status");
    document.body.appendChild(node);
  }
  node.textContent = message;
  node.classList.add("is-up");

  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => node.classList.remove("is-up"), TOAST_MS);
}

/* ============================================================
   Transport
   ============================================================ */
async function send(url, body) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "same-origin",
      // Survives a navigation started by the click that saved.
      keepalive: true,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error || "Could not save." };
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: "No connection — the change was not saved." };
  }
}

async function request(url) {
  try {
    const res = await fetch(url, { credentials: "same-origin" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error || "Could not load." };
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: "No connection." };
  }
}
