/* ============================================================
   Waypoint scroll controller — headless, framework-free.

   The shared skeleton behind the scroll-driven "active waypoint"
   sections on the project pages: a column of full-height panels,
   an IntersectionObserver that reports whichever panel is centred,
   and matching state toggled onto the panels and their markers.

   Shikhar's "climb the peak" and Dhruva's "star-trail" sections
   both fit this shape. Each page keeps its own *visual* layer
   (Shikhar draws a trail polyline; Dhruva rotates an arc field and
   walks a progress arc off continuous scroll) and feeds it through
   the `onActive` callback — the observer plumbing lives here once.
   ============================================================ */

export interface WaypointOptions {
  /** Selector for the scroll panels, each carrying a `data-index`. */
  panelSelector: string;
  /** Optional selector for markers kept in sync with the active panel. */
  markerSelector?: string;
  /** Class placed on the active panel. Default `is-active`. */
  activeClass?: string;
  /** Class placed on the active marker. Default `current`. */
  currentClass?: string;
  /** Class placed on markers before the active one. Default `done`. */
  doneClass?: string;
  /** IntersectionObserver rootMargin. Default centres a thin band. */
  rootMargin?: string;
  /** Fired whenever the active index changes. */
  onActive?: (index: number, prev: number) => void;
}

export interface WaypointController {
  /** Force the active index (e.g. from a marker button click). */
  setActive(index: number): void;
  getActive(): number;
  /** Stop observing. */
  destroy(): void;
}

export function initWaypoints(
  root: Element,
  opts: WaypointOptions
): WaypointController {
  const {
    panelSelector,
    markerSelector,
    activeClass = "is-active",
    currentClass = "current",
    doneClass = "done",
    rootMargin = "-50% 0px -50% 0px",
    onActive,
  } = opts;

  const panels = Array.from(
    root.querySelectorAll<HTMLElement>(panelSelector)
  );
  const markers = markerSelector
    ? Array.from(root.querySelectorAll<HTMLElement>(markerSelector))
    : [];

  let active = -1;

  function setActive(i: number): void {
    if (i === active || i < 0 || i >= panels.length) return;
    const prev = active;
    active = i;
    panels.forEach((p, idx) => p.classList.toggle(activeClass, idx === i));
    markers.forEach((m, idx) => {
      m.classList.toggle(currentClass, idx === i);
      m.classList.toggle(doneClass, idx < i);
    });
    onActive?.(i, prev);
  }

  const io = new IntersectionObserver(
    (entries) => {
      let target: Element | null = null;
      for (const e of entries) if (e.isIntersecting) target = e.target;
      if (target) {
        const idx = Number((target as HTMLElement).dataset.index);
        if (!Number.isNaN(idx)) setActive(idx);
      }
    },
    { rootMargin, threshold: 0 }
  );
  panels.forEach((p) => io.observe(p));

  // Light the first panel so the section never opens all-dimmed.
  setActive(0);

  return {
    setActive,
    getActive: () => active,
    destroy: () => io.disconnect(),
  };
}
