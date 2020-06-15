import React from 'react';
import axios from 'axios';

import StatusBarWidget from './StatusBarWidget'
import { configureAxios } from './AjaxUtils';

const improving = 'gradient-improving';
const degrading = 'gradient-degrading';
const normal = 'gradient-normal';

export default class StatusBar extends React.Component {
  intervalID;

  constructor(props) {
    super(props);
    this.state = {
      enabled_jobs: 0,
      total_jobs: 0,
      total_jobs_trend: 0,
      run_jobs: 0,
      failed_jobs: 0,
      failed_jobs_trend: 0,
      avg_job_runtime: 0.0,
      avg_job_runtime_trend: 0.0,
      min_job_runtime: 0.0,
      max_job_runtime: 0.0,
      avg_job_lag: 0.0,
      avg_job_lag_trend: 0.0,
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
      failed_jobs_trend: response.data['failed_jobs_trend'],
      avg_job_runtime: response.data['avg_job_runtime'],
      avg_job_runtime_trend: response.data['avg_job_runtime_trend'],
      min_job_runtime: response.data['min_job_runtime'],
      max_job_runtime: response.data['max_job_runtime'],
      avg_job_lag: response.data['avg_job_lag'],
      avg_job_lag_trend: response.data['avg_job_lag_trend'],
      min_job_lag: response.data['min_job_lag'],
      max_job_lag: response.data['max_job_lag']
    });
  }

  getBackgroundColor = (value) => {
    if(value > 0.001)
      return degrading;
    if(value <= 0.001 && value > -0.001)
      return normal;
    return improving;
  }

  render() {
    const { enabled_jobs, total_jobs, failed_jobs, run_jobs, min_job_lag, max_job_lag, avg_job_lag,
            min_job_runtime, max_job_runtime, avg_job_runtime, failed_jobs_trend, avg_job_runtime_trend,
            avg_job_lag_trend, total_jobs_trend } = this.state;

    const failPct = run_jobs == 0 ? 0.0 : (failed_jobs / run_jobs * 100).toFixed(2);
    const job_count = `${enabled_jobs} / ${total_jobs}`;
    const job_runs = `${failed_jobs} / ${run_jobs} (${failPct}% failure)`;
    const job_lag = `${min_job_lag}s / ${max_job_lag}s / ${avg_job_lag.toFixed(2)}s`;
    const runtimes = `${min_job_runtime.toFixed(2)}s / ${max_job_runtime.toFixed(2)}s / ${avg_job_runtime.toFixed(2)}s`;

    const failedJobsColor = this.getBackgroundColor(failed_jobs_trend);
    const jobRuntimeColor = this.getBackgroundColor(avg_job_runtime_trend);
    const jobLagColor = this.getBackgroundColor(avg_job_lag_trend);

    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">{I18n.t('home.new.todays_stats')}</h4>
              <h6 className="card-subtitle mb-2 text-muted">{I18n.t('home.new.todays_stats_sub')}</h6>
              <div className="row">
                <StatusBarWidget trend={total_jobs_trend} icon="clock" gradient="gradient-4" value={job_count} subtitle={this.props.subtitles[0]} tooltip={this.props.tooltips[0]} />
                <StatusBarWidget trend={failed_jobs_trend} icon="control-play" gradient={failedJobsColor} value={job_runs} subtitle={this.props.subtitles[1]} tooltip={this.props.tooltips[1]} />
                <StatusBarWidget trend={avg_job_lag_trend} icon="hourglass" gradient={jobLagColor} value={job_lag} subtitle={this.props.subtitles[2]} tooltip={this.props.tooltips[2]} />
                <StatusBarWidget trend={avg_job_runtime_trend} icon="speedometer" gradient={jobRuntimeColor} value={runtimes} subtitle={this.props.subtitles[3]} tooltip={this.props.tooltips[3]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
