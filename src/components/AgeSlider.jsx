import React from "react";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";

export default function AgeSlider({ userData, setUserData }) {
  // Ensure ageRange exists; if not, default to [25, 35]
  const ageRange = userData.ageRange || [25, 35];

  const handleChange = (event, newValue) => {
    setUserData({ ...userData, ageRange: newValue });
  };

  return (
    <div>
      <Typography variant="h2">Age between</Typography>
      <Slider
        value={ageRange}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={18}
        max={60}
        marks={[
          { value: 18, label: '18' },
          { value: 60, label: '60' }
        ]}
      />
     
    </div>
  );
}