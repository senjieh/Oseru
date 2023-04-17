//const NoteScore = require('./note-score.js');
class FinalScore {
  constructor(){
    this.score_array = [];
    this.json_name = filename; //give it the name of the json file being used for current song
    this.current_note_num = 0;
    this.song_data = [];
    FinalScore.GetSongInfo().then((data) =>{
      this.song_data = data;
    }).catch((error) => {
      console.error(error);
    });
  }

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
//test function for checking scores
  static GetNoteScore(note_data) {
    var freq_array = [392, 391, 398, 400, 55, 65, 1500]; //fake freq info to test
    const elapsed_time = note_data[0];
    const check_note = new NoteScore(note_data, elapsed_time, freq_array);
    const score = check_note.ScoreEachNote();
    return score;
  }

//Function to call to score a note and add it to the array of scores
  static AddNoteScoreToArray(elapsed_time, freq_array){
    const note_data = this.song_data[current_note_num];
    current_note_num++;
    const check_note = new NoteScore(note_data, elapsed_time, freq_array);
    const score = check_note.ScoreEachNote();
    this.score_array.push(score);
  }
//Function for adding all scores pushed to the score array together
  static CalculateFinalScore() {
    
      const array_length = this.score_array.length;
      let total_score = 0;

      for (let i = 0; i < array_length; i++) {
        total_score += score_array[i];
      }
      total_score -= ExtraNote.GetCount() * 25;
      return total_score;
    
  }
}
  //module.exports = FinalScore;
