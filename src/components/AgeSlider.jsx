import React from "react";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";
import RangeSlider from "./RangeSlider";

export default function AgeSlider({ userData, setUserData }) {
  // Ensure ageRange exists; if not, default to [25, 35]
  const ageRange = userData.ageRange || [25, 35];

  const handleChange = (event, newValue) => {
    setUserData({ ...userData, ageRange: newValue });
  };

  return (
    <div>
      <RangeSlider
        title="Age between"
        value={userData.ageRange || [25, 35]}
        onChange={(event, newValue) => setUserData({ ...userData, ageRange: newValue })}
        min={18}
        max={60}
      />
    </div>
  );
}