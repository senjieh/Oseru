//TODO: these can be just one dict
TimeingDict = {
	1:'red',			// whole note
	0.5:'green',		// half note
	0.25:'blue',		// quarter note
	0.125:'yellow',		// eight note
	0.0625:'orange',	// sixteenth note
	0.03125:'indigo',	// thirty-second note
	0.333333:'purple',		// triplet 
}

ColorDict = {
	'red':[1,0,0],
	'green':[0,1,0],
	'blue':[0,0,1],
	'yellow':[],
	'orange':[],
	'indigo':[],
	'purple':[],
}
// colored materials to look up to wrap notes in
// TODO: material dict
//MaterialDic = {

//}

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
	 * TODO: load note mesh shape and texture dynamically instead of being hard coded
	 * 
	 * @param {WebGLContext} gl
	 * @param {WebGLProgram} program
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
	constructor(gl, program, note_data, tempo, perfect, excelent, great, fine, background=null) {
		this.gl = gl;
		this.program = program
		this.note_data = note_data;
		this.tempo = tempo;
		this.perfect = perfect;
		this.excelent = excelent;
		this.great = great;
		this.fine = fine;

		//let this.root = new Scene();

        // initalize camera
        let cam = this.root.create_node(
            0,0,0, 0,0,0, 1,1,1, null);
        this.root.set_camera_node(cam);

        // notes child of camera so they stay static on screen if camera moves
		let note_root = cam.create_node(
			0,0,2, 0,0,0, 0,0,0, null);
		Object.entries(this.note_data)
			.filter()//TODO // is note event
			.map(note => this.#make_note(note)) // create note
			.map(note => note_root.create_child(0,0,0, 0,0,0, 0,0,0, note))
			//TODO add notes to nodes       
			// notes should be added in order of play so once the first note that is too early to be displayed
			// is found, the checking can stop

		// sort notes by order of appearance
		note_root.children.sort(function(a, b) {
			// TODO
		});

		// TODO figure out actual position of target
		let target_root = cam.create_node(0,0,2, 0,0,0, 0,0,0, null);
		const range = note_data.high - note_data.low;
		for (let i = 0; i < range; i++) {
			let target = this.#make_target(range+i);
			// targets are width 3 and one unit apart
			target_root.create_node(i*4,0,0, 0,0,0, 0,0,0, target);
		}

		if (background) {
			// add background to scene
			//TODO
		} else {
			// add default background
		}
	}

	/**
	 * makes a target mesh
	 * TODO: make target method
	 * 
	 * @param {int} note
	 * 
	 * @return {NormalMesh} target mesh
	 */
	#make_target(note) {
		// lookup note in disct to get mesh
		
		// make note shaped mesh to return
		const target_mesh = new NormalMesh();

		return target_mesh;
	}

	/**
	 * makes a note from data
	 */
	#make_note(note_data) {

		// rectangle mesh for note
		// make a 3x1 rectangle

		// TODO this can be a single lookup, fix once I know what note_data.timing looks like
		const color_string = TimeingDict[note_data.timing];
		const color = ColorDict[color_string];

		const hwidth = 1.5;
		const hheight = 0.5;
		const verts = [
			hwidth, -hheight, 0,  color[0], color[1], color[2], 1.0,     1.0, 1.0,   0.0, 0.0, -1.0,
            -hwidth, -hheight, 0, color[0], color[1], color[2], 1.0,     0.0, 1.0,   0.0, 0.0, -1.0,
            -hwidth, hheight, 0,  color[0], color[1], color[2], 1.0,     0.0, 0.0,   0.0, 0.0, -1.0,
            hwidth, hheight, 0,   color[0], color[1], color[2], 1.0,     1.0, 0.0,   0.0, 0.0, -1.0
		];
		const indis = [
			0, 3, 2, 2, 1, 0
		];

		// TODO: handle materials
		const mesh = new NormalMesh(this.gl, this.program, verts, indis, default_mat, false);

		//mesh = NormalMesh.rectangle(this.gl, this.program, 1, 3, null);
		this.#set_note_color(mesh, TimeingDict[note_data.timing]);

		const note = new NodeNote();

		return note;
	}

	/**
	 * Set note to color specified  
	 * 
	 * @param {NormalMesh} mesh
	 * @param {string} note color
	 *
	 * @return {NormalMesh}
	 */
	#set_note_color(mesh, note_timing) {



		return mesh;
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