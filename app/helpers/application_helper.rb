include Pagy::Frontend

module ApplicationHelper
  include ActionView::Helpers::DateHelper

  #
  # Return a datetime in the user's timezone
  #
  def user_tz(datetime)
    return '' if datetime.blank?

    if datetime > DateTime.now
      return "in #{distance_of_time_in_words(DateTime.now, datetime)}"
    else
      return "#{distance_of_time_in_words(DateTime.now, datetime)} ago"
    end
  end

  #
  # Return the BJR server version
  #
  def server_version
    api = ApiClient.new
    api.server_version.object
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
