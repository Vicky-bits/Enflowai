import React, { useState } from "react";

import EnflowWelcomeStep from "./EnflowWelcomeStep";
import EnflowCreateAccountStep from "./EnflowCreateAccountStep";
import EnflowVerifyEmailStep from "./EnflowVerifyEmailStep";
import EnflowBusinessProfileStep from "./EnflowBusinessProfileStep";
import EnflowChooseIndustryStep from "./EnflowChooseIndustryStep";

/* -------------------------------------------------------------------- */
/*  ENFLOW — Onboarding Flow (Steps 1–5)                                 */
/*                                                                        */
/*  Holds the single source of truth for:                                */
/*    - currentStep   (1-5)                                              */
/*    - formData       (accumulated answers from every step so far)      */
/*                                                                        */
/*  Each step component already calls onContinue(data) / onBack() as     */
/*  props — this wrapper just supplies those callbacks, merges the data  */
/*  each step hands back into formData, and decides which step to show.  */
/*                                                                        */
/*  Data flow example: Step 2 (Create Account) captures `workEmail`.     */
/*  Step 3 (Verify Email) needs that email to display "We sent a code    */
/*  to ...". Since formData is shared, we just pass                      */
/*  email={formData.workEmail} into Step 3.                              */
/* -------------------------------------------------------------------- */

const TOTAL_STEPS = 5;

export default function EnflowOnboardingFlow({ onAllStepsComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  function goNext(stepData = {}) {
    setFormData((prev) => ({ ...prev, ...stepData }));

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
    } else {
      // Step 5 finished — hand the full collected data up to the parent,
      // which can then route to Step 6 (Connect Tools) or wherever next.
      onAllStepsComplete?.({ ...formData, ...stepData });
    }
  }

  function goBack() {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
    // If currentStep is already 1, Back does nothing here —
    // wire this to exit the onboarding flow entirely if needed.
  }

  switch (currentStep) {
    case 1:
      return (
        <EnflowWelcomeStep
          onBack={goBack}
          onContinue={goNext}
        />
      );

    case 2:
      return (
        <EnflowCreateAccountStep
          onBack={goBack}
          onContinue={goNext}
        />
      );

    case 3:
      return (
        <EnflowVerifyEmailStep
          email={formData.workEmail || "you@yourrestaurant.com"}
          onBack={goBack}
          onContinue={goNext}
          onChangeEmail={() => setCurrentStep(2)}
          onResend={() => console.log("[API] resend OTP to", formData.workEmail)}
          onSkip={() => console.log("[Flow] email verification skipped")}
        />
      );

    case 4:
      return (
        <EnflowBusinessProfileStep
          onBack={goBack}
          onContinue={goNext}
        />
      );

    case 5:
      return (
        <EnflowChooseIndustryStep
          onBack={goBack}
          onContinue={goNext}
        />
      );

    default:
      return null;
  }
}
