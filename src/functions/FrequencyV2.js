//this is actually the older algorithm, might be a good option to pursue for a more optimized computational less intensive algorithm

function frequencyToNote(frequency) {

    const notes = ['A', 'A#', 'B', 'C', 'C#','D', 'D#', 'E', 'F','F#','G', 'A♭'];
    
    const baseFrequency = ['A', 440];
  
    // frequency is the number of intervals of notes it has passed up or down from the value of the baseFrequency or baseNote
  
    var noteIntervalCount = (12 * Math.log( baseFrequency[1]/ frequency) ) / Math.log(2);
  
    return notes[Math.abs(Math.round(noteIntervalCount % (notes.length-1)))];
  
  }
  
  
  
  export default function FrequencyToNote(audioData, sampleRate) {
  
  
    // gather the highest frequencies found from fourier transform
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
    
      return topPeakFrequencies.map((pitch) => {
        return frequencyToNote(pitch[1]*frequencyRange);
        
      
      });
  
    }
  
    return calcFrequency(audioData, sampleRate)
  
  }