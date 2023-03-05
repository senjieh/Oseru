//Scoring will be divided into three parts: note accuracy and timing and streak multiplier

//Create score variables
var note_score = 0;
var timing_score = 0;
var final_score = 0;
var streak_mul = 1;
//Part 1: Note Accuracy
//create note-to-frequency dictionary
const note_dict = [
    4186.01,
    3951.07,
    3729.31,
    3729.01,
    3520,
    3322.44,
    3135.96,
    2959.96,
    2793.83,
    2637.02,
    2489.02,
    2349.32,
    2217.46,
    2093,
    1975.53,
    1864.66,
    1760,
    1661.22,
    1567.98,
    1479.98,
    1396.91,
    1318.51,
    1244.51,
    1174.66,
    1108.73,
    1046.5,
    987.77,
    932.33,
    880,
    830.61,
    783.99,
    739.99,
    698.46,
    659.25,
    622.25,
    587.33,
    554.37,
    523.25,
    493.88,
    466.16,
    440,
    415.3,
    392,
    369.99,
    349.23,
    329.63,
    311.13,
    293.66,
    277.18,
    261.63,
    246.94,
    233.08,
    220,
    207.65,
    196,
    185,
    174.61,
    164.81,
    155.56,
    146.83,
    138.59,
    130.81,
    123.47,
    116.54,
    110,
    103.83,
    98,
    92.5,
    87.31,
    82.41,
    77.78,
    73.42,
    69.3,
    65.41,
    61.74,
    58.27,
    55,
    51.91,
    49,
    46.25,
    43.65,
    41.2,
    38.89,
    36.71,
    34.65,
    32.7,
    30.87,
    29.14,
    27.5
]

//get frequency the user plays
//!!!!!!!!NEEDS TO BE PROVIDED!!!!!!!!!!!!!!
user_input_freq = 27.6 //get_played_val_from_note_class();

// SUPER LOW or SUPER HIGH edgecases
if(user_input_freq < 27.5 || user_input_freq > 4186.01){
    note_score = 0;
}
else{
    //get the expected frequency from song
    //!!!!!!!!!!NEEDS TO BE PROVIDED!!!!!!!!!!!!
    expected_input_freq = 27.5 //get_expected_val_from_song();
    //find the index of the expected note
    expected_note = note_dict.indexOf(expected_input_freq);
    //Check if note is exact
    if(user_input_freq === expected_input_freq){
        note_score = 50;
    }
    else{
    //Find nearest two notes based on the frequency the user played (for example is it between C4 and C#4)
    //Then use formula for scoring:
    //(|Freq(1) - Freq(2)|) / 50 = 2_per_val  [This is the value that will determine each point given]
    //(|Freq(1) - Freq(user)|) /  2_per_val = perc_diff
    //100 - perc_diff = note_score [between 25 to 50]
        if(user_input_freq < expected_input_freq){
            freq2 = note_dict[expected_note + 1];
            if(user_input_freq < freq2){
                note_score = 0;
            }
            else{
            two_per_val = (Math.abs(expected_input_freq - freq2) / 50)
            perc = (Math.abs(expected_input_freq - user_input_freq) / two_per_val)
            note_score = ((100 - perc)/100) * 50;
            }
        }
        else{
            freq2 = note_dict[expected_note - 1];
            if(user_input_freq > freq2){
                note_score = 0;
            }
            else{
            two_per_val = (Math.abs(expected_input_freq - freq2) / 50)
            perc = (Math.abs(expected_input_freq - user_input_freq) / two_per_val)
            note_score = ((100 - perc)/100) * 50;
            }
        }
        
    }
}
console.log(note_score);
//Part 2: Timing 

//Part 3: Streak multiplier