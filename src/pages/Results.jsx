import { calculateMatchPercentage } from "../utils/calculateMatches";
import Button from "../components/Button";
import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import ParticleVisualization from "../components/ParticleVisualization";

export default function Results({ userData, setUserData, setStep }) {
  // Use the same calculation method as the particle visualization
  const matchPercentage = calculateMatchPercentage(userData, 6); // Use 6 as we want to include all questions
  
  // Calculate the actual number of matches based on the percentage
  const calculateTotalMatches = () => {
    if (!userData || !userData.location) return 0;
    
    // Apply the percentage to the total population
    const totalPopulation = userData.location.population;
    const matches = (totalPopulation * matchPercentage / 100) * 0.4; // Apply 40% single rate
    
    // Ensure we show at least 1 match if there are any matches at all
    // Only show 0 matches if the calculation truly results in 0
    return matches > 0.01 ? Math.max(1, Math.round(matches)) : 0;
  };
  
  const totalMatches = calculateTotalMatches();
  
  // Format percentage to show more decimal places for very small numbers
  const formatPercentage = (percentage) => {
    if (percentage < 0.0001) {
      return percentage.toFixed(6);
    } else if (percentage < 0.01) {
      return percentage.toFixed(4);
    } else if (percentage < 1) {
      return percentage.toFixed(3);
    } else {
      return percentage.toFixed(2);
    }
  };
  
  const formattedPercentage = formatPercentage(matchPercentage);

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
      looksPreference: "",
      selfAttractivenessRating: 5,
      socialSkills: ""
    });
    setStep(1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-[800px] mx-auto px-4 sm:px-6 md:px-20">
        <motion.div 
          className="text-left space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="h-[280px] flex items-center justify-center">
            <ParticleVisualization 
              currentQuestion={6}
              userData={userData}
              resultsMode={true}
              matchPercentage={matchPercentage}
              totalMatches={totalMatches}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography variant="h1" className="leading-relaxed">
              In {getCityName(userData?.location)}, there are approximately{' '}
              <Typography component="span" variant="h1" className="font-bold">
                {totalMatches.toLocaleString()}
              </Typography>{' '}
              people who could be your true love, giving you a{' '}
              <Typography component="span" variant="h1" className="font-bold">
                {formattedPercentage}%
              </Typography>{' '}
              chance of finding them.
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography variant="caption" className="block">
              {getMatchMessage(matchPercentage)}
            </Typography>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4 mt-12"
          >
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
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}