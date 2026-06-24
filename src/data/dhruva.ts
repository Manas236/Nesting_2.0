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
    "A completed, sold-out corner-plot building — 24 homes and 6 shops, delivered and handed over.",
  address:
    "Sector R3, Plot no. 104, Karanjade, Panvel, Vadghar, Maharashtra 410206",
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
    "Wide staircase & large entrance lobby",
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
    "Dhruva sits on a corner plot in Karanjade, Pushpak — a fast-growing residential pocket of Navi Mumbai with strong road connectivity across the Mumbai–Pune corridor and the wider Panvel area.",
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
    plan: "/images/projects/dhruva/plan-ground.jpg",
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
    plan: "/images/projects/dhruva/plan-fourth.jpg",
    blurb:
      "Each upper floor carries three 1BHK and three 1RK apartments off a large entrance lobby, served by an 8-person automatic elevator and a wide staircase. Top-floor homes add private terraces.",
    points: [
      "3 × 1BHK per floor",
      "3 × 1RK per floor",
      "1BHK + terrace homes (top floor)",
      "8-person automatic elevator",
      "Wide staircase & large lobby",
      "UPVC windows throughout",
    ],
  },
];

/* ---------- Amenities — the page's hero USP ----------
   `featured` items render as larger, accent-treated tiles.   */
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
    caption: "A mixed-use structure on a corner plot.",
    items: [
      {
        icon: "tower",
        name: "G+4 R+C on a 500 sq. m. corner plot",
        desc: "A mixed-use G+4 building on a large corner plot — homes above, shops at street level.",
        featured: true,
      },
      {
        icon: "elevator",
        name: "High-speed elevator (8-person)",
        desc: "An 8-person high-speed automatic lift serving every upper floor.",
        featured: true,
      },
      {
        icon: "lobby",
        name: "Wide staircase & large lobby",
        desc: "A generous lobby and wide staircase make every floor easy to reach.",
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

/* ---------- About the developer (dark section) ---------- */
export const developerNotes: { label: string; body: string }[] = [
  {
    label: "Two decades of lineage",
    body: "Nesting Tree, established in 2019, is a venture of Kailash Developers — in real estate since 2005.",
  },
  {
    label: "Built for Pushpak Nagar",
    body: "Focused on Pushpak Nagar, with an emphasis on quality construction and a professional home-buying experience.",
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
    body: "Registered under MahaRERA P52000033930 — clean title, watertight paperwork.",
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
