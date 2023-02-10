// make modal

const modal = new Menu('modal', 'modal_content');
const menu = new Menu('menu', 'menu_content');

function on_press() {
	console.log('clicked');
}

menu.add_button('1-1', '1-2', on_press, '1-3');
menu.add_text('texttext', 'texttext');
menu.add_checkbox('checkbox', 'checkbox');
menu.add_slider('slider', 'slider');
menu.add_textbox('textbox', 'textbox');
menu.draw();

function reopen(menu) {
	console.log("reopening");
	sleep(2);
	menu.open();
}

document
	.getElementById('openModal')
	.addEventListener('click', () => {
		console.log('Modal Button Clicked');
		// open modal
		// do things
		modal.open_modal(
			"ModalMenu",
			"TestText",
			"Yes!",
			"No?")
			.then(value => console.log('Accepted ', value))
			.catch(value => console.log('Rejected: ', value));
	});