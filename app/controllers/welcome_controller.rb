class WelcomeController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_action :ensure_session

  def new
    @version = server_version
    redirect_to dashboard_url if current_user
  end

  def create
    auth = authenticate(params[:username], params[:password])
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

  private

  def authenticate(username, password)
    result = HTTParty.post("#{$api_host}/authenticate", body: {username: username, password: password}.to_json,
                           headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' })
    JSON.parse(result.body)
  rescue
    {"is_error" => true, "message" => "Failed to communicate with BJR server: #{$!}"}
  end
end
