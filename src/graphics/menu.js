class Menu{
	/** Menu class
	 *  this is a constructor for menus
	 * 
	 * call methods in order elements will be displayed top to bottom
	 * 
	 * TODO: add method to set menu position via coords in webgl space
	 * 		https://webglfundamentals.org/webgl/lessons/webgl-text-html.html
	 * TODO: extra dvs (maybe)
	 * TODO: position elements and menu
	 * 
	 * @param {String} element name
	 * @param {String} content div name
	 * 
	 */
	constructor(name='menu', content_name='menu_content') {
		this.name = name;

		this.elem = document.createElement('div');
		this.elem.classList.add(name);
		setTimeout(() => {
			this.elem.classList.add('open');
		}, 400);  // wait 400ms to ensure fades it

		this.is_open = true;

		this.content_elem = document.createElement('div');
		this.content_elem.classList.add(content_name);
		this.elem.appendChild(this.content_elem);

	}

	/**
	 * update position based on vec
	 * 
	 * IMPORTANT: dependant on matrix.js
	 * ref: https://webgl2fundamentals.org/webgl/lessons/webgl-text-html.html
	 * @param {Mat4}
	 * @param {Vec4} point
	 * @param {WebGLContext} gl
	 */
	update_position_vec(mat, vec, gl) {
		// get coords of point to place window at
		// convert to clip space
		var point = mat.transform_vec(point);
		point.x /= point.w;
		point.y /= point.w
		// menu is in 2d so no z

		var pix_x = (point.x * 0.5 + 0.5) * gl.canvas.width;
		var pix_y = (point.y * 0.5 + 0.5) * gl.canvas.height;

		// position div
		this.elem.style.left = Math.floor(pix_x) + "px";
		this.elem.style.top = Math.floor(pix_y) + "px";

		// not sure about this
		this.content_elem.nodeValue = now.toFixed(2);
	}


	/**
	 * use to add line break between elements
	 * 
	 */
	add_line_break() {

	}

	/**
	 * add a button to the menu
	 * @param {String} name
	 * @param {String} text
	 * @param {function} action on button press
	 * @param {void} argument to pass on press
	 * 
	 * @return {Object} button object
	 */
	add_button(name, text, on_press, button_arg) {
		const button_elem = document.createElement('button');
		button_elem.classList.add(name);
		button_elem.textContent = text;

		button_elem.addEventListener('click', () => {
			on_press(button_arg);
		});

		this.content_elem.appendChild(button_elem);

		// add line break after element
		const ln_break = document.createElement('br');
		button_elem.parentNode.insertBefore(ln_break, button_elem.nextSibling);

		return button_elem;
	}

	/**
	 * special exit menu button
	 * defaults to x button in top corner, but can be specified elsewhere as well
	 * 
	 * IMPORTANT: name should be 'close' to get default styling
	 * 
	 * @param {String} name
	 * @param {String} text
	 * @param {function} action on button press
	 * @param {void} argument to pass on press
	 * 
	 * @return {Object} button object
	 */
	add_close_button(name, text, on_press, button_arg) {
		const button_elem = document.createElement('button');
		button_elem.classList.add(name);
		button_elem.textContent = text;

		if (on_press) {
			button_elem.addEventListener('click', () => {
				on_press(button_arg);
				this.close();
			});
		} else {
			button_elem.addEventListener('click', () => {
				this.close();
			});
		}

		// no line break because position should be specified by css

		this.content_elem.appendChild(button_elem);
		return button_elem;
	}


	/** check box style menu option
	 * 
	 * @param {String} name
	 * @param {String} text
	 */
	add_checkbox(name='checkBox', text=null) {
		const input_elem = document.createElement('input');
		input_elem.type = 'checkbox';
		const lable_elem = document.createElement(name);
		lable_elem.appendChild(input_elem);

		this.content_elem.appendChild(input_elem);

		// add line break after element
		const ln_break = document.createElement('br');
		input_elem.parentNode.insertBefore(ln_break, input_elem.nextSibling);

		return input_elem;
	}

	/**
	 * input range menu option
	 * 
	 * @param {String} name
	 * @param {String} text
	 * @param {int} starting value
	 * @param {int} min value
	 * @param {int} max value
	 */
	add_slider(name, text, start, min, max) {
		const input_elem = document.createElement('input');
		input_elem.type = 'range';
		const lable_elem = document.createElement(name);
		lable_elem.appendChild(input_elem);

		this.content_elem.appendChild(input_elem);

		// add line break after element
		const ln_break = document.createElement('br');
		input_elem.parentNode.insertBefore(ln_break, input_elem.nextSibling);

		return input_elem;
	}

	/**
	 * textbox menu option
	 * 
	 * @param {String} name
	 * @param {String} text
	 */
	add_input_textbox(name, text) {
		const input_elem = document.createElement('input');
		input_elem.type = 'text';
		const lable_elem = document.createElement(name);
		lable_elem.appendChild(input_elem);

		this.content_elem.appendChild(input_elem);

		// add line break after element
		const ln_break = document.createElement('br');
		input_elem.parentNode.insertBefore(ln_break, input_elem.nextSibling);

		return input_elem;
	}

	/**
	 * add a text block to the menu
	 * 
	 * @param {String} name of block for css
	 * @param {String} content of text block
	 */
	add_text(name, content) {
		const text_elem = document.createElement('p');
		text_elem.classList.add(name);
		text_elem.textContent = content;

		this.content_elem.appendChild(text_elem);

		// add line break after element
		//const ln_break = document.createElement('br');
		//text_elem.parentNode.insertBefore(ln_break, text_elem.nextSibling);

		return text_elem;
	}

	/**
	 * add label to element
	 * 
	 * @param {String} name of block for css
	 * @param {String} content of block
	 * @param {String} name of element to add text to
	 * 
	 * FIXME
	 */
	add_text_element(name, content, target) {
		const target_elem = document.getElementById(target);
		const text_elem = document.createElement('p');
		text_elem.classList.add(name);
		text_elem.textContent = content;

		target_elem.parentNode.insertBefore(text_elem, target_elem);
	}


	/**
	 * call after everything has been added to draw menu
	 */
	draw() {
		document.body.appendChild(this.elem);
	}

	/** closes menu
	 * FIXME: should this be private?
	 */
	close() {
		this.elem.classList.remove('open');
		setTimeout(() => {
			document.body.removeChild(this.elem)
		}, 400);  // let things fade out before removing them
		this.is_open = false;
	}

	/** open menu if closed
	 * so you don't need to re-make it every time it's called
	 */
	open() {
		if (this.is_open) {
			console.log("menu already open");
		} else {
			setTimeout(() => {
				this.draw();
			}, 400);  // wait 400ms to ensure fades it

			this.is_open = true;
		}
	}

	/**
	 * constructor to create a modal style menu
	 * 
	 * the element's name will be modal for css purposes
	 * this turns a base menu class into a modal
	 * TODO: make static constructor
	 * IMPORTANT: do not call on menu that has been given elements already
	 * 
	 * @param {String} title text
	 * @param {String} text
	 * @param {String} confirm button text
	 * @param {String} reject button text
	 * 
	 * @return {Promise}
	 */
	open_modal(title, text, confirm_text, reject_text) {
		return new Promise ((resolve, reject) => {
			this.#create_open_modal(resolve, reject, title, text, confirm_text, reject_text)
		});
	}	

	/**
	 * method that dose the work of closing the modal
	 * private
	 * ref: https://www.youtube.com/watch?v=kJPkCGtv3vY
	 * 
	 * @param {Function} on confirm
	 * @param {Function} on reject
	 * @param {String} title text
	 * @param {String} text
	 * @param {String} confirm button text
	 * @param {String} reject button text
	 */
	#create_open_modal(on_confirm, on_cancle, title_text, content_text, confirm_text, reject_text) {
		// TODO: funcs to add element should specify what element to return it to, or return element to add

		this.add_text('titleText', title_text);
		this.add_text('messageText', content_text);
		let elem = this.add_close_button('confirmText', confirm_text, on_confirm, 'Confirmed');
		if (reject_text) {
			let elem = this.add_close_button('cancelText', reject_text, on_cancle, 'Cancelled');
		}

		this.draw();
	}
}