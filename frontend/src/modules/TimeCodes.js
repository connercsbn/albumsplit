import { useState, useEffect } from "react";
import { TextField, Button } from "@material-ui/core";

const TimeCodes = ({ handleChange, timeCodes }) => {
  const [approve, setApprove] = useState(true);
  const [timeCodesString, setTimeCodesString] = useState("");

  let dimensions = { width: 700, height: 300 };

  useEffect(() => {
    if (approve) {
      setTimeCodesString(
        timeCodes
          .map(([time, songTitle], index) => `${time} ${songTitle}`)
          .join("\n")
      );
    }
  }, [timeCodes, approve]);

  if (approve) {
    return (
      <>
        <div style={dimensions}>
          {timeCodes.map(([time, songTitle], index) => (
            <p>{`${time} ${songTitle}`}</p>
          ))}
        </div>
        <Button
          onClick={() => setApprove(false)}
          variant="contained"
          color="primary"
        >
          button
        </Button>
      </>
    );
  } else {
    return (
      <>
        <TextField
          value={timeCodesString}
          onChange={handleChange}
          id="outlined-multiline-static"
          label="Multiline"
          multiline
          rows={4}
          defaultValue="Default Value"
          variant="outlined"
        />
      </>
    );
  }
};

export default TimeCodes;
