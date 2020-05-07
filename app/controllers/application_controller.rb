class ApplicationController < ActionController::Base
  include ErrorHandler
  include Pagy::Backend

  helper_method :current_user
  before_action :ensure_session

  def current_user
    if session[:token]
      @current_user = session[:token]
    else
      @current_user = nil
    end
  end

  def ensure_session
    redirect_to root_url, notice: I18n.t('common.session_timeout') if current_user.nil?
  end
end
