"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";

/* Lazy-load Leaflet map — must be client-only (no SSR) */
const WreckMap = dynamic(() => import("./WreckMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] w-full rounded-xl bg-mist-100 animate-pulse" />
  ),
});

/* ─── Component ──────────────────────────────────────────────────── */
export default function MapSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView   = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  return (
    <section
      ref={sectionRef}
      className="bg-mist-25 flex flex-col items-center gap-4 md:gap-6 py-10 md:py-16 w-full"
    >
      {/* ── Header row ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 w-full max-w-[1280px] px-8">

        <motion.div
          className="flex flex-col gap-2 flex-1 min-w-0"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-raleway font-semibold text-[24px] leading-[32px] md:text-[36px] md:leading-[44px] tracking-[-0.72px] text-black">
            Explore dive locations across Nigeria
          </h2>
          <p className="font-raleway font-normal text-base leading-6 md:text-[20px] md:leading-[30px] text-black">
            Tap a pin on the map to uncover details about shipwrecks and dive attractions
          </p>
        </motion.div>

        <motion.button
          className="flex items-center gap-1.5 self-start md:self-auto shrink-0 px-[18px] py-3 bg-white rounded border border-[#D5D7DA] font-raleway font-semibold text-[15px] text-[#414651] whitespace-nowrap hover:bg-gray-50 active:scale-[0.98] transition-colors duration-150"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          whileHover="hover"
        >
          See Full Map
          <motion.span
            className="inline-flex items-center"
            variants={{ hover: { x: 3 } }}
            transition={{ duration: 0.15 }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
              <path d="M3 7.5H12M12 7.5L8.5 4M12 7.5L8.5 11" stroke="#414651" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.span>
        </motion.button>
      </div>

      {/* ── Map ────────────────────────────────────────────────── */}
      <div className="flex items-center w-full max-w-[1280px] px-8">
        <motion.div
          className="flex-1 min-w-0"
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <WreckMap />
        </motion.div>
      </div>
    </section>
  );
}
