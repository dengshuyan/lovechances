import React from "react";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";

export default function SingleValueSlider({ 
  title,
  value,
  onChange,
  min,
  max,
  customMinLabel = "",
  customMaxLabel = ""
}) {
  return (
    <div>
      <Typography variant="h2" className="mb-8">{title}</Typography>
      <Slider
        value={value}
        onChange={onChange}
        valueLabelDisplay="on"
        min={min}
        max={max}
        marks={[
          { value: min, label: "" },
          { value: max, label: "" }
        ]}
        sx={{
          '& .MuiSlider-valueLabelOpen': {
            backgroundColor: 'transparent',
            color: 'text.primary',
            transform: 'translateY(-16px)',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: '1rem',
            '&:before': {
              display: 'none'
            }
          }
        }}
      />
      <div className="flex justify-between mt-2 text-gray-500 text-sm">
        <span className="max-w-[150px] font-inter whitespace-nowrap">{customMinLabel || min}</span>
        <span className="max-w-[250px] text-right font-inter whitespace-nowrap">{customMaxLabel || max}</span>
      </div>
    </div>
  );
} 