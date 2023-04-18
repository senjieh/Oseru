//class to for player adding extra notes, call increment to increase everytime an extra note is played
class ExtraNote{
    constructor(){
        this.extra_notes = 0;
    }

    Increment(){
        this.extra_notes++;
    }

    GetCount(){
        return this.extra_notes;
    }
}

class NoteScore{
    constructor(song_data, elapsed_time, freq_list, player_duration){
        this.song_data = song_data; 
        this.expected_input_freq = song_data[2]; // get the expected note frequency from json array
        this.note_duration = song_data[3];  // get the expected note duration from json array
        this.expected_time = song_data[0]; // get the expected timing for when a note is played
        this.elapsed_time = elapsed_time; //get the timing the function was initially called (when a player played a note)
        this.list_of_played_freqs = freq_list;
        this.freq_scores = [];
        this.player_duration = player_duration;
    }

    //Scoring will be divided into three parts: note accuracy and timing
    //Function that will calculate the score based on frequency
    CalculateFreqScore(){
        var freq_score = 0;
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
        ];
        //Part 1: Note Accuracy
        

        //get frequency the user plays
        //!!!!!!!!NEEDS TO BE PROVIDED!!!!!!!!!!!!!!
         //get_played_val_from_note_class();
        //freq_to_check = freq_to_check + ((Math.floor(Math.random()) * 2 - 1) * 5); //somewhat random generation of player_notes
        //needed variables 
        var two_per_val = 0;
        var freq2 = 0;
        var perc = 0;
        for(let i = 0; i < this.list_of_played_freqs.length; i++){
            const freq_to_check = this.list_of_played_freqs[i];
            // SUPER LOW or SUPER HIGH edgecases
            if(freq_to_check < 27.5 || freq_to_check > 4186.01){
                freq_score = 0;
            }
            else{
                //find the index of the expected note
                var expected_note = note_dict.indexOf(this.expected_input_freq);
                //Check if note is exact
                if(freq_to_check === this.expected_input_freq){
                    freq_score = 50;
                }
                else{
                //Find nearest two notes based on the frequency the user played (for example is it between C4 and C#4)
                //Then use formula for scoring:
                //(|Freq(1) - Freq(2)|) / 50 = 2_per_val  [This is the value that will determine each point given]
                //(|Freq(1) - Freq(user)|) /  2_per_val = perc_diff
                //100 - perc_diff = note_score [between 25 to 50]
                    if(freq_to_check < this.expected_input_freq){
                        freq2 = note_dict[expected_note + 1];
                        if(freq_to_check < freq2){
                            freq_score = 0;
                        }
                        else{
                        two_per_val = (Math.abs(this.expected_input_freq - freq2) / 50);
                        perc = (Math.abs(this.expected_input_freq - freq_to_check) / two_per_val);
                        freq_score = ((100 - perc)/100) * 50;
                        }
                    }
                    else{
                        freq2 = note_dict[expected_note - 1];
                        if(freq_to_check > freq2){
                            freq_score = 0;
                        }
                        else{
                        two_per_val = (Math.abs(this.expected_input_freq - freq2) / 50);
                        perc = (Math.abs(this.expected_input_freq - freq_to_check) / two_per_val);
                        freq_score = ((100 - perc)/100) * 50;
                        }
                    }
                    
                }
            }
            this.freq_scores.push(freq_score);
        }   
    }
    //Function to determine the score based on timing
    CalculateTimingScore(){
        var tolerance = 0;
        var left_tol = 0;
        var right_tol = 0;
        var perc_diff = 0;
        var timing_score = 0;
         //Part 2: Timing
        //get the amount of time the note was played by player
        //NEEDS TO BE PROVIDED!!!!!!!!!!!
        var played_duration = this.player_duration; //duration player held the note for
        //calculate the tolerance for time playing a note
        tolerance = .2 * this.note_duration;
        left_tol = this.note_duration - tolerance;
        right_tol = this.note_duration + tolerance;
        //calculate tolerance on exact time played
        if(this.elapsed_time > this.expected_time + .1 || this.elapsed_time < this.expected_time - .1){
            timing_score = 0;
            return(final_note_score = 0);
        }
        else{
            if(played_duration === this.note_duration){
                timing_score = 50;
            }
            else{
                if(played_duration >= left_tol && played_duration <= right_tol){
                    perc_diff = (Math.abs(this.note_duration - played_duration) / ((this.note_duration + played_duration) / 2)) * 50;
                    timing_score = 50 - perc_diff;
                }
                else{
                    timing_score = 0;
                }
            }       
        }
    return (timing_score);
    }
    //Each note will be scored individually here
    ScoreEachNote(){
        var final_note_score = 0;
        var time_score = this.CalculateTimingScore();
        //useful for checking if frequency is changing
        /*var tick_interval = 10;
        freq_interval_check = setInterval(CalculateFreqScore(), tick_interval)

        setTimeout(() => {
            clearInterval(freq_interval_check);
            this.freq_avg = this.freq_scores.reduce((a,b) => a + b, 0) / this.freq_scores.length;
    }, this.note_duration);*/
        this.CalculateFreqScore();
        var sum = this.freq_scores.reduce((a,b) => a + b, 0);
        var freq_avg_score = sum / this.freq_scores.length;
        if(freq_avg_score < 0 || time_score === 0){
            final_note_score = 0;
        }
        else{
            final_note_score = freq_avg_score + time_score;
        }
        final_note_score = Math.round(final_note_score);
        
        return (final_note_score);   
    }
}
//module.exports = NoteScore;