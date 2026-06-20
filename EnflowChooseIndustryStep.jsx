import React, { useState, useRef } from "react";

/* -------------------------------------------------------------------- */
/*  ENFLOW — Onboarding Step 5 of 11: What kind of business...           */
/*  Wireframe gives the 3x2 grid (collapses to 1 col on mobile, matching */
/*  Figma's narrow frame) plus the Restaurant-only sub-type row. Figma   */
/*  adds photo thumbnails per card and a "Selected" indicator.           */
/*  Extension: sub-type pills are generalized per industry (not just     */
/*  Restaurant) since Fast Food / Lounge are also "Available" and the    */
/*  label is literally "SUB-TYPE ({INDUSTRY})" — multi-select toggle,    */
/*  since a venue can run more than one mode at once.                    */
/* -------------------------------------------------------------------- */

function Icon({ name, size = 16 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none" };
  switch (name) {
    case "sparkle":
      return (
        <svg {...common}>
          <path d="M12 2l1.8 5.6L19.4 9.4 13.8 11.2 12 16.8 10.2 11.2 4.6 9.4 10.2 7.6 12 2z" fill="currentColor" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M4.5 12.5l4.5 4.5L19.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "back":
      return (
        <svg {...common}>
          <path d="M14.5 5.5L8 12l6.5 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "forward":
      return (
        <svg {...common}>
          <path d="M9.5 5.5L16 12l-6.5 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

/* Photos sourced from Unsplash. Each URL below was individually fetched
   and confirmed to resolve (via the photo page's og:image) before being
   used here — the previous version used Wikimedia URLs I had constructed
   but could not verify, and several didn't actually resolve. `emoji` is
   kept as an onError fallback in case any link ever breaks. */
const INDUSTRIES = [
  {
    id: "restaurant",
    label: "Restaurant",
    emoji: "🍽️",
    image: "https://images.unsplash.com/photo-1758243488328-148e39e5e6b1?fm=jpg&q=70&w=400&auto=format&fit=crop",
    status: "available",
    subtypes: ["Dine-in", "Takeaway", "Delivery", "Cloud kitchen", "Multi-branch"],
    defaultSubtypes: ["Dine-in"],
  },
  {
    id: "fastfood",
    label: "Fast Food",
    emoji: "🍔",
    image: "https://images.unsplash.com/photo-1758578484459-677bfbbd00f7?fm=jpg&q=70&w=400&auto=format&fit=crop",
    status: "available",
    subtypes: ["Dine-in", "Takeaway", "Delivery", "Drive-thru"],
    defaultSubtypes: ["Takeaway"],
  },
  {
    id: "lounge",
    label: "Lounge / Bar",
    emoji: "🍸",
    image: "https://images.unsplash.com/photo-1711429526427-679eb0b2f156?fm=jpg&q=70&w=400&auto=format&fit=crop",
    status: "available",
    subtypes: ["Walk-in", "Reservations", "Events", "Delivery"],
    defaultSubtypes: ["Walk-in"],
  },
  {
    id: "hotel",
    label: "Hotel",
    emoji: "🏨",
    image: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?fm=jpg&q=70&w=400&auto=format&fit=crop",
    status: "soon",
  },
  {
    id: "clinic",
    label: "Clinic",
    emoji: "🏥",
    image: "https://images.unsplash.com/photo-1581982231900-6a1a46b744c9?fm=jpg&q=70&w=400&auto=format&fit=crop",
    status: "soon",
  },
  {
    id: "events",
    label: "Ticketing & Events",
    emoji: "🎫",
    image: "https://images.unsplash.com/photo-1758550445758-165aeab5b26e?fm=jpg&q=70&w=400&auto=format&fit=crop",
    status: "soon",
  },
];

export default function EnflowChooseIndustryStep({ onBack, onContinue }) {
  const [selectedId, setSelectedId] = useState("restaurant");
  const selected = INDUSTRIES.find((i) => i.id === selectedId);
  const [subtypes, setSubtypes] = useState(selected.defaultSubtypes || []);
  const [brokenImages, setBrokenImages] = useState({});
  const [comingSoonMsg, setComingSoonMsg] = useState("");
  const timeoutRef = useRef(null);

  function selectIndustry(industry) {
    if (industry.status === "soon") {
      setComingSoonMsg(`${industry.label} is coming soon — we'll let you know when it's ready.`);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setComingSoonMsg(""), 2500);
      return;
    }
    setSelectedId(industry.id);
    setSubtypes(industry.defaultSubtypes || []);
    setComingSoonMsg("");
  }

  function toggleSubtype(tag) {
    setSubtypes((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function handleContinue() {
    onContinue?.({ industry: selectedId, subtypes });
  }

  return (
    <div className="efw-page">
      <style>{`
        .efw-page {
          --bg: #0E0B08;
          --surface: #181109;
          --border: #4A2F18;
          --border-soft: #2E1D0F;
          --accent: #B5631F;
          --accent-light: #D88C4C;
          --success: #5FA86A;
          --danger: #C25A4E;
          --text: #F5EEE3;
          --text-muted: #A99884;
          --text-faint: #6E6052;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          font-family: -apple-system, "Inter", "Segoe UI", Arial, sans-serif;
          display: flex;
          justify-content: center;
          padding: 32px 16px 56px;
          box-sizing: border-box;
        }
        .efw-shell { width: 100%; max-width: 880px; }
        .efw-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
        .efw-brand { display: flex; align-items: center; gap: 10px; }
        .efw-logo-mark { width: 30px; height: 30px; border: 1.5px dashed var(--accent-light); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--accent-light); transform: rotate(8deg); }
        .efw-brand-name { font-weight: 700; font-size: 16px; letter-spacing: 0.02em; }
        .efw-brand-sub { font-size: 10px; color: var(--text-faint); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 1px; }
        .efw-header-links { display: flex; align-items: center; gap: 20px; }
        .efw-link-btn { background: none; border: none; color: var(--text-muted); font-size: 13px; cursor: pointer; padding: 4px 2px; }
        .efw-link-btn:hover, .efw-link-btn:focus-visible { color: var(--text); outline: none; text-decoration: underline; }

        .efw-progress-row { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); margin-bottom: 8px; }
        .efw-progress-track { height: 4px; background: var(--border-soft); border-radius: 999px; overflow: hidden; margin-bottom: 28px; }
        .efw-sticky-header { position: sticky; top: 0; z-index: 30; background: var(--bg); padding-bottom: 4px; }
        .efw-progress-fill { height: 100%; width: 45%; background: linear-gradient(90deg, var(--accent), var(--accent-light)); border-radius: 999px; }

        .efw-title { font-size: 26px; font-weight: 700; margin: 0 0 6px; }
        .efw-subtitle { font-size: 14px; color: var(--text-muted); margin: 0 0 24px; }

        .efw-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 22px; }
        @media (max-width: 760px) { .efw-grid { grid-template-columns: 1fr; } }

        .efw-card { position: relative; border: 1px solid var(--border); border-radius: 16px; background: var(--surface); padding: 14px; cursor: pointer; transition: border-color 0.15s ease, background 0.15s ease; }
        .efw-card.selected { border-color: var(--accent-light); background: rgba(216,140,76,0.07); }
        .efw-card.soon { cursor: not-allowed; opacity: 0.6; }
        .efw-card-thumb { height: 92px; border-radius: 10px; background: var(--bg); display: flex; align-items: center; justify-content: center; font-size: 34px; margin-bottom: 12px; border: 1px solid var(--border-soft); overflow: hidden; }
        .efw-card-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .efw-card-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
        .efw-card-label { font-size: 14px; font-weight: 700; }
        .efw-badge { font-size: 10px; font-weight: 700; letter-spacing: 0.04em; padding: 3px 8px; border-radius: 999px; white-space: nowrap; }
        .efw-badge.available { background: rgba(216,140,76,0.15); color: var(--accent-light); }
        .efw-badge.soon { background: rgba(110,96,82,0.2); color: var(--text-faint); display: flex; align-items: center; gap: 4px; }
        .efw-card-status { font-size: 12px; color: var(--text-faint); margin-top: 4px; }
        .efw-card-selected-tag { font-size: 11.5px; color: var(--success); display: flex; align-items: center; gap: 4px; margin-top: 6px; font-weight: 600; }

        .efw-soon-msg { font-size: 12.5px; color: var(--accent-light); margin: -6px 0 18px; }

        .efw-subtype-card { border: 1px solid var(--border); border-radius: 16px; padding: 18px 20px; margin-bottom: 28px; }
        .efw-subtype-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px; }
        .efw-pill-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .efw-pill { border: 1px solid var(--border); border-radius: 999px; padding: 7px 14px; font-size: 12.5px; color: var(--text); background: transparent; cursor: pointer; transition: background 0.15s ease, border-color 0.15s ease; }
        .efw-pill.active { background: linear-gradient(180deg, var(--accent-light), var(--accent)); color: #1B1108; border-color: var(--accent-light); font-weight: 600; }
        .efw-pill:hover:not(.active) { border-color: var(--accent-light); }

        .efw-footer-nav { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
        .efw-btn { border-radius: 12px; padding: 11px 22px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; border: 1px solid transparent; transition: opacity 0.15s ease, transform 0.05s ease; }
        .efw-btn:active { transform: scale(0.99); }
        .efw-btn:focus-visible { outline: 2px solid var(--accent-light); outline-offset: 2px; }
        .efw-btn-ghost { background: transparent; color: var(--text-muted); border-color: var(--border); }
        .efw-btn-ghost:hover { color: var(--text); border-color: var(--accent-light); }
        .efw-btn-forward { background: linear-gradient(180deg, var(--accent-light), var(--accent)); color: #1B1108; }
        .efw-btn-forward:hover { opacity: 0.92; }
      `}</style>

      <div className="efw-shell">
        <div className="efw-sticky-header">
          <header className="efw-header">
            <div className="efw-brand">
              <div className="efw-logo-mark"><Icon name="sparkle" size={15} /></div>
              <div>
                <div className="efw-brand-name">ENFLOW</div>
                <div className="efw-brand-sub">Powered by ZaraAI</div>
              </div>
            </div>
            <div className="efw-header-links">
              <button className="efw-link-btn" type="button">Need help?</button>
              <button className="efw-link-btn" type="button">Save &amp; exit</button>
            </div>
          </header>

          <div className="efw-progress-row">
            <span>Step 5 of 11 · Choose Industry</span>
            <span>45%</span>
          </div>
          <div className="efw-progress-track">
            <div className="efw-progress-fill" />
          </div>
        </div>

        <h1 className="efw-title">What kind of business are you running?</h1>
        <p className="efw-subtitle">Restaurant is selected by default — Enflow's first vertical.</p>

        <div className="efw-grid">
          {INDUSTRIES.map((industry) => {
            const isSelected = industry.id === selectedId;
            const isSoon = industry.status === "soon";
            return (
              <div
                key={industry.id}
                className={`efw-card ${isSelected ? "selected" : ""} ${isSoon ? "soon" : ""}`}
                onClick={() => selectIndustry(industry)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
              >
                <div className="efw-card-thumb">
                  {industry.image && !brokenImages[industry.id] ? (
                    <img
                      src={industry.image}
                      alt={`${industry.label} venue`}
                      loading="lazy"
                      onError={() => setBrokenImages((b) => ({ ...b, [industry.id]: true }))}
                    />
                  ) : (
                    industry.emoji
                  )}
                </div>
                <div className="efw-card-row">
                  <span className="efw-card-label">{industry.label}</span>
                  {isSoon ? (
                    <span className="efw-badge soon"><Icon name="lock" size={11} /> Coming soon</span>
                  ) : (
                    <span className="efw-badge available">Available</span>
                  )}
                </div>
                <div className="efw-card-status">{isSoon ? "Working in beta" : "Available"}</div>
                {isSelected && (
                  <div className="efw-card-selected-tag">
                    <Icon name="check" size={12} /> Selected
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {comingSoonMsg && <p className="efw-soon-msg">{comingSoonMsg}</p>}

        {selected.subtypes && (
          <div className="efw-subtype-card">
            <div className="efw-subtype-label">Sub-type ({selected.label})</div>
            <div className="efw-pill-row">
              {selected.subtypes.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`efw-pill ${subtypes.includes(tag) ? "active" : ""}`}
                  onClick={() => toggleSubtype(tag)}
                  aria-pressed={subtypes.includes(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="efw-footer-nav">
          <button className="efw-btn efw-btn-ghost" type="button" onClick={onBack}>
            <Icon name="back" size={16} /> Back
          </button>
          <button className="efw-btn efw-btn-forward" type="button" onClick={handleContinue}>
            Continue <Icon name="forward" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
