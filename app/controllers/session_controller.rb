class SessionController < ApplicationController
  layout "sign_in"

  skip_before_action :verify_authenticity_token
  skip_before_action :ensure_session

  def new
    dashboard if current_user
  end

  def create
    api = ApiClient.new
    auth = api.authenticate(params[:username], params[:password])

    login(I18n.t('welcome.errors.invalid_login', error: auth.message)) and return if auth.is_error

    session[:token] = auth.auth_token
    dashboard
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
