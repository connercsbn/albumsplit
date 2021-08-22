import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

export default function NextButton({
  activeStep,
  albumUrl,
  zipUrl,
  handleNext,
  classes,
}) {
  if (activeStep === 2) {
    return (
      <Button
        disabled={!zipUrl}
        variant="contained"
        color="primary"
        onClick={() => {
          handleNext(activeStep);
        }}
        className={classes.button}
      >
        <Link href={"http://localhost:8000" + zipUrl}>Download</Link>
      </Button>
    );
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
