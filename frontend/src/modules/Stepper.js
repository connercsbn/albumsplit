import { useCallback, useEffect, useMemo, useState } from "react";
import NextButton from "./NextButton";
import {
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  StepConnector,
} from "@material-ui/core";
import clsx from "clsx";
import { css } from "@emotion/react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import SyncLoader from "react-spinners/SyncLoader";
import LinkIcon from "@material-ui/icons/InsertLinkRounded";
import ListIcon from "@material-ui/icons/FormatAlignLeftRounded";
import DoneIcon from "@material-ui/icons/DoneRounded";
import DownloadIcon from "@material-ui/icons/CloudDownload";

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <LinkIcon />,
    2: <ListIcon />,
    3: <DownloadIcon />,
  };
  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {completed ? <DoneIcon /> : icons[String(props.icon)]}
    </div>
  );
}

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg,var(--cyan) 0%, var(--yellow) 30%,var(--magenta) 100%)",
    },
  },
  completed: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg,var(--blue) 0%,var(--cyan) 100%)",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "rgba(250,250,255,1)",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundImage:
      "linear-gradient( 136deg, var(--yellow) 0%, var(--yellow) 50%, var(--purple) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    backgroundImage:
      "linear-gradient( 136deg, var(--cyan) 0%, var(--blue) 60%, var(--blue) 100%)",
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    button: {
      marginRight: theme.spacing(100),
      background: theme.palette.info,
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
            style={{ margin: "1em 0" }}
            variant="outlined"
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
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<ColorlibConnector />}
      >
        {steps.map((label, index) => {
          return (
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                {label}
              </StepLabel>
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
              color="warning"
              onClick={handleReset}
              className={classes.button}
            >
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions} variant="subtitle1">
              <Paper
                elevation={4}
                variant="elevation"
                style={{
                  backgroundColor: "#b5c6df14",
                  padding: "0.01em 1em",
                  margin: "1em 0",
                  // border: "1px solid rgba(255,255,255,.2)",
                }}
              >
                <p>
                  Pick a youtube album or audiobook whose timecodes are in the
                  description or comments, and this will download the album,
                  separate and tag each track, and put it in a zip file
                </p>
              </Paper>
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
                style={{ zIndex: 200 }}
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
