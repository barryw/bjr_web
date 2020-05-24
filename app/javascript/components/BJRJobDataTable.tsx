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

const columns = [
  { selector: 'edit', sortable: false, width: "50px", cell: row => <EditJobCell id={row.id} /> },
  { name: 'ID', selector: 'id', sortable: true, width: "75px" },
  { name: 'Name', selector: 'name', sortable: true },
  { name: 'Cron', selector: 'cron', sortable: false, wrap: true },
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
      toggleClearedRows: false
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
    const response = await axios.get(
      "/job_list", {
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

  runAll = () => {
    const { selectedRows } = this.state;
    const rows = selectedRows.map(r => r.id);
    var self = this;

    let requests = [];
    this.configureAxios();
    rows.forEach(function(item, index) {
      requests.push(axios.post(`/jobs/${item}/run_now.json`));
    });
    Promise.all(requests)
    .then((values) => {
      if(values.length > 10) {
        toastr.success(values.length + ' jobs were scheduled to run now.');
      } else {
        values.forEach(function(item, index) {
          toastr.success(item.data.message);
        });
      }
      self.setState({ toggledClearRows: !this.state.toggledClearRows});
      self.refresh();
    })
    .catch((error) => {
      console.log(error);
    })
  }

  enableDisableAll = (endis: number) => {
    const { selectedRows } = this.state;
    const rows = selectedRows.map(r => r.id);
    var self = this;

    let requests = [];
    this.configureAxios();
    rows.forEach(function(item, index) {
      requests.push(axios.patch(`/jobs/${item}.json?job[enabled]=${endis}`));
    });
    Promise.all(requests)
    .then((values) => {
      if(values.length > 10) {
        toastr.success(values.length + ' jobs were updated successfully.');
      } else {
        values.forEach(function(item, index) {
          toastr.success(item.data.message);
        });
      }
      self.setState({ toggledClearRows: !this.state.toggledClearRows})
      self.refresh();
    })
    .catch((error) => {
      console.log(error);
    });
  }

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
        this.configureAxios();
        rows.forEach(function(item, index) {
          requests.push(axios.delete(`/jobs/${item}`));
        });
        Promise.all(requests)
        .then((values) => {
          toastr.success(values.length + ' jobs wehere deleted successfully.');
          self.setState({ toggledClearRows: !this.state.toggledClearRows})
          self.refresh();
        })
        .catch((error) => {
          console.log(error);
        })
      }
    });
  }

  configureAxios() {
    let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    axios.defaults.headers.common['X-CSRF-Token'] = token
    axios.defaults.headers.common['Accept'] = 'application/json'
  }

  render() {
    const { title, loading, data, totalRows } = this.state;

    return (
      <DataTable
        title={title}
        columns={columns}
        data={data}
        striped
        highlightOnHover
        selectableRows
        sortIcon={sortIcon}
        progressPending={loading}
        pagination
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
    )
  }
};
