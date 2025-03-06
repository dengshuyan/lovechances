import { Button as MuiButton } from "@mui/material";

export default function Button({ children, onClick, variant = "contained", className = "" }) {
  return (
    <MuiButton
      onClick={onClick}
      variant={variant}
      color="primary"
      className={`w-full ${className}`}
    >
      {children}
    </MuiButton>
  );
}