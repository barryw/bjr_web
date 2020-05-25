import React from 'react';
import PubSub from 'pubsub-js';
import BootstrapTooltip from './BootstrapTooltip';

export default class HelpIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: false
    };

    PubSub.subscribe('HelpEnabled', this.listen);
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
