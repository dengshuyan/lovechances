import calculateMatches from "../utils/calculateMatches";
import Button from "../components/Button";
import { Typography } from "@mui/material";

export default function Results({ userData, setUserData, setStep }) {
  const estimatedMatches = calculateMatches(userData);

  // Extract just the city name from the location
  const getCityName = (location) => {
    if (!location || !location.name) return "";
    
    // Split by comma and take the first part (city name)
    return location.name.split(',')[0].trim();
  };

  const getMatchMessage = (percentage) => {
    if (percentage >= 5) {
      return "You have plenty of fish in the sea! Maybe stop overthinking it?";
    } else if (percentage >= 1) {
      return "Not bad! Love might be just a few coffee dates away.";
    } else if (percentage >= 0.1) {
      return "Oof… It's giving 'needle in a haystack.' Maybe it's time to rethink one of your filters?";
    } else {
      return "Uh… have you considered moving?";
    }
  };

  const handleStartOver = () => {
    // Reset all user data to initial state
    setUserData({
      location: "",
      genderPreference: [],
      ageRange: [25, 35],
      education: "",
      datingIntent: "",
      looksPreference: "",
      selfAttractivenessRating: 5,
      socialSkills: ""
    });
    setStep(1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[800px] mx-auto px-4 sm:px-6 md:px-20 lg:px-20">
        <div className="text-left space-y-6">
          <Typography variant="h1" className="leading-relaxed">
            In {getCityName(userData?.location)}, there are approximately{' '}
            <Typography component="span" variant="h1" className="font-bold">
              {estimatedMatches.totalMatches.toLocaleString()}
            </Typography>{' '}
            people who could be your true love, giving you a{' '}
            <Typography component="span" variant="h1" className="font-bold">
              {estimatedMatches.percentage}%
            </Typography>{' '}
            chance of finding them.
          </Typography>

          <Typography variant="caption" className="block">
            {getMatchMessage(estimatedMatches.percentage)}
          </Typography>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
            <Button 
              variant="contained"
              onClick={() => {/* Add share functionality */}}
              className="w-[228px]"
            >
              Share This Site
            </Button>
            <Button 
              variant="outlined"
              onClick={handleStartOver}
              className="w-[228px]"
            >
              Start Over
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}