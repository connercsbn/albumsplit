import "./App.css";
import "@fontsource/roboto";
import Cookies from "js-cookie";
import TimeCodes from "./modules/TimeCodes";
import Stepper from "./modules/Stepper";
import EditableAlbumAttribute from "./modules/EditableAlbumAttribute";
import {
  Fade,
  LinearProgress,
  TextField,
  CssBaseline,
  Container,
  Typography,
} from "@material-ui/core";
import Header from "./modules/Header";
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
  const [albumUrl, setAlbumUrl] = useState("");
  const [albumTitleId, setAlbumTitleId] = useState("");
  const [albumTimeCodes, setAlbumTimeCodes] = useState();
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumArtist, setAlbumArtist] = useState("");
  const [albumYear, setAlbumYear] = useState("");
  const [zipUrl, setZipUrl] = useState("");

  const handleUrlChange = (event) => {
    setAlbumUrl(event.target.value);
  };
  const handleFinalize = async () => {
    const res = await fetch("http://localhost:8000/api/get_album/", {
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
        timecodes: albumTimeCodes,
        artist: albumArtist,
        year: albumYear,
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
        const res = await fetch("http://localhost:8000/api/progress/" + id);
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
            setLoading(false);
            console.log("complete");
          } else {
            setZipUrl(json.result.zipurl);
            setLoading(false);
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
    const res = await fetch("http://localhost:8000/api/yturl", {
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

  const submitUrlStep = (
    <>
      <form noValidate autoComplete="off">
        <TextField
          onChange={handleUrlChange}
          id="standard-basic"
          label="YouTube URL"
          value={albumUrl}
          size="large"
          fullWidth
        />
      </form>
    </>
  );
  const approveInfoStep = (
    <>
      {albumTitle && (
        <EditableAlbumAttribute
          info={albumTitle}
          setNewInfo={setAlbumTitle}
          label="Album title"
        />
      )}
      {albumArtist && (
        <EditableAlbumAttribute
          info={albumArtist}
          setNewInfo={setAlbumArtist}
          label="Artist"
        />
      )}
      {albumYear && (
        <EditableAlbumAttribute
          info={albumYear}
          setNewInfo={setAlbumYear}
          label="Year"
        />
      )}
      {albumTimeCodes && <TimeCodes timeCodes={albumTimeCodes} />}
    </>
  );
  const downloadStep =
    currentTask && percent ? (
      <>
        {/* <Fade
        in={loading}
        style={{
          transitionDelay: loading ? "80ms" : "0ms",
        }}
        unmountOnExit
      > */}
        <LinearProgress variant={"determinate"} value={percent} />
        {/* </Fade> */}
        <Typography>
          {currentTask} <br /> {percent}
        </Typography>
      </>
    ) : (
      <Typography>{zipUrl}</Typography>
    );

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <div className="App">
          <Header />
          <Stepper
            stepsContent={[submitUrlStep, approveInfoStep, downloadStep]}
            handleSubmit={handleSubmit}
            handleFinalize={handleFinalize}
            albumUrl={albumUrl}
            loading={loading}
          />
        </div>
      </Container>
    </>
  );
}
// const tc = [
//   ["00:00", "Plantasia"],
//   ["03:24", "Symphony For A Spider Plant"],
//   ["06:04", "Baby's Tears Blues"],
//   ["09:08", "Ode To An African Violet"],
//   ["13:14", "Concerto For Philodendron & Pothos"],
//   ["16:24", "Rhapsody In Green"],
//   ["19:52", "Swingin' Spathiphyllums"],
//   ["22:54", "You Don't Have To Walk A Begonia"],
//   ["25:29", "A Mellow Mood For Maidenhair"],
//   ["27:51", "Music To Soothe The Savage Snake Plant"],
// ];

export default App;
