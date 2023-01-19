import React, { useState } from 'react';
// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyAU7k32Yn87KrnkCk34qiSvLozLCBq6NZE",

  authDomain: "oseru-44da8.firebaseapp.com",

  projectId: "oseru-44da8",

  storageBucket: "oseru-44da8.appspot.com",

  messagingSenderId: "215273476431",

  appId: "1:215273476431:web:bb78ac27dafcf3d4e5353a",

  measurementId: "G-2FEXLBS386"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

function App() {
  const [ currentFrequency, setCurrentFrequency ] = useState(null);
  let audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let micStream = null;
  let analyzer = audioCtx.createAnalyser();
  let audioData = new Float32Array(analyserNode.fftSize);

  function startPitchDetection()
  {
      //connect to user media device and access audio
      navigator.mediaDevices.getUserMedia ({audio: true})
          .then((stream) =>
          {
              //connect media stream to analyzer node which can be used to find frequency data
              micStream = audioContext.createMediaStreamSource(stream);
              micStream.connect(analyzer);
          
              //repeat code every 100 ms
              setInterval(() => {

                  //set audio data to new float 32 array
                  audioData = new Float32Array(analyzer.fftSize);
                  //set float 32 array to current audio data
                  analyzer.getFloatFrequencyData(audioData);
                  
                  //calculate pitch
                  let pitch = calcFrequency(audioData, audioContext.sampleRate);

                  //update react component
                  setCurrentFrequency(`${pitch}`);
              }, 100);
          })
          // catch any errors
          .catch((err) =>
          {
              console.log(err);
          });
  }

  function calcFrequency(buffer, sampleRate) {
    //calculate frequency
    console.log(buffer);
  }

  return (
    <div className="App">
        <h1>Frequency</h1>
        <h2>{currentFrequency}</h2>
        <div>
            <button onClick= {()=>startPitchDetection()}>
                Detect Pitch
            </button>
        </div>
    </div>
  );
}

export default App;
