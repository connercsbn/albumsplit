import { useState } from "react";
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@material-ui/core";
import { css } from "@emotion/react";
import { makeStyles } from "@material-ui/core/styles";
import SyncLoader from "react-spinners/SyncLoader";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return [
    "Select YouTube album or audiobook",
    "Confirm tracklist",
    "Download album",
  ];
}

export default function HorizontalLinearStepper({
  stepsContent,
  handleSubmit,
  handleFinalize,
  albumUrl,
  loading,
}) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const steps = getSteps();

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = (step) => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    console.log(step);
    if (step === 0) {
      handleSubmit();
    } else if (step === 1) {
      handleFinalize();
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              <p>
                Pick a youtube album or audiobook whose timecodes are in the
                description or comments, and this will download the album,
                separate and tag each track, and put it in a zip file
              </p>
              <SyncLoader
                loading={loading && activeStep < 2}
                css={css`
                  display: block;
                  margin: auto;
                  text-align: center;
                `}
              />
              {stepsContent[activeStep]}
            </Typography>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>
              <Button
                disabled={activeStep === 0 ? albumUrl.length < 1 : false}
                variant="contained"
                color="primary"
                onClick={() => {
                  handleNext(activeStep);
                }}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
