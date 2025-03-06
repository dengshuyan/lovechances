import React from "react";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";

export default function AttractivenessSlider({ userData, setUserData }) {
  const attractiveness = userData.selfAttractivenessRating || 5;

  const handleChange = (event, newValue) => {
    setUserData({ ...userData, selfAttractivenessRating: newValue });
  };

  return (
    <div>
      <Typography variant="h2">Well, how attractive do YOU think you are?</Typography>
      <Slider
        value={attractiveness}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={1}
        max={10}
        marks={[
          { value: 1, label: '1' },
          { value: 10, label: '10' }
        ]}
      />
      <div className="flex justify-between mt-2 text-gray-500">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
} 