// Note.js
import React from 'react';
const Note = ({ indexCount, noteIndex, duration }) => {

    const animationDuration = 10/2;

    const noteStyle = {
        left: `${noteIndex * (100/(indexCount+1))}%`,
        width: `calc(100%/${indexCount})`,
        height: `calc((100%/${animationDuration * duration}))`,
        animationDuration: `${animationDuration}s`,
    };

    return <div className="note" style={noteStyle}></div>;
};

export default Note;