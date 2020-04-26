class ApiClient
  class << self
    def authenticate(username, password)
      result = HTTParty.post("#{$api_host}/authenticate", body: {username: username, password: password}.to_json,
                              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' })
      JSON.parse(result.body)
    rescue
      {"is_error" => true, "message" => I18n.t('welcome.errors.server_connection_failed', error: $!) }
    end

    def server_version
      result = HTTParty.get("#{$api_host}/version", headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' })
      version = "v#{JSON.parse(result.body)['object']}"
    rescue
      "(#{I18n.t('welcome.errors.server_version_unknown')})"
    end
  end
end
