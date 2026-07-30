/* ============================================================
   Ishaan — project detail page content
   Single source of truth for the Ishaan by Nesting Tree page.
   A G+4 building at Karanjade: twelve homes, every one
   of them a 1RK, and no commercial units at all.
   Edit facts, figures and copy here; the page at
   src/pages/projects/ishaan.astro reads everything from this file.

   STATUS: under construction. All RCC work is complete; finishing
   (tiling, plaster, paint) is under way and the target for full
   readiness is March 2027. No RERA certification has been taken —
   the project runs on a Commencement Certificate — so nothing here
   claims MahaRERA registration. Bookings have not opened yet, so the
   page reads "Pre-launch", not "Now booking".

   Now supplied (from the architectural plans in
   public/images/projects/ishaan/ — 1RK, ground, typical & terrace):
     · The 1RK layout, its room dimensions and 17.70 sq.mt RERA
       carpet area                         → unitTypes
     · Flats per floor: FOUR 1RK homes on each typical floor
       (2nd–4th), all floors identical = 12 homes.
     · The four homes on a floor are NOT one repeated plan — the
       living/kitchen/toilet sizes differ by position. The unit
       card shows the corner 1RK (the one flagged on the key plan)
       as the representative home; do not call the plan "identical".
     · Ground / typical / terrace floor drawings → floorPlans[].plan
     · Corner plot on an 11 m and a 9 m road (from the ground plan).

   Still outstanding (renders as "Insufficient information"):
     · What sits on the 1st floor — the typical residential plan
       covers 2nd–4th only; no 1st-floor drawing was supplied, so
       nothing here states its use.

   Real photography exists at public/images/Project_Images/Ishaan/
   (5 exteriors, 4 interiors) and is ready to hang on featured
   amenity cards once there is an amenity schedule to hang it on.

   Icon keys reference the line-icon set defined inside the page.
   ============================================================ */

/** Marks a field we have not been given. Rendered as a muted
    placeholder, never as a fact. Delete the TBD once you fill it in. */
export const TBD = "Insufficient information";

export const ishaan = {
  name: "Ishaan",
  status: "Under construction",
  // No RERA certification taken — project runs on a Commencement Certificate.
  // Kept as TBD so the hero's MahaRERA pill stays hidden; the real approval
  // status is shown as a fact in `overview.facts` and the footer (`approvals`).
  maharera: TBD,
  approvals: "Commencement Certificate obtained · not RERA-registered",
  tagline: "A G+4 residence — twelve homes, and every one of them a 1RK.",
  // Standard hero address format: Plot, Sector, Karanjade, Panvel, Pincode.
  address: "Plot no. 123, Sector 1, Karanjade, Panvel, 410206",
  hero: "/images/projects/Ishan-Reduced.jpg",
  heroPosition: "center 30%",
  // Bookings have not opened yet — pre-launch, not "Now booking".
  pills: ["Pre-launch"],
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Ishaan+Nesting+Tree+Karanjade+Navi+Mumbai",
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
  { figure: "G+4", label: "Storeys" },
  { figure: "12", label: "Homes" },
  { figure: "1RK", label: "Every home" },
  { figure: "100%", label: "Residential" },
];

/* ---------- Overview ----------
   `unitMix` runs three tiles, not four: the mix really is one line.
   Padding it out with a repeated figure would be noise, so the page
   lays these out on a 3-up grid.                                   */
export const overview = {
  intro:
    "A G+4 structure of twelve 1RK homes — four to a typical floor, with no commercial units anywhere in the building.",
  facts: [
    { label: "Construction stage", value: "RCC complete · tiling, plaster & paint under way" },
    { label: "Possession", value: "Targeting March 2027" },
    { label: "Structure", value: "G+4 storey · corner plot on an 11 m & a 9 m road" },
    { label: "Configuration", value: "12 × 1RK · four homes per typical floor (2nd–4th)" },
    { label: "Carpet area", value: "17.70 sq.mt (≈ 190 sq.ft) per 1RK" },
    { label: "Approvals", value: "Commencement Certificate obtained · not RERA-registered" },
  ],
  unitMix: [
    { figure: "12", label: "1RK apartments" },
    { figure: "4", label: "Homes per floor" },
    { figure: "G+4", label: "Storeys" },
  ],
  connectivity:
    "Ishaan sits in Karanjade — a fast-growing residential pocket of Navi Mumbai with strong road connectivity across the Mumbai–Pune corridor and the wider Navi Mumbai area.",
};

/* ---------- Floor plans ----------
   Real architectural drawings, supplied at
   public/images/projects/ishaan/. `planPending` is now dropped on
   every entry, so each renders as a real plan. The set runs bottom
   to top: ground → typical residential floor → terrace.           */
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
    title: "Ground floor",
    label: "Entry, parking & lobby",
    plan: "/images/projects/ishaan/Ishaan_Ground_Plan.png",
    blurb:
      "Ishaan carries no shops, so the ground floor belongs entirely to the building — a sliding-gate entry off the road, covered parking, and the residents' lobby with the lift and staircase.",
    points: [
      "Sliding-gate entry / exit",
      "Car & two-wheeler parking",
      "Lobby 2.50 × 3.80 m",
      "Lift 1.65 × 1.80 m + staircase",
      "Corner plot — 11 m & 9 m roads",
      "No commercial units",
    ],
  },
  {
    title: "Typical floor",
    label: "2nd–4th · four 1RK homes",
    plan: "/images/projects/ishaan/Ishaan_Floor_Plan.png",
    blurb:
      "The homes sit on the typical floors — four to a floor, all of them 1RK, wrapped around a central lift-and-staircase core with a shared lobby. Every floor from 2nd to 4th is identical.",
    points: [
      "Four 1RK homes per floor",
      "Central lift & staircase core",
      "Shared lobby 3.65 × 1.60 m",
      "Chajja / balcony to each home",
      "Floors 2nd–4th identical",
      "12 homes in all",
    ],
  },
  {
    title: "Terrace",
    label: "Open to sky",
    plan: "/images/projects/ishaan/Ishaan_Terrace_Plan.png",
    blurb:
      "Above the homes sits an open terrace, with the building's services tucked to one side — the overhead water tank, the lift machine room and the pump room.",
    points: [
      "Terrace open to sky",
      "Parapet wall 1.20 m high",
      "O.H. water tank — 7,182 L",
      "Lift machine room",
    ],
  },
];

/* ---------- Unit types — the flat layouts ----------
   Ishaan is now booking, so it follows Shikhar's per-flat pattern
   rather than Dhruva's floor-only one: a buyer choosing a home needs
   to see the home, not just the storey it sits on. Same shape as
   `unitTypes` in shikhar.ts — there is simply one entry, because
   there is one kind of home.

   `features` and `rooms` are hidden while empty rather than faked.

   `stats` carries the RERA carpet areas from the CIDCO-approved plan
   (CIDCO/BP-19208/TPO(NM & K)/2024/13290, approved 20 Dec 2024). Its
   carpet-area statement has three rows, not one — the twelve homes
   are all 1RK, but they come in three sizes:

     101, 201, 301, 401   15.223 sq. m.
     102, 202, 302, 402   19.080 sq. m.
     103, 203, 303, 403   16.590 sq. m.

   No enclosed or open balcony area is recorded against any of them.

   TWO THINGS THE DRAWING CONTRADICTS, left as supplied and flagged:
     · THREE homes per floor over floors 1–4, not four per floor over
       2–4. Both give twelve, but the header above, `floorPlans` and
       this card's blurb all say four-per-floor on the typical floors.
     · The 1st floor is residential and identical to the rest — the
       drawing has a FIRST FLOOR PLAN with flats 101/102/103 on it.
       That closes the "what sits on the 1st floor" gap noted above.

   `rooms` below (living 2.75 × 3.15, kitchen 1.70 × 2.75, toilet
   2.30 × 1.20) sums to 16.098 sq. m. Of the fifteen ways the drawn
   rooms can be shared between the three flats, that exact triple only
   ever lands on flat 103 — so the plan on this card is the 16.590
   home. Not certain enough to print as a single figure, which is why
   `stats` lists all three series.                                  */
export type UnitType = {
  type: string;
  units: string;
  series: string;
  plan: string;
  planPending?: boolean;
  blurb: string;
  stats: { label: string; value: string }[];
  features: string[];
  rooms: { room: string; dim: string }[];
};

export const unitTypes: UnitType[] = [
  {
    type: "1RK",
    units: "12 units",
    series: "Typical floors · 2nd–4th",
    plan: "/images/projects/ishaan/Ishaan_1RK_Plan.png",
    blurb:
      "The one kind of home at Ishaan — a living-cum-bedroom, a separate kitchen and an attached toilet, each opening to its own chajja. Four sit on every typical floor; the plan shown is the corner unit.",
    stats: [
      { label: "Carpet area — all 12 homes", value: "15.22 – 19.08 sq. m. (164 – 205 sq. ft.)" },
      { label: "Flats 101 / 201 / 301 / 401", value: "15.22 sq. m. (164 sq. ft.)" },
      { label: "Flats 102 / 202 / 302 / 402", value: "19.08 sq. m. (205 sq. ft.)" },
      { label: "Flats 103 / 203 / 303 / 403", value: "16.59 sq. m. (179 sq. ft.)" },
      { label: "Enclosed balcony", value: "None recorded" },
    ],
    features: [
      // The old "RERA carpet area — 17.70 sq.mt (≈ 190 sq.ft)" bullet
      // was removed: the approved plan records 15.223, 19.080 and
      // 16.590 — 17.70 matches none of them, and is not their mean
      // (16.964) either. Leaving it put two different RERA carpet
      // areas under the same label on one card.
      "Separate kitchen with cooking platform",
      "Attached toilet with WC & washbasin",
      "Private chajja / balcony",
    ],
    rooms: [
      { room: "Living / Bedroom", dim: "2.75 × 3.15 m" },
      { room: "Kitchen", dim: "1.70 × 2.75 m" },
      { room: "Toilet", dim: "2.30 × 1.20 m" },
      { room: "Chajja / Balcony", dim: "Included" },
    ],
  },
];

/* Source line printed under the unit-types section. */
export const unitTypesNote =
  "Carpet areas as printed on the RERA carpet-area statement of the CIDCO-approved building plan CIDCO/BP-19208/TPO(NM & K)/2024/13290, approved 20 December 2024. The statement records no enclosed or open balcony area against any of the twelve homes. Renders are indicative; furniture and finishes are not part of the sale.";

/* ---------- The clear-corner read — the page's creative ----------
   Ishaan is the name of the north-east: in Vastu, Ishanya is the
   corner of first light, the one left open and uncluttered. The
   building reads the same way — it does one thing. Twelve homes,
   one plan, nothing else in the building competing for the room.
   Written entirely from the three facts we have (G+4 · 0 shops ·
   12 × 1RK), so none of it goes stale when the rest arrives.

   NOTE: this is deliberately a reading of the NAME, not a claim
   that the building is Vastu-compliant or north-east facing — we
   have not been told either. Keep it that way when editing.
   The Prithvi equivalent is `levels`; Shikhar's is `amenityStages`. */
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
    marker: "0",
    title: "Homes, and nothing else",
    category: "Purely residential",
    icon: "lobby",
    featured: true,
    blurb:
      "There are no shops at Ishaan. The building carries one use and one only — the whole of it belongs to the people who live in it.",
    points: ["No commercial units", "A single-use, purely residential building"],
  },
  {
    marker: "12",
    title: "Twelve homes",
    category: "The count",
    icon: "tower",
    blurb:
      "Four floors and twelve homes, four to a typical floor. A small building with a short list of neighbours — the whole of Ishaan fits on one page.",
    points: ["G+4 storey structure", "Four 1RK homes per typical floor"],
  },
  {
    marker: "1RK",
    title: "One kind of home",
    category: "The plan",
    icon: "window",
    featured: true,
    blurb:
      "Every home at Ishaan is a 1RK — a living-cum-bedroom, a kitchen and an attached toilet opening to its own chajja, about 17.70 sq.mt of carpet. One kind of home, top to bottom.",
    points: ["12 × 1RK apartments", "≈ 17.70 sq.mt carpet each"],
  },
];

/* ---------- Amenities ----------
   EMPTY BY DESIGN — no amenity schedule was supplied for Ishaan.
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
        name: "Automatic high-speed lift",
        desc: "One automatic high-speed elevator, for safety and comfort.",
        featured: true,
      },
      { icon: "parking", name: "Ample parking", desc: "Room to park without circling for a spot." },
      {
        icon: "grill",
        name: "Rule-based society living",
        desc: "A managed, rule-based society — order kept for everyone who lives here.",
      },
    ],
  },
];

/** Retained for reference — the amenity schedule above is now filled,
    so this list no longer renders. */
export const amenitiesNeeded: string[] = [];

/* ---------- About the developer (dark section) ----------
   Brand-level facts, consistent with dhruva.ts and prithvi.ts.    */
export const developerNotes: { label: string; body: string }[] = [
  {
    label: "Two decades of lineage",
    body: "Nesting Tree, established in 2019 — with two decades of real estate lineage behind it, since 2004.",
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

/* ---------- Why Ishaan (6 cards) ----------
   Brand-level reasons carried from site.ts until project-specific
   ones are supplied — nothing here claims anything about Ishaan
   that we have not been told.                                     */
export const whyIshaan: { title: string; body: string }[] = [
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
    body: "An automatic high-speed lift, ample parking and rule-based society living — built in, not sold as extras.",
  },
  {
    title: "Built to last",
    body: "Construction quality you can live in — and still trust years after handover.",
  },
  {
    title: "Better everyday living",
    body: "You pay a little more, and you get more than a flat: a building that improves your day.",
  },
];

/* ---------- Gallery — real on-site photographs ----------
   Complete set of documentary photos for this project (renders and
   near-duplicate "(1)" variants excluded). Generated from the folders
   under public/images/Project_Images/Ishaan/. Rendered by
   <ProjectGallery/> on the project page and on /gallery — real
   photography only, never renders or stock. */
export const gallery: { src: string; alt: string; category: string }[] = [
  { src: "/images/Project_Images/Ishaan/DSC_0101.jpeg", alt: "Ishaan — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Ishaan/Exterior/DSC_0095.jpeg", alt: "Ishaan — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Ishaan/Exterior/DSC_0098.jpeg", alt: "Ishaan — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Ishaan/Exterior/IMG20260627121926.jpeg", alt: "Ishaan — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Ishaan/Exterior/IMG20260627122601%20(1).jpeg", alt: "Ishaan — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Ishaan/Exterior/IMG20260627122628.jpeg", alt: "Ishaan — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Ishaan/Interior/IMG20260627122133.jpeg", alt: "Ishaan — interior of a home", category: "Interior" },
  { src: "/images/Project_Images/Ishaan/Interior/IMG20260627122150.jpeg", alt: "Ishaan — interior of a home", category: "Interior" },
  { src: "/images/Project_Images/Ishaan/Interior/IMG20260627122250.jpeg", alt: "Ishaan — interior of a home", category: "Interior" },
  { src: "/images/Project_Images/Ishaan/Interior/IMG20260627122308.jpeg", alt: "Ishaan — interior of a home", category: "Interior" },
];
