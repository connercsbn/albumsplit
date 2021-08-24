import { useCallback, useEffect, useMemo, useState } from "react";
import NextButton from "./NextButton";
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
} from "@material-ui/core";
import { css } from "@emotion/react";
import { makeStyles } from "@material-ui/core/styles";
import SyncLoader from "react-spinners/SyncLoader";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    button: {
      marginRight: theme.spacing(1),
      background: theme.palette.secondary,
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      color: theme.palette.secondary,
    },
  },
}));

function getSteps() {
  return ["Input YouTube link", "Confirm tracklist", "Download"];
}

export default function HorizontalLinearStepper({
  initialStepsContent,
  handleSubmit,
  handleFinalize,
  albumUrl,
  loading,
  setLoading,
  handleUrlChange,
  zipUrl,
}) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [stepsContent, setStepsContent] = useState(0);
  const steps = getSteps();

  const handleNext = useCallback(
    (step) => {
      console.log(step);
      if (step === 0) {
        handleSubmit();
      } else if (step === 1) {
        handleFinalize();
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    },
    [handleFinalize, handleSubmit]
  );

  const submitUrlStep = useMemo(
    () => (
      <>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNext(activeStep);
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            color="secondary"
            onChange={handleUrlChange}
            autoFocus
            id="standard-basic"
            label="YouTube URL"
            value={albumUrl}
            size="large"
            fullWidth
          />
        </form>
      </>
    ),
    [handleUrlChange, albumUrl, handleNext, activeStep]
  );

  useEffect(() => {
    setStepsContent([
      submitUrlStep,
      initialStepsContent[0],
      initialStepsContent[1],
    ]);
  }, [initialStepsContent, submitUrlStep]);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setLoading(false);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
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
              {stepsContent[activeStep]}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleReset}
              className={classes.button}
            >
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
                size={15}
                color="#8ec07c"
                css={css`
                  display: block;
                  margin: auto;
                  text-align: center;
                `}
              />
              {stepsContent[activeStep]}
            </Typography>
            <div style={{ paddingBottom: 20 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>
              <NextButton
                activeStep={activeStep}
                albumUrl={albumUrl}
                steps={steps}
                classes={classes}
                zipUrl={zipUrl}
                handleNext={handleNext}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
