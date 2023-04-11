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
	 * @param {float} height of note
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
	constructor(note_data_json, tempo, note_mesh, skybox_mesh, gamestate, background=null) {
		// song data in form:
		// [['time_played', 'note', 'note_duration (s)','velocity','channel']]

		//this.gl = gl;
		//this.program = program;
		this.tempo = tempo;
		this.note_mesh = note_mesh;
		//this.targets = [];

		this.midi_loaded = false;
		this.meshs_loaded = false;
		this.background_loaded = false;

		// call this then do as much as possible before entering pausing until loaded
		this.song_data = this.read_json_file(note_data_json, gamestate);

		this.root = new Scene();

        // initalize camera
        let cam = this.root.create_node(
            0,0,0, 0,0,0, 1,1,1, null);
        this.root.set_camera_node(cam);

        // notes child of camera so they stay static on screen if camera moves
		let note_root = cam.create_node(
			0,0,2, 0,0,0, 0,0,0, null);

		this.skybox = this.cam.create_node(
			0,0,0, 0,0,0, 1,1,1);
		this.skybox.data = skybox_mesh;
		
		// rest depends on midi, so wait until loaded
		while(gamestate.json_midi_loaded == 0) {
			// sleep for 10ms
			console.log("waiting on note load");
			await new Promise(r => setTimeout(r, 10));
		}

		// cal number of notes in song, as well as find highest and lowest note
		const notes = song_data["midi_note"];
		let low_note = this.notes[0];
		let high_note = this.notes[0];
		for (let i=0; i<this.notes.length; i++) {
			if (this.notes[i] > high_note) {
				high_note = this.notes[i];
			} else if (this.notes[i] < low_note) {
				low_note = this.notes[i];
			}
		}
		note_range = high_note - low_note;
		console.log("low note: ",low_note);
		console.log("high note: ",high_note);
		console.log("note range:",note_range);

		//TODO: fix this, should describe end of song
		//const last_note = this.song_data[this.song_data.length -1];
		//const song_end = last_note[0] + last_note[2];

		// convert from sec to ms
		this.song_data["tine_played"].map(x => x * 1000);
		this.song_data["note_held"].map(x => x * 1000);

		console.log(song_data);

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

        spawners = [];

        for (let i=0; i<num_notes; i++) {
            const left = -edge_distance + (padding + width)/2 + i*(width+padding);

            // note spawners children of camera to lock them in correct position
            let note_spawner = cam.create_node(left,bottom,distance, 0,0,0, 1,1,1,);
            spawners.push[note_spawner];
            // debug to create static notes
            let note = note_spawner.create_child_node(0,0,0, 0,0.25,0, 1,1,1);
            note.data = new NodeNote(1,1,1,1,
                NormalMesh.platform(gl, current_program, 
                    width, height, 0, 1,
                    note_mesh),
                false);
        }

        // Spawn targets
        for (let i=0; i<this.spawners.length; i++) {
        	spawners[i].make_target(padding, height);
        }

        // add note data
        let song_arr = [];
        for (let i = low_note; i<high_note; i++) {
        	let note_arr = [];
        	for (let j=0; j<this.song_data["midi_note"].length; j++) {
        		if (song_data["midi_note"][j] == i) {
        			note_arr.push(sond_data["time_played"]);
        		}
        	}
        	// make sure notes are played in assenting order, may not be necessary
        	note_arr.sort();
        	note_arr.reverse();
        	song_arr.push(note_arr);
        }
        console.log(song_arr);

        if (song_arr.length != spawners.length) {
        	console.log("note/spawner mismatch. Notes: ",song_arr.length," Spawners: ",spawners.length;
        }

        for (let i = 0; i<spawners.length; i++) {
        	spanwers[i].data.data = note_data[i];
        }

		/*Object.entries(this.note_data)
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
		}*/

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
	 * given a path to a json file, load it and return data
	 * @param {String} file path
	 * 
	 * @return {Dict} dictionary of note data
	 */
	#read_json_file(file, gamestate) {
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

        // TODO: make sure data is sorted before adding it to list
        // get largest element of list with .reduce
        // TODO: drop elements where velocity is 0
		let midi_json = get_json_file(file, function(text) {
            json_text = JSON.parse(text);
            MIDI_JSON_LOADED = true;
            json_text.map(function(ent)  {
                Object.entries(ent).forEach(([key, value]) => {
                    note_data_dict[key].push(value)
                });
            });
            gamestate.json_midi_loaded = 1;
        });
        return midi_json;
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