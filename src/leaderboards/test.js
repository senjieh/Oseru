//const NoteScore = require('./note-score.js');
class FinalScore {
  
  static GetSongInfo() {
    const my_request = new Request('http://127.0.0.1:8080/midi/jsonMidi/SilentNight.json');
    return fetch(my_request)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        return data;
      });
  }

  static GetNoteScore(note_data) {
    const elapsed_time = note_data[0];
    const check_note = new NoteScore(note_data, elapsed_time);
    const score = check_note.ScoreEachNote();
    return score;
  }

  static CalculateFinalScore() {
    return FinalScore.GetSongInfo().then((song_data) => {
      const array_length = song_data.length;
      let total_score = 0;

      for (let i = 0; i < array_length; i++) {
        total_score += FinalScore.GetNoteScore(song_data[i]);
      }
      return total_score;
    });
  }
}
  //module.exports = FinalScore;cd ..
