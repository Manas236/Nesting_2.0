/* ============================================================
   Nesting Tree — About page content
   Sourced from the company profile document, reconciled to the
   site's established facts (housing record since 2004; the Nesting
   Tree entity since 2019; Karanjade, Navi Mumbai) where the two
   disagreed. Edit copy here — about.astro reads everything from
   this file.

   NOTE: the track record starts in 2004, not 2019 — see the `brand`
   comment in site.ts. Never write a standalone "since 2019" here.
   ============================================================ */

export const about = {
  kicker: "About Nesting Tree",
  title: "Built on Trust. Proven Over Time.",
  lede:
    "Twenty years of building in Navi Mumbai. A legacy that began with Gopala in Vashi in 2004 and continues today through Nesting Tree. Supported by the engineering excellence of K.D. Construction, we create amenity-first homes that meet the needs of every stage of life.",

  /* ---------- Our Story ---------- */
  story: {
    label: "Our Story",
    heading: "Backed by engineering. Built for living.",
    lead:
      "Nesting Tree has emerged as one of Navi Mumbai's most trusted residential developers, with a portfolio spanning affordable, mid-segment, and premium homes. Backed by the engineering excellence of K.D. Constructions—a multi-disciplinary infrastructure company with deep expertise in large infrastructure projects—Nesting Tree combines technical precision with a steadfast commitment to putting customers first.",
    paragraphs: [
      "Drawing on its parent company's construction and project-management strength, and on more than twenty years of the founder's housing work in Navi Mumbai, Nesting Tree is committed to timely delivery, superior build quality and transparent dealing. It has expanded across multiple residential developments and handed over landmark projects across Navi Mumbai - Rudra, Dhruva & Shaurya.",
      "A steadfast commitment to clear-title land, sustainable development, superior construction quality, and a customer-first approach has earned Nesting Tree the trust of homebuyers and reinforced its reputation in Navi Mumbai's competitive real estate market. Every project is thoughtfully designed to deliver modern living, seamless connectivity, and enduring value—creating homes that appeal equally to end-users and long-term investors.",
    ],
    facts: [
      { k: "Building homes", v: "Since 2004" },
      { k: "Parent Company", v: "K.D. Constructions" },
      { k: "Region", v: "Navi Mumbai & Panvel" },
      // Owner's wording, 11 Aug 2026, verbatim. "Where necessary" is doing
      // the same job the old "where registered" did — not every project is
      // RERA-registered (Ishaan, Prithvi, Shaurya and Udaan are not), so this
      // must never drift into a blanket claim. See the `maharera` note in
      // site.ts, which carries the same qualifier for the footer.
      { k: "Standard", v: "Clear title. No tri-party agreements. RERA registered where necessary." },
    ],
  },

  /* ---------- Founder / Leadership ----------
     The human root of the company. Full name confirmed by the owner:
     "Kailash Shankarlal Gindodia" (surname Gindodia). The card shows the
     shorter "Kailash Gindodia"; the full name leads the bio.
     Portrait asset: /images/Kd_Sir.JPG (used in the founder card). The
     `monogram` below is kept as a fallback but no longer rendered. */
  founder: {
    label: "Leadership",
    heading: "The Vision Behind Every Home.",
    name: "Kailash Gindodia",
    role: "Founder",
    monogram: "KD",
    tenure: "Dhule → Mumbai · Since 1985",
    lead:
      "Kailash Shankarlal Gindodia, Founder of Nesting Tree, has built his legacy on perseverance, integrity, and an uncompromising commitment to quality construction.",
    paragraphs: [
      // Owner's own text, 11 Aug 2026, verbatim — do not paraphrase it back
      // towards the old wording. The differences that matter: "sheer
      // perseverance", "grew" (not "expanded"), "along the way", and the
      // Mumbai Metropolitan Region written out with no (MMR) abbreviation.
      "He arrived in Mumbai from Dhule in 1985 with a modest CIDCO contract worth ₹2 lakh. Through sheer perseverance and engineering expertise, he steadily grew his construction business across the Mumbai Metropolitan Region, executing several government infrastructure projects along the way.",
      "In 2004, he entered the residential real estate sector with Gopala, a landmark housing project in Vashi developed on a CIDCO tender plot. That project marked the beginning of Nesting Tree's journey as a trusted residential developer. Since then, the company has delivered several landmark developments across Vashi, Kharghar, and Navi Mumbai, earning the confidence of hundreds of families through its unwavering focus on quality, transparency, and timely delivery.",
      "As a first-generation entrepreneur, Mr. Gindodia has shaped Nesting Tree around values that continue to define the company today—integrity, craftsmanship, customer trust, and long-term value creation. His vision extends beyond constructing buildings; it is about creating thoughtfully designed communities where families can thrive and generations can build their future with confidence.",
    ],
    values: [
      {
        k: "Integrity",
        v: "Clear-title land and honest paperwork on every deal, the way it has been done from the very first project.",
      },
      {
        k: "Grit",
        v: "Everything earned, nothing inherited. Built from scratch and delivered on the promise.",
      },
      {
        k: "Intelligence",
        v: "A sharp read on land, cost and timing, so homes hold their value for years.",
      },
    ],
  },

  /* ---------- Vision & Mission ----------
     Each principle carries a short lead paragraph plus a list of
     commitments. about.astro renders `points` as a list when present,
     falling back to `body` for a single statement. */
  principlesIntro:
    "The standard we hold ourselves to on every project: the thinking behind each home we plan, build and hand over.",
  principles: [
    {
      no: "01",
      kicker: "Our Mission",
      // Owner's text, 12 Aug 2026, verbatim — do not paraphrase it back
      // towards the previous wording.
      body:
        "We aspire to be a trusted real estate brand that transforms dreams into enduring homes and vibrant communities, setting new benchmarks in quality, innovation and sustainable development.",
      // Three further commitments were deleted in the live editor on 6 Aug 2026
      // (content_edits 91, 92, 93). The survivor reads as prose, not as one item
      // of a list, so it renders as a follow-on paragraph — a single bullet is
      // a list of one. `points` still works if the commitments ever come back.
      paragraphs: [
        "Driven by engineering excellence and a customer-first mindset, we strive to uphold the highest standards of transparency, craftsmanship, and timely delivery in every project we undertake. Every home we build reflects our belief that trust is earned, quality is non-negotiable, and enduring relationships are the true foundation of our success.",
      ],
    },
    {
      no: "02",
      kicker: "Our Vision",
      // All three commitments here were deleted in the live editor on 6 Aug 2026
      // (content_edits 96, 97, 98). `points` is omitted entirely rather than left
      // empty — about.astro falls back to `body` when it is absent.
      // Owner's text, 12 Aug 2026, verbatim — do not paraphrase it back
      // towards the previous wording.
      body:
        "We envision creating timeless spaces that enrich lives, inspire future generations and leave a lasting legacy for the communities we serve.",
    },
    // Both list shapes stay declared even while unused, so about.astro can read
    // `points` and `paragraphs` off either entry without a union narrowing error.
  ] as {
    no: string;
    kicker: string;
    body: string;
    paragraphs?: string[];
    points?: string[];
  }[],

  /* ---------- Careers ---------- */
  careers: {
    label: "Careers",
    heading: "Build your career with us.",
    body:
      "We foster a culture of innovation, learning and growth. There is space here to explore new ideas, take on diverse challenges and expand your professional horizons. If you are driven by curiosity, eager to push boundaries and passionate about turning ideas into reality, Nesting Tree is the place to build a rewarding career.",
    email: "info@nestingtree.in",
  },
};
