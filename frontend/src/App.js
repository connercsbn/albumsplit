import "./App.css";
import "@fontsource/roboto";
import Cookies from "js-cookie";
import TimeCodesDisplayer from "./modules/TimeCodesDisplayer";
import Stepper from "./modules/Stepper";
import WebFont from "webfontloader";
import EditableAlbumAttribute from "./modules/EditableAlbumAttribute";
import {
  Select,
  makeStyles,
  FormControl,
  FormControlLabel,
  MenuItem,
  Button,
  InputLabel,
  LinearProgress,
  CssBaseline,
  Container,
  Typography,
  ThemeProvider,
  Checkbox,
} from "@material-ui/core";
import gruvBox from "./style/gruvBox";
// import Header from "./modules/Header";
import { useState, useEffect } from "react";
import handleToken from "./utils/handleToken";

function App() {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState();
  const [intervalId, setIntervalId] = useState();
  const [currentTask, setCurrentTask] = useState("");
  const [percent, setPercent] = useState("");
  const [complete, setComplete] = useState(false);
  const [fetchedUrl, setFetchedUrl] = useState("");
  const [originalAlbumInfo, setOriginalAlbumInfo] = useState({
    timecodes: [""],
  });
  const [split, setSplit] = useState(true);
  const [albumUrl, setAlbumUrl] = useState("");
  const [albumTitleId, setAlbumTitleId] = useState("");
  const [albumTimeCodes, setAlbumTimeCodes] = useState([]);
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumArtist, setAlbumArtist] = useState("");
  const [albumYear, setAlbumYear] = useState("");
  const [zipUrl, setZipUrl] = useState("");
  const [audioType, setAudioType] = useState("opus");
  const [timeCodesIndex, setTimeCodesIndex] = useState(0);
  const [timeCodesString, setTimeCodesString] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(0),
      minWidth: 220,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));
  const classes = useStyles();

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto Slab", "Droid Sans", "Chilanka"],
      },
    });
  }, []);

  const handleAudioTypeChange = (e) => {
    setAudioType(e.target.value);
  };

  const handleUrlChange = (event) => {
    setAlbumUrl(event.target.value);
  };
  const handleFinalize = async () => {
    const res = await fetch("https://api.conner.soy/get_album/", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken"),
        Accept: "applications/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: albumTitle,
        url: albumUrl,
        titleid: albumTitleId,
        timecodes: timeCodesString,
        artist: albumArtist,
        year: albumYear,
        split: split,
      }),
    });
    const json = await res.json();
    setId(json.id);
  };
  useEffect(() => {
    handleToken();
  }, []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      const interval = setInterval(async () => {
        const res = await fetch("https://api.conner.soy/progress/" + id);
        const json = await res.json();
        console.log(json);
        setPercent(json.progress.percent);
        setCurrentTask(json.progress.description);
        if (json.complete === true) {
          if (json.result.timecodes) {
            setComplete(true);
            setAlbumTimeCodes(json.result.timecodes);
            setAlbumTitle(json.result.title);
            setAlbumArtist(json.result.artist);
            setAlbumYear(json.result.year);
            setAlbumTitleId(json.result.titleid);
            setOriginalAlbumInfo({
              timecodes: json.result.timecodes,
              title: json.result.title,
              artist: json.result.artist,
              year: json.result.year,
            });
            setLoading(false);
            console.log("complete");
          } else {
            if (json.result.zipurl) {
              setComplete(true);
              setZipUrl(json.result.zipurl);
              setLoading(false);
              setActiveStep(3);
            }
          }
        }
      }, 500);
      setIntervalId(interval);
    }
  }, [id]);

  const handleSubmit = async () => {
    if (albumUrl === fetchedUrl) {
      return;
    }
    setLoading(true);
    const res = await fetch("https://api.conner.soy/yturl/", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken"),
        Accept: "applications/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: albumUrl }),
    });
    setFetchedUrl(albumUrl);
    const json = await res.json();
    setId(json.id);
    setLoading(false);
    console.log(json);
  };

  useEffect(() => {
    if (complete) {
      clearInterval(intervalId);
      setComplete(false);
    }
  }, [complete, intervalId]);

  const approveInfoStep = (
    <>
      <EditableAlbumAttribute
        info={albumTitle}
        setNewInfo={setAlbumTitle}
        original={originalAlbumInfo.title}
        label="Album title"
      />
      <EditableAlbumAttribute
        info={albumArtist}
        setNewInfo={setAlbumArtist}
        original={originalAlbumInfo.artist}
        label="Artist"
      />
      <EditableAlbumAttribute
        info={albumYear}
        setNewInfo={setAlbumYear}
        original={originalAlbumInfo.year}
        label="Year"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={split}
            onChange={() => setSplit(!split)}
            name="Split tracks"
            color="primary"
          />
        }
        label="Split tracks"
      />
      <div
        style={{
          display: "flex",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-autowidth-label">
            Audio file type
          </InputLabel>
          <Select
            labelId="select-audio-type"
            id="select-audio-type"
            value={audioType}
            onChange={handleAudioTypeChange}
            MenuProps={{ disableScrollLock: true }}
          >
            <MenuItem value={"opus"}>
              Opus{" "}
              <span
                style={{
                  fontSize: ".8em",
                  float: "right",
                  fontStyle: "italic",
                  marginLeft: "8px",
                }}
              >
                higher quality
              </span>
            </MenuItem>
            <MenuItem value={"mp3"}>
              MP3{" "}
              <span
                style={{
                  fontSize: ".8em",
                  float: "right",
                  fontStyle: "italic",
                  marginLeft: "8px",
                }}
              >
                lower quality
              </span>{" "}
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <TimeCodesDisplayer
        timeCodesIndex={timeCodesIndex}
        original={originalAlbumInfo.timecodes}
        split={split}
        timeCodes={albumTimeCodes}
        index={timeCodesIndex}
        setIndex={setTimeCodesIndex}
        timeCodesString={timeCodesString}
        setTimeCodesString={setTimeCodesString}
      />
    </>
  );
  const downloadStep = currentTask && (
    <>
      <LinearProgress variant={"determinate"} value={percent} />
      <Typography>{currentTask}</Typography>
    </>
  );

  const downloadButton = (
    <>
      <Button
        color="secondary"
        style={{
          display: "flex",
          margin: "auto",
          textAlign: "center",
          fontSize: "1.2em",
          maxWidth: "9em",
        }}
        variant="contained"
        href={zipUrl}
      >
        Download
      </Button>
    </>
  );

  return (
    <>
      <ThemeProvider theme={gruvBox}>
        <CssBaseline />
        <Container
          maxWidth="md"
          style={{
            padding: "2% 1em",
            overflow: "hidden",
          }}
        >
          <div className="App">
            <Typography
              id="heading"
              variant="h2"
              onClick={() => window.location.reload()}
              style={{
                width: "max-content",
                cursor: "pointer",
                textDecoration: "underline var(--cyan) 5px",
                color: "var(--blue)",
                padding: ".5em 0",
                fontWeight: "normal",
                fontFamily: "Roboto Slab",
                textAlign: "left",
              }}
            >
              Albumsplit
            </Typography>
            {/* <Header /> */}
            <Stepper
              initialStepsContent={[
                approveInfoStep,
                downloadStep,
                downloadButton,
              ]}
              handleSubmit={handleSubmit}
              handleFinalize={handleFinalize}
              albumUrl={albumUrl}
              loading={loading}
              setLoading={setLoading}
              handleUrlChange={handleUrlChange}
              zipUrl={zipUrl}
              setActiveStep={setActiveStep}
              activeStep={activeStep}
            />
          </div>
        </Container>
      </ThemeProvider>
    </>
  );
}
const tc1 = [
  ["12:04", "Time code 1"],
  ["12:04", "Time code 1"],
  ["12:04", "Time code 1"],
  ["12:04", "Time code 1"],
  ["12:04", "Time code 1"],
  ["12:04", "Time code 1"],
  ["12:04", "Time code 1"],
  ["12:04", "Time code 1"],
  ["12:04", "Time code 1"],
  ["12:04", "Time code 1"],
  ["12:04", "Time code 1"],
];
const tc2 = [
  ["03:24", "Time code 2"],
  ["03:24", "Time code 2"],
  ["03:24", "Time code 2"],
  ["03:24", "Time code 2"],
  ["03:24", "Time code 2"],
  ["03:24", "Time code 2"],
  ["03:24", "Time code 2"],
  ["03:24", "Time code 2"],
  ["03:24", "Time code 2"],
];
const tc3 = [
  ["38:59", "Time code 3"],
  ["38:59", "Time code 3"],
  ["38:59", "Time code 3"],
  ["38:59", "Time code 3"],
  ["38:59", "Time code 3"],
  ["38:59", "Time code 3"],
  ["38:59", "Time code 3"],
  ["38:59", "Time code 3"],
  ["38:59", "Time code 3"],
  ["38:59", "Time code 3"],
  ["38:59", "Time code 3"],
  ["38:59", "Time code 3"],
];
const tc4 = [
  ["38:59", "Time code 4"],
  ["38:59", "Time code 4"],
  ["38:59", "Time code 4"],
  ["38:59", "Time code 4"],
  ["38:59", "Time code 4"],
  ["38:59", "Time code 4"],
  ["38:59", "Time code 4"],
  ["38:59", "Time code 4"],
  ["38:59", "Time code 4"],
  ["38:59", "Time code 4"],
  ["38:59", "Time code 4"],
  ["38:59", "Time code 4"],
];
const tc5 = [
  ["38:59", "Time code 5"],
  ["38:59", "Time code 5"],
  ["38:59", "Time code 5"],
  ["38:59", "Time code 5"],
  ["38:59", "Time code 5"],
  ["38:59", "Time code 5"],
  ["38:59", "Time code 5"],
  ["38:59", "Time code 5"],
  ["38:59", "Time code 5"],
  ["38:59", "Time code 5"],
  ["38:59", "Time code 5"],
  ["38:59", "Time code 5"],
];

export default App;
