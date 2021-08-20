import { useState, useEffect } from "react";
import { TextField, Paper, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const TimeCodes = ({ timeCodes, original }) => {
  const [approve, setApprove] = useState(false);
  const [timeCodesString, setTimeCodesString] = useState("");
  console.log({original});

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: "1em",
      display: "block",
      lineHeight: .75
    }
  }));

  const classes = useStyles();
  const timeCodesToString = (tc) => {
        if (tc) {
          return tc.map(([time, songTitle], index) => `${time} ${songTitle}`).join("\n");
        } else {
          return ''
        }
  }
  const handleReset = () => {
    setTimeCodesString(timeCodesToString(original))
  }

  useEffect(() => {
    console.log({original});
    if (timeCodes) {
      setTimeCodesString(timeCodesToString(timeCodes))
    };
  }, [timeCodes]);


  if (approve) {
    return (
      <>
        <Paper className={classes.root} elevation={3} >
        <Button
          onClick={() => setApprove(false)}
          color="secondary"
        >
          Edit
        </Button>
          {timeCodes && timeCodes.map(([time, songTitle], index) => (
            <>
            <p>{`${time} ${songTitle}`}</p>
            </>
          ))}
        </Paper>
      </>
    );
  } else {
    return (
      <>
        <TextField
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
        <Button onClick={handleReset}>Reset</Button>
      </>
    );
  }
};

export default TimeCodes;
