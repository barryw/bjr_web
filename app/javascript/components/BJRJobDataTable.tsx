import React from 'react';
import axios from 'axios';
import memoize from 'memoize-one';
import PubSub from 'pubsub-js';

import Modal from 'react-bootstrap/Modal';

import DataTable from 'react-data-table-component';
import IconButton from '@material-ui/core/IconButton';

import Delete from '@material-ui/icons/Delete';
import TimerOff from '@material-ui/icons/TimerOff';
import Timer from '@material-ui/icons/Timer';
import PlaylistPlay from '@material-ui/icons/PlaylistPlay';
import ArrowDownward from '@material-ui/icons/ArrowDownward';

import EditJobCell from './EditJobCell';
import BooleanCell from './BooleanCell';
import TriStateCell from './TriStateCell';
import LastRunCell from './LastRunCell';
import NextRunCell from './NextRunCell';
import DateTimeCell from './DateTimeCell';
import SimpleBackdrop from './SimpleBackdrop';
import BootstrapTooltip from './BootstrapTooltip';
import JobEditorComponent from './JobEditorComponent';
import ConfirmationDialog from './ConfirmationDialog';
import CronDisplayCell from './CronDisplayCell';

import { configureAxios } from './AjaxUtils';
import { setAsyncState } from './ReactUtils';

const deleteAction = memoize(deleteHandler => (
  <BootstrapTooltip key="delete" title={I18n.t('jobs.delete.title')}>
    <IconButton color="secondary" onClick={deleteHandler}>
      <Delete />
    </IconButton>
  </BootstrapTooltip>
));

const enableAction = memoize(enableHandler => (
  <BootstrapTooltip key="enable" title={I18n.t('jobs.enable.title')}>
    <IconButton color="secondary" onClick={enableHandler}>
      <Timer />
    </IconButton>
  </BootstrapTooltip>
));

const disableAction = memoize(disableHandler => (
  <BootstrapTooltip key="disable" title={I18n.t('jobs.disable.title')}>
    <IconButton color="secondary" onClick={disableHandler}>
      <TimerOff />
    </IconButton>
  </BootstrapTooltip>
));

const runAction = memoize(runHandler => (
  <BootstrapTooltip key="run" title={I18n.t('jobs.run.title')}>
    <IconButton color="primary" onClick={runHandler}>
      <PlaylistPlay />
    </IconButton>
  </BootstrapTooltip>
));

const sortIcon = <ArrowDownward />;

const i18n = require("i18n-js");

export default class BJRJobDataTable extends React.Component {
  intervalID;
  token;

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      totalRows: 0,
      perPage: 10,
      page: 1,
      title: props.title,
      selectedRows: [],
      toggleClearedRows: false,
      enablebackdrop: false,
      displayFull: props.full,
      source: props.source,
      pagination: props.pagination,
      search: null,
      showEditModal: false,
      showDeleteModal: false,
      editJob: null
    };

    this.token = PubSub.subscribe('SearchingJobs', this.listen);

    /*
    This is used for the recent and upcoming jobs
    */
    this.columnsMin = [
      { name: I18n.t("common.job_table.name"), selector: 'name' },
      { name: I18n.t("common.job_table.cron"), selector: 'cron', wrap: true, cell: row => <CronDisplayCell cron={row.cron} timezone={row.timezone} /> },
      { name: I18n.t("common.job_table.command"), selector: 'command', wrap: true },
      { name: I18n.t("common.job_table.timezone"), selector: 'timezone' },
      { name: I18n.t("common.job_table.succeeded"), selector: 'success', center: true, width: '50px', cell: row => <BooleanCell boolval={row.success}/> },
      { name: I18n.t("common.job_table.last_run"), selector: 'last_run', cell: row => <LastRunCell row={row}/> },
      { name: I18n.t("common.job_table.next_run"), selector: 'next_run', cell: row => <NextRunCell row={row}/> }
    ];

    /*
    This is used for the full job listing
    */
    this.columnsMax = [
      { selector: 'edit', sortable: false, width: "50px", ignoreRowClick: true, cell: row => <EditJobCell row={row} clickHandler={this.editJob} /> },
      { name: 'ID', selector: 'id', sortable: true, width: "75px" },
      { name: I18n.t("common.job_table.name"), selector: 'name', sortable: true },
      { name: I18n.t("common.job_table.cron"), selector: 'cron', sortable: false, wrap: true, cell: row => <CronDisplayCell cron={row.cron} timezone={row.timezone} /> },
      { name: I18n.t("common.job_table.command"), selector: 'command', sortable: true, wrap: true },
      { name: I18n.t("common.job_table.timezone"), selector: 'timezone', sortable: true },
      { name: I18n.t("common.job_table.succeeded"), selector: 'success', sortable: true, center: true, width: "60px",
        cell: row => <TriStateCell value={row.last_run == '' ? 0 : (row.success ? 1 : -1)}/> },
      { name: I18n.t("common.job_table.enabled"), selector: 'enabled', sortable: true, center: true, width: "60px", cell: row => <BooleanCell boolval={row.enabled}/> },
      { name: I18n.t("common.job_table.running"), selector: 'running', sortable: true, center: true, width: "60px", cell: row => <BooleanCell boolval={row.running}/> },
      { name: I18n.t("common.job_table.last_run"), selector: 'last_run', sortable: true, cell: row => <LastRunCell row={row}/> },
      { name: I18n.t("common.job_table.next_run"), selector: 'next_run', sortable: true, cell: row => <NextRunCell row={row}/> },
      { name: I18n.t("common.job_table.created_at"), selector: 'created_at', sortable: true, cell: row => <DateTimeCell datetime={row.created_at}/> },
      { name: I18n.t("common.job_table.updated_at"), selector: 'updated_at', sortable: true, cell: row => <DateTimeCell datetime={row.updated_at}/> }
    ];
  }

  async componentDidMount() {
    const { perPage, page } = this.state;
    await this.fetchJobData(page, perPage);

    this.intervalID = setInterval(this.refresh.bind(this), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
    PubSub.unsubscribe(this.token);
  }

  listen = (msg, data) => {
    switch(msg)
    {
      case "SearchingJobs":
        this.setState({search: data});
        this.refresh();
        break;
      default:
        break;
    }
  };

  handlePageChange = async page => {
    const { perPage } = this.state;
    await this.fetchJobData(page, perPage);
  }

  handlePerRowsChange = async (perPage: number, page: number) => {
    await this.fetchJobData(page, perPage);
  }

  async refresh() {
    const { perPage, page } = this.state;
    await this.fetchJobData(page, perPage);
    PubSub.publish('JobsUpdated', null);
  }

  async fetchJobData(page: number, perPage: number) {
    configureAxios();
    const { search, source } = this.state;
    const response = await axios.get(
      source, {
        params: {
          page: page,
          per_page: perPage,
          search: search
        }
      }
    );

    this.setState({
      data: response.data.data,
      totalRows: response.data.total,
      perPage: perPage,
      page: page
    })
  };

  handleChange = state => {
    this.setState({ selectedRows: state.selectedRows });
  };

  handleClearRows = () => {
    this.setState({ toggledClearRows: !this.state.toggledClearRows})
  };

  enableAll = () => {
    this.enableDisableAll(1);
  }

  disableAll = () => {
    this.enableDisableAll(0);
  }

  /*
  Run all of the selected job
  */
  runAll = () => {
    const { selectedRows } = this.state;
    const rows = selectedRows.map(r => r.id);

    let requests = [];
    rows.forEach(function(item, index) {
      requests.push(axios.post(`/jobs/${item}/run_now.json`));
    });
    this.executeRequests(requests, I18n.t('jobs.run.success_batch'), I18n.t('jobs.run.failed_batch'));
  }

  /*
  Enable or disable all of the selected jobs
  */
  enableDisableAll = (endis: number) => {
    const { selectedRows } = this.state;
    const rows = selectedRows.map(r => r.id);
    let requests = [];
    rows.forEach(function(item, index) {
      requests.push(axios.patch(`/jobs/${item}.json?job[enabled]=${endis}`));
    });
    this.executeRequests(requests, I18n.t('jobs.update.success_batch'), I18n.t('jobs.update.failed_batch'));
  }

  /*
  Delete the selected jobs. Will pop up a dialog first to confirm
  */
  deleteAll = () => {
    this.setState({showDeleteModal: true});
  }

  cancelDelete = () => {
    this.setState({showDeleteModal: false});
  }

  confirmDelete = () => {
    this.setState({showDeleteModal: false});
    const { selectedRows } = this.state;
    const rows = selectedRows.map(r => r.id);
    let self = this;

    let requests = [];
    rows.forEach(function(item, index) {
      requests.push(axios.delete(`/jobs/${item}`));
    });
    self.executeRequests(requests, I18n.t('jobs.delete.success_batch'), I18n.t('jobs.delete.failed_batch'));
  }

  /*
  Execute a group of requests
  */
  executeRequests = (requests, successMessage, failureMessage) => {
    configureAxios();
    this.backdrop(true);

    Promise.all(requests)
    .then((values) => {
      toastr.success(values.length + ' ' + successMessage);
    })
    .catch((error) => {
      toastr.error(error.length + ' ' + failureMessage);
    })
    .finally(() => {
      this.clearSelectedAndRefresh();
      PubSub.publish('JobsUpdated', true);
      this.backdrop(false);
    })
  }

  /*
  Enable or disable the backdrop for long-running operations
  */
  backdrop(endis: boolean) {
    const { selectedRows } = this.state;
    const rows = selectedRows.map(r => r.id);
    if(rows.length > 10 && endis)
    {
      this.setState({enablebackdrop: true});
    }
    if(!endis)
      this.setState({enablebackdrop: false});
  }

  /*
  Clear the selected items and refresh the table
  */
  clearSelectedAndRefresh() {
    this.setState({ toggledClearRows: !this.state.toggledClearRows})
    this.refresh();
  }

  /*
  When a row is double clicked, open the job edit modal
  */
  editJob = (e) => {
    this.setState({showEditModal: true, editJob: e});
  }

  /*
  Tell the 'edit job' modal to close
  */
  closeEditJob = () => {
    setAsyncState(this, {showEditModal: false})
    .then(() => {
      this.refresh();
    });
  }

  render() {
    const { editJob, showDeleteModal, showEditModal, displayFull, enablebackdrop, title, loading, data, totalRows } = this.state;

    return (
      <div>
        <DataTable
          title={title}
          columns={displayFull ? this.columnsMax : this.columnsMin}
          data={data}
          striped
          highlightOnHover
          selectableRows={displayFull ? true : false}
          sortIcon={sortIcon}
          progressPending={loading}
          pagination={displayFull ? true : false}
          paginationServer
          paginationTotalRows={totalRows}
          onChangeRowsPerPage={this.handlePerRowsChange}
          onChangePage={this.handlePageChange}
          onSelectedRowsChange={this.handleChange}
          onRowDoubleClicked={this.editJob}
          contextActions={[runAction(this.runAll), enableAction(this.enableAll), disableAction(this.disableAll), deleteAction(this.deleteAll)]}
          contextMessage={ {singular: I18n.t('jobs.singular'), plural: I18n.t('jobs.plural'), message: I18n.t('common.selected')} }
          selectableRowDisabled={row => row.running}
          clearSelectedRows={this.state.toggledClearRows}
          paginationRowsPerPageOptions={[10,20,50,100]}
        />
        <Modal show={showDeleteModal} onHide={this.cancelDelete} size="sm" centered>
          <ConfirmationDialog title={I18n.t('jobs.delete.title')} body={I18n.t('jobs.delete.confirm')}
                              cancelText={I18n.t('jobs.delete.cancel_button')} confirmText={I18n.t('jobs.delete.confirm_button')}
                              handleCancel={this.cancelDelete} handleConfirm={this.confirmDelete} />
        </Modal>
        <Modal show={showEditModal} onHide={this.closeEditJob} size="lg" centered>
          <JobEditorComponent job={editJob} onClose={this.closeEditJob}/>
        </Modal>
        <SimpleBackdrop open={enablebackdrop}/>
      </div>
    )
  }
};
