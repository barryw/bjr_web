import DataTable from 'react-data-table-component';
import Checkbox from '@mataerial-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/ToolTip';
import Zoom from '@material-ui/core/Zoom';
import Delete from '@material-ui/icons/Delete';
import TimerOff from '@material-ui/icons/TimerOff';
import Timer from '@material-ui/icons/Timer';
import PlaylistPlay from '@material-ui/icons/PlaylistPlay';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import { formatDistanceToNow } from 'date-fns';
import differenceBy from 'lodash/differenceBy';
import memoize from 'memoize-one';

import EditJobCell from './EditJobCell';
import BooleanCell from './BooleanCell';
import LastRunCell from './LastRunCell';
import NextRunCell from './NextRunCell';
import DateTimeCell from './DateTimeCell';
import SimpleBackdrop from './SimpleBackdrop';

import React from 'react';
import axios from 'axios';

const deleteAction = memoize(deleteHandler => (
  <Tooltip key="delete" TransitionComponent={Zoom} title="Delete selected jobs">
    <IconButton color="secondary" onClick={deleteHandler}>
      <Delete />
    </IconButton>
  </Tooltip>
));

const enableAction = memoize(enableHandler => (
  <Tooltip key="enable" TransitionComponent={Zoom} title="Enable selected jobs">
    <IconButton color="secondary" onClick={enableHandler}>
      <Timer />
    </IconButton>
  </Tooltip>
));

const disableAction = memoize(disableHandler => (
  <Tooltip key="disable" TransitionComponent={Zoom} title="Disable selected jobs">
    <IconButton color="secondary" onClick={disableHandler}>
      <TimerOff />
    </IconButton>
  </Tooltip>
));

const runAction = memoize(runHandler => (
  <Tooltip key="run" TransitionComponent={Zoom} title="Run selected jobs now">
    <IconButton color="primary" onClick={runHandler}>
      <PlaylistPlay />
    </IconButton>
  </Tooltip>
));

const sortIcon = <ArrowDownward />;

/*
This is used for the recent and upcoming jobs
*/
const columnsMin = [
  { name: 'Name', selector: 'name' },
  { name: 'Schedule', selector: 'cron' },
  { name: 'Command', selector: 'command', wrap: true },
  { name: 'Timezone', selector: 'timezone' },
  { name: 'Success', selector: 'success', center: true, width: '50px', cell: row => <BooleanCell boolval={row.success}/> },
  { name: 'Last Run', selector: 'last_run', cell: row => <LastRunCell row={row}/> },
  { name: 'Next Run', selector: 'next_run', cell: row => <NextRunCell row={row}/> }
];

/*
This is used for the full job listing
*/
const columnsMax = [
  { selector: 'edit', sortable: false, width: "50px", cell: row => <EditJobCell id={row.id} /> },
  { name: 'ID', selector: 'id', sortable: true, width: "75px" },
  { name: 'Name', selector: 'name', sortable: true },
  { name: 'Schedule', selector: 'cron', sortable: false, wrap: true },
  { name: 'Command', selector: 'command', sortable: true, wrap: true },
  { name: 'Timezone', selector: 'timezone', sortable: true },
  { name: 'Success', selector: 'success', sortable: true, center: true, width: "50px", cell: row => <BooleanCell boolval={row.success}/> },
  { name: 'Enabled', selector: 'enabled', sortable: true, center: true, width: "50px", cell: row => <BooleanCell boolval={row.enabled}/> },
  { name: 'Running', selector: 'running', sortable: true, center: true, width: "50px", cell: row => <BooleanCell boolval={row.running}/> },
  { name: 'Last Run', selector: 'last_run', sortable: true, cell: row => <LastRunCell row={row}/> },
  { name: 'Next Run', selector: 'next_run', sortable: true, cell: row => <NextRunCell row={row}/> },
  { name: 'Created', selector: 'created_at', sortable: true, cell: row => <DateTimeCell datetime={row.created_at}/> },
  { name: 'Updated', selector: 'updated_at', sortable: true, cell: row => <DateTimeCell datetime={row.updated_at}/> }
];

export default class BJRJobDataTable extends React.Component {
  intervalID;

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
      pagination: props.pagination
    };
  }

  async componentDidMount() {
    const { perPage, page } = this.state;
    await this.fetchJobData(page, perPage);

    this.intervalID = setInterval(this.refresh.bind(this), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  handlePageChange = async page => {
    const { perPage } = this.state;
    await this.fetchJobData(page, perPage);
  }

  handlePerRowsChange = async (perPage: number, page: number) => {
    await this.fetchJobData(page, perPage);
  }

  refresh() {
    const { perPage, page } = this.state;
    this.fetchJobData(page, perPage);
  }

  async fetchJobData(page: number, perPage: number) {
    this.configureAxios();
    const { source } = this.state;
    const response = await axios.get(
      source, {
        params: {
          page: page,
          per_page: perPage
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
    this.executeRequests(requests, 'jobs were updated successfully', 'jobs failed to be updated');
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
    this.executeRequests(requests, 'jobs were updated successfully', 'jobs failed to be updated');
  }

  /*
  Delete the selected jobs. Will pop up a dialog first to confirm
  */
  deleteAll = () => {
    const { selectedRows } = this.state;
    const rows = selectedRows.map(r => r.id);
    var self = this;

    Swal.fire({
      title: 'Delete Selected Jobs?',
      text: 'Are you sure you want to delete the selected jobs? This cannot be reversed.',
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete Jobs'
    }).then((result) => {
      if(result.value) {
        let requests = [];
        rows.forEach(function(item, index) {
          requests.push(axios.delete(`/jobs/${item}`));
        });
        self.executeRequests(requests, 'jobs were deleted successfully', 'jobs failed to be deleted');
      }
    });
  }

  /*
  Execute a group of requests
  */
  executeRequests = (requests, successMessage, failureMessage) => {
    this.configureAxios();
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
  Configure Axios to pass along our CSRF token
  */
  configureAxios() {
    let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    axios.defaults.headers.common['X-CSRF-Token'] = token
    axios.defaults.headers.common['Accept'] = 'application/json'
  }

  render() {
    const { displayFull, enablebackdrop, title, loading, data, totalRows } = this.state;

    return (
      <div>
        <SimpleBackdrop open={enablebackdrop}/>
        <DataTable
          title={title}
          columns={displayFull ? columnsMax : columnsMin}
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
          contextActions={[runAction(this.runAll), enableAction(this.enableAll), disableAction(this.disableAll), deleteAction(this.deleteAll)]}
          contextMessage={ {singular: 'job', plural: 'jobs', message: 'selected'} }
          selectableRowDisabled={row => row.running}
          clearSelectedRows={this.state.toggledClearRows}
          paginationRowsPerPageOptions={[10,20,50,100]}
        />
      </div>
    )
  }
};
