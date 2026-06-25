import { useState } from "react";

const HEAD_FONT = "'Fraunces', Georgia, serif";

// First-run welcome shown the first time a member enters their space.
export default function Onboarding({ th, ff, t, onDone }) {
  const slides = [
    { icon: "🌅", title: t("onb1_t"), desc: t("onb1_d") },
    { icon: "✍🏾", title: t("onb2_t"), desc: t("onb2_d") },
    { icon: "📅", title: t("onb3_t"), desc: t("onb3_d") },
    { icon: "🔒", title: t("onb4_t"), desc: t("onb4_d") },
  ];
  const [i, setI] = useState(0);
  const last = i === slides.length - 1;
  const s = slides[i];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 250, background: th.bg, color: th.text,
      fontFamily: ff, display: "flex", flexDirection: "column",
      maxWidth: 480, margin: "0 auto",
    }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 18px" }}>
        <button onClick={onDone} style={{ background: "none", border: "none", color: th.muted, fontSize: 13, cursor: "pointer", fontFamily: ff }}>
          {t("onb_skip")}
        </button>
      </div>

      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 32px", animation: "fadeIn 0.3s ease" }}>
        <div style={{
          width: 120, height: 120, borderRadius: "50%", marginBottom: 34,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56,
          background: `radial-gradient(circle at 35% 35%, ${th.accentSoft}55, ${th.accent}33 70%)`,
          boxShadow: `0 0 50px ${th.accent}44`,
        }}>{s.icon}</div>
        <h2 style={{ fontFamily: HEAD_FONT, fontSize: 27, fontWeight: 600, margin: "0 0 14px", lineHeight: 1.2 }}>{s.title}</h2>
        <p style={{ color: th.muted, fontSize: 15, lineHeight: 1.7, margin: 0, maxWidth: 340 }}>{s.desc}</p>
      </div>

      <div style={{ padding: "0 32px 44px" }}>
        <div style={{ display: "flex", gap: 7, justifyContent: "center", marginBottom: 26 }}>
          {slides.map((_, idx) => (
            <div key={idx} style={{
              width: idx === i ? 22 : 7, height: 7, borderRadius: 4,
              background: idx === i ? th.accent : th.border, transition: "all 0.25s",
            }} />
          ))}
        </div>
        <button onClick={() => (last ? onDone() : setI(i + 1))} style={{
          width: "100%", background: `linear-gradient(135deg, ${th.accentSoft}, ${th.accent})`,
          border: "none", borderRadius: 14, padding: 16, color: "#1A1207",
          fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5, fontFamily: ff,
        }}>
          {last ? t("onb_start") : t("onb_next")}
        </button>
      </div>
    </div>
  );
}
