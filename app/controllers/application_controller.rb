include Pagy::Backend

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

  def log_out
    reset_session
    redirect_to root_url, notice: I18n.t('welcome.new.signed_out')
  end
end
