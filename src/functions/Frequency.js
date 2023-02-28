
import React from 'react'

export default function Frequency(audioData, sampleRate) {

  function frequencyToNote(frequency) {

    const notes = ['A', 'A#', 'B', 'C', 'C#','D', 'D#', 'E', 'F','F#','G', 'A♭'];
    
    const baseFrequency = ['A', 440];
  
    // frequency is the number of intervals of notes it has passed up or down from the value of the baseFrequency or baseNote
  
    var noteIntervalCount = (12 * Math.log( baseFrequency[1]/ frequency) ) / Math.log(2);
  
    return notes[Math.abs(Math.round(noteIntervalCount % (notes.length-1)))];
  
  }
  

  // gather the highest frequencies found from fourier transform
  function calcFrequency(buffer, sampleRate) {

    const frequencyRange = (sampleRate/2)/(buffer.length/2);

    // reduce the buffer to reduce amount of more heavy operations?? Maybe 

    var notesData = [];
    var lastNote;
    var accumulativeNoteValue = 0;
    var accumulativeNoteCount = 0;
    var largestAmplitude = 0;

    //40 hertz for lowest frequency note reachable by bass guitar and highest for highest note frequency reachable by violin
    
    for (let i = Math.floor(40 /frequencyRange); i < Math.floor(4000/frequencyRange); i++) {
      if (lastNote != frequencyToNote(i*frequencyRange)){

        //note , frequency, average accumulative amplitude of note, largest amplitude of note, how centered is the amplitude layer
        notesData.push([lastNote, i*frequencyRange, accumulativeNoteValue/accumulativeNoteCount, buffer[largestAmplitude], accumulativeNoteCount, (i-largestAmplitude)/accumulativeNoteCount]);
        lastNote = frequencyToNote(i*frequencyRange);
        accumulativeNoteValue = 0;
        accumulativeNoteCount = 0;
        largestAmplitude = i;
      }

      if (buffer[largestAmplitude] < buffer[i]){
        largestAmplitude = i;
      }

      accumulativeNoteValue += buffer[i];
      accumulativeNoteCount += 1;
      
    }

    // sort the notes derived // rough and not extremely precise so far
    // pitch calculations will be revisted after the notes are figured out
    notesData.sort(function(a, b){return b[2] - a[2]});


    // obtain the average amplitude of different notes
    
    var accumlativeNoteAmplitudeAverage = 0;
    notesData.forEach((note, index) => {
      if ( isNaN(note[2]) == false){
        accumlativeNoteAmplitudeAverage += note[2]/notesData.length;
      }
    })

    // check the notes to see if any of the notes exceed the average by a threshhold of 1.33
    const playedNotes = notesData.filter((note) =>  (note[2] > (accumlativeNoteAmplitudeAverage * 0.80)));


    return playedNotes;
  }

  return calcFrequency(audioData, sampleRate);

}





