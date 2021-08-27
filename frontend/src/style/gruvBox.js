import { createTheme } from "@material-ui/core/styles";

const colors = {
  background: "#1c1e21",
  black: "#928374",
  red: "#fb4934",
  green: "#b8bb26",
  yellow: "#fabd2f",
  blue: "#8cbdab",
  magenta: "#d3869b",
  cyan: "#8ec07c",
  white: "#ebdbb2",
  purple: "#b16286",
};

const gruvBox = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: colors.blue,
    },
    secondary: {
      main: colors.yellow,
    },
    text: {
      primary: colors.white,
      secondary: colors.white,
      disabled: colors.white,
      hint: colors.white,
      icon: colors.white,
      divider: colors.white,
    },
    background: {
      paper: colors.background,
      default: colors.background,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default gruvBox;
