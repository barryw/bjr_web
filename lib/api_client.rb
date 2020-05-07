class ApiClient

  def initialize
    config = BJR::Configuration.new
    config.scheme = $api_host.sub(/:\/\/.*/, '').split('/').first
    config.host = $api_host.sub(/https?:\/\//, '').split('/').first
    @client = BJR::ApiClient.new(config)
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
    api = BJR::StaticApi.new(@client)
    api.get_version
  end

  #
  # Get jobs matching some criteria
  #
  def jobs(token, page)
    api = job_api(token)
    opts = {}
    opts[:page] = page unless page.nil?
    api.get_jobs_with_http_info(opts)
  end

  #
  # Get a list of the most recently run jobs
  #
  def recent_jobs(token, count)
    api = job_server_api(token)
    opts = count.nil? ? {} : { count: count }
    api.recent_jobs(opts)
  end

  #
  # Get a list of the upcoming jobs
  #
  def upcoming_jobs(token, count)
    api = job_server_api(token)
    opts = count.nil? ? {} : { count: count }
    api.upcoming_jobs(opts)
  end

  #
  # Get job statistics by week for the last month
  #
  def stats_by_week(token)
    api = job_server_api(token)
    opts = { start_date: DateTime.now - 4.weeks, end_date: DateTime.now }
    api.stats_by_week(opts)
  end

  #
  # Get job statistics by day for the last week
  #
  def stats_by_day(token)
    api = job_server_api(token)
    opts = { start_date: DateTime.now - 7.days, end_date: DateTime.now }
    api.stats_by_day(opts)
  end

  #
  # Get job statistics by hour for the last day
  #
  def stats_by_hour(token)
    api = job_server_api(token)
    opts = { start_date: DateTime.now - 10.hours, end_date: DateTime.now }
    api.stats_by_hour(opts)
  end

  #
  # Get job statistics by minute for the last hour
  #
  def stats_by_minute(token)
    api = job_server_api(token)
    opts = { start_date: DateTime.now - 10.minutes, end_date: DateTime.now }
    api.stats_by_minute(opts)
  end

  private

  def set_token(token)
    @client.config.access_token = token
  end

  def job_api(token)
    set_token(token)
    BJR::JobsApi.new(@client)
  end

  def job_server_api(token)
    set_token(token)
    BJR::JobServerApi.new(@client)
  end
end
