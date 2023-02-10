// make modal

const modal = new Menu('modal', 'modal_content');
const menu = new Menu('menu', 'menu_content');

function on_press() {
	console.log('clicked');
}

const tbutton = menu.add_button('test_button', 'count', on_press, true);
menu.add_text('texttext', 'texttext');
const checkbox = menu.add_checkbox('checkbox', 'checkbox');
const slider = menu.add_slider('slider', 'slider', 10, 0, 20);
const textbox = menu.add_input_textbox('textbox', 'textbox');
//menu.add_text_element('textbox_lable', 'this is a text box', 'textbox');
menu.add_close_button('close', 'X',on_press, false);

let count = 0;
// globals are bad, but make for easier testing here
function test_input(count) {
	count++;
	console.log(count);
	console.log("checkbox: ", checkbox.value);
	console.log("slider: ", slider.value);
	console.log("textbox: ", textbox.value);
	//return count; doesn't work
}

menu.add_text('text', 'press to get state of inputs');
let a = menu.add_button('print_button', 'Test!', test_input, count);

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
