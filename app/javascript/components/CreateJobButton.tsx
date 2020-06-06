import React from 'react';
import PubSub from 'pubsub-js';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import JobEditorComponent from './JobEditorComponent';

export default class CreateJobButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewJobModal: false,
      newJob: null
    };
  }

  openNewJobModal = () => {
    let newJob = {
      id: null,
      name: 'My New Job',
      cron: '0 * * * *',
      command: 'echo "Hello, World"',
      tags: '',
      timezone: this.props.timezone,
      enabled: true,
      success_callback: '',
      failure_callback: ''
    };

    this.setState({showNewJobModal: true, newJob: newJob});
  }

  closeNewJobModal = () => {
    PubSub.publish('RefreshJobs', null);
    this.setState({showNewJobModal: false});
  }

  render() {
    const { showNewJobModal, newJob } = this.state;

    return (
      <React.Fragment>
        <Button variant="primary" type="button" onClick={this.openNewJobModal}>{I18n.t('jobs.job_details.create_job')}</Button>
        <Modal show={showNewJobModal} onHide={this.closeNewJobModal} size="lg" centered>
          <JobEditorComponent job={newJob} onClose={this.closeNewJobModal} completeButton={I18n.t('jobs.job_details.create_job')} cancelButton={I18n.t('common.close')}/>
        </Modal>
      </React.Fragment>
    );
  }
}
