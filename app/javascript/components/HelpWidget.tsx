import React from 'react';
import axios from 'axios';
import PubSub from 'pubsub-js';

import BootstrapTooltip from './BootstrapTooltip'

export default class HelpWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: false,
      title: ''
    };

    this.setHelpStatus = this.setHelpStatus.bind(this);
  }

  componentDidMount() {
    this.getHelpStatus();
  }

  getHelpStatus() {
    axios.get('/help')
    .then((response) => {
      PubSub.publish('HelpEnabled', response.data.enabled);
      this.setState({enabled: response.data.enabled, title: response.data.text})
    });
  }

  setHelpStatus() {
    this.configureAxios();
    axios.post(`/help?enabled=${this.state.enabled ? '0' : '1'}`)
    .then((response) => {
      this.getHelpStatus();
    });
  }

  /*
  Configure Axios to pass along our CSRF token
  */
  configureAxios() {
    let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    axios.defaults.headers.common['X-CSRF-Token'] = token
    axios.defaults.headers.common['Accept'] = 'application/json'
  }

  render() {
    return (
      <div className="c-pointer position-relative mt-4 mr-1">
        <BootstrapTooltip title={this.state.title}>
          <span className={this.state.enabled ? 'card-widget__icon' : 'card-widget__icon_disabled'}>
            <i className="icon-question" onClick={this.setHelpStatus}></i>
          </span>
        </BootstrapTooltip>
      </div>
    )
  }
}
