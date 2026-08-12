/* ============================================================
   Ishaan — project detail page content
   Single source of truth for the Ishaan by Nesting Tree page.
   A G+4 building at Karanjade: twelve homes, every one
   of them a 1RK, and no commercial units at all.
   Edit facts, figures and copy here; the page at
   src/pages/projects/ishaan.astro reads everything from this file.

   STATUS: under construction. All RCC work is complete; finishing
   (tiling, plaster, paint) is under way and the target for full
   readiness is March 2027. No RERA certification has been taken —
   the project runs on a Commencement Certificate — so nothing here
   claims MahaRERA registration. Bookings have not opened yet, so the
   page reads "Pre-launch", not "Now booking".

   Now supplied (from the architectural plans in
   public/images/projects/ishaan/ — 1RK, ground, typical & terrace):
     · The 1RK layout                           → unitTypes
       (its room dimensions came too, but are no longer
        printed — see the `unitTypes` note below)
     · The homes are NOT one repeated plan — the living / kitchen /
       toilet sizes differ by position. The unit card shows the
       corner 1RK (the one flagged on the key plan) as the
       representative home; do not call the plan "identical".
     · Ground / typical / terrace floor drawings → floorPlans[].plan
     · Corner plot on an 11 m and a 9 m road (from the ground plan).

   ┌─ THE FLOOR COUNT: SETTLED 11 AUG 2026 ─────────────────────────
   │ THE PAGE FOLLOWS THE APPROVED PLAN, NOT THE RENDERS. Twelve
   │ homes, THREE to a typical floor, on floors 1–4. The 1st floor
   │ is residential.
   │
   │ CONFIRMED BY THE OWNER, 11 Aug 2026, unprompted and in these
   │ words: "For Ishaan, the configuration is incorrect. 3 homes per
   │ typical floor (1-4)." That is the authority for this section —
   │ the reasoning below is what independently pointed the same way.
   │ Do not revert it to match the renders.
   │
   │ Both sources reach twelve homes by different routes, and the
   │ page used to print both at once — floors "2nd–4th" in the prose
   │ while `unitTypes` listed flats numbered 101/102/103.
   │
   │ The RERA CARPET-AREA STATEMENT of the CIDCO-approved plan
   │ (CIDCO/BP-19208/TPO(NM & K)/2024/13290, 20 Dec 2024) — the
   │ source we now follow — records THREE series, each naming four
   │ flats: 101/201/301/401, 102/202/302/402, 103/203/303/403.
   │ Three per floor across floors 1–4. A 1xx flat is a first-floor
   │ flat; that is what makes the 1st floor residential.
   │
   │ The RENDERS say otherwise — all three sheets are title-blocked
   │ "(2ND TO 4TH)" and the key plan on the 1RK sheet draws FOUR
   │ units, 4 × 3 floors = 12. They are treated as a superseded
   │ four-unit iteration, because they fail on their own arithmetic:
   │   · The 1RK sheet prints "RERA CARPET AREA 17.70 SQ.MT.", which
   │     matches none of the three approved figures. 71.035 (the
   │     built-up area on that same sheet) ÷ 4 = 17.76. Its "carpet
   │     area" is just the floor's built-up divided by its own
   │     four-unit assumption — not a carpet area at all.
   │   · Against that same 71.035 built-up, the three approved flats
   │     (50.893 carpet) come to 71.6%, which is ordinary. Four
   │     drawn flats need ~91%, which no building achieves once
   │     walls are counted.
   │   · It is also the house pattern. Shaurya is G+4 with
   │     "Residential — floors 1 to 4", flats 101 / 102, one per
   │     floor; Dhruva's series each carry "one per floor, floors
   │     1–4". Ground floor for the building, homes on 1–4. Ishaan
   │     reading "2nd–4th" was the portfolio's only outlier, and it
   │     came from the render title blocks.
   │
   │ CONSEQUENCE, and the reason two drawings vanished from the
   │ page: `Ishaan_Floor_Plan.png` and `Ishaan_1RK_Plan.png` both
   │ draw four units per floor and are captioned 2nd–4th, so they
   │ now contradict the text beside them. Both files are still on
   │ disk. Restore them the day the architect reissues them against
   │ the approved plan — see `floorPlans` and `unitTypes` below.
   │ The ground and terrace plans are unaffected and still shown.
   └────────────────────────────────────────────────────────────────

   Real photography exists at public/images/Project_Images/Ishaan/
   (5 exteriors, 4 interiors). The amenity schedule it was waiting on
   now exists (see `amenityGroups`), so these are free to hang on the
   featured amenity cards whenever someone picks the shots.

   Icon keys reference the line-icon set defined inside the page.
   ============================================================ */

/** Marks a field we have not been given. Rendered as a muted
    placeholder, never as a fact. Delete the TBD once you fill it in. */
export const TBD = "Insufficient information";

export const ishaan = {
  name: "Ishaan",
  status: "Under construction",
  // No RERA certification taken — project runs on a Commencement Certificate.
  // Kept as TBD so the hero's MahaRERA pill stays hidden; the real approval
  // status is shown as a fact in `overview.facts` and the footer (`approvals`).
  maharera: TBD,
  approvals: "Commencement Certificate obtained",
  tagline: "A G+4 residence: twelve homes, and every one of them a 1RK.",
  // Standard hero address format: Plot, Sector, Karanjade, Panvel, Pincode.
  address: "Plot no. 123, Sector 1, Karanjade, Panvel, 410206",
  hero: "/images/projects/Ishan-Reduced.jpg",
  heroPosition: "center 30%",
  // Bookings have not opened yet — pre-launch, not "Now booking".
  pills: ["Pre-launch"],
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Ishaan+Nesting+Tree+Karanjade+Navi+Mumbai",
};

/* ---------- Sales contact ----------
   Vipin is the single point of contact for every Nesting Tree project,
   and for Nesting Tree itself — confirmed by the owner. The same block
   appears in each project file. */
export const sales = {
  name: "Vipin",
  phone: "95940 79317",
  phoneHref: "tel:+919594079317",
};

/* ---------- Headline stats band (4 figures) ---------- */
export const heroStats = [
  { figure: "G+4", label: "Storeys" },
  { figure: "12", label: "Homes" },
  { figure: "1RK", label: "Every home" },
  { figure: "100%", label: "Residential" },
];

/* ---------- Overview ----------
   `unitMix` runs three tiles, not four: the mix really is one line.
   Padding it out with a repeated figure would be noise, so the page
   lays these out on a 3-up grid.                                   */
export const overview = {
  intro:
    "A G+4 structure of twelve 1RK homes, three to a typical floor across floors 1 to 4, with no commercial units anywhere in the building.",
  facts: [
    { label: "Construction stage", value: "RCC complete · tiling, plaster & paint under way" },
    { label: "Possession", value: "Targeting March 2027" },
    { label: "Structure", value: "G+4 storey · corner plot on an 11 m & a 9 m road" },
    { label: "Configuration", value: "12 × 1RK · three homes per floor (1st–4th)" },
    /* 16.964 = the mean of the approved plan's three series (15.223 /
       19.080 / 16.590), four homes each — one on each of floors 1–4,
       which is why the mean is unweighted — the same figure the unit
       card's summary row carries. This row used to read 17.70 sq.mt,
       which matches none of the three and is not their mean; with the
       card now printing one averaged figure, the two contradicted
       each other on the same page. See the `unitTypes` comment. */
    { label: "Carpet area", value: "16.96 sq. m. (≈ 183 sq. ft.) average per 1RK" },
    { label: "Approvals", value: "Commencement Certificate obtained" },
  ],
  unitMix: [
    { figure: "12", label: "1RK apartments" },
    { figure: "3", label: "Homes per floor" },
    { figure: "G+4", label: "Storeys" },
  ],
  connectivity:
    "Ishaan sits in Karanjade, a fast-growing residential pocket of Navi Mumbai with strong road connectivity across the Mumbai–Pune corridor and the wider Navi Mumbai area.",
};

/* ---------- Construction / build progress ----------
   Owner-confirmed status: all RCC work is complete and finishing —
   tiling, painting, plaster — is running. Full readiness is targeted
   for March 2027. `state` drives the stepper styling in the page, and
   the same five phases are used on every project page so two projects
   can be read side by side.                                        */
export const buildProgress: {
  phase: string;
  detail: string;
  state: "done" | "current" | "upcoming";
}[] = [
  {
    phase: "Foundation",
    detail: "Excavation and foundation cast on the corner plot.",
    state: "done",
  },
  {
    phase: "RCC structure",
    detail: "All RCC work is complete. The full G+4 frame stands.",
    state: "done",
  },
  {
    phase: "Finishing works",
    detail: "Tiling, painting and plaster under way across the twelve homes.",
    state: "current",
  },
  {
    phase: "Fittings & fit-out",
    detail: "Flooring, fittings and the final finishes in every home.",
    state: "upcoming",
  },
  {
    phase: "Handover",
    detail: "Fully ready by March 2027: possession and keys.",
    state: "upcoming",
  },
];

/* ---------- Floor plans ----------
   Real architectural drawings, supplied at
   public/images/projects/ishaan/. The set runs bottom to top:
   ground → residential floors → terrace.

   `plan` is OPTIONAL. The residential-floor entry carries none: the
   supplied drawing draws four units per floor and is title-blocked
   "2ND TO 4TH", so it contradicts the approved plan this page now
   follows (see the header block). The entry keeps its text — the
   core, the lobby, the chajjas are all still true — and simply has
   no drawing until the architect reissues one. A card with no `plan`
   renders full-width with no image and no "pending" badge, because
   nothing here is pending: a drawing exists, it is just wrong.   */
export type FloorPlan = {
  title: string;
  label: string;
  plan?: string;
  planPending?: boolean;
  blurb: string;
  points: string[];
};

export const floorPlans: FloorPlan[] = [
  {
    title: "Ground floor",
    label: "Entry, parking & lobby",
    plan: "/images/projects/ishaan/Ishaan_Ground_Plan.png",
    blurb:
      "Ishaan carries no shops, so the ground floor belongs entirely to the building. A sliding-gate entry off the road, covered parking, and the residents' lobby with the lift and staircase.",
    points: [
      "Sliding-gate entry / exit",
      "Car & two-wheeler parking",
      "Lobby 2.50 × 3.80 m",
      "Lift 1.65 × 1.80 m + staircase",
      "Corner plot — 11 m & 9 m roads",
      "No commercial units",
    ],
  },
  {
    title: "Typical floor",
    label: "1st–4th · three 1RK homes",
    // Drawing withheld — Ishaan_Floor_Plan.png draws four units and is
    // captioned 2nd–4th. Restore it here once reissued.
    blurb:
      "The homes sit on the typical floors, three to a floor, all of them 1RK, wrapped around a central lift-and-staircase core with a shared lobby. Every floor from the 1st to the 4th is identical.",
    points: [
      "Three 1RK homes per floor",
      "Central lift & staircase core",
      "Shared lobby 3.65 × 1.60 m",
      "Chajja / balcony to each home",
      "Floors 1st–4th identical",
      "12 homes in all",
    ],
  },
  {
    title: "Terrace",
    label: "Open to sky",
    plan: "/images/projects/ishaan/Ishaan_Terrace_Plan.png",
    blurb:
      "Above the homes sits an open terrace, with the building's services tucked to one side: the overhead water tank, the lift machine room and the pump room.",
    points: [
      "Terrace open to sky",
      "Parapet wall 1.20 m high",
      "O.H. water tank — 7,182 L",
      "Lift machine room",
    ],
  },
];

/* ---------- Unit types — the flat layouts ----------
   Ishaan follows Shikhar's per-flat pattern rather than Dhruva's
   floor-only one: a buyer choosing a home needs to see the home, not
   just the storey it sits on. Same shape as `unitTypes` in shikhar.ts
   — there is simply one entry, because there is one kind of home.
   (Bookings have NOT opened: the page reads "Pre-launch". The layout
   choice holds either way; this comment used to justify it with "Ishaan
   is now booking", which was never true of this project.)

   `features` is hidden while empty rather than faked.

   `stats` carries the RERA carpet areas from the CIDCO-approved plan
   (CIDCO/BP-19208/TPO(NM & K)/2024/13290, approved 20 Dec 2024). Its
   carpet-area statement has three rows, not one — the twelve homes
   are all 1RK, but they come in three sizes:

     101, 201, 301, 401   15.223 sq. m.
     102, 202, 302, 402   19.080 sq. m.
     103, 203, 303, 403   16.590 sq. m.

   No enclosed or open balcony area is recorded against any of them.

   The summary row at the top of `stats` prints ONE figure rather than
   the 15.22 – 19.08 range — a range reads as uncertainty on a sales
   page. It is the mean of the three series, unweighted because each
   carries four homes: (15.223 + 19.080 + 16.590) / 3 = 16.964, the
   same 16.964 the `features` comment below refers to. It is labelled
   an average precisely because the three exact per-series rows sit
   directly under it — an unqualified "all 12 homes" against a single
   figure would contradict them.

   THE FLAT NUMBERS AND THE FLOOR RANGE NOW AGREE, and did not always.
   `stats` prints "Flats 101 / 201 / 301 / 401" — a 1xx flat is a
   first-floor flat — and `series`, `floorPlans` and `overview` all now
   read floors 1–4 to match. They used to say the homes started on the
   2nd, which put both readings on the page at once; that was settled on
   11 Aug 2026 in favour of the approved plan and confirmed by the owner.
   The header block at the top of this file is the full account. These
   numbers and the floor range move TOGETHER — never edit one alone.

   The room dimensions that used to sit on this card came off on
   11 Aug 2026 (owner's instruction #9: no room dimensions on any
   project page). For the record, since it is the reasoning that tied
   this card to a specific home: the drawn living 2.75 × 3.15, kitchen
   1.70 × 2.75 and toilet 2.30 × 1.20 sum to 16.098 sq. m., a triple
   that lands only on flat 103 of the fifteen possible splits — so the
   card describes the 16.590 home. Never certain enough to print as a
   single figure, which is why `stats` still lists all three series. */
export type UnitType = {
  type: string;
  units: string;
  series: string;
  /* Optional for the same reason as `FloorPlan.plan` above:
     Ishaan_1RK_Plan.png is withheld. Its key plan draws four units,
     it is captioned "(2ND TO 4TH)", and it prints "RERA CARPET AREA
     17.70 SQ.MT." — a figure that is really the floor's built-up
     area divided by four, and that matches none of the three
     approved carpet areas printed on this very card. */
  plan?: string;
  planPending?: boolean;
  blurb: string;
  stats: { label: string; value: string }[];
  features: string[];
};

export const unitTypes: UnitType[] = [
  {
    type: "1RK",
    units: "12 units",
    series: "Typical floors · 1st–4th",
    blurb:
      "The one kind of home at Ishaan: a living-cum-bedroom, a separate kitchen and an attached toilet, each opening to its own chajja. Three sit on every typical floor, from the 1st to the 4th.",
    stats: [
      { label: "Carpet area — 12-home average", value: "16.96 sq. m. (183 sq. ft.)" },
      { label: "Flats 101 / 201 / 301 / 401", value: "15.22 sq. m. (164 sq. ft.)" },
      { label: "Flats 102 / 202 / 302 / 402", value: "19.08 sq. m. (205 sq. ft.)" },
      { label: "Flats 103 / 203 / 303 / 403", value: "16.59 sq. m. (179 sq. ft.)" },
      { label: "Enclosed balcony", value: "None recorded" },
    ],
    features: [
      // The old "RERA carpet area — 17.70 sq.mt (≈ 190 sq.ft)" bullet
      // was removed: the approved plan records 15.223, 19.080 and
      // 16.590 — 17.70 matches none of them, and is not their mean
      // (16.964) either. Leaving it put two different RERA carpet
      // areas under the same label on one card.
      "Separate kitchen with cooking platform",
      "Attached toilet with WC & washbasin",
      "Private chajja / balcony",
    ],
  },
];

/* Source line printed under the unit-types section. */
export const unitTypesNote =
  "Carpet areas from the RERA carpet-area statement of the CIDCO-approved building plan CIDCO/BP-19208/TPO(NM & K)/2024/13290, approved 20 December 2024. The twelve homes come in the three sizes listed above; the summary figure is their average. The statement records no enclosed or open balcony area against any of the twelve homes. Renders are indicative; furniture and finishes are not part of the sale.";

/* ---------- The clear-corner read — the page's creative ----------
   Ishaan is the name of the north-east: in Vastu, Ishanya is the
   corner of first light, the one left open and uncluttered. The
   building reads the same way — it does one thing. Twelve homes,
   one plan, nothing else in the building competing for the room.
   Written entirely from the three facts we have (G+4 · 0 shops ·
   12 × 1RK), so none of it goes stale when the rest arrives.

   NOTE: this is deliberately a reading of the NAME, not a claim
   that the building is Vastu-compliant or north-east facing — we
   have not been told either. Keep it that way when editing.
   The Prithvi equivalent is `levels`; Shikhar's is `amenityStages`. */
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
    marker: "0",
    title: "Homes, and nothing else",
    category: "Purely residential",
    icon: "lobby",
    featured: true,
    blurb:
      "There are no shops at Ishaan. The building carries one use and one only. The whole of it belongs to the people who live in it.",
    points: ["No commercial units", "A single-use, purely residential building"],
  },
  {
    marker: "12",
    title: "Twelve homes",
    category: "The count",
    icon: "tower",
    blurb:
      "Four floors and twelve homes, three to a typical floor. A small building with a short list of neighbours, and the whole of Ishaan fits on one page.",
    points: ["G+4 storey structure", "Three 1RK homes per typical floor"],
  },
  {
    marker: "1RK",
    title: "One kind of home",
    category: "The plan",
    icon: "window",
    featured: true,
    blurb:
      "Every home at Ishaan is a 1RK: a living-cum-bedroom, a kitchen and an attached toilet opening to its own chajja, about 17 sq.mt of carpet. One kind of home, top to bottom.",
    /* "≈ 17 sq.mt carpet, average" not "17.70 each" — the twelve homes
       run 15.22 / 16.59 / 19.08, so "each" was never true. */
    points: ["12 × 1RK apartments", "≈ 17 sq.mt carpet, average"],
  },
];

/* ---------- Amenities ----------
   FILLED. This block used to read "empty by design" because no
   schedule had been supplied; one has been since, and `amenityGroups`
   below carries it. The page still falls back to the "Insufficient
   information" panel if the array is ever emptied again — that is why
   the fallback markup is kept in ishaan.astro.

   Ishaan groups as "Buy with confidence" / "Building" rather than
   shikhar.ts's Building / Lifestyle / Interiors, because it has no
   lifestyle amenities and no interior finishes spec. The missing
   Interiors group is a real gap, tracked as item 2 of the punch list —
   do not paper over it by borrowing another project's finishes. */
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
    caption: "What stands behind the purchase",
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
        desc: "Purchase from a builder with delivered projects in Karanjade, Navi Mumbai.",
      },
      {
        icon: "lobby",
        name: "100% owner-occupied",
        desc: "Every home bought by a family to live in, not to rent out.",
      },
      {
        icon: "window",
        name: "Direct from the landowner",
        desc: "No 50:50 or tri-party agreement: the strongest paperwork, with no legal hassles.",
      },
    ],
  },
  {
    group: "Building",
    caption: "Everyday living",
    items: [
      {
        icon: "elevator",
        name: "Automatic high-speed lift",
        desc: "One automatic high-speed elevator, for safety and comfort.",
        featured: true,
      },
      { icon: "parking", name: "Ample parking", desc: "Room to park without circling for a spot." },
      {
        icon: "grill",
        name: "Rule-based society living",
        desc: "A managed, rule-based society. Order kept for everyone who lives here.",
      },
    ],
  },
];

/* `amenitiesNeeded` was here — the "Still needed" checklist printed
   inside the empty-amenities panel. The schedule above is filled, so
   the panel never renders and the array had been sitting at [] with
   nothing to say. Deleted on 11 Aug 2026 along with the "Still needed"
   list in ishaan.astro; the empty-amenities panel itself is kept, since
   it is what appears if `amenityGroups` is ever emptied again. The
   sibling files that are genuinely still waiting on a schedule
   (udaan.ts) keep theirs. */

/* ---------- About the developer (dark section) ----------
   Brand-level facts, consistent with dhruva.ts and prithvi.ts.    */
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
    body: "Rudra, Dhruva and Shaurya are complete and handed over to their residents.",
  },
  {
    label: "A proven portfolio",
    body: "Lush Meadows (16-storey, Kharghar) and Gopala (Vashi) are appreciated for quality, timely completion and amenities.",
  },
];

/* ---------- Why Ishaan (6 cards) ----------
   Brand-level reasons carried from site.ts until project-specific
   ones are supplied — nothing here claims anything about Ishaan
   that we have not been told.                                     */
export const whyIshaan: { title: string; body: string }[] = [
  {
    title: "A track record, not a promise",
    body: "Two decades of housing behind us, from Gopala in Vashi (2004) to residences delivered and handed over in Karanjade today.",
  },
  {
    title: "Possession on time",
    body: "We build to a schedule and hand over on it, exactly as our delivered projects were.",
  },
  {
    title: "Clean title, direct from the owner",
    body: "Buy straight from the landowner. No 50:50 or tri-party agreement. Strong paperwork, no legal hassles.",
  },
  {
    title: "Amenities as standard",
    body: "An automatic high-speed lift, ample parking and rule-based society living: built in, not sold as extras.",
  },
  {
    title: "Built to last",
    body: "Construction quality you can live in, and still trust years after handover.",
  },
  {
    title: "Better everyday living",
    body: "You pay a little more, and you get more than a flat: a building that improves your day.",
  },
];

/* ---------- Gallery — real on-site photographs ----------
   Complete set of documentary photos for this project (renders and
   near-duplicate "(1)" variants excluded). Rendered by <ProjectGallery/>
   on the project page and on /gallery — real photography only, never
   renders or stock.

   Filenames, alt text and the width/height pairs are GENERATED by
   `node scripts/optimise-project-images.mjs ishaan`, which reads
   scripts/alt-text/ishaan.tsv. Edit the alt text there, not here, or the
   next run overwrites it. Files live under public/images/projects/ishaan/
   photos/, each with a 640 px `-640.webp` companion that ProjectGallery
   puts in the srcset; `src` below is the full size the lightbox opens.

   The old camera-named paths still resolve — see src/lib/image-redirects.ts. */
export const gallery: { src: string; alt: string; category: string; width?: number; height?: number }[] = [
  { src: "/images/Project_Images/Ishaan/DSC_0101.jpeg", alt: "Ishaan — exterior of the building", category: "Exterior" },
  { src: "/images/projects/ishaan/photos/ishaan-exterior-01.webp", alt: "The frame going up in brick and concrete, a mixer and a parked autorickshaw at the roadside — Ishaan, Karanjade", category: "Exterior", width: 1066, height: 1600 },
  { src: "/images/projects/ishaan/photos/ishaan-exterior-02.webp", alt: "The curved corner in red brick infill, a stack of bricks and a car on the unmade road — Ishaan, Karanjade", category: "Exterior", width: 1600, height: 1066 },
  { src: "/images/projects/ishaan/photos/ishaan-exterior-03.webp", alt: "The full height of the shell against a clear sky, brick stacked ready at the base — Ishaan, Karanjade", category: "Exterior", width: 1600, height: 1200 },
  { src: "/images/projects/ishaan/photos/ishaan-exterior-04.webp", alt: "Seen at an angle from the unmade road, brickwork rising between the concrete floors — Ishaan, Karanjade", category: "Exterior", width: 1200, height: 1600 },
  { src: "/images/projects/ishaan/photos/ishaan-exterior-05.webp", alt: "The corner plot from further down the road, the frame still open to the sky at the top — Ishaan, Karanjade", category: "Exterior", width: 1600, height: 1154 },
  { src: "/images/projects/ishaan/photos/ishaan-interior-01.webp", alt: "Bare brick walls and a raw floor in a 1RK, the opening framing the building next door — Ishaan", category: "Interior", width: 1600, height: 1200 },
  { src: "/images/projects/ishaan/photos/ishaan-interior-02.webp", alt: "A wide corner window opening over the street in a 1RK, brick and rubble still on the floor — Ishaan", category: "Interior", width: 1600, height: 1200 },
  { src: "/images/projects/ishaan/photos/ishaan-interior-03.webp", alt: "A worker rendering the wall of a narrow brick-lined space, standing on a folding platform — Ishaan", category: "Interior", width: 1600, height: 1200 },
  { src: "/images/projects/ishaan/photos/ishaan-interior-04.webp", alt: "A worker running plaster down a doorway reveal, the brickwork still open beside it — Ishaan", category: "Interior", width: 1600, height: 1200 },
];
