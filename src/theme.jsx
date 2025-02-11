import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
      light: "#374151",
    },
    secondary: {
      main: "#FFFFFF",
    },
    error: {
      main: "#C00F0C",
    },
    grey: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h1: {
      fontSize: "28px",
      fontWeight: "400",
      lineHeight: 1.2,
      marginBottom: "16px"
    },
    h2: {
      fontSize: "20px",
      fontWeight: "400",
      marginBottom: "16px",
    },
    body1: {
      fontSize: "16px",
      fontWeight: "400",
      color: "palette.grey[700]",
    },
    body2: {
      fontSize: "14px",
      fontWeight: "400",
      color: "palette.grey[500]",
    },
    subtitle1: {
      fontSize: "16px",
      fontWeight: "400",
      color: "palette.grey[600]",
    },
    caption: {
      fontSize: "14px",
      fontWeight: "400",
      fontStyle: "italic",
      color: "palette.grey[500]",
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "40px",
          padding: "10px 36px",
          boxShadow: "none",
          "&:hover": {
            opacity: 0.8,
            boxShadow: "none",
          },
          "&:active": {
            boxShadow: "none",
          },
          "&:focus": {
            outline: "none",
            boxShadow: "none",
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
        {
          props: { variant: 'outlined' },
          style: {
            borderColor: 'black',
            '&:hover': {
              borderColor: 'black',
              boxShadow: 'none',
              border: '1px solid black',
            },
            '&:active': {
              borderColor: 'black',
            },
          },
        },
      ],
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: "#000000",
        },
        thumb: {
          backgroundColor: "#000000",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          borderRadius: "12px",
        },
      },
    },
  },
});

export default theme;