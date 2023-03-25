const Mat4 = require('./matrix.js');
const Vec4 = require('./vector.js');

// IMPORTANT: See attached Matrix.js for code being tested

// replace -0 with 0 as that is ok result and easier for tests
function filter_neg_zero(num) {
        if (num == -0) {
                return 0;
        }
        return num;
}

// make sure I figured out how to test things
// White Box
// covers 3 main cases of positive, negative, and 0
test("Scale", () => {
        expect(Mat4.scale(2,2,2).data).toStrictEqual([
                2,0,0,0,
                0,2,0,0,
                0,0,2,0,
                0,0,0,1]);

        expect(Mat4.scale(0,0,0).data).toStrictEqual([
                0,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,1]);

        expect(Mat4.scale(-2,-2,-2).data).toStrictEqual([
                -2,0,0,0,
                0,-2,0,0,
                0,0,-2,0,
                0,0,0,1]);
});

// White Box
// covers 3 major cases of multiplying against identity, two positive, 
// and one positive one negative
test("Multiplication", () => {
        let mat1 = new Mat4([
                2,0,0,0,
                0,2,0,0,
                0,0,2,0,
                0,0,0,1,]);
        let mat2 = new Mat4([
                3,0,0,3,
                0,3,0,3,
                0,0,3,3,
                0,0,0,1]);
        let mat3 = new Mat4([
                -2,0,0,0,
                0,-2,0,0,
                0,0,-2,0,
                0,0,0,1,]);

        expect(Mat4.identity().mul(mat1).data).toStrictEqual([
                2,0,0,0,
                0,2,0,0,
                0,0,2,0,
                0,0,0,1,]);
        expect(mat1.mul(mat2).data).toStrictEqual([
                6,0,0,6,
                0,6,0,6,
                0,0,6,6,
                0,0,0,1]);
        expect(mat3.mul(mat2).data).toStrictEqual([
                -6,0,0,-6,
                0,-6,0,-6,
                0,0,-6,-6,
                0,0,0,1]);
});

// White Box
// covers major cases of negative, 0, positive, and varied
test("Inverse", () => {
        expect(Mat4.identity().inverse().data.map(filter_neg_zero)).toStrictEqual([
                1,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,1]);

        let mat1 = new Mat4([
                -6,0,0,-6,
                0,-6,0,-6,
                0,0,-6,-6,
                0,0,0,1]);
        expect(mat1.inverse().data.map(filter_neg_zero)).toStrictEqual([
                -1/6, 0, 0, -1,
                0, -1/6, 0, -1,
                0, 0, -1/6, -1,
                0, 0, 0, 1]);

        mat1.data = [
                0,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0];
        // is this right?
        expect(mat1.inverse().data.map(filter_neg_zero)).toStrictEqual([
                0,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0]);

        mat1.data = [
                1,2,3,4,
                -5,-6,-7,-8,
                9,10,-11,-12,
                -13,-14,15,16]
        expect(mat1.inverse().data).toStrictEqual([
                -0.75,-0.25,-1.75,-1.25,
                0.625,0.125,1.625,1.125,
                -1,-0.5,2,1.5,
                0.875,0.375,-1.875,-1.375]);
});

// White Box
// tests Identity by one, identity by varied, varied by one, and varied by varied
test("Transform", () => {
        expect(Mat4.identity().transform(1,1,1,1).data).toStrictEqual([
                1,1,1,1]);
        expect(Mat4.identity().transform(-1,2,-3,4).data).toStrictEqual([
                -1,2,-3,4]);
        mat1 = new Mat4([
                1,2,3,4,
                -5,-6,-7,-8,
                9,10,-11,-12,
                -13,-14,15,16]);
        expect(mat1.transform(1,1,1,1).data).toStrictEqual([
                10, -26, -3, 3]);
        expect(mat1.transform(2,3,-4,-5).data).toStrictEqual([
                28, 40, 152, 208]);
});



// I plan to add quaturnians at some point so I should probably test this extensively
// TODO: floating point precision errors should be handled in class itself, not externally
// White Box
// for all 3 tests below:
// covers positive, negative, 0, and full 360 rotation
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
        data = data.map(filter_neg_zero);
        expect(data).toStrictEqual([
                1,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,1]);

        // half turn faces other way
        data = Mat4.rotation_xy(0.5).data;
        data = data.map(filter_neg_zero);
        expect(data).toStrictEqual([
                -1,0,0,0,
                0,-1,0,0,
                0,0,1,0,
                0,0,0,1]);

        // quarter turn, and backwards
        data = Mat4.rotation_xy(-0.25).data;
        data = data.map(filter_neg_zero);
        expect(data).toStrictEqual([
                0,-1,0,0,
                1,0,0,0,
                0,0,1,0,
                0,0,0,1]);
});

// White Box
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
        data = data.map(filter_neg_zero);
        expect(data).toStrictEqual([
                1,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,1]);

        // half turn faces other way
        data = Mat4.rotation_xz(0.5).data;
        data = data.map(filter_neg_zero);
        expect(data).toStrictEqual([
                -1,0,0,0,
                0,1,0,0,
                0,0,-1,0,
                0,0,0,1]);

        // quarter turn, and backwards
        data = Mat4.rotation_xz(-0.25).data;
        data = data.map(filter_neg_zero);
        expect(data).toStrictEqual([
                0,0,-1,0,
                0,1,0,0,
                1,0,0,0,
                0,0,0,1]);
});

// White Box
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
        data = data.map(filter_neg_zero);
        expect(data).toStrictEqual([
                1,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,1]);

        // half turn faces other way
        data = Mat4.rotation_yz(0.5).data;
        data = data.map(filter_neg_zero);
        expect(data).toStrictEqual([
                1,0,0,0,
                0,-1,0,0,
                0,0,-1,0,
                0,0,0,1]);

        // quarter turn, and backwards
        data = Mat4.rotation_yz(-0.25).data;
        data = data.map(filter_neg_zero);
        expect(data).toStrictEqual([
                1,0,0,0,
                0,0,-1,0,
                0,1,0,0,
                0,0,0,1]);
});