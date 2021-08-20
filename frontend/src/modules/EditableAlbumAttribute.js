import { TextField } from "@material-ui/core";

const EditableAlbumAttribute = ({ info, setInfo, label }) => {
  return (
    <>
      <div>
        <TextField
          value={info}
          label={label}
          onChange={(e) => setInfo(e.target.value)}
        />
      </div>
    </>
  );
};
export default EditableAlbumAttribute;
