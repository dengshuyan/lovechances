import calculateMatches from "../utils/calculateMatches";
import Button from "../components/Button";
import { Typography } from "@mui/material";

export default function Results({ userData, setStep }) {
  const estimatedMatches = calculateMatches(userData);

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full  px-6 md:px-40">
        <div className=" mx-auto text-center space-y-6">
          <Typography variant="h1" className="leading-relaxed">
            In <strong>{userData?.location?.name}</strong>, there are approximately{' '}
            <Typography component="span" variant="h1" className="font-semibold">
              {estimatedMatches.totalMatches.toLocaleString()}
            </Typography>{' '}
            people who could be your true love, giving you a{' '}
            <Typography component="span" variant="h1" className="font-semibold">
              {estimatedMatches.percentage}%
            </Typography>{' '}
            chance of finding them.
          </Typography>

          <Typography variant="caption">
            Uh... have you considered moving?
          </Typography>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
            <Button 
              variant="contained"
              onClick={() => {/* Add share functionality */}}
              className="w-[280px]"
            >
              Share This Site
            </Button>
            <Button 
              variant="outlined"
              onClick={() => setStep(1)}
              className="w-[280px]"
            >
              Start Over
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}