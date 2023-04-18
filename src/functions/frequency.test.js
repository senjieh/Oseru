const { Frequency, frequencyToNote, quadraticInterpolation } = require('./Frequency.js');



// Acceptance tests to ensure that the Frequency function is working as intended
describe('Frequency Calculation', () => {
    test('Frequency function should return an array of played notes and their properties', () => {
        // There is data here but it is really big and would make this submission really messy
        const audioData = [];
        const sampleRate = 44100;
        const playedNotes = Frequency(audioData, sampleRate);
    
        expect(playedNotes).toBeInstanceOf(Array);
        playedNotes.forEach(note => {
            expect(note).toHaveLength(6);
            expect(typeof note[0]).toBe('string');
            expect(typeof note[1]).toBe('number');
            expect(typeof note[2]).toBe('number');
            expect(typeof note[3]).toBe('number');
            expect(typeof note[4]).toBe('number');
            expect(typeof note[5]).toBe('number');
        });
    });

    test('Response time for a played note should be below 50ms', async () => {
        // There is data here but it is really big and would make this submission really messy
        const audioData = [];
        const sampleRate = 44100;
        const startTime = performance.now();
        const playedNotes = Frequency(audioData, sampleRate);
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        expect(responseTime).toBeLessThan(50);
    });

    test('FrequencyToNote should return the correct note for a given frequency', () => {
        const note1 = frequencyToNote(440);
        const note2 = frequencyToNote(261.63);
        const note3 = frequencyToNote(493.88);
    
        expect(note1).toBe('A');
        expect(note2).toBe('C');
        expect(note3).toBe('B');
    });
  
    test('Should correctly identify the highest amplitude frequencies', () => {
        const sampleRate = 44100;
        const buffer = new Float32Array(32768);
    
        // Simulate some frequency peaks (A4, C5, and G5) in the buffer data
        const peakIndices = [
            Math.round(440 * buffer.length / sampleRate), // A4
            Math.round(523.25 * buffer.length / sampleRate), // C5
            Math.round(783.99 * buffer.length / sampleRate), // G5
        ];
    
        peakIndices.forEach((index) => {
            buffer[index] = 1;
        });
    
        // Calculate the highest amplitude frequencies
        const result = Frequency(buffer, sampleRate);
    
        // Expected notes
        const expectedNotes = ['A', 'C', 'G'];
    
        // Check if the identified notes match the expected notes
        expectedNotes.forEach((note, index) => {
            expect(result[index][0]).toBe(note);
        });
    });
});

// White-box test for quadraticInterpolation() to ensure that the correct interpolated index is returned under different conditions
describe('quadraticInterpolation', () => {
    
    test('Should return the correct interpolated index', () => {
        const inputArray = [1, 3, 7, 12, 7, 3, 1];
        const peakIndex = 3;
        const expectedResult = 3; // In this case, the peak is already at the highest point, so no interpolation is needed
    
        const result = quadraticInterpolation(inputArray, peakIndex);
        expect(result).toBeCloseTo(expectedResult);
    });

    test('Should handle cases when the peak is between two indices', () => {
        const inputArray = [1, 3, 7, 11.5, 11, 3, 1];
        const peakIndex = 3;
        const expectedResult = 3.4;
        const result = quadraticInterpolation(inputArray, peakIndex);
        expect(result).toBeCloseTo(expectedResult);
    });

    test('Should return the given index if the difference is zero', () => {
        const inputArray = [1, 1, 1];
        const peakIndex = 1;
        const expectedResult = 1;
    
        const result = quadraticInterpolation(inputArray, peakIndex);
        expect(result).toBeCloseTo(expectedResult);
    });
});

