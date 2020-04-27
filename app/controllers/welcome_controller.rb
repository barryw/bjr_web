class WelcomeController < ApplicationController
  layout "sign_in"
  protect_from_forgery with: :null_session
  skip_before_action :ensure_session

  def new
    api = ApiClient.new
    @version = api.server_version.object
    redirect_to dashboard_url if current_user
  end

  def create
    api = ApiClient.new
    auth = api.authenticate(params[:username], params[:password])
    if auth.is_error
      redirect_to root_url, notice: I18n.t('welcome.errors.invalid_login', error: auth.message)
    else
      session[:token] = auth.auth_token
      redirect_to dashboard_url
    end
  end

  def destroy
    reset_session
    redirect_to root_url, notice: I18n.t('welcome.new.signed_out')
  end
end
