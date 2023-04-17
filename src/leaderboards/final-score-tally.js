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
    var freq_array = [392, 391, 398, 400, 55, 65, 1500]; //fake freq info to test
    const elapsed_time = note_data[0];
    const check_note = new NoteScore(note_data, elapsed_time, freq_array);
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
      total_score -= ExtraNote.GetCount() * 25;
      return total_score;
    });
  }
}
  //module.exports = FinalScore;
