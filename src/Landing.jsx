import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// AURORE — public landing site (the "front door").
// Two journeys: members (Join) and partners (Partner). Sits in front of the
// member journaling app, reachable via "Mon espace".
// ─────────────────────────────────────────────────────────────────────────────

const HEAD_FONT = "'Fraunces', Georgia, serif";

const CLUB = {
  whatsapp: "33632937250",                 // +33 6 32 93 72 50
  instagram: "auroretheclub",
  email: "fatisbusiness@gmail.com",
  city: "Dakar, Sénégal",
};

// Public assets resolve against Vite's base path (works on GitHub Pages too).
// 📸 Drop the two photos in  public/locations/  with these exact names and they
// appear automatically; until then a sunset gradient is shown as fallback.
const ASSET = (p) => `${import.meta.env.BASE_URL}${p}`;
const onImgError = (e) => { e.currentTarget.style.display = "none"; };

const PILLARS = [
  { icon: "🧘🏾", title: "Discipline",  desc: "Routines, objectifs et responsabilité entre pairs." },
  { icon: "🎨", title: "Créativité",  desc: "Ateliers, écriture et arts — créer pour s'exprimer." },
  { icon: "🌿", title: "Bien-être",   desc: "Sport, méditation et nature, au bord de l'océan." },
];

const LOCATIONS = [
  { name: "Toit-terrasse · vue océan",          vibe: "Sessions au lever et au coucher du soleil, face à l'Atlantique.", grad: ["#E0764A", "#F2B488"], image: ASSET("locations/rooftop.jpg") },
  { name: "Coucher de soleil sur la Corniche",  vibe: "Sport, marche et journaling au bord de l'eau, à l'heure dorée.",  grad: ["#CE6F94", "#EBAAC6"], image: ASSET("locations/ocean.jpg") },
];

const PARTNER_POINTS = [
  { icon: "🌍", title: "Audience jeune & engagée", desc: "La jeunesse de Dakar, réunie autour du développement personnel." },
  { icon: "📍", title: "Présence sur le terrain",  desc: "Votre marque associée à des expériences réelles, pas juste un post." },
  { icon: "📸", title: "Contenu authentique",      desc: "Photos & vidéos dans des lieux iconiques, relayés sur Instagram." },
  { icon: "🤝", title: "Collaborations sur-mesure", desc: "On construit le format ensemble, selon vos objectifs." },
];

const waLink = (msg) => `https://wa.me/${CLUB.whatsapp}?text=${encodeURIComponent(msg)}`;
const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export default function Landing({ th, ff, onEnterApp }) {
  const [loc, setLoc] = useState(0);
  const [installEvt, setInstallEvt] = useState(null);
  const wrap = useRef(null);

  // Capture the install prompt so we can offer an "Installer l'app" button.
  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); setInstallEvt(e); };
    const onInstalled = () => setInstallEvt(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!installEvt) return;
    installEvt.prompt();
    await installEvt.userChoice;
    setInstallEvt(null);
  };

  const Section = ({ id, alt, children, style }) => (
    <section id={id} style={{
      background: alt ? th.surface : "transparent",
      padding: "56px 20px", position: "relative", ...style,
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>{children}</div>
    </section>
  );

  const Kicker = ({ children }) => (
    <p style={{ color: th.accent, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", margin: "0 0 10px", fontWeight: 600 }}>{children}</p>
  );
  const H = ({ children, size = 28 }) => (
    <h2 style={{ color: th.text, fontFamily: HEAD_FONT, fontSize: size, fontWeight: 600, lineHeight: 1.15, margin: "0 0 14px" }}>{children}</h2>
  );

  const active = LOCATIONS[loc];

  return (
    <div ref={wrap} style={{ fontFamily: ff, color: th.text }}>
      {/* Top bar */}
      <header style={{
        position: "sticky", top: 0, zIndex: 30,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 18px", background: th.bg + "E6", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${th.border}`,
      }}>
        <div>
          <span style={{ color: th.accent, fontFamily: HEAD_FONT, fontSize: 20, letterSpacing: 3, fontWeight: 600 }}>AURORE</span>
          <span style={{ color: th.muted, fontSize: 8, letterSpacing: 4, marginLeft: 8 }}>THE CLUB</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {installEvt && (
            <button onClick={install} style={{
              background: `linear-gradient(135deg, ${th.accentSoft}, ${th.accent})`, border: "none", color: "#1A1207",
              borderRadius: 20, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: ff,
            }}>Installer l'app</button>
          )}
          <button onClick={onEnterApp} style={{
            background: "transparent", border: `1px solid ${th.border}`, color: th.text,
            borderRadius: 20, padding: "8px 14px", fontSize: 12, cursor: "pointer", fontFamily: ff,
          }}>Mon espace →</button>
        </div>
      </header>

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", padding: "64px 20px 72px", textAlign: "center" }}>
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(90% 60% at 50% 0%, ${th.accent}3A, ${th.accent}10 45%, transparent 72%)`,
        }} />
        <div style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}>
          <div style={{
            width: 92, height: 92, borderRadius: "50%", margin: "0 auto 26px",
            background: `radial-gradient(circle at 35% 35%, ${th.accentSoft}, ${th.accent} 70%)`,
            boxShadow: `0 0 60px ${th.accent}66`,
          }} />
          <h1 style={{ color: th.text, fontFamily: HEAD_FONT, fontSize: 40, lineHeight: 1.1, fontWeight: 600, margin: "0 0 14px" }}>
            Deviens la meilleure<br />version de toi-même.
          </h1>
          <p style={{ color: th.muted, fontSize: 15, lineHeight: 1.7, margin: "0 0 28px" }}>
            Aurore est une communauté de développement personnel pour la jeunesse de Dakar.
            On apprend en faisant, <strong style={{ color: th.text }}>ensemble</strong>, dans les plus beaux endroits
            de la capitale — discipline, créativité et bien-être.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => scrollToId("join")} style={{
              background: `linear-gradient(135deg, ${th.accentSoft}, ${th.accent})`, border: "none",
              borderRadius: 14, padding: "14px 22px", color: "#1A1207", fontSize: 15, fontWeight: 700,
              cursor: "pointer", letterSpacing: 0.5,
            }}>Rejoindre la communauté</button>
            <button onClick={() => scrollToId("partner")} style={{
              background: "transparent", border: `1px solid ${th.accent}`, borderRadius: 14,
              padding: "14px 22px", color: th.accent, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: ff,
            }}>Devenir partenaire</button>
          </div>
        </div>
      </section>

      {/* Two doors */}
      <Section alt>
        <div style={{ display: "grid", gap: 12 }}>
          <DoorCard th={th} ff={ff} emoji="💛" title="Pour les membres"
            desc="Un environnement bienveillant pour bâtir de vraies habitudes de vie, entre pairs."
            cta="Rejoindre" onClick={() => scrollToId("join")} />
          <DoorCard th={th} ff={ff} emoji="🤝" title="Pour les partenaires"
            desc="Un accès direct à une audience jeune, engagée et en forte croissance."
            cta="Collaborer" onClick={() => scrollToId("partner")} />
        </div>
      </Section>

      {/* Pillars / weekly program */}
      <Section id="programme">
        <Kicker>Le programme</Kicker>
        <H>Chaque semaine, on passe à l'action.</H>
        <p style={{ color: th.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 22px" }}>
          Contrairement au coaching classique — souvent théorique et coûteux — Aurore est immersif :
          des activités concrètes, en groupe, sur le terrain.
        </p>
        <div style={{ display: "grid", gap: 10 }}>
          {PILLARS.map(p => (
            <div key={p.title} style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              background: th.bg, border: `1px solid ${th.border}`, borderRadius: 14, padding: 16,
            }}>
              <span style={{ fontSize: 26 }}>{p.icon}</span>
              <div>
                <p style={{ color: th.text, fontSize: 15, fontWeight: 600, margin: "0 0 3px" }}>{p.title}</p>
                <p style={{ color: th.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Locations spotlight — "sell the dream" */}
      <Section alt id="lieux">
        <Kicker>Les lieux</Kicker>
        <H>Dakar comme tu ne l'as jamais vécue.</H>
        <div style={{
          height: 240, borderRadius: 18, overflow: "hidden", position: "relative",
          background: `linear-gradient(135deg, ${active.grad[0]}, ${active.grad[1]})`,
          display: "flex", alignItems: "flex-end", marginBottom: 12,
          boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
        }}>
          {active.image && (
            <img src={active.image} alt={active.name} onError={onImgError} style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            }} />
          )}
          <div style={{ position: "relative", background: "linear-gradient(transparent, rgba(0,0,0,0.6))", padding: "40px 18px 16px", width: "100%" }}>
            <p style={{ color: "#fff", fontFamily: HEAD_FONT, fontSize: 20, fontWeight: 600, margin: "0 0 4px" }}>{active.name}</p>
            <p style={{ color: "#fff", opacity: 0.92, fontSize: 13, lineHeight: 1.5, margin: 0 }}>{active.vibe}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {LOCATIONS.map((l, i) => (
            <button key={l.name} onClick={() => setLoc(i)} aria-label={l.name} aria-pressed={loc === i} style={{
              flexShrink: 0, width: 72, height: 52, borderRadius: 10, cursor: "pointer", overflow: "hidden", padding: 0,
              background: `linear-gradient(135deg, ${l.grad[0]}, ${l.grad[1]})`,
              border: `2px solid ${loc === i ? th.accent : "transparent"}`,
              opacity: loc === i ? 1 : 0.7,
            }}>
              {l.image && <img src={l.image} alt="" onError={onImgError} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </button>
          ))}
        </div>
      </Section>

      {/* Member journey */}
      <Section id="join">
        <Kicker>Pour les membres</Kicker>
        <H>Rejoins l'aventure.</H>
        <p style={{ color: th.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 18px" }}>
          Quelques semaines intensives pour transformer tes habitudes, entouré·e d'une communauté qui te tire vers le haut.
          Écris-nous sur WhatsApp ou Instagram — on te dit tout.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href={waLink("Bonjour Aurore ! Je souhaite rejoindre la communauté 🌅")} target="_blank" rel="noopener noreferrer" style={{
            background: `linear-gradient(135deg, ${th.accentSoft}, ${th.accent})`, color: "#1A1207",
            borderRadius: 14, padding: "13px 20px", fontSize: 14, fontWeight: 700, textDecoration: "none",
          }}>Postuler via WhatsApp</a>
          <button onClick={onEnterApp} style={{
            background: "transparent", border: `1px solid ${th.border}`, color: th.text,
            borderRadius: 14, padding: "13px 20px", fontSize: 14, cursor: "pointer", fontFamily: ff,
          }}>Ouvrir mon espace</button>
        </div>
      </Section>

      {/* Partner journey */}
      <Section alt id="partner">
        <Kicker>Pour les partenaires</Kicker>
        <H>Touchez la jeunesse de Dakar.</H>
        <p style={{ color: th.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 20px" }}>
          Associez votre marque à une communauté authentique et à des expériences mémorables.
        </p>
        <div style={{ display: "grid", gap: 10, marginBottom: 22 }}>
          {PARTNER_POINTS.map(p => (
            <div key={p.title} style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              background: th.bg, border: `1px solid ${th.border}`, borderRadius: 14, padding: 16,
            }}>
              <span style={{ fontSize: 24 }}>{p.icon}</span>
              <div>
                <p style={{ color: th.text, fontSize: 15, fontWeight: 600, margin: "0 0 3px" }}>{p.title}</p>
                <p style={{ color: th.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <a href={waLink("Bonjour Aurore ! Nous aimerions discuter d'un partenariat 🤝")} target="_blank" rel="noopener noreferrer" style={{
          display: "block", textAlign: "center",
          background: `linear-gradient(135deg, ${th.accentSoft}, ${th.accent})`, color: "#1A1207",
          borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 700, textDecoration: "none",
        }}>Discuter d'un partenariat</a>
        <p style={{ textAlign: "center", margin: "12px 0 0" }}>
          <a href={`mailto:${CLUB.email}`} style={{ color: th.muted, fontSize: 13 }}>{CLUB.email}</a>
        </p>
      </Section>

      {/* Footer */}
      <footer style={{ padding: "40px 20px 110px", textAlign: "center", borderTop: `1px solid ${th.border}` }}>
        <p style={{ color: th.accent, fontFamily: HEAD_FONT, fontSize: 18, letterSpacing: 4, margin: "0 0 6px" }}>AURORE</p>
        <p style={{ color: th.muted, fontSize: 10, letterSpacing: 3, margin: "0 0 16px" }}>THE CLUB · {CLUB.city}</p>
        <div style={{ display: "flex", gap: 18, justifyContent: "center", marginBottom: 18 }}>
          <a href={`https://instagram.com/${CLUB.instagram}`} target="_blank" rel="noopener noreferrer" style={{ color: th.text, fontSize: 13, textDecoration: "none" }}>Instagram</a>
          <a href={waLink("Bonjour Aurore !")} target="_blank" rel="noopener noreferrer" style={{ color: th.text, fontSize: 13, textDecoration: "none" }}>WhatsApp</a>
          <button onClick={onEnterApp} style={{ background: "none", border: "none", color: th.text, fontSize: 13, cursor: "pointer", fontFamily: ff, padding: 0 }}>Mon espace</button>
        </div>
        <p style={{ color: th.faint, fontSize: 11, margin: 0 }}>Projet de Marketing Digital · Fatima Dia</p>
      </footer>

      {/* WhatsApp floating button */}
      <a href={waLink("Bonjour Aurore ! J'aimerais en savoir plus sur le club 🌅")} target="_blank" rel="noopener noreferrer"
        aria-label="Nous écrire sur WhatsApp" style={{
        position: "fixed", right: 16, bottom: 18, zIndex: 40,
        display: "flex", alignItems: "center", gap: 8,
        background: "#25D366", color: "#073B22", textDecoration: "none",
        borderRadius: 30, padding: "12px 16px", fontSize: 13, fontWeight: 700,
        boxShadow: "0 6px 22px rgba(0,0,0,0.35)",
      }}>
        <span style={{ fontSize: 18 }}>💬</span> Discuter
      </a>
    </div>
  );
}

function DoorCard({ th, ff, emoji, title, desc, cta, onClick }) {
  return (
    <div style={{ background: th.bg, border: `1px solid ${th.border}`, borderRadius: 16, padding: 18, display: "flex", gap: 14, alignItems: "center" }}>
      <span style={{ fontSize: 30 }}>{emoji}</span>
      <div style={{ flex: 1 }}>
        <p style={{ color: th.text, fontSize: 16, fontWeight: 700, margin: "0 0 4px", fontFamily: HEAD_FONT }}>{title}</p>
        <p style={{ color: th.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{desc}</p>
      </div>
      <button onClick={onClick} style={{
        background: "transparent", border: `1px solid ${th.accent}`, color: th.accent,
        borderRadius: 20, padding: "8px 14px", fontSize: 12, cursor: "pointer", fontWeight: 600, fontFamily: ff, whiteSpace: "nowrap",
      }}>{cta}</button>
    </div>
  );
}
