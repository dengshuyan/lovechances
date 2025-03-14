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

  // Self attractiveness rating affects matches with diminishing returns
  if (userData.selfAttractivenessRating) {
    // Use a minimum value approach to avoid going too low
    const attractivenessMultiplier = Math.min(0.1 + (userData.selfAttractivenessRating / 10) * 0.9, 1);
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

// Export the function as default as well for backward compatibility
export default calculateMatchPercentage;