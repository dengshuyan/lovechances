import { Autocomplete, TextField, CircularProgress, Typography } from "@mui/material";
import { useState, useCallback } from "react";
import SearchIcon from '@mui/icons-material/Search';

// Default major cities to show initially
const DEFAULT_CITIES = [
  "New York city, New York",
  "Los Angeles city, California",
  "Chicago city, Illinois",
  "San Francisco city, California",
  "Miami city, Florida"
];

export default function CityDropdown({ onSelect }) {
  const [cities, setCities] = useState(DEFAULT_CITIES);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  const fetchCities = useCallback(async (query) => {
    if (!query) {
      setCities(DEFAULT_CITIES);
      return;
    }

    if (query.length < 2) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.census.gov/data/2022/acs/acs1?get=NAME&for=place:*&in=state:*&key=${import.meta.env.VITE_CENSUS_API_KEY}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const cityList = data
        .slice(1)
        .filter(item => item[0].toLowerCase().includes(query.toLowerCase()))
        .map(item => item[0]);
      setCities(cityList);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities(DEFAULT_CITIES);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCitySelect = async (value) => {
    if (!value) return;
    
    try {
      const response = await fetch(
        `https://api.census.gov/data/2022/acs/acs1?get=NAME,B01003_001E,B01001_002E,B01001_026E,B01001_010E,B01001_011E,B01001_012E,B01001_013E,B15003_016E,B15003_017E,B15003_021E,B15003_022E&for=place:*&in=state:*&key=${import.meta.env.VITE_CENSUS_API_KEY}`
      );
      const data = await response.json();
      const cityData = data.find((item) => item[0] === value);
      
      if (cityData && typeof onSelect === 'function') {
        const totalPop = parseInt(cityData[1], 10);
        onSelect({
          name: value,
          population: totalPop,
          demographics: {
            male: parseInt(cityData[2], 10) / totalPop,
            female: parseInt(cityData[3], 10) / totalPop,
            ageGroups: {
              "18-24": parseInt(cityData[4], 10) / totalPop,
              "25-34": parseInt(cityData[5], 10) / totalPop,
              "35-44": parseInt(cityData[6], 10) / totalPop,
              "45-54": parseInt(cityData[7], 10) / totalPop,
            },
            education: {
              highschool: parseInt(cityData[8], 10) / totalPop,
              college: (parseInt(cityData[9], 10) + parseInt(cityData[10], 10) + parseInt(cityData[11], 10)) / totalPop,
            }
          }
        });
      }
    } catch (error) {
      console.error("Error fetching city demographics:", error);
    }
  };

  return (
    <div>
      <Typography variant="h2" mb={4}>Where do you live?</Typography>
      <Autocomplete
        options={cities}
        loading={loading}
        inputValue={inputValue}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        fullWidth
        onInputChange={(event, newValue) => {
          setInputValue(newValue);
          fetchCities(newValue);
        }}
        onChange={(event, value) => {
          if (value) {
            handleCitySelect(value);
          }
        }}
        renderInput={(params) => (
          <TextField 
            {...params} 
            placeholder="Select City"
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <div style={{ position: 'absolute', right: '16px' }}>
                  {loading ? <CircularProgress color="inherit" size={20} /> : <SearchIcon sx={{ color: 'text.secondary' }} />}
                </div>
              ),
              sx: {
                paddingRight: '0px !important'
              }
            }}
          />
        )}
        noOptionsText="No cities found"
        filterOptions={(x) => x}
        popupIcon={null}
      />
    </div>
  );
}