import { Button as MuiButton } from "@mui/material";

export default function Button({ children, onClick, variant = "contained" }) {
  return (
    <MuiButton
      onClick={onClick}
      variant={variant}
      color="primary"
    >
      {children}
    </MuiButton>
  );
}