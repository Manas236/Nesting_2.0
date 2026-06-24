/* ============================================================
   Rudra — project detail page content
   Single source of truth for the Rudra by Nesting Tree page.
   Rudra is the company's FIRST delivered project — the tone here
   is "delivered & proven" (completed, sold out, society formed),
   not "now booking". Edit facts, figures and copy here; the page
   at src/pages/projects/rudra.astro reads everything from this file.

   Icon keys reference the line-icon set defined inside the page.
   ============================================================ */

export const rudra = {
  name: "Rudra",
  status: "Completed",
  maharera: "P52000026245",
  tagline:
    "Nesting Tree's first delivered project — a completed, sold-out G+4 building with 20 homes and 4 shops.",
  address:
    "Plot no. 166, Sector R2, Karanjade, Uran–Panvel Rd, Panvel, Vadghar, Maharashtra 410206",
  hero: "/images/projects/Rudra.jpg",
  // extra status pills shown alongside the "Completed" pill in the hero
  pills: ["All flats sold", "Society formed"],
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Rudra+Nesting+Tree+Karanjade+Panvel+Navi+Mumbai",
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
  { figure: "G+4", label: "Storeys" },
  { figure: "20", label: "Homes" },
  { figure: "4", label: "Shops" },
  { figure: "5", label: "Homes per floor" },
];

/* ---------- Overview ---------- */
export const overview = {
  intro:
    "A G+4 structure of 20 residential homes and 4 commercial shops at Sector R2, Karanjade — Nesting Tree's earliest project, now delivered, fully sold and society-formed.",
  facts: [
    { label: "Status", value: "Completed & delivered" },
    { label: "Structure", value: "G+4 storeys" },
    { label: "Configuration", value: "Residential + commercial" },
    { label: "Homes per floor", value: "1 × 1BHK + 4 × 1RK per upper floor" },
    { label: "MahaRERA No.", value: "P52000026245" },
  ],
  spaceMix: [
    { figure: "20", label: "Residential homes" },
    { figure: "4", label: "Commercial shops" },
    { figure: "1+4", label: "1BHK + 1RK per floor" },
    { figure: "340–560", label: "Home sizes (sq. ft.)" },
  ],
  highlights: [
    "4 ground-floor shops fronting the 9 m wide road",
    "Ground-floor parking for buyers",
    "High-speed elevator (6–7 person)",
    "Large entrance lobby & wide staircase",
    "3 m wide openings on three sides for light & ventilation",
    "Rooftop community sit-out",
    "Stack parking",
    "Premium lobby",
    "Branded bathroom fittings",
    "Aluminium windows",
    "External & internal water-proofing",
    "Electric back-up",
  ],
  connectivity:
    "Rudra sits on a road-facing plot in Karanjade, Pushpak — a fast-growing residential pocket of Navi Mumbai with strong connectivity across the Mumbai–Pune corridor and the wider Panvel area.",
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
    label: "Retail & parking",
    plan: "/images/projects/rudra/plan-ground.jpg",
    blurb:
      "Four shops face the busy 9 m wide road, each with its own street frontage, alongside ground-floor parking for home buyers and the building's wide main entrance for easy access.",
    points: [
      "4 commercial shops",
      "Street frontage on 9 m road",
      "Ground-floor parking",
      "Underground & overhead water tanks",
      "Society & sanitary block",
      "Wide main entrance gate",
    ],
  },
  {
    title: "Typical upper floor",
    label: "Residential — 5 homes per floor",
    plan: "/images/projects/rudra/plan-fourth.jpg",
    blurb:
      "Each upper floor carries one large 1BHK and four smart 1RK homes off a large entrance lobby, served by a 6–7 person elevator and a wide staircase, with 3 m wide openings on three sides for light and a sense of space.",
    points: [
      "1 × 1BHK per floor",
      "4 × 1RK per floor",
      "Large entrance lobby",
      "6–7 person elevator",
      "Wide staircase",
      "3 m openings on three sides",
    ],
  },
];

/* ---------- Home configurations (5 unit renders, gallery grid) ----------
   `span` controls the editorial sizing on the lg 6-col grid.            */
export type HomeConfig = {
  name: string;
  size: string;
  img: string;
  span: string;
  featured?: boolean;
};

export const homeConfigs: HomeConfig[] = [
  {
    name: "Grand 1 BHK",
    size: "560 sq. ft.",
    img: "/images/projects/rudra/unit-1bhk-560.jpg",
    span: "lg:col-span-3",
    featured: true,
  },
  {
    name: "Large 1 RK",
    size: "450 sq. ft.",
    img: "/images/projects/rudra/unit-1rk-450.jpg",
    span: "lg:col-span-3",
  },
  {
    name: "Spacious 1 RK",
    size: "440 sq. ft.",
    img: "/images/projects/rudra/unit-1rk-440.jpg",
    span: "lg:col-span-2",
  },
  {
    name: "Spacious 1 RK",
    size: "425 sq. ft.",
    img: "/images/projects/rudra/unit-1rk-425.jpg",
    span: "lg:col-span-2",
  },
  {
    name: "Value 1 RK",
    size: "340 sq. ft.",
    img: "/images/projects/rudra/unit-1rk-340.jpg",
    span: "lg:col-span-2",
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
    caption: "A mixed-use structure, built to last.",
    items: [
      {
        icon: "tower",
        name: "G+4 residential + commercial",
        desc: "A mixed-use G+4 building — homes above, shops and parking at street level.",
        featured: true,
      },
      {
        icon: "elevator",
        name: "High-speed elevator (6–7 person)",
        desc: "A 6–7 person high-speed lift serving every one of the upper floors.",
        featured: true,
      },
      {
        icon: "lobby",
        name: "Wide staircase & large lobby",
        desc: "A generous lobby and wide staircase make every floor easy to reach.",
      },
      {
        icon: "parking",
        name: "Stack & ground-floor parking",
        desc: "Stack and ground-floor parking dedicated to home buyers.",
      },
      {
        icon: "bolt",
        name: "Electric back-up",
        desc: "Power back-up keeps the lift and common areas running.",
      },
      {
        icon: "waterproof",
        name: "External & internal water-proofing",
        desc: "Water-proofing inside and out, built to last through the monsoon.",
      },
    ],
  },
  {
    group: "Lifestyle",
    caption: "Space to gather, and a street presence.",
    items: [
      {
        icon: "rooftop",
        name: "Rooftop community sit-out",
        desc: "An open rooftop sit-out for the whole building to gather and unwind.",
        featured: true,
      },
      {
        icon: "shop",
        name: "4 commercial shops at street level",
        desc: "Four road-facing shops give Rudra a prominent, convenient street presence.",
        featured: true,
      },
      {
        icon: "star",
        name: "Premium lobby",
        desc: "A premium entrance lobby that sets the tone on arrival.",
      },
      {
        icon: "people",
        name: "Quality common spaces",
        desc: "Well-finished shared spaces throughout the building.",
      },
      {
        icon: "window",
        name: "3 m wide openings on three sides",
        desc: "Three-metre openings on three sides flood homes with light and air.",
      },
    ],
  },
  {
    group: "Interiors",
    caption: "Finished and fitted as standard.",
    items: [
      {
        icon: "tiles",
        name: "Vitrified tiles",
        desc: "Vitrified tile flooring throughout for a clean, durable finish.",
      },
      {
        icon: "faucet",
        name: "Branded bathroom fittings",
        desc: "Name-brand sanitaryware and fittings in every bathroom.",
      },
      {
        icon: "window",
        name: "Aluminium windows",
        desc: "Sturdy aluminium windows on every opening.",
      },
      {
        icon: "wall",
        name: "External plaster",
        desc: "Quality external plaster protecting the facade.",
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
    body: "Created to focus exclusively on Pushpak Nagar, with quality construction and a professional home-buying experience.",
  },
  {
    label: "The first delivered project",
    body: "Rudra is Nesting Tree's first delivered project — a G+4 residential + commercial building at Sector R2, Karanjade.",
  },
  {
    label: "A proven portfolio",
    body: "Lush Meadows (16-storey, Kharghar) and Gopala (Vashi) are appreciated for quality, timely completion and amenities.",
  },
];

/* ---------- Why Rudra (6 cards) ---------- */
export const whyRudra: { title: string; body: string }[] = [
  {
    title: "Delivered & handed over",
    body: "Rudra is complete; homes and shops handed over to end-user buyers.",
  },
  {
    title: "All flats sold",
    body: "Every residential unit and shop at Rudra is fully sold out.",
  },
  {
    title: "Society formed",
    body: "A functioning residents' society manages the building day-to-day.",
  },
  {
    title: "MahaRERA registered",
    body: "Registered under MahaRERA P52000026245 — clean title, watertight paperwork.",
  },
  {
    title: "Where Nesting Tree began",
    body: "Rudra is the brand's earliest delivered project at Pushpak Nagar.",
  },
  {
    title: "Road-facing commercial",
    body: "Four shops front the busy 9 m road, giving prominent street presence.",
  },
];
