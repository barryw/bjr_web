import React from 'react';
import axios from 'axios';

import StatusBarWidget from './StatusBarWidget'
import { configureAxios } from './AjaxUtils';

export default class StatusBar extends React.Component {
  intervalID;

  constructor(props) {
    super(props);
    this.state = {
      enabled_jobs: 0,
      total_jobs: 0,
      run_jobs: 0,
      failed_jobs: 0,
      avg_job_runtime: 0.0,
      min_job_runtime: 0.0,
      max_job_runtime: 0.0,
      avg_job_lag: 0.0,
      min_job_lag: 0.0,
      max_job_lag: 0.0
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
    configureAxios();
    const response = await axios.get("/todays_stats.json");

    this.setState({
      enabled_jobs: response.data['enabled_jobs'],
      total_jobs: response.data['total_jobs'],
      run_jobs: response.data['run_jobs'],
      failed_jobs: response.data['failed_jobs'],
      avg_job_runtime: response.data['avg_job_runtime'],
      min_job_runtime: response.data['min_job_runtime'],
      max_job_runtime: response.data['max_job_runtime'],
      avg_job_lag: response.data['avg_job_lag'],
      min_job_lag: response.data['min_job_lag'],
      max_job_lag: response.data['max_job_lag']
    });
  }

  render() {
    const job_count = `${this.state.enabled_jobs} / ${this.state.total_jobs}`;
    const job_runs = `${this.state.failed_jobs} / ${this.state.run_jobs} (${(this.state.failed_jobs / this.state.run_jobs * 100).toFixed(2)}% failure)`;
    const job_lag = `${this.state.min_job_lag}s / ${this.state.max_job_lag}s / ${this.state.avg_job_lag.toFixed(2)}s`;
    const runtimes = `${this.state.min_job_runtime.toFixed(2)}s / ${this.state.max_job_runtime.toFixed(2)}s / ${this.state.avg_job_runtime.toFixed(2)}s`;

    return (
      <div className="row">
        <StatusBarWidget icon="clock" gradient="gradient-3" value={job_count} subtitle={this.props.subtitles[0]} tooltip={this.props.tooltips[0]} />
        <StatusBarWidget icon="control-play" gradient="gradient-4" value={job_runs} subtitle={this.props.subtitles[1]} tooltip={this.props.tooltips[1]} />
        <StatusBarWidget icon="hourglass" gradient="gradient-green" value={job_lag} subtitle={this.props.subtitles[2]} tooltip={this.props.tooltips[2]} />
        <StatusBarWidget icon="speedometer" gradient="gradient-red" value={runtimes} subtitle={this.props.subtitles[3]} tooltip={this.props.tooltips[3]} />
      </div>
    )
  }
}
