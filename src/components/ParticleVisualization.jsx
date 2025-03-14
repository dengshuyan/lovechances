import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const TOTAL_PARTICLES = 500;
const CIRCLE_RADIUS = 120;

// Calculate percentage based on previous selection
const calculateStepPercentage = (userData, currentQuestion) => {
  if (!userData || !userData.location) return 100;
  
  const { demographics } = userData.location;
  let cumulativePercentage = 100;

  // Calculate cumulative effect of all selections up to current question
  // Important: We only consider completed questions (up to currentQuestion - 1)
  // This ensures we don't calculate based on the current question until it's completed
  for (let step = 1; step < currentQuestion; step++) {
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
          // Use a minimum value approach to avoid going too low
          const attractivenessMultiplier = Math.min(0.1 + (userData.selfAttractivenessRating / 10) * 0.9, 1);
          stepMultiplier = attractivenessMultiplier;
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
const generateParticles = (totalCount) => {
  const particles = [];
  
  for (let i = 0; i < totalCount; i++) {
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
    
    // Generate random movement angles and distances for organic motion
    const angle = Math.random() * Math.PI * 2; // Random angle in radians
    const moveDistance = 1 + Math.random() * 2; // Smaller movement distance (1-3 units)
    const moveX = Math.cos(angle) * moveDistance;
    const moveY = Math.sin(angle) * moveDistance;
    const duration = 4 + Math.random() * 3; // Random duration between 4-7 seconds
    
    particles.push({
      id: i,
      x,
      y,
      moveX,
      moveY,
      duration,
      scale: 0.5 + (Math.random() * 0.5),
      speed: 0.8 + (Math.random() * 0.4),
      opacity: 0,
      radius: 0,
      visible: false,
      isMatch: false
    });
  }
  
  return particles;
};

export default function ParticleVisualization({ 
  currentQuestion = 0, 
  userData, 
  resultsMode = false,
  matchPercentage = 0,
  totalMatches = 0
}) {
  const [particles, setParticles] = useState([]);
  const [lastPercentage, setLastPercentage] = useState(100);
  const [activeCount, setActiveCount] = useState(TOTAL_PARTICLES);
  const isInitialRender = useRef(true);
  
  // Initialize particles once
  useEffect(() => {
    const initialParticles = generateParticles(TOTAL_PARTICLES);
    
    // If we're starting in results mode, initialize with results visualization
    if (resultsMode) {
      const matchCount = Math.max(1, Math.min(Math.round(TOTAL_PARTICLES * (matchPercentage / 100)), TOTAL_PARTICLES));
      const particles = initialParticles.map((particle, index) => {
        const isMatch = index < matchCount;
        return {
          ...particle,
          visible: true,
          isMatch: isMatch,
          opacity: isMatch ? 0.9 : 0.15,
          radius: isMatch ? 2.5 * particle.scale : 1.5 * particle.scale,
          speed: isMatch ? particle.speed * 1.2 : particle.speed * 0.7
        };
      });
      setParticles(particles);
    } else {
      setParticles(initialParticles);
    }
  }, [resultsMode, matchPercentage]); // Add dependencies to reinitialize when these change
  
  // Update particles whenever currentQuestion or userData changes
  useEffect(() => {
    if (particles.length === 0) return;
    
    // Skip the first render to avoid animation on initial load
    if (isInitialRender.current) {
      isInitialRender.current = false;
      
      // Only initialize if not in results mode (results mode is handled by first useEffect)
      if (!resultsMode) {
        setParticles(prevParticles => 
          prevParticles.map((particle, index) => ({
            ...particle,
            visible: true,
            opacity: 0.6,
            radius: 2 * particle.scale
          }))
        );
      }
      
      return;
    }

    console.log('Results mode:', resultsMode);
    console.log('Match percentage:', matchPercentage);

    // Special handling for results mode
    if (resultsMode) {
      console.log('Entering results mode');
      // Calculate how many particles should represent matches
      const matchCount = Math.max(1, Math.min(Math.round(TOTAL_PARTICLES * (matchPercentage / 100)), TOTAL_PARTICLES));
      console.log('Match count:', matchCount);
      
      // Update particles for results visualization
      setParticles(prevParticles => {
        const updatedParticles = prevParticles.map((particle, index) => {
          const isMatch = index < matchCount;
          return {
            ...particle,
            visible: true,
            isMatch: isMatch,
            opacity: isMatch ? 0.9 : 0.15,
            radius: isMatch ? 2.5 * particle.scale : 1.5 * particle.scale,
            speed: isMatch ? particle.speed * 1.2 : particle.speed * 0.7,
            // Ensure moveX and moveY are preserved
            moveX: particle.moveX,
            moveY: particle.moveY,
            duration: particle.duration
          };
        });
        console.log('Updated particles for results:', updatedParticles[0]);
        return updatedParticles;
      });
      
      return;
    }

    // Regular mode (during questions)
    // Calculate new percentage based on current state
    const stepPercentage = calculateStepPercentage(userData, currentQuestion);
    console.log('Current question:', currentQuestion);
    console.log('Step percentage:', stepPercentage);
    console.log('Current userData:', userData);

    // Only update if the percentage has actually changed and is different from last
    if (Math.abs(stepPercentage - lastPercentage) > 0.01) {
      // Calculate how many particles should be active
      const calculateActiveParticles = (percentage) => {
        if (percentage >= 100) return TOTAL_PARTICLES;
        if (percentage <= 0) return Math.floor(TOTAL_PARTICLES * 0.1); // Minimum 10% particles
        
        const decayRate = 0.15;
        const normalizedPercentage = percentage / 100;
        const activeParticles = Math.floor(TOTAL_PARTICLES * Math.exp(-decayRate * (1 - normalizedPercentage)) * (0.1 + 0.9 * normalizedPercentage));
        
        return activeParticles;
      };

      const newActiveCount = calculateActiveParticles(stepPercentage);
      console.log('Updating to active particles:', newActiveCount, 'from percentage:', stepPercentage);
      
      // Update active count
      setActiveCount(newActiveCount);
      
      // Update particles with a staggered delay for better visual effect
      setParticles(prevParticles => 
        prevParticles.map((particle, index) => {
          const shouldBeVisible = index < newActiveCount;
          
          return {
            ...particle,
            visible: shouldBeVisible,
            isMatch: false,
            // These will be animated by Framer Motion
            opacity: shouldBeVisible ? 0.6 : 0,
            radius: shouldBeVisible ? 2 * particle.scale : 0
          };
        })
      );
      
      setLastPercentage(stepPercentage);
    }
  }, [currentQuestion, userData, particles.length, lastPercentage, resultsMode, matchPercentage, totalMatches]);

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
          {particles.map((particle) => (
            <motion.circle
              key={particle.id}
              cx={particle.x}
              cy={particle.y}
              initial={{ 
                r: 0,
                opacity: 0
              }}
              animate={{ 
                r: particle.visible ? particle.radius : 0,
                opacity: particle.visible ? (resultsMode ? particle.opacity : [
                  particle.opacity * 0.8,
                  particle.opacity,
                  particle.opacity * 0.8
                ]) : 0,
                x: particle.visible ? [
                  -particle.moveX * (particle.isMatch ? 1.2 : 0.7),
                  particle.moveX * (particle.isMatch ? 1.2 : 0.7),
                  -particle.moveX * (particle.isMatch ? 1.2 : 0.7)
                ] : 0,
                y: particle.visible ? [
                  -particle.moveY * (particle.isMatch ? 1.2 : 0.7),
                  particle.moveY * (particle.isMatch ? 1.2 : 0.7),
                  -particle.moveY * (particle.isMatch ? 1.2 : 0.7)
                ] : 0
              }}
              transition={{
                r: { 
                  duration: 0.8,
                  ease: "easeInOut"
                },
                opacity: {
                  duration: resultsMode ? 0.8 : (particle.isMatch ? 3 : 4),
                  repeat: resultsMode ? 0 : Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                },
                x: {
                  duration: particle.visible ? (particle.isMatch ? particle.duration * 0.8 : particle.duration * 1.2) : 0.8,
                  repeat: particle.visible ? Infinity : 0,
                  repeatType: "mirror",
                  ease: [0.4, 0, 0.6, 1]
                },
                y: {
                  duration: particle.visible ? (particle.isMatch ? particle.duration * 0.8 : particle.duration * 1.2) : 0.8,
                  repeat: particle.visible ? Infinity : 0,
                  repeatType: "mirror",
                  ease: [0.4, 0, 0.6, 1]
                }
              }}
              style={{
                willChange: "transform",
                backfaceVisibility: "hidden"
              }}
              fill="currentColor" // Use the same color for all particles
              className="text-primary"
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
} 