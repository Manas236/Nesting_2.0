/* ============================================================
   Dhruva — project detail page content
   Single source of truth for the Dhruva by Nesting Tree page.
   A delivered, sold-out, society-formed G+4 R+C building on a
   500 sq. m. CORNER PLOT (twin road frontage) at Sector R3,
   Karanjade. Tone is "delivered & proven", not "now booking".
   Edit facts, figures and copy here; the page at
   src/pages/projects/dhruva.astro reads everything from this file.

   Icon keys reference the line-icon set defined inside the page.
   ============================================================ */

export const dhruva = {
  name: "Dhruva",
  status: "Completed",
  maharera: "P52000033930",
  tagline:
    "A completed, sold-out corner-plot building: 24 homes and 6 shops, delivered and handed over.",
  address:
    "Plot no. 104, Sector R3, Karanjade, Panvel, 410206",
  hero: "/images/projects/Dhruva-Elevation_image.jpg",
  // extra status pills shown alongside the "Completed" pill in the hero
  pills: ["All flats sold", "Society formed"],
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Dhruva+Nesting+Tree+Karanjade+Panvel+Navi+Mumbai",
};

/* ---------- Sales / office contact ----------
   Moved to src/data/site.ts on 11 Aug 2026. Vipin is the single point of
   contact for every project, so the block is defined once there and
   dhruva.astro imports it from site.ts. Do not re-add it here. */

/* ---------- Headline stats band (4 figures) ---------- */
export const heroStats = [
  { figure: "G+4", label: "Storeys (R+C)" },
  { figure: "24", label: "Homes" },
  { figure: "6", label: "Shops" },
  { figure: "2023", label: "Delivered" },
];

/* ---------- Overview ---------- */
export const overview = {
  intro:
    "A G+4 R+C structure of 24 residential and 6 commercial units, set on a 500 sq. m. corner plot with large road frontage on two sides for light, ventilation and street presence.",
  facts: [
    { label: "Status", value: "Completed & delivered" },
    { label: "Structure", value: "G+4 storey (R+C structure)" },
    { label: "Configuration", value: "24 residential + 6 commercial units" },
    { label: "MahaRERA No.", value: "P52000033930" },
  ],
  spaceMix: [
    { figure: "24", label: "Residential homes" },
    { figure: "6", label: "Commercial shops" },
    { figure: "3+3", label: "1BHK + 1RK per floor" },
    { figure: "500", label: "Plot size (sq. m.)" },
  ],
  connectivity:
    "Dhruva sits on a corner plot in Karanjade, a fast-growing residential pocket of Navi Mumbai with strong road connectivity across the Mumbai–Pune corridor and the wider Navi Mumbai area.",
};

/* ---------- Floor plans (2, alternating image / detail rows) ---------- */
export type FloorPlan = {
  title: string;
  label: string;
  plan: string;
  blurb: string;
  /* There is deliberately no `points` field. The green-tick lists
     were removed from every project page on the owner's instruction —
     a ticked bullet reads as a promise about the delivered building,
     and the building is what the approved plan and the agreement say
     it is. Do not add one back. */
};

export const floorPlans: FloorPlan[] = [
  {
    title: "Ground floor",
    label: "Retail & common amenities",
    plan: "/images/projects/dhruva/Ground_Floor_Plan.png",
    blurb:
      "Six shops face two sides of the corner plot for a wide street frontage, with ample parking, a society office, a fitness centre and a multi-purpose room.",
  },
  {
    title: "Typical upper floor",
    label: "Residential — 6 flats per floor",
    plan: "/images/projects/dhruva/Typical_Floor_Plan_Dhurva.png",
    blurb:
      "Each upper floor carries three 1BHK and three 1RK apartments off a wide corridor, served by an 8-person automatic elevator and a wide staircase. Top-floor homes add private terraces.",
  },
];

/* ---------- Flat types (2, each with a cutaway render) ----------
   Floors 1–4 are identical: six homes per floor, three 1BHK and
   three 1RK, so 12 of each across the building.

   Carpet and balcony figures are the RERA carpet areas printed on
   the CIDCO-approved building plan (CIDCO/BP-17214/TPO(NM)/2019,
   approved 16 Dec 2019): units 101–103 are the 1BHK homes
   (25.04 / 24.13 / 22.06 sq. m. carpet, with 6.90 / 6.85 / 10.21
   sq. m. of enclosed balcony) and 104–106 are the 1RK homes
   (22.32 / 21.83 / 22.27 sq. m. carpet, no balcony). Room dimensions
   were shown alongside these until 11 Aug 2026, when the owner's
   instruction #9 took them off every project page.

   `stats` prints ONE figure per row rather than the range across the
   three series — a range reads as uncertainty on a sales page. Each
   is the mean of the per-unit figures above, unweighted because every
   series carries the same four homes (one per floor, floors 1–4):

     1BHK carpet      (25.04 + 24.13 + 22.06) / 3 = 23.74 sq. m.
     1BHK carpet+bal. (31.94 + 30.98 + 32.27) / 3 = 31.73
     1RK  carpet      (22.32 + 21.83 + 22.27) / 3 = 22.14

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
    units: "12 homes",
    series: "3 per floor · Floors 1 to 4",
    plan: "/images/projects/dhruva/1BHK_Render_Dhurva.png",
    blurb:
      "The larger of Dhruva's two layouts: a separate bedroom off an open living-dining, a kitchen with a full-length counter, a split bath and WC, and an enclosed balcony running the width of the living room.",
    stats: [
      { label: "Carpet area", value: "23.74 sq. m. (256 sq. ft.)" },
      { label: "Carpet + balcony", value: "31.73 sq. m. (342 sq. ft.)" },
      { label: "Homes of this type", value: "12 of 24" },
    ],
  },
  {
    type: "1RK",
    units: "12 homes",
    series: "3 per floor · Floors 1 to 4",
    plan: "/images/projects/dhruva/1RK_Render_Dhurva.png",
    blurb:
      "One open living-and-sleeping space with the kitchen fitted along a single wall, plus a full bath and its own WC. Compact to run, easy to furnish and the same finish schedule as the 1BHK.",
    stats: [
      { label: "Carpet area", value: "22.14 sq. m. (238 sq. ft.)" },
      { label: "Homes of this type", value: "12 of 24" },
    ],
  },
];

/* Source line printed under the flat-types section. */
export const unitTypesNote =
  "Carpet areas from the CIDCO-approved building plan CIDCO/BP-17214/TPO(NM)/2019, approved 16 December 2019. Each figure is the average across that layout's homes, which vary slightly from series to series; the area of a particular flat is the one printed on the approved plan and stated in its agreement. Renders are indicative; furniture and finishes are not part of the sale.";

/* ---------- Amenities — the page's hero USP ----------
   `featured` items render as larger, accent-treated tiles.   */
export type Amenity = {
  icon: string;
  name: string;
  desc: string;
  featured?: boolean;
  /* Featured cards may carry a photo; it renders as a full-width
     image + text card. objectPosition tunes the crop (portrait
     source into a landscape slot). */
  image?: string;
  objectPosition?: string;
  /* A featured card may instead carry two (or more) photos, which
     render as a full-bleed diptych beneath a compact text header.
     Used for the wide staircase / wide corridors feature — both
     source shots are 4:3, so they sit side by side almost uncropped.
     objectPositions[i] tunes each panel's crop. */
  images?: string[];
  objectPositions?: string[];
};

export type AmenityGroup = {
  group: string;
  caption: string;
  items: Amenity[];
};

export const amenityGroups: AmenityGroup[] = [
  {
    group: "Building",
    caption: "A mixed-use structure on a corner plot.",
    items: [
      {
        icon: "tower",
        name: "G+4 R+C on a 500 sq. m. corner plot",
        desc: "A mixed-use G+4 building on a large corner plot, with homes above and shops at street level.",
        featured: true,
      },
      {
        icon: "elevator",
        name: "High-speed elevator (8-person)",
        desc: "An 8-person high-speed automatic lift serving every upper floor.",
        featured: true,
        image: "/images/projects/dhruva/photos/dhruva-lift-01.webp",
        // portrait shot — bias low so the full lift doors stay in frame
        objectPosition: "center 80%",
      },
      {
        icon: "stairs",
        name: "Wide staircase & wide corridors",
        desc: "Green-marble stairs with steel railings rise beside broad, tiled corridors. Generous, light-filled circulation that makes every floor easy to reach and airy to move through.",
        featured: true,
        images: [
          "/images/projects/dhruva/photos/dhruva-lobby-02.webp",
          "/images/projects/dhruva/photos/dhruva-corridor-03.webp",
        ],
        objectPositions: ["center", "center"],
      },
      {
        icon: "parking",
        name: "Stack parking",
        desc: "Stack parking on the ground floor dedicated to residents.",
      },
      {
        icon: "waterproof",
        name: "External & internal water-proofing",
        desc: "Water-proofing inside and out, built to last through the monsoon.",
      },
      {
        icon: "gym",
        name: "Multi-purpose room & fitness centre",
        desc: "A fitness centre and flexible multi-purpose room built into the ground floor.",
      },
    ],
  },
  {
    group: "Lifestyle",
    caption: "A corner plot with room to gather.",
    items: [
      {
        icon: "corner",
        name: "Twin road frontage on a corner plot",
        desc: "Frontage on two sides brings light, ventilation and a prominent street presence.",
        featured: true,
      },
      {
        icon: "rooftop",
        name: "Rooftop community sit-out",
        desc: "An open rooftop sit-out for the whole building to gather and unwind.",
        featured: true,
      },
      {
        icon: "shop",
        name: "6 commercial shops at street level",
        desc: "Six road-facing shops give Dhruva a convenient, prominent street presence.",
      },
      {
        icon: "star",
        name: "Premium lobby",
        desc: "A premium entrance lobby that sets the tone on arrival.",
      },
    ],
  },
  {
    group: "Interiors",
    caption: "Branded, fitted and ready to live in.",
    items: [
      {
        icon: "tiles",
        name: "Branded vitrified tiles",
        desc: "Branded vitrified tile flooring throughout for a clean, durable finish.",
      },
      {
        icon: "faucet",
        name: "Branded WC & bathroom fittings",
        desc: "Name-brand WC and bathroom fittings in every home.",
      },
      {
        icon: "window",
        name: "UPVC windows",
        desc: "Sound-proofing UPVC windows that keep the city outside.",
      },
      {
        icon: "grill",
        name: "External grills provided",
        desc: "Factory-fitted external grills for safety on every opening.",
      },
      {
        icon: "fan",
        name: "Internal lights & fans provided",
        desc: "Lights and fans pre-installed and ready to use.",
      },
      {
        icon: "loft",
        name: "Internal lofts in the bathroom",
        desc: "Built-in overhead lofts add handy storage in the bathroom.",
      },
    ],
  },
];

/* ---------- Star-trail waypoints — the pinned "Dhruva does not move" section ----------
   Dhruva is Polaris, the fixed point the sky wheels around. On desktop the
   amenities read as six waypoints on a slowly turning ring; below `lg` (and
   under reduced motion) the amenityGroups bento grid above is the fallback.
   All 16 amenity cards survive here as checklist bullets — nothing dropped.
   Sequence runs clockwise from 6 o'clock: 01 bottom → 04 top → 06 lower-right.
   `icon` keys map to the line-icon set in the page. Ring positions are pure
   geometry (§ 60° apart), so no per-waypoint coordinates are needed.        */
export type SkyWaypoint = {
  index: string;
  label: string;
  icon: string;
  title: string;
  sub: string;
  badge?: string;
};

export const skyWaypoints: SkyWaypoint[] = [
  {
    index: "01",
    label: "Street level",
    icon: "corner",
    title: "A corner that everything passes",
    sub: "Six road-facing shops and a premium lobby open onto twin frontage, the busiest edge of the plot, by design.",
  },
  {
    index: "02",
    label: "Built to stand",
    icon: "tower",
    badge: "Signature",
    title: "G+4 R+C on 500 sq. m.",
    sub: "A G+4 R+C frame on a 500 sq. m. corner plot, water-proofed inside and out, with stack parking below.",
  },
  {
    index: "03",
    label: "Circulation",
    icon: "elevator",
    badge: "Signature",
    title: "Room to move",
    sub: "An 8-person automatic lift, a green-marble staircase and broad tiled corridors move the whole building with ease.",
  },
  {
    index: "04",
    label: "Rooftop and shared spaces",
    icon: "rooftop",
    badge: "Signature",
    title: "The still point",
    sub: "The open rooftop, the multi-purpose room and the fitness centre: the calm centre the rest of the day turns around.",
  },
  {
    index: "05",
    label: "Inside the homes",
    icon: "tiles",
    title: "Fitted, not finished later",
    sub: "Branded tiles and fittings, sound-proofing windows and a bathroom loft, all in place before you get the keys, not after.",
  },
  {
    index: "06",
    label: "Ready to move in",
    icon: "fan",
    title: "Handover-ready",
    sub: "Lights, fans and factory-fitted grills already in place. Open the door and move in.",
  },
];

/* ---------- About the developer (dark section) — REMOVED 12 Aug 2026 ----------
   Owner's review point #11: "Projects page — remove the about the developer
   section." The dark band it fed is gone from this project page, and the same
   removal was made on all seven. `developerNotes` went with it rather than
   being left as an unread export; git has the wording if it is ever wanted
   back. Shikhar's equivalent block ("The Nesting Tree advantage") was removed
   in the same commit, so no project page now sells the company. */

/* ---------- Why Dhruva (6 cards) — REMOVED 12 Aug 2026 ----------
   The "Why Dhruva" band is gone from this project page, and the same
   removal was made on all six pages that carried it. `whyDhruva` went
   with it rather than being left as an unread export; git has the six
   cards if they are ever wanted back. Nothing factual was lost with
   them — the MahaRERA number still shows in the hero pill, the facts
   table and the footer.                                              */

/* ---------- Gallery — real on-site photographs ----------
   Complete set of documentary photos for this project (renders and
   near-duplicate "(1)" variants excluded). Files live under
   public/images/projects/dhruva/photos/. Rendered by <ProjectGallery/>
   on the project page and on /gallery — real photography only, never
   renders or stock.

   Filenames, alt text and the width/height pairs are produced by
   `node scripts/optimise-project-images.mjs dhruva`, which reads
   scripts/alt-text/dhruva.tsv. Edit the alt text there, not here, or the
   next run will overwrite it. Each entry also has a 640 px `-640.webp`
   companion on disk that ProjectGallery puts in the srcset; the `src`
   below is the full-size file the lightbox opens.

   Alt text was rewritten on 12 Aug 2026: the previous strings described
   nine "aerial views over the rooftop" that are in fact views across the
   Navi Mumbai International Airport site. See IMAGE-SEO-BRIEF.md §1. */
export const gallery: { src: string; alt: string; category: string; width?: number; height?: number }[] = [
  { src: "/images/projects/dhruva/photos/dhruva-exterior-01.webp", alt: "Curved corner elevation in grey and white, green balcony panels above shuttered shops — Dhruva, Karanjade", category: "Exterior", width: 1066, height: 1600 },
  { src: "/images/projects/dhruva/photos/dhruva-exterior-02.webp", alt: "The corner plot seen along the street, past parked trucks and the neighbouring buildings — Dhruva, Karanjade", category: "Exterior", width: 1600, height: 1066 },
  { src: "/images/projects/dhruva/photos/dhruva-exterior-03.webp", alt: "Street-level view of the name board and red shop shutters, an autorickshaw parked outside — Dhruva, Karanjade", category: "Exterior", width: 1600, height: 1200 },
  { src: "/images/projects/dhruva/photos/dhruva-aerial-view-01.webp", alt: "Trucks on the highway below the compound wall, the Navi Mumbai International Airport site beyond — Dhruva, Karanjade", category: "Aerial view", width: 1600, height: 1066 },
  { src: "/images/projects/dhruva/photos/dhruva-aerial-view-02.webp", alt: "Airport terminal building and taxiway across the boundary road, past street lights and parked cars — Dhruva, Karanjade", category: "Aerial view", width: 1600, height: 1066 },
  { src: "/images/projects/dhruva/photos/dhruva-aerial-view-03.webp", alt: "Seen through a concrete opening: the highway, the airfield beyond it and a wooded hill to the left — Dhruva, Karanjade", category: "Aerial view", width: 1600, height: 1066 },
  { src: "/images/projects/dhruva/photos/dhruva-aerial-view-04.webp", alt: "Runway lights running out to the terminal building and control tower across the airfield — Dhruva, Karanjade", category: "Aerial view", width: 1600, height: 1066 },
  { src: "/images/projects/dhruva/photos/dhruva-aerial-view-05.webp", alt: "Green runway lights and a red-and-white marker board on the airfield, over the perimeter road — Dhruva, Karanjade", category: "Aerial view", width: 1600, height: 1066 },
  { src: "/images/projects/dhruva/photos/dhruva-aerial-view-06.webp", alt: "A line of red trucks on the highway, with the flat airfield and the hills behind them — Dhruva, Karanjade", category: "Aerial view", width: 1600, height: 1066 },
  { src: "/images/projects/dhruva/photos/dhruva-aerial-view-07.webp", alt: "The compound wall and its drainage channels below, the airfield and a wide cloudy sky beyond — Dhruva, Karanjade", category: "Aerial view", width: 1600, height: 1200 },
  { src: "/images/projects/dhruva/photos/dhruva-aerial-view-08.webp", alt: "Cars parked on the unmade road below, the highway curving away past the airfield — Dhruva, Karanjade", category: "Aerial view", width: 1600, height: 1200 },
  { src: "/images/projects/dhruva/photos/dhruva-aerial-view-09.webp", alt: "Autorickshaws and cars parked along the road below, against the cut hillside and a neighbouring block — Dhruva, Karanjade", category: "Aerial view", width: 1400, height: 1050 },
  { src: "/images/projects/dhruva/photos/dhruva-lobby-01.webp", alt: "Brass society name board beside the lift landing in the entrance lobby, under a pendant light — Dhruva, Karanjade", category: "Lobby", width: 1600, height: 1066 },
  { src: "/images/projects/dhruva/photos/dhruva-lobby-02.webp", alt: "Green-marble staircase and steel railing rising from the entrance lobby past the name board — Dhruva, Karanjade", category: "Lobby", width: 1600, height: 1200 },
  { src: "/images/projects/dhruva/photos/dhruva-lobby-03.webp", alt: "Lift doors, name board and window across the tiled entrance lobby, ceiling fan above — Dhruva, Karanjade", category: "Lobby", width: 1600, height: 1120 },
  { src: "/images/projects/dhruva/photos/dhruva-corridor-01.webp", alt: "Wide tiled landing at the head of the green-marble stairs, two flat doors at the far end — Dhruva", category: "Corridor", width: 1448, height: 1086 },
  { src: "/images/projects/dhruva/photos/dhruva-corridor-02.webp", alt: "Glossy tiled common landing looking along to the dark panelled entrance doors of two flats — Dhruva", category: "Corridor", width: 1600, height: 1066 },
  { src: "/images/projects/dhruva/photos/dhruva-corridor-03.webp", alt: "Green-marble steps and a steel railing meeting the tiled landing on a typical floor — Dhruva", category: "Corridor", width: 1600, height: 1200 },
  { src: "/images/projects/dhruva/photos/dhruva-lift-01.webp", alt: "Stainless-steel lift doors on the ground-floor landing, notices posted on the wall alongside — Dhruva", category: "Lift", width: 1066, height: 1600 },
  { src: "/images/projects/dhruva/photos/dhruva-lift-02.webp", alt: "The lift landing opening out to the covered stilt parking, a motorcycle parked beyond — Dhruva", category: "Lift", width: 1600, height: 1200 },
];
