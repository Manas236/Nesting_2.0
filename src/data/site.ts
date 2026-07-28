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
  legacyYear: 2004,
  // Region is deliberately stated at CITY level, not locality. The company
  // builds across Navi Mumbai (Vashi → Kharghar → Panvel); naming a single
  // neighbourhood on the home page reads as a limit on where we work.
  // Individual project pages still carry their own precise site address.
  region: "Navi Mumbai, Maharashtra",
  tagline: "More Building. More Living.",
  logoMark: "/images/brand/logo-mark.png",
  logoFull: "/images/brand/logo-full.png",
};

export const contact = {
  phone: "+91 95940 79317",
  email: "info@nestingtree.in",
  address: "Navi Mumbai, Maharashtra – 410206",
  // Site-wide footer line. Registered projects show their MahaRERA number
  // on their own page; not every current project is RERA-registered
  // (Ishaan & Prithvi are under-construction on a Commencement Certificate,
  // no RERA cert taken), so this must not assert blanket registration.
  maharera: "MahaRERA details published on our project pages",
  socials: [
    { label: "IG", href: "#" },
    { label: "FB", href: "#" },
    { label: "IN", href: "#" },
  ],
};

// Amenities & Journey now live on the About page, so they're reached via
// About — not surfaced as top-level home-page nav items that point elsewhere.
export const nav = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "#contact" },
];

/* ---------- Projects ----------
   image: real render where available. object-position is tuned so
   the building facade stays in frame and any baked-in caption strip
   at the foot of the render is cropped out.                       */
export type Project = {
  slug: string;
  name: string;
  // City-level only. Card captions on the home page and /projects say
  // "Navi Mumbai"; the exact plot/sector address belongs to the project's
  // own page (see src/data/<slug>.ts `address`), not to a listing card.
  location: string;
  status: "Ongoing" | "Delivered";
  statusLabel: string;
  blurb: string;
  amenities: string;
  image: string;
  objectPosition: string;
};

export const projects: Project[] = [
  {
    slug: "shikhar",
    name: "Shikhar",
    location: "Navi Mumbai",
    status: "Ongoing",
    statusLabel: "Now Booking",
    blurb:
      "The latest Nesting Tree residence — a high-rise built on the same standard as every project before it: more amenities, better daily living, delivered on time.",
    amenities: "Rooftop Gym · Terrace · Lift · CCTV",
    image: "/images/projects/ShikharElevationFinal.jpeg",
    objectPosition: "center 12%",
  },
  {
    slug: "prithvi",
    name: "Prithvi",
    location: "Navi Mumbai",
    status: "Ongoing",
    // Under construction; bookings not yet open — hence "Pre-launch", not "Now Booking".
    statusLabel: "Pre-launch",
    blurb:
      "A corner-plot residence with street-level retail — designed for everyday convenience without leaving the building.",
    amenities: "Lift · CCTV · Fire Safety · Retail",
    image: "/images/projects/Prithvi-Elevation.jpg",
    objectPosition: "center 12%",
  },
  {
    slug: "ishaan",
    name: "Ishaan",
    location: "Navi Mumbai",
    status: "Ongoing",
    // Under construction; bookings not yet open — hence "Pre-launch", not "Now Booking".
    statusLabel: "Pre-launch",
    blurb:
      "A corner-plot residence of twelve 1RK homes — clean contemporary lines and a calm, purely residential address.",
    // Only amenities confirmed for Ishaan — no CCTV/terrace supplied for this project.
    amenities: "High-Speed Lift · Parking · Corner Plot",
    image: "/images/projects/Ishan-Reduced.jpg",
    objectPosition: "center 30%",
  },
  {
    slug: "rudra",
    name: "Rudra",
    location: "Navi Mumbai",
    status: "Delivered",
    statusLabel: "Delivered & Handed Over",
    blurb:
      "Lift access, CCTV-monitored entrances and dedicated parking — handed over and still running the way it was built.",
    amenities: "Lift · CCTV · Parking",
    image: "/images/projects/Rudra.jpg",
    objectPosition: "center center",
  },
  {
    slug: "dhruva",
    name: "Dhruva",
    location: "Navi Mumbai",
    status: "Delivered",
    statusLabel: "Delivered & Handed Over",
    blurb:
      "A curved-corner landmark with rooftop access, round-the-clock security and ground-floor retail — for residents who wanted more than four walls.",
    amenities: "Terrace · Security · Retail · Lift",
    image: "/images/projects/Dhruva-Elevation_image.jpg",
    objectPosition: "center 35%",
  },
  {
    slug: "shaurya",
    name: "Shaurya",
    location: "Navi Mumbai",
    status: "Delivered",
    statusLabel: "Delivered & Handed Over",
    blurb:
      "A purely residential G+4 on a corner plot — eight homes with an automatic high-speed lift and ample parking. Completed, sold out and handed over.",
    amenities: "High-Speed Lift · Parking · Corner Plot",
    image: "/images/projects/shaurya/Shaurya_Elevation.png",
    objectPosition: "center 25%",
  },
];

export const featuredSlug = "shikhar";

/* ---------- Amenities — the core USP ---------- */
export const amenities = [
  {
    no: "01",
    kicker: "Rooftop Access",
    title: "A rooftop you can use in any weather.",
    body:
      "A sheltered rooftop deck — open on the sides to the breeze and the view, but covered overhead. Sit out and take in the scene without worrying about the sun or the rain.",
    featured: "Sheltered Rooftop · Terrace Access",
    image: "/images/Project_Images/Rudra/Rooftop/IMG20260627115135.jpeg",
    objectPosition: "center 60%",
  },
  {
    no: "02",
    kicker: "Aerial View",
    title: "A skyline you can actually stand in.",
    body:
      "From the terrace, the view opens up over Karanjade — uninterrupted, above the rooftops, the kind of outlook a ground-floor balcony can’t give you.",
    featured: "Panoramic Skyline Views · Open-Air Terrace",
    image: "/images/Project_Images/Shaurya/Aerial_View/DSC_0182.jpeg",
    objectPosition: "center center",
  },
  {
    no: "03",
    kicker: "Safety & Access",
    title: "Security that never clocks out.",
    body:
      "CCTV-monitored common areas and round-the-clock trained security — the fundamentals, done properly.",
    featured: "CCTV Surveillance · 24×7 Security",
    image: "/images/projects/security.png",
    objectPosition: "center center",
  },
  {
    no: "04",
    kicker: "Dedicated Parking",
    title: "A parking spot that’s actually yours.",
    body:
      "Covered parking on the ground floor — space for the two-wheeler or the car, out of the sun and the rain. No circling the lane, no fighting for a spot on the road.",
    featured: "Covered Parking · Two-Wheeler & Car",
    image: "/images/Project_Images/Rudra/Parking/IMG20260627112838.jpeg",
    objectPosition: "center 60%",
  },
  {
    no: "05",
    kicker: "Lift Access",
    title: "A lift to every floor, always running.",
    body:
      "A proper passenger lift to every floor, backed by power for the common areas — so getting home never comes down to the stairs or the grid.",
    featured: "Lift to Every Floor · Power Backup",
    image: "/images/Project_Images/Dhruva/Lift/DSC_0205.jpeg",
    objectPosition: "center 65%",
  },
  {
    no: "06",
    kicker: "Spacious Corridors",
    title: "Common spaces that never feel cramped.",
    body:
      "Wide, well-lit corridors and landings finished in glossy tile — room to move, whether you’re carrying the groceries up or seeing guests out.",
    featured: "Wide Landings · Bright & Tiled",
    image: "/images/Project_Images/Dhruva/Corridor/corridor.png",
    objectPosition: "center center",
  },
];

/* ---------- Journey / milestones ---------- */
export const journey = [
  {
    year: "2004",
    title: "K.D. Construction enters real estate",
    place: "Vashi, Navi Mumbai",
    body:
      "Where the housing story begins. K.D. Construction's first residential project — Gopala, a building in Vashi on a CIDCO tender plot — the start of two decades of homes across Vashi, Kharghar and, later, Karanjade.",
  },
  {
    year: "2019",
    title: "Nesting Tree is founded",
    place: "Karanjade",
    body:
      "A simple idea — build homes that come with more than four walls — turns into a residential development company in Karanjade.",
  },
  {
    year: "2020",
    title: "Rudra delivered",
    place: "Karanjade",
    body:
      "Our first handover. Lift, CCTV and dedicated parking, delivered as promised and handed over to residents.",
  },
  {
    year: "2021",
    title: "Dhruva delivered",
    place: "Karanjade",
    body:
      "A curved-corner landmark with rooftop access and ground-floor retail — proof the amenity-first standard scales.",
  },
  {
    year: "2022",
    title: "Shaurya delivered",
    place: "Karanjade",
    body:
      "A purely residential G+4 on a corner plot — eight homes with an automatic high-speed lift, delivered and fully sold out.",
  },
  {
    year: "Today",
    title: "Three residences underway",
    place: "Karanjade, Navi Mumbai",
    body:
      "Shikhar, Prithvi and Ishaan are under construction in Karanjade, Navi Mumbai — built to the same amenity-first standard.",
  },
];

/* ---------- Why Nesting Tree ---------- */
export const reasons = [
  {
    title: "A track record, not a promise",
    body: "Two decades of housing behind us — from Gopala in Vashi (2004) to residences delivered and handed over in Karanjade today.",
  },
  {
    title: "Possession on time",
    body: "We build to a schedule and hand over on it — the way our delivered projects were.",
  },
  {
    title: "Clear title, clean paperwork",
    body: "Clear-title land bought directly from the owner — no 50:50 or tri-party agreements, so you buy with confidence.",
  },
  {
    title: "Amenities as standard",
    body: "Gym, terrace, lift, CCTV, security and parking — built in, not sold as extras.",
  },
  {
    title: "Built to last",
    body: "Construction quality you can stand inside — and still trust years after handover.",
  },
  {
    title: "Better everyday living",
    body: "You pay a little more, and you get more than a flat: a building that improves your day.",
  },
];

/* ---------- Derived stats for the journey band ---------- */
export const stats = {
  projects: projects.length,
  delivered: projects.filter((p) => p.status === "Delivered").length,
  ongoing: projects.filter((p) => p.status === "Ongoing").length,
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
    // Brand identity line stays the headline; the emotional framing is
    // carried by the sub-copy and the flagship highlight card.
    headline: ["More Building.", "More Living."],
    sub:
      "Homes across Navi Mumbai built with more than four walls — rooftops, lifts, security and parking, designed in from the first drawing.",
    primaryCta: { label: "Explore the Residences", href: "/projects" },
    secondaryCta: { label: "Book a Site Visit", href: "#contact" },
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
  //   rooftop — unsplash.com/photos/photo-1635770618588-06bd8d5d73b9
  intro: {
    heading: "A home isn't an asset. It's where a life happens.",
    lead:
      "Every slab we pour becomes someone's first morning, someone's twentieth year. So we build a little stronger than the drawing asks — for the life we can't yet see.",
    close: "Homes made to be lived in — for over twenty years, across Navi Mumbai.",
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
    lead: "The record behind the name — from Vashi in 2004 to the residences rising across Navi Mumbai today.",
    items: [
      { value: "20+", label: "Years building homes", sub: `Since ${brand.legacyYear}` },
      { value: String(stats.projects), label: "Nesting Tree residences", sub: "Across Navi Mumbai" },
      { value: String(stats.delivered), label: "Delivered & handed over", sub: "Lived in today" },
      { value: String(stats.ongoing), label: "Under construction", sub: "Rising right now" },
      { value: "6", label: "Amenities as standard", sub: "Rooftop · Gym · Lift · CCTV · Security · Parking" },
      // Was "01 Neighbourhood — Karanjade": a one-locality stat read as a ceiling
      // on our reach. The same tile now counts the localities already built in.
      { value: "03", label: "Localities built in", sub: "Vashi · Kharghar · Panvel" },
    ],
  },

  // Flagship spread — one project, told as a story, not a card.
  featured: {
    eyebrow: "The Flagship",
    heading: "Shikhar. Our tallest statement yet.",
    lead:
      "A landmark high-rise rising above the skyline — every home lifted over the rooftops, every amenity we're known for built in from the ground up.",
    body:
      "Shikhar carries the standard forward: a sheltered rooftop you can actually use, a lift to every floor, CCTV-monitored common areas and covered parking that's yours. Not add-ons. The reason to live here.",
    // Trust point woven in beside the flagship (was reason #4 + #5).
    trust: {
      k: "Why it holds up",
      v: "Amenities come standard and the build is made to last — quality you can still stand inside years after handover.",
    },
    cta: { label: "Discover Shikhar", href: "/projects/shikhar" },
    // Single framed hero render — the strongest premium asset in the repo.
    // (Site photographs are documentary construction shots, so the flagship
    // leans on the polished elevation render rather than a raw interior.)
    image: "/images/projects/ShikharElevationFinal.jpeg",
    imagePos: "center 14%",
    // Quick spec chips — pulled straight from the Shikhar project record.
    chips: ["Now Booking", "Navi Mumbai", "Rooftop · Lift · CCTV · Parking"],
  },

  // Oversized editorial statement + three re-composed trust pillars
  // (was "Why Nesting Tree" reasons #1, #2, #3 — now distributed here).
  difference: {
    eyebrow: "The Nesting Tree Difference",
    heading: ["We don't sell", "flats. We deliver", "joy, built to last."],
    lead:
      "You pay a little more for a Nesting Tree home — and you get more than a flat. Here's what that's stood on.",
    pillars: [
      {
        no: "01",
        title: "A track record, not a promise",
        body:
          "Two decades of housing behind us — from Vashi and Kharghar to residences delivered and handed over that you can go and stand in front of today.",
      },
      {
        no: "02",
        title: "Possession on time",
        body:
          "We build to a schedule and hand over on it — the way every one of our delivered projects was.",
      },
      {
        no: "03",
        title: "Clear title, clean paperwork",
        body:
          "Land bought directly from the owner on a clear title — no 50:50 or tri-party agreements, so you buy with confidence.",
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
      "Every figure is real — homes handed over or under way, and the two decades of housing behind them. A record, not a projection.",
    items: [
      { value: "20+", label: "Years building homes", sub: `Since ${brand.legacyYear}` },
      { value: String(projects.length), label: "Residences", sub: `${stats.delivered} delivered · ${stats.ongoing} ongoing` },
      // Was "01 Location". A single-location figure undersells the record and
      // caps the brand; the honest, broader figure is localities built in.
      { value: "03", label: "Localities built in", sub: "Vashi · Kharghar · Panvel" },
    ] as { value: string; label: string; sub: string; placeholder?: boolean }[],
  },

  featuredProjects: {
    eyebrow: "Now Building",
    heading: "The homes rising right now.",
    lead:
      "Our ongoing residences across Navi Mumbai — the ones you can still book into. The full catalogue, including delivered projects, lives on the projects page.",
    cta: { label: "View All Projects", href: "/projects" },
  },

  // Resident testimonials — all real, attributable, and equal (no lead card).
  // Rendered as a carousel on the home page. Karthik's and Navin's quotes are in
  // their own words; Vijay, Swapnil and Uttam authorised us to write on their
  // behalf, so those are drafted in a matching, understated tone — tweak freely.
  // Photos live in /public/images/Testimonials/ (folder spelling as-is on disk);
  // `pos` object-positions each face inside its disc.
  testimonials: {
    eyebrow: "In Their Words",
    heading: "Homes people are glad they chose.",
    lead:
      "What owners say once the keys are theirs — the paperwork, the possession date, the building they walk into every evening.",
    items: [
      {
        quote:
          "Owning a home in a tier-1 city like Mumbai was a major life goal for me, and Nesting Tree made it happen seamlessly. From booking confirmation and loan arrangements to timely registration and final possession, every step was transparent and hassle-free. The entire team is warm, approachable, and always ready to help. Buying my first flat at age 26 felt like a huge milestone, and Nesting Tree made the journey incredible. I highly recommend them to any middle-class family looking to realize their dream of owning a home.",
        name: "Karthik S. Salian",
        detail: "Private Employee",
        photo: "/images/Testimonials/Karthik_S_Salian.jpeg",
        pos: "center 22%",
      },
      {
        quote:
          "Since 2021 we were searching for a flat in Navi Mumbai. We visited many projects, and then we came across Nesting Tree. From the very first sight it amazed us — the view, the area, everything. We loved the porch, and the one thing that won us over was the light coming through the flat: bright and positive. The whole process, from the visit to owning the flat, was the best, and no fear was left about owning a home in Navi Mumbai.",
        name: "Navin Ravindra Salvi",
        detail: "Ratnagiri",
        photo: "/images/Testimonials/Navin_Ravindra_Salvi.jpeg",
        pos: "center 25%",
      },
      {
        quote:
          "We saw a few buildings before this one, but Nesting Tree felt right the moment we walked in. The build quality and the open spaces stood out, and the team kept us informed at every step. Booking, paperwork and possession all went smoothly, and today it simply feels like home.",
        name: "Vijay Pagare",
        detail: "Resident",
        photo: "/images/Testimonials/Vijay_Pagare.jpeg",
        pos: "center 25%",
      },
      {
        quote:
          "Buying my first flat felt like a big decision, and the Nesting Tree team made it easy. They were patient with my questions and clear about every stage, from the agreement to the handover. The flat is well built and airy, and I'm genuinely happy with the choice I made.",
        name: "Swapnil",
        detail: "Resident",
        photo: "/images/Testimonials/Swapnil.jpeg",
        pos: "center 20%",
      },
      {
        quote:
          "What I appreciated most was how straightforward everything was — clear pricing, honest answers, no running around. The building is solid and the surroundings are quiet and green. Moving in was effortless, and we've settled in comfortably.",
        name: "Uttam",
        detail: "Resident",
        photo: "/images/Testimonials/Uttam.jpeg",
        pos: "center 20%",
      },
    ] as { quote: string; name: string; detail: string; photo: string; pos: string }[],
  },

  cta: {
    eyebrow: "Enquire",
    heading: "Visit a home in person.",
    body:
      "Book a site visit to an ongoing Nesting Tree residence — clear title, honest paperwork, and a building you can walk through before you decide.",
    image: "/images/projects/Prithvi-Elevation.jpg",
    imagePos: "center 10%",
  },
};
