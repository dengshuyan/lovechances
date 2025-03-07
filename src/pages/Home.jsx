import { useState } from "react";
import Button from "../components/Button";
import AgeSlider from "../components/AgeSlider";
import CityDropdown from "../components/CityDropdown";
import GenderSelect from "../components/GenderSelect";
import SingleSelect from "../components/SingleSelect";
import { Typography } from "@mui/material";
import ErrorMessage from "../components/ErrorMessage";
import RangeSlider from "../components/RangeSlider";
import SingleValueSlider from "../components/SingleValueSlider";
import { motion, AnimatePresence } from "framer-motion";

export default function Home({ userData, setUserData, setStep }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [error, setError] = useState("");
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  const validateStep = () => {
    setError(""); // Clear previous error
    
    switch (currentQuestion) {
      case 0:
        if (!userData.location) {
          setError("Please select a city to continue");
          return false;
        }
        break;
      case 1:
        if (!userData.genderPreference || userData.genderPreference.length === 0) {
          setError("Please select at least one gender preference");
          return false;
        }
        break;
      case 2:
        if (!userData.ageRange) {
          setError("Please select an age range");
          return false;
        }
        break;
      case 3:
        if (!userData.education) {
          setError("Please select an education level");
          return false;
        }
        break;
      case 4:
        if (!userData.datingIntent) {
          setError("Please select what you're looking for");
          return false;
        }
        break;
      case 5:
        if (!userData.looksPreference) {
          setError("Please select how important looks are to you");
          return false;
        }
        break;
      case 6:
        // Remove validation for attractiveness since it has a default value
        break;
      case 7:
        if (!userData.socialSkills) {
          setError("Please select your social skills level");
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setDirection(1);
      if (currentQuestion < 7) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setStep(2); // Move to results page
      }
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const variants = {
    enter: (direction) => ({
      y: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      y: 0,
      opacity: 1
    },
    exit: (direction) => ({
      y: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-20 pt-6 md:pt-0 flex-grow">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-16 lg:gap-20 md:min-h-screen md:items-center">
          {/* Left Column - Narrower (4/12 columns) */}
          <div className="md:col-span-4 flex flex-col">
            <Typography variant="h1">
              What are your REAL chances of finding love?
            </Typography>
            <Typography variant="subtitle1">
              We're using the Drake Equation—originally designed to estimate the odds of finding life in the universe—to help you calculate your chances of finding real love in life.
            </Typography>
          </div>

          {/* Right Column - Wider (8/12 columns) */}
          <div className="md:col-span-8 flex flex-col space-y-8 md:space-y-12">
            <div className="space-y-4">
              <div style={{ minHeight: "300px", position: "relative", display: "flex", alignItems: "center" }}>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentQuestion}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      y: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    style={{ position: "absolute", width: "100%" }}
                  >
                    {currentQuestion === 0 && (
                      <CityDropdown 
                        onSelect={(cityData) => setUserData({ ...userData, location: cityData })} 
                      />
                    )}

                    {currentQuestion === 1 && (
                      <GenderSelect 
                        value={userData.genderPreference || []}
                        onChange={(e, newValues) => setUserData({ ...userData, genderPreference: newValues })}
                      />
                    )}

                    {currentQuestion === 2 && (
                      <RangeSlider
                        title="Age between"
                        value={userData.ageRange || [25, 35]}
                        onChange={(e, newValue) => setUserData({ ...userData, ageRange: newValue })}
                        min={18}
                        max={60}
                      />
                    )}

                    {currentQuestion === 3 && (
                      <SingleSelect
                        title="Education Level - does it matter?"
                        options={["Any", "High School", "College+"]}
                        value={userData.education}
                        onChange={(option) => setUserData({ ...userData, education: option })}
                      />
                    )}

                    {currentQuestion === 4 && (
                      <SingleSelect
                        title="What are you looking for?"
                        options={[
                          "Serious Relationship",
                          "Casual Fun",
                          "Still Figuring Out"
                        ]}
                        value={userData.datingIntent}
                        onChange={(option) => setUserData({ ...userData, datingIntent: option })}
                      />
                    )}

                    {currentQuestion === 5 && (
                      <SingleSelect
                        title="How important is looks to you?"
                        options={[
                          "Supermodel Only",
                          "Decent Looking",
                          "Personality Matters More"
                        ]}
                        value={userData.looksPreference}
                        onChange={(option) => setUserData({ ...userData, looksPreference: option })}
                      />
                    )}

                    {currentQuestion === 6 && (
                      <SingleValueSlider
                        title="Well, how attractive do YOU think you are?"
                        value={userData.selfAttractivenessRating || 5}
                        onChange={(e, newValue) => setUserData({ ...userData, selfAttractivenessRating: newValue })}
                        min={1}
                        max={10}
                        customMinLabel="My mom says I'm cute"
                        customMaxLabel="I break necks when I walk by"
                      />
                    )}

                    {currentQuestion === 7 && (
                      <SingleSelect
                        title="And how are your social skills?"
                        options={[
                          "Social butterfly",
                          "Okay",
                          "I make weird eye contact"
                        ]}
                        value={userData.socialSkills}
                        onChange={(option) => setUserData({ ...userData, socialSkills: option })}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {error && <ErrorMessage message={error} />}
            </div>
          </div>
        </div>
      </div>
      
      {/* Fixed bottom button for mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white md:static md:p-0 md:bg-transparent">
        <div className="w-full max-w-[800px] mx-auto">
          <div className="md:flex md:justify-end">
            <div className="w-full md:w-[240px]">
              <Button onClick={handleNext} className="w-full">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}