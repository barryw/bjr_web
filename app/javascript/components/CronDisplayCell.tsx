import React from 'react';
import axios from 'axios';
import { configureAxios } from './AjaxUtils';
import { setAsyncState } from './ReactUtils';

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
    this.refresh();
  }

  componentDidUpdate(prevProps, prevState)
  {
    if(prevProps.cron != this.props.cron || prevProps.timezone != this.props.timezone)
    {
      setAsyncState(this, {cron: this.props.cron, timezone: this.props.timezone})
      .then(() => {
        this.refresh();
      });
    }
  }

  refresh = () => {
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
