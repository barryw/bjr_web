import DataTable from 'react-data-table-component';
import Checkbox from '@mataerial-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import memoize from 'memoize-one';
import differenceBy from 'lodash/differenceBy';

import EditJobCell from './EditJobCell';

import React from 'react';
import axios from 'axios';

const contextActions = memoize(deleteHandler => (
  <IconButton color="secondary" onClick={deleteHandler}>
    <Delete />
  </IconButton>
));

const sortIcon = <ArrowDownward />;

const columns = [
  { selector: 'edit', sortable: false, width: "50px", cell: row => <EditJobCell id={row.id} /> },
  { name: 'ID', selector: 'id', sortable: true, width: "75px" },
  { name: 'Name', selector: 'name', sortable: true },
  { name: 'Cron', selector: 'cron', sortable: false, wrap: true },
  { name: 'Command', selector: 'command', sortable: true, wrap: true },
  { name: 'Timezone', selector: 'timezone', sortable: true },
  { name: 'Success', selector: 'success', sortable: true, center: true, width: "50px",
    cell: row => <span className="card-widget__icon2"><i className={`icon-${row.success ? 'check' : 'close'} text-${row.success ? 'success' : 'danger'}`}></i></span>
  },
  { name: 'Enabled', selector: 'enabled', sortable: true, center: true, width: "50px",
    cell: row => <span className="card-widget__icon2"><i className={`icon-${row.enabled ? 'check' : 'close'} text-${row.enabled ? 'success' : 'danger'}`}></i></span>
  },
  { name: 'Running', selector: 'running', sortable: true, center: true, width: "50px",
    cell: row => <span className="card-widget__icon2"><i className={`icon-${row.running ? 'check' : 'close'} text-${row.running ? 'success' : 'danger'}`}></i></span>
  },
  { name: 'Last Run', selector: 'last_run', sortable: true },
  { name: 'Next Run', selector: 'next_run', sortable: true,
    cell: row => row.running ? <div className="spinner-border spinner-border-sm"></div> : row.next_run
  },
  { name: 'Created', selector: 'created_at', sortable: true },
  { name: 'Updated', selector: 'updated_at', sortable: true }
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
      toggleCleared: false
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

  handlePerRowsChange = async (perPage, page) => {
    await this.fetchJobData(page, perPage);
  }

  refresh() {
    const { perPage, page } = this.state;
    this.fetchJobData(page, perPage);
  }

  async fetchJobData(page, perPage) {
    let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    axios.defaults.headers.common['X-CSRF-Token'] = token
    axios.defaults.headers.common['Accept'] = 'application/json'

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
  }

  handleChange = state => {
    this.setState({ selectedRows: state.selectedRows });
  };

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
        rows.forEach(function(item, index) {
          const response = axios.delete(`/jobs/${item}`)
          .then(function(response) {
            toastr.success('Deleted Job ' + item);
            self.setState(state => ({ toggleCleared: !state.toggleCleared, data: differenceBy(state.data, state.selectedRows, 'id') }));
            self.refresh();
          })
          .catch(function(error) {
            toastr.error('Failed to delete job ' + item + ':' + error);
          });
        });
      }
    });
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
        contextActions={contextActions(this.deleteAll)}
        contextMessage={{singular: 'job', plural: 'jobs', message: 'selected'}}
        selectableRowDisabled={row => row.running}
        paginationRowsPerPageOptions={[10,20,50,100]}
      />
    )
  }
};
