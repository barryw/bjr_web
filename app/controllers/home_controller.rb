class HomeController < ApplicationController
  include HomeHelper
  include ApplicationHelper
  include JobsHelper

  def new
    @today_stats_subtitles = [t('.today_jobs'), t('.today_job_runs'), t('.today_job_lag'), t('.today_runtimes')]
    @today_stats_tooltips = [t('.today_jobs_tooltip'), t('.today_job_runs_tooltip'), t('.today_job_lag_tooltip'), t('.today_runtimes_tooltip')]
  end

  #
  # Return all of the timezones that the BJR server understands.
  #
  def timezones
    api = ApiClient.new(current_user)
    render json: api.timezones.object, status: :ok
  end

  def recent_jobs
    api = ApiClient.new(current_user)
    recent_jobs = api.recent_jobs(5)

    render json: { total: 5, data: jobs_to_uijobs(recent_jobs) }, status: :ok
  end

  def upcoming_jobs
    api = ApiClient.new(current_user)
    upcoming_jobs = api.upcoming_jobs(5)

    render json: { total: 5, data: jobs_to_uijobs(upcoming_jobs) }, status: :ok
  end

  def todays_stats
    api = ApiClient.new(current_user)
    stats = api.todays_stats.object

    render json: stats, status: :ok
  end

  def job_stats
    api = ApiClient.new(current_user)
    minute = api.stats_by_minute.object
    hour = api.stats_by_hour.object
    day = api.stats_by_day.object
    week = api.stats_by_week.object

    data = {}

    [{text: 'Minute', span: minute, label: 'minute'}, {text: 'Hour', span: hour, label: 'hour'},
     {text: 'Day', span: day, label: 'day'}, {text: 'Week', span: week, label: 'week'}].each do |period|
      data[period[:label]] = { labels: stats_labels(period[:span]),
        runtimes: { options: chart_options(I18n.t('home.runtime_charts.title', period: period[:text]),
                    I18n.t('home.runtime_charts.xlabel'), I18n.t('home.runtime_charts.ylabel')), datasets: runtime_datasets(period[:span]) },
        runs: { options: chart_options(I18n.t('home.runs_charts.title', period: period[:text]),
                    I18n.t('home.runs_charts.xlabel'), I18n.t('home.runs_charts.ylabel')), datasets: run_datasets(period[:span]) }
      }
    end

    render json: data, status: :ok
  end
end
