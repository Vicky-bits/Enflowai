import React, { useState, useEffect, useRef, useCallback } from "react";

/* -------------------------------------------------------------------- */
/*  ENFLOW — Onboarding Step 3 of 11: Verify your email                  */
/*  Wireframe gives structure (6 OTP boxes, resend timer, Back/Continue) */
/*  Figma adds the "Check your inbox" card + Change email link, which is */
/*  which is exactly what the designer note asks for, so both are kept. */
/*  Fix: Figma's subtitle read "We sent a 6-digit code to you            */
/*  {email}" (missing a word) — using the wireframe's cleaner phrasing.  */
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
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3.5 6.5l8.5 6 8.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

const CODE_LENGTH = 6;
const RESEND_SECONDS = 59;

function formatTime(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function EnflowVerifyEmailStep({
  email = "you@yourrestaurant.com",
  onBack,
  onContinue,
  onChangeEmail,
  onResend,
}) {
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [resentNote, setResentNote] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds <= 0]);

  const isComplete = digits.every((d) => d !== "");

  function setDigitAt(index, value) {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleChange(index, raw) {
    const value = raw.replace(/[^0-9]/g, "").slice(-1);
    setDigitAt(index, value);
    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setDigitAt(index - 1, "");
    }
  }

  function handlePaste(e) {
    const text = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!text) return;
    e.preventDefault();
    const next = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < Math.min(text.length, CODE_LENGTH); i++) next[i] = text[i];
    setDigits(next);
    const lastIndex = Math.min(text.length, CODE_LENGTH) - 1;
    inputRefs.current[lastIndex]?.focus();
  }

  const flashResent = useCallback(() => {
    setResentNote(true);
    setTimeout(() => setResentNote(false), 2500);
  }, []);

  function handleResend() {
    if (seconds > 0) return;
    setDigits(Array(CODE_LENGTH).fill(""));
    setSeconds(RESEND_SECONDS);
    inputRefs.current[0]?.focus();
    flashResent();
    onResend?.();
  }

  function handleContinue() {
    if (isComplete) {
      onContinue?.({ verified: true, code: digits.join("") });
    }
  }

  const canContinue = isComplete;

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
        .efw-shell { width: 100%; max-width: 640px; }
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
        .efw-progress-fill { height: 100%; width: 27%; background: linear-gradient(90deg, var(--accent), var(--accent-light)); border-radius: 999px; }

        .efw-title { font-size: 26px; font-weight: 700; margin: 0 0 6px; }
        .efw-subtitle { font-size: 14px; color: var(--text-muted); margin: 0 0 24px; }
        .efw-subtitle strong { color: var(--text); font-weight: 600; }

        .efw-otp-card { border: 1px solid var(--border); border-radius: 18px; background: var(--surface); padding: 28px 24px; margin-bottom: 24px; }
        .efw-otp-header { display: flex; align-items: center; gap: 10px; margin-bottom: 22px; }
        .efw-otp-icon { width: 34px; height: 34px; border-radius: 9px; background: rgba(216,140,76,0.12); color: var(--accent-light); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .efw-otp-head-text-title { font-size: 14px; font-weight: 700; }
        .efw-otp-head-text-sub { font-size: 12px; color: var(--text-faint); }

        .efw-otp-boxes { display: flex; gap: 10px; justify-content: center; margin-bottom: 18px; }
        .efw-otp-box { width: 44px; height: 52px; text-align: center; font-size: 20px; font-weight: 700; background: #120D07; border: 1px solid var(--border); border-radius: 10px; color: var(--text); }
        .efw-otp-box:focus { outline: none; border-color: var(--accent-light); }

        .efw-otp-links { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
        .efw-otp-resend { font-size: 12.5px; color: var(--text-faint); }
        .efw-otp-resend.active { color: var(--accent-light); cursor: pointer; background: none; border: none; padding: 0; }
        .efw-otp-link { font-size: 12.5px; color: var(--text-muted); background: none; border: none; cursor: pointer; padding: 0; }
        .efw-otp-link:hover { color: var(--text); text-decoration: underline; }
        .efw-otp-link.warn { color: var(--accent-light); }

        .efw-note { font-size: 12.5px; color: var(--success); margin: 14px 0 0; text-align: center; }

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
            <span>Step 3 of 11 · Verify Email</span>
            <span>27%</span>
          </div>
          <div className="efw-progress-track">
            <div className="efw-progress-fill" />
          </div>
        </div>

        <h1 className="efw-title">Verify your email</h1>
        <p className="efw-subtitle">We sent a 6-digit code to <strong>{email}</strong></p>

        <div className="efw-otp-card">
          <div className="efw-otp-header">
            <div className="efw-otp-icon"><Icon name="mail" size={17} /></div>
            <div>
              <div className="efw-otp-head-text-title">Check your inbox</div>
              <div className="efw-otp-head-text-sub">It usually arrives within 30 seconds</div>
            </div>
          </div>

          <div className="efw-otp-boxes" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                className="efw-otp-box"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                aria-label={`Digit ${i + 1} of ${CODE_LENGTH}`}
              />
            ))}
          </div>

          <div className="efw-otp-links">
            {seconds > 0 ? (
              <span className="efw-otp-resend">Resend code in {formatTime(seconds)}</span>
            ) : (
              <button className="efw-otp-resend active" type="button" onClick={handleResend}>
                Resend code
              </button>
            )}
            <button className="efw-otp-link" type="button" onClick={onChangeEmail}>Change email</button>
          </div>

          {resentNote && <p className="efw-note">New code sent to {email}</p>}
        </div>

        <div className="efw-footer-nav">
          <button className="efw-btn efw-btn-ghost" type="button" onClick={onBack}>
            <Icon name="back" size={16} /> Back
          </button>
          <span className="efw-autosave">Auto-saved</span>
          <button
            className={`efw-btn efw-btn-forward ${!canContinue ? "disabled" : ""}`}
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
          >
            Continue <Icon name="forward" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
