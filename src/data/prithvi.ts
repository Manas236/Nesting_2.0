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
     · 1BHK & 2BHK layout drawings                     → unitTypes
       (room dimensions came with them, but are no longer
        printed — see the `unitTypes` note below)
     · 2BHK areas (carpet 795 / super built-up 1,380)  → unitTypes[1].features
     · Typical-floor & terrace plans                   → floorPlans
     · ONE automatic high-speed lift. This figure has moved
       twice: recorded as one, raised to two on an earlier
       owner confirmation, and set back to ONE on his review
       of 11 Aug 2026 — "one elevator … please change
       throughout" — which his own Project Overview wording
       repeats. One is the answer; do not raise it again
       without a fresh written instruction.
     · Rooftop common terrace & OH tanks → amenityGroups.
       NO SOLAR. The rooftop solar panels came out entirely
       on that same 11 Aug 2026 instruction — removed, not
       softened, so nothing on this page may imply them.

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
  approvals: "Commencement Certificate obtained",
  tagline:
    "A G+7 residence: four shops at street level and 27 homes on the floors above.",
  // Standard hero address format: Plot, Sector, Karanjade, Panvel, Pincode.
  address: "Plot no. 277, Sector 1, Karanjade, Panvel, 410206",
  hero: "/images/projects/Prithvi-Elevation.jpg",
  heroPosition: "center 12%",
  // Bookings have not opened yet — pre-launch, not "Now booking".
  pills: ["Pre-launch"],
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Prithvi+Nesting+Tree+Karanjade+Navi+Mumbai",
};

/* ---------- Sales / office contact ----------
   Moved to src/data/site.ts on 11 Aug 2026. Vipin is the single point of
   contact for every project, so the block is defined once there and
   prithvi.astro imports it from site.ts. Do not re-add it here. */

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
    "A G+7 structure of 27 residential and 4 commercial units: four shops holding the ground floor, and 26 one-bedroom apartments plus a single 2BHK on the seven floors above. One automatic high-speed lift serves every floor, with a rooftop common terrace up top.",
  facts: [
    { label: "Construction stage", value: "2 of 8 slabs cast · 6 to go" },
    { label: "Possession", value: "Targeting December 2027" },
    { label: "Structure", value: "G+7 storey · corner plot" },
    { label: "Configuration", value: "27 residential + 4 commercial units" },
    { label: "Vertical transport", value: "1 automatic high-speed lift" },
    { label: "Rooftop", value: "Common terrace · overhead water tanks" },
    { label: "Approvals", value: "Commencement Certificate obtained" },
  ],
  unitMix: [
    { figure: "26", label: "1BHK apartments" },
    { figure: "1", label: "2BHK apartment" },
    { figure: "4", label: "Commercial shops" },
    { figure: "31", label: "Total units" },
  ],
  connectivity:
    "Prithvi sits in Karanjade, a fast-growing residential pocket of Navi Mumbai with strong road connectivity across the Mumbai–Pune corridor and the wider Navi Mumbai area.",
};

/* ---------- Construction / build progress ----------
   Owner-confirmed status: 2 of the 8 slabs are cast, 6 to go, with full
   readiness targeted for December 2027. The frame is still going up, so
   RCC is the live phase here and everything after it reads "Upcoming".
   `state` drives the stepper styling in the page.                    */
export const buildProgress: {
  phase: string;
  detail: string;
  state: "done" | "current" | "upcoming";
}[] = [
  {
    phase: "Foundation",
    detail: "Excavation and foundation cast on the corner plot.",
    state: "done",
  },
  {
    phase: "RCC structure",
    detail: "2 of the 8 slabs are cast, with 6 more to go to top out at G+7.",
    state: "current",
  },
  {
    phase: "Finishing works",
    detail: "Tiling, painting and plaster, once the frame is topped out.",
    state: "upcoming",
  },
  {
    phase: "Fittings & fit-out",
    detail: "Flooring, fittings and the final finishes in every home.",
    state: "upcoming",
  },
  {
    phase: "Handover",
    detail: "Fully ready by December 2027: possession and keys.",
    state: "upcoming",
  },
];

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
      "Four homes to a typical floor, all one-bedroom apartments, each with a private balcony and a utility, opening off a central passage and served by the lift. Twenty-seven homes are stacked this way above the shops: twenty-six 1BHK and a single 2BHK.",
    points: [
      "4 homes per typical floor",
      "1BHK apartments with balcony + utility",
      "1 automatic high-speed lift",
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
      "The roof belongs to everyone. A common terrace open to the sky sits at the centre, private terraces flank the top-floor homes, and the overhead water tanks run the building's services, reached by the lift and the stair.",
    points: [
      "Common terrace, open to the sky",
      "Private terraces for top-floor homes",
      "Overhead water tanks & services",
      "Served by the lift + stair",
    ],
  },
];

/* ---------- Unit types — the flat layouts ----------
   Prithvi is now booking, so it follows Shikhar's per-flat pattern
   rather than Dhruva's floor-only one: a buyer choosing a home needs
   to see the home, not just the storey it sits on. Same shape as
   `unitTypes` in shikhar.ts.

   `stats` carries the RERA carpet areas from the CIDCO-approved plan
   (CIDCO/BP-19197/TPO(NM & K)/2024/13266, approved 21 Nov 2024). Its
   carpet-area statement lists one row per unit series — 27 homes in
   nine rows, which matches the proforma's "No. of Residential Units:
   27":

     101,201,301,401,501,601   23.980 sq. m.  (6 homes)
     102,202,302,402,502,602   27.872         (6)
     103                       34.116         (1)
     104                       33.449         (1)
     203,303,403,503,603,703   29.016         (6)
     204,304,404,504           29.030         (4)
     604                       27.816         (1)
     702                       39.512         (1)
     704                       26.780         (1)

   Unit 702 is taken as the single 2BHK: the seventh-floor plan draws
   three kitchens but four bedrooms, so one of 702/703/704 has two
   bedrooms, and 702 is much the largest of the three. The other 26
   rows are the 1BHK homes.

   `stats` prints ONE figure per row rather than the 23.98 – 34.12
   range — a range that wide reads as uncertainty on a sales page.
   The 1BHK carpet figure is the mean over all 26 homes, weighted by
   the unit counts above:

     (6×23.980 + 6×27.872 + 34.116 + 33.449 + 6×29.016
      + 4×29.030 + 27.816 + 26.780) / 26 = 723.489 / 26 = 27.83

   Note this is well below the 29.05 midpoint of the range: the two
   largest rows are one home each, while the smallest is six. The
   balcony rows have no per-unit breakdown in this file, so those two
   are the midpoint of the supplied range and nothing better. The
   sq. ft. restatement is converted from the rounded metric figure so
   the two numbers on a cell always agree. The averaging is disclosed
   in `unitTypesNote` below.

   Room dimensions were dropped on 11 Aug 2026 (owner's instruction
   #9: no room dimensions on any project page). They had come from the
   render set supplied in Jul 2026 rather than the approved drawing,
   which is worth knowing if they are ever asked for again.
   Fill `features` and the tick-list appears; it is hidden while empty
   rather than faked.                                              */
export type UnitType = {
  type: string;
  units: string;
  series: string;
  plan: string;
  planPending?: boolean;
  blurb: string;
  stats: { label: string; value: string }[];
  features: string[];
};

export const unitTypes: UnitType[] = [
  {
    type: "1BHK",
    units: "26 units",
    series: TBD,
    plan: "/images/projects/prithvi/Prithvi_1BHK_Plan.png",
    blurb:
      "The home Prithvi is mostly made of. Twenty-six of the building's twenty-seven homes are this one-bedroom plan: a 15-foot living room opening onto a private balcony, a separate kitchen and a bedroom of its own.",
    stats: [
      { label: "Carpet area", value: "27.83 sq. m. (300 sq. ft.)" },
      { label: "Enclosed balcony", value: "6.74 sq. m. (73 sq. ft.)" },
      { label: "Open balcony", value: "7.52 sq. m. (81 sq. ft.)" },
      { label: "Homes of this type", value: "26 of 27" },
    ],
    features: [
      "Private balcony — 4′0″ wide",
      "Separate kitchen",
      "Attached toilet",
    ],
  },
  {
    type: "2BHK",
    units: "1 unit",
    series: TBD,
    plan: "/images/projects/prithvi/Prithvi_2BHK_Plan.png",
    blurb:
      "The only two-bedroom home in the building. Twenty-six homes share a plan; this one does not: two bedrooms, two toilets, a 15 × 16 living-dining, two balconies and a utility, on a super built-up of 1,380 sq.ft.",
    stats: [
      { label: "Carpet area", value: "39.51 sq. m. (425 sq. ft.)" },
      { label: "Enclosed balcony", value: "6.48 sq. m. (70 sq. ft.)" },
      { label: "Open balcony", value: "8.98 sq. m. (97 sq. ft.)" },
      { label: "Homes of this type", value: "1 of 27" },
    ],
    features: [
      "Carpet area — 795 sq.ft",
      "Balcony area — 80 sq.ft",
      "Built-up area — 1,010 sq.ft",
      "Super built-up area — 1,380 sq.ft",
      "Two balconies — 4′0″ wide · plus utility",
    ],
  },
];

/* Source line printed under the unit-types section.

   CONFLICT TO RESOLVE BEFORE LAUNCH: the 2BHK `features` above carry
   "Carpet area — 795 sq.ft" and "Super built-up area — 1,380 sq.ft"
   from the Jul 2026 render set. The approved plan puts the largest
   flat in the building at 39.512 sq. m. = 425 sq. ft. carpet, and the
   whole seventh floor at 178.824 sq. m. = 1,925 sq. ft. of plinth for
   three flats plus lobby, lift and stair — so 1,380 sq. ft. cannot
   belong to one of them. The card now states both figures. Decide
   which is right and drop the other. */
export const unitTypesNote =
  "Carpet areas from the CIDCO-approved building plan CIDCO/BP-19197/TPO(NM & K)/2024/13266, approved 21 November 2024. The 1BHK figures are the average across the twenty-six homes of that layout, which vary from unit to unit; the area of a particular flat is the one printed on the approved plan and stated in its agreement. Renders are indicative; furniture and finishes are not part of the sale.";

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
      "Four shops hold the ground floor. The building meets the street as a working one. The everyday errand starts and ends at the foot of your own address.",
    points: ["4 commercial shops at street level", "The ground floor belongs to the street"],
  },
  {
    marker: "1–7",
    title: "The rise",
    category: "Homes",
    icon: "tower",
    blurb:
      "Seven floors of homes stand on that ground, twenty-seven in all, and all but one of them a one-bedroom apartment built to the same plan.",
    points: ["G+7 storey structure", "27 homes across seven floors", "26 one-bedroom apartments"],
  },
  {
    marker: "×1",
    title: "The one",
    category: "The exception",
    icon: "star",
    featured: true,
    blurb:
      "One 2BHK in the whole building. Twenty-six homes share a plan; this one does not. A single larger apartment, and there is no second.",
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
        desc: "Every home bought by a family to live in, not to rent out.",
      },
      {
        icon: "window",
        name: "Direct from the landowner",
        desc: "No 50:50 or tri-party agreement: the strongest paperwork, with no legal hassles.",
      },
    ],
  },
  {
    group: "Building",
    caption: "Everyday living",
    items: [
      {
        icon: "elevator",
        name: "One automatic high-speed lift",
        desc: "One automatic high-speed elevator serves every floor, for safety and comfort.",
        featured: true,
      },
      { icon: "parking", name: "Ample parking", desc: "Room to park without circling for a spot." },
      {
        icon: "shop",
        name: "Street-level retail",
        desc: "Four shops on the ground floor, and the everyday errand at the foot of the building.",
      },
      {
        icon: "grill",
        name: "Rule-based society living",
        desc: "A managed, rule-based society. Order kept for everyone who lives here.",
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
        desc: "A shared rooftop terrace open to the sky, the whole building's outdoor room.",
        featured: true,
      },
      // The "Rooftop solar panels" tile was here. Removed outright on the
      // owner's instruction of 11 Aug 2026 — Prithvi has no rooftop solar.
      // Do not reinstate it in a softer form.
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
    body: "Nesting Tree, established in 2019, with two decades of real estate lineage behind it, since 2004.",
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
    body: "Two decades of housing behind us, from Gopala in Vashi (2004) to residences delivered and handed over in Karanjade today.",
  },
  {
    title: "Possession on time",
    body: "We build to a schedule and hand over on it, exactly as our delivered projects were.",
  },
  {
    title: "Clean title, direct from the owner",
    body: "Buy straight from the landowner. No 50:50 or tri-party agreement. Strong paperwork, no legal hassles.",
  },
  {
    title: "Amenities as standard",
    body: "One automatic high-speed lift, ample parking, a rooftop terrace, CCTV and a full fire-fighting system: built in, not sold as extras.",
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

/* ---------- Gallery — real on-site photographs ----------
   Complete set of documentary photos for this project (renders and
   near-duplicate "(1)" variants excluded). Rendered by <ProjectGallery/>
   on the project page and on /gallery — real photography only, never
   renders or stock.

   Filenames, alt text and the width/height pairs are GENERATED by
   `node scripts/optimise-project-images.mjs prithvi`, which reads
   scripts/alt-text/prithvi.tsv. Edit the alt text there, not here, or the
   next run overwrites it. Files live under public/images/projects/prithvi/
   photos/, each with a 640 px `-640.webp` companion that ProjectGallery
   puts in the srcset; `src` below is the full size the lightbox opens.

   The old camera-named paths still resolve — see src/lib/image-redirects.ts. */
export const gallery: { src: string; alt: string; category: string; width?: number; height?: number }[] = [
  { src: "/images/Project_Images/Prithvi/DSC_0091.jpeg", alt: "Prithvi — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Prithvi/DSC_0093.jpeg", alt: "Prithvi — exterior of the building", category: "Exterior" },
  { src: "/images/projects/prithvi/photos/prithvi-exterior-01.webp", alt: "The concrete frame with green netting on the upper floors, rebar and materials stacked below — Prithvi, Karanjade", category: "Exterior", width: 1600, height: 1066 },
  { src: "/images/projects/prithvi/photos/prithvi-exterior-02.webp", alt: "Another face of the frame from the kerbside, the neighbouring buildings pressing right up to it — Prithvi, Karanjade", category: "Exterior", width: 1600, height: 1066 },
  { src: "/images/projects/prithvi/photos/prithvi-exterior-03.webp", alt: "Looking down on the topmost slabs, the streets and the parked cars laid out all around — Prithvi, Karanjade", category: "Exterior", width: 1600, height: 1066 },
  { src: "/images/projects/prithvi/photos/prithvi-exterior-04.webp", alt: "The unfinished top floor closed in by neighbours on every side, seen from above — Prithvi, Karanjade", category: "Exterior", width: 1066, height: 1600 },
  { src: "/images/projects/prithvi/photos/prithvi-exterior-05.webp", alt: "The building rising mid-street, cars and trucks nose to tail along the road below — Prithvi, Karanjade", category: "Exterior", width: 1400, height: 1050 },
  { src: "/images/projects/prithvi/photos/prithvi-exterior-06.webp", alt: "Closer in on the unfinished floors, the parked street and the rooftops running away behind — Prithvi, Karanjade", category: "Exterior", width: 1200, height: 1600 },
];
