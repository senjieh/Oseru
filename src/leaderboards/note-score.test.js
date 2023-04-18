const scored_note = require('./note-score.js');
//Used the Jest framework test suite to write out the tests
//These test cover the  various cases for the scoring system that will give a score for each individual note
//This is an acceptance test
describe('NoteScore', () => {
    describe('constructor', () => {
        it('create a new NoteScore object with correct properties of a note', () => {
            const song_data = [13.5, 67, 392, 1.1015625, 127, 2];
            const elapsed_time = Date.now();

            const noteScore = new scored_note(song_data, elapsed_time);

            expect(noteScore.song_data).toEqual(song_data);
            expect(noteScore.expected_input_freq).toEqual(392);
            expect(noteScore.note_duration).toEqual(1.1015625);
            expect(noteScore.expected_time).toEqual(13.5);
            expect(noteScore.elapsed_time).toEqual(elapsed_time);
        });
    });

//This is an acceptance test for frequency score
    describe('ScoreEachNote', () => {
        it('Should return the corect score for an exact note', () => {
            const song_data = [13.5, 67, 392, 1.1015625, 127, 2];
            const elapsed_time = 13.5;
            const noteScore = new scored_note(song_data, elapsed_time);
            const user_freq = 392;
            const player_dur = 1.1015625;

            score = noteScore.ScoreEachNote(user_freq, player_dur);
            freq_score = score - 50;//accomodating by removing the perfect timing score to get frequency score
            expect(freq_score).toEqual(50);
        });
//This is an acceptance test for frequency score
        it('Should return the score value between 25 and 50 that is calculated within the acceptable tolerance', () => {
            const song_data = [13.5, 67, 392, 1.1015625, 127, 2];
            const elapsed_time = 13.5;
            const noteScore = new scored_note(song_data, elapsed_time);
            const player_dur = 1.1015625;
            const user_freq = 410; //

            score = noteScore.ScoreEachNote(user_freq, player_dur);
            freq_score = score - 50; //accomodating by removing the perfect timing score to get frequency score
            expect(freq_score).toBeGreaterThanOrEqual(25);
            expect(freq_score).toBeLessThan(50);
        });
//This is an acceptance test for frequency score
        it('Should return 0 if the played frequency is outside the calculated tolerance', () => {
            const song_data = [13.5, 67, 392, 1.1015625, 127, 2];
            const elapsed_time = 13.5;
            const noteScore = new scored_note(song_data, elapsed_time);
            const user_freq = 450;
            const player_dur = 1.1015625;

            score = noteScore.ScoreEachNote(user_freq, player_dur);
            expect(score).toEqual(0);           
        });
//This is an acceptance test for timing score
        it('Should return 50 if the note duration is exact', () => {
            const song_data = [13.5, 67, 392, 1.1015625, 127, 2];
            const elapsed_time = 13.5;
            const noteScore = new scored_note(song_data, elapsed_time);
            const user_freq = 392;
            const player_dur = 1.1015625;

            score = noteScore.ScoreEachNote(user_freq, player_dur);
            time_score = score -50;//accomodating by removing the perfect freq score to get timing score
            expect(time_score).toEqual(50);           
        });
//This is an acceptance test for timing score
        it('Should return score value between 25 and 50 if the note duration is within the calculated tolerance', () => {
            const song_data = [13.5, 67, 392, 1.1015625, 127, 2];
            const elapsed_time = 13.5;
            const noteScore = new scored_note(song_data, elapsed_time);
            const user_freq = 392;
            const player_dur = 1.2; //for this given example it should return

            score = noteScore.ScoreEachNote(user_freq, player_dur);
            time_score = score - 50;//accomodating by removing the perfect freq score to get timing score
            expect(time_score).toBeGreaterThanOrEqual(25);
            expect(time_score).toBeLessThan(50);          
        });
//This is an acceptance test for timing score
        it('Should return 0 if the note duratuin is outside the calculated tolerance', () => {
            const song_data = [13.5, 67, 392, 1.1015625, 127, 2];
            const elapsed_time = 13.5;
            const noteScore = new scored_note(song_data, elapsed_time);
            const user_freq = 392;
            const player_dur = 1.6;

            score = noteScore.ScoreEachNote(user_freq, player_dur);
            expect(score).toEqual(0);           
        });
    });
});

//tests all features from getting the score from the json file, to calculating and giving a correct score
const fetch = require('jest-fetch-mock');
const my_request = new Request('http://127.0.0.1:5500/src/midi/jsonMidi/SilentNight.json');

function GetNoteScore() {
    var elapsed_time = 13.5;
    return fetch(my_request)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const note_data = data[0];
        const check_note = new scored_note(note_data, elapsed_time);
        return check_note.ScoreEachNote(415.3, 1.32159);
      })
      .catch((error) => {
        console.error("Error fetching note data:", error);
        return 0;
      });
  }
  
  describe('GetNoteScore', () => {
    beforeAll(() => {
      fetch.resetMocks();
    });
//test a real score depending on what the given values were 
    test('Returns the score for a note', async () => {
      const response = [[13.5, 67, 392, 1.1015625, 127, 2]];// fake data using the mock-fetch library for Jest
      fetch.mockResponseOnce(JSON.stringify(response));
      const score = await GetNoteScore();
      expect(score).toBe(66);
    });
//test if a 0 was returned do to network error 
    test('Returns 0 when there is an error fetching note data', async () => {
      fetch.mockRejectOnce(new Error('Network error'));
      const score = await GetNoteScore();
      expect(score).toBe(0);
    });
  });