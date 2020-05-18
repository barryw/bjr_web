class ApiClient

  def initialize(token=nil)
    config = BJR::Configuration.new
    config.scheme = $api_host.sub(/:\/\/.*/, '').split('/').first
    config.host = $api_host.sub(/https?:\/\//, '').split('/').first
    @client = BJR::ApiClient.new(config)
    set_token(token) unless token.nil?
  end

  #
  # Authenticate against the BJR server
  #
  def authenticate(username, password)
    auth = BJR::AuthIn.new(username: username, password: password)
    opts = { auth_in: auth }
    api = BJR::AuthenticationApi.new(@client)
    api.authenticate_user(opts)
  end

  #
  # Get the BJR server's version
  #
  def server_version
    static_api.get_version
  end

  #
  # Get the timezones that the BJR server recognizes
  #
  def timezones
    static_api.get_timezones
  end

  #
  # Get all tags associated with this user
  #
  def tags
    tags = static_api.get_tags({ per_page: 10000 })
    tags.object.collect {|t| t.name}
  end

  #
  # Create a new job
  #
  def create_job(job)
    api = job_api
    api.create_job({ job_in: job.to_json })
  end

  #
  # Retrieve a single job
  #
  def job(id)
    api = job_api
    api.get_job_with_http_info(id)
  end

  #
  # Get jobs matching some criteria
  #
  def jobs(page, per_page=25, search)
    api = job_api
    opts = {}
    opts[:page] = page unless page.nil?
    opts[:per_page] = per_page
    opts[:name] = search[:name] unless search[:name].nil?
    opts[:tags] = search[:tags] unless search[:tags].nil?
    opts[:running] = search[:running] unless search[:running].nil?
    opts[:enabled] = search[:enabled] unless search[:enabled].nil?
    opts[:succeeded] = search[:succeeded] unless search[:succeeded].nil?
    opts[:search_timezone] = search[:timezone] unless search[:timezone].nil?
    opts[:command] = search[:command] unless search[:command].nil?
    opts[:start_date] = search[:start_date] unless search[:start_date].nil?
    opts[:end_date] = search[:end_date] unless search[:end_date].nil?

    api.get_jobs_with_http_info(opts)
  end

  #
  # Update an existing job
  #
  def update_job(id, job)
    api = job_api
    api.update_job_with_http_info(id, { job_in: job })
  end

  #
  # Delete a job. May fail if the job is running.
  #
  def delete_job(id)
    api = job_api
    api.delete_job_with_http_info(id)
  end

  #
  # Trigger a job to run now
  #
  def run_job(id)
    api = job_api
    api.run_job_now_with_http_info(id)
  end

  #
  # Get a list of the most recently run jobs
  #
  def recent_jobs(count)
    api = job_server_api
    opts = count.nil? ? {} : { count: count }
    api.recent_jobs(opts)
  end

  #
  # Get a list of the upcoming jobs
  #
  def upcoming_jobs(count)
    api = job_server_api
    opts = count.nil? ? {} : { count: count }
    api.upcoming_jobs(opts)
  end

  #
  # Get job statistics by week for the last month
  #
  def stats_by_week
    api = job_server_api
    opts = { start_date: DateTime.now - 4.weeks, end_date: DateTime.now, timezone: tz }
    api.stats_by_week(opts)
  end

  #
  # Get job statistics by day for the last week
  #
  def stats_by_day
    api = job_server_api
    opts = { start_date: DateTime.now - 7.days, end_date: DateTime.now, timezone: tz }
    api.stats_by_day(opts)
  end

  #
  # Get job statistics by hour for the last day
  #
  def stats_by_hour
    api = job_server_api
    opts = { start_date: DateTime.now - 10.hours, end_date: DateTime.now, timezone: tz }
    api.stats_by_hour(opts)
  end

  #
  # Get job statistics by minute for the last hour
  #
  def stats_by_minute
    api = job_server_api
    opts = { start_date: DateTime.now - 10.minutes, end_date: DateTime.now, timezone: tz }
    api.stats_by_minute(opts)
  end

  #
  # Get minutely stats for today
  #
  def todays_stats
    api = job_server_api
    opts = { timezone: tz }
    api.todays_stats(opts)
  end

  private

  def tz
    Time.zone.name
  end

  def set_token(token)
    @client.config.access_token = token
  end

  def job_api
    BJR::JobsApi.new(@client)
  end

  def job_server_api
    BJR::JobServerApi.new(@client)
  end

  def static_api
    BJR::StaticApi.new(@client)
  end
end
