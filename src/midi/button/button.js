import './styles.css';

function toggleOn() {
    var button = document.getElementById("button");
    if (button.value =="ON") {
        srcFolder = "modmidi/";
    } else {
        srcFolder = "midifiles/";
    }
}