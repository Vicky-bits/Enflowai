import EnflowOnboardingFlow from "./EnflowOnboardingFlow";

function App() {
  return (
    <EnflowOnboardingFlow
      onAllStepsComplete={(data) => {
        console.log("All 5 steps done:", data);
        // hand off to Step 6 (Connect Tools) here later
      }}
    />
  );
}

export default App;