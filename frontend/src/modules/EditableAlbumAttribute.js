import { TextField, Button } from "@material-ui/core";

const EditableAlbumAttribute = ({ info, setNewInfo, original, label }) => {
  const handleReset = () => {
    setNewInfo(original);
  };
  return (
    <>
      <div>
        <TextField
          value={info}
          label={label}
          onChange={(e) => setNewInfo(e.target.value)}
        />
        <Button onClick={handleReset}>Reset</Button>
      </div>
    </>
  );
};
export default EditableAlbumAttribute;
