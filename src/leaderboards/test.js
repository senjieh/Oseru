const NoteScore = require('./note-score.js');
const my_request = new Request('http://127.0.0.1:5500/src/midi/jsonMidi/SilentNight.json')
fetch(my_request)
    .then((response) => response.json())
    .then((data) => {
        const note_data = data[0];
        const check_note = new NoteScore(note_data);
        score = check_note.ScoreEachNote();
        console.log(score);
    })
    .catch(error => console.error(error));
