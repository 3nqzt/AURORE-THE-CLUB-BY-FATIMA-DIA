import { Component } from "react";

// Top-level safety net: if any render throws, show a friendly fallback instead
// of a blank white screen. Data lives in localStorage, so it is not lost.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("AURORE — erreur inattendue :", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{
        minHeight: "100vh", background: "#0E0A09", color: "#F7EEE4",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: 24, textAlign: "center", fontFamily: "system-ui, sans-serif",
      }}>
        <p style={{ fontSize: 40, margin: "0 0 12px" }}>🌅</p>
        <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, margin: "0 0 8px", color: "#E0764A", fontWeight: 600 }}>
          Oups…
        </h1>
        <p style={{ color: "#AB9786", fontSize: 14, maxWidth: 300, lineHeight: 1.6, margin: "0 0 22px" }}>
          Une erreur inattendue s'est produite. Tes données restent en sécurité sur ton appareil.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: "#E0764A", border: "none", borderRadius: 12,
            padding: "12px 24px", color: "#1A1207", fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}
        >
          Recharger
        </button>
      </div>
    );
  }
}
