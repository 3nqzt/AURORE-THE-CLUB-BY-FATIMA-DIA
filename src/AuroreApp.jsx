import { useState } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const MOODS = [
  { v: 1, e: "😢", l: "Triste",        c: "#4A6FA5" },
  { v: 2, e: "😔", l: "Mélancolique",  c: "#8B6F8E" },
  { v: 3, e: "😐", l: "Neutre",        c: "#8A9E7D" },
  { v: 4, e: "😊", l: "Joyeux(se)",    c: "#C4813A" },
  { v: 5, e: "✨", l: "Radieux(se)",   c: "#E8B060" },
];

const THEMES = [
  { name:"Aurore",     bg:"#0D0B0E", surface:"#1A1614", border:"#2A2420", accent:"#C4813A", accentSoft:"#E8B89A", text:"#F5EDE3", muted:"#9E8E7E", faint:"#3A302C" },
  { name:"Crépuscule", bg:"#12091E", surface:"#1E1030", border:"#2E1E44", accent:"#9B59B6", accentSoft:"#D7A4E8", text:"#F0E8F8", muted:"#9A80B0", faint:"#3A2050" },
  { name:"Sahara",     bg:"#16100A", surface:"#221808", border:"#332204", accent:"#D4A017", accentSoft:"#F0CB6A", text:"#FFF8E7", muted:"#A08840", faint:"#5A4510" },
  { name:"Lagon",      bg:"#030D18", surface:"#071825", border:"#0E2A3C", accent:"#2E86AB", accentSoft:"#7ACCE0", text:"#E0F4FA", muted:"#5A8EA0", faint:"#0E3A50" },
];

const FONTS = [
  { name:"Sérif",  family:"Georgia, serif" },
  { name:"Sans",   family:"system-ui, sans-serif" },
  { name:"Mono",   family:"'Courier New', monospace" },
];

const EMOJIS = ["✨","💪","🌙","🌊","🎨","📚","🌸","💛","🫶","🌿","☀️","🌧️","🫖","🎵","💭","🔥","🌺","🦋","🌴","🎯"];

const QUOTES = [
  "Chaque matin est une nouvelle chance de devenir qui tu veux être.",
  "Ta seule concurrence, c'est toi d'hier.",
  "La discipline est la forme la plus haute d'amour propre.",
  "Ce que tu ressens est valide. Ce que tu fais de ce ressenti, c'est ton pouvoir.",
  "Dakar te regarde grandir. Grandis avec intention.",
  "Tu n'es pas en retard. Tu es exactement là où tu dois être.",
  "La version de toi d'aujourd'hui mérite autant de soin que celle de demain.",
];

const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAYS_SHORT = ["L","M","M","J","V","S","D"];

const SAMPLE_ENTRIES = [
  { id:1, date:"2025-06-22", time:"08:30", text:"Belle journée productive. Mon projet prend forme et je suis fière du chemin parcouru. Aurore the club m'a vraiment aidée à me recentrer sur l'essentiel.", mood:5, emojis:["✨","💪"] },
  { id:2, date:"2025-06-21", time:"21:15", text:"Un peu de mélancolie ce soir. Mais la pluie sur Dakar a quelque chose de poétique. Je me suis assise près de la fenêtre et j'ai réfléchi longuement.", mood:2, emojis:["🌧️","🫖"] },
  { id:3, date:"2025-06-19", time:"10:00", text:"Atelier créatif ce matin. J'ai retrouvé cette joie d'enfant quand on crée sans raison. Peinture, musique, rires — exactement ce dont j'avais besoin.", mood:4, emojis:["🎨","💛"] },
  { id:4, date:"2025-06-17", time:"19:45", text:"Journée neutre. Ni haute ni basse, juste présente. Et parfois, la présence c'est déjà beaucoup.", mood:3, emojis:["🌿"] },
  { id:5, date:"2025-06-15", time:"07:00", text:"Le picnic du club hier soir était magique. Ces personnes me donnent de l'énergie et me rappellent pourquoi je veux grandir.", mood:5, emojis:["🌴","🌸","🫶"] },
  { id:6, date:"2025-06-12", time:"22:00", text:"Fatiguée mais en paix. J'ai lu 30 pages, médité 10 minutes. Petites victoires.", mood:3, emojis:["📚","🌙"] },
];

const SAMPLE_TASKS = [
  { id:1, text:"Finaliser le wireframe du projet Aurore", done:false, priority:"haute", date:"2025-06-22" },
  { id:2, text:"Méditer 10 minutes ce matin",            done:true,  priority:"normale", date:"2025-06-22" },
  { id:3, text:"Appeler maman",                          done:false, priority:"haute",   date:"2025-06-22" },
  { id:4, text:"Lire 20 pages du livre du club",         done:false, priority:"normale", date:"2025-06-23" },
  { id:5, text:"Préparer la présentation de soutenance", done:false, priority:"haute",   date:"2025-06-25" },
];

// ─── UTILS ────────────────────────────────────────────────────────────────────

const getMood = (v) => MOODS.find(m => m.v === v) || MOODS[2];
const todayStr = () => new Date().toISOString().split("T")[0];
const formatDate = (ds) => {
  const d = new Date(ds + "T00:00:00");
  const days = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
  return `${days[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)}`;
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

function MoodOrb({ mood, size = 100, animated = true }) {
  const m = getMood(mood);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `radial-gradient(circle at 35% 35%, ${m.c}cc, ${m.c}66, ${m.c}22)`,
      boxShadow: `0 0 ${size * 0.4}px ${m.c}77, 0 0 ${size * 0.9}px ${m.c}22`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36,
      animation: animated ? "orbPulse 3.5s ease-in-out infinite" : "none",
      transition: "all 0.6s ease",
      flexShrink: 0,
    }}>
      {m.e}
    </div>
  );
}

function Card({ children, style, th }) {
  return (
    <div style={{
      background: th.surface, border: `1px solid ${th.border}`,
      borderRadius: 16, padding: 18, ...style,
    }}>
      {children}
    </div>
  );
}

function Label({ children, th }) {
  return (
    <p style={{ color: th.muted, fontSize: 10, letterSpacing: 2, margin: "0 0 10px", textTransform: "uppercase" }}>
      {children}
    </p>
  );
}

function Btn({ children, onClick, variant = "primary", th, style = {} }) {
  const base = {
    border: "none", borderRadius: 10, padding: "10px 16px",
    fontSize: 12, cursor: "pointer", letterSpacing: 1,
    fontWeight: 700, transition: "opacity 0.15s", ...style,
  };
  const styles = {
    primary:   { ...base, background: th.accent, color: "#000" },
    secondary: { ...base, background: th.surface, border: `1px solid ${th.border}`, color: th.muted },
    ghost:     { ...base, background: "transparent", border: `1px solid ${th.border}`, color: th.muted },
  };
  return <button onClick={onClick} style={styles[variant]}>{children}</button>;
}

// ─── SPLASH SCREEN ───────────────────────────────────────────────────────────

function SplashScreen({ th }) {
  return (
    <div style={{
      minHeight: "100vh", background: th.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      animation: "splashFade 2.5s ease-in-out",
    }}>
      <MoodOrb mood={4} size={130} animated={true} />
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <p style={{ color: th.accent, fontFamily: "Georgia, serif", fontSize: 30, letterSpacing: 6, margin: "0 0 4px", fontWeight: 700 }}>
          AURORE
        </p>
        <p style={{ color: th.muted, fontSize: 11, letterSpacing: 5, margin: 0 }}>THE CLUB</p>
      </div>
      <p style={{ color: th.faint, fontSize: 12, marginTop: 48, letterSpacing: 2, fontStyle: "italic" }}>
        Chargement de ton espace…
      </p>
    </div>
  );
}

// ─── LOCK SCREEN ─────────────────────────────────────────────────────────────

function LockScreen({ onUnlock, error, th }) {
  const [val, setVal] = useState("");
  const hit = (d) => {
    const next = (val + d).slice(0, 6);
    setVal(next);
    if (next.length >= 4) { setTimeout(() => { onUnlock(next); setVal(""); }, 300); }
  };
  return (
    <div style={{
      minHeight: "100vh", background: th.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: 32, fontFamily: "inherit",
    }}>
      <p style={{ color: th.accent, fontFamily: "Georgia, serif", fontSize: 22, letterSpacing: 4, margin: "0 0 4px" }}>AURORE</p>
      <p style={{ color: th.muted, fontSize: 10, letterSpacing: 4, margin: "0 0 40px" }}>THE CLUB</p>
      <MoodOrb mood={4} size={72} animated={true} />
      <p style={{ color: error ? "#E05050" : th.muted, fontSize: 13, margin: "28px 0 16px", transition: "color 0.2s" }}>
        {error ? "Code incorrect — réessaie" : "Entre ton code PIN"}
      </p>
      <div style={{ display: "flex", gap: 14, marginBottom: 36 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            width: 13, height: 13, borderRadius: "50%",
            background: i < val.length ? th.accent : th.faint,
            transition: "background 0.15s",
          }} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, width: 210 }}>
        {[1,2,3,4,5,6,7,8,9,"","0","⌫"].map((d, i) => (
          <button key={i}
            onClick={() => (typeof d === "number" || d === "0") ? hit(String(d)) : d === "⌫" && setVal(v => v.slice(0,-1))}
            style={{
              height: 58, background: d === "" ? "transparent" : th.surface,
              border: d === "" ? "none" : `1px solid ${th.border}`,
              borderRadius: 12, color: th.text,
              fontSize: d === "⌫" ? 16 : 22, cursor: d === "" ? "default" : "pointer",
            }}
          >{d}</button>
        ))}
      </div>
    </div>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────────────────────

function HomePage({ entries, tasks, th, ff, currentMood, setCurrentMood, onNewEntry }) {
  const today = todayStr();
  const quote = QUOTES[new Date().getDate() % QUOTES.length];
  const week = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().split("T")[0];
    const entry = entries.find(e => e.date === ds);
    return { ds, mood: entry?.mood, day: DAYS_SHORT[(d.getDay() + 6) % 7], isToday: ds === today };
  });

  return (
    <div style={{ padding: "24px 18px 110px", fontFamily: ff }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <p style={{ color: th.muted, fontSize: 10, letterSpacing: 3, margin: "0 0 3px" }}>
            {new Date().toLocaleDateString("fr-FR", { weekday: "long" }).toUpperCase()} · {new Date().getDate()} {MONTHS[new Date().getMonth()].toUpperCase()}
          </p>
          <h1 style={{ color: th.accent, fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, letterSpacing: 3, margin: 0 }}>
            AURORE
          </h1>
          <p style={{ color: th.muted, fontSize: 9, letterSpacing: 5, margin: "2px 0 0" }}>THE CLUB</p>
        </div>
        <button onClick={onNewEntry} style={{
          width: 48, height: 48, borderRadius: "50%", background: th.accent,
          border: "none", color: "#fff", fontSize: 22, cursor: "pointer",
          boxShadow: `0 4px 24px ${th.accent}66`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>+</button>
      </div>

      {/* Mood card */}
      <Card th={th} style={{ textAlign: "center", padding: "30px 20px", marginBottom: 14 }}>
        <Label th={th}>Comment te sens-tu aujourd'hui ?</Label>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <MoodOrb mood={currentMood} size={110} animated={true} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 10 }}>
          {MOODS.map(m => (
            <button key={m.v} onClick={() => setCurrentMood(m.v)} style={{
              width: 44, height: 44, borderRadius: "50%", fontSize: 20, cursor: "pointer",
              background: currentMood === m.v ? m.c + "44" : "transparent",
              border: `2px solid ${currentMood === m.v ? m.c : "transparent"}`,
              transition: "all 0.2s",
            }}>{m.e}</button>
          ))}
        </div>
        <p style={{ color: getMood(currentMood).c, fontSize: 12, margin: 0, fontStyle: "italic", letterSpacing: 1 }}>
          {getMood(currentMood).l}
        </p>
      </Card>

      {/* Quote */}
      <Card th={th} style={{ marginBottom: 14, borderLeft: `3px solid ${th.accent}`, paddingLeft: 16 }}>
        <Label th={th}>Affirmation du jour</Label>
        <p style={{ color: th.text, fontSize: 14, fontStyle: "italic", lineHeight: 1.7, margin: 0, fontFamily: "Georgia, serif" }}>
          "{quote}"
        </p>
      </Card>

      {/* Week strip */}
      <Card th={th} style={{ marginBottom: 14 }}>
        <Label th={th}>Semaine en humeurs</Label>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {week.map((w, i) => {
            const m = w.mood ? getMood(w.mood) : null;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", fontSize: 16,
                  background: m ? m.c + "44" : th.faint,
                  border: `2px solid ${w.isToday ? th.accent : m ? m.c + "88" : "transparent"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {m ? m.e : ""}
                </div>
                <span style={{ fontSize: 9, color: w.isToday ? th.accent : th.muted }}>{w.day}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        <Card th={th} style={{ padding: 14 }}>
          <Label th={th}>Entrées</Label>
          <p style={{ color: th.text, fontSize: 28, fontWeight: 700, margin: 0 }}>{entries.length}</p>
          <p style={{ color: th.muted, fontSize: 11, margin: "2px 0 0" }}>moments captés</p>
        </Card>
        <Card th={th} style={{ padding: 14 }}>
          <Label th={th}>Tâches</Label>
          <p style={{ color: th.accent, fontSize: 28, fontWeight: 700, margin: 0 }}>
            {tasks.filter(t => t.done).length}/{tasks.length}
          </p>
          <p style={{ color: th.muted, fontSize: 11, margin: "2px 0 0" }}>accomplies</p>
        </Card>
      </div>

      {/* Recent entries */}
      <Label th={th}>Derniers moments</Label>
      {entries.slice(0, 3).map(e => {
        const m = getMood(e.mood);
        return (
          <Card key={e.id} th={th} style={{ marginBottom: 10, borderLeft: `3px solid ${m.c}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{m.e}</span>
              <span style={{ color: th.muted, fontSize: 11 }}>{formatDate(e.date)}</span>
              <span style={{ color: th.muted, fontSize: 11, marginLeft: "auto" }}>{e.time}</span>
            </div>
            <p style={{ color: th.text, fontSize: 13, lineHeight: 1.6, margin: "0 0 6px" }}>
              {e.text.length > 95 ? e.text.slice(0, 95) + "…" : e.text}
            </p>
            {e.emojis.length > 0 && <p style={{ margin: 0, fontSize: 17 }}>{e.emojis.join(" ")}</p>}
          </Card>
        );
      })}
    </div>
  );
}

// ─── JOURNAL PAGE ─────────────────────────────────────────────────────────────

function JournalPage({ entries, setEntries, th, ff, showNew, setShowNew }) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState(4);
  const [selEmojis, setSelEmojis] = useState([]);
  const now = new Date();
  const [time, setTime] = useState(`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`);

  const toggleEmoji = (e) => {
    setSelEmojis(prev => prev.includes(e) ? prev.filter(x => x !== e) : prev.length < 5 ? [...prev, e] : prev);
  };

  const save = () => {
    if (!text.trim()) return;
    setEntries(prev => [{ id: Date.now(), date: todayStr(), time, text: text.trim(), mood, emojis: selEmojis }, ...prev]);
    setText(""); setSelEmojis([]); setMood(4); setShowNew(false);
  };

  const exportTxt = () => {
    const content = entries.map(e =>
      `━━━━━━━━━━━━━━━━━━━━\n${formatDate(e.date)} · ${e.time}\n[${getMood(e.mood).l}] ${e.emojis.join(" ")}\n\n${e.text}\n`
    ).join("\n");
    const blob = new Blob([`AURORE THE CLUB — Mon Journal\n${"═".repeat(36)}\n\n${content}`], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "aurore-journal.txt"; a.click();
  };

  return (
    <div style={{ padding: "24px 18px 110px", fontFamily: ff }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h2 style={{ color: th.text, fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, margin: 0 }}>Journal intime</h2>
          <p style={{ color: th.muted, fontSize: 12, margin: "4px 0 0" }}>{entries.length} entrée{entries.length > 1 ? "s" : ""}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn onClick={exportTxt} variant="secondary" th={th} style={{ padding: "8px 10px", fontSize: 11 }}>↑ EXPORT</Btn>
          <Btn onClick={() => setShowNew(true)} variant="primary" th={th} style={{ padding: "8px 14px", fontSize: 11 }}>+ ÉCRIRE</Btn>
        </div>
      </div>

      {/* New entry modal */}
      {showNew && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 200,
          display: "flex", alignItems: "flex-end",
        }}>
          <div style={{
            width: "100%", background: th.surface, borderRadius: "22px 22px 0 0",
            padding: "24px 20px 40px", maxHeight: "93vh", overflowY: "auto",
            border: `1px solid ${th.border}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <h3 style={{ color: th.text, fontFamily: "Georgia, serif", fontSize: 18, margin: 0 }}>Nouveau moment</h3>
              <button onClick={() => setShowNew(false)} style={{ background: "none", border: "none", color: th.muted, fontSize: 22, cursor: "pointer" }}>✕</button>
            </div>

            <Label th={th}>Humeur du moment</Label>
            <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
              {MOODS.map(m => (
                <button key={m.v} onClick={() => setMood(m.v)} style={{
                  flex: 1, padding: "11px 4px", borderRadius: 12, fontSize: 22, cursor: "pointer",
                  background: mood === m.v ? m.c + "44" : th.bg,
                  border: `2px solid ${mood === m.v ? m.c : th.border}`,
                  transition: "all 0.15s",
                }}>{m.e}</button>
              ))}
            </div>

            <Label th={th}>Heure</Label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{
              width: "100%", background: th.bg, border: `1px solid ${th.border}`,
              borderRadius: 8, padding: "10px 14px", color: th.text, fontSize: 14,
              marginBottom: 18, boxSizing: "border-box",
            }} />

            <Label th={th}>Mon moment</Label>
            <textarea
              value={text} onChange={e => setText(e.target.value)}
              placeholder="Qu'est-ce qui habite ton esprit aujourd'hui ?"
              rows={6}
              style={{
                width: "100%", background: th.bg, border: `1px solid ${th.border}`,
                borderRadius: 12, padding: "14px", color: th.text, fontSize: 14,
                resize: "none", fontFamily: ff, lineHeight: 1.7,
                boxSizing: "border-box", marginBottom: 18,
              }}
            />

            <Label th={th}>Emojis ({selEmojis.length}/5)</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 24 }}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => toggleEmoji(e)} style={{
                  background: selEmojis.includes(e) ? th.accent + "44" : th.bg,
                  border: `1px solid ${selEmojis.includes(e) ? th.accent : th.border}`,
                  borderRadius: 8, padding: "6px 8px", fontSize: 19, cursor: "pointer",
                  transition: "all 0.12s",
                }}>{e}</button>
              ))}
            </div>

            <button onClick={save} style={{
              width: "100%", background: th.accent, border: "none", borderRadius: 14,
              padding: 15, color: "#000", fontSize: 15, fontWeight: 700,
              cursor: "pointer", letterSpacing: 1,
            }}>
              SAUVEGARDER ✦
            </button>
          </div>
        </div>
      )}

      {/* Entries list */}
      {entries.length === 0 && (
        <Card th={th} style={{ textAlign: "center", padding: 44 }}>
          <p style={{ fontSize: 38, margin: "0 0 14px" }}>📖</p>
          <p style={{ color: th.muted, fontSize: 14, margin: 0 }}>Ton journal t'attend. Commence à écrire.</p>
        </Card>
      )}

      {entries.reduce((acc, e, idx) => {
        const showDate = idx === 0 || entries[idx - 1].date !== e.date;
        const m = getMood(e.mood);
        return [...acc,
          showDate ? (
            <p key={`d-${e.date}-${idx}`} style={{ color: th.muted, fontSize: 10, letterSpacing: 2, margin: "18px 0 8px" }}>
              {formatDate(e.date).toUpperCase()}
            </p>
          ) : null,
          <Card key={e.id} th={th} style={{ marginBottom: 10, borderLeft: `3px solid ${m.c}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>{m.e}</span>
              <span style={{ color: m.c, fontSize: 11, fontWeight: 600 }}>{m.l}</span>
              <span style={{ color: th.muted, fontSize: 11, marginLeft: "auto" }}>{e.time}</span>
            </div>
            <p style={{ color: th.text, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{e.text}</p>
            {e.emojis.length > 0 && <p style={{ margin: "10px 0 0", fontSize: 18 }}>{e.emojis.join(" ")}</p>}
          </Card>,
        ].filter(Boolean);
      }, [])}
    </div>
  );
}

// ─── CALENDAR PAGE ───────────────────────────────────────────────────────────

function CalendarPage({ entries, th, ff }) {
  const now = new Date();
  const [yr, setYr] = useState(now.getFullYear());
  const [mo, setMo] = useState(now.getMonth());

  const daysInMo = new Date(yr, mo + 1, 0).getDate();
  let firstDay = new Date(yr, mo, 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  const moodMap = {};
  entries.forEach(e => {
    const d = new Date(e.date + "T00:00:00");
    if (d.getFullYear() === yr && d.getMonth() === mo) moodMap[d.getDate()] = e.mood;
  });

  const prevMo = () => { if (mo === 0) { setYr(y => y-1); setMo(11); } else setMo(m => m-1); };
  const nextMo = () => { if (mo === 11) { setYr(y => y+1); setMo(0); } else setMo(m => m+1); };

  const mvals = Object.values(moodMap);
  const avg = mvals.length ? Math.round(mvals.reduce((a, b) => a + b, 0) / mvals.length) : null;

  return (
    <div style={{ padding: "24px 18px 110px", fontFamily: ff }}>
      <h2 style={{ color: th.text, fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, margin: "0 0 20px" }}>
        Calendrier émotionnel
      </h2>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button onClick={prevMo} style={{ background: th.surface, border: `1px solid ${th.border}`, borderRadius: 8, padding: "7px 16px", color: th.text, cursor: "pointer", fontSize: 16 }}>‹</button>
        <p style={{ color: th.text, fontWeight: 600, fontSize: 15, margin: 0 }}>{MONTHS[mo]} {yr}</p>
        <button onClick={nextMo} style={{ background: th.surface, border: `1px solid ${th.border}`, borderRadius: 8, padding: "7px 16px", color: th.text, cursor: "pointer", fontSize: 16 }}>›</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
        {DAYS_SHORT.map((d, i) => <div key={i} style={{ textAlign: "center", color: th.muted, fontSize: 10, letterSpacing: 1, paddingBottom: 4 }}>{d}</div>)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 20 }}>
        {[...Array(firstDay)].map((_, i) => <div key={`e${i}`} />)}
        {[...Array(daysInMo)].map((_, i) => {
          const day = i + 1;
          const m = moodMap[day] ? getMood(moodMap[day]) : null;
          const isToday = now.getFullYear() === yr && now.getMonth() === mo && now.getDate() === day;
          return (
            <div key={day} style={{
              aspectRatio: "1", borderRadius: 8,
              background: m ? m.c + "33" : th.surface,
              border: `2px solid ${isToday ? th.accent : m ? m.c + "77" : th.border}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1,
            }}>
              <span style={{ color: isToday ? th.accent : th.text, fontSize: 11, fontWeight: isToday ? 700 : 400 }}>{day}</span>
              {m && <span style={{ fontSize: 11 }}>{m.e}</span>}
            </div>
          );
        })}
      </div>

      {avg ? (
        <Card th={th} style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 14 }}>
          <MoodOrb mood={avg} size={54} animated={false} />
          <div>
            <Label th={th}>Bilan du mois</Label>
            <p style={{ color: th.text, fontSize: 13, margin: "0 0 3px" }}>
              Humeur dominante: <strong style={{ color: th.accent }}>{getMood(avg).l}</strong>
            </p>
            <p style={{ color: th.muted, fontSize: 12, margin: 0 }}>{mvals.length} entrée{mvals.length > 1 ? "s" : ""} ce mois</p>
          </div>
        </Card>
      ) : (
        <Card th={th} style={{ textAlign: "center", padding: 24 }}>
          <p style={{ color: th.muted, fontSize: 13, margin: 0 }}>Aucune entrée ce mois. Commence à écrire ✦</p>
        </Card>
      )}

      <Card th={th} style={{ marginTop: 12 }}>
        <Label th={th}>Légende des humeurs</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {MOODS.map(m => (
            <div key={m.v} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: m.c + "44", border: `2px solid ${m.c}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0,
              }}>{m.e}</div>
              <span style={{ color: th.text, fontSize: 13 }}>{m.l}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── POLAROID WALL ───────────────────────────────────────────────────────────

function PolaroidPage({ entries, th, ff }) {
  const angles = [-2, 1.5, -1.2, 2.2, -1.8, 1, -2.5, 0.8];
  return (
    <div style={{ padding: "24px 18px 110px", fontFamily: ff }}>
      <h2 style={{ color: th.text, fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>
        Mur Polaroid ✦
      </h2>
      <p style={{ color: th.muted, fontSize: 13, margin: "0 0 22px" }}>Tes moments suspendus dans le temps</p>

      {entries.length === 0 && (
        <Card th={th} style={{ textAlign: "center", padding: 44 }}>
          <p style={{ fontSize: 36, margin: "0 0 14px" }}>🌅</p>
          <p style={{ color: th.muted, fontSize: 14, margin: 0 }}>Tes polaroids t'attendent. Commence à écrire.</p>
        </Card>
      )}

      <div style={{ columns: 2, columnGap: 12 }}>
        {entries.map((e, i) => {
          const m = getMood(e.mood);
          const angle = angles[i % angles.length];
          return (
            <div key={e.id} style={{
              breakInside: "avoid", marginBottom: 14,
              background: "#FAF5EF", borderRadius: 3,
              padding: "10px 10px 30px",
              transform: `rotate(${angle}deg)`,
              boxShadow: "0 6px 28px rgba(0,0,0,0.65)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              cursor: "pointer",
            }}
            onMouseEnter={ev => { ev.currentTarget.style.transform = `rotate(0deg) scale(1.04)`; ev.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.8)"; }}
            onMouseLeave={ev => { ev.currentTarget.style.transform = `rotate(${angle}deg)`; ev.currentTarget.style.boxShadow = "0 6px 28px rgba(0,0,0,0.65)"; }}
            >
              <div style={{
                height: 92, borderRadius: 2, marginBottom: 9,
                background: `linear-gradient(135deg, ${m.c}55, ${m.c}cc)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 38,
              }}>{m.e}</div>
              <p style={{
                color: "#2A1810", fontSize: 10, lineHeight: 1.45,
                margin: "0 0 6px", fontFamily: "Georgia, serif",
              }}>
                {e.text.length > 60 ? e.text.slice(0, 60) + "…" : e.text}
              </p>
              <p style={{ color: "#AA9080", fontSize: 9, margin: 0, textAlign: "right" }}>
                {formatDate(e.date)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── TASKS PAGE ──────────────────────────────────────────────────────────────

function TasksPage({ tasks, setTasks, th, ff }) {
  const [newText, setNewText] = useState("");
  const [priority, setPriority] = useState("normale");
  const [filter, setFilter] = useState("pending");

  const add = () => {
    if (!newText.trim()) return;
    setTasks(prev => [{ id: Date.now(), text: newText.trim(), done: false, priority, date: todayStr() }, ...prev]);
    setNewText("");
  };

  const toggle = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const del = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  const filtered = tasks.filter(t => {
    if (filter === "pending") return !t.done;
    if (filter === "today") return t.date === todayStr();
    if (filter === "done") return t.done;
    return true;
  });

  const pending = tasks.filter(t => !t.done).length;
  const done = tasks.filter(t => t.done).length;

  return (
    <div style={{ padding: "24px 18px 110px", fontFamily: ff }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 style={{ color: th.text, fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, margin: 0 }}>À faire</h2>
          <p style={{ color: th.muted, fontSize: 12, margin: "4px 0 0" }}>{pending} en attente</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ color: th.accent, fontSize: 24, fontWeight: 700, margin: 0 }}>{done}</p>
          <p style={{ color: th.muted, fontSize: 9, letterSpacing: 1, margin: 0 }}>ACCOMPLIES</p>
        </div>
      </div>

      {/* Progress bar */}
      {tasks.length > 0 && (
        <div style={{ height: 4, background: th.faint, borderRadius: 2, marginBottom: 20, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 2,
            background: `linear-gradient(90deg, ${th.accent}, ${th.accentSoft})`,
            width: `${(done / tasks.length) * 100}%`,
            transition: "width 0.4s ease",
          }} />
        </div>
      )}

      {/* Add task */}
      <Card th={th} style={{ marginBottom: 18 }}>
        <input
          value={newText} onChange={e => setNewText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && add()}
          placeholder="Ajouter une intention..."
          style={{
            width: "100%", background: th.bg, border: `1px solid ${th.border}`,
            borderRadius: 8, padding: "10px 14px", color: th.text,
            fontSize: 14, marginBottom: 10, boxSizing: "border-box", fontFamily: ff,
          }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          {["haute", "normale"].map(p => (
            <button key={p} onClick={() => setPriority(p)} style={{
              flex: 1, background: priority === p ? th.accent + "33" : "transparent",
              border: `1px solid ${priority === p ? th.accent : th.border}`,
              borderRadius: 8, padding: "9px", cursor: "pointer",
              color: priority === p ? th.accent : th.muted, fontSize: 11, transition: "all 0.15s",
            }}>
              {p === "haute" ? "⚡ Haute" : "· Normale"}
            </button>
          ))}
          <button onClick={add} style={{
            background: th.accent, border: "none", borderRadius: 8,
            padding: "9px 20px", color: "#000", fontSize: 20, cursor: "pointer",
          }}>+</button>
        </div>
      </Card>

      {/* Filters */}
      <div style={{ display: "flex", gap: 7, marginBottom: 16 }}>
        {[["pending","En attente"], ["today","Aujourd'hui"], ["done","✓ Faites"], ["all","Tout"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            background: filter === v ? th.accent + "22" : "transparent",
            border: `1px solid ${filter === v ? th.accent : th.border}`,
            borderRadius: 20, padding: "5px 11px",
            color: filter === v ? th.accent : th.muted, fontSize: 10, cursor: "pointer",
          }}>{l}</button>
        ))}
      </div>

      {/* Task list */}
      {filtered.map(t => (
        <div key={t.id} style={{
          display: "flex", alignItems: "center", gap: 12,
          background: th.surface, border: `1px solid ${th.border}`,
          borderRadius: 12, padding: "13px 14px", marginBottom: 8,
          opacity: t.done ? 0.5 : 1, transition: "opacity 0.2s",
        }}>
          <button onClick={() => toggle(t.id)} style={{
            width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
            background: t.done ? th.accent : "transparent",
            border: `2px solid ${t.done ? th.accent : th.muted}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 11, color: t.done ? "#000" : "transparent",
          }}>✓</button>
          <span style={{
            flex: 1, color: th.text, fontSize: 13,
            textDecoration: t.done ? "line-through" : "none",
          }}>{t.text}</span>
          {t.priority === "haute" && !t.done && (
            <span style={{ color: th.accent, fontSize: 12 }}>⚡</span>
          )}
          <button onClick={() => del(t.id)} style={{
            background: "none", border: "none",
            color: th.faint, fontSize: 18, cursor: "pointer", lineHeight: 1,
          }}>×</button>
        </div>
      ))}

      {filtered.length === 0 && (
        <Card th={th} style={{ textAlign: "center", padding: 30 }}>
          <p style={{ color: th.muted, fontSize: 14, margin: 0 }}>
            {filter === "done" ? "Rien d'accompli encore — vas-y !" : "Aucune tâche ici ✨"}
          </p>
        </Card>
      )}
    </div>
  );
}

// ─── SETTINGS PAGE ───────────────────────────────────────────────────────────

function SettingsPage({ th, themeIdx, setThemeIdx, fontIdx, setFontIdx, entries, tasks, setLocked, pin, setPin }) {
  const [pinInput, setPinInput] = useState("");
  const [showPinForm, setShowPinForm] = useState(false);
  const [reminder, setReminder] = useState("20:00");
  const [flash, setFlash] = useState(false);

  const showSaved = () => { setFlash(true); setTimeout(() => setFlash(false), 2000); };
  const savePin = () => {
    if (pinInput.length >= 4) { setPin(pinInput); setShowPinForm(false); setPinInput(""); showSaved(); }
  };
  const exportJSON = () => {
    const data = { exportDate: new Date().toISOString(), entries, tasks };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "aurore-data.json"; a.click();
  };

  return (
    <div style={{ padding: "24px 18px 110px", fontFamily: "inherit" }}>
      <h2 style={{ color: th.text, fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, margin: "0 0 24px" }}>
        Paramètres
      </h2>

      {flash && (
        <div style={{
          background: th.accent + "33", border: `1px solid ${th.accent}`,
          borderRadius: 10, padding: "10px 16px", marginBottom: 16,
          color: th.accent, fontSize: 13, textAlign: "center",
          animation: "fadeIn 0.2s ease",
        }}>
          Sauvegardé ✓
        </div>
      )}

      {/* Themes */}
      <Label th={th}>Thème de l'application</Label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
        {THEMES.map((t, i) => (
          <button key={t.name} onClick={() => { setThemeIdx(i); showSaved(); }} style={{
            background: t.bg, border: `2px solid ${themeIdx === i ? t.accent : t.border}`,
            borderRadius: 12, padding: "12px 14px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10, transition: "border-color 0.2s",
          }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: t.accent, flexShrink: 0 }} />
            <span style={{ color: t.text, fontSize: 13 }}>{t.name}</span>
            {themeIdx === i && <span style={{ color: t.accent, marginLeft: "auto", fontSize: 14 }}>✓</span>}
          </button>
        ))}
      </div>

      {/* Fonts */}
      <Label th={th}>Police de caractères</Label>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {FONTS.map((f, i) => (
          <button key={f.name} onClick={() => { setFontIdx(i); showSaved(); }} style={{
            flex: 1, background: fontIdx === i ? th.accent + "22" : th.surface,
            border: `1px solid ${fontIdx === i ? th.accent : th.border}`,
            borderRadius: 10, padding: "11px 6px",
            color: fontIdx === i ? th.accent : th.muted,
            fontSize: 12, cursor: "pointer", fontFamily: f.family,
            transition: "all 0.15s",
          }}>{f.name}</button>
        ))}
      </div>

      {/* Reminder */}
      <Label th={th}>Rappel quotidien</Label>
      <Card th={th} style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 22 }}>🔔</span>
        <input type="time" value={reminder} onChange={e => setReminder(e.target.value)} style={{
          flex: 1, background: th.bg, border: `1px solid ${th.border}`,
          borderRadius: 8, padding: "9px 12px", color: th.text, fontSize: 14,
        }} />
        <Btn onClick={showSaved} variant="primary" th={th} style={{ padding: "9px 14px", fontSize: 12 }}>Sauver</Btn>
      </Card>

      {/* Privacy */}
      <Label th={th}>Confidentialité</Label>
      <Card th={th} style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showPinForm ? 16 : 0 }}>
          <div>
            <p style={{ color: th.text, fontSize: 14, margin: 0 }}>Verrouillage par code PIN</p>
            <p style={{ color: th.muted, fontSize: 11, margin: "3px 0 0" }}>
              {pin ? "🔒 Code actif" : "Non configuré"}
            </p>
          </div>
          <Btn onClick={() => setShowPinForm(!showPinForm)} variant="ghost" th={th} style={{ fontSize: 11, padding: "7px 12px" }}>
            {pin ? "Modifier" : "Activer"}
          </Btn>
        </div>
        {showPinForm && (
          <>
            <input
              type="password" placeholder="Code PIN (min. 4 chiffres)"
              value={pinInput} onChange={e => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
              style={{
                width: "100%", background: th.bg, border: `1px solid ${th.border}`,
                borderRadius: 8, padding: "11px", color: th.text,
                fontSize: 22, letterSpacing: 10, textAlign: "center",
                boxSizing: "border-box", marginBottom: 10,
              }}
            />
            <Btn onClick={savePin} variant="primary" th={th} style={{ width: "100%", padding: "11px", fontSize: 14 }}>
              Confirmer le code
            </Btn>
          </>
        )}
        {pin && (
          <button onClick={() => setLocked(true)} style={{
            background: "none", border: `1px solid ${th.border}`,
            borderRadius: 8, padding: "8px 16px", color: th.muted,
            fontSize: 12, cursor: "pointer", marginTop: 12, width: "100%",
          }}>
            🔒 Verrouiller l'application maintenant
          </button>
        )}
      </Card>

      {/* Export */}
      <Label th={th}>Exporter mes données</Label>
      <div style={{ display: "flex", gap: 10, marginBottom: 40 }}>
        <button onClick={exportJSON} style={{
          flex: 1, background: th.surface, border: `1px solid ${th.border}`,
          borderRadius: 12, padding: "13px", color: th.text, fontSize: 13, cursor: "pointer",
        }}>📦 Exporter en JSON</button>
      </div>

      {/* Branding */}
      <div style={{ textAlign: "center", paddingTop: 10 }}>
        <p style={{ color: th.accent, fontFamily: "Georgia, serif", fontSize: 16, letterSpacing: 5, margin: "0 0 4px" }}>AURORE</p>
        <p style={{ color: th.muted, fontSize: 10, letterSpacing: 4, margin: "0 0 8px" }}>THE CLUB · v1.0</p>
        <p style={{ color: th.faint, fontSize: 10, margin: 0 }}>
          Projet de Marketing Digital
        </p>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function AuroreApp() {
  const [splash, setSplash] = useState(true);
  const [page, setPage] = useState("home");
  const [themeIdx, setThemeIdx] = useState(0);
  const [fontIdx, setFontIdx] = useState(0);
  const [entries, setEntries] = useState(SAMPLE_ENTRIES);
  const [tasks, setTasks] = useState(SAMPLE_TASKS);
  const [currentMood, setCurrentMood] = useState(4);
  const [showNew, setShowNew] = useState(false);
  const [locked, setLocked] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  const th = THEMES[themeIdx];
  const ff = FONTS[fontIdx].family;

  // Dismiss splash after 2.8s
  if (splash) {
    setTimeout(() => setSplash(false), 2800);
    return (
      <div style={{ background: th.bg, minHeight: "100vh", fontFamily: ff }}>
        <style>{`
          @keyframes orbPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.07);opacity:.88} }
          @keyframes splashFade { 0%{opacity:0;transform:translateY(20px)} 30%{opacity:1;transform:translateY(0)} 80%{opacity:1} 100%{opacity:0} }
          @keyframes fadeIn { from{opacity:0} to{opacity:1} }
          *{-webkit-tap-highlight-color:transparent;box-sizing:border-box}
          ::-webkit-scrollbar{width:0}
          input,textarea{outline:none}
        `}</style>
        <SplashScreen th={th} />
      </div>
    );
  }

  if (locked && pin) {
    return (
      <div style={{ background: th.bg, fontFamily: ff }}>
        <style>{`@keyframes orbPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}`}</style>
        <LockScreen th={th} error={pinError} onUnlock={(p) => {
          if (p === pin) { setLocked(false); setPinError(false); }
          else setPinError(true);
        }} />
      </div>
    );
  }

  const nav = [
    { id: "home",     icon: "☀️", label: "Accueil"    },
    { id: "journal",  icon: "📖", label: "Journal"    },
    { id: "calendar", icon: "🗓",  label: "Calendrier" },
    { id: "wall",     icon: "🌅", label: "Polaroid"   },
    { id: "tasks",    icon: "✓",  label: "À faire"    },
    { id: "settings", icon: "⚙",  label: "Réglages"   },
  ];

  return (
    <div style={{ background: th.bg, minHeight: "100vh", fontFamily: ff, color: th.text }}>
      <style>{`
        @keyframes orbPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.07);opacity:.88} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        *{-webkit-tap-highlight-color:transparent;box-sizing:border-box}
        ::-webkit-scrollbar{width:0;background:transparent}
        input,textarea,select{outline:none}
      `}</style>

      <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh" }}>
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          {page === "home" && (
            <HomePage
              entries={entries} tasks={tasks} th={th} ff={ff}
              currentMood={currentMood} setCurrentMood={setCurrentMood}
              onNewEntry={() => { setShowNew(true); setPage("journal"); }}
            />
          )}
          {page === "journal" && (
            <JournalPage
              entries={entries} setEntries={setEntries} th={th} ff={ff}
              showNew={showNew} setShowNew={setShowNew}
            />
          )}
          {page === "calendar" && <CalendarPage entries={entries} th={th} ff={ff} />}
          {page === "wall"     && <PolaroidPage entries={entries} th={th} ff={ff} />}
          {page === "tasks"    && <TasksPage tasks={tasks} setTasks={setTasks} th={th} ff={ff} />}
          {page === "settings" && (
            <SettingsPage
              th={th} themeIdx={themeIdx} setThemeIdx={setThemeIdx}
              fontIdx={fontIdx} setFontIdx={setFontIdx}
              entries={entries} tasks={tasks}
              setLocked={setLocked} pin={pin} setPin={setPin}
            />
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        background: th.surface + "F0",
        backdropFilter: "blur(16px)",
        borderTop: `1px solid ${th.border}`,
        display: "flex", justifyContent: "space-around",
        padding: "8px 2px 18px",
        zIndex: 100,
      }}>
        {nav.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              padding: "4px 6px", color: active ? th.accent : th.muted,
              transition: "color 0.2s",
              position: "relative",
            }}>
              {active && (
                <div style={{
                  position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                  width: 20, height: 2, borderRadius: 1,
                  background: th.accent,
                }} />
              )}
              <span style={{ fontSize: active ? 22 : 19, transition: "font-size 0.2s" }}>{n.icon}</span>
              <span style={{ fontSize: 8, letterSpacing: 0.5, fontWeight: active ? 700 : 400 }}>
                {n.label.toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
