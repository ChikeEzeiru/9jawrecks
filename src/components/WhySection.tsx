"use client";

import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

/* ─── Card data ──────────────────────────────────────────────────── */
const CARDS = [
  {
    id: "wrecks",
    image: "/images/why-1.jpg",
    alt: "Aerial drone shot of a wrecked ship",
    objectPosition: "center",
    title: "Find real wrecks.",
    body: "No guesswork. No digging through scattered sources. Just verified shipwrecks across Nigeria.",
    gradient: "from-[43%] from-transparent to-[79%] to-black",
    tall: true,
    delay: 0.20,
  },
  {
    id: "navigate",
    image: "/images/why-2.jpg",
    alt: "Aerial map view of Nigeria",
    objectPosition: "center",
    title: "Know where to go.",
    body: "Clear map locations so you're not just reading but also navigating.",
    gradient: "from-transparent to-black",
    tall: false,
    delay: 0.35,
  },
  {
    id: "story",
    // TODO: replace with the actual ocean-waves image — why-3.jpg exported as transparent from Figma
    image: "/images/hero-1.png",
    alt: "Ocean waves crashing against an abandoned shipwreck",
    objectPosition: "bottom",
    title: "Understand what happened.",
    body: "Every wreck has a story. We make sure you don't miss it.",
    gradient: "from-transparent to-black",
    tall: false,
    delay: 0.50,
  },
] as const;

/* ─── Variants ───────────────────────────────────────────────────── */
const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 48, scale: 0.97 },
  visible: { opacity: 1, y:  0, scale: 1.00 },
};

/* ─── Component ──────────────────────────────────────────────────── */
export default function WhySection() {
  const ref     = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const [wreck, navigate, story] = CARDS;

  return (
    <section
      ref={ref}
      className="bg-brand-900 flex flex-col items-center gap-12 py-16 w-full"
    >
      {/* ── Header ───────────────────────────────────────────────── */}
      <motion.div
        className="flex flex-col items-center gap-2 text-center w-full max-w-[1280px] px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-raleway font-normal text-sm leading-5 text-white">
          Why dive in Nigeria?
        </p>
        <h2 className="font-raleway font-semibold text-[32px] leading-[40px] md:text-[48px] md:leading-[60px] tracking-[-0.96px] text-white">
          More than just coordinates
        </h2>
        <p className="font-raleway font-medium text-base md:text-lg leading-7 text-mist-400">
          Get the story behind each wreck: what happened, when, and why it matters.
        </p>
      </motion.div>

      {/* ── Bento grid ───────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6 w-full max-w-[1280px] px-8">

        {/* Left — tall card */}
        <motion.div
          className="relative w-full lg:w-[596px] lg:flex-none h-[280px] sm:h-[360px] lg:h-[584px] rounded-[6px] border border-white/20 overflow-hidden flex flex-col justify-end p-5 md:p-6"
          variants={cardVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: wreck.delay }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={wreck.image}
            alt={wreck.alt}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            style={{ objectPosition: wreck.objectPosition }}
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${wreck.gradient}`} />
          <CardText title={wreck.title} body={wreck.body} />
        </motion.div>

        {/* Right — two stacked cards */}
        <div className="flex flex-1 flex-col gap-6">

          <motion.div
            className="relative flex-1 min-h-[220px] md:min-h-[280px] rounded-[6px] border border-white/20 overflow-hidden flex flex-col justify-end p-5 md:p-6"
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: navigate.delay }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={navigate.image}
              alt={navigate.alt}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              style={{ objectPosition: navigate.objectPosition }}
            />
            <div className={`absolute inset-0 bg-gradient-to-b ${navigate.gradient}`} />
            <CardText title={navigate.title} body={navigate.body} />
          </motion.div>

          <motion.div
            className="relative flex-1 min-h-[220px] md:min-h-[280px] rounded-[6px] border border-white/20 overflow-hidden flex flex-col justify-end p-5 md:p-6"
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: story.delay }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={story.image}
              alt={story.alt}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              style={{ objectPosition: story.objectPosition }}
            />
            <div className={`absolute inset-0 bg-gradient-to-b ${story.gradient}`} />
            <CardText title={story.title} body={story.body} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* ─── Card text ──────────────────────────────────────────────────── */
function CardText({ title, body }: { title: string; body: string }) {
  return (
    <p className="relative z-10 font-raleway text-[17px] leading-[26px] md:text-[20px] md:leading-[30px] text-white">
      <span className="font-semibold">{title}</span>
      {" "}
      <span className="font-medium text-mist-400">{body}</span>
    </p>
  );
}
