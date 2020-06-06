class SessionController < ApplicationController
  include ApplicationHelper

  layout "sign_in"

  skip_before_action :verify_authenticity_token
  skip_before_action :ensure_session

  def new
    dashboard if current_user

    @login_disabled = false
    api = ApiClient.new
    @web_version = web_version
    @server_version = server_version
  rescue
    logger.error "Error connecting to BJR Server: #{$!}"
    logger.error "$BJR_API_HOST environment variable is set to '#{ENV.fetch('BJR_API_HOST', nil)}'. Make sure that this is set correctly."
    flash.alert = I18n.t('session.errors.no_server')
    @server_version = I18n.t('session.errors.server_version_unknown')
    @login_disabled = true
  end

  def create
    api = ApiClient.new
    auth = api.authenticate(params[:username], params[:password])
    session[:token] = auth.auth_token
    dashboard
  rescue BJR::ApiError => ae
    message = JSON.parse(ae.response_body)
    login(I18n.t('session.errors.invalid_login', error: message['message']))
  end

  def destroy
    reset_session
    login(I18n.t('session.new.signed_out'))
  end

  private

  def login(notice)
    redirect_to root_url, notice: notice
  end

  def dashboard
    redirect_to dashboard_url
  end
end
