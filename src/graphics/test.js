// make modal

const modal = new Menu('modal', 'modal_content');


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
			.then(value => console.log('Confirmed: ', value))
			.catch(value => console.log('Rejected: ', value));
	});