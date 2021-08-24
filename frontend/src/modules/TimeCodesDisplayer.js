import {
  useCallback,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import { TextField, Paper, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useSpring, animated } from "react-spring";
import TimeCodes from "./TimeCodes";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Box from "@material-ui/core/Box";

const TimeCodesDisplayer = ({ timeCodes, original, index, setIndex }) => {
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
          <Button
            onClick={() => {
              setIndex(index - 1);
            }}
            style={{
              position: "absolute",
              left: "-60px",
              top: "119px",
              zIndex: 200,
            }}
          >
            <ArrowBackIosIcon />
          </Button>
        )}
        {timeCodes &&
          timeCodes.map((tc, curr) => (
            <animated.div
              style={{ ...getZ(curr), position: "absolute", width: "100%" }}
            >
              <TimeCodes
                style={{ position: "absolute" }}
                showingIndex={index}
                curr={curr}
                timeCodes={tc}
                original={tc}
              />
            </animated.div>
          ))}
        {index < timeCodes.length - 1 && (
          <Button
            onClick={() => {
              setIndex(index + 1);
            }}
            style={{
              position: "absolute",
              right: "-60px",
              top: "119px",
              zIndex: 200,
            }}
          >
            <ArrowForwardIosIcon />
          </Button>
        )}
      </Box>
    </>
  );
};

export default TimeCodesDisplayer;
