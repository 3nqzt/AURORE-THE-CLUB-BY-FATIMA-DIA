import { useState, useEffect, useRef, lazy, Suspense } from "react";
import Landing from "./Landing.jsx";

// Leaflet map UI is code-split into ./maps.jsx and loaded on demand, so the
// map library stays out of the initial bundle.
const MapPage = lazy(() => import("./maps.jsx").then(m => ({ default: m.MapPage })));
const LocationPicker = lazy(() => import("./maps.jsx").then(m => ({ default: m.LocationPicker })));

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const MOODS = [
  { v: 1, e: "😢", l: "Triste",        c: "#4A6FA5" },
  { v: 2, e: "😔", l: "Mélancolique",  c: "#8B6F8E" },
  { v: 3, e: "😐", l: "Neutre",        c: "#8A9E7D" },
  { v: 4, e: "😊", l: "Joyeux(se)",    c: "#C4813A" },
  { v: 5, e: "✨", l: "Radieux(se)",   c: "#E8B060" },
];

const THEMES = [
  // Sunset over Dakar — warm coral on deep warm-charcoal.
  { name:"Aurore",     bg:"#0E0A09", surface:"#1B1512", border:"#2C221C", accent:"#E0764A", accentSoft:"#F2B488", text:"#F7EEE4", muted:"#AB9786", faint:"#3A2C24" },
  // Blue hour — twilight rose over indigo night (the cabana at dusk).
  { name:"Crépuscule", bg:"#0C0A16", surface:"#171228", border:"#26203E", accent:"#CE6F94", accentSoft:"#EBAAC6", text:"#F1E8F3", muted:"#9C88A8", faint:"#2C2348" },
  // Sahara — warm sand and gold.
  { name:"Sahara",     bg:"#13100A", surface:"#211A0F", border:"#352A14", accent:"#D9A441", accentSoft:"#F0CE84", text:"#FBF3E2", muted:"#A89360", faint:"#4A3A16" },
  // Lagon — ocean teal under a warm sky.
  { name:"Lagon",      bg:"#04111B", surface:"#0A2130", border:"#143447", accent:"#2E9BB5", accentSoft:"#86D2E0", text:"#E3F3F8", muted:"#6F9AAB", faint:"#103447" },
  // Plein jour — light, warm daytime (golden hour on sand). The only light theme.
  { name:"Plein jour", light:true, bg:"#FBF3E9", surface:"#FFFFFF", border:"#ECDDC9", accent:"#CC5E2A", accentSoft:"#EFAD7A", text:"#2B1E14", muted:"#8A7560", faint:"#E0CDB6" },
];

const FONTS = [
  { name:"Sérif",  family:"Georgia, serif" },
  { name:"Inter",  family:"'Inter', system-ui, sans-serif" },
  { name:"Mono",   family:"'Courier New', monospace" },
];

// Editorial display serif for the AURORE wordmark & headings (loaded in
// index.html). Falls back to Georgia, then a generic serif.
const HEAD_FONT = "'Fraunces', Georgia, serif";

const EMOJIS = ["✨","💪","🌙","🌊","🎨","📚","🌸","💛","🫶","🌿","☀️","🌧️","🫖","🎵","💭","🔥","🌺","🦋","🌴","🎯"];

const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

// Localised weekday names. Index matches Date.getDay() (0 = Sunday).
// Wolof weekday names: Dibéer, Altine, Talaata, Àllarba, Alxames, Àjjuma, Gaawu.
const DAYS_FULL = {
  fr: ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],
  wo: ["Dibéer","Altine","Talaata","Àllarba","Alxames","Àjjuma","Gaawu"],
};
const DAYS_3 = {
  fr: ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"],
  wo: ["Dib","Alt","Tal","Àll","Alx","Àjj","Gaa"],
};
// Calendar column headers, Monday-first.
const CAL_DAYS = {
  fr: ["L","M","M","J","V","S","D"],
  wo: ["At","Ta","Àl","Ax","Àj","Ga","Di"],
};

// ─── I18N ─────────────────────────────────────────────────────────────────────
// NOTE: The Wolof (wo) translations below are a FIRST DRAFT. Wolof is an
// under-resourced language, so they should be proofread by a native speaker
// before submission. French (fr) is the reference; missing keys fall back to it.

const LANGS = [
  { id: "fr", label: "Français" },
  { id: "wo", label: "Wolof" },
];

const STRINGS = {
  fr: {
    club: "THE CLUB",
    loading: "Chargement de ton espace…",
    lock_enter: "Entre ton code PIN",
    lock_wrong: "Code incorrect — réessaie",
    close: "Fermer", delete: "Supprimer",
    prev_month: "Mois précédent", next_month: "Mois suivant",
    lock_backspace: "Effacer le dernier chiffre",

    nav_home: "Accueil", nav_journal: "Journal", nav_calendar: "Calendrier",
    nav_map: "Carte", nav_wall: "Polaroid", nav_tasks: "À faire", nav_settings: "Réglages",

    map_title: "Carte AURORE",
    map_sub: "Retrace les lieux de ton parcours",
    map_empty: "Aucun lieu encore. Ajoute une position à tes moments.",
    location_label: "Lieu",
    location_hint: "Touche la carte ou utilise ta position",
    add_location: "Ajouter un lieu",
    location_name_ph: "Nom du lieu (optionnel)",
    use_my_location: "📍 Ma position",
    location_remove: "Retirer le lieu",
    geo_unsupported: "Géolocalisation non supportée",
    geo_denied: "Position indisponible ou refusée",
    places_word: "lieux",

    mood_1: "Triste", mood_2: "Mélancolique", mood_3: "Neutre", mood_4: "Joyeux(se)", mood_5: "Radieux(se)",

    home_howfeel: "Comment te sens-tu aujourd'hui ?",
    home_affirmation: "Affirmation du jour",
    home_week: "Semaine en humeurs",
    home_entries: "Entrées", home_entries_sub: "moments captés",
    home_tasks: "Tâches", home_tasks_sub: "accomplies",
    home_recent: "Derniers moments",

    journal_title: "Journal intime",
    entries_word: "entrées", entry_word: "entrée",
    export_btn: "EXPORT", write_btn: "ÉCRIRE",
    new_moment: "Nouveau moment",
    mood_now: "Humeur du moment",
    hour: "Heure",
    my_moment: "Mon moment",
    moment_placeholder: "Qu'est-ce qui habite ton esprit aujourd'hui ?",
    emojis_label: "Emojis",
    photo_label: "Photo / création",
    add_photo: "Ajouter une photo",
    remove_photo: "Retirer",
    timeline_label: "Au fil de la journée",
    timeline_hint: "Note ton humeur à différents moments",
    save: "SAUVEGARDER",
    journal_empty: "Ton journal t'attend. Commence à écrire.",
    search_label: "Rechercher",
    search_placeholder: "Mot-clé dans mes entrées…",
    search_clear: "Effacer",
    search_none: "Aucune entrée ne correspond à ta recherche.",

    cal_title: "Calendrier émotionnel",
    cal_summary: "Bilan du mois",
    cal_dominant: "Humeur dominante",
    this_month: "ce mois",
    cal_none: "Aucune entrée ce mois. Commence à écrire ✦",
    legend: "Légende des humeurs",

    wall_title: "Mur Polaroid",
    wall_sub: "Tes moments suspendus dans le temps",
    wall_empty: "Tes polaroids t'attendent. Commence à écrire.",

    tasks_title: "À faire",
    tasks_pending: "en attente",
    tasks_done_caps: "ACCOMPLIES",
    task_placeholder: "Ajouter une intention…",
    prio_high: "⚡ Haute", prio_normal: "· Normale",
    filter_pending: "En attente", filter_today: "Aujourd'hui", filter_done: "✓ Faites", filter_all: "Tout",
    tasks_empty_done: "Rien d'accompli encore — vas-y !",
    tasks_empty: "Aucune tâche ici ✨",

    settings_title: "Paramètres",
    saved: "Sauvegardé ✓",
    lang_label: "Langue",
    theme_label: "Thème de l'application",
    font_label: "Police de caractères",
    reminder_label: "Rappel",
    reminder_daily: "Chaque jour", reminder_hourly: "Chaque heure",
    reminder_enable: "Activer les notifications",
    reminder_on: "Notifications activées ✓",
    reminder_denied: "Notifications bloquées par le navigateur",
    reminder_unsupported: "Notifications non supportées par ce navigateur",
    reminder_hint: "Les rappels s'affichent tant que l'application est ouverte.",
    reminder_body: "C'est l'heure de prendre un moment pour toi ✦",
    privacy_label: "Confidentialité",
    pin_title: "Verrouillage par code PIN",
    pin_active: "🔒 Code actif", pin_none: "Non configuré",
    modify: "Modifier", activate: "Activer",
    pin_placeholder: "Code PIN (min. 4 chiffres)",
    pin_confirm: "Confirmer le code",
    lock_now: "🔒 Verrouiller l'application maintenant",
    export_label: "Exporter mes données",
    export_json: "📦 Exporter en JSON",
    export_journal_header: "AURORE THE CLUB — Mon Journal",
    project_credit: "Projet de Marketing Digital",

    theme_0: "Aurore", theme_1: "Crépuscule", theme_2: "Sahara", theme_3: "Lagon", theme_4: "Plein jour",
  },
  wo: {
    club: "THE CLUB",
    loading: "Sa espace mu ngi ñëw…",
    lock_enter: "Dugalal sa code PIN",
    lock_wrong: "Code bi baaxul — jéemaat",
    close: "Tëj", delete: "Far",
    prev_month: "Weer wu jiitu", next_month: "Weer wu topp",
    lock_backspace: "Far chiffre bu mujj bi",

    nav_home: "Kër", nav_journal: "Surnaal", nav_calendar: "Arminaat",
    nav_map: "Kàrt", nav_wall: "Polaroid", nav_tasks: "Liggéey", nav_settings: "Tànneef",

    map_title: "Kàrtu AURORE",
    map_sub: "Wéyal bérab yi nga jaar",
    map_empty: "Amul bérab ba leegi. Yokk sa bérab ci sa saa yi.",
    location_label: "Bérab",
    location_hint: "Laalal kàrt bi walla jëfandikoo sa bérab",
    add_location: "Yokk bérab",
    location_name_ph: "Turu bérab bi (su soobee)",
    use_my_location: "📍 Sama bérab",
    location_remove: "Dindi bérab bi",
    geo_unsupported: "Géolocalisation amul",
    geo_denied: "Bérab bi amul walla ñu ko bañ",
    places_word: "bérab",

    mood_1: "Naqar", mood_2: "Jaxle", mood_3: "Ci digg", mood_4: "Bég", mood_5: "Melax",

    home_howfeel: "No yeggé sa yaram bi tey ?",
    home_affirmation: "Wax ju am solo bu bés bi",
    home_week: "Ayubés ci xel yi",
    home_entries: "Mbind yi", home_entries_sub: "saa yu ñu jot",
    home_tasks: "Liggéey", home_tasks_sub: "ñu def",
    home_recent: "Saa yi mujj",

    journal_title: "Sama téere",
    entries_word: "mbind", entry_word: "mbind",
    export_btn: "GÉNNE", write_btn: "BIND",
    new_moment: "Saa bu bees",
    mood_now: "Xel ci saa si",
    hour: "Waxtu",
    my_moment: "Sama saa",
    moment_placeholder: "Lan moo nekk ci sa xel tey ?",
    emojis_label: "Emoji yi",
    photo_label: "Nataal / liggéey",
    add_photo: "Yokk nataal",
    remove_photo: "Dindi",
    timeline_label: "Yoonu bés bi",
    timeline_hint: "Bind sa xel ci jamono yu wuute",
    save: "DENC",
    journal_empty: "Sa téere mu ngi lay xaar. Tàmbalee bind.",
    search_label: "Seet",
    search_placeholder: "Baat ci sama mbind yi…",
    search_clear: "Dindi",
    search_none: "Amul mbind mu dëppoo ak sa wut bi.",

    cal_title: "Arminaatu xel mi",
    cal_summary: "Seetlu weer wi",
    cal_dominant: "Xel mi ëpp",
    this_month: "ci weer wi",
    cal_none: "Amul mbind ci weer wi. Tàmbalee bind ✦",
    legend: "Tekki xel yi",

    wall_title: "Miiru Polaroid",
    wall_sub: "Sa saa yi ci jamono ji",
    wall_empty: "Sa polaroid yi ñu ngi lay xaar. Tàmbalee bind.",

    tasks_title: "Lu war a def",
    tasks_pending: "ci xaar",
    tasks_done_caps: "ÑU DEF",
    task_placeholder: "Yokk benn liggéey…",
    prio_high: "⚡DEY DAW REK AMUUL ARRET", prio_normal: "· Normaal",
    filter_pending: "Ci xaar", filter_today: "Tey", filter_done: "✓ Ñu def", filter_all: "Lépp",
    tasks_empty_done: "Dara defaruwul ba leegi — demaal !",
    tasks_empty: "Amul liggéey fii ✨",

    settings_title: "Tànneef yi",
    saved: "Denc na ✓",
    lang_label: "Làkk",
    theme_label: "Melokaanu app bi",
    font_label: "Araf yi",
    reminder_label: "Fattali",
    reminder_daily: "Bés bu nekk", reminder_hourly: "Waxtu wu nekk",
    reminder_enable: "Ubbi yéene yi",
    reminder_on: "Yéeyne yi ubbiku nañu ✓",
    reminder_denied: "Navigateur bi tëj na yéene yi",
    reminder_unsupported: "Navigateur bii nanguwul yéeyne yi",
    reminder_hint: "Fattali yi dañuy feeñ bu app bi ubbiku.",
    reminder_body: "Jot na ngir jël saa ngir sa bopp ✦",
    privacy_label: "Sutura",
    pin_title: "Tëj ak code PIN",
    pin_active: "🔒 Code bi dox na", pin_none: "Defaruwul",
    modify: "Soppi", activate: "Ubbi",
    pin_placeholder: "Codd PIN (4 sifr ci suuf)",
    pin_confirm: "Wooral code bi",
    lock_now: "🔒 Tëj app bi journal",
    export_label: "Génne sama xibaar",
    export_json: "📦 Génne ci JSON",
    export_journal_header: "AURORE THE CLUB — Sama joural",
    project_credit: "Liggéeyu Marketing Digital",

    theme_0: "Njël", theme_1: "Timis", theme_2: "Sahara", theme_3: "Géej", theme_4: "Bëccëg",
  },
};

const QUOTES = {
  fr: [
    "Chaque matin est une nouvelle chance de devenir qui tu veux être.",
    "Ta seule concurrence, c'est toi d'hier.",
    "La discipline est la forme la plus haute d'amour propre.",
    "Ce que tu ressens est valide. Ce que tu fais de ce ressenti, c'est ton pouvoir.",
    "Dakar te regarde grandir. Grandis avec intention.",
    "Tu n'es pas en retard. Tu es exactement là où tu dois être.",
    "La version de toi d'aujourd'hui mérite autant de soin que celle de demain.",
  ],
  // First-draft Wolof — to be proofread by a native speaker.
  wo: [
    "Suba bu nekk, mooy yoon bu bees ngir nekk ki nga bëgga nekk.",
    "Sa kenn ku ngay àndandoo, mooy yaw bu démb.",
    "Yaru sa bopp mooy mbëggeel gi gën a kawe ci sa bopp.",
    "Li ngay yég dëgg la. Li nga ko def, mooy sa doole.",
    "Ndakaaru mu ngi lay seetaan yokku. Màggal ak pexe.",
    "Yereekuloo. Yaa nga ci bérab bi nga war a nekk.",
    "Yaw bu tey, war nga la topptoo ni yaw bu ëllëg.",
  ],
};

const SAMPLE_ENTRIES = [
  { id:1, date:"2025-06-22", time:"08:30", text:"Belle journée productive. Mon projet prend forme et je suis fière du chemin parcouru. Aurore the club m'a vraiment aidée à me recentrer sur l'essentiel.", mood:5, emojis:["✨","💪"], timeline:[{time:"08:00",mood:3},{time:"12:30",mood:4},{time:"18:00",mood:5}], place:{lat:14.6708,lng:-17.4381,label:"Place de l'Indépendance, Plateau"} },
  { id:2, date:"2025-06-21", time:"21:15", text:"Un peu de mélancolie ce soir. Mais la pluie sur Dakar a quelque chose de poétique. Je me suis assise près de la fenêtre et j'ai réfléchi longuement.", mood:2, emojis:["🌧️","🫖"], place:{lat:14.6900,lng:-17.4620,label:"Corniche Ouest"} },
  { id:3, date:"2025-06-19", time:"10:00", text:"Atelier créatif ce matin. J'ai retrouvé cette joie d'enfant quand on crée sans raison. Peinture, musique, rires — exactement ce dont j'avais besoin.", mood:4, emojis:["🎨","💛"], place:{lat:14.6831,lng:-17.4631,label:"UCAD, Dakar"} },
  { id:4, date:"2025-06-17", time:"19:45", text:"Journée neutre. Ni haute ni basse, juste présente. Et parfois, la présence c'est déjà beaucoup.", mood:3, emojis:["🌿"] },
  { id:5, date:"2025-06-15", time:"07:00", text:"Le picnic du club hier soir était magique. Ces personnes me donnent de l'énergie et me rappellent pourquoi je veux grandir.", mood:5, emojis:["🌴","🌸","🫶"], place:{lat:14.7497,lng:-17.5136,label:"Plage des Almadies"} },
  { id:6, date:"2025-06-12", time:"22:00", text:"Fatiguée mais en paix. J'ai lu 30 pages, médité 10 minutes. Petites victoires.", mood:3, emojis:["📚","🌙"], place:{lat:14.7167,lng:-17.4877,label:"Ouakam"} },
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
const formatDate = (ds, lang = "fr") => {
  const d = new Date(ds + "T00:00:00");
  const days = DAYS_3[lang] || DAYS_3.fr;
  return `${days[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)}`;
};
const makeT = (lang) => (key) => {
  const table = STRINGS[lang] || STRINGS.fr;
  return table[key] != null ? table[key] : (STRINGS.fr[key] != null ? STRINGS.fr[key] : key);
};
// Count + word, e.g. "3 entrées" / "3 mbind".
const countLabel = (n, lang, t) =>
  lang === "fr" ? `${n} ${n > 1 ? t("entries_word") : t("entry_word")}` : `${n} ${t("entries_word")}`;

// Read a downscaled JPEG data URL from an image File, so photos don't blow the
// localStorage quota. Returns a Promise<string>.
const fileToResizedDataURL = (file, maxDim = 900, quality = 0.72) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width >= height && width > maxDim) { height = Math.round(height * maxDim / width); width = maxDim; }
        else if (height > width && height > maxDim) { width = Math.round(width * maxDim / height); height = maxDim; }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

// ─── PERSISTENCE ──────────────────────────────────────────────────────────────

const STORAGE_PREFIX = "aurore:";

const readStored = (key, fallback) => {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw != null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

// useState that mirrors its value to localStorage (no-ops if storage is
// unavailable, e.g. private browsing or quota exceeded).
function usePersistentState(key, initial) {
  const [state, setState] = useState(() => readStored(key, initial));
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(state));
    } catch {
      /* storage full or disabled — keep working in-memory */
    }
  }, [key, state]);
  return [state, setState];
}

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

// Horizontal mood timeline for a single day (read-only display).
function MoodTimeline({ timeline, th }) {
  if (!timeline || timeline.length === 0) return null;
  const pts = [...timeline].sort((a, b) => a.time.localeCompare(b.time));
  return (
    <div style={{ display: "flex", alignItems: "flex-start", marginTop: 12, overflowX: "auto", paddingBottom: 2 }}>
      {pts.map((p, i) => {
        const m = getMood(p.mood);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, minWidth: 42 }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: m.c + "44", border: `2px solid ${m.c}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
              }}>{m.e}</div>
              <span style={{ fontSize: 9, color: th.muted }}>{p.time}</span>
            </div>
            {i < pts.length - 1 && <div style={{ width: 16, height: 2, background: th.border, marginTop: 12 }} />}
          </div>
        );
      })}
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

// Soft sunset/horizon glow rendered behind the app — evokes a Dakar sunset.
function SunsetGlow({ th, variant = "ambient" }) {
  const bg = variant === "splash"
    ? `radial-gradient(85% 46% at 50% 45%, ${th.accent}55, ${th.accent}14 38%, transparent 64%)`
    : `radial-gradient(140% 52% at 50% -8%, ${th.accent}2E, ${th.accent}0A 42%, transparent 70%)`;
  return <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: bg }} />;
}

// ─── SPLASH SCREEN ───────────────────────────────────────────────────────────

function SplashScreen({ th, t }) {
  return (
    <div style={{
      minHeight: "100vh", background: th.bg, position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      animation: "splashFade 2.5s ease-in-out",
    }}>
      <SunsetGlow th={th} variant="splash" />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <MoodOrb mood={4} size={130} animated={true} />
        {/* horizon line under the "sun" */}
        <div style={{
          width: 200, height: 1, marginTop: 26,
          background: `linear-gradient(90deg, transparent, ${th.accentSoft}88, transparent)`,
        }} />
        <div style={{ textAlign: "center", marginTop: 26 }}>
          <p style={{ color: th.accent, fontFamily: HEAD_FONT, fontSize: 34, letterSpacing: 8, margin: "0 0 4px", fontWeight: 600 }}>
            AURORE
          </p>
          <p style={{ color: th.muted, fontSize: 11, letterSpacing: 5, margin: 0 }}>{t("club")}</p>
        </div>
        <p style={{ color: th.faint, fontSize: 12, marginTop: 44, letterSpacing: 2, fontStyle: "italic" }}>
          {t("loading")}
        </p>
      </div>
    </div>
  );
}

// ─── LOCK SCREEN ─────────────────────────────────────────────────────────────

function LockScreen({ onUnlock, error, th, t }) {
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
      <p style={{ color: th.accent, fontFamily: HEAD_FONT, fontSize: 22, letterSpacing: 4, margin: "0 0 4px" }}>AURORE</p>
      <p style={{ color: th.muted, fontSize: 10, letterSpacing: 4, margin: "0 0 40px" }}>{t("club")}</p>
      <MoodOrb mood={4} size={72} animated={true} />
      <p style={{ color: error ? "#E05050" : th.muted, fontSize: 13, margin: "28px 0 16px", transition: "color 0.2s" }}>
        {error ? t("lock_wrong") : t("lock_enter")}
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
            disabled={d === ""}
            aria-hidden={d === "" ? true : undefined}
            aria-label={d === "⌫" ? t("lock_backspace") : undefined}
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

function HomePage({ entries, tasks, th, ff, lang, t, currentMood, setCurrentMood, onNewEntry, onExitToLanding }) {
  const today = todayStr();
  const quoteList = QUOTES[lang] || QUOTES.fr;
  const quote = quoteList[new Date().getDate() % quoteList.length];
  const headerWeekday = (DAYS_FULL[lang] || DAYS_FULL.fr)[new Date().getDay()].toUpperCase();
  const week = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().split("T")[0];
    const entry = entries.find(e => e.date === ds);
    return { ds, mood: entry?.mood, day: (DAYS_3[lang] || DAYS_3.fr)[d.getDay()].slice(0,1), isToday: ds === today };
  });

  return (
    <div style={{ padding: "24px 18px 110px", fontFamily: ff }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <p style={{ color: th.muted, fontSize: 10, letterSpacing: 3, margin: "0 0 3px" }}>
            {headerWeekday} · {new Date().getDate()} {MONTHS[new Date().getMonth()].toUpperCase()}
          </p>
          <button onClick={onExitToLanding} aria-label="Retour à l'accueil du site" style={{
            background: "none", border: "none", padding: 0, cursor: "pointer", display: "block",
            color: th.accent, fontFamily: HEAD_FONT, fontSize: 26, fontWeight: 700, letterSpacing: 3,
          }}>AURORE</button>
          <p style={{ color: th.muted, fontSize: 9, letterSpacing: 5, margin: "2px 0 0" }}>{t("club")}</p>
        </div>
        <button onClick={onNewEntry} aria-label={t("new_moment")} style={{
          width: 48, height: 48, borderRadius: "50%",
          background: `linear-gradient(140deg, ${th.accentSoft}, ${th.accent})`,
          border: "none", color: "#fff", fontSize: 22, cursor: "pointer",
          boxShadow: `0 6px 26px ${th.accent}66`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>+</button>
      </div>

      {/* Mood card */}
      <Card th={th} style={{ textAlign: "center", padding: "30px 20px", marginBottom: 14 }}>
        <Label th={th}>{t("home_howfeel")}</Label>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <MoodOrb mood={currentMood} size={110} animated={true} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 10 }}>
          {MOODS.map(m => (
            <button key={m.v} onClick={() => setCurrentMood(m.v)} aria-label={t(`mood_${m.v}`)} aria-pressed={currentMood === m.v} style={{
              width: 44, height: 44, borderRadius: "50%", fontSize: 20, cursor: "pointer",
              background: currentMood === m.v ? m.c + "44" : "transparent",
              border: `2px solid ${currentMood === m.v ? m.c : "transparent"}`,
              transition: "all 0.2s",
            }}>{m.e}</button>
          ))}
        </div>
        <p style={{ color: getMood(currentMood).c, fontSize: 12, margin: 0, fontStyle: "italic", letterSpacing: 1 }}>
          {t(`mood_${currentMood}`)}
        </p>
      </Card>

      {/* Quote */}
      <Card th={th} style={{ marginBottom: 14, borderLeft: `3px solid ${th.accent}`, paddingLeft: 16 }}>
        <Label th={th}>{t("home_affirmation")}</Label>
        <p style={{ color: th.text, fontSize: 14, fontStyle: "italic", lineHeight: 1.7, margin: 0, fontFamily: HEAD_FONT }}>
          "{quote}"
        </p>
      </Card>

      {/* Week strip */}
      <Card th={th} style={{ marginBottom: 14 }}>
        <Label th={th}>{t("home_week")}</Label>
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
          <Label th={th}>{t("home_entries")}</Label>
          <p style={{ color: th.text, fontSize: 28, fontWeight: 700, margin: 0 }}>{entries.length}</p>
          <p style={{ color: th.muted, fontSize: 11, margin: "2px 0 0" }}>{t("home_entries_sub")}</p>
        </Card>
        <Card th={th} style={{ padding: 14 }}>
          <Label th={th}>{t("home_tasks")}</Label>
          <p style={{ color: th.accent, fontSize: 28, fontWeight: 700, margin: 0 }}>
            {tasks.filter(t => t.done).length}/{tasks.length}
          </p>
          <p style={{ color: th.muted, fontSize: 11, margin: "2px 0 0" }}>{t("home_tasks_sub")}</p>
        </Card>
      </div>

      {/* Recent entries */}
      <Label th={th}>{t("home_recent")}</Label>
      {entries.slice(0, 3).map(e => {
        const m = getMood(e.mood);
        return (
          <Card key={e.id} th={th} style={{ marginBottom: 10, borderLeft: `3px solid ${m.c}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{m.e}</span>
              <span style={{ color: th.muted, fontSize: 11 }}>{formatDate(e.date, lang)}</span>
              <span style={{ color: th.muted, fontSize: 11, marginLeft: "auto" }}>{e.time}</span>
            </div>
            {e.photo && (
              <img src={e.photo} alt="" loading="lazy" decoding="async" style={{ width: "100%", maxHeight: 150, objectFit: "cover", borderRadius: 10, marginBottom: 8 }} />
            )}
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

function JournalPage({ entries, setEntries, th, ff, lang, t, showNew, setShowNew }) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState(4);
  const [selEmojis, setSelEmojis] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const fileRef = useRef(null);
  const now = new Date();
  const nowHHMM = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  const [time, setTime] = useState(nowHHMM);

  // Intra-day mood timeline (for the entry being written)
  const [timeline, setTimeline] = useState([]);
  const [tlTime, setTlTime] = useState(nowHHMM);
  const [tlMood, setTlMood] = useState(3);

  // Location for this entry
  const [place, setPlace] = useState(null);
  const [showLoc, setShowLoc] = useState(false);
  const [locKey, setLocKey] = useState(0); // bump to re-centre the picker
  const [geoErr, setGeoErr] = useState("");

  // Search by date + keyword
  const [searchDate, setSearchDate] = useState("");
  const [searchText, setSearchText] = useState("");

  const toggleEmoji = (e) => {
    setSelEmojis(prev => prev.includes(e) ? prev.filter(x => x !== e) : prev.length < 5 ? [...prev, e] : prev);
  };

  const onPickPhoto = async (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    setPhotoBusy(true);
    try { setPhoto(await fileToResizedDataURL(file)); }
    catch { /* ignore unreadable image */ }
    finally { setPhotoBusy(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const addTl = () => {
    if (!tlTime) return;
    setTimeline(prev => [...prev, { time: tlTime, mood: tlMood }].sort((a, b) => a.time.localeCompare(b.time)));
  };
  const removeTl = (i) => setTimeline(prev => prev.filter((_, idx) => idx !== i));

  const useMyLocation = () => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) { setGeoErr(t("geo_unsupported")); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setPlace(p => ({ ...(p || {}), lat: pos.coords.latitude, lng: pos.coords.longitude })); setShowLoc(true); setLocKey(k => k + 1); setGeoErr(""); },
      () => setGeoErr(t("geo_denied")),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };
  const removeLocation = () => { setPlace(null); setShowLoc(false); setGeoErr(""); };

  const resetForm = () => { setText(""); setSelEmojis([]); setMood(4); setPhoto(null); setTimeline([]); removeLocation(); };

  const save = () => {
    if (!text.trim() && !photo) return;
    setEntries(prev => [{
      id: Date.now(), date: todayStr(), time, text: text.trim(), mood, emojis: selEmojis, photo,
      ...(timeline.length ? { timeline } : {}),
      ...(place && place.lat != null ? { place } : {}),
    }, ...prev]);
    resetForm(); setShowNew(false);
  };

  const exportTxt = () => {
    const content = entries.map(e =>
      `━━━━━━━━━━━━━━━━━━━━\n${formatDate(e.date, lang)} · ${e.time}\n[${t(`mood_${e.mood}`)}] ${e.emojis.join(" ")}${e.photo ? "  📷" : ""}\n\n${e.text}\n`
    ).join("\n");
    const blob = new Blob([`${t("export_journal_header")}\n${"═".repeat(36)}\n\n${content}`], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "aurore-journal.txt"; a.click();
  };

  const hasSearch = searchDate || searchText.trim();
  const visible = entries.filter(e => {
    if (searchDate && e.date !== searchDate) return false;
    if (searchText.trim() && !e.text.toLowerCase().includes(searchText.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ padding: "24px 18px 110px", fontFamily: ff }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h2 style={{ color: th.text, fontFamily: HEAD_FONT, fontSize: 22, fontWeight: 700, margin: 0 }}>{t("journal_title")}</h2>
          <p style={{ color: th.muted, fontSize: 12, margin: "4px 0 0" }}>{countLabel(entries.length, lang, t)}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn onClick={exportTxt} variant="secondary" th={th} style={{ padding: "8px 10px", fontSize: 11 }}>↑ {t("export_btn")}</Btn>
          <Btn onClick={() => setShowNew(true)} variant="primary" th={th} style={{ padding: "8px 14px", fontSize: 11 }}>+ {t("write_btn")}</Btn>
        </div>
      </div>

      {/* Search by date + keyword */}
      <Card th={th} style={{ marginBottom: 16, padding: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <input type="date" value={searchDate} onChange={e => setSearchDate(e.target.value)} style={{
            background: th.bg, border: `1px solid ${th.border}`, borderRadius: 8,
            padding: "8px 10px", color: th.text, fontSize: 13, colorScheme: th.light ? "light" : "dark",
          }} />
          <input
            value={searchText} onChange={e => setSearchText(e.target.value)}
            placeholder={t("search_placeholder")}
            style={{
              flex: 1, minWidth: 0, background: th.bg, border: `1px solid ${th.border}`,
              borderRadius: 8, padding: "8px 10px", color: th.text, fontSize: 13, fontFamily: ff,
            }}
          />
          {hasSearch && (
            <button onClick={() => { setSearchDate(""); setSearchText(""); }} style={{
              background: "none", border: `1px solid ${th.border}`, borderRadius: 8,
              padding: "8px 10px", color: th.muted, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap",
            }}>{t("search_clear")}</button>
          )}
        </div>
      </Card>

      {/* New entry modal */}
      {showNew && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 200,
          display: "flex", alignItems: "flex-end",
        }}>
          <div style={{
            width: "100%", maxWidth: 480, margin: "0 auto",
            background: th.surface, borderRadius: "22px 22px 0 0",
            padding: "24px 20px 40px", maxHeight: "93vh", overflowY: "auto",
            border: `1px solid ${th.border}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <h3 style={{ color: th.text, fontFamily: HEAD_FONT, fontSize: 18, margin: 0 }}>{t("new_moment")}</h3>
              <button onClick={() => { resetForm(); setShowNew(false); }} aria-label={t("close")} style={{ background: "none", border: "none", color: th.muted, fontSize: 22, cursor: "pointer" }}>✕</button>
            </div>

            <Label th={th}>{t("mood_now")}</Label>
            <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
              {MOODS.map(m => (
                <button key={m.v} onClick={() => setMood(m.v)} aria-label={t(`mood_${m.v}`)} aria-pressed={mood === m.v} style={{
                  flex: 1, padding: "11px 4px", borderRadius: 12, fontSize: 22, cursor: "pointer",
                  background: mood === m.v ? m.c + "44" : th.bg,
                  border: `2px solid ${mood === m.v ? m.c : th.border}`,
                  transition: "all 0.15s",
                }}>{m.e}</button>
              ))}
            </div>

            <Label th={th}>{t("hour")}</Label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{
              width: "100%", background: th.bg, border: `1px solid ${th.border}`,
              borderRadius: 8, padding: "10px 14px", color: th.text, fontSize: 14,
              marginBottom: 18, boxSizing: "border-box", colorScheme: th.light ? "light" : "dark",
            }} />

            <Label th={th}>{t("my_moment")}</Label>
            <textarea
              value={text} onChange={e => setText(e.target.value)}
              placeholder={t("moment_placeholder")}
              rows={6}
              style={{
                width: "100%", background: th.bg, border: `1px solid ${th.border}`,
                borderRadius: 12, padding: "14px", color: th.text, fontSize: 14,
                resize: "none", fontFamily: ff, lineHeight: 1.7,
                boxSizing: "border-box", marginBottom: 18,
              }}
            />

            {/* Photo / creation */}
            <Label th={th}>{t("photo_label")}</Label>
            <input ref={fileRef} type="file" accept="image/*" onChange={onPickPhoto} style={{ display: "none" }} />
            {photo ? (
              <div style={{ position: "relative", marginBottom: 20 }}>
                <img src={photo} alt="" style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 12 }} />
                <button onClick={() => setPhoto(null)} style={{
                  position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)",
                  border: "none", borderRadius: 8, padding: "6px 10px", color: "#fff",
                  fontSize: 11, cursor: "pointer",
                }}>{t("remove_photo")} ✕</button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()} disabled={photoBusy} style={{
                width: "100%", background: th.bg, border: `1px dashed ${th.border}`,
                borderRadius: 12, padding: "16px", color: th.muted, fontSize: 13,
                cursor: "pointer", marginBottom: 20,
              }}>{photoBusy ? "…" : `📷 ${t("add_photo")}`}</button>
            )}

            {/* Location */}
            <Label th={th}>{t("location_label")}</Label>
            {!showLoc && (!place || place.lat == null) ? (
              <button onClick={() => setShowLoc(true)} style={{
                width: "100%", background: th.bg, border: `1px dashed ${th.border}`,
                borderRadius: 12, padding: "16px", color: th.muted, fontSize: 13,
                cursor: "pointer", marginBottom: 20,
              }}>📍 {t("add_location")}</button>
            ) : (
              <div style={{ marginBottom: 20 }}>
                <p style={{ color: th.muted, fontSize: 11, margin: "-4px 0 8px" }}>{t("location_hint")}</p>
                <Suspense fallback={<div style={{ height: 190, borderRadius: 12, border: `1px solid ${th.border}`, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", color: th.muted, fontSize: 12 }}>…</div>}>
                  <LocationPicker key={locKey} value={place} th={th}
                    onChange={(c) => setPlace(p => ({ ...(p || {}), lat: c.lat, lng: c.lng }))} />
                </Suspense>
                <input
                  value={place?.label || ""}
                  onChange={e => setPlace(p => ({ ...(p || {}), label: e.target.value }))}
                  placeholder={t("location_name_ph")}
                  style={{
                    width: "100%", background: th.bg, border: `1px solid ${th.border}`,
                    borderRadius: 8, padding: "9px 12px", color: th.text, fontSize: 13,
                    boxSizing: "border-box", fontFamily: ff, marginBottom: 8,
                  }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn onClick={useMyLocation} variant="ghost" th={th} style={{ fontSize: 11, padding: "8px 12px", fontWeight: 400 }}>{t("use_my_location")}</Btn>
                  <Btn onClick={removeLocation} variant="ghost" th={th} style={{ fontSize: 11, padding: "8px 12px", fontWeight: 400 }}>{t("location_remove")}</Btn>
                </div>
                {geoErr && <p style={{ color: "#E05050", fontSize: 11, margin: "8px 0 0" }}>{geoErr}</p>}
              </div>
            )}

            {/* Intra-day mood timeline */}
            <Label th={th}>{t("timeline_label")}</Label>
            <p style={{ color: th.muted, fontSize: 11, margin: "-4px 0 10px" }}>{t("timeline_hint")}</p>
            {timeline.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                {[...timeline].sort((a, b) => a.time.localeCompare(b.time)).map((p, i) => (
                  <span key={i} style={{
                    display: "flex", alignItems: "center", gap: 5,
                    background: th.bg, border: `1px solid ${th.border}`, borderRadius: 20,
                    padding: "4px 6px 4px 9px", fontSize: 12, color: th.text,
                  }}>
                    <span>{getMood(p.mood).e}</span><span>{p.time}</span>
                    <button onClick={() => removeTl(i)} aria-label={t("remove_photo")} style={{ background: "none", border: "none", color: th.faint, cursor: "pointer", fontSize: 15, lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 24 }}>
              <input type="time" value={tlTime} onChange={e => setTlTime(e.target.value)} style={{
                background: th.bg, border: `1px solid ${th.border}`, borderRadius: 8,
                padding: "7px 8px", color: th.text, fontSize: 13, colorScheme: th.light ? "light" : "dark",
              }} />
              <div style={{ display: "flex", gap: 3, flex: 1 }}>
                {MOODS.map(m => (
                  <button key={m.v} onClick={() => setTlMood(m.v)} aria-label={t(`mood_${m.v}`)} aria-pressed={tlMood === m.v} style={{
                    flex: 1, padding: "6px 0", borderRadius: 8, fontSize: 16, cursor: "pointer",
                    background: tlMood === m.v ? m.c + "44" : th.bg,
                    border: `1px solid ${tlMood === m.v ? m.c : th.border}`,
                  }}>{m.e}</button>
                ))}
              </div>
              <button onClick={addTl} aria-label={t("timeline_label")} style={{
                background: th.accent, border: "none", borderRadius: 8,
                padding: "7px 12px", color: "#000", fontSize: 16, cursor: "pointer",
              }}>+</button>
            </div>

            <Label th={th}>{t("emojis_label")} ({selEmojis.length}/5)</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 24 }}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => toggleEmoji(e)} aria-label={e} aria-pressed={selEmojis.includes(e)} style={{
                  background: selEmojis.includes(e) ? th.accent + "44" : th.bg,
                  border: `1px solid ${selEmojis.includes(e) ? th.accent : th.border}`,
                  borderRadius: 8, padding: "6px 8px", fontSize: 19, cursor: "pointer",
                  transition: "all 0.12s",
                }}>{e}</button>
              ))}
            </div>

            <button onClick={save} style={{
              width: "100%", background: `linear-gradient(135deg, ${th.accentSoft}, ${th.accent})`,
              border: "none", borderRadius: 14,
              padding: 15, color: "#1A1207", fontSize: 15, fontWeight: 700,
              cursor: "pointer", letterSpacing: 1,
            }}>
              {t("save")} ✦
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {entries.length === 0 && (
        <Card th={th} style={{ textAlign: "center", padding: 44 }}>
          <p style={{ fontSize: 38, margin: "0 0 14px" }}>📖</p>
          <p style={{ color: th.muted, fontSize: 14, margin: 0 }}>{t("journal_empty")}</p>
        </Card>
      )}

      {/* No search results */}
      {entries.length > 0 && visible.length === 0 && (
        <Card th={th} style={{ textAlign: "center", padding: 30 }}>
          <p style={{ color: th.muted, fontSize: 14, margin: 0 }}>{t("search_none")}</p>
        </Card>
      )}

      {/* Entries list (grouped by date) */}
      {visible.reduce((acc, e, idx) => {
        const showDate = idx === 0 || visible[idx - 1].date !== e.date;
        const m = getMood(e.mood);
        return [...acc,
          showDate ? (
            <p key={`d-${e.date}-${idx}`} style={{ color: th.muted, fontSize: 10, letterSpacing: 2, margin: "18px 0 8px" }}>
              {formatDate(e.date, lang).toUpperCase()}
            </p>
          ) : null,
          <Card key={e.id} th={th} style={{ marginBottom: 10, borderLeft: `3px solid ${m.c}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>{m.e}</span>
              <span style={{ color: m.c, fontSize: 11, fontWeight: 600 }}>{t(`mood_${e.mood}`)}</span>
              <span style={{ color: th.muted, fontSize: 11, marginLeft: "auto" }}>{e.time}</span>
            </div>
            {e.photo && (
              <img src={e.photo} alt="" loading="lazy" decoding="async" style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 10, marginBottom: 8 }} />
            )}
            {e.text && <p style={{ color: th.text, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{e.text}</p>}
            {e.emojis.length > 0 && <p style={{ margin: "10px 0 0", fontSize: 18 }}>{e.emojis.join(" ")}</p>}
            <MoodTimeline timeline={e.timeline} th={th} />
          </Card>,
        ].filter(Boolean);
      }, [])}
    </div>
  );
}

// ─── CALENDAR PAGE ───────────────────────────────────────────────────────────

function CalendarPage({ entries, th, ff, lang, t }) {
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
      <h2 style={{ color: th.text, fontFamily: HEAD_FONT, fontSize: 22, fontWeight: 700, margin: "0 0 20px" }}>
        {t("cal_title")}
      </h2>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button onClick={prevMo} aria-label={t("prev_month")} style={{ background: th.surface, border: `1px solid ${th.border}`, borderRadius: 8, padding: "7px 16px", color: th.text, cursor: "pointer", fontSize: 16 }}>‹</button>
        <p style={{ color: th.text, fontWeight: 600, fontSize: 15, margin: 0 }}>{MONTHS[mo]} {yr}</p>
        <button onClick={nextMo} aria-label={t("next_month")} style={{ background: th.surface, border: `1px solid ${th.border}`, borderRadius: 8, padding: "7px 16px", color: th.text, cursor: "pointer", fontSize: 16 }}>›</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
        {(CAL_DAYS[lang] || CAL_DAYS.fr).map((d, i) => <div key={i} style={{ textAlign: "center", color: th.muted, fontSize: 10, letterSpacing: 1, paddingBottom: 4 }}>{d}</div>)}
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
            <Label th={th}>{t("cal_summary")}</Label>
            <p style={{ color: th.text, fontSize: 13, margin: "0 0 3px" }}>
              {t("cal_dominant")}: <strong style={{ color: th.accent }}>{t(`mood_${avg}`)}</strong>
            </p>
            <p style={{ color: th.muted, fontSize: 12, margin: 0 }}>{countLabel(mvals.length, lang, t)} {t("this_month")}</p>
          </div>
        </Card>
      ) : (
        <Card th={th} style={{ textAlign: "center", padding: 24 }}>
          <p style={{ color: th.muted, fontSize: 13, margin: 0 }}>{t("cal_none")}</p>
        </Card>
      )}

      <Card th={th} style={{ marginTop: 12 }}>
        <Label th={th}>{t("legend")}</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {MOODS.map(m => (
            <div key={m.v} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: m.c + "44", border: `2px solid ${m.c}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0,
              }}>{m.e}</div>
              <span style={{ color: th.text, fontSize: 13 }}>{t(`mood_${m.v}`)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── POLAROID WALL ───────────────────────────────────────────────────────────

function PolaroidPage({ entries, th, ff, lang, t }) {
  const angles = [-2, 1.5, -1.2, 2.2, -1.8, 1, -2.5, 0.8];
  return (
    <div style={{ padding: "24px 18px 110px", fontFamily: ff }}>
      <h2 style={{ color: th.text, fontFamily: HEAD_FONT, fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>
        {t("wall_title")} ✦
      </h2>
      <p style={{ color: th.muted, fontSize: 13, margin: "0 0 22px" }}>{t("wall_sub")}</p>

      {entries.length === 0 && (
        <Card th={th} style={{ textAlign: "center", padding: 44 }}>
          <p style={{ fontSize: 36, margin: "0 0 14px" }}>🌅</p>
          <p style={{ color: th.muted, fontSize: 14, margin: 0 }}>{t("wall_empty")}</p>
        </Card>
      )}

      <div style={{ columns: 2, columnGap: 12 }}>
        {entries.map((e, i) => {
          const m = getMood(e.mood);
          const angle = angles[i % angles.length];
          return (
            <div key={e.id} className="aurore-polaroid" style={{
              breakInside: "avoid", marginBottom: 14,
              background: "#FAF5EF", borderRadius: 3,
              padding: "10px 10px 30px",
              transform: `rotate(${angle}deg)`,
              boxShadow: "0 6px 28px rgba(0,0,0,0.65)",
            }}>
              {e.photo ? (
                <img src={e.photo} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: 130, objectFit: "cover", borderRadius: 2, marginBottom: 9, display: "block" }} />
              ) : (
                <div style={{
                  height: 92, borderRadius: 2, marginBottom: 9,
                  background: `linear-gradient(135deg, ${m.c}55, ${m.c}cc)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 38,
                }}>{m.e}</div>
              )}
              <p style={{
                color: "#2A1810", fontSize: 10, lineHeight: 1.45,
                margin: "0 0 6px", fontFamily: HEAD_FONT,
              }}>
                {e.text ? (e.text.length > 60 ? e.text.slice(0, 60) + "…" : e.text) : `${m.e} ${t(`mood_${e.mood}`)}`}
              </p>
              <p style={{ color: "#AA9080", fontSize: 9, margin: 0, textAlign: "right" }}>
                {formatDate(e.date, lang)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── TASKS PAGE ──────────────────────────────────────────────────────────────

function TasksPage({ tasks, setTasks, th, ff, t }) {
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
          <h2 style={{ color: th.text, fontFamily: HEAD_FONT, fontSize: 22, fontWeight: 700, margin: 0 }}>{t("tasks_title")}</h2>
          <p style={{ color: th.muted, fontSize: 12, margin: "4px 0 0" }}>{pending} {t("tasks_pending")}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ color: th.accent, fontSize: 24, fontWeight: 700, margin: 0 }}>{done}</p>
          <p style={{ color: th.muted, fontSize: 9, letterSpacing: 1, margin: 0 }}>{t("tasks_done_caps")}</p>
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
          placeholder={t("task_placeholder")}
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
              {p === "haute" ? t("prio_high") : t("prio_normal")}
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
        {[["pending", t("filter_pending")], ["today", t("filter_today")], ["done", t("filter_done")], ["all", t("filter_all")]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            background: filter === v ? th.accent + "22" : "transparent",
            border: `1px solid ${filter === v ? th.accent : th.border}`,
            borderRadius: 20, padding: "5px 11px",
            color: filter === v ? th.accent : th.muted, fontSize: 10, cursor: "pointer",
          }}>{l}</button>
        ))}
      </div>

      {/* Task list */}
      {filtered.map(t2 => (
        <div key={t2.id} style={{
          display: "flex", alignItems: "center", gap: 12,
          background: th.surface, border: `1px solid ${th.border}`,
          borderRadius: 12, padding: "13px 14px", marginBottom: 8,
          opacity: t2.done ? 0.5 : 1, transition: "opacity 0.2s",
        }}>
          <button onClick={() => toggle(t2.id)} aria-label={t2.text} aria-pressed={t2.done} style={{
            width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
            background: t2.done ? th.accent : "transparent",
            border: `2px solid ${t2.done ? th.accent : th.muted}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 11, color: t2.done ? "#000" : "transparent",
          }}>✓</button>
          <span style={{
            flex: 1, color: th.text, fontSize: 13,
            textDecoration: t2.done ? "line-through" : "none",
          }}>{t2.text}</span>
          {t2.priority === "haute" && !t2.done && (
            <span style={{ color: th.accent, fontSize: 12 }}>⚡</span>
          )}
          <button onClick={() => del(t2.id)} aria-label={t("delete")} style={{
            background: "none", border: "none",
            color: th.faint, fontSize: 18, cursor: "pointer", lineHeight: 1,
          }}>×</button>
        </div>
      ))}

      {filtered.length === 0 && (
        <Card th={th} style={{ textAlign: "center", padding: 30 }}>
          <p style={{ color: th.muted, fontSize: 14, margin: 0 }}>
            {filter === "done" ? t("tasks_empty_done") : t("tasks_empty")}
          </p>
        </Card>
      )}
    </div>
  );
}

// ─── SETTINGS PAGE ───────────────────────────────────────────────────────────

function SettingsPage({
  th, t, lang, setLang, themeIdx, setThemeIdx, fontIdx, setFontIdx,
  entries, tasks, setLocked, pin, setPin,
  reminderEnabled, setReminderEnabled, reminderMode, setReminderMode, reminderTime, setReminderTime,
}) {
  const [pinInput, setPinInput] = useState("");
  const [showPinForm, setShowPinForm] = useState(false);
  const [flash, setFlash] = useState(false);
  const notifSupported = typeof window !== "undefined" && "Notification" in window;
  const [notifPerm, setNotifPerm] = useState(notifSupported ? Notification.permission : "unsupported");

  const showSaved = () => { setFlash(true); setTimeout(() => setFlash(false), 2000); };
  const savePin = () => {
    if (pinInput.length >= 4) { setPin(pinInput); setShowPinForm(false); setPinInput(""); showSaved(); }
  };
  const toggleReminder = async () => {
    if (reminderEnabled) { setReminderEnabled(false); showSaved(); return; }
    if (!notifSupported) return;
    let perm = Notification.permission;
    if (perm === "default") perm = await Notification.requestPermission();
    setNotifPerm(perm);
    if (perm === "granted") { setReminderEnabled(true); showSaved(); }
  };
  const exportJSON = () => {
    const data = { exportDate: new Date().toISOString(), lang, entries, tasks };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "aurore-data.json"; a.click();
  };

  return (
    <div style={{ padding: "24px 18px 110px", fontFamily: "inherit" }}>
      <h2 style={{ color: th.text, fontFamily: HEAD_FONT, fontSize: 22, fontWeight: 700, margin: "0 0 24px" }}>
        {t("settings_title")}
      </h2>

      {flash && (
        <div style={{
          background: th.accent + "33", border: `1px solid ${th.accent}`,
          borderRadius: 10, padding: "10px 16px", marginBottom: 16,
          color: th.accent, fontSize: 13, textAlign: "center",
          animation: "fadeIn 0.2s ease",
        }}>
          {t("saved")}
        </div>
      )}

      {/* Language */}
      <Label th={th}>{t("lang_label")}</Label>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {LANGS.map(L => (
          <button key={L.id} onClick={() => { setLang(L.id); showSaved(); }} style={{
            flex: 1, background: lang === L.id ? th.accent + "22" : th.surface,
            border: `1px solid ${lang === L.id ? th.accent : th.border}`,
            borderRadius: 10, padding: "12px 6px",
            color: lang === L.id ? th.accent : th.muted,
            fontSize: 13, cursor: "pointer", fontWeight: lang === L.id ? 700 : 400,
            transition: "all 0.15s",
          }}>{L.label}</button>
        ))}
      </div>

      {/* Themes */}
      <Label th={th}>{t("theme_label")}</Label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
        {THEMES.map((tm, i) => (
          <button key={tm.name} onClick={() => { setThemeIdx(i); showSaved(); }} style={{
            background: tm.bg, border: `2px solid ${themeIdx === i ? tm.accent : tm.border}`,
            borderRadius: 12, padding: "12px 14px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10, transition: "border-color 0.2s",
          }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: tm.accent, flexShrink: 0 }} />
            <span style={{ color: tm.text, fontSize: 13 }}>{t(`theme_${i}`)}</span>
            {themeIdx === i && <span style={{ color: tm.accent, marginLeft: "auto", fontSize: 14 }}>✓</span>}
          </button>
        ))}
      </div>

      {/* Fonts */}
      <Label th={th}>{t("font_label")}</Label>
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
      <Label th={th}>{t("reminder_label")}</Label>
      <Card th={th} style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <span style={{ fontSize: 22 }}>🔔</span>
          <div style={{ flex: 1 }}>
            <p style={{ color: th.text, fontSize: 14, margin: 0 }}>{t("reminder_label")}</p>
            <p style={{ color: notifPerm === "denied" ? "#E05050" : th.muted, fontSize: 11, margin: "3px 0 0" }}>
              {!notifSupported ? t("reminder_unsupported")
                : notifPerm === "denied" ? t("reminder_denied")
                : reminderEnabled ? t("reminder_on")
                : t("reminder_hint")}
            </p>
          </div>
          <Btn onClick={toggleReminder} variant={reminderEnabled ? "primary" : "ghost"} th={th} style={{ fontSize: 11, padding: "8px 12px" }}>
            {reminderEnabled ? "ON" : t("activate")}
          </Btn>
        </div>

        {reminderEnabled && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {[["daily", t("reminder_daily")], ["hourly", t("reminder_hourly")]].map(([v, l]) => (
                <button key={v} onClick={() => { setReminderMode(v); showSaved(); }} style={{
                  flex: 1, background: reminderMode === v ? th.accent + "22" : "transparent",
                  border: `1px solid ${reminderMode === v ? th.accent : th.border}`,
                  borderRadius: 8, padding: "9px", cursor: "pointer",
                  color: reminderMode === v ? th.accent : th.muted, fontSize: 12,
                }}>{l}</button>
              ))}
            </div>
            {reminderMode === "daily" && (
              <input type="time" value={reminderTime} onChange={e => { setReminderTime(e.target.value); showSaved(); }} style={{
                width: "100%", background: th.bg, border: `1px solid ${th.border}`,
                borderRadius: 8, padding: "9px 12px", color: th.text, fontSize: 14,
                boxSizing: "border-box", colorScheme: th.light ? "light" : "dark",
              }} />
            )}
          </>
        )}
      </Card>

      {/* Privacy */}
      <Label th={th}>{t("privacy_label")}</Label>
      <Card th={th} style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showPinForm ? 16 : 0 }}>
          <div>
            <p style={{ color: th.text, fontSize: 14, margin: 0 }}>{t("pin_title")}</p>
            <p style={{ color: th.muted, fontSize: 11, margin: "3px 0 0" }}>
              {pin ? t("pin_active") : t("pin_none")}
            </p>
          </div>
          <Btn onClick={() => setShowPinForm(!showPinForm)} variant="ghost" th={th} style={{ fontSize: 11, padding: "7px 12px" }}>
            {pin ? t("modify") : t("activate")}
          </Btn>
        </div>
        {showPinForm && (
          <>
            <input
              type="password" placeholder={t("pin_placeholder")}
              value={pinInput} onChange={e => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
              style={{
                width: "100%", background: th.bg, border: `1px solid ${th.border}`,
                borderRadius: 8, padding: "11px", color: th.text,
                fontSize: 22, letterSpacing: 10, textAlign: "center",
                boxSizing: "border-box", marginBottom: 10,
              }}
            />
            <Btn onClick={savePin} variant="primary" th={th} style={{ width: "100%", padding: "11px", fontSize: 14 }}>
              {t("pin_confirm")}
            </Btn>
          </>
        )}
        {pin && (
          <button onClick={() => setLocked(true)} style={{
            background: "none", border: `1px solid ${th.border}`,
            borderRadius: 8, padding: "8px 16px", color: th.muted,
            fontSize: 12, cursor: "pointer", marginTop: 12, width: "100%",
          }}>
            {t("lock_now")}
          </button>
        )}
      </Card>

      {/* Export */}
      <Label th={th}>{t("export_label")}</Label>
      <div style={{ display: "flex", gap: 10, marginBottom: 40 }}>
        <button onClick={exportJSON} style={{
          flex: 1, background: th.surface, border: `1px solid ${th.border}`,
          borderRadius: 12, padding: "13px", color: th.text, fontSize: 13, cursor: "pointer",
        }}>{t("export_json")}</button>
      </div>

      {/* Branding */}
      <div style={{ textAlign: "center", paddingTop: 10 }}>
        <p style={{ color: th.accent, fontFamily: HEAD_FONT, fontSize: 16, letterSpacing: 5, margin: "0 0 4px" }}>AURORE</p>
        <p style={{ color: th.muted, fontSize: 10, letterSpacing: 4, margin: "0 0 8px" }}>{t("club")} · v1.0</p>
        <p style={{ color: th.faint, fontSize: 10, margin: 0 }}>
          {t("project_credit")}
        </p>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function AuroreApp() {
  const [splash, setSplash] = useState(true);
  const [view, setView] = usePersistentState("view", "landing");
  const [page, setPage] = useState("home");
  const [lang, setLang] = usePersistentState("lang", "fr");
  const [themeIdx, setThemeIdx] = usePersistentState("themeIdx", 4);
  const [fontIdx, setFontIdx] = usePersistentState("fontIdx", 1);
  const [entries, setEntries] = usePersistentState("entries", SAMPLE_ENTRIES);
  const [tasks, setTasks] = usePersistentState("tasks", SAMPLE_TASKS);
  const [currentMood, setCurrentMood] = usePersistentState("currentMood", 4);
  const [showNew, setShowNew] = useState(false);
  const [pin, setPin] = usePersistentState("pin", "");
  // If a PIN was set in a previous session, open the app locked.
  const [locked, setLocked] = useState(() => !!readStored("pin", ""));
  const [pinError, setPinError] = useState(false);

  // Reminder settings
  const [reminderEnabled, setReminderEnabled] = usePersistentState("reminderEnabled", false);
  const [reminderMode, setReminderMode] = usePersistentState("reminderMode", "daily");
  const [reminderTime, setReminderTime] = usePersistentState("reminderTime", "20:00");

  const th = THEMES[themeIdx] || THEMES[0];
  const ff = (FONTS[fontIdx] || FONTS[0]).family;
  const t = makeT(lang);

  // Dismiss the splash after 2.8s (effect, so it runs once — not on every render).
  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  // Keep the document language in sync for screen readers / accessibility.
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  // Reminder scheduler. Notifications fire while the app is open (a true
  // background push would require a service worker + push server).
  useEffect(() => {
    if (!reminderEnabled) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    let timer;
    const body = (STRINGS[lang] && STRINGS[lang].reminder_body) || STRINGS.fr.reminder_body;
    const fire = () => {
      try { new Notification("AURORE — The Club", { body }); } catch { /* noop */ }
    };
    const scheduleDaily = () => {
      const now = new Date();
      const [h, m] = reminderTime.split(":").map(Number);
      const next = new Date(now);
      next.setHours(h || 0, m || 0, 0, 0);
      if (next <= now) next.setDate(next.getDate() + 1);
      timer = setTimeout(() => { fire(); scheduleDaily(); }, next - now);
    };
    const scheduleHourly = () => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(now.getHours() + 1, 0, 0, 0);
      timer = setTimeout(() => { fire(); scheduleHourly(); }, next - now);
    };
    if (reminderMode === "hourly") scheduleHourly(); else scheduleDaily();
    return () => clearTimeout(timer);
  }, [reminderEnabled, reminderMode, reminderTime, lang]);

  const baseStyles = `
    @keyframes orbPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.07);opacity:.88} }
    @keyframes splashFade { 0%{opacity:0;transform:translateY(20px)} 30%{opacity:1;transform:translateY(0)} 80%{opacity:1} 100%{opacity:0} }
    @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    *{-webkit-tap-highlight-color:transparent;box-sizing:border-box}
    ::-webkit-scrollbar{width:0;background:transparent}
    :focus:not(:focus-visible){outline:none}
    :focus-visible{outline:2px solid ${th.accent};outline-offset:2px;border-radius:6px}
    .aurore-polaroid{transition:transform .25s ease, box-shadow .25s ease;cursor:pointer}
    .aurore-polaroid:hover{transform:rotate(0deg) scale(1.04)!important;box-shadow:0 12px 40px rgba(0,0,0,.8)!important;position:relative;z-index:2}
    @media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}}
  `;

  if (splash) {
    return (
      <div style={{ background: th.bg, minHeight: "100vh", fontFamily: ff }}>
        <style>{baseStyles}</style>
        <SplashScreen th={th} t={t} />
      </div>
    );
  }

  if (view === "landing") {
    return (
      <div style={{ background: th.bg, minHeight: "100vh", fontFamily: ff, color: th.text, position: "relative" }}>
        <style>{baseStyles}</style>
        <SunsetGlow th={th} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Landing th={th} ff={ff} onEnterApp={() => setView("app")} />
        </div>
      </div>
    );
  }

  if (locked && pin) {
    return (
      <div style={{ background: th.bg, fontFamily: ff }}>
        <style>{baseStyles}</style>
        <LockScreen th={th} t={t} error={pinError} onUnlock={(p) => {
          if (p === pin) { setLocked(false); setPinError(false); }
          else setPinError(true);
        }} />
      </div>
    );
  }

  const nav = [
    { id: "home",     icon: "☀️", label: t("nav_home")     },
    { id: "journal",  icon: "📖", label: t("nav_journal")  },
    { id: "calendar", icon: "🗓",  label: t("nav_calendar") },
    { id: "map",      icon: "🗺",  label: t("nav_map")      },
    { id: "wall",     icon: "🌅", label: t("nav_wall")     },
    { id: "tasks",    icon: "✓",  label: t("nav_tasks")    },
    { id: "settings", icon: "⚙",  label: t("nav_settings") },
  ];

  return (
    <div style={{ background: th.bg, minHeight: "100vh", fontFamily: ff, color: th.text, position: "relative" }}>
      <style>{baseStyles}</style>
      <SunsetGlow th={th} />

      <main style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", minHeight: "100vh" }}>
        <div key={page + lang} style={{ animation: "fadeIn 0.3s ease" }}>
          {page === "home" && (
            <HomePage
              entries={entries} tasks={tasks} th={th} ff={ff} lang={lang} t={t}
              currentMood={currentMood} setCurrentMood={setCurrentMood}
              onNewEntry={() => { setShowNew(true); setPage("journal"); }}
              onExitToLanding={() => setView("landing")}
            />
          )}
          {page === "journal" && (
            <JournalPage
              entries={entries} setEntries={setEntries} th={th} ff={ff} lang={lang} t={t}
              showNew={showNew} setShowNew={setShowNew}
            />
          )}
          {page === "calendar" && <CalendarPage entries={entries} th={th} ff={ff} lang={lang} t={t} />}
          {page === "map" && (
            <Suspense fallback={<div style={{ padding: "60px 18px", textAlign: "center", color: th.muted, fontSize: 13 }}>…</div>}>
              <MapPage entries={entries} th={th} ff={ff} lang={lang} t={t} getMood={getMood} formatDate={formatDate} />
            </Suspense>
          )}
          {page === "wall"     && <PolaroidPage entries={entries} th={th} ff={ff} lang={lang} t={t} />}
          {page === "tasks"    && <TasksPage tasks={tasks} setTasks={setTasks} th={th} ff={ff} t={t} />}
          {page === "settings" && (
            <SettingsPage
              th={th} t={t} lang={lang} setLang={setLang}
              themeIdx={themeIdx} setThemeIdx={setThemeIdx}
              fontIdx={fontIdx} setFontIdx={setFontIdx}
              entries={entries} tasks={tasks}
              setLocked={setLocked} pin={pin} setPin={setPin}
              reminderEnabled={reminderEnabled} setReminderEnabled={setReminderEnabled}
              reminderMode={reminderMode} setReminderMode={setReminderMode}
              reminderTime={reminderTime} setReminderTime={setReminderTime}
            />
          )}
        </div>
      </main>

      {/* Bottom navigation */}
      <nav aria-label="Navigation" style={{
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
            <button key={n.id} onClick={() => setPage(n.id)} aria-current={active ? "page" : undefined} style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              padding: "4px 6px", color: active ? th.accent : th.muted,
              transition: "color 0.2s",
              position: "relative",
            }}>
              {active && (
                <div style={{
                  position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                  width: 22, height: 2, borderRadius: 1,
                  background: `linear-gradient(90deg, ${th.accentSoft}, ${th.accent})`,
                }} />
              )}
              <span style={{ fontSize: active ? 22 : 19, transition: "font-size 0.2s" }}>{n.icon}</span>
              <span style={{ fontSize: 8, letterSpacing: 0.5, fontWeight: active ? 700 : 400 }}>
                {n.label.toUpperCase()}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
