class Menu{
	/** Menu class
	 *  this is a constructor for menus
	 * 
	 * TODO: add method to set menu position via coords in webgl space
	 * 		https://webglfundamentals.org/webgl/lessons/webgl-text-html.html
	 * TODO: Check mark buttons
	 * TODO: sliders
	 * TODO: text field
	 * TODO: extra dvs (maybe)
	 * 
	 * TODO: test page to showcase/test different methods
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

		/*this.elem_arr = [];
		this.elem_arr.append(this.elem);
		this.elem_arr.append(this.content_elem);*/
		
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
		return button_elem;
	}

	/**
	 * special exit menu button
	 * defaults to x button in top corner, but can be specified elsewhere as well
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
		const lable_elem = document.createElement('name');
		const lable_text = createTextNode(text);
		lable_elem.appendChild(lable_text);
		lable_elem.appendChild(input_elem);

		this.content_elem.appendChild(input_elem);
		return input_elem;
	}

	/**
	 * add a text block to the menu
	 * @param {String} name of block for css
	 * @param {String} content of text block
	 */
	add_text(name, content) {
		const text_elem = document.createElement('p');
		text_elem.classList.add(content);
		text_elem.textContent = content;

		this.content_elem.appendChild(text_elem);
		return text_elem;
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
				this.elem.classList.add('open');
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