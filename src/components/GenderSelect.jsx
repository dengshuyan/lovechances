import React from 'react';
import { Checkbox, Typography } from '@mui/material';

export default function GenderSelect({ value = [], onChange }) {
  const handleChange = (genderValue) => {
    const newValues = value.includes(genderValue)
      ? value.filter(v => v !== genderValue) // remove if already selected
      : [...value, genderValue]; // add if not selected
    onChange(null, newValues); // maintain same onChange signature
  };

  return (
    <div>
      <Typography variant="h2">I want to date...</Typography>
      <div className="space-y-3">
        {['woman', 'man', 'nonBinary'].map((gender) => (
          <div
            key={gender}
            onClick={() => handleChange(gender)}
            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all
              ${value.includes(gender) 
                ? 'border-black bg-gray-50' 
                : 'border-gray-200 hover:border-gray-300'
              }`}
          >
            <Typography variant="body1">
              {gender === 'nonBinary' ? 'Non-Binary' : gender}
            </Typography>
            <Checkbox 
              checked={value.includes(gender)}
              onChange={() => handleChange(gender)}
              sx={(theme) => ({
                color: theme.palette.grey[300],
                '&.Mui-checked': {
                  color: theme.palette.primary.main,
                },
                padding: 0
              })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}