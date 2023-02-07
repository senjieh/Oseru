class Menu{
	/**
	 * 
	 * 
	 */
	constructor(name='menu', content_name='menu_content') {
		this.name = name;

		this.elem = document.createElement('div');
		this.elem.classList.add(name);
		setTimeout(() => {
			this.elem.classList.add('open');
		}, 400);  // wait 400ms to ensure fades it

		this.content_elem = document.createElement('div');
		this.content_elem.classList.add(content_name);
		this.elem.appendChild(this.content_elem);

		/*this.elem_arr = [];
		this.elem_arr.append(this.elem);
		this.elem_arr.append(this.content_elem);*/
		
	}

	/**
	 * add a button to the menu
	 */
	add_button(name, text, on_press, button_arg) {
		const button_elem = document.createElement('button');
		button_elem.classList.add(name);
		button_elem.textContent = text;

		button_elem.addEventListener('click', () => {
			on_press(button_arg);
		});

		document.body.appendChild(button_elem);
	}

	/**
	 * special exit menu button
	 * defaults to x button in top corner, but can be specified elsewhere as well
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

		document.body.appendChild(button_elem);
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

		this.elem.appendChild(input_elem);
	}

	/**
	 * add a text block to the menu
	 */
	add_text(name, content) {
		const text_elem = document.createElement('p');
		text_elem.classList.add(content);
		text_elem.textContent = content;

		document.body.appendChild(text_elem);
	}


	/**
	 * call after everything has been added to draw menu
	 */
	draw() {
		document.body.appendChild(this.elem);
	}

	/** closes modal
	 */
	close() {
		this.modalElem.classList.remove('open');
		setTimout(() => {
			document.body.removeChild(this.elem)
		}, 400);  // let things fade out before removing them
	}

	open_modal(title, text, confirm, reject) {
		return new Promise ((resolve, reject) => {
			this.create_open_modal(resolve, reject, title, text, confirm, reject)
		});
	}	

	create_open_modal(on_confirm, on_cancle, title_text, content_text, confirm_text, reject_text) {
		//let modal = new Menu('modal', 'modal_content');
		/*setTimeout(() => {
			modal.elem.classList.add('open');
		}, 400); */  // wait 400ms to ensure fades it

		this.add_text('titleText', title_text);
		this.add_text('messageText', content_text);
		this.add_button('confirmText', confirm_text, on_confirm, 'Confirmed');
		if (reject_text) {
			this.add_close_button('cancelText', reject_text, on_cancle, 'Cancelled');
		}

		this.draw();
	}
}