import { useState, useEffect } from "react";
import { TextField, Paper, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import TimeCodes from './TimeCodes';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Box from '@material-ui/core/Box';

const TimeCodesDisplayer = ({ timeCodes, original, index, setIndex }) => {
  const back = () => {
    const l = timeCodes.length;
    setIndex((((index - 1) % l) + l) % l);
  }
  const next = () => {
    const l = timeCodes.length;
    setIndex((((index + 1) % timeCodes.length) + l) % l);
  }
  return (
    <>
    <Box style={{position: 'relative'}}>
      <ArrowBackIosIcon 
      onClick={back}
        style={{
          position: 'absolute',
          left: '-40px',
          top: '40px'
        }}
      />
      {timeCodes.map((tc, key) => (
         index === key 
          ? <TimeCodes timeCodes={tc} key={key} original={tc} />
          : ''
      ))}
      <ArrowForwardIosIcon 
      onClick={next}
        style={{
          position: 'absolute',
          right: '-40px',
          top: '40px'
        }}
      />
    </Box>
    </>
  )
};

export default TimeCodesDisplayer;
