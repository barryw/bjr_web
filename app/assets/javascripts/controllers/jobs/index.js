var jobsTable;

/*
Handle interaction with selected items in job table
*/
$(document).ready(function() {
  $('#delete-jobs').click(function(event) {
    Swal.fire({
      title: 'Delete Selected Jobs?',
      text: 'Are you sure you want to delete the selected jobs? This cannot be reversed.',
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete Jobs'
    }).then((result) => {
      if(result.value) {
        deleteSelectedJobs();
      }
    });
    event.preventDefault();
  });
  $('#enable-jobs').click(function(event) {
    enableSelectedJobs();
    event.preventDefault();
  });
  $('#disable-jobs').click(function(event) {
    disableSelectedJobs();
    event.preventDefault();
  });
  $('#toggle-jobs-enable').click(function(event) {
    toggleEnableSelectedJobs();
    event.preventDefault();
  });
  $('#run-jobs').click(function(event) {
    runSelectedJobs();
    event.preventDefault();
  });
});

/*
Common function to gather the list of selected jobs
*/
function getSelectedJobs()
{
  return jobsTable.column(0).checkboxes.selected();
}

/*
Delete any jobs selected in the job table
*/
function deleteSelectedJobs()
{
  $.each(getSelectedJobs(), function(index, rowId) {
    Rails.ajax({
      type: "DELETE",
      url: "/jobs/" + rowId,
      success: function(response) {
        jobsTable.ajax.reload();
        jobsTable.column(0).checkboxes.deselectAll();
        toastr.success('Deleted Job ' + rowId);
      },
      error: function(response) {
        toastr.error(response['message']);
      }
    });
  });
}

/*
Mark all of the selected jobs as 'enabled', regardless of their current status
*/
function enableSelectedJobs()
{

}

/*
Mark all of the selected jobs as 'disabled', regardless of their current status
*/
function disableSelectedJobs()
{

}

/*
Toggle the status of the selected jobs. If they're enabled, disable them, and if
they're disabled, enable them.
*/
function toggleEnableSelectedJobs()
{

}

/*
Trigger a run of all selected jobs
*/
function runSelectedJobs()
{
  $.each(getSelectedJobs(), function(index, rowId) {
    Rails.ajax({
      type: "POST",
      url: "/jobs/" + rowId,
      success: function(response) {
        jobsTable.ajax.reload();
        toastr.success('Deleted Job ' + rowId);
      },
      error: function(response) {
        toastr.error(response['message']);
      }
    });
  });
}

function initJobsIndex()
{
  $.extend( $.fn.dataTable.defaults, {
    searching: true,
    ordering: false,
    paging: true
  });

  initJobTable();
}

/*
Set up the job list DataTable. It uses an AJAX call to fetch the data and does all processing
server-side.
*/
function initJobTable()
{
  jobsTable = $('#jobs').DataTable({
    serverSide: true,
    ajax: {
      url: '/job_list',
      error: function(response) {
        //redirectHomeOnError();
      }
    },
    rowId: 'id',
    columnDefs: [
      { targets: 0, data: 'id', checkboxes: { selectRow: true } }
    ],
    columns: [
      null,
      { data: 'name' },
      { data: 'cron' },
      { data: 'command' },
      { data: 'timezone' },
      { data: 'success' },
      { data: 'enabled' },
      { data: 'running' },
      { data: 'last_run', type: 'date', defaultContent: null },
      { data: 'next_run', type: 'date' },
      { data: 'created_at', type: 'date' },
      { data: 'updated_at', type: 'date' },
      { data: 'success_callback', defaultContent: null },
      { data: 'failure_callback', defaultContent: null },
      { data: 'tags', defaultContent: null }
    ],
    select: { style: 'multi' },
    order: [[1, 'asc']]
  });
}
