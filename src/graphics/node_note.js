class NodeNote {
	/**
	 * node note class
	 * built for the Node class
	 * holds data for a note in a score
	 * 
	 * mesh stored in note because texture/color changes based on type of note
	 * 
	 * @param {String} note
	 * @param {float} note freq
	 * @param {float} time since start of song to play note
	 * @param {float} duration of note
	 * @param {Mesh} mesh of note
	 * @param {bool} is mine
	 */
	constructor(note, freq, play_at, duration, mesh, is_mine=false) {
		this.note = note;
		this.freq = freq;
		this.play_at = play_at;
		this.duration = duration;
		this.mesh = mesh;
		this.is_mine = is_mine;
	}

	/**
	 * check if note within timeframe to draw
	 * if too early, return -1
	 * if too late, return -2,
	 * else return time until time to play
	 * 
	 * @param {float} current time in song
	 * @param {float} delay: play_at - delay = time to appear on screen
	 * 
	 * @return {float}
	 */
	display(time, delay) {
		if ((this.play_at - time) > delay) {
			// too early
			return -1;
		} else if ((this.play_at - time) > -0.5) {
			// on time
			// note lingers half second to allow for missed inputs/scroll off screen

		} else {
			// old note, remove node from scene tree
			return -2;
		}
	}

	/**
	 * play note
	 * 
	 * @param {float} time in song
	 * @param {}
	 */
	play(time, perfect, great, good, fine, miss) {

	}
}

class Score {
	/**
	 * score class
	 * holds a song
	 * 
	 * @param {dict} note data for song
	 * @param {int} tempo for song (bpm)
	 * @param {float} window for perfect score (note)
	 * @param {float} window for excellent score
	 * @param {float} window for great score
	 * @param {float} window for fine score
	 * @param {Scene} background scene to play behind notes
	 * 
	 * @return {Scene}
	 */
	constructor(note_data, tempo, perfect, excelent, great, fine, background=null) {
		this.note_data = note_data;
		this.tempo = tempo;
		this.perfect = perfect;
		this.excelent = excelent;
		this.great = great;
		this.fine = fine;

		let this.root = new Scene();

        // initalize camera
        let cam = this.root.create_node(
            0,0,0, 0,0,0, 1,1,1);
        this.root.set_camera_node(cam);

		let note_root = this.root.create_node(
			0,0,0, 0,0,0, 0,0,0);
		Object.entries(this.note_data)
			.filter()//TODO // is note event
			.map(note => this.#make_note(note)) // create note
			//TODO add notes to nodes       
			// notes should be added in order of play so once the first note that is too early to be displayed
			// is found, the checking can stop

		if (background) {
			// add background to scene
			//TODO
		} else {
			// add default background
		}
	}

	/**
	 * makes a note from data
	 */
	#make_note(note_data) {

		const note = new NodeNote() 

		return note
	}

	/**
	 * updates state of score based on current time
	 * 
	 * @param {float} now, current time in song
	 * @param {float} then, last time in song
	 * 
	 * @return {float} now + time to update, should be value for next then
	 */
	advance_tick(now, then) {
		const start = performance.now();

		// code goes here

		// check input

		// play applicable notes

		// remove old notes

		const end = performance.now();
		return now + (start - end);

	}
}