import './App.css';
import getCookie from './utils/getCookie';
import TimeCodes from './modules/TimeCodes';
import { useState, useEffect } from 'react'

function App() {
  const [id, setId] = useState();
  const [intervalId, setIntervalId] = useState();
  const [currentTask, setCurrentTask] = useState('');
  const [percentage, setPercentage] = useState('');
  const [complete, setComplete] = useState(false);
  const [albumUrl, setAlbumUrl] = useState('');
  const [albumTitleId, setAlbumTitleId] = useState('');
  const [albumTimeCodes, setAlbumTimeCodes] = useState();
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumArtist, setAlbumArtist] = useState('');
  const [albumYear, setAlbumYear] = useState('');
  const [cookie, setCookie] = useState(getCookie('csrftoken'));

  const handleUrlChange = (event) => {
    setAlbumUrl(event.target.value)
  }
  const changeTimeCodes = (event) => {
    setAlbumTimeCodes(event.target.value)
  }
  const handleFinalize = async () => {
    const res = await fetch('http://localhost:8000/api/get_album/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        "X-CSRFToken": cookie,
        "Accept": "applications/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: albumTitle,
        url: albumUrl,
        titleid: albumTitleId,
        timecodes: albumTimeCodes,
        artist: albumArtist,
        year: albumYear
      })
    });
    const json = await res.json();
    setId(json.id);
  }

  useEffect(() => {
    if (id) {
      const interval = setInterval(async () => {
        const res = await fetch('http://localhost:8000/api/progress/' + id);
        const json = await res.json();
        console.log(json);
        setPercentage(json.progress.percentage);
        setCurrentTask(json.progress.description);
        if (json.complete === true) {
          setComplete(true);
          setAlbumTimeCodes(json.result.timecodes);
          setAlbumTitle(json.result.title);
          setAlbumArtist(json.result.artist);
          setAlbumYear(json.result.year);
          setAlbumTitleId(json.result.titleid);
          console.log('complete');
        }
      }, 500)
      setIntervalId(interval);
    }
  }, [id]);


  const handleSubmit = async () => {
    console.log(`cookie is: ${cookie}`);
    const res = await fetch('http://localhost:8000/api/yturl', {
      method: 'POST',
      credentials: 'include',
      headers: {
        "X-CSRFToken": cookie,
        "Accept": "applications/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: albumUrl })
    });
    const json = await res.json();
    setId(json.id);
    console.log(json);
  };

  useEffect(() => {
    if (complete) {
      clearInterval(intervalId);
      setComplete(false);
    }
  }, [complete, intervalId]);

  return (
    <>
    <div className="App">
      <input type="text" onChange={handleUrlChange} value={albumUrl}></input>
      <button onClick={handleSubmit}>Submit</button>
      {currentTask && <h1>{currentTask}</h1>}
      {percentage && <h1>{percentage}</h1>}
      <h1>complete: {complete.toString()}</h1>
      <h1>id: {id}</h1>
      {albumTitleId && <h1>id: {albumTitleId}</h1>}
      {albumTitle && <h1>title: {albumTitle}</h1>}
      {albumArtist && <h1>artist: {albumArtist}</h1>}
      {albumYear && <h1>year: {albumYear}</h1>}
      {albumTimeCodes && <TimeCodes 
        handleChange={changeTimeCodes} 
        timeCodes={albumTimeCodes}
      />}
      <button onClick={handleFinalize}>looks good to me</button>
    </div>
    </>
  );
}
const tc = [['00:00', 'Plantasia'], ['03:24', 'Symphony For A Spider Plant'], ['06:04', 'Baby\'s Tears Blues'], ['09:08', 'Ode To An African Violet'], ['13:14', 'Concerto For Philodendron & Pothos'], ['16:24', 'Rhapsody In Green'], ['19:52', 'Swingin\' Spathiphyllums'], ['22:54', 'You Don\'t Have To Walk A Begonia'], ['25:29', 'A Mellow Mood For Maidenhair'], ['27:51', 'Music To Soothe The Savage Snake Plant']]

export default App;