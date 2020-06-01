import React from 'react';
import axios from 'axios';
import PubSub from 'pubsub-js';
import BootstrapTooltip from './BootstrapTooltip';

import { configureAxios } from './AjaxUtils';

export default class HelpIcon extends React.Component {
  token;

  constructor(props) {
    super(props);
    this.state = {
      enabled: false
    };

    this.token = PubSub.subscribe('HelpEnabled', this.listen);
  }

  componentWillMount() {
    configureAxios();
    axios.get('/help')
    .then((response) => {
      this.setState({enabled: response.data.enabled})
    });
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.token);
  }

  listen = (msg, data) => {
    switch(msg)
    {
      case "HelpEnabled":
        this.setState({enabled: data});
        break;
      default:
        break;
    }
  };

  render() {
    if(this.state.enabled)
    {
      return <BootstrapTooltip title={this.props.tooltip}><i className="ion-help-circled" style={{cursor: 'pointer'}}></i></BootstrapTooltip>
    } else {
      return null;
    }
  }
}
