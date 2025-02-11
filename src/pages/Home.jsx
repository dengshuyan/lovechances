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

export default function Home({ userData, setUserData, setStep }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [error, setError] = useState("");

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
      if (currentQuestion < 7) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setStep(2); // Move to results page
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full px-6 md:px-40">
        <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between">
          {/* Left Column */}
          <div className="w-full md:w-1/3 text-left space-y-4">
            <Typography variant="h1">
              What are your REAL chances of finding love?
            </Typography>
            <Typography variant="subtitle1">
              We're using the <span className="font-semibold">Drake Equation</span>—originally designed to estimate the odds of finding life in the universe—to help you calculate your chances of finding real love in life.
            </Typography>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-2/3 md:ml-20">
            <div className="w-full">
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
                  customMinLabel="My mom says I’m cute"
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

              {error && <ErrorMessage message={error} />}
              
              <div className="mt-6 flex justify-end">
                <Button onClick={handleNext}>Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}