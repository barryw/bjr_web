import React from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function ConfirmationDialog(props)
{
  return (
    <React.Fragment>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleCancel} >
          {props.cancelText}
        </Button>
        <Button variant="primary" onClick={props.handleConfirm} >
          {props.confirmText}
        </Button>
      </Modal.Footer>
    </React.Fragment>
  )
}
