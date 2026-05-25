"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";

/* ─── Data ───────────────────────────────────────────────────────── */
const IMAGES = [
  { src: "/images/hero-1.png", alt: "Shipwreck in Nigerian waters" },
  { src: "/images/hero-2.png", alt: "Underwater wreck discovery" },
  { src: "/images/hero-3.png", alt: "Diving at a Nigerian wreck site" },
];

// Subtle Ken Burns — each image drifts in a different direction.
// Scale range is small (4%) so the effect is felt, not seen.
const KEN_BURNS = [
  { fromScale: 1.0,  toScale: 1.04, fromX: "0%",   toX: "-1%",  fromY: "0%",  toY: "-0.5%" },
  { fromScale: 1.04, toScale: 1.0,  fromX: "-1%",  toX: "0%",   fromY: "-0.5%", toY: "0%"  },
  { fromScale: 1.0,  toScale: 1.04, fromX: "0.5%", toX: "-0.5%",fromY: "0%",  toY: "-0.5%" },
];

const DWELL_MS      = 7000; // ms each image is displayed
const CROSSFADE_S   = 1.4;  // seconds for the opacity crossfade
const KB_DURATION_S = DWELL_MS / 1000 + CROSSFADE_S + 1; // Ken Burns outlasts the dwell

const NIGERIAN_STATES = [
  "Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Lagos", "Ondo", "Rivers",
];
const WRECK_TYPES = ["Shipwreck", "Plane Wreck", "Vehicle", "Artificial Reef"];
const HEADING     = "DISCOVER NIGERIA'S UNDERWATER WONDERS";

/* ─── Component ──────────────────────────────────────────────────── */
export default function HeroSection() {
  const layerRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs    = useRef<(HTMLImageElement | null)[]>([]);
  const headingRef = useRef<HTMLDivElement>(null);
  const currentIdx = useRef(0);

  /* ── Ken Burns on a single image ───────────────────────────────── */
  const applyKenBurns = (idx: number) => {
    const img = imgRefs.current[idx];
    if (!img) return;
    const kb = KEN_BURNS[idx % KEN_BURNS.length];
    gsap.fromTo(
      img,
      { scale: kb.fromScale, x: kb.fromX, y: kb.fromY },
      { scale: kb.toScale,   x: kb.toX,   y: kb.toY,
        duration: KB_DURATION_S, ease: "none" }
    );
  };

  /* ── Crossfade to next image ────────────────────────────────────── */
  const crossfadeTo = (curr: number, next: number) => {
    const currLayer = layerRefs.current[curr];
    const nextLayer = layerRefs.current[next];
    if (!currLayer || !nextLayer) return;

    // Start Ken Burns on the incoming image now so it's already in motion on reveal
    applyKenBurns(next);

    gsap.set(nextLayer, { zIndex: 1, opacity: 0 });
    gsap.set(currLayer, { zIndex: 2 });

    gsap.timeline({
      onComplete() {
        gsap.set(currLayer, { zIndex: 0 });
        gsap.set(nextLayer, { zIndex: 2 });
        currentIdx.current = next;
      },
    })
      .to(nextLayer, { opacity: 1, duration: CROSSFADE_S, ease: "power2.inOut" }, 0)
      .to(currLayer, { opacity: 0, duration: CROSSFADE_S, ease: "power2.inOut" }, 0);
  };

  /* ── Carousel bootstrap ────────────────────────────────────────── */
  useEffect(() => {
    const layers = layerRefs.current;
    const imgs   = imgRefs.current;

    // First image visible, rest hidden
    layers.forEach((layer, i) =>
      layer && gsap.set(layer, { opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 2 : 0 })
    );

    applyKenBurns(0);

    const timer = setInterval(() => {
      const curr = currentIdx.current;
      crossfadeTo(curr, (curr + 1) % IMAGES.length);
    }, DWELL_MS);

    return () => {
      clearInterval(timer);
      gsap.killTweensOf([...layers, ...imgs].filter(Boolean));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Heading stagger ───────────────────────────────────────────── */
  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-word",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: "power3.out", delay: 0.4 }
      );
    }, headingRef);
    return () => ctx.revert();
  }, []);

  /* ── Render ────────────────────────────────────────────────────── */
  return (
    <section className="relative w-full flex flex-col items-center bg-mist-25 pt-[72px]">

      {/* ── Carousel ─────────────────────────────────────────────── */}
      <div className="relative w-[calc(100%-32px)] sm:w-[calc(100%-64px)] md:w-[calc(100%-80px)] max-w-[1320px] h-[min(480px,65vh)] md:h-[min(680px,85vh)] overflow-hidden rounded-b-xl">

        {IMAGES.map((image, i) => (
          <div
            key={image.src}
            ref={(el) => { layerRefs.current[i] = el; }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={(el) => { imgRefs.current[i] = el; }}
              src={image.src}
              alt={image.alt}
              className="absolute inset-0 w-full h-full object-cover will-change-transform"
            />
            <div className="absolute inset-0 bg-[rgba(2,49,49,0.22)]" />
          </div>
        ))}

        {/* Heading — sits above the carousel bottom */}
        <div className="absolute bottom-[40px] md:bottom-[80px] left-0 right-0 px-4 md:px-6 z-10">
          <div
            ref={headingRef}
            className="flex flex-wrap font-raleway font-bold text-white/80 leading-[1.15]"
            style={{
              fontSize: "clamp(48px, 7.5vw, 104px)",
              letterSpacing: "-0.03em",
              fontFeatureSettings: "'salt', 'lnum', 'pnum'",
              gap: "0 0.22em",
            }}
          >
            {HEADING.split(" ").map((word, i) => (
              <span key={i} className="hero-word inline-block" style={{ opacity: 0 }}>
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search bar ───────────────────────────────────────────── */}
      <motion.div
        className="relative w-full flex justify-center px-2 sm:px-4 md:px-8 -mt-8 md:-mt-16 z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 1.3 }}
      >
        <div
          className="grid grid-cols-2 lg:flex lg:flex-row gap-3 lg:gap-6 lg:items-end w-full max-w-[1216px] pb-6 pt-4 px-4 sm:px-6 rounded border border-white"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.75) 0%, rgba(255,255,255,1) 100%)",
          }}
        >
          {/* Name — full width on mobile */}
          <div className="col-span-2 lg:flex-1 lg:min-w-0">
            <Field label="Name">
              <input type="text" placeholder="e.g. The Jolly Roger" className="search-input" />
            </Field>
          </div>

          {/* State — left half on mobile */}
          <div className="lg:flex-1 lg:min-w-0">
            <Field label="State">
              <div className="relative">
                <select defaultValue="" className="search-input appearance-none pr-8 cursor-pointer">
                  <option value="" disabled>e.g. Lagos</option>
                  {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronIcon />
              </div>
            </Field>
          </div>

          {/* Type of Wreck — right half on mobile */}
          <div className="lg:flex-1 lg:min-w-0">
            <Field label="Type of Wreck">
              <div className="relative">
                <select defaultValue="" className="search-input appearance-none pr-8 cursor-pointer">
                  <option value="" disabled>e.g. Plane wreck</option>
                  {WRECK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronIcon />
              </div>
            </Field>
          </div>

          {/* Search button — full width on mobile, 8px top margin on mobile */}
          <button className="col-span-2 lg:col-auto mt-2 lg:mt-0 w-full lg:w-[274px] shrink-0 bg-black text-white font-raleway font-bold text-base tracking-[-0.64px] px-6 py-[9px] rounded hover:opacity-85 active:scale-95 transition-all duration-150 whitespace-nowrap">
            Search Wrecks
          </button>
        </div>
      </motion.div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 w-full min-w-0">
      <span className="font-raleway font-bold text-base text-[#3f3f46] tracking-[-0.64px] whitespace-nowrap">
        {label}
      </span>
      {children}
    </div>
  );
}

function ChevronIcon() {
  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <Image src="/images/chevron-down.svg" alt="" width={10} height={6} className="opacity-60" />
    </div>
  );
}
