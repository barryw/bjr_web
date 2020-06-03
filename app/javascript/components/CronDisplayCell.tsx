import React from 'react';
import axios from 'axios';
import { configureAxios } from './AjaxUtils';

export default class CronDisplayCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cron: props.cron,
      timezone: props.timezone,
      description: null
    };
  }

  componentDidMount() {
    const { cron, timezone } = this.state;
    configureAxios();
    axios.get(`/parse_cron`, {
      params: {
        cron: cron,
        timezone: timezone
      }
    })
    .then((response) => {
      this.setState({description: response.data.description});
    });
  }

  render() {
    const { description } = this.state;

    return (
      <React.Fragment>
        {description}
      </React.Fragment>
    );
  }
}
