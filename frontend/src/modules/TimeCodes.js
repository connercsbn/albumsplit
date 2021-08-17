import { useState, useEffect } from 'react'

const TimeCodes = ({handleChange, timeCodes}) => {
    const [approve, setApprove] = useState(true);
    const [timeCodesString, setTimeCodesString] = useState('');

    let dimensions = {width: 700, height: 300};

    useEffect(() => {
        if (approve) {
            setTimeCodesString(timeCodes.map(([time, songTitle], index) => (`${time} ${songTitle}`)).join('\n'));
        }
    }, [timeCodes, approve]);

    if (approve) {
        return (
        <>
        <div style={dimensions}>
            {timeCodes.map(([time, songTitle], index) => (
                <p>{`${time} ${songTitle}`}</p>
            ))}
        </div>
        <button onClick={() => setApprove(false)}>Edit</button>
        </>
        )
    } else {
        return (
        <>
        <textarea style={dimensions} onChange={handleChange} value={timeCodesString} />
        </>
        )
    }
};

export default TimeCodes;