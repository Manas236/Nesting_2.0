/* ============================================================
   Shaurya — project detail page content
   Single source of truth for the Shaurya by Nesting Tree page.
   A delivered, fully sold-out, purely residential G+4 building
   on a CORNER PLOT — 8 homes in all (4 × 1BHK + 4 × 1RK), no
   shops, one automatic high-speed elevator. Tone is "delivered
   & proven", not "now booking". Edit facts, figures and copy
   here; the page at src/pages/projects/shaurya.astro reads
   everything from this file.

   STATUS: completed, handed over and completely sold out.
   Society formation is in progress. No RERA certification was
   taken — the project runs on its Commencement (CC) and
   Occupancy (OC) Certificates — so nothing here claims MahaRERA
   registration.

   Now supplied (from the render set added Jul 2026):
     · Plot No. 74, on an 11 m wide road    → shaurya.address
     · Sector R2 and pincode 410206         → shaurya.address
     · 1BHK carpet area (19.316 sq.m)        → unitTypes[0].features
     · Ground / typical-floor / terrace plans → floorPlans
     · Two overhead water tanks (5,040 + 7,875 L) → amenityGroups

   Room dimensions were supplied too, and were shown here until
   11 Aug 2026, when the owner's instruction #9 took room dimensions
   off every project page. They are not missing — they are withdrawn.

   Still outstanding (renders as "Insufficient information"):
     · A dedicated 1RK layout render (the 1RK is shown within the
       typical-floor plan; its own unit card image stays pending)
     · Interior finishing spec (tiles, fittings, windows)

   Icon keys reference the line-icon set defined inside the page.
   ============================================================ */

/** Marks a field we have not been given. Rendered as a muted
    placeholder, never as a fact. Delete the TBD once you fill it in. */
export const TBD = "Insufficient information";

export const shaurya = {
  name: "Shaurya",
  status: "Completed",
  // No RERA certification taken — project runs on its CC & OC certificates.
  // Kept as TBD so the hero's MahaRERA pill stays hidden; the real approval
  // status is shown as a fact in `overview.facts` and the footer (`approvals`).
  maharera: TBD,
  approvals: "Commencement (CC) & Occupancy (OC) Certificates obtained",
  tagline:
    "A completed, sold-out G+4 on a corner plot: eight purely residential homes, delivered and handed over.",
  // Standard hero address format: Plot, Sector, Karanjade, Panvel, Pincode.
  // Plot number from the ground-floor plan. Complete — sector and pincode
  // have both been supplied since; the note that used to sit here said
  // they were outstanding and the segment was omitted, which the line
  // directly below it contradicted.
  address: "Plot no. 74, Sector R2, Karanjade, Panvel, 410206",
  hero: "/images/projects/shaurya/Shaurya_Elevation.png",
  heroPosition: "center 25%",
  // extra status pills shown alongside the "Completed" pill in the hero
  pills: ["All flats sold", "Society forming"],
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Shaurya+Nesting+Tree+Karanjade+Panvel+Navi+Mumbai",
};

/* ---------- Sales / office contact ----------
   Moved to src/data/site.ts on 11 Aug 2026. Vipin is the single point of
   contact for every project, so the block is defined once there and
   shaurya.astro imports it from site.ts. Do not re-add it here. */

/* ---------- Headline stats band (4 figures) ---------- */
export const heroStats = [
  { figure: "G+4", label: "Storeys" },
  { figure: "8", label: "Homes" },
  { figure: "1", label: "High-speed lift" },
  { figure: "Corner", label: "Plot" },
];

/* ---------- Overview ---------- */
export const overview = {
  intro:
    "A G+4 residential building on a corner plot. Eight homes in all, four 1BHK apartments and four 1RK homes, with no shops and a single automatic high-speed elevator. Completed, handed over and fully sold out, with the residents' society now being formed.",
  facts: [
    { label: "Status", value: "Completed & handed over" },
    { label: "Sales", value: "Completely sold out" },
    { label: "Structure", value: "G+4 storey · corner plot" },
    { label: "Configuration", value: "8 residential homes — 4 × 1BHK + 4 × 1RK" },
    { label: "Retail", value: "None — purely residential" },
    { label: "Vertical transport", value: "1 automatic high-speed elevator" },
    { label: "Approvals", value: "Commencement (CC) & Occupancy (OC) Certificates obtained" },
    { label: "Society", value: "Formation in progress" },
    { label: "Parking", value: "Stilt parking at the base of the building" },
    { label: "Frontage", value: "Plot No. 74 · on an 11 m wide road" },
    { label: "Address", value: shaurya.address },
  ],
  unitMix: [
    { figure: "8", label: "Total homes" },
    { figure: "4", label: "1BHK apartments" },
    { figure: "4", label: "1RK homes" },
    { figure: "1", label: "Automatic lift" },
  ],
  connectivity:
    "Shaurya sits on a corner plot in Karanjade, a fast-growing residential pocket of Navi Mumbai with strong road connectivity across the Mumbai–Pune corridor and the wider Navi Mumbai area.",
};

/* ---------- Unit types — the home layouts ----------
   `plan` points at the placeholder SVGs that already ship in
   public/images/projects/shaurya/; `planPending` flags them on the
   page so a placeholder never reads as a plan. `features` is hidden
   while empty rather than faked.

   `stats` carries the RERA carpet areas from the CIDCO-approved plan
   (CIDCO/BP-18395/TPO(NM & K)/2023/12046, approved 6 Mar 2024). Its
   carpet-area statement has just two rows — two homes on each of
   floors 1 to 4, which is the 8 units in the occupant-load table and
   the water-storage calculation:

     101, 201, 301, 401   19.316 sq. m.   no enclosed balcony
     102, 202, 302, 402   23.845 sq. m.   no enclosed balcony

   SERIES LABELS BELOW ARE THE WRONG WAY ROUND — left as supplied,
   flagged for the owner. The drawing puts the bedroom in the LARGER
   home: the light-and-ventilation table sums living 9.360 + bedroom
   5.460 + kitchen 4.000 + WC 1.200 + bath 1.500 = 21.520 sq. m. of
   rooms, which cannot sit inside 19.316 sq. m. of carpet. Against
   23.845 it leaves 2.33 sq. m. for internal walls and the entry
   passage — and the 1RK's rooms (17.215) against 19.316 leave 2.10,
   the same allowance. So the 1BHK is flat 102 and the 1RK is flat
   101, not the reverse. `stats` uses the correct pairing; `series`
   still says otherwise until the owner confirms the swap.        */
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
    units: "4 homes",
    series: "Flat 101 · one per floor",
    plan: "/images/projects/shaurya/Shaurya_1BHK_Plan.png",
    blurb:
      "Four of Shaurya's eight homes are one-bedroom apartments, flat 101 on each floor. A separate bedroom, its own kitchen and a living room opening onto a private balcony.",
    stats: [
      { label: "Carpet area", value: "23.85 sq. m. (257 sq. ft.)" },
      { label: "Enclosed balcony", value: "None — open balcony only" },
      { label: "Homes of this type", value: "4 of 8" },
    ],
    features: [
      // The old "Carpet area — 19.316 sq.m (≈ 208 sq.ft)" bullet was
      // removed: 19.316 is the 1RK's carpet, and leaving it here put
      // two different carpet areas under the same label on one card.
      "Private balcony off the living room",
      "Separate bedroom & kitchen",
      "Chajja weather projections over the windows",
    ],
  },
  {
    type: "1RK",
    units: "4 homes",
    series: "Flat 102 · one per floor",
    // Shaurya_1RK_Plan.png is a typical-floor render rather than a
    // single-unit one — the 1RK reads as the flat with the 4.20 × 2.60
    // living room, shown alongside the 1BHK.
    plan: "/images/projects/shaurya/Shaurya_1RK_Plan.png",
    blurb:
      "The other four homes are efficient 1RK layouts, flat 102 on each floor. Compact, single-room living with a full 4.2-metre living room, and a bath and WC kept separate.",
    stats: [
      { label: "Carpet area", value: "19.32 sq. m. (208 sq. ft.)" },
      { label: "Enclosed balcony", value: "None — open balcony only" },
      { label: "Homes of this type", value: "4 of 8" },
    ],
    features: [
      "Separate bath and WC",
      "Full-width 4.2 m living room",
      "Chajja weather projections over the windows",
    ],
  },
];

/* Source line printed under the unit-types section. */
export const unitTypesNote =
  "Carpet areas as printed on the RERA carpet-area statement of the CIDCO-approved building plan CIDCO/BP-18395/TPO(NM & K)/2023/12046, approved 6 March 2024. The statement records no enclosed-balcony area against either home. Renders are indicative; furniture and finishes are not part of the sale.";

/* ---------- Floor plans ----------
   All three drawings supplied as real renders (Jul 2026), so none
   carry `planPending`. Dimensions are as drawn — the Shaurya set is
   drawn in METRES at 1:100, unlike Prithvi's foot-inch drawings.
   The page at src/pages/projects/shaurya.astro maps this array. */
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
    label: "Stilt parking & the building core",
    plan: "/images/projects/shaurya/Shaurya_Ground_Plan.png",
    blurb:
      "No shops and no homes at street level. The ground floor is given over to the residents. Stilt parking fills the plot behind a sliding gate, with the lift, staircase, lobby and machine room held at the back.",
    points: [
      "Stilt parking for residents",
      "Sliding gate off an 11 m wide road",
      "Lift + staircase core",
      "Lobby — 2.50 × 2.10 m",
      "Machine room",
      "Common toilet & W.C.",
    ],
  },
  {
    title: "Typical floor",
    label: "Residential — floors 1 to 4",
    plan: "/images/projects/shaurya/Shaurya_Floor_Plan.png",
    blurb:
      "Two homes to a floor, four floors over. That is the whole building. Flat 101 is the 1BHK and flat 102 the 1RK, both reached off a small shared lobby at the lift.",
    points: [
      "2 homes per floor — 1BHK + 1RK",
      "Flat 101 — 1BHK with balcony",
      "Flat 102 — 1RK",
      "Shared lobby — 1.50 × 2.25 m",
      "1 automatic high-speed lift",
      "8 homes across floors 1–4",
    ],
  },
  {
    title: "Terrace",
    label: "Above the fourth floor",
    plan: "/images/projects/shaurya/Shaurya_Terrace_Plan.png",
    blurb:
      "An open terrace over the whole footprint, with the building's water storage and lift machinery tucked into one corner and planters run along the parapet.",
    points: [
      "Open terrace",
      "O.H. water tank — 5,040 litres (domestic)",
      "O.H. water tank — 7,875 litres (domestic)",
      "Lift machine room",
      "Planters along the parapet",
    ],
  },
];

/* ---------- The valour read — the page's creative ----------
   Shaurya (शौर्य) means valour. The section reads the NAME the same
   way Prithvi reads "earth" and Ishaan reads the north-east corner:
   a building shows courage not in what it promises but in what it
   stands behind. Written entirely from the facts we have (G+4 ·
   corner plot · 8 homes = 4 × 1BHK + 4 × 1RK · purely residential ·
   completed & sold out), so none of it goes stale.

   NOTE: this is a reading of the NAME, not a claim beyond the facts.
   Keep it that way when editing. The Prithvi equivalent is `levels`;
   Ishaan's is also `levels`.                                       */
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
    marker: "8",
    title: "Eight homes, no more",
    category: "Purely residential",
    icon: "lobby",
    featured: true,
    blurb:
      "Shaurya carries no shops. Eight homes (four 1BHK and four 1RK), and the whole of the building belongs to the families who live in it.",
    points: ["8 homes — 4 × 1BHK + 4 × 1RK", "No commercial units — purely residential"],
  },
  {
    marker: "G+4",
    title: "It holds the corner",
    category: "The stance",
    icon: "tower",
    blurb:
      "Four floors on a corner plot, a small building that takes a prominent, exposed position and owns it, with one automatic high-speed lift serving every floor.",
    points: ["G+4 structure on a corner plot", "One automatic high-speed elevator"],
  },
  {
    marker: "100%",
    title: "Courage, proven",
    category: "Delivered & sold",
    icon: "star",
    featured: true,
    blurb:
      "Shaurya means valour, and here that shows not in a promise but in a finished building: completed, handed over, and every home sold.",
    points: ["Completed & handed over", "Completely sold out"],
  },
];

/* ---------- Amenities — the page's hero USP ----------
   Filled from the amenity list supplied for Shaurya. Two groups
   only: the paperwork/ownership story and the building itself.
   No interior-finishing spec was supplied, so that group is
   deliberately omitted rather than borrowed from another project.
   `featured` items render as larger, accent-treated tiles.       */
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
    caption: "What stands behind the purchase.",
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
        desc: "Purchase from a builder with delivered, handed-over projects in Karanjade, Navi Mumbai.",
      },
      {
        icon: "lobby",
        name: "100% owner-occupied",
        desc: "No local gaonwala and no 50:50 agreement. Every apartment bought by a family to live in, not to rent.",
      },
      {
        icon: "window",
        name: "Direct from the landowner",
        desc: "No tri-party agreement, purchased directly from the landowner. The strongest paperwork, with no legal hassles.",
      },
    ],
  },
  {
    group: "Building & society",
    caption: "A quiet, purely residential corner-plot home.",
    items: [
      {
        icon: "elevator",
        name: "Automatic high-speed elevator",
        desc: "One automatic high-speed elevator, for safety and comfort.",
        featured: true,
      },
      {
        icon: "parking",
        name: "Ample parking",
        desc: "Stilt parking at the base of the building, with room to park without circling for a spot.",
      },
      {
        icon: "tower",
        name: "Purely residential",
        desc: "Eight homes and no shops: a quiet, wholly residential building on a corner plot.",
      },
      {
        icon: "rooftop",
        name: "Open terrace",
        desc: "An open terrace over the full footprint, with planters along the parapet.",
      },
      {
        icon: "waterproof",
        name: "12,915 litres of water storage",
        desc: "Two overhead domestic tanks, 5,040 and 7,875 litres, feeding every home below.",
      },
      {
        icon: "grill",
        name: "Rule-based society living",
        desc: "A managed, rule-based society. Order kept for everyone who lives here.",
      },
    ],
  },
];

/** Retained for parity with the prithvi/ishaan pattern — the amenity
    schedule above is filled, so the "Still needed" fallback panel on
    the page never renders. Left empty on purpose. */
export const amenitiesNeeded: string[] = [];

/* ---------- About the developer (dark section) — REMOVED 12 Aug 2026 ----------
   Owner's review point #11: "Projects page — remove the about the developer
   section." The dark band it fed is gone from this project page, and the same
   removal was made on all seven. `developerNotes` went with it rather than
   being left as an unread export; git has the wording if it is ever wanted
   back. Shikhar's equivalent block ("The Nesting Tree advantage") was removed
   in the same commit, so no project page now sells the company. */

/* ---------- Why Shaurya (6 cards) ---------- */
export const whyShaurya: { title: string; body: string }[] = [
  {
    title: "Delivered & handed over",
    body: "Shaurya is complete; every home handed over to its buyer.",
  },
  {
    title: "Completely sold out",
    body: "All eight homes at Shaurya are fully sold.",
  },
  {
    title: "Society forming",
    body: "The residents' society is being formed to manage the building day-to-day.",
  },
  {
    title: "100% owner-occupied",
    body: "No gaonwala and no 50:50. Every home bought by a family to live in, not to rent.",
  },
  {
    title: "Clean, direct paperwork",
    body: "Bought straight from the landowner with no tri-party agreement: strong paperwork, no legal hassles.",
  },
  {
    title: "Purely residential corner plot",
    body: "Eight homes, no shops, and an automatic high-speed lift on a corner plot.",
  },
];

/* ---------- Gallery — real on-site photographs ----------
   Complete set of documentary photos for this project (renders and
   near-duplicate "(1)" variants excluded). Rendered by <ProjectGallery/>
   on the project page and on /gallery — real photography only, never
   renders or stock.

   Filenames, alt text and the width/height pairs are GENERATED by
   `node scripts/optimise-project-images.mjs shaurya`, which reads
   scripts/alt-text/shaurya.tsv. Edit the alt text there, not here, or the
   next run overwrites it. Files live under public/images/projects/shaurya/
   photos/, each with a 640 px `-640.webp` companion that ProjectGallery
   puts in the srcset; `src` below is the full size the lightbox opens.

   The old camera-named paths still resolve — see src/lib/image-redirects.ts. */
export const gallery: { src: string; alt: string; category: string; width?: number; height?: number }[] = [
  { src: "/images/projects/shaurya/photos/shaurya-exterior-01.webp", alt: "The cream elevation behind its yellow boundary railing, name board on the parapet above — Shaurya, Karanjade", category: "Exterior", width: 1066, height: 1600 },
  { src: "/images/projects/shaurya/photos/shaurya-exterior-02.webp", alt: "Seen along the street past the lamp post, the neighbours crowding in on either side — Shaurya, Karanjade", category: "Exterior", width: 1600, height: 1224 },
  { src: "/images/projects/shaurya/photos/shaurya-exterior-03.webp", alt: "The corner of the building from the roadside, balconies stacked above the yellow railing — Shaurya, Karanjade", category: "Exterior", width: 1200, height: 1600 },
  { src: "/images/Project_Images/Shaurya/IMG20260627134928.jpeg", alt: "Shaurya — exterior of the building", category: "Exterior" },
  { src: "/images/projects/shaurya/photos/shaurya-aerial-view-01.webp", alt: "Apartment blocks close below, the airfield and the hills laid out behind them — Shaurya, Karanjade", category: "Aerial view", width: 1600, height: 1066 },
  { src: "/images/projects/shaurya/photos/shaurya-aerial-view-02.webp", alt: "An airliner descending over the packed rooftops and water tanks of the town — Shaurya, Karanjade", category: "Aerial view", width: 1600, height: 1066 },
  { src: "/images/projects/shaurya/photos/shaurya-aerial-view-03.webp", alt: "An airliner high over a hazy skyline of rooftops, tower cranes standing among the far blocks — Shaurya, Karanjade", category: "Aerial view", width: 1600, height: 1072 },
  { src: "/images/projects/shaurya/photos/shaurya-aerial-view-04.webp", alt: "Mid-rise blocks along the street below, the airfield beyond them and an aircraft passing above — Shaurya, Karanjade", category: "Aerial view", width: 1600, height: 1066 },
  { src: "/images/projects/shaurya/photos/shaurya-aerial-view-05.webp", alt: "An airliner over the terminal pier and its jet bridges, water tanks on the rooftops below — Shaurya, Karanjade", category: "Aerial view", width: 1600, height: 1034 },
  { src: "/images/projects/shaurya/photos/shaurya-aerial-view-06.webp", alt: "Straight down into the street between the blocks, cars parked along it and trees in the gaps — Shaurya, Karanjade", category: "Aerial view", width: 1050, height: 1400 },
  { src: "/images/projects/shaurya/photos/shaurya-corridor-01.webp", alt: "Two flat doors off a plain white landing, one garlanded, handprints marked on the wall — Shaurya", category: "Corridor", width: 1600, height: 1200 },
  { src: "/images/projects/shaurya/photos/shaurya-parking-01.webp", alt: "The ramp and railing up to the lift and stairs, checkered tiles across the parking level — Shaurya", category: "Parking", width: 1600, height: 1200 },
  { src: "/images/projects/shaurya/photos/shaurya-parking-02.webp", alt: "Motorcycles under the building beside the yellow timber fence, the trees just beyond it — Shaurya", category: "Parking", width: 1600, height: 1200 },
  { src: "/images/projects/shaurya/photos/shaurya-parking-03.webp", alt: "Motorcycles parked between the columns on the checkered tiled parking floor — Shaurya", category: "Parking", width: 1600, height: 1200 },
  { src: "/images/projects/shaurya/photos/shaurya-rooftop-01.webp", alt: "Tiled rooftop deck between curved parapet walls, a dish antenna and the neighbours beyond — Shaurya, Karanjade", category: "Rooftop", width: 1600, height: 1200 },
];
