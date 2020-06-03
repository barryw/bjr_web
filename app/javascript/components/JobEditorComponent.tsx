import React from 'react';
import axios from 'axios';
import { Formik, ErrorMessage } from 'formik';
import TimezonePicker from 'react-bootstrap-timezone-picker';
import './timezone_picker.css';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import HelpIcon from './HelpIcon';
import TagsInputComponent from './TagsInputComponent';
import CronEditorComponent from './CronEditorComponent';

import { configureAxios } from './AjaxUtils';

export default class JobEditorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      job: props.job,
      onClose: props.onClose,
      timezones: {}
    };
  }

  componentDidMount() {
    configureAxios();
    axios.get(`/timezones`)
    .then((response) => {
      this.setState({timezones: response.data});
    }
  )};

  handleClose = (e) => {
    const { onClose } = this.state;
    onClose();
  }

  handleSave = async (values, { setSubmitting }) => {
    const { onClose } = this.state;

    configureAxios();
    try {
      if(values.id == null) {
        this.newJob(values);
      } else {
        await this.updateJob(values);
      }
      toastr.success(I18n.t('jobs.update.success', {id: values.id}));
      onClose();
    } catch(err)
    {
      toastr.error(I18n.t('jobs.update.failed', {id: values.id, error: err}));
    } finally {
      setSubmitting(false);
    }
  }

  newJob = async (values) => {
    try {
      response = await axis.post(`/jobs`, null, {
        data: values
      });
    } catch(error) {
      if(error.response != null)
        throw error.response.data.message;
    }
  }

  updateJob = async (values) => {
    try {
      response = await axios.put(`/jobs/${values.id}`, null, {
        data: values
      });
    } catch(error) {
      if(error.response != null) // WHAT the actual FUCK?!
        throw error.response.data.message;
    }
  }

  testFailureCallback = () => {

  }

  testSuccessCallback = () => {

  }

  render() {
    return (
      <React.Fragment>
        <Modal.Header closeButton>
          <Modal.Title>{I18n.t('jobs.job_details.header', { name: this.state.job.name })}</Modal.Title>
        </Modal.Header>
          <Formik
            initialValues={{ id: this.state.job.id, name: this.state.job.name, command: this.state.job.command,
              success_callback: this.state.job.success_callback, failure_callback: this.state.job.failure_callback,
              tags: this.state.job.tags, cron: this.state.job.cron, enabled: this.state.job.enabled,
              timezone: this.state.job.timezone }}
            validate={values => {
              const errors = {};
              if (!values.name) {
                errors.name = I18n.t('jobs.validation.name');
              }
              if(!values.command) {
                errors.command = I18n.t('jobs.validation.command');
              }
              if(!values.timezone) {
                errors.timezone = I18n.t('jobs.validation.timezone');
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              this.handleSave(values, { setSubmitting });
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Body>
                  <Form.Group controlId="formGroupName">
                    <Form.Label>{I18n.t('common.job_table.name')}</Form.Label>&nbsp;&nbsp;<HelpIcon tooltip={I18n.t('jobs.tooltips.name')} />
                    <Form.Control type="text" name="name" onChange={handleChange} onBlur={handleBlur} value={values.name} className="form-control" />
                    <ErrorMessage name="name" component="div" className="text-danger" />
                  </Form.Group>
                  <Form.Group controlId="formGroupCommand">
                    <Form.Label>{I18n.t('common.job_table.command')}</Form.Label>&nbsp;&nbsp;<HelpIcon tooltip={I18n.t('jobs.tooltips.command')} />
                    <Form.Control as="textarea" rows="3" name="command" onChange={handleChange} onBlur={handleBlur} value={values.command} className="form-control" />
                    <ErrorMessage name="command" component="div" className="text-danger" />
                  </Form.Group>
                  <Form.Group controlId="formGroupSuccessCallback">
                    <div className="row">
                      <div className="col-3">
                        <Form.Label>{I18n.t('common.job_table.success_callback')}</Form.Label>&nbsp;&nbsp;<HelpIcon tooltip={I18n.t('jobs.tooltips.success_callback')} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-10">
                        <Form.Control type="text" name="success_callback" onChange={handleChange} onBlur={handleBlur} value={values.success_callback} className="form-control" />
                      </div>
                      <div className="col-2">
                        <Button variant="secondary" onClick={this.testSuccessCallback}>
                          {I18n.t('common.test')}
                        </Button>
                      </div>
                    </div>
                  </Form.Group>
                  <Form.Group controlId="formGroupFailureCallback">
                    <div className="row">
                      <div className="col-3">
                        <Form.Label>{I18n.t('common.job_table.failure_callback')}</Form.Label>&nbsp;&nbsp;<HelpIcon tooltip={I18n.t('jobs.tooltips.failure_callback')} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-10">
                        <Form.Control type="text" name="failure_callback" onChange={handleChange} onBlur={handleBlur} value={values.failure_callback} className="form-control" />
                      </div>
                      <div className="col-2">
                        <Button variant="secondary" onClick={this.testFailureCallback}>
                          {I18n.t('common.test')}
                        </Button>
                      </div>
                    </div>
                  </Form.Group>
                  <Form.Group controlId="formGroupTags">
                    <Form.Label>{I18n.t('common.job_table.tags')}</Form.Label>&nbsp;&nbsp;<HelpIcon tooltip={I18n.t('jobs.tooltips.tags')} />
                    <TagsInputComponent tags={values.tags} onChange={e => setFieldValue('tags', e)} onBlur={handleBlur} />
                  </Form.Group>
                  <Form.Row>
                    <Form.Group as={Col} md="7" controlId="formGroupSchedule">
                      <CronEditorComponent cron={values.cron} timezone={values.timezone} onChange={e => setFieldValue('cron', e)} onBlur={handleBlur} />
                    </Form.Group>
                    <Form.Group as={Col} md="5" controlId="formGroupTimezone">
                      <Form.Label>{I18n.t('common.job_table.timezone')}</Form.Label>&nbsp;&nbsp;<HelpIcon tooltip={I18n.t('jobs.tooltips.timezone')} />
                      <TimezonePicker
                        absolute      = {true}
                        placeholder   = {I18n.t('jobs.select_timezone')}
                        onChange      = {e => setFieldValue('timezone', e)}
                        value         = {values.timezone}
                        timezones     = {this.state.timezones}
                      />
                      <ErrorMessage name="timezone" component="div" className="text-danger" />
                    </Form.Group>
                  </Form.Row>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    {I18n.t('common.close')}
                  </Button>
                  <Button variant="primary" type="submit" disabled={isSubmitting} >
                    {I18n.t('common.save')}
                  </Button>
                </Modal.Footer>
              </form>
            )}
          </Formik>
      </React.Fragment>
    );
  }
}
