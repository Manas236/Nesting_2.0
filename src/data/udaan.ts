/* ============================================================
   Udaan — project detail page content
   Single source of truth for the Udaan by Nesting Tree page.
   Nesting Tree's seventh project and the first that isn't a
   residence: a purely commercial building at Karanjade.
   Edit facts, figures and copy here; the page at
   src/pages/projects/udaan.astro reads everything from this file.

   STATUS: in approvals. No Commencement Certificate has been
   received and no work has started on site, so the page must not
   read "under construction", must not carry pricing or carpet
   areas, and must not invite a booking. It sits in the Ongoing
   band on /projects at the owner's instruction (8 Aug 2026), with
   `inApprovals: true` in src/data/site.ts keeping it out of every
   "under construction" figure on the site.

   WHAT WE ACTUALLY KNOW — the whole list, as supplied:
     · Purely commercial. No residential apartments anywhere in it.
     · No shops on the ground floor.
     · Not a corner plot.
     · Plot no. 122A, Sector R1, Karanjade, Panvel.
     · Approvals and documentation are under way.

   Everything else — storeys, unit count, unit sizes, carpet areas,
   the amenity schedule, the possession date, and the elevation
   itself — has not been supplied and is NOT guessed at here. Each
   renders as `TBD` ("To be announced") in muted italic, so a gap
   always reads as a gap and never as a fact. Fill a field in and
   the placeholder disappears on its own.

   DELIBERATELY NOT STATED: the plot was described as "not a corner
   plot, might be middle". Only the confirmed half of that is
   printed. Do not upgrade "might be" to "is an intermediate plot"
   until someone confirms it.

   PLACEHOLDER ASSET: `hero` points at a drawn placeholder, not a
   render — public/images/projects/udaan-placeholder.svg. Replace it
   (here and in the Udaan entry of src/data/site.ts) the moment a
   real elevation exists, and delete the SVG.

   Icon keys reference the line-icon set defined inside the page.
   ============================================================ */

/** Marks a field we have not been given. Rendered as a muted
    placeholder, never as a fact. Delete the TBD once you fill it in.
    Reads "To be announced" rather than the sibling projects'
    "Insufficient information": on a project this early, almost every
    field is blank, and a page of "insufficient information" reads as
    a broken page rather than an early one. */
export const TBD = "To be announced";

export const udaan = {
  name: "Udaan",
  status: "In approvals",
  // No MahaRERA registration — the project predates its Commencement
  // Certificate, let alone a RERA number. Kept as TBD so the hero's
  // MahaRERA pill stays hidden; the real approval status is shown as a
  // fact in `overview.facts` and in the footer (`approvals`).
  maharera: TBD,
  approvals: "In approvals — Commencement Certificate not yet received",
  tagline: "Our first purely commercial building: no apartments, and no shops at street level.",
  // Standard hero address format: Plot, Sector, Karanjade, Panvel, Pincode.
  address: "Plot no. 122A, Sector R1, Karanjade, Panvel, 410206",
  // Placeholder, not a render. See the note at the top of this file.
  hero: "/images/projects/udaan-placeholder.svg",
  heroPosition: "center center",
  // NOT "Pre-launch" and NOT "Now booking" — nothing here may be
  // advertised for sale until the registration exists.
  pills: ["Not open for booking"],
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Karanjade+Sector+R1+Panvel+Navi+Mumbai",
};

/* ---------- Sales / office contact ----------
   Moved to src/data/site.ts on 11 Aug 2026. Vipin is the single point of
   contact for every project, so the block is defined once there and
   udaan.astro imports it from site.ts. Do not re-add it here. */

/* ---------- Headline stats band (4 figures) ----------
   Two of the four read "TBA" and are meant to. The storey count and
   the unit count are the first two things a visitor looks for, and
   printing a blank where an invented figure would go is the point of
   publishing this page early.                                       */
export const heroStats = [
  { figure: "1st", label: "Commercial project" },
  { figure: "100%", label: "Commercial use" },
  { figure: "TBA", label: "Storeys" },
  { figure: "TBA", label: "Units" },
];

/* ---------- Overview ----------
   `unitMix` runs three tiles like Ishaan's, not four. Two of them are
   zeroes — and a zero is a real answer here, not a gap: no apartments
   and no ground-floor shops are two of the five things we know.     */
export const overview = {
  intro:
    "Udaan is Nesting Tree's seventh project and the first that isn't a home. A purely commercial building at Karanjade: no apartments anywhere in it, and no shops at street level either. It is still on paper — approvals and documentation are under way, and the drawings, the storey count and the unit mix will be published here as they are signed off.",
  facts: [
    { label: "Project stage", value: "In approvals · documentation under way" },
    { label: "Construction stage", value: "Not started on site" },
    { label: "Use", value: "Purely commercial — no residential apartments" },
    { label: "Ground floor", value: "No shops" },
    // The confirmed half of "not a corner plot, might be middle".
    { label: "Plot", value: "Not a corner plot" },
    { label: "Structure", value: TBD },
    { label: "Configuration", value: TBD },
    { label: "Possession", value: TBD },
    { label: "Approvals", value: "Commencement Certificate not yet received" },
  ],
  unitMix: [
    { figure: "0", label: "Residential apartments" },
    { figure: "0", label: "Ground-floor shops" },
    { figure: "TBA", label: "Commercial units" },
  ],
  connectivity:
    "Udaan sits in Karanjade, a fast-growing pocket of Navi Mumbai with strong road connectivity across the Mumbai–Pune corridor and the wider Navi Mumbai area — the same neighbourhood as every Nesting Tree building delivered or under way today.",
};

/* ---------- Construction / build progress ----------
   SIX phases, not the usual five: an "Approvals & documentation" step
   is added ahead of Foundation, because that is the one Udaan is
   actually on, and a stepper whose first node is already "in progress
   — foundation" would state something untrue. Every other phase is
   Upcoming, with no dates against them: no schedule has been set.

   When the Commencement Certificate lands: flip Approvals to "done",
   Foundation to "current", drop `inApprovals` from the Udaan entry in
   src/data/site.ts, and change its `statusLabel` to "Under construction".
   `state` drives the stepper styling in the page.                    */
export const buildProgress: {
  phase: string;
  detail: string;
  state: "done" | "current" | "upcoming";
}[] = [
  {
    phase: "Approvals & documentation",
    detail: "Where Udaan stands today. Plans and paperwork are being worked through.",
    state: "current",
  },
  {
    phase: "Commencement Certificate",
    detail: "Not yet received. Nothing can start on site until it is.",
    state: "upcoming",
  },
  {
    phase: "Foundation",
    detail: "Excavation and foundation, once the certificate is in hand.",
    state: "upcoming",
  },
  {
    phase: "RCC structure",
    detail: "The frame goes up. Storey count to be announced.",
    state: "upcoming",
  },
  {
    phase: "Finishing works",
    detail: "Plaster, tiling and paint through the building.",
    state: "upcoming",
  },
  {
    phase: "Handover",
    detail: "Possession and keys. No date has been set.",
    state: "upcoming",
  },
];

/* ---------- Floor plans ----------
   EMPTY BY DESIGN — no drawings have been supplied, because none have
   been approved. The page renders a "to be announced" panel while this
   array is empty and switches to the full plan-by-plan layout the
   moment you fill it, exactly as the other project pages do. Follow
   ishaan.ts / prithvi.ts for the shape.                              */
export type FloorPlan = {
  title: string;
  label: string;
  plan: string;
  planPending?: boolean;
  blurb: string;
  points: string[];
};

export const floorPlans: FloorPlan[] = [];

/* ---------- Unit types — the commercial units ----------
   EMPTY BY DESIGN. There is no approved plan, so there are no unit
   sizes, no carpet areas and no layouts to show. Nothing is estimated
   here: a carpet area printed before the approved plan exists is the
   one number a buyer would hold us to.

   When the plan is approved, fill this the way ishaan.ts does — and
   follow the house rule while doing it: ONE carpet-area figure per
   layout, never a range; where units of one layout differ, print the
   unit-count-weighted mean and disclose the averaging in
   `unitTypesNote` below.                                            */
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

export const unitTypes: UnitType[] = [];

/* Source line printed under the unit-types section, once there is one. */
export const unitTypesNote =
  "Unit sizes and carpet areas will be published from the approved building plan once it is sanctioned, with the same RERA carpet-area statement every other Nesting Tree project page carries.";

/* ---------- The three readings — the page's creative ----------
   Written entirely from the handful of facts we have (commercial use ·
   no ground-floor shops · our seventh project, and the first of its
   kind for us), so none of it goes stale when the drawings arrive.

   NOTE: the third card reads the NAME — udaan, "take-off" — as a
   framing for a first commercial building. It is not a claim about the
   building's design, height or tenants. Keep it that way when editing.
   The Ishaan and Prithvi equivalents are both called `levels`.       */
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
    marker: "100%",
    title: "Commercial, top to bottom",
    category: "The use",
    icon: "tower",
    featured: true,
    blurb:
      "Udaan carries one use and one only. There are no apartments in it — the whole building is commercial space, so nothing in it is competing with anything else.",
    points: ["Purely commercial", "No residential apartments"],
  },
  {
    marker: "0",
    title: "No shops at street level",
    category: "The ground floor",
    icon: "shop",
    blurb:
      "The ground floor is not given over to retail. What it does carry is being drawn now, and it will be published here once the plans are through.",
    points: ["No ground-floor shops", "One use, from the ground up"],
  },
  {
    marker: "07",
    title: "The first of its kind for us",
    category: "The name",
    icon: "star",
    featured: true,
    blurb:
      "Udaan means take-off. It is our seventh project and the first that isn't a home: the same builder, the same standard, a different kind of building.",
    points: ["Nesting Tree's 7th project", "The first that isn't a residence"],
  },
];

/* ---------- Amenities ----------
   EMPTY BY DESIGN — nothing has been specified, because the building
   has not been designed. The page renders the "to be announced" panel
   while this array is empty, and switches to the full grouped list the
   moment you fill it. Group it the way shikhar.ts and dhruva.ts do;
   the page's icon set already carries the keys those files use.      */
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

export const amenityGroups: AmenityGroup[] = [];

/** Printed under the empty-amenities panel, so the page says what it is
    waiting for rather than only that it is waiting. */
export const amenitiesNeeded: string[] = [
  "Storey count and floor-wise use",
  "Unit count, unit sizes and the unit mix",
  "Approved building plan drawings",
  "RERA carpet-area statement",
  "Lift, parking and services schedule",
  "Elevation render",
  "Commencement Certificate",
  "Target possession date",
];

/* ---------- About the developer (dark section) ----------
   Brand-level facts, consistent with the other project files. Wording
   is adjusted for a commercial building — "residences" would be wrong
   as a description of Udaan itself.                                  */
export const developerNotes: { label: string; body: string }[] = [
  {
    label: "Two decades of lineage",
    body: "Nesting Tree, established in 2019, with two decades of real estate lineage behind it, since 2004.",
  },
  {
    label: "Built for Karanjade",
    body: "Focused on Karanjade, with an emphasis on quality construction and a professional buying experience.",
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

/* ---------- Why Udaan (6 cards) ----------
   Brand-level reasons carried from site.ts, reworded for a commercial
   building — nothing here claims anything about Udaan that we have not
   been told, and #4 says plainly that there is nothing to sell yet.  */
export const whyUdaan: { title: string; body: string }[] = [
  {
    title: "A track record, not a promise",
    body: "Two decades of building behind us, from Gopala in Vashi (2004) to the residences delivered and handed over in Karanjade today.",
  },
  {
    title: "Possession on time",
    body: "We build to a schedule and hand over on it, exactly as our delivered projects were.",
  },
  {
    title: "Clean title, direct from the owner",
    body: "Clear-title land bought straight from the landowner. No 50:50 or tri-party agreement, so you buy with confidence.",
  },
  {
    title: "Told straight, at every stage",
    body: "Udaan is in approvals, and this page says so. No launch date, no pricing and no bookings until there is something real to publish.",
  },
  {
    title: "Built to last",
    body: "Construction quality you can work in, and still trust years after handover.",
  },
  {
    title: "The same standard, a different use",
    body: "Our first commercial building, held to the standard our residences are built to.",
  },
];

/* ---------- Gallery — real on-site photographs ----------
   EMPTY BY DESIGN: nothing has been built, so there is nothing to
   photograph. <ProjectGallery/> hides itself while this is empty, and
   /gallery skips the project (galleries.ts drops any group with no
   photos). Real photography only when it exists — never renders,
   never stock.                                                       */
export const gallery: { src: string; alt: string; category: string }[] = [];
