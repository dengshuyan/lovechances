import { useState } from "react";
import Home from "./pages/Home";
import Results from "./pages/Results";
import { AnimatePresence, motion } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    location: "",
    genderPreference: [],
    ageRange: [25, 35],
    education: "",
    looksPreference: "",
    selfAttractivenessRating: 5,
    socialSkills: ""
  });

  const pageVariants = {
    initial: {
      opacity: 0
    },
    in: {
      opacity: 1
    },
    out: {
      opacity: 0
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-[#F5F5F5]">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="home"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="w-full"
          >
            <Home userData={userData} setUserData={setUserData} setStep={setStep} />
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="w-full"
          >
            <Results userData={userData} setUserData={setUserData} setStep={setStep} />
          </motion.div>
        )}
      </AnimatePresence>
      <Analytics />
    </div>
  );
}

export default App;