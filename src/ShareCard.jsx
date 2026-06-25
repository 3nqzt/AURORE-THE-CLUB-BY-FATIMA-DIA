import { useEffect, useRef, useState } from "react";

// Canvas-safe serif (Fraunces isn't guaranteed to be loaded for <canvas>).
const SERIF = "Georgia, 'Times New Roman', serif";
const W = 1080, H = 1920; // Instagram story / portrait

const loadImg = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

function wrap(ctx, text, maxW, maxLines) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S{0,2}$/, "") + "…";
  }
  return lines;
}

function roundRect(ctx, x, y, w, h, r) {
  if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); return; }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Generates a shareable sunset card from a journal entry.
export default function ShareCardModal({ entry, th, lang, t, getMood, formatDate, onClose }) {
  const canvasRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const m = getMood(entry.mood);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const c = canvasRef.current;
      if (!c) return;
      c.width = W; c.height = H;
      const ctx = c.getContext("2d");

      // Mood-tinted sunset gradient.
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#241328");
      g.addColorStop(0.45, m.c);
      g.addColorStop(1, "#F4BE86");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      ctx.textAlign = "center";

      // Wordmark.
      ctx.fillStyle = "rgba(255,255,255,0.96)";
      try { ctx.letterSpacing = "12px"; } catch { /* older browsers */ }
      ctx.font = `600 72px ${SERIF}`;
      ctx.fillText("AURORE", W / 2, 220);
      try { ctx.letterSpacing = "8px"; } catch { /* noop */ }
      ctx.font = `400 26px ${SERIF}`;
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText("THE CLUB", W / 2, 262);
      try { ctx.letterSpacing = "0px"; } catch { /* noop */ }

      // Media block: the photo if present, otherwise a mood orb.
      const bx = 110, by = 330, bw = W - 220, bh = bw; // square
      if (entry.photo) {
        try {
          const img = await loadImg(entry.photo);
          if (cancelled) return;
          ctx.save();
          roundRect(ctx, bx, by, bw, bh, 40);
          ctx.clip();
          const scale = Math.max(bw / img.width, bh / img.height);
          const dw = img.width * scale, dh = img.height * scale;
          ctx.drawImage(img, bx + (bw - dw) / 2, by + (bh - dh) / 2, dw, dh);
          ctx.restore();
        } catch { /* fall back to orb below */ }
      }
      if (!entry.photo) {
        const cx = W / 2, cy = by + bh / 2, r = 180;
        const rg = ctx.createRadialGradient(cx - 50, cy - 50, 30, cx, cy, r);
        rg.addColorStop(0, "rgba(255,255,255,0.95)");
        rg.addColorStop(1, "rgba(255,255,255,0.12)");
        ctx.fillStyle = rg;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
        ctx.font = "150px serif";
        ctx.fillText(m.e, cx, cy + 56);
      }

      // Mood label.
      let y = by + bh + 96;
      ctx.fillStyle = "#fff";
      ctx.font = `600 46px ${SERIF}`;
      ctx.fillText(`${m.e}  ${t(`mood_${entry.mood}`)}`, W / 2, y);
      y += 70;

      // Entry text (fewer lines when a photo is shown).
      if (entry.text) {
        ctx.font = `italic 500 50px ${SERIF}`;
        ctx.fillStyle = "rgba(255,255,255,0.97)";
        const lines = wrap(ctx, entry.text, W - 220, entry.photo ? 4 : 9);
        for (const ln of lines) { ctx.fillText(ln, W / 2, y); y += 70; }
      }

      // Emojis.
      if (entry.emojis && entry.emojis.length) {
        ctx.font = "60px serif";
        ctx.fillText(entry.emojis.join("  "), W / 2, Math.min(y + 30, H - 320));
      }

      // Date + place.
      ctx.font = `400 38px ${SERIF}`;
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.fillText(`${formatDate(entry.date, lang)} · ${entry.time}`, W / 2, H - 230);
      if (entry.place && entry.place.label) {
        ctx.font = `400 30px ${SERIF}`;
        ctx.fillStyle = "rgba(255,255,255,0.72)";
        ctx.fillText(`📍 ${entry.place.label}`, W / 2, H - 182);
      }

      // Handle.
      try { ctx.letterSpacing = "2px"; } catch { /* noop */ }
      ctx.font = `600 34px ${SERIF}`;
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fillText("@auroretheclub", W / 2, H - 96);
      try { ctx.letterSpacing = "0px"; } catch { /* noop */ }
    })();
    return () => { cancelled = true; };
  }, [entry, m, lang, t, getMood, formatDate]);

  const toBlob = () => new Promise((res) => canvasRef.current.toBlob(res, "image/png"));

  const download = async () => {
    const blob = await toBlob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `aurore-${entry.date}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const share = async () => {
    setBusy(true);
    try {
      const blob = await toBlob();
      const file = new File([blob], `aurore-${entry.date}.png`, { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: t("share_caption") });
      } else {
        await download();
      }
    } catch { /* user cancelled or share failed */ }
    finally { setBusy(false); }
  };

  const btn = (bg, color, border) => ({
    background: bg, color, border: border || "none", borderRadius: 14,
    padding: "13px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer",
    fontFamily: "inherit",
  });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <button aria-label={t("close")} onClick={onClose} style={{
        position: "absolute", inset: 0, background: "rgba(0,0,0,0.92)", border: "none", cursor: "default",
      }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <canvas ref={canvasRef} aria-label={t("share_title")} style={{
          width: "min(64vw, 250px)", height: "auto", borderRadius: 18,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }} />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={share} disabled={busy} style={btn(`linear-gradient(135deg, ${th.accentSoft}, ${th.accent})`, "#1A1207")}>
            📤 {t("share_btn")}
          </button>
          <button onClick={download} style={btn("transparent", "#fff", "1px solid rgba(255,255,255,0.4)")}>
            ⬇︎ {t("download_btn")}
          </button>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 14, cursor: "pointer" }}>
          {t("close")}
        </button>
      </div>
    </div>
  );
}
