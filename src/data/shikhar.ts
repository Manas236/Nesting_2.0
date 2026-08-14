/* ============================================================
   Shikhar — project detail page content
   Single source of truth for the Shikhar by Nesting Tree page.
   Edit facts, figures, copy and statuses here; the page at
   src/pages/projects/shikhar.astro reads everything from this file.

   Icon keys reference the line-icon set defined inside the page.
   ============================================================ */

export const shikhar = {
  name: "Shikhar",
  status: "Ongoing",
  maharera: "PM1270002502760",
  tagline: "A landmark residential tower, the tallest building in the neighbourhood.",
  address:
    "Plot no. 73, Sector R2, Karanjade, Panvel, 410206",
  hero: "/images/projects/ShikharElevationFinal.webp",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Shikhar+Nesting+Tree+Karanjade+Panvel+Navi+Mumbai",
};

/* ---------- Sales / office contact ----------
   Moved to src/data/site.ts on 11 Aug 2026. Vipin is the single point of
   contact for every project, so the block is defined once there and
   shikhar.astro imports it from site.ts. Do not re-add it here. */

/* ---------- Headline stats band (4 figures) ---------- */
export const heroStats = [
  { figure: "G+10", label: "Floors" },
  { figure: "66", label: "Total units" },
  { figure: "3", label: "Elevators" },
  { figure: "20+", label: "Years' experience" },
];

/* ---------- Overview ---------- */
export const overview = {
  intro:
    "Tallest building in the neighbourhood · corner plot · G+10 storeys, with 66 homes and shops thoughtfully laid out across the tower.",
  facts: [
    { label: "Status", value: "Building ready, internal work in full swing" },
    { label: "Structure", value: "G+10 storey" },
    { label: "Configuration", value: "4 to 6 flats per floor" },
    { label: "MahaRERA No.", value: "PM1270002502760" },
  ],
  unitMix: [
    { figure: "37", label: "1BHK apartments" },
    { figure: "18", label: "1RK apartments" },
    { figure: "3", label: "1BHK + Terrace" },
    { figure: "8", label: "Commercial shops" },
  ],
  connectivity:
    "Shikhar sits on a corner plot in Karanjade, a fast-growing residential pocket of Navi Mumbai with strong road connectivity across the Mumbai–Pune corridor and the wider Navi Mumbai area.",
};

/* ---------- Unit types (3, each with a floor-plan render) ----------
   `stats` carries the RERA carpet areas printed on the CIDCO-approved
   building plan (CIDCO/BP-18416/TPO(NM & K)/2023/12230, approved
   22 Mar 2024). Its carpet-area statement lists one row per unit
   series, and the series map to the types below:

     Series 1  101 … 1001   29.647 sq. m. + 2.775 encl. balcony
     Series 2  102          29.782 + 2.775   (first floor, marginally
               202 … 1002   29.647 + 2.775    larger than the stack)
     Series 3  103 … 1003   29.034 + 2.800
     Series 4  104 … 1004   29.773 + 2.800
     Series 5  205 … 1005   19.439 + 2.600
     Series 6  206 … 1006   20.673, no balcony

   Series 1–4 are the 1BHK homes (three of them, on the first floor,
   carry the wrapping terrace); series 5 and 6 are the 1RK homes,
   9 units each. 58 flats in total, plus the 8 shops = 66 units.

   `stats` prints ONE figure per row rather than the range across the
   series — a range reads as uncertainty on a sales page. Each is the
   mean over the homes of that type, weighted by unit count:

     1BHK carpet   (10×29.647 + 29.782 + 9×29.647 + 10×29.034
                    + 10×29.773) / 40                 = 29.53 sq. m.
     1BHK balcony  (2.775 + 2.775 + 2.800 + 2.800) / 4 = 2.79
     1BHK carpet + balcony = 29.53 + 2.79             = 32.32
     1RK  carpet   (19.439 + 20.673) / 2              = 20.06

   Dropping the three terrace homes out of the 1BHK count leaves the
   mean at 29.53 either way, so the same figure serves both cards.
   The sq. ft. restatement is converted from the rounded metric figure
   so the two numbers on a cell always agree. The averaging is
   disclosed in `unitTypesNote` below.                             */
export type UnitType = {
  type: string;
  units: string;
  series: string;
  plan: string;
  blurb: string;
  stats: { label: string; value: string }[];
  /* There is deliberately no `features` field. The green-tick feature
     list was removed from every project page on the owner's
     instruction — a ticked bullet reads as a promise about the
     delivered flat, and the flat is what the approved plan and the
     agreement say it is. Do not add one back. */
};

export const unitTypes: UnitType[] = [
  {
    type: "1BHK",
    units: "37 units",
    series: "Series 1 · Modern apartment",
    plan: "/images/projects/shikhar/plan-1bhk.jpg",
    blurb:
      "A separate bedroom for privacy, a dual-toilet layout and abundant natural light. The most popular choice at Shikhar.",
    stats: [
      { label: "Carpet area", value: "29.53 sq. m. (318 sq. ft.)" },
      { label: "Enclosed balcony", value: "2.79 sq. m. (30 sq. ft.)" },
      { label: "Carpet + balcony", value: "32.32 sq. m. (348 sq. ft.)" },
      { label: "Homes of this type", value: "37 of 58" },
    ],
  },
  {
    type: "1RK",
    units: "18 units",
    series: "Series 6 · Studio apartment",
    plan: "/images/projects/shikhar/plan-1rk.jpg",
    blurb:
      "Compact luxury living with a space-saving design, dedicated functional zones, integrated storage and abundant natural light.",
    stats: [
      { label: "Carpet area", value: "20.06 sq. m. (216 sq. ft.)" },
      { label: "Enclosed balcony", value: "2.60 sq. m. (28 sq. ft.) — series 5 only" },
      { label: "Homes of this type", value: "18 of 58" },
    ],
  },
  {
    type: "1BHK + Terrace",
    units: "3 units",
    series: "Series 3 · Unique terrace apartment",
    plan: "/images/projects/shikhar/plan-1bhk-terrace.jpg",
    blurb:
      "Exclusive homes wrapped by a large private terrace, with high-end luxury finishes and a separate bedroom. Limited availability.",
    stats: [
      { label: "Carpet area", value: "29.03 sq. m. (312 sq. ft.)" },
      { label: "Enclosed balcony", value: "2.80 sq. m. (30 sq. ft.)" },
      { label: "Wrapping terrace", value: "355.66 sq. ft." },
      { label: "Homes of this type", value: "3 of 58" },
    ],
  },
];

/* Source line printed under the unit-types section. */
export const unitTypesNote =
  "Carpet areas from the CIDCO-approved building plan CIDCO/BP-18416/TPO(NM & K)/2023/12230, approved 22 March 2024. Each figure is the average across that layout's homes, which vary slightly from series to series; the area of a particular flat is the one printed on the approved plan and stated in its agreement. Renders are indicative; furniture and finishes are not part of the sale.";

/* ---------- Amenities — the page's hero USP ----------
   `featured` items are rendered as larger, accent-treated tiles.
   `icon` keys map to the line-icon set in the page.            */
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
    group: "Building",
    caption: "The structure itself, built to stand out.",
    items: [
      {
        icon: "tower",
        name: "G+10 — tallest in the neighbourhood",
        desc: "The highest skyline address in Karanjade, with presence nothing nearby can match.",
        featured: true,
      },
      {
        icon: "elevator",
        name: "3 high-speed automatic elevators",
        desc: "Three automatic lifts keep wait times short, even at peak hours.",
        featured: true,
      },
      {
        icon: "stretcher",
        name: "1 stretcher elevator",
        desc: "A dedicated stretcher lift for medical and emergency access.",
      },
      {
        icon: "lobby",
        name: "Spacious lobby & common areas",
        desc: "Wide, well-lit shared spaces that make every arrival feel considered.",
      },
      {
        icon: "parking",
        name: "Ample 2W & 4W parking",
        desc: "Generous two- and four-wheeler parking for residents and guests.",
      },
      {
        icon: "contract",
        name: "No tri-party agreement",
        desc: "Buy directly from the plot owner. No third party in between.",
      },
    ],
  },
  {
    group: "Lifestyle",
    caption: "Space to live, gather and unwind.",
    items: [
      {
        icon: "gym",
        name: "Fully equipped gymnasium",
        desc: "A complete in-house gym, so your workout never leaves the building.",
        featured: true,
      },
      {
        icon: "rooftop",
        name: "Rooftop amenities for gatherings",
        desc: "An open rooftop made for evenings, festivals and the whole building.",
        featured: true,
      },
      {
        icon: "people",
        name: "Multi-purpose common room",
        desc: "A flexible community space for celebrations, meetings and gatherings.",
      },
      {
        icon: "deck",
        name: "Large decks in select apartments",
        desc: "Oversized private decks that extend your living space outdoors.",
      },
      {
        icon: "star",
        name: "Premium lobby",
        desc: "A hotel-grade entrance that sets the tone the moment you walk in.",
      },
    ],
  },
  {
    group: "Interiors",
    caption: "Branded finishes, fitted as standard.",
    items: [
      {
        icon: "tiles",
        name: "Branded vitrified tile flooring",
        desc: "Branded vitrified tiles throughout for a clean, durable finish.",
      },
      {
        icon: "faucet",
        name: "Branded bathroom fittings",
        desc: "Name-brand sanitaryware and fittings in every bathroom.",
      },
      {
        icon: "window",
        name: "UPVC windows",
        desc: "Sound-insulating UPVC windows that keep the city outside.",
      },
      {
        icon: "grill",
        name: "External grills",
        desc: "Factory-fitted external grills for safety on every opening.",
      },
      {
        icon: "bolt",
        name: "All electric fittings",
        desc: "Complete electrical fittings pre-installed and ready to use.",
      },
      {
        icon: "waterproof",
        name: "Water-proofing guarantee",
        desc: "A water-proofing guarantee that backs the build for years.",
      },
    ],
  },
];

/* ---------- Amenity climb — "ride the peak" milestones ----------
   The 17 amenities above, curated into 6 stages that read as a climb
   from the base (B1) to the summit (G+10). Each stage is one waypoint
   on the mountain trail and one panel on the right. `at` is the marker
   position as a percentage of the pinned image (x from left, y from
   top) — tune these to wherever the ridge sits in your photo.
   `featured` shows the Signature flag; `points` lists the amenities
   folded into that stage.                                          */
export type AmenityStage = {
  floor: string;
  stage: string;
  category: string;
  blurb: string;
  icon: string;
  featured?: boolean;
  /* There is deliberately no `points` field. The green-tick lists
     were removed from every project page on the owner's instruction —
     a ticked bullet reads as a promise about the delivered building,
     and the building is what the approved plan and the agreement say
     it is. Do not add one back. */
  at: { x: number; y: number };
};

export const amenityStages: AmenityStage[] = [
  {
    floor: "B1",
    stage: "Built to last",
    category: "Foundation",
    icon: "waterproof",
    blurb: "Before anything rises, the promises that protect it: backed in writing, bought straight from the owner.",
    at: { x: 10.3, y: 92.3 },
  },
  {
    floor: "01",
    stage: "Strong foundation",
    category: "Structure",
    icon: "tower",
    featured: true,
    blurb: "The tallest structure in Karanjade, with the vertical transport a G+10 landmark demands.",
    at: { x: 21.5, y: 76.0 },
  },
  {
    floor: "03",
    stage: "Modern interiors",
    category: "Interiors",
    icon: "tiles",
    blurb: "Branded finishes fitted as standard, the details you live with every day, done right.",
    at: { x: 22.9, y: 60.7 },
  },
  {
    floor: "05",
    stage: "Community living",
    category: "Shared spaces",
    icon: "people",
    blurb: "Wide, considered common areas that make the building feel shared, not just stacked.",
    at: { x: 28.7, y: 47.1 },
  },
  {
    floor: "08",
    stage: "Lifestyle spaces",
    category: "Lifestyle",
    icon: "gym",
    featured: true,
    blurb: "Room to move and unwind without leaving home, from the gym floor to your own deck.",
    at: { x: 27.8, y: 31.3 },
  },
  {
    floor: "10",
    stage: "Rooftop amenities",
    category: "The summit",
    icon: "rooftop",
    featured: true,
    blurb: "An open rooftop made for evenings, festivals and the whole building: the peak of Shikhar.",
    at: { x: 33.6, y: 18.9 },
  },
];

/* ---------- Construction / build progress ----------
   Reflects the live status: structure complete (all slabs cast, terrace
   ready) and finishing works — tiling, plaster, paint — underway.
   `state` drives the stepper styling in the page.               */
export const buildProgress: {
  phase: string;
  detail: string;
  state: "done" | "current" | "upcoming";
}[] = [
  {
    phase: "Foundation",
    detail: "Excavation and foundation cast, set on a corner plot.",
    state: "done",
  },
  {
    phase: "RCC structure",
    detail: "The full G+10 frame is complete: every slab cast, terrace ready.",
    state: "done",
  },
  {
    phase: "Finishing works",
    detail: "Tiling, plaster and paint in full swing across the floors.",
    state: "current",
  },
  {
    phase: "Fittings & fit-out",
    detail: "Branded flooring, fittings and final finishes.",
    state: "upcoming",
  },
  {
    phase: "Handover",
    detail: "Possession, registration and keys.",
    state: "upcoming",
  },
];

/* ---------- Safety & emergency systems (dark section) ---------- */
export const emergencySystems: { icon: string; name: string }[] = [
  { icon: "flame", name: "Proven fire-fighting system" },
  { icon: "sprinkler", name: "Sprinkler system in common areas" },
  { icon: "alarm", name: "Public alarm warning system" },
  { icon: "cctv", name: "CCTV cameras for access control" },
];

export const safetyCards: { icon: string; name: string; desc: string }[] = [
  {
    icon: "refuge",
    name: "Refuge areas",
    desc: "Designated safe zones on every floor.",
  },
  {
    icon: "firedoor",
    name: "Fire-retardant doors",
    desc: "Fire-rated doors in the lobby & stairwells.",
  },
  {
    icon: "stairs",
    name: "Extra fire staircase",
    desc: "An additional dedicated emergency staircase.",
  },
  {
    icon: "cctv",
    name: "CCTV surveillance",
    desc: "24/7 coverage of common areas & entries.",
  },
];

/* ---------- The Nesting Tree advantage (6 cards) — REMOVED 12 Aug 2026 ----------
   Owner's review point #11: "Projects page — remove the about the developer
   section." Six project pages carried a band literally headed "About the
   developer"; Shikhar carried this one instead — same job, different title —
   so it went with them and no project page now sells the company. `advantages`
   went with it rather than being left as an unread export; git has the six
   cards if they are ever wanted back. */

/* ---------- Gallery — real on-site photographs ----------
   Complete set of documentary photos for this project (renders and
   near-duplicate "(1)" variants excluded). Rendered by <ProjectGallery/>
   on the project page and on /gallery — real photography only, never
   renders or stock.

   Filenames, alt text and the width/height pairs are GENERATED by
   `node scripts/optimise-project-images.mjs shikhar`, which reads
   scripts/alt-text/shikhar.tsv. Edit the alt text there, not here, or the
   next run overwrites it. Files live under public/images/projects/shikhar/
   photos/, each with a 640 px `-640.webp` companion that ProjectGallery
   puts in the srcset; `src` below is the full size the lightbox opens.

   The old camera-named paths still resolve — see src/lib/image-redirects.ts. */
export const gallery: { src: string; alt: string; category: string; width?: number; height?: number }[] = [
  { src: "/images/projects/shikhar/photos/shikhar-exterior-01.webp", alt: "The tower under scaffolding and green safety netting, its curved crown against the sky — Shikhar, Karanjade", category: "Exterior", width: 1066, height: 1600 },
  { src: "/images/projects/shikhar/photos/shikhar-exterior-02.webp", alt: "Seen from the street corner past the trees: scaffolding, green netting and the site hoarding — Shikhar, Karanjade", category: "Exterior", width: 1600, height: 1066 },
  { src: "/images/projects/shikhar/photos/shikhar-exterior-03.webp", alt: "The full height of the building under scaffolding, netting billowing from the upper floors — Shikhar, Karanjade", category: "Exterior", width: 1066, height: 1600 },
  { src: "/images/projects/shikhar/photos/shikhar-exterior-04.webp", alt: "The netted tower from across the road, red site hoarding at its base and an autorickshaw waiting — Shikhar, Karanjade", category: "Exterior", width: 1600, height: 1200 },
  { src: "/images/projects/shikhar/photos/shikhar-aerial-view-01.webp", alt: "A freight train on the line below the wooded hillside, apartment blocks along its foot — Shikhar, Karanjade", category: "Aerial view", width: 1600, height: 1066 },
  { src: "/images/projects/shikhar/photos/shikhar-aerial-view-02.webp", alt: "Container wagons standing on the railway line, apartment blocks and the green hillside behind — Shikhar, Karanjade", category: "Aerial view", width: 1600, height: 1066 },
  { src: "/images/projects/shikhar/photos/shikhar-aerial-view-03.webp", alt: "Traffic crossing the flyover beneath the quarried cliff face, container wagons on the line below — Shikhar, Karanjade", category: "Aerial view", width: 1600, height: 1066 },
  { src: "/images/projects/shikhar/photos/shikhar-aerial-view-04.webp", alt: "An airliner on final approach over the Navi Mumbai International Airport terminal and apron — Shikhar, Karanjade", category: "Aerial view", width: 1600, height: 1034 },
  { src: "/images/projects/shikhar/photos/shikhar-aerial-view-05.webp", alt: "An unmade road curving past open ground, a tower under construction at its edge and hills beyond — Shikhar, Karanjade", category: "Aerial view", width: 1400, height: 1050 },
  { src: "/images/projects/shikhar/photos/shikhar-aerial-view-06.webp", alt: "Low-rise apartment blocks along the streets below, the airport flatland and hills on the horizon — Shikhar, Karanjade", category: "Aerial view", width: 1600, height: 1200 },
  { src: "/images/projects/shikhar/photos/shikhar-aerial-view-07.webp", alt: "A tree-lined road running out between apartment blocks toward the hills, open ground either side — Shikhar, Karanjade", category: "Aerial view", width: 1600, height: 1200 },
  { src: "/images/projects/shikhar/photos/shikhar-aerial-view-08.webp", alt: "Cumulus building over the neighbourhood rooftops, the town running out to the hills — Shikhar, Karanjade", category: "Aerial view", width: 1600, height: 1200 },
  { src: "/images/projects/shikhar/photos/shikhar-interior-01.webp", alt: "Bathroom under fit-out: a patterned tile feature wall, plain white tiles and a bare floor — Shikhar", category: "Interior", width: 1600, height: 1200 },
];
