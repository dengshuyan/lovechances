import { useState, useEffect } from "react";
import Button from "../components/Button";
import AgeSlider from "../components/AgeSlider";
import CityDropdown from "../components/CityDropdown";
import GenderSelect from "../components/GenderSelect";
import SingleSelect from "../components/SingleSelect";
import { Typography } from "@mui/material";
import RangeSlider from "../components/RangeSlider";
import SingleValueSlider from "../components/SingleValueSlider";
import { motion, AnimatePresence } from "framer-motion";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Home({ userData, setUserData, setStep }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  // Check if current step is valid whenever userData or currentQuestion changes
  useEffect(() => {
    // Log the current state to help debug
    console.log("Current question:", currentQuestion);
    console.log("Current userData:", userData);
    
    let isDisabled = true;
    
    switch (currentQuestion) {
      case 0:
        isDisabled = !userData.location;
        break;
      case 1:
        isDisabled = !userData.genderPreference || userData.genderPreference.length === 0;
        break;
      case 2:
        isDisabled = !userData.ageRange;
        break;
      case 3:
        isDisabled = !userData.education;
        break;
      case 4:
        isDisabled = !userData.datingIntent;
        break;
      case 5:
        isDisabled = !userData.looksPreference;
        break;
      case 6:
        // Attractiveness has a default value, so always enabled
        isDisabled = false;
        break;
      case 7:
        isDisabled = !userData.socialSkills;
        break;
      default:
        isDisabled = true;
    }
    
    console.log("Setting isNextDisabled to:", isDisabled);
    setIsNextDisabled(isDisabled);
  }, [userData, currentQuestion]);

  const handleNext = () => {
    if (currentQuestion < 7) {
      setDirection(1);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep(2); // Move to results page
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
    <div className="min-h-screen w-full flex flex-col justify-center">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-20 pt-6 md:pt-0">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-16 lg:gap-20 md:items-start">
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
              <div style={{ minHeight: "300px", position: "relative", display: "flex", alignItems: "flex-start" }}>
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
              
              {/* Desktop-only buttons */}
              <div className="hidden md:flex md:justify-between md:items-center mt-6">
                {currentQuestion > 0 ? (
                  <div className="w-[60px]">
                    <Button 
                      variant="outlined" 
                      onClick={handleBack} 
                      className="w-full min-w-0 p-2"
                    >
                      <ArrowBackIcon />
                    </Button>
                  </div>
                ) : (
                  <div className="w-[60px]">{/* Empty div to maintain layout */}</div>
                )}
                <div className="w-[240px]">
                <Button 
                onClick={handleNext} 
                className="w-full"
                disabled={isNextDisabled}
              >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile-only fixed bottom buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white md:hidden">
        <div className="w-full max-w-[800px] mx-auto">
          <div className="flex justify-between gap-4">
            {currentQuestion > 0 ? (
              <div className="w-[60px]">
                <Button 
                  variant="outlined" 
                  onClick={handleBack} 
                  className="w-full min-w-0 p-2"
                >
                  <ArrowBackIcon />
                </Button>
              </div>
            ) : (
              <div className="w-[60px]">{/* Empty div to maintain layout */}</div>
            )}
            <div className="flex-1">
            <Button 
                onClick={handleNext} 
                className="w-full"
                disabled={isNextDisabled}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}