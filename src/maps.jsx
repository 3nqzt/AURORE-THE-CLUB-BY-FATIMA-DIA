import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet-dependent UI lives in its own module so it can be lazy-loaded — this
// keeps Leaflet (~half the JS) out of the initial bundle. Loaded only when the
// Map tab opens or a journal entry adds a location.

const HEAD_FONT = "'Fraunces', Georgia, serif";
const DAKAR = [14.6928, -17.4467];

const escapeHtml = (s = "") => s.replace(/[&<>"']/g, c => (
  { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
));

// Teardrop marker carrying a mood colour + emoji (avoids the broken default
// icon-path issue with bundlers, since we render our own HTML).
const makePinIcon = (color, emoji) => L.divIcon({
  className: "aurore-pin",
  html: `<div style="width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center"><span style="transform:rotate(45deg);font-size:14px;line-height:1">${emoji}</span></div>`,
  iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30],
});

// Small interactive map to pick one location for a journal entry.
// Tap the map (or drag the pin) to set coordinates; reports them via onChange.
export function LocationPicker({ value, onChange, th }) {
  const elRef = useRef(null);
  const markerRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const hasVal = value && value.lat != null;
    const map = L.map(elRef.current, { scrollWheelZoom: false })
      .setView(hasVal ? [value.lat, value.lng] : DAKAR, hasVal ? 14 : 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: "© OpenStreetMap",
    }).addTo(map);

    const place = (lat, lng) => {
      if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
      else {
        markerRef.current = L.marker([lat, lng], { draggable: true, icon: makePinIcon(th.accent, "📍") })
          .addTo(map)
          .on("dragend", (e) => { const ll = e.target.getLatLng(); onChangeRef.current({ lat: ll.lat, lng: ll.lng }); });
      }
    };
    if (hasVal) place(value.lat, value.lng);
    map.on("click", (e) => { place(e.latlng.lat, e.latlng.lng); onChangeRef.current({ lat: e.latlng.lat, lng: e.latlng.lng }); });

    const sizer = setTimeout(() => map.invalidateSize(), 60);
    return () => { clearTimeout(sizer); map.remove(); markerRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={elRef} style={{ height: 190, borderRadius: 12, overflow: "hidden", border: `1px solid ${th.border}`, marginBottom: 10 }} />;
}

// Full map of every entry that has a location, with the journey traced in order.
export function MapPage({ entries, th, ff, lang, t, getMood, formatDate }) {
  const elRef = useRef(null);
  const placed = entries.filter(e => e.place && e.place.lat != null);

  useEffect(() => {
    if (!elRef.current) return;
    const map = L.map(elRef.current).setView(DAKAR, 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: "© OpenStreetMap",
    }).addTo(map);

    // Oldest → newest, so the connecting line traces the journey in order.
    const sorted = [...placed].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    const latlngs = [];
    sorted.forEach(e => {
      const m = getMood(e.mood);
      const mk = L.marker([e.place.lat, e.place.lng], { icon: makePinIcon(m.c, m.e) }).addTo(map);
      const name = e.place.label ? `<b>${escapeHtml(e.place.label)}</b><br>` : "";
      const snippet = escapeHtml((e.text || "").slice(0, 90));
      mk.bindPopup(`${name}<span style="opacity:.7">${formatDate(e.date, lang)} · ${e.time}</span><br>${snippet}`);
      latlngs.push([e.place.lat, e.place.lng]);
    });
    if (latlngs.length > 1) {
      L.polyline(latlngs, { color: th.accent, weight: 2, dashArray: "5,7", opacity: 0.75 }).addTo(map);
    }
    if (latlngs.length) map.fitBounds(latlngs, { padding: [40, 40], maxZoom: 15 });

    const sizer = setTimeout(() => map.invalidateSize(), 60);
    return () => { clearTimeout(sizer); map.remove(); };
  }, [entries, lang, th.accent, getMood, formatDate]);

  return (
    <div style={{ padding: "24px 18px 110px", fontFamily: ff }}>
      <h2 style={{ color: th.text, fontFamily: HEAD_FONT, fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>
        {t("map_title")} ✦
      </h2>
      <p style={{ color: th.muted, fontSize: 13, margin: "0 0 16px" }}>{t("map_sub")}</p>

      {placed.length === 0 && (
        <div style={{
          background: th.surface, border: `1px solid ${th.border}`, borderRadius: 16,
          textAlign: "center", padding: 24, marginBottom: 14,
        }}>
          <p style={{ fontSize: 30, margin: "0 0 10px" }}>🗺️</p>
          <p style={{ color: th.muted, fontSize: 14, margin: 0 }}>{t("map_empty")}</p>
        </div>
      )}

      <div ref={elRef} style={{ height: 440, borderRadius: 16, overflow: "hidden", border: `1px solid ${th.border}` }} />

      {placed.length > 0 && (
        <p style={{ color: th.muted, fontSize: 11, margin: "12px 2px 0" }}>
          {placed.length} {t("places_word")}
        </p>
      )}
    </div>
  );
}
