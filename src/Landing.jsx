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

// Premiers chiffres de la communauté (taux d'engagement = interactions / vues).
const STATS = [
  { value: "507", label: "vues" },
  { value: "33", label: "interactions" },
  { value: "6,5 %", label: "engagement" },
];

const TESTIMONIALS = [
  { t: "Écouter l'intérieur des gens pour essayer de proposer des solutions à travers l'art et la beauté de la capitale sénégalaise, c'est super !", a: "MD" },
  { t: "Les couleurs sont superrrrrr cozy.", a: "NNN" },
  { t: "Je trouve que c'est très bien fait ma shaa Allah. Et puis le projet est original.", a: "FBN" },
  { t: "C'est vraiment stylé, l'idée est parfaite, le site est moderne.", a: "POD" },
  { t: "Déjà l'idée est excellente… Life is getting harder and harder… et il y a plein de gens qui ont besoin de ce genre d'outils. Ensuite le site il est clean, bien organisé… un bon mix entre professional & casual. It's giving a vibe of drinking cocktails en face de la mer + sunset. The agenda is also very nice with very useful features.", a: "PLOS" },
  { t: "La plateforme est très très bien. J'aime beaucoup le concept ! À défaut d'aller chez le psy ça aide vraiment. And I really like the colors.", a: "SM" },
  { t: "C'est vraiment très très bien fait ! J'aime bien la diversité des thèmes/couleurs, la précision de la carte ainsi que les différentes photos mettant en avant Dakar.", a: "RM" },
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

      {/* Testimonials */}
      <Section id="temoignages">
        <Kicker>Ils en parlent</Kicker>
        <H>Ce que la communauté en dit.</H>
        <div style={{ display: "grid", gap: 10 }}>
          {TESTIMONIALS.map((tm, i) => (
            <figure key={i} style={{
              margin: 0, background: th.surface, border: `1px solid ${th.border}`,
              borderLeft: `3px solid ${th.accent}`, borderRadius: 14, padding: "16px 18px",
            }}>
              <blockquote style={{ margin: 0, color: th.text, fontSize: 14, lineHeight: 1.7, fontFamily: HEAD_FONT, fontStyle: "italic" }}>
                “{tm.t}”
              </blockquote>
              <figcaption style={{ marginTop: 10, color: th.accent, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>— {tm.a}</figcaption>
            </figure>
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
        <p style={{ color: th.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 16px" }}>
          Associez votre marque à une communauté authentique et à des expériences mémorables.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 8 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background: th.bg, border: `1px solid ${th.border}`, borderRadius: 14, padding: "16px 6px", textAlign: "center" }}>
              <p style={{ color: th.accent, fontSize: 26, fontWeight: 700, margin: "0 0 2px", fontFamily: HEAD_FONT }}>{s.value}</p>
              <p style={{ color: th.muted, fontSize: 10.5, margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
        <p style={{ color: th.faint, fontSize: 11, margin: "0 0 22px" }}>Premiers chiffres de la communauté sur Instagram.</p>
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
        <div style={{ display: "flex", gap: 22, justifyContent: "center", alignItems: "center", marginBottom: 18 }}>
          <a href={`https://instagram.com/${CLUB.instagram}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram @auroretheclub" style={{ color: th.text, display: "inline-flex", padding: 4 }}><IGIcon /></a>
          <a href={waLink("Bonjour Aurore !")} target="_blank" rel="noopener noreferrer" aria-label="Nous écrire sur WhatsApp" style={{ color: th.text, display: "inline-flex", padding: 4 }}><WAIcon /></a>
          <button onClick={onEnterApp} style={{ background: "none", border: "none", color: th.text, fontSize: 13, cursor: "pointer", fontFamily: ff, padding: 0 }}>Mon espace</button>
        </div>
        <p style={{ color: th.faint, fontSize: 11, margin: 0 }}>Projet de Marketing Digital · Fatima Dia</p>
      </footer>

      {/* WhatsApp floating button — minimalist icon */}
      <a href={waLink("Bonjour Aurore ! J'aimerais en savoir plus sur le club 🌅")} target="_blank" rel="noopener noreferrer"
        aria-label="Nous écrire sur WhatsApp" style={{
        position: "fixed", right: 16, bottom: 18, zIndex: 40,
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 54, height: 54, borderRadius: "50%",
        background: "#25D366", color: "#fff", textDecoration: "none",
        boxShadow: "0 6px 22px rgba(0,0,0,0.35)",
      }}>
        <WAIcon size={28} color="#fff" />
      </a>
    </div>
  );
}

// Brand glyphs (inline SVG) for a minimalist look.
function WAIcon({ size = 22, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true" focusable="false">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

function IGIcon({ size = 22, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true" focusable="false">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
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
