import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const TOTAL_PARTICLES = 500;
const CIRCLE_RADIUS = 120;

// Calculate percentage based on previous selection
const calculateStepPercentage = (userData, currentQuestion) => {
  if (!userData || !userData.location) return 100;
  
  const { demographics } = userData.location;
  let cumulativePercentage = 100;

  // Calculate cumulative effect of all selections up to current question
  for (let step = 1; step <= currentQuestion; step++) {
    let stepMultiplier = 1;

    switch (step) {
      case 1: // Gender selection effect
        if (userData.genderPreference && userData.genderPreference.length > 0) {
          stepMultiplier = userData.genderPreference.reduce((acc, gender) => {
            if (gender === 'Woman') return acc + demographics.female;
            if (gender === 'Man') return acc + demographics.male;
            return acc + 0.1; // Assume 10% for non-binary
          }, 0);
        }
        break;

      case 2: // Age selection effect
        if (userData.ageRange) {
          stepMultiplier = Object.entries(demographics.ageGroups)
            .filter(([range]) => {
              const [min] = range.split('-').map(Number);
              return min >= userData.ageRange[0] && min <= userData.ageRange[1];
            })
            .reduce((acc, [, percentage]) => acc + percentage, 0);
        }
        break;

      case 3: // Education effect
        if (userData.education) {
          if (userData.education === "College+") {
            stepMultiplier = demographics.education.college;
          } else if (userData.education === "High School") {
            stepMultiplier = demographics.education.highschool + demographics.education.college;
          }
        }
        break;

      case 4: // Looks preference effect
        if (userData.looksPreference) {
          switch (userData.looksPreference) {
            case "Supermodel Only":
              stepMultiplier = 0.1; // 10% are very attractive
              break;
            case "Decent Looking":
              stepMultiplier = 0.5; // 50% are decent looking
              break;
            case "Personality Matters More":
              stepMultiplier = 0.8; // 80% might be compatible
              break;
            default:
              stepMultiplier = 1;
          }
        }
        break;

      case 5: // Self attractiveness rating effect
        if (userData.selfAttractivenessRating) {
          stepMultiplier = userData.selfAttractivenessRating / 10;
        }
        break;

      case 6: // Social skills effect
        if (userData.socialSkills) {
          switch (userData.socialSkills) {
            case "Social butterfly":
              stepMultiplier = 0.8;
              break;
            case "Okay":
              stepMultiplier = 0.6;
              break;
            case "I make weird eye contact":
              stepMultiplier = 0.4;
              break;
            default:
              stepMultiplier = 1;
          }
        }
        break;
    }

    // Apply each step's effect to the cumulative percentage
    cumulativePercentage *= stepMultiplier;
    console.log(`Step ${step}: multiplier = ${stepMultiplier}, cumulative = ${cumulativePercentage}`);
  }

  // Return the actual cumulative percentage
  return cumulativePercentage;
};

// Generate initial particle positions
const generateParticles = (initialMatchPercentage = 100) => {
  const particles = [];
  
  // Calculate initial active particles with diminishing returns
  const calculateActiveParticles = (percentage) => {
    if (percentage >= 100) return TOTAL_PARTICLES;
    if (percentage <= 0) return 0;
    
    // Use exponential decay for diminishing returns
    const decayRate = 0.15;
    const normalizedPercentage = percentage / 100;
    // Added a small offset to make changes more visible at low percentages
    const activeParticles = Math.floor(TOTAL_PARTICLES * Math.exp(-decayRate * (1 - normalizedPercentage)) * (0.1 + 0.9 * normalizedPercentage));
    
    return activeParticles;
  };

  const initialActiveParticles = calculateActiveParticles(initialMatchPercentage);
  
  for (let i = 0; i < TOTAL_PARTICLES; i++) {
    // Generate random point in circle using rejection sampling
    let x, y, isInside;
    do {
      x = (Math.random() * 2 - 1) * CIRCLE_RADIUS;
      y = (Math.random() * 2 - 1) * CIRCLE_RADIUS;
      isInside = (x * x + y * y) <= CIRCLE_RADIUS * CIRCLE_RADIUS;
    } while (!isInside);

    // Add some clustering effect by pulling particles toward center
    const distanceFromCenter = Math.sqrt(x * x + y * y);
    const pullToCenter = Math.random() * 0.3;
    x *= (1 - pullToCenter * (distanceFromCenter / CIRCLE_RADIUS));
    y *= (1 - pullToCenter * (distanceFromCenter / CIRCLE_RADIUS));
    
    particles.push({
      id: i,
      x,
      y,
      scale: 0.5 + (Math.random() * 0.5),
      speed: 0.8 + (Math.random() * 0.4),
      active: i < initialActiveParticles
    });
  }
  
  return particles;
};

export default function ParticleVisualization({ currentQuestion = 0, userData }) {
  const [particles, setParticles] = useState([]);
  const [lastPercentage, setLastPercentage] = useState(100);
  
  // Initialize particles once
  useEffect(() => {
    setParticles(generateParticles(100)); // Always start with 100%
  }, []);
  
  // Update particles whenever currentQuestion or userData changes
  useEffect(() => {
    if (particles.length === 0) return;

    // Calculate new percentage based on current state
    const stepPercentage = calculateStepPercentage(userData, currentQuestion);
    console.log('Current question:', currentQuestion);
    console.log('Step percentage:', stepPercentage);
    console.log('Current userData:', userData);

    // Only update if the percentage has actually changed and is different from last
    if (Math.abs(stepPercentage - lastPercentage) > 0.01) {
      const calculateActiveParticles = (percentage) => {
        if (percentage >= 100) return TOTAL_PARTICLES;
        if (percentage <= 0) return Math.floor(TOTAL_PARTICLES * 0.1); // Minimum 10% particles
        
        const decayRate = 0.15;
        const normalizedPercentage = percentage / 100;
        const activeParticles = Math.floor(TOTAL_PARTICLES * Math.exp(-decayRate * (1 - normalizedPercentage)) * (0.1 + 0.9 * normalizedPercentage));
        
        return activeParticles;
      };

      const activeParticles = calculateActiveParticles(stepPercentage);
      console.log('Updating to active particles:', activeParticles, 'from percentage:', stepPercentage);
      
      setParticles(currentParticles => 
        currentParticles.map((particle, index) => ({
          ...particle,
          active: index < activeParticles
        }))
      );
      
      setLastPercentage(stepPercentage);
    }
  }, [currentQuestion, userData]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-[280px] h-[280px]"
      >
        <svg
          viewBox={`${-CIRCLE_RADIUS - 20} ${-CIRCLE_RADIUS - 20} ${CIRCLE_RADIUS * 2 + 40} ${CIRCLE_RADIUS * 2 + 40}`}
          className="w-full h-full"
        >
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.circle
                key={particle.id}
                cx={particle.x}
                cy={particle.y}
                initial={{ 
                  r: particle.active ? 2 * particle.scale : 0,
                  opacity: particle.active ? 0.8 : 0,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  r: particle.active ? 2 * particle.scale : 0,
                  opacity: particle.active ? [0.4, 0.8, 0.4] : 0,
                  scale: particle.active ? [1, 1.2, 1] : 0,
                  x: particle.active ? [
                    -3 * particle.speed,
                    3 * particle.speed,
                    -3 * particle.speed
                  ] : 0,
                  y: particle.active ? [
                    2 * particle.speed,
                    -2 * particle.speed,
                    2 * particle.speed
                  ] : 0
                }}
                exit={{ 
                  r: 0, 
                  opacity: 0,
                  transition: { duration: 1.2 }
                }}
                transition={{
                  duration: 1.5,
                  opacity: {
                    duration: 4 * particle.speed,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  },
                  scale: {
                    duration: 3 * particle.speed,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  },
                  x: {
                    duration: 4 + particle.speed * 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  },
                  y: {
                    duration: 5 + particle.speed * 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }
                }}
                style={{
                  willChange: "transform",
                  backfaceVisibility: "hidden"
                }}
                fill={particle.active ? "currentColor" : "transparent"}
                className="text-primary"
              />
            ))}
          </AnimatePresence>
        </svg>
      </motion.div>
    </div>
  );
} 