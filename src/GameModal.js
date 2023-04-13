import React from 'react';
import Modal from 'react-modal';

export default function GameModal({ showModal, handleModal }) {
  // const [show, setShow] = React.useState(false); 
  //  const handleClose = () => setShow(false);
   // const handleShow = () => setShow(true);
  
    return (
      <>
        <Modal open={ showModal } onClose={ () => { handleModal(false) } }>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>
      </>
    );
}