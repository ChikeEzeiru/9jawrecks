"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Nav links ──────────────────────────────────────────────────── */
const NAV_LINKS = ["Wrecks", "About Us", "Field Guide", "Diving Club", "Terms"];

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Component ──────────────────────────────────────────────────── */
export default function Footer() {
  const ref    = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5% 0px" });

  return (
    <footer ref={ref} className="relative bg-mist-100 overflow-hidden">

      {/* ── Nigeria map — decorative background ──────────────────── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/map-nigeria.png"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        style={{ filter: "grayscale(1) brightness(2.2) contrast(0.6) opacity(0.55)" }}
      />

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col gap-10 md:gap-12 w-full max-w-[1280px] mx-auto px-6 md:px-8 pt-12 md:pt-20 pb-16 md:pb-24">

        {/* ── Top row ──────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
        >
          {/* Left — tagline + contact ───────────────────────────── */}
          <div className="flex flex-col gap-6 flex-1">
            <p className="font-raleway font-normal text-[17px] md:text-[20px] leading-7 md:leading-8 text-mist-900 max-w-[520px]">
              We&apos;re collating the most authentic list of marine wrecks in
              Nigeria, for history buffs and adventure seekers
            </p>
            <div className="flex flex-col gap-0.5">
              <p className="font-raleway font-normal text-[16px] leading-6 text-mist-600">
                Send errors, omissions and inclusions to
              </p>
              <a
                href="mailto:audits@9jawrecks.com.ng"
                className="font-raleway font-normal text-[16px] leading-6 text-brand-700 hover:opacity-75 transition-opacity duration-150"
              >
                audits@9jawrecks.com.ng
              </a>
            </div>
          </div>

          {/* Right — newsletter sign-up ─────────────────────────── */}
          <div className="flex flex-col gap-4 w-full lg:flex-1 lg:max-w-[560px]">
            <p className="font-raleway font-normal text-[16px] leading-6 text-mist-600">
              Interested in notifications on newly discovered wrecks?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="email address here"
                className="flex-1 min-w-0 bg-white border border-mist-400 rounded px-3 py-[10px] font-raleway font-normal text-[16px] leading-6 text-mist-900 placeholder:text-mist-400 focus:outline-none focus:border-brand-700 transition-colors duration-150"
              />
              <button
                type="button"
                className="w-full sm:w-auto shrink-0 bg-black text-white font-raleway font-semibold text-[16px] leading-6 px-6 py-[10px] rounded hover:opacity-80 active:scale-95 transition-all duration-150 whitespace-nowrap"
              >
                Join Newsletter
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Bottom row — nav links ────────────────────────────── */}
        <motion.nav
          aria-label="Footer navigation"
          className="flex justify-center md:justify-end flex-wrap gap-x-8 gap-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE, delay: 0.15 }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="font-raleway font-medium text-[16px] leading-6 text-mist-600 hover:text-mist-900 transition-colors duration-150 whitespace-nowrap"
            >
              {link}
            </a>
          ))}
        </motion.nav>
      </div>
    </footer>
  );
}
