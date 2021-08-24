import { useState, useEffect } from "react";
import { TextField, Paper, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useSpring, animated } from "react-spring";

const TimeCodes = ({ timeCodes, original, showingIndex, curr }) => {
  const [approve, setApprove] = useState(false);
  const [timeCodesString, setTimeCodesString] = useState("");

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

  const handleReset = () => {
    setTimeCodesString(timeCodesToString(original));
  };

  useEffect(() => {
    if (timeCodes) {
      setTimeCodesString(timeCodesToString(timeCodes));
    }
  }, [timeCodes]);

  if (approve) {
    return (
      <>
        <Paper className={classes.root} elevation={3}>
          <Button onClick={() => setApprove(false)} color="secondary">
            Edit
          </Button>
          {timeCodes &&
            timeCodes.map(([time, songTitle], index) => (
              <>
                <p>
                  {time} {songTitle}
                </p>
              </>
            ))}
        </Paper>
      </>
    );
  } else {
    return (
      <>
        <animated.div
          style={{ ...animStyle, position: "absolute", width: "100%" }}
        >
          <TextField
            maxRows={13}
            minRows={13}
            value={timeCodesString}
            onChange={(e) => setTimeCodesString(e.target.value)}
            square={false}
            spellCheck={false}
            id="outlined-multiline-static"
            fullWidth={true}
            multiline
            defaultValue="Default Value"
            variant="outlined"
          />
          {timeCodesToString(original) !== timeCodesString && (
            <Button onClick={handleReset}>Reset</Button>
          )}
        </animated.div>
      </>
    );
  }
};

export default TimeCodes;
