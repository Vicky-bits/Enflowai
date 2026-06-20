import React from "react";
import OnboardingFlow from "./OnboardingFlow";

/* ======================================================================
   App — top-level entry point.

   Mounts OnboardingFlow (Steps 1–5) and receives the final merged
   formData once Step 5's Continue fires. Right now that just logs to
   console — wire it to a real API call, router push to Step 6, etc.
   when that's ready.
   ====================================================================== */

export default function App() {
  function handleOnboardingComplete(formData) {
    console.log("Onboarding steps 1–5 complete. Collected data:", formData);
    // Example next steps once ready:
    //   - POST formData to your backend
    //   - navigate to "/onboarding/step-6"
  }

  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
}
