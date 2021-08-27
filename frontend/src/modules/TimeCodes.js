import { useEffect, useCallback } from "react";
import { TextField, Button, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useSpring, animated } from "react-spring";
import ReplayIcon from "@material-ui/icons/ReplayOutlined";

const getTimeCodeLabel = (index) => {
  const firstThree = ["1st", "2nd", "3rd"];
  if (index < 3) {
    return `Timecodes from ${firstThree[index]} comment`;
  } else {
    return `Timecodes from ${index + 1}th comment`;
  }
};

const TimeCodes = ({
  timeCodes,
  timeCodesList,
  original,
  showingIndex,
  curr,
  timeCodesString,
  setTimeCodesString,
}) => {
  const [animStyle, api] = useSpring(() => ({
    from: { opacity: 0, transform: "translateX(100%)" },
    to: { opacity: 1, transform: "translateX(0%)" },
  }));
  const useStyles = makeStyles((theme) => ({
    root: {
      padding: "1em",
      display: "block",
      lineHeight: 0.75,
    },
  }));
  useEffect(() => {
    if (showingIndex === curr) {
      api({
        opacity: 1,
        transform: "translateX(0%)",
      });
    } else if (showingIndex > curr) {
      api({
        opacity: 0,
        transform: "translateX(-100%)",
      });
    } else if (showingIndex < curr) {
      api({
        opacity: 0,
        transform: "translateX(100%)",
      });
    }
  }, [api, showingIndex, curr]);

  const classes = useStyles();
  const timeCodesToString = (tc) => {
    if (tc) {
      return tc
        .map(([time, songTitle], index) => `${time} ${songTitle}`)
        .join("\n");
    } else {
      return "";
    }
  };

  const handleReset = useCallback(() => {
    setTimeCodesString(timeCodesToString(original[showingIndex]));
  }, [original, showingIndex, setTimeCodesString]);

  useEffect(() => {
    handleReset();
  }, [showingIndex, handleReset]);

  useEffect(() => {
    if (timeCodes) {
      setTimeCodesString(timeCodesToString(timeCodes));
    }
    console.log(timeCodes);
    console.log(timeCodesList);
  }, [timeCodes, setTimeCodesString, timeCodesList]);

  return (
    <>
      <animated.div
        style={{ ...animStyle, position: "absolute", width: "100%" }}
      >
        <TextField
          label={
            timeCodesList?.length > 1 ? getTimeCodeLabel(curr) : "Timecodes"
          }
          maxRows={13}
          minRows={13}
          color="secondary"
          value={timeCodesString}
          onChange={(e) => setTimeCodesString(e.target.value)}
          square={false}
          spellCheck={false}
          id="outlined-multiline-static"
          fullWidth={true}
          multiline
          defaultValue="Default Value"
          variant="outlined"
        ></TextField>
      </animated.div>
    </>
  );
};

export default TimeCodes;
