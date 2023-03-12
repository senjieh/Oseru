

    const NoteScore = require('./note-score.js');
    const my_request = new Request('http://127.0.0.1:5500/src/midi/jsonMidi/SilentNight.json');
    var i = 0;
    var program_start_time = new Date();
    total_score = 0;

    function GetNoteScore() {
        //var elapsed_time = new Date() - program_start_time;
        var elapsed_time = 13.5;
        return fetch(my_request)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            const note_data = data[i];
            const check_note = new NoteScore(note_data, elapsed_time);
            score = check_note.ScoreEachNote();
            console.log(score);
            i++;
            return score;
          })
          .catch((error) => {
            console.error("Error fetching note data:", error);
            return 0; // Return 0 to ensure the score is a valid number
          });
      }
      Promise.all([GetNoteScore(), GetNoteScore()])
      .then((scores) => {
        var valid_scores = scores.filter((score) => typeof score === "number");
        var total_score = valid_scores.reduce((total, score) => total + score, 0);
        console.log("total_score = " + total_score);
      })
      .catch((error) => {
        console.error("Error getting note scores:", error);
      });
    
    

