import React from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import HelpIcon from './HelpIcon';

export default function ViewRunComponent(props)
{
  return (
    <React.Fragment>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formStderr">
          <Form.Label>{I18n.t('common.runs_table.stderr')}</Form.Label>&nbsp;&nbsp;<HelpIcon tooltip={I18n.t('runs.tooltips.stderr')} />
          <Form.Control as="textarea" rows="10" name="stderr" value={props.run.stderr} className="form-control" />
        </Form.Group>
        <Form.Group controlId="formStdout">
          <Form.Label>{I18n.t('common.runs_table.stdout')}</Form.Label>&nbsp;&nbsp;<HelpIcon tooltip={I18n.t('runs.tooltips.stdout')} />
          <Form.Control as="textarea" rows="10" name="stdout" value={props.run.stdout} className="form-control" />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onClose} >
          {props.cancelButton}
        </Button>
      </Modal.Footer>
    </React.Fragment>
  )
}
