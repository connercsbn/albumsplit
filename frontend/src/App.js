import './App.css';
import { useState, useEffect, useCallback} from 'react'

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

  const handleUrlChange = (event) => {
    setAlbumUrl(event.target.value)
  }
  const changeTimeCodes = (event) => {
    setAlbumTimeCodes(event.target.value)
  }
  const handleFinalize = async () => {
    const res = await fetch('http://localhost:8000/api/get_album/', {
      method: 'POST',
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
          console.log('complete');
          setComplete(true);
        }
      }, 500)
      setIntervalId(interval);
    }
  }, [id]);


  const handleSubmit = async () => {
    const res = await fetch('http://localhost:8000/api/yturl', {
      method: 'POST',
      body: JSON.stringify({ url: albumUrl })
    });
    const json = await res.json();
    setId(json.id);
    console.log(json);
  };

  const getAlbumInfo = useCallback(async () => {
    const res = await fetch('http://localhost:8000/api/album_data/' + id);
    const json = await res.json();
    console.log(json);
    setAlbumTimeCodes(json.timecodes);
    setAlbumTitle(json.title);
    setAlbumArtist(json.artist);
    setAlbumYear(json.year);
    setAlbumTitleId(json.titleid);
  }, [id])

  useEffect(() => {
    if (complete) {
      clearInterval(intervalId);
      getAlbumInfo();
      setComplete(false);
    }
  }, [complete, intervalId, getAlbumInfo]);

  return (
    <>
    <div className="App">
      <input type="text" onChange={handleUrlChange} value={albumUrl}></input>
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={handleFinalize}>looks good to me</button>
      {currentTask && <h1>{currentTask}</h1>}
      {percentage && <h1>{percentage}</h1>}
      <h1>complete: {complete.toString()}</h1>
      <h1>id: {id}</h1>
      {albumTitleId && <h1>id: {albumTitleId}</h1>}
      {albumTitle && <h1>title: {albumTitle}</h1>}
      {albumArtist && <h1>artist: {albumArtist}</h1>}
      {albumYear && <h1>year: {albumYear}</h1>}
      {albumTimeCodes && <textarea style={{width: 700, height: 300}} onChange={changeTimeCodes} value={
        albumTimeCodes.map(([time, songTitle], index) => (
        `${time} ${songTitle}`)
      ).join('\n')
      }></textarea>}
    </div>
    </>
  );
}
const tc = [['00:00', 'Plantasia'], ['03:24', 'Symphony For A Spider Plant'], ['06:04', 'Baby\'s Tears Blues'], ['09:08', 'Ode To An African Violet'], ['13:14', 'Concerto For Philodendron & Pothos'], ['16:24', 'Rhapsody In Green'], ['19:52', 'Swingin\' Spathiphyllums'], ['22:54', 'You Don\'t Have To Walk A Begonia'], ['25:29', 'A Mellow Mood For Maidenhair'], ['27:51', 'Music To Soothe The Savage Snake Plant']]

export default App;