export default function calculateMatches(userData) {
  if (!userData || !userData.location) {
    return {
      percentage: 0,
      totalMatches: 0
    };
  }

  const { location, genderPreference, ageRange, education, datingIntent } = userData;
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

  // Final adjustment: assuming only a portion are actively dating
  matches *= 0.3;

  return {
    percentage: ((matches / location.population) * 100).toFixed(2),
    totalMatches: Math.round(matches)
  };
}