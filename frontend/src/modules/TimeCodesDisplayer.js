import { Button } from "@material-ui/core";
import TimeCodes from "./TimeCodes";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Box from "@material-ui/core/Box";
import { styled } from "@material-ui/core/styles";

const ArrowButton = styled(Button)({
  padding: "5px",
  minWidth: 0,
});

const TimeCodesDisplayer = ({
  timeCodes,
  original,
  index,
  setIndex,
  timeCodesIndex,
  timeCodesString,
  setTimeCodesString,
}) => {
  const getZ = (curr) => {
    if (curr === index) {
      return { zIndex: 100 };
    } else {
      return { zIndex: 0 };
    }
  };

  return (
    <>
      <Box
        style={{
          position: "relative",
          height: "300px",
        }}
      >
        {index > 0 && (
          <ArrowButton
            onClick={() => {
              setIndex(index - 1);
            }}
            style={{
              position: "absolute",
              left: "-57px",
              top: "118px",
              zIndex: 200,
            }}
          >
            <ArrowBackIosIcon
              style={{ transform: "translateX(4px)", padding: 0 }}
            />
          </ArrowButton>
        )}
        {timeCodes.length ? (
          timeCodes.map((tc, curr) => (
            <div
              id="timecodes"
              style={{ ...getZ(curr), position: "relative", width: "100%" }}
            >
              <TimeCodes
                style={{ position: "absolute" }}
                showingIndex={index}
                curr={curr}
                timeCodesList={timeCodes}
                timeCodes={tc}
                original={original}
                timeCodesString={timeCodesString}
                setTimeCodesString={setTimeCodesString}
              />
            </div>
          ))
        ) : (
          <div id="timecodes" style={{ width: "100%" }}>
            <TimeCodes
              style={{ position: "absolute" }}
              showingIndex={0}
              curr={0}
              timeCodes={timeCodes[0]}
              timeCodesList={timeCodes}
              original={original}
              timeCodesString={timeCodesString}
              setTimeCodesString={setTimeCodesString}
            />
          </div>
        )}
        {index < timeCodes.length - 1 && (
          <ArrowButton
            onClick={() => {
              setIndex(index + 1);
            }}
            style={{
              position: "absolute",
              right: "-57px",
              top: "118px",
              zIndex: 200,
            }}
          >
            <ArrowForwardIosIcon style={{ padding: 0 }} />
          </ArrowButton>
        )}
      </Box>
    </>
  );
};

export default TimeCodesDisplayer;
