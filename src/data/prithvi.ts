/* ============================================================
   Prithvi — project detail page content
   Single source of truth for the Prithvi by Nesting Tree page.
   A G+7 building at Karanjade: four shops at street
   level and 27 homes above (26 × 1BHK, 1 × 2BHK).
   Edit facts, figures and copy here; the page at
   src/pages/projects/prithvi.astro reads everything from this file.

   STATUS: under construction. Two of the eight slabs are cast, six to
   go, and the target for full readiness is December 2027. No RERA
   certification has been taken — the project runs on a Commencement
   Certificate — so nothing here claims MahaRERA registration. Bookings
   have not opened yet, so the page reads "Pre-launch", not "Now booking".

   Now supplied (from the render set added Jul 2026):
     · 1BHK & 2BHK layout drawings + room dimensions   → unitTypes
     · 2BHK areas (carpet 795 / super built-up 1,380)  → unitTypes[1].features
     · Typical-floor & terrace plans                   → floorPlans
     · Two automatic high-speed lifts (was recorded as
       one — corrected on the owner's confirmation)
     · Rooftop common terrace, solar panels & OH tanks → amenityGroups

   Still outstanding (renders as "Insufficient information"):
     · Plot size, unit series
     · A ground-floor plan that shows the four shops. The only
       ground-floor render supplied depicts a residential layout
       (flats, no shops), so it is deliberately NOT used here —
       it would contradict the confirmed retail ground floor.

   Icon keys reference the line-icon set defined inside the page.
   ============================================================ */

/** Marks a field we have not been given. Rendered as a muted
    placeholder, never as a fact. Delete the TBD once you fill it in. */
export const TBD = "Insufficient information";

export const prithvi = {
  name: "Prithvi",
  status: "Under construction",
  // No RERA certification taken — project runs on a Commencement Certificate.
  // Kept as TBD so the hero's MahaRERA pill stays hidden; the real approval
  // status is shown as a fact in `overview.facts` and the footer (`approvals`).
  maharera: TBD,
  approvals: "Commencement Certificate obtained · not RERA-registered",
  tagline:
    "A G+7 residence — four shops at street level and 27 homes on the floors above.",
  // Standard hero address format: Plot, Sector, Karanjade, Panvel, Pincode.
  address: "Plot no. 277, Sector 1, Karanjade, Panvel, 410206",
  hero: "/images/projects/Prithvi-Elevation.jpg",
  heroPosition: "center 12%",
  // Bookings have not opened yet — pre-launch, not "Now booking".
  pills: ["Pre-launch"],
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Prithvi+Nesting+Tree+Karanjade+Navi+Mumbai",
};

/* ---------- Sales contact ----------
   Vipin is the single point of contact for every Nesting Tree project,
   and for Nesting Tree itself — confirmed by the owner. The same block
   appears in each project file. */
export const sales = {
  name: "Vipin",
  phone: "95940 79317",
  phoneHref: "tel:+919594079317",
};

/* ---------- Headline stats band (4 figures) ---------- */
export const heroStats = [
  { figure: "G+7", label: "Storeys" },
  { figure: "27", label: "Homes" },
  { figure: "4", label: "Shops" },
  { figure: "31", label: "Total units" },
];

/* ---------- Overview ---------- */
export const overview = {
  intro:
    "A G+7 structure of 27 residential and 4 commercial units — four shops holding the ground floor, and 26 one-bedroom apartments plus a single 2BHK on the seven floors above. Two automatic high-speed lifts serve every floor, with a rooftop common terrace and solar power up top.",
  facts: [
    { label: "Construction stage", value: "2 of 8 slabs cast · 6 to go" },
    { label: "Possession", value: "Targeting December 2027" },
    { label: "Structure", value: "G+7 storey · corner plot" },
    { label: "Configuration", value: "27 residential + 4 commercial units" },
    { label: "Vertical transport", value: "2 automatic high-speed lifts" },
    { label: "Rooftop", value: "Common terrace · solar panels · overhead water tanks" },
    { label: "Approvals", value: "Commencement Certificate obtained · not RERA-registered" },
  ],
  unitMix: [
    { figure: "26", label: "1BHK apartments" },
    { figure: "1", label: "2BHK apartment" },
    { figure: "4", label: "Commercial shops" },
    { figure: "31", label: "Total units" },
  ],
  connectivity:
    "Prithvi sits in Karanjade — a fast-growing residential pocket of Navi Mumbai with strong road connectivity across the Mumbai–Pune corridor and the wider Navi Mumbai area.",
};

/* ---------- Floor plans ----------
   No drawings supplied. `plan` points at the placeholder SVGs that
   already ship in public/images/projects/prithvi/; `planPending`
   flags them on the page so a placeholder never reads as a plan.
   Drop the real drawings in and clear the flag.                  */
export type FloorPlan = {
  title: string;
  label: string;
  plan: string;
  planPending?: boolean;
  blurb: string;
  points: string[];
};

export const floorPlans: FloorPlan[] = [
  {
    title: "Typical upper floor",
    label: "Residential — floors 1 to 7",
    plan: "/images/projects/prithvi/Prithvi_Floor_Plan.png",
    blurb:
      "Four homes to a typical floor — one-bedroom apartments, each with a private balcony and a utility, opening off a central passage and served by two lifts. Twenty-seven homes are stacked this way above the shops: twenty-six 1BHK and a single 2BHK.",
    points: [
      "4 homes per typical floor",
      "1BHK apartments with balcony + utility",
      "2 automatic high-speed lifts",
      "Central passage — 7′6″ × 10′0″",
      "26 × 1BHK + 1 × 2BHK in all",
      "Corner plot",
    ],
  },
  {
    title: "Rooftop terrace",
    label: "Above the seventh floor",
    plan: "/images/projects/prithvi/Prithvi_Terrace_Plan.png",
    blurb:
      "The roof belongs to everyone. A common terrace open to the sky sits at the centre, private terraces flank the top-floor homes, and rooftop solar panels and overhead water tanks run the building's services — reached by both lifts and the stair.",
    points: [
      "Common terrace, open to the sky",
      "Private terraces for top-floor homes",
      "Rooftop solar panels",
      "Overhead water tanks & services",
      "Served by both lifts + stair",
    ],
  },
];

/* ---------- Unit types — the flat layouts ----------
   Prithvi is now booking, so it follows Shikhar's per-flat pattern
   rather than Dhruva's floor-only one: a buyer choosing a home needs
   to see the home, not just the storey it sits on. Same shape as
   `unitTypes` in shikhar.ts.

   We know the type and the count and nothing else, so `series`,
   `features` and `rooms` are gaps the page renders as such. Fill
   `rooms` in the shikhar.ts format — { room, dim } — and the
   dimensions table appears; fill `features` and the tick-list
   appears. Both are hidden while empty rather than faked.        */
export type UnitType = {
  type: string;
  units: string;
  series: string;
  plan: string;
  planPending?: boolean;
  blurb: string;
  features: string[];
  rooms: { room: string; dim: string }[];
};

export const unitTypes: UnitType[] = [
  {
    type: "1BHK",
    units: "26 units",
    series: TBD,
    plan: "/images/projects/prithvi/Prithvi_1BHK_Plan.png",
    blurb:
      "The home Prithvi is mostly made of — twenty-six of the building's twenty-seven homes are this one-bedroom plan: a 15-foot living room opening onto a private balcony, a separate kitchen and a bedroom of its own.",
    features: [
      "Private balcony — 4′0″ wide",
      "Separate kitchen",
      "Attached toilet",
    ],
    rooms: [
      { room: "Living", dim: "15′0″ × 10′6″" },
      { room: "Bedroom", dim: "10′0″ × 10′6″" },
      { room: "Kitchen", dim: "8′0″ × 7′0″" },
      { room: "Toilet", dim: "7′0″ × 4′0″" },
    ],
  },
  {
    type: "2BHK",
    units: "1 unit",
    series: TBD,
    plan: "/images/projects/prithvi/Prithvi_2BHK_Plan.png",
    blurb:
      "The only two-bedroom home in the building. Twenty-six homes share a plan; this one does not — two bedrooms, two toilets, a 15 × 16 living-dining, two balconies and a utility, on a super built-up of 1,380 sq.ft.",
    features: [
      "Carpet area — 795 sq.ft",
      "Balcony area — 80 sq.ft",
      "Built-up area — 1,010 sq.ft",
      "Super built-up area — 1,380 sq.ft",
      "Two balconies — 4′0″ wide · plus utility",
    ],
    rooms: [
      { room: "Living / Dining", dim: "15′0″ × 16′0″" },
      { room: "Bedroom 1", dim: "11′0″ × 12′0″" },
      { room: "Bedroom 2", dim: "11′0″ × 12′0″" },
      { room: "Kitchen", dim: "9′0″ × 7′0″" },
      { room: "Toilet 1", dim: "7′6″ × 4′6″" },
      { room: "Toilet 2", dim: "7′6″ × 4′6″" },
    ],
  },
];

/* ---------- The ground-up read — the page's creative ----------
   Prithvi is the earth: the first element, the one everything else
   stands on. The building reads the same way from the bottom up —
   a ground floor that belongs to the street, seven floors of homes
   standing on it, and one apartment that breaks the pattern.
   Written entirely from the three facts we have (G+7 · 4 shops ·
   26 1BHK + 1 2BHK), so none of it goes stale when the rest of the
   spec arrives. The Shikhar equivalent is `amenityStages`.        */
export type Level = {
  marker: string;
  title: string;
  category: string;
  icon: string;
  featured?: boolean;
  blurb: string;
  points: string[];
};

export const levels: Level[] = [
  {
    marker: "G",
    title: "The ground",
    category: "Street level",
    icon: "shop",
    featured: true,
    blurb:
      "Four shops hold the ground floor. The building meets the street as a working one — the everyday errand starts and ends at the foot of your own address.",
    points: ["4 commercial shops at street level", "The ground floor belongs to the street"],
  },
  {
    marker: "1–7",
    title: "The rise",
    category: "Homes",
    icon: "tower",
    blurb:
      "Seven floors of homes stand on that ground — twenty-seven in all, and all but one of them a one-bedroom apartment built to the same plan.",
    points: ["G+7 storey structure", "27 homes across seven floors", "26 one-bedroom apartments"],
  },
  {
    marker: "×1",
    title: "The one",
    category: "The exception",
    icon: "star",
    featured: true,
    blurb:
      "One 2BHK in the whole building. Twenty-six homes share a plan; this one does not — a single larger apartment, and there is no second.",
    points: ["1 two-bedroom apartment", "The only one of its kind at Prithvi"],
  },
];

/* ---------- Amenities ----------
   EMPTY BY DESIGN — no amenity schedule was supplied for Prithvi.
   The page renders the "Insufficient information" panel while this
   array is empty, and switches to the full grouped list the moment
   you fill it. Group it Building / Lifestyle / Interiors the way
   shikhar.ts and dhruva.ts do; the page's icon set already carries
   the keys those files use.                                       */
export type Amenity = {
  icon: string;
  name: string;
  desc: string;
  featured?: boolean;
};

export type AmenityGroup = {
  group: string;
  caption: string;
  items: Amenity[];
};

export const amenityGroups: AmenityGroup[] = [
  {
    group: "Buy with confidence",
    caption: "What stands behind the purchase",
    items: [
      {
        icon: "star",
        name: "Branded residences",
        desc: "A Nesting Tree address, from a reputed builder with a proven track record.",
        featured: true,
      },
      {
        icon: "tower",
        name: "A proven track record",
        desc: "Purchase from a builder with delivered projects in Karanjade, Navi Mumbai.",
      },
      {
        icon: "lobby",
        name: "100% owner-occupied",
        desc: "Every home bought by a family to live in — not to rent out.",
      },
      {
        icon: "window",
        name: "Direct from the landowner",
        desc: "No 50:50 or tri-party agreement — the strongest paperwork, with no legal hassles.",
      },
    ],
  },
  {
    group: "Building",
    caption: "Everyday living",
    items: [
      {
        icon: "elevator",
        name: "Two automatic high-speed lifts",
        desc: "Two automatic high-speed elevators serve every floor — for safety and comfort.",
        featured: true,
      },
      { icon: "parking", name: "Ample parking", desc: "Room to park without circling for a spot." },
      {
        icon: "shop",
        name: "Street-level retail",
        desc: "Four shops on the ground floor — the everyday errand at the foot of the building.",
      },
      {
        icon: "grill",
        name: "Rule-based society living",
        desc: "A managed, rule-based society — order kept for everyone who lives here.",
      },
    ],
  },
  {
    group: "Rooftop",
    caption: "The roof, put to work",
    items: [
      {
        icon: "rooftop",
        name: "Common terrace, open to sky",
        desc: "A shared rooftop terrace open to the sky — the whole building's outdoor room.",
        featured: true,
      },
      {
        icon: "tiles",
        name: "Rooftop solar panels",
        desc: "Solar panels on the roof, cutting the common-area running costs.",
      },
      {
        icon: "loft",
        name: "Private terraces",
        desc: "Private terraces for the top-floor homes, off the common roof.",
      },
      {
        icon: "waterproof",
        name: "Overhead water tanks",
        desc: "Rooftop overhead tanks and services, feeding every home below.",
      },
    ],
  },
  {
    group: "Safety & fire",
    caption: "Protection built in",
    items: [
      {
        icon: "waterproof",
        name: "Fire-fighting system",
        desc: "A building fire-fighting system, built in.",
        featured: true,
      },
      {
        icon: "rooftop",
        name: "Separate overhead fire tank",
        desc: "A dedicated overhead tank reserved for fire-fighting.",
      },
      {
        icon: "faucet",
        name: "Portable fire extinguishers",
        desc: "Portable extinguishers placed through the common areas.",
      },
      {
        icon: "grill",
        name: "CCTV surveillance",
        desc: "CCTV monitoring across the building's common areas.",
      },
    ],
  },
];

/** Retained for reference — the amenity schedule above is now filled,
    so this list no longer renders. */
export const amenitiesNeeded: string[] = [];

/* ---------- About the developer (dark section) ----------
   Brand-level facts, consistent with dhruva.ts.                   */
export const developerNotes: { label: string; body: string }[] = [
  {
    label: "Two decades of lineage",
    body: "Nesting Tree, established in 2019, is a venture of K.D. Construction — in real estate since 2004.",
  },
  {
    label: "Built for Karanjade",
    body: "Focused on Karanjade, with an emphasis on quality construction and a professional home-buying experience.",
  },
  {
    label: "A delivered track record",
    body: "Rudra, Dhruva and Shaurya are complete and handed over to their residents.",
  },
  {
    label: "A proven portfolio",
    body: "Lush Meadows (16-storey, Kharghar) and Gopala (Vashi) are appreciated for quality, timely completion and amenities.",
  },
];

/* ---------- Why Prithvi (6 cards) ----------
   Brand-level reasons carried from site.ts until project-specific
   ones are supplied — nothing here claims anything about Prithvi
   that we have not been told.                                     */
export const whyPrithvi: { title: string; body: string }[] = [
  {
    title: "A track record, not a promise",
    body: "Two decades of housing behind us — from Gopala in Vashi (2004) to residences delivered and handed over in Karanjade today.",
  },
  {
    title: "Possession on time",
    body: "We build to a schedule and hand over on it — the way our delivered projects were.",
  },
  {
    title: "Clean title, direct from the owner",
    body: "Buy straight from the landowner — no 50:50 or tri-party agreement. Strong paperwork, no legal hassles.",
  },
  {
    title: "Amenities as standard",
    body: "Two automatic high-speed lifts, ample parking, a rooftop terrace with solar, CCTV and a full fire-fighting system — built in, not sold as extras.",
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

/* ---------- Gallery — real on-site photographs ----------
   Complete set of documentary photos for this project (renders and
   near-duplicate "(1)" variants excluded). Generated from the folders
   under public/images/Project_Images/Prithvi/. Rendered by
   <ProjectGallery/> on the project page and on /gallery — real
   photography only, never renders or stock. */
export const gallery: { src: string; alt: string; category: string }[] = [
  { src: "/images/Project_Images/Prithvi/DSC_0091.jpeg", alt: "Prithvi — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Prithvi/DSC_0093.jpeg", alt: "Prithvi — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Prithvi/Exterior/DSC_0077.jpeg", alt: "Prithvi — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Prithvi/Exterior/DSC_0081.jpeg", alt: "Prithvi — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Prithvi/Exterior/DSC_0086.jpeg", alt: "Prithvi — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Prithvi/Exterior/DSC_0087.jpeg", alt: "Prithvi — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Prithvi/Exterior/IMG20260627121039.jpeg", alt: "Prithvi — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Prithvi/Exterior/IMG20260627121054.jpeg", alt: "Prithvi — exterior of the building", category: "Exterior" },
];
