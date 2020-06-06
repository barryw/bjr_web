import React from 'react';
import axios from 'axios';
import BootstrapTooltip from './BootstrapTooltip';
import Folder from './Folder';
import Collapse from 'react-bootstrap/Collapse';

import { configureAxios } from './AjaxUtils';

export default class FolderCollection extends React.Component {
  intervalID;

  constructor(props) {
    super(props);
    this.state = {
      folders: null
    };

    PubSub.subscribe('JobsUpdated', this.listen);
  }

  componentDidMount() {
    this.refresh();
    this.intervalID = setInterval(this.refresh.bind(this), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  listen = (msg, data) => {
    switch(msg)
    {
      case "JobsUpdated":
        this.refresh();
        break;
      default:
        break;
    }
  };

  refresh() {
    configureAxios();
    axios.get(`/folders`)
    .then((response) => {
      this.setState({folders: response.data.object});
    });
  }

  render() {
    const { folders } = this.state;

    return (
      <React.Fragment>
        {folders == null ? null : folders.map((item, index) => (
          <Folder key={item.id} name={item.name} expression={item.expression} count={item.job_count} />
        ))}
      </React.Fragment>
    );
  }
}
