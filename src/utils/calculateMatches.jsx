export default function calculateMatches(userData) {
  // Add debug logging
  console.log('Starting calculation with userData:', userData);

  if (!userData || !userData.location) {
    console.log('No userData or location data');
    return {
      percentage: 0,
      totalMatches: 0
    };
  }

  const { location, genderPreference, ageRange, education, datingIntent } = userData;
  let matches = location.population;
  console.log('Initial population:', matches);

  // 1. Gender Filter
  if (genderPreference && genderPreference.length > 0) {
    const genderRatio = genderPreference.reduce((sum, gender) => {
      switch (gender) {
        case 'woman':
          return sum + location.demographics.female;
        case 'man':
          return sum + location.demographics.male;
        case 'nonBinary':
          // Estimate: Using 1.2% of population identifies as non-binary
          // Based on recent demographic studies
          return sum + 0.012;
        default:
          return sum;
      }
    }, 0);
    matches *= genderRatio;
    console.log('After gender filter:', matches);
  }

  // 2. Age Filter
  if (ageRange) {
    const ageGroups = location.demographics.ageGroups;
    let ageRatio = 0;
    
    // Calculate what percentage of each age group should be included
    Object.entries(ageGroups).forEach(([group, ratio]) => {
      const [min, max] = group.split('-').map(Number);
      if (min >= ageRange[0] && max <= ageRange[1]) {
        ageRatio += ratio;
      }
    });
    
    matches *= ageRatio;
    console.log('After age filter:', matches);
  }

  // 3. Education Filter
  if (education) {
    const eduDemo = location.demographics.education;
    let educationRatio;
    
    switch (education) {
      case 'Any':
        educationRatio = 1; // Include everyone
        break;
      case 'Highschool':
        educationRatio = eduDemo.highschool + eduDemo.college; // High school and above
        break;
      case 'College+':
        educationRatio = eduDemo.college; // College and above
        break;
      default:
        educationRatio = 1;
    }
    
    matches *= educationRatio;
    console.log('After education filter:', matches);
  }

  // 4. Dating Intent Filter
  const datingIntentFactors = {
    'Serious Relationship': 0.45,
    'Casual Fun': 0.25,
    'Still Figuring Out': 0.30
  };

  if (datingIntent && datingIntentFactors[datingIntent]) {
    matches *= datingIntentFactors[datingIntent];
    console.log('After dating intent filter:', matches);
  }

  // Final adjustment: assuming only a portion are actively dating
  matches *= 0.3; // Assuming 30% of eligible people are actively dating
  console.log('Final matches after 30% adjustment:', matches);

  const result = {
    percentage: ((matches / location.population) * 100).toFixed(2),
    totalMatches: Math.round(matches)
  };
  console.log('Final result:', result);

  return result;
}