const {NodeNote, NoteSpawner, Score} = require("./node_note.js");
const {Node, Scene, RenderMesh, RenderLight} = require("./scene.js");

// IMPORTANT: See attached node_note.js and scene.js for code being tested

//let canvas = document.getElementById('the-canvas');
//let gl = canvas.getContext('webgl2');
// filler vars not needed in test
const gl = null;
const program = null;
const tex = null;

let root = new Scene();

beforeEach(() => {
	root = new Scene();
	let cam = root.create_node(0,0,0, 0,0,0, 1,1,1);
	root.set_camera_node(cam);
	//cam.create_child_node(0,0,0, 0,0,0, 1,1,1, null);
});

/*let test_score = new Score(gl, program, note_data, 100);

test("Calc target position relative to camera", () => {
	let spawner_node = cam.create_child_node(0,0,0, 0,0,0, 1,1,1, null);
	let test_spawner = new NoteSpawner(null, null, null, test_node);
	test_node.data = test_spawner;
	expect(test_spawner.get_target_height(0, 1)).toBe();
});*/
const FOV_GAMLE = 0.125;
const ASPECT_RATIO = 4/3;

function make_list_of_spawners(num_spawners) {

	// calc frustum edge
    let distance = 3;	// this is arbitrary, can be any number grater then min cam distance
    let edge_distance = Math.tan(Math.PI * FOV_ANGLE) * distance;
    // calc note width
    let num_notes = num_spawners;
    let padding_pre = 0.05;
    let div_width = (2*edge_distance)/num_notes;
    let padding = div_width * padding_pre;
    let width = div_width - padding;
    // calc height
    let height = width/3;
    let bottom = -edge_distance * (1/ASPECT_RATIO) + height/2 + padding;

    let spawners = [];

    for (let i=0; i<spawners.length; i++) {
    	// no mesh for spawners because test
        let tmp_node = spawners[i].create_child_node(0,0,0, 0,0.25,0, 1,1,1, 'test val');
        let top = spawners[i].data.get_target_height(padding, height);
        tmp_node.warp(tmp_node.x, top, tmp_node.z);
    }

    return spawners;
}

function make_dummy_notes(num_notes_to_play, num_notes) {
	// make test note data
    // 2d array, each inner array containing the time of each note in ascending order
    // first list is one note every 2nd tic, second is every 3rd tic, etc
    let note_data = [];
    for (let i=0; i<num_notes; i++) {
        let lst = [];
        for (let j=1; j<num_notes_to_play; j++) {
            if ((j)%(i+2) == 0) {
                lst.push((j)*1000);
            }
        }
        note_data.push(lst);
    }
    return note_data;
}

function make_dummy_song_data(duration, lower_range, upper_range) {

}

function spawn_notes_at_time(time, spawners) {
	for (let i=0; i<spawners.length; i++) {
    	let note = spawners[i].data.check_spawn_note(time);
	    if (note) {
	        let child = spawners[i].create_child_node(
	            0, 0, -0.01,       // spawn note slightly above of target
	            spawners[i].roll, spawners[i].pitch+0.25, spawners[i].yaw,
	            spawners[i].scale_x, spawners[i].scale_y, spawners[i].scale_z, 
	            note);
    	}
    }
}



//----------------------------------------------------------------------------------------------------
//           TESTS
//----------------------------------------------------------------------------------------------------

/**
 * Note, the majority of these are integration tests as they are testing some combination
 * of the NodeNote, NoteSpawner, Score, and Node class
 */

// Acceptance Test
test("Spawner generates properly, 1 spawner", () => {
	const num_notes = 1;
	let spawners = make_list_of_spawners(num_notes);

	// make spawnser nodes children of cam
	for (let i=0; i<spawners.length; i++) {
		cam.children.push(spawners[i]);
	}

	// TODO: redundant in current form
	// calc dimensions of note
	const distance = 3;
	const edge_distance = Math.tan(Math.PI*FOV_ANGLE) * distance;	// distance from center to side of plane
	const padding_pre = 0.05;
	// calc note mesh size
	const div_width = (2*edge_distance)/num_notes;
	const width = div_width - padding;
	const height = width/3;
	// calc position of mesh
    const padding = div_width * padding_pre;
    const top = edge_distance * (1/ASPECT_RATIO);
    const bottom = -top;

	// check position of spawner
	// with one note should be centered on screen
	expect(spawners[0].x).toBe(0);
	expect(spawners[0].y).toBe(bottom + padding + height/2);
	// default distance is 3
	expect(spawners[0].z).toBe(3);

	// check scale of spawners with 1 node
	expect(spawners[0].s_x).toBe(spawners[0].s_y * 3);	// proper ration of one-beat note
	// TODO: should scale in node, not in mesh size
	expect(spawners[0].s_x).toBe(width);
	expect(spawners[0].s_y).toBe(height);
	expect(spawners[0].s_z).toBe(distance);

	// check rotation of spawner
	expect(spawners[0].roll).toBe(0);
	// TODO: generate notes without minimizing rotation
	// current config makes a xy platform then rotates it failing this test
	expect(spawners[0].pitch).toBe(0);	
	expect(spawners[0].yaw).toBe(0)

	// check position of target
	// height should be edge distance - padding
	expect(spawners[0].get_target_height()).toBe(top - padding - height/2)
});

// Acceptance Test
test("Spawner generates properly, 5 spawners", () => {
	const num_notes = 5;
	let spawners = make_list_of_spawners(num_notes);

	// make spawnser nodes children of cam
	for (let i=0; i<spawners.length; i++) {
		cam.children.push(spawners[i]);
	}

	// TODO: redundant in current form
	// calc dimensions of note
	const distance = 3;
	const edge_distance = Math.tan(Math.PI*FOV_ANGLE) * distance;	// distance from center to side of plane
	const padding_pre = 0.05;
	// calc note mesh size
	const div_width = (2*edge_distance)/num_notes;
	const width = div_width - padding;
	const height = width/3;
	// calc position of mesh
    const padding = div_width * padding_pre;
    const top = edge_distance * (1/ASPECT_RATIO);
    const bottom = -top;

    for (let i=0; i< num_notes; i++) {
    	// check position of spawner
		// with one note should be centered on screen
		expect(spawners[i].x).toBe((padding + width)/2 + i * (width + padding) - edge_distance);
		expect(spawners[i].y).toBe(bottom + padding + height/2);
		// default distance is 3
		expect(spawners[i].z).toBe(distance);

		// check scale of spawners with 1 node
		expect(spawners[i].s_x).toBe(spawners[0].s_y * 3);	// proper ration of one-beat note
		// TODO: should scale in node, not in mesh size
		expect(spawners[i].s_x).toBe(width);
		expect(spawners[i].s_y).toBe(height);
		expect(spawners[i].s_z).toBe(1);

		// check rotation of spawner
		expect(spawners[i].roll).toBe(0);
		// TODO: generate notes without minimizing rotation
		// current config makes a xy platform then rotates it failing this test
		expect(spawners[i].pitch).toBe(0);	
		expect(spawners[i].yaw).toBe(0)

		// check position of target
		// height should be edge distance - padding
		expect(spawners[i].get_target_height()).toBe(top - padding - height/2)
	}
});


// Acceptance Test
test("Spanwer note generation, single note creation timing", () => {
	// make dummy data
	const num_notes = 1;
	let spawners = make_list_of_spawners(num_notes);
	// make test note data
    // 2d array, each inner array containing the time of each note in ascending order
    note_data = make_dummy_notes(100, 3);
    // add note data to each spawner
    // TODO: should be done as part of spawner generation, not externally, fix later
    for (let i=0; i< spawners.length; i++) {
        //note_data[i].reverse();
        spawners[i].data.data = note_data[i].reverse();
    }

	// test negative timing (should be impossible but vov)
	spawn_notes_at_time(-1, spawners);
    // expect no children
	for (let spawner of spawners) {
		expect(spawner.children.length).toBe(0)
	}    

	// test note timing when no note should be played
	spawn_notes_at_time(0, spawners);
	for (let spawner of spawners) {
		expect(spawner.children.length).toBe(0)
	} 

	// test spawn note at proper time
	spawn_notes_at_time(1000, spawners); 
	for (let spawner of spawners) {
		expect(spawner.children.length).toBe(1)
	} 

	// test if same tick called twice
	// shouldn't make second copy of note
	spawn_notes_at_time(1000, spawners);
	for (let spawner of spawners) {
		expect(spawner.children.length).toBe(1);
	}


	// reset note data
	for (let i=0; i<spawners.length; i++) {
		spawners[i].children = [];
		spawners[i].data.data = note_data[i].reverse();
	}

	// spawn all notes
	for (let i=0; i<100; i++) {
		spawn_notes_at_time(i*1000);
	}
	for (let spawner of spawners) {
		expect(spawner.children.length).toBe(49);
	}
	
	// test multiple notes with same timing
	// reset note data
	for (let i=0; i<spawners.length; i++) {
		spawners[i].children = [];
		note_data[i] = [2, 2, 2, 3];
		spawners[i].data.data = note_data[i].reverse();
	}
	// start empty
	for (let spawner of spawners) {
		expect(spawner.children.length).toBe(0)
	}
	// first call should only make one note
	spawn_notes_at_time(2, spawners);
	for (let spawner of spawners) {
		expect(spawner.children.length).toBe(1)
	}
	// nest call should make second note
	spawn_notes_at_time(2, spawners);
	for (let spawner of spawners) {
		expect(spawner.children.length).toBe(2)
	}
	// calling a later time should make only earliest note
	spawn_notes_at_time(3, spawners);
	for (let spawner of spawners) {
		expect(spawner.children.length).toBe(3)
	}
	for (let spawner of spawners) {
		expect(spawner.data.data).toBe([4]);
	}

	// check long notes
});

// Acceptance Test
test("Spanwer note generation, multiple note creation timing", () => {
	// make dummy data
	const num_notes = 5;
	let spawners = make_list_of_spawners(num_notes);
	// make test note data
    // 2d array, each inner array containing the time of each note in ascending order
    note_data = make_dummy_notes(100, 3);
    // add note data to each spawner
    // TODO: should be done as part of spawner generation, not externally, fix later
    for (let i=0; i< spawners.length; i++) {
        //note_data[i].reverse();
        spawners[i].data.data = note_data[i].reverse();
    }

	// test negative timing (should be impossible but vov)
	spawn_notes_at_time(-1, spawners);
    // expect no children
	for (let spawner of spawners) {
		expect(spawner.children.length).toBe(0)
	}    

	// test note timing when no note should be played
	spawn_notes_at_time(0, spawners);
	for (let spawner of spawners) {
		expect(spawner.children.length).toBe(0)
	} 

	// test spawn note at proper time
	spawn_notes_at_time(3000, spawners); 
	for (let i=0; i<spawners.length; i++) {
		expect(spawners[i]).toBe(Math.floor((i+2)/2));
	} 

	// test if same tick called twice
	// shouldn't make second copy of note
	spawn_notes_at_time(3000, spawners);
	for (let i=0; i<spawners.length; i++) {
		expect(spawners[i]).toBe(Math.floor((i+2)/2));
	} 


	// reset note data
	for (let i=0; i<spawners.length; i++) {
		spawners[i].children = [];
		spawners[i].data.data = note_data[i].reverse();
	}

	// spawn all notes
	for (let i=0; i<100; i++) {
		spawn_notes_at_time(i*1000);
	}
	for (let i=0; i<spawners.length; i++) {
		expect(spawners[i]).toBe(Math.floor((i+2)/100));
	} 

	// check long notes
});

// acceptance test
test ("NodeNote object generated by spawner", () => {
	const num_notes = 1;
	let spawners = make_list_of_spawners(num_notes);
	// make test note data
    // 2d array, each inner array containing the time of each note in ascending order
    note_data = make_dummy_notes(100, 3);
    // add note data to each spawner
    // TODO: should be done as part of spawner generation, not externally, fix later
    for (let i=0; i< spawners.length; i++) {
        //note_data[i].reverse();
        spawners[i].data.data = note_data[i].reverse();
    }


	// create test note
    spawn_notes_at_time(2000, spawners);

	// contains correct data
	let child = spawners[0].children[0].data;
	expect(child instanceof NoteSpawner).toBe(true);
	expect(child.play_at).toBe(5000);
	expect(child.is_mine).toBe(false);

	const distance = 3;
	const edge_distance = Math.tan(Math.PI*FOV_ANGLE) * distance;	// distance from center to side of plane
	const padding_pre = 0.05;
	// calc note mesh size
	const div_width = (2*edge_distance)/num_notes;
	const width = div_width - padding;
	const height = width/3;
	// calc position of mesh
    const padding = div_width * padding_pre;
    const top = edge_distance * (1/ASPECT_RATIO);
    const bottom = -top;

    // TODO: note data needs more info on notes then just start time
	expect(child.start_height).toBe(bottop + padding + height/2);
	expect(child.target_height).toBe(top - padding - height/2);
	expect(child.past_top).toBe(false);


	// contains correct mesh if note
	expect(child.mesh).toBe('test val');


	// contains correct mesh if mine

	// colored properly based on timing
	child.duration = 1;
	child.get_height(1001);
	expect(child.color).toBe('red');
	child.duration = 0.5;
	child.get_height(1001);
	expect(child.color).toBe('blue');
	child.duration = 0.25;
	child.get_height(1001);
	expect(child.color).toBe('yellow');
	child.duration = 0.125;
	child.get_height(1001);
	expect(child.color).toBe('green');
	child.duration = 1/3;
	child.get_height(1001);
	expect(child.color).toBe('orange');
	child.duration = 1.01;
	child.get_height(1001);
	expect(child.color).toBe('purple');

	// test bad note

	// old notes removed from list
	child.get_height(5100);
	expect(child.past_top).toBe(true);
	child.play_at(6100);
	expect(spawners[0].children.length).toBe(0);

	// check long notes
	let node = new Node(0, bottop + padding + height/2, 3,
		0, 0, 0, 1, 1, 1,
		new NodeNote('A', 100, 5000, 2, null, 
			Mat4.identity(), 
			bottop + padding + height/2, 
			top - padding - height/2, false));
	node.data.get_target_height(1001);
	expect(node.s_y).toBe(2);

})

// acceptance test, inc.
test("Spawner mine generation", () => {
	// make dummy data

	// notes and mines different mesh
});

// integration test
test("Score generation", () => {
	sound_data = make_dummy_song_data(100, 0, 10);
	score = new Score(null, null, sond_data, 100);

	// spawners 0-10
	expect(score.spawners.length).toBe(11);
	let spawners = root.spawners;
	for (spawner of spawners) {
		epxect(spawner.data).not.toBeNull(spawner.data);
	}
});