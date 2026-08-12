/* ============================================================
   Structured data (JSON-LD)
   One schema.org Organization node, emitted into the <head> of
   every page by BaseLayout. It restates facts search engines
   would otherwise have to infer from prose: who we are, where
   we build, how to reach us, and who we belong to.

   EVERY VALUE HERE IS READ FROM src/data/site.ts. Do not type a
   phone number, an email or a year into this file — the point of
   structured data is that it agrees with the visible page, and a
   second copy of a fact is a second thing to forget to update.
   ============================================================ */

import { brand, contact, projects } from "../data/site";

/* The address is city-level, matching `contact.address`. There is
   deliberately no `streetAddress`: the company publishes a locality,
   not a walk-in office, and inventing one to satisfy a validator
   would be a false fact in machine-readable form.

   THIS IS ALSO WHY THE TYPE BELOW IS `Organization` AND NOT
   `LocalBusiness` / `HomeAndConstructionBusiness`. Those are the
   richer types and they are what a builder eventually wants, but
   both are storefront types: Google expects a street address, geo
   coordinates and opening hours, and grades incomplete markup as
   worse than none. Upgrade the `@type` the day there is a real
   registered office address to put under it — and add `geo` and
   `openingHoursSpecification` in the same change, not later.

   `RealEstateAgent` — which is the type most SEO advice reaches for
   first — would be wrong at any address. Nesting Tree develops and
   sells its own buildings; an agent brokers other people's. */
const address = {
  "@type": "PostalAddress",
  addressLocality: "Navi Mumbai",
  addressRegion: "Maharashtra",
  postalCode: "410206",
  addressCountry: "IN",
};

/* Today this is one profile: Instagram. The Facebook and LinkedIn
   placeholders that used to sit beside it pointed at "#" and have
   been removed from `contact.socials` — a `sameAs` full of "#" is
   worse than an absent one, because it tells Google the entity has
   no verifiable presence anywhere.

   The filter and the conditional spread below stay regardless. They
   are what let a handle be added to site.ts and light up here with
   no change to this file, and what keeps the property off the node
   entirely rather than emitting an empty array if the list is ever
   emptied again. */
const sameAs = contact.socials
  .map((s) => s.href)
  .filter((href) => /^https?:\/\//i.test(href));

/* E.164, because this number is being handed to a machine to dial.
   `contact.phone` is spaced for human eyes ("+91 95940 79317"); the
   same digits without the spacing are what Google, a dialler and a
   click-to-call widget all want. Derived, never retyped — same
   reasoning as `whatsappHref()` in src/data/site.ts, and the same
   dependency on `contact.phone` keeping its +91 country code. */
const telephone = `+${contact.phone.replace(/\D/g, "")}`;

/**
 * Build the Organization node for `origin` (the deployed public URL —
 * pass `Astro.site`, which comes from `site` in astro.config.mjs).
 *
 * Absolute URLs are not optional in JSON-LD the way they are merely
 * inadvisable elsewhere: a relative `logo` or `@id` is not resolved
 * against the page and the property is silently discarded.
 */
export function organizationSchema(origin: URL) {
  const abs = (path: string) => new URL(path, origin).href;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    /* A fragment id, not the bare origin. The origin identifies the
       WebSite; reusing it here would merge two different things into
       one node the moment any page-level schema is added. */
    "@id": abs("/#organization"),
    name: brand.name,
    url: origin.href,
    logo: abs(brand.logoFull),
    image: abs(brand.logoFull),
    slogan: brand.tagline,

    /* Both years, each doing its own job — the rule this repo keeps
       breaking. `foundingDate` is a statement about the Nesting Tree
       ENTITY, so it is 2019 and nothing else. The two-decade housing
       record belongs to K.D. Construction and is carried in the
       description, where it can be qualified. Writing 2004 into
       `foundingDate` would put a claim into machine-readable form
       that the journey timeline on /about openly contradicts.
       See the long note on `brand` in src/data/site.ts. */
    foundingDate: String(brand.foundedYear),
    description:
      `Residential developer in ${brand.region}, building amenity-first homes — ` +
      `rooftop, gym, lift, CCTV, security and parking included as standard, not sold as extras. ` +
      `Founded in ${brand.foundedYear}, continuing a housing record that began in ${brand.legacyYear}.`,

    founder: { "@type": "Person", name: "Kailash Gindodia" },
    parentOrganization: { "@type": "Organization", name: "K.D. Construction" },

    address,
    /* Where we build, which is not the same as where we are. Stated at
       city level for the same reason `brand.region` is: naming one
       sector reads as a limit on where the company works. */
    areaServed: [
      { "@type": "City", name: "Navi Mumbai" },
      { "@type": "City", name: "Panvel" },
    ],

    telephone,
    email: contact.email,
    /* One sales contact for every project and for the company itself
       (Vipin, on `contact.phone`) — so there is one ContactPoint here,
       not one per project. No `availableLanguage`: nobody has confirmed
       which languages the desk actually handles, and a guess would be a
       fact invented in the one format that is read as authoritative. */
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone,
      email: contact.email,
      areaServed: "IN",
    },

    ...(sameAs.length ? { sameAs } : {}),
  };
}

/* ============================================================
   PER-PROJECT NODES
   ============================================================ */

/* Every project address in src/data/<slug>.ts is written in one format:

     Plot no. 73, Sector R2, Karanjade, Panvel, 410206

   so it is split rather than retyped — same rule as everything above.
   The last field is the pincode, the one before it the locality, and
   everything ahead of those is the street address. If a future address
   is written some other way the pincode test simply fails and the
   property is left off, which is the right failure: a missing field
   beats a wrong one.

   Note what is NOT derived here. `addressRegion` and `addressCountry`
   are taken from the Organization's `address` above rather than parsed
   out of the line, because they are not in the line — and they are the
   same two values the company already asserts site-wide. A project
   node stating a different region from the company node would be a
   contradiction in machine-readable form.

   A STREET ADDRESS IS CORRECT HERE, and its absence on the
   Organization node still is too. The plot is a real, surveyable
   location that the project page prints in full. The company has no
   walk-in office to publish. Those are two different facts, not an
   inconsistency to tidy up. */
function postalAddress(line: string) {
  const parts = line
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const postalCode = /^\d{6}$/.test(parts[parts.length - 1] ?? "")
    ? parts.pop()
    : undefined;
  const addressLocality = parts.length > 1 ? parts.pop() : undefined;
  const streetAddress = parts.join(", ");

  return {
    "@type": "PostalAddress",
    ...(streetAddress ? { streetAddress } : {}),
    ...(addressLocality ? { addressLocality } : {}),
    addressRegion: address.addressRegion,
    ...(postalCode ? { postalCode } : {}),
    addressCountry: address.addressCountry,
  };
}

/* A MahaRERA registration, or a placeholder standing in for one.

   Four of the seven projects are not registered: ishaan, prithvi,
   shaurya and udaan all set `maharera` to their file's TBD constant —
   "Insufficient information" or "To be announced" — so that the hero's
   MahaRERA pill stays hidden. Those strings must never reach the
   markup as an identifier.

   The test is the shape of a real registration (letters then digits:
   P52000026245, PM1270002502760) rather than a list of the sentinel
   values, so a new TBD wording somewhere cannot quietly start
   validating. */
const looksLikeRegistration = (v: string | undefined) =>
  typeof v === "string" && /^[A-Z]+\d+$/.test(v.trim());

/** The fields `residenceSchema` reads. Every project's data file
    exports an object with at least these — see src/data/shikhar.ts. */
export type ProjectRecord = {
  name: string;
  tagline: string;
  address: string;
  maharera?: string;
  mapsUrl?: string;
};

/**
 * Build the `Residence` node for one project, or `null` if the project
 * should not have one.
 *
 * `null` is not an error path. Udaan is a purely commercial building —
 * no apartments anywhere in it, by its own page — so typing it
 * `Residence` would be a false claim in exactly the format that gets
 * read as authoritative. It is flagged `commercial` in src/data/site.ts
 * and that flag is what this function refuses on, so the rule lives in
 * code rather than in a comment somebody has to remember.
 *
 * Everything is read from the project's own data file. Nothing about a
 * project is typed into this one: no address, no unit count, no RERA
 * number. The slug is joined from `projects` in src/data/site.ts by
 * name, so a project the site does not list cannot get a node either.
 *
 * NO PRICE, EVER, and no `offers` node to hang one on. Four of the
 * seven are unregistered and cannot be advertised for sale; the visible
 * site is careful about that everywhere and machine-readable markup is
 * the worst possible place to be the exception.
 *
 * @param project  the `export const <slug> = {...}` record from src/data/<slug>.ts
 * @param gallery  that file's `gallery` array — the real photographs, and
 *                 the whole point of the node: it is what attaches the
 *                 rewritten descriptions to something a crawler reads
 *                 structurally. Renders and placeholder art are not
 *                 photographs and are deliberately not passed here.
 * @param origin   `Astro.site`, for the absolute URLs JSON-LD requires —
 *                 a relative `image` or `@id` is silently DISCARDED, not
 *                 resolved against the page.
 */
export function residenceSchema(
  project: ProjectRecord,
  gallery: { src: string }[],
  origin: URL,
) {
  const entry = projects.find((p) => p.name === project.name);
  if (!entry || entry.commercial) return null;

  const abs = (path: string) => new URL(path, origin).href;
  /* Trailing slash, matching what <link rel="canonical"> emits for the
     same page. Two spellings of one URL is two entities to a crawler. */
  const url = abs(`/projects/${entry.slug}/`);
  const images = gallery.map((g) => abs(g.src));

  return {
    "@context": "https://schema.org",
    "@type": "Residence",
    /* Fragment id on the page URL, the same shape as the company's
       `/#organization`. The bare page URL identifies the WebPage. */
    "@id": `${url}#residence`,
    name: project.name,
    description: project.tagline,
    url,

    address: postalAddress(project.address),
    ...(project.mapsUrl ? { hasMap: project.mapsUrl } : {}),
    ...(images.length ? { image: images } : {}),

    /* The registration, where there is one, as an identifier rather
       than loose prose — and simply absent on the four projects that
       have none. An unregistered project with an empty identifier
       field would read as a registration we failed to supply. */
    ...(looksLikeRegistration(project.maharera)
      ? {
          identifier: {
            "@type": "PropertyValue",
            propertyID: "MahaRERA",
            value: project.maharera,
          },
        }
      : {}),

    /* The link back to the company, by reference. That @id is emitted
       on every page of the site by the Organization node above, so a
       crawler folds the two together — and none of the company's
       details are restated inside the project node, which is the
       point of using an @id at all.

       `provider` is outside schema.org's declared domain for a Place,
       so a validator will note it. That is accepted deliberately: it
       is the clearest available expression of "this company develops
       and sells this building", and the alternative — restating the
       company inside each project node, or reaching for a listing type
       that implies an offer and a price — would be worse on both
       counts. A validator note is cheaper than a false claim. */
    provider: { "@id": abs("/#organization") },
  };
}

/**
 * Serialise for `<script type="application/ld+json" set:html={...}>`.
 *
 * The `<` escape is what keeps a future string containing "</script>"
 * from ending the tag early and dumping the rest of the JSON into the
 * document as markup. Cheap, and the failure it prevents is silent.
 */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
