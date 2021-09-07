import { TextField, Button, Tooltip } from "@material-ui/core";
import { css } from "@emotion/react";
import ReplayIcon from "@material-ui/icons/ReplayOutlined";

const EditableAlbumAttribute = ({ info, setNewInfo, original, label }) => {
  const handleReset = () => {
    setNewInfo(original);
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <TextField
	  spellcheck={false}
          value={info}
          label={label}
          onChange={(e) => setNewInfo(e.target.value)}
        />
        {info !== original && (
          <Tooltip title="Reset" placement="right">
            <Button
              onClick={handleReset}
              style={{
                height: "min-content",
                width: "min-content",
                alignSelf: "center",
                color: "var(--blue)",
                minWidth: 0,
              }}
            >
              <ReplayIcon
                fontSize="small"
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </Button>
          </Tooltip>
        )}
      </div>
    </>
  );
};
export default EditableAlbumAttribute;
