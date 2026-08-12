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

import { brand, contact } from "../data/site";

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
