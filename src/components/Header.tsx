"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/", active: true },
  { label: "Wrecks", href: "/wrecks" },
  { label: "About Us", href: "/about" },
  { label: "Diving Club", href: "/diving-club" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.header
        className="fixed top-0 inset-x-0 z-50 flex justify-center bg-mist-25"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between w-full max-w-[1280px] min-h-[72px] px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-start gap-[2px] text-brand-700 font-raleway font-bold shrink-0"
          >
            <span className="text-base sm:text-xl md:text-2xl leading-8 tracking-[-0.48px]">
              9JAWRECKS
            </span>
            <span className="text-[8px] sm:text-[10px] md:text-xs leading-[18px] tracking-[-0.24px]">
              TM
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center h-14 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center h-full px-2 font-raleway text-base tracking-[-0.48px] transition-colors duration-200 ${
                  link.active
                    ? "font-bold text-mist-900"
                    : "font-medium text-mist-600 hover:text-mist-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <motion.span
              className="block w-6 h-0.5 bg-mist-900 origin-center"
              animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-mist-900"
              animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-mist-900 origin-center"
              animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-x-0 top-[72px] z-40 bg-mist-25 border-b border-mist-100 flex flex-col md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
              >
                <Link
                  href={link.href}
                  className={`block px-8 py-3.5 font-raleway text-base tracking-[-0.48px] border-b border-mist-100/60 last:border-b-0 ${
                    link.active
                      ? "font-bold text-mist-900"
                      : "font-medium text-mist-600"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
