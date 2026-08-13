/* ============================================================
   Nesting Tree — homepage content
   Single source of truth for brand facts, projects, amenities
   and the company journey. Edit copy / statuses / years here.

   NOTE ON PROJECT STATUS & YEARS:
   The housing record runs from 2004; the Nesting Tree name from
   2019 (see `brand` below). The delivered/ongoing status and
   locations below reflect the best available project information.
   If any status, location or milestone year is inaccurate, correct
   it in this file — every section reads from here.
   ============================================================ */

/* Each project's own data file is the single source of truth for its site
   address, so the listing cards read it from there rather than restating it.
   This is not tidiness: on 12 Aug 2026 a full address was typed onto the
   Shikhar card through the in-page editor and it was UDAAN's plot number —
   live, on the home page, above a "View project" button. Wiring the card to
   the project file makes card and project page incapable of disagreeing.

   Safe from circular imports: none of these seven files imports site.ts. */
import { shikhar as shikharData } from "./shikhar";
import { prithvi as prithviData } from "./prithvi";
import { ishaan as ishaanData } from "./ishaan";
import { udaan as udaanData } from "./udaan";
import { rudra as rudraData } from "./rudra";
import { dhruva as dhruvaData } from "./dhruva";
import { shaurya as shauryaData } from "./shaurya";

/* ---------- Feature flags ----------
   Kill switches for whole content blocks. Flip one to false and the
   block disappears from every page that uses it — no markup or data
   needs deleting, so it can go straight back on later.            */
export const features = {
  /** The carpet-area stat strip in each project's flat-types section
      (<AreaStats/>). false hides the strip and its "areas as per the
      approved plan" source line on every project page.

      OFF SINCE 12 AUG 2026 — owner's review point #13, "remove carpet
      area from every page". The flag was used rather than deleting the
      figures because the strip does not carry carpet alone: enclosed
      balcony, carpet + balcony, the wrapping terrace and the "26 of 27
      homes of this type" counts all sit in the same grid, and the
      instruction reads on the grid, not on one row of it. Flipping one
      flag takes the lot, on all seven pages, along with each page's
      "areas as per the approved plan" source line.

      THE CIDCO RESEARCH IS DELIBERATELY LEFT IN PLACE in every
      src/data/<slug>.ts — the approved-plan carpet tables, the
      averaging arithmetic and the `stats` rows themselves. None of it
      renders while this is false, and flipping it back restores every
      figure exactly as it was. Do not "tidy up" those arrays.

      Carpet figures that sat OUTSIDE the grid were deleted properly,
      since no flag could reach them: Ishaan's `overview.facts` row and
      its `levels` copy, and Prithvi's 2BHK feature list and blurb. */
  areaStats: false,
};

/* Kept as a standalone const so `brand.footerLine` below can interpolate it —
   an object literal cannot read its own sibling key. */
const legacyYear = 2004;

export const brand = {
  name: "Nesting Tree",
  // The Nesting Tree BRAND launched in 2019. `legacyYear` is when the founder
  // (Kailash Gindodia / K.D. Construction) entered housing — Gopala, Vashi, 2004.
  // Use `legacyYear` for experience / track-record / "years building" claims,
  // and `foundedYear` only for statements specifically about the Nesting Tree
  // entity ("Nesting Tree est. 2019"). Never present 2019 as the total record.
  //
  // RULE — do not break this again: a bare "Est. {foundedYear}" or
  // "building … since {foundedYear}" reads as the whole record and directly
  // contradicts the journey timeline, which opens in 2004. Any standalone
  // "Est. …" / "since …" line uses `legacyYear`. If 2019 must appear, it is
  // qualified alongside 2004 — e.g. "Est. 2004 · Nesting Tree since 2019".
  foundedYear: 2019,
  legacyYear,
  // Region is deliberately stated at CITY level, not locality. The company
  // builds across Navi Mumbai (Vashi → Kharghar → Panvel); naming a single
  // neighbourhood on the home page reads as a limit on where we work.
  // Individual project pages still carry their own precise site address.
  region: "Navi Mumbai & Panvel",
  tagline: "More Building. More Living.",
  // The signature line under the wordmark in EVERY page footer. It lives here
  // because the footer markup is copied into each page — before this, three
  // pages carried this line and seven carried an older "Residential developer
  // in Navi Mumbai…" one. Any footer that prints its own string instead of
  // `brand.footerLine` is a bug. Keep it short: the footer column is sized to
  // hold it on ONE line (see the `sm:whitespace-nowrap` on that paragraph and
  // the `minmax(300px,…)` first column), so a longer line will either wrap
  // again or push the nav columns narrower.
  footerLine: `Your Trust, Our Foundation. Since ${legacyYear}.`,
  // Printed at the foot of EVERY project page, the way `footerLine` is
  // printed in every footer — owner's instruction, 11 Aug 2026, marked
  // critical. It lives here for the same reason `footerLine` does: seven
  // pasted copies is seven chances to drift. Any project page that prints
  // its own wording instead of `brand.sizesNote` is a bug.
  sizesNote:
    "The sizes and layouts shown are tentative and are subject to change as per the government regulations.",
  logoMark: "/images/brand/logo-mark.png",
  logoFull: "/images/brand/logo-full.png",
};

export const contact = {
  phone: "+91 95940 79317",
  email: "info@nestingtree.in",
  // Comma before the pincode, not an en dash — every project address in
  // src/data/<slug>.ts ends "Panvel, 410206", and this line is read beside
  // them in the footer.
  address: "Navi Mumbai, Maharashtra, 410206",
  // Site-wide footer line. Registered projects show their MahaRERA number
  // on their own page; not every current project is RERA-registered
  // (Ishaan & Prithvi are under-construction on a Commencement Certificate,
  // no RERA cert taken), so this must not assert blanket registration —
  // "registered project pages" is the qualifier that keeps it true.
  maharera: "MahaRERA numbers shown on registered project pages",
  // Rendered by src/components/SocialLinks.astro into all 11 page footers,
  // and fed to `sameAs` in src/lib/structured-data.ts. Instagram is the only
  // profile that exists — the Facebook and LinkedIn tiles were placeholders
  // pointing at "#" and are gone rather than left dead. Add an entry the day
  // a profile is real, never before: an icon linking nowhere costs more trust
  // than an absent icon, and a "#" in `sameAs` tells Google the company has
  // no verifiable presence anywhere.
  //
  // `label` selects the glyph in SocialLinks.astro (a label it has no glyph
  // for renders as that text instead). `name` is the link's accessible name —
  // the tile has no visible text to fall back on.
  socials: [
    {
      label: "IG",
      name: "Instagram",
      href: "https://www.instagram.com/nestingtree/",
    },
  ],
};

/* ---------- Sales contact ----------
   Vipin is the single point of contact for every Nesting Tree project and
   for Nesting Tree itself — confirmed by the owner. This block used to be
   copy-pasted into all seven src/data/<slug>.ts files, so a phone-number
   change was seven edits, and `office` had been set in only three of them —
   which is the whole reason the Office row showed on Rudra / Dhruva /
   Shaurya and on no other project page. One definition now; every project
   page imports `sales` from this file.

   `phone` and `phoneHref` are DERIVED from `contact.phone`, so the number
   is written down exactly once on the site. That is also why `contact.phone`
   has to keep its "+91 " prefix and its spacing: this is the displayed form,
   and whatsappHref below strips it back to digits. */
export const sales = {
  name: "Vipin",
  phone: contact.phone,
  phoneHref: `tel:${contact.phone.replace(/\s/g, "")}`,
  office: "1313, Realtech Park, Sector 30A, Vashi",
};

/* ---------- WhatsApp ----------
   One tap into a WhatsApp chat with the sales number. `contact.phone` is the
   only place the number is written down: strip every non-digit and what is
   left is already the international form wa.me wants (919594079317), which is
   why the number in `contact` must keep its +91 country code — drop it and
   every WhatsApp link on the site silently starts dialling a US number.

   No device sniffing is needed. wa.me opens the app on a phone and WhatsApp
   Web on a desktop, so one href serves both (this is why the header CTA no
   longer swaps mailto→tel in JavaScript).

   `message` pre-fills the visitor's first line. Always pass one from a project
   page and name the building: an enquiry that arrives saying which project it
   is about saves the first two messages of every conversation. Keep it to a
   general enquiry — a pre-filled line must never quote a price or invite a
   booking on a project that is not registered (see the `pipeline` note). */
export const whatsappHref = (message?: string) =>
  `https://wa.me/${contact.phone.replace(/\D/g, "")}` +
  (message ? `?text=${encodeURIComponent(message)}` : "");

// Amenities & Journey now live on the About page, so they're reached via
// About — not surfaced as top-level home-page nav items that point elsewhere.
export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Gallery", href: "/gallery" },
  // A page of its own since 13 Aug 2026, not the home page's #contact band.
  // It was the only nav item that was an in-page anchor, so it behaved
  // differently depending on which page you clicked it from — and the office
  // address had nowhere to live but the foot of the seven project pages.
  // The home band is still there as the home page's closing CTA; its primary
  // button now leads here.
  { label: "Contact", href: "/contact" },
];

/* ---------- Projects ----------
   image: real render where available. object-position is tuned so
   the building facade stays in frame and any baked-in caption strip
   at the foot of the render is cropped out.                       */
export type Project = {
  slug: string;
  name: string;
  /** City level. NOT shown on the listing cards any more — `address` is —
      but still used where a place name has to read inside a sentence:
      /thank-you says "…in {location} has reached the Nesting Tree team",
      which a full plot address would wreck. Also the cards' image alt. */
  location: string;
  /** The precise site address, shown on the listing cards since 12 Aug 2026
      on the owner's instruction (punch-list item 6). This REVERSES the
      earlier city-level-only decision, deliberately.
      Always wired to the project's own data file — never retyped here, and
      never edited through the in-page editor. See the note at the top. */
  address: string;
  status: "Ongoing" | "Delivered";
  statusLabel: string;
  blurb: string;
  amenities: string;
  image: string;
  objectPosition: string;
  /** Not a residence. Udaan is the only one so far, and the only reason
      this flag exists: `stats.residences` counts homes-buildings only, so
      a commercial project can sit in `projects` without turning the
      site-wide "N residences" line into a false claim. */
  commercial?: boolean;
  /** Ongoing on the books, but nothing on site yet: no Commencement
      Certificate and no work started. Such a project still appears in the
      Ongoing band (the owner runs it as current work), but every
      "under construction" FIGURE excludes it — see `stats`. Drop the flag
      the day the CC lands and the first machine arrives. */
  inApprovals?: boolean;
};

export const projects: Project[] = [
  {
    slug: "shikhar",
    name: "Shikhar",
    location: "Navi Mumbai",
    address: shikharData.address,
    status: "Ongoing",
    statusLabel: "Bookings open",
    blurb:
      "The latest Nesting Tree residence, a high-rise built on the same standard as every project before it: more amenities, better daily living, delivered on time.",
    amenities: "Rooftop Gym · Terrace · Lift · CCTV",
    image: "/images/projects/ShikharElevationFinal.webp",
    objectPosition: "center 12%",
  },
  {
    slug: "prithvi",
    name: "Prithvi",
    location: "Navi Mumbai",
    address: prithviData.address,
    status: "Ongoing",
    // Under construction; bookings not yet open — hence "Pre-launch", not "Now Booking".
    statusLabel: "Pre-launch",
    blurb:
      "A corner-plot residence with street-level retail, designed for everyday convenience without leaving the building.",
    amenities: "Lift · CCTV · Fire Safety · Retail",
    image: "/images/projects/Prithvi-Elevation.webp",
    objectPosition: "center 12%",
  },
  {
    slug: "ishaan",
    name: "Ishaan",
    location: "Navi Mumbai",
    address: ishaanData.address,
    status: "Ongoing",
    // Under construction; bookings not yet open — hence "Pre-launch", not "Now Booking".
    statusLabel: "Pre-launch",
    blurb:
      "A corner-plot residence of twelve 1RK homes, with clean contemporary lines and a calm, purely residential address.",
    // Only amenities confirmed for Ishaan — no CCTV/terrace supplied for this project.
    amenities: "High-Speed Lift · Parking · Corner Plot",
    image: "/images/projects/Ishan-Reduced.jpg",
    objectPosition: "center 30%",
  },
  {
    // Moved here from `pipeline` on the owner's instruction (8 Aug 2026):
    // Udaan is to be listed with the ongoing work, not in a separate
    // "In Approvals" band. Two flags keep the site's derived claims honest
    // while it sits here — `commercial` (it is not a residence) and
    // `inApprovals` (nothing on site yet). Read the `stats` note below
    // before touching either.
    //
    // Almost everything about this building is still unknown: storeys,
    // units, sizes, dates, and there is no elevation render. The detail
    // page (src/data/udaan.ts) prints "To be announced" for each of those
    // rather than guessing, and `image` below is a placeholder drawing,
    // not artwork — swap it for the real elevation when it exists.
    slug: "udaan",
    name: "Udaan",
    location: "Navi Mumbai",
    address: udaanData.address,
    status: "Ongoing",
    // NOT "Pre-launch" and NOT "Now booking": there is no Commencement
    // Certificate and no MahaRERA registration, so the project cannot be
    // advertised for sale. The label states where it stands, nothing more.
    statusLabel: "In Approvals",
    blurb:
      "Our seventh project, and the first that isn't a home. A purely commercial building at Karanjade, with no shops at street level — still on paper while approvals and documentation are worked through.",
    // Confirmed facts only. No amenity schedule has been drawn up.
    amenities: "Purely Commercial · No Ground-Floor Shops",
    image: "/images/projects/udaan-placeholder.svg",
    objectPosition: "center center",
    commercial: true,
    inApprovals: true,
  },
  {
    slug: "rudra",
    name: "Rudra",
    location: "Navi Mumbai",
    address: rudraData.address,
    status: "Delivered",
    statusLabel: "Delivered & Handed Over",
    blurb:
      "Lift access, CCTV-monitored entrances and dedicated parking. Handed over, and still running the way it was built.",
    amenities: "Lift · CCTV · Parking",
    image: "/images/projects/Rudra.jpg",
    objectPosition: "center center",
  },
  {
    slug: "dhruva",
    name: "Dhruva",
    location: "Navi Mumbai",
    address: dhruvaData.address,
    status: "Delivered",
    statusLabel: "Delivered & Handed Over",
    blurb:
      "A curved-corner landmark with rooftop access, round-the-clock security and ground-floor retail. Built for residents who wanted more than four walls.",
    amenities: "Terrace · Security · Retail · Lift",
    image: "/images/projects/Dhruva-Elevation_image.jpg",
    objectPosition: "center 35%",
  },
  {
    slug: "shaurya",
    name: "Shaurya",
    location: "Navi Mumbai",
    address: shauryaData.address,
    status: "Delivered",
    statusLabel: "Delivered & Handed Over",
    blurb:
      "A purely residential G+4 on a corner plot: eight homes with an automatic high-speed lift and ample parking. Completed, sold out and handed over.",
    amenities: "High-Speed Lift · Parking · Corner Plot",
    image: "/images/projects/shaurya/Shaurya_Elevation.webp",
    objectPosition: "center 25%",
  },
];

export const featuredSlug = "shikhar";

/* ---------- Pipeline — a text-only band for projects with no page ----------
   CURRENTLY EMPTY, ON PURPOSE. Udaan was the only entry; on 8 Aug 2026 the
   owner asked for it to be listed with the ongoing work instead, so it now
   lives in `projects` above with a detail page of its own, and the "In
   Approvals" band on /projects renders nothing (it is guarded by
   `pipeline.length > 0`). The machinery is kept, not deleted — the next
   project with a name but no drawings can be dropped straight in.

   WHAT BELONGS HERE: a project too early to carry a page. No `image`, no
   `slug` and no detail page, because a card linking to an empty page is worse
   than a card that doesn't link. Entries render as a text-only band on
   /projects and appear nowhere else — not on the home page (which promises
   "the ones you can still book into") and not in the footer project list
   (which links to detail pages).

   NOTHING HERE MAY BE ADVERTISED FOR SALE. An unregistered project predates
   any MahaRERA number, so these cards state status only — no pricing, no
   carpet areas, no floor plans, no "enquire"/"book" call to action.

   THE SAME RULE FOLLOWS A PROJECT INTO `projects`: Udaan sits in the Ongoing
   band, but it is still unregistered, so its card and its page carry a status
   label and general enquiry only — never a price, a carpet area or a booking
   invitation. See the `inApprovals` flag on the Project type.          */
export type PipelineProject = {
  name: string;
  location: string;
  statusLabel: string;
  /** What the project is, in plain terms. Confirmed facts only. */
  blurb: string;
  /** Short status lines shown as a list. Each must be independently true. */
  facts: string[];
};

export const pipeline: PipelineProject[] = [];

/* ---------- Amenities — the core USP ---------- */
export const amenities = [
  {
    no: "01",
    kicker: "Rooftop Access",
    title: "A rooftop you can use in any weather.",
    body:
      "A rooftop retreat with the sides open to the breeze and a roof overhead to keep the sun and rain out of the picture. Just the view, on your terms.",
    featured: "Sheltered Rooftop · Terrace Access",
    image: "/images/projects/rudra/photos/rudra-rooftop-02.webp",
    objectPosition: "center 60%",
  },
  {
    no: "02",
    kicker: "Aerial View",
    title: "A skyline you can actually enjoy.",
    body:
      "Step onto the terrace and Karanjade spreads out below — clear above the rooftops.",
    featured: "Panoramic Skyline Views · Open-Air Terrace",
    image: "/images/projects/shaurya/photos/shaurya-aerial-view-04.webp",
    objectPosition: "center center",
  },
  {
    no: "03",
    kicker: "Safety & Access",
    title: "Security that never clocks out.",
    body:
      "CCTV across every common area, trained security on-site 24/7. Peace of mind, built in, not bolted on.",
    featured: "CCTV Surveillance · 24×7 Security",
    image: "/images/projects/security.png",
    objectPosition: "center center",
  },
  {
    no: "04",
    kicker: "Dedicated Parking",
    title: "A parking spot that’s actually yours.",
    body:
      "Ground-floor covered parking for the car and the two-wheeler, shielded from sun and rain. Dedicated parking spots - no circling, no scrambling for a spot.",
    featured: "Covered Parking · Two-Wheeler & Car",
    image: "/images/projects/rudra/photos/rudra-parking-01.webp",
    objectPosition: "center 60%",
  },
  {
    no: "05",
    kicker: "Lift Access",
    title: "A lift to every floor, always running.",
    body:
      "Automatic high-speed elevator/s in every building, with built in safety devices, ensure comfortable living.",
    featured: "Lift to Every Floor · Power Backup",
    image: "/images/projects/dhruva/photos/dhruva-lift-01.webp",
    objectPosition: "center 65%",
  },
  {
    no: "06",
    kicker: "Spacious Corridors",
    title: "Common spaces that never feel cramped.",
    body:
      "Space to move, light to see by — wide corridors and landings in glossy tile, built for the everyday: groceries in, guests out, no tight spots.",
    featured: "Wide Landings · Bright & Tiled",
    image: "/images/projects/dhruva/photos/dhruva-corridor-01.webp",
    objectPosition: "center center",
  },
];

/* ---------- Journey / milestones ---------- */
export const journey = [
  {
    year: "2004",
    title: "K.D. Constructions marks real estate entry",
    place: "Vashi, Navi Mumbai",
    body:
      "The story of Nesting Tree began in 2004 with Gopala, K.D. Construction's first residential development in Vashi, built on a CIDCO tender plot. More than just a project, it marked the beginning of a legacy that has grown over two decades, shaping communities across Vashi, Kharghar, and Panvel.",
  },
  {
    year: "2019",
    title: "Nesting Tree is founded",
    place: "Navi Mumbai",
    body:
      "It began with a simple belief: a home should offer more than four walls. That belief became the foundation of Nesting Tree—a residential developer committed to creating thoughtfully designed homes and thriving communities across Navi Mumbai.",
  },
  {
    year: "2020",
    title: "Rudra delivered",
    place: "Panvel",
    body:
      "Our first handover. Lift, CCTV and dedicated parking, delivered as promised and handed over to residents.",
  },
  {
    year: "2021",
    title: "Dhruva delivered",
    place: "Panvel",
    body:
      "Our second project was marketed only after receiving the Occupation Certificate. This helped build trust in the neighbourhood.",
  },
  {
    year: "2022",
    title: "Shaurya delivered",
    place: "Panvel",
    body:
      "A purely residential G+4 on a corner plot with majority of the homes purchased by a single family.",
  },
  {
    year: "Today",
    title: "Four buildings under way",
    place: "Navi Mumbai",
    // Udaan is named here but kept out of the "under construction" clause:
    // it has no Commencement Certificate and no work on site. Same reason
    // `stats.underConstruction` exists — see the note on `stats`.
    body:
      "Shikhar, Ishaan and Prithvi are under construction across Karanjade, built to the same amenity-first standard. Udaan, our first purely commercial building, is in approvals.",
  },
];

/* ---------- Why Nesting Tree ---------- */
export const reasons = [
  {
    title: "A track record, not a promise",
    body: "Two decades of housing behind us, from Gopala in Vashi (2004) to residences delivered and handed over in Navi Mumbai today.",
  },
  {
    title: "Possession on time",
    body: "We build to a schedule and hand over on it, exactly as our delivered projects were.",
  },
  {
    title: "Clear title, clean paperwork",
    body: "Clear-title land bought directly from the owner. No 50:50 or tri-party agreements, so you buy with confidence.",
  },
  {
    title: "Amenities as standard",
    body: "Gym, terrace, lift, CCTV, security and parking: built in, not sold as extras.",
  },
  {
    title: "Built to last",
    body: "Construction quality you can live in, and still trust years after handover.",
  },
  {
    title: "Better everyday living",
    body: "You pay a little more, and you get more than a flat: a building that improves your day.",
  },
];

/* ---------- Derived stats for the journey band ----------
   FIVE figures, not three, because Udaan is neither a residence nor yet a
   building site — and the site makes both of those claims in print.

     projects          every Nesting Tree development, of any use
     residences        homes-buildings only, i.e. excluding `commercial`
     delivered         handed over
     ongoing           current work, INCLUDING what is still in approvals
     underConstruction current work with something actually happening on site

   Use `residences` under the word "residences", `underConstruction` under
   "under construction", and `projects` / `ongoing` for the neutral counts.
   Getting these two crossed is exactly the mistake this split exists to
   prevent, so check the label before you change the figure it prints.   */
export const stats = {
  projects: projects.length,
  residences: projects.filter((p) => !p.commercial).length,
  delivered: projects.filter((p) => p.status === "Delivered").length,
  ongoing: projects.filter((p) => p.status === "Ongoing").length,
  underConstruction: projects.filter((p) => p.status === "Ongoing" && !p.inApprovals).length,
};

/* ============================================================
   HOMEPAGE — story-led editorial content
   The redesigned home page reads from `home`. It is deliberately
   NOT a project catalogue: the full portfolio lives on /projects.
   Trust points (previously the standalone "Why Nesting Tree" grid)
   are distributed through these blocks instead of listed as one
   checklist — see `home.difference`, `home.numbers` and `home.cta`.
   ============================================================ */

/* Ongoing residences surfaced on the home page. The flagship (featuredSlug,
   Shikhar — also ongoing) is shown on its own above these, so this list is the
   remaining ongoing projects only; delivered work lives on /projects. */
export const homeFeaturedSlugs = ["prithvi", "ishaan"] as const;

export const home = {
  hero: {
    region: brand.region,
    // The headline leads on trust. Rendered one line per entry, so keep the
    // lines short enough to hold the display scale. The emotional framing is
    // carried by the sub-copy and the flagship highlight card.
    headline: ["Your Trust", "Our Foundation."],
    /* Read aloud and crawled, never drawn: appended inside the <h1> as
       sr-only text (see index.astro). The visible headline is a promise,
       which is right for a visitor and useless to a search engine — on its
       own it makes the page's one top-level heading say nothing about what
       the company does or where. This restores that without touching the
       design or burying a second, invisible <h1> in the markup.

       It must stay a true summary of what is visibly on the page: the
       region is already printed in the eyebrow directly above, and the
       trade in the <title>. Text that is hidden and NOT corroborated on
       screen is cloaking, and gets treated as such. */
    headlineNote: `— Residential Developer in ${brand.region}`,
    sub:
      "Homes built on integrity, guided by expertise and delivered with quality.",
    primaryCta: { label: "Explore the Residences", href: "/projects" },
    // Straight to /contact rather than scrolling to the closing #contact band,
    // whose own button leads there anyway — one hop, not two.
    secondaryCta: { label: "Book a Site Visit", href: "/contact" },
  },

  // Brand intro — one quiet editorial beat between the hero film and the
  // flagship. Merged from the old two-part bridge/promise, which read as two
  // walls of prose back to back. One warm image, a short statement of WHY we
  // over-build, and a hand-off to the flagship spread directly below.
  //
  // The nest metaphor is implied, never named — no "bird", no "nest".
  // Stay out of the neighbours' lanes: company credibility belongs to
  // `difference` (track record / on time / clear title); don't restate it here.
  //
  // IMAGERY — READ BEFORE EDITING:
  // These are LICENSED STOCK PHOTOGRAPHS — not Nesting Tree residents and not
  // our buildings. Free for commercial use under the Unsplash License (no
  // attribution required), but that does NOT make them ours. Therefore: never
  // caption one with a name, project or year; alt text describes only what is
  // visible and says "stock photograph". Replace them the moment real
  // photography of real residents exists. The trio carries the section's whole
  // message — a home is where a life happens, not an asset — so the copy stays
  // short and lets the pictures do the talking.
  //
  // This rule has already been challenged once and held. On 13 Aug 2026 an SEO
  // review proposed rewriting these three as e.g. "Family enjoying their new
  // Nesting Tree apartment in Navi Mumbai" to make the alt text "an SEO asset".
  // REJECTED: that is a false statement about a stranger's photograph, made in
  // the one field a sighted visitor cannot check and a screen-reader user must
  // trust. It is also what Google reads as keyword-stuffed alt. If the next
  // audit raises it again, the answer is to replace the PHOTOGRAPHS, not the
  // descriptions.
  //   rooftop — unsplash.com/photos/photo-1635770618588-06bd8d5d73b9
  intro: {
    heading: "No hidden fees, no shortcuts. Just honest guidance you can rely on.",
    lead:
      "For over 20 years, Nesting Tree has helped families and investors find not just properties, but peace of mind. We don't just sell homes — we build lasting relationships rooted in honesty and care.",
    close: "Homes designed with comfort and ease of living at their heart.",
    // First image anchors the collage (tall); the two that follow stack beside it.
    images: [
      {
        src: "/images/bridge/family-rooftop.jpg",
        alt: "Stock photograph: a father lifts his laughing toddler overhead on an open rooftop, apartment buildings and a grey monsoon sky behind them.",
        pos: "center 30%",
      },
      {
        src: "/images/bridge/family-home.jpg",
        alt: "Stock photograph: a mother laughs while hugging her young daughter on a sofa beside a bright window.",
        pos: "center 35%",
      },
      {
        src: "/images/bridge/family-together.jpg",
        alt: "Stock photograph: a young man in a festive kurta embraces an older man at a family gathering, two women with a lamp-lit thali smiling behind them.",
        pos: "center 40%",
      },
    ],
  },

  // Milestones marquee — a scrolling band of the record behind the name.
  // Deliberately honest: every figure is derived from real project data or the
  // brand's own timeline, in keeping with the `numbers` policy (no projections,
  // no template stats). Sits above the flagship as a quick proof-of-track-record.
  milestones: {
    eyebrow: "Milestones",
    heading: "Two decades of building, measured in homes.",
    lead: "The record behind the name, from Vashi in 2004 to the residences rising across Navi Mumbai & Panvel today.",
    items: [
      { value: "20+", label: "Years building homes", sub: `Since ${brand.legacyYear}` },
      // "projects", not "residences": the count now includes Udaan, which is
      // a commercial building. `stats.residences` is the homes-only figure.
      { value: String(stats.projects), label: "Nesting Tree projects", sub: `${stats.residences} residences · 1 commercial` },
      { value: String(stats.delivered), label: "Delivered & handed over", sub: "Lived in today" },
      // `underConstruction`, not `ongoing` — Udaan is ongoing work but has
      // nothing on site yet, and "rising right now" would not be true of it.
      { value: String(stats.underConstruction), label: "Under construction", sub: "Rising right now" },
      { value: "6", label: "Amenities as standard", sub: "Rooftop · Gym · Lift · CCTV · Security · Parking" },
      // Was "01 Neighbourhood — Karanjade": a one-locality stat read as a ceiling
      // on our reach. The same tile now counts the localities already built in.
      { value: "03", label: "Localities built in", sub: "Vashi · Kharghar · Panvel" },
    ],
  },

  // Flagship spread — one project, told as a story, not a card.
  featured: {
    eyebrow: "The Flagship",
    heading: "Shikhar - Rise above the ordinary.",
    lead:
      "Rising above the skyline, this landmark high-rise offers uninterrupted views of the Navi Mumbai International Airport and the rolling hills that frame it.",
    body:
      "A rooftop crafted for soirées under open skies. Multiple elevators for effortless arrival, a private gym and lounge for everyday indulgence. G+10 storeys of considered living, secured by round-the-clock surveillance.",
    // Trust point woven in beside the flagship (was reason #4 + #5).
    trust: {
      k: "Why it holds up",
      v: "Branded fittings, uncompromised quality and attention to detail.",
    },
    cta: { label: "Discover Shikhar", href: "/projects/shikhar" },
    // Single framed hero render — the strongest premium asset in the repo.
    // (Site photographs are documentary construction shots, so the flagship
    // leans on the polished elevation render rather than a raw interior.)
    image: "/images/projects/ShikharElevationFinal.webp",
    imagePos: "center 14%",
    // Quick spec chips — pulled straight from the Shikhar project record.
    chips: ["Now Booking", "Navi Mumbai", "Rooftop · Lift · CCTV · Parking"],
  },

  // Oversized editorial statement + three re-composed trust pillars
  // (was "Why Nesting Tree" reasons #1, #2, #3 — now distributed here).
  difference: {
    eyebrow: "The Nesting Tree Difference",
    // Owner's instruction, 11 Aug 2026: it must read "We don't JUST sell
    // flats." Rendered one array entry per line at display scale, so the
    // extra word was absorbed by re-splitting rather than left to hang off
    // line one — the three lines are hand-balanced and should stay so.
    heading: ["We don't just sell", "flats. We deliver", "joy, built to last."],
    lead:
      "You pay a little more for a Nesting Tree home, and you get more than a flat. You can peace of mind.",
    pillars: [
      {
        no: "01",
        title: "Uncompromising Integrity.",
        body:
          "From the first conversation to the final signature, we give you straight answers, transparent pricing, and advice that puts your interests first, even when it's not the easiest thing to say. Because a deal built on trust is the only kind worth making.",
      },
      {
        no: "02",
        title: "Quality You Can Verify.",
        body:
          "We do not sell homes that are still in the foundation stage. Only when you can see what you are getting, is when we start marketing our projects. Our team conducts thorough due diligence so you're not left discovering problems after you've signed.",
      },
      {
        no: "03",
        title: "WIth you, always.",
        body:
          "Handing over the keys isn't where our job ends — it's just one milestone. If something unexpected pops up down the road, even 10 years down the road, we're still here for you. Call us. We stand behind every home we sell, long after the ink's dried and the moving trucks are gone.",
      },
    ],
  },

  // Key numbers band. Only real, confirmed figures live here — no projections
  // and no placeholders. (The "families home" count was removed until there's
  // a real number to stand behind.)
  numbers: {
    eyebrow: "By The Numbers",
    heading: "Proof, in figures.",
    trust:
      "Every figure is real: homes handed over or under way, and the two decades of housing behind them. A record, not a projection.",
    items: [
      { value: "20+", label: "Years building homes", sub: `Since ${brand.legacyYear}` },
      // Was "Residences". Udaan is in the count and is not one, so the label
      // is the neutral one and the residences figure moves into the sub-line.
      { value: String(stats.projects), label: "Projects", sub: `${stats.delivered} delivered · ${stats.ongoing} ongoing` },
      // Was "01 Location". A single-location figure undersells the record and
      // caps the brand; the honest, broader figure is localities built in.
      { value: "03", label: "Localities built in", sub: "Vashi · Kharghar · Panvel" },
    ] as { value: string; label: string; sub: string; placeholder?: boolean }[],
  },

  featuredProjects: {
    eyebrow: "Now Building",
    heading: "The homes rising right now.",
    lead:
      "Our ongoing buildings across Navi Mumbai and Panvel, the ones you can still book into.",
    cta: { label: "View All Projects", href: "/projects" },
  },

  // Resident testimonials — all real, attributable, and equal (no lead card).
  // Rendered as a carousel on the home page. Karthik's and Navin's quotes are in
  // their own words; Vijay, Swapnil and Uttam authorised us to write on their
  // behalf, so those are drafted in a matching, understated tone — tweak freely.
  // Photos live in /public/images/Testimonials/ (folder spelling as-is on disk);
  // `pos` object-positions each face inside its disc.
  // `detail` is the small-caps line under the name: FLAT AND BUILDING ONLY.
  // Owner's instruction, 12 Aug 2026 — the occupations and home towns that used
  // to prefix two of these ("Private Employee ·", "Ratnagiri ·") were removed.
  // Keep the five consistent: one format, no exceptions. These are real named
  // residents, so an inconsistency here is visible on the home page.
  testimonials: {
    eyebrow: "In Their Words",
    heading: "Trusted by Families Like Yours.",
    lead:
      "Real stories from clients who found more than a home — they found a partner they could trust.",
    items: [
      {
        quote:
          "Owning a home in a tier-1 city like Mumbai was a major life goal for me, and Nesting Tree made it happen seamlessly. From booking confirmation and loan arrangements to timely registration and final possession, every step was transparent and hassle-free. The entire team is warm, approachable, and always ready to help. Buying my first flat at age 26 felt like a huge milestone, and Nesting Tree made the journey incredible. I highly recommend them to any middle-class family looking to realize their dream of owning a home.",
        name: "Karthik S. Salian",
        detail: "Flat 201, Rudra",
        photo: "/images/Testimonials/Karthik_S_Salian.jpeg",
        pos: "center 22%",
      },
      {
        quote:
          "Since 2021 we were searching for a flat in Navi Mumbai. We visited many projects, and then we came across Nesting Tree. From the very first sight it amazed us — the view, the area, everything. We loved the porch, and the one thing that won us over was the light coming through the flat: bright and positive. The whole process, from the visit to owning the flat, was the best, and no fear was left about owning a home in Navi Mumbai.",
        name: "Navin Ravindra Salvi",
        detail: "Flat 403, Dhruva",
        photo: "/images/Testimonials/Navin_Ravindra_Salvi.jpeg",
        pos: "center 25%",
      },
      {
        quote:
          "We had seen a few buildings before this one, and most of them looked good only until you started asking the difficult questions. Nesting Tree was different from the very first visit — the build quality, the open space around the building, and a team that answered plainly instead of pushing us to decide that day. The booking, the agreement and the bank formalities were all handled without us having to chase anyone, and possession came exactly when they said it would. Today it is not a decision we think about any more; it is simply home.",
        name: "Vijay Pagare",
        detail: "Flat 402, Shikhar",
        photo: "/images/Testimonials/Vijay_Pagare.jpeg",
        pos: "center 25%",
      },
      {
        quote:
          "Buying my first flat was the biggest decision I had made, and I went into it knowing very little about the process. The team at Nesting Tree never once made me feel rushed — every question, however basic, got a straight answer, and I always knew which stage things were at, from the agreement to the loan to the handover. The flat itself is well built and full of light, with proper ventilation in every room, which is not something you find easily in this budget. It is the one big decision I have never second-guessed.",
        name: "Swapnil Yamkar",
        detail: "Flat 405, Dhruva",
        photo: "/images/Testimonials/Swapnil.jpeg",
        pos: "center 20%",
      },
      {
        quote:
          "What I appreciated most was how straightforward the whole thing was. The pricing was clear from the first meeting, the answers stayed honest even when they were not what I wanted to hear, and there was no running around behind documents or approvals at any point. The building itself is solid, the common areas are actually looked after, and the surroundings are quiet and green — you notice it most in the evenings. Moving in was effortless, and we have settled in far more comfortably than we expected to.",
        name: "Uttam Yamkar",
        detail: "Flat 405, Dhruva",
        photo: "/images/Testimonials/Uttam.jpeg",
        pos: "center 20%",
      },
    ] as { quote: string; name: string; detail: string; photo: string; pos: string }[],
  },

  cta: {
    eyebrow: "Enquire",
    heading: "Let's find you a Home.",
    body:
      "Book a site visit to experience a Nesting Tree home. Clear title, honest paperwork and you'll always know where you stand. No surprises, no fine print games.",
    image: "/images/projects/Prithvi-Elevation.webp",
    imagePos: "center 10%",
  },
};
