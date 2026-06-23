/* ============================================================
   Nesting Tree — homepage content
   Single source of truth for brand facts, projects, amenities
   and the company journey. Edit copy / statuses / years here.

   NOTE ON PROJECT STATUS & YEARS:
   Nesting Tree launched in 2019. The delivered/ongoing status and
   locations below reflect the best available project information.
   If any status, location or milestone year is inaccurate, correct
   it in this file — every section reads from here.
   ============================================================ */

export const brand = {
  name: "Nesting Tree",
  foundedYear: 2019,
  region: "Panvel & Navi Mumbai",
  tagline: "More Building. More Living.",
  logoMark: "/images/brand/logo-mark.png",
  logoFull: "/images/brand/logo-full.png",
};

export const contact = {
  phone: "+91 98765 43210",
  email: "hello@nestingtree.in",
  address: "Pushpak Nagar, Navi Mumbai – 410206",
  maharera: "MahaRERA Registered",
  socials: [
    { label: "IG", href: "#" },
    { label: "FB", href: "#" },
    { label: "IN", href: "#" },
  ],
};

export const nav = [
  { label: "Projects", href: "#projects" },
  { label: "Amenities", href: "#amenities" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

/* ---------- Projects ----------
   image: real render where available. object-position is tuned so
   the building facade stays in frame and any baked-in caption strip
   at the foot of the render is cropped out.                       */
export type Project = {
  slug: string;
  name: string;
  location: string;
  status: "Ongoing" | "Delivered";
  statusLabel: string;
  blurb: string;
  amenities: string;
  image: string;
  objectPosition: string;
};

export const projects: Project[] = [
  {
    slug: "shikhar",
    name: "Shikhar",
    location: "Pushpak, Navi Mumbai",
    status: "Ongoing",
    statusLabel: "Now Booking",
    blurb:
      "The latest Nesting Tree residence — a high-rise built on the same standard as every project before it: more amenities, better daily living, delivered on time.",
    amenities: "Rooftop Gym · Terrace · Lift · CCTV",
    image: "/images/projects/ShikharElevationFinal.jpeg",
    objectPosition: "center 12%",
  },
  {
    slug: "prithvi",
    name: "Prithvi",
    location: "Sector 1, Pushpak, Navi Mumbai",
    status: "Ongoing",
    statusLabel: "Now Booking",
    blurb:
      "A corner-plot residence with deep balconies and street-level retail — designed for everyday convenience without leaving the building.",
    amenities: "Lift · CCTV · Parking · Retail",
    image: "/images/projects/Prithvi-Elevation.jpg",
    objectPosition: "center 12%",
  },
  {
    slug: "ishan",
    name: "Ishan",
    location: "Sector 1, Pushpak, Navi Mumbai",
    status: "Ongoing",
    statusLabel: "Now Booking",
    blurb:
      "Clean contemporary lines, planted balconies and a secured entrance — a calm address with the Nesting Tree amenity standard built in.",
    amenities: "Terrace · Lift · CCTV · Security",
    image: "/images/projects/Ishan-Reduced.jpg",
    objectPosition: "center 30%",
  },
  {
    slug: "rudra",
    name: "Rudra",
    location: "Panvel",
    status: "Delivered",
    statusLabel: "Delivered & Handed Over",
    blurb:
      "Lift access, CCTV-monitored entrances and dedicated parking — handed over and still running the way it was built.",
    amenities: "Lift · CCTV · Parking",
    image: "/images/projects/Rudra.jpg",
    objectPosition: "center center",
  },
  {
    slug: "dhruva",
    name: "Dhruva",
    location: "Kharghar Road, Panvel",
    status: "Delivered",
    statusLabel: "Delivered & Handed Over",
    blurb:
      "A curved-corner landmark with rooftop access, round-the-clock security and ground-floor retail — for residents who wanted more than four walls.",
    amenities: "Terrace · Security · Retail · Lift",
    image: "/images/projects/Dhruva-Elevation_image.jpg",
    objectPosition: "center 35%",
  },
];

export const featuredSlug = "shikhar";

/* ---------- Amenities — the core USP ---------- */
export const amenities = [
  {
    no: "01",
    kicker: "Rooftop & Terrace",
    title: "Open-air living, above the city.",
    body:
      "A rooftop gym and open terrace built into the building itself — no separate membership, no separate commute. Just take the lift up.",
    featured: "Rooftop Gym · Terrace Access",
  },
  {
    no: "02",
    kicker: "Family & Community",
    title: "A childhood that doesn’t wait for the park.",
    body:
      "A dedicated play area for children and community spaces for residents to gather — designed into the building, not squeezed into a leftover corner.",
    featured: "Children’s Play Area · Community Spaces",
  },
  {
    no: "03",
    kicker: "Safety & Access",
    title: "Security that never clocks out.",
    body:
      "CCTV-monitored common areas, round-the-clock trained security and a lift to every floor — the fundamentals, done properly.",
    featured: "CCTV Surveillance · 24×7 Security · Lift",
  },
  {
    no: "04",
    kicker: "Everyday Convenience",
    title: "The small things, already sorted.",
    body:
      "Dedicated parking and power backup for common areas and lifts — so the building keeps working, even when the city doesn’t.",
    featured: "Dedicated Parking · Power Backup",
  },
];

/* ---------- Journey / milestones ---------- */
export const journey = [
  {
    year: "2019",
    title: "Nesting Tree is founded",
    place: "Panvel",
    body:
      "A simple idea — build homes that come with more than four walls — turns into a residential development company in Panvel.",
  },
  {
    year: "2020",
    title: "Rudra delivered",
    place: "Panvel",
    body:
      "Our first handover. Lift, CCTV and dedicated parking, delivered as promised and handed over to residents.",
  },
  {
    year: "2021",
    title: "Dhruva delivered",
    place: "Kharghar Road, Panvel",
    body:
      "A curved-corner landmark with rooftop access and ground-floor retail — proof the amenity-first standard scales.",
  },
  {
    year: "2022",
    title: "Shaurya delivered",
    place: "Taloja, Navi Mumbai",
    body:
      "A children’s play area and community hall built in from day one — because a home is more than just a unit.",
  },
  {
    year: "Today",
    title: "Three residences underway",
    place: "Pushpak, Navi Mumbai",
    body:
      "Shikhar, Prithvi and Ishan are now booking in Pushpak, Navi Mumbai — built to the same standard, registered with MahaRERA.",
  },
];

/* ---------- Why Nesting Tree ---------- */
export const reasons = [
  {
    title: "A track record, not a promise",
    body: "Projects delivered and handed over across Panvel & Navi Mumbai since 2019.",
  },
  {
    title: "Possession on time",
    body: "We build to a schedule and hand over on it — the way our delivered projects were.",
  },
  {
    title: "Clear-title, MahaRERA registered",
    body: "Every project is RERA-registered on clear-title land, so you buy with confidence.",
  },
  {
    title: "Amenities as standard",
    body: "Gym, terrace, lift, CCTV, security and parking — built in, not sold as extras.",
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

/* ---------- Derived stats for the journey band ---------- */
export const stats = {
  projects: projects.length,
  delivered: projects.filter((p) => p.status === "Delivered").length,
  ongoing: projects.filter((p) => p.status === "Ongoing").length,
};
