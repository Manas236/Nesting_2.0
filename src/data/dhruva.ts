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

/* ---------- Sales / office contact ---------- */
export const sales = {
  name: "Vipin",
  phone: "95940 79317",
  phoneHref: "tel:+919594079317",
  office: "1313, Realtech Park, Sector 30A, Vashi",
};

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
  highlights: [
    "Corner plot with road frontage on two sides",
    "500 sq. m. plot — large, well-ventilated homes",
    "8-person high-speed automatic elevator",
    "Wide staircase & wide corridors",
    "UPVC windows (sound-proof living)",
    "Rooftop community sit-out",
    "Stack parking",
    "Premium lobby",
    "Branded vitrified tiles",
    "Branded WC & bathroom fittings",
    "External & internal water-proofing",
    "Multi-purpose room & fitness centre",
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
  points: string[];
};

export const floorPlans: FloorPlan[] = [
  {
    title: "Ground floor",
    label: "Retail & common amenities",
    plan: "/images/projects/dhruva/Ground_Floor_Plan.png",
    blurb:
      "Six shops face two sides of the corner plot for a wide street frontage, with ample parking, a society office, a fitness centre and a multi-purpose room.",
    points: [
      "6 commercial shops",
      "Ample stack parking",
      "Multi-purpose room",
      "Fitness centre",
      "Society office & lobby",
      "Ground-floor WC",
    ],
  },
  {
    title: "Typical upper floor",
    label: "Residential — 6 flats per floor",
    plan: "/images/projects/dhruva/Typical_Floor_Plan_Dhurva.png",
    blurb:
      "Each upper floor carries three 1BHK and three 1RK apartments off a wide corridor, served by an 8-person automatic elevator and a wide staircase. Top-floor homes add private terraces.",
    points: [
      "3 × 1BHK per floor",
      "3 × 1RK per floor",
      "1BHK + terrace homes (top floor)",
      "8-person automatic elevator",
      "Wide staircase & wide corridors",
      "UPVC windows throughout",
    ],
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
   (22.32 / 21.83 / 22.27 sq. m. carpet, no balcony). Room sizes are
   the dimensions marked on the typical-floor plan.               */
export type UnitType = {
  type: string;
  units: string;
  series: string;
  plan: string;
  blurb: string;
  stats: { label: string; value: string }[];
  features: string[];
  rooms: { room: string; dim: string }[];
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
      { label: "Carpet area", value: "22.06 – 25.04 sq. m. (237 – 269 sq. ft.)" },
      { label: "Carpet + balcony", value: "30.98 – 32.27 sq. m. (333 – 347 sq. ft.)" },
      { label: "Homes of this type", value: "12 of 24" },
    ],
    features: [
      "Separate bedroom for privacy",
      "Split bath and WC — two people, no queue",
      "Enclosed balcony along the living room",
      "Kitchen with full-length counter & sink",
    ],
    rooms: [
      { room: "Living", dim: "2.70 × 3.95 m" },
      { room: "Bedroom", dim: "3.20 × 2.75 m" },
      { room: "Kitchen", dim: "2.30 × 2.15 m" },
      { room: "Bath", dim: "1.35 × 1.45 m" },
      { room: "WC", dim: "1.20 × 1.00 m" },
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
      { label: "Carpet area", value: "21.83 – 22.32 sq. m. (235 – 240 sq. ft.)" },
      { label: "Homes of this type", value: "12 of 24" },
    ],
    features: [
      "Single open living–sleeping space",
      "Full bath plus a separate WC",
      "Kitchen fitted along one wall",
      "Corner variant with a wider 4.49 × 2.75 m living",
    ],
    rooms: [
      { room: "Living", dim: "2.70 × 4.30 m" },
      { room: "Kitchen", dim: "2.20 × 2.35 m" },
      { room: "Bath", dim: "1.45 × 1.35 m" },
      { room: "WC", dim: "1.40 × 1.00 m" },
    ],
  },
];

/* Source line printed under the flat-types section. */
export const unitTypesNote =
  "Carpet areas as printed on the CIDCO-approved building plan CIDCO/BP-17214/TPO(NM)/2019, approved 16 December 2019. Renders are indicative; furniture and finishes are not part of the sale.";

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
        image: "/images/Project_Images/Dhruva/Lift/DSC_0205.jpeg",
        // portrait shot — bias low so the full lift doors stay in frame
        objectPosition: "center 80%",
      },
      {
        icon: "stairs",
        name: "Wide staircase & wide corridors",
        desc: "Green-marble stairs with steel railings rise beside broad, tiled corridors. Generous, light-filled circulation that makes every floor easy to reach and airy to move through.",
        featured: true,
        images: [
          "/images/Project_Images/Dhruva/Lobby/IMG20260627140435.jpeg",
          "/images/Project_Images/Dhruva/Corridor/IMG20260627113731.jpeg",
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
  points: string[];
};

export const skyWaypoints: SkyWaypoint[] = [
  {
    index: "01",
    label: "Street level",
    icon: "corner",
    title: "A corner that everything passes",
    sub: "Six road-facing shops and a premium lobby open onto twin frontage, the busiest edge of the plot, by design.",
    points: [
      "Six road-facing commercial shops",
      "Twin road frontage on a corner plot",
      "Premium entrance lobby",
    ],
  },
  {
    index: "02",
    label: "Built to stand",
    icon: "tower",
    badge: "Signature",
    title: "G+4 R+C on 500 sq. m.",
    sub: "A G+4 R+C frame on a 500 sq. m. corner plot, water-proofed inside and out, with stack parking below.",
    points: [
      "G+4 R+C structure on a 500 sq. m. corner plot",
      "External and internal water-proofing",
      "Stack parking on the ground floor",
    ],
  },
  {
    index: "03",
    label: "Circulation",
    icon: "elevator",
    badge: "Signature",
    title: "Room to move",
    sub: "An 8-person automatic lift, a green-marble staircase and broad tiled corridors move the whole building with ease.",
    points: [
      "High-speed 8-person automatic elevator",
      "Green-marble staircase with steel railings",
      "Broad, tiled, light-filled corridors",
    ],
  },
  {
    index: "04",
    label: "Rooftop and shared spaces",
    icon: "rooftop",
    badge: "Signature",
    title: "The still point",
    sub: "The open rooftop, the multi-purpose room and the fitness centre: the calm centre the rest of the day turns around.",
    points: [
      "Open rooftop community sit-out",
      "Multi-purpose room on the ground floor",
      "Fitness centre",
    ],
  },
  {
    index: "05",
    label: "Inside the homes",
    icon: "tiles",
    title: "Fitted, not finished later",
    sub: "Branded tiles and fittings, sound-proofing windows and a bathroom loft, all in place before you get the keys, not after.",
    points: [
      "Sound-proofing UPVC windows",
      "Branded vitrified tile flooring",
      "Branded WC and bathroom fittings",
      "Internal lofts in the bathroom",
    ],
  },
  {
    index: "06",
    label: "Ready to move in",
    icon: "fan",
    title: "Handover-ready",
    sub: "Lights, fans and factory-fitted grills already in place. Open the door and move in.",
    points: [
      "Internal lights and fans pre-installed",
      "Factory-fitted external grills on every opening",
    ],
  },
];

/* ---------- About the developer (dark section) ---------- */
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
    body: "Completed & handed over Rudra, a G+4 R+C building at Sector R2, Karanjade.",
  },
  {
    label: "A proven portfolio",
    body: "Lush Meadows (16-storey, Kharghar) and Gopala (Vashi) are appreciated for quality, timely completion and amenities.",
  },
];

/* ---------- Why Dhruva (6 cards) ---------- */
export const whyDhruva: { title: string; body: string }[] = [
  {
    title: "Delivered & handed over",
    body: "Dhruva is complete; homes and shops handed over to end-user buyers.",
  },
  {
    title: "All flats sold",
    body: "Every residential unit and shop at Dhruva is fully sold out.",
  },
  {
    title: "Society formed",
    body: "A functioning residents' society manages the building day-to-day.",
  },
  {
    title: "MahaRERA registered",
    body: "Registered under MahaRERA P52000033930. Clean title, watertight paperwork.",
  },
  {
    title: "Branded residences",
    body: "Branded fittings, vitrified tiles and premium finishing throughout.",
  },
  {
    title: "Corner plot advantage",
    body: "Twin road frontage, wide ventilation and a prominent street presence.",
  },
];

/* ---------- Gallery — real on-site photographs ----------
   Complete set of documentary photos for this project (renders and
   near-duplicate "(1)" variants excluded). Generated from the folders
   under public/images/Project_Images/Dhruva/. Rendered by
   <ProjectGallery/> on the project page and on /gallery — real
   photography only, never renders or stock. */
export const gallery: { src: string; alt: string; category: string }[] = [
  { src: "/images/Project_Images/Dhruva/Exterior/DSC_0005.jpeg", alt: "Dhruva — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Dhruva/Exterior/DSC_0006.jpeg", alt: "Dhruva — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Dhruva/Exterior/IMG20260627112705.jpeg", alt: "Dhruva — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Dhruva/Aerial_View/DSC_0012.jpeg", alt: "Dhruva — aerial view over the rooftop and surroundings", category: "Aerial view" },
  { src: "/images/Project_Images/Dhruva/Aerial_View/DSC_0015.jpeg", alt: "Dhruva — aerial view over the rooftop and surroundings", category: "Aerial view" },
  { src: "/images/Project_Images/Dhruva/Aerial_View/DSC_0017.jpeg", alt: "Dhruva — aerial view over the rooftop and surroundings", category: "Aerial view" },
  { src: "/images/Project_Images/Dhruva/Aerial_View/DSC_0025.jpeg", alt: "Dhruva — aerial view over the rooftop and surroundings", category: "Aerial view" },
  { src: "/images/Project_Images/Dhruva/Aerial_View/DSC_0036.jpeg", alt: "Dhruva — aerial view over the rooftop and surroundings", category: "Aerial view" },
  { src: "/images/Project_Images/Dhruva/Aerial_View/DSC_0045.jpeg", alt: "Dhruva — aerial view over the rooftop and surroundings", category: "Aerial view" },
  { src: "/images/Project_Images/Dhruva/Aerial_View/IMG20260627113437.jpeg", alt: "Dhruva — aerial view over the rooftop and surroundings", category: "Aerial view" },
  { src: "/images/Project_Images/Dhruva/Aerial_View/IMG20260627113444.jpeg", alt: "Dhruva — aerial view over the rooftop and surroundings", category: "Aerial view" },
  { src: "/images/Project_Images/Dhruva/Aerial_View/IMG20260627115053.jpeg", alt: "Dhruva — aerial view over the rooftop and surroundings", category: "Aerial view" },
  { src: "/images/Project_Images/Dhruva/Lobby/DSC_0199.jpeg", alt: "Dhruva — ground-floor entrance lobby", category: "Lobby" },
  { src: "/images/Project_Images/Dhruva/Lobby/IMG20260627140435.jpeg", alt: "Dhruva — ground-floor entrance lobby", category: "Lobby" },
  { src: "/images/Project_Images/Dhruva/Lobby/IMG20260627140500.jpeg", alt: "Dhruva — ground-floor entrance lobby", category: "Lobby" },
  { src: "/images/Project_Images/Dhruva/Corridor/corridor.png", alt: "Dhruva — bright tiled common corridor", category: "Corridor" },
  { src: "/images/Project_Images/Dhruva/Corridor/DSC_0049.jpeg", alt: "Dhruva — bright tiled common corridor", category: "Corridor" },
  { src: "/images/Project_Images/Dhruva/Corridor/IMG20260627113731.jpeg", alt: "Dhruva — bright tiled common corridor", category: "Corridor" },
  { src: "/images/Project_Images/Dhruva/Lift/DSC_0205.jpeg", alt: "Dhruva — passenger lift serving every floor", category: "Lift" },
  { src: "/images/Project_Images/Dhruva/Lift/IMG20260627140541.jpeg", alt: "Dhruva — passenger lift serving every floor", category: "Lift" },
];
