const Mat4 = require('./matrix.js');

// make sure I figured out how to test things
test("Scale", () => {
        expect(Mat4.scale(2,2,2).data).toStrictEqual([
                2,0,0,0,
                0,2,0,0,
                0,0,2,0,
                0,0,0,1]);
});

// replace -0 with 0 as that is ok for tests
function filter_neg_zero(num) {
        if (num == -0) {
                return 0;
        }
        return num;
}

// truncate floats to 1e-5 decimal places
function round_floats(num) {
        return Math.round(num * 10**5) / 10**5;
}

// I plan to add quaturnians at some point so I should probably test this extensively
// TODO: floating point precision errors should be handled in class itself, not externally
test("Rotation XY", () => {
        // zero rotation dose nothing
        let data = Mat4.rotation_xy(0).data;
        data = data.map(filter_neg_zero);  // apparently -0 is a thing, and that thing is not 0
        expect(data).toStrictEqual([
                1,0,0,0,
                0,1,0,0,      
                0,0,1,0,
                0,0,0,1]);

        // 1 turn equivalent to no rotation
        data = Mat4.rotation_xy(1).data;
        data = data.map(round_floats).map(filter_neg_zero);
        expect(data).toStrictEqual([
                1,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,1]);

        // half turn faces other way
        data = Mat4.rotation_xy(0.5).data;
        data = data.map(round_floats).map(filter_neg_zero);
        expect(data).toStrictEqual([
                -1,0,0,0,
                0,-1,0,0,
                0,0,1,0,
                0,0,0,1]);

        // quarter turn, and backwards
        data = Mat4.rotation_xy(-0.25).data;
        data = data.map(round_floats).map(filter_neg_zero);
        expect(data).toStrictEqual([
                0,-1,0,0,
                1,0,0,0,
                0,0,1,0,
                0,0,0,1]);
});

test("Rotation XZ", () => {
        // zero rotation dose nothing
        let data = Mat4.rotation_xz(0).data;
        data = data.map(filter_neg_zero);  
        expect(data).toStrictEqual([
                1,0,0,0,
                0,1,0,0,      
                0,0,1,0,
                0,0,0,1]);

        // 1 turn equivalent to no rotation
        data = Mat4.rotation_xz(1).data;
        data = data.map(round_floats).map(filter_neg_zero);
        expect(data).toStrictEqual([
                1,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,1]);

        // half turn faces other way
        data = Mat4.rotation_xz(0.5).data;
        data = data.map(round_floats).map(filter_neg_zero);
        expect(data).toStrictEqual([
                -1,0,0,0,
                0,1,0,0,
                0,0,-1,0,
                0,0,0,1]);

        // quarter turn, and backwards
        data = Mat4.rotation_xz(-0.25).data;
        data = data.map(round_floats).map(filter_neg_zero);
        expect(data).toStrictEqual([
                0,0,-1,0,
                0,1,0,0,
                1,0,0,0,
                0,0,0,1]);
});

test("Rotation YZ", () => {
        // zero rotation dose nothing
        let data = Mat4.rotation_yz(0).data;
        data = data.map(filter_neg_zero);  
        expect(data).toStrictEqual([
                1,0,0,0,
                0,1,0,0,      
                0,0,1,0,
                0,0,0,1]);

        // 1 turn equivalent to no rotation
        data = Mat4.rotation_yz(1).data;
        data = data.map(round_floats).map(filter_neg_zero);
        expect(data).toStrictEqual([
                1,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,1]);

        // half turn faces other way
        data = Mat4.rotation_yz(0.5).data;
        data = data.map(round_floats).map(filter_neg_zero);
        expect(data).toStrictEqual([
                1,0,0,0,
                0,-1,0,0,
                0,0,-1,0,
                0,0,0,1]);

        // quarter turn, and backwards
        data = Mat4.rotation_yz(-0.25).data;
        data = data.map(round_floats).map(filter_neg_zero);
        expect(data).toStrictEqual([
                1,0,0,0,
                0,0,-1,0,
                0,1,0,0,
                0,0,0,1]);
});