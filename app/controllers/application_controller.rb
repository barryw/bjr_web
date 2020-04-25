class ApplicationController < ActionController::Base
  helper_method :current_user
  helper_method :token_expired

  before_action :ensure_session

  def current_user
    if session[:token]
      @current_user = session[:token]
    else
      @current_user = nil
    end
  end

  def token_expired
    jwt = JsonWebToken.decode(current_user)

    logger.debug "JWT = #{jwt}"
    jwt.nil? or jwt[:exp].to_i < Time.now.to_i
  rescue
    true
  end

  def ensure_session
    redirect_to root_url if current_user.nil?
  end

  def server_version
    result = HTTParty.get("#{$api_host}/version", headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' })
    version = "v#{JSON.parse(result.body)['object']}"
  rescue
    '(Unknown)'
  end
end
