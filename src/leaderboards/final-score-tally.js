//const NoteScore = require('./note-score.js');
class FinalScore {
  constructor(filename){
    this.score_array = [];
    this.json_name = filename; //give it the name of the json file being used for current song
    this.current_note_num = 0; //keeps track of which note is being used from the json file
    this.song_data = []; //array to store the json data
    FinalScore.GetSongInfo(filename).then((data) =>{ //copies the json data to a local array
      this.song_data = data;
    }).catch((error) => {
      console.error(error);
    });
  }

  static GetSongInfo(filename) {
    //const my_request = new Request('http://127.0.0.1:8080/midi/jsonMidi/SilentNight.json');
    const my_request = new Request(filename);
    //function to get the song data from the json file
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
//test function for checking scores, can ignore
  static GetNoteScore(note_data, elapsed_time) {
    var freq_array = [392, 391, 398, 400, 55, 65, 1500]; //fake freq info to test
    const check_note = new NoteScore(note_data, elapsed_time, freq_array);
    const score = check_note.ScoreEachNote();
    return score;
  }

//Function to call to score a note and add it to the array of scores
  AddNoteScoreToArray(elapsed_time, freq_array, player_duration){
    const note_data = this.song_data[current_note_num];
    current_note_num++;
    const check_note = new NoteScore(note_data, elapsed_time, freq_array, player_duration);
    const score = check_note.ScoreEachNote();
    this.score_array.push(score);
  }
//Function for adding all scores pushed to the score array together
  CalculateFinalScore(extra_note_count){
    let json_data = JSON.parse(this.json_name); //need the json file to get the expected_note_count
    let expected_note_count = json_data.length;
    const array_length = this.score_array.length;
    let incomplete_notes = expected_note_count - array_length;
    let total_score = 0;
    let incomplete_notes_score = incomplete_notes * 100
    for (let i = 0; i < array_length; i++) {
      total_score += this.score_array[i];
    }
    total_score -= extra_note_count * 50; //extra_note_count will be passed and retrieved from ExtraNote.GetCount();
    total_score -= incomplete_notes_score; //subtract the score for completely missing notes
    if(total_score < 0){
      total_score = 0;
    } 
    let new_final_score = new LocalBoard(this.json_name);
    new_final_score.RunBoard(total_score);
  }
}
  //module.exports = FinalScore;
