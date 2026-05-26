"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";

/* ─── Data ───────────────────────────────────────────────────────── */
// TODO: replace entries 2-6 with real testimonials before launch
const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "This website is a treasure map for underwater adventurers! I discovered shipwrecks I never knew existed right off the Nigerian coast. The detailed maps and historical insights made planning my dives incredibly easy. Truly an explorer's dream!",
    name: "Tolu A.",
    role: "Diver & History Buff",
  },
  {
    id: 2,
    // TODO: replace with real testimonial
    quote:
      "As a marine archaeology student, this site has been an incredible resource. The detailed wreck profiles and location maps have made my research so much more engaging and accurate. It’s like stepping into Nigeria’s underwater history!",
    name: "Ada N.",
    role: "Marine Archaeology Student",
  },
  {
    id: 3,
    // TODO: replace with real testimonial
    quote:
      "I planned my last dive entirely using this site, and it was fantastic! The precise wreck locations and conditions gave me the confidence to explore safely. Plus, learning about the history of each wreck added so much meaning to the experience.",
    name: "Chijioke E.",
    role: "Professional Diver",
  },
  {
    id: 4,
    // TODO: replace with real testimonial
    quote:
      "This site brings Nigeria’s underwater history to life! From shipwrecks with fascinating stories to easily locating them on the map, it’s like diving into a time capsule. A must-visit for anyone curious about our maritime heritage.",
    name: "Fatima M.",
    role: "Historian",
  },
  {
    id: 5,
    // TODO: replace with real testimonial
    quote:
      "Even if you’re not a diver, this site is a must-see! The stories and photos of wrecks around Nigeria are fascinating. Who knew there was so much history hidden underwater?",
    name: "Ngozi L.",
    role: "Curious Explorer",
  },
  {
    id: 6,
    // TODO: replace with real testimonial
    quote:
      "I’ve dived in several countries, but this site made exploring Nigeria’s waters an entirely unique experience. The level of detail about the wrecks and their stories made my trip unforgettable. Highly recommend to fellow divers!",
    name: "Michael T.",
    role: "Diving Enthusiast from Canada",
  },
] as const;

const TOTAL = TESTIMONIALS.length;
const INTERVAL_MS = 5000; // ms between auto-advances

/* ─── Slide variants ─────────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const;

const slideVariants = {
  enter: (dir: number) => ({
    x: dir * 56,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: EASE },
  },
  exit: (dir: number) => ({
    x: -dir * 56,
    opacity: 0,
    transition: { duration: 0.32, ease: EASE },
  }),
};

/* ─── Component ──────────────────────────────────────────────────── */
export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  // Combined state keeps direction and index in sync
  const [{ current, dir }, setState] = useState({ current: 0, dir: 1 });
  // Bumping this key resets the auto-advance timer
  const [timerKey, setTimerKey] = useState(0);

  const goTo = (idx: number) => {
    if (idx === current) return;
    setState({ current: idx, dir: idx > current ? 1 : -1 });
    setTimerKey((k) => k + 1);
  };

  /* ── Auto-advance ──────────────────────────────────────────────── */
  useEffect(() => {
    const id = setInterval(() => {
      setState((prev) => ({
        current: (prev.current + 1) % TOTAL,
        dir: 1,
      }));
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [timerKey]);

  const t = TESTIMONIALS[current];

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#fef8ee] flex flex-col items-center justify-center overflow-hidden pb-24 pt-24 w-full"
    >
      {/* ── Watermark ──────────────────────────────────────────────── */}
      <p
        aria-hidden
        className="absolute left-0 right-0 text-center font-raleway font-bold leading-none tracking-[-2.4px] select-none pointer-events-none"
        style={{
          fontSize: "clamp(48px, 8.5vw, 120px)",
          color: "rgba(252,239,216,0.9)",
          top: "50%",
          transform: "translateY(-50%)",
          fontFeatureSettings: "'salt' 1, 'lnum' 1, 'pnum' 1",
        }}
      >
        WHAT PEOPLE THINK
      </p>

      {/* ── Testimonial ────────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 w-full max-w-[1280px] px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {/* Text area — min-height keeps dots from jumping between slides */}
        <div className="w-full flex justify-center min-h-[220px] md:min-h-[200px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={current}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col items-center gap-6 md:gap-8 text-center w-full"
            >
              {/* Quote */}
              <p className="font-raleway font-medium text-[19px] leading-[28px] md:text-[24px] md:leading-8 text-[#181d27] max-w-[768px]">
                {t.quote}
              </p>

              {/* Author */}
              <div className="flex flex-col gap-1">
                <p className="font-raleway font-semibold text-[16px] md:text-[18px] leading-7 text-[#181d27]">
                  {t.name}
                </p>
                <p className="font-raleway font-normal text-[14px] md:text-[16px] leading-6 text-[#535862]">
                  {t.role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Dot indicators ─────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className="h-2 rounded-full focus:outline-none cursor-pointer"
              animate={{
                width: i === current ? 36 : 12,
                backgroundColor: i === current ? "#db6a1b" : "#f8dcb0",
              }}
              transition={{ duration: 0.35, ease: EASE }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
