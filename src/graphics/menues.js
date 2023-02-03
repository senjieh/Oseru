class Menue{
	/**
	 * 
	 * 
	 */
	constructor(type, div_class, div_id, attributes, attribute_values, debug) {
		this.elem = document.ceateElement(type);

		if (debug == true) {
			this.add_text('Debug Text');
		}

		if (div_class != null) {
			this.elem.classList.add(div_class);
		}

		if (div_id != null) {
			this.elem.id = div_id;
		}

		if (attributes.length() > 0) {
			for (let i=0; i< attributes.length(); i++) {
				this.elem.setAttributes(attributes[i], attribute_values[i])
			}
		}

		document.body.appendChild(this.elem);
	}  

	add_text(text) {
		const elem_text = document.createTextNode(text);
		this.elem.appendChild(elem_text);
	}

	/** Given a position matrix, place the top left corner of the div at the position
	 * 
	 * @param {Mat4} matrix
	 * @param {Vec4} point
	 */
	set_position_mat4(matrix, point) {

		// compute a clipspace position
	    // using the matrix we computed for the F
	    var clipspace = m4.transformVector(matrix, point); //FIXME

	    // divide X and Y by W just like the GPU does.
	    clipspace[0] /= clipspace[3];
	    clipspace[1] /= clipspace[3];

	    // convert from clipspace to pixels
	    var pixelX = (clipspace[0] *  0.5 + 0.5) * gl.canvas.width;
	    var pixelY = (clipspace[1] * -0.5 + 0.5) * gl.canvas.height;

	    // position the div
	    this.elem.style.left = Math.floor(pixelX) + "px";
	    this.elem.style.top  = Math.floor(pixelY) + "px";
	    textNode.nodeValue = now.toFixed(2);
	}

	/** make a check box with a label
	 * 
	 * @param {String} check box label
	 */
	add_button_checkbox(label) {
		const inputElem = document.createElemen('input');
		inputElem.type = 'checkbox';
		const labelElem = document.createElement('label');
		const labelText = createTextNode(label);
		lanelElem.appendChild(tabelText);
		labelElem.appendChild(inputElem);

		this.elem.appendChild(inputElem);

		//TODO: add event listener
	}
}

// ref: https://www.youtube.com/watch?v=VsXCK_2DJzA
// ref: https://webgl2fundamentals.org/webgl/lessons/webgl-text-html.html