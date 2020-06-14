import React from 'react';
import axios from 'axios';

import { configureAxios } from './AjaxUtils';

import DashboardChart from './DashboardChart';

export default class DashboardChartCollection extends React.Component {
  intervalID;

  constructor(props) {
    super(props);
    this.state = {
      minuteStats: {labels: [], datasets: []},
      minuteStatsOptions: {},
      hourStats: {labels: [], datasets: []},
      hourStatsOptions: {},
      dayStats: {labels: [], datasets: []},
      dayStatsOptions: {},
      weekStats: {labels: [], datasets: []},
      weekStatusOptions: {},
      minuteRuns: {labels: [], datasets: []},
      minuteRunsStats: {},
      hourRuns: {labels: [], datasets: []},
      hourRunsStatus: {},
      dayRuns: {labels: [], datasets: []},
      dayRunsStats: {},
      weekRuns: {labels: [], datasets: []},
      weekRunsStats: {}
    };
  }

  componentDidMount() {
    this.refresh();
    this.intervalID = setInterval(this.refresh.bind(this), 60000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  refresh() {
    configureAxios();
    axios.get(`/job_stats.json`)
    .then((response) => {
      this.setState({ minuteStats: {labels: response.data.minute.labels, datasets: response.data.minute.runtimes.datasets},
                      minuteStatsOptions: response.data.minute.runtimes.options,

                      minuteRuns: {labels: response.data.minute.labels, datasets: response.data.minute.runs.datasets},
                      minuteRunsOptions: response.data.minute.runs.options,

                      hourStats: {labels: response.data.hour.labels, datasets: response.data.hour.runtimes.datasets},
                      hourStatsOptions: response.data.hour.runtimes.options,

                      hourRuns: {labels: response.data.hour.labels, datasets: response.data.hour.runs.datasets},
                      hourRunsOptions: response.data.hour.runs.options,

                      dayStats: {labels: response.data.day.labels, datasets: response.data.day.runtimes.datasets},
                      dayStatsOptions: response.data.day.runtimes.options,

                      dayRuns: {labels: response.data.day.labels, datasets: response.data.day.runs.datasets},
                      dayRunsOptions: response.data.day.runs.options,

                      weekStats: {labels: response.data.week.labels, datasets: response.data.week.runtimes.datasets},
                      weekStatsOptions: response.data.week.runtimes.options,

                      weekRuns: {labels: response.data.week.labels, datasets: response.data.week.runs.datasets},
                      weekRunsOptions: response.data.week.runs.options });

    });
  }

  render() {
    const { minuteStats, hourStats, dayStats, weekStats, minuteRuns, hourRuns, dayRuns, weekRuns,
            minuteStatsOptions, hourStatsOptions, dayStatsOptions, weekStatsOptions, minuteRunsOptions,
            hourRunsOptions, dayRunsOptions, weekRunsOptions } = this.state;

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-lg-3">
            <div className="card">
              <div className="card-body">
                <DashboardChart data={minuteStats} options={minuteStatsOptions} width="250" height="120" />
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card">
              <div className="card-body">
                <DashboardChart data={hourStats} options={hourStatsOptions} width="250" height="120" />
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card">
              <div className="card-body">
                <DashboardChart data={dayStats} options={dayStatsOptions} width="250" height="120" />
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card">
              <div className="card-body">
                <DashboardChart data={weekStats} options={weekStatsOptions} width="250" height="120" />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3">
            <div className="card">
              <div className="card-body">
                <DashboardChart data={minuteRuns} options={minuteRunsOptions} width="250" height="120" />
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card">
              <div className="card-body">
                <DashboardChart data={hourRuns} options={hourRunsOptions} width="250" height="120" />
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card">
              <div className="card-body">
                <DashboardChart data={dayRuns} options={dayRunsOptions} width="250" height="120" />
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card">
              <div className="card-body">
                <DashboardChart data={weekRuns} options={weekRunsOptions} width="250" height="120" />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
