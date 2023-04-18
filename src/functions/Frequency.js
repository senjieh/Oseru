function frequencyToNote(frequency) {
  const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
  const baseFrequency = ['A', 440];

  var noteIntervalCount = 12 * Math.log2(frequency / baseFrequency[1]);
  var noteIndex = Math.round(noteIntervalCount);
  return notes[(noteIndex % 12 + 12) % 12];
}

function quadraticInterpolation(arr, index) {
  const y1 = arr[index - 1];
  const y2 = arr[index];
  const y3 = arr[index + 1];

  const numerator = y1 - 2 * y2 + y3;
  if (numerator === 0) {
    return index;
  }

  const delta = (y1 - y3) / (2 * numerator);
  return index + delta;
}

function noteAccuracy(detectedFrequency, idealFrequency) {
  return 100 - (Math.abs(detectedFrequency - idealFrequency) / idealFrequency) * 100;
}

function calcFrequency(buffer, sampleRate) {
  const frequencyRange = (sampleRate / 2) / (buffer.length / 2);

  var notesData = [];
  var lastNote;
  var accumulativeNoteValue = 0;
  var accumulativeNoteCount = 0;
  var largestAmplitude = 0;

  for (let i = Math.floor(40 / frequencyRange); i < Math.floor(4000 / frequencyRange); i++) {
    const currentNote = frequencyToNote(i * frequencyRange);
    if (lastNote !== currentNote[0]) {

      if (lastNote) {
        const interpolatedIndex = quadraticInterpolation(buffer, largestAmplitude);
        const detectedFrequency = interpolatedIndex * frequencyRange;
        const accurateNote = frequencyToNote(detectedFrequency);

        notesData.push([
          accurateNote[0], // note
          detectedFrequency, // detected frequency
          accumulativeNoteValue / accumulativeNoteCount, // average accumulative amplitude of note
          buffer[largestAmplitude], // largest amplitude of note
          accumulativeNoteCount, // how centered is the amplitude layer
          (i - largestAmplitude) / accumulativeNoteCount, // timing accuracy
          noteAccuracy(detectedFrequency, accurateNote[1]), // note accuracy
          new Date()
        ]);
      }
      lastNote = currentNote[0];
      accumulativeNoteValue = 0;
      accumulativeNoteCount = 0;
      largestAmplitude = i;
    }

    if (buffer[largestAmplitude] < buffer[i]) {
      largestAmplitude = i;
    }

    accumulativeNoteValue += buffer[i];
    accumulativeNoteCount += 1;
  }

  notesData.sort(function (a, b) {
    return b[2] - a[2];
  });

  var accumlativeNoteAmplitudeAverage = 0;
  notesData.forEach((note, index) => {
    if (isNaN(note[2]) == false) {
      accumlativeNoteAmplitudeAverage += note[2] / notesData.length;
    }
  })

  const playedNotes = notesData.filter((note) => (note[2] > (accumlativeNoteAmplitudeAverage * 0.80)));

  return playedNotes;
}

function hasAllNegInfinity(arr) {
  if (!(arr instanceof Float32Array)) {
    throw new Error("Input must be a Float32Array.");
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== -Infinity) {
      return false;
    }
  }

  return true;
}

function Frequency(audioData, sampleRate) {
  // Check if the input is a Float32Array with all elements equal to -Infinity
  if (hasAllNegInfinity(audioData)) {
    console.error("The input is an array of negative infinities.");
    return; // Stop the execution of the function
  }
  return calcFrequency(audioData, sampleRate);
}

// Export the Frequency function as the default export
module.exports.Frequency = Frequency;
module.exports.quadraticInterpolation = quadraticInterpolation;
module.exports.frequencyToNote = frequencyToNote;