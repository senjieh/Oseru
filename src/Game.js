import React, { useState } from 'react'
const { Frequency } = require('./functions/Frequency.js');

export default function Game() {

    const [ currentState, setCurrentState ] = useState(null);
    let audioContext = null;
    let micStream = null;
    let analyzer = null;
    let audioData = null;
    

    function startPitchDetection(){
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 32768;
        audioData = new Float32Array(analyzer.fftSize);
        //connect to user media device and access audio
        navigator.mediaDevices.getUserMedia ({audio: true})
            .then((stream) =>
            {
                //connect media stream to analyzer node which can be used to find frequency data
                micStream = audioContext.createMediaStreamSource(stream);
                micStream.connect(analyzer);
            
            })
            // catch any errors
            .catch((err) =>
            {
                console.log(err);
            });
    }

    function startReactGame(){

        startPitchDetection();
        
        //repeat code every 100 ms
        setInterval(() => {

            //set audio data to new float 32 array
            audioData = new Float32Array(analyzer.fftSize);
            //set float 32 array to current audio data
            analyzer.getFloatFrequencyData(audioData);
            
            //calculate pitch
            let pitches = Frequency(audioData, audioContext.sampleRate);

            setCurrentState(pitches);

        }, 500);

    }
    
    return (
        <div>
            <button onClick= {()=>startReactGame()}>Start Game</button>
            <h3>{currentState != null ? currentState.map((note) => {
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
                )
            }) : <></>}</h3>
        </div>
        
    )
}
