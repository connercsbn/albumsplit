import { createTheme } from "@material-ui/core/styles";

const colors = {
  background: "#1c1e21",
  black: "#928374",
  red: "#fb4934",
  green: "#b8bb26",
  yellow: "#fabd2f",
  blue: "#83a598",
  magenta: "#d3869b",
  cyan: "#8ec07c",
  white: "#ebdbb2",
  purple: "#b16286",
};

const gruvBox = createTheme({
  background: "#1c1e21",
  black: "#928374",
  red: "#fb4934",
  green: "#b8bb26",
  yellow: "#fabd2f",
  blue: "#83a598",
  magenta: "#d3869b",
  cyan: "#8ec07c",
  white: "#ebdbb2",
  palette: {
    type: "dark",
    primary: {
      main: colors.cyan,
    },
    secondary: {
      main: colors.blue,
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
