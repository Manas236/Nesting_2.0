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
  title: "More than four walls.",
  lede:
    "Two decades of Navi Mumbai housing — from Gopala in Vashi (2004) to today — and the engineering pedigree of K.D. Construction stand behind Nesting Tree, a residential developer building amenity-first homes for every kind of buyer.",

  /* ---------- Our Story ---------- */
  story: {
    label: "Our Story",
    heading: "Backed by engineering. Built for living.",
    lead:
      "Nesting Tree has grown into one of the most trusted residential developers in Karanjade and the wider Navi Mumbai region, with a portfolio spanning affordable, mid-segment and premium homes. Backed by the engineering pedigree of K.D. Construction — a multi-disciplinary infrastructure company known for railway and large-scale infrastructure work — the company pairs technical depth with a genuinely customer-first approach.",
    paragraphs: [
      "Drawing on its parent company's construction and project-management strength — and more than twenty years of the founder's housing work in Navi Mumbai — Nesting Tree is committed to timely delivery, superior build quality and transparent dealing. It has expanded across multiple residential developments and handed over landmark projects — Dhruva, Rudra and Shaurya — in Karanjade, Navi Mumbai.",
      "That focus — clear-title land, sustainable development, quality construction and real customer satisfaction — has earned the trust of homebuyers and steadily strengthened the company's standing in a competitive market. Every project is designed for modern living, strong connectivity and long-term value, for residents and investors alike.",
    ],
    facts: [
      { k: "Building homes", v: "Since 2004" },
      { k: "Parent Company", v: "K.D. Construction" },
      { k: "Region", v: "Karanjade, Navi Mumbai" },
      { k: "Standard", v: "Clear-title · MahaRERA where registered" },
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
    heading: "The man who started from scratch.",
    name: "Kailash Gindodia",
    role: "Founder",
    monogram: "KD",
    tenure: "Dhule → Mumbai · Since 1985",
    lead:
      "Kailash Shankarlal Gindodia, owner of Nesting Tree, has built his journey on determination, hard work and an unwavering commitment to quality construction.",
    paragraphs: [
      "Arriving in Mumbai from Dhule in 1985, he began with a modest CIDCO contract worth ₹2 lakh. Through perseverance and engineering expertise, he steadily expanded his construction business across the Mumbai Metropolitan Region (MMR), executing several government infrastructure projects.",
      "In 2004 he entered private real estate with Gopala, a residential project in Vashi built on a CIDCO tender plot — the beginning of Nesting Tree's journey as a trusted housing developer. Since then the company has delivered landmark residential projects in Vashi, Kharghar and Karanjade, earning the trust of hundreds of homebuyers.",
      "As a first-generation developer, Gindodia has led Nesting Tree with a foundation of integrity, dedication, innovation and customer trust. His vision continues to guide the company in creating quality homes while building lasting relationships with every family it serves.",
    ],
    values: [
      {
        k: "Integrity",
        v: "Clear-title land and honest paperwork on every deal — the way it has been done from the very first project.",
      },
      {
        k: "Grit",
        v: "Everything earned, nothing inherited — built from scratch and delivered on the promise.",
      },
      {
        k: "Intelligence",
        v: "A sharp read on land, cost and timing — homes that hold their value for years.",
      },
    ],
  },

  /* ---------- Vision & Mission ----------
     Each principle carries a short lead paragraph plus a list of
     commitments. about.astro renders `points` as a list when present,
     falling back to `body` for a single statement. */
  principlesIntro:
    "The standard we hold ourselves to on every project — the thinking behind each home we plan, build and hand over.",
  principles: [
    {
      no: "01",
      kicker: "Our Mission",
      body:
        "Guided by the belief of “Housing for All,” we hold ourselves to a clear set of promises on every home we build.",
      points: [
        "To create thoughtfully designed homes that inspire families to grow, thrive, and build lasting memories.",
        "To deliver exceptional quality, value, and trust through innovative engineering and ethical construction practices.",
        "To make homeownership a rewarding experience by exceeding customer expectations at every stage.",
        "To build sustainable communities where every generation can dream bigger and live better.",
      ],
    },
    {
      no: "02",
      kicker: "Our Vision",
      body:
        "Where we intend to stand — the mark we want every project to leave.",
      points: [
        "To be a trusted real estate brand that transforms aspirations into enduring homes and thriving communities.",
        "To set new benchmarks in quality, innovation, and sustainable development across every project we deliver.",
        "To create spaces that enrich lives, inspire future generations, and stand the test of time.",
      ],
    },
  ],

  /* ---------- Careers ---------- */
  careers: {
    label: "Careers",
    heading: "Build your career with us.",
    body:
      "We foster a culture of innovation, learning and growth — the space to explore new ideas, take on diverse challenges and expand your professional horizons. If you are driven by curiosity, eager to push boundaries and passionate about turning ideas into reality, Nesting Tree is the place to build a rewarding career.",
    email: "info@nestingtree.in",
  },
};
