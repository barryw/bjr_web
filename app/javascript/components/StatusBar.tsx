import React from 'react';
import axios from 'axios';

import StatusBarWidget from './StatusBarWidget'

export default class StatusBar extends React.Component {
  intervalID;

  constructor(props) {
    super(props);
    this.state = {
      subtitles: props.subtitles,
      enabled_jobs: 0,
      total_jobs: 0,
      run_jobs: 0,
      failed_jobs: 0,
      avg_job_runtime: 0.0
    };
  }

  async componentDidMount() {
    this.refresh();
    this.intervalID = setInterval(this.refresh.bind(this), 60000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  async refresh() {
    this.configureAxios();
    const response = await axios.get("/todays_stats.json");

    this.setState({
      enabled_jobs: response.data['enabled_jobs'],
      total_jobs: response.data['total_jobs'],
      run_jobs: response.data['run_jobs'],
      failed_jobs: response.data['failed_jobs'],
      avg_job_runtime: response.data['avg_job_runtime']
    });
  }

  configureAxios() {
    let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    axios.defaults.headers.common['X-CSRF-Token'] = token
    axios.defaults.headers.common['Accept'] = 'application/json'
  }

  render() {
    return (
      <div className="row">
        <StatusBarWidget icon="clock" gradient="gradient-3" value={`${this.state.enabled_jobs} / ${this.state.total_jobs}`} subtitle={this.state.subtitles[0]} />
        <StatusBarWidget icon="like" gradient="gradient-4" value={this.state.run_jobs} subtitle={this.state.subtitles[1]} />
        <StatusBarWidget icon="dislike" gradient="gradient-green" value={this.state.failed_jobs} subtitle={this.state.subtitles[2]} />
        <StatusBarWidget icon="speedometer" gradient="gradient-red" value={`${this.state.avg_job_runtime.toFixed(2)} seconds`} subtitle={this.state.subtitles[3]} />
      </div>
    )
  }
}
