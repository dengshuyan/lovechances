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
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ParticleVisualization from "../components/ParticleVisualization";
import { calculateMatchPercentage } from "../utils/calculateMatches";

export default function Home({ userData, setUserData, setStep }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [matchPercentage, setMatchPercentage] = useState(100);

  // Calculate match percentage whenever userData changes
  useEffect(() => {
    const newPercentage = calculateMatchPercentage(userData, currentQuestion);
    setMatchPercentage(newPercentage);
  }, [userData, currentQuestion]);

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
        isDisabled = !userData.looksPreference;
        break;
      case 5:
        // Attractiveness has a default value, so always enabled
        isDisabled = false;
        break;
      case 6:
        isDisabled = !userData.socialSkills;
        break;
      default:
        isDisabled = true;
    }
    
    console.log("Setting isNextDisabled to:", isDisabled);
    setIsNextDisabled(isDisabled);
  }, [userData, currentQuestion]);

  const handleNext = () => {
    if (currentQuestion < 6) {
      setDirection(1);
      setCurrentQuestion(prev => prev + 1);
    } else {
      setStep(2); // Move to results page
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setCurrentQuestion(prev => prev - 1);
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
          {/* Left Column - Intro text or Visualization */}
          <div className="md:col-span-4 flex flex-col">
            <AnimatePresence mode="wait">
              {currentQuestion === 0 ? (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h1">
                    What are your REAL chances of finding love?
                  </Typography>
                  <Typography variant="subtitle1">
                    We're using the Drake Equation—originally designed to estimate the odds of finding life in the universe—to help you calculate your chances of finding real love in life.
                  </Typography>
                </motion.div>
              ) : (
                <motion.div
                  key="visualization"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="h-[280px] flex items-center"
                >
                  <ParticleVisualization 
                    currentQuestion={currentQuestion}
                    userData={userData}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Questions */}
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
                    style={{ position: "absolute", width: "100%", height: "100%" }}
                    className={currentQuestion === 0 ? "pt-6" : ""}
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
                      <div className="pt-6">
                        <RangeSlider
                          title="Age between"
                          value={userData.ageRange || [25, 35]}
                          onChange={(e, newValue) => setUserData({ ...userData, ageRange: newValue })}
                          min={18}
                          max={60}
                        />
                      </div>
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

                    {currentQuestion === 5 && (
                      <div className="pt-6">
                        <SingleValueSlider
                          title="Well, how attractive do YOU think you are?"
                          value={userData.selfAttractivenessRating || 5}
                          onChange={(e, newValue) => setUserData({ ...userData, selfAttractivenessRating: newValue })}
                          min={1}
                          max={10}
                          customMinLabel="My mom says I'm cute"
                          customMaxLabel="I break necks when I walk by"
                        />
                      </div>
                    )}

                    {currentQuestion === 6 && (
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
                  <div className="w-[44.5px]">
                    <Button 
                      variant="outlined" 
                      onClick={handleBack} 
                      fullWidth={false}
                      className="w-[44.5px] h-[44.5px] min-w-0 p-0 rounded-full flex items-center justify-center"
                      sx={{
                        borderRadius: '50%',
                        padding: 0,
                        minWidth: '44.5px',
                        width: '44.5px',
                        height: '44.5px',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <ChevronLeftIcon sx={{ fontSize: 20 }} />
                    </Button>
                  </div>
                ) : (
                  <div className="w-[44.5px]">{/* Empty div to maintain layout */}</div>
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
          <div className={`flex ${currentQuestion === 0 ? '' : 'justify-between gap-4'}`}>
            {currentQuestion > 0 && (
              <div className="w-[44.5px]">
                <Button 
                  variant="outlined" 
                  onClick={handleBack} 
                  fullWidth={false}
                  className="w-[44.5px] h-[44.5px] min-w-0 p-0 rounded-full flex items-center justify-center"
                  sx={{
                    borderRadius: '50%',
                    padding: 0,
                    minWidth: '44.5px',
                    width: '44.5px',
                    height: '44.5px',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <ChevronLeftIcon sx={{ fontSize: 20 }} />
                </Button>
              </div>
            )}
            <div className={currentQuestion === 0 ? 'w-full' : 'flex-1'}>
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