class WelcomeController < ApplicationController
  layout "sign_in"
  protect_from_forgery with: :null_session
  skip_before_action :ensure_session

  def new
    @version = ApiClient.server_version
    redirect_to dashboard_url if current_user
  end

  def create
    auth = ApiClient.authenticate(params[:username], params[:password])
    if auth['is_error']
      redirect_to root_url, notice: "Invalid login: #{auth['message']}"
    else
      session[:token] = auth['auth_token']
      redirect_to dashboard_url
    end
  end

  def destroy
    reset_session
    redirect_to root_url, notice: "You have been signed out."
  end
end
