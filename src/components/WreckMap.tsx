"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ─── Types ──────────────────────────────────────────────────── */
type Wreck = (typeof WRECKS)[number];

/* ─── Wreck data ─────────────────────────────────────────────── */
const WRECKS = [
  {
    id: 1,
    name: "Blohon fleet",
    lat: 6.44,
    lng: 3.40,
    description:
      "A fleet of fishing vessels that sank in the Lagos lagoon during a severe storm in the 1970s, now home to rich marine life.",
  },
  {
    id: 2,
    name: "Epe cruise liner",
    lat: 6.59,
    lng: 3.97,
    description:
      "A large passenger vessel that ran aground near Epe in the 1990s, partially submerged and accessible to experienced divers.",
  },
  {
    id: 3,
    name: "Okuso freighter",
    lat: 6.36,
    lng: 3.68,
    description:
      "A commercial freighter lost during a coastal delivery run. The hull is largely intact and teeming with reef fish.",
  },
  {
    id: 4,
    name: "Akuko Barge",
    lat: 5.55,
    lng: 5.82,
    description:
      "One of two Akuko barges lost in the Niger Delta. Strong currents make this a dive for experienced wreck divers only.",
  },
  {
    id: 5,
    name: "Akuko Barge",
    lat: 5.48,
    lng: 5.25,
    description:
      "The second Akuko barge, resting at a shallower depth. Excellent visibility and approachable for recreational divers.",
  },
  {
    id: 6,
    name: "Ugborodo Gunship",
    lat: 5.62,
    lng: 4.88,
    description:
      "A military gunship scuttled in the 1980s near Ugborodo. The superstructure is remarkably well preserved.",
  },
  {
    id: 7,
    name: "Forcados Platform",
    lat: 5.28,
    lng: 5.12,
    description:
      "An oil platform that collapsed during decommissioning. Now an artificial reef supporting extraordinary biodiversity.",
  },
  {
    id: 8,
    name: "KAPF Carrier",
    lat: 6.08,
    lng: 4.62,
    description:
      "A mid-sized cargo vessel believed to have sunk in the late 1980s after a mechanical failure during a coastal route.",
  },
  {
    id: 9,
    name: "Utulu Ferry",
    lat: 4.97,
    lng: 8.35,
    description:
      "A passenger ferry that capsized in the 2000s. The wreck lies on its side and is a popular dive site near Calabar.",
  },
];

const BOUNDS: [[number, number], [number, number]] = [
  [4.6, 3.1],
  [6.9, 8.65],
];

/* ─── Card height constant (used for positioning above the pill) */
const CARD_H = 176;

/* ─── Auto-fit ───────────────────────────────────────────────── */
function FitBounds() {
  const map = useMap();
  useEffect(() => {
    map.whenReady(() => {
      map.fitBounds(BOUNDS, { padding: [20, 20], animate: false });
    });
  }, [map]);
  return null;
}

/* ─── Invisible icon (hides the marker while its card is open) ── */
const HIDDEN_ICON = L.divIcon({
  className: "leaflet-wreck-icon",
  html: '<div style="width:0;height:0;"></div>',
  iconAnchor: [0, 0],
  iconSize:   [0, 0],
});

/* ─── Pill icon ─────────────────────────────────────────────── */
function pillIcon(name: string) {
  return L.divIcon({
    className: "leaflet-wreck-icon",
    html: `
      <div style="
        display:inline-flex;align-items:center;gap:4px;
        background:#fff;padding:6px 8px;border-radius:2px;
        box-shadow:0 4px 8px 1px rgba(38,39,43,.16);
        cursor:pointer;white-space:nowrap;
      ">
        <img src="/images/marker-pin.svg" style="width:16px;height:16px;flex-shrink:0;display:block;" />
        <span style="
          font-family:Raleway,sans-serif;font-weight:600;
          font-size:10px;line-height:16px;color:#414651;
        ">${name}</span>
      </div>`,
    iconAnchor: [0, 14],
  });
}

/* ─── Animated card (Framer Motion) ─────────────────────────── */
function WreckCard({
  wreck,
  x,
  y,
  onClose,
}: {
  wreck: Wreck;
  x: number;
  y: number;
  onClose: () => void;
}) {
  return (
    <motion.div
      key={wreck.id}
      /*
       * Portaled into document.body with position:fixed so the card is never
       * clipped by the map container's overflow:hidden.
       *
       * x/y are viewport-relative (from getBoundingClientRect + containerPoint),
       * so fixed positioning places the card correctly regardless of scroll.
       *
       * transformOrigin "bottom left" keeps the spring growth anchored at the
       * pill position so the card appears to emerge from the marker.
       */
      style={{
        position: "fixed",
        left: x,
        top: y - 14 - CARD_H,
        width: 184,
        transformOrigin: "bottom left",
        zIndex: 9999,
        pointerEvents: "all",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        scale:   { type: "spring", stiffness: 420, damping: 32 },
        opacity: { duration: 0.12 },
      }}
      /* Stop clicks inside the card from bubbling to the document listener */
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          background: "#F9FBFB",
          borderRadius: 4,
          padding: 4,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          boxShadow: "0 8px 24px 2px rgba(38,39,43,.20)",
        }}
      >
        {/* Thumbnail */}
        <div
          style={{
            position: "relative",
            height: 64,
            borderRadius: 4,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <img
            src="/images/wreck-preview.png"
            alt={wreck.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(2,49,49,0.22)",
            }}
          />
        </div>

        {/* Info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: "0 2px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Name row */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  border: "1px solid #E3E7E8",
                  borderRadius: 2,
                  padding: 2,
                  flexShrink: 0,
                }}
              >
                <img
                  src="/images/marker-pin.svg"
                  style={{ width: 12, height: 12, display: "block" }}
                  alt=""
                />
              </div>
              <span
                style={{
                  fontFamily: "Raleway, sans-serif",
                  fontWeight: 600,
                  fontSize: 12,
                  lineHeight: "16px",
                  color: "#414651",
                  whiteSpace: "nowrap",
                }}
              >
                {wreck.name}
              </span>
            </div>

            {/* Description */}
            <p
              style={{
                fontFamily: "Raleway, sans-serif",
                fontWeight: 400,
                fontSize: 10,
                lineHeight: "16px",
                color: "#4B585B",
                margin: 0,
              }}
            >
              {wreck.description}
            </p>
          </div>

          {/* CTA */}
          <button
            style={{
              fontFamily: "Raleway, sans-serif",
              fontWeight: 600,
              fontSize: 12,
              lineHeight: "18px",
              letterSpacing: "-0.48px",
              color: "#B65018",
              textAlign: "left",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Click to view
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Card layer: tracks lat/lng → viewport px, portals into body ── */
function CardLayer({
  selectedId,
  onClose,
}: {
  selectedId: number | null;
  onClose: () => void;
}) {
  const map = useMap();
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const selectedWreck = WRECKS.find((w) => w.id === selectedId) ?? null;

  /* ── Track marker position in viewport coords ─────────────────── */
  useEffect(() => {
    if (!selectedWreck) {
      setPos(null);
      return;
    }

    const update = () => {
      const p    = map.latLngToContainerPoint([selectedWreck.lat, selectedWreck.lng]);
      const rect = map.getContainer().getBoundingClientRect();
      // Combine container-relative point with viewport-relative rect
      // → gives viewport-relative coords for position:fixed
      setPos({ x: rect.left + p.x, y: rect.top + p.y });
    };

    update();
    map.on("move zoom", update);
    // Keep card aligned as the page scrolls or the window resizes
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      map.off("move zoom", update);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [map, selectedWreck]);

  /* ── Close on any click outside the card ─────────────────────── */
  useEffect(() => {
    if (!selectedId) return;
    // Marker clicks call e.originalEvent.stopPropagation(), so they never
    // reach this listener and won't immediately close a freshly-opened card.
    document.addEventListener("click", onClose);
    return () => document.removeEventListener("click", onClose);
  }, [selectedId, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {selectedWreck && pos && (
        <WreckCard
          key={selectedWreck.id}
          wreck={selectedWreck}
          x={pos.x}
          y={pos.y}
          onClose={onClose}
        />
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ─── Component ─────────────────────────────────────────────── */
export default function WreckMap() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Stable reference so the CardLayer effect deps don't change on every render
  const closeCard = useCallback(() => setSelectedId(null), []);

  return (
    <MapContainer
      center={[5.75, 5.9]}
      zoom={5}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={false}
      style={{ height: "480px", width: "100%", borderRadius: "12px" }}
    >
      <FitBounds />
      <ZoomControl position="bottomright" />
      <CardLayer selectedId={selectedId} onClose={closeCard} />

      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {WRECKS.map((w) => (
        <Marker
          key={w.id}
          position={[w.lat, w.lng]}
          icon={selectedId === w.id ? HIDDEN_ICON : pillIcon(w.name)}
          eventHandlers={{
            click(e) {
              // Stop the native event from reaching the document click listener
              // (which would immediately close the card we're about to open)
              e.originalEvent.stopPropagation();
              setSelectedId(w.id);
            },
          }}
        />
      ))}
    </MapContainer>
  );
}
