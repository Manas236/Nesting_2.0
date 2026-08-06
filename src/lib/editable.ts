/* ============================================================
   Inline editing — the rules, in one place
   ------------------------------------------------------------
   Imported by BOTH sides of the feature:

     · the API routes in src/pages/api/content*        (server)
     · src/scripts/inline-edit.js                      (browser)

   That is the whole point of this file. The browser greys out what it
   will not let you edit, and the server rejects what it will not let you
   save — and those two answers must never disagree. Duplicating the
   regexes would guarantee that they eventually do.

   Keep this file free of server-only imports (no mysql2, no node:*): it
   is bundled into the client script.

   The character classes are built with new RegExp("...\\uXXXX...") on
   purpose. Several rules turn on characters you cannot see (nbsp,
   zero-width joiners) or cannot tell apart on screen (hyphen vs en dash
   vs minus); a literal one pasted into a regex is a silent bug.
   ============================================================ */

/** Longest text we will store, in characters. */
export const MAX_TEXT = 2000;

/** localStorage key prefix for the per-page edit cache. */
export const CACHE_PREFIX = "nt-edits:";

/* ------------------------------------------------------------
   Which pages may be edited
   ------------------------------------------------------------
   Hardcoded from src/pages rather than derived at runtime, so a stray
   `path` in a POST body can never reach the database. /thank-you is
   deliberately absent: it is a transient post-submit page, not copy.
   Add a page here when you add one to src/pages.
   ------------------------------------------------------------ */
export const KNOWN_PATHS: readonly string[] = [
  "/",
  "/about",
  "/gallery",
  "/privacy",
  "/terms",
  "/projects",
  "/projects/dhruva",
  "/projects/ishaan",
  "/projects/prithvi",
  "/projects/rudra",
  "/projects/shaurya",
  "/projects/shikhar",
];

const KNOWN_PATH_SET = new Set(KNOWN_PATHS);

/**
 * Reduce a pathname to the single form we store: lower case, no query,
 * no hash, no trailing slash (except the root). "/About/" -> "/about".
 * Returns null if the result is not an editable page.
 */
export function normalizePath(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let p = raw.trim();
  if (!p) return null;

  // Tolerate a full URL as well as a bare pathname.
  if (/^https?:\/\//i.test(p)) {
    try {
      p = new URL(p).pathname;
    } catch {
      return null;
    }
  }
  p = p.split("?")[0].split("#")[0].toLowerCase();
  if (!p.startsWith("/")) return null;
  if (p.length > 1) p = p.replace(/\/+$/, "");
  if (p === "") p = "/";

  return KNOWN_PATH_SET.has(p) ? p : null;
}

/* ------------------------------------------------------------
   Text normalisation
   ------------------------------------------------------------
   Prerendered HTML wraps copy across source lines, so the same sentence
   is "Homes that\n      grow" in the markup and "Homes that grow" on the
   screen. Both sides funnel every string through this before comparing
   or storing, so "does this element still hold the original text?" has
   one answer rather than two.
   ------------------------------------------------------------ */
const RE_NBSP = new RegExp("\\u00a0", "g");
const RE_ZERO_WIDTH = new RegExp("[\\u200b-\\u200d\\ufeff]", "g");

/** Control characters — but NOT \t \r \n, which are folded to spaces
    below rather than deleted, which would glue two words together. */
const RE_CONTROL = new RegExp(
  "[\\u0000-\\u0008\\u000b\\u000c\\u000e-\\u001f\\u007f]",
  "g"
);

export function normalizeText(raw: unknown): string {
  return String(raw ?? "")
    .replace(RE_NBSP, " ")
    .replace(RE_ZERO_WIDTH, "") // zero-width junk arrives with pasted text
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Remove any markup. We store plain text and render it via textContent. */
export function stripTags(raw: unknown): string {
  return String(raw ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(RE_CONTROL, "");
}

/** stripTags + normalizeText: the form everything is judged in. */
export function cleanText(raw: unknown): string {
  return normalizeText(stripTags(raw));
}

/* ------------------------------------------------------------
   THE DENYLIST
   ------------------------------------------------------------
   Figures on this site are not copy. Carpet areas come off approved
   plans, RERA numbers off certificates, the sales number belongs to one
   person. A passer-by with the page open must not be able to move the
   decimal point on a floor area or retype a phone number, so anything
   shaped like a figure from an official document is locked — both the
   text being replaced AND the replacement.

   Every rule is tested against the normalised string.
   ------------------------------------------------------------ */

/** Rupee sign, "Rs" / "Rs." (not the start of a longer word), or INR. */
export const RE_CURRENCY = new RegExp(
  "\\u20b9|\\bRs\\.?(?![a-z])|\\bINR\\b",
  "i"
);

/** RERA in any casing. A plain substring, so MahaRERA is caught too. */
export const RE_RERA = /rera/i;

/**
 * Six or more digits in one run, ignoring the separators a phone number
 * gets written with: "+91 95940 79317", "022-2757-1234", "9594079317".
 * Each repetition is anchored on a digit, so there is no backtracking
 * blow-up on a long line of spaces.
 */
export const RE_PHONE_LIKE = new RegExp(
  "(?:\\d[\\s+()\\u002d\\u2010-\\u2015]*){6,}"
);

/** Three or more separate groups of digits anywhere in the string. */
export const RE_DIGIT_GROUP = /\d+/g;
export const MAX_DIGIT_GROUPS = 2;

/**
 * Units that may trail a bare number without making it prose.
 * Longest alternative first within a family — "mm" must beat "m".
 */
const UNIT_WORDS = [
  "%",
  "\\+",
  "sq\\.?\\s?ft",
  "sq\\.?\\s?mt?rs?",
  "sqft",
  "sqm",
  "sft",
  "bhk",
  "rk",
  "crores?",
  "cr",
  "lakhs?",
  "lacs?",
  "acres?",
  "gunthas?",
  "units?",
  "floors?",
  "storeys",
  "stories",
  "levels?",
  "homes?",
  "flats?",
  "towers?",
  "wings?",
  "years?",
  "yrs?",
  "months?",
  "weeks?",
  "days?",
  "hours?",
  "hrs?",
  "minutes?",
  "mins?",
  "seconds?",
  "secs?",
  "kms?",
  "mm",
  "cm",
  "km",
  "ft",
  "mtrs?",
  "met(?:er|re)s?",
  "bed(?:room)?s?",
  "bath(?:room)?s?",
  "cars?",
  "seats?",
  "pax",
  "m",
  "k",
].join("|");

/**
 * The whole string is a number, optionally carrying one unit:
 * "3", "2004", "3 BHK", "1,250 sq ft", "24x7", "12%", "10.5 m".
 */
export const RE_NUMERIC_ONLY = new RegExp(
  "^[+~<>\\u002d\\u2013\\u2014\\u2248]?\\s*" + // optional leading sign
    "\\d[\\d.,\\s/:x\\u00d7+\\u002d]*\\s*" + // the number itself
    "(?:" +
    UNIT_WORDS +
    ")?\\s*[.)]?$",
  "i"
);

export interface DenyRule {
  id: string;
  /** Shown to the visitor in the failure toast. */
  reason: string;
  test(s: string): boolean;
}

export const DENY_RULES: readonly DenyRule[] = [
  {
    id: "currency",
    reason: "Prices are locked — this text carries a rupee figure.",
    test: (s) => RE_CURRENCY.test(s),
  },
  {
    id: "rera",
    reason: "RERA text is locked — it comes off the registration certificate.",
    test: (s) => RE_RERA.test(s),
  },
  {
    id: "phone",
    reason: "This looks like a phone number, so it is locked.",
    test: (s) => RE_PHONE_LIKE.test(s),
  },
  {
    id: "figures",
    reason: "Locked — too many figures to be ordinary copy.",
    test: (s) => (s.match(RE_DIGIT_GROUP) || []).length > MAX_DIGIT_GROUPS,
  },
  {
    id: "numeric",
    reason: "Measurements are locked — they come off the approved plans.",
    test: (s) => RE_NUMERIC_ONLY.test(s),
  },
];

/** The first rule a string trips, or null if it trips none. */
export function denyReason(raw: unknown): string | null {
  const s = normalizeText(raw);
  if (!s) return null;
  for (const rule of DENY_RULES) if (rule.test(s)) return rule.reason;
  return null;
}

/** Convenience wrapper for the client, which only needs yes/no. */
export function isDenied(raw: unknown): boolean {
  return denyReason(raw) !== null;
}

/* ------------------------------------------------------------
   edit_key
   ------------------------------------------------------------
   A DOM path built by the client: tag:nth-of-type(n) segments from
   <body>, joined by ">". The server never builds one, but it does
   refuse anything not shaped like one — the key goes back out to other
   visitors' browsers as a querySelector argument.
   ------------------------------------------------------------ */
export const MAX_KEY = 512;

const KEY_SEGMENT = "[a-z][a-z0-9-]*:nth-of-type\\(\\d{1,4}\\)";
export const RE_EDIT_KEY = new RegExp(
  "^" + KEY_SEGMENT + "(?:>" + KEY_SEGMENT + ")*$"
);

export function isValidKey(raw: unknown): raw is string {
  return (
    typeof raw === "string" &&
    raw.length > 0 &&
    raw.length <= MAX_KEY &&
    RE_EDIT_KEY.test(raw)
  );
}

/* ------------------------------------------------------------
   Where an edit came from
   ------------------------------------------------------------
   Nobody logs in to edit this site, so the address and the user agent
   are the only record of who changed a line. That makes them audit
   data, and audit data has to be either true or absent — a wrong
   address is worse than none, so anything that does not parse is
   stored as NULL rather than as the raw string or a placeholder.

   The address arrives in X-Forwarded-For, which nginx sets. That header
   is a list: nginx appends the connecting address to whatever the client
   already sent, so a client can put anything it likes in front of it.
   The first entry is the closest thing to the real origin, and it is
   entirely attacker-controlled, which is why it is parsed rather than
   trusted. If it is not an address, we fall back to the socket address,
   which cannot be forged.

   These run server-side only, but they live here because this module is
   the one both halves share; nothing in them touches node:*, so the
   client bundle can still tree-shake them away.
   ------------------------------------------------------------ */

/** Longest an IPv6 address can print, which is what the column holds. */
const MAX_IP = 45;

/** Strict dotted quad. Leading zeros are rejected: "010" is ambiguous
    (octal to some parsers, decimal to others) and never appears in a
    header written by nginx. */
const RE_IPV4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

const RE_HEX_GROUP = /^[0-9a-f]{1,4}$/;

/** Split one side of a "::" into its groups; null if a stray colon
    left an empty one, as in ":1" or "1:". */
function ipv6Groups(part: string): string[] | null {
  if (part === "") return [];
  const groups = part.split(":");
  for (const g of groups) if (g === "") return null;
  return groups;
}

function isIPv6(raw: string): boolean {
  const s = raw.toLowerCase();
  if (s.length < 2 || s.length > MAX_IP) return false;
  if (!/^[0-9a-f:.]+$/.test(s)) return false;

  const halves = s.split("::");
  if (halves.length > 2) return false;
  const compressed = halves.length === 2;

  const head = ipv6Groups(halves[0]);
  const tail = compressed ? ipv6Groups(halves[1]) : [];
  if (head === null || tail === null) return false;

  const groups = head.concat(tail);
  let count = groups.length;

  // A trailing dotted quad ("::ffff:127.0.0.1") stands in for two groups.
  const last = groups[groups.length - 1];
  if (last !== undefined && last.includes(".")) {
    if (!RE_IPV4.test(last)) return false;
    count += 1;
    for (const g of groups.slice(0, -1))
      if (!RE_HEX_GROUP.test(g)) return false;
  } else {
    for (const g of groups) if (!RE_HEX_GROUP.test(g)) return false;
  }

  // "::" stands for at least one omitted group, so a compressed address
  // is short by definition; an uncompressed one must be all eight.
  return compressed ? count <= 7 : count === 8;
}

/**
 * An address we are willing to write down, or null.
 * IPv4-mapped IPv6 ("::ffff:203.0.113.4") is folded to its IPv4 form, so
 * the same visitor reads the same way whether they arrived over IPv4 or
 * a dual-stack socket.
 */
export function validIp(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let s = raw.trim();
  if (!s || s.length > MAX_IP) return null;

  // A bracketed literal, as in "[::1]".
  if (s.startsWith("[") && s.endsWith("]")) s = s.slice(1, -1);

  if (RE_IPV4.test(s)) return s;
  if (!isIPv6(s)) return null;

  const mapped = /^::ffff:(.+)$/i.exec(s);
  if (mapped && RE_IPV4.test(mapped[1])) return mapped[1];
  return s.toLowerCase();
}

/**
 * The address to file an edit under: the first entry of X-Forwarded-For
 * if it parses, otherwise the socket address, otherwise nothing.
 */
export function clientIpFrom(
  request: Request,
  clientAddress?: string | null
): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = validIp(forwarded.split(",")[0]);
    if (first) return first;
  }
  return validIp(clientAddress);
}

/** The User-Agent, trimmed to what the column holds, or null. */
export function userAgentFrom(request: Request): string | null {
  const ua = request.headers.get("user-agent");
  if (!ua) return null;
  const clean = ua.replace(RE_CONTROL, "").trim();
  return clean ? clean.slice(0, 255) : null;
}

/* ------------------------------------------------------------
   One validation pass, shared by every write route
   ------------------------------------------------------------ */
export interface EditInput {
  path?: unknown;
  key?: unknown;
  original?: unknown;
  text?: unknown;
}

export type EditCheck =
  | { ok: true; path: string; key: string; original: string; text: string }
  | { ok: false; reason: string };

export function validateEdit(input: EditInput): EditCheck {
  const path = normalizePath(input.path);
  if (!path) return { ok: false, reason: "That page cannot be edited." };

  if (!isValidKey(input.key))
    return { ok: false, reason: "Could not identify the text on the page." };
  const key = String(input.key);

  const original = cleanText(input.original);
  const text = cleanText(input.text);

  if (!original) return { ok: false, reason: "The original text is missing." };
  if (original.length > MAX_TEXT)
    return { ok: false, reason: "That block of text is too long to edit." };

  if (!text) return { ok: false, reason: "Text cannot be empty." };
  if (text.length > MAX_TEXT)
    return { ok: false, reason: `Keep it under ${MAX_TEXT} characters.` };

  // Both sides of the change are checked: you may not edit a locked
  // string, and you may not turn an ordinary one into a locked one.
  const denied = denyReason(original) ?? denyReason(text);
  if (denied) return { ok: false, reason: denied };

  // Note there is no "text === original" check here. `original` is the
  // text the page was BUILT with, not necessarily what it says now, so
  // typing a page's own words back into a twice-edited element is a
  // real change. Only the route knows the current value, so the route
  // makes that call.
  return { ok: true, path, key, original, text };
}
