import React, { useState } from "react";
import EnflowWelcomeStep from "./EnflowWelcomeStep";
import EnflowCreateAccountStep from "./EnflowCreateAccountStep";
import EnflowVerifyEmailStep from "./EnflowVerifyEmailStep";
import EnflowBusinessProfileStep from "./EnflowBusinessProfileStep";
import EnflowChooseIndustryStep from "./EnflowChooseIndustryStep";

/* ======================================================================
   ENFLOW — Onboarding Flow controller (Steps 1–5)

   This component owns two things every step needs but shouldn't own
   itself: which step is showing, and the data collected so far.

   - currentStep moves forward only when a step's own onContinue fires
     (i.e. only after that step's internal validation passes).
   - formData accumulates across steps — each step's onContinue payload
     gets merged in, so by Step 5 you have everything from Steps 2–5.
   - Step 3 (Verify Email) reads the work email typed in Step 2 instead
     of showing a hardcoded placeholder.

   Known limitation: Steps 2, 4, and 5 don't yet re-hydrate their fields
   from formData if you navigate back to them after filling them in —
   they reset to blank. The data is NOT lost (it's still merged in
   formData and will be in the final payload), it just won't visually
   repopulate the inputs. Say the word if you want that wired up too —
   it just means adding an `initialValues` prop to those three step
   components and using it as their useState seed.
   ====================================================================== */

const STEP_META = [
  { id: 1, key: "welcome" },
  { id: 2, key: "account" },
  { id: 3, key: "verify" },
  { id: 4, key: "business" },
  { id: 5, key: "industry" },
];

function ComingSoonStub({ formData, onBack }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0E0B08",
        color: "#F5EEE3",
        fontFamily: "-apple-system, Inter, Segoe UI, Arial, sans-serif",
        display: "flex",
        justifyContent: "center",
        padding: "32px 16px 56px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 640 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          Steps 6–11 aren't built yet
        </h1>
        <p style={{ fontSize: 14, color: "#A99884", marginBottom: 24 }}>
          Everything collected so far made it through Back/Continue intact. Here's the payload Step 5 handed off:
        </p>
        <pre
          style={{
            background: "#181109",
            border: "1px solid #4A2F18",
            borderRadius: 12,
            padding: 16,
            fontSize: 12.5,
            color: "#D88C4C",
            overflowX: "auto",
            marginBottom: 24,
          }}
        >
          {JSON.stringify(formData, null, 2)}
        </pre>
        <button
          type="button"
          onClick={onBack}
          style={{
            background: "transparent",
            color: "#A99884",
            border: "1px solid #4A2F18",
            borderRadius: 12,
            padding: "11px 22px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ← Back to Step 5
        </button>
      </div>
    </div>
  );
}

export default function OnboardingFlow({ onComplete }) {
  const [stepIndex, setStepIndex] = useState(0); // 0-based index into STEP_META
  const [formData, setFormData] = useState({});

  const currentStep = STEP_META[stepIndex]?.id ?? null;

  function goBack() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function goNext(stepData) {
    const merged = { ...formData, ...(stepData || {}) };
    setFormData(merged);

    if (stepIndex >= STEP_META.length - 1) {
      // Past the last built step — hand off to whatever comes after
      // (or, for now, the stub screen below) instead of advancing
      // into a step that doesn't exist.
      onComplete?.(merged);
      setStepIndex(STEP_META.length); // moves into the stub view
      return;
    }
    setStepIndex((i) => i + 1);
  }

  switch (currentStep) {
    case 1:
      return (
        <EnflowWelcomeStep
          // Step 1 has no real "back" destination — there's nothing before
          // Welcome — so onBack is intentionally left unwired here.
          onContinue={() => goNext()}
          onAuth={(method) => goNext({ authMethod: method })}
          onSignIn={() => {
            // Sign-in is a separate flow from onboarding; hook up your
            // router/auth here when that screen exists.
            console.log("Sign in clicked — route to your sign-in screen");
          }}
        />
      );

    case 2:
      return (
        <EnflowCreateAccountStep
          onBack={goBack}
          onContinue={(data) => goNext(data)}
        />
      );

    case 3:
      return (
        <EnflowVerifyEmailStep
          email={formData.workEmail || "you@yourrestaurant.com"}
          onBack={goBack}
          onContinue={(data) => goNext(data)}
          onChangeEmail={goBack}
          onResend={() => console.log("Resend requested for", formData.workEmail)}
        />
      );

    case 4:
      return (
        <EnflowBusinessProfileStep
          onBack={goBack}
          onContinue={(data) => goNext(data)}
        />
      );

    case 5:
      return (
        <EnflowChooseIndustryStep
          onBack={goBack}
          onContinue={(data) => goNext(data)}
        />
      );

    default:
      // stepIndex has moved past Step 5
      return <ComingSoonStub formData={formData} onBack={() => setStepIndex(STEP_META.length - 1)} />;
  }
}
