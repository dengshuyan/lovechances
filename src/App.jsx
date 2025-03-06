import { useState } from "react";
import Home from "./pages/Home";
import Results from "./pages/Results";

function App() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    location: "",
    genderPreference: [],
    ageRange: [25, 35],
    education: "",
    datingIntent: "",
    looksPreference: "",
    selfAttractivenessRating: 5,
    socialSkills: ""
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-[#F5F5F5]">
      {step === 1 ? (
        <Home userData={userData} setUserData={setUserData} setStep={setStep} />
      ) : (
        <Results userData={userData} setUserData={setUserData} setStep={setStep} />
      )}
    </div>
  );
}

export default App;