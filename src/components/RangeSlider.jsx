import React from "react";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";

export default function RangeSlider({ 
  title,
  value,
  onChange,
  min,
  max
}) {
  return (
    <div>
      <Typography variant="h2">{title}</Typography>
      <Slider
        value={value}
        onChange={onChange}
        valueLabelDisplay="on"
        min={min}
        max={max}
        marks={[
          { value: min, label: min.toString() },
          { value: max, label: max.toString() }
        ]}
        valueLabelFormat={(value) => value}
        sx={(theme) => ({
          '& .MuiSlider-valueLabel': {
            transform: 'translateY(-16px) !important',
            backgroundColor: 'transparent !important',
            color: theme.palette.text.primary,
            fontSize: '1rem',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            padding: 0,
            '&:before': {
              display: 'none !important'
            }
          },
          // Target both thumbs specifically with higher specificity
          '& .MuiSlider-thumb:first-of-type': {
            '& .MuiSlider-valueLabel': {
              transform: 'translateY(-16px) !important',
              color: theme.palette.text.primary,
              backgroundColor: 'transparent !important',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
            }
          },
          '& .MuiSlider-thumb:last-of-type': {
            '& .MuiSlider-valueLabel': {
              transform: 'translateY(-16px) !important',
              color: theme.palette.text.primary,
              backgroundColor: 'transparent !important',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
            }
          }
        })}
      />
    </div>
  );
}