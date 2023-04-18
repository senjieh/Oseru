
class Vec4 {

    constructor( x, y, z, w ) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w ?? 0;
        this.data = [x,y,z,w];
    }

    /**
     * Returns the vector that is this vector scaled by the given scalar.
     * @param {number} by the scalar to scale with 
     * @returns {Vec4}
     */
    scaled( by ) {
        return new Vec4(this.x*by, this.y*by, this.z*by, this.w*by);
        // return the new vector
    }

    /**
     * Returns the dot product between this vector and other
     * @param {Vec4} other the other vector 
     * @returns {number}
     */
    dot( other ) {
        return (this.x*other.x) + (this.y*other.y) + (this.z*other.z) + (this.w*other.w);
        // return the dot product 
    }

    /**
     * Returns the length of this vector
     * @returns {number}
     */
    length() {
        return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2) + Math.pow(this.z,2) + Math.pow(this.w,2));
        // return the length
    }

    /**
     * Returns a normalized version of this vector
     * @returns {Vec4}
     */
    norm() {
        const length = this.length();
        return new Vec4(this.x /length, this.y/length, this.z/length, this.w/length);
        // return the normalized vector
    }

    /**
     * Returns the vector sum between this and other.
     * @param {Vec4} other 
     * 
     * @return {Vec4}
     */
    add( other ) {
        return new Vec4(this.x + other.x, this.y + other.y, this.z + other.z, this.w + other.w);
        // return the vector sum
    }

    /**
     * returns difference between this and other
     * @param {Vec4} other
     * 
     * @return {Vec4}
     */
    sub( other ) {
        return this.add( other.scaled( -1 ) );
    }

    cross( other ) {
        let x = this.y * other.z - this.z * other.y;
        let y = this.x * other.z - this.z * other.x;
        let z = this.x * other.y - this.y - other.x;

        return new Vec4( x, y, z, 0 );
    }
	
	toString() {
		return [ '[', this.x, this.y, this.z, this.w, ']' ].join( ' ' );
	}
}

/**
 * Like Vec, but only 2 dimensional
 */

class Vec2 {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    scaled(by) {
        return new Vec2(this.x * by, this.y * by);
    }

    dot(other) {
        return this.x * other.x + this.y * other.y;
    }

    length() {
        return Math.squr(this.x**2 + this.y**2);
    }

    norm() {
        let len = this.length();
        return new Vec2(this.x/len, this.y/len);
    }

    add(other) {
        return new Vec2(this.x+other.x, this.y+other.y);
    }

    sub(other) {
        return this.add(other.scaled(-1));
    }

    cross(other) {
        // TODO: this isn't a thing
    }

    vec4() {
        return new Vec4(this.x, this.y, 0, 0);
    }

}