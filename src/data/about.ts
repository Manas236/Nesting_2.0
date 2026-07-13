/* ============================================================
   Nesting Tree — About page content
   Sourced from the company profile document, reconciled to the
   site's established facts (founded 2019; Panvel & Navi Mumbai)
   where the two disagreed. Edit copy here — about.astro reads
   everything from this file.
   ============================================================ */

export const about = {
  kicker: "About Nesting Tree",
  title: "More than four walls.",
  lede:
    "Founded in 2019 and backed by the engineering pedigree of K.D. Construction, Nesting Tree is a residential developer across Panvel & Navi Mumbai — building amenity-first homes for every kind of buyer.",

  /* ---------- Our Story ---------- */
  story: {
    label: "Our Story",
    heading: "Backed by engineering. Built for living.",
    lead:
      "Nesting Tree has grown into one of the most trusted residential developers in Panvel and the Navi Mumbai region, with a portfolio spanning affordable, mid-segment and premium homes. Backed by the engineering pedigree of K.D. Construction — a multi-disciplinary infrastructure company known for railway and large-scale infrastructure work — the company pairs technical depth with a genuinely customer-first approach.",
    paragraphs: [
      "Drawing on its parent company's construction and project-management strength, Nesting Tree is committed to timely delivery, superior build quality and transparent dealing. In under a decade it has expanded across multiple residential developments and handed over landmark projects — Dhruva, Rudra and Shaurya — across Panvel and Navi Mumbai.",
      "That focus — clear-title land, sustainable development, quality construction and real customer satisfaction — has earned the trust of homebuyers and steadily strengthened the company's standing in a competitive market. Every project is designed for modern living, strong connectivity and long-term value, for residents and investors alike.",
    ],
    facts: [
      { k: "Founded", v: "2019" },
      { k: "Parent Company", v: "K.D. Construction" },
      { k: "Region", v: "Panvel & Navi Mumbai" },
      { k: "Standard", v: "Clear-title · MahaRERA" },
    ],
  },

  /* ---------- Vision & Mission ---------- */
  principlesIntro:
    "The standard we hold ourselves to on every project — the thinking behind each home we plan, build and hand over.",
  principles: [
    {
      no: "01",
      kicker: "Vision",
      body:
        "To be a preferred real estate developer by delivering quality construction, clear-title properties, strategic locations and timely possession — offering complete housing solutions across affordable, mid-segment and premium categories. Nesting Tree aims to be a one-stop destination for homebuyers seeking reliability, value and comfort.",
    },
    {
      no: "02",
      kicker: "Mission",
      body:
        "Guided by the belief of “Housing for All,” Nesting Tree develops thoughtfully planned residential projects that pair affordability with premium amenities — enhancing the homeownership experience by building sustainable communities that meet the evolving needs of modern families, while staying accessible to buyers across every income segment.",
    },
  ],

  /* ---------- Careers ---------- */
  careers: {
    label: "Careers",
    heading: "Build your career with us.",
    body:
      "We foster a culture of innovation, learning and growth — the space to explore new ideas, take on diverse challenges and expand your professional horizons. If you are driven by curiosity, eager to push boundaries and passionate about turning ideas into reality, Nesting Tree is the place to build a rewarding career.",
    email: "hr@kdconstructions.net",
  },
};
