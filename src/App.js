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
  let audioContext = null;
  let micStream = null;
  let analyzer = null;
  let audioData = null;

  function startPitchDetection(){
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 16384;
      audioData = new Float32Array(analyzer.fftSize);
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
                  let pitches = calcFrequency(audioData, audioContext.sampleRate);

                  //update react component
                  setCurrentFrequency(`${pitches}`);
              }, 100);
          })
          // catch any errors
          .catch((err) =>
          {
              console.log(err);
          });
  }

  function calcFrequency(buffer, sampleRate) {

    const frequencyRange = (sampleRate/2)/(buffer.length/2);

    var peakFrequencies = [];

    for (let i = 0; i < buffer.length/2; i++) {
      
      if (parseFloat(buffer[i]) > parseFloat(buffer[i-1]) && parseFloat(buffer[i]) > parseFloat(buffer[i+1]) ){
        peakFrequencies.push([buffer[i], i]);
      }
    }

    var topPeakFrequencies = [];

    peakFrequencies.sort(function(a, b){return a[0] - b[0]}).reverse()
    
    var topNotesCount = 5;

    for (let i = 0; i < topNotesCount; i++){
      var inRange = false;
      for (let tp = 0; tp < topPeakFrequencies.length; tp++){
        if (parseInt(topPeakFrequencies[tp][1] *0.8) < parseInt(peakFrequencies[i][1])  &&  parseInt(topPeakFrequencies[tp][1] *1.2) > parseInt(peakFrequencies[i][1])){
          inRange = true;
          topNotesCount ++;
          break;
        }
      }
      if (!inRange) {
        topPeakFrequencies.push(peakFrequencies[i]);
      }
    }

    
    return topPeakFrequencies.map((pitch) => (pitch[1]*frequencyRange));
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
