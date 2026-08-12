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
    "Nesting Tree's first delivered project: a completed, sold-out G+4 building with 20 homes and 4 shops.",
  address:
    "Plot no. 166, Sector R2, Karanjade, Panvel, 410206",
  hero: "/images/projects/Rudra.jpg",
  // extra status pills shown alongside the "Completed" pill in the hero
  pills: ["All flats sold", "Society formed"],
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Rudra+Nesting+Tree+Karanjade+Panvel+Navi+Mumbai",
};

/* ---------- Sales / office contact ----------
   Moved to src/data/site.ts on 11 Aug 2026. Vipin is the single point of
   contact for every project, so the block is defined once there and
   rudra.astro imports it from site.ts. Do not re-add it here. */

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
    "A G+4 structure of 20 residential homes and 4 commercial shops at Sector R2, Karanjade. Nesting Tree's earliest project, now delivered, fully sold and society-formed.",
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
    "Wide openings on three sides for light & ventilation",
    "Rooftop community sit-out",
    "Stack parking",
    "Premium lobby",
    "Branded bathroom fittings",
    "UPVC windows",
    "External & internal water-proofing guarantee",
    "Electric back-up",
  ],
  connectivity:
    "Rudra sits on a road-facing plot in Karanjade, a fast-growing residential pocket of Navi Mumbai with strong connectivity across the Mumbai–Pune corridor and the wider Navi Mumbai area.",
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
    plan: "/images/projects/rudra/plan-ground.png",
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
    plan: "/images/projects/rudra/plan-fourth.png",
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

/* ---------- Unit types (5, each with a layout render) ----------
   Same shape as every other project page: the page maps this array
   into alternating render / detail rows, not a card grid, and each
   row carries its own `stats` the way Dhruva, Shikhar and Shaurya
   do. (Each also carried a `rooms` schedule until 11 Aug 2026, when
   the owner's instruction #9 took room dimensions off every project
   page. The extracted figures are kept in the ROOM SCHEDULE note
   further down this file so the work does not have to be redone.)

   Five layouts, one of each on every upper floor, four upper floors
   = the 20 homes in the area statement.

   HOW THE PAIRING WAS MADE. The approved plan's carpet table is
   keyed to unit numbers, and the drawing labels only the 1BHK (the
   one BED per floor, so that is unit x01). The four 1RK renders were
   matched to units x02–x05 by reading each render against the rooms
   marked on the typical-floor plan:

     x02  the only 1RK with its kitchen set apart in its own bay
          (2.60 × 2.05) and a balcony beyond it  -> the 450 render
     x03  the only near-square living (3.76 × 3.00), kitchen on the
          far wall, balcony down the flank       -> the 440 render
     x04  living at the front, kitchen and bath pushed to the back
          corner                                 -> the 425 render
     x05  the only home with NO kitchen room on the plan — a washing
          place and an open counter instead      -> the 340 render

   KNOWN INCONSISTENCY IN THE SOURCE, kept visible rather than
   smoothed over: x02's recorded carpet (13.25) does not reconcile
   with its own room sizes, which sum to ~19.8 sq. m. — carpet should
   be the larger figure, since it also takes in the internal passage.
   So the 450 layout prints the smallest carpet of the four 1RKs and
   the 425 layout the largest. Either the carpet table was read from
   an earlier revision of the plan or that row is mis-assigned. Worth
   re-checking against the approved drawing; if it is corrected, only
   the `stats` on "Large 1 RK" below need changing.

   ONE CARPET FIGURE PER LAYOUT — owner's rule, 5 Aug 2026. Where the
   floors differ (the 440 and the 340, whose fourth-floor unit sits on
   the set-back top floor), the two figures are averaged into the
   single number that prints:

     440  (17.83 + 16.88) / 2 = 17.36 sq. m.
     340  (16.65 + 14.07) / 2 = 15.36 sq. m.
     340  carpet + balcony: (18.30 + 14.07) / 2 = 16.19 sq. m.

   This supersedes an earlier rule in this file that forbade averaging
   403 and 405 into their series. Both per-unit figures survive in the
   record below and in `unitTypesNote`, which says on the page that
   those two units are smaller and names their exact areas — so the
   averaged number is never the only figure a reader can get to.

   TWO STAT CELLS PER LAYOUT, no more: carpet, then carpet + balcony
   where the plan records one, else the homes count. The grid is two
   columns, so anything longer spills onto a second row and pushes the
   text column well past the height of the render beside it.       */
export type UnitType = {
  type: string;
  units: string;
  series: string;
  plan: string;
  blurb: string;
  /* RERA carpet figures from the approved plan, rendered by
     <AreaStats/> beside the layout render. Keep to two entries. */
  stats: { label: string; value: string }[];
  /* Four each, and none of them a restatement of the blurb, the type
     name or the series line — the column has to stay short. */
  features: string[];
  /* Dimensions marked on the typical-floor plan (floors 1 to 3).
     The fourth floor sets back for the terrace — see the note.
     Habitable rooms only, as on Dhruva and Shikhar: balconies are
     covered by the "carpet + balcony" stat and the feature list, and
     listing them here only made the column taller than the render.
     Their sizes stay in the record below. */
  featured?: boolean;
};

export const unitTypes: UnitType[] = [
  {
    type: "Grand 1 BHK",
    units: "560 sq. ft.",
    series: "4 homes · units 101 / 201 / 301 / 401",
    plan: "/images/projects/rudra/unit-1bhk-560.jpg",
    blurb:
      "The one home on each floor with a separate bedroom. Living room and bedroom each open onto their own enclosed balcony.",
    stats: [
      { label: "Carpet area", value: "20.96 sq. m. (226 sq. ft.)" },
      { label: "Carpet + balcony", value: "27.60 sq. m. (297 sq. ft.)" },
    ],
    features: [
      "Separate bedroom",
      "Two enclosed balconies",
      "Separate bath and WC",
      "Kitchen on the window wall",
    ],
    featured: true,
  },
  {
    type: "Large 1 RK",
    units: "450 sq. ft.",
    series: "4 homes · units 102 / 202 / 302 / 402",
    plan: "/images/projects/rudra/unit-1rk-450.jpg",
    blurb:
      "The largest of the four 1RK layouts: one living space wide enough for a full sitting area and a dining spot, with the kitchen set apart in its own bay.",
    stats: [
      { label: "Carpet area", value: "13.25 sq. m. (143 sq. ft.)" },
      { label: "Carpet + balcony", value: "20.24 sq. m. (218 sq. ft.)" },
    ],
    features: [
      "Widest 1RK living space",
      "Kitchen in its own bay",
      "Two enclosed balconies",
      "Attached bathroom",
    ],
  },
  {
    type: "Spacious 1 RK",
    units: "440 sq. ft.",
    series: "4 homes · units 103 / 203 / 303 / 403",
    plan: "/images/projects/rudra/unit-1rk-440.jpg",
    blurb:
      "A near-square plan that keeps the kitchen on the far wall and the living area by the balcony, so the two never cross.",
    stats: [
      { label: "Carpet area", value: "17.36 sq. m. (187 sq. ft.)" },
      { label: "Homes of this type", value: "4 of 20" },
    ],
    features: [
      "Kitchen on the far wall",
      "Full-width enclosed balcony",
      "Square plan, easy to furnish",
      "Attached bathroom",
    ],
  },
  {
    type: "Spacious 1 RK",
    units: "425 sq. ft.",
    series: "4 homes · units 104 / 204 / 304 / 404",
    plan: "/images/projects/rudra/unit-1rk-425.jpg",
    blurb:
      "The same rooms in a slightly tighter footprint: living at the front by the balcony, kitchen and bathroom pushed to the back.",
    stats: [
      { label: "Carpet area", value: "19.38 sq. m. (209 sq. ft.)" },
      { label: "Homes of this type", value: "4 of 20" },
    ],
    features: [
      "Living front, kitchen back",
      "Enclosed balcony off the living",
      "Second balcony at the kitchen",
      "Attached bathroom",
    ],
  },
  {
    type: "Value 1 RK",
    units: "340 sq. ft.",
    series: "4 homes · units 105 / 205 / 305 / 405",
    plan: "/images/projects/rudra/unit-1rk-340.jpg",
    blurb:
      "The most efficient home in the building. Everything sits off one room — sofa and television on one side, the kitchen counter on the other.",
    stats: [
      { label: "Carpet area", value: "15.36 sq. m. (165 sq. ft.)" },
      { label: "Carpet + balcony", value: "16.19 sq. m. (174 sq. ft.)" },
    ],
    features: [
      "Defined zones in one room",
      "Enclosed balcony off the living",
      "Kitchen counter on one wall",
      "Attached bathroom",
    ],
  },
];

/* ---------- Source record for the figures on `unitTypes` ----------
   The carpet figures above are straight from the floor-wise
   carpet-area table on the CIDCO-approved plan
   (CIDCO/BP-16651/TPO(NM)/2019, scrutinised 13 May 2019): 5 homes on
   each of floors 1–4 = the 20 residential units in the area
   statement, plus 4 shops on the ground floor. They used to print as
   one shared strip at the foot of the section, because the table is
   keyed by unit number; they now sit on their own layout, per the
   pairing set out above `unitTypes`.

   The table, as read, unit by unit — the raw record, in case a row
   ever has to be checked or re-split:

     101 / 201 / 301 / 401   20.96   + 6.64 balcony
     102 / 202 / 302 / 402   13.25   + 6.99 balcony
     103 / 203 / 303         17.83            403 is 16.88
     104 / 204 / 304 / 404   19.38
     105 / 205 / 305         16.65   + 1.65 balcony
     405                     14.07   no balcony

   403 and 405 are smaller than their own series because the fourth
   floor sets back for the terrace. Per the owner's rule the page
   prints one carpet figure per layout, so each of those two is
   averaged into its series — see the arithmetic above `unitTypes`.
   The exact figures for both units are named in `unitTypesNote`,
   which prints under the section, so a reader is never left with
   only the averaged number.

   ROOM SCHEDULE — REFERENCE ONLY, NOT PRINTED. Room dimensions came
   off every project page on 11 Aug 2026 (owner's instruction #9), so
   nothing below reaches the site; it is kept because the extraction
   was slow and the reconciliation flag at the foot of this note is
   still open. The figures the page used to show were those marked on
   the typical-floor plan, floors 1 to 3 — the floor the 3D renders
   show. The fourth-floor drawing differs, and is recorded here too:

     401  1BHK  living 2.75×4.50 · bed 2.80×2.90 · kitchen 2.00×1.80
                bath 1.20×1.35 · WC 0.90×1.35 · E.D 1.25×0.90
                enc. balconies 2.90×1.10 and 3.05×1.15
     402  1RK   living 2.75×3.40 · kitchen 2.60×2.05 · bath 1.64×1.20
                WC 1.20×0.90 · enc. balcony 2.90×1.10
     403  1RK   living 3.79×3.00 · kitchen 1.89×1.79 · toilet 2.20×1.20
                WC 1.20×0.90 · natural-light shaft 1.05×0.95
     404  1RK   living 2.75×3.55 · kitchen 2.60×1.90 · bath 1.64×1.20
                WC 1.20×0.90
     405  1RK   living 2.75×3.55 · bath 1.20×1.55 · WC 0.90×1.38
                natural-light shaft 1.95×2.60 · no kitchen labelled

   FLAG FOR THE OWNER: the room figures do not reconcile with the
   carpet figures. Unit 401's rooms alone sum to ~26.4 sq. m. against
   a recorded carpet of 20.96, and 402's to ~19.8 against 13.25 —
   carpet should be the larger number, since it also takes in the
   internal passage. Either the table was read from an earlier
   revision of the plan or those rows are mis-assigned. Worth
   re-checking against the approved drawing before these figures are
   relied on.

   NOTE FOR LATER: the `units` figures on `unitTypes` above, and the
   "340–560" line in `overview.spaceMix`, are not carpet areas — the
   approved plan tops out at 20.96 sq. m. = 226 sq. ft. of carpet, or
   27.60 sq. m. = 297 sq. ft. carpet-plus-balcony, for the largest
   home. 340–560 sq. ft. is roughly double the carpet, so it reads as
   a saleable / super-built-up figure. Same issue as Prithvi's 2BHK.
   Left as supplied; relabel or replace when the owner confirms.

   Source line printed under the home-configurations section, the way
   Dhruva and Shikhar print theirs. */
export const unitTypesNote =
  "Carpet areas from the floor-wise carpet-area table of the CIDCO-approved building plan CIDCO/BP-16651/TPO(NM)/2019, scrutinised 13 May 2019, shown as one figure per layout. The fourth floor sets back for the terrace, so two units are smaller than the rest of their series — 403 is 16.88 sq. m. and 405 is 14.07 sq. m. with no balcony — and their layouts show the average across the floors. Renders are indicative; furniture and finishes are not part of the sale.";

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
        desc: "A mixed-use G+4 building, with homes above and shops and parking at street level.",
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
        name: "External & internal water-proofing guarantee",
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
        name: "UPVC windows",
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
    body: "Nesting Tree, established in 2019, with two decades of real estate lineage behind it, since 2004.",
  },
  {
    label: "Built for Karanjade",
    body: "Created to focus exclusively on Karanjade, with quality construction and a professional home-buying experience.",
  },
  {
    label: "The first delivered project",
    body: "Rudra is Nesting Tree's first delivered project: a G+4 residential + commercial building at Sector R2, Karanjade.",
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
    body: "Registered under MahaRERA P52000026245. Clean title, watertight paperwork.",
  },
  {
    title: "Where Nesting Tree began",
    body: "Rudra is the brand's earliest delivered project at Karanjade.",
  },
  {
    title: "Road-facing commercial",
    body: "Four shops front the busy 9 m road, giving prominent street presence.",
  },
];

/* ---------- Gallery — real on-site photographs ----------
   Complete set of documentary photos for this project (renders and
   near-duplicate "(1)" variants excluded). Generated from the folders
   under public/images/Project_Images/Rudra/. Rendered by
   <ProjectGallery/> on the project page and on /gallery — real
   photography only, never renders or stock. */
export const gallery: { src: string; alt: string; category: string }[] = [
  { src: "/images/Project_Images/Rudra/Exterior/DSC_0057.jpeg", alt: "Rudra — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Rudra/Exterior/IMG20260627114444.jpeg", alt: "Rudra — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Rudra/Exterior/IMG20260627115556.jpeg", alt: "Rudra — exterior of the building", category: "Exterior" },
  { src: "/images/Project_Images/Rudra/Aerial_View/DSC_0074.jpeg", alt: "Rudra — aerial view over the rooftop and surroundings", category: "Aerial view" },
  { src: "/images/Project_Images/Rudra/Aerial_View/DSC_0134.jpeg", alt: "Rudra — aerial view over the rooftop and surroundings", category: "Aerial view" },
  { src: "/images/Project_Images/Rudra/Aerial_View/DSC_0137.jpeg", alt: "Rudra — aerial view over the rooftop and surroundings", category: "Aerial view" },
  { src: "/images/Project_Images/Rudra/Aerial_View/DSC_0145.jpeg", alt: "Rudra — aerial view over the rooftop and surroundings", category: "Aerial view" },
  { src: "/images/Project_Images/Rudra/Aerial_View/IMG20260627115021.jpeg", alt: "Rudra — aerial view over the rooftop and surroundings", category: "Aerial view" },
  { src: "/images/Project_Images/Rudra/Entrance/IMG20260627114735.jpeg", alt: "Rudra — building entrance and approach", category: "Entrance" },
  { src: "/images/Project_Images/Rudra/Entrance/IMG20260627115504.jpeg", alt: "Rudra — building entrance and approach", category: "Entrance" },
  { src: "/images/Project_Images/Rudra/Corridor/IMG20260627115230.jpeg", alt: "Rudra — bright tiled common corridor", category: "Corridor" },
  { src: "/images/Project_Images/Rudra/Corridor/IMG20260627115309.jpeg", alt: "Rudra — bright tiled common corridor", category: "Corridor" },
  { src: "/images/Project_Images/Rudra/Lift/DSC_0065.jpeg", alt: "Rudra — passenger lift serving every floor", category: "Lift" },
  { src: "/images/Project_Images/Rudra/Parking/IMG20260627112838.jpeg", alt: "Rudra — covered ground-floor parking", category: "Parking" },
  { src: "/images/Project_Images/Rudra/Parking/IMG20260627114620.jpeg", alt: "Rudra — covered ground-floor parking", category: "Parking" },
  { src: "/images/Project_Images/Rudra/Rooftop/IMG20260627115043.jpeg", alt: "Rudra — open rooftop terrace", category: "Rooftop" },
  { src: "/images/Project_Images/Rudra/Rooftop/IMG20260627115135.jpeg", alt: "Rudra — open rooftop terrace", category: "Rooftop" },
];
