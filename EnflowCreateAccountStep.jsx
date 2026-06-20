import React, { useState, useEffect, useMemo } from "react";

/* -------------------------------------------------------------------- */
/*  ENFLOW — Onboarding Step 2 of 11: Create your account                */
/*  Layout: wireframe's 2-column field grid (collapses to 1 col on       */
/*  small screens, same breakpoint as Step 1).                           */
/*  Content: Figma's trust card + password strength meter.               */
/*  Fix: the "We use this for order alerts only." helper was duplicated  */
/*  under both Phone and Password in Figma — it only makes sense for     */
/*  Phone, so it now appears there only.                                 */
/* -------------------------------------------------------------------- */

const TRUST_POINTS = [
  "Takes under 60 seconds",
  "Cancel anytime, no lock-in",
  "WhatsApp updates (optional)",
];

/* Dial codes for Enflow's launch markets. Nigeria first and pre-selected
   by default, per the designer note ("Nigeria-first") — this is the
   "autofill" the country selector starts with, rather than a blank field. */
const COUNTRY_CODES = [
  { iso: "NG", label: "Nigeria", dial: "+234", flag: "🇳🇬" },
  { iso: "GH", label: "Ghana", dial: "+233", flag: "🇬🇭" },
  { iso: "KE", label: "Kenya", dial: "+254", flag: "🇰🇪" },
  { iso: "ZA", label: "South Africa", dial: "+27", flag: "🇿🇦" },
  { iso: "US", label: "United States", dial: "+1", flag: "🇺🇸" },
  { iso: "GB", label: "United Kingdom", dial: "+44", flag: "🇬🇧" },
];

function Icon({ name, size = 16 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none" };
  switch (name) {
    case "sparkle":
      return (
        <svg {...common}>
          <path d="M12 2l1.8 5.6L19.4 9.4 13.8 11.2 12 16.8 10.2 11.2 4.6 9.4 10.2 7.6 12 2z" fill="currentColor" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path
            d="M12 3l7 3v5c0 5-3.2 8.4-7 10-3.8-1.6-7-5-7-10V6l7-3z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M9 12l2.2 2.2L15.5 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M4.5 12.5l4.5 4.5L19.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

/* --- password strength: 0 none, 1 weak, 2 medium, 3 strong --- */
function getPasswordStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 3);
}

const STRENGTH_META = [
  { label: "", color: "var(--border-soft)" },
  { label: "Weak", color: "#C25A4E" },
  { label: "Medium", color: "#D9A23B" },
  { label: "Strong", color: "#5FA86A" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({ label, optional, error, children }) {
  return (
    <div className="efw-field">
      <div className="efw-field-label-row">
        <label className="efw-label">{label}</label>
        {optional && <span className="efw-optional">Optional</span>}
      </div>
      {children}
      {error ? <p className="efw-error-text">{error}</p> : null}
    </div>
  );
}

export default function EnflowCreateAccountStep({ onBack, onContinue }) {
  const [values, setValues] = useState({ fullName: "", workEmail: "", phone: "", password: "" });
  const [phoneCountry, setPhoneCountry] = useState("NG");
  const [agreed, setAgreed] = useState(false);
  const [touched, setTouched] = useState({});
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved

  const strength = useMemo(() => getPasswordStrength(values.password), [values.password]);
  const meta = STRENGTH_META[strength];

  useEffect(() => {
    const hasContent = values.fullName || values.workEmail || values.phone || values.password;
    if (!hasContent) return;
    setSaveState("saving");
    const t = setTimeout(() => setSaveState("saved"), 700);
    return () => clearTimeout(t);
  }, [values]);

  function update(field, val) {
    setValues((v) => ({ ...v, [field]: val }));
  }
  function blur(field) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  const errors = {
    fullName: !values.fullName.trim() ? "Enter your full name" : "",
    workEmail: !values.workEmail.trim()
      ? "Enter your work email"
      : !EMAIL_RE.test(values.workEmail)
      ? "Enter a valid email address"
      : "",
    password: !values.password
      ? "Create a password"
      : values.password.length < 6
      ? "Use at least 6 characters"
      : "",
    agreed: !agreed ? "You need to agree to continue" : "",
  };
  const isValid = !errors.fullName && !errors.workEmail && !errors.password && !errors.agreed;

  function handleContinue() {
    setTouched({ fullName: true, workEmail: true, password: true, agreed: true });
    if (!isValid) return;
    const dial = COUNTRY_CODES.find((c) => c.iso === phoneCountry)?.dial || "";
    const fullPhone = values.phone.trim() ? `${dial} ${values.phone.trim()}` : "";
    onContinue?.({ ...values, phone: fullPhone, phoneCountry, agreed });
  }

  const show = (field) => touched[field] && errors[field];

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
        .efw-sticky-header { position: sticky; top: 0; z-index: 30; background: var(--bg); padding-bottom: 4px; }
        .efw-progress-fill { height: 100%; width: 18%; background: linear-gradient(90deg, var(--accent), var(--accent-light)); border-radius: 999px; transition: width 0.3s ease; }

        .efw-title { font-size: 26px; font-weight: 700; margin: 0 0 6px; }
        .efw-subtitle { font-size: 14px; color: var(--text-muted); margin: 0 0 24px; }

        .efw-form-card { border: 1px solid var(--border); border-radius: 18px; background: var(--surface); padding: 24px; margin-bottom: 20px; }
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

        .efw-phone-group { display: flex; align-items: stretch; background: #120D07; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
        .efw-phone-group:focus-within { border-color: var(--accent-light); }
        .efw-phone-code-select { appearance: none; background: transparent; border: none; border-right: 1px solid var(--border); color: var(--text); font-size: 14px; padding: 11px 8px; cursor: pointer; flex-shrink: 0; max-width: 96px; }
        .efw-phone-code-select:focus { outline: none; }
        .efw-phone-code-select option { background: #1B1108; color: var(--text); }
        .efw-phone-number-input { flex: 1; min-width: 0; border: none; background: transparent; padding: 11px 13px; font-size: 14px; color: var(--text); }
        .efw-phone-number-input::placeholder { color: var(--text-faint); }
        .efw-phone-number-input:focus { outline: none; }

        .efw-strength { margin: -4px 0 18px; }
        .efw-strength-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
        .efw-strength-label { font-size: 11.5px; color: var(--text-faint); }
        .efw-strength-tier { font-size: 11.5px; font-weight: 600; }
        .efw-strength-track { display: flex; gap: 6px; }
        .efw-strength-seg { height: 5px; flex: 1; border-radius: 999px; background: var(--border-soft); transition: background 0.2s ease; }

        .efw-checkbox-row { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
        .efw-checkbox-box { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; color: #0B0805; transition: background 0.15s ease, border-color 0.15s ease; }
        .efw-checkbox-box.checked { background: var(--success); border-color: var(--success); }
        .efw-checkbox-text { font-size: 13px; color: var(--text-muted); }
        .efw-checkbox-text u { color: var(--accent-light); text-decoration: underline; }

        .efw-trust-card { border: 1px solid var(--border); border-radius: 16px; padding: 18px 20px; margin-bottom: 28px; }
        .efw-trust-header { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 700; color: var(--accent-light); margin-bottom: 2px; }
        .efw-trust-sub { font-size: 11.5px; color: var(--text-faint); margin: 0 0 12px 26px; }
        .efw-trust-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .efw-trust-list li { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }
        .efw-trust-list li svg { color: var(--success); flex-shrink: 0; }

        .efw-footer-nav { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
        .efw-autosave { font-size: 12px; color: var(--text-faint); }
        .efw-btn { border-radius: 12px; padding: 11px 22px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; border: 1px solid transparent; transition: opacity 0.15s ease, transform 0.05s ease; }
        .efw-btn:active { transform: scale(0.99); }
        .efw-btn:focus-visible { outline: 2px solid var(--accent-light); outline-offset: 2px; }
        .efw-btn-ghost { background: transparent; color: var(--text-muted); border-color: var(--border); }
        .efw-btn-ghost:hover { color: var(--text); border-color: var(--accent-light); }
        .efw-btn-forward { background: linear-gradient(180deg, var(--accent-light), var(--accent)); color: #1B1108; }
        .efw-btn-forward:hover { opacity: 0.92; }
        .efw-btn-forward.disabled { opacity: 0.45; cursor: not-allowed; }
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
            <span>Step 2 of 11 · Create Account</span>
            <span>18%</span>
          </div>
          <div className="efw-progress-track">
            <div className="efw-progress-fill" />
          </div>
        </div>

        <h1 className="efw-title">Create your account</h1>
        <p className="efw-subtitle">Takes less than 60 seconds.</p>

        <div className="efw-form-card">
          <div className="efw-row-2">
            <Field label="Full name" error={show("fullName")}>
              <input
                className={`efw-input ${show("fullName") ? "efw-input-error" : ""}`}
                placeholder="e.g. Adaeze Okafor"
                value={values.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                onBlur={() => blur("fullName")}
              />
            </Field>
            <Field label="Work email" error={show("workEmail")}>
              <input
                className={`efw-input ${show("workEmail") ? "efw-input-error" : ""}`}
                placeholder="you@yourrestaurant.com"
                value={values.workEmail}
                onChange={(e) => update("workEmail", e.target.value)}
                onBlur={() => blur("workEmail")}
              />
            </Field>
          </div>

          <div className="efw-row-2">
            <Field label="Phone (WhatsApp)" optional>
              <div className="efw-phone-group">
                <select
                  className="efw-phone-code-select"
                  value={phoneCountry}
                  onChange={(e) => setPhoneCountry(e.target.value)}
                  aria-label="Country code"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.iso} value={c.iso}>
                      {c.flag} {c.dial}
                    </option>
                  ))}
                </select>
                <input
                  className="efw-phone-number-input"
                  placeholder="801 234 5678"
                  inputMode="tel"
                  value={values.phone}
                  onChange={(e) => update("phone", e.target.value.replace(/[^0-9 ]/g, ""))}
                />
              </div>
              <p className="efw-helper">We use this for order alerts only.</p>
            </Field>
            <Field label="Password" error={show("password")}>
              <input
                type="password"
                className={`efw-input ${show("password") ? "efw-input-error" : ""}`}
                placeholder="At least 6 characters"
                value={values.password}
                onChange={(e) => update("password", e.target.value)}
                onBlur={() => blur("password")}
              />
            </Field>
          </div>

          <div className="efw-strength">
            <div className="efw-strength-row">
              <span className="efw-strength-label">Password strength</span>
              {meta.label && <span className="efw-strength-tier" style={{ color: meta.color }}>{meta.label}</span>}
            </div>
            <div className="efw-strength-track">
              {[1, 2, 3].map((seg) => (
                <div
                  key={seg}
                  className="efw-strength-seg"
                  style={{ background: seg <= strength ? meta.color : "var(--border-soft)" }}
                />
              ))}
            </div>
          </div>

          <label className="efw-checkbox-row">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ position: "absolute", opacity: 0, width: 18, height: 18, margin: 0 }}
            />
            <span className={`efw-checkbox-box ${agreed ? "checked" : ""}`}>
              {agreed && <Icon name="check" size={12} />}
            </span>
            <span className="efw-checkbox-text">I agree to the Terms of Service and Privacy Policy</span>
          </label>
          {show("agreed") && <p className="efw-error-text" style={{ marginLeft: 28 }}>{errors.agreed}</p>}
        </div>

        <div className="efw-trust-card">
          <div className="efw-trust-header"><Icon name="shield" size={15} /> Your data, secured</div>
          <p className="efw-trust-sub">PCI-DSS · 256-bit SSL</p>
          <ul className="efw-trust-list">
            {TRUST_POINTS.map((point) => (
              <li key={point}><Icon name="check" size={14} /> {point}</li>
            ))}
          </ul>
        </div>

        <div className="efw-footer-nav">
          <button className="efw-btn efw-btn-ghost" type="button" onClick={onBack}>
            <Icon name="back" size={16} /> Back
          </button>
          <span className="efw-autosave">
            {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Auto-saved" : ""}
          </span>
          <button
            className={`efw-btn efw-btn-forward ${!isValid && Object.keys(touched).length > 0 ? "disabled" : ""}`}
            type="button"
            onClick={handleContinue}
          >
            Continue <Icon name="forward" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
