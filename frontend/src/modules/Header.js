import { useEffect } from "react";

const Header = () => {
  const getApi = async () => {
    const res = await fetch("http://localhost:8000/api/index");
    const json = await res.json();
    console.log(json);
    return json;
  };
  useEffect(() => {
    getApi();
  });
  return (
    <>
      <h1 className="red">Albumsplit</h1>
      {/* <p className="blue">
        Pick a youtube album or audiobook whose timecodes are in the description
        or comments, and this will download the album, separate and tag each
        track, and put it in a zip file
      </p> */}
    </>
  );
};

export default Header;
