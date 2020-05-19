class HelpController < ApplicationController
  include ApplicationHelper

  before_action :help_enabled, only: [:show]
  before_action :status_text, only: [:show]

  #
  # Enable or disable context-sensitive help
  #
  def update
    logger.debug "VAL = #{bool_val(params[:enabled])}"
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
    @text = 'Context-sensitive help is enabled. Click to disable.' if @enabled
    @text = 'Context-sensitive help is disabled. Click to enable.' unless @enabled
  end

  def help_enabled
    @enabled = bool_val(session[:enable_help])
  end

  def bool_val(val)
    [true, 'true', '1', 1, 'on'].include? val
  end
end
