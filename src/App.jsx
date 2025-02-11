import { useState } from "react";
import Home from "./pages/Home";
import Results from "./pages/Results";

function App() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    location: "",
    gender: "",
    ageRange: [25, 35],
    education: "",
    datingIntent: "",
  });

  return (
    <div className="min-h-screen bg-white w-full flex items-center justify-center">
      {step === 1 ? (
        <Home userData={userData} setUserData={setUserData} setStep={setStep} />
      ) : (
        <Results userData={userData} setStep={setStep} />
      )}
    </div>
  );
}

export default App;