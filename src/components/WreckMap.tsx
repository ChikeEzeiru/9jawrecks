"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ─── Wreck data with real coordinates ──────────────────────── */
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
    lat: 6.42,
    lng: 3.52,
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
    lat: 5.43,
    lng: 5.17,
    description:
      "The second Akuko barge, resting at a shallower depth. Excellent visibility and approachable for recreational divers.",
  },
  {
    id: 6,
    name: "Ugborodo Gunship",
    lat: 5.51,
    lng: 5.08,
    description:
      "A military gunship scuttled in the 1980s near Ugborodo. The superstructure is remarkably well preserved.",
  },
  {
    id: 7,
    name: "Forcados Platform",
    lat: 5.35,
    lng: 5.05,
    description:
      "An oil platform that collapsed during decommissioning. Now an artificial reef supporting extraordinary biodiversity.",
  },
  {
    id: 8,
    name: "KAPF Carrier",
    lat: 6.05,
    lng: 4.85,
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

/*
 * Tight bounds over the actual wreck positions.
 * Wrecks: 4.97°N–6.59°N, 3.40°E–8.35°E → add ~0.3° on each edge.
 * Lng span = 5.55° → at zoom 6 in 311 px container that's ~253 px, fits.
 * fitBounds auto-picks zoom: 6 on mobile (311 px), 8 on wide desktop.
 */
const BOUNDS: [[number, number], [number, number]] = [
  [4.6, 3.1],   // SW
  [6.9, 8.65],  // NE
];

/* ─── Auto-fit after map is ready — fires after Leaflet init ── */
function FitBounds() {
  const map = useMap();
  useEffect(() => {
    map.whenReady(() => {
      map.fitBounds(BOUNDS, { padding: [20, 20], animate: false });
    });
  }, [map]);
  return null;
}

/* ─── Custom pill marker ────────────────────────────────────── */
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
    /* anchor at left-center of pill; popupAnchor opens the card above+right */
    iconAnchor: [0, 14],
    popupAnchor: [92, -14],
  });
}

/* ─── Component ─────────────────────────────────────────────── */
export default function WreckMap() {
  return (
    <MapContainer
      /* Initial position — FitBounds will correct zoom once mounted */
      center={[5.75, 5.9]}
      zoom={5}
      scrollWheelZoom={false}
      zoomControl={false}          /* rendered manually at bottom-right below */
      attributionControl={false}
      style={{ height: "480px", width: "100%", borderRadius: "12px" }}
    >
      <FitBounds />
      <ZoomControl position="bottomright" />

      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {WRECKS.map((w) => (
        <Marker
          key={w.id}
          position={[w.lat, w.lng]}
          icon={pillIcon(w.name)}
        >
          <Popup className="wreck-popup" maxWidth={184} minWidth={184} closeButton={false}>
            <div style={{
              background: "#F9FBFB", borderRadius: 4, padding: 4,
              display: "flex", flexDirection: "column", gap: 8,
            }}>
              {/* Thumbnail */}
              <div style={{ position: "relative", height: 64, borderRadius: 4, overflow: "hidden" }}>
                <img
                  src="/images/wreck-preview.png"
                  alt={w.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "rgba(2,49,49,0.22)" }} />
              </div>

              {/* Info */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 2px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {/* Name row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ border: "1px solid #E3E7E8", borderRadius: 2, padding: 2, flexShrink: 0 }}>
                      <img src="/images/marker-pin.svg" style={{ width: 12, height: 12, display: "block" }} alt="" />
                    </div>
                    <span style={{
                      fontFamily: "Raleway, sans-serif", fontWeight: 600,
                      fontSize: 12, lineHeight: "16px", color: "#414651", whiteSpace: "nowrap",
                    }}>
                      {w.name}
                    </span>
                  </div>
                  {/* Description */}
                  <p style={{
                    fontFamily: "Raleway, sans-serif", fontWeight: 400,
                    fontSize: 10, lineHeight: "16px", color: "#4B585B", margin: 0,
                  }}>
                    {w.description}
                  </p>
                </div>

                {/* CTA */}
                <button style={{
                  fontFamily: "Raleway, sans-serif", fontWeight: 600,
                  fontSize: 12, lineHeight: "18px", letterSpacing: "-0.48px",
                  color: "#B65018", textAlign: "left", background: "none",
                  border: "none", cursor: "pointer", padding: 0,
                }}>
                  Click to view
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
