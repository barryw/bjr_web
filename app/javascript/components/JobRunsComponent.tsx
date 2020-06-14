import React from 'react';
import axios from 'axios';
import PubSub from 'pubsub-js';

import Modal from 'react-bootstrap/Modal';

import DataTable from 'react-data-table-component';
import { differenceInSeconds, parseISO } from 'date-fns';

import { configureAxios } from './AjaxUtils';

import BooleanCell from './cells/BooleanCell';
import TriStateCell from './cells/TriStateCell';
import DateTimeCell from './cells/DateTimeCell';
import EditCell from './cells/EditCell';

import ViewRunComponent from './ViewRunComponent';

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
      page: 1,
      showViewModal: false,
      viewRun: null
    };

    this.columns = [
      { sortable: false, width: "50px", ignoreRowClick: true, cell: row => <EditCell row={row} icon="icon-magnifier" tooltip={I18n.t('runs.tooltips.view_run')} clickHandler={this.viewRun} /> },
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

  /*
  Pop up the modal to show the job run details, which includes STDOUT and STDERR
  */
  viewRun = (e) => {
    this.setState({viewRun: e, showViewModal: true});
  }

  /*
  Close the "view run details" modal
  */
  closeViewRun = () => {
    this.setState({showViewModal: false});
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
    const { runs, title, totalRows, showViewModal, viewRun } = this.state;

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
          onRowDoubleClicked={this.viewRun}
          noDataComponent={<div>{I18n.t('jobs.no_job_runs')}</div>}
        />
        <Modal show={showViewModal} onHide={this.closeViewRun} size="lg" centered>
          <ViewRunComponent title={I18n.t('runs.run_title')} run={viewRun} onClose={this.closeViewRun} cancelButton={I18n.t('common.close')}/>
        </Modal>
      </React.Fragment>
    );
  }
}
