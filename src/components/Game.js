import React, { useState, useRef, useEffect } from 'react'
import GuitarHero from './GuitarHero';
const { Frequency } = require('../functions/Frequency.js');


export default function Game() {

    const notes = [{"time_played": 0, "midi_note": 52, "frequency": 164.81, "note_held": 1.1015625, "velocity": 127, "channel": 2}, {"time_played": 3, "midi_note": 52, "frequency": 164.81, "note_held": 1.1015625, "velocity": 127, "channel": 2}, {"time_played": 5, "midi_note": 52, "frequency": 164.81, "note_held": 1.1015625, "velocity": 127, "channel": 2}];

    const [currentState, setCurrentState] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [play, setPlay] = useState(false);
    const [score, setScore] = useState(0)
    const downloadLink = useRef(null);
    let audioContext = null;
    let micStream = null;
    let analyzer = null;
    let audioData = null;
    let playTimestamp = null;

    useEffect(() => {
        if (mediaRecorder && mediaRecorder.state === 'inactive' && recordedChunks.length > 0) {
          downloadLink.current.href = URL.createObjectURL(new Blob(recordedChunks));
          downloadLink.current.download = 'acetest.wav';
        }
      }, [mediaRecorder, recordedChunks]);
  
    function startPitchDetection() {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyzer = audioContext.createAnalyser();
  
      analyzer.fftSize = 32768;
      audioData = new Float32Array(analyzer.fftSize);
      //connect to user media device and access audio
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          //connect media stream to analyzer node which can be used to find frequency data
          micStream = audioContext.createMediaStreamSource(stream);
          micStream.connect(analyzer);
        })
        // catch any errors
        .catch((err) => {
          console.log(err);
        });
    }

    function notesToPlay(timestamp) {
      let activeNotes = notes.filter(note => {
        return timestamp >= note.time_played && timestamp <= note.time_played + note.note_held;
      });
      return activeNotes;
    }


    function timeDifferenceInSeconds(pastDate) {
      let now = new Date();
      let diffMilliseconds = now - pastDate;
      let diffSeconds = diffMilliseconds / 1000;
      return diffSeconds;
    }

    // Function to find matching notes
    const findMatchingNotes = (objectsList, notesData) => {
      const matches = [];

      objectsList.forEach((obj) => {
        const objNote = midiToNote(obj.midi_note);
        notesData.forEach((noteArr, index) => {
          const noteDataNote = noteArr[0];
          if (objNote === noteDataNote) {
            matches.push({
              objectIndex: objectsList.indexOf(obj),
              notesDataIndex: index,
              note: objNote,
            });
          }
        });
      });

      return matches;
    };
    
    function calcCurrentState(pitches){
      const notesToPlayList = notesToPlay(timeDifferenceInSeconds(playTimestamp));

      const matched = findMatchingNotes(notesToPlayList, pitches);
      //console.log(notesToPlayList);
      console.log(matched);
    }
  
    function startReactGame() {
      setPlay(true);
      startPitchDetection();
  
      playTimestamp = new Date();
      //repeat code every 100 ms
      setInterval(() => {
        //set audio data to new float 32 array
        audioData = new Float32Array(analyzer.fftSize);
        //set float 32 array to current audio data
        analyzer.getFloatFrequencyData(audioData);
  
        //calculate pitch
        let pitches = Frequency(audioData, audioContext.sampleRate);
  
        calcCurrentState(pitches);
      }, 100);

    }

    function startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          const options = { mimeType: 'audio/webm' };
          const mediaRecorderInstance = new MediaRecorder(stream, options);
    
          mediaRecorderInstance.addEventListener('dataavailable', function (e) {
            if (e.data.size > 0) setRecordedChunks((prev) => [...prev, e.data]);
          });
    
          mediaRecorderInstance.start();
          setMediaRecorder(mediaRecorderInstance);
        });
      }
    
      function stopRecording() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }

      const midiToNote = (midiNote) => {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const octave = Math.floor(midiNote / 12) - 1;
        const noteName = noteNames[midiNote % 12];
        return noteName + octave;
      };
    
      function downloadRecording() {
        if (recordedChunks.length > 0) {
          downloadLink.current.click();
        } else {
          alert('No recording to download');
        }
      }
    
      return (
        <div>
            <button onClick={() => startReactGame()}>Start Game</button>
            <button onClick={() => startRecording()}>Start Recording</button>
            <button onClick={() => stopRecording()}>Stop Recording</button>
            <button onClick={() => downloadRecording()}>Download Recording</button>
            <h3>
                {currentState != null
                ? currentState.map((note) => {
                    return (
                        <div>
                        <h3>Note:</h3>
                        <h2>{note[0]}</h2>
                        <h3>Frequency:</h3>
                        <h2>{note[1]}</h2>
                        <h3>Average Frequency Amplitude:</h3>
                        <h2>{note[2]}</h2>
                        <h3>Peak Amplitude:</h3>
                        <h2>{note[3]}</h2>
                        <h3>Offset:</h3>
                        <h2>{note[4]}</h2>
                        </div>
                    );
                    })
                : ''}
            </h3>
            <a ref={downloadLink} style={{ display: 'none' }}>
                Download
            </a>
            <div className="gh-container">
                <GuitarHero notes={notes} play={play}/>
            </div>
        </div>
      );
    }