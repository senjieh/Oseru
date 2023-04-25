// Note.js
import React from 'react';
const Note = ({ indexCount, noteIndex, duration, noteSpeed }) => {

    const noteStyle = {
        left: `${noteIndex * (100/(indexCount))}%`,
        width: `calc(100%/${indexCount})`,
        height: `calc((100%/${noteSpeed/duration}))`,
        animationDuration: `${noteSpeed*2}s`,
    };

    return <div className="note" style={noteStyle}></div>;
};

export default Note;