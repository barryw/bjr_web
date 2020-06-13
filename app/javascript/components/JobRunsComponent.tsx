import React from 'react';
import axios from 'axios';
import PubSub from 'pubsub-js';

import DataTable from 'react-data-table-component';
import { differenceInSeconds, parseISO } from 'date-fns';

import BooleanCell from './BooleanCell';
import TriStateCell from './TriStateCell';
import DateTimeCell from './DateTimeCell';
import { configureAxios } from './AjaxUtils';

export default class JobRunsComponent extends React.Component {
  refreshToken;

  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      runs: [],
      title: I18n.t('runs.title', {name: props.data.name, id: props.data.id}),
      totalRows: 0,
      perPage: 10,
      page: 1
    };

    this.columns = [
      { name: I18n.t('common.runs_table.start_time'), sortable: true, selector: 'start_time', cell: row => <DateTimeCell date={row.start_time}/> },
      { name: I18n.t('common.runs_table.scheduled_start_time'), sortable: true, selector: 'scheduled_start_time',
        cell: row => <DateTimeCell date={row.scheduled_start_time} emptyVal={I18n.t('runs.manually_triggered')} /> },
      { name: I18n.t('common.runs_table.end_time'), sortable: true, selector: 'end_time', cell: row => <DateTimeCell date={row.end_time}/> },
      { name: I18n.t('common.runs_table.duration'), sortable: true, cell: row => row.end_time == null ? <div className="spinner-border spinner-border-sm"></div> : <div>{differenceInSeconds(parseISO(row.end_time), parseISO(row.start_time))} s</div> },
      { name: I18n.t('common.runs_table.job_lag'), sortable: true, selector: 'schedule_diff_in_seconds', cell: row => <div>{row.is_manual ? '-' : row.schedule_diff_in_seconds} s</div> },
      { name: I18n.t('common.runs_table.triggered_manually'), selector: 'is_manual', center: true, cell: row => <BooleanCell boolval={row.is_manual}/> },
      { name: I18n.t('common.runs_table.return_code'), selector: 'return_code' },
      { name: I18n.t('common.runs_table.success'), selector: 'success', center: true, cell: row => <TriStateCell value={row.end_time == null ? 0 : (row.success ? 1 : -1)}/> },
      { name: I18n.t('common.runs_table.error_message'), selector: 'error_message' }
    ];
  }

  async componentDidMount() {
    this.refreshToken = PubSub.subscribe('JobsUpdated', this.listen);
    const { page, perPage } = this.state;
    await this.fetchRunData(page, perPage);
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.refreshToken);
  }

  listen = (msg, data) => {
    switch(msg)
    {
      case "JobsUpdated":
        this.refresh();
      default:
        break;
    }
  };

  async refresh() {
    const { perPage, page } = this.state;
    await this.fetchRunData(page, perPage);
  }

  async fetchRunData(page: number, perPage: number) {
    const { data } = this.state;
    configureAxios();
    let response = await axios.get(`/jobs/${data.id}/runs`, {
        params: {
          page: page,
          per_page: perPage
        }
      });
    this.setState({runs: response.data.data, totalRows: response.data.total});
  }

  handlePageChange = async page => {
    this.setState({page: page});
    const { perPage } = this.state;
    await this.fetchRunData(page, perPage);
  }

  handlePerRowsChange = async (perPage: number, page: number) => {
    this.setState({page: page, perPage: perPage});
    await this.fetchRunData(page, perPage);
  }

  render() {
    const { runs, title, totalRows } = this.state;

    return (
      <React.Fragment>
        <DataTable
          title={title}
          columns={this.columns}
          data={runs}
          striped
          highlightOnHover
          pagination={true}
          paginationServer
          paginationTotalRows={totalRows}
          onChangeRowsPerPage={this.handlePerRowsChange}
          onChangePage={this.handlePageChange}
          noDataComponent={<div>{I18n.t('jobs.no_job_runs')}</div>}
        />
      </React.Fragment>
    );
  }
}
