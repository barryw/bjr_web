class HomeController < ApplicationController
  include HomeHelper

  def new
  end

  def recent_jobs
    api = ApiClient.new
    recent_jobs = api.recent_jobs(session[:token], 5).object

    render json: recent_jobs
  end

  def upcoming_jobs
    api = ApiClient.new
    upcoming_jobs = api.upcoming_jobs(session[:token], 5).object

    render json: upcoming_jobs
  end

  def job_stats
    api = ApiClient.new
    minute = api.stats_by_minute(session[:token]).object
    hour = api.stats_by_hour(session[:token]).object
    day = api.stats_by_day(session[:token]).object
    week = api.stats_by_week(session[:token]).object

    data = {
      minute: {
        labels: stats_labels(minute),
        runtimes: {
          options: chart_options('Job Runtimes by Minute', 'Time', 'Seconds'),
          datasets: runtime_datasets(minute)
        },
        runs: {
          options: chart_options('Job Runs by Minute', 'Time', 'Job Runs'),
          datasets: run_datasets(minute)
        }
      },
      hour: {
        labels: stats_labels(hour),
        runtimes: {
          options: chart_options('Job Runtimes by Hour', 'Time', 'Seconds'),
          datasets: runtime_datasets(hour)
        },
        runs: {
          options: chart_options('Job Runs by Hour', 'Time', 'Job Runs'),
          datasets: run_datasets(hour)
        }
      },
      day: {
        labels: stats_labels(day),
        runtimes: {
          options: chart_options('Job Runtimes by Day', 'Time', 'Seconds'),
          datasets: runtime_datasets(day)
        },
        runs: {
          options: chart_options('Job Runs by Day', 'Time', 'Job Runs'),
          datasets: run_datasets(day)
        }
      },
      week: {
        labels: stats_labels(week),
        runtimes: {
          options: chart_options('Job Runtimes by Week', 'Time', 'Seconds'),
          datasets: runtime_datasets(week)
        },
        runs: {
          options: chart_options('Job Runs by Week', 'Time', 'Job Runs'),
          datasets: run_datasets(week)
        }
      }
    }

    render json: data
  end
end
