import { Button as MuiButton } from "@mui/material";

export default function Button({ 
  children, 
  onClick, 
  variant = "contained", 
  className = "",
  disabled = false,
  fullWidth = true,
  ...props 
}) {
  return (
    <MuiButton
      onClick={onClick}
      variant={variant}
      color="primary"
      className={`${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </MuiButton>
  );
}