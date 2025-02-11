import React from "react";
import { Typography } from "@mui/material";

export default function SingleSelect({ title, options, value, onChange }) {
  return (
    <div>
      <Typography variant="h2">{title}</Typography>
      <div className="space-y-3">
        {options.map((option) => (
          <div
            key={option}
            onClick={() => onChange(option)}
            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all
              ${value === option ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <Typography variant="body1">{option}</Typography>
          </div>
        ))}
      </div>
    </div>
  );
}