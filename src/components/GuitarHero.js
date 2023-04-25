// GuitarHero.js
import React, { useEffect, useState } from 'react';
import Note from './Note';

const GuitarHero = ({ notes, play }) => {
  const [activeNotes, setActiveNotes] = useState([]);
  const noteDuration = 10

  const highestmidi = () => {
    console.log(notes);
    let highest = null;
    for (let i = 0; i < notes.length; i++) {
      const item = notes[i];
      if (item['midi_note'] != null) {
        if (highest == null || item['midi_note'] > highest['midi_note']) {
          highest = item;
        }
      }
    }
    return highest;
  }
  
  const lowestmidi = () => {
    let lowest = null;
    for (let i = 0; i < notes.length; i++) {
      const item = notes[i];
      if (item['midi_note'] != null) {
        if (lowest == null || item['midi_note'] < lowest['midi_note']) {
          lowest = item;
        }
      }
    }
    return lowest;
  }

  useEffect(() => {
    if (play) {
      const spawnTimers = [];

      notes.forEach((note, noteIndex) => {
        const spawnTimer = setTimeout(() => {
          setActiveNotes((prevNotes) => [
            ...prevNotes,
            { ...note, noteIndex },
          ]);
        }, ((note.time_played- noteDuration) * 1000));
        spawnTimers.push(spawnTimer);
      });

      return () => {
        spawnTimers.forEach((timer) => clearTimeout(timer));
      };
    } else {
      setActiveNotes([]);
    }
  }, [play, notes]);

  const midiToNote = (midiNote) => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNote / 12) - 1;
    const noteName = noteNames[midiNote % 12];
    return noteName + octave;
  };

  const noteArr = () => {
    let numbers = [];
    for (let i = lowestmidi()['midi_note']; i <= highestmidi()['midi_note']; i += 1) {
      numbers.push(i);
    }
    return numbers;
  }


  return (
    <div className="guitar-hero">
      <div className="notes-container">
        {activeNotes.map((note, index) => (
          <Note
            key={index}
            indexCount={highestmidi()['midi_note'] - lowestmidi()['midi_note']+1}
            noteIndex={note.midi_note - lowestmidi()['midi_note']}
            duration={note.note_held}
            noteSpeed={noteDuration}
          />
        ))}
      </div>
        <div className="note-info">
          {noteArr().map((note, index) => (
            <div key={index} className="note-label">
              {midiToNote(note)}
            </div>
          ))}
      </div>

    </div>
  );
};


export default GuitarHero;