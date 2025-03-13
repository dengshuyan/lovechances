export function calculateMatchPercentage(userData, currentQuestion) {
  let percentage = 100;
  
  if (!userData) return percentage;

  // Only calculate for questions after the first one (location)
  if (currentQuestion <= 1) return percentage;

  // Gender preference reduces pool based on city demographics
  if (userData.location && userData.genderPreference) {
    const { demographics } = userData.location;
    const totalGenderPercentage = userData.genderPreference.reduce((acc, gender) => {
      if (gender === 'Woman') return acc + demographics.female;
      if (gender === 'Man') return acc + demographics.male;
      return acc + 0.1; // Assume 10% for non-binary
    }, 0);
    percentage *= totalGenderPercentage;
  }

  // Age range reduces pool based on city demographics
  if (userData.ageRange) {
    const { demographics } = userData.location;
    const ageRangePercentage = Object.entries(demographics.ageGroups)
      .filter(([range]) => {
        const [min] = range.split('-').map(Number);
        return min >= userData.ageRange[0] && min <= userData.ageRange[1];
      })
      .reduce((acc, [, percentage]) => acc + percentage, 0);
    percentage *= ageRangePercentage;
  }

  // Education preference
  if (userData.education) {
    const { demographics } = userData.location;
    if (userData.education === "College+") {
      percentage *= demographics.education.college;
    } else if (userData.education === "High School") {
      percentage *= demographics.education.highschool;
    }
  }

  // Dating intent reduces pool (assuming percentages)
  if (userData.datingIntent) {
    switch (userData.datingIntent) {
      case "Serious Relationship":
        percentage *= 0.3; // 30% looking for serious
        break;
      case "Casual Fun":
        percentage *= 0.5; // 50% open to casual
        break;
      case "Still Figuring Out":
        percentage *= 0.8; // 80% might be compatible
        break;
    }
  }

  // Looks preference affects pool
  if (userData.looksPreference) {
    switch (userData.looksPreference) {
      case "Supermodel Only":
        percentage *= 0.1; // 10% are very attractive
        break;
      case "Decent Looking":
        percentage *= 0.5; // 50% are decent looking
        break;
      case "Personality Matters More":
        percentage *= 0.8; // 80% might be compatible
        break;
    }
  }

  // Self attractiveness rating affects matches
  if (userData.selfAttractivenessRating) {
    const attractivenessMultiplier = userData.selfAttractivenessRating / 10;
    percentage *= attractivenessMultiplier;
  }

  // Social skills affect matches
  if (userData.socialSkills) {
    switch (userData.socialSkills) {
      case "Social butterfly":
        percentage *= 0.8; // Good social skills help
        break;
      case "Okay":
        percentage *= 0.6;
        break;
      case "I make weird eye contact":
        percentage *= 0.4;
        break;
    }
  }

  // Ensure percentage is between 0 and 100
  return Math.min(Math.max(percentage, 0), 100);
}

export default function calculateMatches(userData) {
  if (!userData || !userData.location) {
    return {
      percentage: 0,
      totalMatches: 0
    };
  }

  const { 
    location, 
    genderPreference, 
    ageRange, 
    education, 
    datingIntent,
    looksPreference,
    selfAttractivenessRating,
    socialSkills
  } = userData;
  
  let matches = location.population;

  // 1. Gender Filter
  if (genderPreference && genderPreference.length > 0) {
    const genderRatio = genderPreference.reduce((sum, gender) => {
      switch (gender.toLowerCase()) {
        case 'woman':
          return sum + location.demographics.female;
        case 'man':
          return sum + location.demographics.male;
        case 'nonbinary':
          return sum + 0.012;
        default:
          return sum;
      }
    }, 0);
    matches *= genderRatio;
  }

  // 2. Age Filter
  if (ageRange) {
    const ageGroups = location.demographics.ageGroups;
    let ageRatio = 0;
    
    Object.entries(ageGroups).forEach(([group, ratio]) => {
      const [min, max] = group.split('-').map(Number);
      if (min >= ageRange[0] && max <= ageRange[1]) {
        ageRatio += ratio;
      }
    });
    
    matches *= ageRatio;
  }

  // 3. Education Filter
  if (education) {
    const eduDemo = location.demographics.education;
    let educationRatio;
    
    switch (education) {
      case 'Any':
        educationRatio = 1;
        break;
      case 'High School':
        educationRatio = eduDemo.highschool + eduDemo.college;
        break;
      case 'College+':
        educationRatio = eduDemo.college;
        break;
      default:
        educationRatio = 1;
    }
    
    matches *= educationRatio;
  }

  // 4. Dating Intent Filter
  const datingIntentFactors = {
    'Serious Relationship': 0.45,
    'Casual Fun': 0.25,
    'Still Figuring Out': 0.30
  };

  if (datingIntent && datingIntentFactors[datingIntent]) {
    matches *= datingIntentFactors[datingIntent];
  }

  // 5. Looks Preference Filter
  const looksPreferenceFactors = {
    'Supermodel Only': 0.1,
    'Decent Looking': 0.4,
    'Personality Matters More': 1
  };

  if (looksPreference && looksPreferenceFactors[looksPreference]) {
    matches *= looksPreferenceFactors[looksPreference];
  }

  // 6. Self-Attractiveness Rating Filter
  if (selfAttractivenessRating) {
    // Scale from 1-10 where higher rating means more matches
    // But with diminishing returns (not linear)
    const attractivenessRatio = Math.min(0.1 + (selfAttractivenessRating / 10) * 0.9, 1);
    matches *= attractivenessRatio;
  }

  // 7. Social Skills Filter
  const socialSkillsFactors = {
    'Social butterfly': 1,
    'Okay': 0.5,
    'I make weird eye contact': 0.2
  };

  if (socialSkills && socialSkillsFactors[socialSkills]) {
    matches *= socialSkillsFactors[socialSkills];
  }

  // 8. Single Rate - assuming only a portion of the population is single
  const singleRate = 0.4; // 40% of people in the filtered age range are single
  matches *= singleRate;

  return {
    percentage: ((matches / location.population) * 100).toFixed(2),
    totalMatches: Math.round(matches)
  };
}