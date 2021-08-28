import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";

export default function NextButton({
  activeStep,
  albumUrl,
  zipUrl,
  handleNext,
  classes,
}) {
  if (activeStep === 2) {
    return ''
  } else {
    return (
      <Button
        disabled={activeStep === 0 ? albumUrl.length < 1 : false}
        variant="contained"
        color="primary"
        onClick={() => {
          handleNext(activeStep);
        }}
        className={classes.button}
      >
        Next
      </Button>
    );
  }
}
