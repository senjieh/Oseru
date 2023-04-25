import React, { useState, useRef, useEffect } from 'react'
import GuitarHero from './GuitarHero';
import Score from './Score';
import { db } from '../firebase';
import { doc, collection, getDoc , query, where } from "firebase/firestore";
const { Frequency } = require('../functions/Frequency.js');


export default function Game({mapID}) {
  const [notes , setNotes ] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [play, setPlay] = useState(false);
  const [score, setScore] = useState(0);
  const [currentState, setCurrentState] = useState();
  const downloadLink = useRef(null);
  const intervalRef = useRef(null);
  let audioContext = null;
  let micStream = null;
  let analyzer = null;
  let audioData = null;
  let playTimestamp = null;
  let mapRef = null;
  let mapInfo = null;
  let mapData = null;


  useEffect(() => {
    const fetchMapData = async () => {
      mapRef = doc(db, 'songs', mapID);
      mapInfo = await getDoc(mapRef);
      mapData = mapInfo.data();
      setNotes(mapData.song_data);
    };

    fetchMapData();
  }, []);


  useEffect(() => {
    if (mediaRecorder && mediaRecorder.state === 'inactive' && recordedChunks.length > 0) {
      downloadLink.current.href = URL.createObjectURL(new Blob(recordedChunks));
      downloadLink.current.download = 'acetest.wav';
    }
  }, [mediaRecorder, recordedChunks]);

  function startPitchDetection() {
    return new Promise((resolve, reject) => {
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
          resolve();
        })
        // catch any errors
        .catch((err) => {
          console.log(err);
          reject(err);
        });
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
      console.log("objNote")
      console.log(objNote)
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
  
  function analyzePitch() {
    audioData = new Float32Array(analyzer.fftSize);
    analyzer.getFloatFrequencyData(audioData);
    let pitches = Frequency(audioData, audioContext.sampleRate);
    calcCurrentState(pitches);
  }
  
  function calcCurrentState(pitches){
    const notesToPlayList = notesToPlay(timeDifferenceInSeconds(playTimestamp));
    const matched = findMatchingNotes(notesToPlayList, pitches);

    console.log(pitches);
    setCurrentState(pitches);
    console.log(matched);
    console.log(notesToPlay);
    setScore((prevScore) => prevScore + matched.length * 1000);
  }

  async function startReactGame() {
    setPlay(true);
    await startPitchDetection();
  
    playTimestamp = new Date();
  
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(analyzePitch, 100);
  }

  function startRecording() {
    setRecordedChunks([]);
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
        <div>
            <button onClick={() => startReactGame()} className="light-small-button">Start Game</button>
            <button onClick={() => startRecording()} className="light-small-button">Start Recording</button>
            <button onClick={() => stopRecording()} className="light-small-button">Stop Recording</button>
            <button onClick={() => downloadRecording()} className="light-small-button">Download Recording</button>
            <p>{score}</p>
            <a ref={downloadLink} style={{ display: 'none' }}>
                Download
            </a>
        </div>
        <div>
            <div className="gh-container">
              { notes !== null ? (<GuitarHero notes={notes} play={play}/>) : <></>}
            </div>
        </div>
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
      </div>
    );
  }