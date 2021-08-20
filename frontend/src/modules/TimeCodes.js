import { useState, useEffect } from "react";
import { TextField, Button, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const TimeCodes = ({ timeCodes }) => {
  const [approve, setApprove] = useState(false);
  const [timeCodesString, setTimeCodesString] = useState("");

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: "1em",
      display: "block",
      lineHeight: .75
    }
  }));

  const classes = useStyles();

  useEffect(() => {
      setTimeCodesString(
        timeCodes
          .map(([time, songTitle], index) => `${time} ${songTitle}`)
          .join("\n")
      );
  }, [timeCodes, approve]);

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
          {timeCodes.map(([time, songTitle], index) => (
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
      </>
    );
  }
};

export default TimeCodes;
