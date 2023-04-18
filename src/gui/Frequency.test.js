import Frequency from './Frequency.js'
const module = require("./node_note")
const scene = require("./scene")

// We didn't really know what the Frequency function was supposed to return
// prior to making it, so the tests are to check if its not null and null
// when needed
// Acceptance test
test('frequency [], 0 sample rate', () => {
    expect(Frequency([],0)).toStrictEqual([]);
});

// Acceptance test
test('frequency [1,2,3], 10 sample rate', () => {
    expect(Frequency([1,2,3],100)).not.toStrictEqual([]);
});

// White-box test 
// Should have full coverage with these two tests since we checked
// the nulls case above already
test('frequency [1,2,3], 100 sample rate', () => {
    expect(Frequency([1,2,3],100)).toStrictEqual([["A♭", 100, 3, 3, 1, 1], ["A#",66.66666666666667, 2, 2, 1,1]]);
});
test('frequency [1,2,3], 500 sample rate', () => {
    expect(Frequency([1,2,3],500)).toStrictEqual([["D", 500, 3, 3, 1, 1], ["A",66.66666666666667, 1, 1, 1,1]]);
});

// White-box tests
// This test in combination with the tests below achieves full coverage
test('display too late' , () => {
    const nodenote = new module.nodenote()
    nodenote.play_at = 0
    expect(nodenote.display(1,0)).toBe(-2)
});
test('display too early' , () => {
    const nodenote = new module.nodenote()
    nodenote.play_at = 1
    expect(nodenote.display(-2,0)).toBe(-1)
});
test('display on target' , () => {
    const nodenote = new module.nodenote()
    nodenote.play_at = 1
    expect(nodenote.display(1,0)).toBe()
});

// White-box tests
// Should cover the empty list and existing case
test('play 10' , () => {
    const nodenote = new module.nodenote()
    const timing_dict = [10,20,30,40]
    nodenote.play_at = 1
    expect(nodenote.play(0, timing_dict)).toBe(10)
});
test('play nothing' , () => {
    const nodenote = new module.nodenote()
    const timing_dict = [10,20,30,40]
    nodenote.play_at = 1
    expect(nodenote.play(0, timing_dict)).toBe()
});

// Integration test bottom-up approach
// Testing between Node class and Mat4 class
test('get_matrix all 0s' , () => {
    const node = new scene.node()
    node.x = 0
    node.y = 0
    node.z = 0

    node.pitch = 0
    node.yaw = 0
    node.roll = 0

    node.scale_x = 0
    node.scale_y = 0
    node.scale_z = 0
    expect(node.get_matrix()).toEqual({"data": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]})
});

// Integration test bottom-up approach
// Testing between Node class and Mat4 class
test('get_matrix with coords and rotations and scaling' , () => {
    const node = new scene.node()
    node.x = 0
    node.y = 1
    node.z = 2

    node.pitch = 10
    node.yaw = 15
    node.roll = 10

    node.scale_x = 0
    node.scale_y = 0
    node.scale_z = 0
    expect(node.get_matrix()).toEqual({"data": [0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,1]})
});

// Integration test bottom-up approach
// Testing between Node class and Mat4 class
test('get_matrix with coords and scaling' , () => {
    const node = new scene.node()
    node.x = 0
    node.y = 1
    node.z = 2

    node.pitch = 0
    node.yaw = 0
    node.roll = 0

    node.scale_x = 2
    node.scale_y = 2
    node.scale_z = 2
    expect(node.get_matrix()).toEqual({"data": [2,0,0,0,0,2,0,1,0,0,2,2,0,0,0,1]})
});
