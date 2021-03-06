module ApplicationHelper
  include ActionView::Helpers::DateHelper

  #
  # Return the BJR server version
  #
  def server_version
    api = ApiClient.new
    api.server_version.object
  rescue
    flash.alert = I18n.t('common.errors.misconfigured')
    "(#{I18n.t('common.errors.unknown_version')})"
  end

  #
  # Get the version of BJR web
  #
  def web_version
    $version
  end

  #
  # Return an icon from ionicons for boolean value
  #
  def bool_icon(val)
    val ? '<span class="card-widget__icon2"><i class="icon-check text-success"></i></span>'.html_safe : '<span class="card-widget__icon2"><i class="icon-close text-danger"></i></span>'.html_safe
  end

  #
  # Try to coerce a value to a bool
  #
  def bool_val(val)
    [true, 'true', '1', 1, 'on'].include? val
  end

  #
  # Render a Bootstrap spinner
  #
  def spinner
    '<div class="spinner-border spinner-border-sm"></div>'.html_safe
  end

  #
  # Display a friendly help icon with a tool tip
  #
  def help_icon(tooltip_text)
    if session[:enable_help]
      "&nbsp;<i class=\"ion-help-circled\" title=\"#{tooltip_text}\" data-placement=\"auto\" data-toggle=\"tooltip\"></i>".html_safe
    else
      ''
    end
  end
end
