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
  tagline: "A landmark residential tower — the tallest building in the neighbourhood.",
  address:
    "Sector R2, Plot no. 73, Karanjade, Panvel, Vadghar, Maharashtra 410206",
  hero: "/images/projects/ShikharElevationFinal.jpeg",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Shikhar+Nesting+Tree+Karanjade+Panvel+Navi+Mumbai",
};

/* ---------- Sales contact ---------- */
export const sales = {
  name: "Vipin",
  phone: "95940 79317",
  phoneHref: "tel:+919594079317",
};

/* ---------- Headline stats band (4 figures) ---------- */
export const heroStats = [
  { figure: "G+10", label: "Floors" },
  { figure: "66", label: "Total units" },
  { figure: "3", label: "Elevators" },
  { figure: "20+", label: "Years’ experience" },
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
    "Shikhar sits on a corner plot in Karanjade, Pushpak — a fast-growing residential pocket of Navi Mumbai with strong road connectivity across the Mumbai–Pune corridor and the wider Panvel area.",
};

/* ---------- Unit types (3, each with a floor-plan render) ---------- */
export type UnitType = {
  type: string;
  units: string;
  series: string;
  plan: string;
  blurb: string;
  features: string[];
  rooms: { room: string; dim: string }[];
};

export const unitTypes: UnitType[] = [
  {
    type: "1BHK",
    units: "37 units",
    series: "Series 1 · Modern apartment",
    plan: "/images/projects/shikhar/plan-1bhk.jpg",
    blurb:
      "A separate bedroom for privacy, a dual-toilet layout and abundant natural light — the most popular choice at Shikhar.",
    features: [
      "Separate bedroom for privacy",
      "Dual-toilet layout",
      "Abundant natural light",
    ],
    rooms: [
      { room: "Bedroom", dim: "2.70 × 3.10 m" },
      { room: "Kitchen", dim: "1.95 × 2.10 m" },
      { room: "Balcony", dim: "30 sq ft" },
      { room: "Toilet 1", dim: "1.20 × 1.20 m" },
      { room: "Toilet 2", dim: "2.10 × 1.20 m" },
    ],
  },
  {
    type: "1RK",
    units: "18 units",
    series: "Series 6 · Studio apartment",
    plan: "/images/projects/shikhar/plan-1rk.jpg",
    blurb:
      "Compact luxury living with a space-saving design, dedicated functional zones, integrated storage and abundant natural light.",
    features: [
      "Space-saving design",
      "Dedicated functional zones",
      "Integrated storage",
    ],
    rooms: [
      { room: "Living", dim: "2.70 × 3.15 m" },
      { room: "Kitchen", dim: "1.75 × 3.15 m" },
      { room: "Toilet", dim: "2.2 × 1.2 m" },
      { room: "Passageway", dim: "1.2 × 2.6 m" },
    ],
  },
  {
    type: "1BHK + Terrace",
    units: "3 units",
    series: "Series 3 · Unique terrace apartment",
    plan: "/images/projects/shikhar/plan-1bhk-terrace.jpg",
    blurb:
      "Exclusive homes wrapped by a large private terrace, with high-end luxury finishes and a separate bedroom. Limited availability.",
    features: [
      "Large wrapping private terrace",
      "High-end luxury finishes",
      "Limited availability",
    ],
    rooms: [
      { room: "Wrapping terrace", dim: "355.66 sq ft" },
      { room: "Living", dim: "2.78 × 3.10 m" },
      { room: "Kitchen", dim: "1.85 × 2.15 m" },
      { room: "Bedroom", dim: "2.65 × 3.15 m" },
      { room: "Balcony", dim: "2.80 × 1.00 m" },
    ],
  },
];

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
        desc: "The highest skyline address in Karanjade — presence nothing nearby can match.",
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
        desc: "Buy directly from the plot owner — no third party in between.",
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

/* ---------- The Nesting Tree advantage (6 cards) ---------- */
export const advantages: { title: string; body: string }[] = [
  {
    title: "Direct from plot-owner",
    body: "No joint venture, no third party. You deal directly with the landowner.",
  },
  {
    title: "No tri-party agreement",
    body: "Full transparency: what you see is what you get.",
  },
  {
    title: "Before-time completion",
    body: "All 3 previous projects delivered ahead of deadline.",
  },
  {
    title: "Proven track record",
    body: "Rudra, Dhruva & Shaurya: fully sold out, all end-user buyers.",
  },
  {
    title: "Extremely strong paperwork",
    body: "MahaRERA registered. Clean title. Watertight documentation.",
  },
  {
    title: "Branded residences",
    body: "Branded fittings, tiles and premium finishing throughout.",
  },
];
