import { Typography } from "@mui/material";

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return <Typography color="error">{message}</Typography>;
}