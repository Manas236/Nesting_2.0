/* ============================================================
   Contact page copy — /contact
   ------------------------------------------------------------
   Every page's copy lives in src/data (about.ts, galleries.ts,
   <slug>.ts …); this is the Contact page's file.

   FACTS ARE NOT WRITTEN HERE. The phone number, the email, the
   office address and the sales contact's name all come from
   `contact` and `sales` in ./site.ts, which is the one place the
   site writes them down. This file is prose only — if you find
   yourself typing a number into it, put it in site.ts instead.
   ============================================================ */

export const contactPage = {
  /* The masthead is a deliberate restatement of the home page's closing
     enquiry band: same photograph, same eyebrow-heading-body-buttons stack,
     same olive-into-ink scrim. A visitor who clicks "Contact" from the nav
     should land somewhere they recognise, not on a different-looking page.

     The two are NOT wired to each other, though — the heading and body below
     are this page's own strings, so the home band can be re-written for the
     home page without silently re-writing the Contact page (and vice versa).
     That also keeps the in-page editor honest: it saves per element, per page. */
  hero: {
    eyebrow: "Contact",
    heading: "Let's find you a Home.",
    body:
      "Book a site visit and see a Nesting Tree home for yourself. Clear title, honest paperwork and a straight answer to every question — you'll always know where you stand. No surprises, no fine print games.",
    image: "/images/projects/Prithvi-Elevation.webp",
    imagePos: "center 10%",
  },

  /* The three ways to reach us, above the form. The office address is the
     reason this page exists as its own route: it was printed on the seven
     project pages and nowhere a visitor would think to look for it. */
  reach: {
    eyebrow: "Where to find us",
    heading: "Come and talk to us.",
    lead:
      "Call, message or write — and if you would rather see the buildings first, say so and we will meet you on site.",
    office: {
      label: "Office",
      /* Sits under the address. Says how a visit is arranged without
         asserting opening hours, which are not recorded anywhere. */
      note: "Call or WhatsApp ahead and we will keep the time free for you.",
      directions: "Get directions",
    },
    phone: {
      label: "Phone",
      note: "One number for every project, answered by our sales team.",
    },
    email: {
      label: "Email",
      note: "Plans, price lists and anything you would rather have in writing.",
    },
  },

  form: {
    eyebrow: "Enquire",
    heading: "Send us a message.",
    lead:
      "Leave your details and we will come back to you with availability, pricing and a time to visit.",
    /* Shown as the first option of the project select, for a visitor who is
       not asking about one building in particular. Its value is empty, so
       /api/contact stores no project rather than storing this label. */
    anyProject: "Not sure yet — general enquiry",
    consent: "By submitting, you agree to be contacted by Nesting Tree about your enquiry.",
  },
};
