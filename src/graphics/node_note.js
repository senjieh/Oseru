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

//const Mat4 = require('./matrix.js');

// TODO: just do graphics for now, leave control logic for later
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
	constructor(note, freq, play_at, duration, mesh, pos_mat, start_height, target_height, is_mine=false) {
		this.note = note;
		this.freq = freq;
		this.play_at = play_at;
		this.duration = duration;
		this.mesh = mesh;
		this.is_mine = is_mine;

		this.target_height = target_height;
		this.start_height = start_height;

		this.delay; // TODO: this

		this.pos_mat = pos_mat;

		this.past_top = false;
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
	 * get height of note given time in song
	 * 
	 * @param {int} time in song
	 * 
	 * @return {int} height of note
	 */
	get_height(time) {
		if (this.play_at < time+1) {
            // cal position in node based on time instead of updating based on frame
            const distance = this.target_height - this.start_height;
            // TODO: get rid of hard coded delay
            // percentage distance traveled from spawn to target
            const prec = ((time - this.play_at + 300) / 3000)*-1;
            const loc = distance * prec;
            return loc;
		} else {
			// when time == play_at, position should be = to target
			// note is no longer on screen so don't need height
			return null;
		}
	}


	/**
	 * play note
	 * 
	 * @param {float} time in song
	 * @param {}
	 */
	play(time, timing_dict=timing_dict) {
		// do stuff to check if note was within play window

		// change note appearance

		// effect score change
		let dif = Math.abs(time - this.play_at);
		let score = timing_dict.filter(item => item < dif);
		return score[0];
	}
}

class NoteSpawner{
	/**
	 * note spawner
	 * TODO: make note targets as well
	 * @param {[dict]} note data
	 * @param {Node} pointer to node spawner lives in
	 * @param {NormalMesh} note shape
	 */
	constructor(data, note_mesh, start_height, node) {
		this.data = data;
		this.note_mesh = note_mesh;
		this.start_height = start_height;
		this.node = node;
	}

	/**
	 * Makes a node containing the target notes from spawner move to
	 * 
	 * @param {float} padding between top of screen and top of note
	 * @param {float} height of note (dimension of mesh)
	 * @param {float} fov angle, defaults to 0.125, FOV_ANGLE in main
	 * @param {float} aspect ratio, defaults to 4/3, ASPECT_RATIO on main
	 * 
	 * @return {float} y position of target
	 */
	get_target_height(padding, height, fov_angle=0.125, aspect_ratio=4/3) {
		// calc top edge of screen
		const distance = this.node.z; // TODO: may be a bug
		const edge_distance = Math.tan(Math.PI * fov_angle) * distance;
		// calc node position
		let top = edge_distance * (1/aspect_ratio) - height/2 - padding;
		// idk why I need this but I do
		top *= 2;

		this.target_height = top;

		// create mesh and move it to top of screen
		// easier to warp then to try and calc distance from spawner to correct target position
		return top;
	}

	// given time, spawns note if needed
	// called as part of render batch
	// return nodeNote
	check_spawn_note(time) {
		console.log("time",time)
		if (time >= this.data[this.data.length -1]) {
			const next = this.data.pop();

			// TODO: replace filler values
			// time+3 means play 3 sec from now
			//console.log('make note')
			return new NodeNote(
				'data', 'freq', time+10, 0,
				this.note_mesh, this.node.get_matrix(),
				false, this.start_height, this.target_height);
		}
		// no note to spawn
		return null;
	}

	/**
	 * makes a target for notes to travel towards
	 * 
	 * @return {Node} target mesh node
	 */
	make_target(tex=this.mesh.material) {
		return this.node.create_child_node(0, this.target_height, 0, 0,0,0, 1,1,1, this.mesh);	
	}

	/**
	 * makes a node with spawner for data
	 * @param {[Note]} sorted list of notes spawner will make
	 * @param {float} normal node data etc.
	 * 
	 * @return {Node} spawner node
	 */
	static spawner_node(parent_node, data, x, y, z=0, roll=0, pitch=0, yaw=0, scale_x=0, scale_y=scale_x, scale_z=scale_x) {
		this.node = parent_node.create_child_node(x, y, z,
			roll, pitch, yaw,
			scale_x, scale_y, scale_z,
			new NoteSpawner(data, null, y)
		);
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
	constructor(note_data, tempo, note_tex, skybox_mesh, background=null) {
		// song data in form:
		// [['time_played', 'note', 'note_duration (s)','velocity','channel']]

		//this.gl = gl;
		//this.program = program;
		this.tempo = tempo;
		this.note_tex = note_tex;
		//this.targets = [];

		this.midi_loaded = false;
		this.meshs_loaded = false;
		this.background_loaded = false;

		// call this then do as much as possible before entering pausing until loaded
		this.song_data = this.#convert_json_file(note_data);

		this.root = new Scene();

        // initalize camera
        this.cam = this.root.create_node(
            0,0,0, 0,0,0, 1,1,1, null);
        this.root.set_camera_node(this.cam);

        // notes child of camera so they stay static on screen if camera moves
		let note_root = this.cam.create_child_node(
			0,0,2, 0,0,0, 0,0,0, null);

		// hacky skybox, could probably be done better then just an inside-out box anchored on camera
		this.skybox = this.cam.create_child_node(
			0,0,0, 0,0,0, 1,1,1);
		this.skybox.data = skybox_mesh;
		

		// cal number of notes in song, as well as find highest and lowest note
		const notes = this.song_data.midi_note;
		let low_note = notes[0];
		let high_note = notes[0];
		for (let i=0; i<notes.length; i++) {
			if (notes[i] > high_note) {
				high_note = notes[i];
			} else if (notes[i] < low_note) {
				low_note = notes[i];
			}
		}
		console.log(this.song_data);
		const note_range = high_note - low_note;
		console.log("low note: ",low_note);
		console.log("high note: ",high_note);
		console.log("note range:",note_range);

		//TODO: fix this, should describe end of song
		//const last_note = this.song_data[this.song_data.length -1];
		//const song_end = last_note[0] + last_note[2];

		// convert from sec to ms
		this.song_data.time_played = this.song_data.time_played.map(x => x * 1);
		this.song_data.note_held = this.song_data.note_held.map(x => x * 1);

		console.log(this.song_data);

		// calc frustum edge
		// NOTE: math only works if camera is facing along z axis, always do before moving camera
        const distance = 3;
        const edge_distance = Math.tan(Math.PI * FOV_ANGLE) * distance;
        // calc note width
        const num_notes = note_range;
        const padding_pre = 0.05;		// percentage of note width to add as space around note
        const div_width = (2*edge_distance)/num_notes;
        const padding = div_width * padding_pre;
        const width = div_width - padding;
        // calc height
        const height = width/3;
        const bottom = -edge_distance * (1/ASPECT_RATIO) + height/2 + padding;

        let spawners = [];

        const note_mesh = NormalMesh.platform(gl, current_program, 
                    width, height, 0, 1,
                    note_tex);

        for (let i=0; i<num_notes; i++) {
            const left = -edge_distance + (padding + width)/2 + i*(width+padding);

            // note spawners children of camera to lock them in correct position
            let note_spawner_node = this.cam.create_child_node(left,bottom,distance, 0,0,0, 1,1,1,);
            // debug to create static notes
            let note_spawner = new NoteSpawner(null, note_mesh, bottom, note_spawner_node);
            note_spawner_node.data = note_spawner;
            spawners.push(note_spawner_node);

            // create targets
            let target = note_spawner_node.create_child_node(0, note_spawner.get_target_height(padding, height),0, 
            	0,0.25,0, 1,1,1, note_mesh);
        }

        // add note data
        let song_arr = [];
        for (let i = 0; i<num_notes; i++) {
        	let note_arr = [];
        	for (let j=0; j<this.song_data.midi_note.length; j++) {
        		if (this.song_data.midi_note[j] == i + low_note - 1) {
        			// truncate data to ms via ~~
        			note_arr.push(this.song_data.time_played[j]);
        		}
        	}
        	// make sure notes are played in assenting order, may not be necessary
        	note_arr.sort();
        	note_arr.reverse();
        	song_arr.push(note_arr);
        }
        console.log("song arr: ",song_arr);
        console.log(spawners)

        if (song_arr.length != spawners.length) {
        	console.log("note/spawner mismatch. Notes: ",song_arr.length," Spawners: ",spawners.length);
        }

        for (let i = 0; i<spawners.length; i++) {
        	spawners[i].data.data = song_arr[i];
        }


		if (background) {
			// add background to scene
			//TODO
		} else {
			// add default background
		}
	}

	static load_make_score(note_data_json, tempo, note_mesh, skybox_mesh, background=null) {

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
	 * given a path to a json file, load it and return data
	 * @param {String} file path
	 * 
	 * @return {Dict} dictionary of note data
	 */
	#convert_json_file(json_text) {
		// invert so instead list of dicts, becomes dict of lists
		// expect to be list of json objects ex:
		// [{"a":1, "b":2},
		//  {"a":2, "b":3}]
		let note_data_dict = {
            "time_played":[],
            "midi_note":[],
            "frequency":[],
            "note_held":[],
            "velocity":[],
            "channel":[]
        };

        // get largest element of list with .reduce
		const midi_json = json_text.map((ent) => {
            Object.entries(ent).forEach(([key, value]) => {
                note_data_dict[key].push(value)
            });
        });
        return note_data_dict;
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

/*module.exports = {
	Score,
	NodeNote, 
	NoteSpawner
};*/