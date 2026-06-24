import { useState, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// AURORE — public landing site (the "front door").
// Two journeys: members (Join) and partners (Partner). Sits in front of the
// member journaling app, reachable via "Mon espace".
//
// ⚠️ EDIT ME: the values below are placeholders — replace with the real
// WhatsApp number, Instagram handle, email, photos/videos, stats, partnership
// tiers and testimonials. Search for "EDIT" in this file.
// ─────────────────────────────────────────────────────────────────────────────

const HEAD_FONT = "'Fraunces', Georgia, serif";

const CLUB = {
  whatsapp: "221700000000",            // EDIT: WhatsApp number, international format, no "+"
  instagram: "auroretheclub",          // EDIT: Instagram handle (without @)
  email: "hello@auroretheclub.com",    // EDIT: contact email
  city: "Dakar, Sénégal",
};

const PILLARS = [
  { icon: "🧘🏾", title: "Discipline",  desc: "Routines, objectifs et responsabilité entre pairs." },
  { icon: "🎨", title: "Créativité",  desc: "Ateliers, écriture et arts — créer pour s'exprimer." },
  { icon: "🌿", title: "Bien-être",   desc: "Sport, méditation et nature, au bord de l'océan." },
];

// EDIT: swap `grad` for real photo/video URLs (image: "/locations/xxx.jpg").
const LOCATIONS = [
  { name: "Toit-terrasse · Plateau",   vibe: "Sessions au lever du soleil, face à la ville qui s'éveille.", grad: ["#E0764A", "#F2B488"] },
  { name: "Plage des Almadies",        vibe: "Sport, respiration et cercles de parole, les pieds dans le sable.", grad: ["#2E9BB5", "#86D2E0"] },
  { name: "Jardin secret · Ngor",      vibe: "Ateliers créatifs à l'ombre : carnets, aquarelles et musique.", grad: ["#D9A441", "#F0CE84"] },
  { name: "Corniche Ouest",            vibe: "Marches au coucher du soleil et journaling face à l'Atlantique.", grad: ["#CE6F94", "#EBAAC6"] },
];

// EDIT: real numbers.
const STATS = [
  { value: "150+", label: "membres actifs" },
  { value: "85%",  label: "actifs chaque semaine" },
  { value: "×3",   label: "croissance en 6 mois" },
  { value: "5k+",  label: "communauté Instagram" },
];

// EDIT: real partnership tiers.
const TIERS = [
  { name: "Découverte", featured: false, perks: ["Présence sur un évènement", "Mention sur Instagram", "Accès à la communauté"] },
  { name: "Engagé",     featured: true,  perks: ["Une activité co-brandée / mois", "Stories + post dédiés", "Logo sur le site & supports", "Bilan d'audience trimestriel"] },
  { name: "Signature",  featured: false, perks: ["Série d'évènements signature", "Campagne sur-mesure", "Ambassadeurs membres", "Reporting d'impact complet"] },
];

// EDIT: real testimonials.
const TESTIMONIALS = [
  { name: "Awa, 22 ans",    text: "Aurore m'a donné une discipline que le coaching classique ne m'avait jamais apportée — et des ami·e·s pour la vie." },
  { name: "Cheikh, 25 ans", text: "On apprend en faisant, ensemble, dans des endroits magnifiques. C'est devenu mon rendez-vous de la semaine." },
];

const waLink = (msg) => `https://wa.me/${CLUB.whatsapp}?text=${encodeURIComponent(msg)}`;
const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export default function Landing({ th, ff, onEnterApp }) {
  const [loc, setLoc] = useState(0);
  const wrap = useRef(null);

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
        <button onClick={onEnterApp} style={{
          background: "transparent", border: `1px solid ${th.border}`, color: th.text,
          borderRadius: 20, padding: "8px 14px", fontSize: 12, cursor: "pointer", fontFamily: ff,
        }}>Mon espace →</button>
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
        {/* EDIT: replace the gradient with a real photo/video for each location */}
        <div style={{
          height: 220, borderRadius: 18, overflow: "hidden", position: "relative",
          background: `linear-gradient(135deg, ${active.grad[0]}, ${active.grad[1]})`,
          display: "flex", alignItems: "flex-end", marginBottom: 12,
          boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
        }}>
          <div style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.55))", padding: "30px 18px 16px", width: "100%" }}>
            <p style={{ color: "#fff", fontFamily: HEAD_FONT, fontSize: 20, fontWeight: 600, margin: "0 0 4px" }}>{active.name}</p>
            <p style={{ color: "#fff", opacity: 0.9, fontSize: 13, lineHeight: 1.5, margin: 0 }}>{active.vibe}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {LOCATIONS.map((l, i) => (
            <button key={l.name} onClick={() => setLoc(i)} aria-label={l.name} aria-pressed={loc === i} style={{
              flexShrink: 0, width: 64, height: 48, borderRadius: 10, cursor: "pointer",
              background: `linear-gradient(135deg, ${l.grad[0]}, ${l.grad[1]})`,
              border: `2px solid ${loc === i ? th.accent : "transparent"}`,
              opacity: loc === i ? 1 : 0.7,
            }} />
          ))}
        </div>
      </Section>

      {/* Member journey */}
      <Section id="join">
        <Kicker>Pour les membres</Kicker>
        <H>Rejoins l'aventure.</H>
        <p style={{ color: th.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 18px" }}>
          Quelques semaines intensives pour transformer tes habitudes, entouré·e d'une communauté qui te tire vers le haut.
        </p>
        {TESTIMONIALS.map(tm => (
          <div key={tm.name} style={{
            background: th.surface, border: `1px solid ${th.border}`, borderLeft: `3px solid ${th.accent}`,
            borderRadius: 12, padding: 16, marginBottom: 10,
          }}>
            <p style={{ color: th.text, fontSize: 14, fontStyle: "italic", lineHeight: 1.7, margin: "0 0 8px", fontFamily: HEAD_FONT }}>“{tm.text}”</p>
            <p style={{ color: th.muted, fontSize: 12, margin: 0 }}>— {tm.name}</p>
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background: th.bg, border: `1px solid ${th.border}`, borderRadius: 14, padding: 16, textAlign: "center" }}>
              <p style={{ color: th.accent, fontSize: 26, fontWeight: 700, margin: "0 0 2px", fontFamily: HEAD_FONT }}>{s.value}</p>
              <p style={{ color: th.muted, fontSize: 11, margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
        <p style={{ color: th.faint, fontSize: 11, margin: "-12px 0 22px", textAlign: "center" }}>
          *Chiffres indicatifs — à remplacer. Données d'audience agrégées et anonymes.
        </p>
        <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
          {TIERS.map(t => (
            <div key={t.name} style={{
              background: t.featured ? th.accent + "14" : th.bg,
              border: `1px solid ${t.featured ? th.accent : th.border}`, borderRadius: 16, padding: 18,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <p style={{ color: th.text, fontSize: 16, fontWeight: 700, margin: 0, fontFamily: HEAD_FONT }}>{t.name}</p>
                {t.featured && <span style={{ background: th.accent, color: "#1A1207", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 20, letterSpacing: 1 }}>POPULAIRE</span>}
              </div>
              {t.perks.map(p => (
                <p key={p} style={{ color: th.muted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>✦ {p}</p>
              ))}
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
