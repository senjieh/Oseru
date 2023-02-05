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

/** Creates a modal text box popup (are you sure/confirmation/etc)
 * 
 * 
 * 
 */
class Modal {
	/** Constructor
	 * @param {String} Title
	 * @param {String} Message
	 * @param {String} Confirm Text
	 * @param {String} Cancel Text (optional)
	 */
	constructor(title_text, message_text, confirm_text, cancel_text=null) {
		this.title_text = title_text;
		this.message_text = message_text;
		this.confirm_text = confirm_text;
		this.cancel_text = cancel_text;
	}

	#create_open(on_confirm, on_cancel) {
		// box the modal lives in
		this.modalElem = document.createElement('div');
		this.modalElem.classList.add('modal');
		setTimeout(() => {
			this.modalElem.classList.add('open');
		}, 400);  // wait 400ms to ensure fade it

		// content of modal box
		const modal_content_elem = document.createElement('div');
		modal_content_elem.classList.add('content');

		this.modalElem.appendChild(modal_content_elem);

		// title of modal
		const title_text_elem = document.createElement('p');
		title_text_elem.classList.add('titleText');
		title_text_elem.textContent = this.title_text;

		document.body.appendChild(title_text_elem);

		// message
		const message_text_elem = document.createElement('p');
		message_text_elem.classList.add('messageText');
		message_text_elem.textContent = this.message_text;

		document.body.appendChild(message_text_elem);

		// cancel
		// if no cancel text provided, hides cancel button and becomes confirm window
		if (this.cancel_text) {
			const cancel_text_elem = document.createElement('button');
			cancel_text_elem.classList.add('cancleText');
			cancel_text_elem.textContent = this.cancel_text;

			// on cancel, 
			cancel_text_elem.addEventListener('click' () => {
				on_cancel('Cancelled');
				this.#close();
			});

			document.body.appendChild(cancel_text_elem);
		}

		// confirm
		const confirm_text_elem = document.createElement('button');
		confirm_text_elem.classList.add('confirmText');
		confirm_text_elem.textContent = this.confirm_text;

		confirm_text_elem.addEventListener('click' () => {
			on_confirm('Confirmed');
			this.#close();
		});

		document.body.appendChild(confirm_text_elem);


		document.body.appendChild(this.modalElem);
	}

	/** Function to create and open the modal
	 * @return {Promise}
	 * Example Usage:
	 * document
	 * 	.getElementById('openModal')
	 * 	.addEventListner('click', () => {
	 * 		confirmModal
	 * 			.open()
	 * 			.then(value => 
	 * 				console.log("clicked confirm: ", value)
	 * 			)
	 * 			.catch(value =>
	 * 				console.log("clicked cancel: ", value)
	 * 			);
	 * 		});
	 */
	open() {
		return new Promise((resolve, reject) => {
			this.#createAndOpen(resonve, reject);
		});
	}

	/** closes modal
	 */
	#close() {
		this.modalElem.classList.remove('open');
		setTimout(() => {
			document.body.removeChild(this.modalElem)
		}, 400);  // let things fade out before removing them
	}
}