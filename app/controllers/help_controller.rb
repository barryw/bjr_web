class HelpController < ApplicationController
  include ApplicationHelper

  before_action :help_enabled, only: [:show]
  before_action :status_text, only: [:show]

  #
  # Enable or disable context-sensitive help
  #
  def update
    session[:enable_help] = bool_val(params[:enabled])
    render json: {}
  end

  #
  # Get the current state of context sensitive help
  #
  def show
    render json: { enabled: @enabled, text: @text }
  end

  private

  def status_text
    @text = I18n.t('common.help_enabled') if @enabled
    @text = I18n.t('common.help_disabled') unless @enabled
  end

  def help_enabled
    @enabled = bool_val(session[:enable_help])
  end
end
