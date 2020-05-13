var runtimesByMinuteChart;
var runsByMinuteChart;

var runtimesByHourChart;
var runsByHourChart;

var runtimesByDayChart;
var runsByDayChart;

var runtimesByWeekChart;
var runsByWeekChart;

var upcomingTable;
var recentTable;

function initHomeNew()
{
  $.extend( $.fn.dataTable.defaults, {
    searching: false,
    ordering: false,
    paging: false
  });

  initCharts();
  updateCharts();
  initJobTables();

  setInterval(() => {
    updateJobTables();
  }, 10000);

  setInterval(() => {
    updateCharts();
  }, 60000);
}

function initJobTables()
{
  upcomingTable = $('#upcoming_jobs').DataTable({
    ajax: {
      url: '/upcoming_jobs',
      dataSrc: '',
      error: function(response) {
        redirectHomeOnError();
      }
    },
    columns: [
      {data: 'name'},
      {data: 'cron'},
      {data: 'command'},
      {data: 'timezone'},
      {data: 'success'},
      {data: 'last_run'},
      {data: 'next_run'}
    ]
  });
  recentTable = $('#recent_jobs').DataTable({
    ajax: {
      url: '/recent_jobs',
      dataSrc: '',
      error: function(response) {
        redirectHomeOnError();
      }
    },
    columns: [
      {data: 'name'},
      {data: 'cron'},
      {data: 'command'},
      {data: 'timezone'},
      {data: 'success'},
      {data: 'last_run', defaultContent: null},
      {data: 'next_run'}
    ]
  });
}

function updateJobTables()
{
  upcomingTable.ajax.reload();
  recentTable.ajax.reload();
}

function initCharts()
{
  var ctx = document.getElementById("minute-stats");
  ctx.height = 120;
  runtimesByMinuteChart = new Chart(ctx, {
      type: 'line',
      data: { },
      options: { }
  });

  var ctx = document.getElementById("minute-runs");
  ctx.height = 120;
  runsByMinuteChart = new Chart(ctx, {
      type: 'line',
      data: { },
      options: { }
  });

  var ctx = document.getElementById("hour-stats");
  ctx.height = 120;
  runtimesByHourChart = new Chart(ctx, {
      type: 'line',
      data: { },
      options: { }
  });

  var ctx = document.getElementById("hour-runs");
  ctx.height = 120;
  runsByHourChart = new Chart(ctx, {
      type: 'line',
      data: { },
      options: { }
  });

  var ctx = document.getElementById("day-stats");
  ctx.height = 120;
  runtimesByDayChart = new Chart(ctx, {
      type: 'line',
      data: { },
      options: { }
  });

  var ctx = document.getElementById("day-runs");
  ctx.height = 120;
  runsByDayChart = new Chart(ctx, {
      type: 'line',
      data: { },
      options: { }
  });

  var ctx = document.getElementById("week-stats");
  ctx.height = 120;
  runtimesByWeekChart = new Chart(ctx, {
      type: 'line',
      data: { },
      options: { }
  });

  var ctx = document.getElementById("week-runs");
  ctx.height = 120;
  runsByWeekChart = new Chart(ctx, {
      type: 'line',
      data: { },
      options: { }
  });
}

function updateCharts()
{
  Rails.ajax({
    type: "GET",
    url: "/todays_stats",
    success: function(response) {
      var jobsEnabled = document.getElementById("jobsEnabled");
      jobsEnabled.innerText = response['enabled_jobs'] + ' / ' + response['total_jobs'];
      var jobsRan = document.getElementById("jobsRan");
      jobsRan.innerText = response['run_jobs'];
      var jobsFailed = document.getElementById("jobsFailed");
      jobsFailed.innerText = response['failed_jobs'];
      var avgRuntime = document.getElementById("avgRuntime");
      avgRuntime.innerText = response['avg_job_runtime'].toFixed(3) + ' seconds';
    },
    error: function(response) {
      redirectHomeOnError();
    }
  });

  Rails.ajax({
    type: "GET",
    url: "/job_stats",
    success: function(response) {
      runtimesByMinuteChart.data.labels = response['minute']['labels'];
      runtimesByMinuteChart.data.datasets = response['minute']['runtimes']['datasets'];
      runtimesByMinuteChart.options = response['minute']['runtimes']['options'];
      runtimesByMinuteChart.update(0);

      runsByMinuteChart.data.labels = response['minute']['labels'];
      runsByMinuteChart.data.datasets = response['minute']['runs']['datasets'];
      runsByMinuteChart.options = response['minute']['runs']['options'];
      runsByMinuteChart.update(0);

      runtimesByHourChart.data.labels = response['hour']['labels'];
      runtimesByHourChart.data.datasets = response['hour']['runtimes']['datasets'];
      runtimesByHourChart.options = response['hour']['runtimes']['options'];
      runtimesByHourChart.update(0);

      runsByHourChart.data.labels = response['hour']['labels'];
      runsByHourChart.data.datasets = response['hour']['runs']['datasets'];
      runsByHourChart.options = response['hour']['runs']['options'];
      runsByHourChart.update(0);

      runtimesByDayChart.data.labels = response['day']['labels'];
      runtimesByDayChart.data.datasets = response['day']['runtimes']['datasets'];
      runtimesByDayChart.options = response['day']['runtimes']['options'];
      runtimesByDayChart.update(0);

      runsByDayChart.data.labels = response['day']['labels'];
      runsByDayChart.data.datasets = response['day']['runs']['datasets'];
      runsByDayChart.options = response['day']['runs']['options'];
      runsByDayChart.update(0);

      runtimesByWeekChart.data.labels = response['week']['labels'];
      runtimesByWeekChart.data.datasets = response['week']['runtimes']['datasets'];
      runtimesByWeekChart.options = response['week']['runtimes']['options'];
      runtimesByWeekChart.update(0);

      runsByWeekChart.data.labels = response['week']['labels'];
      runsByWeekChart.data.datasets = response['week']['runs']['datasets'];
      runsByWeekChart.options = response['week']['runs']['options'];
      runsByWeekChart.update(0);
    },
    error: function(response) {
      redirectHomeOnError();
    }
  });
}
