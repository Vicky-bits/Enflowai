import React, { useState, useRef } from "react";

/* -------------------------------------------------------------------- */
/*  ENFLOW — Onboarding Step 4 of 11: Tell us about your business        */
/*  Wireframe gives the 2-col field grid; Figma adds the persona-matched */
/*  placeholders, the select-style dropdowns, and the upload constraints */
/*  (PNG/JPG/SVG, max 2MB). Currency auto-defaults from Country, per the */
/*  designer note, but stays editable.                                   */
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
    case "upload":
      return (
        <svg {...common}>
          <path d="M12 16V4M12 4l-4.5 4.5M12 4l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 16v2.5A1.5 1.5 0 005.5 20h13a1.5 1.5 0 001.5-1.5V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "image":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" />
          <path d="M4 17l5-5 3 3 4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...common}>
          <path d="M7 9.5L12 14.5L17 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

const COUNTRIES = ["Nigeria", "Ghana", "Kenya", "South Africa", "United States", "United Kingdom", "Other"];
const COUNTRY_CURRENCY = {
  Nigeria: "NGN — Naira (₦)",
  Ghana: "GHS — Cedi (₵)",
  Kenya: "KES — Shilling (KSh)",
  "South Africa": "ZAR — Rand (R)",
  "United States": "USD — Dollar ($)",
  "United Kingdom": "GBP — Pound (£)",
  Other: "USD — Dollar ($)",
};
const CURRENCIES = Array.from(new Set(Object.values(COUNTRY_CURRENCY)));
const LOCATIONS = ["1", "2-3", "4-10", "10+"];
const STAFF = ["1-4", "5-10", "11-25", "26-50", "50+"];
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/svg+xml"];
const MAX_BYTES = 2 * 1024 * 1024;

function Select({ value, onChange, options, placeholder }) {
  return (
    <div className="efw-select-wrap">
      <select className="efw-input efw-select" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <Icon name="chevron" size={16} />
    </div>
  );
}

function Field({ label, optional, hint, error, children }) {
  return (
    <div className="efw-field">
      <div className="efw-field-label-row">
        <label className="efw-label">{label}</label>
        {optional && <span className="efw-optional">Optional</span>}
      </div>
      {children}
      {hint ? <p className="efw-helper">{hint}</p> : null}
      {error ? <p className="efw-error-text">{error}</p> : null}
    </div>
  );
}

export default function EnflowBusinessProfileStep({ onBack, onContinue }) {
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState("");
  const [currencyTouchedManually, setCurrencyTouchedManually] = useState(false);
  const [locations, setLocations] = useState("");
  const [staff, setStaff] = useState("");
  const [logo, setLogo] = useState(null); // { name, url, size }
  const [logoError, setLogoError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [touched, setTouched] = useState({});
  const fileInputRef = useRef(null);

  function handleCountryChange(value) {
    setCountry(value);
    if (!currencyTouchedManually) {
      setCurrency(COUNTRY_CURRENCY[value] || "");
    }
  }

  function handleCurrencyChange(value) {
    setCurrency(value);
    setCurrencyTouchedManually(true);
  }

  function validateAndSetFile(file) {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLogoError("Use PNG, JPG or SVG.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setLogoError("File must be 2MB or smaller.");
      return;
    }
    setLogoError("");
    setLogo({ name: file.name, url: URL.createObjectURL(file), size: file.size });
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    validateAndSetFile(e.dataTransfer.files?.[0]);
  }

  function removeLogo() {
    setLogo(null);
    setLogoError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const errors = {
    businessName: !businessName.trim() ? "Enter your business name" : "",
    country: !country ? "Select a country" : "",
    currency: !currency ? "Select a currency" : "",
    locations: !locations ? "Select number of locations" : "",
    staff: !staff ? "Select number of staff" : "",
  };
  const isValid = Object.values(errors).every((e) => !e);
  const show = (field) => touched[field] && errors[field];

  function handleContinue() {
    setTouched({ businessName: true, country: true, currency: true, locations: true, staff: true });
    if (!isValid) return;
    onContinue?.({ businessName, website, country, currency, locations, staff, logo });
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
        .efw-shell { width: 100%; max-width: 760px; }
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
        .efw-progress-fill { height: 100%; width: 36%; background: linear-gradient(90deg, var(--accent), var(--accent-light)); border-radius: 999px; }

        .efw-title { font-size: 26px; font-weight: 700; margin: 0 0 6px; }
        .efw-subtitle { font-size: 14px; color: var(--text-muted); margin: 0 0 24px; }

        .efw-form-card { border: 1px solid var(--border); border-radius: 18px; background: var(--surface); padding: 24px; margin-bottom: 28px; }
        .efw-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 600px) { .efw-row-2 { grid-template-columns: 1fr; } }

        .efw-field { margin-bottom: 18px; }
        .efw-field-label-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
        .efw-label { font-size: 13px; font-weight: 600; color: var(--text); }
        .efw-optional { font-size: 11px; color: var(--text-faint); }
        .efw-input { width: 100%; box-sizing: border-box; background: #120D07; border: 1px solid var(--border); border-radius: 10px; padding: 11px 13px; font-size: 14px; color: var(--text); }
        .efw-input::placeholder { color: var(--text-faint); }
        .efw-input:focus { outline: none; border-color: var(--accent-light); }
        .efw-input-error { border-color: var(--danger); }
        .efw-helper { font-size: 11.5px; color: var(--text-faint); margin: 6px 0 0; }
        .efw-error-text { font-size: 11.5px; color: var(--danger); margin: 6px 0 0; }

        .efw-select-wrap { position: relative; display: flex; align-items: center; }
        .efw-select { appearance: none; cursor: pointer; padding-right: 36px; }
        .efw-select-wrap svg { position: absolute; right: 12px; color: var(--text-faint); pointer-events: none; }
        .efw-select option { background: #1B1108; color: var(--text); }

        .efw-upload-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; display: block; }
        .efw-dropzone { border: 1.5px dashed var(--border); border-radius: 14px; padding: 28px 16px; text-align: center; cursor: pointer; transition: border-color 0.15s ease, background 0.15s ease; }
        .efw-dropzone.drag { border-color: var(--accent-light); background: rgba(216,140,76,0.06); }
        .efw-dropzone-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(216,140,76,0.12); color: var(--accent-light); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; }
        .efw-dropzone-text { font-size: 13.5px; color: var(--accent-light); font-weight: 600; }
        .efw-dropzone-sub { font-size: 11.5px; color: var(--text-faint); margin-top: 4px; }
        .efw-logo-preview { display: flex; align-items: center; gap: 12px; border: 1px solid var(--border); border-radius: 14px; padding: 12px 16px; }
        .efw-logo-thumb { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; background: #120D07; flex-shrink: 0; }
        .efw-logo-meta { flex: 1; font-size: 13px; color: var(--text); }
        .efw-logo-meta span { display: block; font-size: 11.5px; color: var(--text-faint); }
        .efw-logo-remove { background: none; border: none; color: var(--text-faint); cursor: pointer; padding: 4px; }
        .efw-logo-remove:hover { color: var(--danger); }

        .efw-footer-nav { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
        .efw-autosave { font-size: 12px; color: var(--text-faint); }
        .efw-btn { border-radius: 12px; padding: 11px 22px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; border: 1px solid transparent; transition: opacity 0.15s ease, transform 0.05s ease; }
        .efw-btn:active { transform: scale(0.99); }
        .efw-btn:focus-visible { outline: 2px solid var(--accent-light); outline-offset: 2px; }
        .efw-btn-ghost { background: transparent; color: var(--text-muted); border-color: var(--border); }
        .efw-btn-ghost:hover { color: var(--text); border-color: var(--accent-light); }
        .efw-btn-forward { background: linear-gradient(180deg, var(--accent-light), var(--accent)); color: #1B1108; }
        .efw-btn-forward:hover { opacity: 0.92; }
      `}</style>

      <div className="efw-shell">
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
          <span>Step 4 of 11 · Business Profile</span>
          <span>36%</span>
        </div>
        <div className="efw-progress-track">
          <div className="efw-progress-fill" />
        </div>

        <h1 className="efw-title">Tell us about your business</h1>
        <p className="efw-subtitle">We'll tailor Enflow to your operations.</p>

        <div className="efw-form-card">
          <div className="efw-row-2">
            <Field label="Business name" error={show("businessName")}>
              <input
                className={`efw-input ${show("businessName") ? "efw-input-error" : ""}`}
                placeholder="e.g. Adaeze's Kitchen"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, businessName: true }))}
              />
            </Field>
            <Field label="Website" optional>
              <input
                className="efw-input"
                placeholder="www.adaezekitchen.ng"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </Field>
          </div>

          <div className="efw-row-2">
            <Field label="Country" error={show("country")}>
              <Select value={country} onChange={handleCountryChange} options={COUNTRIES} placeholder="Select country" />
            </Field>
            <Field label="Currency" error={show("currency")} hint="Defaults from country.">
              <Select value={currency} onChange={handleCurrencyChange} options={CURRENCIES} placeholder="Select currency" />
            </Field>
          </div>

          <div className="efw-row-2">
            <Field label="Number of locations" error={show("locations")} hint="Drives plan recommendation later.">
              <Select value={locations} onChange={setLocations} options={LOCATIONS} placeholder="Select" />
            </Field>
            <Field label="Number of staff" error={show("staff")}>
              <Select value={staff} onChange={setStaff} options={STAFF} placeholder="Select" />
            </Field>
          </div>

          <span className="efw-upload-label">Logo upload</span>
          {logo ? (
            <div className="efw-logo-preview">
              <img src={logo.url} alt="Uploaded logo" className="efw-logo-thumb" />
              <div className="efw-logo-meta">
                {logo.name}
                <span>{(logo.size / 1024).toFixed(0)} KB</span>
              </div>
              <button className="efw-logo-remove" type="button" onClick={removeLogo} aria-label="Remove logo">
                <Icon name="close" size={16} />
              </button>
            </div>
          ) : (
            <div
              className={`efw-dropzone ${dragOver ? "drag" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
            >
              <div className="efw-dropzone-icon"><Icon name="upload" size={18} /></div>
              <div className="efw-dropzone-text">Drag &amp; drop or click to upload</div>
              <div className="efw-dropzone-sub">PNG, JPG or SVG · max 2MB</div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.svg"
                style={{ display: "none" }}
                onChange={(e) => validateAndSetFile(e.target.files?.[0])}
              />
            </div>
          )}
          {logoError && <p className="efw-error-text">{logoError}</p>}
        </div>

        <div className="efw-footer-nav">
          <button className="efw-btn efw-btn-ghost" type="button" onClick={onBack}>
            <Icon name="back" size={16} /> Back
          </button>
          <span className="efw-autosave">Auto-saved</span>
          <button className="efw-btn efw-btn-forward" type="button" onClick={handleContinue}>
            Continue <Icon name="forward" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
