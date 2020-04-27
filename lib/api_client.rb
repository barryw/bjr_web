class ApiClient

  def initialize
    config = BJR::Configuration.new
    config.scheme = $api_host.sub(/:\/\/.*/, '').split('/').first
    config.host = $api_host.sub(/https?:\/\//, '').split('/').first
    @client = BJR::ApiClient.new(config)
  end

  def authenticate(username, password)
    auth = BJR::AuthIn.new(username: username, password: password)
    opts = { auth_in: auth }
    api = BJR::AuthenticationApi.new(@client)
    api.authenticate_user(opts)
  end

  def server_version
    api = BJR::StaticApi.new(@client)
    api.get_version
  end

  def jobs(token, page)
    @client.config.access_token = token
    api = BJR::JobsApi.new(@client)
    opts = {}
    opts[:page] = page unless page.nil?
    api.get_jobs_with_http_info(opts)
  end
end
